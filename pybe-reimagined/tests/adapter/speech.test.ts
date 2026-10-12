import { describe, it, expect } from 'vitest';
import { NoopVoiceInput, type VoiceInput } from '../../src/adapter/VoiceInput.ts';
import { FakeVoiceInput } from '../../src/adapter/FakeVoiceInput.ts';

describe('VoiceInput contract', () => {
  it('NoopVoiceInput reports unsupported', () => {
    const v: VoiceInput = new NoopVoiceInput();
    expect(v.isSupported()).toBe(false);
    expect(typeof v.start).toBe('function');
    // start() must return a no-op disposer.
    const stop = v.start(
      () => undefined,
      () => undefined,
      () => undefined,
    );
    expect(typeof stop).toBe('function');
    expect(stop()).toBeUndefined();
  });

  it('FakeVoiceInput: stop() is called once on teardown', () => {
    const v = new FakeVoiceInput(true);
    const stop = v.start(() => undefined, () => undefined, () => undefined);
    expect(v.starts).toBe(1);
    stop();
    expect(v.stops).toBe(1);
  });

  it('FakeVoiceInput: onText receives transcripts', async () => {
    const v = new FakeVoiceInput(true);
    v.autoFire = { text: 'hello world', isFinal: true };
    const received: string[] = [];
    v.start(
      (e) => received.push(e.text),
      () => undefined,
      () => undefined,
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(received).toEqual(['hello world']);
  });

  it('FakeVoiceInput: a contract-shaped VoiceInput', () => {
    const v: VoiceInput = new FakeVoiceInput(true);
    expect(v.isSupported()).toBe(true);
    expect(typeof v.start).toBe('function');
  });
});

describe('SpeechRecognitionAdapter.isSupported (window flags)', () => {
  it('detects window.SpeechRecognition', async () => {
    const mod = await import('../../src/adapter/SpeechRecognitionAdapter.ts');
    const adapter = new mod.SpeechRecognitionAdapter();
    const original = (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = class {};
    try {
      expect(adapter.isSupported()).toBe(true);
    } finally {
      if (original === undefined) {
        delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
      } else {
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = original;
      }
    }
  });

  it('detects window.webkitSpeechRecognition', async () => {
    const mod = await import('../../src/adapter/SpeechRecognitionAdapter.ts');
    const adapter = new mod.SpeechRecognitionAdapter();
    const original = (window as unknown as { webkitSpeechRecognition?: unknown })
      .webkitSpeechRecognition;
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition =
      class {};
    try {
      expect(adapter.isSupported()).toBe(true);
    } finally {
      if (original === undefined) {
        delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
      } else {
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition =
          original;
      }
    }
  });

  it('reports unsupported when neither flag is set', async () => {
    const mod = await import('../../src/adapter/SpeechRecognitionAdapter.ts');
    const adapter = new mod.SpeechRecognitionAdapter();
    const a = (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    const b = (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    try {
      expect(adapter.isSupported()).toBe(false);
    } finally {
      if (a !== undefined) {
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = a;
      }
      if (b !== undefined) {
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = b;
      }
    }
  });
});

describe('getVoiceInput / setVoiceInputForTesting', () => {
  it('returns the active voice input; setVoiceInputForTesting swaps it; null resets', async () => {
    const { getVoiceInput, setVoiceInputForTesting } = await import(
      '../../src/adapter/voice.ts'
    );
    expect(getVoiceInput()).toBeDefined();
    setVoiceInputForTesting(new FakeVoiceInput(true));
    expect(getVoiceInput()).toBeInstanceOf(FakeVoiceInput);
    setVoiceInputForTesting(null);
    expect(getVoiceInput()).toBeDefined();
    expect(getVoiceInput()).not.toBeInstanceOf(FakeVoiceInput);
  });
});