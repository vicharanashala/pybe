// Preserve the three submitted game APIs while executing every program in PyBe's worker.
export function createArcadePythonBridge(run) {
  let setup = "",
    snapshot = {},
    paintPixel = null;
  return {
    globals: {
      set(name, callback) {
        if (name !== "paint_pixel") throw Error("Unsupported game binding");
        paintPixel = callback;
      },
    },
    runPython(code) {
      if (code === "pet._action") return snapshot.petAction;
      if (code === "pet._action_param") return snapshot.petParam;
      if (code === "ship._action") return snapshot.shipAction;
      setup = code;
    },
    async runPythonAsync(code) {
      const harness =
        `import json as _pybe_json\n_pybe_pixels=[]\ndef paint_pixel(x,y,color):\n    if len(_pybe_pixels)>=4096:\n        raise ValueError('This canvas supports at most 4096 painting operations per run.')\n    _pybe_pixels.append([x,y,color])\n` +
        setup +
        "\n" +
        code +
        `\nprint('\\n__PYBE_ARCADE__'+_pybe_json.dumps({'pixels':_pybe_pixels,'petAction':getattr(globals().get('pet'),'_action',None),'petParam':getattr(globals().get('pet'),'_action_param',None),'shipAction':getattr(globals().get('ship'),'_action',None)}))`;
      const result = await run(harness, { timeoutMs: 2500 });
      if (result.error) throw Error(result.error);
      const marker = "__PYBE_ARCADE__",
        at = result.output.lastIndexOf(marker);
      if (at < 0)
        throw Error("The game could not read this program’s actions.");
      snapshot = JSON.parse(result.output.slice(at + marker.length));
      if (paintPixel) for (const args of snapshot.pixels) paintPixel(...args);
    },
  };
}
