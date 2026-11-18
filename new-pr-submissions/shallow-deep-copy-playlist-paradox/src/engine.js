/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Engine: Deterministic simulation of Python list assignment, shallow copy,
 * and deep copy behaviors for the nested playlist model.
 *
 * Naming convention: Master Setlist (original) & Remix Setlist (modified).
 * Moods: Intro, Chorus, Outro.
 */

export const INITIAL_MASTER_JAM = Object.freeze([
  ["Intro", "Kesariya", "Shayad"],
  ["Chorus", "Ilahi", "Gallan Goodiyaan"],
  ["Outro", "Apna Bana Le", "Raabta"]
]);

export const METHODS = Object.freeze([
  {
    id: "live_sync",
    roundNumber: 1,
    roundLabel: "Round 1 of 3",
    roundHeadline: "One setlist, two names",
    storyName: "Second name",
    revealRowLabel: "Assignment (second name, same setlist)",
    storyTagline: "Same setlist, two names.",
    roundDescription: "No new setlist. Reyansh just gave Ahaana's a second name.",
    fictionalName: "Live Sync",
    pythonName: "Assignment",
    pythonSyntax: "remix_setlist = master_setlist",
    tagline: "Same list, two names",
    description: "Binds both names to the exact same list. Zero copying occurs.",
    isAssignment: true,
  },
  {
    id: "remix_link",
    roundNumber: 2,
    roundLabel: "Round 2 of 3",
    roundHeadline: "A new setlist, same moods",
    storyName: "Quick copy",
    revealRowLabel: "Shallow copy (new setlist, same moods)",
    storyTagline: "New setlist, shared moods.",
    roundDescription: "Reyansh gets his own setlist, but it reuses Ahaana's moods.",
    fictionalName: "Remix Link",
    pythonName: "Shallow Copy",
    pythonSyntax: "remix_setlist = master_setlist.copy()",
    tagline: "New setlist, same moods",
    description: "Creates a new setlist, but keeps the same shared mood playlists inside.",
    isShallow: true,
  },
  {
    id: "solo_press",
    roundNumber: 3,
    roundLabel: "Round 3 of 3",
    roundHeadline: "A full duplicate",
    storyName: "Full duplicate",
    revealRowLabel: "Deep copy (full duplicate)",
    storyTagline: "New setlist, own copy of every mood.",
    roundDescription: "Reyansh gets his own setlist AND his own copy of every mood.",
    fictionalName: "Solo Press",
    pythonName: "Deep Copy",
    pythonSyntax: "remix_setlist = copy.deepcopy(master_setlist)",
    tagline: "Full duplicate",
    description: "Creates a new setlist and duplicates every mood playlist inside it.",
    isDeep: true,
  }
]);

export const ACTIONS = Object.freeze([
  {
    id: "replace_song",
    label: "Swap a song",
    shortLabel: "Swap a song",
    storySentence: "Reyansh swaps 'Kesariya' for 'Tum Se Hi' in Intro. 🎧",
    pythonCode: 'remix_setlist[0][1] = "Tum Se Hi"',
    description: 'Swap "Kesariya" for "Tum Se Hi" in the Intro mood',
    targetMood: "Intro",
    originalSong: "Kesariya",
    newSong: "Tum Se Hi",
    targetMoodIndex: 0,
    targetSongIndex: 1
  },
  {
    id: "add_mood",
    label: "Add a mood",
    shortLabel: "Add a mood",
    storySentence: "Reyansh adds a new mood: 'Retro'. 🕺",
    pythonCode: 'remix_setlist.append(["Retro", "Pal Pal Dil Ke Paas"])',
    description: 'Add a new mood called "Retro"',
    newMoodData: ["Retro", "Pal Pal Dil Ke Paas"]
  },
  {
    id: "remove_mood",
    label: "Remove a mood",
    shortLabel: "Remove a mood",
    storySentence: "Reyansh deletes the Outro mood. 🙈",
    pythonCode: 'remix_setlist.pop(2)',
    description: 'Remove the Outro mood',
    removedMoodIndex: 2,
    removedMoodName: "Outro"
  }
]);

