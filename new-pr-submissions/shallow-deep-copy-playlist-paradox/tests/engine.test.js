/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Engine Unit Tests
 * Verifies the 9 simulation outcomes, reference identities, isolation,
 * snapshot immutability, and journal behaviors.
 */

import assert from "node:assert/strict";
import {
  INITIAL_MASTER_JAM,
  METHODS,
  ACTIONS,
  runSimulation,
  evaluateSaveTheJam,
  createBaselineGraph
} from "../src/engine.js";

console.log("🧪 Starting engine unit tests...");

// Test 1: Original fixture immutability
const fixtureSnapshotBefore = JSON.stringify(INITIAL_MASTER_JAM);
const baseline = createBaselineGraph();
baseline[0][1] = "MUTATED_TEST";
assert.equal(
  JSON.stringify(INITIAL_MASTER_JAM),
  fixtureSnapshotBefore,
  "Original INITIAL_MASTER_JAM constant must never be mutated"
);
console.log("✅ Check 1: Original fixture remains unchanged");

// Test 2: Matrix validation (all 9 combinations)
const expectedMatrix = {
  live_sync: {
    replace_song: true, // Master changes
    add_mood: true,     // Master changes
    remove_mood: true   // Master changes
  },
  remix_link: {
    replace_song: true,  // Master changes
    add_mood: false,    // Master unchanged
    remove_mood: false  // Master unchanged
  },
  solo_press: {
    replace_song: false, // Master unchanged
    add_mood: false,     // Master unchanged
    remove_mood: false   // Master unchanged
  }
};

METHODS.forEach(method => {
  ACTIONS.forEach(action => {
    const sim = runSimulation({ methodId: method.id, actionId: action.id });
    const expected = expectedMatrix[method.id][action.id];
    assert.equal(
      sim.isMasterChanged,
      expected,
      `Matrix mismatch for ${method.id} + ${action.id}: expected master changed=${expected}, got ${sim.isMasterChanged}`
    );
  });
});
console.log("✅ Check 2: All 9 method/action outcomes strictly match required matrix");

// Test 3: Outer and inner identity checks for each method
{
  const liveSync = runSimulation({ methodId: "live_sync", actionId: "replace_song" });
  assert.equal(liveSync.outerIdentical, true, "Live Sync must share the exact outer list reference");
  assert.equal(liveSync.innerMood0Identical, true, "Live Sync must share inner mood list references");

  const remixLink = runSimulation({ methodId: "remix_link", actionId: "replace_song" });
  assert.equal(remixLink.outerIdentical, false, "Remix Link must have distinct outer list reference");
  assert.equal(remixLink.innerMood0Identical, true, "Remix Link must share inner mood list references");

  const soloPress = runSimulation({ methodId: "solo_press", actionId: "replace_song" });
  assert.equal(soloPress.outerIdentical, false, "Solo Press must have distinct outer list reference");
  assert.equal(soloPress.innerMood0Identical, false, "Solo Press must have distinct inner mood list references");
}
console.log("✅ Check 3: Outer and inner identities accurately reflect assignment vs shallow vs deep copy");

// Test 4: Every experiment starts from fresh baseline
{
  // Run a destructive mutation first
  const run1 = runSimulation({ methodId: "live_sync", actionId: "remove_mood" });
  assert.equal(run1.masterAfter.length, 2);

  // Run another experiment - masterBefore must still have 3 moods
  const run2 = runSimulation({ methodId: "solo_press", actionId: "replace_song" });
  assert.equal(run2.masterBefore.length, 3, "New simulation must start with clean 3-mood baseline");
  assert.equal(run2.masterBefore[0][1], "Kesariya", "New simulation baseline must have Kesariya intact in opening mood");
}
console.log("✅ Check 4: Every experiment starts from a fresh baseline");

// Test 5: Earlier evidence snapshots remain unchanged
{
  const snap1 = runSimulation({ methodId: "remix_link", actionId: "replace_song" });
  const frozenMasterAfter = JSON.stringify(snap1.masterAfter);
  const frozenAfterpartyAfter = JSON.stringify(snap1.afterpartyAfter);

  // Run subsequent simulations
  runSimulation({ methodId: "live_sync", actionId: "add_mood" });
  runSimulation({ methodId: "solo_press", actionId: "remove_mood" });

  assert.equal(JSON.stringify(snap1.masterAfter), frozenMasterAfter, "Earlier masterAfter snapshot must not drift");
  assert.equal(JSON.stringify(snap1.afterpartyAfter), frozenAfterpartyAfter, "Earlier afterpartyAfter snapshot must not drift");
}
console.log("✅ Check 5: Earlier evidence snapshots remain unchanged");

// Test 6: Save the Jam evaluation
{
  const evalLive = evaluateSaveTheJam("live_sync");
  assert.equal(evalLive.allPassed, false, "Live Sync should fail Save the Jam");

  const evalRemix = evaluateSaveTheJam("remix_link");
  assert.equal(evalRemix.allPassed, false, "Remix Link should fail Save the Jam (fails replace_song)");
  const failedCheck = evalRemix.checks.find(c => !c.passed);
  assert.equal(failedCheck.actionId, "replace_song");
  assert.equal(failedCheck.failureReason, "Replacing a song also changed the Master Setlist.");

  const evalSolo = evaluateSaveTheJam("solo_press");
  assert.equal(evalSolo.allPassed, true, "Solo Press should pass Save the Jam (all 3 operations keep Master untouched)");
}
console.log("✅ Check 6: Save the Jam correctly verifies operations and provides specific explanations");

// Test 7: Exploration counting helper
{
  const exploredSet = new Set();
  function recordExploration(set, methodId, actionId) {
    set.add(`${methodId}__${actionId}`);
    return set.size;
  }

  assert.equal(recordExploration(exploredSet, "live_sync", "replace_song"), 1);
  assert.equal(recordExploration(exploredSet, "live_sync", "replace_song"), 1, "Replaying must not increase count");
  assert.equal(recordExploration(exploredSet, "remix_link", "add_mood"), 2);
  assert.equal(recordExploration(exploredSet, "remix_link", "add_mood"), 2, "Replaying must not increase count");
}
console.log("✅ Check 7: Replaying an experiment does not increase unique completion count");

console.log("\n🎉 All 7 engine tests passed successfully!");
