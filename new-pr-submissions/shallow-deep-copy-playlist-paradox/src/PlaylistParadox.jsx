/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MetaMix: The Playlist Paradox | Complete PyBe Interactive Python Lesson
 *
 * Palette:
 * - Teal: #087F8C
 * - Soft teal: #65B8B0
 * - Pale aqua: #E8F6F3
 * - Cream: #FFFDF7
 * - Dark teal: #243B3A
 */

import React, { useState, useEffect, useRef } from "react";
import "./playlist-paradox.css";
import partyHeroImage from "./assets/images/party_friends_hero.jpg";
import {
  INITIAL_MASTER_JAM,
  METHODS,
  ACTIONS,
  NINE_EXPERIMENTS,
  runSimulation,
  cloneSnapshot,
  getJournalKey
} from "./engine.js";
import {
  CHARACTERS,
  CHAPTERS,
  SCENE_2_DIALOGUE,
  INITIAL_THEORIES,
  PYTHON_TABS,
  SETLIST_SETUP_CODE,
  PYTHON_DETAILS,
  FINAL_QUIZ_QUESTIONS
} from "./lesson.js";
import PlaylistView from "./PlaylistView.jsx";
import ReferenceView from "./ReferenceView.jsx";
import {
  MetaMixLogo,
  CelebrationConfetti,
  MoodArtwork,
  Avatar,
  MethodVisualization,
  CelebrationSideGraphic
} from "./Artwork.jsx";

const STORAGE_KEY = "pybe:metamix:playlist-paradox:v7";
const VALID_CHAPTERS = ["join", "mystery", "lab", "reveal"];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isRepeatingCycle(positions) {
  if (positions.length < 4) return false;
  const checkPeriod = (period) =>
    positions.every((pos, idx) => pos === positions[idx % period]);
  return checkPeriod(2) || checkPeriod(3);
}

function buildRandomizedQuizQuestions(questions) {
  const chosenPositions = [];
  const mapped = questions.map((q) => {
    const count = q.options.length;
    const allIndices = Array.from({ length: count }, (_, idx) => idx);
    const prev1 = chosenPositions.length >= 1 ? chosenPositions[chosenPositions.length - 1] : null;
    const prev2 = chosenPositions.length >= 2 ? chosenPositions[chosenPositions.length - 2] : null;

    // Uniformly random with Math.random(), never allowing > 2 consecutive identical positions
    const allowedIndices =
      prev1 !== null && prev1 === prev2 && count > 1
        ? allIndices.filter((idx) => idx !== prev1)
        : allIndices;

    let targetPos = allowedIndices[Math.floor(Math.random() * allowedIndices.length)];

    // On the last question, also ensure positions do not form a repeating pattern like 0,1,2,0,1
    if (chosenPositions.length === questions.length - 1 && count > 1) {
      const candidateSeq = [...chosenPositions, targetPos];
      if (isRepeatingCycle(candidateSeq)) {
        const nonCycleIndices = allowedIndices.filter(
          (idx) => !isRepeatingCycle([...chosenPositions, idx])
        );
        if (nonCycleIndices.length > 0) {
          targetPos = nonCycleIndices[Math.floor(Math.random() * nonCycleIndices.length)];
        }
      }
    }

    chosenPositions.push(targetPos);

    const correctOpt = q.options.find((o) => o.correct) || q.options[0];
    const wrongOpts = shuffleArray(q.options.filter((o) => o !== correctOpt));
    const finalOptions = [];
    let wrongCursor = 0;
    for (let i = 0; i < count; i++) {
      if (i === targetPos) {
        finalOptions.push(correctOpt);
      } else {
        finalOptions.push(wrongOpts[wrongCursor++]);
      }
    }

    return { ...q, shuffledOptions: finalOptions };
  });

  return mapped;
}

const LAST_DECISION_POS_KEY = "pybe:metamix:lastDecisionPos";

const MASTER_CHANGED_REACTIONS = [
  "Reyansh. We need to talk. 😠",
  "Who gave him the aux?! 😱",
  "My setlist, my rules… and it changed. 😤"
];

const MASTER_SAFE_REACTIONS = [
  "Phew. My Master lives. 😌",
  "Okay, you may live. For now. 😏",
  "Safe! Reyansh is forgiven. 🙏"
];

const QUIZ_RIGHT_REACTIONS = [
  "Boom! 🎯",
  "Nailed it! 🙌",
  "Detective mode: on. 🔍"
];

function pickNonRepeating(pool, prevValue) {
  const candidates = pool.filter((item) => item !== prevValue);
  const source = candidates.length > 0 ? candidates : pool;
  return source[Math.floor(Math.random() * source.length)];
}

