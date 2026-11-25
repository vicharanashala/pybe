"""
The Sorting Investigation - Local Educational Server & Python Runner
=====================================================================
A lightweight, self-contained local server using Python's standard library.

Security posture (important):
- The Python runner is a best-effort educational execution guard, NOT a secure
  sandbox. It combines AST allowlisting, a restricted builtins dictionary in a
  child process, loopback-only binding, timeouts, output caps and (on Windows)
  an optional Job Object that limits process count/memory and kills the whole
  process group on timeout. These layers reduce accidental and casual misuse,
  but they cannot be represented as a hard security boundary.
- The server binds strictly to 127.0.0.1 and validates browser origins.
- No external third-party dependencies are required.
"""

import ast
import http.server
import json
import os
import re
import socket
import socketserver
import subprocess
import sys
import threading
import time
import urllib.parse

HOST = "127.0.0.1"
DEFAULT_PORT = 8000
MAX_CODE_LENGTH = 2048
MAX_OUTPUT_LENGTH = 4096
EXECUTION_TIMEOUT_SECONDS = 2.5
RUNNER_STARTUP_TIMEOUT_SECONDS = 10.0
RUNNER_READY_TOKEN = "__PYBE_RUNNER_READY__"
BENCHMARK_MAX_BODY = 4096
BENCHMARK_MIN_SIZE = 10
BENCHMARK_MAX_SIZE = 200
BENCHMARK_DATASET_TYPES = {
    "random",
    "sorted",
    "reversed",
    "nearly_sorted",
    "duplicates",
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------------------
# Restricted execution model
# ---------------------------------------------------------------------------

SAFE_BUILTIN_NAMES = (
    "abs", "all", "any", "bool", "dict", "enumerate", "filter", "float",
    "int", "len", "list", "map", "max", "min", "range", "reversed", "round",
    "set", "sorted", "str", "sum", "tuple", "zip", "chr", "ord", "pow",
    "divmod", "print",
)

BLOCKED_NAMES = {
    "open", "input", "eval", "exec", "compile", "globals", "locals", "vars",
    "dir", "getattr", "setattr", "delattr", "__import__", "type", "object",
    "super", "memoryview", "property", "classmethod", "staticmethod", "help",
    "exit", "quit", "breakpoint", "license", "credits", "copyright",
}

BLOCKED_CALL_NAMES = BLOCKED_NAMES | {
    "open", "getattr", "setattr", "eval", "exec", "compile", "__import__",
}

ALLOWED_ATTRIBUTES = {
    "append", "extend", "insert", "remove", "pop", "clear", "copy", "count",
    "index", "reverse", "sort", "keys", "values", "items", "get", "update",
    "lower", "upper", "strip", "split", "join", "replace", "title",
    "capitalize", "startswith", "endswith", "isdigit", "isalpha",
}

ALLOWED_AST_NODES = (
    ast.Module, ast.Expr, ast.Assign, ast.AugAssign, ast.Pass,
    ast.Name, ast.Load, ast.Store, ast.Constant,
    ast.List, ast.Tuple, ast.Set, ast.Dict,
    ast.BinOp, ast.UnaryOp, ast.BoolOp, ast.Compare,
    ast.operator, ast.unaryop, ast.boolop, ast.cmpop,
    ast.Call, ast.keyword, ast.Attribute, ast.Subscript, ast.Slice, ast.Starred,
    ast.If, ast.For, ast.While, ast.Break, ast.Continue,
    ast.Lambda, ast.arguments, ast.arg,
    ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp, ast.comprehension,
    ast.JoinedStr, ast.FormattedValue,
)

MAX_AST_NODES = 600

# The child runner never receives the full interpreter builtins. It reads the
# already-validated code as JSON and executes it with a small allowlist.
SAFE_RUNNER_SOURCE = r'''
import builtins
import json
import sys

MAX_INPUT = 8192
TRUNCATION_NOTICE = "\n... [Output truncated to 4KB limit]"
MAX_OUTPUT = 4096 - len(TRUNCATION_NOTICE)
_truncated = False
ALLOWED = (
    "abs", "all", "any", "bool", "dict", "enumerate", "filter", "float",
    "int", "len", "list", "map", "max", "min", "range", "reversed", "round",
    "set", "sorted", "str", "sum", "tuple", "zip", "chr", "ord", "pow",
    "divmod",
)
_used = 0

def _safe_print(*args, sep=" ", end="\n"):
    global _used, _truncated
    text = sep.join(str(arg) for arg in args) + end
    remaining = MAX_OUTPUT - _used
    if remaining <= 0:
        _truncated = True
        return
    if len(text) > remaining:
        _truncated = True
    sys.stdout.write(text[:remaining])
    _used += min(len(text), remaining)

safe_builtins = {name: getattr(builtins, name) for name in ALLOWED}
safe_builtins["print"] = _safe_print

# Signal that interpreter startup and imports are complete. The parent starts
# the 2.5 s execution clock only after this line, so slow cold starts cannot be
# mistaken for an infinite loop in the learner's program.
sys.stdout.write("__PYBE_RUNNER_READY__\n")
sys.stdout.flush()

payload_text = sys.stdin.read(MAX_INPUT + 1)
payload = json.loads(payload_text)
code = payload.get("code", "")
compiled = compile(code, "<sorting-lesson>", "exec")
try:
    exec(compiled, {"__builtins__": safe_builtins})
finally:
    if _truncated:
        sys.stdout.write(TRUNCATION_NOTICE)
'''


class CodeSafetyError(Exception):
    """Structured validation failure for educational code."""


class PayloadTooLarge(Exception):
    """Request body exceeded the endpoint-specific limit."""


class _EducationalCodeVisitor(ast.NodeVisitor):
    def __init__(self):
        self.node_count = 0

    def generic_visit(self, node):
        self.node_count += 1
        if self.node_count > MAX_AST_NODES:
            raise CodeSafetyError("Program is too large for the educational runner.")
        if not isinstance(node, ALLOWED_AST_NODES):
            raise CodeSafetyError(
                "Unsupported Python construct: {}. Stick to variables, lists, "
                "loops, conditionals, sorted() and print().".format(type(node).__name__)
            )
        super().generic_visit(node)

    def visit_Name(self, node):
        if node.id.startswith("__") or node.id in BLOCKED_NAMES:
            raise CodeSafetyError("The name '{}' is not available in this lesson.".format(node.id))
        self.generic_visit(node)

    def visit_Attribute(self, node):
        if node.attr.startswith("_") or node.attr not in ALLOWED_ATTRIBUTES:
            raise CodeSafetyError("The attribute '{}' is not available in this lesson.".format(node.attr))
        self.generic_visit(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id in BLOCKED_CALL_NAMES:
            raise CodeSafetyError("The call '{}' is not available in this lesson.".format(node.func.id))
        self.generic_visit(node)

    def visit_keyword(self, node):
        if node.arg and node.arg.startswith("_"):
            raise CodeSafetyError("Private keyword arguments are not available in this lesson.")
        self.generic_visit(node)


def check_code_safety(code: str) -> tuple[bool, str]:
    """
    Structured validation for the restricted educational runner.

    This is an allowlist, not a regex blacklist. It intentionally rejects
    imports, dunder/object-graph access, introspection helpers and dynamic
    execution calls. It is still not a secure sandbox by itself.
    """
    if not isinstance(code, str):
        return False, "Code must be a string."
    if len(code) > MAX_CODE_LENGTH:
        return False, f"Code exceeds maximum allowed length of {MAX_CODE_LENGTH} characters."

    try:
        tree = ast.parse(code)
    except SyntaxError as exc:
        return False, f"SyntaxError in submitted code: {exc.msg}"

    try:
        _EducationalCodeVisitor().visit(tree)
    except CodeSafetyError as exc:
        return False, str(exc)

    return True, ""


def _cap_output(text: str) -> str:
    """Return at most MAX_OUTPUT_LENGTH characters, including the notice."""
    if len(text) <= MAX_OUTPUT_LENGTH:
        return text
    suffix = "\n... [Output truncated to 4KB limit]"
    return text[: MAX_OUTPUT_LENGTH - len(suffix)] + suffix


# ---------------------------------------------------------------------------
# Optional Windows Job Object: best-effort process grouping and resource limits
# ---------------------------------------------------------------------------

class _NullJob:
    def create(self):
        return False

    def assign(self, pid):
        return False

    def terminate(self):
        return False

    def close(self):
        return None


_WINDOWS_JOB_CLASS = _NullJob

if os.name == "nt":
    try:
        import ctypes
        from ctypes import wintypes

        class _IO_COUNTERS(ctypes.Structure):
            _fields_ = [
                ("ReadOperationCount", ctypes.c_uint64),
                ("WriteOperationCount", ctypes.c_uint64),
                ("OtherOperationCount", ctypes.c_uint64),
                ("ReadTransferCount", ctypes.c_uint64),
                ("WriteTransferCount", ctypes.c_uint64),
                ("OtherTransferCount", ctypes.c_uint64),
            ]

        class _JOBOBJECT_BASIC_LIMIT_INFORMATION(ctypes.Structure):
            _fields_ = [
                ("PerProcessUserTimeLimit", ctypes.c_int64),
                ("PerJobUserTimeLimit", ctypes.c_int64),
                ("LimitFlags", wintypes.DWORD),
                ("MinimumWorkingSetSize", ctypes.c_size_t),
                ("MaximumWorkingSetSize", ctypes.c_size_t),
                ("ActiveProcessLimit", wintypes.DWORD),
                ("Affinity", ctypes.POINTER(ctypes.c_ulong)),
                ("PriorityClass", wintypes.DWORD),
                ("SchedulingClass", wintypes.DWORD),
            ]

        class _JOBOBJECT_EXTENDED_LIMIT_INFORMATION(ctypes.Structure):
            _fields_ = [
                ("BasicLimitInformation", _JOBOBJECT_BASIC_LIMIT_INFORMATION),
                ("IoInfo", _IO_COUNTERS),
                ("ProcessMemoryLimit", ctypes.c_size_t),
                ("JobMemoryLimit", ctypes.c_size_t),
                ("PeakProcessMemoryUsed", ctypes.c_size_t),
                ("PeakJobMemoryUsed", ctypes.c_size_t),
            ]

        class _WindowsJobObject:
            JOB_OBJECT_LIMIT_ACTIVE_PROCESS = 0x00000008
            JOB_OBJECT_LIMIT_PROCESS_MEMORY = 0x00000100
            JOB_OBJECT_LIMIT_JOB_MEMORY = 0x00000200
            JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE = 0x00002000
            JOB_OBJECT_EXTENDED_LIMIT_INFORMATION = 9
            PROCESS_TERMINATE = 0x0001
            PROCESS_SET_QUOTA = 0x0100

            def __init__(self):
                self.kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
                self.handle = None
                self._configure_prototypes()

            def _configure_prototypes(self):
                self.kernel32.CreateJobObjectW.argtypes = [wintypes.LPCWSTR, ctypes.c_void_p]
                self.kernel32.CreateJobObjectW.restype = ctypes.c_void_p
                self.kernel32.SetInformationJobObject.argtypes = [
                    ctypes.c_void_p, ctypes.c_int, ctypes.c_void_p, wintypes.DWORD
                ]
                self.kernel32.SetInformationJobObject.restype = wintypes.BOOL
                self.kernel32.AssignProcessToJobObject.argtypes = [ctypes.c_void_p, ctypes.c_void_p]
                self.kernel32.AssignProcessToJobObject.restype = wintypes.BOOL
                self.kernel32.OpenProcess.argtypes = [
                    wintypes.DWORD, wintypes.BOOL, wintypes.DWORD
                ]
                self.kernel32.OpenProcess.restype = ctypes.c_void_p
                self.kernel32.TerminateJobObject.argtypes = [ctypes.c_void_p, wintypes.UINT]
                self.kernel32.TerminateJobObject.restype = wintypes.BOOL
                self.kernel32.CloseHandle.argtypes = [ctypes.c_void_p]
                self.kernel32.CloseHandle.restype = wintypes.BOOL

            def create(self):
                self.handle = self.kernel32.CreateJobObjectW(None, None)
                if not self.handle:
                    return False

                info = _JOBOBJECT_EXTENDED_LIMIT_INFORMATION()
                info.BasicLimitInformation.LimitFlags = (
                    self.JOB_OBJECT_LIMIT_ACTIVE_PROCESS
                    | self.JOB_OBJECT_LIMIT_PROCESS_MEMORY
                    | self.JOB_OBJECT_LIMIT_JOB_MEMORY
                    | self.JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
                )
                info.BasicLimitInformation.ActiveProcessLimit = 4
                info.ProcessMemoryLimit = 256 * 1024 * 1024
                info.JobMemoryLimit = 512 * 1024 * 1024

                ok = self.kernel32.SetInformationJobObject(
                    self.handle,
                    self.JOB_OBJECT_EXTENDED_LIMIT_INFORMATION,
                    ctypes.byref(info),
                    ctypes.sizeof(info),
                )
                if not ok:
                    self.close()
                    return False
                return True

            def assign(self, pid):
                process = self.kernel32.OpenProcess(
                    self.PROCESS_TERMINATE | self.PROCESS_SET_QUOTA, False, pid
                )
                if not process:
                    return False
                try:
                    return bool(self.kernel32.AssignProcessToJobObject(self.handle, process))
                finally:
                    self.kernel32.CloseHandle(process)

            def terminate(self):
                if self.handle:
                    return bool(self.kernel32.TerminateJobObject(self.handle, 1))
                return False

            def close(self):
                if self.handle:
                    self.kernel32.CloseHandle(self.handle)
                    self.handle = None

        _WINDOWS_JOB_CLASS = _WindowsJobObject
    except Exception:
        # If Job Objects are unavailable, execution still has timeout/output
        # limits and restricted builtins, but no OS-level process containment.
        _WINDOWS_JOB_CLASS = _NullJob


def _terminate_runner(process, job, reader_thread=None):
    """Stop a child runner without racing a readiness reader on the same pipe."""
    if job is not None:
        job.terminate()
    if process is not None:
        process.kill()
        if reader_thread is not None and reader_thread.is_alive():
            try:
                process.wait(timeout=1)
            except Exception:
                pass
        else:
            try:
                process.communicate(timeout=1)
            except Exception:
                pass


def _wait_for_runner_ready(process, timeout_seconds):
    """Wait for the child interpreter to finish startup before timing the code."""
    result = {}

    def read_line():
        try:
            result["line"] = process.stdout.readline()
        except Exception as exc:
            result["error"] = exc

    thread = threading.Thread(target=read_line, daemon=True)
    thread.start()
    thread.join(timeout_seconds)
    if thread.is_alive():
        return False, (
            f"Runner did not start within {timeout_seconds} seconds."
        ), thread
    if "error" in result:
        return False, f"Runner startup read failed: {result['error']}", thread
    if result.get("line") != RUNNER_READY_TOKEN + "\n":
        return False, "Runner failed to initialize before executing code.", thread
    return True, "", thread


def execute_python_code(code: str) -> dict:
    """Execute validated educational code in a restricted child process."""
    if not isinstance(code, str):
        return {
            "success": False,
            "stdout": "",
            "stderr": "Error: Code must be a string.",
            "returncode": -1,
            "execution_time_ms": 0,
        }

    if len(code) > MAX_CODE_LENGTH:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Error: Code exceeds maximum allowed length of {MAX_CODE_LENGTH} characters.",
            "returncode": -1,
            "execution_time_ms": 0,
        }

    is_safe, error_message = check_code_safety(code)
    if not is_safe:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Safety Notice: {error_message} This runner is a restricted educational guard, not a secure sandbox.",
            "returncode": -1,
            "execution_time_ms": 0,
        }

    start_time = time.perf_counter()
    execution_start = start_time
    process = None
    job = None
    ready_thread = None

    try:
        process = subprocess.Popen(
            [sys.executable, "-I", "-s", "-c", SAFE_RUNNER_SOURCE],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=BASE_DIR,
        )

        job = _WINDOWS_JOB_CLASS()
        if job.create():
            job.assign(process.pid)

        ready, ready_error, ready_thread = _wait_for_runner_ready(
            process, RUNNER_STARTUP_TIMEOUT_SECONDS
        )
        if not ready:
            startup_ms = round((time.perf_counter() - start_time) * 1000, 1)
            _terminate_runner(process, job, ready_thread)
            return {
                "success": False,
                "stdout": "",
                "stderr": f"Startup Error: {ready_error}",
                "returncode": -1,
                "execution_time_ms": startup_ms,
            }

        # Startup is complete; only the learner's program is subject to the
        # 2.5 s execution budget.
        execution_start = time.perf_counter()
        stdout, stderr = process.communicate(
            input=json.dumps({"code": code}),
            timeout=EXECUTION_TIMEOUT_SECONDS,
        )
        elapsed_ms = round((time.perf_counter() - execution_start) * 1000, 1)

        return {
            "success": process.returncode == 0,
            "stdout": _cap_output(stdout),
            "stderr": _cap_output(stderr),
            "returncode": process.returncode,
            "execution_time_ms": elapsed_ms,
        }
    except subprocess.TimeoutExpired:
        _terminate_runner(process, job, ready_thread)
        elapsed_ms = round((time.perf_counter() - execution_start) * 1000, 1)
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Timeout Error: Execution exceeded the {EXECUTION_TIMEOUT_SECONDS} second time limit. Check for infinite loops!",
            "returncode": -1,
            "execution_time_ms": elapsed_ms,
        }
    except Exception as exc:
        _terminate_runner(process, job, ready_thread)
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 1)
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Execution Error: {exc}",
            "returncode": -1,
            "execution_time_ms": elapsed_ms,
        }
    finally:
        if ready_thread is not None and ready_thread.is_alive():
            ready_thread.join(timeout=1)
        if job is not None:
            job.close()


