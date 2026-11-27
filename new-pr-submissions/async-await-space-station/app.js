/* ══════════════════════════════════════════════════════════════════
   PyBe — Async / Await & asyncio: The Skeld
   Author: Soumyashis Ghosh · @LuchaLibreAAA
   ══════════════════════════════════════════════════════════════════ */

/* ── 16-Slide Sectioned Curriculum & Minimal-Data Design ── */
const SCENES = [
  /* ── SECTION 1: THE BOTTLENECK ── */
  {
    stageNum: 1,
    sectionTag: "SECTION 1 OF 8 · THE BOTTLENECK",
    title: "Briefing: The Sequential Trap",
    statusText: "SYSTEM: DIAGNOSTIC MODE",
    statusType: "warn",
    speech: "yo cyan, welcome to electrical. everything is lagging because whoever coded this used sequential python. dial-up vibes in 2047 💀",
    postSpeech: "waiting on I/O freezes normal code. time to go async!",
    type: "theory-intro",
    theory: {
      badge: "MODULE 1 // SYNC VS ASYNC",
      ctaText: "TRY THE BLOCKING QUEUE ▶",
      sections: [
        {
          tab: "1. The Problem",
          cardClass: "sync-card",
          title: "Synchronous (Blocking)",
          badge: "FREEZES THREAD",
          badgeClass: "badge-red",
          visual: "Task 1 [Wait 12s] ──▶ Task 2 [Wait 8s] ──▶ Done",
          bullets: [
            "Runs strictly one task after another.",
            "While waiting on a sensor, the <strong>entire program stalls</strong>."
          ]
        },
        {
          tab: "2. Async Fix",
          cardClass: "async-card",
          title: "Asynchronous (Cooperative)",
          badge: "NON-BLOCKING",
          badgeClass: "badge-green",
          visual: "Task 1 [Yields Wait] ─┐\nTask 2 [Runs Now]    ─┴─▶ Done Together!",
          bullets: [
            "Tasks pause voluntarily during I/O waits.",
            "Other tasks make progress on the same thread."
          ]
        },
        {
          tab: "3. Core Rule",
          cardClass: "rule-card",
          title: "Why Async Matters",
          badge: "KEY INSIGHT",
          badgeClass: "badge-cyan",
          visual: "# 95% of lag is waiting on hardware/network I/O:\ndef download():\n    wait_for_satellite(12)  # Blocks everything!",
          bullets: [
            "CPU is idle 95% of the time during network or sensor waits.",
            "Async lets Python switch tasks instead of wasting idle time."
          ]
        }
      ]
    }
  },
  {
    stageNum: 2,
    sectionTag: "SECTION 1 OF 8 · THE BOTTLENECK",
    title: "Experiment: The Blocking Disaster",
    statusText: "SYSTEM: BLOCKED (DELAYED)",
    statusType: "warn",
    speech: "hit run and watch 5 electrical tasks execute back-to-back. spoiler: it's an L.",
    postSpeech: "35 whole seconds while the ship drifts?? bro that is NOT it. we need concurrency!",
    type: "seq-demo",
    cTitle: "⚡ Sequential Blocking Code",
    cCode:
`fix_wiring()       # 8s
download_nav()     # 12s
empty_bins()       # 7s
reactor_check()    # 5s
upload_manifest()  # 3s
# TOTAL: 35s — CPU sits idle between every step.`,
    cExplain: "Synchronous tasks wait end-to-end. One slow I/O call stalls every task queued behind it."
  },

  /* ── SECTION 2: COROUTINES (ASYNC DEF) ── */
  {
    stageNum: 3,
    sectionTag: "SECTION 2 OF 8 · COROUTINES",
    title: "Briefing: def vs. async def",
    statusText: "SYSTEM: LOGBOOK INSPECTION",
    statusType: "warn",
    speech: "normal functions are stubborn—they refuse to pause. coroutines?? they're cooperative!",
    postSpeech: "slap async on a function and suddenly it can pause. W lore drop 🫡",
    type: "theory-intro",
    theory: {
      badge: "MODULE 2 // COROUTINES",
      ctaText: "FLIP THE COROUTINE SWITCH ▶",
      sections: [
        {
          tab: "1. Standard def",
          cardClass: "sync-card",
          title: "Standard Function (def)",
          badge: "STUBBORN",
          badgeClass: "badge-red",
          visual: "def my_func():\n    # Runs straight to 'return'. Cannot pause.",
          bullets: [
            "Locks the call stack until finished.",
            "Calling <code>my_func()</code> executes immediately."
          ]
        },
        {
          tab: "2. async def",
          cardClass: "async-card",
          title: "Coroutine Function (async def)",
          badge: "COOPERATIVE",
          badgeClass: "badge-green",
          visual: "async def my_func():\n    # Can pause & yield control while waiting!",
          bullets: [
            "Can suspend mid-execution and resume later.",
            "Calling it returns a <strong>coroutine object</strong> (doesn't run yet)."
          ]
        },
        {
          tab: "3. Core Rule",
          cardClass: "rule-card",
          title: "Declaring a Coroutine",
          badge: "SYNTAX",
          badgeClass: "badge-cyan",
          visual: "async def fix_wiring():\n    return \"ready to pause\"",
          bullets: [
            "Add <code>async</code> before <code>def</code> to opt into cooperative multitasking."
          ]
        }
      ]
    }
  },
  {
    stageNum: 4,
    sectionTag: "SECTION 2 OF 8 · COROUTINES",
    title: "Hands-On: Declaring the Coroutine",
    statusText: "SYSTEM: CALIBRATING",
    statusType: "warn",
    speech: "flip the keyword switch to turn fix_wiring into a coroutine. let's cook!",
    postSpeech: "based! officially a coroutine now. next we tell it WHERE to pause.",
    type: "make-async",
    cTitle: "🔧 Declaring Coroutines with async def",
    cCode:
`async def fix_wiring():
    await wait_for_panel()  # Can yield while waiting!
    return "fixed"`,
    cExplain: "Adding `async` defines a coroutine capable of pausing at `await` points."
  },

  /* ── SECTION 3: THE AWAIT KEYWORD ── */
  {
    stageNum: 5,
    sectionTag: "SECTION 3 OF 8 · SUSPENSION POINTS",
    title: "Briefing: The Anatomy of await",
    statusText: "SYSTEM: SYNTAX DECODE",
    statusType: "warn",
    speech: "await basically tells python: 'i'm waiting on the sensor, go run someone else's task.' polite behavior fr.",
    postSpeech: "golden rule: await ONLY lives inside async def. anywhere else is SyntaxError!",
    type: "theory-intro",
    theory: {
      badge: "MODULE 3 // AWAIT",
      ctaText: "PRACTICE AWAIT PLACEMENT ▶",
      sections: [
        {
          tab: "1. What await Does",
          cardClass: "async-card",
          title: "Marking the Pause Point",
          badge: "YIELD CONTROL",
          badgeClass: "badge-green",
          visual: "result = await sense_panel()\n# Pauses here -> frees thread -> resumes with result",
          bullets: [
            "Suspends only the current coroutine until the work finishes.",
            "Frees the thread so other ready tasks can execute."
          ]
        },
        {
          tab: "2. Golden Rules",
          cardClass: "sync-card",
          title: "Where await Can Live",
          badge: "STRICT RULES",
          badgeClass: "badge-red",
          visual: "def bad():\n    await ping()  # ❌ SyntaxError!",
          bullets: [
            "<strong>Rule 1:</strong> <code>await</code> must sit inside an <code>async def</code>.",
            "<strong>Rule 2:</strong> Only await awaitables (coroutines, Tasks)."
          ]
        },
        {
          tab: "3. Mental Model",
          cardClass: "rule-card",
          title: "The Coffee Counter Analogy",
          badge: "INTUITION",
          badgeClass: "badge-cyan",
          visual: "Order drink ─▶ Step aside (await) ─▶ Next customer orders",
          bullets: [
            "You step aside while your drink brews instead of blocking the whole line."
          ]
        }
      ]
    }
  },
  {
    stageNum: 6,
    sectionTag: "SECTION 3 OF 8 · SUSPENSION POINTS",
    title: "Hands-On: Placing the Pause Point",
    statusText: "SYSTEM: SENSORS WAITING",
    statusType: "warn",
    speech: "don't slap await randomly bestie. click the exact slot where the sensor waits!",
    postSpeech: "await goes right before the waiting call! galaxy brain energy fr",
    type: "place-await",
    cTitle: "⏳ Suspending Execution with await",
    cCode:
`async def fix_wiring():
    result = await sense_panel()  # Yields while waiting
    connect_cables(result)
    return "wiring fixed"`,
    cExplain: "`await` pauses the coroutine at the sensor call and hands control back to the event loop."
  },

  /* ── SECTION 4: THE EVENT LOOP (ASYNCIO.RUN) ── */
  {
    stageNum: 7,
    sectionTag: "SECTION 4 OF 8 · EVENT LOOP",
    title: "Briefing: The Event Loop Engine",
    statusText: "SYSTEM: ARCHITECTURE CHECK",
    statusType: "warn",
    speech: "bro called fix_wiring() and literally nothing happened 💀 coroutines need a manager—the Event Loop.",
    postSpeech: "asyncio.run() spins up the air traffic controller and launches your code.",
    type: "theory-intro",
    theory: {
      badge: "MODULE 4 // DISPATCHER",
      ctaText: "DISPATCH TO EVENT LOOP ▶",
      sections: [
        {
          tab: "1. The Trap",
          cardClass: "sync-card",
          title: "Calling a Coroutine Directly",
          badge: "COMMON BUG",
          badgeClass: "badge-red",
          visual: ">>> fix_wiring()\n<coroutine object at 0x7f9...>\n⚠️ RuntimeWarning: was never awaited!",
          bullets: [
            "Calling <code>fix_wiring()</code> only creates a dormant object.",
            "Nothing inside its body actually executes yet."
          ]
        },
        {
          tab: "2. The Engine",
          cardClass: "async-card",
          title: "The Event Loop Solution",
          badge: "ORCHESTRATOR",
          badgeClass: "badge-green",
          visual: "import asyncio\nasyncio.run(fix_wiring())",
          bullets: [
            "The Event Loop polls tasks and resumes paused coroutines.",
            "<code>asyncio.run()</code> starts the loop, runs it, and closes cleanly."
          ]
        },
        {
          tab: "3. Core Rule",
          cardClass: "rule-card",
          title: "Top-Level Entry Point",
          badge: "BEST PRACTICE",
          badgeClass: "badge-cyan",
          visual: "async def main(): ...\nasyncio.run(main())  # Call once at root",
          bullets: [
            "Use <code>asyncio.run()</code> once as the main entry point of your script."
          ]
        }
      ]
    }
  },
  {
    stageNum: 8,
    sectionTag: "SECTION 4 OF 8 · EVENT LOOP",
    title: "Hands-On: Dispatching to the Loop",
    statusText: "SYSTEM: DISPATCHER READY",
    statusType: "warn",
    speech: "load that coroutine box into the dispatcher rotor. watch it spin!",
    postSpeech: "asyncio.run() managed the whole lifecycle cleanly. W dispatcher!",
    type: "run-coro",
    cTitle: "🎛️ Running Coroutines via asyncio.run()",
    cCode:
`import asyncio

async def fix_wiring():
    await sense_panel()

asyncio.run(fix_wiring())  # Starts & cleans up loop`,
    cExplain: "`asyncio.run()` creates the event loop, executes the coroutine to completion, and closes the loop."
  },

  /* ── SECTION 5: CONCURRENT BATCHES (GATHER) ── */
  {
    stageNum: 9,
    sectionTag: "SECTION 5 OF 8 · CONCURRENCY",
    title: "Briefing: The Squad Goal (gather)",
    statusText: "SYSTEM: MULTI-TASK PLANNING",
    statusType: "warn",
    speech: "if we await task1 then await task2... that's STILL sequential! enter: asyncio.gather().",
    postSpeech: "total time equals the LONGEST task, not the sum. math is mathing!",
    type: "theory-intro",
    theory: {
      badge: "MODULE 5 // BATCHING",
      ctaText: "ASSEMBLE THE SQUAD ▶",
      sections: [
        {
          tab: "1. Sequential Await",
          cardClass: "sync-card",
          title: "Awaiting One by One",
          badge: "STILL 27s",
          badgeClass: "badge-red",
          visual: "await fix_wiring()    # 8s\nawait download_nav()  # +12s\nawait empty_bins()    # +7s  => 27s total",
          bullets: [
            "Separate <code>await</code> lines still run one after another.",
            "Task 2 waits until Task 1 completely finishes."
          ]
        },
        {
          tab: "2. gather() Squad",
          cardClass: "async-card",
          title: "asyncio.gather()",
          badge: "ONLY 12s!",
          badgeClass: "badge-green",
          visual: "await asyncio.gather(\n    fix_wiring(), download_nav(), empty_bins()\n)  # Runs all at once => 12s max!",
          bullets: [
            "Starts all tasks together on the event loop.",
            "Collects results in order when the slowest task finishes."
          ]
        },
        {
          tab: "3. Formula",
          cardClass: "rule-card",
          title: "Concurrency Math",
          badge: "TIME SAVED",
          badgeClass: "badge-cyan",
          visual: "Total Time = max(Task_1, Task_2, Task_3)",
          bullets: [
            "Duration depends on the slowest task, not the sum of all waits."
          ]
        }
      ]
    }
  },
  {
    stageNum: 10,
    sectionTag: "SECTION 5 OF 8 · CONCURRENCY",
    title: "Hands-On: The Squad: asyncio.gather()",
    statusText: "SYSTEM: BUNDLING TASKS",
    statusType: "warn",
    speech: "click all three tasks to bundle them into gather(). watch the timer!",
    postSpeech: "12s instead of 27s!! genuinely so bussin fr fr 🔥",
    type: "gather",
    cTitle: "🔗 Concurrent Batching with asyncio.gather()",
    cCode:
`results = await asyncio.gather(
    fix_wiring(),    # 8s
    download_nav(),  # 12s
    empty_bins()     # 7s
)
# Finishes in 12s (longest task), not 27s!`,
    cExplain: "`asyncio.gather()` runs multiple awaitables concurrently and returns all results as a list."
  },

  /* ── SECTION 6: NON-BLOCKING DELAYS (SLEEP) ── */
  {
    stageNum: 11,
    sectionTag: "SECTION 6 OF 8 · NON-BLOCKING DELAYS",
    title: "Briefing: The Deadly Sleep Trap",
    statusText: "SYSTEM: TIMING PROTOCOLS",
    statusType: "warn",
    speech: "using time.sleep() in async code puts the whole ship in a coma. asyncio.sleep() is the goat.",
    postSpeech: "time.sleep is an impostor move. always await asyncio.sleep!",
    type: "theory-intro",
    theory: {
      badge: "MODULE 6 // SLEEP",
      ctaText: "COMPARE TIMELINES ▶",
      sections: [
        {
          tab: "1. Blocking Sleep",
          cardClass: "sync-card",
          title: "time.sleep(10)",
          badge: "THREAD COMA",
          badgeClass: "badge-red",
          visual: "import time\ntime.sleep(10)  # ❌ Freezes entire OS thread!",
          bullets: [
            "Locks the Python process; no other task can run.",
            "Completely defeats the event loop."
          ]
        },
        {
          tab: "2. Async Sleep",
          cardClass: "async-card",
          title: "await asyncio.sleep(10)",
          badge: "NON-BLOCKING",
          badgeClass: "badge-green",
          visual: "import asyncio\nawait asyncio.sleep(10)  # ✅ Yields control!",
          bullets: [
            "Pauses only this coroutine via an event-loop timer.",
            "Other tasks keep running during the 10s wait."
          ]
        },
        {
          tab: "3. Core Rule",
          cardClass: "rule-card",
          title: "Avoid Blocking Libraries",
          badge: "GOLDEN RULE",
          badgeClass: "badge-cyan",
          visual: "# Never mix blocking calls inside async def:\n# ❌ time.sleep(), requests.get()\n# ✅ asyncio.sleep(), httpx.AsyncClient()",
          bullets: [
            "Any blocking call stalls the entire single-threaded loop."
          ]
        }
      ]
    }
  },
  {
    stageNum: 12,
    sectionTag: "SECTION 6 OF 8 · NON-BLOCKING DELAYS",
    title: "Hands-On: The Timeline Showdown",
    statusText: "SYSTEM: REPAIRING REACTOR",
    statusType: "warn",
    speech: "toggle between the timelines and compare the dead time!",
    postSpeech: "asyncio.sleep() lets other tasks work during the wait. based behavior 🗿",
    type: "sleep-compare",
    cTitle: "💤 Non-Blocking Delay with asyncio.sleep()",
    cCode:
`async def reactor_check():
    await asyncio.sleep(10)  # Yields loop for 10s
    return "nominal"`,
    cExplain: "`asyncio.sleep()` yields control back to the event loop, unlike `time.sleep()` which freezes everything."
  },

  /* ── SECTION 7: ARCHITECTURAL SYNTHESIS ── */
  {
    stageNum: 13,
    sectionTag: "SECTION 7 OF 8 · SYNTHESIS",
    title: "Briefing: The Master Blueprint",
    statusText: "SYSTEM: UPLINK ARCHITECTURE",
    statusType: "warn",
    speech: "comms are almost back! quick recap of the 4 async pillars before you write the uplink.",
    postSpeech: "you have the blueprint. wire up the final script!",
    type: "theory-intro",
    theory: {
      badge: "MODULE 7 // BLUEPRINT",
      ctaText: "BUILD FINAL SCRIPT ▶",
      sections: [
        {
          tab: "1. The 4 Pillars",
          cardClass: "async-card",
          title: "Python Async Toolkit",
          badge: "ARCHITECTURE",
          badgeClass: "badge-green",
          visual: "1. async def  -> Define coroutine\n2. await      -> Yield during wait\n3. gather()   -> Run squad concurrently\n4. run()      -> Boot the Event Loop",
          bullets: [
            "Every keyword has one distinct job.",
            "Combine them cleanly for high-throughput Python."
          ]
        },
        {
          tab: "2. Mission Spec",
          cardClass: "rule-card",
          title: "Comms Uplink Requirements",
          badge: "FINAL GOAL",
          badgeClass: "badge-cyan",
          visual: "async def upload_manifest():\n    await asyncio.sleep(5)\nasyncio.run(upload_manifest())",
          bullets: [
            "Make <code>upload_manifest</code> a coroutine.",
            "Yield on sleep, then launch via <code>asyncio.run()</code>."
          ]
        }
      ]
    }
  },
  {
    stageNum: 14,
    sectionTag: "SECTION 7 OF 8 · SYNTHESIS",
    title: "Hands-On: Final Comms Uplink",
    statusText: "SYSTEM: READY FOR UPLINK",
    statusType: "warn",
    speech: "snap the right keyword chips into the blanks. no sus syntax!",
    postSpeech: "LETS GOOO! Station fully restored. Certified 10x engineer bestie! 🫡🎉",
    type: "fill-blanks",
    cTitle: "✅ Complete Python Async Pattern",
    cCode:
`import asyncio

async def upload_manifest():
    await asyncio.sleep(5)
    return "uploaded"

asyncio.run(upload_manifest())`,
    cExplain: "You combined `async def`, `await`, and `asyncio.run()` into a working non-blocking pipeline."
  },

  /* ── SECTION 8: CLIMAX & CHEAT SHEET ── */
  {
    stageNum: 15,
    sectionTag: "SECTION 8 OF 8 · CLIMAX",
    title: "Story Beat: The Doors Slam Shut",
    statusText: "SECURITY ALERT: LOCKDOWN",
    statusType: "danger",
    speech: "comms are back, oxygen is 100%! ...wait, why did the electrical doors just lock? 😳",
    postSpeech: "red is acting mad sus right now... step back from the vent!",
    type: "doors-shut",
    cTitle: "🔒 Security Override Log",
    cCode:
`# OVERRIDE: Internal Bulkhead Seal
# SECTOR:   The Skeld / Electrical Bay
# ENTITIES: 2 (Cyan, Red)
# WARNING:  Vent activity detected`,
    cExplain: "All ship systems are restored, leaving Cyan alone in Electrical with Red..."
  },
  {
    stageNum: 16,
    sectionTag: "SECTION 8 OF 8 · EPILOGUE",
    title: "Climax: Emergency Meeting",
    statusText: "CRITICAL: IMPOSTOR ATTACK",
    statusType: "danger",
    speech: "thanks for fixing the oxygen and comms bestie...",
    postSpeech: "gg no re 💀",
    type: "impostor-reveal",
    cTitle: "📜 Python asyncio Cheat Sheet",
    cCode:
`import asyncio

async def task():                # 1. Coroutine
    await asyncio.sleep(2)       # 2. Non-blocking yield

async def main():
    await asyncio.gather(        # 3. Concurrent batch
        task(), task()
    )

asyncio.run(main())              # 4. Event Loop`,
    cExplain: "Mastered: async def, await, asyncio.gather(), asyncio.sleep(), and asyncio.run()."
  }
];

