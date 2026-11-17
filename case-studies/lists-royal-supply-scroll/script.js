// The Royal Supply Scroll - Interactive Engine

// Prologue state variables
let prologueTimeouts = [];
let prologueSkipped = false;

// Global Game State
const state = {
    scenes: [],
    currentSceneIndex: 0,
    dialogueIndex: 0,
    
    // Typewriter state
    typingText: "",
    isTyping: false,
    typingInterval: null,
    
    // Scroll state
    suppliesList: [],
    
    // Interaction state
    substepIndex: 0,          // Tracks substeps in Screens 7, 8, 11, 12
    codeApproved: false,       // True if current input is validated
    feedbackMessage: "",
    isFeedbackError: false
};

// Initial setup on load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Inject UI shell and load JSON
function initApp() {
    const app = document.getElementById('app');
    
    // Inject the visual structure of the game
    app.innerHTML = `
        <!-- Cinematic Curtain Overlay -->
        <div id="curtain-overlay" class="curtain-overlay">
            <div class="curtain-left"></div>
            <div class="curtain-right"></div>
            <div id="prologue-container" class="prologue-container"></div>
        </div>

        <!-- Background Layer Double Buffer -->
        <div class="bg-layer-container">
            <div id="bg-layer-1" class="bg-layer active"></div>
            <div id="bg-layer-2" class="bg-layer"></div>
            <div class="bg-overlay"></div>
        </div>
        
        <!-- Floating Back Button (Top-left) -->
        <button id="back-btn" class="back-btn-floating" aria-label="Go back to previous screen">←</button>
        
        <!-- Floating Forward Button (Top-right) -->
        <button id="forward-btn" class="forward-btn-floating" aria-label="Advance to next screen">→</button>
        
        <!-- Animated Scattered Papers Overlay (Screen 2) -->
        <div id="scattered-papers" class="scattered-papers-container"></div>
        
        <!-- Game Header Titles -->
        <div class="game-header">
            <h1 class="game-title">The Royal Supply Scroll</h1>
            <p class="game-subtitle">Interactive Coding Lesson</p>
            <a href="#" id="restart-lesson-link" class="restart-link">Restart Lesson</a>
        </div>

        <!-- Character Portraits Double Buffer -->
        <div class="character-container">
            <img id="char-layer-1" class="char-layer" src="" alt="character portrait 1" />
            <img id="char-layer-2" class="char-layer" src="" alt="character portrait 2" />
        </div>

        <!-- Scroll Panel Graphic -->
        <div id="scroll-panel" class="scroll-panel">
            <div class="scroll-header">Royal Scroll</div>
            <div id="scroll-items" class="scroll-items-container"></div>
        </div>

        <!-- Screen Transition Overlay -->
        <div id="transition-overlay" class="transition-overlay"></div>

        <!-- Bottom Dialogue & UI Box -->
        <div class="ui-container">
            <div id="dialogue-panel" class="dialogue-panel" tabindex="0" role="button" aria-label="Dialogue panel. Press Space or Enter to continue.">
                <div id="character-name" class="character-name">Chanakya</div>
                <div id="dialogue-text-box" class="dialogue-text-box" aria-hidden="true"></div>
                <div id="dialogue-aria" class="sr-only" aria-live="polite"></div>
                
                <!-- Dynamic interactions container -->
                <div id="interaction-slot"></div>
                
                <div id="continue-indicator" class="continue-indicator">
                    Press Space / Click text to continue ➔
                </div>
            </div>
        </div>
    `;

    // Setup click on dialogue panel for skips/advances (ignoring interaction slots)
    document.getElementById('dialogue-panel').addEventListener('click', (e) => {
        // Ignore clicks inside the interactive slot (like terminal, choices, etc.)
        if (e.target.closest('#interaction-slot')) {
            return;
        }
        handleContinueClick();
    });

    // Setup back button click handler
    document.getElementById('back-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        goToPreviousScene();
    });

    // Setup forward button click handler
    document.getElementById('forward-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleContinueClick();
    });

    // Setup global spacebar/enter keys for progression
    document.addEventListener('keydown', handleGlobalKeydown);

    // Setup Restart Lesson link click handler
    document.getElementById('restart-lesson-link').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to restart the lesson from the beginning? All progress will be lost.")) {
            localStorage.removeItem('royal_supply_scroll_state');
            resetGame();
        }
    });

    // Load scenes from localized scenesData variable
    state.scenes = scenesData;
    console.log('Script loaded successfully.');
    
    // Attempt to restore saved state
    if (loadState()) {
        console.log(`Restoring state. Starting at scene index ${state.currentSceneIndex}.`);
        startScene(state.currentSceneIndex, true);
    } else {
        startScene(0, false);
    }

    if (state.currentSceneIndex === 0) {
        prologueSkipped = false;
        prologueTimeouts = [];
        runPrologue();
    } else {
        // Direct launch, remove prologue overlay
        const container = document.getElementById('prologue-container');
        if (container) container.remove();
        
        const curtain = document.getElementById('curtain-overlay');
        if (curtain) curtain.classList.add('open');
    }
}

// Cinematic Prologue Quote sequence
function runPrologue() {
    const container = document.getElementById('prologue-container');
    const curtain = document.getElementById('curtain-overlay');
    if (!container || !curtain) {
        if (curtain) curtain.classList.add('open');
        return;
    }

    const lines = [
        "When everything has its place...",
        "...a kingdom prospers.",
        "When nothing has its place...",
        "...even abundance becomes chaos."
    ];

    // Clear old lines
    container.innerHTML = '';

    // Create line elements
    lines.forEach((text) => {
        const p = document.createElement('p');
        p.className = 'prologue-line';
        p.textContent = text;
        container.appendChild(p);
    });

    const elements = container.querySelectorAll('.prologue-line');

    // Add skip-on-click listener to curtain
    curtain.addEventListener('click', skipPrologue);

    // Sequence timeouts
    prologueTimeouts.push(setTimeout(() => {
        if (elements[0]) elements[0].classList.add('visible');
    }, 500));

    prologueTimeouts.push(setTimeout(() => {
        if (elements[1]) elements[1].classList.add('visible');
    }, 2200));

    prologueTimeouts.push(setTimeout(() => {
        if (elements[2]) elements[2].classList.add('visible');
    }, 4000));

    prologueTimeouts.push(setTimeout(() => {
        if (elements[3]) elements[3].classList.add('visible');
    }, 5800));

    // Fade out prologue container
    prologueTimeouts.push(setTimeout(() => {
        container.style.transition = 'opacity 1s ease-in-out';
        container.style.opacity = '0';
    }, 8500));

    // Pull open curtains
    prologueTimeouts.push(setTimeout(() => {
        curtain.classList.add('open');
        curtain.removeEventListener('click', skipPrologue);
        setTimeout(() => container.remove(), 1200);
    }, 9800));
}

