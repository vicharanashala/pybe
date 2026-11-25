import React from 'react';
import { DrMeera } from '../svg/Characters';
import { ClinicHallBackground } from '../svg/ClinicScenery';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';

interface Screen10TestingProps {
  onNext: () => void;
}

export const Screen10Testing: React.FC<Screen10TestingProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col gap-[1.4dvh] w-full animate-slide-in-up">
      {/* Storybook Clinic Hall Canvas (no extra text inside scene per prompt) */}
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C]">
        <ClinicHallBackground />

        {/* Dr. Meera centered happily in the clinic hall */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[21%] max-w-[190px] z-10 pointer-events-none animate-gentle-bob">
          <DrMeera mood="happy" waving className="w-full h-auto" />
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          <ClinicButton variant="green" onClick={onNext}>
            Next
          </ClinicButton>
        }
      >
        &ldquo;You didn&apos;t trust how the checker looked. You picked tricky kids on purpose and compared what it said with what it should say. That is called <strong>testing</strong>.&rdquo;
      </DialogueBox>
    </div>
  );
};
