import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {LESSONS} from '../learning/lessons/registry';
import {readProgress,saveProgress} from '../../../../library/learning/core.mjs';
interface ProgressContextValue {
 completedSlugs:string[];isComplete:(slug:string)=>boolean;markComplete:(slug:string)=>void;
 resetProgress:()=>void;completedCount:number;
}
const ProgressContext=createContext<ProgressContextValue|undefined>(undefined);
export function ProgressProvider({children,onComplete}:{children:ReactNode,onComplete?:()=>void}){
 const [completedSlugs,setCompleted]=useState<string[]>(()=>readProgress(localStorage,'dharma-validator').completed.filter((slug:string)=>LESSONS.some(lesson=>lesson.slug===slug)));
 useEffect(()=>{saveProgress(localStorage,'dharma-validator',{completed:completedSlugs});if(LESSONS.every(lesson=>completedSlugs.includes(lesson.slug)))onComplete?.();},[completedSlugs,onComplete]);
 return <ProgressContext.Provider value={{completedSlugs,completedCount:completedSlugs.length,isComplete:slug=>completedSlugs.includes(slug),markComplete:slug=>setCompleted(prev=>prev.includes(slug)?prev:[...prev,slug]),resetProgress:()=>setCompleted([])}}>{children}</ProgressContext.Provider>;
}
export function useProgressContext(){const ctx=useContext(ProgressContext);if(!ctx)throw new Error('useProgressContext must be used within a ProgressProvider');return ctx;}