// Skip prologue on click
function skipPrologue() {
    if (prologueSkipped) return;
    prologueSkipped = true;

    // Clear active timeouts
    prologueTimeouts.forEach(t => clearTimeout(t));

    const container = document.getElementById('prologue-container');
    if (container) {
        container.style.transition = 'opacity 0.3s ease';
        container.style.opacity = '0';
        setTimeout(() => container.remove(), 300);
    }

    const curtain = document.getElementById('curtain-overlay');
    if (curtain) {
        curtain.classList.add('open');
        curtain.removeEventListener('click', skipPrologue);
    }
}

// Start rendering a new scene
function startScene(sceneIndex, isRestore = false) {
    if (sceneIndex < 0 || sceneIndex >= state.scenes.length) return;
    
    // Trigger black transition blink for screen switches
    const transitionOverlay = document.getElementById('transition-overlay');
    transitionOverlay.classList.add('active');
    
    setTimeout(() => {
        state.currentSceneIndex = sceneIndex;
        state.dialogueIndex = 0;
        state.codeApproved = false;
        state.feedbackMessage = "";
        state.isFeedbackError = false;

        if (!isRestore) {
            state.substepIndex = 0;
        }

        const currentScene = state.scenes[sceneIndex];

        // 1. Swap backgrounds (Cross-fade)
        transitionBg(currentScene.background);

        // 2. Swap characters (Cross-fade)
        transitionChar(currentScene.character, currentScene.characterName);

        // 3. Clear/Start Screen 2 papers animation
        const paperContainer = document.getElementById('scattered-papers');
        paperContainer.innerHTML = '';
        if (currentScene.id === 2) {
            startScatteredPapersAnimation();
        }

        // 4. Set up Scroll Data
        const appContainer = document.getElementById('app');
        if (currentScene.scrollVisible) {
            appContainer.classList.add('scroll-active');
            if (!isRestore && currentScene.scrollItems) {
                state.suppliesList = [...currentScene.scrollItems];
            }
        } else {
            appContainer.classList.remove('scroll-active');
        }
        renderScroll();

        // 5. Hide interaction slots until typing finishes
        document.getElementById('interaction-slot').innerHTML = '';
        document.getElementById('interaction-slot').style.display = 'none';

        // 6. Reset name tag
        document.getElementById('character-name').textContent = currentScene.characterName || "";

        // Show/hide Back button based on scene index
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            if (sceneIndex > 0) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        }

        // Remove overlay
        transitionOverlay.classList.remove('active');

        // 7. Start typewriter dialogue
        if (currentScene.dialogue && currentScene.dialogue.length > 0) {
            startTypewriter(currentScene.dialogue[0]);
        } else {
            // If scene has no dialogue (like screen 3), skip directly to interaction
            completeTypewriter();
            revealInteraction();
        }

        // Save current progress
        saveState();
    }, 200);
}

// Background cross-fade buffer swap
function transitionBg(src) {
    const bg1 = document.getElementById('bg-layer-1');
    const bg2 = document.getElementById('bg-layer-2');
    
    const activeLayer = bg1.classList.contains('active') ? bg1 : bg2;
    const inactiveLayer = activeLayer === bg1 ? bg2 : bg1;
    
    if (src) {
        inactiveLayer.style.backgroundImage = `url('${src}')`;
        inactiveLayer.classList.add('active');
        activeLayer.classList.remove('active');
    } else {
        bg1.classList.remove('active');
        bg2.classList.remove('active');
    }
}

// Character portrait cross-fade buffer swap
function transitionChar(src, name) {
    const char1 = document.getElementById('char-layer-1');
    const char2 = document.getElementById('char-layer-2');
    
    const targetLayer = char1.classList.contains('active') ? char2 : char1;
    const currentLayer = char1.classList.contains('active') ? char1 : char2;

    if (src) {
        targetLayer.src = src;
        targetLayer.classList.add('active');
        currentLayer.classList.remove('active');
    } else {
        char1.classList.remove('active');
        char2.classList.remove('active');
    }
}

// Typewriter script text printing
function startTypewriter(text) {
    if (state.typingInterval) clearInterval(state.typingInterval);
    
    state.isTyping = true;
    state.typingText = text;
    
    const textBox = document.getElementById('dialogue-text-box');
    textBox.innerHTML = '';
    
    // Set screen reader aria-live text immediately
    const ariaBox = document.getElementById('dialogue-aria');
    if (ariaBox) {
        ariaBox.textContent = text;
    }
    
    let charIndex = 0;
    document.getElementById('continue-indicator').classList.remove('visible');

    state.typingInterval = setInterval(() => {
        if (charIndex < text.length) {
            textBox.innerHTML += text[charIndex];
            charIndex++;
        } else {
            completeTypewriter();
        }
    }, 25); // ~25-30ms per char
}

// Skip printing to full line
function completeTypewriter() {
    if (state.typingInterval) clearInterval(state.typingInterval);
    state.isTyping = false;
    
    const textBox = document.getElementById('dialogue-text-box');
    textBox.innerHTML = state.typingText;
    
    updateContinueIndicator();
}

