import { ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { StageDescriptor } from '../game/missionLogic';

interface StageShellProps {
  stage: StageDescriptor;
  isComplete: boolean;
  completionSummary: string;
  onNextStage: () => void;
  nextButtonLabel?: string;
  children: ReactNode;
}

export function StageShell({
  stage,
  isComplete,
  completionSummary,
  onNextStage,
  nextButtonLabel,
  children,
}: StageShellProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Stage Narrative & Objective Banner */}
      <section className="museum-shell rounded-[22px] p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#7F9274]">
          <span className="font-medium tracking-[0.16em] uppercase tabular-nums">
            Stage {stage.id} of 7 · {stage.concept}
          </span>
          {isComplete && (
            <span className="inline-flex items-center gap-1.5 text-[#4A7C59] font-semibold">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Stage Objective Complete
            </span>
          )}
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#3F493D]">
          {stage.title}
        </h1>

        <p className="text-sm sm:text-base text-[#3F493D] max-w-3xl leading-relaxed">
          {stage.storyText}
        </p>

        <div className="gold-divider" aria-hidden="true" />

        <div className="flex items-start gap-2.5 text-sm text-[#3F493D] pt-1">
          <Compass className="w-4 h-4 text-[#7F9274] shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <span className="font-semibold text-[#3F493D]">Objective: </span>
            {stage.objective}
          </p>
        </div>
      </section>

      {/* Interactive Stage Workspace */}
      {children}

      {/* Stage Completion Callout & Next Stage CTA */}
      {isComplete && (
        <section
          aria-live="polite"
          className="rounded-xl border border-[#4A7C59]/40 bg-[#D6EDE0] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#4A7C59]">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Stage {stage.id} Cleared</span>
            </div>
            <p className="text-sm text-[#3F493D] max-w-2xl">{completionSummary}</p>
          </div>

          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#7F9274] hover:bg-[#6B7E63] text-white font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{nextButtonLabel ?? `Proceed to Stage ${stage.id + 1}`}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </section>
      )}
    </main>
  );
}
