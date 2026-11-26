"""
Behavioural tests for the browser modules.

The Node harness executes the real Screen 5-8 JavaScript against a small DOM
double. It verifies click handlers, state transitions, generic sorting step
generation, dataset selection, terminal submissions and badge reachability.
"""

import json
import os
import shutil
import subprocess
import unittest

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class TestJavascriptBehaviour(unittest.TestCase):

    @unittest.skipUnless(shutil.which("node"), "Node.js is required for the JS behaviour harness")
    def test_browser_module_interactions(self):
        harness = os.path.join(BASE_DIR, "tests", "js", "behaviour_harness.cjs")
        completed = subprocess.run(
            [shutil.which("node"), harness],
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            timeout=90,
        )
        self.assertEqual(
            completed.returncode,
            0,
            f"Behaviour harness failed.\nSTDOUT:\n{completed.stdout}\nSTDERR:\n{completed.stderr}",
        )

        payload = json.loads(completed.stdout)
        self.assertEqual(payload["failed"], 0, json.dumps(payload["failures"], indent=2))
        self.assertGreaterEqual(payload["total"], 80)
        self.assertGreaterEqual(payload["passed"], 80)


if __name__ == "__main__":
    unittest.main()
