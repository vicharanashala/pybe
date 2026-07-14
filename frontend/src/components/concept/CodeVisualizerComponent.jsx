import { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getThemeMeta } from '../../utils/themeStyles';
import { ThemedExampleVisualizer } from '../../pytutor/PythonPracticeWidget';

/**
 * CodeVisualizerComponent — AI-Powered Python Discovery Learning, part 2.
 *
 * Workflow implemented here:
 *   - Python concept introduction
 *   - A worked Python example, told through the learner's own theme (a
 *     different example.code/explanation per theme, not one example shared
 *     by everyone) — pre-filled and editable, not a test to pass.
 *   - "Visualize" only (no Run, no pass/fail checking). The learner can
 *     step through execution as many times as they like — as soon as
 *     they've visualized once, a "Proceed to next module" button appears
 *     so they can move on whenever THEY decide they're ready.
 *
 * Runs entirely client-side via Pyodide (WebAssembly) in a Web Worker —
 * there is no second backend involved, just the existing Node API for the
 * concept intro/example content above.
 *
 * Props: concept, onComplete, isCompleted — same signature as the component
 * it replaces, so ConceptPage requires no changes beyond the import.
 */
export default function CodeVisualizerComponent({ concept, onComplete, isCompleted }) {
  const { user } = useAuth();
  const theme = getThemeMeta(user?.theme);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Which syntax-breakdown lines are expanded — collapsed by default,
  // each one toggles independently on click.
  const [openLines, setOpenLines] = useState(new Set());
  const toggleLine = (i) => {
    setOpenLines(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  useEffect(() => {
    if (isCompleted) return; // already done — no need to fetch anything, just show the compact summary below
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const res = await api.get(`/discovery/${concept._id}`);
        if (!cancelled) setContent(res.data);
      } catch (err) {
        if (!cancelled) setLoadError('Could not load the Python concept for this lesson.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [concept._id, isCompleted]);

  // Collapses immediately the moment Section 2 is marked complete — this is
  // what makes "Continue" actually feel like moving on to the next module
  // instead of leaving a full section sitting there above the new one.
  if (isCompleted) {
    return (
      <div className={`relative overflow-hidden card p-6 border-2 ${theme.border} ${theme.bg}`}>
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md ${theme.glow}`}>
            <Terminal size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Python Concept &amp; Practice</h3>
            <p className={`text-xs ${theme.accentText}`}>Section 2</p>
          </div>
          <span className="ml-auto badge-easy flex items-center gap-1"><CheckCircle2 size={12} /> Done</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden card p-6 border-2 ${theme.border} ${theme.bg}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md ${theme.glow}`}>
          <Terminal size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Python Concept &amp; Practice</h3>
          <p className={`text-xs ${theme.accentText}`}>Section 2 — Now make it real</p>
        </div>
      </div>

      {loading && (
        <div className={`rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-5 text-center text-sm text-gray-400 animate-pulse`}>
          Loading the concept and example...
        </div>
      )}

      {loadError && (
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900 p-5 text-center text-sm text-red-500">
          {loadError}
        </div>
      )}

      {!loading && !loadError && content && (
        <div className="space-y-4 animate-fade-in">
          {/* Python concept introduction */}
          <div className={`rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-5`}>
            <p className={`text-xs font-bold uppercase tracking-widest ${theme.accentText} mb-2`}>The Python concept</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{content.conceptIntro}</p>
          </div>

          {/* Worked example, told through this learner's theme */}
          <div className={`rounded-xl bg-white border ${theme.cardBorder} overflow-hidden shadow-sm`}>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              <span className="ml-2 text-xs text-gray-400 font-mono flex items-center gap-1">
                <theme.icon size={11} /> example.py
              </span>
            </div>
            <pre className="p-4 text-xs sm:text-sm text-emerald-700 font-mono overflow-x-auto whitespace-pre-wrap">
              {content.example.code}
            </pre>
          </div>

          {/* Line-by-line syntax walkthrough — every keyword, punctuation
             mark, quote, and operator gets its own plain-English point.
             Each line is its own dropdown, collapsed by default — click a
             line to open just that line's explanation. Authored content
             from the database (example.syntaxBreakdown), not generated at
             request time. Falls back to the short one-line explanation
             for any theme/concept that doesn't have a breakdown yet. */}
          <div className={`rounded-xl bg-white dark:bg-gray-900 border ${theme.cardBorder} p-5`}>
            {content.example.syntaxBreakdown && content.example.syntaxBreakdown.length > 0 ? (
              <>
                <p className={`text-xs font-bold uppercase tracking-widest ${theme.accentText} mb-3`}>
                  What every line is actually doing
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">
                  Click a line to see what it's doing.
                </p>
                <div className="space-y-2">
                  {content.example.syntaxBreakdown.map((line, i) => {
                    const isOpen = openLines.has(i);
                    return (
                      <div key={i} className={`rounded-lg border ${theme.cardBorder} overflow-hidden`}>
                        <button
                          type="button"
                          onClick={() => toggleLine(i)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
                        >
                          <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
                            {line.code}
                          </pre>
                          <ChevronDown
                            size={15}
                            className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isOpen && (
                          <ul className="px-4 py-3 space-y-1.5 animate-fade-in">
                            {line.points.map((point, j) => (
                              <li key={j} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                <span className={`shrink-0 ${theme.accentText}`}>•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
                {content.example.explanation && (
                  <p className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 leading-relaxed">
                    {content.example.explanation}
                  </p>
                )}
              </>
            ) : (
              content.example.explanation && (
                <p className="text-xs text-gray-500 leading-relaxed">{content.example.explanation}</p>
              )
            )}
          </div>

          {/* Visualize-only practice — no Run, no test, unlimited use.
             Proceed appears the moment the learner has visualized once. */}
          <ThemedExampleVisualizer
            code={content.example.code}
            onComplete={onComplete}
            isCompleted={isCompleted}
          />
        </div>
      )}
    </div>
  );
}
