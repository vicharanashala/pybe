import React, { useEffect, useState } from 'react';
import { DrMeera, KidCharacter } from '../svg/Characters';
import { SinkUnit } from '../svg/ClinicScenery';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';
import { KIDS } from '../../types/story';
import {
  INITIAL_CHECKER_CODE,
  expectedWashOutput,
  runCheckWash,
} from '../../utils/pyodide';

import type { PickResult8 } from '../../types/story';

interface Screen8SickNotesProps {
  picks: PickResult8[];
  onPicksChange: (picks: PickResult8[]) => void;
  onNext: () => void;
}

const WASH_TRAY = [5, 20, 30, 45, 0, -5, 60, 999];
const MAX_PICKS = 3;

const EdgeStoryCard: React.FC<{
  kind: '-5' | '999';
  isPlaying: boolean;
  onTrigger: () => void;
}> = ({ kind, isPlaying, onTrigger }) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const kidWalkOff = KIDS[3];

  useEffect(() => {
    if (!isPlaying) {
      setStep(0);
      return;
    }
    setStep(0);
    const t1 = window.setTimeout(() => setStep(1), 220);
    const t2 = window.setTimeout(() => setStep(2), 880);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isPlaying]);

  return (
    <div
      onMouseEnter={onTrigger}
      onClick={onTrigger}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTrigger();
        }
      }}
      className={`cursor-pointer bg-[#FFFDF7] border-[3px] rounded-2xl p-2.5 shadow-[0_3px_0_#24303C] transition-colors flex flex-col justify-between ${
        isPlaying ? 'border-[#D9544D]' : 'border-[#24303C]'
      }`}
    >
      <div className="flex items-center justify-between text-xs font-bold mb-1">
        <span className="font-mono font-extrabold text-sm text-[#D9544D]">{kind}s</span>
        <span className="text-[11px] text-[#465A69]">
          {isPlaying ? 'Playing...' : 'Hover or tap'}
        </span>
      </div>

      {kind === '-5' ? (
        <>
          <div className="relative h-[68px] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 260 150" className="w-full h-full" fill="none">
              <SinkUnit
                x={55}
                y={82}
                timerText={step === 0 ? '00s' : '-5s'}
                highlightTimer={step >= 1}
              />
              {step >= 1 && (
                <g>
                  <circle
                    cx="157"
                    cy="61"
                    r="13"
                    stroke="#D9544D"
                    strokeWidth="3.5"
                    strokeDasharray="4 3"
                  />
                  <text
                    x="180"
                    y="65"
                    fill="#D9544D"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight="800"
                    fontSize="12"
                  >
                    Stop first!
                  </text>
                </g>
              )}
            </svg>
          </div>
          <p className="text-[11px] font-semibold text-[#24303C] text-center leading-tight">
            Stop button fired before start (sensor glitch).
          </p>
        </>
      ) : (
        <>
          <div className="relative h-[68px] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 260 150" className="w-full h-full" fill="none">
              <SinkUnit
                x={24}
                y={82}
                timerText={step === 0 ? '24s' : step === 1 ? '184s' : '999s'}
                highlightTimer={step >= 2}
              />
            </svg>
            <div
              className="absolute bottom-0 w-[44px] transition-transform duration-700 ease-out pointer-events-none"
              style={{
                transform:
                  step === 0
                    ? 'translateX(-8px)'
                    : step === 1
                    ? 'translateX(36px)'
                    : 'translateX(76px)',
              }}
            >
              <KidCharacter kid={kidWalkOff} pose="standing" className="w-full h-auto" />
            </div>
          </div>
          <p className="text-[11px] font-semibold text-[#24303C] text-center leading-tight">
            Kid walked away without pressing stop.
          </p>
        </>
      )}
    </div>
  );
};

