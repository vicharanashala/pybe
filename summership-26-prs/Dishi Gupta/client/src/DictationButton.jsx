import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

// Join two text fragments with a single separating space, unless one side
// already provides whitespace. Keeps dictated words from running together
// while never dropping or duplicating spacing.
function joinText(base, addition) {
  if (!base) return addition;
  if (/\s$/.test(base) || /^\s/.test(addition)) return `${base}${addition}`;
  return `${base} ${addition}`;
}

// Reusable Web Speech API hook. No external SDK or key — uses the browser's
// built-in SpeechRecognition, and reports `supported: false` where it is absent
// (e.g. Firefox) so callers can degrade to text-only input.
export function useVoiceDictation({ value, onChange }) {
  const Recognition =
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const supported = Boolean(Recognition);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  // `baseRef` holds the text that existed when dictation started, plus every
  // finalized chunk. Interim results are layered on top transiently, so a word
  // that is still being recognised never gets committed twice.
  const baseRef = useRef('');
  // Keep the latest value/onChange in refs so the long-lived recognition
  // callbacks always read fresh props without rebuilding the recogniser.
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!supported) return undefined;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += transcript;
        else interimChunk += transcript;
      }
      if (finalChunk) baseRef.current = joinText(baseRef.current, finalChunk.trim());
      const combined = interimChunk ? joinText(baseRef.current, interimChunk.trim()) : baseRef.current;
      onChangeRef.current(combined);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    // Clean up on unmount so no ghost listener keeps the mic open.
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try { recognition.stop(); } catch (error) { /* already stopped */ }
      recognitionRef.current = null;
    };
  }, [supported]);

  function start() {
    if (!supported || !recognitionRef.current || listening) return;
    // Snapshot whatever the learner has already typed/dictated so new speech is
    // appended to it rather than replacing it.
    baseRef.current = valueRef.current || '';
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      // start() throws if called while already active — treat as a no-op.
      setListening(false);
    }
  }

  function stop() {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch (error) { /* already stopped */ }
    setListening(false);
  }

  function toggle() {
    if (listening) stop();
    else start();
  }

  return { supported, listening, toggle };
}

// Mic button rendered beside a text field. Falls back to a plain hint when the
// browser has no speech recognition, and never blocks normal typing.
export function DictationButton({ value, onChange, label = 'Dictate' }) {
  const { supported, listening, toggle } = useVoiceDictation({ value, onChange });

  if (!supported) {
    return (
      <span className="dictation-hint" title="Speech recognition is not available in this browser. You can still type normally.">
        Voice input unavailable
      </span>
    );
  }

  return (
    <button
      type="button"
      className={listening ? 'dictation listening' : 'dictation'}
      onClick={toggle}
      aria-pressed={listening}
      title={listening ? 'Stop dictation' : 'Dictate with your voice'}
    >
      {listening ? <MicOff size={15} /> : <Mic size={15} />}
      {listening ? 'Listening…' : label}
    </button>
  );
}
