import React, {createContext,useContext,useState} from 'react';
export type Route='home'|'learning'|'test'|'coding'|'gadgets'|'profile'|'settings';
interface RouterContextType {currentRoute:Route;params:Record<string,string>;navigate:(route:Route,params?:Record<string,string>)=>void}
const RouterContext=createContext<RouterContextType|undefined>(undefined);
// Navigation belongs to this authored study; the surrounding PyBe route stays intact.
export const RouterProvider:React.FC<{children:React.ReactNode}>=({children})=>{
 const [currentRoute,setRoute]=useState<Route>('home');const [params,setParams]=useState<Record<string,string>>({});
 const navigate=(route:Route,next:Record<string,string>={})=>{setRoute(route);setParams(next);};
 return <RouterContext.Provider value={{currentRoute,params,navigate}}>{children}</RouterContext.Provider>;
};
export const useRouter=()=>{const context=useContext(RouterContext);if(!context)throw new Error('useRouter must be used within a RouterProvider');return context;};
export default RouterProvider;
