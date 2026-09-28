import React, { useState, useEffect } from 'react';
import { STORY_PARTS } from '../data/storyData';
import CharacterAvatar from './CharacterAvatar';
import SceneVisualFrame from './SceneVisualFrame';
import MetroJourney from './interactive/MetroJourney';
import CanteenOrders from './interactive/CanteenOrders';
import SeatGrid from './interactive/SeatGrid';
import TimelineVisualizer from './TimelineVisualizer';
import QuizGame from './QuizGame';
import PythonSandbox from './PythonSandbox';
import { MapPin, Clock, ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export default function StoryContainer({ currentChapterIdx, onSelectChapter }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [choiceFeedback, setChoiceFeedback] = useState(null);
  const [mode, setMode] = useState('story'); // 'story' | 'timeline' | 'quiz' | 'sandbox'

  const chapter = STORY_PARTS[currentChapterIdx] || STORY_PARTS[0];
  const slides = chapter.slides || [];
  const currentSlide = slides[slideIdx] || slides[0];

  // Reset slideIdx when chapter changes
  useEffect(() => {
    setSlideIdx(0);
    setSelectedChoice(null);
    setChoiceFeedback(null);
  }, [currentChapterIdx]);

  const handleNextSlide = () => {
    soundFx.playClick();
    setSelectedChoice(null);
    setChoiceFeedback(null);

    if (slideIdx < slides.length - 1) {
      setSlideIdx(prev => prev + 1);
    } else {
      // Chapter finished -> advance to next chapter or timeline
      if (currentChapterIdx < STORY_PARTS.length - 1) {
        onSelectChapter(currentChapterIdx + 1);
      } else {
        setMode('timeline');
      }
    }
  };

  const handlePrevSlide = () => {
    soundFx.playClick();
    setSelectedChoice(null);
    setChoiceFeedback(null);

    if (slideIdx > 0) {
      setSlideIdx(prev => prev - 1);
    } else if (currentChapterIdx > 0) {
      onSelectChapter(currentChapterIdx - 1);
    }
  };

  const handleSelectOption = (opt) => {
    soundFx.playClick();
    setSelectedChoice(opt.text);
    setChoiceFeedback(opt);
    if (opt.correct) {
      soundFx.playSuccess();
    } else {
      soundFx.playWarning();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-3 sm:px-6 py-4">
      
      {/* Chapter Stepper Pill Navigation */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 scrollbar-thin">
        <div className="flex items-center gap-2">
          {STORY_PARTS.map((p, idx) => {
            const isActive = idx === currentChapterIdx && mode === 'story';
            const isPassed = idx < currentChapterIdx;

            return (
              <button
                key={p.id}
                onClick={() => {
                  soundFx.playClick();
                  setMode('story');
                  onSelectChapter(idx);
                }}
                className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition whitespace-nowrap border ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30'
                    : isPassed
                    ? 'bg-stone-900 text-amber-300 border-amber-800/40'
                    : 'bg-stone-950 text-stone-500 border-stone-800'
                }`}
              >
                {idx === 0 ? 'Prologue' : `Chapter ${idx}`}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setMode('timeline');
            }}
            className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition border ${
              mode === 'timeline'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-amber-300'
            }`}
          >
            Python Reveal
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setMode('quiz');
            }}
            className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition border ${
              mode === 'quiz'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-amber-300'
            }`}
          >
            Mini-Game
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setMode('sandbox');
            }}
            className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition border ${
              mode === 'sandbox'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-amber-300'
            }`}
          >
            Code Sandbox
          </button>
        </div>
      </div>

      {/* RENDER MODES */}
      {mode === 'timeline' && <TimelineVisualizer onComplete={() => setMode('quiz')} />}
      {mode === 'quiz' && <QuizGame onComplete={() => setMode('sandbox')} />}
      {mode === 'sandbox' && <PythonSandbox />}

      {/* RENDER STORY MODE (FRAME BY FRAME COMIC SLIDES) */}
      {mode === 'story' && (
        <div className="bg-stone-950 rounded-3xl border border-amber-900/40 shadow-2xl overflow-hidden flex flex-col min-h-[640px] justify-between">
          
          {/* TOP SECTION: LARGE VISUAL ILLUSTRATION (65%–75% Height) */}
          <div className="relative h-[360px] sm:h-[440px] w-full overflow-hidden bg-stone-900">
            <SceneVisualFrame
              frameId={currentSlide.frameId}
              defaultImage={currentSlide.image || chapter.image}
              character={currentSlide.character}
            />

            {/* Scene Location Overlay Badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-amber-300 border border-amber-500/30 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> {chapter.location}
              </span>

              <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-stone-300 border border-stone-800 shadow-lg">
                {chapter.title}
              </span>
            </div>
          </div>

          {/* BOTTOM SECTION: SLIDE CONTENT & DIALOGUE */}
          <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
            
            {/* 1. DIALOGUE SLIDE MOMENT */}
            {currentSlide.type === 'dialogue' && (
              <div className="space-y-3 animate-fade-in">
                {/* Character Speaker Indicator (ONLY Name + Avatar, NO traits/bios/roles!) */}
                <CharacterAvatar charKey={currentSlide.character} size="md" />

                {/* Large Dialogue Text Bubble */}
                <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800/80 shadow-inner">
                  <p className="text-stone-100 text-lg sm:text-2xl font-medium leading-relaxed font-sans">
                    "{currentSlide.text}"
                  </p>
                </div>
              </div>
            )}

            {/* 2. INTERACTIVE CHOICE SLIDE MOMENT */}
            {currentSlide.type === 'choice' && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-amber-300 font-extrabold text-base sm:text-xl">
                  🤔 {currentSlide.question}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentSlide.options.map(opt => (
                    <button
                      key={opt.text}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-xl border font-bold text-sm text-left transition transform hover:scale-[1.02] ${
                        selectedChoice === opt.text
                          ? opt.correct
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40'
                            : 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/40'
                          : 'bg-stone-900 border-stone-800 text-stone-200 hover:border-amber-500/50 hover:text-amber-300'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>

                {choiceFeedback && (
                  <div className={`p-4 rounded-xl text-xs font-mono border flex items-center gap-2 ${
                    choiceFeedback.correct
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  }`}>
                    {choiceFeedback.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    <span>{choiceFeedback.feedback}</span>
                  </div>
                )}
              </div>
            )}

            {/* 3. METRO INTERACTIVE SLIDE */}
            {currentSlide.type === 'metro_interactive' && (
              <div className="animate-fade-in">
                <MetroJourney
                  stations={chapter.stations}
                  initialStationIdx={currentSlide.stationIdx}
                  onComplete={handleNextSlide}
                />
              </div>
            )}

            {/* 4. CANTEEN INTERACTIVE SLIDE */}
            {currentSlide.type === 'canteen_interactive' && (
              <div className="animate-fade-in">
                <CanteenOrders orders={chapter.orders} onComplete={handleNextSlide} />
              </div>
            )}

            {/* 5. SEAT GRID INTERACTIVE SLIDE */}
            {currentSlide.type === 'seat_interactive' && (
              <div className="animate-fade-in">
                <SeatGrid rows={chapter.rows} seatsPerRow={chapter.seatsPerRow} onComplete={handleNextSlide} />
              </div>
            )}

            {/* 6. DISCOVERY SLIDE */}
            {currentSlide.type === 'discovery' && (
              <div className="bg-gradient-to-br from-amber-950/80 via-stone-900 to-stone-950 p-6 rounded-2xl border border-amber-500/40 space-y-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                    <Lightbulb className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-amber-400 font-bold uppercase block">PATTERN DISCOVERY</span>
                    <h3 className="text-xl font-extrabold text-amber-200">
                      Concept: {currentSlide.conceptTitle}
                    </h3>
                  </div>
                </div>

                <p className="text-stone-300 text-sm italic">"{currentSlide.question}"</p>
                <p className="text-amber-300 text-sm font-semibold pl-3 border-l-2 border-amber-500">"{currentSlide.answer}"</p>

                {currentSlide.flowchart && (
                  <div className="bg-black/60 p-4 rounded-xl border border-stone-800 font-mono text-xs text-amber-300 space-y-1">
                    {currentSlide.flowchart.map((fc, i) => (
                      <div key={i}>{fc}</div>
                    ))}
                  </div>
                )}

                <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 text-xs sm:text-sm text-stone-200 leading-relaxed">
                  💡 {currentSlide.conceptText}
                </div>
              </div>
            )}

            {/* PROGRESS & NAVIGATION FOOTER */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-800/80">
              
              {/* Previous Button */}
              <button
                onClick={handlePrevSlide}
                disabled={currentChapterIdx === 0 && slideIdx === 0}
                className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-white disabled:opacity-30 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              {/* Story Slide Progress Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-400 font-semibold mr-1">
                  {slideIdx + 1} / {slides.length}
                </span>
                <div className="flex items-center gap-1.5 max-w-[160px] overflow-hidden">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === slideIdx
                          ? 'w-6 bg-amber-500 shadow-md shadow-amber-500/50'
                          : i < slideIdx
                          ? 'w-2 bg-amber-800'
                          : 'w-2 bg-stone-800'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextSlide}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transform transition hover:scale-105"
              >
                <span>{slideIdx < slides.length - 1 ? 'NEXT →' : 'NEXT CHAPTER →'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
