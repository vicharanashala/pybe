/**
 * pyodide-worker.js
 * Python runs entirely in the browser via Pyodide WASM.
 *
 * Messages IN:
 *   { type: 'trace',            code, maxSteps }
 *   { type: 'run',              code }
 *   { type: 'run_with_inputs',  code, inputs: string[] }
 *   { type: 'trace_with_inputs',code, inputs: string[], maxSteps }
 *
 * Messages OUT:
 *   { type: 'ready' }
 *   { type: 'needs_input', prompts: string[], count: number }  ← intercepted
 *   { type: 'run_result',   output, error }
 *   { type: 'trace_result', steps, program, error }
 */

importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js');

let pyodide = null;

// ── Detect how many input() calls are in the code ────────────────────────────
function detectInputCalls(code) {
  // Match input() or input("...") or input('...')
  const re = /\binput\s*\(([^)]*)\)/g
  const prompts = []
  let m
  while ((m = re.exec(code)) !== null) {
    // Extract the prompt string if present
    const inner = m[1].trim()
    let prompt = 'Enter value:'
    if (inner.length > 0) {
      // strip surrounding quotes
      const stripped = inner.replace(/^['"]|['"]$/g, '')
      if (stripped.length > 0) prompt = stripped
    }
    prompts.push(prompt)
  }
  return prompts
}

// ── Python tracer + runner ───────────────────────────────────────────────────
const TRACER_PY = `
import sys, io

def _prim(obj):
    if isinstance(obj, bool):  return {"type":"primitive","subtype":"bool","value":obj}
    if isinstance(obj, int):   return {"type":"primitive","subtype":"int","value":obj}
    if isinstance(obj, float): return {"type":"primitive","subtype":"float","value":obj}
    if obj is None:            return {"type":"primitive","subtype":"none","value":None}
    if isinstance(obj, str):   return {"type":"primitive","subtype":"str","value":obj[:120]}
    return None

def _val(obj, heap, seen):
    p = _prim(obj)
    if p: return p
    oid = f"h{id(obj)}"
    if oid not in heap:
        heap[oid] = {"type":"...","value":"[circular]"} if oid in seen else _heap_obj(obj, heap, seen|{oid})
    return {"type":"ref","id":oid}

def _heap_obj(obj, heap, seen):
    try:
        if isinstance(obj, list):  return {"type":"list", "value":[_val(v,heap,seen) for v in obj[:50]]}
        if isinstance(obj, tuple): return {"type":"tuple","value":[_val(v,heap,seen) for v in obj[:50]]}
        if isinstance(obj, set):   return {"type":"set",  "value":[_val(v,heap,seen) for v in sorted(obj,key=repr)[:50]]}
        if isinstance(obj, dict):  return {"type":"dict", "value":[[_val(k,heap,seen),_val(v,heap,seen)] for k,v in list(obj.items())[:30]]}
        if callable(obj) and hasattr(obj,"__name__"): return {"type":"function","value":obj.__name__}
        if hasattr(obj,"__dict__"):
            cls=type(obj).__name__
            return {"type":f"instance:{cls}","value":{k:_val(v,heap,seen) for k,v in list(vars(obj).items())[:20] if not k.startswith("__")}}
        return {"type":type(obj).__name__,"value":repr(obj)[:80]}
    except Exception as e:
        return {"type":"?","value":repr(e)[:60]}

def _snap(raw, heap):
    out={}
    for k,v in list(raw.items())[:40]:
        if k.startswith("__"): continue
        try: out[k]=_val(v,heap,frozenset())
        except: out[k]={"type":"primitive","subtype":"str","value":f"<{type(v).__name__}>"}
    return out

class _Tracer:
    def __init__(self,max_steps=500):
        self.max_steps=max_steps; self._steps=[]; self._src=[]; self._buf=io.StringIO(); self._fids={}; self._fc=0
    def _fid(self,frame):
        k=id(frame)
        if k not in self._fids: self._fc+=1; self._fids[k]=f"f{self._fc}"
        return self._fids[k]
    def _trace(self,frame,event,arg):
        if frame.f_code.co_filename!="<string>": return self._trace
        if len(self._steps)>=self.max_steps: return None
        heap={}
        chain=[]; cur=frame
        while cur and cur.f_code.co_filename=="<string>": chain.append(cur); cur=cur.f_back
        frames=[]
        for f in reversed(chain):
            pid=id(f.f_back) if f.f_back and f.f_back.f_code.co_filename=="<string>" else None
            frames.append({"frame_id":self._fid(f),"name":f.f_code.co_name,"is_global":f.f_code.co_name=="<module>","parent_frame_id":self._fids.get(pid) if pid else None,"locals":_snap(dict(f.f_locals),heap)})
        ln=frame.f_lineno; src=self._src[ln-1].rstrip() if 1<=ln<=len(self._src) else ""
        exc=None
        if event=="exception" and arg: et,ev,_=arg; exc=f"{et.__name__}: {ev}"
        self._steps.append({"step_index":len(self._steps),"event":event if event in("call","line","return","exception") else "line","line":ln,"source_line":src,"frames":frames,"heap":heap,"stdout":self._buf.getvalue(),"exception":exc})
        return self._trace
    def run(self,code,input_values=None):
        self._src=code.splitlines(); old_stdout=sys.stdout; old_input=__builtins__.__dict__.get('input') if hasattr(__builtins__,'__dict__') else None
        sys.stdout=self._buf
        # inject fake input() using a queue
        input_queue=list(input_values or [])
        def fake_input(prompt=''):
            if self._buf: sys.stdout.write(str(prompt))
            return input_queue.pop(0) if input_queue else ''
        glb={"__name__":"__main__","__builtins__":__builtins__}
        glb['input']=fake_input
        sys.settrace(self._trace)
        try: exec(compile(code,"<string>","exec"),glb)
        except Exception as e:
            if self._steps: self._steps[-1]["exception"]=f"{type(e).__name__}: {e}"
            else: self._steps.append({"step_index":0,"event":"exception","line":None,"source_line":"","frames":[],"heap":{},"stdout":self._buf.getvalue(),"exception":f"{type(e).__name__}: {e}"})
        finally: sys.settrace(None); sys.stdout=old_stdout
        return self._steps

def _run_only(code, input_values=None):
    buf=io.StringIO(); old=sys.stdout; sys.stdout=buf
    input_queue=list(input_values or [])
    def fake_input(prompt=''):
        buf.write(str(prompt))
        return input_queue.pop(0) if input_queue else ''
    glb={"__name__":"__main__","__builtins__":__builtins__}
    glb['input']=fake_input
    try: exec(compile(code,"<string>","exec"),glb); return buf.getvalue(),None
    except Exception as e: return buf.getvalue(),f"{type(e).__name__}: {e}"
    finally: sys.stdout=old
`

async function init() {
  pyodide = await loadPyodide();
  pyodide.runPython(TRACER_PY);
  self.postMessage({ type: 'ready' });
}

self.onmessage = async (e) => {
  const { type, code, maxSteps = 500, inputs } = e.data;
  if (!pyodide) { self.postMessage({ type: 'error', message: 'Not ready' }); return; }

  // ── run ───────────────────────────────────────────────────────────────────
  if (type === 'run') {
    const prompts = detectInputCalls(code)
    if (prompts.length > 0) {
      // Tell the UI we need input values first
      self.postMessage({ type: 'needs_input', prompts, count: prompts.length })
      return
    }
    try {
      pyodide.globals.set('_run_code', code)
      pyodide.globals.set('_inputs', [])
      const json = pyodide.runPython(`import json as _j\n_o,_e=_run_only(_run_code,_inputs)\n_j.dumps({"output":_o,"error":_e})`)
      const data = JSON.parse(json)
      self.postMessage({ type: 'run_result', output: data.output, error: data.error })
    } catch (err) {
      self.postMessage({ type: 'run_result', output: '', error: err.message })
    }
  }

  // ── run_with_inputs ───────────────────────────────────────────────────────
  if (type === 'run_with_inputs') {
    try {
      pyodide.globals.set('_run_code', code)
      pyodide.globals.set('_inputs', inputs || [])
      const json = pyodide.runPython(`import json as _j\n_o,_e=_run_only(_run_code,_inputs)\n_j.dumps({"output":_o,"error":_e})`)
      const data = JSON.parse(json)
      self.postMessage({ type: 'run_result', output: data.output, error: data.error })
    } catch (err) {
      self.postMessage({ type: 'run_result', output: '', error: err.message })
    }
  }

  // ── trace ─────────────────────────────────────────────────────────────────
  if (type === 'trace') {
    const prompts = detectInputCalls(code)
    if (prompts.length > 0) {
      self.postMessage({ type: 'needs_input', prompts, count: prompts.length })
      return
    }
    try {
      pyodide.globals.set('_user_code', code)
      pyodide.globals.set('_max_steps', maxSteps)
      pyodide.globals.set('_inputs', [])
      const json = pyodide.runPython(`import json as _j\n_t=_Tracer(max_steps=_max_steps)\n_j.dumps({"steps":_t.run(_user_code,[]),"program":_user_code})`)
      const data = JSON.parse(json)
      self.postMessage({ type: 'trace_result', steps: data.steps, program: data.program, error: null })
    } catch (err) {
      self.postMessage({ type: 'trace_result', steps: [], program: code, error: err.message })
    }
  }

  // ── trace_with_inputs ─────────────────────────────────────────────────────
  if (type === 'trace_with_inputs') {
    try {
      pyodide.globals.set('_user_code', code)
      pyodide.globals.set('_max_steps', maxSteps)
      pyodide.globals.set('_inputs', inputs || [])
      const json = pyodide.runPython(`import json as _j\n_t=_Tracer(max_steps=_max_steps)\n_j.dumps({"steps":_t.run(_user_code,_inputs),"program":_user_code})`)
      const data = JSON.parse(json)
      self.postMessage({ type: 'trace_result', steps: data.steps, program: data.program, error: null })
    } catch (err) {
      self.postMessage({ type: 'trace_result', steps: [], program: code, error: err.message })
    }
  }
};

init().catch(err => self.postMessage({ type: 'error', message: String(err) }));