// Nine automatically generated combinations grouped as 3 rounds of 3 changes
export const NINE_EXPERIMENTS = Object.freeze([
  {
    id: 1,
    roundNumber: 1,
    roundLabel: "Round 1 of 3",
    roundHeadline: "One setlist, two names",
    roundDescription: "No new setlist. Reyansh just gave Ahaana's a second name.",
    methodId: "live_sync",
    actionId: "replace_song",
    methodName: "Second name",
    actionName: "Swap a song",
    storyActionSentence: "Reyansh swaps 'Kesariya' for 'Tum Se Hi' in Intro. 🎧",
    summary: "Reyansh swaps 'Kesariya' for 'Tum Se Hi' in Intro. 🎧"
  },
  {
    id: 2,
    roundNumber: 1,
    roundLabel: "Round 1 of 3",
    roundHeadline: "One setlist, two names",
    roundDescription: "No new setlist. Reyansh just gave Ahaana's a second name.",
    methodId: "live_sync",
    actionId: "add_mood",
    methodName: "Second name",
    actionName: "Add a mood",
    storyActionSentence: "Reyansh adds a new mood: 'Retro'. 🕺",
    summary: "Reyansh adds a new mood: 'Retro'. 🕺"
  },
  {
    id: 3,
    roundNumber: 1,
    roundLabel: "Round 1 of 3",
    roundHeadline: "One setlist, two names",
    roundDescription: "No new setlist. Reyansh just gave Ahaana's a second name.",
    methodId: "live_sync",
    actionId: "remove_mood",
    methodName: "Second name",
    actionName: "Remove a mood",
    storyActionSentence: "Reyansh deletes the Outro mood. 🙈",
    summary: "Reyansh deletes the Outro mood. 🙈"
  },
  {
    id: 4,
    roundNumber: 2,
    roundLabel: "Round 2 of 3",
    roundHeadline: "A new setlist, same moods",
    roundDescription: "Reyansh gets his own setlist, but it reuses Ahaana's moods.",
    methodId: "remix_link",
    actionId: "replace_song",
    methodName: "Quick copy",
    actionName: "Swap a song",
    storyActionSentence: "Reyansh swaps 'Kesariya' for 'Tum Se Hi' in Intro. 🎧",
    summary: "Reyansh swaps 'Kesariya' for 'Tum Se Hi' in Intro. 🎧"
  },
  {
    id: 5,
    roundNumber: 2,
    roundLabel: "Round 2 of 3",
    roundHeadline: "A new setlist, same moods",
    roundDescription: "Reyansh gets his own setlist, but it reuses Ahaana's moods.",
    methodId: "remix_link",
    actionId: "add_mood",
    methodName: "Quick copy",
    actionName: "Add a mood",
    storyActionSentence: "Reyansh adds a new mood: 'Retro'. 🕺",
    summary: "Reyansh adds a new mood: 'Retro'. 🕺"
  },
  {
    id: 6,
    roundNumber: 2,
    roundLabel: "Round 2 of 3",
    roundHeadline: "A new setlist, same moods",
    roundDescription: "Reyansh gets his own setlist, but it reuses Ahaana's moods.",
    methodId: "remix_link",
    actionId: "remove_mood",
    methodName: "Quick copy",
    actionName: "Remove a mood",
    storyActionSentence: "Reyansh deletes the Outro mood. 🙈",
    summary: "Reyansh deletes the Outro mood. 🙈"
  },
  {
    id: 7,
    roundNumber: 3,
    roundLabel: "Round 3 of 3",
    roundHeadline: "A full duplicate",
    roundDescription: "Reyansh gets his own setlist AND his own copy of every mood.",
    methodId: "solo_press",
    actionId: "replace_song",
    methodName: "Full duplicate",
    actionName: "Swap a song",
    storyActionSentence: "Reyansh swaps 'Kesariya' for 'Tum Se Hi' in Intro. 🎧",
    summary: "Reyansh swaps 'Kesariya' for 'Tum Se Hi' in Intro. 🎧"
  },
  {
    id: 8,
    roundNumber: 3,
    roundLabel: "Round 3 of 3",
    roundHeadline: "A full duplicate",
    roundDescription: "Reyansh gets his own setlist AND his own copy of every mood.",
    methodId: "solo_press",
    actionId: "add_mood",
    methodName: "Full duplicate",
    actionName: "Add a mood",
    storyActionSentence: "Reyansh adds a new mood: 'Retro'. 🕺",
    summary: "Reyansh adds a new mood: 'Retro'. 🕺"
  },
  {
    id: 9,
    roundNumber: 3,
    roundLabel: "Round 3 of 3",
    roundHeadline: "A full duplicate",
    roundDescription: "Reyansh gets his own setlist AND his own copy of every mood.",
    methodId: "solo_press",
    actionId: "remove_mood",
    methodName: "Full duplicate",
    actionName: "Remove a mood",
    storyActionSentence: "Reyansh deletes the Outro mood. 🙈",
    summary: "Reyansh deletes the Outro mood. 🙈"
  }
]);

