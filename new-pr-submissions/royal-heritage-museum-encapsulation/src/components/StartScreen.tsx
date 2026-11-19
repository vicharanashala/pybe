import { useEffect } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { ASSET_PATHS } from '../game/assets';
import { MuseumImage } from './MuseumImage';

interface StartScreenProps {
  mode: 'title' | 'intro';
  onStartMission: () => void;
  onContinueToBriefing: () => void;
  hasSavedProgress: boolean;
  onResumeSaved: () => void;
}

export function StartScreen({
  mode,
  onStartMission,
  onContinueToBriefing,
  hasSavedProgress,
  onResumeSaved,
}: StartScreenProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'button') return;
        e.preventDefault();
        if (mode === 'title') {
          onStartMission();
        } else {
          onContinueToBriefing();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, onStartMission, onContinueToBriefing]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#FAF7F0] flex items-center">
      {/* Full-bleed museum backdrop */}
      <div className="absolute inset-0">
        <MuseumImage
          src={ASSET_PATHS.galleryHero}
          alt="Royal Heritage Museum grand gallery at night"
          className="w-full h-full object-cover opacity-60"
          fallbackTitle="Royal Heritage Museum"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#FAF7F0] via-[#FAF7F0]/80 to-[#FAF7F0]/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0] via-transparent to-[#FAF7F0]/60"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 py-12 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left column: Title lockup or Story Intro */}
        <div className="lg:col-span-7 space-y-6">
          {mode === 'title' ? (
            <div className="space-y-6 animate-fade-slide-up">
              {/* Bespoke inline SVG museum crest */}
              <div className="flex items-center gap-3 text-[#7F9274]">
                <svg
                  viewBox="0 0 36 36"
                  className="w-9 h-9 shrink-0"
                  aria-hidden="true"
                >
                  <polygon
                    points="18,2 33,10 33,26 18,34 3,26 3,10"
                    fill="#E9EFE5"
                    stroke="#7F9274"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M18 8 L25 14 V22 C25 26 18 29 18 29 C18 29 11 26 11 22 V14 Z"
                    fill="none"
                    stroke="#7F9274"
                    strokeWidth="1.4"
                  />
                  <circle cx="18" cy="18" r="2.2" fill="#7F9274" />
                </svg>
                <span className="text-xs font-medium tracking-[0.22em] uppercase text-[#7F9274]">
                  Royal Heritage Museum · Gallery 4
                </span>
              </div>

              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.12] tracking-tight text-[#3F493D]"
                style={{ textWrap: 'balance' }}
              >
                MUSEUM SECURITY: THE ENCAPSULATION MISSION
              </h1>

              <p className="text-lg sm:text-xl text-[#3F493D] max-w-xl leading-relaxed">
                Every artifact has a secret. Every secret needs protection.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  data-start="true"
                  onClick={onStartMission}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#7F9274] hover:bg-[#6B7E63] text-white font-semibold text-base transition-colors shadow-[0_16px_30px_rgba(127,146,116,0.22)] whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B7E63]"
                >
                  <span>Start Mission</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                {hasSavedProgress && (
                  <button
                    type="button"
                    onClick={onResumeSaved}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#E9EFE5]/90 hover:bg-[#D6E0D1] text-[#3F493D] border border-[#A8BFA3]/40 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Resume Saved Mission</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-[#7B8C79] pt-4">
                Enter or Space to start · Python Object-Oriented Programming Adventure
              </p>
            </div>
          ) : (
            <div className="museum-shell bg-[#FAF7F0]/90 border border-[#A8BFA3]/40 rounded-[22px] p-7 sm:p-9 max-w-2xl space-y-6 shadow-[0_20px_40px_rgba(63,73,61,0.08)] animate-fade-slide-up">
              <div className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] uppercase text-[#7F9274]">
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span>Security Officer Dispatch</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#3F493D]">
                A Midnight Incident in Gallery 4
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-[#3F493D]">
                Welcome to the Royal Heritage Museum. You have been appointed as our new Security
                Officer. One of our most valuable artifacts has experienced an unauthorized
                modification attempt. Your mission is to investigate the incident and secure the
                Blue Heron Vase.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <button
                  type="button"
                  data-start="true"
                  onClick={onContinueToBriefing}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#7F9274] hover:bg-[#6B7E63] text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Proceed to Mission Briefing</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Protected Glass Case Showcase */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="museum-case rounded-[26px] p-3 sm:p-4 w-full max-w-sm shadow-[0_28px_50px_rgba(63,73,61,0.12)] animate-fade-slide-up">
            <div className="museum-glass aspect-[3/4] relative overflow-hidden rounded-[20px]">
              <MuseumImage
                src={ASSET_PATHS.blueHeronVase}
                alt="Blue Heron Vase inside a protected museum glass case"
                className="artifact-image w-full h-full object-cover"
                fallbackTitle="Blue Heron Vase"
              />
              <div
                className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-[#C5A46D]/25"
                aria-hidden="true"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-lg border border-[#C5A46D]/55 bg-[#FAF7F0]/80 px-4 py-3 shadow-[0_12px_20px_rgba(63,73,61,0.08)] backdrop-blur-[2px]">
                <p className="font-display text-lg font-semibold text-[#3F493D]">
                  Blue Heron Vase
                </p>
                <p className="text-[11px] text-[#3F493D] tabular-nums tracking-[0.08em] uppercase">
                  Gallery 4, Case B · Valuation ₹45,00,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
