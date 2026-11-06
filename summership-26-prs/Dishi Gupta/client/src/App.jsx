import React, { useEffect, useMemo, useRef, useState } from 'react';
import { api } from './lib/api';
import { loadProgress, saveProgress, resetProgress, markRevealSeen } from './lib/progress';
import LightningBackground from './components/LightningBackground';
import Onboarding from './components/Onboarding';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import CaseContent from './components/CaseContent';
import LedgerDrawer from './components/LedgerDrawer';
import SuspectBoard from './components/SuspectBoard';
import CodeModal from './components/CodeModal';
import { computeBoard, scoreHistory } from './lib/leaderboard.mjs';

export default function App() {
  const [phase, setPhase] = useState('storm'); // storm -> onboarding | manor
  const [scenarios, setScenarios] = useState([]);
  const [bootError, setBootError] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());
  const [activePartId, setActivePartId] = useState(null);
  const [results, setResults] = useState({}); // scenarioId -> latest mentor output (in-memory)
  const [submitting, setSubmitting] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [inspectingPart, setInspectingPart] = useState(null);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const contentRef = useRef(null);

  function updateProgress(patch) {
    setProgress((current) => {
      const next = { ...current, ...patch };
      saveProgress(next);
      return next;
    });
  }

  useEffect(() => {
    let alive = true;
    api('/scenarios')
      .then((data) => {
        if (!alive) return;
        setScenarios(data);
        const saved = loadProgress();
        const resumeId = saved.currentPartId && data.some((item) => item._id === saved.currentPartId)
          ? saved.currentPartId
          : data[0]?._id;
        if (saved.onboarded && data.length) {
          setActivePartId(resumeId);
          setPhase('manor');
        } else {
          setPhase('onboarding');
        }
      })
      .catch((error) => {
        if (alive) setBootError(error.message || 'The manor gates would not open.');
      });
    return () => { alive = false; };
  }, []);

  // All tracked content lives in the chained story; group parts by storyId.
  const stories = useMemo(() => {
    const byStory = new Map();
    scenarios.forEach((scenario) => {
      if (!scenario.storyId) return;
      if (!byStory.has(scenario.storyId)) byStory.set(scenario.storyId, []);
      byStory.get(scenario.storyId).push(scenario);
    });
    return [...byStory.entries()].map(([id, parts]) => {
      const sorted = [...parts].sort((a, b) => (a.order || 0) - (b.order || 0));
      const title = (sorted[0]?.title || id).split(':')[0];
      const allConcepts = [...new Set(sorted.flatMap((part) => part.concepts || []))];
      return { id, title, parts: sorted, allConcepts };
    });
  }, [scenarios]);

  const activePart = useMemo(
    () => scenarios.find((scenario) => scenario._id === activePartId) || null,
    [scenarios, activePartId]
  );
  const activeStory = useMemo(
    () => stories.find((story) => story.parts.some((part) => part._id === activePartId)) || null,
    [stories, activePartId]
  );

  const activeStepIndex = Math.max(0, progress?.subStepIndex?.[activePartId] || 0);

  // Track seen reveals in localStorage so reload neither replays nor skips them
  useEffect(() => {
    const currentSlide = activePart?.slides?.[activeStepIndex];
    if (activePartId && currentSlide && (currentSlide.isCodeReveal || currentSlide.kind === 'code-reveal')) {
      markRevealSeen(activePartId);
      const nowIso = new Date().toISOString();
      const alreadyCompleted = progress.completedParts?.includes(activePartId);
      const updatedCompletedParts = alreadyCompleted
        ? progress.completedParts
        : [...(progress.completedParts || []), activePartId];
      const updatedCompletedAt = {
        ...(progress.completedAt || {}),
        [activePartId]: progress.completedAt?.[activePartId] || nowIso
      };
      const needsUpdate = !progress.seenReveals?.includes(activePartId) || !alreadyCompleted;
      if (needsUpdate) {
        updateProgress({
          seenReveals: [...new Set([...(progress.seenReveals || []), activePartId])],
          completedParts: updatedCompletedParts,
          completedAt: updatedCompletedAt
        });
      }
    }
  }, [activePartId, activeStepIndex, activePart?.slides, progress.completedParts, progress.seenReveals, progress.completedAt]);


  function selectPart(part) {
    setActivePartId(part._id);
    setProgress((current) => {
      if (current.currentPartId === part._id && typeof current?.subStepIndex?.[part._id] === 'number') {
        return current;
      }
      const next = {
        ...current,
        currentPartId: part._id,
        subStepIndex: { ...(current?.subStepIndex || {}), [part._id]: 0 }
      };
      saveProgress(next);
      return next;
    });
    contentRef.current?.scrollTo({ top: 0 });
  }

  function setStep(stepIndex) {
    const currentIndex = progress?.subStepIndex?.[activePartId] || 0;
    const currentSlide = activePart?.slides?.[currentIndex];
    const revealedSuspectIds = [...new Set([...(progress.revealedSuspectIds || []), ...(currentSlide?.introduces || [])])];
    updateProgress({
      currentPartId: activePartId,
      subStepIndex: { ...(progress?.subStepIndex || {}), [activePartId]: Math.max(0, stepIndex) },
      completedSlideIds: stepIndex > currentIndex && currentSlide
        ? [...new Set([...(progress.completedSlideIds || []), currentSlide.id, activePart?.slides?.[stepIndex]?.id])]
        : progress.completedSlideIds || [],
      revealedSuspectIds
    });
    contentRef.current?.scrollTo({ top: 0 });
  }

  async function submitChoice(choice, slide, attempts) {
    if (!activePart) return;
    updateProgress({
      questionAttempts: {
        ...progress.questionAttempts,
        [`${activePart._id}:${slide.id}`]: attempts
      }
    });
    setSubmitting(true);
    try {
      const result = await api('/sessions', {
        method: 'POST',
        body: JSON.stringify({
          learnerName: 'Guest learner',
          scenarioId: activePart._id,
          reasoning: choice.text,
          promptText: slide.questionType === 'prompt' ? choice.text : 'Explain the evidence and the Python structure step by step.',
          reflection: choice.text,
          attempts
        })
      });
      setResults((current) => ({ ...current, [activePart._id]: result }));
      setStep((progress?.subStepIndex?.[activePartId] || 0) + 1);
    } catch (error) {
      console.error('Could not submit reasoning', error);
    } finally {
      setSubmitting(false);
    }
  }

  function sealPart() {
    if (!activePart) return;
    const nowIso = new Date().toISOString();
    const alreadySealed = progress.completedParts.includes(activePart._id);
    const completedParts = alreadySealed
      ? progress.completedParts
      : [...progress.completedParts, activePart._id];
    const completedAt = {
      ...(progress.completedAt || {}),
      [activePart._id]: progress.completedAt?.[activePart._id] || nowIso
    };

    const nextPart = activePart.nextScenarioId
      ? scenarios.find((scenario) => scenario._id === activePart.nextScenarioId)
      : null;

    if (nextPart) {
      updateProgress({
        completedParts,
        completedAt,
        currentPartId: nextPart._id,
        subStepIndex: { ...(progress?.subStepIndex || {}), [nextPart._id]: 0 }
      });
      setActivePartId(nextPart._id);

    } else {
      const solved = {
        ...resetProgress(),
        caseSolved: true,
        solvedAt: new Date().toISOString()
      };
      saveProgress(solved);
      setProgress(solved);
      setResults({});
      setLedgerOpen(false);
      setActivePartId(null);
      setPhase('onboarding');
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
      return;
    }
    contentRef.current?.scrollTo({ top: 0 });
  }

  function handleViewCode(partOrId) {
    if (!partOrId) return;
    let target = null;
    if (typeof partOrId === 'string') {
      target = scenarios.find((s) => s._id === partOrId);
    } else if (typeof partOrId === 'object') {
      target = partOrId;
    }
    if (target) {
      setInspectingPart(target);
    }
  }

  function finishOnboarding() {
    const firstPart = stories[0]?.parts[0] || scenarios[0];
    updateProgress({
      onboarded: true,
      currentPartId: firstPart?._id ?? null,
      subStepIndex: firstPart ? { ...(progress?.subStepIndex || {}), [firstPart._id]: 0 } : (progress?.subStepIndex || {})
    });
    setActivePartId(firstPart?._id ?? null);
    setPhase('manor');
  }

  function restartJourney() {
    const fresh = resetProgress();
    saveProgress(fresh);
    setResults({});
    setLedgerOpen(false);
    setInspectingPart(null);
    setActivePartId(null);
    setProgress(fresh);
    setPhase('onboarding');
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--ink').trim());
    window.localStorage.setItem('pybe.theme', next);
    setTheme(next);
  }

  if (phase === 'storm') {
    return (
      <div className="phase-storm">
        <LightningBackground />
        <p className={bootError ? 'storm-error' : 'storm-line'}>
          {bootError
            ? <>The manor is unreachable tonight.<br /><small>{bootError}</small><br />Is the server running on port 5000?</>
            : 'Rain streaks the windows…'}
        </p>
      </div>
    );
  }

  if (phase === 'onboarding') {
    return (
      <div className="phase-onboard">
        <LightningBackground />
        <Onboarding onFinish={finishOnboarding} caseSolved={progress.caseSolved} />
      </div>
    );
  }

  const partTotal = activeStory ? activeStory.parts.length : 1;
  const partIndex = activeStory ? activeStory.parts.findIndex((part) => part._id === activePartId) : 0;
  const decoratedScenario = activePart
    ? { ...activePart, _allCaseConcepts: activeStory?.allConcepts || activePart.concepts || [] }
    : null;
  const caseClosed = Boolean(decoratedScenario?.nextScenarioId == null
    && progress.completedParts.includes(decoratedScenario?._id));
  const showEvidence = Boolean(activePart?.caseData);
  const allEvents = activeStory?.parts.flatMap((part) => part.evidenceEvents || []) || [];
  const globalSlideIndex = (partIndex * 20) + activeStepIndex;
  const completedSlideIds = progress.completedSlideIds || [];
  const revealedFromSlides = activeStory?.parts.flatMap((part) => part.slides || [])
    .filter((slide) => completedSlideIds.includes(slide.id))
    .flatMap((slide) => slide.introduces || []) || [];
  const revealedSuspectIds = [...new Set([...(progress.revealedSuspectIds || []), ...revealedFromSlides])];
  const board = computeBoard(allEvents, completedSlideIds, globalSlideIndex, revealedSuspectIds);
  const boardHistory = scoreHistory(allEvents);
  const unlockedClues = allEvents.filter((event) => completedSlideIds.includes(event.slideId) && event.slideIndex <= globalSlideIndex).length;

  return (
    <div className="manor">
      <LightningBackground />
      <TopBar
        storyParts={activeStory?.parts || []}
        completedParts={progress.completedParts}
        activePartId={activePartId}
        onJumpToPart={selectPart}
        onOpenLedger={() => setLedgerOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="three-zone">
        <Sidebar
          stories={stories}
          activeCaseId={activeStory?.id}
          activePartId={activePartId}
          completedParts={progress.completedParts}
          onSelectPart={selectPart}
          onViewCode={handleViewCode}
        />

        <main className="center-zone" ref={contentRef}>
          {decoratedScenario ? (
            <CaseContent
              key={decoratedScenario._id}
              scenario={decoratedScenario}
              partIndex={partIndex}
              partTotal={partTotal}
              stepIndex={activeStepIndex}
              result={results[decoratedScenario._id] || null}
              submitting={submitting}
              caseClosed={caseClosed}
              showEvidence={showEvidence}
              inStory={Boolean(activeStory)}
              onStepChange={setStep}
              onChoiceSubmit={submitChoice}
              onSealPart={sealPart}
              boardHistory={boardHistory}
              clueCount={12}
              clueTrail={allEvents}
              unlockedClues={unlockedClues}
              clueTotal={allEvents.length}
              onViewCode={handleViewCode}
            />
          ) : (
            <p className="archive-empty">Choose a file from the archive.</p>
          )}
        </main>
        <SuspectBoard board={board} />
      </div>

      <LedgerDrawer
        open={ledgerOpen}
        onClose={() => setLedgerOpen(false)}
        onReset={restartJourney}
        completedParts={progress.completedParts}
        completedAt={progress.completedAt}
        scenarios={scenarios}
      />
      {inspectingPart && (
        <CodeModal
          part={inspectingPart}
          onClose={() => setInspectingPart(null)}
        />
      )}
    </div>
  );
}