/**
 * Creates a pristine, deeply isolated graph for the baseline master collection.
 */
export function createBaselineGraph() {
  const m0 = ["Intro", "Kesariya", "Shayad"];
  const m1 = ["Chorus", "Ilahi", "Gallan Goodiyaan"];
  const m2 = ["Outro", "Apna Bana Le", "Raabta"];
  return [m0, m1, m2];
}

/**
 * Clones a snapshot of data (deep value copy for UI rendering immutability).
 */
export function cloneSnapshot(list) {
  return list.map(mood => [...mood]);
}

/**
 * Runs a deterministic simulation with a fresh baseline graph.
 * Does not mutate any stored state or fixtures.
 */
export function runSimulation({ methodId, actionId }) {
  // 1. Construct a fresh baseline graph
  const master = createBaselineGraph();
  let afterparty;

  // 2. Establish reference relationships based on method
  if (methodId === "live_sync") {
    // Both variables point to the exact same outer array object
    afterparty = master;
  } else if (methodId === "remix_link") {
    // New outer array containing identical references to inner mood arrays
    afterparty = [master[0], master[1], master[2]];
  } else if (methodId === "solo_press") {
    // New outer array containing brand new cloned inner mood arrays
    afterparty = [
      [...master[0]],
      [...master[1]],
      [...master[2]]
    ];
  } else {
    throw new Error(`Unknown methodId: ${methodId}`);
  }

  // Pre-mutation identity checks (before any mutation occurs)
  const outerIdentical = afterparty === master;
  const innerMood0Identical = afterparty[0] === master[0];
  const innerMood1Identical = afterparty[1] === master[1];
  const innerMood2Identical = afterparty[2] === master[2];

  // Take immutable snapshot BEFORE mutation
  const masterBefore = cloneSnapshot(master);
  const afterpartyBefore = cloneSnapshot(afterparty);

  // 3. Apply the chosen mutation strictly to `afterparty`
  let mutationSummary = {};
  if (actionId === "replace_song") {
    const oldSong = afterparty[0][1];
    afterparty[0][1] = "Tum Se Hi";
    mutationSummary = {
      actionId,
      type: "replace_song",
      moodIndex: 0,
      moodName: "Intro",
      songIndex: 1,
      oldSong,
      newSong: "Tum Se Hi",
      pythonSyntax: 'remix_setlist[0][1] = "Tum Se Hi"'
    };
  } else if (actionId === "add_mood") {
    const addedMood = ["Retro", "Pal Pal Dil Ke Paas"];
    afterparty.push(addedMood);
    mutationSummary = {
      actionId,
      type: "add_mood",
      moodIndex: afterparty.length - 1,
      moodName: "Retro",
      songs: ["Pal Pal Dil Ke Paas"],
      pythonSyntax: 'remix_setlist.append(["Retro", "Pal Pal Dil Ke Paas"])'
    };
  } else if (actionId === "remove_mood") {
    const popped = afterparty.splice(2, 1)[0];
    mutationSummary = {
      actionId,
      type: "remove_mood",
      removedIndex: 2,
      removedMoodName: popped ? popped[0] : "Outro",
      pythonSyntax: 'remix_setlist.pop(2)'
    };
  } else {
    throw new Error(`Unknown actionId: ${actionId}`);
  }

  // Take immutable snapshot AFTER mutation
  const masterAfter = cloneSnapshot(master);
  const afterpartyAfter = cloneSnapshot(afterparty);

  // 4. Derive change detection
  const isMasterChanged = JSON.stringify(masterBefore) !== JSON.stringify(masterAfter);

  // 5. Generate precise explanation for learner
  let explanation = "";
  let masterChangeDetail = "";

  if (methodId === "live_sync") {
    if (actionId === "replace_song") {
      explanation = "There's only one setlist, so the swap shows under both names.";
      masterChangeDetail = "Tum Se Hi now plays in Ahaana's Intro too.";
    } else if (actionId === "add_mood") {
      explanation = "There's only one setlist, so Retro shows under both names.";
      masterChangeDetail = "Retro appeared in Ahaana's setlist too.";
    } else if (actionId === "remove_mood") {
      explanation = "There's only one setlist, so Outro disappears under both names.";
      masterChangeDetail = "Outro vanished from Ahaana's setlist too.";
    }
  } else if (methodId === "remix_link") {
    if (actionId === "replace_song") {
      explanation = "Intro is the same playlist in both setlists, so the change shows in both.";
      masterChangeDetail = "Tum Se Hi now plays in Ahaana's Intro too.";
    } else if (actionId === "add_mood") {
      explanation = "The setlists are separate, so Retro lands only in Reyansh's.";
      masterChangeDetail = "Ahaana's setlist still has 3 moods.";
    } else if (actionId === "remove_mood") {
      explanation = "Removing a mood from his own setlist doesn't touch Ahaana's.";
      masterChangeDetail = "Ahaana still has all 3 moods, Outro included.";
    }
  } else if (methodId === "solo_press") {
    if (actionId === "replace_song") {
      explanation = "Reyansh edited his own copy of Intro. Ahaana's Intro is untouched.";
      masterChangeDetail = "Ahaana's Intro still has 'Kesariya'.";
    } else if (actionId === "add_mood") {
      explanation = "Retro lives only in Reyansh's setlist.";
      masterChangeDetail = "Ahaana still has 3 moods.";
    } else if (actionId === "remove_mood") {
      explanation = "Outro is gone from Reyansh's setlist only.";
      masterChangeDetail = "Ahaana still has all 3 moods.";
    }
  }

  return {
    methodId,
    actionId,
    outerIdentical,
    innerMood0Identical,
    innerMood1Identical,
    innerMood2Identical,
    masterBefore,
    masterAfter,
    afterpartyBefore,
    afterpartyAfter,
    isMasterChanged,
    masterChangeDetail,
    explanation,
    mutationSummary
  };
}

