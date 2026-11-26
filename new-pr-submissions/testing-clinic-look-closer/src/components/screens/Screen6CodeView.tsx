import React from 'react';
import { DrMeera } from '../svg/Characters';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';
import { INITIAL_CHECKER_CODE } from '../../utils/pyodide';

interface Screen6CodeViewProps {
  onBackToSink: () => void;
  onNext: () => void;
}

export const Screen6CodeView: React.FC<Screen6CodeViewProps> = ({
  onBackToSink,
  onNext,
}) => {
  return (
    <div className="flex flex-col gap-[1.4dvh] w-full">
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8]">
        {/* Flat Clinic Wall & Floor Backdrop */}
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

        <div className="relative z-10 h-full w-full flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-4 sm:gap-6 p-4 sm:p-6 min-h-0">
          {/* Left: Dr. Meera */}
          <div className="w-[30%] sm:w-[25%] max-w-[200px] shrink-0 flex items-end justify-center self-end">
            <DrMeera mood="happy" className="w-full h-auto max-h-[54dvh]" />
          </div>

          {/* Right: Plain-text Code Card */}
          <div className="flex-1 w-full min-h-0 rounded-3xl border-[4px] border-[#24303C] bg-[#FFFDF7] p-4 sm:p-5 flex flex-col justify-between gap-3 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b-2 border-[#24303C]/15">
                <h2 className="font-display font-extrabold text-lg sm:text-2xl text-[#24303C]">
                  Sink Checker Code
                </h2>
                <ClinicButton variant="sky" size="sm" onClick={onBackToSink}>
                  Back to the sink
                </ClinicButton>
              </div>

              <div className="mt-3 bg-[#24303C] rounded-2xl p-4 sm:p-5 border-[3px] border-[#24303C]">
                <pre className="font-mono text-sm sm:text-base leading-relaxed overflow-x-auto text-[#F5EFE0] m-0">
                  <code>{INITIAL_CHECKER_CODE}</code>
                </pre>
              </div>
            </div>

            <p className="text-xs sm:text-sm md:text-base font-semibold text-[#24303C] bg-[#F5EFE0] rounded-2xl px-4 py-3 border-2 border-[#24303C]/20">
              Read it like a sentence: if the seconds are more than 20, say &ldquo;Well done!&rdquo;. Otherwise, &ldquo;Wash again.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          <ClinicButton variant="coral" onClick={onNext}>
            Next
          </ClinicButton>
        }
      >
        &ldquo;Here is the Sink Checker code.&rdquo;
      </DialogueBox>
    </div>
  );
};
