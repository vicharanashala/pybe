/* =========================================================
   Maya's Midnight Bakery — Story-First Python Learning Engine
   ========================================================= */

// --- Audio Engine (Disabled / Silent) ---
class SoundEngine {
  init() {}
  playBell() {}
  playFreeze() {}
  playCorrect() {}
  playWrong() {}
}

const sounds = new SoundEngine();

// --- Story Data: 5 Slow-Paced Chapters ---
const CHAPTERS = [
  {
    id: 1,
    title: "The Midnight Rush",
    stageBadge: "Stage 1 of 5",
    stageTime: "🌙 12:00 AM • Midnight Opening",
    statusText: "OPERATIONAL",
    powerStatus: "⚡ 100% Stable",
    queueStatus: "🚶 6 in line",
    cardStatus: "💳 Ready",
    codeBadge: "Raw Machine Code",
    codeSnippet: `<div class="code-line" id="codeLine1"><span class="code-line-num">1</span><span class="code-comment"># Maya's early bakery register</span></div>
<div class="code-line" id="codeLine2"><span class="code-line-num">2</span><span class="code-fn">quantity</span> = <span class="code-fn">int</span>(customer_input)</div>
<div class="code-line" id="codeLine3"><span class="code-line-num">3</span><span class="code-fn">total</span> = quantity * <span class="code-num">4</span></div>
<div class="code-line" id="codeLine4"><span class="code-line-num">4</span><span class="code-fn">print</span>(<span class="code-str">f"Total: \${total}"</span>)</div>`,
    codeGlossary: `<strong>Story Insight:</strong> Maya programmed her register like an exact recipe: read the input, convert it to a number with <code>int()</code>, and multiply by $4. But code has no common sense—it assumes customers will always follow the happy path!`,
    scenes: [
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0f172a"/>
                <stop offset="100%" stop-color="#1e293b"/>
              </linearGradient>
              <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#78350f"/>
                <stop offset="100%" stop-color="#92400e"/>
              </linearGradient>
            </defs>
            <rect width="600" height="240" fill="url(#skyGrad)"/>
            <!-- Stars -->
            <circle cx="50" cy="30" r="1.5" fill="#fef08a" opacity="0.8"/>
            <circle cx="120" cy="50" r="2" fill="#fef08a" opacity="0.9"/>
            <circle cx="280" cy="25" r="1.5" fill="#fef08a" opacity="0.7"/>
            <circle cx="480" cy="40" r="2" fill="#fef08a" opacity="0.85"/>
            <!-- Warm Bakery Glow Window -->
            <rect x="80" y="40" width="440" height="150" rx="12" fill="#fef3c7" opacity="0.15"/>
            <!-- Counter -->
            <rect x="0" y="160" width="600" height="80" fill="url(#woodGrad)"/>
            <rect x="0" y="155" width="600" height="6" fill="#b45309"/>
            <!-- Maya the Baker -->
            <g transform="translate(140, 60)">
              <!-- Chef Hat -->
              <ellipse cx="40" cy="20" rx="22" ry="16" fill="#ffffff"/>
              <rect x="24" y="24" width="32" height="14" fill="#f1f5f9"/>
              <!-- Head -->
              <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
              <!-- Cheerful eyes & smile -->
              <circle cx="35" cy="44" r="2" fill="#78350f"/>
              <circle cx="45" cy="44" r="2" fill="#78350f"/>
              <path d="M 36 50 Q 40 55 44 50" stroke="#78350f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
              <!-- Apron / Body -->
              <path d="M 22 62 L 58 62 L 64 105 L 16 105 Z" fill="#d97706"/>
              <rect x="28" y="70" width="24" height="25" rx="3" fill="#ffffff" opacity="0.9"/>
            </g>
            <!-- Brass Register on Counter -->
            <g transform="translate(320, 95)">
              <rect x="0" y="20" width="80" height="50" rx="6" fill="#b45309" stroke="#d97706" stroke-width="2"/>
              <rect x="15" y="0" width="50" height="22" rx="4" fill="#15803d"/>
              <text x="22" y="15" font-family="monospace" font-size="10" fill="#4ade80">OPEN 00</text>
              <ellipse cx="40" cy="70" rx="36" ry="6" fill="#78350f"/>
            </g>
            <!-- Tray of Blueberry Cupcakes -->
            <g transform="translate(440, 140)">
              <ellipse cx="40" cy="18" rx="38" ry="10" fill="#cbd5e1"/>
              <!-- Cupcake 1 -->
              <path d="M 15 15 L 20 8 L 26 15 Z" fill="#9333ea"/>
              <circle cx="20.5" cy="7" r="4" fill="#3b82f6"/>
              <!-- Cupcake 2 -->
              <path d="M 35 15 L 40 8 L 46 15 Z" fill="#9333ea"/>
              <circle cx="40.5" cy="7" r="4" fill="#3b82f6"/>
              <!-- Cupcake 3 -->
              <path d="M 55 15 L 60 8 L 66 15 Z" fill="#9333ea"/>
              <circle cx="60.5" cy="7" r="4" fill="#3b82f6"/>
            </g>
          </svg>
        `,
        narrative: `
          <p class="narrative-p">
            Midnight in Whispering Pines! The bakery air smells of warm cinnamon and wild blueberries.
          </p>
          <div class="story-dialogue">
            <div class="avatar">👩‍🍳</div>
            <div class="dialogue-content">
              <div class="dialogue-speaker">Maya</div>
              <div class="dialogue-text">
                "Welcome to opening night! My new automated register calculates totals instantly so nobody waits in the freezing cold."
              </div>
            </div>
          </div>
          <p class="narrative-p">
            Barnaby the hedgehog orders <strong>2 cupcakes</strong> ($4 each). The machine turns <code>"2"</code> into the number <code>2</code> with <code>int("2")</code>, multiplies <code>2 * 4</code>, and rings up <strong>$8</strong>. Ding!
          </p>
          <div class="story-highlight-box" style="border-color: #f59e0b; background: rgba(245, 158, 11, 0.08);">
            <div class="story-highlight-icon">💡</div>
            <div>
              <strong>Maya's Assumption:</strong> She assumed every customer would always type clean numeric digits like <code>2</code>.
            </div>
          </div>
        `
      },
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#1e1b2e"/>
            <!-- Starry Sky -->
            <circle cx="70" cy="30" r="1.5" fill="#fef08a"/>
            <circle cx="520" cy="45" r="1.5" fill="#fef08a"/>
            <!-- Counter -->
            <rect x="0" y="160" width="600" height="80" fill="#78350f"/>
            <rect x="0" y="155" width="600" height="6" fill="#b45309"/>
            <!-- Sammy the Squirrel -->
            <g transform="translate(100, 80)">
              <!-- Bushy Tail -->
              <path d="M 10 70 C -15 30, 20 0, 45 20 C 35 45, 30 65, 35 80 Z" fill="#c2410c"/>
              <!-- Body -->
              <ellipse cx="50" cy="65" rx="16" ry="22" fill="#ea580c"/>
              <!-- Head -->
              <circle cx="58" cy="38" r="14" fill="#ea580c"/>
              <!-- Sleepy Eye -->
              <path d="M 54 38 Q 58 42 62 38" stroke="#431407" stroke-width="2" fill="none"/>
              <!-- Acorn in hand -->
              <circle cx="68" cy="65" r="5" fill="#78350f"/>
            </g>
            <!-- Machine Screen with Sammy's Input -->
            <g transform="translate(260, 60)">
              <rect x="0" y="0" width="180" height="100" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
              <rect x="15" y="15" width="150" height="30" rx="4" fill="#0f172a"/>
              <text x="25" y="35" font-family="monospace" font-size="14" fill="#f87171">"two"</text>
              <text x="25" y="70" font-family="sans-serif" font-size="11" fill="#cbd5e1">Pressing ENTER...</text>
            </g>
          </svg>
        `,
        narrative: `
          <p class="narrative-p">
            Next in line is Sammy the squirrel. His paws are shivering from the cold and his eyelids are heavy with sleep.
          </p>
          <div class="story-dialogue">
            <div class="avatar">🐿️</div>
            <div class="dialogue-content">
              <div class="dialogue-speaker">Sammy the Squirrel</div>
              <div class="dialogue-text">
                "*Yawn*... I can barely keep my eyes open. Let me type out my order..."
              </div>
            </div>
          </div>
          <p class="narrative-p">
            When asked for quantity, sleepy Sammy types the word: <strong>"two"</strong> instead of the digit <code>2</code>. He smiles and taps <em>Ring Up</em>.
          </p>
        `
      },
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#2d1212"/>
            <!-- Steam / Smoke Puffs from Machine -->
            <circle cx="340" cy="70" r="22" fill="#ef4444" opacity="0.3"/>
            <circle cx="370" cy="50" r="30" fill="#f87171" opacity="0.25"/>
            <circle cx="320" cy="40" r="18" fill="#fca5a5" opacity="0.2"/>
            <!-- Counter -->
            <rect x="0" y="160" width="600" height="80" fill="#5c2609"/>
            <!-- Frozen Machine -->
            <g transform="translate(280, 85)">
              <rect x="0" y="10" width="100" height="65" rx="6" fill="#3b0707" stroke="#dc2626" stroke-width="3"/>
              <rect x="10" y="18" width="80" height="30" rx="4" fill="#180404"/>
              <text x="18" y="38" font-family="monospace" font-weight="bold" font-size="12" fill="#ef4444">! CRASH !</text>
              <!-- Sparks -->
              <path d="M -10 20 L 5 15 L 0 30" stroke="#fbbf24" stroke-width="2" fill="none"/>
              <path d="M 105 25 L 115 15 L 112 35" stroke="#fbbf24" stroke-width="2" fill="none"/>
            </g>
            <!-- Shocked Maya -->
            <g transform="translate(100, 70)">
              <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
              <!-- Wide shocked eyes -->
              <circle cx="34" cy="44" r="3.5" fill="#ffffff"/>
              <circle cx="34" cy="44" r="1.5" fill="#000000"/>
              <circle cx="46" cy="44" r="3.5" fill="#ffffff"/>
              <circle cx="46" cy="44" r="1.5" fill="#000000"/>
              <ellipse cx="40" cy="54" rx="4" ry="5" fill="#78350f"/>
            </g>
            <!-- Crowd waiting in line -->
            <g transform="translate(420, 110)">
              <circle cx="20" cy="30" r="12" fill="#64748b"/>
              <circle cx="50" cy="30" r="12" fill="#475569"/>
              <circle cx="80" cy="30" r="12" fill="#334155"/>
              <text x="10" y="75" font-family="sans-serif" font-size="10" fill="#fca5a5">Line halted: 6 waiting</text>
            </g>
          </svg>
        `,
        narrative: `
          <div class="story-highlight-box" style="border-color: #ef4444; background: #fef2f2;">
            <div class="story-highlight-icon">💥</div>
            <div>
              <strong>*BZZZT!*</strong> Red smoke puffs from the register. The screen dies with a crash:
              <br><code>ValueError: invalid literal for int(): 'two'</code>
            </div>
          </div>
          <p class="narrative-p">
            Python knows how to turn digits like <code>'2'</code> into numbers, but English words like <code>'two'</code> cause an immediate halt! Because there was no backup plan, the entire register froze.
          </p>
          <div class="story-dialogue">
            <div class="avatar">👩‍🍳</div>
            <div class="dialogue-content">
              <div class="dialogue-speaker">Maya</div>
              <div class="dialogue-text">
                "Oh no! The screen is locked and 6 customers are stranded in the cold! My code had no safety net for words."
              </div>
            </div>
          </div>
        `
      }
    ],
    checkpoints: [
      {
        question: "Why did Maya's bakery register suddenly freeze when Sammy typed 'two'?",
        options: [
          {
            text: "The machine exceeded its input buffer, causing the register hardware to mechanically break.",
            correct: false,
            feedback: "The register hardware is brand new and working fine! The issue wasn't a broken gear or buffer limit—it was an unhandled software crash when converting letters into numbers."
          },
          {
            text: "The machine expects numeric digits; the word 'two' triggered an unhandled conversion error.",
            correct: true,
            feedback: "Spot on! The machine knows how to multiply digits like 2 or 5, but when handed English letters without instructions on how to read words, its calculation step panicked and crashed."
          },
          {
            text: "The register connection timed out because Sammy delayed pressing the main Ring Up button.",
            correct: false,
            feedback: "Sammy pressed Enter right away! The freeze wasn't a network or timeout issue—it crashed the very instant the machine tried to calculate with the word 'two'."
          }
        ]
      },
      {
        question: "What happened to the other 6 customers waiting outside in the cold?",
        options: [
          {
            text: "The register automatically skipped Sammy's order, allowing the next customer in line to be served.",
            correct: false,
            feedback: "In a protected program that would happen! But right now Maya has no error handling—when a crash occurs, the whole script terminates."
          },
          {
            text: "The entire checkout process crashed on an error, locking the register so nobody else could be served.",
            correct: true,
            feedback: "Exactly! Without guardrails, a crash in one transaction halts the whole program, leaving all customers waiting."
          },
          {
            text: "The register automatically saved Sammy's order and safely switched into an offline cash-only mode.",
            correct: false,
            feedback: "There is no automated fallback configured yet. The raw Python program completely froze on the unhandled error."
          }
        ]
      }
    ],
    decisionScene: {
      badge: "Stage 1 of 5",
      time: "💡 Decision Point • 12:15 AM",
      title: "The Midnight Rush • Decision Point",
      illustrationSvg: `
        <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgDec1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e182a"/>
              <stop offset="100%" stop-color="#2d1d1a"/>
            </linearGradient>
          </defs>
          <rect width="600" height="240" fill="url(#bgDec1)"/>
          <circle cx="300" cy="120" r="140" fill="#fef3c7" opacity="0.08"/>
          <rect x="0" y="165" width="600" height="75" fill="#5c2609"/>
          <rect x="0" y="160" width="600" height="5" fill="#b45309"/>
          <!-- Thinking Maya with Notepad -->
          <g transform="translate(110, 55)">
            <ellipse cx="40" cy="20" rx="22" ry="16" fill="#ffffff"/>
            <rect x="24" y="24" width="32" height="14" fill="#f1f5f9"/>
            <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
            <circle cx="36" cy="43" r="2" fill="#78350f"/>
            <circle cx="46" cy="43" r="2" fill="#78350f"/>
            <path d="M 37 53 Q 41 50 45 53" stroke="#78350f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
            <path d="M 22 62 L 58 62 L 64 105 L 16 105 Z" fill="#d97706"/>
            <rect x="28" y="70" width="24" height="25" rx="3" fill="#ffffff" opacity="0.9"/>
            <line x1="56" y1="75" x2="72" y2="60" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
            <circle cx="40" cy="-5" r="14" fill="#fef08a" opacity="0.95"/>
            <text x="34" y="0" font-size="14">💡</text>
          </g>
          <!-- Halted Register with Diagnosis Screen -->
          <g transform="translate(270, 75)">
            <rect x="0" y="15" width="120" height="75" rx="8" fill="#3b1515" stroke="#ef4444" stroke-width="2"/>
            <rect x="12" y="26" width="96" height="36" rx="4" fill="#180404"/>
            <text x="18" y="44" font-family="monospace" font-size="10" fill="#fca5a5">ValueError: 'two'</text>
            <text x="20" y="56" font-family="monospace" font-size="9" fill="#ef4444">DIAGNOSIS NEEDED</text>
            <circle cx="100" cy="74" r="8" fill="#78350f" stroke="#d97706" stroke-width="2"/>
          </g>
          <!-- Sammy Squirrel Hopeful -->
          <g transform="translate(430, 85)">
            <ellipse cx="40" cy="48" rx="20" ry="24" fill="#b45309"/>
            <circle cx="36" cy="30" r="14" fill="#d97706"/>
            <circle cx="30" cy="24" r="5" fill="#92400e"/>
            <circle cx="32" cy="30" r="2" fill="#000"/>
            <circle cx="42" cy="30" r="2" fill="#000"/>
            <path d="M 33 36 Q 37 40 41 36" stroke="#451a03" stroke-width="1.5" fill="none"/>
            <path d="M 52 50 Q 75 35 70 70" stroke="#b45309" stroke-width="10" stroke-linecap="round" fill="none"/>
            <text x="15" y="90" font-family="sans-serif" font-size="11" fill="#fed7aa">"Can we fix it?"</text>
          </g>
        </svg>
      `,
      narrative: `
        <div class="story-highlight-box" style="border-color: #f59e0b; background: rgba(245, 158, 11, 0.08);">
          <div class="story-highlight-icon">💡</div>
          <div>
            <strong>Crash Diagnosis:</strong> Sammy typed letters instead of digits, halting the unprotected register.
          </div>
        </div>
        <div class="story-dialogue">
          <div class="avatar">👩‍🍳</div>
          <div class="dialogue-content">
            <div class="dialogue-speaker">Maya</div>
            <div class="dialogue-text">
              "Help me diagnose what happened so we can build a safety net!"
            </div>
          </div>
        </div>
      `
    }
  },
  {
    id: 2,
    title: "Putting Up a Guardrail",
    stageBadge: "Stage 2 of 5",
    stageTime: "🌙 1:15 AM • The Safety Net",
    statusText: "GUARDED",
    powerStatus: "⚡ Protected",
    queueStatus: "🚶 5 in line",
    cardStatus: "💳 Ready",
    codeBadge: "The Guardrail Recipe",
    codeSnippet: `<div class="code-line" id="codeLine1"><span class="code-line-num">1</span><span class="kw-try">try</span>:</div>
<div class="code-line" id="codeLine2"><span class="code-line-num">2</span>    <span class="code-fn">quantity</span> = <span class="code-fn">int</span>(customer_input)</div>
<div class="code-line" id="codeLine3"><span class="code-line-num">3</span>    <span class="code-fn">total</span> = quantity * <span class="code-num">4</span></div>
<div class="code-line" id="codeLine4"><span class="code-line-num">4</span>    <span class="code-fn">print</span>(<span class="code-str">f"Total: \${total}"</span>)</div>
<div class="code-line" id="codeLine5"><span class="code-line-num">5</span><span class="kw-except">except</span>:</div>
<div class="code-line" id="codeLine6"><span class="code-line-num">6</span>    <span class="code-fn">print</span>(<span class="code-str">"Oops! Please use digits like 2, not letters."</span>)</div>`,
    codeGlossary: `<strong>Story Insight:</strong> <code>try:</code> attempts the risky calculation; <code>except:</code> catches any stumble and displays a friendly note, keeping the register online!`,
    scenes: [
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#131e2b"/>
            <!-- Crescent Moon -->
            <path d="M 500 30 A 25 25 0 1 0 540 65 A 20 20 0 1 1 500 30 Z" fill="#fde68a"/>
            <!-- Maya's Workbench -->
            <rect x="0" y="170" width="600" height="70" fill="#582a0b"/>
            <!-- Steaming Cup of Tea -->
            <g transform="translate(120, 140)">
              <rect x="0" y="8" width="28" height="22" rx="4" fill="#e2e8f0"/>
              <!-- Steam -->
              <path d="M 8 5 Q 12 0 8 -6" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
              <path d="M 18 5 Q 22 0 18 -6" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
            </g>
            <!-- Maya with Idea Lightbulb -->
            <g transform="translate(240, 70)">
              <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
              <circle cx="35" cy="44" r="2" fill="#78350f"/>
              <circle cx="45" cy="44" r="2" fill="#78350f"/>
              <path d="M 36 50 Q 40 55 44 50" stroke="#78350f" stroke-width="2" fill="none"/>
              <!-- Glowing Lightbulb -->
              <circle cx="40" cy="5" r="12" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>
              <rect x="36" y="17" width="8" height="5" fill="#94a3b8"/>
              <path d="M 40 -12 L 40 -8" stroke="#fde047" stroke-width="2"/>
              <path d="M 23 -3 L 26 0" stroke="#fde047" stroke-width="2"/>
              <path d="M 57 -3 L 54 0" stroke="#fde047" stroke-width="2"/>
            </g>
            <!-- Blueprint / Pad -->
            <g transform="translate(360, 110)">
              <rect x="0" y="0" width="130" height="70" rx="4" fill="#fefce8" stroke="#ca8a04" stroke-width="1.5"/>
              <text x="12" y="22" font-family="sans-serif" font-weight="bold" font-size="10" fill="#854d0e">STEP 1: Attempt</text>
              <text x="12" y="42" font-family="sans-serif" font-weight="bold" font-size="10" fill="#047857">STEP 2: Safety Catch</text>
            </g>
          </svg>
        `,
        narrative: `
          <p class="narrative-p">
            Maya reboots the machine and sips warm chamomile tea to think.
          </p>
          <div class="story-dialogue">
            <div class="avatar">👩‍🍳</div>
            <div class="dialogue-content">
              <div class="dialogue-speaker">Maya</div>
              <div class="dialogue-text">
                "When pulling hot trays from an oven, I wear oven mitts. Why was my code handling customer inputs bare-handed? I need a safety net!"
              </div>
            </div>
          </div>
          <div class="story-highlight-box" style="border-color: #38bdf8; background: #f0f9ff;">
            <div class="story-highlight-icon">🛡️</div>
            <div>
              <strong>The 2-Step Guardrail:</strong>
              <br>• <strong><code>try:</code></strong> Attempt the risky operation under protection.
              <br>• <strong><code>except:</code></strong> If it stumbles, catch the fall, show a kind note, and stay running!
            </div>
          </div>
        `
      },
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#1e293b"/>
            <!-- Counter -->
            <rect x="0" y="160" width="600" height="80" fill="#78350f"/>
            <!-- Guardrail Safety Net Visualized -->
            <g transform="translate(180, 50)">
              <rect x="0" y="0" width="240" height="120" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
              <!-- Green Safe Zone -->
              <rect x="15" y="15" width="210" height="40" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>
              <text x="30" y="38" font-family="sans-serif" font-size="12" fill="#86efac">try: [ Attempt Math ]</text>
              <!-- Soft Safety Trampoline -->
              <path d="M 20 95 Q 120 115 220 95" stroke="#fb7185" stroke-width="3" fill="none"/>
              <text x="45" y="85" font-family="sans-serif" font-size="11" fill="#fda4af">except: [ Polite Catch Net ]</text>
            </g>
            <!-- Relieved Sammy -->
            <g transform="translate(60, 90)">
              <circle cx="40" cy="40" r="16" fill="#ea580c"/>
              <circle cx="35" cy="38" r="2" fill="#000"/>
              <circle cx="45" cy="38" r="2" fill="#000"/>
              <path d="M 36 44 Q 40 48 44 44" stroke="#000" stroke-width="1.5" fill="none"/>
              <text x="10" y="80" font-family="sans-serif" font-size="10" fill="#fde68a">Sammy retries!</text>
            </g>
          </svg>
        `,
        narrative: `
          <p class="narrative-p">
            Maya adds the guardrail and invites Sammy to try again. Sammy types <strong>"two"</strong> once more and presses <em>Ring Up</em>:
          </p>
          <div class="story-highlight-box" style="border-color: #10b981; background: #ecfdf5;">
            <div class="story-highlight-icon">✨</div>
            <div>
              <strong>What Happens Now:</strong>
              <br>1. <code>try:</code> attempts <code>int("two")</code> and encounters a stumble.
              <br>2. <code>except:</code> catches the fall and shows: <em>"Oops! Please use digits like 2, not letters."</em>
              <br>3. The machine stays 100% powered on!
            </div>
          </div>
          <p class="narrative-p">
            Sammy taps <code>2</code>, collects his muffins, and the queue keeps moving smoothly!
          </p>
        `
      }
    ],
    checkpoints: [
      {
        question: "Now that Maya has added 'try:' and 'except:', what happens if a customer types 'four' into the box?",
        options: [
          {
            text: "The unhandled error crashes the program, forcing Maya to manually reboot the bakery register.",
            correct: false,
            feedback: "That's what used to happen in Stage 1! But now the 'try/except' guardrail intercepts the error before it can crash the machine."
          },
          {
            text: "The error is caught by 'except:', showing a polite retry note and keeping the register running.",
            correct: true,
            feedback: "Bingo! The machine catches the stumble, displays a kind note, and stays wide awake for the next customer."
          },
          {
            text: "Python automatically converts English words into numbers without requiring any safety logic.",
            correct: false,
            feedback: "Python still cannot turn words like 'four' into numbers automatically—what changed is that Maya's code now safely catches that failure."
          }
        ]
      },
      {
        question: "In everyday human words, what is the job of 'try:'?",
        options: [
          {
            text: "It directs the computer to attempt risky instructions while staying ready to catch any failure.",
            correct: true,
            feedback: "Exactly! 'try:' defines the safe testing zone for operations that could fail on unpredictable inputs."
          },
          {
            text: "It automatically inspects and corrects invalid customer input before executing any calculations.",
            correct: false,
            feedback: "'try:' doesn't fix or modify data; it simply monitors execution so that errors don't crash the program."
          },
          {
            text: "It permanently turns off error detection so the machine ignores all problems and never crashes.",
            correct: false,
            feedback: "Errors still occur inside 'try:'! The difference is that they are caught and handled rather than causing a crash."
          }
        ]
      }
    ],
    decisionScene: {
      badge: "Stage 2 of 5",
      time: "💡 Decision Point • 1:15 AM",
      title: "Putting Up a Guardrail • Decision Point",
      illustrationSvg: `
        <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="240" fill="#14211a"/>
          <circle cx="300" cy="120" r="130" fill="#10b981" opacity="0.08"/>
          <rect x="0" y="165" width="600" height="75" fill="#3d2415"/>
          <rect x="0" y="160" width="600" height="5" fill="#059669"/>
          <!-- Sturdy Shield Guardrail -->
          <g transform="translate(230, 45)">
            <path d="M 70 10 L 130 30 L 130 90 Q 70 135 70 140 Q 70 135 10 90 L 10 30 Z" fill="#065f46" stroke="#34d399" stroke-width="3"/>
            <text x="44" y="60" font-family="monospace" font-weight="bold" font-size="14" fill="#a7f3d0">try:</text>
            <text x="32" y="90" font-family="monospace" font-weight="bold" font-size="14" fill="#fde68a">except:</text>
          </g>
          <!-- Maya Smiling Proudly -->
          <g transform="translate(100, 55)">
            <ellipse cx="40" cy="20" rx="22" ry="16" fill="#ffffff"/>
            <rect x="24" y="24" width="32" height="14" fill="#f1f5f9"/>
            <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
            <circle cx="35" cy="44" r="2" fill="#78350f"/>
            <circle cx="45" cy="44" r="2" fill="#78350f"/>
            <path d="M 35 51 Q 40 56 45 51" stroke="#78350f" stroke-width="2" fill="none"/>
            <path d="M 22 62 L 58 62 L 64 105 L 16 105 Z" fill="#059669"/>
            <rect x="28" y="70" width="24" height="25" rx="3" fill="#ffffff" opacity="0.9"/>
          </g>
          <!-- Sammy with Cupcake -->
          <g transform="translate(420, 95)">
            <circle cx="30" cy="30" r="14" fill="#d97706"/>
            <circle cx="26" cy="28" r="2" fill="#000"/>
            <circle cx="34" cy="28" r="2" fill="#000"/>
            <path d="M 45 35 L 50 25 L 56 35 Z" fill="#9333ea"/>
            <circle cx="50" cy="24" r="3" fill="#3b82f6"/>
            <text x="10" y="65" font-family="sans-serif" font-size="11" fill="#6ee7b7">"The screen didn't crash!"</text>
          </g>
        </svg>
      `,
      narrative: `
        <div class="story-highlight-box" style="border-color: #10b981; background: rgba(16, 185, 129, 0.08);">
          <div class="story-highlight-icon">🛡️</div>
          <div>
            <strong>Checkpoint: Mastering the Guardrail!</strong> With <code>try:</code> and <code>except:</code>, Maya's register stayed online when Sammy typed words, printing a polite guide instead of crashing.
          </div>
        </div>
        <div class="story-dialogue">
          <div class="avatar">👩‍🍳</div>
          <div class="dialogue-content">
            <div class="dialogue-speaker">Maya</div>
            <div class="dialogue-text">
              "That guardrail made all the difference! Let's solidify our understanding of what <code>try:</code> and <code>except:</code> do under the hood before our next midnight guest arrives."
            </div>
          </div>
        </div>
        <p class="narrative-p">
          👉 <em>Answer both questions below to master basic exception handling!</em>
        </p>
      `
    }
  },
  {
    id: 3,
    title: "Different Problems, Different Signs",
    stageBadge: "Stage 3 of 5",
    stageTime: "🌙 2:00 AM • Specific Warnings",
    statusText: "SPECIFIC-GUARD",
    powerStatus: "⚡ Intelligent",
    queueStatus: "🚶 4 in line",
    cardStatus: "💳 Ready",
    codeBadge: "Targeted Signs",
    codeSnippet: `<div class="code-line" id="codeLine1"><span class="code-line-num">1</span><span class="kw-try">try</span>:</div>
<div class="code-line" id="codeLine2"><span class="code-line-num">2</span>    <span class="code-fn">friends</span> = <span class="code-fn">int</span>(customer_input)</div>
<div class="code-line" id="codeLine3"><span class="code-line-num">3</span>    <span class="code-fn">cost_per_guest</span> = <span class="code-num">30</span> / friends</div>
<div class="code-line" id="codeLine4"><span class="code-line-num">4</span>    <span class="code-fn">print</span>(<span class="code-str">f"Each pays: \${cost_per_guest}"</span>)</div>
<div class="code-line" id="codeLine5"><span class="code-line-num">5</span><span class="kw-except">except</span> <span class="code-fn">ValueError</span>:</div>
<div class="code-line" id="codeLine6"><span class="code-line-num">6</span>    <span class="code-fn">print</span>(<span class="code-str">"Please type digits like 3, not words!"</span>)</div>
<div class="code-line" id="codeLine7"><span class="code-line-num">7</span><span class="kw-except">except</span> <span class="code-fn">ZeroDivisionError</span>:</div>
<div class="code-line" id="codeLine8"><span class="code-line-num">8</span>    <span class="code-fn">print</span>(<span class="code-str">"You can't split a cake among 0 friends!"</span>)</div>`,
    codeGlossary: `<strong>Key Insight:</strong> Slicing a cake among 0 people is impossible—it triggers a <code>ZeroDivisionError</code>. Word typos trigger a <code>ValueError</code>. Separate <code>except</code> nets diagnose the exact problem!`,
    scenes: [
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#1c1929"/>
            <!-- Oliver the Wise Owl with Glasses -->
            <g transform="translate(100, 70)">
              <!-- Owl Body -->
              <ellipse cx="40" cy="55" rx="26" ry="32" fill="#78350f"/>
              <!-- Belly -->
              <ellipse cx="40" cy="62" rx="18" ry="22" fill="#fed7aa"/>
              <!-- Big Owl Eyes -->
              <circle cx="30" cy="38" r="10" fill="#ffffff"/>
              <circle cx="50" cy="38" r="10" fill="#ffffff"/>
              <circle cx="30" cy="38" r="4" fill="#000000"/>
              <circle cx="50" cy="38" r="4" fill="#000000"/>
              <!-- Round Glasses -->
              <circle cx="30" cy="38" r="12" stroke="#d97706" stroke-width="2" fill="none"/>
              <circle cx="50" cy="38" r="12" stroke="#d97706" stroke-width="2" fill="none"/>
              <line x1="42" y1="38" x2="38" y2="38" stroke="#d97706" stroke-width="2"/>
              <!-- Beak -->
              <polygon points="40,46 36,52 44,52" fill="#ea580c"/>
            </g>
            <!-- Giant Chocolate Mooncake ($30) -->
            <g transform="translate(360, 90)">
              <ellipse cx="50" cy="40" rx="45" ry="20" fill="#451a03"/>
              <ellipse cx="50" cy="35" rx="45" ry="18" fill="#713f12"/>
              <ellipse cx="50" cy="32" rx="38" ry="14" fill="#a16207"/>
              <text x="32" y="36" font-family="sans-serif" font-weight="bold" font-size="12" fill="#fef08a">$30 Cake</text>
            </g>
          </svg>
        `,
        narrative: `
          <p class="narrative-p">
            At 2:00 AM, <strong>Oliver the Owl</strong> wants Maya's <strong>$30 Chocolate Mooncake</strong> using the new bill-splitter.
          </p>
          <div class="story-dialogue">
            <div class="avatar">🦉</div>
            <div class="dialogue-content">
              <div class="dialogue-speaker">Oliver the Owl</div>
              <div class="dialogue-text">
                "Hoo! My picnic friends canceled, so zero guests are sharing with me!"
              </div>
            </div>
          </div>
          <p class="narrative-p">
            When asked how many guests to split between, Oliver types: <strong>0</strong>.
          </p>
        `
      },
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#241b18"/>
            <!-- Visual Breakdown Panel -->
            <g transform="translate(180, 25)">
              <rect x="0" y="0" width="390" height="190" rx="10" fill="#18110d" stroke="#f59e0b" stroke-width="2"/>
              
              <!-- Step 1: int("0") -->
              <rect x="15" y="15" width="360" height="40" rx="6" fill="#14532d" opacity="0.35"/>
              <text x="25" y="40" font-family="monospace" font-size="13" fill="#86efac">1. friends = int("0")</text>
              <text x="225" y="40" font-family="sans-serif" font-weight="bold" font-size="11" fill="#4ade80">➔ 0 (Valid number! ✓)</text>

              <!-- Step 2: 30 / 0 -->
              <rect x="15" y="65" width="360" height="42" rx="6" fill="#7f1d1d" opacity="0.35"/>
              <text x="25" y="91" font-family="monospace" font-size="13" fill="#fca5a5">2. 30 / 0 (Split among 0?)</text>
              <text x="225" y="91" font-family="sans-serif" font-weight="bold" font-size="11" fill="#f87171">➔ ZeroDivisionError! ⚠️</text>

              <!-- Confusing Signboard -->
              <rect x="15" y="118" width="360" height="56" rx="6" fill="#2d1d12" stroke="#ea580c" stroke-width="1.5"/>
              <text x="25" y="138" font-family="sans-serif" font-size="11" fill="#fbbf24">Generic Stage 2 Screen told Oliver:</text>
              <text x="25" y="158" font-family="sans-serif" font-style="italic" font-weight="bold" font-size="11" fill="#f87171">"Oops! Please use digits like 2, not letters!"</text>
            </g>

            <!-- Oliver Puzzled -->
            <g transform="translate(40, 60)">
              <ellipse cx="50" cy="65" rx="32" ry="40" fill="#78350f"/>
              <ellipse cx="50" cy="72" rx="22" ry="28" fill="#fed7aa"/>
              <circle cx="38" cy="48" r="12" fill="#fff"/>
              <circle cx="62" cy="48" r="12" fill="#fff"/>
              <circle cx="38" cy="48" r="5" fill="#000"/>
              <circle cx="62" cy="48" r="5" fill="#000"/>
              <circle cx="38" cy="48" r="14" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
              <circle cx="62" cy="48" r="14" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
              <line x1="50" y1="48" x2="54" y2="48" stroke="#f59e0b" stroke-width="2.5"/>
              <polygon points="50,58 45,66 55,66" fill="#ea580c"/>
              <text x="85" y="32" font-family="sans-serif" font-weight="bold" font-size="22" fill="#facc15">???</text>
              <text x="8" y="135" font-family="sans-serif" font-size="11" fill="#fed7aa">"0 IS a digit!"</text>
            </g>
          </svg>
        `,
        narrative: `
          <div class="story-dialogue">
            <div class="avatar">🦉</div>
            <div class="dialogue-content">
              <div class="dialogue-speaker">Oliver the Owl</div>
              <div class="dialogue-text">
                "Hoo? Your screen says: <em>'Use digits, not letters!'</em> But <strong>0</strong> IS a digit! Why blame my spelling?"
              </div>
            </div>
          </div>

          <div class="story-highlight-box" style="border-color: #ea580c; background: #fff7ed;">
            <div class="story-highlight-icon">🍰</div>
            <div>
              <strong>Why did it fail?</strong>
              <br>• <code>int("0")</code> worked perfectly—0 is a valid number!
              <br>• <code>30 / 0</code> crashed—you cannot split a cake among 0 people (<strong><code>ZeroDivisionError</code></strong>).
            </div>
          </div>

          <p class="narrative-p">
            Maya's old net blamed every crash on a typo. She needs <strong>specific handlers for specific problems</strong>:
            <br>• Word typos: <strong><code>except ValueError:</code></strong>
            <br>• Division by zero: <strong><code>except ZeroDivisionError:</code></strong>
          </p>
        `
      }
    ],
    checkpoints: [
      {
        question: "Why was Oliver so confused by Maya's old generic guardrail?",
        options: [
          {
            text: "He typed a valid digit ('0'), but the generic message gave a false diagnosis claiming he typed words.",
            correct: true,
            feedback: "Exactly! '0' is a valid number, so the problem wasn't non-numeric text—it was division by zero. A single generic error message misdiagnosed the problem!"
          },
          {
            text: "The machine's numeric capacity was exceeded, triggering an unexpected memory overflow in the system.",
            correct: false,
            feedback: "Dividing by zero doesn't overflow memory; it is an undefined mathematical operation that triggers a ZeroDivisionError."
          },
          {
            text: "Oliver entered an illegal negative value rather than zero, causing an out-of-bounds validation fault.",
            correct: false,
            feedback: "Oliver typed exactly '0'. The issue was dividing the cake cost by zero, which is mathematically invalid."
          }
        ]
      },
      {
        question: "If a customer now accidentally types '0' into Maya's updated screen, which safety net catches it?",
        options: [
          {
            text: "The ValueError safety net, because zero is treated as an illegal numerical input value.",
            correct: false,
            feedback: "'0' converts to an integer without any problem, so int('0') succeeds! It only fails on the next line when dividing by zero."
          },
          {
            text: "The ZeroDivisionError safety net, which specifically handles dividing numbers by zero.",
            correct: true,
            feedback: "Spot on! Python identifies the exact exception type (ZeroDivisionError) and routes control to the matching except block."
          },
          {
            text: "Neither safety net, because the checkout system automatically substitutes zero with 1.",
            correct: false,
            feedback: "Python executes the calculation literally; 30 / 0 raises ZeroDivisionError, which our specific handler catches."
          }
        ]
      }
    ],
    decisionScene: {
      badge: "Stage 3 of 5",
      time: "💡 Decision Point • 2:15 AM",
      title: "Different Problems, Different Signs • Decision Point",
      illustrationSvg: `
        <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="240" fill="#141a29"/>
          <circle cx="300" cy="120" r="130" fill="#3b82f6" opacity="0.08"/>
          <rect x="0" y="165" width="600" height="75" fill="#33241b"/>
          <rect x="0" y="160" width="600" height="5" fill="#2563eb"/>
          <!-- Signpost with Two Specific Arrows -->
          <g transform="translate(230, 40)">
            <rect x="65" y="10" width="10" height="120" fill="#78350f"/>
            <!-- Sign 1: ValueError -->
            <path d="M 0 25 L 120 25 L 140 40 L 120 55 L 0 55 Z" fill="#991b1b" stroke="#f87171" stroke-width="2"/>
            <text x="12" y="44" font-family="monospace" font-weight="bold" font-size="11" fill="#fef2f2">ValueError</text>
            <text x="86" y="44" font-family="sans-serif" font-size="9" fill="#fca5a5">(typos)</text>
            <!-- Sign 2: ZeroDivisionError -->
            <path d="M 140 70 L 20 70 L 0 85 L 20 100 L 140 100 Z" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
            <text x="25" y="89" font-family="monospace" font-weight="bold" font-size="10" fill="#eff6ff">ZeroDivision</text>
            <text x="102" y="89" font-family="sans-serif" font-size="9" fill="#93c5fd">(/ 0)</text>
          </g>
          <!-- Oliver the Owl with Spectacles -->
          <g transform="translate(420, 70)">
            <ellipse cx="40" cy="45" rx="26" ry="32" fill="#78350f"/>
            <ellipse cx="40" cy="50" rx="18" ry="22" fill="#fef3c7"/>
            <circle cx="30" cy="35" r="9" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
            <circle cx="50" cy="35" r="9" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="39" y1="35" x2="41" y2="35" stroke="#f59e0b" stroke-width="2.5"/>
            <circle cx="30" cy="35" r="3" fill="#000"/>
            <circle cx="50" cy="35" r="3" fill="#000"/>
            <polygon points="40,43 36,49 44,49" fill="#d97706"/>
            <text x="0" y="95" font-family="sans-serif" font-size="10" fill="#93c5fd">"Precision matters!"</text>
          </g>
          <!-- Maya Listening Attentively -->
          <g transform="translate(80, 55)">
            <ellipse cx="40" cy="20" rx="22" ry="16" fill="#ffffff"/>
            <rect x="24" y="24" width="32" height="14" fill="#f1f5f9"/>
            <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
            <circle cx="35" cy="44" r="2" fill="#78350f"/>
            <circle cx="45" cy="44" r="2" fill="#78350f"/>
            <path d="M 36 52 Q 40 55 44 52" stroke="#78350f" stroke-width="2" fill="none"/>
            <path d="M 22 62 L 58 62 L 64 105 L 16 105 Z" fill="#2563eb"/>
          </g>
        </svg>
      `,
      narrative: `
        <div class="story-highlight-box" style="border-color: #3b82f6; background: rgba(59, 130, 246, 0.08);">
          <div class="story-highlight-icon">🦉</div>
          <div>
            <strong>Key Lesson:</strong> <code>int("0")</code> succeeded, but <code>30 / 0</code> raised <code>ZeroDivisionError</code>. Specific <code>except</code> blocks diagnose the real problem!
          </div>
        </div>
        <p class="narrative-p">
          👉 <em>Answer the questions below to calibrate Maya's specialized error nets!</em>
        </p>
      `
    }
  },
  {
    id: 4,
    title: "Charging the Card Safely",
    stageBadge: "Stage 4 of 5",
    stageTime: "🌙 2:45 AM • The Safe Checkout Gate",
    statusText: "PAYMENT-SAFE",
    powerStatus: "⚡ Safe",
    queueStatus: "🚶 3 in line",
    cardStatus: "🔒 Guarded",
    codeBadge: "The Else Gate",
    codeSnippet: `<div class="code-line" id="codeLine1"><span class="code-line-num">1</span><span class="kw-try">try</span>:</div>
