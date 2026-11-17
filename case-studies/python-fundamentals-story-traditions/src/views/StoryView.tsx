import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';
import { VisualNovelScene, DialogueBox } from '../components/VisualNovel';
import type { StoryScene } from '../data/learningData';
import { getTopic } from '../data/curriculum';
import { getTraditionTheme } from '../utils/storyThemes';
import { sceneBackground, stableSeed, characterPortrait } from '../utils/pollinations';
import { preloadImages, getCachedUrl } from '../utils/imageCache';
import { HelpCircle, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

function shuffleOptions(options: string[], correctIndex: number): { shuffled: string[]; newCorrectIndex: number } {
  const correct = options[correctIndex];
  const others = options.filter((_, i) => i !== correctIndex);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  const insertAt = Math.floor(Math.random() * (others.length + 1));
  const pos = insertAt === 0 ? 1 : insertAt;
  const shuffled = [...others.slice(0, pos), correct, ...others.slice(pos)];
  return { shuffled, newCorrectIndex: pos };
}

function findVoice(patterns: string[]): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  const enVoices = voices.filter(v => v.lang.startsWith('en'));
  for (const p of patterns) {
    const found = enVoices.find(v => v.name.toLowerCase().includes(p.toLowerCase()));
    if (found) return found;
  }
  return enVoices[0];
}

