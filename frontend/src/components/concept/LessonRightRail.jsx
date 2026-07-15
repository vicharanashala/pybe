// src/components/concept/LessonRightRail.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bookmark, StickyNote, X, Save, List, ListOrdered, Check, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SPEEDS = [0.8, 1.0, 1.25, 1.5];

// ── Strip code symbols so TTS reads cleanly ───────────────────────────────────
// Removes code blocks, backtick spans, Python syntax characters, and any
// line-by-line breakdown sections that contain symbols.
function cleanForSpeech(raw) {
  if (!raw) return '';
  return raw
    // Remove everything after "Let's read this code" — that's the line-by-line breakdown
    .replace(/Let['']s read this code[\s\S]*/gi, '')
    // Remove markdown code fences
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline backtick spans
    .replace(/`[^`]*`/g, '')
    // Remove Python f-string markers and braces
    .replace(/f["'][^"']*["']/g, '')
    .replace(/\{[^}]*\}/g, '')
    // Remove common Python operators/symbols that TTS reads as names
    .replace(/[*#=><\-+/\\|^%@~&]/g, ' ')
    // Remove quote characters
    .replace(/["'`]/g, '')
    // Remove parentheses and brackets
    .replace(/[()[\]{}]/g, ' ')
    // Remove leftover escape sequences
    .replace(/\\n|\\t|\\r/g, ' ')
    // Collapse multiple spaces / newlines
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const colors = { success: 'border-emerald-500', info: 'border-brand-500', warning: 'border-amber-500' };
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] bg-gray-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg border-l-4 ${colors[toast.type] || colors.success} animate-fade-in`}>
      {toast.msg}
    </div>
  );
}

// ── Notes Panel (rendered inside a floating popup window, chat-style) ────────
function NotesPanel({ conceptTitle, text, onChange, onSave, onClose, saved }) {
  const areaRef = useRef(null);

  // Insert a prefix at the start of the current line
  const insertLinePrefix = (prefix) => {
    const el = areaRef.current;
    if (!el) return;
    const start    = el.selectionStart;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const newText  = text.slice(0, lineStart) + prefix + text.slice(lineStart);
    onChange(newText);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + prefix.length;
      el.selectionStart = pos;
      el.selectionEnd   = pos;
    });
  };

  const handleBullet = () => insertLinePrefix('• ');

  const handleNumbered = () => {
    const num = (text.match(/^\d+\./gm) || []).length + 1;
    insertLinePrefix(`${num}. `);
  };

  return (
    <div className="flex flex-col rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-brand-500 text-white shrink-0">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <StickyNote size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Notes</p>
          {conceptTitle && (
            <p className="text-[11px] text-brand-100 truncate">{conceptTitle}</p>
          )}
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white shrink-0">
          <X size={18} />
        </button>
      </div>

      <div className="p-4">
        {/* Toolbar — bullet and numbered only */}
        <div className="flex items-center gap-1 mb-2">
          <button
            type="button"
            onClick={handleBullet}
            title="Bullet point"
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <List size={12} /> Bullet
          </button>
          <button
            type="button"
            onClick={handleNumbered}
            title="Numbered list"
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ListOrdered size={12} /> Number
          </button>
        </div>

        <textarea
          ref={areaRef}
          autoFocus
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your notes here…&#10;&#10;Use Bullet / Number buttons to start a list item."
          className="w-full h-52 p-3 text-sm resize-y input font-normal leading-relaxed"
        />

        <button
          onClick={onSave}
          className="w-full mt-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors"
        >
          <Save size={13} /> {saved ? <><Check size={13} className="inline" /> Saved</> : 'Save notes'}
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
// Renders:
//   1. A slim right-hand rail — ONLY when there is AI-generated content to
//      narrate. The rest of the time this returns no rail at all, so the
//      module content in <main> is free to use the full width of the page.
//   2. Small floating action buttons (Bookmark / Notes) that sit above the
//      Topic Assistant chat button, so they're always reachable without
//      reserving any layout space.
//   3. A floating Notes window that opens the same way the chat popup does.
export default function LessonRightRail({ concept, disableNarrator = false, aiExplanation = '' }) {
  const { user } = useAuth();

  const [narrationText, setNarrationText] = useState('');
  const [speaking,      setSpeaking]      = useState(false);
  const [paused,        setPaused]        = useState(false);
  const [speedIdx,      setSpeedIdx]      = useState(1);

  const [bookmarked, setBookmarked] = useState(false);
  const [showNotes,  setShowNotes]  = useState(false);
  const [noteText,   setNoteText]   = useState('');
  const [noteSaved,  setNoteSaved]  = useState(false);
  const [toast,      setToast]      = useState(null);

  const toastTimer     = useRef(null);
  const noteSavedTimer = useRef(null);

  const scopeKey         = `${user?._id || 'guest'}_${concept?.slug || concept?._id}`;
  const bookmarkStoreKey = 'pybe_bookmarks';
  const noteStoreKey     = `pybe_note_${scopeKey}`;

  const showToast = useCallback((msg, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // Reset on concept change
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPaused(false);
    setShowNotes(false);
    setNarrationText('');
    try {
      const bm = JSON.parse(localStorage.getItem(bookmarkStoreKey) || '[]');
      setBookmarked(bm.includes(scopeKey));
    } catch { setBookmarked(false); }
    try { setNoteText(localStorage.getItem(noteStoreKey) || ''); }
    catch { setNoteText(''); }
    return () => window.speechSynthesis?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept?._id]);

  // Narration is built ONLY from the AI-generated explanation — no static
  // concept/scenario text is ever narrated here. Importantly, this does
  // NOT auto-play: it just makes the narration available so the rail shows
  // up with a Play button. Speech only ever starts when the learner
  // presses Play themselves.
  useEffect(() => {
    if (!aiExplanation || disableNarrator) return;
    const cleaned = cleanForSpeech(aiExplanation);
    if (!cleaned) return;
    setNarrationText(cleaned);
    // Make sure nothing from a previous explanation keeps playing.
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [aiExplanation, disableNarrator]);

  const speakFromStart = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth || !narrationText) return;
    synth.cancel();
    const utt    = new SpeechSynthesisUtterance(narrationText);
    utt.rate     = SPEEDS[speedIdx];
    utt.pitch    = 1.0;
    utt.lang     = 'en-IN';
    const voices = synth.getVoices();
    const pref   = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
                || voices.find(v => v.lang.startsWith('en'));
    if (pref) utt.voice = pref;
    utt.onstart = () => { setSpeaking(true);  setPaused(false); };
    utt.onend   = () => { setSpeaking(false); setPaused(false); };
    utt.onerror = () => { setSpeaking(false); setPaused(false); };
    synth.speak(utt);
  }, [narrationText, speedIdx]);

  // Play: resume if paused, else start fresh
  const handlePlay = () => {
    if (paused) {
      window.speechSynthesis?.resume();
      setSpeaking(true);
      setPaused(false);
    } else if (!speaking) {
      speakFromStart();
    }
  };

  // Pause: suspend mid-sentence — Play resumes from here
  const handlePause = () => {
    window.speechSynthesis?.pause();
    setSpeaking(false);
    setPaused(true);
  };

  // Replay: only this button restarts from the beginning
  const handleReplay = () => speakFromStart();

  const handleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    if (speaking || paused) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      setPaused(false);
      setTimeout(() => {
        const utt    = new SpeechSynthesisUtterance(narrationText);
        utt.rate     = SPEEDS[next];
        utt.pitch    = 1.0;
        utt.lang     = 'en-IN';
        const voices = window.speechSynthesis?.getVoices() || [];
        const pref   = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
                    || voices.find(v => v.lang.startsWith('en'));
        if (pref) utt.voice = pref;
        utt.onstart = () => { setSpeaking(true);  setPaused(false); };
        utt.onend   = () => { setSpeaking(false); setPaused(false); };
        utt.onerror = () => { setSpeaking(false); setPaused(false); };
        window.speechSynthesis?.speak(utt);
      }, 50);
    }
  };

  const toggleBookmark = () => {
    try {
      const bm  = JSON.parse(localStorage.getItem(bookmarkStoreKey) || '[]');
      const idx = bm.indexOf(scopeKey);
      if (idx > -1) { bm.splice(idx, 1); showToast('Bookmark removed', 'info'); }
      else          { bm.push(scopeKey);  showToast('Bookmarked!', 'success'); }
      localStorage.setItem(bookmarkStoreKey, JSON.stringify(bm));
      setBookmarked(idx <= -1);
    } catch { showToast('Could not save bookmark', 'warning'); }
  };

  const toggleNotes = () => setShowNotes(v => !v);
  const saveNotes   = () => {
    try { localStorage.setItem(noteStoreKey, noteText); } catch {}
    showToast('Notes saved!', 'success');
    setNoteSaved(true);
    clearTimeout(noteSavedTimer.current);
    noteSavedTimer.current = setTimeout(() => setNoteSaved(false), 2000);
  };

  // Only reserve right-side layout space when there's actually AI-generated
  // content to narrate. Otherwise the module content in <main> gets the
  // full width right up to the edge of the page.
  const showNarrationRail = !disableNarrator && !!narrationText;

  return (
    <>
      {showNarrationRail && (
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-l border-gray-100 dark:border-gray-800 px-5 py-8 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Voice Narration</p>
            <p className="text-[10px] text-gray-400 mb-1">AI explanation</p>
            {!speaking && !paused && (
              <p className="text-[10px] text-gray-400 mb-1">Press the button below to have it read aloud</p>
            )}

            {paused && (
              <p className="text-[10px] text-amber-500 mt-1 mb-1 flex items-center gap-1"><Pause size={10} /> Paused — press Play to resume</p>
            )}
            {speaking && (
              <p className="text-[10px] text-brand-500 mt-1 mb-1 animate-pulse flex items-center gap-1"><Bot size={10} /> Narrating AI explanation…</p>
            )}
            <div className="flex gap-2 mt-2">
              <button title={paused ? 'Resume' : 'Narrate'} onClick={handlePlay}
                disabled={!narrationText || speaking}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40 ${speaking ? 'bg-brand-500 border-brand-500 text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Play size={16} fill={speaking ? 'currentColor' : 'none'} />
              </button>
              <button title="Pause" onClick={handlePause} disabled={!speaking}
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40">
                <Pause size={16} />
              </button>
              <button title="Restart from beginning" onClick={handleReplay} disabled={!narrationText}
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40">
                <RotateCcw size={15} />
              </button>
              <button title="Playback speed" onClick={handleSpeed}
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center text-[11px] font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {SPEEDS[speedIdx]}x
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ── Floating Bookmark button — sits above the Topic Assistant button ── */}
      <button
        onClick={toggleBookmark}
        title="Bookmark this lesson"
        className={`fixed bottom-6 right-[168px] z-40 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
          bookmarked ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:scale-110'
        }`}
      >
        <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
      </button>

      {/* ── Floating Notes button — opens a chat-style popup window ─────────── */}
      <button
        onClick={toggleNotes}
        title="Notes"
        className={`fixed bottom-6 right-24 z-40 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
          showNotes ? 'bg-gray-700 dark:bg-gray-800 text-white scale-95' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:scale-110'
        }`}
      >
        <StickyNote size={18} />
      </button>

      {showNotes && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[90vw] max-h-[70vh] overflow-y-auto custom-scrollbar">
          <NotesPanel
            conceptTitle={concept?.title}
            text={noteText}
            onChange={(v) => { setNoteText(v); setNoteSaved(false); }}
            onSave={saveNotes}
            onClose={() => setShowNotes(false)}
            saved={noteSaved}
          />
        </div>
      )}

      <Toast toast={toast} />
    </>
  );
}
