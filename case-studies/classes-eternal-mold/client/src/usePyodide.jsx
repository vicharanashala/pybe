import {useState,useRef,useEffect,useCallback} from 'react';
import {runPython as executePython,cancelPython} from '../../../../library/learning/python-client.mjs';
import {handleOrionMisfire} from './interceptorEngine';
export function usePyodide(){
 const active=useRef(false),mounted=useRef(true);const [isRunning,setIsRunning]=useState(false),[consoleOutput,setConsoleOutput]=useState([{type:'system',text:'The Scrying Pool is ready.'}]);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;if(active.current)cancelPython();};},[]);
 const runPython=useCallback(async code=>{
  if(active.current)return {success:false,error:'A spell is already running.'};active.current=true;setIsRunning(true);
  try{const result=await executePython(code);if(!mounted.current)return {success:false,error:'Execution cancelled.'};
   if(result.output)setConsoleOutput(p=>[...p,...result.output.trimEnd().split('\n').map(text=>({type:'stdout',text}))]);
   if(result.error){setConsoleOutput(p=>[...p,{type:'error',text:result.error}]);return {success:false,error:result.error};}
   return {success:true,output:result.output||'(Spell executed cleanly)'};
  }finally{active.current=false;if(mounted.current)setIsRunning(false);}
 },[]);
 return {runPython,isRunning,isLoading:false,consoleOutput,setConsoleOutput,clearOutput:()=>setConsoleOutput([])};
}
