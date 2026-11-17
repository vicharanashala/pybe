/**
 * Runs Python code in Pyodide, tracing variable state changes line-by-line.
 * Prevents multiple executions and collects global/local variable snapshots.
 *
 * @param {Object} pyodide - Pyodide instance
 * @param {string} code - Python code to inspect
 * @returns {Object} Execution details including variables, loop iterations, output, errors, and time.
 */
export async function inspectExecution(pyodide, code) {
  const startTime = performance.now();

  // Escape backslashes and single/triple quotes for python safe string injection
  const escapedCode = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  const runnerScript = `
import sys
import json
import traceback

trace_data = []

def trace_lines(frame, event, arg):
    # Only trace code that is evaluated by our exec call (comes from <string> filename)
    if frame.f_code.co_filename != "<string>":
        return None
    if event == 'line':
        locals_copy = {}
        for k, v in frame.f_locals.items():
            if k.startswith('__'):
                continue
            
            # Extract standard serializable types
            try:
                # Capture standard representation for custom classes or standard structures
                if isinstance(v, (int, float, str, bool)) or v is None:
                    locals_copy[k] = v
                elif isinstance(v, list):
                    # Save a snapshot copy of lists
                    locals_copy[k] = list(v)
                elif isinstance(v, dict):
                    # Save a snapshot copy of dicts
                    locals_copy[k] = dict(v)
                elif isinstance(v, (set, tuple)):
                    locals_copy[k] = list(v)
                else:
                    locals_copy[k] = str(v)
            except Exception:
                locals_copy[k] = str(v)
        
        trace_data.append({
            "line": frame.f_lineno,
            "locals": locals_copy
        })
    return trace_lines

# Setup standard output redirect buffer
class OutputRedirector:
    def __init__(self):
        self.buffer = []
    def write(self, text):
        self.buffer.append(text)
    def flush(self):
        pass

stdout_redirect = OutputRedirector()
stderr_redirect = OutputRedirector()

original_stdout = sys.stdout
original_stderr = sys.stderr

sys.stdout = stdout_redirect
sys.stderr = stderr_redirect

sys.settrace(trace_lines)
exec_error = None
exec_locals = {}

try:
    # Run the user code
    exec("""${escapedCode}""", {}, exec_locals)
except Exception as e:
    # Capture standard error traceback
    exec_error = "".join(traceback.format_exception(type(e), e, e.__traceback__))
finally:
    sys.settrace(None)
    sys.stdout = original_stdout
    sys.stderr = original_stderr

# Extract final variables
final_vars = {}
for k, v in exec_locals.items():
    if k.startswith('__') or hasattr(v, '__call__'):
        continue
    try:
        if isinstance(v, (int, float, str, bool)) or v is None or isinstance(v, (list, dict, set, tuple)):
            final_vars[k] = v
        else:
            final_vars[k] = str(v)
    except:
        final_vars[k] = str(v)

json.dumps({
    "trace": trace_data,
    "error": exec_error,
    "output": "".join(stdout_redirect.buffer),
    "variables": final_vars
})
`;

  try {
    const rawResult = await pyodide.runPythonAsync(runnerScript);
    const result = JSON.parse(rawResult);
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    return {
      output: result.output,
      error: result.error,
      variables: result.variables,
      trace: result.trace,
      executionTime: duration
    };
  } catch (err) {
    const endTime = performance.now();
    return {
      output: '',
      error: err.message,
      variables: {},
      trace: [],
      executionTime: (endTime - startTime).toFixed(2)
    };
  }
}
