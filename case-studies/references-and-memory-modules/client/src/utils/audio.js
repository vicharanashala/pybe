// Web Audio API Synthesizer for tactile feedback
export const unlockAudio = () => {
  if (!window.audioCtx) {
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (window.audioCtx.state === 'suspended') {
    window.audioCtx.resume();
  }
  return window.audioCtx;
};

const getAudioCtx = unlockAudio;

export const playThud = () => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    // Audible heavy thud
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Audio play failed:", e);
  }
};

export const playCrash = () => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    // Harsh digital crash noise
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio play failed:", e);
  }
};

export const playSweep = () => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Cheerful sweeping high-pitched sound for GC
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.error("Audio play failed:", e);
  }
};

export const playPop = () => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Light pop for a pointer/sticky note
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio play failed:", e);
  }
};

export const playSlideTransition = (direction = 'next') => {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    
    // Smooth aerodynamic whoosh sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    if (direction === 'next') {
      // Ascending sleek whoosh
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(740, t + 0.12);
      osc.frequency.exponentialRampToValueAtTime(380, t + 0.3);
    } else {
      // Descending smooth whoosh
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.14);
      osc.frequency.exponentialRampToValueAtTime(340, t + 0.3);
    }
    
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);

    // Harmonic chime accent
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(direction === 'next' ? 880 : 659.25, t + 0.04);
    chimeGain.gain.setValueAtTime(0.2, t + 0.04);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(t + 0.04);
    chime.stop(t + 0.28);
  } catch (e) {
    console.error("Audio slide transition failed:", e);
  }
};

