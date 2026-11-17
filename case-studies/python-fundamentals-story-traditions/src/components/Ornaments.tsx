import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { Sun, Moon, Check, Award, Compass, BookOpen, Key, Terminal, Code, Cpu, Trophy, Layers } from 'lucide-react';
import { getTraditionTheme } from '../utils/storyThemes';
import { characterPortrait, stableSeed } from '../utils/pollinations';
import { getCachedUrl, usePollinationsImage } from '../utils/imageCache';
import type { TopicDefinition, CharacterProfile } from '../data/curriculum';
import { getCurrentPedagogyStage } from '../data/pedagogy';

// Elegant wrapper mimicking ancient Indian scrolls or court letters
export const ManuscriptCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}> = React.memo(({ children, className = '', glow = false }) => {
  return (
    <div className={`manuscript-card rounded-2xl shadow-xl p-6 md:p-8 border-2 transition-all duration-300 relative overflow-hidden ${
      glow ? 'animate-pulse-gold border-royal-gold/60' : 'border-parchment-border dark:border-parchment-darkBorder'
    } ${className}`}>
      {/* Decorative Corner Ornaments */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-royal-gold rounded-tl-lg pointer-events-none opacity-60"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-royal-gold rounded-tr-lg pointer-events-none opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-royal-gold rounded-bl-lg pointer-events-none opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-royal-gold rounded-br-lg pointer-events-none opacity-60"></div>
      
      {/* Ornate Inner Border Line */}
      <div className="border border-royal-gold/20 p-2 md:p-4 rounded-xl h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
});

// Stepper bar showing 12 chapters of the learning journey
export const ProgressTracker: React.FC = () => {
  const { currentStep, completedSteps, setStep } = useProgress();
  const currentPedagogy = getCurrentPedagogyStage(currentStep);
  
  const stepsList = [
    { title: "Welcome", icon: Compass },
    { title: "Topics", icon: BookOpen },
    { title: "Story", icon: BookOpen },
    { title: "Problem", icon: HelpCircleIcon },
    { title: "Solution", icon: Key },
    { title: "Reflect", icon: Cpu },
    { title: "Mentor", icon: Award },
    { title: "Bridge", icon: SparklesIcon },
    { title: "Learn", icon: BookOpen },
    { title: "Practice", icon: Terminal },
    { title: "Challenge", icon: Code },
    { title: "Mastery", icon: Award },
    { title: "Advisor", icon: Award },
    { title: "Complete", icon: Trophy },
    { title: "Dashboard", icon: Layers },
  ];

  return (
    <nav className="w-full bg-parchment-card dark:bg-parchment-darkCard border-b border-parchment-border dark:border-parchment-darkBorder px-4 py-3 select-none" aria-label="Learning journey progress">
      <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-thin py-1" role="list">
        {stepsList.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = idx === currentStep;
          const isCompleted = completedSteps[idx] && idx < currentStep;

          return (
            <div 
              key={idx} 
              role="listitem"
              onClick={() => {
                if (isCompleted || idx <= currentStep) {
                  setStep(idx);
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && (isCompleted || idx <= currentStep)) {
                  e.preventDefault();
                  setStep(idx);
                }
              }}
              tabIndex={(isCompleted || idx <= currentStep) ? 0 : -1}
              className={`flex items-center flex-shrink-0 cursor-pointer group transition-all duration-300 mx-1 md:mx-2 ${
                idx === stepsList.length - 1 ? '' : 'flex-1'
              }`}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Step ${idx + 1}: ${step.title}${isCompleted ? ' (completed)' : ''}${isActive ? ' (current)' : ''}`}
            >
              <div className="flex flex-col items-center relative">
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center text-[10px] md:text-xs font-semibold z-10 transition-all duration-300 ${
                  isActive 
                    ? 'bg-royal-crimson text-white border-royal-crimson scale-110 shadow-md ring-2 ring-royal-gold/50' 
                    : isCompleted
                      ? 'bg-royal-gold text-royal-indigo border-royal-gold'
                      : 'bg-white dark:bg-parchment-dark text-gray-400 dark:text-gray-600 border-parchment-border dark:border-parchment-darkBorder group-hover:border-royal-crimson/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-crimson'
                }`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <StepIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                </div>
                <span className={`text-[9px] md:text-[10px] font-medium mt-1 absolute -bottom-5 whitespace-nowrap transition-colors duration-300 hidden sm:block ${
                  isActive 
                    ? 'text-royal-crimson dark:text-royal-gold font-semibold' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-royal-crimson'
                }`}>
                  {step.title}
                </span>
              </div>
              
              {idx !== stepsList.length - 1 && (
                <div className={`hidden md:block h-0.5 w-full mx-2 transition-colors duration-300 ${
                  isCompleted ? 'bg-royal-gold' : 'bg-parchment-border dark:bg-parchment-darkBorder'
                }`} aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
      {currentStep > 0 && currentStep < 15 && (
        <div className="flex items-center justify-center gap-2 mt-1" aria-label={`Current learning stage: ${currentPedagogy.name}`}>
          <span className={`text-[10px] font-semibold ${currentPedagogy.color}`}>{currentPedagogy.sanskrit}</span>
          <span className="text-[9px] text-gray-400 dark:text-gray-500">·</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 italic">{currentPedagogy.description}</span>
        </div>
      )}
      <div className="h-4 hidden sm:block" aria-hidden="true"></div>
    </nav>
  );
};

// Application Main Header with Theme Switcher
export const Header: React.FC = () => {
  const { theme, toggleTheme, resetAll } = useProgress();

  return (
    <header className="w-full bg-parchment-light dark:bg-parchment-dark border-b border-parchment-border dark:border-parchment-darkBorder px-6 py-4 flex items-center justify-between z-30 select-none" role="banner">
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={resetAll}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); resetAll(); } }}
        tabIndex={0}
        role="button"
        aria-label="Reset and return to welcome"
      >
        <div className="w-10 h-10 rounded-xl bg-royal-crimson flex items-center justify-center shadow-lg border border-royal-gold/40 rotate-3 group-hover:rotate-12 transition-transform duration-300">
          <span className="text-white font-serif text-xl font-bold italic" aria-hidden="true">Py</span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-royal-crimson dark:text-royal-gold tracking-wide m-0">
            PyBe
          </h1>
          <p className="text-[10px] md:text-xs font-sans text-gray-500 dark:text-gray-400 tracking-wider uppercase font-medium">
            Sanskrit of Scripting
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-parchment-card dark:bg-parchment-darkCard border border-parchment-border dark:border-parchment-darkBorder hover:text-royal-crimson dark:hover:text-royal-gold hover:scale-105 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-crimson"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-royal-indigo" aria-hidden="true" />
          ) : (
            <Sun className="w-5 h-5 text-royal-gold" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
};

// Animated Score Gauge for AI Feedback Metrics
export const ScoreGauge: React.FC<{
  label: string;
  score: number;
  colorClass?: string;
  delayMs?: number;
}> = ({ label, score, colorClass = 'bg-royal-crimson', delayMs = 0 }) => {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(score);
    }, delayMs + 100);
    return () => clearTimeout(timer);
  }, [score, delayMs]);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-royal-crimson dark:text-royal-gold font-semibold">{score}/100</span>
      </div>
      <div className="w-full bg-parchment-border dark:bg-parchment-darkBorder h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

