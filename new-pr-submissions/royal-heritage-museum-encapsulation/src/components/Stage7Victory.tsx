import { ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { ASSET_PATHS } from '../game/assets';
import { STAGES } from '../game/missionLogic';
import { MuseumImage } from './MuseumImage';

interface Stage7VictoryProps {
  onReplayMission: () => void;
}

const CONCEPTS_MASTERED = [
  'Classes & Blueprints',
  'Objects & Instances',
  'Attributes',
  'Private Attributes (__temperature)',
  'Getters (get_temperature)',
  'Setters (set_temperature)',
  'Input Validation (18°C–22°C)',
];

export function Stage7Victory({ onReplayMission }: Stage7VictoryProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <section className="rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-6 sm:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C8D5C4]/40 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-[#4A7C59]">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Security System Status: SECURE</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#3F493D]">
              SECURITY SYSTEM RESTORED!
            </h1>
            <p className="text-base text-[#3F493D]">
              The Blue Heron Vase is now protected inside Gallery 4, Case B.
            </p>
          </div>

          <button
            type="button"
            onClick={onReplayMission}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#7F9274] hover:bg-[#6B7E63] text-white font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Replay Mission</span>
          </button>
        </div>

        {/* Center Showcase: Protected Vase + Achievement Badge + Summary */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Protected Blue Heron Vase */}
          <div className="lg:col-span-4">
            <div className="rounded-xl overflow-hidden border border-[#4A7C59]/40 bg-[#FAF7F0] relative">
              <div className="aspect-[3/4]">
                <MuseumImage
                  src={ASSET_PATHS.blueHeronVase}
                  alt="Protected Blue Heron Vase in secured glass vitrine"
                  className="w-full h-full object-cover"
                  fallbackTitle="Blue Heron Vase"
                />
              </div>
              <div className="p-4 border-t border-[#4A7C59]/25 bg-[#D6EDE0] flex items-center justify-between text-xs">
                <span className="font-medium text-[#3F493D]">Blue Heron Vase</span>
                <span className="font-semibold text-[#4A7C59]">SECURE · 20°C</span>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
            <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-[#A8BFA3]/60 shadow-2xl shadow-[#A8BFA3]/20 animate-subtle-float">
              <MuseumImage
                src={ASSET_PATHS.masterBadge}
                alt="Master of Encapsulation Achievement Badge"
                className="w-full h-full object-cover"
                fallbackTitle="Master of Encapsulation"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs tracking-[0.18em] uppercase text-[#7F9274] font-semibold">
                Achievement Badge Unlocked
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#7F9274]">
                MASTER OF ENCAPSULATION
              </h2>
            </div>
          </div>

          {/* Final Explanation + Concepts & Stages */}
          <div className="lg:col-span-4 space-y-5">
            <p className="text-sm sm:text-base text-[#3F493D] leading-relaxed">
              You successfully investigated the security breach, understood how classes and objects
              work, protected private information and built a controlled system using getters,
              setters and validation. You have completed the Encapsulation Mission!
            </p>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-[#7F9274]">
                Concepts Mastered
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#3F493D]">
                {CONCEPTS_MASTERED.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C59] shrink-0" aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Completed Stages Strip */}
        <div className="border-t border-[#C8D5C4]/40 pt-6 space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-[#7B8C79]">
            Completed Mission Stages (7/7)
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className="rounded-lg bg-[#E9EFE5] border border-[#4A7C59]/30 p-3 space-y-1"
              >
                <div className="flex items-center justify-between text-xs text-[#4A7C59] font-semibold tabular-nums">
                  <span>Stage {stage.id}</span>
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <p className="text-xs font-medium text-[#3F493D]">{stage.shortTitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
