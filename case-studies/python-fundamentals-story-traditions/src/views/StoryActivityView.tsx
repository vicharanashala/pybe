import React, { useState, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';
import { getTopic } from '../data/curriculum';
import { ManuscriptCard } from '../components/Ornaments';
import { ArrowRight, Lightbulb, Sparkles, CheckCircle2, GripVertical, MessageCircle } from 'lucide-react';
import type { ActivityDragItem, ActivityTarget } from '../data/curriculum';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const StoryActivityView: React.FC = () => {
  const { activeTopicId, nextStep } = useProgress();
  const topic = getTopic(activeTopicId);
  const activity = topic.activity;

  const [shuffledItems] = useState<ActivityDragItem[]>(() => shuffleArray(activity.items));
  const [shuffledTargets] = useState<ActivityTarget[]>(() => activity.type === 'match-pairs' ? shuffleArray(activity.targets) : shuffleArray(activity.targets));

  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);

  // drag-labels state
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // click-order state
  const [clickedItems, setClickedItems] = useState<string[]>([]);

  // gate-check state
  const [gateAnswers, setGateAnswers] = useState<Record<string, boolean | null>>({});

  // repeat-click state
  const [repeatCount, setRepeatCount] = useState(0);

  // arrange-order state
  const [arrangedSlots, setArrangedSlots] = useState<Record<string, string>>({});
  const [dragArrangeItem, setDragArrangeItem] = useState<string | null>(null);

  // match-pairs state
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [dragMatchItem, setDragMatchItem] = useState<string | null>(null);

  const checkDragCompletion = useCallback((newAssignments: Record<string, string>) => {
    const allCorrect = activity.targets.every(
      (t) => newAssignments[t.id] === t.correctItemId
    );
    if (allCorrect && activity.targets.length > 0) setCompleted(true);
  }, [activity]);

  const checkArrangeCompletion = useCallback((newArranged: Record<string, string>) => {
    const allCorrect = activity.targets.every(
      (t) => newArranged[t.id] === t.correctItemId
    );
    if (allCorrect && activity.targets.length > 0) setCompleted(true);
  }, [activity]);

  const checkMatchCompletion = useCallback((newMatch: Record<string, string>) => {
    const allCorrect = activity.targets.every(
      (t) => newMatch[t.id] === t.correctItemId
    );
    if (allCorrect && activity.targets.length > 0) setCompleted(true);
  }, [activity]);

  const handleDragStart = (itemId: string) => setDraggedItem(itemId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (targetId: string) => {
    if (draggedItem) {
      const newAssignments = { ...assignments, [targetId]: draggedItem };
      setAssignments(newAssignments);
      setDraggedItem(null);
      checkDragCompletion(newAssignments);
    }
  };

  const handleArrangeDragStart = (itemId: string) => setDragArrangeItem(itemId);
  const handleArrangeDrop = (targetId: string) => {
    if (dragArrangeItem) {
      const newArranged = { ...arrangedSlots, [targetId]: dragArrangeItem };
      setArrangedSlots(newArranged);
      setDragArrangeItem(null);
      checkArrangeCompletion(newArranged);
    }
  };

  const handleMatchDragStart = (itemId: string) => setDragMatchItem(itemId);
  const handleMatchDrop = (targetId: string) => {
    if (dragMatchItem) {
      const newMatch = { ...matchAnswers, [targetId]: dragMatchItem };
      setMatchAnswers(newMatch);
      setDragMatchItem(null);
      checkMatchCompletion(newMatch);
    }
  };

  const isItemUsed = (itemId: string, assignments: Record<string, string>) =>
    Object.values(assignments).includes(itemId);

  const renderDragLabels = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {shuffledItems.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            className={`p-3 rounded-lg border-2 border-dashed cursor-grab active:cursor-grabbing transition-all text-center font-serif text-sm
              ${isItemUsed(item.id, assignments)
                ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-50'
                : 'border-royal-gold/40 bg-royal-gold/5 text-royal-indigo dark:text-royal-gold hover:border-royal-gold hover:bg-royal-gold/10'
              }`}
          >
            <GripVertical className="w-3 h-3 mx-auto mb-1 opacity-40" />
            {item.label}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {shuffledTargets.map((target) => {
          const assignedItem = assignments[target.id];
          const assignedLabel = assignedItem ? shuffledItems.find((i) => i.id === assignedItem)?.label : null;
          const isCorrect = assignedItem === target.correctItemId;
          return (
            <div
              key={target.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(target.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                assignedItem
                  ? isCorrect
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-parchment-border dark:border-parchment-darkBorder border-dashed hover:border-royal-gold/40'
              }`}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{target.label}</p>
              {assignedLabel ? (
                <p className={`font-serif font-bold text-sm ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {assignedLabel} {isCorrect ? '✓' : '✗'}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">Drop here...</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderClickOrder = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {shuffledItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (!clickedItems.includes(item.id)) {
                const newClicked = [...clickedItems, item.id];
                setClickedItems(newClicked);
                if (newClicked.length === shuffledItems.length) {
                  const hasValidSequence = shuffledTargets.length <= shuffledItems.length &&
                    shuffledTargets.every(t => t.correctItemId && shuffledItems.some(i => i.id === t.correctItemId));
                  if (hasValidSequence) {
                    const orderCorrect = newClicked.slice(0, shuffledTargets.length).every(
                      (clickedId, idx) => clickedId === shuffledTargets[idx].correctItemId
                    );
                    if (orderCorrect) setCompleted(true);
                  } else {
                    setCompleted(true);
                  }
                }
              }
            }}
            className={`p-4 rounded-xl border-2 transition-all font-serif text-sm ${
              clickedItems.includes(item.id)
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'border-parchment-border dark:border-parchment-darkBorder hover:border-royal-gold/40'
            }`}
          >
            {item.label}
            {clickedItems.includes(item.id) && <span className="ml-2">✓</span>}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {shuffledTargets.map((target, idx) => (
          <div key={target.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/30 dark:bg-gray-800/30 border border-parchment-border dark:border-parchment-darkBorder">
            <span className="w-6 h-6 rounded-full bg-royal-gold/10 flex items-center justify-center text-[10px] font-bold text-royal-gold">{idx + 1}</span>
            <span className="text-sm font-serif text-gray-700 dark:text-gray-300">{target.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGateCheck = () => (
    <div className="space-y-4">
      {shuffledItems.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-parchment-border dark:border-parchment-darkBorder bg-white/30 dark:bg-gray-800/30">
          <div>
            <p className="font-serif font-bold text-sm text-royal-indigo dark:text-white">{item.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {gateAnswers[item.id] !== null && gateAnswers[item.id] !== undefined
                ? gateAnswers[item.id] === item.isAllowed ? 'Correct!' : 'Wrong!'
                : 'Decide: Allow or Block?'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setGateAnswers((prev) => {
                  const next = { ...prev, [item.id]: true };
                  const allAnswered = shuffledItems.every((it) => next[it.id] !== null && next[it.id] !== undefined);
                  if (allAnswered) {
                    const allCorrect = shuffledItems.every((it) => next[it.id] === it.isAllowed);
                    if (allCorrect) setTimeout(() => setCompleted(true), 0);
                  }
                  return next;
                });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                gateAnswers[item.id] === true
                  ? item.isAllowed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
              }`}
            >
              Allow
            </button>
            <button
              onClick={() => {
                setGateAnswers((prev) => {
                  const next = { ...prev, [item.id]: false };
                  const allAnswered = shuffledItems.every((it) => next[it.id] !== null && next[it.id] !== undefined);
                  if (allAnswered) {
                    const allCorrect = shuffledItems.every((it) => next[it.id] === it.isAllowed);
                    if (allCorrect) setTimeout(() => setCompleted(true), 0);
                  }
                  return next;
                });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                gateAnswers[item.id] === false
                  ? !item.isAllowed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200'
              }`}
            >
              Block
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRepeatClick = () => (
    <div className="text-center space-y-6">
      <div className="relative">
        <button
          onClick={() => {
            const newCount = repeatCount + 1;
            setRepeatCount(newCount);
            if (activity.repeatTarget && newCount >= activity.repeatTarget) setCompleted(true);
          }}
          disabled={completed}
          className="w-32 h-32 mx-auto rounded-full bg-royal-gold/10 border-4 border-royal-gold/30 flex items-center justify-center text-4xl hover:bg-royal-gold/20 hover:border-royal-gold/50 transition-all active:scale-95 disabled:opacity-50"
        >
          {activity.items[0]?.label === 'Temple Bell' ? '🔔' : activity.items[0]?.label === 'Stone' ? '🪨' : '🥥'}
        </button>
        {repeatCount > 0 && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-royal-crimson text-white flex items-center justify-center text-sm font-bold animate-bounce">
            {repeatCount}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-serif font-bold text-royal-indigo dark:text-white">
          {repeatCount} / {activity.repeatTarget}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.repeatAction}</p>
      </div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-royal-gold to-royal-crimson rounded-full transition-all duration-300"
          style={{ width: `${Math.min((repeatCount / (activity.repeatTarget || 1)) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  const renderArrangeOrder = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {shuffledItems.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleArrangeDragStart(item.id)}
            className={`p-3 rounded-lg border-2 border-dashed cursor-grab active:cursor-grabbing transition-all text-center font-serif text-sm
              ${isItemUsed(item.id, arrangedSlots)
                ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-50'
                : 'border-royal-gold/40 bg-royal-gold/5 text-royal-indigo dark:text-royal-gold hover:border-royal-gold hover:bg-royal-gold/10'
              }`}
          >
            <GripVertical className="w-3 h-3 mx-auto mb-1 opacity-40" />
            {item.label}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {shuffledTargets.map((target) => {
          const arrangedItem = arrangedSlots[target.id];
          const arrangedLabel = arrangedItem ? shuffledItems.find((i) => i.id === arrangedItem)?.label : null;
          const isCorrect = arrangedItem === target.correctItemId;
          return (
            <div
              key={target.id}
              onDragOver={handleDragOver}
              onDrop={() => handleArrangeDrop(target.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                arrangedItem
                  ? isCorrect
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-parchment-border dark:border-parchment-darkBorder border-dashed hover:border-royal-gold/40'
              }`}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{target.label}</p>
              {arrangedLabel ? (
                <p className={`font-serif font-bold text-sm ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {arrangedLabel} {isCorrect ? '✓' : '✗'}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">Drop here...</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMatchPairs = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {shuffledItems.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleMatchDragStart(item.id)}
            className={`p-3 rounded-lg border-2 border-dashed cursor-grab active:cursor-grabbing transition-all text-center font-serif text-sm
              ${isItemUsed(item.id, matchAnswers)
                ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-50'
                : 'border-royal-gold/40 bg-royal-gold/5 text-royal-indigo dark:text-royal-gold hover:border-royal-gold hover:bg-royal-gold/10'
              }`}
          >
            <GripVertical className="w-3 h-3 mx-auto mb-1 opacity-40" />
            {item.label}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {shuffledTargets.map((target) => {
          const matchItem = matchAnswers[target.id];
          const matchLabel = matchItem ? shuffledItems.find((i) => i.id === matchItem)?.label : null;
          const isCorrect = matchItem === target.correctItemId;
          return (
            <div
              key={target.id}
              onDragOver={handleDragOver}
              onDrop={() => handleMatchDrop(target.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                matchItem
                  ? isCorrect
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-parchment-border dark:border-parchment-darkBorder border-dashed hover:border-royal-gold/40'
              }`}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{target.label}</p>
              {matchLabel ? (
                <p className={`font-serif font-bold text-sm ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {matchLabel} {isCorrect ? '✓' : '✗'}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">Drop here...</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderActivity = () => {
    switch (activity.type) {
      case 'drag-labels': return renderDragLabels();
      case 'click-order': return renderClickOrder();
      case 'gate-check': return renderGateCheck();
      case 'repeat-click': return renderRepeatClick();
      case 'arrange-order': return renderArrangeOrder();
      case 'match-pairs': return renderMatchPairs();
      default: return renderDragLabels();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-3xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-royal-gold/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-royal-gold" />
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-royal-indigo dark:text-white">
            {activity.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{activity.goal}</p>
        </div>

        <div className="bg-royal-indigo/5 dark:bg-royal-gold/5 rounded-xl p-4 mb-6 border border-royal-gold/20">
          <p className="text-xs font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-1">Instructions</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{activity.instructions}</p>
        </div>

        <div className="mb-6">
          {renderActivity()}
        </div>

        {showHint && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-6 border border-yellow-200 dark:border-yellow-700/30">
            <p className="text-xs font-serif font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider mb-1">Hint</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-300">{activity.hint}</p>
          </div>
        )}

        {completed && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-700/30 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-sm font-serif font-bold text-green-700 dark:text-green-400">Activity Complete!</p>
            </div>
            <p className="text-sm text-green-600 dark:text-green-300">{activity.completionMessage}</p>
          </div>
        )}

        {completed && !reflectionSubmitted && (
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 mb-6 border border-parchment-border dark:border-parchment-darkBorder animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-royal-gold" />
              <p className="text-xs font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider">What did you notice?</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Take a moment to reflect on the activity before moving on.</p>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="What surprised you? Can you explain the idea in your own words?"
              className="w-full p-3 rounded-lg border border-parchment-border dark:border-parchment-darkBorder bg-white/60 dark:bg-parchment-dark/40 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-royal-gold/40"
              rows={3}
              aria-label="Reflection on the activity"
            />
            <button
              onClick={() => setReflectionSubmitted(true)}
              className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-royal-gold/10 text-royal-gold border border-royal-gold/30 hover:bg-royal-gold/20 transition-all"
            >
              Continue
            </button>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-700/30">
          <p className="text-xs font-serif font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Connection to Python</p>
          <p className="text-sm text-blue-600 dark:text-blue-300 font-mono">{activity.pythonConnection}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          {!showHint && !completed && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-parchment-light dark:bg-parchment-darkCard border border-parchment-border dark:border-parchment-darkBorder text-gray-600 dark:text-gray-300 font-semibold rounded-xl transition-all hover:border-yellow-400"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Show Hint</span>
            </button>
          )}
          <button
            onClick={nextStep}
            disabled={!completed || !reflectionSubmitted}
            className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-md ml-auto ${
              completed && reflectionSubmitted
                ? 'bg-royal-crimson hover:bg-royal-crimsonHover text-white hover:shadow-royal-crimson/20'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};
