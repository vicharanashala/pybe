import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canUnlockVictory,
  createInitialProgress,
  getArtifactMetadata,
  isStageComplete,
  loadProgressFromStorage,
  saveProgressToStorage,
  simulateAttributeAccess,
  STAGE1_HOTSPOTS,
  STAGE2_SLIPS,
  STAGE3_CONCEPT_PAIRS,
  STAGE3_RESTORE_OPTIONS,
  STAGE6_BLANKS,
  STAGE6_VECTORS,
  unlockNextStage,
  validateTemperature,
} from './missionLogic';

test('artifact metadata matches Blue Heron Vase specification', () => {
  const meta = getArtifactMetadata();
  assert.equal(meta.artifact, 'Blue Heron Vase');
  assert.equal(meta.value, '₹45,00,000');
  assert.equal(meta.condition, 'Good');
  assert.equal(meta.location, 'Gallery 4, Case B');
  assert.equal(meta.curatorId, 'CUR-7');
});

test('validateTemperature accepts 18-22 inclusive and rejects out-of-range values', () => {
  assert.equal(validateTemperature(18).accepted, true);
  assert.equal(validateTemperature(20).accepted, true);
  assert.equal(validateTemperature(22).accepted, true);
  assert.equal(validateTemperature(15).accepted, false);
  assert.equal(validateTemperature(25).accepted, false);
  assert.equal(validateTemperature(17.9).accepted, false);
  assert.equal(validateTemperature(Number.NaN).accepted, false);
});

test('simulateAttributeAccess allows public overwrites and blocks private access', () => {
  const pubRes = simulateAttributeAccess('public', 34, 20);
  assert.equal(pubRes.changed, true);
  assert.equal(pubRes.currentTemp, 34);
  assert.equal(pubRes.dangerLevel, 'warning');

  const privRes = simulateAttributeAccess('private', 34, 20);
  assert.equal(privRes.changed, false);
  assert.equal(privRes.currentTemp, 20);
  assert.equal(privRes.dangerLevel, 'blocked');
});

test('stage completion evaluates accurately for stages 1 through 6 and gates Stage 7 victory', () => {
  let progress = createInitialProgress();
  assert.equal(isStageComplete(progress, 1), false);
  assert.equal(canUnlockVictory(progress), false);

  progress = {
    ...progress,
    inspectedHotspots: STAGE1_HOTSPOTS.map((h) => h.id),
  };
  assert.equal(isStageComplete(progress, 1), true);
  progress = unlockNextStage(progress, 1);
  assert.equal(progress.highestUnlockedStage, 2);
  assert.deepEqual(progress.completedStages, [1]);

  // Stage 2
  const assignedRecords: Record<string, 'vase' | 'astrolabe'> = {};
  for (const slip of STAGE2_SLIPS) {
    assignedRecords[slip.id] = slip.target;
  }
  progress = { ...progress, assignedRecords };
  assert.equal(isStageComplete(progress, 2), true);

  // Stage 3
  const breachConceptsMatched: Record<string, string> = {};
  for (const pair of STAGE3_CONCEPT_PAIRS) {
    breachConceptsMatched[pair.id] = pair.expected;
  }
  const breachAttributesRestored = STAGE3_RESTORE_OPTIONS.filter((o) => o.isGenuine).map((o) => o.id);
  progress = { ...progress, breachConceptsMatched, breachAttributesRestored };
  assert.equal(isStageComplete(progress, 3), true);

  // Stage 4
  progress = {
    ...progress,
    testedPublicTamper: true,
    activatedPrivateLock: true,
    testedPrivateTamper: true,
  };
  assert.equal(isStageComplete(progress, 4), true);

  // Stage 5
  progress = {
    ...progress,
    getterReadCount: 1,
    validTempsTested: [18, 20],
    invalidTempsTested: [15, 25],
  };
  assert.equal(isStageComplete(progress, 5), true);

  // Stage 6
  const selectedBlanks: Record<string, string> = {};
  for (const b of STAGE6_BLANKS) {
    selectedBlanks[b.id] = b.correct;
  }
  const simulationVectorsPassed = STAGE6_VECTORS.map((v) => v.id);
  progress = { ...progress, selectedBlanks, simulationVectorsPassed };
  assert.equal(isStageComplete(progress, 6), true);
  assert.equal(canUnlockVictory(progress), true);

  // Removing one hotspot revokes victory unlock
  const incomplete = { ...progress, inspectedHotspots: [] };
  assert.equal(canUnlockVictory(incomplete), false);
  assert.equal(unlockNextStage(incomplete, 6).highestUnlockedStage, 6);
});

test('localStorage persistence round-trips progress and clamps tampered victory state', () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => {
      store.set(key, val);
    },
  };

  let progress = createInitialProgress();
  progress = unlockNextStage(progress, 1);
  progress = unlockNextStage(progress, 2);
  progress.currentScreen = 'stage';
  progress.activeStage = 3;

  saveProgressToStorage(mockStorage, progress);
  const restored = loadProgressFromStorage(mockStorage);

  assert.equal(restored.currentScreen, 'stage');
  assert.equal(restored.activeStage, 3);
  assert.equal(restored.highestUnlockedStage, 3);
  assert.deepEqual(restored.completedStages, [1, 2]);

  // Tampered victory in storage is rejected if stages 1-6 aren't complete
  saveProgressToStorage(mockStorage, {
    ...progress,
    currentScreen: 'victory',
    highestUnlockedStage: 7,
    completedStages: [1, 2, 7],
  });
  const clamped = loadProgressFromStorage(mockStorage);
  assert.equal(clamped.currentScreen, 'briefing');
  assert.equal(clamped.highestUnlockedStage, 6);
  assert.equal(clamped.completedStages.includes(7), false);
});
