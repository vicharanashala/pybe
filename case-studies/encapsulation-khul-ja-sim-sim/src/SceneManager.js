import { scenes, coverScene } from './scenes.js';
import { SoundManager } from './SoundManager.js';

export class SceneManager {
  constructor(appElement) {
    this.app = appElement;
    this.currentIndex = 0; // 0 = Cover Screen, 1..8 = Story scenes
    this.canAdvance = true;
    this.dndState = { treasure: false, phrase: false };
    this.sound = new SoundManager();

    this.init();
  }

  init() {
    const particleMotes = Array.from({ length: 14 })
      .map((_, i) => `<div class="mote" style="left: ${5 + i * 7}%; --dur: ${8 + (i % 5) * 2}s; --delay: ${i * 0.6}s;"></div>`)
      .join('');

    this.app.innerHTML = `
      <div class="storybook-frame" aria-hidden="true">
        <svg class="corner top-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12V2h10M2 2l8 8M6 2v4M2 6h4"/></svg>
        <svg class="corner top-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12V2h10M2 2l8 8M6 2v4M2 6h4"/></svg>
        <svg class="corner bottom-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12V2h10M2 2l8 8M6 2v4M2 6h4"/></svg>
        <svg class="corner bottom-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12V2h10M2 2l8 8M6 2v4M2 6h4"/></svg>
      </div>
      <div class="ambient-particles" aria-hidden="true">${particleMotes}</div>
      <button class="mute-btn" id="mute-btn" title="Toggle Sound">🔊</button>
      <div id="scene-wrapper"></div>
      <div class="progress" id="progress-container"></div>
    `;

    this.wrapper = this.app.querySelector('#scene-wrapper');
    this.progressContainer = this.app.querySelector('#progress-container');
    this.muteBtn = this.app.querySelector('#mute-btn');

    this.muteBtn.addEventListener('click', () => {
      const muted = this.sound.toggleMute();
      this.muteBtn.textContent = muted ? '🔇' : '🔊';
    });

    this.renderProgressDots();
    this.renderScene(this.currentIndex);
  }

  renderProgressDots() {
    this.progressContainer.innerHTML = scenes
      .map((_, i) => `<div class="dot"></div>`)
      .join('');
    this.updateProgressDots();
  }