<div class="code-line" id="codeLine2"><span class="code-line-num">2</span>    <span class="code-fn">quantity</span> = <span class="code-fn">int</span>(customer_input)</div>
<div class="code-line" id="codeLine3"><span class="code-line-num">3</span>    <span class="code-fn">total</span> = quantity * <span class="code-num">5</span></div>
<div class="code-line" id="codeLine4"><span class="code-line-num">4</span><span class="kw-except">except</span> <span class="code-fn">ValueError</span>:</div>
<div class="code-line" id="codeLine5"><span class="code-line-num">5</span>    <span class="code-fn">print</span>(<span class="code-str">"Please type digits like 3!"</span>)</div>
<div class="code-line" id="codeLine6"><span class="code-line-num">6</span><span class="kw-else">else</span>:</div>
<div class="code-line" id="codeLine7"><span class="code-line-num">7</span>    <span class="code-fn">charge_card</span>(total)</div>
<div class="code-line" id="codeLine8"><span class="code-line-num">8</span>    <span class="code-fn">print</span>(<span class="code-str">f"Paid \${total}. Baking your box!"</span>)</div>`,
    codeGlossary: `<strong>Key Insight:</strong> <code>else:</code> is the "All Clear" gate! It runs <em>ONLY</em> when the <code>try:</code> block finishes with zero errors. If an error occurs, <code>else:</code> is skipped, protecting customer cards!`,
    scenes: [
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#1a1423"/>
            <!-- Penelope the Panda with Credit Card -->
            <g transform="translate(100, 70)">
              <!-- Ears -->
              <circle cx="24" cy="24" r="8" fill="#0f172a"/>
              <circle cx="56" cy="24" r="8" fill="#0f172a"/>
              <!-- Head -->
              <circle cx="40" cy="46" r="20" fill="#ffffff"/>
              <!-- Eye Patches -->
              <ellipse cx="32" cy="44" rx="6" ry="7" fill="#0f172a"/>
              <ellipse cx="48" cy="44" rx="6" ry="7" fill="#0f172a"/>
              <circle cx="33" cy="43" r="2" fill="#ffffff"/>
              <circle cx="47" cy="43" r="2" fill="#ffffff"/>
              <!-- Nose -->
              <ellipse cx="40" cy="52" rx="3" ry="2" fill="#0f172a"/>
              <!-- Card in hand -->
              <rect x="58" y="55" width="28" height="18" rx="2" fill="#d97706" stroke="#fef08a" stroke-width="1"/>
            </g>
            <!-- Card Terminal with Big Red Alert -->
            <g transform="translate(300, 70)">
              <rect x="0" y="0" width="160" height="90" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
              <text x="18" y="30" font-family="sans-serif" font-weight="bold" font-size="12" fill="#fca5a5">UNWANTED CHARGE!</text>
              <text x="18" y="55" font-family="monospace" font-size="11" fill="#ffffff">-\$15.00 Charged</text>
              <text x="18" y="75" font-family="sans-serif" font-size="9" fill="#94a3b8">But 0 pastries baked!</text>
            </g>
          </svg>
        `,
        narrative: `
          <p class="narrative-p">
            At 2:45 AM, <strong>Penelope the Panda</strong> orders 3 cinnamon buns ($15 total). She accidentally types <strong>"three"</strong> instead of <strong>3</strong>.
          </p>
          <div class="story-dialogue">
            <div class="avatar">🐼</div>
            <div class="dialogue-content">
              <div class="dialogue-speaker">Penelope the Panda</div>
              <div class="dialogue-text">
                "My order was rejected for a typo, but your card terminal just charged me $15 without giving me buns!"
              </div>
            </div>
          </div>
        `
      },
      {
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#12231c"/>
            <!-- The Else Gate Illustration -->
            <g transform="translate(160, 50)">
              <rect x="0" y="0" width="280" height="120" rx="10" fill="#0d1b14" stroke="#10b981" stroke-width="2"/>
              <text x="20" y="30" font-family="sans-serif" font-weight="bold" font-size="12" fill="#6ee7b7">try: [ Attempt Order ]</text>
              <!-- Safe Door -->
              <rect x="20" y="45" width="240" height="60" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
              <text x="35" y="70" font-family="monospace" font-weight="bold" font-size="12" fill="#a7f3d0">else: [ ONLY if no errors! ]</text>
              <text x="35" y="90" font-family="sans-serif" font-size="10" fill="#6ee7b7">🔒 Charge Card + Hand Pastries</text>
            </g>
          </svg>
        `,
        narrative: `
          <p class="narrative-p">
            Maya spots the bug: <code>charge_card()</code> was placed <em>outside</em> the guardrail, running even after a typo!
          </p>
          <div class="story-highlight-box" style="border-color: #10b981; background: #ecfdf5;">
            <div class="story-highlight-icon">🔒</div>
            <div>
              <strong>The Fix: <code>else:</code> (Safe Payment Gate)</strong>
              <br>Code inside <code>else:</code> runs <strong>only when <code>try:</code> succeeds with zero errors</strong>. If an error occurs, <code>else:</code> is skipped!
            </div>
          </div>
        `
      }
    ],
    checkpoints: [
      {
        question: "Why did Maya move 'charge_card()' inside the 'else:' section?",
        options: [
          {
            text: "To ensure payment processing runs ONLY when the order calculation completes with zero errors.",
            correct: true,
            feedback: "Brilliant! 'else:' only executes if the 'try:' block completed without raising any exception. If an error occurs, 'else:' is skipped, protecting customer accounts."
          },
          {
            text: "To optimize network response speed by executing the payment request in an asynchronous thread.",
            correct: false,
            feedback: "'else:' is not about network latency or async speed; it is a structural guard ensuring dependent steps only run upon prior success."
          },
          {
            text: "Because calling functions after a try/except statement causes an invalid Python syntax error.",
            correct: false,
            feedback: "Placing code after try/except is completely valid syntax, but that code would run regardless of errors unless guarded by 'else:'!"
          }
        ]
      }
    ],
    decisionScene: {
      badge: "Stage 4 of 5",
      time: "💡 Decision Point • 3:00 AM",
      title: "Charging the Card Safely • Decision Point",
      illustrationSvg: `
        <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="240" fill="#1b172a"/>
          <circle cx="300" cy="120" r="130" fill="#8b5cf6" opacity="0.08"/>
          <rect x="0" y="165" width="600" height="75" fill="#342217"/>
          <rect x="0" y="160" width="600" height="5" fill="#7c3aed"/>
          <!-- Safe Gate: else block guarding the Card Terminal -->
          <g transform="translate(220, 45)">
            <rect x="0" y="10" width="160" height="105" rx="10" fill="#2e1065" stroke="#a78bfa" stroke-width="2.5"/>
            <rect x="15" y="24" width="130" height="30" rx="4" fill="#4c1d95"/>
            <text x="32" y="44" font-family="monospace" font-weight="bold" font-size="13" fill="#ddd6fe">else: GATE</text>
            <!-- Protected Terminal -->
            <rect x="25" y="65" width="110" height="38" rx="4" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <text x="36" y="88" font-family="sans-serif" font-size="11" fill="#6ee7b7">💳 charge_card()</text>
          </g>
          <!-- Penelope the Panda -->
          <g transform="translate(430, 75)">
            <ellipse cx="40" cy="45" rx="26" ry="28" fill="#f8fafc"/>
            <circle cx="20" cy="20" r="10" fill="#1e293b"/>
            <circle cx="60" cy="20" r="10" fill="#1e293b"/>
            <ellipse cx="28" cy="38" rx="6" ry="8" fill="#1e293b"/>
            <ellipse cx="52" cy="38" rx="6" ry="8" fill="#1e293b"/>
            <circle cx="28" cy="38" r="2.5" fill="#fff"/>
            <circle cx="52" cy="38" r="2.5" fill="#fff"/>
            <ellipse cx="40" cy="50" rx="4" ry="3" fill="#1e293b"/>
            <text x="8" y="90" font-family="sans-serif" font-size="10" fill="#c4b5fd">"My money is safe!"</text>
          </g>
          <!-- Maya Smiling -->
          <g transform="translate(80, 55)">
            <ellipse cx="40" cy="20" rx="22" ry="16" fill="#ffffff"/>
            <rect x="24" y="24" width="32" height="14" fill="#f1f5f9"/>
            <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
            <circle cx="35" cy="44" r="2" fill="#78350f"/>
            <circle cx="45" cy="44" r="2" fill="#78350f"/>
            <path d="M 35 51 Q 40 56 45 51" stroke="#78350f" stroke-width="2" fill="none"/>
            <path d="M 22 62 L 58 62 L 64 105 L 16 105 Z" fill="#7c3aed"/>
          </g>
        </svg>
      `,
      narrative: `
        <div class="story-highlight-box" style="border-color: #8b5cf6; background: rgba(139, 92, 246, 0.08);">
          <div class="story-highlight-icon">💳</div>
          <div>
            <strong>Key Lesson:</strong> <code>else:</code> protects actions like charging cards so they run strictly when calculations complete with zero errors.
          </div>
        </div>
        <p class="narrative-p">
          👉 <em>Answer the question below to test your understanding of <code>else:</code>!</em>
        </p>
      `
    }
  },
  {
    id: 5,
    title: "The Nightly Notebook",
    stageBadge: "Stage 5 of 5",
    stageTime: "🌙 3:30 AM • The Final Promise",
    statusText: "INVINCIBLE",
    powerStatus: "⚡ Masterpiece",
    queueStatus: "🚶 1 in line",
    cardStatus: "🔒 Protected",
    codeBadge: "The Complete Architecture",
    codeSnippet: `<div class="code-line" id="codeLine1"><span class="code-line-num">1</span><span class="kw-try">try</span>:</div>
<div class="code-line" id="codeLine2"><span class="code-line-num">2</span>    <span class="code-fn">quantity</span> = <span class="code-fn">int</span>(customer_input)</div>
<div class="code-line" id="codeLine3"><span class="code-line-num">3</span>    <span class="code-fn">cost_each</span> = <span class="code-num">30</span> / quantity</div>
<div class="code-line" id="codeLine4"><span class="code-line-num">4</span><span class="kw-except">except</span> <span class="code-fn">ValueError</span>:</div>
<div class="code-line" id="codeLine5"><span class="code-line-num">5</span>    <span class="code-fn">print</span>(<span class="code-str">"Please type digits, not words!"</span>)</div>
<div class="code-line" id="codeLine6"><span class="code-line-num">6</span><span class="kw-except">except</span> <span class="code-fn">ZeroDivisionError</span>:</div>
<div class="code-line" id="codeLine7"><span class="code-line-num">7</span>    <span class="code-fn">print</span>(<span class="code-str">"You can't split among zero people!"</span>)</div>
<div class="code-line" id="codeLine8"><span class="code-line-num">8</span><span class="kw-else">else</span>:</div>
<div class="code-line" id="codeLine9"><span class="code-line-num">9</span>    <span class="code-fn">charge_card</span>(cost_each)</div>
<div class="code-line" id="codeLine10"><span class="code-line-num">10</span>    <span class="code-fn">print</span>(<span class="code-str">"Payment accepted! Enjoy!"</span>)</div>
<div class="code-line" id="codeLine11"><span class="code-line-num">11</span><span class="kw-finally">finally</span>:</div>
<div class="code-line" id="codeLine12"><span class="code-line-num">12</span>    <span class="code-fn">write_in_daily_ledger</span>()</div>
<div class="code-line" id="codeLine13"><span class="code-line-num">13</span>    <span class="code-fn">print</span>(<span class="code-str">"Thank you for visiting Maya's!"</span>)</div>`,
    codeGlossary: `<strong>Key Insight:</strong> <code>finally:</code> is the unbreakable pledge! Whether the order succeeded or crashed, <code>finally:</code> ALWAYS runs 100% of the time to log the visit and clean up.`,
    scenes: [
      {
        pageTitle: "The Nightly Notebook • The Midnight Promise",
        pageTime: "🌙 3:30 AM • The Grand Finale",
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dawnGrad5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#1e1838"/>
                <stop offset="60%" stop-color="#3b1f3e"/>
                <stop offset="100%" stop-color="#7c2d12"/>
              </linearGradient>
            </defs>
            <rect width="600" height="240" fill="url(#dawnGrad5)"/>
            <circle cx="500" cy="50" r="50" fill="#fef08a" opacity="0.3"/>
            <rect x="0" y="165" width="600" height="75" fill="#451a03"/>
            <rect x="0" y="160" width="600" height="5" fill="#f59e0b"/>
            <!-- Leather-Bound Ledger on Counter with Feather Quill -->
            <g transform="translate(230, 60)">
              <!-- Open Book -->
              <polygon points="20,100 80,40 140,40 80,100" fill="#b45309"/>
              <rect x="70" y="35" width="110" height="70" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
              <!-- Book Lines -->
              <line x1="82" y1="52" x2="168" y2="52" stroke="#d97706" stroke-width="1.5"/>
              <line x1="82" y1="67" x2="168" y2="67" stroke="#d97706" stroke-width="1.5"/>
              <line x1="82" y1="82" x2="168" y2="82" stroke="#d97706" stroke-width="1.5"/>
              <!-- Feather Quill -->
              <path d="M 170 30 Q 190 10 200 5 Q 195 20 180 45" stroke="#f59e0b" stroke-width="3" fill="#fde68a"/>
              <text x="75" y="118" font-family="sans-serif" font-weight="bold" font-size="11" fill="#fef3c7">The Nightly Ledger ✨</text>
            </g>
            <!-- Maya Smiling Warmly -->
            <g transform="translate(80, 55)">
              <ellipse cx="40" cy="20" rx="22" ry="16" fill="#ffffff"/>
              <rect x="24" y="24" width="32" height="14" fill="#f1f5f9"/>
              <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
              <circle cx="35" cy="44" r="2" fill="#78350f"/>
              <circle cx="45" cy="44" r="2" fill="#78350f"/>
              <path d="M 33 50 Q 40 57 47 50" stroke="#78350f" stroke-width="2.5" fill="none"/>
              <path d="M 22 62 L 58 62 L 64 105 L 16 105 Z" fill="#d97706"/>
              <rect x="28" y="70" width="24" height="25" rx="3" fill="#ffffff" opacity="0.9"/>
            </g>
          </svg>
        `,
        narrative: `
          <p class="narrative-p">
            At 3:30 AM, dawn nears Whispering Pines. Maya's bakery needs one final promise: her <strong>Nightly Ledger</strong>.
          </p>

          <div class="story-highlight-box" style="border-color: #10b981; background: #ecfdf5;">
            <div class="story-highlight-icon">✨</div>
            <div>
              <strong>The Superpower of <code>finally:</code> (Guaranteed Execution)</strong>
              <br>Whether an order succeeds, crashes, or is canceled, code in <code>finally:</code> <strong>always runs 100% of the time</strong> to log transactions and clean up!
            </div>
          </div>

          <div class="story-dialogue">
            <div class="avatar">👩‍🍳</div>
            <div class="dialogue-content">
              <div class="dialogue-speaker">Maya</div>
              <div class="dialogue-text">
                "Review our Journey Map on the next page, then let's assemble our master register!"
              </div>
            </div>
          </div>
        `
      },
      {
        pageTitle: "Master Journey Map • Story to Python Architecture",
        pageTime: "🗺️ Architecture Blueprint",
        illustrationSvg: `
          <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="240" fill="#141a29"/>
            <circle cx="300" cy="120" r="140" fill="#3b82f6" opacity="0.06"/>
            <rect x="0" y="165" width="600" height="75" fill="#33241b"/>
            <rect x="0" y="160" width="600" height="5" fill="#2563eb"/>
            <!-- Master Blueprint on Workbench -->
            <g transform="translate(130, 35)">
              <rect x="0" y="0" width="340" height="120" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>
              <text x="25" y="30" font-family="monospace" font-weight="bold" font-size="12" fill="#38bdf8">1. try:        Attempt protected math</text>
              <text x="25" y="55" font-family="monospace" font-weight="bold" font-size="12" fill="#fb7185">2. except:     Catch specific stumbles</text>
              <text x="25" y="80" font-family="monospace" font-weight="bold" font-size="12" fill="#c084fc">3. else:       Charge card only on success</text>
              <text x="25" y="105" font-family="monospace" font-weight="bold" font-size="12" fill="#4ade80">4. finally:    Nightly ledger (Always!) ✨</text>
            </g>
          </svg>
        `,
        narrative: `
          <div class="story-highlight-box" style="border-color: #f59e0b; background: rgba(245, 158, 11, 0.08); margin-bottom: 16px;">
            <div class="story-highlight-icon">🗺️</div>
            <div>
              <strong>Journey Map: Story to Python Architecture</strong>
              <br>See how each bakery dilemma maps directly to Python's exception handling tools:
            </div>
          </div>

          <!-- Master Story-to-Concept Simultaneous Map -->
          <div class="story-concept-map-container">
            <div class="map-cards-grid">
              <!-- Row 1: Stage 1 -->
              <div class="map-card stage-1-card">
                <div class="map-story-side">
                  <div class="map-stage-tag">Stage 1 • The Raw Crash</div>
                  <div class="map-story-header">
                    <span class="map-character-avatar">🐿️</span>
                    <span class="map-story-title">Sammy's Sleepy Typo</span>
                  </div>
                  <div class="map-story-desc">
                    Sammy types <code>"two"</code> instead of <code>2</code>. The unguarded machine crashes and halts the bakery.
                  </div>
                </div>
                <div class="map-concept-side">
                  <div class="map-concept-tag">Raw Unhandled Exception</div>
                  <div class="map-syntax-code">ValueError: 'two'</div>
                  <div class="map-concept-desc">
                    <strong>Unhandled Error:</strong> Invalid inputs like <code>int("two")</code> raise a <code>ValueError</code> that terminates the program.
                  </div>
                </div>
              </div>

              <!-- Row 2: Stage 2 -->
              <div class="map-card stage-2-card">
                <div class="map-story-side">
                  <div class="map-stage-tag">Stage 2 • The Cushion</div>
                  <div class="map-story-header">
                    <span class="map-character-avatar">🛡️</span>
                    <span class="map-story-title">The Baker's Safety Net</span>
                  </div>
                  <div class="map-story-desc">
                    Maya wraps the register in an oven-mitt buffer so typos are caught safely.
                  </div>
                </div>
                <div class="map-concept-side">
                  <div class="map-concept-tag">Basic Guardrail</div>
                  <div class="map-syntax-code">try: &amp; except:</div>
                  <div class="map-concept-desc">
                    <strong>Basic Guardrail:</strong> <code>try:</code> attempts the action, and <code>except:</code> catches errors so the program stays running.
                  </div>
                </div>
              </div>

              <!-- Row 3: Stage 3 -->
              <div class="map-card stage-3-card">
                <div class="map-story-side">
                  <div class="map-stage-tag">Stage 3 • Specific Signs</div>
                  <div class="map-story-header">
                    <span class="map-character-avatar">🦉</span>
                    <span class="map-story-title">Oliver's Zero Split</span>
                  </div>
                  <div class="map-story-desc">
                    Oliver splits a cake among 0 guests. Maya creates distinct signs for distinct problems.
                  </div>
                </div>
                <div class="map-concept-side">
                  <div class="map-concept-tag">Specific Exception Handlers</div>
                  <div class="map-syntax-code">except ValueError: / except ZeroDivisionError:</div>
                  <div class="map-concept-desc">
                    <strong>Specific Handlers:</strong> <code>ZeroDivisionError</code> handles <code>/ 0</code>, while <code>ValueError</code> handles invalid text.
                  </div>
                </div>
              </div>

              <!-- Row 4: Stage 4 -->
              <div class="map-card stage-4-card">
                <div class="map-story-side">
                  <div class="map-stage-tag">Stage 4 • Safe Payment Gate</div>
                  <div class="map-story-header">
                    <span class="map-character-avatar">💳</span>
                    <span class="map-story-title">Penelope's Coin Purse</span>
                  </div>
                  <div class="map-story-desc">
                    Maya locks the card terminal behind a gate so payments only happen if the order succeeded.
                  </div>
                </div>
                <div class="map-concept-side">
                  <div class="map-concept-tag">The Safe Success Gate</div>
                  <div class="map-syntax-code">else: (Zero Errors Only)</div>
                  <div class="map-concept-desc">
                    <strong>Success Gate:</strong> Code inside <code>else:</code> runs ONLY if the <code>try:</code> block succeeded with zero errors.
                  </div>
                </div>
              </div>

              <!-- Row 5: Stage 5 -->
              <div class="map-card stage-5-card">
                <div class="map-story-side">
                  <div class="map-stage-tag">Stage 5 • The Nightly Ledger</div>
                  <div class="map-story-header">
                    <span class="map-character-avatar">📖</span>
                    <span class="map-story-title">The Midnight Promise</span>
                  </div>
                  <div class="map-story-desc">
                    Maya always logs each order in her nightly ledger, whether it succeeded or failed.
                  </div>
                </div>
                <div class="map-concept-side">
                  <div class="map-concept-tag">Guaranteed Cleanup</div>
                  <div class="map-syntax-code">finally: (Always Runs)</div>
                  <div class="map-concept-desc">
                    <strong>Guaranteed Cleanup:</strong> Code inside <code>finally:</code> runs 100% of the time for cleanup and logging.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="narrative-p" style="font-weight: 600; color: #D97706; margin-top: 14px;">
            👇 <em>Click <strong>"Proceed to Code Challenge →"</strong> to assemble Maya's master register!</em>
          </p>
        `
      }
    ],
    codeChallenge: {
      title: "Stage 5 Capstone: Assemble Maya's Master Register",
      prompt: "Help Maya complete her register! Fill in each blank with the correct Python keyword:",
      blanks: [
        {
          id: "blank1",
          expected: "try",
          line: 1,
          hint: "Which statement begins the block to attempt an operation that might fail?",
          comment: "# 1. Attempt order calculation"
        },
        {
          id: "blank2",
          expected: "except",
          line: 4,
          suffix: "ValueError:",
          hint: "Which statement catches errors like typos and bad words?",
          comment: "# 2. Catch word typos (e.g. 'two')"
        },
        {
          id: "blank3",
          expected: "except",
          line: 6,
          suffix: "ZeroDivisionError:",
          hint: "Which statement catches dividing by zero?",
          comment: "# 3. Catch dividing by zero"
        },
        {
          id: "blank4",
          expected: "else",
          line: 8,
          hint: "Which statement runs ONLY when the attempt had zero errors?",
          comment: "# 4. Safe payment gate (no errors only)"
        },
        {
          id: "blank5",
          expected: "finally",
          line: 11,
          hint: "Which statement ALWAYS runs 100% of the time, no matter what?",
          comment: "# 5. Always runs (Nightly Ledger promise)"
        }
      ],
      wordBank: [
        { word: "try", label: "try" },
        { word: "catch", label: "catch", isDistractor: true },
        { word: "except", label: "except" },
        { word: "else", label: "else" },
        { word: "finally", label: "finally" },
        { word: "if", label: "if", isDistractor: true },
        { word: "while", label: "while", isDistractor: true },
        { word: "pass", label: "pass", isDistractor: true }
      ]
    },
    decisionScene: {
      badge: "Stage 5 of 5",
      time: "🛠️ Capstone Challenge • 4:00 AM",
      title: "Stage 5 Capstone: Assemble Maya's Master Register",
      illustrationSvg: `
        <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dawnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e1838"/>
              <stop offset="60%" stop-color="#3b1f3e"/>
              <stop offset="100%" stop-color="#7c2d12"/>
            </linearGradient>
          </defs>
          <rect width="600" height="240" fill="url(#dawnGrad)"/>
          <circle cx="500" cy="50" r="50" fill="#fef08a" opacity="0.25"/>
          <rect x="0" y="165" width="600" height="75" fill="#451a03"/>
          <rect x="0" y="160" width="600" height="5" fill="#f59e0b"/>
          <!-- Master Blueprint on Workbench -->
          <g transform="translate(180, 45)">
            <rect x="0" y="0" width="260" height="110" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="25" y="28" font-family="monospace" font-weight="bold" font-size="12" fill="#38bdf8">1. try:        Attempt</text>
            <text x="25" y="52" font-family="monospace" font-weight="bold" font-size="12" fill="#fb7185">2. except:     Catch stumbles</text>
            <text x="25" y="76" font-family="monospace" font-weight="bold" font-size="12" fill="#c084fc">3. else:       Charge card</text>
            <text x="25" y="100" font-family="monospace" font-weight="bold" font-size="12" fill="#4ade80">4. finally:    Nightly ledger ✨</text>
          </g>
          <!-- Proud Maya Ready to Assemble -->
          <g transform="translate(70, 55)">
            <ellipse cx="40" cy="20" rx="22" ry="16" fill="#ffffff"/>
            <rect x="24" y="24" width="32" height="14" fill="#f1f5f9"/>
            <circle cx="40" cy="46" r="16" fill="#fcd34d"/>
            <circle cx="35" cy="44" r="2" fill="#78350f"/>
            <circle cx="45" cy="44" r="2" fill="#78350f"/>
            <path d="M 33 50 Q 40 57 47 50" stroke="#78350f" stroke-width="2.5" fill="none"/>
            <path d="M 22 62 L 58 62 L 64 105 L 16 105 Z" fill="#d97706"/>
            <rect x="28" y="70" width="24" height="25" rx="3" fill="#ffffff" opacity="0.9"/>
            <circle cx="68" cy="62" r="7" fill="none" stroke="#fbbf24" stroke-width="3"/>
            <line x1="68" y1="69" x2="68" y2="90" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
          </g>
          <!-- Trophy / Badge -->
          <g transform="translate(470, 75)">
            <text x="10" y="45" font-size="34">🏆</text>
            <text x="-5" y="75" font-family="sans-serif" font-weight="bold" font-size="10" fill="#fde68a">FINAL CAPSTONE</text>
          </g>
        </svg>
      `,
      narrative: ""
    }
  }
];