// Manage visibility of "Click to Continue" indicators and Forward navigation button
function updateContinueIndicator() {
    const currentScene = state.scenes[state.currentSceneIndex];
    const isLastDialogueLine = !currentScene.dialogue || state.dialogueIndex >= currentScene.dialogue.length - 1;
    const continueIndicator = document.getElementById('continue-indicator');
    const forwardBtn = document.getElementById('forward-btn');

    if (state.isTyping) {
        continueIndicator.classList.remove('visible');
        if (forwardBtn) forwardBtn.classList.add('visible'); // Show to allow skipping typewriter
        return;
    }

    let canAdvance = false;
    if (!isLastDialogueLine) {
        canAdvance = true;
    } else {
        if (currentScene.interactive) {
            canAdvance = state.codeApproved;
        } else {
            canAdvance = true;
        }
    }

    if (canAdvance) {
        continueIndicator.classList.add('visible');
        if (forwardBtn) forwardBtn.classList.add('visible');
    } else {
        continueIndicator.classList.remove('visible');
        if (forwardBtn) forwardBtn.classList.remove('visible');
    }
}

// Handle dialogue advance triggers
function handleContinueClick() {
    if (state.isTyping) {
        completeTypewriter();
        return;
    }

    const currentScene = state.scenes[state.currentSceneIndex];
    
    // Check if there are more dialogue lines
    if (currentScene.dialogue && state.dialogueIndex < currentScene.dialogue.length - 1) {
        state.dialogueIndex++;
        startTypewriter(currentScene.dialogue[state.dialogueIndex]);
    } else {
        // Last line reached
        if (currentScene.interactive) {
            if (state.codeApproved) {
                // Advanced if interactive task was completed
                goToNextScene();
            } else {
                // If typewriter finished, reveal input panel for interactive screen
                revealInteraction();
            }
        } else {
            // Regular screen advances automatically
            goToNextScene();
        }
    }
}

// Advance to next index
function goToNextScene() {
    const currentScene = state.scenes[state.currentSceneIndex];
    
    // Check if custom buttons/links exist
    if (currentScene.buttons && currentScene.buttons.length === 1 && currentScene.buttons[0].action === 'next') {
        startScene(state.currentSceneIndex + 1);
    } else {
        startScene(state.currentSceneIndex + 1);
    }
}

// Retract to previous index
function goToPreviousScene() {
    if (state.currentSceneIndex > 0) {
        startScene(state.currentSceneIndex - 1, false);
    }
}

// Prevent dialogue skips when typing code
function handleGlobalKeydown(e) {
    if (e.code === 'Space' || e.code === 'Enter') {
        const activeNode = document.activeElement;
        if (activeNode && (activeNode.tagName === 'INPUT' || activeNode.tagName === 'TEXTAREA')) {
            // Let normal coding keys register
            return;
        }
        
        // Prevent browser viewport scrolling on space
        e.preventDefault();
        handleContinueClick();
    }
}

// Render dynamic components inside dialogue slot
function revealInteraction() {
    const currentScene = state.scenes[state.currentSceneIndex];
    if (!currentScene.interactive) return;

    const slot = document.getElementById('interaction-slot');
    slot.style.display = 'block';
    slot.innerHTML = '';

    if (currentScene.interactionType === 'choice') {
        renderChoices(currentScene, slot);
    } else if (currentScene.interactionType === 'code-input') {
        renderCodeTerminal(currentScene, slot);
    } else if (currentScene.interactionType === 'code-input-steps') {
        renderCodeTerminalSteps(currentScene, slot);
    } else if (currentScene.interactionType === 'reverse-engineering') {
        renderReverseEngineering(currentScene, slot);
    } else if (currentScene.interactionType === 'final-mission') {
        renderFinalMission(currentScene, slot);
    } else if (currentScene.interactionType === 'completion') {
        renderCompletion(currentScene, slot);
    }
}

// RENDER: Screen 3 Branching Choices
function renderChoices(scene, container) {
    const questionEl = document.createElement('div');
    questionEl.className = 'instruction-text';
    questionEl.style.marginBottom = '10px';
    questionEl.textContent = scene.question;
    container.appendChild(questionEl);

    const choicesEl = document.createElement('div');
    choicesEl.className = 'choice-container';

    scene.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-button';
        btn.innerHTML = opt.text;
        
        btn.addEventListener('click', () => {
            handleChoiceSelected(opt);
        });
        
        choicesEl.appendChild(btn);
    });
    
    container.appendChild(choicesEl);
}

// Handle choices routing logic
function handleChoiceSelected(option) {
    const currentScene = state.scenes[state.currentSceneIndex];
    
    // Clear the choices display
    document.getElementById('interaction-slot').innerHTML = '';
    
    // Swap character expression based on choice
    if (option.nextCharacter) {
        transitionChar(option.nextCharacter, currentScene.characterName);
    }

    if (option.action === 'feedback') {
        // Incorrect parchment branch: show dialogue warning, on skip reload choices
        state.dialogueIndex = 0;
        state.isTyping = true;
        
        // We override dialogue temporarily to prompt retry
        state.typingText = option.feedback;
        startTypewriter(option.feedback);
        
        // Set state to code NOT approved, so advancing will reload Screen 3 choice
        state.codeApproved = false;
        
    } else if (option.action === 'next') {
        // Correct scroll choice branch
        state.codeApproved = true;
        state.dialogueIndex = 0;
        
        // Combine feedback and extra dialogue for typewriter sequence
        const lines = [option.feedback, ...(option.extraDialogue || [])];
        
        currentScene.dialogue = lines;
        startTypewriter(lines[0]);
    }
}

// RENDER: Normal Code Input Terminals (Screens 6, 9, 10)
function renderCodeTerminal(scene, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'interactive-panel';

    const label = document.createElement('div');
    label.className = 'instruction-text';
    label.textContent = scene.instruction;
    wrapper.appendChild(label);

    // Prefill code if taught, else leave blank
    let prefill = "";
    if (state.codeApproved && scene.successScrollItems) {
        prefill = scene.codeTemplate || "";
    } else if (scene.codeTemplate) {
        prefill = scene.codeTemplate;
    }

    wrapper.innerHTML += `
        <div class="terminal-container">
            <div class="terminal-header">
                <span>Mauryan Terminal v1.0</span>
                <span>Python 3.x</span>
            </div>
            <div class="terminal-row">
                <span class="terminal-prompt">>>></span>
                <div class="terminal-input-wrapper">
                    <textarea id="code-input" class="code-input-textarea" spellcheck="false" placeholder="Write code here...">${prefill}</textarea>
                </div>
            </div>
            <div id="terminal-feedback" class="terminal-feedback"></div>
        </div>
        <div class="action-btn-container">
            <button id="run-btn" class="wood-button">Run Code</button>
        </div>
    `;

    container.appendChild(wrapper);

    // Focus input area
    const input = document.getElementById('code-input');
    input.focus();
    
    // Auto height adjustments
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
    });

    // Run code logic
    const runBtn = document.getElementById('run-btn');
    runBtn.addEventListener('click', () => {
        runCodeValidation(input.value.trim(), scene);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runCodeValidation(input.value.trim(), scene);
        }
    });

    // If already solved, display correct status
    if (state.codeApproved) {
        showFeedback("Correct! The scroll reflects the values.", false);
    }
}

