import React from 'react';
import { FlipPairState } from '../../types/story';
import { ClinicHallBackground } from '../svg/ClinicScenery';
import { FlipCard } from '../FlipCard';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';

interface Screen11FlipBoundaryEdgeProps {
  flipState: FlipPairState;
  onFlipChange: (next: FlipPairState) => void;
  onNext: () => void;
}

export const Screen11FlipBoundaryEdge: React.FC<Screen11FlipBoundaryEdgeProps> = ({
  flipState,
  onFlipChange,
  onNext,
}) => {
  const bothFlippedOnce = flipState.cardAFlippedOnce && flipState.cardBFlippedOnce;

  const toggleCardA = () => {
    onFlipChange({
      ...flipState,
      cardAFlipped: !flipState.cardAFlipped,
      cardAFlippedOnce: true,
    });
  };

  const toggleCardB = () => {
    onFlipChange({
      ...flipState,
      cardBFlipped: !flipState.cardBFlipped,
      cardBFlippedOnce: true,
    });
  };

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full animate-slide-in-up">
      {/* Main Scene Canvas: overflow-hidden only on background layer so 3D cards are never clipped */}
      <div className="relative w-full min-h-[340px] h-[64dvh] max-h-[500px] rounded-3xl border-[4px] border-[#24303C] bg-[#A8D8E8] shadow-[0_6px_0_#24303C]">
        <div className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none">
          <ClinicHallBackground />
        </div>

        {/* Two Flip Cards Centered Side by Side */}
        <div className="relative z-20 w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 py-4">
          <FlipCard
            isFlipped={flipState.cardAFlipped}
            hasFlippedOnce={flipState.cardAFlippedOnce}
            onToggle={toggleCardA}
            frontBody="The kid who washed exactly 20 seconds got turned away. The bug was one symbol:"
            frontCode="> 20   instead of   >= 20"
            term="Boundary case"
            definition="An input right on the line where the answer changes (like 19 and 20)."
            congratsLine="Congrats! You just learned boundary case."
          />

          <FlipCard
            isFlipped={flipState.cardBFlipped}
            hasFlippedOnce={flipState.cardBFlippedOnce}
            onToggle={toggleCardB}
            frontBody="Situations nobody expected: -5 (stop pressed before start) and 999 (walked off without pressing stop)."
            frontCode="if seconds < 0 or seconds > 60"
            term="Edge case"
            definition="An input far outside what you expect, like negative, zero or huge."
            footnote="Boundary and edge cases are often both called edge cases."
            congratsLine="Congrats! You just learned edge case."
          />
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          <ClinicButton
            variant="green"
            disabled={!bothFlippedOnce}
            onClick={onNext}
          >
            Next
          </ClinicButton>
        }
      >
        {bothFlippedOnce ? (
          <>&ldquo;You uncovered both tricks! Ready for two more?&rdquo;</>
        ) : (
          <>&ldquo;Tap both cards to see what those two kinds of tricky inputs are called.&rdquo;</>
        )}
      </DialogueBox>
    </div>
  );
};
