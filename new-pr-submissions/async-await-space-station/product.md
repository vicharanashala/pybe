# Product Document: The Skeld (Python Async / Await & asyncio)

**Topic:** Async / await & asyncio — Coordinate waiting tasks using coroutines and an event loop.  
**Author:** Soumyashis Ghosh · [@LuchaLibreAAA](https://github.com/LuchaLibreAAA)  
**Intake Directory:** `new-pr-submissions/async-await-space-station/`  
**Curriculum Scope:** 16-Slide Expanded Interactive Journey

---

## 1. Problem

Asynchronous programming in Python is notoriously difficult for beginners to grasp because it is traditionally taught using dry abstractions: threads vs. processes, cooperative multitasking, or arbitrary API fetch calls. Learners struggle with:
1. **The "Why"**: Understanding why sequential execution is inefficient when tasks spend most of their time waiting on I/O.
2. **The Syntax Confusion**: Not knowing what `async def` does, where `await` belongs, and why calling a coroutine doesn't execute it immediately.
3. **The Event Loop**: Failing to visualize the dispatcher that pauses, schedules, and resumes concurrent tasks.
4. **Pacing Issues**: When syntax and interactions are rushed together without conceptual grounding, learners often perform steps mechanically without understanding the underlying design patterns.

## 2. Solution

*The Skeld* frames asynchronous concurrency around tangible ship maintenance tasks in an Among Us–themed emergency. To ensure deep retention, the curriculum follows a **16-slide sequence** where each module provides:
1. **A Conceptual Briefing Slide**: A visual comparison grid contrasting naive synchronous execution with cooperative asynchronous architecture, paired with Red Crewmate's witty commentary.
2. **A Hands-On Practice Slide**: An interactive mini-game where the learner applies the concept directly (toggling coroutines, placing await suspension points, batching concurrent tasks, and assembling the final uplink).

## 3. Target Learner

- Python students on the PyBe platform who understand basic functions, variables, and control flow.
- Learners who need an intuitive, visual mental model of cooperative concurrency without overwhelming low-level thread theory.

## 4. Learning Objectives

By the end of this case study, the learner will be able to:
- Explain why blocking I/O degrades performance in sequential programs (I/O latency vs. CPU compute).
- Define a coroutine function using `async def`.
- Use `await` to yield control back to the event loop at points of waiting.
- Dispatch coroutines using `asyncio.run()`.
- Coordinate multiple concurrent coroutines using `asyncio.gather()`.
- Differentiate between non-blocking `asyncio.sleep()` and thread-freezing `time.sleep()`.
- Assemble a complete, non-blocking asynchronous Python script.
- Recognize and avoid common pitfalls like calling un-awaited coroutines or using blocking sleep in an event loop.

## 5. 16-Slide User Journey

1. **Slide 1 (Briefing: The Sequential Trap)**: Understand the difference between run-to-completion synchronous code and cooperative non-blocking code.
2. **Slide 2 (Hands-On: The Blocking Disaster)**: Run 5 ship tasks sequentially; observe the 35s cumulative stall while the CPU sits idle.
3. **Slide 3 (Briefing: def vs. async def)**: Contrast stubborn standard functions with pauseable coroutines.
4. **Slide 4 (Hands-On: Declaring the Coroutine)**: Flip the toggle switch to declare `async def fix_wiring()`.
5. **Slide 5 (Briefing: The Anatomy of await)**: Learn the suspension mechanism and the two Golden Rules of `await`.
6. **Slide 6 (Hands-On: Placing the Pause Point)**: Place `await` on the sensor wait line to yield control back to the loop.
7. **Slide 7 (Briefing: The Event Loop Engine)**: Understand why calling a coroutine returns an un-executed object and why an Event Loop is required.
8. **Slide 8 (Hands-On: Dispatching to the Loop)**: Load the coroutine into the dispatcher and fire `asyncio.run()`.
9. **Slide 9 (Briefing: The Squad Goal)**: Learn why sequential `await` is still slow and how `asyncio.gather()` unlocks true concurrency.
10. **Slide 10 (Hands-On: The Squad: asyncio.gather())**: Bundle 3 tasks concurrently and witness completion in 12s instead of 27s.
11. **Slide 11 (Briefing: The Deadly Sleep Trap)**: Discover why `time.sleep()` freezes the event loop and why `asyncio.sleep()` is mandatory.
12. **Slide 12 (Hands-On: The Timeline Showdown)**: Compare interactive Gantt charts of thread-blocking vs cooperative sleep.
13. **Slide 13 (Briefing: The Master Blueprint)**: Synthesize the 4 Pillars of Python async before assembling the master script.
14. **Slide 14 (Hands-On: Final Comms Uplink)**: Snap keyword chips (`async`, `await`, `run`) into the production script.
15. **Slide 15 (Story Beat: The Doors Slam Shut)**: Electrical doors seal shut; lockdown sirens flash red as Red acts suspicious.
16. **Slide 16 (Climax: Emergency Meeting & Epilogue)**: Red reveals himself as the Impostor in a cartoon elimination cutscene, Cyan ghost with halo (*"at least my code was non-blocking..."*), autopsy report, and the full Python asyncio cheat sheet.
