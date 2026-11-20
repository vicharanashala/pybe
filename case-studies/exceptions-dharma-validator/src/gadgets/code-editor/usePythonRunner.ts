import {useRef,useEffect,useState,useCallback} from 'react';
import {runPython,cancelPython} from '../../../../../library/learning/python-client.mjs';
export interface RunResult {output:string;error:string|null}
export function usePythonRunner(){
 const mounted=useRef(true),active=useRef(false);
 const [isLoading,setLoading]=useState(false);
 const [isReady,setReady]=useState(false);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;if(active.current)cancelPython();};},[]);
 const run=useCallback(async(code:string,options:{input?:string[]}={}):Promise<RunResult>=>{
  if(active.current)return {output:'',error:'A program is already running.'};
  active.current=true;setLoading(true);
  try{const result=await runPython(code,options);if(mounted.current)setReady(true);return {output:result.output.trimEnd(),error:result.error};}
  finally{active.current=false;if(mounted.current)setLoading(false);}
 },[]);
 return {run,isLoading,isReady};
}
