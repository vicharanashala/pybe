"""
Regression tests for the restricted execution guard and benchmark API.

These tests cover the previously verified bypass strings, the output cap,
honest benchmark schema/metrics, and JSON error handling for malformed input.
"""

import http.client
import json
import os
import socket
import socketserver
import sys
import threading
import time
import unittest
from unittest import mock
import urllib.error
import urllib.request

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)
import server  # noqa: E402


class TestExecutionGuardRegressions(unittest.TestCase):

    def test_structured_concatenation_bypasses_are_rejected(self):
        bypasses = [
            "__builtins__.__dict__['op'+'en']('guard_probe.txt', 'w')",
            "__builtins__.__dict__['__im'+'port__']('os')",
            "getattr(__builtins__, 'com'+'pile')('print(1)', '<probe>', 'exec')",
            "().__class__.__base__.__subclasses__()",
            "[x for x in ().__class__.__mro__]",
        ]
        for code in bypasses:
            with self.subTest(code=code):
                is_safe, reason = server.check_code_safety(code)
                self.assertFalse(is_safe, reason or "code should be rejected")
                result = server.execute_python_code(code)
                self.assertFalse(result["success"])
                self.assertIn("Safety Notice", result["stderr"])

    def test_output_cap_includes_truncation_notice(self):
        result = server.execute_python_code('print("x" * 5000)')
        self.assertTrue(result["success"])
        self.assertLessEqual(len(result["stdout"]), server.MAX_OUTPUT_LENGTH)
        self.assertIn("Output truncated", result["stdout"])

    def test_restricted_builtins_still_support_lesson_code(self):
        code = """
wards = ["Surgical", "ICU", "Triage"]
ordered = sorted(wards, key=len)
print(ordered)
print(len(ordered))
"""
        result = server.execute_python_code(code)
        self.assertTrue(result["success"], result["stderr"])
        self.assertIn("['ICU', 'Triage', 'Surgical']", result["stdout"])
        self.assertIn("3", result["stdout"])


class TestServerStartup(unittest.TestCase):
    """The stale-listener bug must not be reintroduced by a reuse flag."""

    def test_local_server_does_not_share_its_port(self):
        self.assertIs(server.InvestigationHTTPServer.allow_reuse_address, False)
        self.assertIs(server.InvestigationHTTPServer.allow_reuse_port, False)

    def test_port_probe_detects_an_existing_local_listener(self):
        listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        listener.bind(("127.0.0.1", 0))
        listener.listen(1)
        try:
            port = listener.getsockname()[1]
            self.assertTrue(server._port_has_listener(port))
        finally:
            listener.close()

    def test_occupied_port_fails_with_actionable_guidance(self):
        with mock.patch.object(server, "_port_has_listener", return_value=True):
            with self.assertRaises(SystemExit) as context:
                server.run_server(8123)
        message = str(context.exception)
        self.assertIn("Stop the existing python server.py process", message)
        self.assertIn("8123", message)

    def test_invalid_ports_fail_before_binding(self):
        for port in (-1, 0, 70000, True, 1.5):
            with self.subTest(port=port):
                with self.assertRaises(SystemExit) as context:
                    server.run_server(port)
                self.assertIn("integer between 1 and 65535", str(context.exception))


class TestBenchmarkModel(unittest.TestCase):

    REQUIRED_ALGORITHMS = {"bubble", "insertion", "merge", "timsort"}

    def test_all_dataset_types_return_honest_schema(self):
        for dataset_type in sorted(server.BENCHMARK_DATASET_TYPES):
            with self.subTest(dataset_type=dataset_type):
                payload = server.run_algorithm_benchmark(dataset_type, 20)
                self.assertEqual(payload["dataset_type"], dataset_type)
                self.assertEqual(payload["size"], 20)
                self.assertTrue(payload["python_version"])
                self.assertEqual(len(payload["sample_input"]), 8)
                self.assertEqual(set(payload["algorithms"]), self.REQUIRED_ALGORITHMS)

                definitions = payload["metric_definitions"]
                self.assertIn("comparison", definitions)
                self.assertIn("timing", definitions)
                self.assertTrue(definitions["timsort_moves"].startswith("Not exposed"))

                timsort = payload["algorithms"]["timsort"]
                self.assertIsNone(timsort["moves"])
                self.assertTrue(timsort["is_cpython_native"])
                self.assertIn("count_source", timsort)

                for algorithm in self.REQUIRED_ALGORITHMS:
                    metric = payload["algorithms"][algorithm]
                    self.assertGreaterEqual(metric["comparisons"], 0)
                    self.assertGreaterEqual(metric["time_ms"], 0)
                    self.assertTrue(metric["name"])
                    self.assertTrue(metric["big_o_time"])
                    self.assertTrue(metric["big_o_space"])

    def test_sorted_and_reversed_count_expectations(self):
        sorted_payload = server.run_algorithm_benchmark("sorted", 20)
        self.assertEqual(sorted_payload["algorithms"]["bubble"]["moves"], 0)

        reversed_payload = server.run_algorithm_benchmark("reversed", 20)
        self.assertEqual(
            reversed_payload["algorithms"]["bubble"]["moves"],
            20 * 19 // 2,
        )
        self.assertGreater(
            reversed_payload["algorithms"]["timsort"]["comparisons"],
            0,
        )

    def test_duplicate_and_small_datasets(self):
        duplicates = server.get_benchmark_dataset("duplicates", 20)
        self.assertEqual(len(duplicates), 20)
        self.assertLess(len(set(duplicates)), len(duplicates))

        payload = server.run_algorithm_benchmark("duplicates", 20)
        self.assertEqual(payload["size"], 20)
        self.assertTrue(payload["sample_input"])