// --- Application State ---
const state = {
  currentChapterIndex: 0,
  currentSceneIndex: 0,
  completedChapters: new Set(),
  checkpointStates: {}, // chapterId -> { questionIdx: { selected: null, correct: false } }
  codeChallengeStates: {}, // chapterId -> { completed: false, answers: { blank1: '', ... } }
  activeBlankId: 'blank1',
  isFrozen: false
};

// --- DOM References ---
const dom = {
  journeyMap: document.getElementById('journeyMap'),
  stageBadge: document.getElementById('stageBadge'),
  stageTime: document.getElementById('stageTime'),
  sceneTitle: document.getElementById('sceneTitle'),
  sceneIllustration: document.getElementById('sceneIllustration'),
  storyNarrative: document.getElementById('storyNarrative'),
  sceneDots: document.getElementById('sceneDots'),
  prevSceneBtn: document.getElementById('prevSceneBtn'),
  nextSceneBtn: document.getElementById('nextSceneBtn'),

  systemStatusPill: document.getElementById('systemStatusPill'),
  systemStatusText: document.getElementById('systemStatusText'),
  mainContainer: document.getElementById('mainContainer'),
  storyColumn: document.getElementById('storyColumn'),
  registerColumn: document.getElementById('registerColumn'),
  registerCard: document.getElementById('registerCard'),

  posBanner: document.getElementById('posBanner'),
  orderInput: document.getElementById('orderInput'),
  btnSubmitOrder: document.getElementById('btnSubmitOrder'),
  receiptContent: document.getElementById('receiptContent'),
  receiptPaper: document.getElementById('receiptPaper'),
  powerStatus: document.getElementById('powerStatus'),
  queueStatus: document.getElementById('queueStatus'),
  cardStatus: document.getElementById('cardStatus'),

  // Dedicated Question Page UI (Stages 1-4)
  questionViewCard: document.getElementById('questionViewCard'),
  questionBadgePill: document.getElementById('questionBadgePill'),
  questionStepLabel: document.getElementById('questionStepLabel'),
  questionStepperRow: document.getElementById('questionStepperRow'),
  questionPromptText: document.getElementById('questionPromptText'),
  questionOptionsContainer: document.getElementById('questionOptionsContainer'),
  questionFeedbackBox: document.getElementById('questionFeedbackBox'),
  qFeedbackIcon: document.getElementById('qFeedbackIcon'),
  qFeedbackTitle: document.getElementById('qFeedbackTitle'),
  qFeedbackBody: document.getElementById('qFeedbackBody'),
  qFeedbackActions: document.getElementById('qFeedbackActions'),

  stage5ChallengeCard: document.getElementById('stage5ChallengeCard'),
  challengeCardTitle: document.getElementById('challengeCardTitle'),
  challengeCardPrompt: document.getElementById('challengeCardPrompt'),
  codeChallengeArea: document.getElementById('codeChallengeArea'),
  challengeFeedback: document.getElementById('challengeFeedback'),
  challengeFeedbackIcon: document.getElementById('challengeFeedbackIcon'),
  challengeFeedbackText: document.getElementById('challengeFeedbackText'),

  celebrationModal: document.getElementById('celebrationModal'),
  btnRestartJourney: document.getElementById('btnRestartJourney'),
  btnFreePlay: document.getElementById('btnFreePlay')
};

