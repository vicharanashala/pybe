import {useCallback,useEffect,useRef,useState} from 'react';
import {runPython,cancelPython} from '../../../../../library/learning/python-client.mjs';
export function printTraceResult(source){return source.replace(/__run_traced\(\)\s*$/, `__pybe_result = json.loads(__run_traced())
if __pybe_result.get('error'):
    __pybe_result['trace'] = []
__pybe_serialized = json.dumps(__pybe_result, separators=(',', ':'))
print(__pybe_serialized if len(__pybe_serialized) <= 48000 else json.dumps({'error': 'This execution trace is too large to display. Try fewer iterations or smaller values.', 'trace': []}))`);}

export function usePyodide(){
 const active=useRef(false),mounted=useRef(true);const [running,setRunning]=useState(false);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;if(active.current)cancelPython();};},[]);
 const run=useCallback(async code=>{if(active.current)return {output:'',error:'A program is already running.',returnValue:null};active.current=true;setRunning(true);try{const r=await runPython(code);return {...r,returnValue:null};}finally{active.current=false;if(mounted.current)setRunning(false);}},[]);
 const runHarness=useCallback(async code=>{const result=await run(printTraceResult(code));if(result.error)return {data:null,error:result.error};try{const data=JSON.parse(result.output);return data.error?{data:null,error:data.error}:{data,error:null};}catch{return {data:null,error:'Could not read the execution trace — check your code runs without errors.'};}},[run]);
 return {status:'ready',running,run,runHarness,errorDetail:null};
}
