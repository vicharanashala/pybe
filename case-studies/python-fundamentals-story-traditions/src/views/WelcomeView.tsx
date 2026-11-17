import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard } from '../components/Ornaments';
import { Compass, Sparkles } from 'lucide-react';

export const WelcomeView: React.FC<{ onBeginChronicle?: () => void }> = ({ onBeginChronicle }) => {
  const { nextStep } = useProgress();

  const handleBegin = () => {
    if (onBeginChronicle) {
      onBeginChronicle();
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 max-w-4xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full text-center relative overflow-hidden" glow={true}>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.02] pointer-events-none scale-150" aria-hidden="true">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" />
            {[...Array(24)].map((_, i) => (
              <line 
                key={i} 
                x1="50" y1="50" 
                x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)} 
                y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)} 
                stroke="currentColor" 
                strokeWidth="0.3" 
              />
            ))}
          </svg>
        </div>

        <div className="py-8 px-4 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border-2 border-royal-gold bg-parchment-light dark:bg-parchment-darkCard flex items-center justify-center mb-6 shadow-md animate-float" aria-hidden="true">
            <Compass className="w-10 h-10 text-royal-crimson dark:text-royal-gold" />
          </div>

          <p className="text-royal-crimson dark:text-royal-gold font-serif text-sm font-semibold uppercase tracking-wider mb-2">
            Welcome to PyBe
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-royal-indigo dark:text-white tracking-tight leading-none mb-6">
            The Story-Driven Path to Python Mastery
          </h1>

          <div className="h-1 w-24 bg-royal-gold mx-auto mb-8 rounded-full" aria-hidden="true"></div>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-sans mb-8">
            Step away from clinical code blocks. Enter a world of Indian storytelling, where 
            every Python concept is taught through classic narrative traditions — 
            from the royal courts of Delhi to the forest gurukuls of ancient India.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <button
              onClick={handleBegin}
              className="group relative flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-royal-crimson/30 hover:-translate-y-0.5 overflow-hidden active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Begin the PyBe learning journey"
            >
              <div className="absolute inset-0 border border-royal-gold/30 rounded-xl group-hover:border-royal-gold/60 transition-colors duration-300" aria-hidden="true"></div>
              <span>Begin the Chronicle</span>
              <Sparkles className="w-5 h-5 text-royal-gold group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-12 flex justify-center gap-8 text-xs text-gray-500 dark:text-gray-400 list-none p-0" role="list">
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-royal-gold" aria-hidden="true"></span>
              <span>100% Story First</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-royal-crimson" aria-hidden="true"></span>
              <span>Voice Reflection</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-royal-indigo" aria-hidden="true"></span>
              <span>Simulated Playground</span>
            </li>
          </ul>
        </div>
      </ManuscriptCard>
    </div>
  );
};
