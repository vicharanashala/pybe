import {createStoryTimersHook} from './story-timers.mjs';
export function createStoryTypewriterHook(React){
 const useStoryTimers=createStoryTimersHook(React);
 return function useTypewriter(text,speed=18){
  const [shown,setShown]=React.useState(''),[done,setDone]=React.useState(false);const {setInterval,clearInterval}=useStoryTimers();
  React.useEffect(()=>{setShown('');setDone(false);if(!text){setDone(true);return;}let i=0;const interval=setInterval(()=>{i++;setShown(text.slice(0,i));if(i>=text.length){clearInterval(interval);setDone(true);}},speed);return()=>clearInterval(interval);},[text,speed]);
  return {shown,done};
 };
}
