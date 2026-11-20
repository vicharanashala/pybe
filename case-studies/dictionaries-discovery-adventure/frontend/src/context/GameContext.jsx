import React,{createContext,useContext,useState,useEffect} from 'react';
import {readStoryState,saveStoryState} from '../../../../../shared/story-state.mjs';
const GameContext=createContext(null);
const defaults={dogMeter:10,nerdMode:false,isMuted:true,maxPage:1,visualizerWordsTested:[]};
function load(){const saved=readStoryState(localStorage,'dictionary-discovery','state',null);if(saved)return {...defaults,...saved};return {...defaults,dogMeter:localStorage.getItem('goblin_dog_meter')===null?10:Math.max(0,Math.min(100,Number(localStorage.getItem('goblin_dog_meter'))||0)),nerdMode:localStorage.getItem('goblin_nerd_mode')==='true',maxPage:Math.max(1,Math.min(6,Number(localStorage.getItem('goblin_max_page'))||1))};}
export const GameProvider=({children})=>{
 const [state,setState]=useState(load);useEffect(()=>{saveStoryState(localStorage,'dictionary-discovery','state',state);},[state]);
 const set=(key,value)=>setState(p=>({...p,[key]:typeof value==='function'?value(p[key]):value}));
 return <GameContext.Provider value={{...state,isBusted:state.dogMeter>=100,raiseDogMeter:(n=25)=>set('dogMeter',v=>Math.min(100,Math.max(0,v+n))),lowerDogMeter:(n=15)=>set('dogMeter',v=>Math.max(0,v-n)),resetDogMeter:()=>set('dogMeter',15),toggleNerdMode:()=>set('nerdMode',v=>!v),setNerdMode:v=>set('nerdMode',v),toggleMute:()=>set('isMuted',v=>!v),unlockNextPage:page=>set('maxPage',v=>Math.max(v,page+1)),registerVisualizerWord:word=>set('visualizerWordsTested',words=>words.includes(word)?words:[...words,word]),resetAllProgress:()=>setState({...defaults,visualizerWordsTested:[]})}}>{children}</GameContext.Provider>;
};
export const useGame=()=>{const state=useContext(GameContext);if(!state)throw Error('GameProvider is required');return state;};