// Helper SVG Icons to avoid import issues
const HelpCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
  </svg>
);

export const StoryHeader: React.FC<{ topic: TopicDefinition }> = React.memo(({ topic }) => {
  const theme = getTraditionTheme(topic.storyWorld.storyTradition);
  return (
    <div className="text-center mb-6 animate-fade-in" role="heading" aria-level={1}>
      <span className={`${theme.accentText} font-serif text-sm font-semibold uppercase tracking-widest`}>
        {theme.icon} {theme.label}
      </span>
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-royal-indigo dark:text-white mt-1">
        {topic.narrativeTitle}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
        Teaching {topic.title}
      </p>
      <div className="w-12 h-0.5 bg-royal-gold mx-auto mt-2" aria-hidden="true"></div>
    </div>
  );
});

export const StoryProgression: React.FC<{
  current: number;
  total: number;
  storyTitle: string;
  mentorName: string;
  traditionLabel: string;
}> = React.memo(({ current, total, storyTitle, mentorName, traditionLabel }) => (
  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4" aria-label={`Scene ${current} of ${total}`}>
    <span>Scene {current} of {total}</span>
    <span className="hidden sm:inline" aria-hidden="true">·</span>
    <span className="hidden sm:inline">{storyTitle}</span>
    <span className="hidden sm:inline" aria-hidden="true">·</span>
    <span className="hidden sm:inline">{mentorName}</span>
    <span className="hidden sm:inline" aria-hidden="true">·</span>
    <span className="hidden sm:inline">{traditionLabel}</span>
  </div>
));