/* ── State ── */
let cur = 0;
let curTheorySec = 0;
let activeViewTab = 'primary';
let doneStages = new Set();
let selectedWord = null;
let gatheredTasks = [];
let impostorTimerIds = [];

/* ── DOM Elements ── */
const appContainer = document.getElementById('app');
const hudStageTitle = document.getElementById('hud-stage-title');
const hudProgressFill = document.getElementById('hud-progress-fill');
const hudSysStatus = document.getElementById('hud-sys-status');
const hudStatusText = document.getElementById('hud-status-text');

const speech = document.getElementById('speech');
const speechBadge = document.getElementById('speech-badge');
const speechTag = document.getElementById('speech-tag');
const speechText = document.getElementById('speech-text');

const crewAvatar = document.getElementById('crew-avatar');
const crewVisorPath = document.getElementById('crew-visor-path');
const impostorKnife = document.getElementById('impostor-knife');
const deadBodyAvatar = document.getElementById('dead-body-avatar');
const ghostAvatar = document.getElementById('ghost-avatar');

const statCoros = document.getElementById('stat-coros');
const statLoad = document.getElementById('stat-load');

const screenSubtag = document.getElementById('screen-subtag');
const stageTitle = document.getElementById('stage-title');
const termStatusLbl = document.getElementById('term-status-lbl');
const viewTabs = document.getElementById('view-tabs');
const tabPrimary = document.getElementById('tab-primary');
const tabCode = document.getElementById('tab-code');
const iZone = document.getElementById('i-zone');

