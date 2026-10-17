/**
 * soundEngine.js
 * ─────────────────────────────────────────────────────────────────
 * Lightweight, zero-dependency sound and narration engine.
 * - Web Audio API synthesizer for tactile UI clicks, celebratory chimes,
 *   bell tones, and error alerts (no external audio assets required).
 * - Web Speech API (SpeechSynthesis) for voice narration with fallback.
 * - Full mute/unmute control and volume handling.
 * ─────────────────────────────────────────────────────────────────
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.narrationEnabled = false;
    this.currentUtterance = null;
    this.speaking = false;
    this.onSpeechEndCallback = null;
  }

  initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a crisp tactile step/click
  playClick() {
    if (!this.sfxEnabled) return;
    try {
      this.initAudioContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context may be restricted before user gesture
    }
  }

  // Play pleasant positive chime
  playSuccess() {
    if (!this.sfxEnabled) return;
    try {
      this.initAudioContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch {
      // Audio fallback
    }
  }

  // Play gentle warning/exception tone
  playError() {
    if (!this.sfxEnabled) return;
    try {
      this.initAudioContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  }

  // Play celebratory festival chime (temple bells / victory fanfare)
  playCelebration() {
    if (!this.sfxEnabled) return;
    try {
      this.initAudioContext();
      if (!this.ctx) return;
      // Majestic Vijayadashami bell sequence
      const melody = [
        { f: 523.25, t: 0.0, d: 0.4 },  // C5
        { f: 659.25, t: 0.15, d: 0.4 }, // E5
        { f: 783.99, t: 0.3, d: 0.4 },  // G5
        { f: 1046.5, t: 0.45, d: 0.7 }, // C6
        { f: 880.0,  t: 0.7, d: 0.3 },  // A5
        { f: 1046.5, t: 0.9, d: 0.9 },  // C6 hold
      ];
      melody.forEach(({ f, t, d }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + t);
        gain.gain.setValueAtTime(0.14, this.ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + t + d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + t);
        osc.stop(this.ctx.currentTime + t + d);
      });
    } catch {
      // Audio fallback
    }
  }

  // SpeechSynthesis Narration
  speak(text, onStart, onEnd) {
    this.stopSpeaking();
    if (!this.narrationEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    try {
      const cleanText = text.replace(/<[^>]*>/g, '').replace(/[\r\n]+/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.96;
      utterance.pitch = 1.0;

      // Select natural sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
      ) || voices.find((v) => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => {
        this.speaking = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.speaking = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.speaking = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      this.speaking = false;
      if (onEnd) onEnd();
    }
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.speaking = false;
    this.currentUtterance = null;
  }
}

export const sound = new SoundEngine();
