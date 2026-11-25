import React, { useEffect } from 'react';
import { DrMeera } from '../svg/Characters';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';
import { FIXED_CHECKER_CODE, runCheckWash } from '../../utils/pyodide';

interface Screen9FixCodeProps {
  editStep: 'rule' | 'operator' | 'guard' | 'done';
  verifiedRows: Array<{ seconds: number; output: string }>;
  onEditStepChange: (step: 'rule' | 'operator' | 'guard' | 'done') => void;
  onVerifiedRowsChange: (rows: Array<{ seconds: number; output: string }>) => void;
  onNext: () => void;
}

const GUARD_SNIPPET = `    if seconds < 0 or seconds > 60:
        return "Sensor error"`;

export const Screen9FixCode: React.FC<Screen9FixCodeProps> = ({
  editStep,
  verifiedRows,
  onEditStepChange,
  onVerifiedRowsChange,
  onNext,
}) => {
  useEffect(() => {
    if (editStep !== 'done' || verifiedRows.length > 0) return;
    let active = true;
    const edgeValues = [20, -5, 999];
    void Promise.all(
      edgeValues.map(async (sec) => ({
        seconds: sec,
        output: await runCheckWash(FIXED_CHECKER_CODE, sec),
      }))
    ).then((rows) => {
      if (active) onVerifiedRowsChange(rows);
    });

    return () => {
      active = false;
    };
  }, [editStep, verifiedRows.length, onVerifiedRowsChange]);

  const handleTapOperator = () => {
    if (editStep !== 'operator') return;
    onEditStepChange('guard');
  };

  const handleTapGuard = () => {
    if (editStep !== 'guard') return;
    onEditStepChange('done');
  };

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full animate-slide-in-up">
      {/* Dedicated Code View: Dr. Meera + Clinic Rules on Left, Large Interactive Code Card on Right */}
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C]">
        {/* Clinic Wall & Floor Backdrop */}
        <svg
          viewBox="0 0 1000 520"
          className="absolute inset-0 w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <rect width="1000" height="360" fill="#A8D8E8" />
          <rect y="200" width="1000" height="160" fill="#7FC4D6" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#24303C" strokeWidth="4" />
          <rect y="360" width="1000" height="160" fill="#F5EFE0" />
          <line x1="0" y1="360" x2="1000" y2="360" stroke="#24303C" strokeWidth="4" />
        </svg>

        <div className="relative z-10 h-full w-full flex flex-col lg:flex-row items-stretch justify-between gap-3 sm:gap-5 p-3 sm:p-5 min-h-0">
          {/* Left Column: Clinic Rules Card (with newly added Sensor error line) + Dr. Meera */}
          <div className="w-full lg:w-[31%] flex flex-row lg:flex-col items-end lg:items-center justify-between gap-2 shrink-0 min-h-0">
            <div className="w-[58%] lg:w-full bg-[#FFFDF7] border-[3.5px] border-[#24303C] rounded-2xl p-2.5 sm:p-3.5 shadow-[0_4px_0_#24303C]">
              <div className="bg-[#D9544D] text-[#FFFDF7] font-display font-extrabold text-xs sm:text-sm px-3 py-1 rounded-lg border-2 border-[#24303C] text-center mb-1.5">
                Clinic Rules
              </div>
              <ul className="space-y-1 text-xs sm:text-sm font-bold text-[#24303C]">
                <li>20 seconds or more = Well done!</li>
                <li>Under 20 = Wash again.</li>
                <li
                  className={`rounded-lg px-2 py-1 transition-colors ${
                    editStep === 'rule'
                      ? 'animate-slide-in-up bg-[#FFE38E]/55 border-2 border-[#E8A33D] text-[#B32E27]'
                      : 'text-[#B32E27]'
                  }`}
                >
                  Below 0 or above 60 = Sensor error
                </li>
              </ul>
            </div>

            <div className="w-[32%] lg:w-[64%] max-w-[165px] shrink-0">
              <DrMeera
                mood={editStep === 'done' ? 'happy' : 'curious'}
                className="w-full h-auto max-h-[34dvh] drop-shadow-sm"
              />
            </div>
          </div>

          {/* Right Column: Large Guided Code Card (scrolls internally if needed) */}
          <div className="flex-1 min-h-0 rounded-3xl border-[4px] border-[#24303C] bg-[#FFFDF7] shadow-[0_6px_0_#24303C] p-4 sm:p-5 flex flex-col justify-between gap-2.5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-[#24303C]/15 mb-2.5">
                <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#24303C]">
                  Sink Checker Code
                </h2>
                <span className="text-xs sm:text-sm font-bold text-[#465A69]">
                  {editStep === 'rule'
                    ? 'New Rule Added'
                    : editStep === 'operator'
                    ? 'Step 1 of 2'
                    : editStep === 'guard'
                    ? 'Step 2 of 2'
                    : 'Fixed'}
                </span>
              </div>

              <div className="bg-[#24303C] border-[3px] border-[#24303C] rounded-2xl p-3.5 sm:p-4 text-[#F5EFE0]">
                {editStep === 'done' ? (
                  <pre className="font-mono text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto m-0 text-[#F5EFE0]">
                    <code>{FIXED_CHECKER_CODE}</code>
                  </pre>
                ) : (
                  <div className="font-mono text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre overflow-x-auto">
                    <div>def check_wash(seconds):</div>
                    {editStep === 'guard' && (
                      <div className="my-1 px-2 py-1 rounded-lg border-2 border-dashed border-[#E8A33D] bg-[#E8A33D]/10 text-[#FFE38E] text-xs sm:text-sm">
                        {'    # Tap the line below to add here'}
                      </div>
                    )}
                    <div className="flex items-center flex-wrap">
                      <span>{'    if seconds '}</span>
                      {editStep === 'operator' ? (
                        <button
                          type="button"
                          onClick={handleTapOperator}
                          className="btn-press-spring cursor-pointer mx-1 px-2.5 py-0.5 rounded-lg bg-[#E8A33D] hover:bg-[#f2b354] text-[#24303C] font-bold border-2 border-[#FFFDF7] shadow-[0_2px_0_#FFFDF7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7FC4D6]"
                          aria-label="Change greater than to greater than or equal"
                        >
                          &gt;
                        </button>
                      ) : editStep === 'rule' ? (
                        <span className="mx-1 font-bold text-[#FFE38E]">&gt;</span>
                      ) : (
                        <span className="mx-1 px-2 py-0.5 rounded-lg bg-[#3E9A4D] text-[#FFFDF7] font-bold">
                          &gt;=
                        </span>
                      )}
                      <span>{' 20:'}</span>
                    </div>
                    <div>{'        return "Well done!"'}</div>
                    <div>{'    else:'}</div>
                    <div>{'        return "Wash again."'}</div>
                  </div>
                )}
              </div>
            </div>

            {editStep === 'rule' && (
              <div className="bg-[#F5EFE0] border-2 border-[#24303C]/20 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#24303C]">
                Dr. Meera added <span className="font-bold text-[#B32E27]">Below 0 or above 60 = Sensor error</span> to the Clinic Rules chart.
              </div>
            )}

            {editStep === 'operator' && (
              <div className="bg-[#F5EFE0] border-2 border-[#24303C]/20 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#24303C]">
                Tap <span className="font-mono font-bold bg-[#E8A33D] px-2 py-0.5 rounded border border-[#24303C]">&gt;</span> in the code above to change it to <span className="font-mono font-bold">&gt;=</span>.
              </div>
            )}

            {editStep === 'guard' && (
              <button
                type="button"
                onClick={handleTapGuard}
                className="btn-press-spring animate-slide-in-up text-left cursor-pointer bg-[#F5EFE0] hover:bg-[#EAE1CC] border-[3px] border-[#24303C] rounded-2xl px-4 py-2.5 shadow-[0_4px_0_#24303C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8A33D]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-bold text-xs sm:text-sm text-[#D9544D]">
                    Tap to add at the top of the function:
                  </span>
                  <span className="text-xs font-bold text-[#3E9A4D]">+ Add Line</span>
                </div>
                <pre className="font-mono text-xs sm:text-sm text-[#24303C] bg-[#FFFDF7] rounded-xl p-2 border-2 border-[#24303C]/20 m-0 overflow-x-auto">
                  <code>{GUARD_SNIPPET}</code>
                </pre>
              </button>
            )}

            {editStep === 'done' && (
              <div className="animate-slide-in-up grid grid-cols-3 gap-2 text-xs sm:text-sm">
                {verifiedRows.map((row) => (
                  <div
                    key={row.seconds}
                    className="flex flex-col bg-[#F5EFE0] rounded-xl px-3 py-2 border-2 border-[#3E9A4D]/50"
                  >
                    <span className="font-mono font-bold text-[#24303C] tabular-nums">
                      {row.seconds}s
                    </span>
                    <span className="font-semibold text-[#3E9A4D] truncate">
                      {row.output}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          editStep === 'rule' ? (
            <ClinicButton variant="amber" onClick={() => onEditStepChange('operator')}>
              Next
            </ClinicButton>
          ) : editStep === 'done' ? (
            <ClinicButton variant="green" onClick={onNext}>
              Next
            </ClinicButton>
          ) : null
        }
      >
        {editStep === 'rule' && (
          <>
            &ldquo;Let&apos;s add a new rule to the Clinic Rules chart: <strong>Below 0 or above 60 = Sensor error</strong>. Now let&apos;s update the code to match.&rdquo;
          </>
        )}
        {editStep === 'operator' && (
          <>
            First, let&apos;s fix the 20-second edge. Tap <strong>&gt;</strong> in the code to change it to <strong>&gt;=</strong>.
          </>
        )}
        {editStep === 'guard' && (
          <>
            Now tap the sensor-error check to add it right at the top of the function.
          </>
        )}
        {editStep === 'done' && (
          <>&ldquo;Now the checker does what the sign says.&rdquo;</>
        )}
      </DialogueBox>
    </div>
  );
};
