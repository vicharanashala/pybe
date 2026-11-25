import React from 'react';
import { FlipPairState } from '../../types/story';
import { ClinicHallBackground } from '../svg/ClinicScenery';
import { FlipCard } from '../FlipCard';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';

interface Screen12FlipAssertUnitProps {
  flipState: FlipPairState;
  onFlipChange: (next: FlipPairState) => void;
  onNext: () => void;
}

export const Screen12FlipAssertUnit: React.FC<Screen12FlipAssertUnitProps> = ({
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
            frontBody="Dr. Meera wrote a promise: a kid who washes 20 seconds must get Well done!"
            frontCode={`assert check_wash(20) == "Well done!"`}
            term="Assertion"
            definition="A line that says 'this must be true' and complains if it isn't."
            congratsLine="Congrats! You just learned assertion."
          />

          <FlipCard
            isFlipped={flipState.cardBFlipped}
            hasFlippedOnce={flipState.cardBFlippedOnce}
            onToggle={toggleCardB}
            frontBody="Each promise gets its own card with a clear name:"
            frontCode={`def test_exactly_20_seconds_is_well_done():\n    assert check_wash(20) == "Well done!"`}
            term="Unit test"
            definition="One small named check of one behaviour, run together with the others."
            congratsLine="Congrats! You just learned unit test."
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
          <>&ldquo;Awesome! Now let&apos;s put those promises to work.&rdquo;</>
        ) : (
          <>&ldquo;Flip both cards to learn how we turn promises into named checks.&rdquo;</>
        )}
      </DialogueBox>
    </div>
  );
};
