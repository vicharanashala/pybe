// Builds the Python that actually runs a learner's code and reports back what it
// DID, rather than what it looks like. Everything here is a pure string function
// so it can be unit-tested without a browser or the Python runtime.
//
// Every harness ends in a `json.dumps(...)` expression, which Pyodide returns as
// the run's value — see shared/pyodide/usePyodide.js `runJSON`.

// A learner's mistake can genuinely never finish (`while True:` with no exit).
// The tracer below counts executed lines and stops the program itself, so the
// worker reports a teachable message instead of hanging.
const MAX_STEPS = 20000;

/**
 * Rewrites a top-level `name = "literal"` assignment to a new string value.
 *
 * Chapter 2 has to see what the learner's code does under BOTH sunny and rainy
 * weather, but the starter code sets the weather itself. Rather than guess at the
 * learner's intent, the farm re-runs their exact code with only that one initial
 * condition changed — the same program, a different morning. Any indented (nested)
 * assignment is left alone, since that is the learner's own logic, not the setup.
 *
 * Only the first matching assignment is rewritten, and the line's trailing comment
 * is preserved so the editor still reads like the learner's own code. When no such
 * assignment exists (the learner deleted it), one is prepended instead.
 */
export function overrideStringAssignment(code, name, value) {
  // Two explicit quote alternatives rather than a backreference, so the pattern
  // stays readable and cannot match a line like: weather = "sunny'
  const pattern = new RegExp('^' + name + '[ \\t]*=[ \\t]*("[^"]*"|\'[^\']*\')[ \\t]*(#.*)?$');
  const lines = code.split('\n');
  let replaced = false;

  const rewritten = lines.map((line) => {
    if (replaced) return line;
    const match = line.match(pattern);
    if (!match) return line;
    replaced = true;
    return name + ' = "' + value + '"' + (match[2] ? '  ' + match[2] : '');
  });

  if (!replaced) return name + ' = "' + value + '"\n' + code;
  return rewritten.join('\n');
}

/**
 * Builds the harness for one run.
 *
 * @param {string} userCode      the learner's code, run verbatim
 * @param {string[]} setupLines  Python executed in the learner's own namespace
 *                               first — the resources and helpers the farm lends
 *                               them (e.g. `water = 50`, `water_crops()`)
 * @returns {string} Python whose final expression is a JSON string holding
 *                   { globals, output, error, calls }
 */
export function buildFarmHarness(userCode, setupLines = []) {
  const codeLiteral = JSON.stringify(userCode);
  const setupLiteral = JSON.stringify(setupLines.join('\n'));

  return `
import json, io, sys

from contextlib import redirect_stdout

def __pyfarm_run():
    __buf = io.StringIO()
    __calls = {'water_crops': 0}
    __steps = {'n': 0}
    __error = None
    __g = {'__name__': '__farm__'}

    # The farm's own helpers live in the learner's namespace, so calling
    # water_crops() is recorded as a real event rather than matched in text.
    def water_crops():
        __calls['water_crops'] += 1

    __g['water_crops'] = water_crops
    exec(compile(${setupLiteral}, '<farm_setup>', 'exec'), __g)

    def __snapshot(g):
        out = {}
        for k, v in g.items():
            if k.startswith('_') or callable(v):
                continue
            try:
                out[k] = repr(v)
            except Exception:
                out[k] = '<unreadable value>'
        return out

    def __tracer(frame, event, arg):
        if frame.f_code.co_filename != '<learner_code>':
            return __tracer
        if event == 'line':
            __steps['n'] += 1
            if __steps['n'] > ${MAX_STEPS}:
                raise RuntimeError('__PYFARM_STEP_LIMIT__')
        return __tracer

    # The learner's code is compiled under its own filename so the tracer can tell
    # their lines apart from the farm's, and so error line numbers match the editor.
    sys.settrace(__tracer)
    try:
        with redirect_stdout(__buf):
            exec(compile(${codeLiteral}, '<learner_code>', 'exec'), __g)
    except SyntaxError as exc:
        __error = {'type': type(exc).__name__, 'message': str(exc.msg), 'line': exc.lineno}
    except RuntimeError as exc:
        if str(exc) == '__PYFARM_STEP_LIMIT__':
            __error = {'type': 'StepLimit', 'message': 'it ran for more than ${MAX_STEPS} steps without finishing', 'line': None}
        else:
            __error = {'type': type(exc).__name__, 'message': str(exc), 'line': None}
    except BaseException as exc:
        __error = {'type': type(exc).__name__, 'message': str(exc), 'line': None}
    finally:
        sys.settrace(None)

    return json.dumps({
        'globals': __snapshot(__g),
        'output': __buf.getvalue(),
        'error': __error,
        'calls': __calls,
    })

__pyfarm_run()
`.trim();
}

/**
 * Turns a Python error from the harness into something a beginner can act on.
 * Python's own wording is kept alongside, never replaced — learning to read a
 * real error message is part of the point.
 */
export function describeError(error) {
  if (!error) return null;
  const at = error.line ? ` (line ${error.line})` : '';

  switch (error.type) {
    case 'IndentationError':
      return `Python needs the lines inside an if or an else to be indented${at}. Python says: "${error.message}".`;
    case 'SyntaxError':
      return `Python could not read that code${at}. Python says: "${error.message}". Check for a missing colon (:) or quote mark.`;
    case 'NameError':
      return `Python says: "${error.message}". That usually means a name was spelled differently from where it was created.`;
    case 'TypeError':
      return `Python says: "${error.message}". This often means a number and a piece of text got mixed together.`;
    case 'StepLimit':
      return `The farm stopped your code because ${error.message}. Check for a loop that never ends.`;
    default:
      return `Python says: "${error.type}: ${error.message}".`;
  }
}

/**
 * Python `repr()` strings come back from the harness as text. These read them back
 * as JS values, so validators can compare meaning rather than formatting —
 * `30`, `30.0` and `'30'` are three different answers and should be treated so.
 */
export function reprIsString(repr) {
  if (typeof repr !== 'string' || repr.length < 2) return false;
  const first = repr[0];
  const last = repr[repr.length - 1];
  return (first === "'" || first === '"') && first === last;
}

export function reprToNumber(repr) {
  if (typeof repr !== 'string' || reprIsString(repr)) return null;
  if (repr === 'True' || repr === 'False' || repr === 'None') return null;
  const value = Number(repr);
  return Number.isFinite(value) ? value : null;
}

export function reprToText(repr) {
  return reprIsString(repr) ? repr.slice(1, -1) : repr;
}
