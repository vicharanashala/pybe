import React,{useState,useEffect} from 'react';
import {DotLottieReact,setWasmUrl} from '@lottiefiles/dotlottie-react';
setWasmUrl('/assets/dotlottie-player.wasm');
// One locally hosted player and runtime for authored animations.
export default function LocalAnimation({label='Story animation',...props}){
 const [player,setPlayer]=useState(null),[ready,setReady]=useState(false);
 useEffect(()=>{if(!player)return;const loaded=()=>setReady(true);player.addEventListener('load',loaded);if(player.isLoaded)loaded();return()=>player.removeEventListener('load',loaded);},[player]);
 return <DotLottieReact {...props} dotLottieRefCallback={setPlayer} role="img" aria-label={label} data-animation-ready={ready}/>;
}