const conceptCard = document.getElementById('concept');
const cTitle = document.getElementById('c-title');
const cCode = document.getElementById('c-code');
const cExplain = document.getElementById('c-explain');

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const dotsContainer = document.getElementById('dots');

const introScreen = document.getElementById('intro-screen');
const introShhhPhase = document.getElementById('intro-shhh-phase');
const introRolePhase = document.getElementById('intro-role-phase');
const btnStartMission = document.getElementById('btn-start-mission');
const btnReplayIntro = document.getElementById('btn-replay-intro');

let introActive = true;
let introTimer = null;

/* ── Intro Cinematic Controller ── */
function playIntroSequence() {
  introActive = true;
  clearTimeout(introTimer);
  introScreen.classList.remove('dismissed');
  introShhhPhase.style.display = 'flex';
  introRolePhase.style.display = 'none';

  introTimer = setTimeout(() => {
    introShhhPhase.style.display = 'none';
    introRolePhase.style.display = 'flex';
  }, 1400);
}

function dismissIntro() {
  clearTimeout(introTimer);
  introActive = false;
  introScreen.classList.add('dismissed');
}

btnStartMission.onclick = () => { dismissIntro(); };
btnReplayIntro.onclick = () => { playIntroSequence(); };

/* ── Quip Lines on Crew Click ── */
const CREW_QUIPS = [
  "red is looking kinda safe tbh ඞ",
  "don't look at me i was in electrical fixing coroutines",
  "i swear if someone vents while i'm awaiting this download...",
  "asyncio > threading no cap",
  "blocking the event loop is mega sus bro",
  "if we don't finish these 16 slides the captain will vent us",
  "awaiting your next move bestie"
];

