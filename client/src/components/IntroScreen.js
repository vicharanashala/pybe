/**
 * pyBE Intro Screen
 * ==================
 * Animated intro that plays on first load, then transitions to home.
 */

const INTRO_DURATION = 2000;
const TRANSITION_DURATION = 400;

export function showIntro(onComplete) {
  console.log('[Intro] Starting...');

  const introEl = document.createElement('div');
  introEl.id = 'intro-screen';

  // Simple inline styles for immediate visibility
  introEl.style.cssText = `
    position: fixed !important;
    inset: 0 !important;
    z-index: 99999 !important;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
  `;

  introEl.innerHTML = `
    <div style="
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    ">
      <div style="
        position: absolute;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, hsla(270, 65%, 55%, 0.6) 0%, transparent 70%);
        top: -80px;
        right: -80px;
        border-radius: 50%;
        animation: float1 6s ease-in-out infinite;
      "></div>
      <div style="
        position: absolute;
        width: 250px;
        height: 250px;
        background: radial-gradient(circle, hsla(280, 55%, 50%, 0.5) 0%, transparent 70%);
        bottom: -60px;
        left: -60px;
        border-radius: 50%;
        animation: float2 8s ease-in-out infinite;
      "></div>
      <div style="
        position: absolute;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, hsla(260, 60%, 52%, 0.55) 0%, transparent 70%);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        animation: float3 5s ease-in-out infinite;
      "></div>
    </div>
    <div style="
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 2rem;
      color: white;
      font-family: system-ui, sans-serif;
    ">
      <div style="
        width: 90px;
        height: 90px;
        margin: 0 auto 1rem;
        animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        opacity: 0;
      ">
        <svg viewBox="0 0 80 80" fill="none" style="width: 100%; height: 100%; filter: drop-shadow(0 0 15px hsla(270, 60%, 60%, 0.4));">
          <circle cx="40" cy="40" r="36" stroke="url(#lg)" stroke-width="2" stroke-dasharray="226" stroke-dashoffset="226" style="animation: draw 1.2s ease-out forwards;"/>
          <text x="24" y="46" fill="url(#lg)" font-size="22" font-weight="bold" font-family="monospace">py</text>
          <text x="44" y="46" fill="#f5a623" font-size="22" font-weight="bold" font-family="monospace">BE</text>
          <defs>
            <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#c8b8e8"/>
              <stop offset="100%" stop-color="#9888c0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 style="
        font-size: 2rem;
        font-weight: 800;
        margin: 0 0 1.5rem 0;
        letter-spacing: -0.02em;
        animation: fadeUp 0.5s ease-out 0.3s forwards;
        opacity: 0;
      ">
        py<span style="background: linear-gradient(135deg, #f5a623, #f7c948); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">BE</span>
      </h1>
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: rgba(255, 255, 255, 0.85);
      ">
        <span style="animation: fadeUp 0.4s ease-out 0.5s forwards; opacity: 0;">Philosophy</span>
        <span style="color: #f5a623; animation: fadeUp 0.3s ease-out 0.6s forwards; opacity: 0;">×</span>
        <span style="animation: fadeUp 0.4s ease-out 0.7s forwards; opacity: 0;">Python</span>
        <span style="color: #f5a623; animation: fadeUp 0.3s ease-out 0.8s forwards; opacity: 0;">×</span>
        <span style="animation: fadeUp 0.4s ease-out 0.9s forwards; opacity: 0;">Code</span>
      </div>
      <div style="
        width: 150px;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin: 0 auto 0.75rem;
        overflow: hidden;
        animation: fadeUp 0.4s ease-out 1.1s forwards;
        opacity: 0;
      ">
        <div id="intro-progress" style="
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #9888c0, #f5a623);
          border-radius: 2px;
          transition: width 1.6s ease-out;
        "></div>
      </div>
      <p style="
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.4);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin: 0;
        animation: pulse 1.5s ease-in-out 1.3s infinite;
      ">Loading experience...</p>
    </div>
    <style>
      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(20px, -30px) scale(1.1); }
      }
      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-30px, 20px) scale(1.05); }
      }
      @keyframes float3 {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.15); }
      }
      @keyframes draw {
        to { stroke-dashoffset: 0; }
      }
      @keyframes popIn {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
      }
    </style>
  `;

  document.body.appendChild(introEl);
  console.log('[Intro] Element added to body');

  // Start progress bar
  requestAnimationFrame(() => {
    const progress = document.getElementById('intro-progress');
    if (progress) {
      progress.style.width = '100%';
    }
  });

  // Handle completion
  setTimeout(() => {
    console.log('[Intro] Transitioning out...');
    introEl.style.transition = `opacity ${TRANSITION_DURATION}ms ease-out, transform ${TRANSITION_DURATION}ms ease-out`;
    introEl.style.opacity = '0';
    introEl.style.transform = 'scale(1.05)';

    setTimeout(() => {
      introEl.remove();
      console.log('[Intro] Complete');
      if (onComplete) onComplete();
    }, TRANSITION_DURATION);
  }, INTRO_DURATION);
}

export function initIntroStyles() {
  // No global styles needed - using inline styles
}