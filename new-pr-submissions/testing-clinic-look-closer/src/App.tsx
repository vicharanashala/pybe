/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import {
  HandChoice,
  KidId,
  PersistedStoryState,
  ScreenId,
} from './types/story';
import { Screen1Entrance } from './components/screens/Screen1Entrance';
import { Screen2Hall } from './components/screens/Screen2Hall';
import { Screen3Hands } from './components/screens/Screen3Hands';
import { Screen4Verdict } from './components/screens/Screen4Verdict';
import { Screen5Flashback } from './components/screens/Screen5Flashback';
import { Screen6SinkRoom } from './components/screens/Screen6SinkRoom';
import { Screen6CodeView } from './components/screens/Screen6CodeView';
import { Screen7SinkWalkup } from './components/screens/Screen7SinkWalkup';
import { Screen8SickNotes } from './components/screens/Screen8SickNotes';
import { Screen9FixCode } from './components/screens/Screen9FixCode';
import { Screen10Testing } from './components/screens/Screen10Testing';
import { Screen11FlipBoundaryEdge } from './components/screens/Screen11FlipBoundaryEdge';
import { Screen12FlipAssertUnit } from './components/screens/Screen12FlipAssertUnit';
import { Screen14GummyDispenser } from './components/screens/Screen14GummyDispenser';
import { Screen15Conclusion } from './components/screens/Screen15Conclusion';
import { ClinicButton } from './components/ClinicButton';

const SCREENS: ScreenId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const INITIAL_STORY_STATE: PersistedStoryState = {
  s1Opened: false,
  s2HandsRaised: false,
  s3KidIndex: 0,
  s3RetryPrompted: {},
  s4Phase: 'praise',
  s5Rewound: false,
  s5GermsRevealed: false,
  s6ShowCode: false,
  s7StepIndex: 0,
  s7CompletedOutputs: {},
  s7AskingWorking: false,
  s7ReplyChoice: null,
  s8Picks: [],
  s9EditStep: 'rule',
  s9VerifiedRows: [],
  s11Flip: {
    cardAFlipped: false,
    cardBFlipped: false,
    cardAFlippedOnce: false,
    cardBFlippedOnce: false,
  },
  s12Flip: {
    cardAFlipped: false,
    cardBFlipped: false,
    cardAFlippedOnce: false,
    cardBFlippedOnce: false,
  },
  s14Stage: 'trial',
  s14Tries: [],
  s14Test1Age: '',
  s14Test1Out: '',
  s14Test2Age: '',
  s14Test2Out: '',
  s14WrittenSpecs: [],
  s14SelectedBoundary: 'elif age < 12:',
  s14SelectedEdge: 'if age < 0 and age > 15:',
  s14TestRunResults: [],
};

