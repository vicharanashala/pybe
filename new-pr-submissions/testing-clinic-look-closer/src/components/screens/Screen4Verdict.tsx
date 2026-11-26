import React from 'react';
import { HandChoice, KidId, KIDS } from '../../types/story';
import { DrMeera, KidCharacter } from '../svg/Characters';
import { ClinicHallBackground } from '../svg/ClinicScenery';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';

interface Screen4VerdictProps {
  choices: Partial<Record<KidId, HandChoice>>;
  phase: 'praise' | 'hold';
  onPhaseChange: (phase: 'praise' | 'hold') => void;
  onNext: () => void;
}

function formatNames(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export const Screen4Verdict: React.FC<Screen4VerdictProps> = ({
  choices,
  phase,
  onPhaseChange,
  onNext,
}) => {

  const dirtyKids = KIDS.filter((k) => choices[k.id] === 'dirty').map((k) => k.name);
  const cleanKids = KIDS.filter((k) => choices[k.id] !== 'dirty').map((k) => k.name);

  const isClassicPattern =
    choices.ravi === 'dirty' &&
    choices.divya === 'dirty' &&
    choices.arjun === 'clean' &&
    choices.meena === 'clean' &&
    choices.kavin === 'clean';

  let firstPart = '';
  if (isClassicPattern) {
    firstPart =
      'You said Ravi and Divya are dirty, and the rest are clean. You guessed correctly!';
  } else if (dirtyKids.length === 0) {
    firstPart = 'You said all five kids are clean. You guessed correctly!';
  } else if (cleanKids.length === 0) {
    firstPart = 'You said all five kids are dirty. You guessed correctly!';
  } else {
    firstPart = `You said ${formatNames(dirtyKids)} ${
      dirtyKids.length === 1 ? 'is' : 'are'
    } dirty, and ${formatNames(cleanKids)} ${
      cleanKids.length === 1 ? 'is' : 'are'
    } clean. You guessed correctly!`;
  }

  const isStill = phase === 'hold';

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full">
      {/* Storybook Scene Canvas */}
      <div
        className={`relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C] transition-[filter] duration-500 ${
          isStill ? 'scene-paused saturate-[0.88] contrast-[1.03]' : ''
        }`}
      >
        <ClinicHallBackground paused={isStill} />

        {/* Subtle dramatic hush vignette when music stops */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isStill ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle at 50% 45%, transparent 45%, rgba(36, 48, 60, 0.22) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Characters Row */}
        <div className="absolute inset-x-0 bottom-[6%] flex items-end justify-between px-[5%] sm:px-[7%] z-10 pointer-events-none">
          <div className={`w-[18%] max-w-[165px] shrink-0 ${isStill ? '' : 'animate-gentle-bob'}`}>
            <DrMeera
              mood={isStill ? 'curious' : 'happy'}
              className="w-full h-auto"
            />
          </div>

          <div className="flex-1 flex items-end justify-around pl-2 sm:pl-4">
            {KIDS.map((kid) => {
              const picked = choices[kid.id] ?? 'clean';
              return (
                <div
                  key={kid.id}
                  className="flex flex-col items-center w-[18%] max-w-[132px]"
                >
                  <KidCharacter kid={kid} pose="standing" className="w-full h-auto" />
                  <div className="mt-1 flex flex-col items-center">
                    <span className="font-display font-bold text-xs sm:text-sm text-[#24303C] bg-[#FFFDF7]/95 px-2.5 py-0.5 rounded-lg border-2 border-[#24303C]">
                      {kid.name}
                    </span>
                    <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-[#24303C]/80">
                      {picked}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        subdued={isStill}
        actions={
          phase === 'praise' ? (
            <ClinicButton
              variant="amber"
              onClick={() => onPhaseChange('hold')}
            >
              Next
            </ClinicButton>
          ) : (
            <ClinicButton variant="coral" onClick={onNext}>
              Next
            </ClinicButton>
          )
        }
      >
        <span>&ldquo;{firstPart}</span>
        {isStill ? (
          <span className="ml-2 font-display font-extrabold text-[#D9544D]">
            ...Or did you?&rdquo;
          </span>
        ) : (
          <span>&rdquo;</span>
        )}
      </DialogueBox>
    </div>
  );
};
