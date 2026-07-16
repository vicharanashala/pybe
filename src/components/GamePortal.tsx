import { useState } from 'react';
import { GameModeChallenge, UserProgress } from '../types';
import { GAME_CHALLENGES } from '../predefinedData';
import { ShieldAlert, Trophy, Zap, Play, HelpCircle, Check, RefreshCw, Lock, Sparkles, Sword } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { motion, AnimatePresence } from 'motion/react';

interface GamePortalProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export default function GamePortal({ progress, onUpdateProgress }: GamePortalProps) {
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [success, setSuccess] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const activeChallenge = GAME_CHALLENGES[activeGameIndex];
  const isChallengeCompleted = progress.completedChallenges.includes(activeChallenge.id);

  const handleGameSuccess = (stdout: string) => {
    // Basic output checks
    const cleanedOut = stdout.trim();
    if (activeChallenge.expectedOutput && cleanedOut.includes(activeChallenge.expectedOutput)) {
      setSuccess(true);
      setErrorFeedback(null);

      // Reward XP & save completion status
      if (!isChallengeCompleted) {
        onUpdateProgress((prev) => {
          const nextXP = prev.xp + 80; // Games reward higher XP
          const nextCompleted = [...prev.completedChallenges, activeChallenge.id];

          // Add a badge depending on the game
          const nextBadges = [...prev.badges];
          let newBadge = "Game Challenger";
          if (activeChallenge.mode === 'boss_fight') newBadge = "Ender Dragon Slayer";
          if (activeChallenge.mode === 'treasure_hunt') newBadge = "Crypto Safe Cracker";
          if (activeChallenge.mode === 'code_puzzle') newBadge = "Hogwarts Spell Assembler";
          
          if (!nextBadges.includes(newBadge)) {
            nextBadges.push(newBadge);
          }

          return {
            ...prev,
            xp: nextXP,
            completedChallenges: nextCompleted,
            badges: nextBadges
          };
        });
      }
    } else {
      setSuccess(false);
      setErrorFeedback(`Incorrect output. We expected to see "${activeChallenge.expectedOutput}", but received: "${cleanedOut}". Try checking your syntax or values!`);
    }
  };

  const resetGame = () => {
    setSuccess(false);
    setErrorFeedback(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6" id="games-view">
      {/* Game Selection Map */}
      <div className="mb-8 bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sword className="h-5 w-5 text-rose-500" />
          <h2 className="text-sm font-bold text-slate-200">Select Game Arena:</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {GAME_CHALLENGES.map((challenge, index) => {
            const completed = progress.completedChallenges.includes(challenge.id);
            const active = index === activeGameIndex;
            return (
              <button
                key={challenge.id}
                onClick={() => {
                  setActiveGameIndex(index);
                  resetGame();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-indigo-650 text-white'
                    : completed
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {completed && <Check className="h-3 w-3" />}
                <span className="capitalize">{challenge.mode.replace(/_/g, ' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Game Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Game Details Board */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider border border-rose-100 dark:border-rose-900">
                {activeChallenge.mode.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Zap className="h-3.5 w-3.5" />
                <span>+80 XP</span>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">
              {activeChallenge.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
              {activeChallenge.description}
            </p>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-1">
              <div className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                Mission Objective:
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Make the program print exactly <code className="font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1 rounded font-bold text-indigo-500 dark:text-indigo-400">"{activeChallenge.expectedOutput}"</code>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
                <span>Scroll of Wisdom (Hint):</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {activeChallenge.hint}
              </p>
            </div>
          </div>

          {/* Success Banner Overlay */}
          {success && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-6 rounded-2xl text-center space-y-3"
            >
              <Trophy className="h-10 w-10 text-amber-500 mx-auto animate-bounce" />
              <h4 className="text-emerald-800 dark:text-emerald-400 font-extrabold text-sm md:text-base">
                Arena Conquered! +80 XP Credited
              </h4>
              <p className="text-emerald-600 dark:text-emerald-300 text-xs font-medium">
                Your Python spells have perfectly resolved! You unlocked any matching badges in your Profile dashboard.
              </p>
              <button
                onClick={() => {
                  if (activeGameIndex < GAME_CHALLENGES.length - 1) {
                    setActiveGameIndex(prev => prev + 1);
                    resetGame();
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
              >
                Next Challenge &rarr;
              </button>
            </motion.div>
          )}

          {/* Error Banner */}
          {errorFeedback && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 p-4 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
              <ShieldAlert className="h-4 w-4 text-rose-500 inline mr-1" />
              {errorFeedback}
            </div>
          )}
        </div>

        {/* Game Execution Workspace */}
        <div className="lg:col-span-8">
          <CodeEditor
            initialCode={activeChallenge.starterCode}
            onRunSuccess={handleGameSuccess}
            expectedOutputContains={activeChallenge.expectedOutput ? [activeChallenge.expectedOutput] : undefined}
            lessonContext={`Game: ${activeChallenge.title}`}
            isSecureExercise={true}
            progress={progress}
            onUpdateProgress={onUpdateProgress}
          />
        </div>
      </div>
    </div>
  );
}