// --- Initialization ---
function init() {
  setupJourneyMap();
  setupEventListeners();
  renderCurrentScene();
  updateRegisterUIForChapter();
}

// --- Journey Map Setup ---
function setupJourneyMap() {
  dom.journeyMap.innerHTML = '';
  CHAPTERS.forEach((ch, idx) => {
    const stepEl = document.createElement('div');
    stepEl.className = `journey-step ${idx === state.currentChapterIndex ? 'active' : ''}`;
    stepEl.dataset.index = idx;

    const icons = ['🌙', '🛡️', '🏷️', '💳', '📖'];
    stepEl.innerHTML = `
      <span class="journey-step-icon">${icons[idx]}</span>
      <span class="journey-step-text">Stage ${ch.id}</span>
    `;

    stepEl.addEventListener('click', () => {
      // Unlocked: Allow moving freely between any stages before clearing MCQs!
      goToChapter(idx);
    });

    dom.journeyMap.appendChild(stepEl);

    if (idx < CHAPTERS.length - 1) {
      const divider = document.createElement('span');
      divider.className = 'journey-divider';
      divider.textContent = '•';
      dom.journeyMap.appendChild(divider);
    }
  });
}

function updateJourneyMapUI() {
  const stepEls = dom.journeyMap.querySelectorAll('.journey-step');
  stepEls.forEach((el, idx) => {
    el.classList.toggle('active', idx === state.currentChapterIndex);
    el.classList.toggle('completed', state.completedChapters.has(idx));
  });
}

