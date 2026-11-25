/* ══════════════════════════════════════════════════════════════════
   PyBe — Async / Await & asyncio: The Skeld
   Author: Soumyashis Ghosh · @LuchaLibreAAA
   ══════════════════════════════════════════════════════════════════ */

/* ── 16-Slide Expanded Curriculum & Dialogue ── */
const SCENES = [
  /* ── MODULE 1: THE SYNCHRONOUS BOTTLENECK ── */
  {
    stageNum: 1,
    title: "Briefing: The Sequential Trap",
    statusText: "SYSTEM: DIAGNOSTIC MODE",
    statusType: "warn",
    speech: "yo cyan, welcome to electrical. the whole ship's systems are lagging because whoever coded this wrote everything in sequential python. it's giving dial-up internet in 2047 💀",
    postSpeech: "exactly. computers are lightning fast, but when they sit waiting on I/O, they're literally just burning daylight.",
    type: "theory-intro",
    theory: {
      badge: "MODULE 1 // THE PROBLEM",
      grid: [
        {
          title: "Synchronous (Blocking)",
          badge: "RUN-TO-COMPLETION",
          badgeClass: "badge-red",
          visual: "Task 1 ──[Waiting 12s]──> Task 2 ──[Waiting 8s]──> Done",
          bullets: [
            "Code executes one line strictly after another.",
            "If a line waits for a network ping, the <strong>entire process freezes</strong>.",
            "The CPU sits completely idle while the clock runs."
          ]
        },
        {
          title: "Asynchronous (Cooperative)",
          badge: "NON-BLOCKING",
          badgeClass: "badge-green",
          visual: "Task 1 ─[Pauses & Yields]─┐\nTask 2 ─[Executes During Wait]┘ ──> Concurrency!",
          bullets: [
            "Tasks can voluntarily pause while waiting on I/O.",
            "While Task 1 is waiting on satellite ping, Task 2 makes progress.",
            "Zero wasted time. Concurrency on a single thread!"
          ]
        }
      ],
      takeaway: "<strong>Core Principle:</strong> In software, 95% of 'waiting' is I/O (disk, sensors, APIs, networks). Blocking during I/O is the #1 cause of lag.",
      btnText: "INSPECT THE BLOCKING TASK QUEUE ▶"
    },
    cTitle: "⚡ The Problem: Synchronous Blocking Execution",
    cCode:
`# Synchronous tasks freeze the entire thread while waiting:
def download_data():
    wait_for_satellite(12)  # Process is frozen here for 12 seconds!
    return "done"

# Nothing else can execute until download_data() returns.`,
    cExplain: "Synchronous code runs strictly end-to-end. Any latency in external hardware halts the entire program."
  },
  {
    stageNum: 2,
    title: "Experiment: The Blocking Disaster",
    statusText: "SYSTEM: BLOCKED (DELAYED)",
    statusType: "warn",
    speech: "hit that run button and watch what happens when our 5 electrical tasks run back-to-back. spoiler alert: it's a disaster.",
    postSpeech: "35 whole seconds while the ship drifts?? bro that is NOT it. fr fr not it at all. we need concurrency!",
    type: "seq-demo",
    cTitle: "⚡ The Problem: Blocking / Sequential Execution",
    cCode:
`# Each task runs only AFTER the previous one finishes:
fix_wiring()       # 8s  — waiting on panel diagnostic
download_nav()     # 12s — waiting on satellite ping
empty_bins()       # 7s  — waiting on chute hydraulics
reactor_check()    # 5s  — waiting on core sensor
upload_manifest()  # 3s  — waiting on comms link

# TOTAL WAIT: 35 seconds. Ship is drifting. Big L.`,
    cExplain: "When code runs synchronously, any task waiting on I/O stops everything else from executing. The CPU sits idle while the clock runs."
  },

  /* ── MODULE 2: COROUTINES (ASYNC DEF) ── */
  {
    stageNum: 3,
    title: "Briefing: def vs. async def",
    statusText: "SYSTEM: LOGBOOK INSPECTION",
    statusType: "warn",
    speech: "bro the previous crewmate left a logbook! normal functions are so stubborn—they start and refuse to pause. but coroutines?? they're cooperative!",
    postSpeech: "slap async on a function and suddenly it's capable of pausing. W lore drop fr fr no cap 🫡",
    type: "theory-intro",
    theory: {
      badge: "MODULE 2 // COROUTINE ANATOMY",
      grid: [
        {
          title: "Standard Function (def)",
          badge: "STUBBORN",
          badgeClass: "badge-red",
          visual: "def my_func():\n    # Once entered, it CANNOT be paused from outside.\n    # Holds the call stack captive until 'return'.",
          bullets: [
            "Has a single entry point and a single exit point.",
            "Cannot yield control to let another function run.",
            "Calling it immediately executes its body."
          ]
        },
        {
          title: "Coroutine Function (async def)",
          badge: "COOPERATIVE",
          badgeClass: "badge-green",
          visual: "async def my_func():\n    # Declares a COROUTINE.\n    # Can be paused at 'await' and resumed later!",
          bullets: [
            "Can pause execution and resume where it left off.",
            "Yields control back to the scheduler during waits.",
            "Calling it returns a <strong>coroutine object</strong> (doesn't run yet!)."
          ]
        }
      ],
      takeaway: "<strong>Definition:</strong> A <code>coroutine</code> is a specialized Python function that can suspend its execution before reaching a return statement.",
      btnText: "TRY THE COROUTINE SWITCH ▶"
    },
    cTitle: "🔧 Standard Functions vs. Coroutines",
    cCode:
`# 1. Standard Function:
def sync_task():
    return "executed immediately"

# 2. Coroutine:
async def async_task():
    return "I am a coroutine object — execute me in an event loop!"`,
    cExplain: "`async def` signals to Python that this function will run cooperatively inside an event loop."
  },
  {
    stageNum: 4,
    title: "Hands-On: Declaring the Coroutine",
    statusText: "SYSTEM: CALIBRATING",
    statusType: "warn",
    speech: "the logbook has the syntax. flip the switch to make fix_wiring a coroutine. let's cook!",
    postSpeech: "based! it's officially a coroutine now. next we need to tell it WHERE to pause.",
    type: "make-async",
    cTitle: "🔧 Declaring Coroutines with async def",
    cCode:
`# Standard function — runs straight through, cannot pause:
def fix_wiring():
    wait_for_panel()   # blocks the entire thread
    return "fixed"

# Coroutine function — CAN pause to let other tasks execute:
async def fix_wiring():
    await wait_for_panel()  # yields control while waiting!
    return "fixed"`,
    cExplain: "Adding `async def` defines a coroutine. Unlike regular functions, coroutines can pause execution at specific points and return control back to the scheduler."
  },

  /* ── MODULE 3: THE AWAIT KEYWORD ── */
  {
    stageNum: 5,
    title: "Briefing: The Anatomy of await",
    statusText: "SYSTEM: SYNTAX DECODE",
    statusType: "warn",
    speech: "so what actually happens when you say await?? you're basically telling python: 'i'm waiting for the sensor, go run someone else's code until it's ready'. polite behavior fr.",
    postSpeech: "remember the golden rule: await can ONLY be written inside an async def function. anywhere else is a straight SyntaxError.",
    type: "theory-intro",
    theory: {
      badge: "MODULE 3 // SUSPENSION POINTS",
      grid: [
        {
          title: "The Role of await",
          badge: "YIELD POINT",
          badgeClass: "badge-green",
          visual: "result = await sense_panel()\n  │         │\n  │         └─> 'Hey loop, pause me until sense_panel() is done!'\n  └───────────> Resumes here with the return value",
          bullets: [
            "Suspends the current coroutine until the operation completes.",
            "Frees the single execution thread to run other pending tasks.",
            "Unpacks the eventual return value once ready."
          ]
        },
        {
          title: "The Golden Rules of await",
          badge: "RULES",
          badgeClass: "badge-red",
          visual: "RULE 1: 'await' MUST be inside 'async def'.\nRULE 2: You can only await 'awaitables' (coroutines, Tasks, Futures).",
          bullets: [
            "Writing <code>await</code> in a regular <code>def</code> is an immediate <code>SyntaxError</code>.",
            "You cannot await non-awaitable values like integers or strings."
          ]
        }
      ],
      takeaway: "<strong>Mental Model:</strong> Think of <code>await</code> as stepping aside at the coffee shop counter while the barista makes your drink, so the next customer can order.",
      btnText: "PRACTICE AWAIT PLACEMENT ▶"
    },
    cTitle: "⏳ The await Keyword",
    cCode:
`async def fetch_telemetry():
    # 'await' marks the exact suspension point:
    reading = await sensor.read_pressure()
    return reading * 2`,
    cExplain: "`await` hands control back to the event loop. While the sensor is being read, the CPU executes other ready tasks."
  },
  {
    stageNum: 6,
    title: "Hands-On: Placing the Pause Point",
    statusText: "SYSTEM: SENSORS WAITING",
    statusType: "warn",
    speech: "don't just slap await anywhere bestie. click the exact slot where the sensor pause happens!",
    postSpeech: "await goes at the exact WAITING point! while the sensor loads, other tasks can run. galaxy brain energy fr",
    type: "place-await",
    cTitle: "⏳ await: Suspending Execution",
    cCode:
`async def fix_wiring():
    # 'await' pauses this coroutine until sense_panel() finishes.
    # While paused, other coroutines make progress!
    result = await sense_panel()
    
    connect_cables(result)
    return "wiring fixed"

# RULE: 'await' can ONLY be used inside an 'async def' function!`,
    cExplain: "`await` suspends execution of the current coroutine until the awaited awaitable completes. It hands control back to the event loop so other tasks aren't blocked."
  },

  /* ── MODULE 4: THE EVENT LOOP (ASYNCIO.RUN) ── */
  {
    stageNum: 7,
    title: "Briefing: The Event Loop Engine",
    statusText: "SYSTEM: ARCHITECTURE CHECK",
    statusType: "warn",
    speech: "bro called `fix_wiring()` and literally nothing happened 💀 coroutines don't run themselves! they need a manager. that's the Event Loop.",
    postSpeech: "the event loop is the air traffic controller. asyncio.run() creates the runway and launches the flight.",
    type: "theory-intro",
    theory: {
      badge: "MODULE 4 // THE DISPATCHER",
      grid: [
        {
          title: "The Problem with Calling Coroutines",
          badge: "COMMON TRAP",
          badgeClass: "badge-red",
          visual: ">>> fix_wiring()\n<coroutine object fix_wiring at 0x7f9...>\n\n⚠️ RuntimeWarning: coroutine 'fix_wiring' was never awaited!",
          bullets: [
            "Invoking a coroutine function does NOT run its code.",
            "It only creates and returns a dormant <code>coroutine object</code>.",
            "It sits frozen in memory until an event loop drives it."
          ]
        },
        {
          title: "The Event Loop Solution",
          badge: "THE ENGINE",
          badgeClass: "badge-green",
          visual: "import asyncio\nasyncio.run(fix_wiring())\n\n1. Spawns Event Loop\n2. Executes coroutine to completion\n3. Closes loop cleanly",
          bullets: [
            "The <strong>Event Loop</strong> keeps a queue of all active tasks.",
            "Continuously polls: 'Who is ready to resume? Who is still waiting?'",
            "<code>asyncio.run()</code> is the official entry point for Python 3.7+."
          ]
        }
      ],
      takeaway: "<strong>Rule of Thumb:</strong> Use <code>asyncio.run()</code> once as the top-level main entry point of your program.",
      btnText: "DISPATCH TO THE EVENT LOOP ▶"
    },
    cTitle: "🎛️ The Event Loop Dispatcher",
    cCode:
`import asyncio

async def main():
    print("Ship online!")

# Starts the event loop, runs main(), and closes the loop:
asyncio.run(main())`,
    cExplain: "`asyncio.run()` is the bootstrap function that initializes the event loop and manages its lifecycle."
  },
  {
    stageNum: 8,
    title: "Hands-On: Dispatching to the Loop",
    statusText: "SYSTEM: DISPATCHER READY",
    statusType: "warn",
    speech: "take that coroutine package and load it into the dispatcher rotor. watch it spin up!",
    postSpeech: "asyncio.run() handed it to the event loop and handled it cleanly! the dispatcher has rizz fr",
    type: "run-coro",
    cTitle: "🎛️ The Event Loop: The Dispatcher",
    cCode:
`import asyncio

async def fix_wiring():
    await sense_panel()
    return "wiring fixed"

# Just calling fix_wiring() does NOT run it.
# asyncio.run() starts the event loop and runs it:
asyncio.run(fix_wiring())`,
    cExplain: "Calling a coroutine returns a coroutine *object* — it doesn't execute it. `asyncio.run()` starts the event loop, hands it the coroutine, and manages its full lifecycle."
  },

  /* ── MODULE 5: CONCURRENT BATCHES (GATHER) ── */
  {
    stageNum: 9,
    title: "Briefing: The Squad Goal (gather)",
    statusText: "SYSTEM: MULTI-TASK PLANNING",
    statusType: "warn",
    speech: "if we just `await task1()` then `await task2()`... that's STILL sequential! we're not using the superpowers of async yet. enter: gather.",
    postSpeech: "the math is so satisfying: total time equals the LONGEST task, not the sum of all tasks. that's concurrency baby!",
    type: "theory-intro",
    theory: {
      badge: "MODULE 5 // CONCURRENT BATCHING",
      grid: [
        {
          title: "Awaiting One by One (Still Slow)",
          badge: "SEQUENTIAL ASYNC",
          badgeClass: "badge-red",
          visual: "await fix_wiring()    # Waits 8s\nawait download_nav()  # Waits 12s\nawait empty_bins()    # Waits 7s\n\nTotal Duration = 8 + 12 + 7 = 27 seconds!",
          bullets: [
            "Even with <code>await</code>, writing them on separate lines runs them sequentially.",
            "Task 2 does not start until Task 1 has fully finished."
          ]
        },
        {
          title: "asyncio.gather() (True Concurrency)",
          badge: "SQUAD BATCH",
          badgeClass: "badge-green",
          visual: "await asyncio.gather(\n    fix_wiring(),    # Starts now (8s)\n    download_nav(),  # Starts now (12s)\n    empty_bins()     # Starts now (7s)\n)\nTotal Duration = max(8, 12, 7) = 12 seconds!",
          bullets: [
            "Starts all supplied coroutines <strong>concurrently</strong>.",
            "Collects all results into a single list in the same order.",
            "Completes as soon as the slowest task finishes!"
          ]
        }
      ],
      takeaway: "<strong>Formula:</strong> With <code>asyncio.gather()</code>, Time = Max(Task_1, Task_2, ...). You save massive amounts of idle time.",
      btnText: "ASSEMBLE THE SQUAD ▶"
    },
    cTitle: "🔗 Coordinating Batches with asyncio.gather",
    cCode:
`import asyncio

async def main():
    # Launch tasks concurrently and await all results:
    results = await asyncio.gather(
        fetch_sensor_a(),
        fetch_sensor_b()
    )`,
    cExplain: "`asyncio.gather()` bundles multiple coroutines together, scheduling them all concurrently on the event loop."
  },
  {
    stageNum: 10,
    title: "Hands-On: The Squad: asyncio.gather()",
    statusText: "SYSTEM: BUNDLING TASKS",
    statusType: "warn",
    speech: "click all three tasks to bundle them into the squad launcher. let's see how fast they finish together!",
    postSpeech: "gather() ran them ALL concurrently! clock finished in 12s instead of 27s! genuinely so bussin fr fr 🔥",
    type: "gather",
    cTitle: "🔗 asyncio.gather(): Concurrent Coordination",
    cCode:
`import asyncio

async def main():
    # All three coroutines start immediately and run concurrently!
    results = await asyncio.gather(
        fix_wiring(),    # 8s
        download_nav(),  # 12s
        empty_bins()     # 7s
    )
    # Total execution time ≈ 12s (the longest task), NOT 27s!

asyncio.run(main())`,
    cExplain: "`asyncio.gather()` accepts multiple awaitables and coordinates them concurrently. The overall duration is determined by the slowest task, rather than their cumulative sum."
  },

  /* ── MODULE 6: DELAYS (SLEEP) ── */
  {
    stageNum: 11,
    title: "Briefing: The Deadly Sleep Trap",
    statusText: "SYSTEM: TIMING PROTOCOLS",
    statusType: "warn",
    speech: "PSA: using `time.sleep()` in async code is the biggest rookie mistake in python. it puts the whole loop into a coma. `asyncio.sleep()` is the real goat.",
    postSpeech: "time.sleep is literally an imposter move. always use await asyncio.sleep to yield control while waiting.",
    type: "theory-intro",
    theory: {
      badge: "MODULE 6 // NON-BLOCKING DELAYS",
      grid: [
        {
          title: "time.sleep(10) [The Blocker]",
          badge: "THREAD COMA",
          badgeClass: "badge-red",
          visual: "import time\ntime.sleep(10)  # Halts the OS thread completely!\n\n❌ Event Loop is FROZEN.\n❌ No other coroutine can run.\n❌ Web servers drop connections.",
          bullets: [
            "Tells the operating system to put the entire Python process to sleep.",
            "The event loop cannot switch tasks during a <code>time.sleep</code>.",
            "Defeats the entire purpose of writing async code."
          ]
        },
        {
          title: "asyncio.sleep(10) [The Cooperator]",
          badge: "NON-BLOCKING",
          badgeClass: "badge-green",
          visual: "import asyncio\nawait asyncio.sleep(10)  # Yields control!\n\n✅ Event loop runs other tasks for 10s.\n✅ Resumes this task when timer fires.\n✅ Server remains 100% responsive.",
          bullets: [
            "Registers a timer callback with the event loop.",
            "Instantly relinquishes control so other coroutines proceed.",
            "Used in production to model simulated delays, heartbeats, and retries."
          ]
        }
      ],
      takeaway: "<strong>Golden Rule:</strong> Never call blocking synchronous libraries (like <code>time.sleep</code> or standard <code>requests.get</code>) inside an async function.",
      btnText: "COMPARE TIMELINE CHARTS ▶"
    },
    cTitle: "💤 time.sleep vs asyncio.sleep",
    cCode:
`# WRONG — Freezes the entire event loop:
import time
time.sleep(5)

# RIGHT — Yields control to other coroutines for 5 seconds:
import asyncio
await asyncio.sleep(5)`,
    cExplain: "`asyncio.sleep` creates a non-blocking pause, allowing other tasks to utilize the CPU during the delay."
  },
  {
    stageNum: 12,
    title: "Hands-On: The Timeline Showdown",
    statusText: "SYSTEM: REPAIRING REACTOR",
    statusType: "warn",
    speech: "toggle between the two timelines. look at how much dead time time.sleep() creates compared to non-blocking sleep.",
    postSpeech: "asyncio.sleep() yields control so others run during the wait! it's giving sacrifice for the greater good 🗿 based behavior",
    type: "sleep-compare",
    cTitle: "💤 asyncio.sleep(): Yielding Control",
    cCode:
`import asyncio

async def reactor_check():
    print("Beginning diagnostic...")
    # Does NOT block the thread — yields control to other tasks!
    await asyncio.sleep(10)
    print("Reactor nominal!")

# NEVER use time.sleep() inside async code — it freezes the loop!
# ALWAYS use await asyncio.sleep() to simulate or handle delays.`,
    cExplain: "`asyncio.sleep(seconds)` is non-blocking. It pauses the current coroutine while letting the event loop execute other tasks. In contrast, `time.sleep()` freezes the entire Python process."
  },

  /* ── MODULE 7: SYNTHESIS ── */
  {
    stageNum: 13,
    title: "Briefing: The Master Blueprint",
    statusText: "SYSTEM: UPLINK ARCHITECTURE",
    statusType: "warn",
    speech: "comms are almost back online. all we need is the master uplink script. let's review the four pillars before you assemble it.",
    postSpeech: "you have the full blueprint now. assemble the final script without any bugs and The Skeld is saved!",
    type: "theory-intro",
    theory: {
      badge: "MODULE 7 // ARCHITECTURAL SYNTHESIS",
      grid: [
        {
          title: "The 4 Pillars of Python Async",
          badge: "ARCHITECTURE",
          badgeClass: "badge-green",
          visual: "1. async def  ──> Declares the coroutine function\n2. await      ──> Yields control at I/O waiting points\n3. gather()   ──> Batches multiple coroutines concurrently\n4. run()      ──> Initializes the Event Loop manager",
          bullets: [
            "Every piece has a distinct, irreplaceable responsibility.",
            "Omit <code>async def</code>: you cannot use <code>await</code>.",
            "Omit <code>await</code>: you block the thread or get un-awaited coroutine warnings.",
            "Omit <code>gather</code>: your tasks run sequentially.",
            "Omit <code>run</code>: your program never starts."
          ]
        },
        {
          title: "The Comms Uplink Mission",
          badge: "FINAL OBJECTIVE",
          badgeClass: "badge-red",
          visual: "upload_manifest() needs to:\n- Declare as async\n- Yield non-blocking sleep(5)\n- Execute inside asyncio.run()",
          bullets: [
            "Uploads crew records and nav data to central fleet.",
            "Will run concurrently with wiring and sensor loops."
          ]
        }
      ],
      takeaway: "<strong>Final Milestone:</strong> You are about to construct a production-ready asynchronous Python program from scratch.",
      btnText: "BUILD THE MASTER SCRIPT ▶"
    },
    cTitle: "📜 The Complete Asynchronous Pattern",
    cCode:
`import asyncio

async def upload_manifest():
    print("Uploading...")
    await asyncio.sleep(5)
    print("Upload complete!")

async def main():
    await asyncio.gather(upload_manifest())

asyncio.run(main())`,
    cExplain: "Combining `async def`, `await`, `gather`, and `run` creates a robust, cooperative, high-throughput program."
  },
  {
    stageNum: 14,
    title: "Hands-On: Final Comms Uplink",
    statusText: "SYSTEM: READY FOR UPLINK",
    statusType: "warn",
    speech: "pick the keyword chips below and snap them into their correct slots. no typos, no sus syntax!",
    postSpeech: "LETS GOOO! Manifest uploaded, station fully restored. You're a certified 10x engineer bestie! W crew. fr fr no cap 🫡🎉",
    type: "fill-blanks",
    cTitle: "✅ The Complete Python Async Architecture",
    cCode:
`import asyncio

async def upload_manifest():
    print("Uploading nav data...")
    await asyncio.sleep(5)
    print("Manifest uploaded!")

async def main():
    await asyncio.gather(
        fix_wiring(),
        download_nav(),
        upload_manifest()
    )

# Start the event loop and execute the coordinated pipeline:
asyncio.run(main())`,
    cExplain: "The complete pattern: 1) Declare with `async def`, 2) Yield waits with `await`, 3) Bundle concurrent tasks with `asyncio.gather()`, and 4) Dispatch via `asyncio.run()`."
  },

  /* ── MODULE 8: CLIMAX & IMPOSTOR REVEAL ── */
  {
    stageNum: 15,
    title: "Story Beat: The Doors Slam Shut",
    statusText: "SECURITY ALERT: LOCKDOWN",
    statusType: "danger",
    speech: "LETS GOOO! Comms are back, oxygen is 100%! You're a certified 10x engineer bestie... wait, why did the electrical doors just lock? 😳",
    postSpeech: "red is acting mad sus right now... step back from the vent!",
    type: "doors-shut",
    cTitle: "⚠️ Security Lockdown: Electrical Compartment",
    cCode:
`# ALERT: Internal Security Override Triggered
# Location: The Skeld / Electrical Bay
# Status: Doors Sealed
# Active Entities: 2 (Cyan, Red)`,
    cExplain: "The ship systems have been saved, but someone on board had a very different plan for Electrical bay."
  },
  {
    stageNum: 16,
    title: "Climax: Emergency Meeting",
    statusText: "CRITICAL: IMPOSTOR ATTACK",
    statusType: "danger",
    speech: "thanks for fixing the oxygen and comms bestie...",
    postSpeech: "gg no re 💀",
    type: "impostor-reveal",
    cTitle: "📜 Python asyncio: The Complete Cheat Sheet",
    cCode:
`# --- PYTHON ASYNC CHEAT SHEET ---
# 1. Declare a coroutine:
async def perform_task():
    # 2. Yield control while waiting on I/O:
    await asyncio.sleep(2)
    return "done"

# 3. Coordinate multiple concurrent coroutines:
async def main():
    results = await asyncio.gather(
        perform_task(),
        perform_task()
    )

# 4. Initialize the event loop:
asyncio.run(main())

# ...and NEVER stand alone in Electrical with Red.`,
    cExplain: "You have mastered async Python: coroutines (async def), non-blocking pauses (await), concurrent batches (asyncio.gather), non-blocking delays (asyncio.sleep), and the event loop dispatcher (asyncio.run)."
  }
];

