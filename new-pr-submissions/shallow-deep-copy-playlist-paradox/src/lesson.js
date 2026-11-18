/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Lesson Content & Story Definitions
 * MetaMix: The Playlist Paradox | Complete PyBe Interactive Python Lesson
 * Palette: Teal (#087F8C), Soft teal (#65B8B0), Pale aqua (#E8F6F3), Cream (#FFFDF7), Dark teal (#243B3A).
 */

import ahaanaPortrait from "./assets/images/portrait_ahaana.jpg";
import reyanshPortrait from "./assets/images/portrait_reyansh.jpg";

export const CHARACTERS = Object.freeze({
  ahaana: {
    id: "ahaana",
    name: "Ahaana",
    chatName: "Ahaana (You)",
    role: "Host & DJ (You)",
    vibe: "Curated the Farewell Jam and created the Remix Setlist for friends to test.",
    avatarImg: ahaanaPortrait,
    badgeBg: "#243B3A",
    badgeText: "#FFFDF7",
  },
  reyansh: {
    id: "reyansh",
    name: "Reyansh",
    chatName: "Reyansh",
    role: "Party Enthusiast",
    vibe: "Dramatic, energetic, and obsessed with high-energy party bangers.",
    avatarImg: reyanshPortrait,
    badgeBg: "#087F8C",
    badgeText: "#FFFDF7",
  }
});

export const CHAPTERS = Object.freeze([
  { id: "join", number: 1, title: "Setting the Scene", shortTitle: "Ch 1: Setting Scene" },
  { id: "mystery", number: 2, title: "The Paradox", shortTitle: "Ch 2: The Paradox" },
  { id: "lab", number: 3, title: "Sound Lab", shortTitle: "Ch 3: Sound Lab" },
  { id: "reveal", number: 4, title: "The Reveal", shortTitle: "Ch 4: The Reveal" }
]);

// Chapter 1, Scene 2 Dialogue: Short 4-message chat
export const SCENE_2_DIALOGUE = Object.freeze([
  {
    speaker: "ahaana",
    text: "Rule #1 of tonight: nobody touches my Master Setlist. 🔒"
  },
  {
    speaker: "reyansh",
    text: "Relax, I made my own copy. Watch me remix! 😎"
  },
  {
    speaker: "ahaana",
    text: "Then why did 'Tum Se Hi' just show up in MY Master Setlist?! 😱"
  },
  {
    speaker: "reyansh",
    text: "Funny thing: Retro didn't. So… half my fault? 😅"
  }
]);

// Chapter 2: Gut-feeling options (saved for Chapter 4 comparison)
export const INITIAL_THEORIES = Object.freeze([
  {
    id: "shared",
    label: "a",
    title: "One setlist, two names",
    shortLabel: "One setlist, two names"
  },
  {
    id: "separate",
    label: "b",
    title: "Two totally separate setlists",
    shortLabel: "Two totally separate setlists"
  },
  {
    id: "partial",
    label: "c",
    title: "Separate setlists, shared moods",
    shortLabel: "Separate setlists, shared moods"
  }
]);

// Chapter 4: Exactly Five Navigable Tabs in Specified Order
export const PYTHON_TABS = Object.freeze([
  { id: "assignment", number: 1, label: "Assignment", subtitle: "Second name, same setlist" },
  { id: "shallow_copy", number: 2, label: "Shallow Copy", subtitle: "New setlist, same moods" },
  { id: "deep_copy", number: 3, label: "Deep Copy", subtitle: "Full duplicate" },
  { id: "identity_equality", number: 4, label: "Same Songs vs Same Setlist", subtitle: "== vs is" },
  { id: "quiz", number: 5, label: "Time to Test", subtitle: "Assessment" }
]);

export const SETLIST_SETUP_CODE = `master_setlist = [
    ["Intro", "Kesariya", "Shayad"],
    ["Chorus", "Ilahi", "Gallan Goodiyaan"],
    ["Outro", "Apna Bana Le", "Raabta"],
]`;

export const PYTHON_DETAILS = Object.freeze({
  assignment: {
    id: "assignment",
    tabNumber: 1,
    title: "Assignment",
    fictionalName: "Second name, same setlist",
    analogy: "A nickname. 'Ahaana' and 'Didi' are the same person.",
    definition: "Assignment makes no copy. Both names point to the same list.",
    trickToRemember: "One setlist, two names.",
    exampleCode: `remix_setlist = master_setlist          # same setlist, two names
remix_setlist[0][1] = "Tum Se Hi"       # change a song in Intro
print(master_setlist[0][1])             # "Tum Se Hi": Master changed too!`,
    exampleExplanation: "Because remix_setlist and master_setlist point to the very same list, every change shows up under both names.",
    referenceGraphDescription: "Both names point to the very same setlist.",
    songChangeDetail: "Swapping a song edits the only Intro mood, so Master changes too.",
    moodListChangeDetail: "Adding or removing a mood edits the shared setlist, so Master changes too.",
    masterSwapChanged: true,
    masterMoodChanged: true,
    masterImpactWhy: "Why? One setlist, two names.",
    graphType: "assignment"
  },
  shallow_copy: {
    id: "shallow_copy",
    tabNumber: 2,
    title: "Shallow Copy",
    fictionalName: "New setlist, same moods",
    analogy: "A new folder, same papers inside. Edit a paper and everyone sees it.",
    definition: "A shallow copy builds a new setlist, while sharing the moods inside.",
    trickToRemember: "New setlist, shared moods.",
    exampleCode: `remix_setlist = master_setlist.copy()                    # new setlist, same moods
remix_setlist.append(["Retro", "Pal Pal Dil Ke Paas"])   # add a mood: Master untouched
remix_setlist[0][1] = "Tum Se Hi"                        # shared Intro: Master changes too!`,
    exampleExplanation: "Adding or removing a mood stays in remix_setlist. Swapping a song changes the shared Intro in Master too.",
    referenceGraphDescription: "Two separate setlists, sharing the same mood playlists inside.",
    songChangeDetail: "Swapping a song edits the shared mood, so Master shows it too.",
    moodListChangeDetail: "Adding or removing a mood edits only remix_setlist. Master stays safe.",
    masterSwapChanged: true,
    masterMoodChanged: false,
    masterImpactWhy: "Why? Moods are shared, setlists are not.",
    graphType: "shallow_copy"
  },
  deep_copy: {
    id: "deep_copy",
    tabNumber: 3,
    title: "Deep Copy",
    fictionalName: "Full duplicate",
    analogy: "Photocopy everything: the folder and every page. Doodle freely.",
    definition: "A deep copy makes a separate setlist and copies every mood inside.",
    trickToRemember: "Everything gets its own copy.",
    exampleCode: `import copy
remix_setlist = copy.deepcopy(master_setlist)   # new setlist, new moods
remix_setlist[0][1] = "Tum Se Hi"               # only Remix changes
print(master_setlist[0][1])                     # still "Kesariya": Master is safe!`,
    exampleExplanation: "copy.deepcopy() duplicates both the setlist and every mood inside, so Master stays safe.",
    referenceGraphDescription: "Two separate setlists with separate mood playlists. Nothing is shared.",
    songChangeDetail: "Swapping a song changes only Reyansh's own mood. Master stays safe.",
    moodListChangeDetail: "Adding or removing a mood changes only Reyansh's setlist. Master stays safe.",
    masterSwapChanged: false,
    masterMoodChanged: false,
    masterImpactWhy: "Why? Everything is copied.",
    graphType: "deep_copy"
  },
  identity_equality: {
    id: "identity_equality",
    tabNumber: 4,
    title: "Same Songs vs Same Setlist",
    fictionalName: "== vs is",
    analogy: "Identical twins. Look the same, still two different people.",
    definition: "In Python, == asks 'same songs?' while is asks 'same setlist?'",
    trickToRemember: "== checks songs; is checks if both names share one list.",
    exampleCode: `import copy
remix_setlist = copy.deepcopy(master_setlist)
print(master_setlist == remix_setlist)   # True: same songs
print(master_setlist is remix_setlist)   # False: not the very same setlist`,
    operatorTable: [
      { operator: "==", meaning: "Asks \u201Csame songs?\u201D \u2014 matching songs in order" },
      { operator: "is", meaning: "Asks \u201Csame setlist?\u201D \u2014 same list behind both names" }
    ],
    visualExplanation: "Separate lists can hold the same songs (== True) without being one list (is False).",
    graphType: "identity"
  }
});

// Final Assessment: Five Short Story-First Questions
export const FINAL_QUIZ_QUESTIONS = Object.freeze([
  {
    id: "q1",
    number: 1,
    topic: "ASSIGNMENT",
    question: "Reyansh just gives Ahaana's setlist a second name, then deletes the Outro mood. What does Ahaana's Master look like now?",
    wrongFeedback: "Not quite. Replay Round 1: one setlist, two names. 🔁",
    explanationParts: [
      { text: "One setlist, two names: " },
      { code: "remix_setlist = master_setlist" },
      { text: " is assignment, so every edit shows under both names." }
    ],
    options: [
      {
        id: "a",
        label: "Outro disappears from hers too.",
        correct: true
      },
      {
        id: "b",
        label: "Nothing. Reyansh only edited his own setlist.",
        correct: false
      },
      {
        id: "c",
        label: "It disappears, but only after she refreshes.",
        correct: false
      }
    ]
  },
  {
    id: "q2",
    number: 2,
    topic: "SHALLOW COPY · SWAPPING A SONG",
    question: "Reyansh makes a quick copy, then swaps 'Kesariya' for 'Tum Se Hi' in his Intro. What does Ahaana's Intro show now?",
    wrongFeedback: "Not quite. Think Round 2: the moods were shared. 🔁",
    explanationParts: [
      { text: "A quick copy is a shallow copy. " },
      { code: 'remix_setlist[0][1] = "Tum Se Hi"' },
      { text: " edits the shared Intro. ([0][1] = first mood, its first song.)" }
    ],
    options: [
      {
        id: "a",
        label: "'Tum Se Hi'. The Intro playlist is shared.",
        correct: true
      },
      {
        id: "b",
        label: "'Kesariya'. A copy never shares anything.",
        correct: false
      },
      {
        id: "c",
        label: "Both, 'Kesariya' and 'Tum Se Hi'.",
        correct: false
      }
    ]
  },
  {
    id: "q3",
    number: 3,
    topic: "CHOOSING THE RIGHT COPY",
    question: "Ahaana wants Reyansh to swap songs, add moods and delete moods freely. Which setup keeps her Master safe every time?",
    wrongFeedback: "Not quite. Which round kept the Master safe every time? 🔁",
    explanationParts: [
      { text: "A full duplicate is a deep copy: " },
      { code: "remix_setlist = copy.deepcopy(master_setlist)" },
      { text: ". Nothing is shared." }
    ],
    options: [
      {
        id: "a",
        label: "Full duplicate: new setlist, own copy of every mood.",
        correct: true
      },
      {
        id: "b",
        label: "Quick copy: new setlist, shared moods.",
        correct: false
      },
      {
        id: "c",
        label: "Second name: same setlist, two names.",
        correct: false
      }
    ]
  },
  {
    id: "q4",
    number: 4,
    topic: "SHALLOW COPY · WHAT LEAKS?",
    question: "Reyansh has a quick copy. Which of these will NOT change Ahaana's Master?",
    wrongFeedback: "Not quite. Round 2: what stayed safe and what leaked? 🔁",
    explanationParts: [
      { text: "A new mood goes only into Reyansh's setlist. But adding or swapping a song edits a shared mood, so Ahaana sees it too." }
    ],
    options: [
      {
        id: "a",
        label: "Adding a brand-new Retro mood.",
        correct: true
      },
      {
        id: "b",
        label: "Swapping a song in Intro.",
        correct: false
      },
      {
        id: "c",
        label: "Adding a third song to Chorus.",
        correct: false
      }
    ]
  },
  {
    id: "q5",
    number: 5,
    topic: "SAME SONGS VS SAME SETLIST",
    question: "Same songs in the same order? Yes. The very same setlist? No. How can both be true?",
    wrongFeedback: "Not quite. Think identical twins. 👯",
    explanationParts: [
      { code: "master_setlist == remix_setlist" },
      { text: " is True (same songs). " },
      { code: "master_setlist is remix_setlist" },
      { text: " is False (not the very same setlist)." }
    ],
    options: [
      {
        id: "a",
        label: "They're two separate setlists with identical songs, like twins.",
        correct: true
      },
      {
        id: "b",
        label: "Python made a mistake in one of the checks.",
        correct: false
      },
      {
        id: "c",
        label: "They're one setlist with two names.",
        correct: false
      }
    ]
  }
]);
