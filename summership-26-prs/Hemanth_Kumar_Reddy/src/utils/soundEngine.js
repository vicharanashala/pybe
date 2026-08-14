// 🔊 Web Audio API Synthesizer Sound Engine for PyBe: Treasure Kingdom

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  initContext() {
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

  toggleSound() {
    this.isMuted = !this.isMuted;
    return !this.isMuted;
  }

  playTone(freq, type = 'sine', duration = 0.15, startVol = 0.15) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone play error:', e);
    }
  }

  playPageTurn() {
    this.playTone(320, 'sine', 0.08, 0.1);
  }

  playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    this.playTone(523.25, 'triangle', 0.12, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.18, 0.2), 80); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.25), 160); // G5
  }

  playIncorrect() {
    if (this.isMuted) return;
    this.initContext();
    this.playTone(220, 'sawtooth', 0.15, 0.2); // A3
    setTimeout(() => this.playTone(185, 'sawtooth', 0.25, 0.2), 100); // F#3
  }

  playWaterDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Water drop sound error:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