class TestBenchmarkApi(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.httpd = socketserver.TCPServer(
            ("127.0.0.1", 0), server.InvestigationRequestHandler
        )
        cls.port = cls.httpd.server_address[1]
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        time.sleep(0.2)

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def request(self, method, path, body=None, extra_headers=None):
        headers = {"Origin": f"http://127.0.0.1:{self.port}"}
        if body is not None:
            headers["Content-Type"] = "application/json"
        if extra_headers:
            headers.update(extra_headers)
        request = urllib.request.Request(
            f"http://127.0.0.1:{self.port}{path}",
            data=body,
            method=method,
            headers=headers,
        )
        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                return response.status, response.read(), response.headers
        except urllib.error.HTTPError as error:
            return error.code, error.read(), error.headers

    def assertJsonError(self, status, raw, headers, expected_status):
        self.assertEqual(status, expected_status, raw.decode("utf-8", "replace"))
        self.assertIn("application/json", headers.get("Content-Type", ""))
        payload = json.loads(raw.decode("utf-8"))
        self.assertIn("error", payload)

    def test_valid_benchmark_response_schema(self):
        body = json.dumps({"dataset_type": "nearly_sorted", "size": 20}).encode("utf-8")
        status, raw, headers = self.request("POST", "/api/benchmark", body)
        self.assertEqual(status, 200, raw.decode("utf-8", "replace"))
        self.assertIn("application/json", headers.get("Content-Type", ""))
        payload = json.loads(raw.decode("utf-8"))
        self.assertEqual(payload["dataset_type"], "nearly_sorted")
        self.assertTrue(payload["python_version"])
        self.assertEqual(len(payload["sample_input"]), 8)
        self.assertIsNone(payload["algorithms"]["timsort"]["moves"])

    def test_benchmark_get_returns_json_405(self):
        status, raw, headers = self.request("GET", "/api/benchmark")
        self.assertJsonError(status, raw, headers, 405)

    def test_malformed_json_returns_json_400(self):
        status, raw, headers = self.request(
            "POST", "/api/benchmark", b"{not valid json"
        )
        self.assertJsonError(status, raw, headers, 400)

    def test_invalid_dataset_type_returns_json_400(self):
        body = json.dumps({"dataset_type": "unknown", "size": 20}).encode("utf-8")
        status, raw, headers = self.request("POST", "/api/benchmark", body)
        self.assertJsonError(status, raw, headers, 400)

    def test_invalid_size_returns_json_400(self):
        for size in ("twenty", -1, 9999, True, 20.0, 20.5, "20", 1e2):
            with self.subTest(size=size):
                body = json.dumps({"dataset_type": "random", "size": size}).encode("utf-8")
                status, raw, headers = self.request("POST", "/api/benchmark", body)
                self.assertJsonError(status, raw, headers, 400)

    def test_oversized_body_returns_json_413(self):
        body = json.dumps({
            "dataset_type": "random",
            "size": 20,
            "padding": "x" * (server.BENCHMARK_MAX_BODY + 100),
        }).encode("utf-8")
        status, raw, headers = self.request("POST", "/api/benchmark", body)
        self.assertJsonError(status, raw, headers, 413)

    def test_invalid_content_length_returns_json_400(self):
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        try:
            connection.putrequest("POST", "/api/benchmark")
            connection.putheader("Origin", f"http://127.0.0.1:{self.port}")
            connection.putheader("Content-Type", "application/json")
            connection.putheader("Content-Length", "not-a-number")
            connection.endheaders(b"{}")
            response = connection.getresponse()
            status = response.status
            raw = response.read()
            content_type = response.getheader("Content-Type", "")
        finally:
            connection.close()

        self.assertEqual(status, 400, raw.decode("utf-8", "replace"))
        self.assertIn("application/json", content_type)
        self.assertIn("error", json.loads(raw.decode("utf-8")))

    def test_execute_endpoint_rejects_known_bypass(self):
        body = json.dumps({
            "code": "__builtins__.__dict__['op'+'en']('guard_probe.txt', 'w')"
        }).encode("utf-8")
        status, raw, headers = self.request("POST", "/api/execute", body)
        self.assertEqual(status, 200)
        payload = json.loads(raw.decode("utf-8"))
        self.assertFalse(payload["success"])
        self.assertIn("Safety Notice", payload["stderr"])


if __name__ == "__main__":
    unittest.main()