/* ── Syntax Highlighter Helper ── */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPython(code) {
  let s = esc(code);
  s = s.replace(/(#[^\n]*)/g, '<span class="cm">$1</span>');
  s = s.replace(/\b(async|await|def|import|return|print|from|as)\b/g, '<span class="kw">$1</span>');
  s = s.replace(/(&quot;[^&quot;]*&quot;|'[^']*')/g, '<span class="st">$1</span>');
  s = s.replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
  return s;
}

/* ── View Tab Switcher (Prevents screen overload by showing 1 pane at a time) ── */
function switchStageTab(tab) {
  activeViewTab = tab;
  if (tab === 'code') {
    iZone.classList.add('off');
    conceptCard.classList.remove('off');
    tabPrimary.classList.remove('active');
    tabCode.classList.add('active');
    tabCode.classList.remove('pulse-hint');
  } else {
    iZone.classList.remove('off');
    conceptCard.classList.add('off');
    tabPrimary.classList.add('active');
    tabCode.classList.remove('active');
  }
}

tabPrimary.onclick = () => switchStageTab('primary');
tabCode.onclick = () => switchStageTab('code');

function populateConceptCard(sc) {
  if (!sc.cCode) return;
  cTitle.textContent = sc.cTitle;
  cCode.innerHTML = highlightPython(sc.cCode);
  cExplain.textContent = sc.cExplain;
}

/* ── Navigation System ── */
function initStepper() {
  dotsContainer.innerHTML = '';
  SCENES.forEach((_, i) => {
    const pip = document.createElement('div');
    pip.className = 'step-pip';
    pip.title = `Slide ${i + 1}: ${SCENES[i].title}`;
    pip.onclick = () => {
      if (i <= cur || doneStages.has(i - 1)) {
        goToStage(i);
      }
    };
    dotsContainer.appendChild(pip);
  });
}

function updateHUD() {
  const sc = SCENES[cur];
  hudStageTitle.textContent = `SLIDE ${cur + 1} / ${SCENES.length}: ${sc.title.toUpperCase()}`;
  hudProgressFill.style.width = `${((cur + 1) / SCENES.length) * 100}%`;
  if (screenSubtag && sc.sectionTag) {
    screenSubtag.textContent = sc.sectionTag;
  }

  if (sc.statusType === 'danger') {
    hudSysStatus.className = 'status-pill status-danger';
    hudStatusText.textContent = sc.statusText;
    termStatusLbl.textContent = cur === 15 ? "CRITICAL ELIMINATION" : "SECURITY BREACH";
    termStatusLbl.parentElement.className = "screen-status-badge danger";
  } else if (doneStages.has(cur)) {
    hudSysStatus.className = 'status-pill status-ok';
    hudStatusText.textContent = "SYSTEM: NOMINAL (ASYNC ACTIVE)";
    termStatusLbl.textContent = sc.type === 'theory-intro' ? "CONCEPT BRIEFING" : "STAGE COMPLETE";
    termStatusLbl.parentElement.className = "screen-status-badge ok";
  } else {
    hudSysStatus.className = 'status-pill status-warn';
    hudStatusText.textContent = sc.statusText;
    termStatusLbl.textContent = sc.type === 'theory-intro' ? "CONCEPT BRIEFING" : "INTERACTION REQUIRED";
    termStatusLbl.parentElement.className = "screen-status-badge";
  }

  // Telemetry
  statCoros.textContent = `${cur + 1} / ${SCENES.length}`;
  statLoad.textContent = (cur === 15) ? "FATAL (KILLED)" : doneStages.has(cur) ? "18% (OPTIMAL)" : "94% (STALL)";

  // Stepper dots
  const pips = dotsContainer.querySelectorAll('.step-pip');
  pips.forEach((pip, idx) => {
    pip.className = 'step-pip';
    if (idx === cur) pip.classList.add('active');
    else if (doneStages.has(idx)) pip.classList.add('completed');
  });

  btnPrev.disabled = (cur === 0);
  btnNext.disabled = !doneStages.has(cur);

  if (cur === 14 && doneStages.has(14)) {
    btnNext.innerHTML = `CONFRONT RED <span class="btn-arrow">▶</span>`;
  } else if (cur === 15) {
    btnNext.innerHTML = `RESTART <span class="btn-arrow">🔄</span>`;
    btnNext.disabled = false;
  } else {
    btnNext.innerHTML = `NEXT <span class="btn-arrow">▶</span>`;
  }
}

btnPrev.onclick = () => { if (cur > 0) goToStage(cur - 1); };
btnNext.onclick = () => { 
  if (cur === 15) {
    resetAllToStart();
  } else if (cur < SCENES.length - 1) {
    goToStage(cur + 1); 
  }
};

window.addEventListener('keydown', (e) => {
  if (introActive && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault();
    dismissIntro();
    return;
  }
  if (e.key === 'ArrowRight' && !btnNext.disabled) {
    btnNext.click();
  } else if (e.key === 'ArrowLeft' && !btnPrev.disabled) {
    btnPrev.click();
  }
});

// Crewmate interactive click
crewAvatar.onclick = () => {
  if (cur === 15) return;
  crewAvatar.classList.add('talking');
  const randomQuip = CREW_QUIPS[Math.floor(Math.random() * CREW_QUIPS.length)];
  speechText.textContent = randomQuip;
  setTimeout(() => crewAvatar.classList.remove('talking'), 800);
};

/* ── Reset Everything to Stage 1 ── */
function resetAllToStart() {
  clearImpostorTimers();
  appContainer.classList.remove('emergency-alarm');
  crewAvatar.style.display = 'flex';
  crewAvatar.classList.remove('impostor-lunge');
  crewVisorPath.setAttribute('fill', 'url(#visorGrad)');
  impostorKnife.style.display = 'none';
  deadBodyAvatar.style.display = 'none';
  ghostAvatar.style.display = 'none';
  speech.classList.remove('impostor-speech');
  speechBadge.textContent = "RED CREWMATE";
  speechBadge.style.background = "var(--accent-red)";
  speechTag.textContent = "COMMS LOG";

  cur = 0;
  curTheorySec = 0;
  doneStages = new Set();
  selectedWord = null;
  gatheredTasks = [];
  initStepper();
  goToStage(0);
}

function clearImpostorTimers() {
  impostorTimerIds.forEach(id => clearTimeout(id));
  impostorTimerIds = [];
}

/* ── Scene Transitions ── */
function goToStage(idx) {
  clearImpostorTimers();
  cur = idx;
  curTheorySec = 0;
  selectedWord = null;
  gatheredTasks = [];

  const sc = SCENES[cur];
  stageTitle.textContent = sc.title;

  if (cur !== 15) {
    appContainer.classList.remove('emergency-alarm');
    crewAvatar.style.display = 'flex';
    crewAvatar.classList.remove('impostor-lunge');
    crewVisorPath.setAttribute('fill', 'url(#visorGrad)');
    impostorKnife.style.display = 'none';
    deadBodyAvatar.style.display = 'none';
    ghostAvatar.style.display = 'none';
    speech.classList.remove('impostor-speech');
    speechBadge.textContent = "RED CREWMATE";
    speechBadge.style.background = "var(--accent-red)";
    speechTag.textContent = "COMMS LOG";

    speechText.textContent = sc.speech;
    crewAvatar.classList.add('talking');
    setTimeout(() => crewAvatar.classList.remove('talking'), 700);
  }

  // Configure view tabs cleanly per slide
  viewTabs.classList.add('off');
  tabCode.classList.remove('pulse-hint');
  tabPrimary.textContent = cur === 15 ? '💀 Autopsy' : cur === 14 ? '🚨 Alert' : '🛠 Practice';
  tabCode.textContent = cur === 15 ? '📜 Cheat Sheet' : cur === 14 ? '🔒 Security Log' : '💡 Python Code';
  switchStageTab('primary');

  renderStageInteraction(sc);
  updateHUD();
}

/* ── Concept Card Unlocking (Switches cleanly via #view-tabs, never crowds screen) ── */
function unlockConcept(sc) {
  const firstUnlock = !doneStages.has(cur);
  doneStages.add(cur);

  if (sc.cCode) {
    populateConceptCard(sc);
    if (sc.type !== 'theory-intro') {
      viewTabs.classList.remove('off');
      tabCode.classList.add('pulse-hint');
    }
  }

  if (firstUnlock && cur !== 15 && sc.type !== 'theory-intro') {
    speechText.textContent = sc.postSpeech;
    crewAvatar.classList.add('talking');
    setTimeout(() => crewAvatar.classList.remove('talking'), 800);
  }

  updateHUD();
}

/* ══════════════════════════════════════════════════════════════════
   INTERACTION RENDERERS (16 STAGES · SECTIONED VIEWS)
   ══════════════════════════════════════════════════════════════════ */
function renderStageInteraction(sc) {
  iZone.innerHTML = '';

  if (doneStages.has(cur) && sc.type !== 'impostor-reveal' && sc.type !== 'theory-intro' && sc.type !== 'doors-shut') {
    iZone.innerHTML = `
      <div class="result-banner banner-success">
        <span>✅</span>
        <div>
          <strong>Stage complete!</strong> Switch to <strong>💡 Python Code</strong> above or click <strong>NEXT ▶</strong>.
        </div>
      </div>
    `;
    populateConceptCard(sc);
    viewTabs.classList.remove('off');
    return;
  }

  switch (sc.type) {
    case 'theory-intro':    renderTheoryIntro(sc); break;
    case 'seq-demo':        renderSeqDemo(sc); break;
    case 'make-async':      renderMakeAsync(sc); break;
    case 'place-await':     renderPlaceAwait(sc); break;
    case 'run-coro':        renderRunCoro(sc); break;
    case 'gather':          renderGather(sc); break;
    case 'sleep-compare':   renderSleepCompare(sc); break;
    case 'fill-blanks':     renderFillBlanks(sc); break;
    case 'doors-shut':      renderDoorsShut(sc); break;
    case 'impostor-reveal': renderImpostorReveal(sc); break;
  }
}

/* ── Generic Sectioned Theory Intro Renderer (1 Focused Section Per View) ── */
function renderTheoryIntro(sc) {
  doneStages.add(cur);
  const t = sc.theory;
  const sec = t.sections[curTheorySec] || t.sections[0];
  const isLast = curTheorySec >= t.sections.length - 1;

  iZone.innerHTML = `
    <div class="theory-container">
      <div class="theory-badge-row">
        <span class="theory-tag">${t.badge}</span>
        <div class="section-pills">
          ${t.sections.map((s, idx) => `
            <button class="section-pill-btn ${idx === curTheorySec ? 'active' : ''}" onclick="selectTheorySection(${idx})">
              ${s.tab}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="theory-card ${sec.cardClass}">
        <div class="theory-card-header">
          <span class="theory-card-title">${sec.title}</span>
          <span class="theory-card-badge ${sec.badgeClass}">${sec.badge}</span>
        </div>
        <div class="theory-flow-visual">${esc(sec.visual)}</div>
        <ul class="theory-bullet-list">
          ${sec.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>

      <div class="theory-actions-row">
        <span class="theory-step-hint">Part ${curTheorySec + 1} of ${t.sections.length}</span>
        <button class="btn-theory-ready" id="btn-theory-proceed">
          ${isLast ? t.ctaText : 'NEXT SECTION ▶'}
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-theory-proceed').onclick = () => {
    if (!isLast) {
      selectTheorySection(curTheorySec + 1);
    } else if (cur < SCENES.length - 1) {
      goToStage(cur + 1);
    }
  };
}

window.selectTheorySection = function(idx) {
  curTheorySec = idx;
  renderTheoryIntro(SCENES[cur]);
};

/* ── Stage 2: Sequential Demo ── */
function renderSeqDemo(sc) {
  const tasks = [
    { icon: '⚡', name: 'Fix Electrical Wiring', time: '8s',  dur: 1100 },
    { icon: '📡', name: 'Download Nav Ping',      time: '12s', dur: 1400 },
    { icon: '🗑️', name: 'Empty Storage Chute',    time: '7s',  dur: 1000 },
    { icon: '⚛️', name: 'Core Reactor Diagnostic',time: '5s',  dur: 800  },
    { icon: '📤', name: 'Upload Comms Manifest',  time: '3s',  dur: 600  }
  ];

  iZone.innerHTML = `
    <p class="i-prompt">The ship is running synchronous code. Click <strong>Run Tasks (Sequential)</strong> to observe how waiting on I/O stalls the entire crew.</p>
    
    <div class="task-grid-seq">
      ${tasks.map((t, idx) => `
        <div class="seq-task-card" id="seq-card-${idx}">
          <div class="task-icon-bubble">${t.icon}</div>
          <div class="task-info-block">
            <div class="task-title-row">
              <span class="task-label">${t.name}</span>
              <span class="task-duration">${t.time}</span>
            </div>
            <div class="task-bar-track">
              <div class="task-bar-fill" id="seq-bar-${idx}"></div>
            </div>
          </div>
          <div class="task-status-tag" id="seq-status-${idx}">STANDBY</div>
        </div>
      `).join('')}
    </div>

    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px;">
      <button class="btn-action-primary" id="btn-run-seq">
        <span>▶</span> RUN TASKS (BLOCKING)
      </button>
      <div id="seq-live-timer" style="font-family: var(--font-mono); font-size: 13px; color: var(--accent-amber); font-weight: 800;">
        TOTAL TIME: 0.0s
      </div>
    </div>
    
    <div id="seq-result-area"></div>
  `;

  const runBtn = document.getElementById('btn-run-seq');
  runBtn.onclick = () => {
    runBtn.disabled = true;
    executeSequentialStep(tasks, 0, 0, sc);
  };
}

function executeSequentialStep(tasks, index, accumulatedSeconds, sc) {
  if (index >= tasks.length) {
    document.getElementById('seq-live-timer').innerHTML = 
      `<span style="color: var(--accent-red)">TOTAL: 35.0s (BLOCKED)</span>`;
    
    document.getElementById('seq-result-area').innerHTML = `
      <div class="result-banner banner-warn">
        <span>⚠️</span>
        <div><strong>CRITICAL DELAY:</strong> 35 seconds elapsed! The reactor sat waiting for 20 seconds while the download was loading.</div>
      </div>
    `;

    setTimeout(() => unlockConcept(sc), 700);
    return;
  }

  const card = document.getElementById(`seq-card-${index}`);
  const bar = document.getElementById(`seq-bar-${index}`);
  const status = document.getElementById(`seq-status-${index}`);
  const timer = document.getElementById('seq-live-timer');

  card.classList.add('active');
  status.textContent = "RUNNING";
  bar.style.transition = `width ${tasks[index].dur}ms linear`;
  
  setTimeout(() => { bar.style.width = '100%'; }, 40);

  const parsedSeconds = parseInt(tasks[index].time);
  accumulatedSeconds += parsedSeconds;
  timer.textContent = `ELAPSED: ${accumulatedSeconds}.0s / 35.0s`;

  setTimeout(() => {
    card.classList.remove('active');
    card.classList.add('completed');
    status.textContent = "DONE";
    executeSequentialStep(tasks, index + 1, accumulatedSeconds, sc);
  }, tasks[index].dur + 80);
}

/* ── Stage 4: Make Async ── */
function renderMakeAsync(sc) {
  iZone.innerHTML = `
    <p class="i-prompt">The ship's manual instructs: <em>"Convert synchronous routines to coroutines so they can yield while waiting."</em> Click the function definition keyword below:</p>
    
    <div class="interactive-editor-box">
      <span class="switch-toggle-btn" id="async-toggle-btn" onclick="toggleAsyncKeyword()">
        def ⇄
      </span>
      <span class="fn">fix_wiring</span>():<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="cm"># This call will soon be able to pause!</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;wait_for_panel()<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> <span class="st">"wiring fixed"</span>
    </div>

    <div id="async-hint" class="result-banner banner-warn" style="background: rgba(0, 240, 255, 0.08); border-color: #243c60; color: #9ab4db;">
      <span>💡</span>
      <div>Click the highlighted <strong>def ⇄</strong> keyword button above to make this function a coroutine!</div>
    </div>
  `;
}

window.toggleAsyncKeyword = function() {
  const btn = document.getElementById('async-toggle-btn');
  if (btn.classList.contains('active')) return;

  btn.innerHTML = `async def`;
  btn.classList.add('active');
  
  document.getElementById('async-hint').className = "result-banner banner-success";
  document.getElementById('async-hint').innerHTML = `
    <span>✅</span>
    <div><strong>COROUTINE DECLARED!</strong> <code>async def</code> signals to Python that this function can be paused and resumed!</div>
  `;

  setTimeout(() => unlockConcept(SCENES[cur]), 500);
};

/* ── Stage 6: Place Await ── */
function renderPlaceAwait(sc) {
  iZone.innerHTML = `
    <p class="i-prompt">Where should the coroutine yield control? Click the correct <code>[ ??? ]</code> slot where <strong>await</strong> belongs:</p>

    <div class="await-code-view">
      <span class="kw">async def</span> <span class="fn">fix_wiring</span>():<br>
      &nbsp;&nbsp;&nbsp;&nbsp;result = <span class="await-slot-target" id="slot-ok" onclick="handleAwaitSlot(this, true)">???</span> sense_panel()<br>
      &nbsp;&nbsp;&nbsp;&nbsp;connect_cables(result)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> <span class="st">"fixed"</span>
    </div>

    <div class="await-code-view" style="opacity: 0.75; border-color: #202d45;">
      <span class="cm"># Ordinary synchronous helper function (outside async def):</span><br>
      <span class="kw">def</span> <span class="fn">backup_check</span>():<br>
      &nbsp;&nbsp;&nbsp;&nbsp;data = <span class="await-slot-target" id="slot-err" onclick="handleAwaitSlot(this, false)">???</span> query_db()
    </div>

    <div id="await-feedback" class="result-banner banner-warn" style="background: rgba(0, 240, 255, 0.08); border-color: #243c60; color: #9ab4db;">
      <span>💡</span>
      <div>Select the target call where the system must pause and await the sensor response.</div>
    </div>
  `;
}

window.handleAwaitSlot = function(el, isCorrect) {
  if (el.classList.contains('correct')) return;

  if (isCorrect) {
    el.textContent = "await";
    el.classList.add('correct');
    
    document.getElementById('await-feedback').className = "result-banner banner-success";
    document.getElementById('await-feedback').innerHTML = `
      <span>✅</span>
      <div><strong>PERFECT!</strong> <code>await</code> is placed directly before the async call inside <code>async def</code>!</div>
    `;

    setTimeout(() => unlockConcept(SCENES[cur]), 500);
  } else {
    el.textContent = "SyntaxError";
    el.classList.add('error');

    document.getElementById('await-feedback').className = "result-banner banner-warn";
    document.getElementById('await-feedback').innerHTML = `
      <span>❌</span>
      <div><strong>SyntaxError!</strong> <code>await</code> can NEVER be used inside a normal <code>def</code> function. It only works inside <code>async def</code>!</div>
    `;

    setTimeout(() => {
      el.classList.remove('error');
      el.textContent = "???";
    }, 900);
  }
};

/* ── Stage 8: Run Coroutine ── */
function renderRunCoro(sc) {
  iZone.innerHTML = `
    <p class="i-prompt">Coroutines do not run on their own when called. Click the coroutine package to dispatch it to the station's <strong>Event Loop</strong>:</p>

    <div class="loop-dispatch-grid">
      <div class="coro-package" id="coro-box" onclick="dispatchToEventLoop()">
        <div style="font-size: 26px; margin-bottom: 6px;">📦</div>
        <div style="font-family: var(--font-mono); font-size: 13px; font-weight: 800; color: var(--accent-cyan);">fix_wiring()</div>
        <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">Coroutine Object</div>
      </div>

      <div style="font-size: 24px; color: var(--text-dim);">➔</div>

      <div class="rotor-box">
        <div class="loop-rotor" id="event-loop-rotor">
          <span>🌀</span>
        </div>
        <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: #8ba5d1;">asyncio.run()</div>
      </div>
    </div>

    <div id="dispatch-hint" class="result-banner banner-warn" style="background: rgba(0, 240, 255, 0.08); border-color: #243c60; color: #9ab4db;">
      <span>👆</span>
      <div>Click the coroutine box to dispatch it to <strong>asyncio.run()</strong>!</div>
    </div>
  `;
}

window.dispatchToEventLoop = function() {
  const box = document.getElementById('coro-box');
  const rotor = document.getElementById('event-loop-rotor');
  if (box.classList.contains('dispatched')) return;

  box.classList.add('dispatched');
  rotor.classList.add('spinning');

  document.getElementById('dispatch-hint').className = "result-banner banner-success";
  document.getElementById('dispatch-hint').innerHTML = `
    <span>⚡</span>
    <div>Event Loop initialized! Dispatching coroutine and scheduling execution...</div>
  `;

  setTimeout(() => {
    rotor.classList.remove('spinning');
    rotor.innerHTML = "<span>✅</span>";
    document.getElementById('dispatch-hint').innerHTML = `
      <span>🎉</span>
      <div><strong>EXECUTION COMPLETED!</strong> <code>asyncio.run()</code> executed the coroutine and shut down the loop safely.</div>
    `;
    unlockConcept(SCENES[cur]);
  }, 1200);
};

/* ── Stage 10: Gather Squad ── */
function renderGather(sc) {
  gatheredTasks = [];
  const squad = [
    { id: 't1', name: 'fix_wiring()', time: '8s' },
    { id: 't2', name: 'download_nav()', time: '12s' },
    { id: 't3', name: 'empty_bins()', time: '7s' }
  ];

  iZone.innerHTML = `
    <p class="i-prompt">Click all three task routines to bundle them into <strong>asyncio.gather()</strong>:</p>

    <div class="gather-squad-zone">
      <div class="gather-chips-row">
        ${squad.map(t => `
          <button class="task-chip-btn" id="btn-gather-${t.id}" onclick="addGatherChip('${t.name}', this)">
            <span>➕</span> <code>${t.name}</code> <span style="font-size: 10.5px; opacity: 0.6;">(${t.time})</span>
          </button>
        `).join('')}
      </div>

      <div class="gather-terminal-preview" id="gather-preview">
        # Click tasks above to bundle into asyncio.gather(...)
      </div>

      <div style="display: flex; justify-content: flex-start;">
        <button class="btn-action-primary" id="btn-launch-gather" disabled onclick="executeGatheredTasks()">
          <span>🚀</span> LAUNCH CONCURRENTLY (gather)
        </button>
      </div>

      <div id="gather-result"></div>
    </div>
  `;
}

window.addGatherChip = function(taskName, btn) {
  if (btn.classList.contains('selected')) return;
  btn.classList.add('selected');
  btn.querySelector('span').textContent = "✓";
  gatheredTasks.push(taskName);

  const preview = document.getElementById('gather-preview');
  preview.classList.add('active');
  preview.innerHTML = `
    <span class="kw">await</span> asyncio.gather(<br>
    &nbsp;&nbsp;&nbsp;&nbsp;${gatheredTasks.map(t => `<span class="fn">${t}</span>`).join(',<br>&nbsp;&nbsp;&nbsp;&nbsp;')}<br>
    )
  `;

  if (gatheredTasks.length === 3) {
    document.getElementById('btn-launch-gather').disabled = false;
  }
};

window.executeGatheredTasks = function() {
  document.getElementById('btn-launch-gather').disabled = true;
  document.getElementById('gather-result').innerHTML = `
    <div class="result-banner banner-success" style="margin-top: 10px;">
      <span>⚡</span>
      <div><strong>CONCURRENCY ACHIEVED:</strong> All 3 tasks ran at the same time! Completed in <strong>12s</strong> (the time of the longest task), saving 15 seconds!</div>
    </div>
  `;

  setTimeout(() => unlockConcept(SCENES[cur]), 650);
};

/* ── Stage 12: Sleep Compare ── */
function renderSleepCompare(sc) {
  iZone.innerHTML = `
    <p class="i-prompt">The core reactor diagnostic must pause for 10s. Compare how blocking vs non-blocking delays affect overall execution:</p>

    <div class="timeline-toggle-bar">
      <button class="toggle-pill-btn active" id="btn-tl-block" onclick="toggleTimeline('block')">
        ❌ Blocking (time.sleep)
      </button>
      <button class="toggle-pill-btn" id="btn-tl-async" onclick="toggleTimeline('async')">
        ✅ Non-Blocking (asyncio.sleep)
      </button>
    </div>

    <div id="gantt-chart-wrapper"></div>
  `;

  renderGantt('block');
}

window.toggleTimeline = function(mode) {
  document.getElementById('btn-tl-block').classList.toggle('active', mode === 'block');
  document.getElementById('btn-tl-async').classList.toggle('active', mode === 'async');
  renderGantt(mode);
  
  if (mode === 'async') {
    setTimeout(() => unlockConcept(SCENES[cur]), 550);
  }
};

function renderGantt(mode) {
  const container = document.getElementById('gantt-chart-wrapper');
  
  if (mode === 'block') {
    container.innerHTML = `
      <div class="gantt-chart-container">
        <div class="gantt-row">
          <div class="gantt-label">reactor()</div>
          <div class="gantt-track">
            <div class="gantt-block" style="left: 0%; width: 33.3%; background: #ff385c;">PAUSED 10s</div>
          </div>
        </div>
        <div class="gantt-row">
          <div class="gantt-label">fix_wiring()</div>
          <div class="gantt-track">
            <div class="gantt-block" style="left: 33.3%; width: 26.6%; background: #b066ff;">8s (WAITING)</div>
          </div>
        </div>
        <div class="gantt-row">
          <div class="gantt-label">download()</div>
          <div class="gantt-track">
            <div class="gantt-block" style="left: 60%; width: 40%; background: #00f0ff;">12s (WAITING)</div>
          </div>
        </div>
        <div class="result-banner banner-warn" style="margin-top: 6px;">
          <span>⛔</span>
          <div>Total time: <strong>30.0s</strong> — <code>time.sleep(10)</code> stopped the entire loop!</div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="gantt-chart-container">
        <div class="gantt-row">
          <div class="gantt-label">reactor()</div>
          <div class="gantt-track">
            <div class="gantt-block" style="left: 0%; width: 83.3%; background: #ffb830;">await asyncio.sleep(10)</div>
          </div>
        </div>
        <div class="gantt-row">
          <div class="gantt-label">fix_wiring()</div>
          <div class="gantt-track">
            <div class="gantt-block" style="left: 0%; width: 66.6%; background: #b066ff;">8s (CONCURRENT)</div>
          </div>
        </div>
        <div class="gantt-row">
          <div class="gantt-label">download()</div>
          <div class="gantt-track">
            <div class="gantt-block" style="left: 0%; width: 100%; background: #00f0ff;">12s (CONCURRENT)</div>
          </div>
        </div>
        <div class="result-banner banner-success" style="margin-top: 6px;">
          <span>⚡</span>
          <div>Total time: <strong>12.0s</strong>! While the reactor slept, wiring and download ran alongside it!</div>
        </div>
      </div>
    `;
  }
}

/* ── Stage 14: Fill Blanks ── */
const CORRECT_BLANKS = {
  slot0: 'async',
  slot1: 'await',
  slot2: 'run'
};

function renderFillBlanks(sc) {
  selectedWord = null;
  const chips = ['async', 'await', 'run', 'gather'];

  iZone.innerHTML = `
    <p class="i-prompt">The master comms uplink script has missing keywords. Select a keyword chip below, then click the corresponding blank slot in the script:</p>

    <div class="blanks-code-board">
      <span class="kw">import</span> asyncio<br><br>
      <span class="code-blank-pill" id="slot0" onclick="insertChipIntoBlank('slot0')">___</span>
      <span class="kw">def</span> <span class="fn">upload_manifest</span>():<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">print</span>(<span class="st">"Uploading..."</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-blank-pill" id="slot1" onclick="insertChipIntoBlank('slot1')">___</span>
      asyncio.sleep(<span class="num">5</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> <span class="st">"uploaded"</span><br><br>
      asyncio.<span class="code-blank-pill" id="slot2" onclick="insertChipIntoBlank('slot2')">___</span>(upload_manifest())
    </div>

    <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); font-weight: 700;">
      AVAILABLE KEYWORD CHIPS:
    </div>

    <div class="chips-picker-deck">
      ${chips.map(word => `
        <button class="word-chip" id="chip-${word}" onclick="selectKeywordChip('${word}', this)">
          ${word}
        </button>
      `).join('')}
    </div>

    <div id="blank-status" class="result-banner banner-warn" style="background: rgba(0, 240, 255, 0.08); border-color: #243c60; color: #9ab4db; margin-top: 12px;">
      <span>💡</span>
      <div id="blank-msg">Select a chip above, then click a blank slot in the code.</div>
    </div>
  `;
}

window.selectKeywordChip = function(word, btn) {
  if (btn.classList.contains('used')) return;

  document.querySelectorAll('.word-chip').forEach(c => c.classList.remove('selected'));
  selectedWord = word;
  btn.classList.add('selected');

  document.getElementById('blank-msg').innerHTML = 
    `Selected: <strong>${word}</strong>. Now click the target slot in the code above!`;
};

window.insertChipIntoBlank = function(slotId) {
  if (!selectedWord) {
    document.getElementById('blank-msg').innerHTML = 
      `Please select a keyword chip below first!`;
    return;
  }

  const slot = document.getElementById(slotId);
  if (slot.classList.contains('locked')) return;

  if (selectedWord === CORRECT_BLANKS[slotId]) {
    slot.textContent = selectedWord;
    slot.classList.add('locked');

    const chip = document.getElementById(`chip-${selectedWord}`);
    if (chip) {
      chip.classList.add('used');
      chip.classList.remove('selected');
    }
    selectedWord = null;

    document.getElementById('blank-status').className = "result-banner banner-success";
    document.getElementById('blank-msg').innerHTML = 
      `Correct! <code>${CORRECT_BLANKS[slotId]}</code> placed successfully.`;

    const allLocked = ['slot0', 'slot1', 'slot2'].every(id => 
      document.getElementById(id).classList.contains('locked')
    );

    if (allLocked) {
      setTimeout(() => {
        document.getElementById('blank-status').innerHTML = `
          <span>🎉</span>
          <div><strong>TASKS COMPLETE!</strong> Comms are nominal. Click <strong>NEXT ▶</strong> to proceed!</div>
        `;
        unlockConcept(SCENES[cur]);
      }, 400);
    }
  } else {
    slot.classList.add('wrong');
    document.getElementById('blank-status').className = "result-banner banner-warn";
    document.getElementById('blank-msg').innerHTML = 
      `Incorrect slot for <code>${selectedWord}</code>! Try another position.`;

    setTimeout(() => slot.classList.remove('wrong'), 500);
  }
};

/* ── Stage 15: Doors Slam Shut Suspense ── */
function renderDoorsShut(sc) {
  iZone.innerHTML = `
    <div class="doors-slam-box">
      <div class="doors-icon">🚨</div>
      <div class="doors-heading">ELECTRICAL DOORS SEALED</div>
      <p class="doors-subtext">
        Heavy blast doors just slammed shut behind you. Check the unauthorized security override.
      </p>
      <button class="btn-action-primary" style="background: linear-gradient(135deg, #ff385c, #b80024); color: white;" onclick="investigateElectrical()">
        ⚠️ INSPECT SECURITY LOG
      </button>
    </div>
  `;
}

window.investigateElectrical = function() {
  unlockConcept(SCENES[cur]);
  switchStageTab('code');
};

/* ── Stage 16: The Impostor Reveal & Kill Cutscene ── */
function renderImpostorReveal(sc) {
  appContainer.classList.add('emergency-alarm');
  speech.classList.add('impostor-speech');
  speechBadge.textContent = "RED IMPOSTOR";
  speechBadge.style.background = "#ff1133";
  speechTag.textContent = "INTERNAL SABOTAGE";

  crewVisorPath.setAttribute('fill', 'url(#visorEvilGrad)');
  impostorKnife.style.display = 'block';

  iZone.innerHTML = `
    <div style="text-align: center; padding: 30px 10px; font-family: var(--font-mono); color: var(--accent-red);">
      <div style="font-size: 32px; animation: pulse-glow 0.6s infinite;">🚨</div>
      <div style="font-size: 16px; font-weight: 800; margin-top: 10px;">COMMUNICATIONS SEVERED</div>
      <div style="font-size: 11px; color: #ff99a8; margin-top: 5px;">AN ENTITY HAS BREACHED ELECTRICAL...</div>
    </div>
  `;

  speechText.textContent = "thanks for fixing the oxygen and comms bestie...";
  
  impostorTimerIds.push(setTimeout(() => {
    crewAvatar.classList.add('talking');
    speechText.textContent = "fire async code ngl... but you made one fatal mistake...";
  }, 1800));

  impostorTimerIds.push(setTimeout(() => {
    crewAvatar.classList.add('talking');
    speechText.textContent = "YOU FIXED ALL MY SABOTAGES. 🔪";
  }, 3600));

  impostorTimerIds.push(setTimeout(() => {
    crewAvatar.classList.add('talking');
    speechText.textContent = "you awaited your last coroutine bro. skill issue. 💀";
  }, 5200));

  impostorTimerIds.push(setTimeout(() => {
    crewAvatar.classList.add('impostor-lunge');

    setTimeout(() => {
      crewAvatar.style.display = 'none';
      deadBodyAvatar.style.display = 'flex';
      ghostAvatar.style.display = 'flex';

      speechBadge.textContent = "CYAN GHOST";
      speechBadge.style.background = "#00bcd4";
      speechText.textContent = "at least my tasks were non-blocking... 👻";

      iZone.innerHTML = `
        <div class="defeat-screen">
          <div class="defeat-title">DEFEAT</div>
          <div class="defeat-subtitle">RED WAS THE IMPOSTOR.</div>

          <div class="autopsy-report-card">
            <div class="autopsy-row">
              <span class="ak">CAUSE OF DEATH</span>
              <span class="av">Stood in Electrical awaiting I/O 💀</span>
            </div>
            <div class="autopsy-row">
              <span class="ak">CODE STATUS</span>
              <span class="av">100% Non-Blocking (16 / 16 Slides Complete)</span>
            </div>
            <div class="autopsy-row">
              <span class="ak">SURVIVAL TIP</span>
              <span class="av">Never trust def when you asked for async def</span>
            </div>
          </div>

          <button class="btn-restart-mission" onclick="resetAllToStart()">
            <span>🔄</span> REPLAY FROM SLIDE 1
          </button>
        </div>
      `;

      unlockConcept(sc);
    }, 600);

  }, 6600));
}

/* ── Boot Initial State ── */
initStepper();
goToStage(0);
playIntroSequence();