// --- Scene Rendering ---
function renderCurrentScene() {
  const chapter = CHAPTERS[state.currentChapterIndex];
  const isQuestionPage = state.currentSceneIndex === chapter.scenes.length;

  if (!isQuestionPage) {
    // Narrative Story Scene (Scenes 0 .. N-1)
    const scene = chapter.scenes[state.currentSceneIndex];

    dom.stageBadge.textContent = (scene && scene.pageBadge) ? scene.pageBadge : chapter.stageBadge;
    dom.stageTime.textContent = (scene && scene.pageTime) ? scene.pageTime : chapter.stageTime;
    dom.sceneTitle.textContent = (scene && scene.pageTitle) ? scene.pageTitle : chapter.title;

    dom.sceneIllustration.innerHTML = scene.illustrationSvg;
    dom.storyNarrative.innerHTML = scene.narrative;
    dom.storyNarrative.style.display = 'flex';

    // Questions/Challenges are strictly hidden on story scenes!
    if (dom.questionViewCard) dom.questionViewCard.style.display = 'none';
    if (dom.stage5ChallengeCard) dom.stage5ChallengeCard.style.display = 'none';

    // Navigation buttons for story scenes
    dom.prevSceneBtn.disabled = state.currentSceneIndex === 0 && state.currentChapterIndex === 0;
    dom.nextSceneBtn.disabled = false;

    if (chapter.id === 5) {
      if (state.currentSceneIndex === 0) {
        dom.prevSceneBtn.textContent = "← Back to Stage 4";
        dom.nextSceneBtn.textContent = "Proceed to Journey Map →";
      } else if (state.currentSceneIndex === 1) {
        dom.prevSceneBtn.textContent = "← Back to Story";
        dom.nextSceneBtn.textContent = "Proceed to Code Challenge →";
      }
    } else {
      dom.prevSceneBtn.textContent = "← Previous";
      if (state.currentSceneIndex === chapter.scenes.length - 1) {
        dom.nextSceneBtn.textContent = "Proceed to Questions →";
      } else {
        dom.nextSceneBtn.textContent = "Continue Story →";
      }
    }
  } else {
    // Dedicated Question / Challenge Page (Page index N = chapter.scenes.length)
    const decision = chapter.decisionScene;
    dom.stageBadge.textContent = decision ? decision.badge : chapter.stageBadge;
    dom.stageTime.textContent = decision ? decision.time : (chapter.id === 5 ? "🛠️ Capstone Challenge • 4:00 AM" : "💡 Decision Point");
    dom.sceneTitle.textContent = decision ? decision.title : `${chapter.title} • Decision Point`;

    dom.sceneIllustration.innerHTML = decision ? decision.illustrationSvg : chapter.scenes[chapter.scenes.length - 1].illustrationSvg;

    // Prev button allows going back to re-read story scenes
    dom.prevSceneBtn.disabled = false;

    // Render questions/challenges and configure forward button
    if (chapter.id === 5) {
      // Stage 5 Capstone Challenge (Fill in the Blanks)
      dom.prevSceneBtn.textContent = "← Back to Journey Map";
      dom.storyNarrative.style.display = 'none'; // Clean dedicated challenge view
      if (dom.questionViewCard) dom.questionViewCard.style.display = 'none';
      if (dom.stage5ChallengeCard) dom.stage5ChallengeCard.style.display = 'flex';
      renderCodeChallenge(chapter);

      const complete = isChapterCheckpointsComplete(chapter.id);
      dom.nextSceneBtn.disabled = !complete;
      dom.nextSceneBtn.textContent = complete ? "Finish Journey! 🏆" : "Complete Code Challenge";
    } else {
      dom.prevSceneBtn.textContent = "← Previous";
      dom.storyNarrative.style.display = 'none';
      if (dom.stage5ChallengeCard) dom.stage5ChallengeCard.style.display = 'none';
      if (dom.questionViewCard) dom.questionViewCard.style.display = 'flex';
      renderQuestionPage(chapter);
    }
  }

  // Render Subscene Dots (totalPages = chapter.scenes.length + 1)
  renderSceneDots(chapter);

  // Ensure register visibility matches current scene/MCQ mode
  updateRegisterVisibility();
}

