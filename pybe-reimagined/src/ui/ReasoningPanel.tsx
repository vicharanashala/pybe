import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { getVoiceInput } from '../adapter/voice.ts';
import type { VoiceInput } from '../adapter/VoiceInput.ts';
import { AutoSuggestChips } from './AutoSuggestChips.tsx';

interface Props {
  initialValue?: string;
  onSubmit: (reasoning: string) => void;
  nudgeQuestion?: string | undefined;
  /** Constructs the chips suggest. Defaults to none. */
  suggestConstructs?: readonly string[];
  /** Idle ms before chips appear (default 30 s). */
  idleThresholdMs?: number;
}

export const MIN_REASONING_CHARS = 30;
const DEFAULT_IDLE_MS = 30_000;
const IDLE_TICK_MS = 5_000;

/**
 * Middle region of the three-region layout. INV-I2.
 *
 * Phase-5 enhancements:
 * - 🎙 voice button (Phase-5 audio input). Hidden if the browser lacks
 *   SpeechRecognition. INV-I3.
 * - AutoSuggestChips appear after `idleThresholdMs` of idle OR after the
 *   first submit click (INV-PB-9: never proactively before typing).
 * - Chip click APPENDS the construct text into the textarea (does not
 *   auto-submit).
 */
export function ReasoningPanel({
  initialValue = '',
  onSubmit,
  nudgeQuestion,
  suggestConstructs = [],
  idleThresholdMs = DEFAULT_IDLE_MS,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(false);
  const [listening, setListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [lastInputAt, setLastInputAt] = useState<number>(Date.now());
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);
  const stopRef = useRef<(() => void) | null>(null);
  const voiceRef = useRef<VoiceInput>(getVoiceInput());

  const count = value.trim().length;
  const canSubmit = count >= MIN_REASONING_CHARS;

  // INV-PB-9: chips appear after idle OR after the first submit click.
  // The user must have at least started typing for the idle timer to
  // count, because we reset `lastInputAt` on every change.
  const showChips = hasAttemptedSubmit || Date.now() - lastInputAt > idleThresholdMs;

  useEffect(() => {
    setVoiceSupported(voiceRef.current.isSupported());
  }, []);

  // Idle ticker: every IDLE_TICK_MS, re-evaluate `showChips` is implicit
  // because we read Date.now() inside the JSX each render. Force a
  // re-render via a tick counter.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (showChips) return;
    const id = window.setInterval(() => setTick((n) => n + 1), IDLE_TICK_MS);
    return () => window.clearInterval(id);
  }, [showChips]);

  // Clean up voice on unmount.
  useEffect(() => {
    return () => {
      if (stopRef.current) {
        stopRef.current();
        stopRef.current = null;
      }
    };
  }, []);

  const handleChange = (next: string): void => {
    setValue(next);
    setLastInputAt(Date.now());
  };

  const handleSubmitClick = (): void => {
    setHasAttemptedSubmit(true);
    onSubmit(value);
  };

  // Trailing-interim strip: the Web Speech API fires an interim result
  // (isFinal=false) and then a final result (isFinal=true) for the same
  // audio. The current text of the textarea holds the *committed* user
  // input plus the *uncommitted* interim at the end. We track the
  // uncommitted chunk in `pendingInterimRef` so we can:
  //   - replace it when a newer interim arrives,
  //   - strip it when the matching final arrives (and only then append
  //     the final text, so the same word is never typed twice).
  const pendingInterimRef = useRef<string>('');

  const handleMicClick = (): void => {
    setVoiceError(null);
    if (listening) {
      stopRef.current?.();
      stopRef.current = null;
      setListening(false);
      return;
    }
    const stop = voiceRef.current.start(
      (event) => {
        setValue((current) => {
          let base = current;
          // Strip the uncommitted interim from the tail (if any).
          if (pendingInterimRef.current) {
            const pending = pendingInterimRef.current;
            const tailIdx = base.lastIndexOf(pending);
            if (tailIdx !== -1) {
              base =
                base.slice(0, tailIdx) +
                base.slice(tailIdx + pending.length);
              base = base.replace(/\s+$/, '');
            }
          }
          if (event.isFinal) {
            // Commit the final text. Empty final events are no-ops.
            pendingInterimRef.current = '';
            if (!event.text) return current;
            const sep = base.length === 0 ? '' : ' ';
            return `${base}${sep}${event.text}`.trim();
          }
          // Interim: remember the chunk so the next event can replace
          // or strip it.
          pendingInterimRef.current = event.text;
          if (!event.text) return base;
          const sep = base.length === 0 ? '' : ' ';
          return `${base}${sep}${event.text}`.trim();
        });
        setLastInputAt(Date.now());
      },
      (err) => {
        setVoiceError(err.message);
        setListening(false);
        stopRef.current = null;
        pendingInterimRef.current = '';
      },
      () => {
        // onEnd: Web Speech API fires onend even after stop().
        setListening(false);
        stopRef.current = null;
        pendingInterimRef.current = '';
      },
    );
    stopRef.current = stop;
    setListening(true);
  };

  const handleInsertConstruct = (construct: string): void => {
    setValue((current) => {
      const trimmed = current.replace(/\s+$/, '');
      const sep = trimmed.length === 0 ? '' : ' ';
      return `${trimmed}${sep}${construct}`;
    });
    setLastInputAt(Date.now());
  };

  return (
    <section
      data-testid="pybe-reasoning"
      aria-label="Your reasoning"
      className="pybe-card"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Your reasoning
        </span>
        <span
          className={`text-xs tabular-nums ${
            canSubmit ? 'text-emerald-600' : 'text-stone-400'
          }`}
        >
          {count} / {MIN_REASONING_CHARS}+ chars
        </span>
      </div>

      <textarea
        data-testid="pybe-reasoning-input"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          // Cmd/Ctrl+Enter submits, matching common editor conventions.
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canSubmit) {
            e.preventDefault();
            handleSubmitClick();
          }
        }}
        rows={6}
        placeholder="In your own words — what Python construct do you think would help? (⌘+Enter to submit)"
        className="w-full resize-y rounded-md border border-stone-300 bg-white p-3 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-amber-400"
      />

      {showChips && suggestConstructs.length > 0 && (
        <AutoSuggestChips
          constructs={suggestConstructs}
          onInsert={handleInsertConstruct}
        />
      )}

      {nudgeQuestion ? (
        <p
          data-testid="pybe-socratic-nudge"
          className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm italic text-amber-900"
        >
          <span className="mr-1 font-semibold not-italic">A question:</span>
          {nudgeQuestion}
        </p>
      ) : null}

      {voiceError && (
        <p
          data-testid="pybe-voice-error"
          className="mt-2 text-xs text-rose-700"
          role="alert"
        >
          Voice error: {voiceError}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        {voiceSupported ? (
          <button
            type="button"
            data-testid="pybe-voice-toggle"
            onClick={handleMicClick}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              listening
                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
            title="Audio stays on your device. Never uploaded."
            aria-pressed={listening}
          >
            {listening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
            {listening ? 'Stop listening' : 'Speak'}
          </button>
        ) : (
          <span
            data-testid="pybe-voice-unavailable"
            className="text-xs text-stone-400"
          >
            Voice input not supported in this browser.
          </span>
        )}

        <button
          data-testid="pybe-submit"
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmitClick}
          className="pybe-btn-primary disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
        >
          <Send className="h-4 w-4" />
          Submit reasoning
        </button>
      </div>
    </section>
  );
}