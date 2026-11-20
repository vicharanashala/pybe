// One worker-backed runtime for all integrated lessons; never blocks the UI.
let worker = null,
  pending = null,
  sequence = 0;
function destroy() {
  worker?.terminate();
  worker = null;
}
export function cancelPython() {
  if (pending) {
    clearTimeout(pending.timer);
    pending.resolve({
      output: "",
      error: "Execution cancelled.",
      variables: {},
      trace: [],
    });
    pending = null;
  }
  destroy();
}
export function runPython(
  code,
  { timeoutMs = 20000, input = [], inspect = false, fixtures = {} } = {},
) {
  if (pending)
    return Promise.resolve({
      output: "",
      error:
        "Another Python exercise is running. Cancel it before starting a new one.",
      variables: {},
      trace: [],
    });
  return new Promise((resolve) => {
    try {
      if (!worker) {
        worker = new Worker("/learning/python.worker.mjs", { type: "module" });
        worker.onmessage = ({ data }) => {
          if (!pending || data.id !== pending.id) return;
          // Runtime download gets its own deadline; execution gets a fresh one.
          if (data.status === "ready") {
            clearTimeout(pending.timer);
            pending.timer = setTimeout(
              () =>
                finishTimeout(
                  "The code took too long. Check its stopping condition and try again.",
                ),
              timeoutMs,
            );
            return;
          }
          clearTimeout(pending.timer);
          const done = pending.resolve;
          pending = null;
          done(data.result);
        };
        worker.onerror = (event) => {
          if (pending) {
            clearTimeout(pending.timer);
            const done = pending.resolve;
            pending = null;
            done({
              output: "",
              error:
                event.message || "Python could not start. Please try again.",
              variables: {},
              trace: [],
            });
          }
          destroy();
        };
      }
      const id = ++sequence;
      pending = {
        id,
        resolve,
        timer: setTimeout(
          () =>
            finishTimeout(
              "Python could not load in time. Check your connection and try again.",
            ),
          90000,
        ),
      };
      worker.postMessage({ id, code, input, inspect, fixtures });
    } catch (error) {
      if (pending) clearTimeout(pending.timer);
      pending = null;
      destroy();
      resolve({ output: "", error: error.message, variables: {}, trace: [] });
    }
  });
}
function finishTimeout(message) {
  if (!pending) return;
  const done = pending.resolve;
  pending = null;
  destroy();
  done({ output: "", error: message, variables: {}, trace: [] });
}