function updateRegisterVisibility() {
  const chapter = CHAPTERS[state.currentChapterIndex];
  const isQuestionPage = state.currentSceneIndex === chapter.scenes.length;

  if (chapter.id === 1 && !isQuestionPage) {
    // Stage 1 narrative scenes: Show Maya's Brass Register simulator side-by-side
    if (dom.mainContainer) {
      dom.mainContainer.classList.remove('single-column-layout');
      dom.mainContainer.classList.remove('stage-5-column-layout');
    }
    if (dom.registerColumn) dom.registerColumn.style.display = 'flex';
  } else {
    // Stage 1 MCQs window, and Stages 2-5: Maya's Brass Register is removed from the window!
    if (dom.mainContainer) {
      dom.mainContainer.classList.add('single-column-layout');
      if (chapter.id === 5) {
        dom.mainContainer.classList.add('stage-5-column-layout');
      } else {
        dom.mainContainer.classList.remove('stage-5-column-layout');
      }
    }
    if (dom.registerColumn) dom.registerColumn.style.display = 'none';
  }
}

function renderSceneDots(chapter) {
  dom.sceneDots.innerHTML = '';
  const totalPages = chapter.scenes.length + 1;

  for (let idx = 0; idx < totalPages; idx++) {
    const isQPage = idx === chapter.scenes.length;
    const isCurrent = idx === state.currentSceneIndex;
    const isPassed = idx < state.currentSceneIndex;
    const isChapterDone = isChapterCheckpointsComplete(chapter.id);

    const dot = document.createElement('div');
    if (chapter.id === 5) {
      dot.className = `scene-dot ${isCurrent ? 'active' : ''} ${isPassed ? 'passed' : ''}`;
      if (idx === 0) {
        dot.title = "Page 1 of 3: Story (The Midnight Promise)";
      } else if (idx === 1) {
        dot.title = "Page 2 of 3: Map (Story to Python Architecture)";
      } else {
        dot.className += ' question-dot';
        dot.title = "Page 3 of 3: Fill in the Blanks (Code Challenge)";
        dot.innerHTML = isChapterDone ? '✓' : '🏆';
      }
    } else if (isQPage) {
      dot.className = `scene-dot question-dot ${isCurrent ? 'active' : ''} ${isChapterDone ? 'passed' : ''}`;
      dot.title = "Decision Point Questions";
      dot.innerHTML = isChapterDone ? '✓' : '💡';
    } else {
      dot.className = `scene-dot ${isCurrent ? 'active' : ''} ${isPassed ? 'passed' : ''}`;
      dot.title = `Scene ${idx + 1}`;
    }

    dot.addEventListener('click', () => {
      state.currentSceneIndex = idx;
      renderCurrentScene();
    });

    dom.sceneDots.appendChild(dot);
  }
}

function updateRegisterUIForChapter() {
  const chapter = CHAPTERS[state.currentChapterIndex];

  if (chapter.id === 1) {
    dom.systemStatusText.textContent = chapter.statusText;
    const dot = dom.systemStatusPill.querySelector('.status-dot');
    if (dot) dot.className = 'status-dot online';

    dom.powerStatus.textContent = chapter.powerStatus;
    dom.queueStatus.textContent = chapter.queueStatus;
    dom.cardStatus.textContent = chapter.cardStatus;

    state.isFrozen = false;
    dom.posBanner.className = 'pos-message-banner';
    dom.posBanner.textContent = `Welcome to Maya's! Stage 1 register ready.`;
    dom.orderInput.value = '';
    dom.receiptContent.innerHTML = 'Ready for order...';
  }

  updateRegisterVisibility();
}

// --- Checkpoint MCQ Rendering & Verification ---
function getCheckpointState(chapterId, questionIdx) {
  if (!state.checkpointStates[chapterId]) {
    state.checkpointStates[chapterId] = { activeQ: 0, answers: {} };
  }
  if (!state.checkpointStates[chapterId].answers[questionIdx]) {
    state.checkpointStates[chapterId].answers[questionIdx] = { selected: null, correct: false };
  }
  return state.checkpointStates[chapterId].answers[questionIdx];
}

function getActiveQuestionIndex(chapterId) {
  if (!state.checkpointStates[chapterId]) {
    state.checkpointStates[chapterId] = { activeQ: 0, answers: {} };
  }
  return state.checkpointStates[chapterId].activeQ || 0;
}

function setActiveQuestionIndex(chapterId, idx) {
  if (!state.checkpointStates[chapterId]) {
    state.checkpointStates[chapterId] = { activeQ: 0, answers: {} };
  }
  state.checkpointStates[chapterId].activeQ = idx;
}

function isChapterCheckpointsComplete(chapterId) {
  const chapter = CHAPTERS.find(c => c.id === chapterId);
  if (!chapter) return true;

  if (chapter.id === 5) {
    return isCodeChallengeComplete(chapterId);
  }

  if (!chapter.checkpoints) return true;
  for (let i = 0; i < chapter.checkpoints.length; i++) {
    const qState = getCheckpointState(chapterId, i);
    if (!qState.correct) return false;
  }
  return true;
}

function isCodeChallengeComplete(chapterId) {
  if (!state.codeChallengeStates[chapterId]) return false;
  return !!state.codeChallengeStates[chapterId].completed;
}

function renderCheckpoint() {
  const chapter = CHAPTERS[state.currentChapterIndex];

  // Stage 5: Dedicated Code Challenge (no MCQ mode)
  if (chapter.id === 5) {
    renderCodeChallenge(chapter);
    return;
  }

  // Stages 1-4: Dedicated Question Page UI
  renderQuestionPage(chapter);
}

function renderQuestionPage(chapter) {
  if (!chapter.checkpoints || chapter.checkpoints.length === 0) {
    if (dom.questionViewCard) dom.questionViewCard.style.display = 'none';
    return;
  }

  if (dom.questionViewCard) dom.questionViewCard.style.display = 'flex';

  const activeQIndex = getActiveQuestionIndex(chapter.id);
  const checkpoint = chapter.checkpoints[activeQIndex];
  const qState = getCheckpointState(chapter.id, activeQIndex);

  // Question badge label
  if (dom.questionStepLabel) {
    dom.questionStepLabel.textContent = chapter.checkpoints.length > 1
      ? `Decision Point: Question ${activeQIndex + 1} of ${chapter.checkpoints.length}`
      : `Decision Point: Help Maya Decide`;
  }

  // Question stepper pills
  if (dom.questionStepperRow) {
    dom.questionStepperRow.innerHTML = '';
    if (chapter.checkpoints.length > 1) {
      chapter.checkpoints.forEach((_, idx) => {
        const isDone = getCheckpointState(chapter.id, idx).correct;
        const isCur = idx === activeQIndex;
        const pill = document.createElement('button');
        pill.className = `q-step-pill ${isCur ? 'active' : ''} ${isDone ? 'completed' : ''}`;
        pill.innerHTML = `${isDone ? '✓ ' : ''}Question ${idx + 1}`;
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          setActiveQuestionIndex(chapter.id, idx);
          renderQuestionPage(chapter);
        });
        dom.questionStepperRow.appendChild(pill);
      });
    }
  }

  // Question Prompt Text
  if (dom.questionPromptText) {
    dom.questionPromptText.textContent = checkpoint.question;
  }

  // Question Options Cards
  if (dom.questionOptionsContainer) {
    dom.questionOptionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    checkpoint.options.forEach((opt, optIdx) => {
      const optBtn = document.createElement('button');
      optBtn.className = 'question-option-btn';

      if (qState.selected === optIdx) {
        optBtn.classList.add(opt.correct ? 'correct' : 'wrong');
        optBtn.classList.add('selected');
      }

      optBtn.innerHTML = `
        <span class="q-option-letter">${letters[optIdx] || (optIdx + 1)}</span>
        <span class="q-option-text">${opt.text}</span>
        <span class="q-radio-indicator"></span>
      `;

      optBtn.addEventListener('click', () => {
        handleOptionSelect(chapter.id, activeQIndex, optIdx, opt);
      });

      dom.questionOptionsContainer.appendChild(optBtn);
    });
  }

  // Question Feedback Box
  if (dom.questionFeedbackBox) {
    if (qState.selected !== null) {
      const chosenOpt = checkpoint.options[qState.selected];
      dom.questionFeedbackBox.style.display = 'flex';
      dom.questionFeedbackBox.className = `question-feedback-box ${chosenOpt.correct ? 'correct-feedback' : 'wrong-feedback'}`;

      if (dom.qFeedbackIcon) {
        dom.qFeedbackIcon.textContent = chosenOpt.correct ? '🎉' : '💭';
      }
      if (dom.qFeedbackTitle) {
        dom.qFeedbackTitle.textContent = chosenOpt.correct 
          ? 'Correct! Well Done!' 
          : 'Not Quite — Think About It:';
      }
      if (dom.qFeedbackBody) {
        dom.qFeedbackBody.textContent = chosenOpt.feedback;
      }

      // Actions within Feedback Box
      if (dom.qFeedbackActions) {
        dom.qFeedbackActions.innerHTML = '';

        if (activeQIndex < chapter.checkpoints.length - 1) {
          // Advance to next question in this stage (no next stage option after 1st MCQ!)
          const nextQBtn = document.createElement('button');
          nextQBtn.className = 'btn-proceed-action';
          nextQBtn.id = 'btnNextQuestion';
          nextQBtn.innerHTML = `Proceed to Question ${activeQIndex + 2} of ${chapter.checkpoints.length} →`;
          nextQBtn.addEventListener('click', () => {
            setActiveQuestionIndex(chapter.id, activeQIndex + 1);
            renderQuestionPage(chapter);
          });
          dom.qFeedbackActions.appendChild(nextQBtn);
        } else {
          // On the final question only: offer to proceed to the next stage freely
          const nextChapIndex = state.currentChapterIndex + 1;
          if (nextChapIndex < CHAPTERS.length) {
            const nextChap = CHAPTERS[nextChapIndex];
            const nextStageBtn = document.createElement('button');
            nextStageBtn.className = 'btn-proceed-stage';
            nextStageBtn.id = 'btnProceedToNextStage';
            nextStageBtn.innerHTML = `Proceed to Stage ${nextChap.id}: ${nextChap.title} →`;
            nextStageBtn.addEventListener('click', () => {
              goToChapter(nextChapIndex);
            });
            dom.qFeedbackActions.appendChild(nextStageBtn);
          } else {
            const finishBtn = document.createElement('button');
            finishBtn.className = 'btn-proceed-stage';
            finishBtn.id = 'btnProceedToNextStage';
            finishBtn.innerHTML = `Claim Your Master of Code Certificate! 🏆`;
            finishBtn.addEventListener('click', () => {
              triggerCelebration();
            });
            dom.qFeedbackActions.appendChild(finishBtn);
          }
        }
      }
    } else {
      dom.questionFeedbackBox.style.display = 'none';
    }
  }

  // Sync bottom navigation button state with active question
  updateQuestionNavBtnState(chapter);
}

function updateQuestionNavBtnState(chapter) {
  if (chapter.id === 5) {
    updateStage5NextBtnState();
    return;
  }

  const activeQIndex = getActiveQuestionIndex(chapter.id);
  const totalQ = chapter.checkpoints ? chapter.checkpoints.length : 1;
  dom.nextSceneBtn.disabled = false;

  if (activeQIndex < totalQ - 1) {
    dom.nextSceneBtn.textContent = `Proceed to Question ${activeQIndex + 2} of ${totalQ} →`;
  } else {
    const nextChap = CHAPTERS[state.currentChapterIndex + 1];
    dom.nextSceneBtn.textContent = nextChap ? `Proceed to Stage ${nextChap.id} →` : "Finish Journey! 🏆";
  }
}