export const Screen8SickNotes: React.FC<Screen8SickNotesProps> = ({
  picks,
  onPicksChange,
  onNext,
}) => {
  const [runningTime, setRunningTime] = useState<number | null>(null);
  const [activeEdgeAnim, setActiveEdgeAnim] = useState<'-5' | '999' | null>(null);

  const hasMismatch = picks.some((p) => p.isMismatch);
  const pickedAllClean = picks.length === MAX_PICKS && !hasMismatch;
  const mismatchPicks = picks.filter((p) => p.isMismatch);
  const latestMismatch = mismatchPicks[mismatchPicks.length - 1];
  const hasRuleGap =
    latestMismatch?.seconds === -5 || latestMismatch?.seconds === 999;

  const handlePickTime = async (seconds: number) => {
    if (seconds === -5) setActiveEdgeAnim('-5');
    if (seconds === 999) setActiveEdgeAnim('999');

    if (runningTime !== null) return;

    const basePicks = pickedAllClean ? [] : picks;
    if (basePicks.length >= MAX_PICKS) return;
    if (basePicks.some((p) => p.seconds === seconds)) return;

    setRunningTime(seconds);

    const checkerSays = await runCheckWash(INITIAL_CHECKER_CODE, seconds);
    const shouldSay = expectedWashOutput(seconds);
    const isMismatch = checkerSays !== shouldSay;

    onPicksChange([
      ...basePicks,
      { seconds, shouldSay, checkerSays, isMismatch },
    ]);
    setRunningTime(null);
  };

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full animate-slide-in-up">
      {/* Storybook Canvas */}
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C]">
        {/* Clinic Office Wall & Desk Background */}
        <svg
          viewBox="0 0 1000 520"
          className="absolute inset-0 w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <rect width="1000" height="360" fill="#A8D8E8" />
          <rect y="220" width="1000" height="140" fill="#7FC4D6" />
          <line x1="0" y1="220" x2="1000" y2="220" stroke="#24303C" strokeWidth="4" />
          <rect y="360" width="1000" height="160" fill="#F5EFE0" />
          <line x1="0" y1="360" x2="1000" y2="360" stroke="#24303C" strokeWidth="4" />

          {/* Wooden Desk on Left */}
          <rect x="24" y="360" width="318" height="26" rx="10" fill="#E8A33D" stroke="#24303C" strokeWidth="4.5" />
          <rect x="44" y="386" width="278" height="118" fill="#D48D28" stroke="#24303C" strokeWidth="4.5" />

          {/* Pile of Sick Notes on Desk */}
          <g transform="translate(210, 306)">
            <rect x="0" y="32" width="84" height="24" rx="5" fill="#FFFDF7" stroke="#24303C" strokeWidth="3.5" transform="rotate(-4 42 44)" />
            <rect x="4" y="20" width="84" height="24" rx="5" fill="#FFFDF7" stroke="#24303C" strokeWidth="3.5" transform="rotate(3 46 32)" />
            <rect x="2" y="8" width="84" height="24" rx="5" fill="#FFFDF7" stroke="#24303C" strokeWidth="3.5" transform="rotate(-2 44 20)" />
            <rect x="6" y="-4" width="84" height="24" rx="5" fill="#FFFDF7" stroke="#24303C" strokeWidth="3.5" transform="rotate(2 48 8)" />
            <path d="M22 4 H36 M29 -3 V11" stroke="#D9544D" strokeWidth="4" strokeLinecap="round" />
            <line x1="46" y1="3" x2="76" y2="5" stroke="#24303C" strokeWidth="3" strokeLinecap="round" />
            <line x1="46" y1="11" x2="70" y2="13" stroke="#24303C" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>

        {/* Left Column: Edge Cards (-5 & 999 hover/tap animated) + Dr. Meera */}
        <div className="absolute left-[2.5%] top-[4%] bottom-[28%] w-[31%] z-20 flex flex-col justify-between gap-2">
          <div className="grid grid-cols-2 gap-2">
            <EdgeStoryCard
              kind="-5"
              isPlaying={activeEdgeAnim === '-5'}
              onTrigger={() => setActiveEdgeAnim('-5')}
            />
            <EdgeStoryCard
              kind="999"
              isPlaying={activeEdgeAnim === '999'}
              onTrigger={() => setActiveEdgeAnim('999')}
            />
          </div>
        </div>

        {/* Dr. Meera behind her desk */}
        <div className="absolute left-[4%] bottom-[24%] w-[15%] max-w-[140px] z-10 pointer-events-none">
          <DrMeera mood={hasMismatch ? 'serious' : 'curious'} className="w-full h-auto" />
        </div>

        {/* Right Column: Interactive Tray + Should say / Checker says Panel */}
        <div className="absolute right-[3%] top-[4%] bottom-[4%] w-[61%] z-20 flex flex-col justify-between gap-3">
          {/* Wash Time Tray */}
          <div className="bg-[#FFFDF7] border-[3.5px] border-[#24303C] rounded-2xl p-3 sm:p-4 shadow-[0_4px_0_#24303C]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-display font-bold text-sm sm:text-base text-[#24303C]">
                Tray of Wash Times
              </span>
              <span className="text-xs font-bold text-[#465A69] tabular-nums">
                {pickedAllClean ? 0 : picks.length} of {MAX_PICKS} chosen
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {WASH_TRAY.map((sec) => {
                const alreadyPicked =
                  !pickedAllClean && picks.some((p) => p.seconds === sec);
                const disabled =
                  runningTime !== null ||
                  alreadyPicked ||
                  (!pickedAllClean && picks.length >= MAX_PICKS);
                return (
                  <button
                    key={sec}
                    type="button"
                    disabled={disabled}
                    onMouseEnter={() => {
                      if (sec === -5) setActiveEdgeAnim('-5');
                      if (sec === 999) setActiveEdgeAnim('999');
                    }}
                    onClick={() => void handlePickTime(sec)}
                    className={`btn-press-spring font-mono font-bold text-sm sm:text-base py-2 px-2 rounded-xl border-[2.5px] border-[#24303C] tabular-nums ${
                      alreadyPicked
                        ? 'bg-[#E3D9C1] text-[#24303C]/45 cursor-default'
                        : disabled
                        ? 'bg-[#F5EFE0] text-[#24303C]/40 cursor-not-allowed'
                        : 'cursor-pointer bg-[#A8D8E8] hover:bg-[#7FC4D6] text-[#24303C] shadow-[0_3px_0_#24303C]'
                    }`}
                  >
                    {sec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Should say / Checker says Readout */}
          <div className="flex-1 min-h-0 bg-[#FFFDF7] border-[3.5px] border-[#24303C] rounded-2xl p-3 sm:p-4 shadow-[0_4px_0_#24303C] flex flex-col">
            <div className="grid grid-cols-[54px_1fr_1fr_82px] gap-x-2 items-center text-xs font-bold text-[#465A69] pb-1.5 border-b border-[#24303C]/15">
              <div>Time</div>
              <div>Should say</div>
              <div>Checker says</div>
              <div className="text-right">Result</div>
            </div>

            <div className="flex-1 flex flex-col justify-start gap-1.5 pt-2 overflow-y-auto">
              {picks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs sm:text-sm font-semibold text-[#465A69]">
                  Tap up to three times from the tray to send kids to the sink.
                </div>
              ) : (
                picks.map((row) => (
                  <div
                    key={row.seconds}
                    onMouseEnter={() => {
                      if (row.seconds === -5) setActiveEdgeAnim('-5');
                      if (row.seconds === 999) setActiveEdgeAnim('999');
                    }}
                    className={`grid grid-cols-[54px_1fr_1fr_82px] gap-x-2 items-center rounded-xl px-2.5 py-1.5 text-xs sm:text-sm border-2 ${
                      row.isMismatch
                        ? 'bg-[#D9544D]/12 border-[#D9544D] text-[#B32E27]'
                        : 'bg-[#F5EFE0] border-[#24303C]/15 text-[#24303C]'
                    }`}
                  >
                    <div className="font-mono font-bold tabular-nums">{row.seconds}</div>
                    <div className="font-semibold truncate">{row.shouldSay}</div>
                    <div className="font-bold truncate">{row.checkerSays}</div>
                    <div className="flex items-center justify-end gap-1 font-bold">
                      {row.isMismatch ? (
                        <>
                          <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true">
                            <circle cx="10" cy="10" r="8" fill="#D9544D" />
                            <path d="M7 7 L13 13 M13 7 L7 13" stroke="#FFFDF7" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                          <span>Mismatch</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true">
                            <circle cx="10" cy="10" r="8" fill="#3E9A4D" />
                            <path d="M6.5 10.2 L9 12.7 L13.8 7.5" stroke="#FFFDF7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-[#3E9A4D]">Match</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          hasMismatch ? (
            <ClinicButton variant="coral" onClick={onNext}>
              Next
            </ClinicButton>
          ) : pickedAllClean ? (
            <ClinicButton variant="amber" onClick={() => onPicksChange([])}>
              Pick Again
            </ClinicButton>
          ) : null
        }
      >
        {hasMismatch ? (
          hasRuleGap ? (
            <>
              &ldquo;The rules never covered this, but a sensible checker should say Sensor error. A kid can&apos;t wash for -5 seconds, so something went wrong.&rdquo;
            </>
          ) : (
            <>
              &ldquo;A kid who did everything right got turned away. The problem was hiding in the code, right on the edge.&rdquo;
            </>
          )
        ) : pickedAllClean ? (
          <>
            &ldquo;Those are all the kids I&apos;d expect. Who would you least expect?&rdquo;
          </>
        ) : (
          <>
            &ldquo;Kids are still getting sick, and the checker looks fine. You can send three kids to the sink. Choose the ones you think will catch it out.&rdquo;
          </>
        )}
      </DialogueBox>
    </div>
  );
};