function readLastDecisionPos() {
  try {
    const stored = localStorage.getItem(LAST_DECISION_POS_KEY) ?? sessionStorage.getItem(LAST_DECISION_POS_KEY);
    if (stored !== null) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) return parsed;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

function writeLastDecisionPos(pos) {
  try {
    localStorage.setItem(LAST_DECISION_POS_KEY, String(pos));
  } catch {
    // Ignore localStorage errors
  }
  try {
    sessionStorage.setItem(LAST_DECISION_POS_KEY, String(pos));
  } catch {
    // Ignore sessionStorage errors
  }
}

function getShuffledDecisionMethods(prevPos = null) {
  const lastPos = prevPos !== null ? prevPos : readLastDecisionPos();
  const correctMethod = METHODS.find((m) => m.id === "solo_press") || METHODS[2];
  const otherTwo = shuffleArray(METHODS.filter((m) => m.id !== correctMethod.id));

  const allowedPositions =
    lastPos !== null && [0, 1, 2].includes(lastPos)
      ? [0, 1, 2].filter((p) => p !== lastPos)
      : [0, 1, 2];
  const targetPos = allowedPositions[Math.floor(Math.random() * allowedPositions.length)];

  const result = new Array(3);
  let otherCursor = 0;
  for (let i = 0; i < 3; i++) {
    if (i === targetPos) {
      result[i] = correctMethod;
    } else {
      result[i] = otherTwo[otherCursor++];
    }
  }

  writeLastDecisionPos(targetPos);
  return result;
}

export default function PlaylistParadox({ onExit: _onExit, onComplete }) {
  // Chapter navigation: 'join' | 'mystery' | 'lab' | 'reveal'
  const [currentChapter, setCurrentChapter] = useState("join");
  const [currentScene, setCurrentScene] = useState(1);

  // Automatic chat-style progressive dialogue in Chapter 1 Scene 2
  const [revealedDialogueCount, setRevealedDialogueCount] = useState(0);
  const [isTypingDialogue, setIsTypingDialogue] = useState(true);

  // Unlocked Chapters state (4 chapters)
  const [unlockedChapters, setUnlockedChapters] = useState({
    join: true,
    mystery: false,
    lab: false,
    reveal: false
  });

  // Chapter 2 inspection tab ('swap' | 'add'), viewed tracker & saved gut-feeling choice
  const [challengeInspectTab, setChallengeInspectTab] = useState("swap");
  const [viewedChanges, setViewedChanges] = useState({ swap: true, add: false });
  const [mysteryTheoryChoice, setMysteryTheoryChoice] = useState(null);
  const [recordedTheoryChoice, setRecordedTheoryChoice] = useState(null);
  const [mysteryVisitKey, setMysteryVisitKey] = useState(0);
  const enterLabRef = useRef(null);

  // Chapter 3 Sound Lab states
  const [currentExpIndex, setCurrentExpIndex] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [labResult, setLabResult] = useState(null);
  const [revealStage, setRevealStage] = useState(null); // null | 'remix' | 'master' | 'done'
  const [ahaanaReactionLine, setAhaanaReactionLine] = useState("");
  const lastChangedReactionRef = useRef(null);
  const lastSafeReactionRef = useRef(null);
  const revealTimersRef = useRef([]);
  const resultBannerRef = useRef(null);
  const [journal, setJournal] = useState({});

  // Chapter 3 final decision choice & shuffled option order
  const [saveMethodChoice, setSaveMethodChoice] = useState(null);
  const [decisionMethods, setDecisionMethods] = useState(() => METHODS);
  const prevFinalDecisionViewRef = useRef(false);
  const shuffledOnReplayRef = useRef(false);

  // Chapter 4 (The Reveal) states: Two-stage Evidence Journal + Sequential Tab Navigation
  const [revealFlipCount, setRevealFlipCount] = useState(0); // 0..3 rows flipped to Python names
  const [isFlippingNames, setIsFlippingNames] = useState(false);
  const [revealStage2, setRevealStage2] = useState(false);
  const [isJournalDrawerOpen, setIsJournalDrawerOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState("assignment");
  const [highestTabIndex, setHighestTabIndex] = useState(0); // 0..4
  const flipTimersRef = useRef([]);
  const tabContentTopRef = useRef(null);

  // Chapter 4 Tab 5 (Time to Test) Quiz states
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState({});
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState({});
  const [hasAttempted, setHasAttempted] = useState({});
  const [quizRightFeedback, setQuizRightFeedback] = useState({});
  const lastQuizRightRef = useRef(null);

  // Shuffled options for each quiz question (no two consecutive questions share the same correct answer position)
  const [shuffledQuizQuestions, setShuffledQuizQuestions] = useState(() =>
    buildRandomizedQuizQuestions(FINAL_QUIZ_QUESTIONS)
  );

  // Celebration Modal & Live Region
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const chapterHeadingRef = useRef(null);

  const clearRevealTimers = () => {
    revealTimersRef.current.forEach((id) => clearTimeout(id));
    revealTimersRef.current = [];
  };

  const clearFlipTimers = () => {
    flipTimersRef.current.forEach((id) => clearTimeout(id));
    flipTimersRef.current = [];
  };

  // Load persisted progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.currentChapter && VALID_CHAPTERS.includes(data.currentChapter)) {
          setCurrentChapter(data.currentChapter);
        }
        if (data.currentScene) {
          setCurrentScene(data.currentChapter === "mystery" ? 1 : data.currentScene);
        }
        if (data.unlockedChapters) {
          setUnlockedChapters({
            join: true,
            mystery: Boolean(data.unlockedChapters.mystery),
            lab: Boolean(data.unlockedChapters.lab),
            reveal: Boolean(data.unlockedChapters.reveal)
          });
        }
        if (data.currentExpIndex !== undefined) setCurrentExpIndex(data.currentExpIndex);
        if (data.journal) setJournal(data.journal);
        const savedTheory = data.recordedTheoryChoice ?? data.mysteryTheoryChoice ?? null;
        if (savedTheory) {
          setRecordedTheoryChoice(data.currentChapter === "mystery" && !data.unlockedChapters?.lab ? null : savedTheory);
        }
        // Gut-feeling options always start unselected when Chapter 2 loads
        setMysteryTheoryChoice(null);
        if (savedTheory && data.currentChapter !== "mystery") {
          setViewedChanges({ swap: true, add: true });
        }
        if (data.saveMethodChoice) setSaveMethodChoice(data.saveMethodChoice);
        if (data.activeTabId) setActiveTabId(data.activeTabId);
        if (data.highestTabIndex !== undefined) setHighestTabIndex(data.highestTabIndex);
        if (data.revealStage2 || (data.highestTabIndex !== undefined && data.highestTabIndex > 0) || (data.activeTabId && data.activeTabId !== "assignment")) {
          setRevealFlipCount(3);
          setRevealStage2(true);
        } else if (data.revealFlipCount >= 3) {
          setRevealFlipCount(3);
        }
        if (data.firstAttemptCorrect) setFirstAttemptCorrect(data.firstAttemptCorrect);
        if (data.quizAttempts) setQuizAttempts(data.quizAttempts);
      }
    } catch {
      // Fallback to initial
    }
  }, []);

  // Save progress helper
  const persistState = (
    chap,
    scene,
    unlocked,
    expIdx,
    jrn,
    theory,
    tabId,
    highTab,
    firstAtt,
    qAtt,
    saveChoice,
    revFlip,
    revStage2
  ) => {
    try {
      const savedTheoryVal = theory === null ? null : (theory || recordedTheoryChoice);
      const payload = {
        currentChapter: chap || currentChapter,
        currentScene: scene !== undefined ? scene : currentScene,
        unlockedChapters: unlocked || unlockedChapters,
        currentExpIndex: expIdx !== undefined ? expIdx : currentExpIndex,
        journal: jrn || journal,
        mysteryTheoryChoice: theory !== undefined ? theory : mysteryTheoryChoice,
        recordedTheoryChoice: savedTheoryVal,
        saveMethodChoice: saveChoice !== undefined ? saveChoice : saveMethodChoice,
        activeTabId: tabId || activeTabId,
        highestTabIndex: highTab !== undefined ? highTab : highestTabIndex,
        revealFlipCount: revFlip !== undefined ? revFlip : revealFlipCount,
        revealStage2: revStage2 !== undefined ? revStage2 : revealStage2,
        firstAttemptCorrect: firstAtt || firstAttemptCorrect,
        quizAttempts: qAtt || quizAttempts
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore
    }
  };

  // Scroll to top cleanly and focus heading without jumping mid-page on chapter/scene/decision change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (chapterHeadingRef.current) {
      chapterHeadingRef.current.focus({ preventScroll: true });
    }
  }, [currentChapter, currentScene]);

  // Chapter 1 Scene 2: Automatic chat-style typing reveal (instant when reduced motion is preferred)
  useEffect(() => {
    if (currentChapter !== "join" || currentScene !== 2) return;
    if (prefersReducedMotion()) {
      setRevealedDialogueCount(SCENE_2_DIALOGUE.length);
      setIsTypingDialogue(false);
      return;
    }
    if (revealedDialogueCount >= SCENE_2_DIALOGUE.length) {
      setIsTypingDialogue(false);
      return;
    }

    setIsTypingDialogue(true);
    const timer = setTimeout(() => {
      setRevealedDialogueCount((prev) => {
        if (prev >= SCENE_2_DIALOGUE.length) return prev;
        const next = prev + 1;
        const speakerName = CHARACTERS[SCENE_2_DIALOGUE[next - 1].speaker].name;
        setLiveAnnouncement(`Message ${next} of ${SCENE_2_DIALOGUE.length} from ${speakerName}.`);
        return next;
      });
    }, 1550);

    return () => clearTimeout(timer);
  }, [currentChapter, currentScene, revealedDialogueCount]);

  // Clean up reveal and flip animation timers on unmount
  useEffect(() => {
    return () => {
      clearRevealTimers();
      clearFlipTimers();
    };
  }, []);

  // Always reset Chapter 2 gut-feeling highlight state whenever Chapter 2 opens
  useEffect(() => {
    if (currentChapter === "mystery") {
      setMysteryTheoryChoice(null);
      setMysteryVisitKey((k) => k + 1);
    }
  }, [currentChapter]);

  // Smoothly scroll Sound Lab result banner into view once experiment reveal finishes
  useEffect(() => {
    if (currentChapter === "lab" && revealStage === "done" && resultBannerRef.current) {
      const timer = setTimeout(() => {
        resultBannerRef.current?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "nearest"
        });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [currentChapter, revealStage]);

  // Reshuffle Final Decision option cards each time the Final Decision view opens
  const isFinalDecisionView = currentChapter === "lab" && currentExpIndex >= 9;
  useEffect(() => {
    if (isFinalDecisionView && !prevFinalDecisionViewRef.current) {
      if (shuffledOnReplayRef.current) {
        shuffledOnReplayRef.current = false;
      } else {
        setDecisionMethods(getShuffledDecisionMethods());
      }
    }
    prevFinalDecisionViewRef.current = isFinalDecisionView;
  }, [isFinalDecisionView]);

  // Navigate to Chapter
  const goToChapter = (chapId, targetScene = null) => {
    if (!unlockedChapters[chapId]) return;
    clearRevealTimers();
    setCurrentChapter(chapId);
    const s = targetScene !== null ? targetScene : 1;
    setCurrentScene(s);
    if (chapId === "join" && s === 2) {
      setRevealedDialogueCount(0);
      setIsTypingDialogue(true);
    }
    if (chapId === "mystery") {
      setMysteryTheoryChoice(null);
      setMysteryVisitKey((k) => k + 1);
    }
    if (chapId === "reveal" && activeTabId === "quiz") {
      setShuffledQuizQuestions(buildRandomizedQuizQuestions(FINAL_QUIZ_QUESTIONS));
    }
    persistState(
      chapId,
      s,
      unlockedChapters,
      currentExpIndex,
      journal,
      chapId === "mystery" ? (!unlockedChapters.lab ? null : recordedTheoryChoice) : recordedTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts
    );
    window.scrollTo(0, 0);
  };

  // Chapter 1 navigation
  const handleStartStory = () => {
    setCurrentScene(2);
    setRevealedDialogueCount(0);
    setIsTypingDialogue(true);
    persistState(
      "join",
      2,
      unlockedChapters,
      currentExpIndex,
      journal,
      recordedTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts
    );
    setLiveAnnouncement("Entered Scene 2: Conversation between Ahaana and Reyansh.");
    window.scrollTo(0, 0);
  };

  const handleFinishScene2 = () => {
    const updatedUnlocked = { ...unlockedChapters, mystery: true };
    setUnlockedChapters(updatedUnlocked);
    setCurrentChapter("mystery");
    setCurrentScene(1);
    setMysteryTheoryChoice(null);
    if (!unlockedChapters.lab) {
      setRecordedTheoryChoice(null);
    }
    setMysteryVisitKey((k) => k + 1);
    persistState(
      "mystery",
      1,
      updatedUnlocked,
      currentExpIndex,
      journal,
      !unlockedChapters.lab ? null : recordedTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts
    );
    setLiveAnnouncement("Entered Chapter 2: The Paradox.");
    window.scrollTo(0, 0);
  };

  // Chapter 2 inspection & gut-feeling choice
  const handleInspectChange = (tabId) => {
    setChallengeInspectTab(tabId);
    setViewedChanges((prev) => ({ ...prev, [tabId]: true }));
  };

  const handleSelectTheory = (theoryId) => {
    setMysteryTheoryChoice(theoryId);
    setRecordedTheoryChoice(theoryId);
    persistState(
      "mystery",
      1,
      unlockedChapters,
      currentExpIndex,
      journal,
      theoryId,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts
    );
    setLiveAnnouncement("Choice selected. Ready to enter the Sound Lab.");
    setTimeout(() => {
      if (enterLabRef.current) {
        enterLabRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 60);
  };

  const handleEnterLab = () => {
    const updatedUnlocked = { ...unlockedChapters, lab: true };
    setUnlockedChapters(updatedUnlocked);
    setCurrentChapter("lab");
    setCurrentScene(1);
    setPrediction(null);
    persistState(
      "lab",
      1,
      updatedUnlocked,
      currentExpIndex,
      journal,
      recordedTheoryChoice || mysteryTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts
    );
    setLiveAnnouncement("Entered Chapter 3: Sound Lab.");
    window.scrollTo(0, 0);
  };

  // Chapter 3: Running the currently loaded experiment
  const activeExperiment = NINE_EXPERIMENTS[Math.min(currentExpIndex, 8)];

  const handleRunCurrentExperiment = () => {
    if (prediction === null || !activeExperiment) return;
    clearRevealTimers();

    const result = runSimulation({
      methodId: activeExperiment.methodId,
      actionId: activeExperiment.actionId
    });

    const isPredictedCorrect = prediction === result.isMasterChanged;
    const jKey = getJournalKey(activeExperiment.methodId, activeExperiment.actionId);
    const updatedJournal = {
      ...journal,
      [jKey]: {
        methodId: activeExperiment.methodId,
        actionId: activeExperiment.actionId,
        isMasterChanged: result.isMasterChanged,
        predictedCorrect: isPredictedCorrect
      }
    };

    const reaction = result.isMasterChanged
      ? pickNonRepeating(MASTER_CHANGED_REACTIONS, lastChangedReactionRef.current)
      : pickNonRepeating(MASTER_SAFE_REACTIONS, lastSafeReactionRef.current);
    if (result.isMasterChanged) {
      lastChangedReactionRef.current = reaction;
    } else {
      lastSafeReactionRef.current = reaction;
    }
    setAhaanaReactionLine(reaction);
    setLabResult(result);
    setJournal(updatedJournal);
    setRevealStage("remix");

    const t1 = setTimeout(() => {
      setRevealStage("master");
    }, 600);

    const t2 = setTimeout(() => {
      setRevealStage("done");
      setLiveAnnouncement(
        `Experiment ${activeExperiment.id} complete. Master Setlist ${result.isMasterChanged ? "CHANGED" : "UNCHANGED"}. ${result.explanation}`
      );
    }, 1150);

    revealTimersRef.current = [t1, t2];

    persistState(
      "lab",
      1,
      unlockedChapters,
      currentExpIndex,
      updatedJournal,
      mysteryTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts
    );
  };

  const handleNextExperiment = () => {
    clearRevealTimers();
    const nextIdx = currentExpIndex + 1;
    setCurrentExpIndex(nextIdx);
    setPrediction(null);
    setLabResult(null);
    setRevealStage(null);
    persistState(
      "lab",
      1,
      unlockedChapters,
      nextIdx,
      journal,
      mysteryTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts
    );
    setLiveAnnouncement(`Navigated to Experiment ${nextIdx + 1} of 9.`);
    window.scrollTo(0, 0);
  };

  const handleFinishAllExperiments = () => {
    clearRevealTimers();
    setRevealStage(null);
    setCurrentExpIndex(9);
    persistState(
      "lab",
      1,
      unlockedChapters,
      9,
      journal,
      mysteryTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts
    );
    setLiveAnnouncement("All 9 experiments done! Answer Ahaana's final question.");
    window.scrollTo(0, 0);
  };

  // Chapter 3 final question card selection
  const handleSelectDecisionMethod = (methodId) => {
    setSaveMethodChoice(methodId);
    const updatedUnlocked =
      methodId === "solo_press" ? { ...unlockedChapters, reveal: true } : unlockedChapters;
    if (methodId === "solo_press") {
      setUnlockedChapters(updatedUnlocked);
      setLiveAnnouncement("Correct! A full duplicate keeps the Master Setlist safe.");
    } else {
      setLiveAnnouncement("Not quite. Try another choice so the Master stays safe.");
    }
    persistState(
      "lab",
      1,
      updatedUnlocked,
      9,
      journal,
      mysteryTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts,
      methodId
    );
  };

  const handleGoToPythonReveal = () => {
    clearFlipTimers();
    const updatedUnlocked = { ...unlockedChapters, reveal: true };
    setUnlockedChapters(updatedUnlocked);
    setCurrentChapter("reveal");
    setCurrentScene(1);
    setRevealFlipCount(0);
    setIsFlippingNames(false);
    setRevealStage2(false);
    setIsJournalDrawerOpen(false);
    persistState(
      "reveal",
      1,
      updatedUnlocked,
      currentExpIndex,
      journal,
      mysteryTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts,
      saveMethodChoice,
      0,
      false
    );
    setLiveAnnouncement("Entered Chapter 4: The Reveal.");
    window.scrollTo(0, 0);
  };

  // Chapter 4 Stage 1: Flip Evidence Journal rows one by one (~0.8s apart, or instant if reduced motion)
  const handleRevealPythonNames = () => {
    clearFlipTimers();
    if (prefersReducedMotion()) {
      setRevealFlipCount(3);
      setIsFlippingNames(false);
      setLiveAnnouncement("All three Python names revealed: Assignment, Shallow copy, and Deep copy.");
      persistState(
        currentChapter,
        currentScene,
        unlockedChapters,
        currentExpIndex,
        journal,
        recordedTheoryChoice,
        activeTabId,
        highestTabIndex,
        firstAttemptCorrect,
        quizAttempts,
        saveMethodChoice,
        3,
        false
      );
      return;
    }
    setIsFlippingNames(true);
    setRevealFlipCount(0);

    const t1 = setTimeout(() => {
      setRevealFlipCount(1);
    }, 120);

    const t2 = setTimeout(() => {
      setRevealFlipCount(2);
    }, 920);

    const t3 = setTimeout(() => {
      setRevealFlipCount(3);
      setIsFlippingNames(false);
      setLiveAnnouncement("All three Python names revealed: Assignment, Shallow copy, and Deep copy.");
      persistState(
        currentChapter,
        currentScene,
        unlockedChapters,
        currentExpIndex,
        journal,
        recordedTheoryChoice,
        activeTabId,
        highestTabIndex,
        firstAttemptCorrect,
        quizAttempts,
        saveMethodChoice,
        3,
        false
      );
    }, 1720);

    flipTimersRef.current = [t1, t2, t3];
  };

  // Chapter 4 Stage 2: Collapse journal into top bar and reveal the 5 tabs
  const handleExploreEachName = () => {
    setRevealStage2(true);
    setIsJournalDrawerOpen(false);
    if (activeTabId === "quiz") {
      setShuffledQuizQuestions(buildRandomizedQuizQuestions(FINAL_QUIZ_QUESTIONS));
    }
    persistState(
      currentChapter,
      currentScene,
      unlockedChapters,
      currentExpIndex,
      journal,
      recordedTheoryChoice,
      activeTabId,
      highestTabIndex,
      firstAttemptCorrect,
      quizAttempts,
      saveMethodChoice,
      3,
      true
    );
    setLiveAnnouncement("Now explore each Python name using the tabs.");
    setTimeout(() => {
      if (tabContentTopRef.current) {
        tabContentTopRef.current.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start"
        });
      }
    }, 40);
  };

  // Chapter 4: Strictly sequential tab switching (scroll to top of tab content on switch)
  const activeTabIndex = PYTHON_TABS.findIndex((t) => t.id === activeTabId);

  const handleSelectPythonTab = (targetTabId, targetIdx) => {
    // Strictly sequential: from current tab, can only jump forward to activeTabIndex + 1
    if (targetIdx > activeTabIndex + 1) return;

    if (targetTabId === "quiz") {
      setShuffledQuizQuestions(buildRandomizedQuizQuestions(FINAL_QUIZ_QUESTIONS));
    }

    const nextHighest = Math.max(highestTabIndex, targetIdx);
    setActiveTabId(targetTabId);
    setHighestTabIndex(nextHighest);
    persistState(
      currentChapter,
      currentScene,
      unlockedChapters,
      currentExpIndex,
      journal,
      recordedTheoryChoice,
      targetTabId,
      nextHighest,
      firstAttemptCorrect,
      quizAttempts
    );
    setLiveAnnouncement(`Opened Tab ${targetIdx + 1}: ${PYTHON_TABS[targetIdx].label}.`);
    setTimeout(() => {
      if (tabContentTopRef.current) {
        tabContentTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 30);
  };

  // Chapter 5 Tab 5 Quiz Answer Handler with strict First-Attempt Scoring
  const handleAnswerQuizQuestion = (qId, option) => {
    const isCurrentCorrect = option.correct;
    const isFirstTime = !hasAttempted[qId];

    const updatedAttempts = { ...quizAttempts, [qId]: option.id };
    const updatedHasAttempted = { ...hasAttempted, [qId]: true };
    const updatedFirstAttempt = { ...firstAttemptCorrect };

    if (isFirstTime) {
      updatedFirstAttempt[qId] = isCurrentCorrect;
      setFirstAttemptCorrect(updatedFirstAttempt);
    }

    setQuizAttempts(updatedAttempts);
    setHasAttempted(updatedHasAttempted);

    if (isCurrentCorrect) {
      const picked = pickNonRepeating(QUIZ_RIGHT_REACTIONS, lastQuizRightRef.current);
      lastQuizRightRef.current = picked;
      setQuizRightFeedback((prev) => ({ ...prev, [qId]: picked }));
    }

    persistState(
      currentChapter,
      currentScene,
      unlockedChapters,
      currentExpIndex,
      journal,
      mysteryTheoryChoice,
      activeTabId,
      highestTabIndex,
      updatedFirstAttempt,
      updatedAttempts
    );
  };

  const calculateFirstAttemptScore = () => {
    return Object.values(firstAttemptCorrect).filter(Boolean).length;
  };

  const allQuizAnsweredCorrectly = FINAL_QUIZ_QUESTIONS.every((q) => {
    const chosenId = quizAttempts[q.id];
    const correctOpt = q.options.find((o) => o.correct);
    return chosenId && correctOpt && chosenId === correctOpt.id;
  });

  const handleConfirmRestart = () => {
    clearRevealTimers();
    clearFlipTimers();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setCurrentChapter("join");
    setCurrentScene(1);
    setRevealedDialogueCount(0);
    setIsTypingDialogue(true);
    setUnlockedChapters({
      join: true,
      mystery: false,
      lab: false,
      reveal: false
    });
    setChallengeInspectTab("swap");
    setViewedChanges({ swap: true, add: false });
    setMysteryTheoryChoice(null);
    setRecordedTheoryChoice(null);
    setCurrentExpIndex(0);
    setPrediction(null);
    setLabResult(null);
    setRevealStage(null);
    setJournal({});
    setSaveMethodChoice(null);
    setRevealFlipCount(0);
    setIsFlippingNames(false);
    setRevealStage2(false);
    setIsJournalDrawerOpen(false);
    setActiveTabId("assignment");
    setHighestTabIndex(0);
    setCurrentQuizIndex(0);
    setQuizAttempts({});
    setFirstAttemptCorrect({});
    setHasAttempted({});
    setQuizRightFeedback({});
    setShuffledQuizQuestions(buildRandomizedQuizQuestions(FINAL_QUIZ_QUESTIONS));
    setShowCelebrationModal(false);
    setLiveAnnouncement("Lesson reset to Chapter 1.");
  };

  const handleOpenCelebration = () => {
    setShowCelebrationModal(true);
    if (typeof onComplete === "function") {
      onComplete({
        lesson: "MetaMix: The Playlist Paradox",
        completedAt: new Date().toISOString(),
        firstAttemptScore: `${calculateFirstAttemptScore()} of ${FINAL_QUIZ_QUESTIONS.length}`,
        experimentsCompleted: 9,
        selectedMethod: "Solo Press (copy.deepcopy)"
      });
    }
  };

  // Chapter 2 Scene 1 Playlists Snapshots
  const mysterySwapMaster = cloneSnapshot(INITIAL_MASTER_JAM);
  mysterySwapMaster[0][1] = "Tum Se Hi"; // Kesariya replaced in Intro!
  const mysterySwapAfterparty = cloneSnapshot(INITIAL_MASTER_JAM);
  mysterySwapAfterparty[0][1] = "Tum Se Hi";

  const mysteryAddMaster = cloneSnapshot(INITIAL_MASTER_JAM); // 3 moods intact
  const mysteryAddAfterparty = cloneSnapshot(INITIAL_MASTER_JAM);
  mysteryAddAfterparty.push(["Retro", "Pal Pal Dil Ke Paas"]); // 4 moods

  const currentTabDetails = PYTHON_DETAILS[activeTabId] || PYTHON_DETAILS.assignment;
  const currentQuizQ = shuffledQuizQuestions[currentQuizIndex] || shuffledQuizQuestions[0];
  const finalScore = calculateFirstAttemptScore();

  return (
    <div className="playlist-paradox">
      {/* Screen Reader Live Region */}
      <div className="pp-sr-only" aria-live="polite" role="status">
        {liveAnnouncement}
      </div>

      {/* Persistent Top Navigation Bar */}
      <header className="pp-app-header">
        <div className="pp-brand-zone">
          <MetaMixLogo size={34} />
          <span className="pp-brand-title">MetaMix</span>
          <span className="pp-session-pill">Farewell Jam</span>
        </div>

        <nav className="pp-nav-zone" aria-label="Chapter Progress">
          <ol className="pp-chapters-nav">
            {CHAPTERS.map((chap) => {
              const isActive = currentChapter === chap.id;
              const isUnlocked = unlockedChapters[chap.id];
              const isPast =
                (chap.number < 2 && unlockedChapters.mystery) ||
                (chap.number < 3 && unlockedChapters.lab) ||
                (chap.number < 4 && unlockedChapters.reveal);

              return (
                <li key={chap.id}>
                  <button
                    type="button"
                    onClick={() => goToChapter(chap.id)}
                    disabled={!isUnlocked}
                    className={`pp-chapter-nav-btn ${isActive ? "pp-active" : ""} ${isPast ? "pp-completed" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    title={chap.title}
                  >
                    <span className="pp-chapter-num-badge">
                      {isPast && !isActive ? "✔" : chap.number}
                    </span>
                    <span className="pp-nav-label-full">{chap.shortTitle}</span>
                    <span className="pp-nav-label-short">Ch {chap.number}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="pp-main-content">
        {/* ============================================================== */}
        {/* CHAPTER 1 — SETTING THE SCENE                                  */}
        {/* ============================================================== */}
        {currentChapter === "join" && (
          <section aria-labelledby="pp-heading-ch1">
            {/* Scene 1: Balanced Two-Column Desktop Layout, Top-to-Bottom Justified */}
            {currentScene === 1 && (
              <div className="pp-hero-two-col-layout">
                <div className="pp-hero-photo-col">
                  <img
                    src={partyHeroImage}
                    alt="Four stylish friends gathering around a DJ setup at a vibrant farewell party, sharing music and laughing"
                    className="pp-hero-real-photo"
                  />
                </div>

                <div className="pp-hero-content-col">
                  <div className="pp-hero-top-group">
                    <span className="pp-chapter-kicker-title">Chapter 1 · Scene 1 of 2</span>
                    <h1 id="pp-heading-ch1" ref={chapterHeadingRef} tabIndex={-1} className="pp-hero-title">
                      The Playlist Paradox: Who Hijacked the Jam?
                    </h1>
                    <p className="pp-hero-subtitle">
                      Farewell night. Ahaana&apos;s Master Setlist is perfect. Reyansh&apos;s hands are already hovering over the DJ deck. 😬
                    </p>
                    <p className="pp-hero-setlist-line">
                      A setlist is a big list. It has moods. Each mood has songs.
                    </p>
                  </div>

                  <div className="pp-mood-showcase-row">
                    <div className="pp-mood-showcase-card">
                      <MoodArtwork moodName="Intro" width={44} height={44} />
                      <div>
                        <h2 className="pp-mood-showcase-title">Intro</h2>
                        <p className="pp-mood-showcase-tracks">Kesariya · Shayad</p>
                      </div>
                    </div>
                    <div className="pp-mood-showcase-card">
                      <MoodArtwork moodName="Chorus" width={44} height={44} />
                      <div>
                        <h2 className="pp-mood-showcase-title">Chorus</h2>
                        <p className="pp-mood-showcase-tracks">Ilahi · Gallan Goodiyaan</p>
                      </div>
                    </div>
                    <div className="pp-mood-showcase-card">
                      <MoodArtwork moodName="Outro" width={44} height={44} />
                      <div>
                        <h2 className="pp-mood-showcase-title">Outro</h2>
                        <p className="pp-mood-showcase-tracks">Apna Bana Le · Raabta</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleStartStory}
                      className="pp-primary-cta-btn"
                    >
                      Join the Jam →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 2: Chat-Style Conversation with Typing Indicator & Skip */}
            {currentScene === 2 && (
              <div className="pp-dialogue-scene-card pp-ch1-scene2-card">
                <div className="pp-scene-stepper-bar">
                  <span className="pp-chapter-kicker-title">Chapter 1 · Scene 2 of 2</span>
                  <div className="pp-scene-indicator-dots">
                    {revealedDialogueCount < SCENE_2_DIALOGUE.length && (
                      <button
                        type="button"
                        onClick={() => {
                          setRevealedDialogueCount(SCENE_2_DIALOGUE.length);
                          setIsTypingDialogue(false);
                        }}
                        className="pp-skip-chat-link"
                      >
                        Skip ▸▸
                      </button>
                    )}
                    <span className="pp-scene-pill-step">Scene 1: Jam</span>
                    <span className="pp-scene-pill-step pp-current-scene">Scene 2: Conversation</span>
                  </div>
                </div>

                <h1 id="pp-heading-ch1" ref={chapterHeadingRef} tabIndex={-1} className="pp-collection-title" style={{ fontSize: "1.85rem", marginBottom: "0.4rem" }}>
                  Who Gave Reyansh the Aux?
                </h1>
                <p style={{ color: "var(--pp-text-secondary)", margin: "0 0 1rem" }}>
                  Every farewell party has one person who grabs the aux cord.
                </p>

                <div className="pp-dialogue-thread" role="log" aria-label="Conversation between Ahaana and Reyansh">
                  {SCENE_2_DIALOGUE.slice(0, revealedDialogueCount).map((dialogue, idx) => {
                    const char = CHARACTERS[dialogue.speaker];
                    return (
                      <div key={idx} className="pp-dialogue-bubble-row">
                        <div className="pp-dialogue-avatar-slot">
                          <Avatar characterId={char.id} size={48} />
                        </div>
                        <div className="pp-dialogue-bubble">
                          <div className="pp-dialogue-speaker-name">
                            <span>{char.chatName}</span>
                          </div>
                          <p className="pp-dialogue-text">{dialogue.text}</p>
                        </div>
                      </div>
                    );
                  })}

                  {isTypingDialogue && revealedDialogueCount < SCENE_2_DIALOGUE.length && (() => {
                    const nextSpeaker = CHARACTERS[SCENE_2_DIALOGUE[revealedDialogueCount].speaker];
                    return (
                      <div className="pp-dialogue-bubble-row pp-typing-row" aria-label={`${nextSpeaker.name} is typing`}>
                        <div className="pp-dialogue-avatar-slot">
                          <Avatar characterId={nextSpeaker.id} size={48} />
                        </div>
                        <div className="pp-typing-bubble">
                          <span className="pp-typing-speaker-mini">{nextSpeaker.name}</span>
                          <span className="pp-typing-dots" aria-hidden="true">
                            <span className="pp-typing-dot" />
                            <span className="pp-typing-dot" />
                            <span className="pp-typing-dot" />
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {revealedDialogueCount >= SCENE_2_DIALOGUE.length && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setCurrentScene(1)}
                      className="pp-secondary-cta-btn"
                    >
                      ← Back to Jam Hero
                    </button>

                    <button
                      type="button"
                      onClick={handleFinishScene2}
                      className="pp-primary-cta-btn"
                    >
                      Investigate the Paradox →
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* CHAPTER 2 — THE PARADOX (3-COL + STANDALONE GUT-FEELING CARD)  */}
        {/* ============================================================== */}
        {currentChapter === "mystery" && (
          <section aria-labelledby="pp-heading-ch2">
            <div className="pp-mystery-inspect-card">
              <div className="pp-scene-stepper-bar">
                <span className="pp-chapter-kicker-title">Chapter 2 · The Paradox</span>
              </div>

              <div className="pp-ch2-glance-grid">
                {/* Left Sidebar: Title, Change A & B, Clue, Back */}
                <div className="pp-ch2-controls-sidebar">
                  <div>
                    <h1 id="pp-heading-ch2" ref={chapterHeadingRef} tabIndex={-1} className="pp-ch2-title">
                      The Plot Twist
                    </h1>
                    <p className="pp-ch2-subtitle">
                      Reyansh made 2 changes. Only 1 reached the Master. Weird, right?
                    </p>
                  </div>

                  <div className="pp-challenge-buttons-col">
                    <button
                      type="button"
                      onClick={() => handleInspectChange("swap")}
                      className={`pp-challenge-tab-btn ${challengeInspectTab === "swap" ? "pp-active" : ""}`}
                    >
                      <div className="pp-challenge-badge-row">
                        <span className="pp-challenge-tag">Change A</span>
                        {viewedChanges.swap && (
                          <span className="pp-viewed-check" aria-label="Viewed">✓</span>
                        )}
                      </div>
                      <div>Swapped a song: Kesariya → Tum Se Hi</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInspectChange("add")}
                      className={`pp-challenge-tab-btn ${challengeInspectTab === "add" ? "pp-active" : ""}`}
                    >
                      <div className="pp-challenge-badge-row">
                        <span className="pp-challenge-tag">Change B</span>
                        {viewedChanges.add && (
                          <span className="pp-viewed-check" aria-label="Viewed">✓</span>
                        )}
                      </div>
                      <div>Added a mood: Retro</div>
                    </button>
                  </div>

                  {challengeInspectTab === "swap" ? (
                    <div className="pp-clue-item">
                      <span>Tum Se Hi sneaked into the Master too. 🕵️</span>
                    </div>
                  ) : (
                    <div className="pp-clue-item">
                      <span>Retro stayed in Remix only. Master untouched.</span>
                    </div>
                  )}

                  <div className="pp-ch2-nav-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentChapter("join");
                        setCurrentScene(2);
                        setRevealedDialogueCount(SCENE_2_DIALOGUE.length);
                        setIsTypingDialogue(false);
                      }}
                      className="pp-secondary-cta-btn"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      ← Back to Conversation
                    </button>
                  </div>
                </div>

                {/* Right Columns: Master Setlist & Remix Setlist */}
                <div className="pp-ch2-playlists-col">
                  {challengeInspectTab === "swap" ? (
                    <PlaylistView
                      masterData={mysterySwapMaster}
                      afterpartyData={mysterySwapAfterparty}
                      highlightChange={{
                        type: "replace_song",
                        targetMood: "Intro",
                        newSong: "Tum Se Hi"
                      }}
                      masterTitle="Master Setlist"
                      afterpartyTitle="Remix Setlist"
                      masterSub="Changed: Kesariya → Tum Se Hi in Intro"
                      afterpartySub="Reyansh swapped a song in Intro"
                      compact={true}
                    />
                  ) : (
                    <PlaylistView
                      masterData={mysteryAddMaster}
                      afterpartyData={mysteryAddAfterparty}
                      highlightChange={{
                        type: "add_mood",
                        moodName: "Retro"
                      }}
                      masterTitle="Master Setlist"
                      afterpartyTitle="Remix Setlist"
                      masterSub="Untouched: all 3 moods stayed safe"
                      afterpartySub="Added a 4th mood: Retro"
                      masterEmptySlotText="Retro isn't here 🚫"
                      compact={true}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Standalone Full-Width Gut-Feeling Card (Unlocked once both Change A and Change B viewed) */}
            <div className={`pp-gut-feeling-card ${!(viewedChanges.swap && viewedChanges.add) ? "pp-gut-locked" : ""}`}>
              <h2 className="pp-gut-question-heading">
                Your theory, detective?
              </h2>

              {!(viewedChanges.swap && viewedChanges.add) ? (
                <div className="pp-gut-locked-notice" role="status">
                  Look at both changes (A and B) to unlock the question.
                </div>
              ) : (
                <>
                  <div className="pp-gut-options-row" role="radiogroup" aria-label="Gut feeling choices">
                    {INITIAL_THEORIES.map((theory) => {
                      const isSelected = mysteryTheoryChoice === theory.id;
                      return (
                        <button
                          key={`${theory.id}-${mysteryVisitKey}`}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleSelectTheory(theory.id)}
                          className={`pp-gut-option-btn ${isSelected ? "pp-selected" : ""}`}
                        >
                          <span className="pp-gut-option-letter">{theory.label})</span>
                          <span className="pp-gut-option-text">{theory.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {mysteryTheoryChoice && (
                    <div className="pp-gut-noted-row" ref={enterLabRef}>
                      <button
                        type="button"
                        onClick={handleEnterLab}
                        className="pp-primary-cta-btn"
                      >
                        Enter the Sound Lab →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* CHAPTER 3 — SOUND LAB (3 ROUNDS OF 3 CHANGES + FINAL QUESTION) */}
        {/* ============================================================== */}
        {currentChapter === "lab" && (
          <section aria-labelledby="pp-heading-ch3">
            <header className="pp-ch3-compact-header">
              <div>
                <span className="pp-chapter-kicker-title">Chapter 3 · Sound Lab</span>
                <h1 id="pp-heading-ch3" ref={chapterHeadingRef} tabIndex={-1} className="pp-ch3-title">
                  {currentExpIndex < 9
                    ? "Sound Lab: Catch Reyansh in the Act"
                    : "One Last Choice for Ahaana"}
                </h1>
                {currentExpIndex < 9 && (
                  <p className="pp-ch3-subtitle">
                    Predict first. Then watch what happens to Ahaana&apos;s Master.
                  </p>
                )}
              </div>
              <div className="pp-journal-progress">
                {currentExpIndex < 9
                  ? `Experiment ${activeExperiment.id} of 9`
                  : "9 of 9 experiments done"}
              </div>
            </header>

            {currentExpIndex < 9 ? (
              <div className="pp-chapter3-workspace">
                {/* LHS: ONE Compact Top-Aligned Card showing current round + experiment */}
                <div className="pp-ch3-lhs">
                  <div className="pp-prediction-controller-card">
                    <div className="pp-exp-badges-row">
                      <span className="pp-current-exp-badge">{activeExperiment.roundLabel}</span>
                    </div>

                    <h2 className="pp-exp-title">{activeExperiment.roundHeadline}</h2>
                    <p className="pp-exp-summary">{activeExperiment.roundDescription}</p>

                    <div className="pp-change-callout-box">
                      <span className="pp-change-callout-label">What Reyansh does</span>
                      <p className="pp-change-callout-text">{activeExperiment.storyActionSentence}</p>
                    </div>

                    <div className="pp-prediction-block">
                      <div className="pp-prediction-question">
                        Will Ahaana&apos;s Master change?
                      </div>

                      <div className="pp-prediction-buttons-grid" role="radiogroup" aria-label="Prediction options">
                        <button
                          key={`pred-yes-${activeExperiment.id}`}
                          type="button"
                          role="radio"
                          aria-checked={prediction === true}
                          disabled={labResult !== null}
                          onClick={() => setPrediction(true)}
                          className={`pp-pred-choice-btn ${prediction === true ? "pp-selected" : ""}`}
                        >
                          Yes, it will change
                        </button>
                        <button
                          key={`pred-no-${activeExperiment.id}`}
                          type="button"
                          role="radio"
                          aria-checked={prediction === false}
                          disabled={labResult !== null}
                          onClick={() => setPrediction(false)}
                          className={`pp-pred-choice-btn ${prediction === false ? "pp-selected" : ""}`}
                        >
                          No, it stays safe
                        </button>
                      </div>

                      {!labResult ? (
                        <button
                          type="button"
                          onClick={handleRunCurrentExperiment}
                          disabled={prediction === null}
                          className="pp-primary-cta-btn"
                          style={{ width: "100%", justifyContent: "center" }}
                        >
                          Run Experiment →
                        </button>
                      ) : revealStage !== "done" ? (
                        <button
                          type="button"
                          disabled
                          className="pp-primary-cta-btn"
                          style={{ width: "100%", justifyContent: "center" }}
                        >
                          Running experiment…
                        </button>
                      ) : currentExpIndex < 8 ? (
                        <button
                          type="button"
                          onClick={handleNextExperiment}
                          className="pp-primary-cta-btn"
                          style={{ width: "100%", justifyContent: "center" }}
                        >
                          Next Experiment ({currentExpIndex + 2} of 9) →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinishAllExperiments}
                          className="pp-primary-cta-btn"
                          style={{ width: "100%", justifyContent: "center" }}
                        >
                          Finish &amp; Choose Best Way →
                        </button>
                      )}
                    </div>

                    {/* 3 Rounds x 3 Experiments Progress Dots + Guesses Tally */}
                    <div className="pp-round-dots-footer">
                      <div className="pp-round-dots-bar" aria-label="Experiment Progress across 3 Rounds">
                        {[1, 2, 3].map((roundNum) => (
                          <div key={roundNum} className="pp-round-dot-group">
                            <span className={`pp-round-mini-label ${activeExperiment.roundNumber === roundNum ? "pp-round-active" : ""}`}>
                              R{roundNum}
                            </span>
                            <div className="pp-round-dots-pair">
                              {NINE_EXPERIMENTS.filter((e) => e.roundNumber === roundNum).map((exp) => {
                                const idx = exp.id - 1;
                                const isCurrent = idx === currentExpIndex;
                                const isCompleted = idx < currentExpIndex || (idx === currentExpIndex && labResult !== null);
                                return (
                                  <div
                                    key={exp.id}
                                    className={`pp-progress-dot ${
                                      isCurrent ? "pp-dot-current" : isCompleted ? "pp-dot-completed" : ""
                                    }`}
                                    title={`${exp.roundLabel} · ${exp.actionName}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {(() => {
                        const totalGuesses = Object.keys(journal).length;
                        const rightGuesses = Object.values(journal).filter((e) => e.predictedCorrect).length;
                        return (
                          <div className="pp-guesses-tally">
                            Your guesses: <strong>{rightGuesses} of {totalGuesses} right</strong>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* RHS: Round 1 Single Card OR Round 2/3 Dual Cards + Result Message Underneath */}
                <div className="pp-ch3-rhs">
                  {(() => {
                    const isRound1 = activeExperiment.roundNumber === 1;
                    const showRemixUpdate = Boolean(labResult);
                    const showMasterUpdate = revealStage === "master" || revealStage === "done";

                    const currentMaster = showMasterUpdate
                      ? labResult.masterAfter
                      : cloneSnapshot(INITIAL_MASTER_JAM);
                    const currentRemix = showRemixUpdate
                      ? labResult.afterpartyAfter
                      : cloneSnapshot(INITIAL_MASTER_JAM);

                    const masterNames = new Set(currentMaster.map((m) => m[0]));
                    const remixNames = new Set(currentRemix.map((m) => m[0]));

                    // Round 2: "🔗 same playlist in both" badge ONLY on shared moods.
                    // Round 3: "✦ own copy" badge on EVERY mood in the Remix card.
                    const sharedMoodsForExp =
                      activeExperiment.roundNumber === 2
                        ? [...masterNames].filter((name) => remixNames.has(name))
                        : [];
                    const remixBadge = activeExperiment.roundNumber === 3 ? "✦ own copy" : null;

                    const masterAnim =
                      showMasterUpdate && labResult
                        ? labResult.isMasterChanged
                          ? "shake"
                          : "safe"
                        : null;
                    const remixAnim = revealStage === "remix" ? "pulse" : null;

                    return (
                      <PlaylistView
                        masterData={currentMaster}
                        afterpartyData={currentRemix}
                        singleSharedCard={isRound1}
                        sharedMoods={sharedMoodsForExp}
                        sharedBadgeText="🔗 same playlist in both"
                        remixMoodBadgeText={remixBadge}
                        masterAnimState={masterAnim}
                        remixAnimState={remixAnim}
                        highlightChange={
                          labResult
                            ? {
                                type: activeExperiment.actionId,
                                targetMood: "Intro",
                                newSong: "Tum Se Hi",
                                moodName: "Retro"
                              }
                            : null
                        }
                        masterTitle="Master Setlist"
                        afterpartyTitle="Remix Setlist"
                        masterSub={null}
                        afterpartySub={
                          labResult
                            ? `After: ${activeExperiment.actionName}`
                            : "Ready for Reyansh's change"
                        }
                        compact={true}
                      />
                    );
                  })()}

                  {labResult && revealStage === "done" ? (
                    <div
                      ref={resultBannerRef}
                      className={`pp-experiment-result-card ${
                        labResult.isMasterChanged ? "pp-result-changed" : "pp-result-unchanged"
                      }`}
                      role="region"
                      aria-label="Experiment Result"
                    >
                      <div className="pp-result-header-row">
                        <div className="pp-ahaana-reaction-inline">
                          <Avatar characterId="ahaana" size={34} />
                          <span className="pp-ahaana-reaction-text">
                            {ahaanaReactionLine ||
                              (labResult.isMasterChanged
                                ? MASTER_CHANGED_REACTIONS[0]
                                : MASTER_SAFE_REACTIONS[0])}
                          </span>
                        </div>
                        <div className="pp-result-chips-group">
                          <span
                            className={
                              labResult.isMasterChanged ? "pp-changed-pill" : "pp-safe-tick-pill"
                            }
                          >
                            {labResult.isMasterChanged ? "● Master changed" : "✓ Master safe"}
                          </span>
                          <span
                            className={`pp-pred-eval-badge ${
                              prediction === labResult.isMasterChanged
                                ? "pp-eval-correct"
                                : "pp-eval-surprise"
                            }`}
                          >
                            {prediction === labResult.isMasterChanged
                              ? "Called it! 🎯"
                              : "Plot twist! 😮"}
                          </span>
                        </div>
                      </div>

                      <div className="pp-result-why-line">
                        <span className="pp-result-why-bulb" aria-hidden="true">💡</span>
                        <span>{labResult.explanation}</span>
                      </div>
                    </div>
                  ) : labResult ? (
                    <div className="pp-experiment-pending-card">
                      <span>✨</span>
                      <span>
                        {revealStage === "remix"
                          ? "Applying Reyansh's change to the Remix Setlist…"
                          : "Checking Ahaana's Master Setlist…"}
                      </span>
                    </div>
                  ) : (
                    <div className="pp-experiment-pending-card">
                      <span>ℹ</span>
                      <span>
                        Pick Yes or No on the left, then click <strong>Run Experiment</strong> to see what happens.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* After Experiment 9: One-Question Decision for Ahaana */
              <div className="pp-dialogue-scene-card pp-final-decision-card">
                <span className="pp-clue-tag pp-clue-tag-blue">All 9 Experiments Done</span>
                <h2 className="pp-collection-title pp-final-decision-heading">
                  How should Reyansh get his Remix so the Master survives anything?
                </h2>

                <div className="pp-save-methods-grid" role="radiogroup" aria-label="Ways to make Remix Setlist">
                  {decisionMethods.map((method) => {
                    const isSelected = saveMethodChoice === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleSelectDecisionMethod(method.id)}
                        className={`pp-save-method-card ${isSelected ? "pp-selected" : ""}`}
                      >
                        <MethodVisualization methodId={method.id} size={56} />
                        <h3 className="pp-method-card-title">{method.storyName}</h3>
                        <p className="pp-method-card-desc">{method.storyTagline}</p>
                        <div className="pp-method-card-status">
                          {isSelected ? "Selected ✔" : "Click to choose"}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {saveMethodChoice && (
                  <div style={{ marginTop: "1.25rem" }}>
                    {saveMethodChoice === "solo_press" ? (
                      <div className="pp-feedback-green" role="status">
                        <span className="pp-feedback-icon" aria-hidden="true">✓</span>
                        <span>
                          Spot on! Everything is separate. Reyansh can go wild, the Master stays safe. 🎉
                        </span>
                      </div>
                    ) : saveMethodChoice === "remix_link" ? (
                      <div className="pp-feedback-amber" role="status">
                        <span className="pp-feedback-icon" aria-hidden="true">✗</span>
                        <span>
                          Close! Adding or removing moods is safe, but swapping a song still leaks into Ahaana&apos;s Intro. Try again.
                        </span>
                      </div>
                    ) : (
                      <div className="pp-feedback-amber" role="status">
                        <span className="pp-feedback-icon" aria-hidden="true">✗</span>
                        <span>
                          Nope. One setlist, two names. Reyansh edits, Ahaana cries. 😭 Try again.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      clearRevealTimers();
                      shuffledOnReplayRef.current = true;
                      setDecisionMethods(getShuffledDecisionMethods());
                      setCurrentExpIndex(0);
                      setLabResult(null);
                      setRevealStage(null);
                      setPrediction(null);
                      window.scrollTo(0, 0);
                    }}
                    className="pp-secondary-cta-btn"
                  >
                    ↺ Replay Sound Lab
                  </button>

                  {saveMethodChoice === "solo_press" && (
                    <button
                      type="button"
                      onClick={handleGoToPythonReveal}
                      className="pp-primary-cta-btn"
                    >
                      Reveal the Python behind the Jam →
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* CHAPTER 4 — THE REVEAL (TWO-STAGE JOURNAL + 5 PYTHON TABS)     */}
        {/* ============================================================== */}
        {currentChapter === "reveal" && (() => {
          const JOURNAL_ROW_LABELS = {
            live_sync: { story: "Second name for the same setlist", python: "Assignment" },
            remix_link: { story: "New setlist, same moods", python: "Shallow copy" },
            solo_press: { story: "Full duplicate", python: "Deep copy" }
          };

          const activeTheoryChoice = recordedTheoryChoice || mysteryTheoryChoice;
          const guessFeedbackText =
            activeTheoryChoice === "shared"
              ? "You guessed one setlist, two names. That's assignment, Round 1! But copies behave differently."
              : activeTheoryChoice === "separate"
              ? "You guessed totally separate. True for a deep copy! A shallow copy still shares the moods."
              : activeTheoryChoice === "partial"
              ? "You guessed separate setlists, shared moods. Spot on! That's a shallow copy. 🎯"
              : "You tested all 3 patterns across 9 experiments and uncovered real Python.";

          const renderEvidenceJournalBody = () => (
            <>
              <div className="pp-journal-table-wrap">
                <table className="pp-journal-grid-table" aria-label="Evidence Journal from your Sound Lab experiments">
                  <thead>
                    <tr>
                      <th>How Remix Setlist was made</th>
                      {ACTIONS.map((act) => (
                        <th key={act.id}>{act.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {METHODS.map((method, mIdx) => {
                      const labels = JOURNAL_ROW_LABELS[method.id];
                      const isFlipped = mIdx < revealFlipCount;
                      return (
                        <tr key={method.id}>
                          <td className="pp-journal-method-cell">
                            <div className="pp-journal-method-slot">
                              {isFlipped ? (
                                <div className="pp-journal-label-flipped">
                                  <span className="pp-journal-python-name">{labels.python}</span>
                                  <span className="pp-journal-story-reminder">{labels.story}</span>
                                </div>
                              ) : (
                                <span className="pp-journal-story-only">{labels.story}</span>
                              )}
                            </div>
                          </td>
                          {ACTIONS.map((act) => {
                            const entry = journal[getJournalKey(method.id, act.id)];
                            const isChanged = entry
                              ? entry.isMasterChanged
                              : runSimulation({ methodId: method.id, actionId: act.id }).isMasterChanged;
                            return (
                              <td key={act.id}>
                                <span className={`pp-cell-badge ${isChanged ? "pp-cell-changed" : "pp-cell-safe"}`}>
                                  {isChanged ? "Changed" : "Safe"}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {revealFlipCount >= 3 && (
                <div className="pp-gut-recap-banner" role="status">
                  {guessFeedbackText}
                </div>
              )}
            </>
          );

          return (
            <section aria-labelledby="pp-heading-ch5">
              <header className="pp-scene-stepper-bar">
                <span className="pp-chapter-kicker-title">Chapter 4 · The Reveal</span>
              </header>

              <h1 id="pp-heading-ch5" ref={chapterHeadingRef} tabIndex={-1} className="pp-collection-title" style={{ fontSize: "1.875rem", margin: "0 0 0.75rem" }}>
                You Solved a Real Python Problem Before Learning Its Name.
              </h1>

              {/* STAGE 1: Evidence Journal with Story Labels -> Reveal Python Names -> Guess Feedback -> Explore */}
              {!revealStage2 ? (
                <div className="pp-reveal-journal-card">
                  <p className="pp-reveal-journal-lead">
                    Plot twist: you just learned real Python. Meet the names. ✨
                  </p>

                  {renderEvidenceJournalBody()}

                  <div className="pp-reveal-stage1-actions">
                    {revealFlipCount < 3 ? (
                      <button
                        type="button"
                        onClick={handleRevealPythonNames}
                        disabled={isFlippingNames}
                        className="pp-primary-cta-btn"
                      >
                        {isFlippingNames ? "Revealing Python names…" : "Reveal their Python names ✨"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleExploreEachName}
                        className="pp-primary-cta-btn"
                      >
                        Explore each name →
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* STAGE 2: Collapsed One-Line Bar Above the 5 Tabs */}
                  <div className="pp-journal-collapsed-wrap">
                    <button
                      type="button"
                      onClick={() => setIsJournalDrawerOpen((prev) => !prev)}
                      className="pp-journal-collapsed-bar"
                      aria-expanded={isJournalDrawerOpen}
                    >
                      <span>📒 Your Evidence Journal (tap to {isJournalDrawerOpen ? "close" : "open"})</span>
                      <span className="pp-journal-bar-chevron" aria-hidden="true">
                        {isJournalDrawerOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isJournalDrawerOpen && (
                      <div className="pp-reveal-journal-card pp-journal-drawer-body">
                        {renderEvidenceJournalBody()}
                      </div>
                    )}
                  </div>

                  {/* Five Strictly Sequential Tabs */}
                  <div ref={tabContentTopRef} className="pp-tabs-scroll-anchor">
                    <nav className="pp-tabs-navigation" aria-label="Python Concept Tabs">
                      {PYTHON_TABS.map((tab, idx) => {
                        const isActive = activeTabId === tab.id;
                        const isAccessible = idx <= Math.max(activeTabIndex + 1, highestTabIndex);
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            disabled={!isAccessible}
                            onClick={() => handleSelectPythonTab(tab.id, idx)}
                            className={`pp-tab-btn ${isActive ? "pp-active" : ""}`}
                            aria-selected={isActive}
                            role="tab"
                            title={isAccessible ? tab.label : "Navigate tabs in sequence to unlock"}
                          >
                            <span className="pp-tab-badge">{tab.number}</span>
                            <span>{tab.label}</span>
                            {!isAccessible && <span className="pp-tab-lock-glyph" aria-hidden="true">🔒</span>}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* TAB 1, 2, 3: Assignment, Shallow Copy, Deep Copy */}
                  {(activeTabId === "assignment" || activeTabId === "shallow_copy" || activeTabId === "deep_copy") && (
                    <article className="pp-dialogue-scene-card" style={{ padding: "2rem" }} role="tabpanel">
                      <span className="pp-clue-tag pp-clue-tag-blue">
                        Tab {currentTabDetails.tabNumber} of 5 · {currentTabDetails.fictionalName}
                      </span>
                      <h2 className="pp-collection-title" style={{ fontSize: "1.75rem", margin: "0.5rem 0" }}>
                        {currentTabDetails.title}
                      </h2>
                      <p className="pp-reveal-body-lead">
                        {currentTabDetails.definition}
                      </p>

                      <div className="pp-card-analogy-box" style={{ marginBottom: "1.25rem" }}>
                        <div className="pp-analogy-label">Story Analogy</div>
                        <p className="pp-analogy-text">{currentTabDetails.analogy}</p>
                      </div>

                      <div
                        className="pp-trick-to-remember-card"
                        style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}
                      >
                        <span className="pp-trick-tag">Trick to Remember</span>
                        <span className="pp-trick-text">
                          {currentTabDetails.trickToRemember}
                        </span>
                      </div>

                      {/* Multi-line Python Code Example with Compact Setup Block */}
                      <div style={{ margin: "1.25rem 0" }}>
                        <h3 style={{ fontSize: "1.1875rem", fontWeight: "800", color: "var(--pp-dark-teal)", marginBottom: "0.5rem" }}>
                          Python Code Example
                        </h3>
                        <div className="pp-setup-code-wrap">
                          <div className="pp-setup-code-label">Run this first (our setlist)</div>
                          <div className="pp-code-block pp-code-block-compact">
                            <pre>{SETLIST_SETUP_CODE}</pre>
                          </div>
                        </div>
                        <div className="pp-code-block">
                          <pre>{currentTabDetails.exampleCode}</pre>
                        </div>

                        {activeTabId === "assignment" && (
                          <div className="pp-code-tip-chip">
                            How to read <code>[0][1]</code>: <code>[0]</code> is the first mood (Intro). <code>[1]</code> is its first song.
                          </div>
                        )}
                      </div>

                      {/* Diagram & Always-Visible Master Impact Summary */}
                      <div className="pp-diagram-mutations-row">
                        <div>
                          <h3 style={{ fontSize: "1.1875rem", fontWeight: "800", color: "var(--pp-dark-teal)", marginBottom: "0.5rem" }}>
                            How the Setlists Connect
                          </h3>
                          <ReferenceView
                            methodId={currentTabDetails.graphType}
                            compact
                            title={`${currentTabDetails.title} Diagram`}
                          />
                          <p className="pp-reveal-diagram-caption">
                            {currentTabDetails.referenceGraphDescription}
                          </p>
                        </div>

                        <div className="pp-master-impact-card">
                          <h4 className="pp-master-impact-title">
                            What happens to Ahaana&apos;s Master?
                          </h4>
                          <div className="pp-master-impact-rows">
                            <div className="pp-master-impact-row">
                              <span>Reyansh swaps a song</span>
                              <span className={`pp-cell-badge ${currentTabDetails.masterSwapChanged ? "pp-cell-changed" : "pp-cell-safe"}`}>
                                {currentTabDetails.masterSwapChanged ? "Changed" : "Safe"}
                              </span>
                            </div>
                            <div className="pp-master-impact-row">
                              <span>Reyansh adds or removes a mood</span>
                              <span className={`pp-cell-badge ${currentTabDetails.masterMoodChanged ? "pp-cell-changed" : "pp-cell-safe"}`}>
                                {currentTabDetails.masterMoodChanged ? "Changed" : "Safe"}
                              </span>
                            </div>
                          </div>
                          <p className="pp-master-impact-why">{currentTabDetails.masterImpactWhy}</p>
                        </div>
                      </div>

                      {/* Sequential Next / Previous Tab Controls */}
                      <div className="pp-sequential-tab-footer">
                        {activeTabIndex > 0 ? (
                          <button
                            type="button"
                            onClick={() => handleSelectPythonTab(PYTHON_TABS[activeTabIndex - 1].id, activeTabIndex - 1)}
                            className="pp-secondary-cta-btn"
                          >
                            ← Previous: {PYTHON_TABS[activeTabIndex - 1].label}
                          </button>
                        ) : (
                          <div />
                        )}

                        <button
                          type="button"
                          onClick={() => handleSelectPythonTab(PYTHON_TABS[activeTabIndex + 1].id, activeTabIndex + 1)}
                          className="pp-primary-cta-btn"
                        >
                          Next: {PYTHON_TABS[activeTabIndex + 1].label} →
                        </button>
                      </div>
                    </article>
                  )}

                  {/* TAB 4: Same Songs vs Same Setlist */}
                  {activeTabId === "identity_equality" && (
                    <article className="pp-dialogue-scene-card" style={{ padding: "2rem" }} role="tabpanel">
                      <span className="pp-clue-tag pp-clue-tag-blue">Tab 4 of 5 · Same Songs, Same Setlist</span>

                      <h2 className="pp-collection-title" style={{ fontSize: "2rem", margin: "0.5rem 0" }}>
                        {currentTabDetails.title}
                      </h2>

                      <p className="pp-reveal-body-lead" style={{ fontWeight: "600", margin: "0 0 1.25rem" }}>
                        In Python, <code className="pp-inline-code">==</code> asks &lsquo;same songs?&rsquo; and <code className="pp-inline-code">is</code> asks &lsquo;the very same setlist?&rsquo;
                      </p>

                      <div className="pp-card-analogy-box" style={{ marginBottom: "1.25rem" }}>
                        <div className="pp-analogy-label">Story Analogy</div>
                        <p className="pp-analogy-text">{currentTabDetails.analogy}</p>
                      </div>

                      <div className="pp-trick-to-remember-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.85rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <span className="pp-trick-tag">Trick to Remember</span>
                          <span className="pp-trick-text">{currentTabDetails.trickToRemember}</span>
                        </div>
                        <div className="pp-journal-table-wrap" style={{ margin: 0 }}>
                          <table className="pp-info-mini-table pp-operator-table" style={{ margin: 0, backgroundColor: "var(--pp-cream)" }}>
                            <thead>
                              <tr>
                                <th>Operator</th>
                                <th>What it asks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentTabDetails.operatorTable.map((row) => (
                                <tr key={row.operator}>
                                  <td><code className="pp-inline-code">{row.operator}</code></td>
                                  <td>{row.meaning}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Multi-line Code Snippet with Compact Setup Block */}
                      <div style={{ margin: "1.25rem 0" }}>
                        <h3 style={{ fontSize: "1.1875rem", fontWeight: "800", color: "var(--pp-dark-teal)", marginBottom: "0.5rem" }}>
                          Python Code Example
                        </h3>
                        <div className="pp-setup-code-wrap">
                          <div className="pp-setup-code-label">Run this first (our setlist)</div>
                          <div className="pp-code-block pp-code-block-compact">
                            <pre>{SETLIST_SETUP_CODE}</pre>
                          </div>
                        </div>
                        <div className="pp-code-block">
                          <pre>{currentTabDetails.exampleCode}</pre>
                        </div>
                      </div>

                      <div style={{ marginTop: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.1875rem", fontWeight: "800", color: "var(--pp-dark-teal)", marginBottom: "0.65rem" }}>
                          Seeing the difference
                        </h3>
                        <ReferenceView
                          methodId="identity"
                          compact
                          title="Same Songs vs Same Setlist Diagram"
                        />
                      </div>

                      <div className="pp-sequential-tab-footer">
                        <button
                          type="button"
                          onClick={() => handleSelectPythonTab(PYTHON_TABS[activeTabIndex - 1].id, activeTabIndex - 1)}
                          className="pp-secondary-cta-btn"
                        >
                          ← Previous: {PYTHON_TABS[activeTabIndex - 1].label}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPythonTab(PYTHON_TABS[activeTabIndex + 1].id, activeTabIndex + 1)}
                          className="pp-primary-cta-btn"
                        >
                          Next: {PYTHON_TABS[activeTabIndex + 1].label} →
                        </button>
                      </div>
                    </article>
                  )}

            {/* TAB 5: Time to Test */}
            {activeTabId === "quiz" && (
              <div className="pp-quiz-panel" aria-labelledby="pp-quiz-title">
                <div className="pp-quiz-progress-bar-row">
                  {shuffledQuizQuestions.map((q, idx) => {
                    const isCurrent = idx === currentQuizIndex;
                    const chosenId = quizAttempts[q.id];
                    const correctOpt = q.options.find((o) => o.correct);
                    const isSolved = chosenId && correctOpt && chosenId === correctOpt.id;
                    const isIncorrectAttempt = chosenId && correctOpt && chosenId !== correctOpt.id;

                    let statusClass = "";
                    if (isSolved) {
                      statusClass = "pp-status-correct";
                    } else if (isCurrent) {
                      statusClass = "pp-status-current";
                    } else if (isIncorrectAttempt) {
                      statusClass = "pp-status-incorrect";
                    }

                    return (
                      <div
                        key={q.id}
                        className={`pp-quiz-q-indicator ${statusClass}`}
                        title={`Question ${idx + 1}`}
                      >
                        {isSolved ? "✔" : idx + 1}
                      </div>
                    );
                  })}
                  <div style={{ marginLeft: "auto", fontSize: "0.9rem", fontWeight: "800", color: "var(--pp-dark-teal)" }}>
                    Question {currentQuizIndex + 1} of {shuffledQuizQuestions.length}
                  </div>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <span className="pp-clue-tag pp-clue-tag-blue">
                    {currentQuizQ.topic}
                  </span>
                  <h3 id="pp-quiz-title" style={{ fontSize: "1.375rem", fontWeight: "900", color: "var(--pp-dark-teal)", margin: "0.75rem 0 1.25rem", lineHeight: 1.35 }}>
                    {currentQuizQ.question}
                  </h3>

                  <div role="radiogroup" aria-label={`Question ${currentQuizQ.number} choices`}>
                    {currentQuizQ.shuffledOptions.map((opt) => {
                      const isChosen = quizAttempts[currentQuizQ.id] === opt.id;
                      const correctOpt = currentQuizQ.options.find((o) => o.correct);
                      const isQuestionAlreadySolved =
                        quizAttempts[currentQuizQ.id] &&
                        correctOpt &&
                        quizAttempts[currentQuizQ.id] === correctOpt.id;

                      let optClass = "pp-quiz-option-btn";
                      if (isChosen) {
                        optClass += opt.correct ? " pp-opt-correct" : " pp-opt-incorrect";
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isChosen}
                          disabled={isQuestionAlreadySolved}
                          onClick={() => handleAnswerQuizQuestion(currentQuizQ.id, opt)}
                          className={optClass}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {quizAttempts[currentQuizQ.id] && (
                    <div style={{ marginTop: "1rem" }}>
                      {(() => {
                        const chosenOpt = currentQuizQ.options.find((o) => o.id === quizAttempts[currentQuizQ.id]);
                        if (chosenOpt?.correct) {
                          return (
                            <div className="pp-feedback-correct" role="status">
                              <div className="pp-quiz-right-headline">
                                <strong>{quizRightFeedback[currentQuizQ.id] || QUIZ_RIGHT_REACTIONS[0]}</strong>
                              </div>
                              <p className="pp-quiz-explanation-line">
                                {(currentQuizQ.explanationParts || []).map((part, pIdx) =>
                                  part.code ? (
                                    <code key={pIdx} className="pp-inline-code">{part.code}</code>
                                  ) : (
                                    <React.Fragment key={pIdx}>{part.text}</React.Fragment>
                                  )
                                )}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <div className="pp-hint-box" role="status">
                            {currentQuizQ.wrongFeedback}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => setCurrentQuizIndex((p) => Math.max(0, p - 1))}
                      disabled={currentQuizIndex === 0}
                      className="pp-secondary-cta-btn"
                    >
                      ← Previous Question
                    </button>

                    {currentQuizIndex < shuffledQuizQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuizIndex((p) => Math.min(shuffledQuizQuestions.length - 1, p + 1))}
                        disabled={!quizAttempts[currentQuizQ.id]}
                        className="pp-primary-cta-btn"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>

                  {allQuizAnsweredCorrectly && (
                    <div style={{ marginTop: "2.25rem", textAlign: "center", padding: "1.5rem", backgroundColor: "var(--pp-pale-aqua)", borderRadius: "var(--pp-radius-lg)", border: "2px solid var(--pp-teal)" }}>
                      <h4 style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--pp-dark-teal)", margin: "0 0 0.5rem" }}>
                        All Questions Solved!
                      </h4>
                      <p style={{ color: "var(--pp-dark-teal)", margin: "0 0 1.25rem" }}>
                        Click below to reveal your first-attempt score and complete the lesson!
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenCelebration}
                        className="pp-primary-cta-btn"
                        style={{ fontSize: "1.1rem", padding: "0.85rem 2rem" }}
                      >
                        Reveal My Score &amp; Celebrate! 🎉
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
                </>
              )}
            </section>
          );
        })()}
      </main>

      {/* Balanced Celebration Modal with Falling Confetti & Left/Right Decorative Graphics */}
      {showCelebrationModal && (
        <div className="pp-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pp-celebration-title">
          <CelebrationConfetti />
          <div className="pp-celebration-balanced-modal">
            <CelebrationSideGraphic side="left" />

            <div className="pp-celebration-center-content">
              <div className="pp-celebration-trophy">🏆</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                <MetaMixLogo size={42} />
              </div>
              {(() => {
                const celebrationCopy =
                  finalScore === 5
                    ? {
                        title: "Farewell Jam Legend!",
                        message: "The Master is safe, thanks to you. 🏆"
                      }
                    : finalScore >= 3
                    ? {
                        title: "Almost a Legend!",
                        message: "Reyansh is still lurking. Replay to catch him. 🕵️"
                      }
                    : {
                        title: "You Survived the Jam!",
                        message: "Reyansh almost got away with it. Replay and catch him. 😄"
                      };
                return (
                  <>
                    <h2 id="pp-celebration-title" className="pp-celebration-title">
                      {celebrationCopy.title}
                    </h2>
                    <p className="pp-celebration-text">
                      {celebrationCopy.message}
                    </p>
                  </>
                );
              })()}

              <div className="pp-score-highlight-card">
                <div className="pp-score-number">{finalScore} / {FINAL_QUIZ_QUESTIONS.length}</div>
                <div className="pp-score-label">First-Attempt Score</div>
                <div style={{ marginTop: "0.35rem", fontSize: "0.8125rem", color: "var(--pp-text-muted)" }}>
                  9 of 9 Sound Lab experiments gathered into your evidence journal.
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleConfirmRestart}
                  className="pp-secondary-cta-btn"
                >
                  Replay Lesson
                </button>
                <button
                  type="button"
                  onClick={() => setShowCelebrationModal(false)}
                  className="pp-primary-cta-btn"
                >
                  Close
                </button>
              </div>
            </div>

            <CelebrationSideGraphic side="right" />
          </div>
        </div>
      )}
    </div>
  );
}
