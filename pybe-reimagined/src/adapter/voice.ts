import type { VoiceInput } from './VoiceInput.ts';
import { NoopVoiceInput } from './VoiceInput.ts';
import { SpeechRecognitionAdapter } from './SpeechRecognitionAdapter.ts';

/**
 * Module-level VoiceInput singleton with a test seam.
 * Mirrors `runner.ts` for the Python runner. INV-A5: UI consumes only the
 * interface.
 */

let voice: VoiceInput = pickDefault();

function pickDefault(): VoiceInput {
  if (typeof window === 'undefined') return new NoopVoiceInput();
  return new SpeechRecognitionAdapter();
}

export function getVoiceInput(): VoiceInput {
  return voice;
}

export function setVoiceInputForTesting(v: VoiceInput | null): void {
  voice = v ?? pickDefault();
}