// RENDER: Substaged Code Input Terminals (Screens 7, 8)
function renderCodeTerminalSteps(scene, container) {
    const substep = scene.substeps[state.substepIndex];
    
    const wrapper = document.createElement('div');
    wrapper.className = 'interactive-panel';

    const label = document.createElement('div');
    label.className = 'instruction-text';
    label.innerHTML = `<strong>Step ${state.substepIndex + 1} of ${scene.substeps.length}:</strong> ${substep.instruction}`;
    wrapper.appendChild(label);

    // Prefill template code if provided in JSON/JS script
    const prefill = substep.codeTemplate || "";

    wrapper.innerHTML += `
        <div class="terminal-container">
            <div class="terminal-header">
                <span>Mauryan Terminal v1.0</span>
                <span>Python 3.x</span>
            </div>
            <div class="terminal-row">
                <span class="terminal-prompt">>>></span>
                <div class="terminal-input-wrapper">
                    <textarea id="code-input" class="code-input-textarea" spellcheck="false" placeholder="Write code here...">${prefill}</textarea>
                </div>
            </div>
            <div id="terminal-feedback" class="terminal-feedback"></div>
        </div>
        <div class="action-btn-container">
            <button id="run-btn" class="wood-button">Run Code</button>
        </div>
    `;

    container.appendChild(wrapper);

    const input = document.getElementById('code-input');
    input.focus();

    const runBtn = document.getElementById('run-btn');
    runBtn.addEventListener('click', () => {
        runStepValidation(input.value.trim(), scene, substep);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runStepValidation(input.value.trim(), scene, substep);
        }
    });
}

// RENDER: Screen 11 Reverse Engineering Quizzes
function renderReverseEngineering(scene, container) {
    const substep = scene.substeps[state.substepIndex];
    
    const wrapper = document.createElement('div');
    wrapper.className = 'interactive-panel';

    // Show initial vs final layout for visual context
    const quizDisplay = document.createElement('div');
    quizDisplay.className = 'quiz-display';
    
    const initItems = substep.initialScroll.join(' / ');
    const finalItems = substep.finalScroll.join(' / ');

    if (substep.step === 3) {
        // Question 3 shows items and asks for count
        quizDisplay.innerHTML = `
            <div><strong>Active Scroll:</strong> <span class="quiz-scroll-preview">${initItems}</span></div>
        `;
    } else {
        quizDisplay.innerHTML = `
            <div><strong>Original:</strong> <span class="quiz-scroll-preview">${initItems}</span></div>
            <div class="arrow-divider">➔</div>
            <div><strong>Final:</strong> <span class="quiz-scroll-preview">${finalItems}</span></div>
        `;
    }
    wrapper.appendChild(quizDisplay);

    const label = document.createElement('div');
    label.className = 'instruction-text';
    label.style.marginBottom = '15px';
    label.innerHTML = `<strong>Puzzle ${state.substepIndex + 1} of ${scene.substeps.length}:</strong> ${substep.question}`;
    wrapper.appendChild(label);

    // Render options as choice buttons
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'choice-container';
    optionsContainer.style.flexDirection = 'column';
    optionsContainer.style.gap = '10px';
    optionsContainer.style.width = '100%';

    const options = substep.options || [];
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-button';
        btn.style.width = '100%';
        btn.style.justifyContent = 'flex-start';
        btn.style.fontFamily = 'monospace';
        btn.style.fontSize = '1.05rem';
        btn.textContent = opt;

        btn.addEventListener('click', () => {
            runQuizValidation(opt, scene, substep);
        });

        optionsContainer.appendChild(btn);
    });
    wrapper.appendChild(optionsContainer);

    // Console logs feedback logs
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'terminal-feedback';
    feedbackDiv.className = 'terminal-feedback';
    feedbackDiv.style.marginTop = '15px';
    feedbackDiv.style.width = '100%';
    wrapper.appendChild(feedbackDiv);

    container.appendChild(wrapper);
}

// RENDER: Screen 12 Final Mission Checklist
function renderFinalMission(scene, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'interactive-panel';

    // Checklist panel
    const checklist = document.createElement('div');
    checklist.className = 'checklist-container';
    
    scene.substeps.forEach((task, index) => {
        const item = document.createElement('div');
        item.className = 'checklist-item';
        if (index < state.substepIndex) {
            item.classList.add('completed');
        } else if (index === state.substepIndex) {
            item.classList.add('active');
        }
        
        item.innerHTML = `<span class="checklist-dot"></span> <span>${task.taskName}</span>`;
        checklist.appendChild(item);
    });
    
    wrapper.appendChild(checklist);

    // Current task details
    const activeTask = scene.substeps[state.substepIndex];
    const label = document.createElement('div');
    label.className = 'instruction-text';
    label.innerHTML = `<strong>Current Task:</strong> ${activeTask.taskName}`;
    wrapper.appendChild(label);

    wrapper.innerHTML += `
        <div class="terminal-container">
            <div class="terminal-header">
                <span>Mauryan Terminal v1.0</span>
                <span>Final Challenge Console</span>
            </div>
            <div class="terminal-row">
                <span class="terminal-prompt">>>></span>
                <div class="terminal-input-wrapper">
                    <textarea id="code-input" class="code-input-textarea" spellcheck="false" placeholder="Type Mauryan python code..."></textarea>
                </div>
            </div>
            <div id="terminal-feedback" class="terminal-feedback"></div>
        </div>
        <div class="action-btn-container" style="justify-content: space-between; align-items: center; width: 100%;">
            <a href="#" id="show-hint-link" style="color: var(--gold); font-size: 0.85rem; font-weight: bold; cursor: pointer; text-decoration: none; border-bottom: 1px dashed var(--gold);">❓ Need a Hint?</a>
            <button id="run-btn" class="wood-button">Run Code</button>
        </div>
        <div id="mission-hint-box" style="display: none; font-size: 0.85rem; color: var(--text-muted); margin-top: 10px; border-left: 2px solid var(--gold); padding-left: 10px; font-style: italic; text-align: left; width: 100%; white-space: pre-line;"></div>
    `;

    container.appendChild(wrapper);

    const input = document.getElementById('code-input');
    input.focus();

    const runBtn = document.getElementById('run-btn');
    runBtn.addEventListener('click', () => {
        runFinalMissionValidation(input.value.trim(), scene, activeTask);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runFinalMissionValidation(input.value.trim(), scene, activeTask);
        }
    });

    // Expand / collapse hint box listener
    const hintLink = document.getElementById('show-hint-link');
    const hintBox = document.getElementById('mission-hint-box');
    hintLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (hintBox.style.display === 'none') {
            hintBox.style.display = 'block';
            hintBox.textContent = getMissionHint(state.substepIndex);
            hintLink.textContent = 'Hide Hint';
        } else {
            hintBox.style.display = 'none';
            hintLink.textContent = '❓ Need a Hint?';
        }
    });
}