/**
 * Evaluates the chosen method against all 3 mutation actions for Chapter 4: Save the Jam.
 */
export function evaluateSaveTheJam(chosenMethodId) {
  const method = METHODS.find(m => m.id === chosenMethodId);
  if (!method) {
    throw new Error(`Unknown methodId for Save the Jam: ${chosenMethodId}`);
  }

  const checks = ACTIONS.map(action => {
    const sim = runSimulation({ methodId: chosenMethodId, actionId: action.id });
    const passed = !sim.isMasterChanged; // Must NOT change Master

    let failureReason = null;
    if (!passed) {
      if (action.id === "replace_song") {
        failureReason = "Replacing a song also changed the Master Setlist.";
      } else if (action.id === "add_mood") {
        failureReason = "Adding a mood also modified the Master Setlist.";
      } else if (action.id === "remove_mood") {
        failureReason = "Removing a mood also removed it from the Master Setlist.";
      }
    }

    return {
      actionId: action.id,
      actionLabel: action.shortLabel,
      passed,
      failureReason,
      masterChangeDetail: sim.masterChangeDetail,
      explanation: sim.explanation
    };
  });

  const allPassed = checks.every(c => c.passed);

  return {
    methodId: chosenMethodId,
    methodName: method.fictionalName,
    allPassed,
    checks
  };
}

export function getJournalKey(methodId, actionId) {
  return `${methodId}__${actionId}`;
}
