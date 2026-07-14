import { useState, useEffect } from 'react';
import { Puzzle, CheckCircle2, XCircle, Code2, Lightbulb } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getThemeMeta } from '../../utils/themeStyles';

const BLANK_TOKEN = '____';

// Splits "a ____ b" into ['a ', 'b'] around the blank token so the blank
// slot can be rendered inline between the two text halves.
function splitAtBlank(text) {
  const idx = text.indexOf(BLANK_TOKEN);
  if (idx === -1) return [text, ''];
  return [text.slice(0, idx), text.slice(idx + BLANK_TOKEN.length)];
}

/**
 * One drag-and-drop fill-in-the-blank exercise: a word bank of draggable
 * chips above a sentence/code line with one blank slot. Works with both
 * real HTML5 drag-and-drop (desktop) and a tap-to-place fallback (touch/
 * mobile, where dragging is unreliable) — tapping a chip when the slot is
 * empty places it; tapping a filled slot clears it back to the bank.
 */
function BlankExercise({ label, icon: Icon, data, placed, onPlace, onClear, checked, isCorrect, hint, mono }) {
  const [before, after] = splitAtBlank(data.text);
  const usedOption = placed;
  const availableOptions = data.options.filter(o => o !== usedOption);

  const handleDragStart = (e, option) => {
    e.dataTransfer.setData('text/plain', option);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const option = e.dataTransfer.getData('text/plain');
    if (option) onPlace(option);
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
        <Icon size={12} /> {label}
      </p>

      {/* The sentence/code line with the blank slot inline */}
      <div className={`rounded-xl border p-4 ${mono ? 'font-mono text-sm bg-gray-900 text-gray-100 border-gray-800' : 'text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'} leading-relaxed whitespace-pre-wrap`}>
        {before}
        <span
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => usedOption && !checked && onClear()}
          className={`inline-flex items-center justify-center min-w-[70px] px-2.5 py-1 mx-1 rounded-md border-2 border-dashed align-middle cursor-pointer select-none ${
            checked
              ? isCorrect
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              : usedOption
                ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                : 'border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600'
          }`}
        >
          {usedOption || '?'}
        </span>
        {after}
      </div>

      {/* Word bank */}
      {!checked && (
        <div className="flex flex-wrap gap-2">
          {availableOptions.map((opt) => (
            <div
              key={opt}
              draggable
              onDragStart={(e) => handleDragStart(e, opt)}
              onClick={() => onPlace(opt)}
              className={`cursor-grab active:cursor-grabbing select-none px-3 py-1.5 rounded-lg border text-xs font-medium bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 transition-colors ${mono ? 'font-mono' : ''}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {checked && !isCorrect && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 space-y-0.5">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Correct answer: <span className="font-semibold">{data.answer}</span>
          </p>
          {hint && <p className="text-xs text-amber-700/90 dark:text-amber-400/90">{hint}</p>}
        </div>
      )}
    </div>
  );
}

/**
 * FillBlankDragDrop — Section 3, shown right after the Section 2 visualizer
 * and before the learner can move to the next concept. Two drag-and-drop
 * fill-in-the-blank exercises: one conceptual, one a small piece of code.
 * Local check only (no AI call), unlimited retries.
 */
export default function FillBlankDragDrop({ concept, onComplete, isCompleted, blanks }) {
  const { user } = useAuth();
  const theme = getThemeMeta(user?.theme);

  const [conceptualPlaced, setConceptualPlaced] = useState(null);
  const [codePlaced, setCodePlaced] = useState(null);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState(null); // { conceptualCorrect, codeCorrect, allCorrect, correctAnswers }
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setConceptualPlaced(null);
    setCodePlaced(null);
    setChecked(false);
    setResult(null);
    setError('');
  }, [concept._id]);

  if (!blanks?.conceptual || !blanks?.code) return null;

  const bothFilled = !!conceptualPlaced && !!codePlaced;

  const submitCheck = async () => {
    if (!bothFilled || checking) return;
    setChecking(true);
    setError('');
    try {
      const res = await api.post('/discovery/blanks/check', {
        conceptId: concept._id,
        conceptualAnswer: conceptualPlaced,
        codeAnswer: codePlaced
      });
      setResult(res.data);
      setChecked(true);
    } catch (err) {
      setError('Could not check your answers right now. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const retry = () => {
    setConceptualPlaced(null);
    setCodePlaced(null);
    setChecked(false);
    setResult(null);
  };

  const finish = () => {
    if (isCompleted) return;
    onComplete();
  };

  if (isCompleted) {
    return (
      <div className={`relative overflow-hidden card p-6 border-2 ${theme.border} ${theme.bg}`}>
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg ${theme.glow} ring-4 ${theme.ring}`}>
            <Puzzle size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Fill in the Blanks</h3>
            <p className={`text-xs ${theme.accentText} font-medium`}>Section 3</p>
          </div>
          <span className="ml-auto badge-easy flex items-center gap-1">
            <CheckCircle2 size={12} /> Done
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle2 size={16} /> Section Completed
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden card p-6 border-2 ${theme.border} ${theme.bg}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg ${theme.glow} ring-4 ${theme.ring}`}>
          <Puzzle size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Fill in the Blanks</h3>
          <p className={`text-xs ${theme.accentText}`}>Section 3 — Drag the right word into each blank</p>
        </div>
      </div>

      <div className="space-y-6">
        <BlankExercise
          label="Conceptual"
          icon={Lightbulb}
          data={blanks.conceptual}
          placed={conceptualPlaced}
          onPlace={(opt) => !checked && setConceptualPlaced(opt)}
          onClear={() => setConceptualPlaced(null)}
          checked={checked}
          isCorrect={result?.conceptualCorrect}
          hint={result?.hints?.conceptual}
        />

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        <BlankExercise
          label="Code"
          icon={Code2}
          data={blanks.code}
          placed={codePlaced}
          onPlace={(opt) => !checked && setCodePlaced(opt)}
          onClear={() => setCodePlaced(null)}
          checked={checked}
          isCorrect={result?.codeCorrect}
          hint={result?.hints?.code}
          mono
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}

      {!checked && (
        <button
          onClick={submitCheck}
          disabled={!bothFilled || checking}
          className="btn-primary w-full mt-6 disabled:opacity-40"
        >
          {checking ? 'Checking...' : 'Check my answers'}
        </button>
      )}

      {checked && result && (
        <div className="mt-6 space-y-3">
          <div className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm ${
            result.allCorrect
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
          }`}>
            {result.allCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {result.allCorrect ? 'Both correct!' : 'Not quite — see the corrections above'}
          </div>

          {/* The learner can always move on from here, even with a wrong
             answer — the corrections above already showed them what
             belongs there. Retry is offered but never required. */}
          <div className="flex items-center gap-3">
            {!result.allCorrect && (
              <button onClick={retry} className="btn-secondary flex-1">
                Try again
              </button>
            )}
            <button onClick={finish} className={`btn-primary ${result.allCorrect ? 'w-full' : 'flex-1'}`}>
              <CheckCircle2 size={16} /> Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
