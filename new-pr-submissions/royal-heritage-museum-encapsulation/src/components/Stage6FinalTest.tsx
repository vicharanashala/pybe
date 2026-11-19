import { useState } from 'react';
import { Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { STAGE6_BLANKS, STAGE6_VECTORS } from '../game/missionLogic';

interface Stage6FinalTestProps {
  selectedBlanks: Record<string, string>;
  simulationVectorsPassed: string[];
  onSelectBlank: (blankId: string, value: string) => void;
  onPassVector: (vectorId: string) => void;
}

export function Stage6FinalTest({
  selectedBlanks,
  simulationVectorsPassed,
  onSelectBlank,
  onPassVector,
}: Stage6FinalTestProps) {
  const [wrongVectorChoices, setWrongVectorChoices] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const handleBlankPick = (blankId: string, option: string) => {
    const blank = STAGE6_BLANKS.find((b) => b.id === blankId);
    onSelectBlank(blankId, option);
    if (!blank) return;
    if (option === blank.correct) {
      setFeedback({ ok: true, text: `Correct! ${blank.explanation}` });
    } else {
      setFeedback({
        ok: false,
        text: `"${option}" is incorrect here. Hint: ${blank.prompt}`,
      });
    }
  };

  const handleVectorPick = (vectorId: string, choiceId: string) => {
    const vec = STAGE6_VECTORS.find((v) => v.id === vectorId);
    if (!vec) return;
    if (choiceId === vec.correctChoice) {
      setWrongVectorChoices((prev) => {
        const next = { ...prev };
        delete next[vectorId];
        return next;
      });
      onPassVector(vectorId);
      setFeedback({ ok: true, text: `Correct! ${vec.explanation}` });
    } else {
      setWrongVectorChoices((prev) => ({ ...prev, [vectorId]: choiceId }));
      setFeedback({
        ok: false,
        text: `Not quite: ${vec.explanation}`,
      });
    }
  };

  const allBlanksCorrect = STAGE6_BLANKS.every(
    (b) => selectedBlanks[b.id] === b.correct
  );

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Complete DisplayCase Python Blueprint */}
        <div className="lg:col-span-6 rounded-xl border border-[#A8BFA3]/40 bg-[#E9EFE5] p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#3F493D]">
              1. Complete the DisplayCase Class
            </h2>
            <span className="text-sm text-[#7B8C79] tabular-nums">
              {STAGE6_BLANKS.filter((b) => selectedBlanks[b.id] === b.correct).length}/
              {STAGE6_BLANKS.length} Complete
            </span>
          </div>

          <pre className="font-mono-code text-sm sm:text-base text-[#3F493D] bg-[#F0EDE6] p-4 rounded-lg border border-[#C8D5C4]/50 overflow-x-auto leading-relaxed">
{`${selectedBlanks['blank-class'] ?? '[ ____ DisplayCase: ]'}
    def __init__(self, artifact, value):
        self.artifact = artifact
        self.value = value
        ${selectedBlanks['blank-private'] ?? '[ self.____ = 20 ]'}

    def get_temperature(self):
        ${selectedBlanks['blank-getter'] ?? '[ return ____ ]'}

    def set_temperature(self, new_temp):
        ${selectedBlanks['blank-validation'] ?? '[ if ____: ]'}
            self.__temperature = new_temp
            return "Accepted"
        return "Rejected"

blue_heron_case = DisplayCase("Blue Heron Vase", 4500000)`}
          </pre>

          <div className="space-y-3">
            {STAGE6_BLANKS.map((blank, idx) => {
              const chosen = selectedBlanks[blank.id];
              const isCorrect = chosen === blank.correct;
              return (
                <div
                  key={blank.id}
                  className="p-3.5 rounded-lg bg-[#FAF7F0] border border-[#C8D5C4]/40 space-y-2"
                >
                  <p className="text-xs font-medium text-[#3F493D]">
                    {idx + 1}. {blank.prompt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {blank.options.map((opt) => {
                      const active = chosen === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleBlankPick(blank.id, opt)}
                          className={`px-3 py-1.5 rounded-md font-mono-code text-xs transition-colors cursor-pointer ${
                            active && isCorrect
                              ? 'bg-[#D6EDE0] text-[#4A7C59] border border-[#4A7C59]/50'
                              : active
                                ? 'bg-[#33161A] text-[#FCA5A5] border border-[#F87171]/50'
                                : 'bg-[#E9EFE5] text-[#3F493D] border border-[#C8D5C4]/40 hover:border-[#A8BFA3]/40'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Final Security Simulation */}
        <div className="lg:col-span-6 rounded-xl border border-[#A8BFA3]/40 bg-[#FAF7F0] p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#3F493D]">
              2. Final Intrusion Defense Simulation
            </h2>
            <span className="text-sm text-[#7B8C79] tabular-nums">
              {simulationVectorsPassed.length}/{STAGE6_VECTORS.length} Passed
            </span>
          </div>

          {/* Live DisplayCase Object Readout */}
          <div className="rounded-lg bg-[#E9EFE5] border border-[#A8BFA3]/40 p-3.5 grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[#7B8C79] block">Object</span>
              <span className="font-mono-code text-[#3F493D]">blue_heron_case</span>
            </div>
            <div>
              <span className="text-[#7B8C79] block">get_temperature()</span>
              <span className="font-mono-code font-semibold text-[#4A7C59]">
                {simulationVectorsPassed.includes('vec-safe') ? '21°C' : '20°C'}
              </span>
            </div>
            <div>
              <span className="text-[#7B8C79] block">Lock Status</span>
              <span className="font-medium text-[#7F9274]">
                {simulationVectorsPassed.length === STAGE6_VECTORS.length
                  ? 'All Checks Passed'
                  : 'Testing Defense'}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#3F493D]">
            {allBlanksCorrect
              ? 'Your DisplayCase class is ready! Choose what happens during each live security check:'
              : 'Complete the DisplayCase class blanks and test how the system handles all 3 security checks:'}
          </p>

          <div className="space-y-4">
            {STAGE6_VECTORS.map((vec) => {
              const passed = simulationVectorsPassed.includes(vec.id);
              return (
                <div
                  key={vec.id}
                  className={`p-4 rounded-lg border space-y-3 ${
                    passed
                      ? 'bg-[#D6EDE0] border-[#4A7C59]/40'
                      : 'bg-[#E9EFE5] border-[#C8D5C4]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <code className="font-mono-code text-xs sm:text-sm text-[#7F9274]">
                      {vec.attackCode}
                    </code>
                    {passed && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A7C59]">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#3F493D]">{vec.attackSummary}</p>

                  <div className="grid gap-2">
                    {vec.choices.map((c) => {
                      const isCorrectSelected = passed && c.id === vec.correctChoice;
                      const isWrongSelected = !passed && wrongVectorChoices[vec.id] === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleVectorPick(vec.id, c.id)}
                          className={`px-3.5 py-2.5 rounded-md text-xs text-left font-medium border transition-colors cursor-pointer ${
                            isCorrectSelected
                              ? 'bg-[#D6EDE0] border-[#4A7C59]/50 text-[#3F493D]'
                              : isWrongSelected
                                ? 'bg-[#33161A] border-[#F87171]/50 text-[#FCA5A5]'
                                : 'bg-[#FAF7F0] border-[#C8D5C4]/40 text-[#3F493D] hover:border-[#A8BFA3]/40'
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {feedback && (
            <div
              aria-live="polite"
              className={`rounded-lg p-3.5 border text-xs sm:text-sm flex items-start gap-2 ${
                feedback.ok
                  ? 'bg-[#D6EDE0] border-[#4A7C59]/40 text-[#3F493D]'
                  : 'bg-[#261115] border-[#F87171]/40 text-[#FEE2E2]'
              }`}
            >
              {feedback.ok ? (
                <ShieldCheck className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