// Get targeted hints for Screen 12 Final Mission (using alternate list syntax)
function getMissionHint(substepIndex) {
    switch (substepIndex) {
        case 0:
            return "Syntax Example: weapons = [\"Bow\", \"Sword\", \"Spear\"]\n(Define your list using square brackets, with comma-separated text items in quotes)";
        case 1:
            return "Syntax Example: weapons.append(\"Axe\")\n(Use the '.append()' method on your list with the item name inside quotes to add it)";
        case 2:
            return "Syntax Example: weapons.remove(\"Sword\")\n(Use the '.remove()' method on your list with the item name inside quotes to delete it)";
        case 3:
            return "Syntax Example: len(weapons)\n(Use the built-in len() function with the name of your list inside the parentheses)";
        default:
            return "Verify syntax: case-sensitivity, brackets, and quotes.";
    }
}

// RENDER: Screen 14 Completion & Replay buttons (Centered over closed curtains)
function renderCompletion(scene, container) {
    // 1. Close curtains for closure effect
    const curtain = document.getElementById('curtain-overlay');
    if (curtain) {
        curtain.classList.remove('open');
    }

    // 2. Render badge panel on top of closed curtains
    const badgeOverlay = document.createElement('div');
    badgeOverlay.className = 'badge-overlay-panel';
    badgeOverlay.innerHTML = `
        <div class="badge-container">
            <img class="badge-img" src="${scene.badge}" alt="Scroll Keeper Badge" />
            <div class="badge-title">🏅 Royal Scroll Keeper</div>
            <p class="badge-desc">Congratulations! You have successfully mastered Python Lists and configured the royal supply scroll for the Mauryan army.</p>
        </div>
        <div class="choice-container" style="margin-top: 25px; justify-content: center; gap: 15px;">
            <button id="replay-btn" class="wood-button" style="padding: 12px 24px; font-size: 1rem;">Replay Lesson</button>
            <button id="next-concept-btn" class="wood-button" style="padding: 12px 24px; font-size: 1rem;">Continue to Next Concept</button>
        </div>
    `;

    if (curtain) {
        curtain.appendChild(badgeOverlay);
    } else {
        container.appendChild(badgeOverlay);
    }

    // Bind buttons
    document.getElementById('replay-btn').addEventListener('click', () => {
        badgeOverlay.remove();
        resetGame();
    });

    document.getElementById('next-concept-btn').addEventListener('click', () => {
        console.log("Future concept placeholder clicked.");
        alert("Next concept coming soon! You are now a master of Python Lists.");
    });
}

// RENDER: Screen 13 Wisdom Summary static render override
function renderScroll() {
    const panel = document.getElementById('scroll-panel');
    const container = document.getElementById('scroll-items');
    const currentScene = state.scenes[state.currentSceneIndex];
    
    if (!currentScene) return;

    const scrollHeader = panel.querySelector('.scroll-header');

    if (currentScene.id === 13) {
        if (scrollHeader) {
            scrollHeader.textContent = "Wisdom Acquired";
            scrollHeader.style.fontSize = "1.25rem"; // Fit nicely
        }
        
        // Show the summary items checklist instead of standard scroll
        panel.classList.add('visible');
        container.innerHTML = '';
        
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary-container';
        
        currentScene.summaryList.forEach((item, index) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = 'summary-item';
                div.innerHTML = `<span class="summary-checkmark">✔</span> <span>${item}</span>`;
                summaryDiv.appendChild(div);
            }, index * 200);
        });
        
        container.appendChild(summaryDiv);
        return;
    }
    
    // Reset header for other scenes
    if (scrollHeader) {
        scrollHeader.textContent = "Royal Scroll";
        scrollHeader.style.fontSize = "1.4rem";
    }
    
    if (!currentScene.scrollVisible) {
        panel.classList.remove('visible');
        return;
    }
    
    panel.classList.add('visible');
    container.innerHTML = '';
    
    if (state.suppliesList.length === 0) {
        container.innerHTML = '<div class="scroll-empty-text">Scroll is empty</div>';
        return;
    }
    
    // Toggle compact mode if scroll list is long to avoid overflow/scrollbars
    if (state.suppliesList.length >= 5) {
        container.classList.add('compact');
    } else {
        container.classList.remove('compact');
    }
    
    state.suppliesList.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'scroll-item';
        
        // Highlight third item on index page (Screen 10) once completed
        if (currentScene.id === 10 && index === 2 && state.codeApproved) {
            div.classList.add('highlighted');
        }
        
        div.innerHTML = `📜 ${item}`;
        container.appendChild(div);
    });
}

/* =========================================================================
   PYTHON CODE-CHECKING MODULE (PURE VALIDATION FUNCTIONS)
   ========================================================================= */

