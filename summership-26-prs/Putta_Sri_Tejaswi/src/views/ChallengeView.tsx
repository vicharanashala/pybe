import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, StoryHeader } from '../components/Ornaments';
import { Shield, Check, Play, ArrowLeft, ArrowRight } from 'lucide-react';
import { getTopic } from '../data/curriculum';
import { getTraditionTheme } from '../utils/storyThemes';

export const ChallengeView: React.FC = () => {
  const { vaultState, updateVault, completeChallenge, nextStep, prevStep, unlockBadge, activeTopicId } = useProgress();
  const topic = getTopic(activeTopicId);
  const world = topic.storyWorld;
  const theme = getTraditionTheme(world.storyTradition);
  const [activeTaskIdx, setActiveTaskIdx] = useState<number>(0);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const tasks = topic.challenges;
  const activeTask = tasks[activeTaskIdx];

  useEffect(() => {
    setSelectedBlock(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [activeTaskIdx]);

  const handleBlockSelect = (block: string) => {
    if (isSubmitted) return;
    setSelectedBlock(block);
  };

  const handleRunCode = () => {
    if (selectedBlock === null) return;
    setIsSubmitted(true);
    const correct = selectedBlock === activeTask.correctBlock;
    setIsCorrect(correct);

    if (correct) {
      completeChallenge(activeTaskIdx);
      if (activeTopicId === 'dictionaries' && activeTaskIdx === 0) updateVault('Calicut', null, 'delete');
      else if (activeTopicId === 'dictionaries' && activeTaskIdx === 1) updateVault('Kashmir', 'Saffron', 'add');
      else if (activeTopicId === 'dictionaries' && activeTaskIdx === 2) updateVault('Golconda', 'Diamonds', 'update');
    }
  };

  const handleNextChallenge = () => {
    if (activeTaskIdx < tasks.length - 1) {
      setActiveTaskIdx(activeTaskIdx + 1);
    } else {
      unlockBadge(topic.badgeName);
      nextStep();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-5xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <StoryHeader topic={topic} />

        <div className="text-center mb-6">
          <span className={`${theme.accentText} font-serif text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse-gold`}>
            <Shield className="w-4 h-4" />
            <span>The Challenge</span>
          </span>
          <h2 className="text-xl md:text-3xl font-serif font-bold text-royal-indigo dark:text-white mt-1">
            Final Challenge
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1 max-w-xl mx-auto">
            Complete all {tasks.length} tasks to earn your mastery decree.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-6">
          {/* Left panel: Task prompt & code blocks */}
          <div className={`${activeTopicId === 'dictionaries' ? 'md:col-span-7' : 'md:col-span-12'} flex flex-col justify-between`}>
            <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder shadow-inner mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-royal-crimson dark:text-royal-gold uppercase tracking-wider">
                  Task {activeTaskIdx + 1} of {tasks.length}
                </span>
                <span className="text-[10px] bg-royal-indigo text-white px-2 py-0.5 rounded font-mono">
                  {activeTask.instruction}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-serif italic">
                "{activeTask.description}"
              </p>
            </div>

            <div className="mb-6">
              <span className="text-[9px] font-bold text-royal-crimson dark:text-royal-gold uppercase tracking-widest">
                Select correct Code Block
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {activeTask.blocks.map((block, idx) => {
                  const isSelected = selectedBlock === block;
                  let style = "border-parchment-border dark:border-parchment-darkBorder hover:border-royal-crimson dark:hover:border-royal-gold bg-white/40 dark:bg-parchment-dark/10 text-gray-700 dark:text-gray-300";
                  if (isSelected) style = "border-royal-crimson dark:border-royal-gold bg-royal-crimson/5 dark:bg-royal-gold/5 text-royal-indigo dark:text-white ring-1 ring-royal-crimson dark:ring-royal-gold";
                  if (isSubmitted) {
                    if (block === activeTask.correctBlock) style = "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 ring-1 ring-green-500";
                    else if (isSelected) style = "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 ring-1 ring-red-500";
                    else style = "opacity-50 border-parchment-border dark:border-parchment-darkBorder text-gray-400 bg-transparent";
                  }
                  return (
                    <button key={idx} onClick={() => handleBlockSelect(block)} disabled={isSubmitted}
                      className={`text-left p-3.5 rounded-xl border font-mono text-xs md:text-sm transition-all duration-200 ${style}`}>
                      {block}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-h-16 flex flex-col items-stretch">
              {!isSubmitted ? (
                <button onClick={handleRunCode} disabled={selectedBlock === null}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedBlock !== null
                      ? 'bg-royal-crimson text-white hover:bg-royal-crimsonHover shadow-md hover:shadow-royal-crimson/20'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-parchment-darkCard dark:text-gray-600'
                  }`}>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute</span>
                </button>
              ) : (
                <div className={`p-4 rounded-xl border ${
                  isCorrect 
                    ? 'bg-green-50/50 border-green-500/30 text-green-800 dark:bg-green-950/10 dark:text-green-300' 
                    : 'bg-red-50/50 border-red-500/30 text-red-800 dark:bg-red-950/10 dark:text-red-300'
                }`}>
                  <div className="flex items-start gap-2">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <h4 className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">
                        {isCorrect ? "Correct!" : "Not Quite"}
                      </h4>
                      <p className="text-xs md:text-sm leading-relaxed">
                        {isCorrect ? activeTask.successMessage : "That block did not match the correct syntax. Re-read the options and retry!"}
                      </p>
                    </div>
                  </div>
                  {!isCorrect && (
                    <button onClick={() => { setSelectedBlock(null); setIsSubmitted(false); }}
                      className="mt-3 text-xs font-semibold text-royal-crimson dark:text-royal-gold hover:underline">
                      Retry Task
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Vault visualization (dictionaries only) */}
          {activeTopicId === 'dictionaries' && (
            <div className="md:col-span-5 bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder shadow-inner flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-4 border-b border-parchment-border/40 dark:border-parchment-darkBorder/40 pb-2">
                  Active Data
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(vaultState).map(([key, val]) => (
                    <div key={key} className="p-3.5 bg-parchment-light dark:bg-parchment-dark border border-royal-gold/30 rounded-xl flex flex-col items-center justify-center text-center shadow rotate-1 hover:rotate-0 transition-all duration-300 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-royal-crimson/10 border-b border-l border-royal-gold/20 flex items-center justify-center font-serif text-[10px] text-royal-crimson dark:text-royal-gold font-bold">{key.charAt(0)}</div>
                      <span className="text-2xl mb-1.5">📦</span>
                      <span className="font-mono text-[10px] font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-0.5">{key}</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{val}</span>
                    </div>
                  ))}
                </div>
                {Object.keys(vaultState).length === 0 && (
                  <div className="text-center py-12 text-gray-400 dark:text-gray-600 text-xs italic">Data store is empty.</div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-parchment-border/40 dark:border-parchment-darkBorder/40 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>Status: Synchronized</span>
                <span>Count: {Object.keys(vaultState).length} items</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          <button onClick={() => { if (activeTaskIdx > 0) setActiveTaskIdx(activeTaskIdx - 1); else prevStep(); }}
            className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-royal-indigo transition-colors">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          {isCorrect && (
            <button onClick={handleNextChallenge}
              className="flex items-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20">
              <span>{activeTaskIdx === tasks.length - 1 ? "Get Decree" : "Next Task"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </ManuscriptCard>
    </div>
  );
};
