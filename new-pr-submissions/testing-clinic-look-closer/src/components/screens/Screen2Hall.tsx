import React, { useState } from 'react';
import { KIDS } from '../../types/story';
import { DrMeera, KidCharacter } from '../svg/Characters';
import { ClinicHallBackground } from '../svg/ClinicScenery';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';

interface Screen2HallProps {
  handsRaised: boolean;
  onRaiseHands: (raised: boolean) => void;
  onNext: () => void;
}

export const Screen2Hall: React.FC<Screen2HallProps> = ({
  handsRaised,
  onRaiseHands,
  onNext,
}) => {
  const [animateTransition, setAnimateTransition] = useState(false);

  const handleShowHands = () => {
    setAnimateTransition(true);
    onRaiseHands(true);
  };

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full">
      {/* Storybook Scene Canvas */}
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C]">
        <ClinicHallBackground />

        {/* Characters Row inside the Hall */}
        <div className="absolute inset-x-0 bottom-[6%] flex items-end justify-between px-[5%] sm:px-[7%] z-10 pointer-events-none">
          {/* Dr. Meera on the left */}
          <div className="w-[18%] max-w-[165px] shrink-0 animate-gentle-bob">
            <DrMeera mood="happy" className="w-full h-auto" />
          </div>

          {/* Five kids lined up in the hall */}
          <div className="flex-1 flex items-end justify-around pl-2 sm:pl-4">
            {KIDS.map((kid, idx) => (
              <div
                key={kid.id}
                className="flex flex-col items-center w-[18%] max-w-[132px]"
                style={{
                  transform: handsRaised ? 'translateY(-8px)' : 'translateY(0px)',
                  transition: animateTransition
                    ? `transform 260ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 45}ms`
                    : 'none',
                }}
              >
                <KidCharacter
                  kid={kid}
                  pose={handsRaised ? 'hands-up' : 'standing'}
                  className="w-full h-auto"
                />
                <span className="mt-1 font-display font-bold text-xs sm:text-sm md:text-base text-[#24303C] bg-[#FFFDF7]/90 px-2.5 py-0.5 rounded-lg border-2 border-[#24303C]">
                  {kid.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          !handsRaised ? (
            <ClinicButton variant="amber" onClick={handleShowHands}>
              Next
            </ClinicButton>
          ) : (
            <ClinicButton variant="coral" onClick={onNext}>
              Next
            </ClinicButton>
          )
        }
      >
        {!handsRaised ? (
          <>&ldquo;These kids just came in from playing. Kids, show me your hands!&rdquo;</>
        ) : (
          <>&ldquo;Take a look at each kid&apos;s hands and tell me what you see.&rdquo;</>
        )}
      </DialogueBox>
    </div>
  );
};