function updateStage5NextBtnState() {
  const chapter = CHAPTERS[state.currentChapterIndex];
  const isQPage = state.currentSceneIndex === chapter.scenes.length;
  if (isQPage) {
    const complete = isChapterCheckpointsComplete(chapter.id);
    dom.nextSceneBtn.disabled = !complete;
    dom.nextSceneBtn.textContent = complete ? "Finish Journey! 🏆" : "Complete Code Challenge";
  }
}

// --- Stage 5 Code Challenge Rendering & Verification (Column-Wise Layout) ---
function renderCodeChallenge(chapter) {
  const challenge = chapter.codeChallenge;
  dom.challengeCardTitle.innerHTML = `${challenge.title}`;
  dom.challengeCardPrompt.textContent = challenge.prompt;

  if (!state.codeChallengeStates[chapter.id]) {
    state.codeChallengeStates[chapter.id] = {
      completed: false,
      answers: { blank1: '', blank2: '', blank3: '', blank4: '', blank5: '' }
    };
  }
  const chState = state.codeChallengeStates[chapter.id];

  // Render Word Bank with Distractors (does not reveal exact answers)
  let wordBankHtml = `
    <div class="code-challenge-wordbank">
      <span class="wordbank-label">Python Statements (click to place):</span>
  `;
  challenge.wordBank.forEach(item => {
    wordBankHtml += `
      <button class="word-chip ${item.isDistractor ? 'distractor' : ''}" data-word="${item.word}">
        ${item.label}
      </button>
    `;
  });
  wordBankHtml += `</div>`;

  // Render Code Editor Box (no answers in comments or placeholders)
  const blanks = chState.answers;
  const isDone = chState.completed;

  let editorHtml = `
    <div class="code-editor-box">
      <div class="editor-line">
        <span class="editor-line-num">1</span>
        <input type="text" class="code-blank-input ${isDone ? 'correct-blank' : ''} ${state.activeBlankId === 'blank1' ? 'active-blank' : ''}" id="blank1" value="${blanks.blank1 || ''}" placeholder="..." data-id="blank1" autocomplete="off" spellcheck="false" />
        <span class="code-punct">:</span>
        <span class="code-comment-hint"># 1. Attempt order calculation</span>
      </div>
      <div class="editor-line indent-1">
        <span class="editor-line-num">2</span>
        <span class="code-var">quantity</span> = <span class="code-fn-name">int</span>(customer_input)
      </div>
      <div class="editor-line indent-1">
        <span class="editor-line-num">3</span>
        <span class="code-var">cost_each</span> = <span class="code-num-val">30</span> / quantity
      </div>
      <div class="editor-line">
        <span class="editor-line-num">4</span>
        <input type="text" class="code-blank-input ${isDone ? 'correct-blank' : ''} ${state.activeBlankId === 'blank2' ? 'active-blank' : ''}" id="blank2" value="${blanks.blank2 || ''}" placeholder="..." data-id="blank2" autocomplete="off" spellcheck="false" />
        <span class="code-fn-name"> ValueError</span><span class="code-punct">:</span>
        <span class="code-comment-hint"># 2. Catch word typos (e.g. 'two')</span>
      </div>
      <div class="editor-line indent-1">
        <span class="editor-line-num">5</span>
        <span class="code-fn-name">print</span>(<span class="code-str-val">"Please type digits, not words!"</span>)
      </div>
      <div class="editor-line">
        <span class="editor-line-num">6</span>
        <input type="text" class="code-blank-input ${isDone ? 'correct-blank' : ''} ${state.activeBlankId === 'blank3' ? 'active-blank' : ''}" id="blank3" value="${blanks.blank3 || ''}" placeholder="..." data-id="blank3" autocomplete="off" spellcheck="false" />
        <span class="code-fn-name"> ZeroDivisionError</span><span class="code-punct">:</span>
        <span class="code-comment-hint"># 3. Catch dividing by zero</span>
      </div>
      <div class="editor-line indent-1">
        <span class="editor-line-num">7</span>
        <span class="code-fn-name">print</span>(<span class="code-str-val">"You can't split among zero people!"</span>)
      </div>
      <div class="editor-line">
        <span class="editor-line-num">8</span>
        <input type="text" class="code-blank-input ${isDone ? 'correct-blank' : ''} ${state.activeBlankId === 'blank4' ? 'active-blank' : ''}" id="blank4" value="${blanks.blank4 || ''}" placeholder="..." data-id="blank4" autocomplete="off" spellcheck="false" />
        <span class="code-punct">:</span>
        <span class="code-comment-hint"># 4. Safe payment gate (no errors only)</span>
      </div>
      <div class="editor-line indent-1">
        <span class="editor-line-num">9</span>
        <span class="code-fn-name">charge_card</span>(cost_each)
      </div>
      <div class="editor-line indent-1">
        <span class="editor-line-num">10</span>
        <span class="code-fn-name">print</span>(<span class="code-str-val">"Payment accepted! Enjoy!"</span>)
      </div>
      <div class="editor-line">
        <span class="editor-line-num">11</span>
        <input type="text" class="code-blank-input ${isDone ? 'correct-blank' : ''} ${state.activeBlankId === 'blank5' ? 'active-blank' : ''}" id="blank5" value="${blanks.blank5 || ''}" placeholder="..." data-id="blank5" autocomplete="off" spellcheck="false" />
        <span class="code-punct">:</span>
        <span class="code-comment-hint"># 5. Always runs (Nightly Ledger)</span>
      </div>
      <div class="editor-line indent-1">
        <span class="editor-line-num">12</span>
        <span class="code-fn-name">write_in_daily_ledger</span>()
      </div>
      <div class="editor-line indent-1">
        <span class="editor-line-num">13</span>
        <span class="code-fn-name">print</span>(<span class="code-str-val">"Thank you for visiting Maya's!"</span>)
      </div>
    </div>
  `;

  // Render Controls
  const controlsHtml = `
    <div class="challenge-controls">
      <button class="challenge-btn submit-btn" id="btnVerifyCode">Check Register Code 🚀</button>
      <button class="challenge-btn reset-btn" id="btnResetBlanks">Reset Blanks ↺</button>
      <button class="challenge-btn hint-btn" id="btnChallengeHint">Need a Hint? 💡</button>
    </div>
  `;

  dom.codeChallengeArea.innerHTML = wordBankHtml + editorHtml + controlsHtml;

  // Add event listeners for inputs
  const inputs = dom.codeChallengeArea.querySelectorAll('.code-blank-input');
  inputs.forEach((input, index) => {
    input.addEventListener('focus', () => {
      state.activeBlankId = input.dataset.id;
      inputs.forEach(i => i.classList.remove('active-blank'));
      input.classList.add('active-blank');
    });

    input.addEventListener('input', (e) => {
      chState.answers[input.dataset.id] = e.target.value;
      input.classList.remove('wrong-blank');
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        } else {
          verifyCodeChallenge();
        }
      }
    });
  });

  // Add event listeners for Word Bank chips
  const chips = dom.codeChallengeArea.querySelectorAll('.word-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const word = chip.dataset.word;
      
      let targetInput = document.getElementById(state.activeBlankId);
      if (!targetInput || targetInput.value.trim() !== '') {
        for (let i = 0; i < inputs.length; i++) {
          if (!inputs[i].value.trim()) {
            targetInput = inputs[i];
            break;
          }
        }
      }
      if (!targetInput) {
        targetInput = inputs[0];
      }

      targetInput.value = word;
      chState.answers[targetInput.dataset.id] = word;
      targetInput.classList.remove('wrong-blank');
      
      let nextEmpty = null;
      for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].value.trim()) {
          nextEmpty = inputs[i];
          break;
        }
      }
      if (nextEmpty) {
        nextEmpty.focus();
      } else {
        targetInput.focus();
      }
    });
  });

  // Controls listeners
  document.getElementById('btnVerifyCode').addEventListener('click', verifyCodeChallenge);
  document.getElementById('btnResetBlanks').addEventListener('click', resetCodeChallengeBlanks);
  document.getElementById('btnChallengeHint').addEventListener('click', showCodeChallengeHint);

  // If already completed in state, show the success feedback
  if (isDone) {
    dom.challengeFeedback.style.display = 'flex';
    dom.challengeFeedback.className = 'mcq-feedback correct-feedback';
    dom.challengeFeedbackIcon.textContent = '🎉';
    dom.challengeFeedbackText.innerHTML = `
      <div><strong>Guardrail Assembled!</strong> All statements are correctly placed. Maya's register is unstoppable!</div>
      <div style="margin-top: 14px;">
        <button class="btn-proceed-stage" id="btnClaimCertificate">
          Claim Your Master of Code Certificate! 🏆
        </button>
      </div>
    `;
    const btnCert = dom.challengeFeedbackText.querySelector('#btnClaimCertificate');
    if (btnCert) {
      btnCert.addEventListener('click', () => {
        triggerCelebration();
      });
    }
  }
}

function verifyCodeChallenge() {
  const challenge = CHAPTERS[4].codeChallenge;
  const blanks = challenge.blanks;
  let allCorrect = true;
  let firstWrongOrEmpty = null;
  let hasCatch = false;

  blanks.forEach(b => {
    const inputEl = document.getElementById(b.id);
    if (!inputEl) return;
    const rawVal = inputEl.value.trim();
    const val = rawVal.toLowerCase().replace(/:$/, '');
    
    inputEl.classList.remove('correct-blank', 'wrong-blank');

    if (val === 'catch') {
      hasCatch = true;
    }

    if (val === b.expected) {
      inputEl.classList.add('correct-blank');
    } else {
      inputEl.classList.add('wrong-blank');
      allCorrect = false;
      if (!firstWrongOrEmpty) {
        firstWrongOrEmpty = { blank: b, val: rawVal };
      }
    }
  });

  const feedbackBox = dom.challengeFeedback;
  feedbackBox.style.display = 'flex';

  if (allCorrect) {
    sounds.playCorrect();
    feedbackBox.className = 'mcq-feedback correct-feedback';
    dom.challengeFeedbackIcon.textContent = '🎉';
    dom.challengeFeedbackText.innerHTML = `
      <div>
        <strong>Masterpiece Assembled!</strong> You connected all 4 golden statements of Python error handling:
        <br>• The block that attempts dangerous operations (<code>try</code>).
        <br>• The statements that catch specific stumbles (<code>except ValueError</code>, <code>except ZeroDivisionError</code>).
        <br>• The gate that safely processes payment ONLY when zero errors occurred (<code>else</code>).
        <br>• The unbreakable guarantee that logs to the Nightly Ledger 100% of the time (<code>finally</code>)!
      </div>
      <div style="margin-top: 14px;">
        <button class="btn-proceed-stage" id="btnClaimCertificate">
          Claim Your Master of Code Certificate! 🏆
        </button>
      </div>
    `;

    const btnCert = dom.challengeFeedbackText.querySelector('#btnClaimCertificate');
    if (btnCert) {
      btnCert.addEventListener('click', () => {
        triggerCelebration();
      });
    }

    // Mark challenge complete in state
    if (!state.codeChallengeStates[5]) {
      state.codeChallengeStates[5] = { answers: {} };
    }
    state.codeChallengeStates[5].completed = true;
    state.completedChapters.add(4); // Stage 5 is index 4
    updateJourneyMapUI();

    // Enable story next button
    dom.nextSceneBtn.disabled = false;
    dom.nextSceneBtn.textContent = "Finish Journey! 🏆";

    // Trigger test run in live register
    dom.posBanner.className = 'pos-message-banner';
    dom.posBanner.textContent = "✨ CODE VERIFIED: Register guardrail armed and active! Ready to graduate!";
    dom.receiptContent.innerHTML = `
      *** CODE VERIFICATION PASSED ***<br>
      Attempt Block: Active ✓<br>
      ValueError Handler: Active ✓<br>
      ZeroDivisionError Handler: Active ✓<br>
      Safe Success Gate: Active ✓<br>
      Ledger Guarantee: Active ✓<br>
      <strong>SYSTEM STATUS: INVINCIBLE</strong>
    `;
    dom.receiptPaper.classList.add('printed');

  } else {
    sounds.playWrong();
    feedbackBox.className = 'mcq-feedback wrong-feedback';
    dom.challengeFeedbackIcon.textContent = '💭';

    let specificMsg = '';
    if (hasCatch) {
      specificMsg = `
        <div style="margin-top: 6px; padding: 6px 10px; background: rgba(245, 158, 11, 0.15); border-left: 3px solid #f59e0b; border-radius: 4px;">
          💡 <strong>Helpful Python Tip:</strong> In languages like JavaScript or Java, <code>catch</code> is used. But in Python, what keyword catches errors?
        </div>
      `;
    }

    if (!firstWrongOrEmpty.val) {
      dom.challengeFeedbackText.innerHTML = `
        <div>Please fill in all blanks! Line ${firstWrongOrEmpty.blank.line} needs a statement: <em>${firstWrongOrEmpty.blank.hint}</em></div>
        ${specificMsg}
      `;
    } else {
      dom.challengeFeedbackText.innerHTML = `
        <div>Check line ${firstWrongOrEmpty.blank.line}: <em>${firstWrongOrEmpty.blank.hint}</em></div>
        ${specificMsg}
      `;
    }
  }
}

function resetCodeChallengeBlanks() {
  const chapter = CHAPTERS[4];
  if (state.codeChallengeStates[chapter.id]) {
    state.codeChallengeStates[chapter.id].answers = { blank1: '', blank2: '', blank3: '', blank4: '', blank5: '' };
    state.codeChallengeStates[chapter.id].completed = false;
  }
  const inputs = dom.codeChallengeArea.querySelectorAll('.code-blank-input');
  inputs.forEach(input => {
    input.value = '';
    input.classList.remove('correct-blank', 'wrong-blank', 'active-blank');
  });
  dom.challengeFeedback.style.display = 'none';
  state.activeBlankId = 'blank1';
  if (inputs[0]) inputs[0].focus();

  // Re-check next scene button state & dots
  renderSceneDots(chapter);
  const isQPage = state.currentSceneIndex === chapter.scenes.length;
  if (isQPage) {
    dom.nextSceneBtn.disabled = true;
    dom.nextSceneBtn.textContent = "Complete Code Challenge";
  }
}

function showCodeChallengeHint() {
  dom.challengeFeedback.style.display = 'flex';
  dom.challengeFeedback.className = 'mcq-feedback';
  dom.challengeFeedback.style.background = '#2B2117';
  dom.challengeFeedback.style.border = '1px solid #784E37';
  dom.challengeFeedback.style.color = '#FDE68A';
  dom.challengeFeedbackIcon.textContent = '💡';
  dom.challengeFeedbackText.innerHTML = `
    <div>
      <strong>Maya's Register Clues:</strong><br>
      • <strong>Line 1:</strong> Think back to Stage 2: What statement begins the safe testing block to attempt code that might stumble?<br>
      • <strong>Lines 4 & 6:</strong> Think back to Stage 3: What statement catches specific errors like <code>ValueError</code> and <code>ZeroDivisionError</code>? <em>(Remember: Python does NOT use 'catch'!)</em><br>
      • <strong>Line 8:</strong> Think back to Stage 4: What statement creates the safe gate for code that must ONLY run if no errors occurred?<br>
      • <strong>Line 11:</strong> Think of the nightly notebook: What statement creates the unbreakable promise that ALWAYS runs to log the visit?
    </div>
  `;
}

