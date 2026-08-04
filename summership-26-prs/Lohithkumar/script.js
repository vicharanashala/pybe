// The Royal Decoder - Interactive Engine

let prologueTimeouts = [];
let prologueSkipped = false;

const state = {
    scenes: [],
    currentSceneIndex: 0,
    dialogueIndex: 0,
    typingText: "",
    isTyping: false,
    typingInterval: null,
    messageState: "", // Current state of the decrypted message
    codeApproved: false,
    feedbackMessage: "",
    isFeedbackError: false
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div id="curtain-overlay" class="curtain-overlay">
            <div class="curtain-left"></div>
            <div class="curtain-right"></div>
            <div id="prologue-container" class="prologue-container"></div>
        </div>

        <div class="bg-layer-container">
            <div id="bg-layer-1" class="bg-layer active"></div>
            <div id="bg-layer-2" class="bg-layer"></div>
            <div class="bg-overlay"></div>
        </div>
        
        <div class="game-header">
            <h1 class="game-title">The Royal Decoder</h1>
            <p class="game-subtitle">Interactive Python Strings</p>
        </div>

        <div class="character-container">
            <img id="char-layer-1" class="char-layer" src="" alt="character" />
            <img id="char-layer-2" class="char-layer" src="" alt="character" />
        </div>

        <div id="decoder-panel" class="decoder-panel">
            <div class="decoder-header">✦ Intercepted Missive ✦</div>
            <div class="decoder-content">
                <div class="message-label">Current String State:</div>
                <div id="message-display" class="message-display"></div>
            </div>
        </div>

        <div class="ui-container">
            <div id="dialogue-panel" class="dialogue-panel" tabindex="0">
                <div id="character-name" class="character-name">Master Spy</div>
                <div id="dialogue-text-box" class="dialogue-text-box"></div>
                <div id="interaction-slot"></div>
                <div id="continue-indicator" class="continue-indicator">Click / Space to continue ➔</div>
            </div>
        </div>
    `;

    document.getElementById('dialogue-panel').addEventListener('click', (e) => {
        if (e.target.closest('#interaction-slot')) return;
        handleContinue();
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            if (document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                handleContinue();
            }
        }
    });

    state.scenes = scenesData;
    
    runPrologue();
}

function runPrologue() {
    const container = document.getElementById('prologue-container');
    const curtain = document.getElementById('curtain-overlay');
    
    const lines = [
        "In times of war, secrets are gold.",
        "An intercepted raven brings a scrambled scroll...",
        "A single mistake in decryption...",
        "...could cost the kingdom everything."
    ];

    lines.forEach(text => {
        const p = document.createElement('p');
        p.className = 'prologue-line';
        p.textContent = text;
        container.appendChild(p);
    });

    const elements = container.querySelectorAll('.prologue-line');
    curtain.addEventListener('click', skipPrologue);

    prologueTimeouts.push(setTimeout(() => { if (elements[0]) elements[0].classList.add('visible'); }, 500));
    prologueTimeouts.push(setTimeout(() => { if (elements[1]) elements[1].classList.add('visible'); }, 2200));
    prologueTimeouts.push(setTimeout(() => { if (elements[2]) elements[2].classList.add('visible'); }, 4000));
    prologueTimeouts.push(setTimeout(() => { if (elements[3]) elements[3].classList.add('visible'); }, 5800));

    prologueTimeouts.push(setTimeout(() => {
        container.style.opacity = '0';
    }, 8500));

    prologueTimeouts.push(setTimeout(() => {
        curtain.classList.add('open');
        setTimeout(() => { startScene(0); }, 1000);
    }, 9500));
}

function skipPrologue() {
    if (prologueSkipped) return;
    prologueSkipped = true;
    prologueTimeouts.forEach(t => clearTimeout(t));
    
    const curtain = document.getElementById('curtain-overlay');
    curtain.classList.add('open');
    startScene(0);
}

function startScene(index) {
    if (index >= state.scenes.length) return;
    
    state.currentSceneIndex = index;
    state.dialogueIndex = 0;
    state.codeApproved = false;
    
    const scene = state.scenes[index];
    
    if (scene.messageState !== undefined) {
        state.messageState = scene.messageState;
    }
    
    transitionBg(scene.background);
    
    const decoderPanel = document.getElementById('decoder-panel');
    if (scene.decoderVisible) {
        decoderPanel.classList.add('visible');
        renderDecoder();
    } else {
        decoderPanel.classList.remove('visible');
    }
    
    document.getElementById('character-name').textContent = scene.characterName;
    document.getElementById('interaction-slot').style.display = 'none';
    
    if (scene.dialogue && scene.dialogue.length > 0) {
        startTypewriter(scene.dialogue[0]);
    } else {
        revealInteraction();
    }
}

function transitionBg(src) {
    const bg1 = document.getElementById('bg-layer-1');
    const bg2 = document.getElementById('bg-layer-2');
    const active = bg1.classList.contains('active') ? bg1 : bg2;
    const inactive = active === bg1 ? bg2 : bg1;
    
    inactive.style.backgroundColor = '#050b14';
    if (src) {
        inactive.style.backgroundImage = `url('${src}')`;
    }
    inactive.classList.add('active');
    active.classList.remove('active');
}

function startTypewriter(text) {
    state.isTyping = true;
    const box = document.getElementById('dialogue-text-box');
    box.innerHTML = '';
    let i = 0;
    
    document.getElementById('continue-indicator').classList.remove('visible');
    
    clearInterval(state.typingInterval);
    state.typingInterval = setInterval(() => {
        box.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) {
            completeTypewriter(text);
        }
    }, 25);
}

function completeTypewriter(text) {
    clearInterval(state.typingInterval);
    const box = document.getElementById('dialogue-text-box');
    box.innerHTML = text || state.scenes[state.currentSceneIndex].dialogue[state.dialogueIndex];
    state.isTyping = false;
    
    const scene = state.scenes[state.currentSceneIndex];
    if (state.dialogueIndex === scene.dialogue.length - 1) {
        if (!scene.interactive || (scene.interactive && !state.codeApproved)) {
            revealInteraction();
        } else {
            document.getElementById('continue-indicator').classList.add('visible');
        }
    } else {
        document.getElementById('continue-indicator').classList.add('visible');
    }
}

function handleContinue() {
    if (state.isTyping) {
        completeTypewriter();
        return;
    }
    
    const scene = state.scenes[state.currentSceneIndex];
    
    if (state.dialogueIndex < scene.dialogue.length - 1) {
        state.dialogueIndex++;
        startTypewriter(scene.dialogue[state.dialogueIndex]);
    } else if (scene.interactive && !state.codeApproved) {
        return; 
    } else {
        startScene(state.currentSceneIndex + 1);
    }
}

function revealInteraction() {
    const scene = state.scenes[state.currentSceneIndex];
    const slot = document.getElementById('interaction-slot');
    slot.innerHTML = '';
    slot.style.display = 'block';
    document.getElementById('continue-indicator').classList.remove('visible');

    if (!scene.interactive) {
        if (scene.buttons) {
            scene.buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = 'action-btn';
                button.textContent = btn.text;
                button.onclick = () => {
                    if (btn.action === 'restart') startScene(0);
                    else startScene(state.currentSceneIndex + 1);
                };
                slot.appendChild(button);
            });
        }
        return;
    }

    if (scene.interactionType === 'choice') {
        const title = document.createElement('div');
        title.innerHTML = `<strong>${scene.question}</strong>`;
        slot.appendChild(title);
        
        const container = document.createElement('div');
        container.className = 'choices-container';
        
        scene.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = opt.text;
            btn.onclick = (e) => {
                e.stopPropagation();
                if (opt.action === 'feedback') {
                    alert(opt.feedback);
                } else {
                    state.codeApproved = true;
                    document.getElementById('interaction-slot').style.display = 'none';
                    if (opt.extraDialogue) {
                        scene.dialogue = scene.dialogue.concat(opt.extraDialogue);
                        handleContinue();
                    } else {
                        startScene(state.currentSceneIndex + 1);
                    }
                }
            };
            container.appendChild(btn);
        });
        slot.appendChild(container);
    } 
    else if (scene.interactionType === 'terminal') {
        slot.innerHTML = `
            <div class="terminal-container">
                <div class="terminal-prompt">// ${scene.terminalPrompt}</div>
                <div class="terminal-input-row">
                    <span class="terminal-prefix">&gt;&gt;&gt;</span>
                    <input type="text" id="term-input" class="terminal-input" autocomplete="off" spellcheck="false" autofocus />
                </div>
                <div id="term-feedback" class="terminal-feedback"></div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button id="term-hint" class="action-btn" style="background: rgba(197, 160, 89, 0.2); border: 1px solid var(--border-gold); color: var(--gold-light); display: ${scene.defaultHint ? 'inline-block' : 'none'};">Need a Hint?</button>
                <button id="term-submit" class="action-btn" style="display:none; background: #3fb950; color: #fff;">Next</button>
            </div>
        `;
        
        const input = document.getElementById('term-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                validateTerminal(input.value, scene);
            }
        });
        
        const hintBtn = document.getElementById('term-hint');
        hintBtn.onclick = (e) => {
            e.stopPropagation();
            const feedback = document.getElementById('term-feedback');
            feedback.textContent = scene.defaultHint;
            feedback.className = 'terminal-feedback';
            feedback.style.color = 'var(--gold-light)';
        };
        
        setTimeout(() => input.focus(), 100);
    }
}

function validateTerminal(value, scene) {
    const feedback = document.getElementById('term-feedback');
    const submitBtn = document.getElementById('term-submit');
    const input = document.getElementById('term-input');
    
    const regex = new RegExp(scene.expectedPattern);
    
    if (regex.test(value.trim())) {
        feedback.textContent = scene.successFeedback;
        feedback.className = 'terminal-feedback success';
        state.codeApproved = true;
        input.disabled = true;
        submitBtn.style.display = 'inline-block';
        
        if (scene.newMessageState) {
            state.messageState = scene.newMessageState;
            renderDecoder(true);
        }
        
        submitBtn.onclick = (e) => {
            e.stopPropagation();
            startScene(state.currentSceneIndex + 1);
        };
        submitBtn.focus();
    } else {
        feedback.className = 'terminal-feedback error';
        
        let foundHint = false;
        if (scene.errorHints) {
            for (const [key, hint] of Object.entries(scene.errorHints)) {
                if (key === 'default') continue;
                // Simple matching for specific errors defined in scene data
                if (key === 'parens' && !value.includes('(')) {
                    feedback.textContent = hint;
                    foundHint = true;
                    break;
                }
                if (key === 'brackets' && value.includes('[')) {
                    feedback.textContent = hint;
                    foundHint = true;
                    break;
                }
            }
        }
        if (!foundHint) {
            feedback.textContent = (scene.errorHints && scene.errorHints.default) ? scene.errorHints.default : "Syntax Error. Try again.";
        }
    }
}

function renderDecoder(flash = false) {
    const display = document.getElementById('message-display');
    const panel = document.getElementById('decoder-panel');
    
    display.textContent = state.messageState;
    
    if (state.scenes[state.currentSceneIndex].fullyDecoded) {
        display.classList.add('decoded');
    } else {
        display.classList.remove('decoded');
    }
    
    if (flash) {
        panel.classList.remove('success-flash');
        void panel.offsetWidth; // trigger reflow
        panel.classList.add('success-flash');
        
        setTimeout(() => {
            panel.classList.remove('success-flash');
        }, 1500);
    }
}
