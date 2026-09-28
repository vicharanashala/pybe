import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FarmScene from '../components/FarmScene';
import StoryPanel from '../components/StoryPanel';
import CodeChallenge from '../components/CodeChallenge';
import { useSharedPyodide } from '../shared/pyodide/PyodideContext';
import { runMission } from '../engine/runMission';
import { assembleBlanks, isComplete } from '../engine/blanks';

// One runner drives every chapter. Both MVP chapters walk the same seven screens
// and differ only in their data (data/chapters.js) and their mission
// (engine/missions.js), so a third chapter needs no changes here.

const STAGES = ['scene', 'problem', 'think', 'reveal', 'explain', 'challenge', 'complete'];
const STAGE_LABELS = {
  scene: 'Story',
  problem: 'Problem',
  think: 'Think',
  reveal: 'Concept',
  explain: 'Python',
  challenge: 'Code',
  complete: 'Reward',
};

// How long the farm holds its highlight after a successful run, so the change
// reads as an event rather than a silent re-render.
const HIGHLIGHT_MS = 2600;

export default function ChapterRunner({
  chapter,
  mission,
  farm,
  dispatch,
  hintsUsed,
  onHintUsed,
  onBackToChapters,
  onGoToChapter,
  nextChapter,
}) {
  const { status, running, runJSON, errorDetail } = useSharedPyodide();

  const [stageIndex, setStageIndex] = useState(0);
  const [choiceId, setChoiceId] = useState(null);
  // Scaffolded by default where a mission offers it: a beginner meeting `if` for
  // the first time gets to think about the decision before the syntax.
  const [mode, setMode] = useState(mission.blanks ? 'blanks' : 'write');
  const [selections, setSelections] = useState({});
  const [draft, setDraft] = useState(mission.starterCode);
  const [result, setResult] = useState(null);
  const [runtimeError, setRuntimeError] = useState(null);
  const [output, setOutput] = useState('');
  const [highlight, setHighlight] = useState(null);
  const [delta, setDelta] = useState(null);
  const [scenarioView, setScenarioView] = useState(null);

  const highlightTimer = useRef(null);
  const stage = STAGES[stageIndex];

  // Starting a different chapter is a fresh run of the whole flow.
  useEffect(() => {
    setStageIndex(0);
    setChoiceId(null);
    setMode(mission.blanks ? 'blanks' : 'write');
    setSelections({});
    setDraft(mission.starterCode);
    setResult(null);
    setRuntimeError(null);
    setOutput('');
    setHighlight(null);
    setDelta(null);
    setScenarioView(null);
  }, [mission.id, mission.starterCode, mission.blanks]);

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const goNext = useCallback(() => {
    setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
  }, []);

  // Whichever route the learner took, this is the Python that gets executed.
  // Blanks mode never falls back to the editor's draft: what is on screen is
  // what runs.
  const codeToRun = useMemo(
    () =>
      mode === 'blanks' && mission.blanks
        ? assembleBlanks(mission.blanks.template, selections)
        : draft,
    [draft, mission.blanks, mode, selections]
  );

  // Switching to the free editor carries the assembled code over, so the
  // scaffold becomes the starting point instead of being thrown away — but only
  // while the draft is still untouched, so it can never clobber real edits.
  const handleModeChange = useCallback(
    (next) => {
      if (
        next === 'write' &&
        mission.blanks &&
        draft === mission.starterCode &&
        isComplete(mission.blanks.template, selections)
      ) {
        setDraft(assembleBlanks(mission.blanks.template, selections));
      }
      setMode(next);
      setResult(null);
      setRuntimeError(null);
      setOutput('');
    },
    [draft, mission.blanks, mission.starterCode, selections]
  );

  const handleSelect = useCallback((slotId, value) => {
    setSelections((current) => ({ ...current, [slotId]: value }));
    setResult(null);
    setRuntimeError(null);
    setOutput('');
  }, []);

  const handleRun = useCallback(async () => {
    setRuntimeError(null);
    setResult(null);
    setOutput('');

    const { runtimeError: failure, runs, result: verdict } = await runMission(mission, codeToRun, runJSON);

    if (failure) {
      setRuntimeError(failure);
      return;
    }

    setResult(verdict);
    setOutput(runs.map((r) => r.output).find((o) => o.trim()) ?? '');

    // The farm only ever changes because the learner's code actually produced
    // this — and it changes on a wrong answer too, so the scene always shows the
    // consequence of the last run rather than the best result so far.
    if (verdict.farm) dispatch({ type: 'APPLY_FARM_PATCH', patch: verdict.farm });

    if (!verdict.passed) return;

    const target = mission.chapterId === 1 ? 'seeds' : 'crops';
    setHighlight(target);
    setDelta(mission.chapterId === 1 ? { target: 'seeds', text: '+10' } : { target: 'water', text: '-10' });
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => {
      setHighlight(null);
      setDelta(null);
    }, HIGHLIGHT_MS);
  }, [codeToRun, dispatch, mission, runJSON]);

  const handleContinue = useCallback(() => {
    dispatch({ type: 'COMPLETE_MISSION', missionId: mission.id, xp: mission.xp });
    // Drop any scenario preview, or the reward screen would show the morning the
    // learner was last inspecting instead of the farm they actually ended up with.
    setScenarioView(null);
    setStageIndex(STAGES.length - 1);
  }, [dispatch, mission.id, mission.xp]);

  // After Chapter 2 passes, the learner can look at either morning their code
  // handled. This only re-dresses the scene for viewing; it changes no progress.
  const shownFarm = useMemo(() => {
    if (!scenarioView || !result?.outcomes) return farm;
    const outcome = result.outcomes.find((o) => o.scenarioId === scenarioView);
    if (!outcome) return farm;
    return {
      ...farm,
      weather: scenarioView === 'rain' ? 'rain' : 'sunny',
      water: outcome.water,
      crops: outcome.watered ? 'watered' : 'rain-watered',
    };
  }, [farm, result, scenarioView]);

  const mayaMood = useMemo(() => {
    if (stage === 'complete') return chapter.complete.mayaMood;
    if (stage === 'challenge') {
      if (result?.passed) return 'happy';
      if (result || runtimeError) return 'worried';
      return 'thinking';
    }
    return chapter[stage]?.mayaMood ?? 'normal';
  }, [chapter, result, runtimeError, stage]);

  return (
    <div className="pf-chapter">
      <nav className="pf-stages" aria-label="Chapter progress">
        <ol>
          {STAGES.map((s, i) => (
            <li
              key={s}
              className={`pf-stage-dot${i === stageIndex ? ' is-current' : ''}${i < stageIndex ? ' is-done' : ''}`}
              aria-current={i === stageIndex ? 'step' : undefined}
            >
              <span className="pf-stage-num" aria-hidden="true">{i + 1}</span>
              <span className="pf-stage-label">{STAGE_LABELS[s]}</span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="pf-layout">
        {/* The farm comes first in the document, so on a narrow screen the order
            is farm, then story, then editor, then result. */}
        <div className="pf-layout-farm">
          <FarmScene farm={shownFarm} mayaMood={mayaMood} highlight={highlight} delta={delta} />

          {result?.outcomes && stage === 'challenge' && (
            <div className="pf-scenario-switch" role="group" aria-label="See how your code handled each morning">
              <span className="pf-scenario-switch-label">Your code, run on both mornings:</span>
              {result.outcomes.map((outcome) => (
                <button
                  key={outcome.scenarioId}
                  type="button"
                  className={`pf-btn pf-btn-chip${scenarioView === outcome.scenarioId ? ' is-active' : ''}`}
                  aria-pressed={scenarioView === outcome.scenarioId}
                  onClick={() =>
                    setScenarioView((current) => (current === outcome.scenarioId ? null : outcome.scenarioId))
                  }
                >
                  {mission.scenarios.find((s) => s.id === outcome.scenarioId)?.icon}{' '}
                  {outcome.scenarioId === 'rain' ? 'Rainy morning' : 'Sunny morning'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pf-layout-panel">
          <div className="pf-panel">
            {stage === 'challenge' ? (
              <CodeChallenge
                mission={mission}
                mode={mode}
                onModeChange={handleModeChange}
                selections={selections}
                onSelect={handleSelect}
                draft={draft}
                onDraftChange={setDraft}
                onRun={handleRun}
                onReset={() => {
                  if (mode === 'blanks') setSelections({});
                  else setDraft(mission.starterCode);
                  setResult(null);
                  setRuntimeError(null);
                  setOutput('');
                  setScenarioView(null);
                }}
                onContinue={handleContinue}
                running={running}
                status={status}
                statusDetail={errorDetail}
                result={result}
                runtimeError={runtimeError}
                output={output}
                hintsRevealed={hintsUsed}
                onRevealHint={() => onHintUsed(mission.id)}
              />
            ) : (
              <StoryPanel
                stage={stage}
                chapter={chapter}
                mission={mission}
                farm={farm}
                hintsUsed={hintsUsed}
                choiceId={choiceId}
                onChoose={setChoiceId}
                onNext={goNext}
                nextChapterTitle={nextChapter ? `Chapter ${nextChapter.id}: ${nextChapter.title}` : null}
                onNextChapter={nextChapter ? () => onGoToChapter(nextChapter.id) : null}
                onBackToChapters={onBackToChapters}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
