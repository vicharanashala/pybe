"""
Unit tests for server.py execution engine and security boundaries.
"""

import sys
import os
import unittest

# Ensure server module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from server import execute_python_code, check_code_safety


class TestServerExecution(unittest.TestCase):

    def test_basic_sorting_ascending(self):
        code = "nums = [42, 19, 85, 3]\nprint(sorted(nums))"
        result = execute_python_code(code)
        self.assertTrue(result["success"])
        self.assertEqual(result["stdout"].strip(), "[3, 19, 42, 85]")
        self.assertEqual(result["returncode"], 0)

    def test_sorting_descending_reverse_true(self):
        code = "nums = [42, 19, 85, 3]\nprint(sorted(nums, reverse=True))"
        result = execute_python_code(code)
        self.assertTrue(result["success"])
        self.assertEqual(result["stdout"].strip(), "[85, 42, 19, 3]")

    def test_original_list_not_modified(self):
        code = """
nums = [50, 10, 30]
ordered = sorted(nums)
print('Original:', nums)
print('Sorted:', ordered)
"""
        result = execute_python_code(code)
        self.assertTrue(result["success"])
        lines = result["stdout"].strip().split("\n")
        self.assertEqual(lines[0], "Original: [50, 10, 30]")
        self.assertEqual(lines[1], "Sorted: [10, 30, 50]")

    def test_key_function_example_preserves_arrival_order(self):
        code = """
wards = [
    {'name': 'A', 'patients': 20},
    {'name': 'B', 'patients': 10},
    {'name': 'C', 'patients': 10},
]
priority = sorted(wards, key=lambda ward: ward['patients'])
print([ward['name'] for ward in priority])
print([ward['patients'] for ward in priority])
"""
        result = execute_python_code(code)
        self.assertTrue(result["success"], result["stderr"])
        lines = result["stdout"].strip().split("\n")
        self.assertEqual(lines[0], "['B', 'C', 'A']")
        self.assertEqual(lines[1], "[10, 10, 20]")

    def test_sorted_key_and_reverse_example(self):
        code = """
wards = [
    {'name': 'A', 'patients': 15},
    {'name': 'B', 'patients': 112},
    {'name': 'C', 'patients': 38},
]
priority = sorted(wards, key=lambda ward: ward['patients'], reverse=True)
print([ward['name'] for ward in priority])
"""
        result = execute_python_code(code)
        self.assertTrue(result["success"], result["stderr"])
        self.assertEqual(result["stdout"].strip(), "['B', 'C', 'A']")

    def test_syntax_error_reported(self):
        code = "sorted([3, 1, 2"  # Missing closing parenthesis
        result = execute_python_code(code)
        self.assertFalse(result["success"])
        self.assertIn("SyntaxError", result["stderr"])

    def test_timeout_protection(self):
        code = "while True: pass"
        result = execute_python_code(code)
        self.assertFalse(result["success"])
        self.assertIn("Timeout Error", result["stderr"])

    def test_dangerous_imports_blocked(self):
        disallowed_codes = [
            "import os; print(os.listdir())",
            "import sys; sys.exit(1)",
            "import subprocess; subprocess.run(['echo', 'hello'])",
            "from socket import socket",
            "open('test.txt', 'w')",
            "exec('print(123)')",
            "eval('2+2')",
        ]
        for c in disallowed_codes:
            is_safe, msg = check_code_safety(c)
            self.assertFalse(is_safe, f"Code '{c}' should have been flagged unsafe!")
            result = execute_python_code(c)
            self.assertFalse(result["success"])
            self.assertIn("Safety Notice", result["stderr"])

    def test_code_length_limit(self):
        huge_code = "x = 1\n" * 5000
        result = execute_python_code(huge_code)
        self.assertFalse(result["success"])
        self.assertIn("exceeds maximum allowed length", result["stderr"])


if __name__ == "__main__":
    unittest.main()
