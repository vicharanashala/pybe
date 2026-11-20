import {useRef,useEffect,useCallback} from 'react';
import {runPython as execute,cancelPython} from '../../../../library/learning/python-client.mjs';
import {verificationProgram} from './verification.mjs';
import type {RunResult,CodingTest,TestResult} from './types';
export function usePython(){
 const active=useRef(false);
 useEffect(()=>()=>{if(active.current)cancelPython();},[]);
 const runPython=useCallback(async(code:string):Promise<RunResult>=>{
  if(active.current)return {stdout:'',error:'A program is already running.',success:false};
  active.current=true;try{const r=await execute(code);return {stdout:r.output,error:r.error,success:!r.error};}finally{active.current=false;}
 },[]);
 const verifyCode=useCallback(async(code:string,tests:CodingTest[])=>{
  const r=await runPython(verificationProgram(code,tests));
  if(r.error)return {...r,results:tests.map(t=>({description:t.description,passed:false,error:r.error})) as TestResult[]};
  try{return JSON.parse(r.stdout) as RunResult&{results:TestResult[]};}catch{return {stdout:'',error:'The program result could not be read.',success:false,results:[] as TestResult[]};}
 },[runPython]);
 return {isLoading:false,loadError:null,runPython,verifyCode};
}
export default usePython;
