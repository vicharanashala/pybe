import React,{useCallback,useMemo} from 'react';
import AuthoredHtmlStory from './AuthoredHtmlStory.jsx';

// Authored multi-page submissions keep their links and page order. Page changes
// stay on the PyBe route and remain real history entries for Back/Forward.
export default function AuthoredBook({lesson,onComplete}){
  const slug=decodeURIComponent(location.hash.split('/').slice(3).join('/'));
  const page=lesson.pages.find(page=>page.slug===slug)||lesson.pages[0];
  const content=useMemo(()=>({...page,styles:page.styleIds.map(id=>lesson.sharedStyles[id])}),[page,lesson.sharedStyles]);
  const navigate=useCallback(url=>{
    const target=lesson.pages.find(page=>new URL(page.route,location.origin).href===url);
    if(!target)return false;
    location.hash=`study/${lesson.studyId}/page/${encodeURIComponent(target.slug)}`;
    window.scrollTo(0,0);
    return true;
  },[lesson]);
  return <AuthoredHtmlStory lesson={content} onComplete={onComplete} onNavigate={navigate}/>;
}
