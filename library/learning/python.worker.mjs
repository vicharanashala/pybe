let runtimePromise;
async function runtime() {
  if (!runtimePromise)
    runtimePromise = (async () => {
      const { loadPyodide } = await import(
        "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs"
      );
      const pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
      });
      const response = await fetch("/learning/python-runtime.py");
      if (!response.ok)
        throw new Error("The shared Python runner is unavailable.");
      pyodide.runPython(await response.text());
      return pyodide;
    })().catch((error) => {
      runtimePromise = null;
      throw error;
    });
  return runtimePromise;
}
self.onmessage = async ({ data: { id, code, input, inspect, fixtures } }) => {
  try {
    const python = await runtime();
    self.postMessage({ id, status: "ready" });
    python.globals.set(
      "_pybe_request",
      JSON.stringify({ code, input, inspect, fixtures }),
    );
    const result = JSON.parse(
      await python.runPythonAsync("_pybe_execute(_pybe_request)"),
    );
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({
      id,
      result: {
        output: "",
        error: `Python could not run: ${error.message}`,
        variables: {},
        trace: [],
      },
    });
  }
};
