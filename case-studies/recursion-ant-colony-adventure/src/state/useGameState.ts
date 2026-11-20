// Story progress and device settings; shared PyBe owns completion, not rewards.
import {useCallback,useEffect,useState} from 'react';
import {loadProgress,saveProgress} from '../storage/progress';
import {TOTAL_SCENES} from '../data';
import {playSfx,setMuted,unlockAudio} from '../audio/soundEngine';
export function useGameState(){
 const [state,setState]=useState(loadProgress);
 const {completedScenes,correctQuizScenes,recursionDiscovered,lastSceneId,settings}=state;
 useEffect(()=>{saveProgress(state);setMuted(state.settings.muted);},[state]);
 const completeScene=useCallback((id:number)=>{setState(p=>({...p,lastSceneId:id,completedScenes:p.completedScenes.includes(id)?p.completedScenes:[...p.completedScenes,id]}));},[]);
 const recordQuiz=useCallback((id:number,correct:boolean)=>{if(correct)setState(p=>({...p,correctQuizScenes:p.correctQuizScenes.includes(id)?p.correctQuizScenes:[...p.correctQuizScenes,id]}));},[]);
 const discoverRecursion=useCallback(()=>{playSfx('reveal');setState(p=>({...p,recursionDiscovered:true}));},[]);
 const setLastScene=useCallback((id:number)=>setState(p=>({...p,lastSceneId:id})),[]);
 const reset=useCallback(()=>setState(p=>({...p,completedScenes:[],correctQuizScenes:[],recursionDiscovered:false,lastSceneId:0})),[]);
 const toggleMute=useCallback(()=>setState(p=>({...p,settings:{muted:!p.settings.muted}})),[]);
 return {completedScenes,correctQuizScenes,recursionDiscovered,lastSceneId,muted:settings.muted,totalScenes:TOTAL_SCENES,completeScene,recordQuiz,discoverRecursion,setLastScene,reset,toggleMute};
}
export type GameState=ReturnType<typeof useGameState>;
