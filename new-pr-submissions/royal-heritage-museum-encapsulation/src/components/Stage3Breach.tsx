import { useState } from 'react';
import { ShieldAlert, Check, AlertTriangle, Box, Layers, Tag } from 'lucide-react';
import {
  STAGE3_CONCEPT_PAIRS,
  STAGE3_RESTORE_OPTIONS,
} from '../game/missionLogic';

interface Stage3BreachProps {
  conceptsMatched: Record<string, string>;
  attributesRestored: string[];
  onMatchConcept: (pairId: string, choice: string) => void;
  onRestoreAttribute: (optionId: string) => void;
}

const CONCEPT_CHOICES = [
  'Class (DisplayCase)',
  'Object (blue_heron_case)',
  'Attributes',
];

export function Stage3Breach({
  conceptsMatched,
  attributesRestored,
  onMatchConcept,
  onRestoreAttribute,
}: Stage3BreachProps) {
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<string>(
    'Check the breach alert, match Class vs. Object vs. Attributes, and apply only the real Blue Heron Vase values.'
  );

  const handleConceptSelect = (pairId: string, choice: string) => {
    const target = STAGE3_CONCEPT_PAIRS.find((p) => p.id === pairId);
    onMatchConcept(pairId, choice);
    if (target && target.expected === choice) {
      setActiveFeedback(`Correct! "${target.prompt}" describes ${choice}.`);
    } else {
      setActiveFeedback(`Not quite—a Class is the blueprint, an Object is the real item built from it, and Attributes are the facts inside it.`);
    }
  };

  const handleRestoreClick = (optionId: string) => {
    const opt = STAGE3_RESTORE_OPTIONS.find((o) => o.id === optionId);
    if (!opt) return;
    if (opt.isGenuine) {
      onRestoreAttribute(optionId);
      setActiveFeedback(`Restored real value: ${opt.label}. ${opt.reason}`);
    } else {
      setRejectedIds((prev) => (prev.includes(optionId) ? prev : [...prev, optionId]));
      setActiveFeedback(`Tamper warning! Rejected "${opt.label}" — ${opt.reason}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breach Alert Strip — danger stays red */}
      <section className="rounded-xl border border-[#F87171]/40 bg-[#231014] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-[#F87171] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#FCA5A5]">
              Security Breach Detected · Gallery 4, Case B
            </p>
            <p className="text-sm text-[#FEE2E2]">
              An unauthorized script overwrote <code className="font-mono-code">value</code> to{' '}
              <code className="font-mono-code text-[#FCA5A5]">100</code> and{' '}
              <code className="font-mono-code">condition</code> to{' '}
              <code className="font-mono-code text-[#FCA5A5]">&quot;Broken&quot;</code>.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono-code text-[#FCA5A5] shrink-0">
          INCIDENT · #RHM-402
        </span>
      </section>

      {/* Visual Blueprint Comparison: Class vs Object vs Attributes */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#7F9274] text-sm font-semibold">
            <Layers className="w-4 h-4" aria-hidden="true" />
            <span>Class = Blueprint</span>
          </div>
          <p className="text-xs text-[#3F493D] leading-relaxed">
            A <strong className="text-[#3F493D]">Class</strong> (<code className="font-mono-code">DisplayCase</code>) is the architectural blueprint describing what every museum case holds.
          </p>
          <pre className="font-mono-code text-xs text-[#3F493D] bg-[#F0EDE6] p-3 rounded-lg border border-[#C8D5C4]/50">
{`class DisplayCase:
    # blueprint for cases`}
          </pre>
        </div>

        <div className="rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#7F9274] text-sm font-semibold">
            <Box className="w-4 h-4" aria-hidden="true" />
            <span>Object = Real Item</span>
          </div>
          <p className="text-xs text-[#3F493D] leading-relaxed">
            An <strong className="text-[#3F493D]">Object</strong> (<code className="font-mono-code">blue_heron_case</code>) is the real display unit built from the <code className="font-mono-code">DisplayCase</code> blueprint.
          </p>
          <pre className="font-mono-code text-xs text-[#3F493D] bg-[#F0EDE6] p-3 rounded-lg border border-[#C8D5C4]/50">
{`blue_heron_case = DisplayCase()`}
          </pre>
        </div>

        <div className="rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#7F9274] text-sm font-semibold">
            <Tag className="w-4 h-4" aria-hidden="true" />
            <span>Attributes = Stored Data</span>
          </div>
          <p className="text-xs text-[#3F493D] leading-relaxed">
            <strong className="text-[#3F493D]">Attributes</strong> are the values attached inside that specific object.
          </p>
          <pre className="font-mono-code text-xs text-[#3F493D] bg-[#F0EDE6] p-3 rounded-lg border border-[#C8D5C4]/50">
{`value = 4500000
condition = "Good"
location = "Gallery 4, Case B"`}
          </pre>
        </div>
      </section>

      {/* Two-part interactive investigation */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Task A: Match Class / Object / Attributes */}
        <div className="lg:col-span-6 rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-[#3F493D]">
            1. Identify Blueprint, Object, and Attributes
          </h2>

          <div className="space-y-4">
            {STAGE3_CONCEPT_PAIRS.map((pair) => {
              const selected = conceptsMatched[pair.id];
              const isCorrect = selected === pair.expected;
              return (
                <div
                  key={pair.id}
                  className="p-4 rounded-lg bg-[#E9EFE5] border border-[#C8D5C4]/40 space-y-2.5"
                >
                  <p className="text-sm text-[#3F493D]">{pair.prompt}</p>
                  <div className="flex flex-wrap gap-2">
                    {CONCEPT_CHOICES.map((choice) => {
                      const active = selected === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => handleConceptSelect(pair.id, choice)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            active && isCorrect
                              ? 'bg-[#D6EDE0] text-[#4A7C59] border border-[#4A7C59]/50'
                              : active
                                ? 'bg-[#33161A] text-[#FCA5A5] border border-[#F87171]/50'
                                : 'bg-[#FAF7F0] text-[#3F493D] border border-[#C8D5C4]/40 hover:border-[#A8BFA3]/40'
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task B: Restore genuine attributes on blue_heron_case */}
        <div className="lg:col-span-6 rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#3F493D]">
              2. Restore Genuine Vase Attributes
            </h2>
            <span className="text-xs text-[#7B8C79] tabular-nums">
              {attributesRestored.length}/3 Restored
            </span>
          </div>
          <p className="text-xs text-[#7B8C79]">
            Click only the verified museum attributes to repair{' '}
            <code className="font-mono-code text-[#7F9274]">blue_heron_case</code>. Reject forged
            entries.
          </p>

          <div className="space-y-2.5">
            {STAGE3_RESTORE_OPTIONS.map((opt) => {
              const restored = attributesRestored.includes(opt.id);
              const rejected = rejectedIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleRestoreClick(opt.id)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    restored
                      ? 'bg-[#D6EDE0] border-[#4A7C59]/50 text-[#3F493D]'
                      : rejected
                        ? 'bg-[#2B1418] border-[#F87171]/50 text-[#FCA5A5]'
                        : 'bg-[#E9EFE5] border-[#C8D5C4]/40 text-[#3F493D] hover:border-[#A8BFA3]/40'
                  }`}
                >
                  <code className="font-mono-code text-xs sm:text-sm">{opt.label}</code>
                  {restored ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A7C59]">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      Restored
                    </span>
                  ) : rejected ? (
                    <span className="text-xs font-semibold text-[#FCA5A5]">
                      Forged · Rejected
                    </span>
                  ) : (
                    <span className="text-xs text-[#7F9274]">Inspect &amp; Apply</span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            aria-live="polite"
            className="rounded-lg bg-[#F0EDE6] border border-[#C8D5C4]/50 p-3.5 text-xs sm:text-sm text-[#3F493D] flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-[#7F9274] shrink-0 mt-0.5" aria-hidden="true" />
            <span>{activeFeedback}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