/**
 * Pattern 1: List Creation
 * Format: variable = ["item1", "item2", ...]
 * Forgiving of spacing, single/double quotes, but case-sensitive on variable name.
 * 
 * --- UNIT TEST CASES ---
 * VALID INPUTS:
 * 1. supplies = ["Rice", "Oil", "Shield", "Medicine"]
 * 2. supplies=['Rice', 'Oil', 'Shield', 'Medicine']
 * 3. supplies = [ "Rice" , "Oil" , "Shield" , "Medicine" ]
 * 4. supplies=["Rice","Oil","Shield","Medicine"]
 * 
 * INVALID INPUTS:
 * 1. Supplies = ["Rice", "Oil", "Shield", "Medicine"] (wrong capitalization of variable)
 * 2. supplies = ("Rice", "Oil", "Shield", "Medicine") (parentheses instead of brackets)
 * 3. supplies = ["Rice", Oil, "Shield", "Medicine"] (missing quote on Oil)
 * 4. supplies = ["Rice", "Oil", "Shield", "Medicine" (missing closing bracket)
 */
function parseListCreation(code, variableName) {
    const escapedVar = variableName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`^\\s*${escapedVar}\\s*=\\s*\\[\\s*(.*?)\\s*\\]\\s*$`);
    const match = code.match(regex);
    if (!match) return null;
    
    const itemsStr = match[1].trim();
    if (itemsStr === "") return [];
    
    const rawItems = itemsStr.split(',');
    const items = [];
    for (let item of rawItems) {
        item = item.trim();
        const quoteMatch = item.match(/^(['"])(.*?)\1$/);
        if (!quoteMatch) return null; // Invalid string bounds or unquoted item
        items.push(quoteMatch[2]);
    }
    return items;
}

/**
 * Pattern 2: Append Operation
 * Format: variable.append("item")
 * Forgiving of spacing, single/double quotes, case-sensitive on 'append'.
 * 
 * --- UNIT TEST CASES ---
 * VALID INPUTS:
 * 1. supplies.append("Horse")
 * 2. supplies.append('Horse')
 * 3. supplies . append ( "Horse" )
 * 
 * INVALID INPUTS:
 * 1. supplies.Append("Horse") (wrong capitalization on method)
 * 2. supplies.append(Horse) (missing quotes on string parameter)
 * 3. supplies.append("Horse" (missing closing parenthesis)
 * 4. supplies.push("Horse") (javascript push instead of python append)
 */
function parseAppend(code, variableName) {
    const escapedVar = variableName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`^\\s*${escapedVar}\\s*\\.\\s*append\\s*\\(\\s*(['"])(.*?)\\1\\s*\\)\\s*$`);
    const match = code.match(regex);
    if (!match) return null;
    return match[2];
}

/**
 * Pattern 3: Remove Operation
 * Format: variable.remove("item")
 * Forgiving of spacing, single/double quotes, case-sensitive on 'remove'.
 * 
 * --- UNIT TEST CASES ---
 * VALID INPUTS:
 * 1. supplies.remove("Oil")
 * 2. supplies.remove('Oil')
 * 3. supplies . remove ( "Oil" )
 * 
 * INVALID INPUTS:
 * 1. supplies.Remove("Oil") (wrong capitalization)
 * 2. supplies.remove(Oil) (missing quotes)
 * 3. supplies.delete("Oil") (javascript delete)
 * 4. supplies.remove() (missing item argument)
 */
function parseRemove(code, variableName) {
    const escapedVar = variableName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`^\\s*${escapedVar}\\s*\\.\\s*remove\\s*\\(\\s*(['"])(.*?)\\1\\s*\\)\\s*$`);
    const match = code.match(regex);
    if (!match) return null;
    return match[2];
}

/**
 * Pattern 4: Length Operation
 * Format: len(variable)
 * Forgiving of spacing, case-sensitive on 'len'.
 * 
 * --- UNIT TEST CASES ---
 * VALID INPUTS:
 * 1. len(supplies)
 * 2. len ( supplies )
 * 
 * INVALID INPUTS:
 * 1. Len(supplies) (capitalized len)
 * 2. len(Supplies) (capitalized variable)
 * 3. supplies.length (javascript length)
 * 4. length(supplies) (wrong function name)
 */
function parseLen(code, variableName) {
    const escapedVar = variableName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`^\\s*len\\s*\\(\\s*${escapedVar}\\s*\\)\\s*$`);
    return regex.test(code);
}

/**
 * Pattern 5: Index Access Operation
 * Format: variable[index]
 * Forgiving of spacing, case-sensitive on variable name.
 * 
 * --- UNIT TEST CASES ---
 * VALID INPUTS:
 * 1. supplies[2]
 * 2. supplies [ 2 ]
 * 
 * INVALID INPUTS:
 * 1. Supplies[2] (wrong capitalization of variable)
 * 2. supplies(2) (parentheses instead of brackets)
 * 3. supplies[two] (index is not an integer)
 * 4. supplies[-1] (negative index not supported in our visual lesson)
 */
function parseIndexing(code, variableName) {
    const escapedVar = variableName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`^\\s*${escapedVar}\\s*\\[\\s*(\\d+)\\s*\\]\\s*$`);
    const match = code.match(regex);
    if (!match) return null;
    return parseInt(match[1], 10);
}

