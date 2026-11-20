import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {missions} from '../data/missions';
import {readProgress,saveProgress} from '../../../../library/learning/core.mjs';
interface GameContextValue {
 completedMissions:string[];
 isMissionUnlocked:(number:number)=>boolean;
 isMissionComplete:(id:string)=>boolean;
 completeMission:(id:string)=>void;
 resetProgress:()=>void;
}
const GameContext=createContext<GameContextValue|null>(null);
export function GameProvider({children,onComplete}:{children:ReactNode,onComplete?:()=>void}) {
 const [completed,setCompleted]=useState<string[]>(()=>readProgress(localStorage,'hawkins-division').completed.filter((id:string)=>missions.some(m=>m.id===id)));
 useEffect(()=>{saveProgress(localStorage,'hawkins-division',{completed});if(missions.every(m=>completed.includes(m.id)))onComplete?.();},[completed,onComplete]);
 const value:GameContextValue={completedMissions:completed,
 isMissionUnlocked:number=>number===1||missions.some(m=>m.number===number-1&&completed.includes(m.id)),
 isMissionComplete:id=>completed.includes(id),
 completeMission:id=>setCompleted(prev=>prev.includes(id)?prev:[...prev,id]),
 resetProgress:()=>setCompleted([])};
 return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
export function useGame(){const ctx=useContext(GameContext);if(!ctx)throw new Error('useGame must be used within a GameProvider');return ctx;}
