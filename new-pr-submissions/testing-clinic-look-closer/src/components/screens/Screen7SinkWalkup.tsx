import React, { useEffect, useState } from 'react';
import { KIDS } from '../../types/story';
import { SingleSinkStation } from '../svg/SingleSinkStation';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';
import {
  INITIAL_CHECKER_CODE,
  expectedWashOutput,
  runCheckWash,
} from '../../utils/pyodide';

interface Screen7SinkWalkupProps {
  stepIndex: number;
  completedOutputs: Record<number, string>;
  askingWorking: boolean;
  replyChoice: 'yes' | 'no' | null;
  onStepIndexChange: (idx: number) => void;
  onCompleteStep: (idx: number, output: string) => void;
  onAskingWorkingChange: (asking: boolean) => void;
  onReplyChoiceChange: (choice: 'yes' | 'no') => void;
  onNext: () => void;
}

const WALKUP_RUNS = [
  { kid: KIDS[0], seconds: 5 },
  { kid: KIDS[1], seconds: 10 },
  { kid: KIDS[2], seconds: 30 },
  { kid: KIDS[4], seconds: 45 },
];

export const Screen7SinkWalkup: React.FC<Screen7SinkWalkupProps> = ({
  stepIndex,
  completedOutputs,
  askingWorking,
  replyChoice,
  onStepIndexChange,
  onCompleteStep,
  onAskingWorkingChange,
  onReplyChoiceChange,
  onNext,
}) => {
  const currentRun = WALKUP_RUNS[stepIndex] ?? WALKUP_RUNS[0];
  const savedOutput = completedOutputs[stepIndex];
  const alreadyCompleted = savedOutput !== undefined;

  const [displaySeconds, setDisplaySeconds] = useState(
    alreadyCompleted ? currentRun.seconds : 0
  );
  const [checkerOutput, setCheckerOutput] = useState(savedOutput ?? '');
  const [timerDone, setTimerDone] = useState(alreadyCompleted);

  const shouldSay = expectedWashOutput(currentRun.seconds);
  const isLastKid = stepIndex === WALKUP_RUNS.length - 1;

  // Count the sink timer up smoothly for the current kid unless already completed (when pressing Back)
  useEffect(() => {
    if (savedOutput !== undefined) {
      setDisplaySeconds(currentRun.seconds);
      setCheckerOutput(savedOutput);
      setTimerDone(true);
      return;
    }

    let active = true;
    setDisplaySeconds(0);
    setTimerDone(false);
    setCheckerOutput('');

    const target = currentRun.seconds;
    const totalMs = 580;
    const steps = Math.max(5, Math.min(target, 18));
    const stepDelay = totalMs / steps;
    let tick = 0;

    const timer = window.setInterval(() => {
      if (!active) return;
      tick += 1;
      const nextVal = Math.min(target, Math.round((tick / steps) * target));
      setDisplaySeconds(nextVal);
      if (tick >= steps) {
        window.clearInterval(timer);
        void runCheckWash(INITIAL_CHECKER_CODE, target).then((out) => {
          if (!active) return;
          setCheckerOutput(out);
          setTimerDone(true);
          onCompleteStep(stepIndex, out);
        });
      }
    }, stepDelay);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [stepIndex, currentRun.seconds, savedOutput, onCompleteStep]);

  const handleNextKid = () => {
    if (!isLastKid) {
      onStepIndexChange(stepIndex + 1);
    } else {
      onAskingWorkingChange(true);
    }
  };

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (replyChoice !== null) return;
    onReplyChoiceChange(answer);
  };

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full">
      {/* Single Sink Station Canvas */}
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C]">
        <SingleSinkStation
          timerText={`${displaySeconds}s`}
          highlightTimer={timerDone}
          boardText={timerDone ? checkerOutput : ''}
          shouldSayText={timerDone ? shouldSay : undefined}
          showMatchTick={timerDone && checkerOutput === shouldSay}
          drMeeraMood={askingWorking ? 'curious' : 'happy'}
          activeKid={{
            kid: currentRun.kid,
            pose: timerDone ? 'hands-up' : 'standing',
          }}
        />

        {/* Quiet step counter in top-left */}
        <div className="absolute left-4 top-3 z-20">
          <div className="text-xs sm:text-sm font-bold text-[#24303C] bg-[#FFFDF7]/90 px-3 py-1 rounded-lg border-2 border-[#24303C] tabular-nums">
            Kid {stepIndex + 1} of {WALKUP_RUNS.length}
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          !askingWorking ? (
            timerDone ? (
              <ClinicButton variant="green" onClick={handleNextKid}>
                {isLastKid ? 'Next' : 'Next kid'}
              </ClinicButton>
            ) : null
          ) : replyChoice === null ? (
            <div className="flex items-center gap-3">
              <ClinicButton variant="green" onClick={() => handleAnswer('yes')}>
                Yes
              </ClinicButton>
              <ClinicButton variant="coral" onClick={() => handleAnswer('no')}>
                No
              </ClinicButton>
            </div>
          ) : (
            <ClinicButton variant="coral" onClick={onNext}>
              Next
            </ClinicButton>
          )
        }
      >
        {!askingWorking ? (
          <>
            {currentRun.kid.name} washes for <strong>{currentRun.seconds} seconds</strong>.
            {timerDone ? ' Board and rule match!' : ' Timing...'}
          </>
        ) : replyChoice === 'yes' ? (
          <>&ldquo;You say it&apos;s working, but kids are still getting sick...&rdquo;</>
        ) : replyChoice === 'no' ? (
          <>&ldquo;You&apos;re right to doubt it. Let&apos;s see...&rdquo;</>
        ) : (
          <>&ldquo;So... is my checker working?&rdquo;</>
        )}
      </DialogueBox>
    </div>
  );
};