function handleOptionSelect(chapterId, questionIdx, optionIdx, optionData) {
  const qState = getCheckpointState(chapterId, questionIdx);
  qState.selected = optionIdx;
  qState.correct = optionData.correct;

  if (optionData.correct) {
    sounds.playCorrect();
    if (isChapterCheckpointsComplete(chapterId)) {
      state.completedChapters.add(state.currentChapterIndex);
      updateJourneyMapUI();
    }
  } else {
    sounds.playWrong();
  }

  // Update scene buttons and checkpoint UI
  renderCheckpoint();
  
  // Re-check next scene button state & dots
  const chapter = CHAPTERS[state.currentChapterIndex];
  renderSceneDots(chapter);
  const isQPage = state.currentSceneIndex === chapter.scenes.length;
  if (isQPage) {
    updateQuestionNavBtnState(chapter);
  }
}

// --- Live Interactive Bakery Register Simulator ---
function processBakeryOrder(userInput) {
  if (state.isFrozen) {
    sounds.playWrong();
    dom.posBanner.textContent = "MACHINE FROZEN! Please click a Quick Test Customer to reset.";
    return;
  }

  const currentChapter = CHAPTERS[state.currentChapterIndex];
  const trimmed = String(userInput).trim();

  // Execution callback helper
  function highlightLines(lineIds, callback) {
    if (callback) callback();
  }

  // Chapter 1 Simulator Logic: Raw & Fragile (Crashes on typos)
  if (currentChapter.id === 1) {
    const num = Number(trimmed);
    if (isNaN(num) || trimmed === '') {
      // Freeze!
      highlightLines(['codeLine2'], () => {
        sounds.playFreeze();
        state.isFrozen = true;
        dom.posBanner.className = 'pos-message-banner freeze-banner';
        dom.posBanner.textContent = `💥 CRASH: ValueError! Cannot turn '${trimmed}' into a number! Machine Frozen!`;
        
        const dot = dom.systemStatusPill.querySelector('.status-dot');
        dot.className = 'status-dot frozen';
        dom.systemStatusText.textContent = "SYSTEM CRASHED";
        dom.powerStatus.textContent = "❌ SHUTDOWN";

        dom.receiptContent.innerHTML = `
          <strong style="color: #dc2626;">FATAL MACHINE ERROR</strong><br>
          ValueError: invalid literal for int(): '${trimmed}'<br>
          <em>Register stopped responding.</em>
        `;
        dom.receiptPaper.classList.add('printed');
      });
    } else {
      highlightLines(['codeLine2', 'codeLine3', 'codeLine4'], () => {
        sounds.playBell();
        const total = num * 4;
        dom.posBanner.className = 'pos-message-banner';
        dom.posBanner.textContent = `Order Success: ${num} cupcakes ringing up for $${total.toFixed(2)}`;
        
        dom.receiptContent.innerHTML = `
          ITEM: Blueberry Cupcake<br>
          QTY: ${num} @ $4.00<br>
          TOTAL: $${total.toFixed(2)}<br>
          STATUS: Paid Cash 💵
        `;
        dom.receiptPaper.classList.add('printed');
      });
    }
  }

  // Chapter 2 Simulator Logic: Guardrail with Generic try/except
  else if (currentChapter.id === 2) {
    const num = Number(trimmed);
    if (isNaN(num) || trimmed === '') {
      // Stumble caught safely by except!
      highlightLines(['codeLine1', 'codeLine2', 'codeLine5', 'codeLine6'], () => {
        sounds.playWrong();
        dom.posBanner.className = 'pos-message-banner error-banner';
        dom.posBanner.textContent = `🛡️ CAUGHT: "Oops! Please use digits like 2, not letters."`;
        
        dom.receiptContent.innerHTML = `
          <em>Order Not Processed</em><br>
          Note: Please use digits like 2.<br>
          <strong style="color: #059669;">Machine Status: ALIVE & READY</strong>
        `;
        dom.receiptPaper.classList.add('printed');
      });
    } else {
      highlightLines(['codeLine1', 'codeLine2', 'codeLine3', 'codeLine4'], () => {
        sounds.playBell();
        const total = num * 4;
        dom.posBanner.className = 'pos-message-banner';
        dom.posBanner.textContent = `Order Success: ${num} cupcakes = $${total.toFixed(2)}`;
        
        dom.receiptContent.innerHTML = `
          ITEM: Blueberry Cupcake<br>
          QTY: ${num} @ $4.00<br>
          TOTAL: $${total.toFixed(2)}<br>
          STATUS: Complete ✓
        `;
        dom.receiptPaper.classList.add('printed');
      });
    }
  }

  // Chapter 3 Simulator Logic: Specific Signs (ValueError vs ZeroDivisionError)
  else if (currentChapter.id === 3) {
    const num = Number(trimmed);
    if (isNaN(num) || trimmed === '') {
      // ValueError sign
      highlightLines(['codeLine1', 'codeLine2', 'codeLine5', 'codeLine6'], () => {
        sounds.playWrong();
        dom.posBanner.className = 'pos-message-banner error-banner';
        dom.posBanner.textContent = `🏷️ ValueError: Please type digits like 3, not words!`;
        dom.receiptContent.innerHTML = `Notice: Digits required.<br>Register remains online.`;
        dom.receiptPaper.classList.add('printed');
      });
    } else if (num === 0) {
      // ZeroDivisionError sign
      highlightLines(['codeLine1', 'codeLine2', 'codeLine3', 'codeLine7', 'codeLine8'], () => {
        sounds.playWrong();
        dom.posBanner.className = 'pos-message-banner error-banner';
        dom.posBanner.textContent = `🏷️ ZeroDivisionError: You can't split a cake among 0 friends!`;
        dom.receiptContent.innerHTML = `Math Note: Division by 0 impossible.<br>Try at least 1 guest.`;
        dom.receiptPaper.classList.add('printed');
      });
    } else {
      highlightLines(['codeLine1', 'codeLine2', 'codeLine3', 'codeLine4'], () => {
        sounds.playBell();
        const perGuest = 30 / num;
        dom.posBanner.className = 'pos-message-banner';
        dom.posBanner.textContent = `Split $30 cake among ${num} guests = $${perGuest.toFixed(2)} each.`;
        dom.receiptContent.innerHTML = `
          ITEM: Giant Mooncake ($30)<br>
          GUESTS: ${num}<br>
          EACH PAYS: $${perGuest.toFixed(2)}
        `;
        dom.receiptPaper.classList.add('printed');
      });
    }
  }

  // Chapter 4 Simulator Logic: Safe Checkout with else:
  else if (currentChapter.id === 4) {
    const num = Number(trimmed);
    if (isNaN(num) || trimmed === '') {
      // ValueError caught -> else skipped! Card untouched!
      highlightLines(['codeLine1', 'codeLine2', 'codeLine4', 'codeLine5'], () => {
        sounds.playWrong();
        dom.posBanner.className = 'pos-message-banner error-banner';
        dom.posBanner.textContent = `Typo caught! Note: 'else:' was skipped. Card was NOT charged.`;
        dom.cardStatus.textContent = "🔒 SAFE (Uncharged)";
        dom.receiptContent.innerHTML = `
          <em>Order canceled due to typo.</em><br>
          <strong style="color: #059669;">Card Charged: $0.00 (Protected!)</strong>
        `;
        dom.receiptPaper.classList.add('printed');
      });
    } else {
      // Perfect attempt -> else runs! Card safely charged!
      highlightLines(['codeLine1', 'codeLine2', 'codeLine3', 'codeLine6', 'codeLine7', 'codeLine8'], () => {
        sounds.playBell();
        const total = num * 5;
        dom.cardStatus.textContent = `💳 Paid $${total}`;
        dom.posBanner.className = 'pos-message-banner';
        dom.posBanner.textContent = `All Clear! 'else:' ran: Card charged $${total}. Pastries baked!`;
        dom.receiptContent.innerHTML = `
          ITEM: Cinnamon Buns<br>
          QTY: ${num} @ $5.00<br>
          TOTAL: $${total.toFixed(2)}<br>
          CARD SWIPE: Authorized via 'else:' ✓
        `;
        dom.receiptPaper.classList.add('printed');
      });
    }
  }

  // Chapter 5 Simulator Logic: Masterpiece with finally:
  else if (currentChapter.id === 5) {
    const num = Number(trimmed);
    let errorType = null;
    let costPerPerson = 0;

    if (isNaN(num) || trimmed === '') {
      errorType = 'ValueError';
    } else if (num === 0) {
      errorType = 'ZeroDivisionError';
    } else {
      costPerPerson = 30 / num;
    }

    const lines = ['codeLine1', 'codeLine2'];
    if (errorType === 'ValueError') {
      lines.push('codeLine4', 'codeLine5');
    } else if (errorType === 'ZeroDivisionError') {
      lines.push('codeLine3', 'codeLine6', 'codeLine7');
    } else {
      lines.push('codeLine3', 'codeLine8', 'codeLine9', 'codeLine10');
    }
    // finally always runs!
    lines.push('codeLine11', 'codeLine12', 'codeLine13');

    highlightLines(lines, () => {
      if (errorType) {
        sounds.playWrong();
      } else {
        sounds.playBell();
      }

      let msg = "";
      if (errorType === 'ValueError') {
        msg = "Typo caught! ";
      } else if (errorType === 'ZeroDivisionError') {
        msg = "Zero division caught! ";
      } else {
        msg = `Order accepted ($${costPerPerson.toFixed(2)} each). `;
      }
      msg += "✨ 'finally:' executed: Logged into Nightly Ledger!";

      dom.posBanner.className = `pos-message-banner ${errorType ? 'error-banner' : ''}`;
      dom.posBanner.textContent = msg;

      dom.receiptContent.innerHTML = `
        OUTCOME: ${errorType ? 'Confusion Handled Safely' : 'Sale Completed'}<br>
        LEDGER: Entry #${Math.floor(Math.random() * 800 + 100)} recorded<br>
        <strong>FINALLY: Shop tidy & ready for next!</strong>
      `;
      dom.receiptPaper.classList.add('printed');
    });
  }
}

// --- Navigation & Chapter Switching ---
function goToChapter(chapterIndex) {
  state.currentChapterIndex = chapterIndex;
  state.currentSceneIndex = 0;
  const chapter = CHAPTERS[chapterIndex];
  if (chapter) {
    setActiveQuestionIndex(chapter.id, 0);
  }
  updateJourneyMapUI();
  updateRegisterUIForChapter();
  renderCurrentScene();
}

function handleNextScene() {
  const chapter = CHAPTERS[state.currentChapterIndex];
  const isQuestionPage = state.currentSceneIndex === chapter.scenes.length;

  if (!isQuestionPage) {
    state.currentSceneIndex++;
    renderCurrentScene();
  } else {
    if (chapter.id === 5) {
      if (isChapterCheckpointsComplete(chapter.id)) {
        triggerCelebration();
      } else {
        verifyCodeChallenge();
      }
      return;
    }

    const activeQIndex = getActiveQuestionIndex(chapter.id);
    const totalQ = chapter.checkpoints ? chapter.checkpoints.length : 1;
    if (activeQIndex < totalQ - 1) {
      // Advance to next question in this stage!
      setActiveQuestionIndex(chapter.id, activeQIndex + 1);
      renderQuestionPage(chapter);
    } else {
      // End of chapter reached on final Question: Allow moving freely to next stage!
      if (state.currentChapterIndex < CHAPTERS.length - 1) {
        goToChapter(state.currentChapterIndex + 1);
      } else {
        triggerCelebration();
      }
    }
  }
}

function handlePrevScene() {
  const chapter = CHAPTERS[state.currentChapterIndex];
  const isQuestionPage = state.currentSceneIndex === chapter.scenes.length;

  if (isQuestionPage && chapter.id !== 5) {
    const activeQIndex = getActiveQuestionIndex(chapter.id);
    if (activeQIndex > 0) {
      setActiveQuestionIndex(chapter.id, activeQIndex - 1);
      renderQuestionPage(chapter);
      return;
    }
  }

  if (state.currentSceneIndex > 0) {
    state.currentSceneIndex--;
    renderCurrentScene();
  } else if (state.currentChapterIndex > 0) {
    const prevChapter = CHAPTERS[state.currentChapterIndex - 1];
    state.currentChapterIndex--;
    // Land on the previous chapter's question page so the learner can review
    state.currentSceneIndex = prevChapter.scenes.length;
    updateJourneyMapUI();
    updateRegisterUIForChapter();
    renderCurrentScene();
  }
}

function triggerCelebration() {
  sounds.playCorrect();
  dom.celebrationModal.style.display = 'flex';
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  dom.prevSceneBtn.addEventListener('click', handlePrevScene);
  dom.nextSceneBtn.addEventListener('click', handleNextScene);

  // Order Submission
  dom.btnSubmitOrder.addEventListener('click', () => {
    sounds.init();
    processBakeryOrder(dom.orderInput.value);
  });

  dom.orderInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sounds.init();
      processBakeryOrder(dom.orderInput.value);
    }
  });

  // Preset Chips
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      sounds.init();
      // If frozen, unfreeze on preset click
      if (state.isFrozen) {
        state.isFrozen = false;
        const dot = dom.systemStatusPill.querySelector('.status-dot');
        dot.className = 'status-dot online';
        dom.systemStatusText.textContent = "RESETTING...";
        dom.powerStatus.textContent = "⚡ Rebooted";
      }
      dom.orderInput.value = chip.dataset.value;
      processBakeryOrder(chip.dataset.value);
    });
  });

  // Stage 5 Journey Map shortcut from Code Challenge
  const btnMapShortcut = document.getElementById('btnMapShortcut');
  if (btnMapShortcut) {
    btnMapShortcut.addEventListener('click', () => {
      state.currentSceneIndex = 1; // Page 2: Journey Map
      renderCurrentScene();
    });
  }

  // Modal Actions
  dom.btnRestartJourney.addEventListener('click', () => {
    dom.celebrationModal.style.display = 'none';
    state.completedChapters.clear();
    state.checkpointStates = {};
    state.codeChallengeStates = {};
    state.stage5Mode = 'challenge';
    goToChapter(0);
  });

  dom.btnFreePlay.addEventListener('click', () => {
    dom.celebrationModal.style.display = 'none';
    goToChapter(0); // Takes user to Stage 1 where Maya's Brass Register is active
  });
}

// Start app
window.addEventListener('DOMContentLoaded', init);
