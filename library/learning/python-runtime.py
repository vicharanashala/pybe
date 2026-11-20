"""Shared isolated-per-run Python namespace, output capture and optional tracing.

Executed in the browser worker, never as learner code on the local server.
Also exercised with CPython in the integration tests.
"""
import builtins
import contextlib
import io
import json
import sys
import traceback


def _pybe_execute(request_json):
    request = json.loads(request_json)
    output, errors = io.StringIO(), io.StringIO()
    namespace = {"__name__": "__main__"}
    trace = []
    supplied_input = iter(request.get("input", []))
    coins, pins = iter([5, 10, 2, 3] * 100), iter([9999, 0, 1234, 1234] * 100)

    def lesson_input(prompt=""):
        print(prompt, end="")
        try:
            return str(next(supplied_input))
        except StopIteration:
            raise EOFError("Add an input value for each input() call and run again.") from None

    namespace.update(input=lesson_input, get_coin_inserted=lambda: next(coins),
                     ask_for_pin=lambda: next(pins), correct_pin=1234)

    def make_fixture(definition):
        def fictional_operation(*args, **kwargs):
            if definition.get('raises'):
                exception_type = namespace[definition['raises']]
                raise exception_type(definition.get('message', ''))
            return definition.get('returns')
        return fictional_operation

    for name, definition in request.get('fixtures', {}).items():
        namespace[name] = make_fixture(definition)

    def snapshot(values):
        result = {}
        for key, value in values.items():
            if key.startswith("_") or key in ("input", "get_coin_inserted", "ask_for_pin", "correct_pin"):
                continue
            if callable(value) or type(value).__name__ == "module":
                continue
            try:
                result[key] = repr(value)[:1000]
            except Exception:
                result[key] = "<unavailable>"
        return result

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<pybe-lesson>":
            return None
        if event == "line" and len(trace) < 200:
            trace.append({"line": frame.f_lineno, "variables": snapshot(frame.f_locals)})
        return tracer

    error = None
    previous_trace = sys.gettrace()
    previous_input = builtins.input
    with contextlib.redirect_stdout(output), contextlib.redirect_stderr(errors):
        try:
            builtins.input = lesson_input
            if request.get("inspect"):
                sys.settrace(tracer)
            exec(compile(request["code"], "<pybe-lesson>", "exec"), namespace, namespace)
        except BaseException:
            error = traceback.format_exc()
        finally:
            sys.settrace(previous_trace)
            builtins.input = previous_input
    return json.dumps({"output": output.getvalue()[:50000], "error": error,
                       "stderr": errors.getvalue()[:5000], "variables": snapshot(namespace), "trace": trace})
