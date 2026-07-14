/**
 * FakeVoiceInput — a controllable test double for VoiceInput.
 *
 * Used by adapter tests and Phase-5 integration tests.
 */
import type { VoiceInput, VoiceTranscriptEvent } from './VoiceInput.ts';

export class FakeVoiceInput implements VoiceInput {
  private _supported: boolean;
  public starts = 0;
  public stops = 0;
  public autoFire: VoiceTranscriptEvent | null = null;
  /** Optional synchronous error to fire on start. */
  public autoError: Error | null = null;
  private listeners: {
    onText: (e: VoiceTranscriptEvent) => void;
    onError: (e: Error) => void;
    onEnd: () => void;
  } | null = null;

  constructor(supported: boolean) {
    this._supported = supported;
  }

  isSupported(): boolean {
    return this._supported;
  }

  start(
    onText: (e: VoiceTranscriptEvent) => void,
    onError: (e: Error) => void,
    onEnd: () => void,
  ): () => void {
    this.starts += 1;
    this.listeners = { onText, onError, onEnd };
    if (this.autoError) {
      onError(this.autoError);
    }
    if (this.autoFire) {
      Promise.resolve().then(() => onText(this.autoFire!));
    }
    return () => {
      this.stops += 1;
      this.listeners = null;
    };
  }

  /** Test helper: simulate the browser firing onEnd without stop being called. */
  fireEnd(): void {
    this.listeners?.onEnd();
  }

  /**
   * Test helper: simulate a single utterance the way Chrome's Web
   * Speech API actually does — first an `isFinal=false` interim
   * result, then an `isFinal=true` final result for the same audio.
   * Tests use this to assert that the panel does not duplicate the
   * word.
   */
  fireUtterance(text: string): void {
    if (!this.listeners) return;
    this.listeners.onText({ text, isFinal: false });
    this.listeners.onText({ text, isFinal: true });
  }
}