import React from 'react';
import { HandChoice, KidId, KIDS, KidProfile } from '../../types/story';
import { DrMeera, KidCharacter } from '../svg/Characters';
import { KidHandsInspection } from '../svg/KidHandsInspection';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';

interface Screen3HandsProps {
  choices: Partial<Record<KidId, HandChoice>>;
  kidIndex: number;
  retryPrompted: Partial<Record<KidId, boolean>>;
  onChangeKidIndex: (idx: number) => void;
  onMarkRetryPrompted: (kidId: KidId) => void;
  onSelectChoice: (kidId: KidId, choice: HandChoice) => void;
  onComplete: () => void;
}

function isExpectedChoice(kid: KidProfile, choice: HandChoice): boolean {
  const visuallyDirty = kid.appearance === 'muddy' || kid.appearance === 'smudged';
  return visuallyDirty ? choice === 'dirty' : choice === 'clean';
}

export const Screen3Hands: React.FC<Screen3HandsProps> = ({
  choices,
  kidIndex,
  retryPrompted,
  onChangeKidIndex,
  onMarkRetryPrompted,
  onSelectChoice,
  onComplete,
}) => {
  const currentKid = KIDS[kidIndex] ?? KIDS[0];
  const recordedChoice = choices[currentKid.id];
  const promptedRetry = Boolean(retryPrompted[currentKid.id]);
  const allKidsChosen = KIDS.every((k) => choices[k.id] !== undefined);

  const moveNext = () => {
    if (kidIndex < KIDS.length - 1) {
      onChangeKidIndex(kidIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePick = (choice: HandChoice) => {
    if (!promptedRetry && !recordedChoice && !isExpectedChoice(currentKid, choice)) {
      onMarkRetryPrompted(currentKid.id);
      return;
    }

    onSelectChoice(currentKid.id, choice);
    moveNext();
  };

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full">
      {/* Storybook Close-Up Scene Canvas */}
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#7FC4D6] shadow-[0_6px_0_#24303C] flex flex-col justify-between p-3 sm:p-5">
        {/* Subtle pale-blue top wall stripe */}
        <div
          className="absolute inset-x-0 top-0 h-[38%] bg-[#A8D8E8] border-b-[4px] border-[#24303C] pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Header Row inside Canvas: Kid Identity + Progress */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#FFFDF7] border-[3px] border-[#24303C] rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-[0_3px_0_#24303C]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F5EFE0] border-2 border-[#24303C] overflow-hidden shrink-0 flex items-end justify-center">
              <KidCharacter kid={currentKid} className="w-11 h-14 translate-y-2" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-xl text-[#24303C] leading-tight">
                {currentKid.name}&apos;s Hands
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {allKidsChosen && (
              <div className="flex items-center gap-1 bg-[#FFFDF7] border-[3px] border-[#24303C] rounded-xl p-1">
                <button
                  type="button"
                  disabled={kidIndex === 0}
                  onClick={() => onChangeKidIndex(Math.max(0, kidIndex - 1))}
                  className="btn-press-spring cursor-pointer disabled:opacity-40 px-2 py-0.5 rounded-lg text-xs font-bold text-[#24303C] hover:bg-[#A8D8E8]"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={kidIndex === KIDS.length - 1}
                  onClick={() => onChangeKidIndex(Math.min(KIDS.length - 1, kidIndex + 1))}
                  className="btn-press-spring cursor-pointer disabled:opacity-40 px-2 py-0.5 rounded-lg text-xs font-bold text-[#24303C] hover:bg-[#A8D8E8]"
                >
                  Next kid
                </button>
              </div>
            )}
            <div className="flex items-center bg-[#FFFDF7] border-[3px] border-[#24303C] rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#24303C]">
              <span className="tabular-nums">
                {kidIndex + 1} of {KIDS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Center Zoomed-In Hands Illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 py-1">
          <KidHandsInspection
            kid={currentKid}
            className="w-full h-full max-w-[540px] max-h-full"
          />
        </div>

        {/* Small Dr. Meera reaction corner avatar when asking "Are you sure?" */}
        {promptedRetry && (
          <div className="hidden sm:block absolute right-5 bottom-0 w-[13%] max-w-[110px] z-20 pointer-events-none animate-step-forward">
            <DrMeera mood="curious" className="w-full h-auto" />
          </div>
        )}
      </div>

      {/* Decision / Retry Dialogue Bar */}
      <DialogueBox
        speaker={promptedRetry ? 'Dr. Meera' : `Checking ${currentKid.name}`}
        actions={
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => handlePick('clean')}
              className={`btn-press-spring whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 rounded-xl font-display font-bold text-base sm:text-lg px-5 py-2.5 border-[3px] border-[#24303C] shadow-[0_4px_0_#24303C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8A33D] ${
                recordedChoice === 'clean'
                  ? 'bg-[#7FC4D6] ring-4 ring-[#3E9A4D] text-[#24303C]'
                  : 'bg-[#A8D8E8] hover:bg-[#7FC4D6] text-[#24303C]'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
                <path
                  d="M12 3 C12 3 6 10.5 6 15 C6 18.3 8.7 21 12 21 C15.3 21 18 18.3 18 15 C18 10.5 12 3 12 3 Z"
                  fill="#FFFDF7"
                  stroke="#24303C"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Clean</span>
            </button>

            <button
              type="button"
              onClick={() => handlePick('dirty')}
              className={`btn-press-spring whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 rounded-xl font-display font-bold text-base sm:text-lg px-5 py-2.5 border-[3px] border-[#24303C] shadow-[0_4px_0_#24303C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7FC4D6] ${
                recordedChoice === 'dirty'
                  ? 'bg-[#d98a1c] ring-4 ring-[#3E9A4D] text-[#24303C]'
                  : 'bg-[#E8A33D] hover:bg-[#dc952d] text-[#24303C]'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
                <path
                  d="M12 4 C14.5 4 16 6 18 6.5 C20 7 21 9.5 19.5 11.5 C18.5 13 20 15.5 18 17.5 C16 19.5 13.5 18 12 19.5 C10 21 7.5 19 6.5 17 C5 15 3.5 13.5 4.5 11 C5.5 8.5 7 8 8.5 6 C10 4 10.5 4 12 4 Z"
                  fill="#6E472B"
                  stroke="#24303C"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Dirty</span>
            </button>

            {allKidsChosen && (
              <ClinicButton variant="green" className="px-5" onClick={onComplete}>
                Next
              </ClinicButton>
            )}
          </div>
        }
      >
        {promptedRetry ? (
          <>&ldquo;Are you sure?&rdquo; Look at {currentKid.name}&apos;s hands and choose again.</>
        ) : (
          <>Look at {currentKid.name}&apos;s hands. Clean or dirty?</>
        )}
      </DialogueBox>
    </div>
  );
};
