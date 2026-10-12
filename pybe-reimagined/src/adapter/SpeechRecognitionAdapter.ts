/**
 * SpeechRecognitionAdapter — wraps the Web Speech API.
 *
 * INV-PB-8: a first-class UX affordance.
 * INV-I3:  failure → text still works; never blocks.
 * Privacy: audio is processed by the browser's SpeechRecognition engine
 * (typically a cloud service in Chrome). Phase-9 will host a privacy note
 * link prominently.
 */

import type { VoiceInput, VoiceTranscriptEvent } from './VoiceInput.ts';

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultEntry {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResultEntry;
}

interface SpeechRecognitionErrorEventLike {
  readonly error: string;
  readonly message?: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: SpeechRecognitionResultList }) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognitionLike };
    webkitSpeechRecognition?: { new (): SpeechRecognitionLike };
  }
}

export class SpeechRecognitionAdapter implements VoiceInput {
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      (window.SpeechRecognition !== undefined ||
        window.webkitSpeechRecognition !== undefined)
    );
  }

  start(
    onText: (event: VoiceTranscriptEvent) => void,
    onError: (err: Error) => void,
    onEnd: () => void,
  ): () => void {
    if (!this.isSupported()) {
      onError(new Error('SpeechRecognition is not supported in this browser.'));
      return () => undefined;
    }
    const Ctor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      onError(new Error('No SpeechRecognition constructor available.'));
      return () => undefined;
    }

    const recognition = new Ctor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const results = event.results;
      const lastIdx = results.length - 1;
      if (lastIdx < 0) return;
      const result = results[lastIdx];
      if (!result || result.length === 0) return;
      const alt = result[0];
      if (!alt) return;
      onText({ text: alt.transcript, isFinal: result.isFinal });
    };
    recognition.onerror = (event) => {
      const message = event.message ?? event.error ?? 'Unknown speech recognition error';
      onError(new Error(message));
    };
    recognition.onend = () => {
      onEnd();
    };

    try {
      recognition.start();
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
      return () => undefined;
    }

    return () => {
      try {
        recognition.abort();
      } catch {
        /* ignore — already stopped */
      }
    };
  }
}