import {useCallback, useEffect, useRef, useState} from 'react';
import {runPython, cancelPython} from '../../../../../library/learning/python-client.mjs';
// Retain the farm harness and validators, using PyBe’s shared isolated worker.
export function usePyodide() {
  const mounted = useRef(true);
  const busy = useRef(false);
  const [running, setRunning] = useState(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; cancelPython(); }; }, []);
  const runJSON = useCallback(async harnessCode => {
    if (busy.current) return {data:null, error:'A farm program is already running.'};
    busy.current = true; setRunning(true);
    try {
      const code = harnessCode.replace(/__pyfarm_run\(\)\s*$/, 'print(__pyfarm_run())');
      const result = await runPython(code, {timeoutMs:15000});
      if(result.error) return {data:null,error:result.error};
      try { return {data:JSON.parse(result.output.trim()),error:null}; }
      catch { return {data:null,error:'The farm could not read that run. Please try again.'}; }
    } finally { busy.current = false; if(mounted.current) setRunning(false); }
  }, []);
  return {status:'ready', running, runJSON, errorDetail:null};
}
