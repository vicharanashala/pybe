/**
 * VoiceInput abstraction (INV-A5 — DIP).
 *
 * The ReasoningPanel depends on this interface, never on the Web Speech
 * API directly. Tests inject a FakeVoiceInput; production uses
 * SpeechRecognitionAdapter; Safari / older browsers fall back to
 * NoopVoiceInput.
 */
export interface VoiceTranscriptEvent {
  text: string;
  isFinal: boolean;
}

export interface VoiceInput {
  isSupported(): boolean;
  /**
   * Start a recognition session. Returns a stop function. The
   * implementation calls `onText` for each interim/final chunk and
   * `onError` for any failure.
   */
  start(
    onText: (event: VoiceTranscriptEvent) => void,
    onError: (err: Error) => void,
    onEnd: () => void,
  ): () => void;
}

export class NoopVoiceInput implements VoiceInput {
  isSupported(): boolean {
    return false;
  }
  start(): () => void {
    return () => undefined;
  }
}