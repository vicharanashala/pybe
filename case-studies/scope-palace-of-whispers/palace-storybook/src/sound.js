// Gentle sounds, made in the browser (no audio files). Off by default.

let enabled = false;
let audio = null;

export function isSoundOn() {
  return enabled;
}

export function setSound(on) {
  enabled = on;
  if (on && !audio) {
    try {
      audio = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      enabled = false; // no audio support: stay silent
    }
  }
}

function note(freq, start, length, volume = 0.06) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(audio.destination);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

/** A soft two-note chime for discoveries. */
export function chime() {
  if (!enabled || !audio) return;
  const t = audio.currentTime;
  note(880, t, 0.6);
  note(1318.5, t + 0.12, 0.8, 0.045);
}

/** A tiny rising sparkle for turning a page. */
export function pageTurn() {
  if (!enabled || !audio) return;
  const t = audio.currentTime;
  [660, 880, 990].forEach((f, i) => note(f, t + i * 0.07, 0.35, 0.03));
}