# ---------------------------------------------------------------------------
# Honest educational benchmark
# ---------------------------------------------------------------------------

class CountingValue:
    """Value wrapper that counts rich comparison operator calls."""

    __slots__ = ("value", "counter")

    def __init__(self, value, counter):
        self.value = value
        self.counter = counter

    def _record(self):
        self.counter[0] += 1

    def __lt__(self, other):
        self._record()
        return self.value < other.value

    def __le__(self, other):
        self._record()
        return self.value <= other.value

    def __gt__(self, other):
        self._record()
        return self.value > other.value

    def __ge__(self, other):
        self._record()
        return self.value >= other.value

    def __eq__(self, other):
        self._record()
        return self.value == other.value

    def __repr__(self):
        return f"CountingValue({self.value})"


def get_benchmark_dataset(dataset_type: str = "random", size: int = 60) -> list:
    """Generate reproducible datasets for educational algorithm comparison."""
    if dataset_type not in BENCHMARK_DATASET_TYPES:
        raise ValueError(f"Unknown dataset_type: {dataset_type}")
    size = max(BENCHMARK_MIN_SIZE, min(int(size), BENCHMARK_MAX_SIZE))

    if dataset_type == "sorted":
        return list(range(10, 10 + size * 2, 2))
    if dataset_type == "reversed":
        return list(range(10 + size * 2, 10, -2))
    if dataset_type == "nearly_sorted":
        arr = list(range(10, 10 + size * 2, 2))
        for i in range(1, len(arr) - 2, 7):
            arr[i], arr[i + 1] = arr[i + 1], arr[i]
        return arr
    if dataset_type == "duplicates":
        base_values = [12, 25, 38, 50, 64, 82, 95]
        return [base_values[i % len(base_values)] for i in range(size)]
    # Deterministic pseudo-random pattern; reproducible across runs.
    return [(i * 37 + 19) % (size * 3) + 5 for i in range(size)]


