import { useState, useEffect } from 'react';
import { Image as ImageIcon, Bot, CheckCircle2, XCircle, Sparkles, Split, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getThemeMeta } from '../../utils/themeStyles';

/**
 * PythonDiscoveryComponent — AI-Powered Python Discovery Learning, part 1.
 *
 * Workflow implemented here (matches the product flowchart):
 *   1. THREE real-world scenario steps, all from the learner's chosen
 *      theme (sports / daily-life / philosophy / food / environmental), shown
 *      ONE AT A TIME with Back/Next navigation. The learner writes their
 *      own free-text response to each one (GET /discovery/:conceptId).
 *   2. Once all three responses are collected, they're submitted together
 *      in ONE request to POST /discovery/respond — ONE AI call considers
 *      all three together and returns a single consolidated, plain
 *      paragraph explanation bridging to the actual Python concept.
 *   3. A SINGLE follow-up decision scenario is then shown — a real-life
 *      analogy for the concept (deliberately not about code/syntax) with
 *      two concrete options. The learner picks one (POST /discovery/
 *      decision), and a SECOND AI call gives a short, specific analysis
 *      of that pick.
 *   4. Only after that does "Continue to the Python concept" appear,
 *      handing off to Section 2 (syntax + visualizer).
 */
export default function PythonDiscoveryComponent({ concept, onComplete, isCompleted, onExplanationReady }) {
  const { user } = useAuth();
  const theme = getThemeMeta(user?.theme);

  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Step-through-scenarios state (free text)
  const [stepIndex, setStepIndex] = useState(0);   // 0, 1, 2 — which scenario is showing
  const [responses, setResponses] = useState(['', '', '']); // one response per scenario

  // The first AI call and its single consolidated result
  const [explanation, setExplanation] = useState(null); // one plain-paragraph string
  const [thinking, setThinking] = useState(false);
  const [thinkError, setThinkError] = useState('');

  // The follow-up decision scenario (real-life analogy, A/B) and its
  // separate, second AI analysis call
  const [decisionChoice, setDecisionChoice] = useState(null); // 'A' | 'B'
  const [decisionResult, setDecisionResult] = useState(null); // { correct, analysis }
  const [decisionThinking, setDecisionThinking] = useState(false);
  const [decisionError, setDecisionError] = useState('');

  const [phase, setPhase] = useState('scenarios');
  // scenarios -> thinking -> response -> decision -> decision_thinking -> decision_result -> done

  // Whether the read-only recap (for an already-completed lesson) is
  // expanded. Starts collapsed so the page isn't cluttered by default,
  // but the learner can open it any time — no API call either way, since
  // everything needed was already fetched in the GET below.
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingContent(true);
      setLoadError('');
      try {
        // Fetched regardless of isCompleted — this is a plain GET (no AI
        // call, no mutation), and for an already-completed lesson it's
        // what carries back the saved snapshot (savedDiscovery) needed to
        // show a full read-only recap instead of an empty compact badge.
        const res = await api.get(`/discovery/${concept._id}`);
        if (!cancelled) setContent(res.data);
      } catch (err) {
        if (!cancelled) setLoadError('Could not load the discovery challenge for this concept.');
      } finally {
        if (!cancelled) setLoadingContent(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [concept._id]);

  useEffect(() => {
    if (isCompleted) setPhase('done');
  }, [isCompleted]);

  const scenarios = content?.challenge?.scenarios || [];
  const decisionScenario = content?.challenge?.decisionScenario || null;
  const background = content?.challenge?.background || '';
  // The learner's saved answers + AI outputs from a previous run through
  // this lesson, if any — used only to render a read-only recap, never to
  // pre-fill anything editable. Prefers the server-saved snapshot (what
  // you get on a fresh page load after finishing); falls back to this
  // session's own live state for the moment right after finishing, before
  // a reload has happened.
  const savedDiscovery = content?.savedDiscovery || (explanation ? {
    responses,
    explanation,
    decisionChoice,
    decisionCorrect: decisionResult?.correct ?? null,
    decisionAnalysis: decisionResult?.analysis || null
  } : null);
  const currentResponse = responses[stepIndex] || '';
  const isLastStep = stepIndex === scenarios.length - 1;

  const setCurrentResponse = (value) => {
    setResponses(prev => {
      const next = [...prev];
      next[stepIndex] = value;
      return next;
    });
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex(i => i - 1);
  };

  const goNext = () => {
    if (!currentResponse.trim()) return;
    if (!isLastStep) {
      setStepIndex(i => i + 1);
    } else {
      submitAllResponses();
    }
  };

  // The ONE request for the three free-text answers — all three go
  // together, no local check first, no retry after.
  const submitAllResponses = async () => {
    if (thinking) return;
    setThinking(true);
    setThinkError('');
    setPhase('thinking');
    try {
      const res = await api.post('/discovery/respond', {
        conceptId: concept._id,
        responses
      });
      const exp = res.data.explanation || '';
      setExplanation(exp);
      setPhase('response');
      if (onExplanationReady) onExplanationReady(exp);
    } catch (err) {
      setThinkError('Could not reach the AI right now. Please try again in a moment.');
      setPhase('response');
    } finally {
      setThinking(false);
    }
  };

  const goToDecision = () => {
    setPhase('decision');
  };

  const submitDecision = async () => {
    if (!decisionChoice || decisionThinking) return;
    setDecisionThinking(true);
    setDecisionError('');
    setPhase('decision_thinking');
    try {
      const res = await api.post('/discovery/decision', {
        conceptId: concept._id,
        choice: decisionChoice
      });
      setDecisionResult(res.data);
      setPhase('decision_result');
    } catch (err) {
      setDecisionError('Could not reach the AI right now. Please try again in a moment.');
      setPhase('decision_result');
    } finally {
      setDecisionThinking(false);
    }
  };

  const finishDiscovery = async () => {
    if (isCompleted) return;
    onComplete();
    setPhase('done');
  };

  if (isCompleted && phase === 'done') {
    return (
      <div className={`relative overflow-hidden card p-6 border-2 ${theme.border} ${theme.bg}`}>
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg ${theme.glow} ring-4 ${theme.ring}`}>
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI Discovery Learning</h3>
            <p className={`text-xs ${theme.accentText} flex items-center gap-1 font-medium`}>
              Section 1 · <theme.icon size={12} /> {theme.label}
            </p>
          </div>
          <span className="ml-auto badge-easy flex items-center gap-1">
            <CheckCircle2 size={12} /> Done
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle2 size={16} /> Discovery Learning Completed
        </div>

        {/* Read-only recap — everything the learner wrote and everything
           the AI said, exactly as it happened. No textareas, no option
           buttons wired to anything: nothing here can be edited, and
           opening/closing this never calls the API — content was already
           fetched above, once, on load. */}
        {savedDiscovery && (
          <div className="mt-4">
            <button
              onClick={() => setReviewOpen(o => !o)}
              className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold ${theme.accentText} py-2`}
            >
              {reviewOpen ? <>Hide what you did <ChevronUp size={14} /></> : <>Look back at what you did <ChevronDown size={14} /></>}
            </button>

            {reviewOpen && (
              <div className="space-y-3 mt-1 animate-fade-in">
                {scenarios.map((s, i) => (
                  <div key={i} className={`rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-4`}>
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${theme.accentText} mb-1.5`}>
                      Scenario {i + 1}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{s.prompt}</p>
                    <div className={`rounded-lg bg-gray-50 dark:bg-gray-950 border ${theme.cardBorder} px-3 py-2`}>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Your answer</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {savedDiscovery.responses?.[i] || <span className="italic text-gray-400">(no answer saved)</span>}
                      </p>
                    </div>
                  </div>
                ))}

                <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${theme.gradient} p-4 pl-5 shadow-md`}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/80 mb-1.5 flex items-center gap-1.5">
                    <Sparkles size={12} /> Bringing it all together
                  </p>
                  <p className="text-sm text-white leading-relaxed">{savedDiscovery.explanation}</p>
                </div>

                {decisionScenario && savedDiscovery.decisionChoice && (
                  <div className={`rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-4`}>
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${theme.accentText} mb-1.5`}>
                      One more quick check
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{decisionScenario.question}</p>
                    <div className="space-y-1.5 mb-2">
                      {['A', 'B'].map(opt => {
                        const isPicked = savedDiscovery.decisionChoice === opt;
                        const label = opt === 'A' ? decisionScenario.optionA : decisionScenario.optionB;
                        return (
                          <div
                            key={opt}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                              isPicked
                                ? (savedDiscovery.decisionCorrect ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400')
                                : `${theme.cardBorder} text-gray-500 dark:text-gray-400`
                            }`}
                          >
                            <span className="font-semibold shrink-0">{opt}.</span>
                            <span className="flex-1">{label}</span>
                            {isPicked && (savedDiscovery.decisionCorrect
                              ? <CheckCircle2 size={14} className="shrink-0" />
                              : <XCircle size={14} className="shrink-0" />)}
                            {isPicked && <span className="text-[10px] font-semibold shrink-0">Your pick</span>}
                          </div>
                        );
                      })}
                    </div>
                    {savedDiscovery.decisionAnalysis && (
                      <div className={`rounded-lg bg-gray-50 dark:bg-gray-950 border ${theme.cardBorder} px-3 py-2`}>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">AI analysis</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{savedDiscovery.decisionAnalysis}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden card p-6 border-2 ${theme.border} ${theme.bg}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg ${theme.glow} ring-4 ${theme.ring}`}>
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI Discovery Learning</h3>
          <p className={`text-xs ${theme.accentText} flex items-center gap-1`}>
            Section 1 — Think it through first · <theme.icon size={12} /> {theme.label}
          </p>
        </div>
      </div>

      {loadingContent && (
        <div className={`rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-5 text-center text-sm text-gray-400 animate-pulse`}>
          Loading today's challenge...
        </div>
      )}

      {loadError && (
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900 p-5 text-center text-sm text-red-500">
          {loadError}
        </div>
      )}

      {/* Phase: step through the 3 scenarios one at a time, free text */}
      {!loadingContent && !loadError && content && phase === 'scenarios' && scenarios.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {scenarios.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= stepIndex ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gray-200 dark:bg-gray-700'
                } ${i === stepIndex ? 'w-10' : 'w-5'}`}
              />
            ))}
          </div>

          <div className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-5`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
                Scenario {stepIndex + 1} of {scenarios.length}
              </p>
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                {stepIndex + 1}
              </div>
            </div>

            {background ? (
              <div className={`relative overflow-hidden w-full rounded-lg mb-3 bg-gradient-to-br ${theme.gradient} bg-opacity-10 ${theme.bg} border ${theme.cardBorder} p-3`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.accentText} mb-1`}>Background</p>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{background}</p>
              </div>
            ) : scenarios[stepIndex].image ? (
              <img
                src={scenarios[stepIndex].image}
                alt=""
                className={`w-full max-h-48 object-contain rounded-lg mb-3 bg-white dark:bg-gray-950 border ${theme.cardBorder}`}
              />
            ) : (
              <div className={`relative overflow-hidden w-full h-32 rounded-lg mb-3 bg-gradient-to-br ${theme.gradient} bg-opacity-10 ${theme.bg} border ${theme.cardBorder} flex flex-col items-center justify-center gap-1`}>
                <theme.icon size={44} strokeWidth={1.25} className={`${theme.accentText} opacity-20 absolute`} />
                <ImageIcon size={16} strokeWidth={1.5} className={`${theme.accentText} relative`} />
                <span className={`text-[11px] font-medium tracking-wide ${theme.accentText} relative opacity-70`}>Scenario artwork goes here</span>
              </div>
            )}

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{scenarios[stepIndex].scenario}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">{scenarios[stepIndex].prompt}</p>
          </div>

          <div>
            <textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Type your response to this scenario here — there's no wrong way to start thinking about it..."
              className="w-full h-24 p-4 text-sm resize-none input"
              autoFocus
            />
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={goBack}
                disabled={stepIndex === 0}
                className="btn-secondary disabled:opacity-30"
              >
                ← Back
              </button>
              <button
                onClick={goNext}
                disabled={!currentResponse.trim()}
                className="btn-primary"
              >
                {isLastStep ? 'Submit all 3 responses' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase: the first AI call is in flight */}
      {phase === 'thinking' && (
        <div className={`rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-5 text-center text-sm text-gray-400 animate-pulse`}>
          Thinking through all three of your answers together...
        </div>
      )}

      {/* Phase: the single, consolidated explanation */}
      {phase === 'response' && (
        <div className="space-y-4 animate-fade-in">
          {thinkError && (
            <div className="space-y-3">
              <div className="rounded-xl bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900 p-5 text-center text-sm text-red-500">
                {thinkError}
              </div>
              <button onClick={submitAllResponses} className="btn-secondary w-full text-xs">
                Try again
              </button>
            </div>
          )}

          {!thinkError && explanation && (
            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${theme.gradient} p-4 pl-5 shadow-md`}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/80 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={12} /> Bringing it all together
              </p>
              <p className="text-sm text-white leading-relaxed">{explanation}</p>
            </div>
          )}

          {!thinkError && explanation && decisionScenario && (
            <button onClick={goToDecision} className="btn-primary w-full">
              One more quick check →
            </button>
          )}

          {/* No decision scenario configured for this concept/theme yet —
             fall straight through to Section 2, same as before. */}
          {!thinkError && explanation && !decisionScenario && (
            <button onClick={finishDiscovery} className="btn-primary w-full">
              <CheckCircle2 size={16} /> Continue to the Python concept
            </button>
          )}
        </div>
      )}

      {/* Phase: the single follow-up decision scenario — a real-life
         analogy, deliberately not about code, with two concrete options */}
      {phase === 'decision' && decisionScenario && (
        <div className="space-y-4 animate-fade-in">
          <div className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-5`}>
            <p className={`text-xs font-bold uppercase tracking-widest ${theme.accentText} mb-2 flex items-center gap-1.5`}>
              <Split size={12} /> One more scenario
            </p>

            {decisionScenario.image ? (
              <img
                src={decisionScenario.image}
                alt=""
                className={`w-full max-h-48 object-contain rounded-lg mb-3 bg-white dark:bg-gray-950 border ${theme.cardBorder}`}
              />
            ) : (
              <div className={`relative overflow-hidden w-full h-28 rounded-lg mb-3 bg-gradient-to-br ${theme.gradient} bg-opacity-10 ${theme.bg} border ${theme.cardBorder} flex items-center justify-center`}>
                <theme.icon size={40} strokeWidth={1.25} className={`${theme.accentText} opacity-30`} />
              </div>
            )}

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{decisionScenario.scenario}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">{decisionScenario.question}</p>
          </div>

          <div className="space-y-2.5">
            {['A', 'B'].map((opt) => {
              const label = opt === 'A' ? decisionScenario.optionA : decisionScenario.optionB;
              const selected = decisionChoice === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setDecisionChoice(opt)}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all flex items-start gap-3 ${
                    selected
                      ? `${theme.border} ${theme.bg} shadow-sm`
                      : `${theme.cardBorder} bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600`
                  }`}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      selected
                        ? `bg-gradient-to-br ${theme.gradient} text-white`
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {opt}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">{label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={submitDecision}
            disabled={!decisionChoice}
            className="btn-primary w-full"
          >
            Submit my answer
          </button>
        </div>
      )}

      {/* Phase: the second AI call is in flight */}
      {phase === 'decision_thinking' && (
        <div className={`rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-5 text-center text-sm text-gray-400 animate-pulse`}>
          Checking your answer...
        </div>
      )}

      {/* Phase: the decision-scenario analysis */}
      {phase === 'decision_result' && (
        <div className="space-y-4 animate-fade-in">
          {decisionError && (
            <div className="space-y-3">
              <div className="rounded-xl bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900 p-5 text-center text-sm text-red-500">
                {decisionError}
              </div>
              <button onClick={submitDecision} className="btn-secondary w-full text-xs">
                Try again
              </button>
            </div>
          )}

          {!decisionError && decisionResult && (
            <div className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-4 pl-5`}>
              <div className={`absolute top-0 left-0 bottom-0 w-1 ${decisionResult.correct ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5 ${
                decisionResult.correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {decisionResult.correct ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                {decisionResult.correct ? 'Correct' : 'Not quite'}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{decisionResult.analysis}</p>
            </div>
          )}

          {!decisionError && decisionResult && (
            <button onClick={finishDiscovery} className="btn-primary w-full">
              <CheckCircle2 size={16} /> Continue to the Python concept
            </button>
          )}
        </div>
      )}
    </div>
  );
}