export const StoryCharacterRenderer: React.FC<{
  characters: CharacterProfile[];
  activeSpeaker?: string;
  size?: 'sm' | 'md' | 'lg';
  topicId?: string;
}> = React.memo(({ characters, activeSpeaker, size = 'md', topicId }) => {
  const sizeMap = {
    sm: { container: 'w-10 h-10', label: 'text-[8px]' },
    md: { container: 'w-14 h-14', label: 'text-[9px]' },
    lg: { container: 'w-20 h-20', label: 'text-[10px]' },
  };
  const s = sizeMap[size];

  return (
    <div className="flex items-center justify-around gap-4" role="group" aria-label="Story characters">
      {characters.map((char, idx) => {
        const isActive = activeSpeaker && activeSpeaker.toLowerCase().startsWith(char.name.toLowerCase().split(' ')[0].toLowerCase());
        const imgUrl = getCachedUrl(`${topicId || 'char'}:${char.id || char.name}`, () => characterPortrait(char.imagePrompt, stableSeed(char.name)));
        return (
          <CharacterPortrait
            key={idx}
            imgUrl={imgUrl}
            name={char.name}
            role={char.role}
            illustrationPrompt={char.illustrationPrompt}
            isActive={!!isActive}
            sizeClass={s.container}
            labelClass={s.label}
          />
        );
      })}
    </div>
  );
});

const CharacterPortrait: React.FC<{
  imgUrl: string;
  name: string;
  role: string;
  illustrationPrompt: string;
  isActive: boolean;
  sizeClass: string;
  labelClass: string;
}> = ({ imgUrl, name, role, illustrationPrompt, isActive, sizeClass, labelClass }) => {
  const { loaded, errored, handleLoad, handleError } = usePollinationsImage(imgUrl);

  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
      <div
        title={errored ? `${name} — image unavailable` : illustrationPrompt}
        className={`${sizeClass} rounded-full overflow-hidden border-2 ${isActive ? 'border-royal-gold shadow-lg shadow-royal-gold/20' : 'border-parchment-border dark:border-parchment-darkBorder'} transition-all duration-300 relative`}
      >
        {!loaded && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-parchment-light dark:bg-parchment-darkCard" />
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.08) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        )}
        {errored ? (
          <div className="absolute inset-0 flex items-center justify-center bg-parchment-light dark:bg-parchment-darkCard">
            <span className="text-[8px] text-gray-400 dark:text-gray-600">?</span>
          </div>
        ) : (
          <img
            src={imgUrl}
            alt={`${name} — ${role}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
      <span className={`${labelClass} font-semibold text-gray-500 uppercase tracking-widest mt-1 max-w-[80px] text-center leading-tight`}>
        {name.split(' ')[0]}
      </span>
    </div>
  );
};

export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  rounded?: boolean;
}> = React.memo(({ src, alt, className = '', skeletonClassName = '', rounded = false }) => {
  const { loaded, errored, handleLoad, handleError } = usePollinationsImage(src);

  const radius = rounded ? 'rounded-full' : '';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className={`absolute inset-0 overflow-hidden ${radius} ${skeletonClassName}`}>
          <div className="absolute inset-0 bg-parchment-light dark:bg-parchment-darkCard" />
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.08) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      )}
      {errored ? (
        <div className={`absolute inset-0 flex items-center justify-center bg-parchment-light dark:bg-parchment-darkCard ${radius}`}>
          <span className="text-xs text-gray-400 dark:text-gray-600">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${rounded ? 'rounded-full' : ''}`}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});
