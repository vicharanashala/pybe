import { useState } from 'react';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Static 30-minute onboarding script.
 *
 * The script is shown once per session (key: 'pybe:onboarded:v1' in
 * localStorage). It's an in-product modal — not a redirect — so the
 * learner can keep it open while exploring.
 */
const STEPS = [
  {
    title: 'What is Pybe?',
    body: 'Pybe teaches Python through case studies — small, real-world problems you solve by naming the right Python construct. There is no lecture, no syntax drill, no punishment for getting it wrong.',
    minutes: 3,
  },
  {
    title: 'Walk the three-region loop',
    body: 'For every case: read the Scenario at the top, type your reasoning, submit. The Construct reveals below. The 3-region layout (Scenario → Reasoning → Reveal) is the same on every case.',
    minutes: 5,
  },
  {
    title: 'Use the Try-it editor',
    body: 'Below the Reveal is a real Python editor. The first time you run successful Python on a case study, you earn +15 score. Pyodide loads in your browser on first click — nothing to install.',
    minutes: 5,
  },
  {
    title: 'Free navigation via the Concept Graph',
    body: 'Open /concept-graph to see all case studies as a force-directed graph. Click any node to enter. There is no fixed curriculum order — pick what excites you.',
    minutes: 5,
  },
  {
    title: 'Levels, leaderboard, feedback',
    body: 'Score is unbounded. Level 2 unlocks at 50 points, Mastery at 700+ (no upper cap). Your local dashboard at /dashboard shows your progress. The Feedback button (bottom-right) is anonymous and goes to our analytics only.',
    minutes: 5,
  },
];

export function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step]!;

  return (
    <div
      data-testid="pybe-onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            <Sparkles className="h-3 w-3" />
            30-min onboarding · step {step + 1} of {STEPS.length}
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="pybe-onboarding-close"
            className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close onboarding"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-stone-900">{current.title}</h2>
        <p className="mb-4 text-sm leading-relaxed text-stone-700">{current.body}</p>

        <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
          <span>~{current.minutes} min</span>
          <span>
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            data-testid="pybe-onboarding-prev"
            className="pybe-btn-ghost text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>

          {isLast ? (
            <Link
              to="/cases"
              onClick={onClose}
              data-testid="pybe-onboarding-finish"
              className="pybe-btn-primary text-xs"
            >
              Start learning
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              data-testid="pybe-onboarding-next"
              className="pybe-btn-primary text-xs"
            >
              Next <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}