  updateProgressDots() {
    if (this.currentIndex === 0) {
      this.progressContainer.style.display = 'none';
      return;
    }
    this.progressContainer.style.display = 'flex';

    const pageIndex = this.currentIndex - 1; // 0 to 7
    const dots = this.progressContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'completed');
      if (i === pageIndex) {
        dot.classList.add('active');
      } else if (i < pageIndex) {
        dot.classList.add('completed');
      }
    });
  }

  renderScene(index) {
    let scene;
    if (index === 0) {
      scene = coverScene;
    } else {
      scene = scenes[index - 1];
    }

    const sceneEl = document.createElement('div');
    sceneEl.className = `scene-container active`;
    
    if (scene.type === 'cover') {
      sceneEl.innerHTML = `
        <div class="scene-bg" style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.6)), url('${scene.bgImage}');"></div>
        <div class="text-panel" style="max-width: 600px;">
          <h1 style="font-family: var(--font-heading); color: var(--accent-gold); font-size: 2.8rem; margin-bottom: 0.5rem; text-shadow: 0 0 20px var(--accent-glow);">${scene.title}</h1>
          <div class="heading-divider" aria-hidden="true">
            <span class="line" style="width: 80px;"></span>
            <span class="diamond">◆</span>
            <span class="line" style="width: 80px;"></span>
          </div>
          <p style="font-size: 1.3rem; font-style: italic; color: #f5e6d3; margin-bottom: 2rem;">${scene.subtitle}</p>
          <div class="controls">
            <button id="begin-btn" style="font-size: 1.2rem; padding: 0.9rem 2.2rem;">Begin ➔</button>
          </div>
        </div>
      `;
      this.wrapper.appendChild(sceneEl);

      sceneEl.querySelector('#begin-btn').addEventListener('click', () => {
        this.sound.startWindAmbience();
        this.nextScene();
      });
      return;
    }

    // Story scene rendering
    sceneEl.innerHTML = `
      <div class="scene-bg" style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('${scene.bgImage}');"></div>
      <div class="text-panel">
        <h2>${scene.title}</h2>
        <div class="heading-divider" aria-hidden="true">
          <span class="line"></span>
          <span class="diamond">◆</span>
          <span class="line"></span>
        </div>
        <p id="narrative-text">${scene.text}</p>
        <div class="interactive-area" id="interactive-area"></div>
        <div class="controls" id="controls-area"></div>
      </div>
    `;

    this.wrapper.appendChild(sceneEl);

    const interactiveArea = sceneEl.querySelector('#interactive-area');
    const controlsArea = sceneEl.querySelector('#controls-area');

    if (scene.type === 'narrative') {
      controlsArea.innerHTML = `<button id="next-btn">Continue ➔</button>`;
      sceneEl.querySelector('#next-btn').addEventListener('click', () => this.nextScene());
    } else if (scene.type === 'interactive-door') {
      this.setupDoorInteraction(interactiveArea, controlsArea);
    } else if (scene.type === 'interactive-dnd') {
      this.setupDndInteraction(interactiveArea, controlsArea);
    } else if (scene.type === 'diagram') {
      this.setupDiagram(interactiveArea, controlsArea);
    } else if (scene.type === 'code-7a') {
      this.setupCode7a(interactiveArea, controlsArea);
    } else if (scene.type === 'code-7b') {
      this.setupCode7b(interactiveArea, controlsArea);
    } else if (scene.type === 'code-7c') {
      this.setupCode7c(interactiveArea, controlsArea);
    } else if (scene.type === 'ending') {
      // Add Task 4: Real-world closing line
      const textPanel = sceneEl.querySelector('.text-panel');
      const noteEl = document.createElement('p');
      noteEl.className = 'real-world-note';
      noteEl.textContent = 'This same idea protects your bank balance, your passwords, and your private messages every day.';
      textPanel.appendChild(noteEl);

      // Add Task 5: Restart Button transitioning back to Cover Screen (Screen 0)
      controlsArea.innerHTML = `<button id="restart-btn">🔄 Tell the story again</button>`;
      sceneEl.querySelector('#restart-btn').addEventListener('click', () => this.goToScene(0));
    }
  }

  nextScene() {
    if (this.currentIndex < scenes.length) {
      this.transitionTo(this.currentIndex + 1);
    }
  }

  goToScene(index) {
    this.transitionTo(index);
  }

  transitionTo(newIndex) {
    const currentEl = this.wrapper.querySelector('.scene-container');
    this.currentIndex = newIndex;
    this.updateProgressDots();

    if (currentEl) {
      currentEl.classList.remove('active');
      currentEl.classList.add('page-turn-out');

      setTimeout(() => {
        currentEl.remove();
        this.renderScene(newIndex);
      }, 450);
    } else {
      this.renderScene(newIndex);
    }
  }

  setupDoorInteraction(container, controls) {
    container.innerHTML = `
      <div id="door-wrapper" class="door-wrapper">
        <svg class="cave-door-svg" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="stoneArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3a4556"/>
              <stop offset="50%" stop-color="#1e2530"/>
              <stop offset="100%" stop-color="#121720"/>
            </linearGradient>
            <linearGradient id="doorPanelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#4a2e1b"/>
              <stop offset="50%" stop-color="#6e4227"/>
              <stop offset="100%" stop-color="#362012"/>
            </linearGradient>
            <radialGradient id="interiorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fff099" stop-opacity="1"/>
              <stop offset="50%" stop-color="#f6e05e" stop-opacity="0.95"/>
              <stop offset="90%" stop-color="#dd6b20" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#9c4221" stop-opacity="0"/>
            </radialGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Inner Chamber Light Spill Path -->
          <path d="M 25 245 V 110 Q 25 35 110 15 Q 195 35 195 110 V 245 Z" fill="url(#interiorGlow)" class="interior-light-path"/>

          <!-- Left Door Half -->
          <g class="door-half door-left-half">
            <path d="M 25 245 V 110 Q 25 35 110 15 V 245 Z" fill="url(#doorPanelGrad)" stroke="#1a202c" stroke-width="2"/>
            <path d="M 40 230 V 115 Q 40 55 100 35 V 230 Z" fill="none" stroke="#d69e2e" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            <polygon points="65,120 75,110 65,100 55,110" fill="none" stroke="#f6e05e" stroke-width="1.5"/>
            <polygon points="65,180 75,170 65,160 55,170" fill="none" stroke="#f6e05e" stroke-width="1.5"/>
          </g>

          <!-- Right Door Half -->
          <g class="door-half door-right-half">
            <path d="M 195 245 V 110 Q 195 35 110 15 V 245 Z" fill="url(#doorPanelGrad)" stroke="#1a202c" stroke-width="2"/>
            <path d="M 180 230 V 115 Q 180 55 120 35 V 230 Z" fill="none" stroke="#d69e2e" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            <polygon points="155,120 165,110 155,100 145,110" fill="none" stroke="#f6e05e" stroke-width="1.5"/>
            <polygon points="155,180 165,170 155,160 145,170" fill="none" stroke="#f6e05e" stroke-width="1.5"/>
          </g>

          <!-- Center Glowing Seam -->
          <line x1="110" y1="15" x2="110" y2="245" class="center-seam" stroke="#f6e05e" stroke-width="3" filter="url(#goldGlow)"/>

          <!-- Outer Carved Stone Arch Frame -->
          <path d="M 10 250 V 105 Q 10 20 110 5 Q 210 20 210 105 V 250 H 25 V 110 Q 25 35 110 15 Q 195 35 195 110 V 250 Z" fill="url(#stoneArchGrad)" stroke="#e6b95b" stroke-width="2"/>
          <path d="M 17 245 V 108 Q 17 27 110 12 Q 203 27 203 108 V 245" fill="none" stroke="#e6b95b" stroke-width="1" stroke-dasharray="4,4" opacity="0.7"/>
          <polygon points="110,4 115,10 110,16 105,10" fill="#f6e05e"/>
          <polygon points="60,35 64,41 60,47 56,41" fill="#e6b95b"/>
          <polygon points="160,35 164,41 160,47 156,41" fill="#e6b95b"/>
          <polygon points="20,130 24,136 20,142 16,136" fill="#e6b95b"/>
          <polygon points="200,130 204,136 200,142 196,136" fill="#e6b95b"/>
        </svg>
      </div>
      <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
        <button id="force-btn">🔨 Force the door open</button>
        <button id="phrase-btn">🗣️ Say Khul Ja Sim Sim</button>
      </div>
      <p id="door-status" style="margin-top: 1rem; font-style: italic; color: #e6b95b; min-height: 1.5rem;"></p>
    `;

    const doorWrapper = container.querySelector('#door-wrapper');
    const statusText = container.querySelector('#door-status');
    const forceBtn = container.querySelector('#force-btn');
    const phraseBtn = container.querySelector('#phrase-btn');

    forceBtn.addEventListener('click', () => {
      statusText.textContent = "Nothing happens. The door doesn't care.";
      this.sound.playThud();

      doorWrapper.classList.remove('door-shake');
      void doorWrapper.offsetWidth;
      doorWrapper.classList.add('door-shake');
    });

    phraseBtn.addEventListener('click', () => {
      this.sound.playChime();

      const burstContainer = document.createElement('div');
      burstContainer.className = 'gold-burst-container';
      for (let i = 0; i < 18; i++) {
        const particle = document.createElement('div');
        particle.className = 'gold-burst-particle';
        const angle = (i / 18) * 2 * Math.PI;
        const dist = 60 + Math.random() * 50;
        particle.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        particle.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        burstContainer.appendChild(particle);
      }
      doorWrapper.appendChild(burstContainer);

      doorWrapper.classList.add('opened');
      statusText.textContent = "The stone groans. Light spills from the seams. The door slides open.";
      forceBtn.disabled = true;
      phraseBtn.disabled = true;

      controls.innerHTML = `<button id="next-btn">Continue ➔</button>`;
      controls.querySelector('#next-btn').addEventListener('click', () => this.nextScene());
    });
  }

  setupDndInteraction(container, controls) {
    this.dndState = { treasure: false, phrase: false };

    container.innerHTML = `
      <div class="dnd-container">
        <div class="chips">
          <div class="chip" draggable="true" id="chip-treasure" data-item="treasure">💎 treasure</div>
          <div class="chip" draggable="true" id="chip-phrase" data-item="phrase">🗣️ Khul Ja Sim Sim</div>
        </div>
        <div class="drop-zones">
          <div class="drop-zone" data-target="private">🔒 Private</div>
          <div class="drop-zone" data-target="public">🔓 Public</div>
        </div>
      </div>
      <p id="dnd-status" style="margin-top: 1rem; color: #e6b95b; min-height: 1.5rem;"></p>
    `;

    const chips = container.querySelectorAll('.chip');
    const dropZones = container.querySelectorAll('.drop-zone');
    const status = container.querySelector('#dnd-status');

    chips.forEach(chip => {
      chip.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', chip.dataset.item);
      });
    });

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('active');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('active');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('active');
        const item = e.dataTransfer.getData('text/plain');

        if (item === 'treasure' && zone.dataset.target === 'private') {
          this.dndState.treasure = true;
          const chipEl = container.querySelector('#chip-treasure');
          zone.appendChild(chipEl);
          chipEl.setAttribute('draggable', 'false');
          zone.classList.add('filled');
        } else if (item === 'phrase' && zone.dataset.target === 'public') {
          this.dndState.phrase = true;
          const chipEl = container.querySelector('#chip-phrase');
          zone.appendChild(chipEl);
          chipEl.setAttribute('draggable', 'false');
          zone.classList.add('filled');
        } else {
          status.textContent = "That piece doesn't fit there. Try again!";
          setTimeout(() => { status.textContent = ""; }, 2000);
        }

        if (this.dndState.treasure && this.dndState.phrase) {
          status.textContent = "Great design! Everything is in its proper place.";
          
          const textPanel = container.closest('.text-panel');
          if (textPanel) {
            textPanel.classList.add('success-pulse');
          }

          controls.innerHTML = `<button id="next-btn">Continue ➔</button>`;
          controls.querySelector('#next-btn').addEventListener('click', () => this.nextScene());
        }
      });
    });
  }

  setupDiagram(container, controls) {
    container.innerHTML = `
      <div class="diagram-box">
        <h3 style="text-align: center; color: #e6b95b; margin-bottom: 0.5rem;">Cave Structure</h3>
        <hr style="border-color: #e6b95b; margin-bottom: 1rem;">
        
        <div id="diag-private-wrapper" style="opacity: 0; transform: translateY(10px); transition: all 0.4s ease;">
          <p id="diag-private">🔒 <strong>Private data member:</strong> treasure</p>
          <p class="diagram-step-caption" style="margin: 0.25rem 0 1rem 1.8rem; font-size: 0.95rem; color: #aaa; font-style: italic;">This is what stays hidden inside.</p>
        </div>
        
        <div id="diag-public-wrapper" style="opacity: 0; transform: translateY(10px); transition: all 0.4s ease;">
          <p id="diag-public" style="margin-top: 0.5rem;">🔓 <strong>Public method:</strong> khul_ja_sim_sim()</p>
          <p class="diagram-step-caption" style="margin: 0.25rem 0 0 1.8rem; font-size: 0.95rem; color: #aaa; font-style: italic;">And this is the one way the outside world can reach in.</p>
        </div>
      </div>
    `;

    const privateEl = container.querySelector('#diag-private-wrapper');
    const publicEl = container.querySelector('#diag-public-wrapper');

    let currentStep = 1;

    // Step 1: Immediately show Private
    privateEl.style.opacity = '1';
    privateEl.style.transform = 'translateY(0)';

    controls.innerHTML = `<button id="next-btn">Continue ➔</button>`;
    controls.querySelector('#next-btn').addEventListener('click', () => {
      if (currentStep === 1) {
        currentStep = 2;
        // Step 2: Show Public
        publicEl.style.opacity = '1';
        publicEl.style.transform = 'translateY(0)';
      } else {
        this.nextScene();
      }
    });
  }

  setupCode7a(container, controls) {
    container.innerHTML = `
      <div class="diagram-box" id="code-diagram">
        <h3 style="text-align: center; color: #e6b95b; margin-bottom: 0.5rem;">Cave Structure</h3>
        <hr style="border-color: #e6b95b; margin-bottom: 1rem;">
        <p id="diag-private">🔒 <strong>Private data member:</strong> treasure</p>
        <p id="diag-public" style="margin-top: 0.5rem;">🔓 <strong>Public method:</strong> khul_ja_sim_sim()</p>
      </div>
      
      <div class="code-panel" id="code-panel">
        <div class="code-step">
          <div class="code-line visible"><span class="hl-keyword">class</span> <span class="hl-class">Cave</span>:</div>
          <div class="code-line visible">&nbsp;&nbsp;&nbsp;&nbsp;<span class="hl-keyword">def</span> <span class="hl-def">__init__</span>(<span class="hl-self">self</span>):</div>
        </div>
      </div>

      <div class="narrator-container">
        <div class="narrator-lamp">
          <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="genie-lamp-svg">
            <path d="M 35 50 Q 50 55 65 50" />
            <path d="M 40 50 L 42 45 H 58 L 60 50 Z" />
            <path d="M 25 40 C 25 28, 45 22, 70 24 C 80 25, 88 22, 92 16 C 90 24, 82 35, 70 38 C 55 42, 35 43, 25 40 Z" />
            <path d="M 28 32 C 16 32, 10 20, 20 12 C 28 6, 32 18, 26 24" />
            <path d="M 45 22 Q 50 16 55 22" />
            <circle cx="50" cy="15" r="2" fill="currentColor" />
          </svg>
          <div class="lamp-glow"></div>
        </div>
        <div class="speech-bubble" id="speech-bubble">
          <span id="speech-text"></span>
        </div>
      </div>
      
      <p class="code-caption">
        <code>treasure</code> is a data member — a piece of information the cave holds.<br>
        <code>khul_ja_sim_sim()</code> is a method — an action the cave can perform.
      </p>
    `;

    const bubble = container.querySelector('#speech-bubble');
    const speechText = container.querySelector('#speech-text');
    speechText.textContent = "Every story needs a beginning. Let's build the blueprint.";
    
    setTimeout(() => {
      bubble.classList.add('visible');
    }, 300);

    controls.innerHTML = `<button id="next-btn">Continue ➔</button>`;
    controls.querySelector('#next-btn').addEventListener('click', () => this.nextScene());
  }

  setupCode7b(container, controls) {
    container.innerHTML = `
      <div class="diagram-box" id="code-diagram">
        <h3 style="text-align: center; color: #e6b95b; margin-bottom: 0.5rem;">Cave Structure</h3>
        <hr style="border-color: #e6b95b; margin-bottom: 1rem;">
        <p id="diag-private" class="highlight-private">🔒 <strong>Private data member:</strong> treasure</p>
        <p id="diag-public" style="margin-top: 0.5rem;">🔓 <strong>Public method:</strong> khul_ja_sim_sim()</p>
      </div>
      
      <div class="code-panel" id="code-panel">
        <div class="code-step">
          <div class="code-line visible"><span class="hl-keyword">class</span> <span class="hl-class">Cave</span>:</div>
          <div class="code-line visible">&nbsp;&nbsp;&nbsp;&nbsp;<span class="hl-keyword">def</span> <span class="hl-def">__init__</span>(<span class="hl-self">self</span>):</div>
        </div>
        <div class="code-step" style="margin-top: 0.5rem;">
          <div class="code-line visible">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="hl-self">self</span>._treasure = <span class="hl-string">"gold"</span>        <span class="hl-comment"># private</span></div>
        </div>
      </div>

      <div class="narrator-container">
        <div class="narrator-lamp">
          <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="genie-lamp-svg">
            <path d="M 35 50 Q 50 55 65 50" />
            <path d="M 40 50 L 42 45 H 58 L 60 50 Z" />
            <path d="M 25 40 C 25 28, 45 22, 70 24 C 80 25, 88 22, 92 16 C 90 24, 82 35, 70 38 C 55 42, 35 43, 25 40 Z" />
            <path d="M 28 32 C 16 32, 10 20, 20 12 C 28 6, 32 18, 26 24" />
            <path d="M 45 22 Q 50 16 55 22" />
            <circle cx="50" cy="15" r="2" fill="currentColor" />
          </svg>
          <div class="lamp-glow"></div>
        </div>
        <div class="speech-bubble" id="speech-bubble">
          <span id="speech-text"></span>
        </div>
      </div>
      
      <p class="code-caption">
        <code>treasure</code> is a data member — a piece of information the cave holds.<br>
        <code>khul_ja_sim_sim()</code> is a method — an action the cave can perform.
      </p>
    `;

    const bubble = container.querySelector('#speech-bubble');
    const speechText = container.querySelector('#speech-text');
    speechText.textContent = "Careful now — this part stays hidden. That's the private piece. 🔒";

    setTimeout(() => {
      bubble.classList.add('visible');
    }, 300);

    controls.innerHTML = `<button id="next-btn">Continue ➔</button>`;
    controls.querySelector('#next-btn').addEventListener('click', () => this.nextScene());
  }

  setupCode7c(container, controls) {
    container.innerHTML = `
      <div class="diagram-box" id="code-diagram">
        <h3 style="text-align: center; color: #e6b95b; margin-bottom: 0.5rem;">Cave Structure</h3>
        <hr style="border-color: #e6b95b; margin-bottom: 1rem;">
        <p id="diag-private" class="highlight-private">🔒 <strong>Private data member:</strong> treasure</p>
        <p id="diag-public" class="highlight-public" style="margin-top: 0.5rem;">🔓 <strong>Public method:</strong> khul_ja_sim_sim()</p>
      </div>
      
      <div class="code-panel" id="code-panel">
        <div class="code-step">
          <div class="code-line visible"><span class="hl-keyword">class</span> <span class="hl-class">Cave</span>:</div>
          <div class="code-line visible">&nbsp;&nbsp;&nbsp;&nbsp;<span class="hl-keyword">def</span> <span class="hl-def">__init__</span>(<span class="hl-self">self</span>):</div>
          <div class="code-line visible">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="hl-self">self</span>._treasure = <span class="hl-string">"gold"</span>        <span class="hl-comment"># private</span></div>
        </div>
        <div class="code-step" style="margin-top: 0.5rem;">
          <div class="code-line visible"></div>
          <div class="code-line visible">&nbsp;&nbsp;&nbsp;&nbsp;<span class="hl-keyword">def</span> <span class="hl-def">khul_ja_sim_sim</span>(<span class="hl-self">self</span>):</div>
          <div class="code-line visible">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="hl-keyword">return</span> <span class="hl-self">self</span>._treasure          <span class="hl-comment"># public</span></div>
        </div>
      </div>

      <div class="narrator-container">
        <div class="narrator-lamp">
          <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="genie-lamp-svg">
            <path d="M 35 50 Q 50 55 65 50" />
            <path d="M 40 50 L 42 45 H 58 L 60 50 Z" />
            <path d="M 25 40 C 25 28, 45 22, 70 24 C 80 25, 88 22, 92 16 C 90 24, 82 35, 70 38 C 55 42, 35 43, 25 40 Z" />
            <path d="M 28 32 C 16 32, 10 20, 20 12 C 28 6, 32 18, 26 24" />
            <path d="M 45 22 Q 50 16 55 22" />
            <circle cx="50" cy="15" r="2" fill="currentColor" />
          </svg>
          <div class="lamp-glow"></div>
        </div>
        <div class="speech-bubble" id="speech-bubble">
          <span id="speech-text"></span>
        </div>
      </div>
      
      <p class="code-caption">
        <code>treasure</code> is a data member — a piece of information the cave holds.<br>
        <code>khul_ja_sim_sim()</code> is a method — an action the cave can perform.
      </p>
    `;

    const bubble = container.querySelector('#speech-bubble');
    const speechText = container.querySelector('#speech-text');
    speechText.textContent = "And here's the one door in — the public way, just like saying the magic words. 🗝️";

    setTimeout(() => {
      bubble.classList.add('visible');
    }, 300);

    let currentStep = 1;

    controls.innerHTML = `<button id="next-btn">Continue ➔</button>`;
    controls.querySelector('#next-btn').addEventListener('click', () => {
      if (currentStep === 1) {
        currentStep = 2;
        bubble.classList.remove('visible');
        setTimeout(() => {
          speechText.textContent = "Private stays hidden. Public is the only door in. That's the whole trick.";
          bubble.classList.add('visible');
        }, 200);
      } else {
        this.nextScene();
      }
    });
  }
}