export default function App() {
  const [screen, setScreen] = useState<ScreenId>(1);
  const [choices, setChoices] = useState<Partial<Record<KidId, HandChoice>>>({});
  const [story, setStory] = useState<PersistedStoryState>(INITIAL_STORY_STATE);

  const patchStory = useCallback((patch: Partial<PersistedStoryState>) => {
    setStory((prev) => ({ ...prev, ...patch }));
  }, []);

  const gummyFoundAllThree =
    story.s14Tries.some((t) => t.age === 12 && t.isMismatch) &&
    story.s14Tries.some((t) => t.age < 0 && t.isMismatch) &&
    story.s14Tries.some((t) => t.age > 15 && t.isMismatch);

  const isBackDisabled =
    screen === 13 &&
    story.s14Stage === 'trial' &&
    story.s14Tries.length > 0 &&
    !gummyFoundAllThree;

  const handleBack = () => {
    if (screen <= 1 || isBackDisabled) return;

    if (screen === 2) {
      if (story.s2HandsRaised) {
        patchStory({ s2HandsRaised: false });
        return;
      }
      setScreen(1);
      return;
    }

    if (screen === 3) {
      if (story.s3KidIndex > 0) {
        patchStory({ s3KidIndex: story.s3KidIndex - 1 });
        return;
      }
      setScreen(2);
      return;
    }

    if (screen === 4) {
      if (story.s4Phase === 'hold') {
        patchStory({ s4Phase: 'praise' });
        return;
      }
      setScreen(3);
      return;
    }

    if (screen === 6) {
      if (story.s6ShowCode) {
        patchStory({ s6ShowCode: false });
        return;
      }
      setScreen(5);
      return;
    }

    if (screen === 7) {
      if (story.s7ReplyChoice !== null) {
        patchStory({ s7ReplyChoice: null });
        return;
      }
      if (story.s7AskingWorking) {
        patchStory({ s7AskingWorking: false });
        return;
      }
      if (story.s7StepIndex > 0) {
        patchStory({ s7StepIndex: story.s7StepIndex - 1 });
        return;
      }
      setScreen(6);
      return;
    }

    if (screen === 9) {
      if (story.s9EditStep === 'done') {
        patchStory({ s9EditStep: 'guard' });
        return;
      }
      if (story.s9EditStep === 'guard') {
        patchStory({ s9EditStep: 'operator' });
        return;
      }
      if (story.s9EditStep === 'operator') {
        patchStory({ s9EditStep: 'rule' });
        return;
      }
      setScreen(8);
      return;
    }

    if (screen === 13) {
      if (story.s14Stage === 'fix-and-test') {
        patchStory({ s14Stage: 'write-tests' });
        return;
      }
      if (story.s14Stage === 'write-tests') {
        patchStory({
          s14Stage:
            story.s14Tries.length >= 6 && !gummyFoundAllThree
              ? 'summary'
              : 'trial',
        });
        return;
      }
      setScreen(12);
      return;
    }

    setScreen((prev) => (prev > 1 ? ((prev - 1) as ScreenId) : 1));
  };

  const handleSelectChoice = useCallback((kidId: KidId, choice: HandChoice) => {
    setChoices((prev) => ({
      ...prev,
      [kidId]: choice,
    }));
  }, []);

  const handleMarkS3RetryPrompted = useCallback((kidId: KidId) => {
    setStory((prev) => ({
      ...prev,
      s3RetryPrompted: { ...prev.s3RetryPrompted, [kidId]: true },
    }));
  }, []);

  const handleS1Opened = useCallback(() => {
    setStory((prev) => (prev.s1Opened ? prev : { ...prev, s1Opened: true }));
  }, []);

  const handleS5Rewound = useCallback(() => {
    setStory((prev) => (prev.s5Rewound ? prev : { ...prev, s5Rewound: true }));
  }, []);

  const handleS5GermsRevealed = useCallback(() => {
    setStory((prev) => (prev.s5GermsRevealed ? prev : { ...prev, s5GermsRevealed: true }));
  }, []);

  const handleS7CompleteStep = useCallback((idx: number, output: string) => {
    setStory((prev) => ({
      ...prev,
      s7CompletedOutputs: { ...prev.s7CompletedOutputs, [idx]: output },
    }));
  }, []);

  return (
    <div className="min-h-dvh md:h-dvh md:overflow-hidden bg-[#F5EFE0] text-[#24303C] flex flex-col">
      {/* Slim Top Navigation Bar: Back (Left) | Title Once (Middle) | Progress + n/14 (Right) */}
      <header className="w-full shrink-0 border-b-[3px] border-[#24303C] bg-[#FFFDF7]">
        <div className="max-w-[1260px] mx-auto px-3 sm:px-6 py-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          {/* Top-Left: Back button on every screen except the first */}
          <div className="flex items-center justify-start">
            {screen > 1 && (
              <ClinicButton
                variant="cream"
                size="sm"
                disabled={isBackDisabled}
                onClick={handleBack}
                className="flex items-center gap-1.5 px-3"
              >
                <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true">
                  <path
                    d="M12.5 5L7.5 10L12.5 15"
                    stroke="#24303C"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Back</span>
              </ClinicButton>
            )}
          </div>

          {/* Center: Bold Title shown ONCE in the middle */}
          <h1 className="font-display font-extrabold text-sm sm:text-xl tracking-tight text-[#24303C] whitespace-nowrap text-center">
            Dr. Meera&apos;s Clinic
          </h1>

          {/* Top-Right: Slim progress bar + n/14 label */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 max-w-[200px] justify-end">
              <div
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={SCREENS.length}
                aria-valuenow={screen}
                className="flex-1 min-w-[48px] max-w-[140px] h-2.5 sm:h-3 rounded-full bg-[#E8DFCA] border-2 border-[#24303C] overflow-hidden"
              >
                <div
                  className="h-full bg-[#3E9A4D] transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${(screen / SCREENS.length) * 100}%` }}
                />
              </div>
              <span className="font-display font-bold text-xs sm:text-sm text-[#24303C] tabular-nums shrink-0">
                {screen}/{SCREENS.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Centered Story Stage */}
      <main className="flex-1 min-h-0 w-full max-w-[min(95vw,1220px)] mx-auto px-3 sm:px-5 py-[1.4dvh] flex flex-col justify-center">
        {screen === 1 && (
          <Screen1Entrance
            opened={story.s1Opened}
            onOpened={handleS1Opened}
            onNext={() => setScreen(2)}
          />
        )}

        {screen === 2 && (
          <Screen2Hall
            handsRaised={story.s2HandsRaised}
            onRaiseHands={(raised) => patchStory({ s2HandsRaised: raised })}
            onNext={() => setScreen(3)}
          />
        )}

        {screen === 3 && (
          <Screen3Hands
            choices={choices}
            kidIndex={story.s3KidIndex}
            retryPrompted={story.s3RetryPrompted}
            onChangeKidIndex={(idx) => patchStory({ s3KidIndex: idx })}
            onMarkRetryPrompted={handleMarkS3RetryPrompted}
            onSelectChoice={handleSelectChoice}
            onComplete={() => setScreen(4)}
          />
        )}

        {screen === 4 && (
          <Screen4Verdict
            choices={choices}
            phase={story.s4Phase}
            onPhaseChange={(phase) => patchStory({ s4Phase: phase })}
            onNext={() => setScreen(5)}
          />
        )}

        {screen === 5 && (
          <Screen5Flashback
            rewound={story.s5Rewound}
            onRewound={handleS5Rewound}
            germsRevealed={story.s5GermsRevealed}
            onGermsRevealed={handleS5GermsRevealed}
            onNext={() => setScreen(6)}
          />
        )}

        {screen === 6 && !story.s6ShowCode && (
          <Screen6SinkRoom
            onOpenCode={() => patchStory({ s6ShowCode: true })}
            onNext={() => setScreen(7)}
          />
        )}

        {screen === 6 && story.s6ShowCode && (
          <Screen6CodeView
            onBackToSink={() => patchStory({ s6ShowCode: false })}
            onNext={() => setScreen(7)}
          />
        )}

        {screen === 7 && (
          <Screen7SinkWalkup
            stepIndex={story.s7StepIndex}
            completedOutputs={story.s7CompletedOutputs}
            askingWorking={story.s7AskingWorking}
            replyChoice={story.s7ReplyChoice}
            onStepIndexChange={(idx) => patchStory({ s7StepIndex: idx })}
            onCompleteStep={handleS7CompleteStep}
            onAskingWorkingChange={(asking) => patchStory({ s7AskingWorking: asking })}
            onReplyChoiceChange={(choice) => patchStory({ s7ReplyChoice: choice })}
            onNext={() => setScreen(8)}
          />
        )}

        {screen === 8 && (
          <Screen8SickNotes
            picks={story.s8Picks}
            onPicksChange={(picks) => patchStory({ s8Picks: picks })}
            onNext={() => setScreen(9)}
          />
        )}

        {screen === 9 && (
          <Screen9FixCode
            editStep={story.s9EditStep}
            verifiedRows={story.s9VerifiedRows}
            onEditStepChange={(step) => patchStory({ s9EditStep: step })}
            onVerifiedRowsChange={(rows) => patchStory({ s9VerifiedRows: rows })}
            onNext={() => setScreen(10)}
          />
        )}

        {screen === 10 && <Screen10Testing onNext={() => setScreen(11)} />}

        {screen === 11 && (
          <Screen11FlipBoundaryEdge
            flipState={story.s11Flip}
            onFlipChange={(next) => patchStory({ s11Flip: next })}
            onNext={() => setScreen(12)}
          />
        )}

        {screen === 12 && (
          <Screen12FlipAssertUnit
            flipState={story.s12Flip}
            onFlipChange={(next) => patchStory({ s12Flip: next })}
            onNext={() => setScreen(13)}
          />
        )}

        {screen === 13 && (
          <Screen14GummyDispenser
            stage={story.s14Stage}
            tries={story.s14Tries}
            test1Age={story.s14Test1Age}
            test1Out={story.s14Test1Out}
            test2Age={story.s14Test2Age}
            test2Out={story.s14Test2Out}
            writtenSpecs={story.s14WrittenSpecs}
            selectedBoundary={story.s14SelectedBoundary}
            selectedEdge={story.s14SelectedEdge}
            testRunResults={story.s14TestRunResults}
            onStateChange={(patch) =>
              patchStory({
                ...(patch.stage !== undefined ? { s14Stage: patch.stage } : {}),
                ...(patch.tries !== undefined ? { s14Tries: patch.tries } : {}),
                ...(patch.test1Age !== undefined ? { s14Test1Age: patch.test1Age } : {}),
                ...(patch.test1Out !== undefined ? { s14Test1Out: patch.test1Out } : {}),
                ...(patch.test2Age !== undefined ? { s14Test2Age: patch.test2Age } : {}),
                ...(patch.test2Out !== undefined ? { s14Test2Out: patch.test2Out } : {}),
                ...(patch.writtenSpecs !== undefined ? { s14WrittenSpecs: patch.writtenSpecs } : {}),
                ...(patch.selectedBoundary !== undefined
                  ? { s14SelectedBoundary: patch.selectedBoundary }
                  : {}),
                ...(patch.selectedEdge !== undefined ? { s14SelectedEdge: patch.selectedEdge } : {}),
                ...(patch.testRunResults !== undefined
                  ? { s14TestRunResults: patch.testRunResults }
                  : {}),
              })
            }
            onNext={() => setScreen(14)}
          />
        )}

        {screen === 14 && <Screen15Conclusion />}
      </main>
    </div>
  );
}
