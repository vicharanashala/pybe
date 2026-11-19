import { useEffect, useState, useCallback } from 'react';
import {
  canUnlockVictory,
  createInitialProgress,
  isStageComplete,
  loadProgressFromStorage,
  MissionProgress,
  saveProgressToStorage,
  STAGES,
  StageId,
  unlockNextStage,
} from './game/missionLogic';
import { GameHeader } from './components/GameHeader';
import { StartScreen } from './components/StartScreen';
import { MissionBriefing } from './components/MissionBriefing';
import { StageShell } from './components/StageShell';
import { Stage1Arrival } from './components/Stage1Arrival';
import { Stage2Discovery } from './components/Stage2Discovery';
import { Stage3Breach } from './components/Stage3Breach';
import { Stage4ControlRoom } from './components/Stage4ControlRoom';
import { Stage5Protection } from './components/Stage5Protection';
import { Stage6FinalTest } from './components/Stage6FinalTest';
import { Stage7Victory } from './components/Stage7Victory';

const COMPLETION_SUMMARIES: Record<StageId, string> = {
  1: 'You recorded all 4 facts about the Blue Heron Vase using Python variables. Next, check the curator desk where loose notes are getting mixed up.',
  2: 'Great work organizing the archive folders! Suddenly, a midnight alarm triggers in Gallery 4—head back to investigate the breach.',
  3: 'You repaired the tampered attributes on blue_heron_case. Now trace how the attacker changed them by entering the Security Control Room.',
  4: 'The private __temperature lock stopped direct outside changes! Next, build a safe getter and setter so curators can still manage the display case.',
  5: 'Your getter, setter, and 18°C–22°C safety rule work smoothly! Proceed to the Final Security Test before the museum opens.',
  6: 'Every security check passed and the Blue Heron Vase is safe! Claim your Master of Encapsulation badge.',
  7: 'Mission Complete!',
};

function getInitialState(): MissionProgress {
  const storage = typeof window !== 'undefined' ? window.localStorage : null;
  const loaded = loadProgressFromStorage(storage);

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && (loaded.currentScreen === 'title' || loaded.currentScreen === 'intro')) {
      return {
        ...loaded,
        currentScreen: 'briefing',
      };
    }
  }
  return loaded;
}

