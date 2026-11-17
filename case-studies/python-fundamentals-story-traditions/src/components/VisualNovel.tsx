import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { CharacterProfile } from '../data/curriculum';
import { characterPortrait, stableSeed } from '../utils/pollinations';
import { getCachedUrl, usePollinationsImage } from '../utils/imageCache';
import { Play, Pause, RotateCcw, Volume2, ChevronDown } from 'lucide-react';

/* ============================================================
   VisualNovelScene — Full-width illustrated background
   with large character portraits layered on top.
   ============================================================ */

interface VisualNovelSceneProps {
  sceneBgUrl: string;
  sceneAlt: string;
  characters: CharacterProfile[];
  activeSpeaker?: string;
  topicId?: string;
}

export const VisualNovelScene: React.FC<VisualNovelSceneProps> = React.memo(({
  sceneBgUrl,
  sceneAlt,
  characters,
  activeSpeaker,
  topicId,
}) => {
  const { loaded: bgLoaded, errored: bgErrored, handleLoad: handleBgLoad, handleError: handleBgError } = usePollinationsImage(sceneBgUrl);

  return (
    <div className="vn-scene-enter relative w-full overflow-hidden rounded-2xl border border-parchment-border dark:border-parchment-darkBorder shadow-2xl"
      style={{ aspectRatio: '16/7', minHeight: 260, maxHeight: 480 }}
    >
      {/* Background */}
      {!bgLoaded && (
        <div className="absolute inset-0 bg-parchment-light dark:bg-parchment-darkCard">
          <div className="absolute inset-0 animate-shimmer"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.06) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
          />
        </div>
      )}
      {bgErrored ? (
        <div className="absolute inset-0 bg-parchment-light dark:bg-parchment-darkCard flex items-center justify-center">
          <span className="text-sm text-gray-400 dark:text-gray-600 italic">Scene illustration loading...</span>
        </div>
      ) : (
        <img
          src={sceneBgUrl}
          alt={sceneAlt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
          decoding="async"
          onLoad={handleBgLoad}
          onError={handleBgError}
        />
      )}

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* Characters layered on the background */}
      <div className="absolute inset-0 flex items-end justify-center gap-2 sm:gap-4 md:gap-6 pb-8 sm:pb-12 md:pb-16 px-4">
        {characters.map((char, idx) => {
          const isSpeaking = !!activeSpeaker && activeSpeaker.toLowerCase().startsWith(char.name.toLowerCase().split(' ')[0].toLowerCase());
          const imgUrl = getCachedUrl(`${topicId || 'char'}:${char.id || char.name}`, () => characterPortrait(char.imagePrompt, stableSeed(char.name)));

          return (
            <VNovelPortrait
              key={char.id || idx}
              imgUrl={imgUrl}
              name={char.name}
              role={char.role}
              isSpeaking={isSpeaking}
              hasActiveSpeaker={!!activeSpeaker}
              index={idx}
            />
          );
        })}
      </div>

      {/* Vignette edges */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/10" />
    </div>
  );
});
VisualNovelScene.displayName = 'VisualNovelScene';


/* ============================================================
   VNovelPortrait — Large rounded anime portrait card
   Desktop 220–300px, Tablet 180px, Mobile 140px
   ============================================================ */

interface VNovelPortraitProps {
  imgUrl: string;
  name: string;
  role: string;
  isSpeaking: boolean;
  hasActiveSpeaker: boolean;
  index: number;
}

