import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { IntroductionPage } from './components/IntroductionPage';
import { chapters } from './data';
import { Sparkles, GraduationCap, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Chapter 1 Lessons
import { SortingCeremony } from './components/lessons/SortingCeremony';
import { WizardDuel } from './components/lessons/WizardDuel';
import { DefenseAgainstTheDarkArts } from './components/lessons/DefenseAgainstTheDarkArts';
import { PotionsDungeon } from './components/lessons/PotionsDungeon';
import { FirstFlyingClass } from './components/lessons/FirstFlyingClass';

export default function App() {
  const [activeChapterId, setActiveChapterId] = useState('intro'); // Default to intro
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [chapterCompleted, setChapterCompleted] = useState(false);

  const activeChapter = chapters.find((c) => c.id === activeChapterId);
  const currentLesson = activeChapter ? activeChapter.lessons[currentLessonIndex] : null;
  const isLastLesson = activeChapter ? currentLessonIndex === activeChapter.lessons.length - 1 : false;

  const handleLessonComplete = () => {
    if (!isLastLesson) {
      setCurrentLessonIndex((prev) => prev + 1);
    } else {
      setChapterCompleted(true);
    }
  };

  const handleSelectChapter = (id: string) => {
    setActiveChapterId(id);
    setCurrentLessonIndex(0);
    setChapterCompleted(false);
  };

  const renderLesson = () => {
    if (!currentLesson) return null;
    switch (currentLesson.id) {
      // Chapter 1
      case 'l1': return <WizardDuel onComplete={handleLessonComplete} isLastLesson={isLastLesson} />;
      case 'l2': return <SortingCeremony onComplete={handleLessonComplete} isLastLesson={isLastLesson} />;
      case 'l3': return <DefenseAgainstTheDarkArts onComplete={handleLessonComplete} isLastLesson={isLastLesson} />;
      case 'l4': return <PotionsDungeon onComplete={handleLessonComplete} isLastLesson={isLastLesson} />;
      case 'l5': return <FirstFlyingClass onComplete={handleLessonComplete} isLastLesson={isLastLesson} />;
      
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FDF8F0] text-stone-800 font-sans overflow-hidden">
      <Sidebar 
        chapters={chapters} 
        activeChapterId={activeChapterId} 
        onSelectChapter={handleSelectChapter} 
      />
      
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-white/50">
        <AnimatePresence mode="wait">
          {activeChapterId === 'intro' ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <IntroductionPage onStart={() => handleSelectChapter(chapters[0].id)} />
            </motion.div>
          ) : chapterCompleted ? (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              {activeChapterId === 'ch1' ? (
                <>
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 border border-red-200 shadow-sm">
                    <Trophy className="w-12 h-12 text-red-600" />
                  </div>
                  <h1 className="text-4xl font-bold text-stone-900 mb-4">Course Complete!</h1>
                  <p className="text-xl text-stone-600 max-w-lg mb-8 font-medium">
                    You are a Python Master! You have successfully completed all modules on Pybe.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveChapterId(chapters[0].id);
                      setCurrentLessonIndex(0);
                      setChapterCompleted(false);
                    }}
                    className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Restart Course
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6 border border-amber-300 shadow-sm">
                    <GraduationCap className="w-12 h-12 text-amber-600" />
                  </div>
                  <h1 className="text-4xl font-bold text-stone-900 mb-4">Chapter Complete!</h1>
                  <p className="text-xl text-stone-600 max-w-lg mb-8 font-medium">
                    You have mastered {activeChapter?.concept} using the theme of {activeChapter?.theme}.
                  </p>
                  <button 
                    onClick={() => {
                      const currentIndex = chapters.findIndex(c => c.id === activeChapterId);
                      if (currentIndex < chapters.length - 1) {
                        setActiveChapterId(chapters[currentIndex + 1].id);
                        setCurrentLessonIndex(0);
                        setChapterCompleted(false);
                      } else {
                        setCurrentLessonIndex(0);
                        setChapterCompleted(false);
                      }
                    }}
                    className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start Next Chapter
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key={currentLesson.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Progress Indicator */}
              <div className="absolute top-6 right-8 flex items-center gap-2 z-30">
                {activeChapter?.lessons.map((lesson, idx) => (
                  <div 
                    key={lesson.id}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentLessonIndex 
                        ? 'w-10 bg-amber-500 shadow-sm' 
                        : idx < currentLessonIndex
                        ? 'w-5 bg-emerald-500'
                        : 'w-5 bg-stone-300'
                    }`}
                  />
                ))}
              </div>
              
              {renderLesson()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
