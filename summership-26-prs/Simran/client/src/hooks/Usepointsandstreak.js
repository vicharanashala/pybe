import { useEffect, useRef, useState } from "react";

const POINTS_STORAGE_KEY = "pybe_points";
const STREAK_STORAGE_KEY = "pybe_streak";
const LAST_LEARNING_DATE_KEY = "pybe_last_learning_date";
const LEVELS_COMPLETED_STORAGE_KEY = "pybe_completed_levels";

// Point values live here and nowhere else — tweak freely.
const STORY_SECTION_POINTS = 60; // spread across all story cards
const CONCEPT_SECTION_POINTS = 40; // spread across the concept section
const QUIZ_SECTION_POINTS = 80; // spread across quiz questions
const LEVEL_BONUS_POINTS = 50; // flat bonus per completed level

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function readStoredNumber(key, fallback = 0) {
  const raw = localStorage.getItem(key);
  const parsed = raw === null ? NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Encapsulates the points + learning-streak system: state, localStorage
 * persistence, and the point-awarding rules. App.jsx just calls the
 * record* functions from the existing progress callbacks/step logic —
 * no gamification math lives in App.jsx itself.
 */
export default function usePointsAndStreak() {
  const [points, setPoints] = useState(() => readStoredNumber(POINTS_STORAGE_KEY, 0));
  const [streak, setStreak] = useState(() => readStoredNumber(STREAK_STORAGE_KEY, 0));
  const [levelsCompleted, setLevelsCompleted] = useState(() =>
    readStoredNumber(LEVELS_COMPLETED_STORAGE_KEY, 0)
  );

  // Independent "last seen" trackers per section, so points are awarded
  // on each incremental gain no matter how progress state is reused
  // elsewhere in the app across different steps.
  const lastStoryProgress = useRef(0);
  const lastConceptProgress = useRef(0);
  const lastQuizProgress = useRef(0);

  function addPoints(amount) {
    if (!amount) return;
    setPoints((prev) => {
      const next = prev + amount;
      localStorage.setItem(POINTS_STORAGE_KEY, String(next));
      return next;
    });
  }

  function recordProgress(ref, value, sectionPoints) {
    const prevValue = ref.current;
    const delta = Math.max(0, value - prevValue);
    ref.current = value;
    if (delta > 0) {
      addPoints(Math.round((delta / 100) * sectionPoints));
    }
  }

  function recordStoryProgress(value) {
    recordProgress(lastStoryProgress, value, STORY_SECTION_POINTS);
  }

  function recordConceptProgress(value) {
    recordProgress(lastConceptProgress, value, CONCEPT_SECTION_POINTS);
  }

  function recordQuizProgress(value) {
    recordProgress(lastQuizProgress, value, QUIZ_SECTION_POINTS);
  }

  function recordLevelComplete() {
    addPoints(LEVEL_BONUS_POINTS);
    setLevelsCompleted((prev) => {
      const next = prev + 1;
      localStorage.setItem(LEVELS_COMPLETED_STORAGE_KEY, String(next));
      return next;
    });
  }

  // Restarting the lesson clears points/levels earned this run, but a
  // daily streak is about the learning habit, not one lesson — it's
  // left alone here on purpose.
  function resetAll() {
    localStorage.removeItem(POINTS_STORAGE_KEY);
    localStorage.removeItem(LEVELS_COMPLETED_STORAGE_KEY);
    lastStoryProgress.current = 0;
    lastConceptProgress.current = 0;
    lastQuizProgress.current = 0;
    setPoints(0);
    setLevelsCompleted(0);
  }

  // Daily streak check-in, once per mount: learning again today keeps
  // it as-is, a consecutive day extends it, a gap resets it to 1.
  useEffect(() => {
    const today = todayKey();
    const lastDate = localStorage.getItem(LAST_LEARNING_DATE_KEY);

    if (lastDate === today) return;

    const nextStreak = lastDate === yesterdayKey() ? readStoredNumber(STREAK_STORAGE_KEY, 0) + 1 : 1;

    localStorage.setItem(STREAK_STORAGE_KEY, String(nextStreak));
    localStorage.setItem(LAST_LEARNING_DATE_KEY, today);
    setStreak(nextStreak);
  }, []);

  return {
    points,
    streak,
    levelsCompleted,
    recordStoryProgress,
    recordConceptProgress,
    recordQuizProgress,
    recordLevelComplete,
    resetAll,
  };
}