# Educational & Narrative Context: The Skeld

## Educational Context

This module strictly adheres to PyBe's story-first pedagogy: friction arises naturally from a narrative crisis, the learner resolves the issue using logic and common-sense interaction, and Python syntax is introduced solely as the formal name for the pattern they discovered.

To ensure deep understanding, the module uses an intentional **16-slide sequence** alternating between conceptual briefings and hands-on application:

- **Module 1 (The Bottleneck — Slides 1 & 2):** The reactor sits idle for 35 seconds while tasks run sequentially. The learner discovers that 95% of waiting in software is external I/O, proving the necessity of asynchronous execution.
- **Module 2 (Coroutines — Slides 3 & 4):** A function must have a declared capability to pause mid-execution. That capability is `async def`.
- **Module 3 (The Pause Point — Slides 5 & 6):** Pausing cannot happen arbitrarily; it must happen at the exact point where an awaitable operation begins (`await`).
- **Module 4 (The Dispatcher — Slides 7 & 8):** A dormant coroutine object cannot drive itself; an external engine must schedule and poll it (`asyncio.run()` and the event loop).
- **Module 5 (Concurrent Gathering — Slides 9 & 10):** Awaiting tasks one-by-one is still sequential. Independent tasks must be scheduled concurrently via `asyncio.gather()`, reducing total time to the single longest task.
- **Module 6 (Deliberate Delays — Slides 11 & 12):** Delays must yield control rather than putting the OS thread to sleep (`asyncio.sleep` vs `time.sleep`).
- **Module 7 (Synthesis — Slides 13 & 14):** The student connects the entire sequence in an interactive code builder.
- **Module 8 (Climax & Cheat Sheet — Slides 15 & 16):** Narrative payoff with a humorous twist ending and an evergreen reference cheat sheet.

## Story Context

The narrative is set aboard the iconic starship *The Skeld* in the Electrical and Communications compartment. The ship's systems have been destabilized, requiring the learner (playing as the Cyan Engineer) to rewrite system routines to restore power. A Red Crewmate accompanies the player, providing humorous dialogue in contemporary slang before betraying the player in the comedic Slide 16 epilogue.

## Non-Claims & Parody

- **Among Us Homage:** Characters, terminology (vents, Electrical, Impostor, crewmates, sabotages), and UI aesthetics are creative educational parodies inspired by Innersloth's *Among Us*.
- **No Blood or Violence:** The Slide 16 elimination cutscene is entirely stylized, non-violent cartoon comedy (half-bean body with cartoon white bone, floating ghost with halo), suitable for all learners.
- **Self-Contained Implementation:** All graphics are rendered via custom inline SVG and pure CSS with zero external copyrighted assets, fonts, or CDNs.
