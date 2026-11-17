import React, { useCallback, useEffect, useReducer, useState } from 'react';
import ResourceBar from './components/ResourceBar';
import ChapterRunner from './chapters/ChapterRunner';
import { PyodideProvider } from './shared/pyodide/PyodideContext';
import { CHAPTERS, getChapter } from './data/chapters';
import { getMissionForChapter } from './engine/missions';
import {
  INITIAL_FARM,
  clearProgress,
  farmReducer,
  isChapterUnlocked,
  loadProgress,
  nextChapterId,
  saveProgress,
} from './engine/farmState';

function ChapterSelect({ farm, hintsUsed, onOpen, onReset }) {
  const total = CHAPTERS.reduce((sum, c) => sum + (getMissionForChapter(c.id)?.xp ?? 0), 0);
  const anyProgress = farm.completedMissions.length > 0;

  return (
    <div className="pf-select">
      <div className="pf-select-intro">
        <p className="pf-eyebrow">Learn Python on a farm that answers back</p>
        <h1>Maya inherited a farm. Help her run it.</h1>
        <p className="pf-select-sub">
          Every chapter is a real problem on Maya's farm. You write actual Python, it actually runs, and the
          farm changes because of what your code did — not because you were told it was right.
        </p>
        <p className="pf-select-progress">
          <span aria-hidden="true">⭐</span> {farm.xp} of {total} XP earned
        </p>
      </div>

      <ul className="pf-select-grid">
        {CHAPTERS.map((chapter) => {
          const mission = getMissionForChapter(chapter.id);
          const unlocked = isChapterUnlocked(chapter.id, farm.completedMissions);
          const done = farm.completedMissions.includes(chapter.missionId);
          const hints = hintsUsed[chapter.missionId] ?? 0;

          return (
            <li key={chapter.id}>
              <button
                type="button"
                className={`pf-chapter-card${unlocked ? '' : ' is-locked'}${done ? ' is-done' : ''}`}
                onClick={() => unlocked && onOpen(chapter.id)}
                disabled={!unlocked}
              >
                <span className="pf-chapter-num">Chapter {chapter.id}</span>
                <strong className="pf-chapter-title">{chapter.title}</strong>
                <span className="pf-concept-chip">{chapter.concept}</span>
                <span className="pf-chapter-tagline">{chapter.tagline}</span>
                {/* Part of the button's own text, so it is already in the
                    accessible name — it needs no aria-describedby pointing at it. */}
                <span className="pf-chapter-foot">
                  {done ? (
                    <>
                      <span aria-hidden="true">✔</span> Complete · {mission.xp} XP earned
                      {hints > 0 && ` · ${hints} hint${hints === 1 ? '' : 's'} used`}
                    </>
                  ) : unlocked ? (
                    <>
                      <span aria-hidden="true">▶</span> Available now · {mission.xp} XP
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">🔒</span> Finish Chapter {chapter.id - 1} to unlock
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}

        <li>
          <div className="pf-chapter-card pf-chapter-card-future" aria-hidden="true">
            <span className="pf-chapter-num">Coming soon</span>
            <strong className="pf-chapter-title">Loops, lists, functions…</strong>
            <span className="pf-chapter-tagline">
              More of Maya's farm is on the way, built the same way as these two.
            </span>
          </div>
        </li>
      </ul>

      {anyProgress && (
        <button type="button" className="pf-btn pf-btn-ghost pf-reset" onClick={onReset}>
          Reset my progress
        </button>
      )}
    </div>
  );
}

export default function PyFarm({ onExit }) {
  const [farm, dispatch] = useReducer(farmReducer, INITIAL_FARM);
  const [hintsUsed, setHintsUsed] = useState({});
  const [openChapterId, setOpenChapterId] = useState(null);
  const [restored, setRestored] = useState(false);

  // Bring back earned XP on load, so a refresh mid-chapter does not cost the
  // learner what they already finished.
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      dispatch({ type: 'RESTORE', farm: { xp: saved.xp, completedMissions: saved.completedMissions } });
      setHintsUsed(saved.hintsUsed);
    }
    setRestored(true);
  }, []);

  // Only write after the initial restore, or the first render would overwrite
  // saved progress with the empty starting state.
  useEffect(() => {
    if (!restored) return;
    saveProgress({ xp: farm.xp, completedMissions: farm.completedMissions, hintsUsed });
  }, [farm.xp, farm.completedMissions, hintsUsed, restored]);

  const handleHintUsed = useCallback((missionId) => {
    setHintsUsed((current) => ({ ...current, [missionId]: (current[missionId] ?? 0) + 1 }));
  }, []);

  const handleOpenChapter = useCallback((chapterId) => {
    dispatch({ type: 'OPEN_CHAPTER', chapterId });
    setOpenChapterId(chapterId);
  }, []);

  const handleReset = useCallback(() => {
    clearProgress();
    setHintsUsed({});
    setOpenChapterId(null);
    dispatch({ type: 'RESET' });
  }, []);

  const chapter = openChapterId ? getChapter(openChapterId) : null;
  const mission = openChapterId ? getMissionForChapter(openChapterId) : null;
  const followingId = openChapterId ? nextChapterId(openChapterId) : null;
  const following =
    followingId && isChapterUnlocked(followingId, farm.completedMissions) ? getChapter(followingId) : null;

  return (
    <PyodideProvider>
      <div className="pf-root">
        <ResourceBar
          farm={farm}
          onBack={chapter ? () => setOpenChapterId(null) : onExit}
          backLabel={chapter ? 'Chapters' : onExit ? 'Exit PyFarm' : undefined}
        />

        <main className="pf-main">
          {chapter ? (
            <ChapterRunner
              key={chapter.id}
              chapter={chapter}
              mission={mission}
              farm={farm}
              dispatch={dispatch}
              hintsUsed={hintsUsed[mission.id] ?? 0}
              onHintUsed={handleHintUsed}
              onBackToChapters={() => setOpenChapterId(null)}
              onGoToChapter={handleOpenChapter}
              nextChapter={following}
            />
          ) : (
            <ChapterSelect
              farm={farm}
              hintsUsed={hintsUsed}
              onOpen={handleOpenChapter}
              onReset={handleReset}
            />
          )}
        </main>

        <footer className="pf-footer">
          <p>PyFarm · a PyBe learning module. Python runs in your browser — nothing you write is sent anywhere.</p>
        </footer>
      </div>
    </PyodideProvider>
  );
}
