import React, { useEffect } from 'react';
import { SingleSinkStation } from '../svg/SingleSinkStation';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';
import { preloadPyodide } from '../../utils/pyodide';

interface Screen6SinkRoomProps {
  onOpenCode: () => void;
  onNext: () => void;
}

export const Screen6SinkRoom: React.FC<Screen6SinkRoomProps> = ({
  onOpenCode,
  onNext,
}) => {
  useEffect(() => {
    void preloadPyodide();
  }, []);

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full">
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8]">
        <SingleSinkStation timerText="00s" boardText="" drMeeraMood="happy" />
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          <div className="flex items-center gap-3">
            <ClinicButton variant="amber" onClick={onOpenCode}>
              Show code
            </ClinicButton>
            <ClinicButton variant="coral" onClick={onNext}>
              Next
            </ClinicButton>
          </div>
        }
      >
        &ldquo;Washing for 20 seconds clears those germs. So we built a Sink Checker. It times each kid and says Well done or Wash again.&rdquo;
      </DialogueBox>
    </div>
  );
};