def run_algorithm_benchmark(dataset_type: str = "random", size: int = 60) -> dict:
    """
    Run four educational algorithms and CPython's built-in sorted() on one dataset.

    Counts are measured with CountingValue comparator wrappers. Timsort movement
    counts are intentionally not reported because CPython does not expose them.
    Timings are local measurements of the implementations shown, not a fair
    C-versus-C race.
    """
    dataset = get_benchmark_dataset(dataset_type, size)
    expected = sorted(dataset)
    n = len(dataset)

    # Bubble: comparisons via >, movement metric = adjacent swaps.
    bubble_counter = [0]
    bubble = [CountingValue(v, bubble_counter) for v in dataset]
    bubble_swaps = 0
    t0 = time.perf_counter()
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if bubble[j] > bubble[j + 1]:
                bubble[j], bubble[j + 1] = bubble[j + 1], bubble[j]
                bubble_swaps += 1
                swapped = True
        if not swapped:
            break
    bubble_time = (time.perf_counter() - t0) * 1000

    # Insertion: comparisons via >, movement metric = shifts + final placements.
    insert_counter = [0]
    insertion = [CountingValue(v, insert_counter) for v in dataset]
    insert_shifts = 0
    insert_placements = 0
    t0 = time.perf_counter()
    for i in range(1, n):
        key = insertion[i]
        j = i - 1
        while j >= 0 and insertion[j] > key:
            insertion[j + 1] = insertion[j]
            insert_shifts += 1
            j -= 1
        insertion[j + 1] = key
        insert_placements += 1
    insert_time = (time.perf_counter() - t0) * 1000

    # Merge: comparisons via <=, movement metric = writes into merged buffers.
    merge_counter = [0]
    merge_writes = [0]

    def merge_sort(items):
        if len(items) <= 1:
            return items
        mid = len(items) // 2
        left = merge_sort(items[:mid])
        right = merge_sort(items[mid:])
        merged = []
        i = j = 0
        while i < len(left) and j < len(right):
            merge_counter[0] += 0  # comparison counted by <= below
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                j += 1
            merge_writes[0] += 1
        while i < len(left):
            merged.append(left[i])
            merge_writes[0] += 1
            i += 1
        while j < len(right):
            merged.append(right[j])
            merge_writes[0] += 1
            j += 1
        return merged

    t0 = time.perf_counter()
    merge_result = merge_sort([CountingValue(v, merge_counter) for v in dataset])
    merge_time = (time.perf_counter() - t0) * 1000

    # Timsort: real CPython sorted(), with comparisons counted by wrapper dunders.
    tim_counter = [0]
    t0 = time.perf_counter()
    tim_result = sorted([CountingValue(v, tim_counter) for v in dataset])
    tim_time = (time.perf_counter() - t0) * 1000

    results = {
        "bubble": [item.value for item in bubble],
        "insertion": [item.value for item in insertion],
        "merge": [item.value for item in merge_result],
        "timsort": [item.value for item in tim_result],
    }
    for name, result in results.items():
        if result != expected:
            raise RuntimeError(f"Benchmark correctness check failed for {name}")

    return {
        "dataset_type": dataset_type,
        "size": n,
        "python_version": sys.version.split()[0],
        "sample_input": dataset[:8],
        "metric_definitions": {
            "comparison": "One call to a rich comparison operator on an instrumented educational value.",
            "bubble_moves": "Adjacent swaps performed by the educational Bubble Sort implementation.",
            "insertion_moves": "Element shifts plus final placements in the educational Insertion Sort implementation.",
            "merge_moves": "Writes into auxiliary merge buffers in the educational Merge Sort implementation.",
            "timsort_moves": "Not exposed by CPython; no value is invented.",
            "timing": "Local wall-clock time of the listed implementation. Pure-Python loops and CPython's built-in sorted() are not a like-for-like race.",
        },
        "algorithms": {
            "bubble": {
                "name": "Bubble Sort",
                "comparisons": bubble_counter[0],
                "moves": bubble_swaps,
                "move_metric": "swaps",
                "time_ms": round(bubble_time, 3),
                "big_o_time": "O(n²) avg/worst, O(n) best with early exit",
                "big_o_space": "O(1)",
                "stability": "Stable",
                "count_source": "Instrumented educational implementation",
            },
            "insertion": {
                "name": "Insertion Sort",
                "comparisons": insert_counter[0],
                "moves": insert_shifts + insert_placements,
                "move_metric": "shifts + placements",
                "time_ms": round(insert_time, 3),
                "big_o_time": "O(n²) worst, O(n) best",
                "big_o_space": "O(1)",
                "stability": "Stable",
                "count_source": "Instrumented educational implementation",
            },
            "merge": {
                "name": "Merge Sort",
                "comparisons": merge_counter[0],
                "moves": merge_writes[0],
                "move_metric": "array writes",
                "time_ms": round(merge_time, 3),
                "big_o_time": "O(n log n) guaranteed",
                "big_o_space": "O(n)",
                "stability": "Stable",
                "count_source": "Instrumented educational implementation",
            },
            "timsort": {
                "name": "Timsort (CPython built-in)",
                "comparisons": tim_counter[0],
                "moves": None,
                "move_metric": "not exposed by CPython",
                "time_ms": round(tim_time, 4),
                "big_o_time": "O(n log n) avg/worst, O(n) best",
                "big_o_space": "O(n)",
                "stability": "Stable",
                "count_source": "Comparisons counted via wrapper dunders around real CPython sorted(); internal moves unavailable",
                "is_cpython_native": True,
            },
        },
    }