const VNovelPortrait: React.FC<VNovelPortraitProps> = React.memo(({
  imgUrl,
  name,
  role,
  isSpeaking,
  hasActiveSpeaker,
  index,
}) => {
  const { loaded, errored, handleLoad, handleError } = usePollinationsImage(imgUrl);

  // Responsive sizing: hidden on mobile unless speaking, scaled cards on larger screens
  const idleAndBlurred = hasActiveSpeaker && !isSpeaking;
  const delay = index * 0.1;

  return (
    <div
      className={`vn-portrait-enter flex flex-col items-center transition-all duration-500 ${isSpeaking ? 'vn-speaking' : ''} ${idleAndBlurred ? 'vn-idle-blur vn-idle' : 'vn-idle'} ${isSpeaking ? '' : 'hidden sm:flex'} ${index === 0 ? '' : ''}`}
      style={{
        animationDelay: `${delay}s`,
        // Responsive widths via CSS
        width: 'clamp(100px, 22vw, 200px)',
      }}
    >
      {/* Portrait Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-400 ${
          isSpeaking
            ? 'border-royal-gold shadow-lg shadow-royal-gold/30'
            : 'border-white/20 dark:border-white/10 shadow-lg shadow-black/30'
        }`}
        style={{ aspectRatio: '3/4' }}
      >
        {/* Shimmer skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-black/20">
            <div className="absolute inset-0 animate-shimmer"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
            />
          </div>
        )}

        {/* Error fallback */}
        {errored ? (
          <div className="absolute inset-0 bg-gradient-to-b from-royal-indigo/80 to-black/60 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-royal-gold/20 flex items-center justify-center mx-auto mb-2">
                <Volume2 className="w-6 h-6 text-royal-gold" />
              </div>
              <span className="text-[10px] text-white/60">{name.split(' ')[0]}</span>
            </div>
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

        {/* Speaking indicator dot */}
        {isSpeaking && (
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-royal-gold animate-pulse shadow-md shadow-royal-gold/50" />
        )}
      </div>

      {/* Name + Role label */}
      <div className={`mt-2 text-center transition-opacity duration-300 ${idleAndBlurred ? 'opacity-40' : 'opacity-100'}`}>
        <p className="text-[11px] sm:text-xs font-serif font-bold text-white drop-shadow-md leading-tight">{name.split(' ')[0]}</p>
        <p className="text-[9px] sm:text-[10px] text-white/60 dark:text-white/50 leading-tight truncate max-w-[100px]">{role}</p>
      </div>
    </div>
  );
});
VNovelPortrait.displayName = 'VNovelPortrait';


/* ============================================================
   DialogueBox — Fixed bottom panel with one bubble at a time,
   typing animation, character portrait, voice controls.
   ============================================================ */

interface DialogueBoxProps {
  speaker: string;
  text: string;
  characters: CharacterProfile[];
  isNarrator: boolean;
  onAdvance: () => void;
  canAdvance: boolean;
  isPlayingAudio: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  speechRate: number;
  onSpeedClick: () => void;
  topicId?: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  characters,
  isNarrator,
  onAdvance,
  canAdvance,
  isPlayingAudio,
  onPlayPause,
  onRestart,
  speechRate,
  onSpeedClick,
  topicId,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fullTextRef = useRef(text);

  // Find character info
  const char = isNarrator ? null : characters.find(c =>
    speaker.toLowerCase().startsWith(c.name.toLowerCase().split(' ')[0].toLowerCase())
  );
  const displayName = isNarrator ? 'Narrator' : (char?.name ?? speaker);
  const displayRole = isNarrator ? 'Storyteller' : (char?.role ?? '');
  const portraitUrl = useMemo(
    () => char ? getCachedUrl(`${topicId || 'char'}:${char.id || char.name}`, () => characterPortrait(char.imagePrompt, stableSeed(char.name))) : null,
    [char, topicId],
  );

  // Typing effect — resets when text changes
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    fullTextRef.current = text;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28); // ~35 chars/sec

    return () => clearInterval(interval);
  }, [text, speaker]);

  const skipTyping = () => {
    if (isTyping) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayedText(fullTextRef.current);
      setIsTyping(false);
    } else if (canAdvance) {
      onAdvance();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      skipTyping();
    }
  };

  return (
    <div
      className="vn-dialogue-enter relative bg-white/95 dark:bg-parchment-dark/95 backdrop-blur-md border-t-2 border-royal-gold/30 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      onClick={skipTyping}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Click to advance dialogue"
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-5 py-3 sm:py-4 flex gap-3 sm:gap-4 items-start">
        {/* Character Portrait — left side */}
        {portraitUrl ? (
          <div className="vn-portrait-enter flex-shrink-0 hidden sm:block">
            <div className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              isSpeakingActive(speaker, isPlayingAudio) ? 'border-royal-gold shadow-md shadow-royal-gold/20' : 'border-parchment-border dark:border-parchment-darkBorder'
            }`}>
              <img
                src={portraitUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 hidden sm:block">
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-gradient-to-b from-royal-indigo/80 to-black/60 border-2 border-royal-gold/30 flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-royal-gold/60" />
            </div>
          </div>
        )}

        {/* Dialogue Content */}
        <div className="flex-1 min-w-0">
          {/* Speaker Name */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider ${
              isNarrator ? 'text-gray-400 dark:text-gray-500 italic' : 'text-royal-crimson dark:text-royal-gold'
            }`}>
              {isNarrator ? `~ ${displayName} ~` : displayName}
            </span>
            {displayRole && (
              <span className="text-[9px] text-gray-400 dark:text-gray-600 hidden md:inline">· {displayRole}</span>
            )}
          </div>

          {/* Dialogue Text with typing effect */}
          <p className={`text-sm sm:text-base leading-relaxed min-h-[2.5rem] ${
            isNarrator ? 'italic text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200 font-medium'
          } ${isTyping ? 'vn-typing-cursor' : ''}`}>
            {displayedText}
          </p>
        </div>

        {/* Voice Controls — right side */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
              className={`p-1.5 rounded-lg transition-all shadow ${
                isPlayingAudio
                  ? 'bg-royal-indigo text-white hover:bg-royal-indigoHover'
                  : 'bg-royal-crimson text-white hover:bg-royal-crimsonHover'
              }`}
              aria-label={isPlayingAudio ? 'Pause narration' : 'Play narration'}
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRestart(); }}
              className="p-1.5 rounded-lg border border-parchment-border dark:border-parchment-darkBorder text-gray-400 hover:text-royal-indigo dark:hover:text-royal-gold transition-colors"
              aria-label="Restart narration"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSpeedClick(); }}
            className="text-[9px] font-mono text-gray-400 dark:text-gray-500 hover:text-royal-gold transition-colors"
            aria-label={`Narration speed: ${speechRate}x`}
          >
            {speechRate}x
          </button>
        </div>
      </div>

      {/* Click to advance hint */}
      {canAdvance && !isTyping && (
        <div className="absolute bottom-1 right-4 vn-advance-hint">
          <ChevronDown className="w-4 h-4 text-royal-gold/50" />
        </div>
      )}
    </div>
  );
};

function isSpeakingActive(speaker: string, isPlayingAudio: boolean): boolean {
  return isPlayingAudio && speaker !== 'narrator';
}
