import {runPython,cancelPython} from '../library/learning/python-client.mjs';
export function createStoryPythonHook(React){return function useStoryPython(){
 const [running,setRunning]=React.useState(false),active=React.useRef(false),generation=React.useRef(0);
 React.useEffect(()=>{const epoch=++generation.current;return()=>{if(generation.current===epoch)generation.current++;if(active.current){cancelPython();active.current=false;}};},[]);
 const run=React.useCallback(async(code,options)=>{if(active.current)return {output:'',error:'A program is already running.',variables:{},trace:[]};const epoch=generation.current;active.current=true;setRunning(true);try{return await runPython(code,options);}finally{if(generation.current===epoch){active.current=false;setRunning(false);}}},[]);
 return {run,running};
};}