export const StoryView: React.FC = () => {
  const { currentStep, nextStep, prevStep, activeTopicId } = useProgress();
  const topic = getTopic(activeTopicId);
  const world = topic.storyWorld;
  const theme = getTraditionTheme(world.storyTradition);

  const isProblemStep = currentStep === 3;
  const startSceneIndex = isProblemStep ? 0 : 2;

  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(startSceneIndex);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(() => {
    const saved = localStorage.getItem('pybe-narration-speed');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const [showSpeedOptions, setShowSpeedOptions] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);

  const scene: StoryScene = topic.storyScenes[activeSceneIndex];

  const { shuffledOptions, shuffledCorrectIndex } = useMemo(() => {
    const { shuffled, newCorrectIndex } = shuffleOptions(scene.options, scene.correctIndex);
    return { shuffledOptions: shuffled, shuffledCorrectIndex: newCorrectIndex };
  }, [scene.options, scene.correctIndex, activeSceneIndex]);

  // Determine which characters are visible in this scene
  const sceneCharacters = useMemo(() => {
    return topic.characters.slice(0, 3);
  }, [topic.characters]);

  // Load voices asynchronously (Chrome loads them after page load)
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => { window.speechSynthesis.getVoices(); };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    stopNarration();
    setActiveLineIdx(null);
  }, [activeSceneIndex]);

  useEffect(() => {
    setActiveSceneIndex(startSceneIndex);
  }, [currentStep, startSceneIndex, activeTopicId]);

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Prefetch upcoming scene backgrounds
  useEffect(() => {
    const totalScenes = topic.storyScenes.length;
    const upcoming: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const nextIdx = activeSceneIndex + i;
      if (nextIdx < totalScenes) {
        upcoming.push(sceneBackground(world.sceneImagePrompt, stableSeed(topic.id + nextIdx)));
      }
    }
    // Also prefetch all character portraits
    sceneCharacters.forEach(char => {
      const url = getCachedUrl(`${topic.id}:${char.id || char.name}`, () => characterPortrait(char.imagePrompt, stableSeed(char.name)));
      if (url) upcoming.push(url);
    });
    if (upcoming.length > 0) preloadImages(upcoming);
  }, [activeSceneIndex, topic.id, topic.storyScenes.length, world.sceneImagePrompt, sceneCharacters]);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    setIsCorrect(selectedOption === shuffledCorrectIndex);
  };

  const handleNext = () => {
    stopNarration();
    if (isProblemStep && activeSceneIndex === 0) {
      setActiveSceneIndex(1);
    } else if (!isProblemStep && activeSceneIndex === 2) {
      setActiveSceneIndex(3);
    } else {
      nextStep();
    }
  };

  // Build effective dialogue: if scene has dialogue, use it; otherwise speak the narrative as one narrator line
  const effectiveDialogue = useMemo(() => {
    if (scene.dialogue.length > 0) return scene.dialogue;
    if (scene.narrative) return [{ speaker: 'narrator', text: scene.narrative }];
    return [];
  }, [scene.dialogue, scene.narrative]);

  const speakLine = useCallback((lineIdx: number) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (lineIdx >= effectiveDialogue.length) {
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
      setActiveLineIdx(null);
      return;
    }

    setActiveLineIdx(lineIdx);
    const line = effectiveDialogue[lineIdx];

    const utterance = new SpeechSynthesisUtterance(line.text);
    utteranceRef.current = utterance;

    let basePitch = 1.0;
    let baseRate = 0.95;
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (line.speaker === 'narrator') {
      basePitch = 1.0;
      baseRate = 0.92;
      selectedVoice = findVoice(['female', 'samantha', 'zira', 'google uk english female', 'moira']);
    } else {
      const charIdx = topic.characters.findIndex(c =>
        line.speaker.toLowerCase().startsWith(c.name.toLowerCase().split(' ')[0].toLowerCase())
      );
      if (charIdx === 0) {
        basePitch = 0.82;
        baseRate = 0.88;
        selectedVoice = findVoice(['male', 'daniel', 'james', 'google uk english male', 'alex']);
      } else if (charIdx === topic.characters.length - 1 && topic.characters.length > 1) {
        basePitch = 1.25;
        baseRate = 1.0;
        selectedVoice = findVoice(['karen', 'moira', 'tessa', 'fiona']);
      } else {
        basePitch = 1.05;
        baseRate = 0.95;
        selectedVoice = findVoice(['karen', 'samantha']);
      }
    }

    utterance.pitch = basePitch;
    utterance.rate = baseRate * speechRate;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => {
      if (isPlayingRef.current) {
        speakLine(lineIdx + 1);
      }
    };
    utterance.onerror = () => {
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
      setActiveLineIdx(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [effectiveDialogue, topic.characters, speechRate]);

  const startNarration = useCallback(() => {
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    speakLine(activeLineIdx !== null ? activeLineIdx : 0);
  }, [activeLineIdx, speakLine]);

  const pauseNarration = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
    }
  }, []);

  const resumeNarration = useCallback(() => {
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
    } else {
      startNarration();
    }
  }, [startNarration]);

  const stopNarration = useCallback(() => {
    isPlayingRef.current = false;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setActiveLineIdx(null);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isPlayingAudio) pauseNarration();
    else resumeNarration();
  }, [isPlayingAudio, pauseNarration, resumeNarration]);

  const handleRestart = useCallback(() => {
    window.speechSynthesis?.cancel();
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    setActiveLineIdx(0);
    speakLine(0);
  }, [speakLine]);

  const handleRateChange = useCallback((rate: number) => {
    setSpeechRate(rate);
    localStorage.setItem('pybe-narration-speed', String(rate));
    setShowSpeedOptions(false);
    if (isPlayingRef.current && activeLineIdx !== null) speakLine(activeLineIdx);
  }, [activeLineIdx, speakLine]);

  const advanceDialogue = useCallback(() => {
    const currentIdx = activeLineIdx;
    window.speechSynthesis?.cancel();
    isPlayingRef.current = false;
    setIsPlayingAudio(false);
    setActiveLineIdx(null);
    if (currentIdx !== null && currentIdx < effectiveDialogue.length - 1) {
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      speakLine(currentIdx + 1);
    }
  }, [activeLineIdx, effectiveDialogue.length, speakLine]);

  const currentLine = activeLineIdx !== null ? effectiveDialogue[activeLineIdx] : effectiveDialogue[0];
  const currentSpeaker = currentLine?.speaker || 'narrator';
  const currentText = currentLine?.text || '';
  const isNarrator = currentSpeaker === 'narrator';
  const canAdvance = activeLineIdx !== null && activeLineIdx < effectiveDialogue.length - 1;
  const totalScenes = isProblemStep ? 2 : 2;
  const sceneNumber = isProblemStep ? activeSceneIndex + 1 : activeSceneIndex - 1;

  const bgUrl = getCachedUrl(`scene:${topic.id}:${activeSceneIndex}`, () => sceneBackground(world.sceneImagePrompt, stableSeed(topic.id + activeSceneIndex)));

  return (
    <div className="flex-1 flex flex-col w-full select-none">
      {/* ===== Header Bar ===== */}
      <div className="w-full bg-parchment-card/80 dark:bg-parchment-darkCard/80 backdrop-blur-sm border-b border-parchment-border dark:border-parchment-darkBorder px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`${theme.accentBg} inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${theme.accentText} border ${theme.accentBorder} flex-shrink-0`}>
            {theme.icon} {theme.label}
          </span>
          <h2 className="text-sm sm:text-base font-serif font-bold text-royal-indigo dark:text-white truncate">
            {topic.narrativeTitle}
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
            Scene {sceneNumber}/{totalScenes}
          </span>
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600">
            {activeSceneIndex + 1}/{topic.storyScenes.length}
          </span>
        </div>
      </div>

      {/* ===== Visual Novel Scene (background + characters) ===== */}
      <div className="w-full px-2 sm:px-4 pt-2 sm:pt-3">
        <VisualNovelScene
          sceneBgUrl={bgUrl}
          sceneAlt={`${topic.narrativeTitle} — scene ${activeSceneIndex + 1}`}
          characters={sceneCharacters}
          activeSpeaker={currentSpeaker !== 'narrator' ? currentSpeaker : undefined}
          topicId={topic.id}
        />
      </div>

      {/* ===== Dialogue Box ===== */}
      <div className="w-full px-2 sm:px-4 mt-2">
        <DialogueBox
          speaker={currentSpeaker}
          text={currentText}
          characters={sceneCharacters}
          isNarrator={isNarrator}
          onAdvance={advanceDialogue}
          canAdvance={canAdvance}
          isPlayingAudio={isPlayingAudio}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
          speechRate={speechRate}
          onSpeedClick={() => setShowSpeedOptions(!showSpeedOptions)}
          topicId={topic.id}
        />
      </div>

      {/* Speed selector popup */}
      {showSpeedOptions && (
        <div className="fixed bottom-20 right-4 sm:right-8 bg-white dark:bg-parchment-darkCard rounded-xl shadow-xl border border-parchment-border dark:border-parchment-darkBorder p-2 z-50 animate-fade-in">
          {[0.8, 1.0, 1.2, 1.4].map(rate => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                speechRate === rate ? 'bg-royal-gold/10 text-royal-gold font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-parchment-dark'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      )}

      {/* ===== Story Narrative Text ===== */}
      {scene.narrative && (
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-5 mt-3">
          <div className="p-3 sm:p-4 bg-white/60 dark:bg-parchment-dark/60 rounded-xl border border-parchment-border dark:border-parchment-darkBorder">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed font-serif">
              {scene.narrative}
            </p>
          </div>
        </div>
      )}

      {/* ===== Socratic Pause + Question ===== */}
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-5 mt-3">
        {/* Socratic divider */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px bg-royal-gold/30 flex-1" />
          <div className="flex items-center gap-1.5 px-3 py-1 bg-royal-gold/10 rounded-full border border-royal-gold/30">
            <HelpCircle className="w-3.5 h-3.5 text-royal-gold" />
            <span className="text-[10px] sm:text-xs font-serif font-semibold text-royal-crimson dark:text-royal-gold tracking-wide uppercase">
              Socratic Pause
            </span>
          </div>
          <div className="h-px bg-royal-gold/30 flex-1" />
        </div>

        {/* Question */}
        <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-royal-indigo dark:text-white mb-3">
          {scene.question}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-3">
          {shuffledOptions.map((option, idx) => {
            const isSelected = selectedOption === idx;
            let buttonStyle = "border-parchment-border dark:border-parchment-darkBorder hover:border-royal-crimson dark:hover:border-royal-gold bg-white/40 dark:bg-parchment-dark/20 text-gray-700 dark:text-gray-300";
            if (isSelected) buttonStyle = "border-royal-crimson dark:border-royal-gold bg-royal-crimson/5 dark:bg-royal-gold/5 text-royal-indigo dark:text-white ring-1 ring-royal-crimson dark:ring-royal-gold";
            if (isAnswered) {
              if (idx === shuffledCorrectIndex) buttonStyle = "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 ring-1 ring-green-500";
              else if (isSelected) buttonStyle = "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 ring-1 ring-red-500";
              else buttonStyle = "opacity-60 border-parchment-border dark:border-parchment-darkBorder text-gray-400 dark:text-gray-600 bg-transparent";
            }
            return (
              <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={isAnswered}
                className={`w-full text-left p-3 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-start gap-3 ${buttonStyle}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 border font-mono ${
                  isSelected ? 'bg-royal-crimson text-white border-royal-crimson dark:bg-royal-gold dark:text-royal-indigo dark:border-royal-gold' : 'border-gray-300 text-gray-500 dark:border-gray-700'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Submit / Feedback */}
        <div className="min-h-12 flex flex-col items-stretch mb-3">
          {!isAnswered ? (
            <button onClick={checkAnswer} disabled={selectedOption === null}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                selectedOption !== null
                  ? 'bg-royal-crimson text-white hover:bg-royal-crimsonHover shadow-md hover:shadow-royal-crimson/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-parchment-darkCard dark:text-gray-600'
              }`}>
              Consult with {world.mentor.name}
            </button>
          ) : (
            <div className={`p-3 sm:p-4 rounded-xl border ${
              isCorrect
                ? 'bg-green-50/50 border-green-500/30 text-green-800 dark:bg-green-950/10 dark:text-green-300'
                : 'bg-red-50/50 border-red-500/30 text-red-800 dark:bg-red-950/10 dark:text-red-300'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                <div>
                  <h4 className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">
                    {isCorrect ? `${world.mentor.name}'s Approval` : `${world.mentor.name}'s Advice`}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isCorrect ? scene.explanation : "Not quite. Think about the evidence. Re-read the options and try again!"}
                  </p>
                </div>
              </div>
              {!isCorrect && (
                <button onClick={() => { setSelectedOption(null); setIsAnswered(false); }} className="mt-2 text-xs font-semibold text-royal-crimson dark:text-royal-gold hover:underline">
                  Rethink Option
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== Navigation ===== */}
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-5 pb-4 pt-2 flex justify-between items-center">
        <button onClick={() => {
          stopNarration();
          if (isProblemStep && activeSceneIndex === 1) setActiveSceneIndex(0);
          else if (!isProblemStep && activeSceneIndex === 3) setActiveSceneIndex(2);
          else prevStep();
        }} className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-500 hover:text-royal-indigo dark:hover:text-royal-gold transition-colors">
          <ArrowLeft className="w-4 h-4" /><span>Back</span>
        </button>
        {isCorrect && (
          <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20 text-sm">
            <span>{(isProblemStep && activeSceneIndex === 0) || (!isProblemStep && activeSceneIndex === 2) ? "Next Scene" : "Proceed"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