/* ── State ── */
let cur = 0;
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

const stageTitle = document.getElementById('stage-title');
const termStatusLbl = document.getElementById('term-status-lbl');
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

  if (sc.statusType === 'danger') {
    hudSysStatus.className = 'status-pill status-danger';
    hudStatusText.textContent = sc.statusText;
    termStatusLbl.textContent = cur === 15 ? "CRITICAL ELIMINATION" : "SECURITY BREACH";
    termStatusLbl.parentElement.className = "screen-status-badge danger";
  } else if (doneStages.has(cur)) {
    hudSysStatus.className = 'status-pill status-ok';
    hudStatusText.textContent = "SYSTEM: NOMINAL (ASYNC ACTIVE)";
    termStatusLbl.textContent = "STAGE COMPLETE";
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

  conceptCard.classList.add('off');
  renderStageInteraction(sc);
  updateHUD();
}

/* ── Concept Card Unlocking ── */
function unlockConcept(sc) {
  if (doneStages.has(cur)) return;
  doneStages.add(cur);

  cTitle.textContent = sc.cTitle;
  cCode.innerHTML = highlightPython(sc.cCode);
  cExplain.textContent = sc.cExplain;
  conceptCard.classList.remove('off');

  if (cur !== 15 && sc.type !== 'theory-intro') {
    speechText.textContent = sc.postSpeech;
    crewAvatar.classList.add('talking');
    setTimeout(() => crewAvatar.classList.remove('talking'), 800);
  }

  updateHUD();
}