export default function App() {
  const [progress, setProgress] = useState<MissionProgress>(getInitialState);

  useEffect(() => {
    saveProgressToStorage(typeof window !== 'undefined' ? window.localStorage : null, progress);
  }, [progress]);

  useEffect(() => {
    const stateLabel =
      progress.currentScreen === 'title' || progress.currentScreen === 'intro'
        ? 'title'
        : progress.currentScreen === 'victory'
          ? 'gameover'
          : 'playing';
    document.body.dataset.state = stateLabel;
  }, [progress.currentScreen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [progress.currentScreen, progress.activeStage]);

  const updateProgress = useCallback(
    (updater: (prev: MissionProgress) => MissionProgress) => {
      setProgress((prev) => {
        let next = updater(prev);
        if (next.currentScreen === 'stage' && next.activeStage <= 6) {
          if (isStageComplete(next, next.activeStage)) {
            next = unlockNextStage(next, next.activeStage);
          }
        }
        return next;
      });
    },
    []
  );

  const handleStartMission = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      currentScreen: 'intro',
    }));
  }, []);

  const handleContinueToBriefing = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      currentScreen: 'briefing',
    }));
  }, []);

  const handleResumeSaved = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      currentScreen: canUnlockVictory(prev) ? 'victory' : 'briefing',
    }));
  }, []);

  const handleSelectStage = useCallback((stageId: StageId) => {
    setProgress((prev) => {
      if (stageId > prev.highestUnlockedStage) return prev;
      if (stageId === 7) {
        if (!canUnlockVictory(prev)) return prev;
        return unlockNextStage(
          { ...prev, currentScreen: 'victory', activeStage: 7 },
          7
        );
      }
      return {
        ...prev,
        currentScreen: 'stage',
        activeStage: stageId,
      };
    });
  }, []);

  const handleStartInvestigation = useCallback(() => {
    setProgress((prev) => {
      if (canUnlockVictory(prev)) {
        return unlockNextStage({ ...prev, currentScreen: 'victory', activeStage: 7 }, 7);
      }
      return {
        ...prev,
        currentScreen: 'stage',
        activeStage: prev.highestUnlockedStage <= 6 ? prev.highestUnlockedStage : 6,
      };
    });
  }, []);

  const handleNextStage = useCallback(() => {
    setProgress((prev) => {
      const completed = unlockNextStage(prev, prev.activeStage);
      if (prev.activeStage >= 6) {
        if (!canUnlockVictory(completed)) return completed;
        return unlockNextStage(
          {
            ...completed,
            currentScreen: 'victory',
            activeStage: 7,
          },
          7
        );
      }
      const nextStage = (prev.activeStage + 1) as StageId;
      return {
        ...completed,
        currentScreen: 'stage',
        activeStage: nextStage,
      };
    });
  }, []);

  const handleResetMission = useCallback(() => {
    const fresh = createInitialProgress();
    setProgress(fresh);
    saveProgressToStorage(typeof window !== 'undefined' ? window.localStorage : null, fresh);
  }, []);

  const hasSavedProgress =
    progress.completedStages.length > 0 || progress.highestUnlockedStage > 1;

  if (progress.currentScreen === 'title' || progress.currentScreen === 'intro') {
    return (
      <StartScreen
        mode={progress.currentScreen}
        onStartMission={handleStartMission}
        onContinueToBriefing={handleContinueToBriefing}
        hasSavedProgress={hasSavedProgress}
        onResumeSaved={handleResumeSaved}
      />
    );
  }

  const activeStageDescriptor =
    STAGES.find((s) => s.id === progress.activeStage) ?? STAGES[0];

  const headerStatus =
    progress.currentScreen === 'victory'
      ? 'SECURE'
      : progress.currentScreen === 'briefing'
        ? progress.highestUnlockedStage >= 7
          ? 'SECURE'
          : 'MONITORING'
        : activeStageDescriptor.securityStatus;

  const stageDone = isStageComplete(progress, progress.activeStage);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#3F493D]">
      <GameHeader
        activeStage={progress.activeStage}
        highestUnlockedStage={progress.highestUnlockedStage}
        completedStages={progress.completedStages}
        currentScreen={progress.currentScreen}
        securityStatus={headerStatus}
        onSelectStage={handleSelectStage}
        onOpenBriefing={handleContinueToBriefing}
        onResetMission={handleResetMission}
      />

      {progress.currentScreen === 'briefing' && (
        <MissionBriefing
          progress={progress}
          onStartInvestigation={handleStartInvestigation}
          onSelectStage={handleSelectStage}
        />
      )}

      {progress.currentScreen === 'victory' && canUnlockVictory(progress) && (
        <Stage7Victory onReplayMission={handleResetMission} />
      )}

      {progress.currentScreen === 'stage' && (
        <StageShell
          stage={activeStageDescriptor}
          isComplete={stageDone}
          completionSummary={COMPLETION_SUMMARIES[progress.activeStage]}
          onNextStage={handleNextStage}
          nextButtonLabel={
            progress.activeStage === 6 ? 'Complete Mission & View Badge' : undefined
          }
        >
          {progress.activeStage === 1 && (
            <Stage1Arrival
              inspectedHotspots={progress.inspectedHotspots}
              onInspectHotspot={(id) =>
                updateProgress((prev) => ({
                  ...prev,
                  inspectedHotspots: prev.inspectedHotspots.includes(id)
                    ? prev.inspectedHotspots
                    : [...prev.inspectedHotspots, id],
                }))
              }
            />
          )}

          {progress.activeStage === 2 && (
            <Stage2Discovery
              assignedRecords={progress.assignedRecords}
              onAssignRecord={(slipId, target) =>
                updateProgress((prev) => ({
                  ...prev,
                  assignedRecords: {
                    ...prev.assignedRecords,
                    [slipId]: target,
                  },
                }))
              }
            />
          )}

          {progress.activeStage === 3 && (
            <Stage3Breach
              conceptsMatched={progress.breachConceptsMatched}
              attributesRestored={progress.breachAttributesRestored}
              onMatchConcept={(pairId, choice) =>
                updateProgress((prev) => ({
                  ...prev,
                  breachConceptsMatched: {
                    ...prev.breachConceptsMatched,
                    [pairId]: choice,
                  },
                }))
              }
              onRestoreAttribute={(optionId) =>
                updateProgress((prev) => ({
                  ...prev,
                  breachAttributesRestored: prev.breachAttributesRestored.includes(optionId)
                    ? prev.breachAttributesRestored
                    : [...prev.breachAttributesRestored, optionId],
                }))
              }
            />
          )}

          {progress.activeStage === 4 && (
            <Stage4ControlRoom
              testedPublicTamper={progress.testedPublicTamper}
              activatedPrivateLock={progress.activatedPrivateLock}
              testedPrivateTamper={progress.testedPrivateTamper}
              onUpdateStage4={(patch) =>
                updateProgress((prev) => ({
                  ...prev,
                  ...patch,
                }))
              }
            />
          )}

          {progress.activeStage === 5 && (
            <Stage5Protection
              getterReadCount={progress.getterReadCount}
              validTempsTested={progress.validTempsTested}
              invalidTempsTested={progress.invalidTempsTested}
              onReadGetter={() =>
                updateProgress((prev) => ({
                  ...prev,
                  getterReadCount: prev.getterReadCount + 1,
                }))
              }
              onTestSetter={(temp, accepted) =>
                updateProgress((prev) => {
                  if (accepted) {
                    return {
                      ...prev,
                      validTempsTested: prev.validTempsTested.includes(temp)
                        ? prev.validTempsTested
                        : [...prev.validTempsTested, temp],
                    };
                  }
                  return {
                    ...prev,
                    invalidTempsTested: prev.invalidTempsTested.includes(temp)
                      ? prev.invalidTempsTested
                      : [...prev.invalidTempsTested, temp],
                  };
                })
              }
            />
          )}

          {progress.activeStage === 6 && (
            <Stage6FinalTest
              selectedBlanks={progress.selectedBlanks}
              simulationVectorsPassed={progress.simulationVectorsPassed}
              onSelectBlank={(blankId, value) =>
                updateProgress((prev) => ({
                  ...prev,
                  selectedBlanks: {
                    ...prev.selectedBlanks,
                    [blankId]: value,
                  },
                }))
              }
              onPassVector={(vectorId) =>
                updateProgress((prev) => ({
                  ...prev,
                  simulationVectorsPassed: prev.simulationVectorsPassed.includes(vectorId)
                    ? prev.simulationVectorsPassed
                    : [...prev.simulationVectorsPassed, vectorId],
                }))
              }
            />
          )}
        </StageShell>
      )}
    </div>
  );
}
