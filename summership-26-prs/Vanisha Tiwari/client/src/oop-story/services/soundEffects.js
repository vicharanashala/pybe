// Web Audio API Procedural Sound Effects & Speech Synthesis for Buddy's Magic Pet Shop

let audioCtx = null;
let soundEnabled = true;
let voiceEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundService = {
  isSoundEnabled: () => soundEnabled,
  setSoundEnabled: (val) => { soundEnabled = val; },
  isVoiceEnabled: () => voiceEnabled,
  setVoiceEnabled: (val) => {
    voiceEnabled = val;
    if (!val && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  // 🐶 Cheerful Puppy Bark
  playBark: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Two quick puppy yips
    [0, 0.12].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      const startFreq = idx === 0 ? 520 : 680;
      osc.frequency.setValueAtTime(startFreq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + delay + 0.04);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.7, now + delay + 0.1);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.25, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.11);
    });
  },

  // 🔒 Capsule's Cartoon "BOING!"
  playBoing: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  },

  // ✨ Magic Wand Sparkle Chime
  playChime: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.4);
    });
  },

  // 🦴 Crunchy Snack Bite
  playCrunch: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // White noise burst for crunch
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);

    // Followed by a cute gulp sound
    setTimeout(() => {
      if (!soundEnabled) return;
      const ctx2 = getAudioContext();
      if (!ctx2) return;
      const osc = ctx2.createOscillator();
      const g2 = ctx2.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx2.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx2.currentTime + 0.1);
      g2.gain.setValueAtTime(0.2, ctx2.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.01, ctx2.currentTime + 0.1);
      osc.connect(g2);
      g2.connect(ctx2.destination);
      osc.start();
      osc.stop(ctx2.currentTime + 0.12);
    }, 90);
  },

  // 🥴 Tummy Ache Wobble
  playSadWobble: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  },

  // 🎈 Cute Pop Sound
  playPop: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  },

  // 🌟 Correct Answer / Success Sparkle
  playSuccess: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  },

  // 🏆 Grand Celebration Fanfare
  playFanfare: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chordSeq = [
      { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.18 }, // C major
      { notes: [587.33, 698.46, 880.00], time: 0.2, dur: 0.18 }, // D minor
      { notes: [659.25, 783.99, 987.77], time: 0.4, dur: 0.18 }, // E minor
      { notes: [523.25, 659.25, 783.99, 1046.50], time: 0.65, dur: 0.8 } // C high flourish
    ];

    chordSeq.forEach((step) => {
      step.notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + step.time);

        gain.gain.setValueAtTime(0, now + step.time);
        gain.gain.linearRampToValueAtTime(0.12, now + step.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + step.time + step.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + step.time);
        osc.stop(now + step.time + step.dur + 0.05);
      });
    });
  },

  // ⚡ Zippy's Speed Whoosh
  playWhoosh: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.24);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.25);
  },

  // ⚡ Electric Zap / Lightning Strike
  playZap: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  },

  // 🔥 Ember's Fiery Flame Blast
  playFlame: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.3);
  },

  // 🛡️ Shieldy's Unbreakable Energy Shield Clank
  playShieldClank: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Resonant metallic ring
    [440, 880, 1320].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  },

  // 🚀 Power-up / Inheritance Flow Chime
  playPowerUp: () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [330, 440, 550, 660, 880, 1100];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.32);
    });
  },

  // 🗣️ Kid-friendly Text-to-Speech Narration
  speakDialogue: (text, speaker = 'Luna', onEnd) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const cleanText = text.replace(/[*_#`🔒🐶👩🏫✨🦴🎾🛏️❤️⭐⚡🔥🛡️🦸🧑🏫👑💡🎉]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Character voice tuning
      if (speaker === 'Professor Nova' || speaker === 'Nova') {
        utterance.pitch = 1.1; // Scholarly, encouraging mentor
        utterance.rate = 0.98;
      } else if (speaker === 'Zippy') {
        utterance.pitch = 1.45; // Energetic, fast-talking hero
        utterance.rate = 1.18;
      } else if (speaker === 'Ember') {
        utterance.pitch = 1.25; // Warm, bold and fiery
        utterance.rate = 1.02;
      } else if (speaker === 'Shieldy') {
        utterance.pitch = 0.95; // Sturdy, deep, confident guardian
        utterance.rate = 0.92;
      } else if (speaker === 'Hero') {
        utterance.pitch = 1.05; // Noble parent class voice
        utterance.rate = 0.95;
      } else if (speaker === 'Capsule') {
        utterance.pitch = 1.4; // Cheerful, higher pitch for Capsule
        utterance.rate = 1.05;
      } else if (speaker === 'Buddy') {
        utterance.pitch = 1.3;
        utterance.rate = 1.1;
      } else {
        // Teacher Luna (Case Study 1)
        utterance.pitch = 1.15; // Warm, friendly teacher
        utterance.rate = 0.95; // Clear pacing for kids
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      if (onEnd) onEnd();
    }
  },

  stopSpeech: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};
