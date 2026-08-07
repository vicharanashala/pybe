// Lightweight procedural sound engine built on the Web Audio API.
// Generates all ant/colony sound effects synthetically — no audio assets
// required. Sounds are short, intentional, and non-blocking. A mute toggle
// is respected globally.

type SfxName =
  | 'dig'
  | 'chamber'
  | 'signal'
  | 'brigade'
  | 'egg'
  | 'vent'
  | 'click'
  | 'correct'
  | 'wrong'
  | 'reveal'
  | 'levelup'
  | 'transition';

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'sine',
  gain = 0.08,
  freqEnd?: number,
) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), start + dur);
  }
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

function noise(ac: AudioContext, start: number, dur: number, gain = 0.05, hp = 800) {
  const frames = Math.floor(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = hp;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(ac.destination);
  src.start(start);
  src.stop(start + dur);
}

export function playSfx(name: SfxName) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  switch (name) {
    case 'dig':
      noise(ac, t, 0.18, 0.05, 1200);
      tone(ac, 90, t, 0.18, 'square', 0.04, 60);
      break;
    case 'chamber':
      noise(ac, t, 0.3, 0.06, 700);
      tone(ac, 140, t, 0.3, 'sine', 0.05, 90);
      break;
    case 'signal':
      tone(ac, 660, t, 0.12, 'triangle', 0.06);
      tone(ac, 880, t + 0.14, 0.12, 'triangle', 0.05);
      break;
    case 'brigade':
      for (let i = 0; i < 4; i++) tone(ac, 300 + i * 60, t + i * 0.08, 0.1, 'square', 0.04);
      break;
    case 'egg':
      tone(ac, 520, t, 0.1, 'sine', 0.06);
      tone(ac, 700, t + 0.1, 0.12, 'sine', 0.05);
      break;
    case 'vent':
      noise(ac, t, 0.5, 0.04, 400);
      break;
    case 'click':
      tone(ac, 440, t, 0.05, 'sine', 0.05);
      break;
    case 'correct':
      tone(ac, 523, t, 0.12, 'sine', 0.07);
      tone(ac, 659, t + 0.1, 0.12, 'sine', 0.07);
      tone(ac, 784, t + 0.2, 0.18, 'sine', 0.07);
      break;
    case 'wrong':
      tone(ac, 220, t, 0.18, 'sawtooth', 0.06, 160);
      break;
    case 'reveal':
      tone(ac, 392, t, 0.2, 'sine', 0.07);
      tone(ac, 523, t + 0.18, 0.2, 'sine', 0.07);
      tone(ac, 659, t + 0.36, 0.2, 'sine', 0.07);
      tone(ac, 784, t + 0.54, 0.3, 'sine', 0.08);
      break;
    case 'levelup':
      for (let i = 0; i < 5; i++) tone(ac, 440 * Math.pow(1.12, i), t + i * 0.07, 0.12, 'triangle', 0.06);
      break;
    case 'transition':
      tone(ac, 330, t, 0.2, 'sine', 0.04, 550);
      break;
  }
}

/** Resume the audio context after a user gesture (browsers suspend it by default). */
export function unlockAudio() {
  const ac = getCtx();
  if (ac && ac.state === 'suspended') void ac.resume();
}
