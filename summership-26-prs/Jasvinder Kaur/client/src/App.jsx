import React, { useState, useEffect, useCallback, useRef } from 'react';
import IntroScene        from './components/IntroScene';
import CinematicScene   from './components/CinematicScene';
import MirrorMission    from './components/InteractivePlayground';
import ConceptSummary   from './components/ConceptSummary';
import RecursionChallengeQuiz from './components/RecursionChallengeQuiz';
import BackgroundParticles    from './components/BackgroundParticles';
import PortalEffect      from './components/PortalEffect';
import ArchitecturePanel from './components/ArchitecturePanel';
import { lessonsData }  from './data/lessonsData';
import { CornerDownLeft, ArrowLeft, ArrowRight, Lock, Info } from 'lucide-react';

// ── App phases ────────────────────────────────────────────────────────────────
const PHASE_INTRO   = 'intro';
const PHASE_LESSONS = 'lessons';

export default function App() {
  const [appPhase,   setAppPhase]   = useState(PHASE_INTRO);
  const [imageIndex, setImageIndex] = useState(0);
  // subStep: 0=Title, 1=Story, 2=PythonConcept, 3=KeyIdea, 4=Concept Summary (scene 7), 5=Interactive
  const [subStep,    setSubStep]    = useState(0);
  const [portalMode, setPortalMode] = useState('none'); // 'none'|'exit'|'entry'

  const [codingMissionDone, setCodingMissionDone] = useState(false);
  const [showArch,   setShowArch]   = useState(false);

  const portalActiveRef  = useRef(false);
  const imageIndexRef    = useRef(0);
  imageIndexRef.current  = imageIndex;
  const missionDoneRef   = useRef(false);
  missionDoneRef.current = codingMissionDone;

  const isPortalActive = portalMode !== 'none';
  const currentLesson  = lessonsData[imageIndex];

  // ── Begin adventure from intro ────────────────────────────────────────────
  const handleBegin = useCallback(() => {
    setAppPhase(PHASE_LESSONS);
  }, []);

  // ── Mirror Portal Transition ──────────────────────────────────────────────
  const triggerPortalToNextScene = useCallback(() => {
    if (portalActiveRef.current) return;
    if (imageIndexRef.current >= lessonsData.length - 1) return;

    portalActiveRef.current = true;
    setPortalMode('exit');

    const t1 = setTimeout(() => {
      setImageIndex(prev => prev + 1);
      setSubStep(0);
      setPortalMode('entry');
    }, 650);

    const t2 = setTimeout(() => {
      setPortalMode('none');
      portalActiveRef.current = false;
    }, 1400);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // ── MirrorMission completes → auto-portal after 2.2 s ────────────────────
  const handleMissionComplete = useCallback(() => {
    setCodingMissionDone(true);
    setTimeout(() => triggerPortalToNextScene(), 2200);
  }, [triggerPortalToNextScene]);

  // ── Advance (Enter / Next / click) ───────────────────────────────────────
  const handleAdvance = useCallback(() => {
    if (appPhase === PHASE_INTRO) { handleBegin(); return; }
    if (portalActiveRef.current) return;

    const idx    = imageIndexRef.current;
    const lesson = lessonsData[idx];

    setSubStep(prev => {
      // Lesson 7 (quiz): subStep 3 → subStep 4 (ConceptSummary), subStep 4 stays until ConceptSummary signals continue
      if (lesson.id === 7 && prev === 3) return 4;   // → Concept Summary
      if (lesson.id === 7 && prev === 4) return 5;   // → Quiz (triggered from ConceptSummary)

      // Lesson 6 (coding): subStep 3 → subStep 4 (mission), locked until done
      if (lesson.id === 6 && prev === 3) return 4;   // → Mirror Mission
      if (lesson.id === 6 && prev === 4) {
        if (!missionDoneRef.current) return prev;     // locked
        return prev;                                  // portal fires from handleMissionComplete
      }

      // Any other lesson at subStep 3 → portal
      if (prev === 3 && idx < lessonsData.length - 1) {
        setTimeout(() => triggerPortalToNextScene(), 0);
        return prev;
      }

      // Standard subStep increment (0→1→2→3)
      if (prev < 3) return prev + 1;

      return prev;
    });
  }, [appPhase, handleBegin, triggerPortalToNextScene]);

  // ── Regress (ArrowLeft / Back) ────────────────────────────────────────────
  const handleRegress = useCallback(() => {
    if (portalActiveRef.current) return;
    if (appPhase === PHASE_INTRO) return;

    setSubStep(prev => {
      if (prev > 0) return prev - 1;
      if (imageIndexRef.current > 0) {
        setImageIndex(i => i - 1);
        return 3;
      }
      return 0;
    });
  }, [appPhase]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const down = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'textarea' || tag === 'input') return;

      if (e.key === 'i' || e.key === 'I') {
        setShowArch(a => !a);
        return;
      }
      if (e.key === 'Escape') {
        setShowArch(false);
        return;
      }
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleRegress();
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [handleAdvance, handleRegress]);

  // ── CSS class for background image ───────────────────────────────────────
  let imgClass = 'cinematic-bg-img';
  if (portalMode === 'exit')  imgClass += ' portal-zoom-exit';
  if (portalMode === 'entry') imgClass += ' portal-zoom-entry';

  const handleImgError = (e) => {
    console.warn('[PyBe] Missing image:', e.target.src);
    e.target.style.display = 'none';
    e.target.parentElement.style.background =
      'linear-gradient(135deg,#050716 0%,#0A0D26 50%,#0D0F2E 100%)';
  };

  const nextLocked = currentLesson.id === 6 && subStep === 4 && !codingMissionDone;

  // ── INTRO PHASE ───────────────────────────────────────────────────────────
  if (appPhase === PHASE_INTRO) {
    return (
      <div className="w-screen h-screen fixed inset-0 overflow-hidden bg-[#050716]" style={{ height: '100dvh' }}>
        <BackgroundParticles />
        <IntroScene onBegin={handleBegin} />
      </div>
    );
  }

  // ── LESSONS PHASE ─────────────────────────────────────────────────────────
  return (
    <div
      className="w-screen h-screen fixed inset-0 overflow-hidden bg-[#050716] text-gray-100 select-none"
      style={{ height: '100dvh' }}
    >
      <BackgroundParticles />
      {isPortalActive && <PortalEffect />}

      {/* Architecture panel (press I) */}
      {showArch && <ArchitecturePanel onClose={() => setShowArch(false)} />}

      {/* Floating info button */}
      <button
        onClick={() => setShowArch(a => !a)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10
                   text-white/60 hover:text-white hover:bg-black/80 transition-all duration-200"
        title="Architecture Info (I)"
      >
        <Info className="w-4 h-4" />
      </button>

      {/* Main scene */}
      <div
        className="relative w-full h-full flex flex-col justify-between items-center z-10 cursor-pointer"
        onClick={handleAdvance}
      >
        {/* Full-screen background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            key={`bg-${currentLesson.id}`}
            src={currentLesson.image}
            alt={currentLesson.title}
            className={imgClass}
            onError={handleImgError}
          />
          <div className="cinematic-vignette" />
        </div>

        {/* TOP — scene label + title */}
        <div className="relative z-10 w-full flex flex-col items-center pt-4 md:pt-6 px-6 pointer-events-none shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300 bg-black/60 px-4 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md mb-1.5">
            Scene {currentLesson.id} of 7
          </span>
          <h1 key={`title-${currentLesson.id}-${subStep}`} className="cinematic-title text-2xl md:text-4xl">
            {currentLesson.id === 6 && subStep === 4 ? 'Bring The Mirror To Life'
              : currentLesson.id === 7 && subStep === 4 ? 'Recursion Mastery Check'
              : currentLesson.id === 7 && subStep === 5 ? 'Recursion Assessment'
              : currentLesson.title}
          </h1>
          {currentLesson.id === 6 && subStep === 4 && (
            <p className="mt-1 text-xs md:text-sm font-semibold text-purple-300/90 bg-black/50 px-3 py-0.5 rounded-full backdrop-blur-md">
              Use Python to create your own recursive reflection
            </p>
          )}
        </div>

        {/* CENTER — content area */}
        <div className="relative z-20 w-full flex-1 flex justify-center items-center px-3 py-2 min-h-0 overflow-hidden">

          {/* subStep 0 — invite prompt */}
          {subStep === 0 && !isPortalActive && (
            <div className="pybe-hint-pill animate-fade-in-scale">
              ✨ Press Enter to discover the story...
            </div>
          )}

          {/* subSteps 1–3 — environmental panels */}
          {subStep >= 1 && subStep <= 3 && !isPortalActive && (
            <CinematicScene
              key={`scene-${currentLesson.id}-${subStep}`}
              lesson={currentLesson}
              subStep={subStep}
              onAdvance={handleAdvance}
            />
          )}

          {/* Lesson 6, subStep 4 — Mirror Mission */}
          {currentLesson.id === 6 && subStep === 4 && !isPortalActive && (
            <div
              key="mission"
              className="w-full max-w-6xl z-30 pointer-events-auto h-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <MirrorMission onMissionComplete={handleMissionComplete} />
            </div>
          )}

          {/* Lesson 7, subStep 4 — Concept Summary (3 pillars) */}
          {currentLesson.id === 7 && subStep === 4 && !isPortalActive && (
            <div
              key="concept-summary"
              className="w-full max-w-4xl z-30 pointer-events-auto overflow-y-auto max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <ConceptSummary onContinue={() => setSubStep(5)} />
            </div>
          )}

          {/* Lesson 7, subStep 5 — Quiz */}
          {currentLesson.id === 7 && subStep === 5 && !isPortalActive && (
            <div
              key="quiz"
              className="w-full max-w-2xl z-30 pointer-events-auto overflow-y-auto max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <RecursionChallengeQuiz
                onAddXp={() => {}}
                onNextLesson={() => {}}
              />
            </div>
          )}
        </div>

        {/* BOTTOM — navigation */}
        <div className="relative z-10 w-full flex items-center justify-between px-6 pb-4 pointer-events-none shrink-0">

          {/* Back */}
          <div>
            {(imageIndex > 0 || subStep > 0) && (
              <button
                onClick={e => { e.stopPropagation(); handleRegress(); }}
                className="pointer-events-auto text-xs font-bold text-purple-300/80 hover:text-white
                           bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10
                           flex items-center gap-1.5 transition-all duration-200 hover:bg-black/70"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
          </div>

          {/* Centre hint */}
          <div className="cinematic-hint flex items-center gap-2">
            <span>
              {isPortalActive     ? 'Travelling through mirror portal…'
                : nextLocked      ? '🔒 Run the code to continue'
                : (currentLesson.id === 7 && (subStep === 4 || subStep === 5))
                                  ? 'Complete the section above'
                :                   'Press Enter to continue'}
            </span>
            {nextLocked
              ? <Lock className="w-3.5 h-3.5 text-amber-400" />
              : <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />}
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); handleAdvance(); }}
            disabled={nextLocked || (currentLesson.id === 7 && (subStep === 4 || subStep === 5))}
            className={`pointer-events-auto text-xs font-bold flex items-center gap-1.5
                        backdrop-blur-md px-4 py-2 rounded-full border transition-all duration-200
                        ${(nextLocked || (currentLesson.id === 7 && (subStep === 4 || subStep === 5)))
                          ? 'text-gray-500 bg-black/30 border-white/5 cursor-not-allowed opacity-40'
                          : 'text-cyan-300/80 hover:text-white bg-black/50 border-white/10 hover:bg-black/70'
                        }`}
          >
            {nextLocked ? <Lock className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            {nextLocked ? 'Locked' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