// Global Validator Coordinator
function validateInput(input, expectedPattern) {
    // 1. Check if expected pattern is list creation
    if (expectedPattern.includes('list assignment') || expectedPattern.includes('supplies = [') && expectedPattern.includes('Rice')) {
        const items = parseListCreation(input, "supplies");
        if (items === null) return false;
        
        if (expectedPattern.includes('Medicine')) {
            // Screen 6: ["Rice", "Oil", "Shield", "Medicine"]
            return items.length === 4 && 
                   items[0] === "Rice" && 
                   items[1] === "Oil" && 
                   items[2] === "Shield" && 
                   items[3] === "Medicine";
        } else {
            // Screen 12 task 1: ["Rice", "Oil", "Shield"]
            return items.length === 3 && 
                   items[0] === "Rice" && 
                   items[1] === "Oil" && 
                   items[2] === "Shield";
        }
    }
    
    // 2. Check if expected pattern is append
    if (expectedPattern.includes('append') || expectedPattern.includes('append("Horse")') || expectedPattern.includes('append("Bow")') || expectedPattern.includes('append("Medicine")')) {
        const item = parseAppend(input, "supplies");
        if (item === null) return false;
        
        if (expectedPattern.includes('Horse')) return item === "Horse";
        if (expectedPattern.includes('Bow')) return item === "Bow";
        if (expectedPattern.includes('Medicine')) return item === "Medicine";
        return false;
    }
    
    // 3. Check if expected pattern is remove
    if (expectedPattern.includes('remove') || expectedPattern.includes('remove("Oil")') || expectedPattern.includes('remove("Bow")')) {
        const item = parseRemove(input, "supplies");
        if (item === null) return false;
        
        if (expectedPattern.includes('Oil')) return item === "Oil";
        if (expectedPattern.includes('Bow')) return item === "Bow";
        return false;
    }
    
    // 4. Check if expected pattern is length
    if (expectedPattern.includes('len(supplies)')) {
        return parseLen(input, "supplies");
    }
    
    // 5. Check if expected pattern is indexing
    if (expectedPattern.includes('supplies[2]')) {
        const idx = parseIndexing(input, "supplies");
        return idx === 2;
    }
    
    // Fallback: literal check
    return input.trim() === expectedPattern.trim();
}

// Execute normal validation
function runCodeValidation(input, scene) {
    if (validateInput(input, scene.expectedPattern)) {
        state.codeApproved = true;
        
        if (scene.id === 6 && scene.successScrollItems) {
            state.suppliesList = [...scene.successScrollItems];
        }
        
        renderScroll();
        
        if (scene.id === 9) {
            const count = state.suppliesList.length;
            showFeedback(`>>> len(supplies)<br><strong style="font-size: 2.2rem; color: #10b981; display: block; margin: 8px 0; font-family: monospace;">${count}</strong>Correct! The list contains exactly ${count} items.`, false);
        } else {
            showFeedback("Correct! The command ran successfully.", false);
        }
        
        updateContinueIndicator();
    } else {
        state.codeApproved = false;
        showFeedback(`Syntax Error: ${getHintMessage(scene.id, input)}`, true);
        updateContinueIndicator();
    }
}

// Execute substaged validation
function runStepValidation(input, scene, substep) {
    if (validateInput(input, substep.expectedPattern)) {
        if (substep.scrollAction) {
            const action = substep.scrollAction;
            if (action.type === 'set') {
                state.suppliesList = [...action.items];
            } else if (action.type === 'add') {
                state.suppliesList.push(action.item);
            } else if (action.type === 'remove') {
                state.suppliesList = state.suppliesList.filter(i => i !== action.item);
            }
        }
        
        renderScroll();
        
        if (state.substepIndex < scene.substeps.length - 1) {
            showFeedback("Correct! Code executed. Moving to next practice...", false);
            setTimeout(() => {
                state.substepIndex++;
                // Clear scroll for list-creation practice step
                if (scene.id === 6 && state.substepIndex === 1) {
                    state.suppliesList = [];
                    renderScroll();
                }
                revealInteraction();
            }, 1000);
        } else {
            state.codeApproved = true;
            showFeedback("Excellent! Both steps successfully completed.", false);
            updateContinueIndicator();
        }
    } else {
        // Map substep key for hints
        let fakeSceneId = 6;
        if (scene.id === 7) fakeSceneId = 7;
        else if (scene.id === 8) fakeSceneId = 8;
        showFeedback(`Syntax Error: ${getHintMessage(fakeSceneId, input)}`, true);
    }
}

// Execute quiz validation
function runQuizValidation(input, scene, substep) {
    if (validateInput(input, substep.expectedPattern)) {
        if (substep.step === 1) {
            state.suppliesList = ["Rice", "Oil", "Shield", "Horse"];
        } else if (substep.step === 2) {
            state.suppliesList = ["Rice", "Shield"];
        }
        renderScroll();

        if (state.substepIndex < scene.substeps.length - 1) {
            showFeedback("Correct puzzle! Moving to next...", false);
            setTimeout(() => {
                state.substepIndex++;
                revealInteraction();
            }, 1000);
        } else {
            state.codeApproved = true;
            showFeedback("Congratulations! All puzzle codes solved successfully.", false);
            updateContinueIndicator();
        }
    } else {
        showFeedback(`Syntax Error: ${getHintMessage(11, input)}`, true);
    }
}

// Execute final checklist validation
function runFinalMissionValidation(input, scene, activeTask) {
    if (validateInput(input, activeTask.expectedPattern)) {
        if (activeTask.scrollAction) {
            const action = activeTask.scrollAction;
            if (action.type === 'set') {
                state.suppliesList = [...action.items];
            } else if (action.type === 'add') {
                state.suppliesList.push(action.item);
            } else if (action.type === 'remove') {
                state.suppliesList = state.suppliesList.filter(i => i !== action.item);
            }
        }
        renderScroll();

        if (state.substepIndex < scene.substeps.length - 1) {
            showFeedback(`Task ${state.substepIndex + 1} complete! Unlocking next...`, false);
            setTimeout(() => {
                state.substepIndex++;
                revealInteraction();
            }, 1000);
        } else {
            state.codeApproved = true;
            const count = state.suppliesList.length;
            showFeedback(`>>> len(supplies)<br><strong style="font-size: 2.2rem; color: #10b981; display: block; margin: 8px 0; font-family: monospace;">${count}</strong>Scroll fully configured! The army is ready to march.`, false);
            updateContinueIndicator();
        }
    } else {
        // Map final mission step to appropriate hint scene context
        const mapIds = [6, 7, 8, 9];
        const fakeId = mapIds[state.substepIndex];
        showFeedback(`Syntax Error: ${getHintMessage(fakeId, input)}`, true);
    }
}

// Helper: Show terminal log outputs
function showFeedback(msg, isError) {
    const el = document.getElementById('terminal-feedback');
    if (!el) return;

    el.innerHTML = msg;
    el.className = 'terminal-feedback'; // Reset
    el.classList.add(isError ? 'error' : 'success');
}