# ---------------------------------------------------------------------------
# HTTP layer
# ---------------------------------------------------------------------------

class InvestigationRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Static file server plus JSON API endpoints."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def is_safe_origin(self) -> bool:
        origin = self.headers.get("Origin", "")
        if not origin:
            return True
        return bool(
            re.match(r"^https?://(127\.0\.0\.1|localhost)(:\d+)?$", origin)
        )

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def set_safe_headers(self, content_type: str = "application/json"):
        origin = self.headers.get("Origin", "")
        if origin and self.is_safe_origin():
            self.send_header("Access-Control-Allow-Origin", origin)
        else:
            self.send_header("Access-Control-Allow-Origin", f"http://{HOST}:{DEFAULT_PORT}")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", content_type)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")

    def _send_json(self, status: int, payload: dict, extra_headers: dict | None = None):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.set_safe_headers("application/json")
        for name, value in (extra_headers or {}).items():
            self.send_header(name, value)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _drain_body(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
        except (TypeError, ValueError):
            return
        if length > 0:
            try:
                self.rfile.read(min(length, 4096))
            except Exception:
                pass

    def _discard_unparsed_body(self, limit: int = 8192):
        """Consume already-sent bytes before replying to a malformed request.

        On Windows, closing a socket while request bytes are still unread can
        abort the connection with WSAECONNABORTED before the client receives the
        JSON error response. A short bounded read keeps error handling reliable.
        """
        try:
            self.connection.settimeout(0.25)
            remaining = max(0, min(limit, 65536))
            while remaining > 0:
                chunk = self.rfile.read1(min(remaining, 8192))
                if not chunk:
                    break
                remaining -= len(chunk)
        except Exception:
            pass
        finally:
            try:
                self.connection.settimeout(None)
            except Exception:
                pass

    def _read_json_body(self, max_bytes: int) -> dict:
        raw_length = self.headers.get("Content-Length")
        if raw_length is None:
            length = 0
        else:
            try:
                length = int(raw_length)
            except (TypeError, ValueError):
                self._discard_unparsed_body()
                raise ValueError("Invalid Content-Length header")
            if length < 0:
                self._discard_unparsed_body()
                raise ValueError("Invalid Content-Length header")
            if length > max_bytes:
                self._discard_unparsed_body(min(length, 65536))
                raise PayloadTooLarge(f"Request body exceeds {max_bytes} bytes")

        raw = self.rfile.read(length) if length else b"{}"
        if not raw:
            return {}
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            raise ValueError("Invalid JSON body")
        if not isinstance(payload, dict):
            raise ValueError("JSON body must be an object")
        return payload

    def do_OPTIONS(self):
        self._send_json(200, {"status": "ok"})

    def do_GET(self):
        path = urllib.parse.urlsplit(self.path).path
        if path == "/api/health":
            self._send_json(200, {
                "status": "healthy",
                "app": "The Sorting Investigation",
                "python_version": sys.version,
                "host": HOST,
            })
            return
        if path.startswith("/api/"):
            self._send_json(405, {"error": "Method not allowed"}, {"Allow": "POST, OPTIONS"})
            return
        return super().do_GET()

    def _unsupported_method(self):
        path = urllib.parse.urlsplit(self.path).path
        if path.startswith("/api/"):
            self._send_json(405, {"error": "Method not allowed"}, {"Allow": "GET, POST, OPTIONS"})
            return
        self._send_json(405, {"error": "Method not allowed"}, {"Allow": "GET, POST, OPTIONS"})

    do_PUT = _unsupported_method
    do_PATCH = _unsupported_method
    do_DELETE = _unsupported_method

    def do_POST(self):
        path = urllib.parse.urlsplit(self.path).path

        if path not in ("/api/execute", "/api/benchmark"):
            self._drain_body()
            self._send_json(404, {"error": "Endpoint not found"})
            return

        if not self.is_safe_origin():
            self._drain_body()
            self._send_json(403, {"error": "Forbidden origin"})
            return

        try:
            if path == "/api/execute":
                payload = self._read_json_body(MAX_CODE_LENGTH * 2)
                code = payload.get("code", "")
                if not isinstance(code, str):
                    self._send_json(400, {"error": "Field 'code' must be a string"})
                    return
                self._send_json(200, execute_python_code(code))
                return

            payload = self._read_json_body(BENCHMARK_MAX_BODY)
            dataset_type = payload.get("dataset_type", "random")
            if not isinstance(dataset_type, str) or dataset_type not in BENCHMARK_DATASET_TYPES:
                self._send_json(400, {
                    "error": "Invalid dataset_type",
                    "allowed": sorted(BENCHMARK_DATASET_TYPES),
                })
                return

            raw_size = payload.get("size", 60)
            if type(raw_size) is not int:
                self._send_json(400, {"error": "Field 'size' must be an integer"})
                return
            size = raw_size
            if not (BENCHMARK_MIN_SIZE <= size <= BENCHMARK_MAX_SIZE):
                self._send_json(400, {
                    "error": f"Field 'size' must be between {BENCHMARK_MIN_SIZE} and {BENCHMARK_MAX_SIZE}",
                })
                return

            self._send_json(200, run_algorithm_benchmark(dataset_type, size))
        except PayloadTooLarge as exc:
            self._send_json(413, {"error": str(exc)})
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
        except Exception:
            self._send_json(500, {"error": "Internal server error"})

    def log_message(self, format, *args):
        if "/api/" in str(args[0]) or (len(args) > 1 and str(args[1]) not in ("200", "304")):
            sys.stdout.write(f"[Investigation Server] {self.address_string()} - {format % args}\n")
            sys.stdout.flush()


class InvestigationHTTPServer(socketserver.TCPServer):
    """Local-only server that refuses to share a port with a stale process."""

    allow_reuse_address = False
    allow_reuse_port = False
    daemon_threads = True

    def server_bind(self):
        # SO_REUSEADDR on Windows can let several server.py processes bind one
        # port at once; the oldest then serves every request. Prevent that.
        if os.name == "nt" and hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def _port_has_listener(port: int) -> bool:
    """Return True when something already accepts connections on HOST:port."""
    try:
        with socket.create_connection((HOST, port), timeout=0.4):
            return True
    except OSError:
        return False


def run_server(port: int = DEFAULT_PORT):
    """Start one HTTP server bound strictly to 127.0.0.1.

    A reachable listener is treated as an error rather than silently falling
    back to another port: the browser would keep using the stale server's old
    code while the new server sat unused on a different port.
    """
    if type(port) is not int or not (1 <= port <= 65535):
        raise SystemExit(
            f"[Startup error] Port must be an integer between 1 and 65535; got {port!r}."
        )

    if _port_has_listener(port):
        raise SystemExit(
            f"[Startup error] {HOST}:{port} is already serving requests. "
            "Stop the existing python server.py process (Ctrl+C in its terminal "
            "or close its PID), then start the server again. Do not open two "
            f"servers; use `python server.py {port + 1}` only if you intentionally "
            "want a different port."
        )

    server_address = (HOST, port)
    try:
        httpd = InvestigationHTTPServer(server_address, InvestigationRequestHandler)
    except OSError as err:
        if err.errno == 10048 or "already in use" in str(err).lower():
            raise SystemExit(
                f"[Startup error] Could not bind {HOST}:{port} because the port is "
                "already in use. Stop the existing python server.py process, then "
                "start this server again."
            ) from err
        raise

    print("=" * 64)
    print("  THE SORTING INVESTIGATION - LOCAL EDUCATIONAL SERVER")
    print("=" * 64)
    print("  Status: Active & Ready")
    print(f"  URL:    http://{HOST}:{port}")
    print(f"  Path:   {BASE_DIR}")
    print(f"  Python: {sys.version.split()[0]}")
    print("-" * 64)
    print(f"  Open http://{HOST}:{port} in your browser to begin.")
    print("  Press Ctrl+C to stop the server.")
    print("=" * 64)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Investigation Server] Shutting down gracefully...")
    finally:
        httpd.server_close()
        print("[Investigation Server] Stopped.")


if __name__ == "__main__":
    port_arg = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port_arg = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port argument '{sys.argv[1]}', using default {DEFAULT_PORT}.")
    run_server(port_arg)
