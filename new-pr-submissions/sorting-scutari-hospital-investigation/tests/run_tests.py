"""
The Sorting Investigation - Master Test Runner
Executes all test suites and generates summary metrics.
"""

import unittest
import sys
import os

if __name__ == "__main__":
    loader = unittest.TestLoader()
    start_dir = os.path.dirname(__file__)
    suite = loader.discover(start_dir, pattern="test_*.py")

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    total = result.testsRun
    failed = len(result.failures)
    errored = len(result.errors)
    skipped = len(result.skipped)
    passed = total - (failed + errored + skipped)

    print("\n" + "=" * 50)
    print("  TEST EXECUTION SUMMARY")
    print("=" * 50)
    print(f"  Total Tests Run: {total}")
    print(f"  Passed:          {passed}")
    print(f"  Failed:          {failed}")
    print(f"  Errors:          {errored}")
    print(f"  Skipped:         {skipped}")
    print("=" * 50)

    if failed > 0 or errored > 0:
        sys.exit(1)
    sys.exit(0)
