// Traces the learner's code line by line, exactly like the Variables module's tracer
// (a separately-compiled code object so line numbers never need offset math), but adds
// one thing loops specifically need: which `for`/`while` header line is currently
// "active" and how many times it has looped so far, so the UI can show a live
// iteration counter and a timeline of passes through the loop body.
export function buildLoopTracerHarness(userCode) {
  const userCodeLiteral = JSON.stringify(userCode);
  return `
import sys, json, io
from contextlib import redirect_stdout

def __run_traced():
    trace = []
    buf = io.StringIO()
    state = {'prev_line': None, 'last_len': 0}
    loop_hits = {}

    def snapshot_globals(g):
        result = {}
        for k, v in g.items():
            if k.startswith('__'):
                continue
            try:
                result[k] = repr(v)
            except Exception:
                result[k] = '<unrepr-able>'
        return result

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != '<user_code>':
            return tracer
        if event == 'line':
            current_len = len(buf.getvalue())
            line_no = frame.f_lineno
            loop_hits[line_no] = loop_hits.get(line_no, 0) + 1
            if state['prev_line'] is not None:
                delta = buf.getvalue()[state['last_len']:current_len]
                trace.append({
                    'afterLine': state['prev_line'],
                    'globals': snapshot_globals(frame.f_globals),
                    'newOutput': delta,
                    'visitCount': loop_hits.get(state['prev_line'], 0)
                })
            state['prev_line'] = line_no
            state['last_len'] = current_len
        return tracer

    exec_globals = {}
    error = None
    sys.settrace(tracer)
    try:
        with redirect_stdout(buf):
            code_obj = compile(${userCodeLiteral}, '<user_code>', 'exec')
            exec(code_obj, exec_globals)
    except RecursionError:
        error = 'This ran too many times without stopping — check that your loop condition actually becomes False, or that range() has a sensible stop value.'
    except Exception as exc:
        error = f'{type(exc).__name__}: {exc}'
    finally:
        sys.settrace(None)

    if state['prev_line'] is not None:
        final_len = len(buf.getvalue())
        delta = buf.getvalue()[state['last_len']:final_len]
        trace.append({
            'afterLine': state['prev_line'],
            'globals': snapshot_globals(exec_globals),
            'newOutput': delta,
            'visitCount': loop_hits.get(state['prev_line'], 0)
        })

    return json.dumps({'trace': trace, 'error': error, 'totalLines': len(trace)})

__run_traced()
`.trim();
}

// A program can genuinely infinite-loop (e.g. `while True` with no break). Since
// sys.settrace still fires for every line, an unbounded loop would hang the Web Worker
// forever. This wraps the trace call with a hard iteration ceiling enforced *inside*
// the traced program itself, so it always terminates with a clear message instead of
// freezing the tab.
export function buildGuardedLoopTracerHarness(userCode, maxLines = 2000) {
  const base = buildLoopTracerHarness(userCode);
  return base.replace(
    "if event == 'line':",
    `if event == 'line':
            if len(trace) > ${maxLines}:
                raise RuntimeError('SAFETY_STOP')`
  ).replace(
    "except Exception as exc:\n        error = f'{type(exc).__name__}: {exc}'",
    `except Exception as exc:
        if str(exc) == 'SAFETY_STOP':
            error = 'This loop ran over ${maxLines} steps without stopping — it looks like an infinite loop. Check your loop condition or range().'
        else:
            error = f'{type(exc).__name__}: {exc}'`
  );
}
