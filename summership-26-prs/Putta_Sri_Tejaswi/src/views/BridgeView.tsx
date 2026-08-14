import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, StoryHeader } from '../components/Ornaments';
import { ArrowLeft, ArrowRight, Key, Box, Library, Search } from 'lucide-react';
import { getTopic } from '../data/curriculum';
import type { BridgeStage as CurriculumBridgeStage } from '../data/curriculum';

interface BridgeStageView extends Omit<CurriculumBridgeStage, 'icon'> {
  storyIcon: React.ReactNode;
  codeIcon: React.ReactNode;
}

const iconFor = (icon: string, code = false) => {
  if (code) return <span className="font-mono text-xl font-bold text-royal-gold">{icon === 'library' ? '{ }' : icon === 'search' ? 'code' : icon === 'key' ? 'key' : 'value'}</span>;
  if (icon === 'box') return <Box className="w-12 h-12 text-royal-indigo" />;
  if (icon === 'library') return <Library className="w-12 h-12 text-royal-gold" />;
  if (icon === 'search') return <Search className="w-12 h-12 text-green-700" />;
  return <Key className="w-12 h-12 text-royal-crimson" />;
};

export const BridgeView: React.FC = () => {
  const { nextStep, prevStep, activeTopicId } = useProgress();
  const topic = getTopic(activeTopicId);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isMorphing, setIsMorphing] = useState<boolean>(false);

  const stages: BridgeStageView[] = topic.bridge.map(({ icon: _icon, ...rest }) => ({
    ...rest, storyIcon: iconFor(_icon), codeIcon: iconFor(_icon, true),
  }));

  const handleStageChange = (idx: number) => {
    setIsMorphing(true);
    setTimeout(() => {
      setActiveStage(idx);
      setIsMorphing(false);
    }, 300);
  };

  const handleNextStage = () => {
    if (activeStage < stages.length - 1) {
      handleStageChange(activeStage + 1);
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-4xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <StoryHeader topic={topic} />

        <div className="flex justify-between border-b border-parchment-border dark:border-parchment-darkBorder pb-3 mb-8 overflow-x-auto scrollbar-thin">
          {stages.map((stage, idx) => (
            <button
              key={idx}
              onClick={() => handleStageChange(idx)}
              className={`flex-1 min-w-[120px] text-center pb-2 text-xs font-serif font-bold border-b-2 transition-all duration-300 ${
                idx === activeStage
                  ? 'border-royal-crimson dark:border-royal-gold text-royal-crimson dark:text-royal-gold scale-105'
                  : 'border-transparent text-gray-400 dark:text-gray-600 hover:text-royal-indigo'
              }`}
            >
              Stage {idx + 1}: {stage.storyLabel.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/40 dark:bg-parchment-darkCard/40 rounded-2xl border border-parchment-border dark:border-parchment-darkBorder p-8 min-h-[320px] shadow-inner relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] scale-150 pointer-events-none" aria-hidden="true">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              {[...Array(12)].map((_, i) => (
                <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(i * 30 * Math.PI / 180)} y2={50 + 40 * Math.sin(i * 30 * Math.PI / 180)} stroke="currentColor" strokeWidth="0.5"/>
              ))}
            </svg>
          </div>

          <div className={`flex flex-col items-center text-center transition-all duration-300 ${isMorphing ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
            <div className="w-24 h-24 rounded-2xl bg-parchment-light dark:bg-parchment-dark border border-parchment-border dark:border-parchment-darkBorder flex items-center justify-center mb-4 shadow-md rotate-3">
              {stages[activeStage].storyIcon}
            </div>
            <span className="text-[10px] font-semibold text-royal-crimson dark:text-royal-gold uppercase tracking-wider mb-1">Story Concept</span>
            <h3 className="text-xl font-serif font-bold text-royal-indigo dark:text-white mb-2">{stages[activeStage].storyLabel}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">{stages[activeStage].storyDesc}</p>
          </div>

          <div className={`flex flex-col items-center text-center border-t md:border-t-0 md:border-l border-parchment-border dark:border-parchment-darkBorder pt-8 md:pt-0 md:pl-8 transition-all duration-300 ${isMorphing ? 'opacity-0 scale-90 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>
            <div className="w-24 h-24 rounded-2xl bg-royal-indigo dark:bg-black/40 border border-royal-gold/20 flex items-center justify-center mb-4 shadow-lg -rotate-3">
              {stages[activeStage].codeIcon}
            </div>
            <span className="text-[10px] font-semibold text-royal-gold uppercase tracking-wider mb-1">Python Construct</span>
            <h3 className="text-xl font-serif font-bold text-white mb-2">{stages[activeStage].codeLabel}</h3>
            <p className="text-sm text-gray-300 dark:text-gray-400 max-w-xs leading-relaxed mb-4">{stages[activeStage].codeDesc}</p>
            <div className="w-full bg-black/60 rounded-lg p-3 text-left border border-royal-gold/30">
              <pre className="font-mono text-xs md:text-sm text-green-400 overflow-x-auto whitespace-pre-wrap leading-normal">{stages[activeStage].codeSyntax}</pre>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          <button onClick={() => { if (activeStage > 0) handleStageChange(activeStage - 1); else prevStep(); }}
            className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-royal-indigo transition-colors">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <button onClick={handleNextStage}
            className="flex items-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20">
            <span>{activeStage === stages.length - 1 ? "Open the Python Codex" : "Next Transformation"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};
