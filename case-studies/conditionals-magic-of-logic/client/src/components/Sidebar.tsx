import { BookOpen, Lock } from 'lucide-react';
import { Chapter } from '../types';

interface SidebarProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
}

export function Sidebar({ chapters, activeChapterId, onSelectChapter }: SidebarProps) {
  return (
    <div className="w-72 bg-[#FDF8F0] border-r border-amber-200 h-full flex flex-col shrink-0 shadow-sm relative z-30">
      <div className="p-6 border-b border-amber-200 bg-orange-50/50">
        <h1 className="text-3xl font-black text-amber-900 flex items-center gap-2">
          Pybe
        </h1>
        <p className="text-stone-500 text-sm mt-1 font-medium">Interactive Python Learning</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={() => onSelectChapter('intro')}
          className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between ${
            activeChapterId === 'intro'
              ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-sm'
              : 'hover:bg-amber-50 border border-transparent text-stone-600'
          }`}
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">
              Welcome
            </div>
            <div className="font-bold text-sm leading-tight">Introduction</div>
          </div>
          <BookOpen className="w-4 h-4 shrink-0 ml-2 opacity-50" />
        </button>

        <div className="h-px bg-amber-200 my-4 mx-2" />

        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => !chapter.isLocked && onSelectChapter(chapter.id)}
            disabled={chapter.isLocked}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between ${
              activeChapterId === chapter.id
                ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-sm'
                : chapter.isLocked
                ? 'opacity-50 cursor-not-allowed text-stone-400'
                : 'hover:bg-amber-50 border border-transparent text-stone-600'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">
                {chapter.concept}
              </div>
              <div className="font-bold text-sm leading-tight">{chapter.title}</div>
              <div className="text-xs mt-2 opacity-80 flex items-center gap-1 font-medium">
                Theme: {chapter.theme}
              </div>
            </div>
            {chapter.isLocked ? (
              <Lock className="w-4 h-4 shrink-0 ml-2 text-stone-400" />
            ) : (
              <BookOpen className="w-4 h-4 shrink-0 ml-2 opacity-50" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
