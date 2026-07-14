const { execFile } = require("node:child_process");
const { promises: fs } = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
const EXEC_TIMEOUT_MS = Number(process.env.EXEC_TIMEOUT_MS || 5000);
const RESULT_START = "###LEETPY_RESULT_START###";
const RESULT_END = "###LEETPY_RESULT_END###";

/**
 * Builds the full python source that gets executed:
 *   1. the user's submitted code (defines the target function / classes)
 *   2. a harness that calls the function for every test case and prints
 *      a JSON-encoded result block between two sentinel markers so we can
 *      reliably parse it out of stdout even if the user's code also prints.
 */
function buildHarness(userCode, functionName, tests) {
  const testsForPython = tests.map((t, i) => ({
    idx: i,
    mode: t.mode,
    args: t.mode === "args" ? t.args : undefined,
    call: t.mode === "custom" ? t.call : undefined,
  }));

  const harness = `
import json as _leetpy_json
import sys as _leetpy_sys
import traceback as _leetpy_tb

_LEETPY_TESTS = _leetpy_json.loads(${JSON.stringify(JSON.stringify(testsForPython))})
_LEETPY_RESULTS = []

for _t in _LEETPY_TESTS:
    _entry = {"idx": _t["idx"]}
    try:
        if _t["mode"] == "custom":
            _actual = eval(_t["call"])
        else:
            _fn = globals().get(${JSON.stringify(functionName)})
            if _fn is None:
                raise NameError(${JSON.stringify(`Function '${functionName}' is not defined. Did you rename it?`)})
            _actual = _fn(*_t["args"])
        _entry["ok"] = True
        try:
            _leetpy_json.dumps(_actual)
            _entry["actual"] = _actual
        except TypeError:
            _entry["actual"] = repr(_actual)
    except Exception as _e:
        _entry["ok"] = False
        _entry["error"] = f"{type(_e).__name__}: {_e}"
    _LEETPY_RESULTS.append(_entry)

print("${RESULT_START}")
print(_leetpy_json.dumps(_LEETPY_RESULTS))
print("${RESULT_END}")
`;

  return `${userCode}\n\n# ==== LeetPy test harness (auto-generated, do not edit) ====\n${harness}`;
}

/**
 * Runs `userCode` against `tests` for the given `functionName`.
 * Returns { compileError, results: [{idx, ok, actual|error}], raw }
 */
async function runPython({ userCode, functionName, tests }) {
  const script = buildHarness(userCode, functionName, tests);
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "leetpy-"));
  const filePath = path.join(tmpDir, `sub_${randomUUID()}.py`);
  await fs.writeFile(filePath, script, "utf8");

  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      execFile(
        PYTHON_BIN,
        ["-I", filePath], // -I: isolated mode, ignores PYTHONPATH/user site etc.
        { timeout: EXEC_TIMEOUT_MS, maxBuffer: 2 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error && error.killed) {
            reject(new Error("TIMEOUT"));
            return;
          }
          // Non-zero exit (e.g. SyntaxError/uncaught exception) still gives us stdout/stderr
          resolve({ stdout: stdout || "", stderr: stderr || "" });
        }
      );
    });

    const startIdx = stdout.indexOf(RESULT_START);
    const endIdx = stdout.indexOf(RESULT_END);

    if (startIdx === -1 || endIdx === -1) {
      // Code likely raised before reaching the harness (e.g. SyntaxError, or
      // an exception at module level outside any function).
      return {
        compileError: (stderr || "Your code did not run successfully.").trim(),
        results: [],
      };
    }

    const jsonBlock = stdout.slice(startIdx + RESULT_START.length, endIdx).trim();
    const results = JSON.parse(jsonBlock);
    return { compileError: null, results };
  } catch (err) {
    if (err.message === "TIMEOUT") {
      return { compileError: `Time Limit Exceeded (>${EXEC_TIMEOUT_MS / 1000}s)`, results: [] };
    }
    return { compileError: String(err.message || err), results: [] };
  } finally {
    fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * High-level helper: runs code against a Problem document's tests and
 * attaches pass/fail + expected/actual for each, ready to send to the client.
 */
async function evaluateSubmission(problem, userCode) {
  const { compileError, results } = await runPython({
    userCode,
    functionName: problem.functionName,
    tests: problem.tests,
  });

  if (compileError) {
    return {
      compileError,
      allPassed: false,
      testResults: problem.tests.map((t, i) => ({
        idx: i,
        label: `Test Case ${i + 1}`,
        input: t.displayInput,
        expected: t.expected,
        actual: null,
        passed: false,
        error: null,
      })),
    };
  }

  const byIdx = new Map(results.map((r) => [r.idx, r]));
  const testResults = problem.tests.map((t, i) => {
    const r = byIdx.get(i);
    if (!r) {
      return {
        idx: i,
        label: `Test Case ${i + 1}`,
        input: t.displayInput,
        expected: t.expected,
        actual: null,
        passed: false,
        error: "No result returned",
      };
    }
    if (!r.ok) {
      return {
        idx: i,
        label: `Test Case ${i + 1}`,
        input: t.displayInput,
        expected: t.expected,
        actual: null,
        passed: false,
        error: r.error,
      };
    }
    const passed = deepEqual(r.actual, t.expected);
    return {
      idx: i,
      label: `Test Case ${i + 1}`,
      input: t.displayInput,
      expected: t.expected,
      actual: r.actual,
      passed,
      error: null,
    };
  });

  const allPassed = testResults.length > 0 && testResults.every((t) => t.passed);
  return { compileError: null, allPassed, testResults };
}

module.exports = { runPython, evaluateSubmission };
