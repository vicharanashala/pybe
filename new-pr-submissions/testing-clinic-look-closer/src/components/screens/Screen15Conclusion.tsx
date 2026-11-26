import React from 'react';
import { DrMeera } from '../svg/Characters';
import { ClinicHallBackground } from '../svg/ClinicScenery';
import { DialogueBox } from '../DialogueBox';

const SUMMARY_POINTS = [
  {
    title: 'Testing',
    detail: 'check code on inputs you choose.',
    accent: '#3E9A4D',
  },
  {
    title: 'Boundary case',
    detail: 'on the line where the answer changes.',
    accent: '#E8A33D',
  },
  {
    title: 'Edge case',
    detail: 'off the map.',
    accent: '#D9544D',
  },
  {
    title: 'Assertion',
    detail: 'a promise that something is true.',
    accent: '#7FC4D6',
  },
  {
    title: 'Unit test',
    detail: 'one small named promise.',
    accent: '#3E9A4D',
  },
];

export const Screen15Conclusion: React.FC = () => {
  return (
    <div className="flex flex-col gap-[1.4dvh] w-full animate-slide-in-up">
      {/* Storybook Clinic Hall Canvas */}
      <div className="relative w-full max-w-[min(100%,calc(70dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C]">
        <ClinicHallBackground />

        {/* Dr. Meera on the left */}
        <div className="hidden sm:block absolute left-[4%] bottom-[6%] w-[18%] max-w-[165px] z-10 pointer-events-none animate-gentle-bob">
          <DrMeera mood="happy" waving className="w-full h-auto" />
        </div>

        {/* Clean Summary Card */}
        <div className="relative sm:absolute sm:right-[4%] sm:left-[25%] sm:top-[5%] sm:bottom-[5%] z-20 flex items-center justify-center p-3 sm:p-0 min-h-0">
          <div className="w-full max-h-full overflow-y-auto bg-[#FFFDF7] border-[4px] border-[#24303C] rounded-3xl shadow-[0_6px_0_#24303C] p-3.5 sm:p-5 flex flex-col gap-2.5">
            <h2 className="font-display font-extrabold text-lg sm:text-2xl text-[#24303C] border-b-2 border-[#24303C]/15 pb-1.5">
              What You Learned
            </h2>

            <ul className="space-y-1.5 sm:space-y-2">
              {SUMMARY_POINTS.map((point) => (
                <li
                  key={point.title}
                  className="flex items-start gap-2.5 bg-[#F5EFE0] border-2 border-[#24303C] rounded-xl px-3.5 py-2"
                >
                  <span
                    className="mt-1.5 w-3 h-3 rounded-full border-2 border-[#24303C] shrink-0"
                    style={{ backgroundColor: point.accent }}
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[#24303C] leading-snug">
                    <strong className="font-extrabold">{point.title}:</strong> {point.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar (No Next button) */}
      <DialogueBox speaker="Dr. Meera">
        <p className="font-bold">
          &ldquo;Today you learned to look closer at code. Looking closer is a skill. Now you have it.&rdquo;
        </p>
      </DialogueBox>
    </div>
  );
};
