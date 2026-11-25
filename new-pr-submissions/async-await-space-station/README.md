# PyBe — Async / Await & asyncio: The Skeld

**Contributor:** Soumyashis Ghosh  
**GitHub:** [@LuchaLibreAAA](https://github.com/LuchaLibreAAA)  
**Topic:** Async / await & asyncio — Coordinate waiting tasks using coroutines and an event loop.  
**Curriculum Scope:** 16-Slide Expanded Interactive Journey (Conceptual Briefing + Hands-on Practice per Module)

---

## Overview

A story-driven case study set aboard **The Skeld** (Electrical & Comms bay) that teaches Python's `async`/`await` and `asyncio` architecture. The learner works alongside a Red Crewmate to restore ship systems after a critical sabotage.

Tasks like fixing electrical wiring, downloading navigation pings, and stabilizing the reactor core mirror real-world asynchronous operations (I/O, network requests, sensor pauses, timers).

Following PyBe's story-first principle, the case study uses a **16-slide structured curriculum**: every hands-on mini-game is preceded by a dedicated conceptual briefing slide contrasting paradigms (with Gen-Z commentary from Red), ensuring learners deeply understand the architectural mental model before interacting with code.

---

## 16-Slide Curriculum Sequence

| Slide | Module | Type | Title & Focus | Python Concept Learned |
|:---:|---|---|---|---|
| **1** | Module 1 | Briefing | **The Sequential Trap** | Synchronous vs. Asynchronous paradigms; why 95% of waiting in software is I/O latency. |
| **2** | Module 1 | Hands-On | **The Blocking Disaster** | Benchmark 5 ship tasks running sequentially; observe the 35s cumulative stall while the CPU sits idle. |
| **3** | Module 2 | Briefing | **def vs. async def** | Standard functions (stubborn, run-to-completion) vs. coroutines (cooperative, pauseable). |
| **4** | Module 2 | Hands-On | **Declaring the Coroutine** | Interactive toggle transforming `def fix_wiring()` into `async def fix_wiring()`. |
| **5** | Module 3 | Briefing | **The Anatomy of await** | Suspension points, the coffee barista mental model, and the Golden Rules of `await`. |
| **6** | Module 3 | Hands-On | **Placing the Pause Point** | Identify the exact I/O latency line (`await sense_panel()`) to yield control back to the scheduler. |
| **7** | Module 4 | Briefing | **The Event Loop Engine** | The dormant coroutine trap (`RuntimeWarning`) and why coroutines need an Event Loop manager. |
| **8** | Module 4 | Hands-On | **Dispatching to the Loop** | Hand off the coroutine package to `asyncio.run()` to start, run, and cleanly close the loop. |
| **9** | Module 5 | Briefing | **The Squad Goal (gather)** | Why awaiting one-by-one is still slow (27s) and how `asyncio.gather()` unlocks true concurrency. |
| **10** | Module 5 | Hands-On | **The Squad: asyncio.gather()** | Bundle wiring (8s), nav ping (12s), and chute (7s); watch all run simultaneously and finish in 12s. |
| **11** | Module 6 | Briefing | **The Deadly Sleep Trap** | Thread coma (`time.sleep`) vs. cooperative pause (`asyncio.sleep`); avoiding the #1 async rookie mistake. |
| **12** | Module 6 | Hands-On | **The Timeline Showdown** | Interactive timeline toggle comparing blocking frozen thread vs. non-blocking interleaved tasks. |
| **13** | Module 7 | Briefing | **The Master Blueprint** | Architectural synthesis of the 4 Pillars: `async def`, `await`, `gather()`, and `run()`. |
| **14** | Module 7 | Hands-On | **Final Comms Uplink** | Snap keyword chips into place to assemble a production-ready asynchronous Python program. |
| **15** | Module 8 | Story Beat | **The Doors Slam Shut** | Electrical blast doors seal shut; security lockdown alarms flash as Red acts increasingly suspicious. |
| **16** | Module 8 | Climax | **Emergency Meeting & Epilogue** | Red reveals himself as the Impostor in a cartoon elimination cutscene, Cyan ghost with halo (*"at least my code was non-blocking..."*), autopsy report, and the full Python asyncio cheat sheet. |

---

## How to Run

Zero build steps, zero external dependencies, 100% offline-compatible.

1. Open `index.html` directly in any modern web browser:
   ```powershell
   Start-Process "new-pr-submissions/async-await-space-station/index.html"
   ```
2. Or serve via any local static server:
   ```powershell
   npx serve new-pr-submissions/async-await-space-station
   ```

Keyboard navigation:
- `Right Arrow` / `Left Arrow`: Navigate forward/backward across all 16 slides.
- `Space` / `Enter`: Dismiss the cinematic opening screen.

---

## Project Structure

```
new-pr-submissions/async-await-space-station/
├── index.html   ← Main entry point: The Skeld deck, custom vector SVGs, and mainframe tablet console
├── styles.css   ← The Skeld theme, dark sci-fi palette, alarm strobe, and elimination animations
├── app.js       ← 16-slide state machine, interactive mechanics, and cutscene sequencing
├── README.md    ← Submission documentation and curriculum breakdown
├── product.md   ← Product specification, problem statement, and 16-slide user journey
├── context.md   ← Pedagogical alignment and narrative context
└── change.md    ← Technical changelog and platform rule alignment
```

---

## Design Highlights

- **The Skeld Setting**: Porthole viewing asteroid field and hull shields, hazard strip, maintenance vent, and electrical wiring box.
- **Two-Column Split Deck Architecture**: Left deck houses the animated character and speech bubble; right console houses the interactive tablet. No overlapping text or controls on any viewport.
- **Authentic Among Us Vector Art**: Thick bold black outlines, pill-shaped visor with glint reflections, curved shadows, dead body with bone, and translucent ghost.
- **Non-Violent Cartoon Humor**: Lighthearted PG Among Us lore, elimination autopsy report, and funny dialogue ("at least my tasks were non-blocking... 👻").
- **PyBe Guidelines Compliant**: Vanilla HTML/CSS/JS, no external CDN assets, no external LLM transports, and zero gamified points or stars.