/* ══════════════════════════════════════════════════════════════════
   INTERACTION RENDERERS (16 STAGES)
   ══════════════════════════════════════════════════════════════════ */
function renderStageInteraction(sc) {
  iZone.innerHTML = '';

  if (doneStages.has(cur) && sc.type !== 'impostor-reveal' && sc.type !== 'theory-intro' && sc.type !== 'doors-shut') {
    iZone.innerHTML = `
      <div class="result-banner banner-success">
        <span>✅</span>
        <div><strong>Stage interaction completed!</strong> Review the Python architecture below and proceed to the next module.</div>
      </div>
    `;
    unlockConcept(sc);
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

/* ── Generic Theory Intro Renderer ── */
function renderTheoryIntro(sc) {
  doneStages.add(cur);
  const t = sc.theory;
  iZone.innerHTML = `
    <div class="theory-container">
      <div class="theory-badge-row">
        <span class="theory-tag">${t.badge}</span>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">CONCEPT DEEP DIVE</span>
      </div>

      <div class="theory-grid-2">
        ${t.grid.map(c => `
          <div class="theory-card ${c.badgeClass === 'badge-red' ? 'sync-card' : 'async-card'}">
            <div class="theory-card-header">
              <span class="theory-card-title">${c.title}</span>
              <span class="theory-card-badge ${c.badgeClass}">${c.badge}</span>
            </div>
            <div class="theory-flow-visual" style="white-space: pre-wrap;">${esc(c.visual)}</div>
            <ul class="theory-bullet-list">
              ${c.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="theory-takeaway-box">
        ${t.takeaway}
      </div>

      <button class="btn-theory-ready" id="btn-theory-proceed">
        <span>✓</span> ${t.btnText}
      </button>
    </div>
  `;

  document.getElementById('btn-theory-proceed').onclick = () => {
    unlockConcept(sc);
    // Proceed to next slide automatically after clicking got it
    if (cur < SCENES.length - 1) {
      setTimeout(() => goToStage(cur + 1), 300);
    }
  };
}

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
        A loud pneumatic hiss echoes through the bulkheads. The heavy blast doors have slammed shut. The terminal displays an unauthorized security override...
      </p>
      <button class="btn-action-primary" style="background: linear-gradient(135deg, #ff385c, #b80024); color: white;" onclick="unlockConcept(SCENES[cur])">
        ⚠️ INVESTIGATE ELECTRICAL BAY
      </button>
    </div>
  `;
}

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
      <div style="font-size: 11px; color: #ff99a8; margin-top: 5px;">AN ENTITY HAS BREACHED ELECTRICAL DOORS...</div>
    </div>
  `;

  speechText.textContent = "thanks for fixing the oxygen, wiring, and nav comms bestie...";
  
  impostorTimerIds.push(setTimeout(() => {
    crewAvatar.classList.add('talking');
    speechText.textContent = "you wrote fire async code ngl... but you made one fatal mistake...";
  }, 1800));

  impostorTimerIds.push(setTimeout(() => {
    crewAvatar.classList.add('talking');
    speechText.textContent = "YOU FIXED ALL MY SABOTAGES. 🔪";
  }, 3600));

  impostorTimerIds.push(setTimeout(() => {
    crewAvatar.classList.add('talking');
    speechText.textContent = "you awaited your last coroutine bro. it's giving skill issue. 💀";
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
              <span class="ak">VICTIM</span>
              <span class="av">Cyan Crewmate (Python Intern)</span>
            </div>
            <div class="autopsy-row">
              <span class="ak">CAUSE OF DEATH</span>
              <span class="av">Stood in Electrical awaiting I/O 💀</span>
            </div>
            <div class="autopsy-row">
              <span class="ak">CODE EFFICIENCY</span>
              <span class="av">100% Concurrency (All 16 Stages Mastered)</span>
            </div>
            <div class="autopsy-row">
              <span class="ak">IMPOSTORS REMAINING</span>
              <span class="av">1 (Red is currently venting into MedBay)</span>
            </div>
            <div class="autopsy-row">
              <span class="ak">SURVIVAL TIP</span>
              <span class="av">Never trust someone with def when you asked for async def</span>
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