// Helper: Provide hints based on screen and user input
function getHintMessage(sceneId, input) {
    const clean = input.trim();
    const hasCapitalSupplies = clean.includes('Supplies');
    const hasParenthesesInsteadOfBrackets = clean.includes('supplies(') || clean.includes('=(') || (clean.startsWith('supplies =') && clean.includes('('));

    switch(sceneId) {
        case 6: // supplies = ["Rice", "Oil", "Shield", "Medicine"]
            if (hasCapitalSupplies) return "Python is case-sensitive. Check the capitalization of 'supplies'.";
            if (hasParenthesesInsteadOfBrackets) return "Lists in Python must be defined using square brackets [ ], not parentheses ( ).";
            if (!clean.includes('[') || !clean.includes(']')) return "Remember to wrap your list items inside square brackets [ ].";
            if ((clean.match(/"/g) || []).length < 2 && (clean.match(/'/g) || []).length < 2) return "Each text item inside the list needs to be wrapped in quotes (e.g. \"Rice\").";
            return "Make sure the list is assigned to 'supplies' and contains all four items in the correct order, separated by commas.";
            
        case 7: // supplies.append("Horse") or supplies.append("Bow")
            if (clean.includes('.push')) return "Remember, Python uses '.append()' to add items, not Javascript's '.push()'.";
            if (clean.includes('.Append')) return "Python method names are lowercase. Try using '.append()' instead of '.Append()'.";
            if (hasCapitalSupplies) return "Python is case-sensitive. Make sure 'supplies' is in lowercase.";
            if (clean.includes('append') && !clean.includes('(')) return "Don't forget the parentheses after '.append'.";
            return "To add an item, use the format: supplies.append(\"ItemName\")";
            
        case 8: // supplies.remove("Oil") or supplies.remove("Bow")
            if (clean.includes('.Remove')) return "Python method names are lowercase. Try using '.remove()' instead of '.Remove()'.";
            if (clean.includes('delete') || clean.includes('pop')) return "To remove an item by name, use the '.remove()' method.";
            if (hasCapitalSupplies) return "Check the capitalization of 'supplies'.";
            return "To remove an item, use the format: supplies.remove(\"ItemName\")";
            
        case 9: // len(supplies)
            if (clean.includes('.length') || clean.includes('.size')) return "Python uses the len() function, not a '.length' property.";
            if (clean.includes('Len(')) return "Python keywords are case-sensitive. Use lowercase 'len()'.";
            if (hasCapitalSupplies) return "Check the capitalization of 'supplies' inside the parentheses.";
            return "Use the len() function with the name of your list inside the parentheses, like: len(list_name)";
            
        case 10: // supplies[2]
            if (clean.includes('supplies(')) return "Index access in Python uses square brackets [ ], not parentheses ( ).";
            if (clean.includes('[3]') || clean.includes('[1]')) return "Index counts start at 0. So first is [0], second is [1], third is [2]. Adjust your index.";
            if (hasCapitalSupplies) return "Check the capitalization of 'supplies'.";
            return "Access an item by index using square brackets after the list name. Example: list_name[0] accesses the first item.";
            
        case 11: // Reverse engineering screen
            if (clean.includes('append') && !clean.includes('Horse')) return "Check which item is being added in the final scroll preview (e.g. \"Horse\").";
            if (clean.includes('remove') && !clean.includes('Oil')) return "Check which item is missing in the final scroll preview (e.g. \"Oil\").";
            return "Identify the exact command needed. E.g. supplies.append(\"Item\"), supplies.remove(\"Item\"), or len(supplies).";
            
        default:
            return "Double check spellings, capitalization, commas, and parentheses.";
    }
}

// Scattered paper animations for Screen 2
function startScatteredPapersAnimation() {
    const container = document.getElementById('scattered-papers');
    container.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const currentScene = state.scenes[state.currentSceneIndex];
            if (!currentScene || currentScene.id !== 2) return;
            
            const paper = document.createElement('div');
            paper.className = 'parchment-paper';
            
            // Random horizontal start position
            paper.style.left = `${Math.random() * 80 + 10}%`;
            paper.style.top = '-100px';
            
            // Set landing coordinates and angles using CSS vars
            const targetX = `${(Math.random() - 0.5) * 140}px`;
            const targetY = `${Math.random() * 220 + 200}px`;
            const targetAngle = `${(Math.random() - 0.5) * 80}deg`;
            
            paper.style.setProperty('--target-x', targetX);
            paper.style.setProperty('--target-y', targetY);
            paper.style.setProperty('--target-angle', targetAngle);
            
            container.appendChild(paper);
        }, i * 220);
    }
}

// Reset Game State for replay
function resetGame() {
    localStorage.removeItem('royal_supply_scroll_state');
    
    // Close curtains first for transitions
    const curtain = document.getElementById('curtain-overlay');
    if (curtain) {
        curtain.classList.remove('open');
    }
    
    state.currentSceneIndex = 0;
    state.dialogueIndex = 0;
    state.substepIndex = 0;
    state.codeApproved = false;
    state.suppliesList = [];
    
    // Clear custom dialogue override on Screen 3
    if (state.scenes[2]) {
        state.scenes[2].dialogue = [];
    }

    startScene(0, false);

    // Pull open curtains again with prologue after setup delay
    setTimeout(() => {
        let container = document.getElementById('prologue-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'prologue-container';
            container.className = 'prologue-container';
            if (curtain) curtain.appendChild(container);
        }
        prologueSkipped = false;
        prologueTimeouts = [];
        runPrologue();
    }, 1000);
}

// LocalStorage Persistence Helpers
function saveState() {
    try {
        localStorage.setItem('royal_supply_scroll_state', JSON.stringify({
            currentSceneIndex: state.currentSceneIndex,
            suppliesList: state.suppliesList,
            substepIndex: state.substepIndex
        }));
    } catch (e) {
        console.error('Failed to save state to localStorage:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('royal_supply_scroll_state');
        if (saved) {
            const data = JSON.parse(saved);
            state.currentSceneIndex = data.currentSceneIndex ?? 0;
            state.suppliesList = data.suppliesList ?? [];
            state.substepIndex = data.substepIndex ?? 0;
            return true;
        }
    } catch (e) {
        console.error('Failed to load state from localStorage:', e);
    }
    return false;
}
