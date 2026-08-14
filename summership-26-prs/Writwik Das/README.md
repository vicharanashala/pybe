# product.md

## Case 002 — Flight 218

**Deliverable file:** `Flight_218_v6.html`
**Type:** single self contained HTML file, vanilla JS, no libraries, no build step, opens offline by double click
**Report number used inside the file:** AAIB/2026/PNQ-218
**Contributor:** Writwik
**Repo path:** `summership-26-prs/`
**Status:** v6, syntax checked, data verified, smoke tested at desktop and mobile widths

---

## 0. How to read this document

This is not a list of features. It is the reasoning that produced the features.

Section 1 to 4 is why this thing exists and who it is for. Section 5 is the framework selection, including the frameworks that were considered and dropped. Section 6 to 11 is the actual specification, detailed enough that someone else (or an AI agent) could rebuild the file from this document alone. Section 12 to 16 is the system design: data, visual, audio, accessibility. Section 17 onward is authoring, testing, roadmap and the open questions that need Prakash Sir's call.

---

## 1. One paragraph summary

Flight 218 teaches the first seven constructs of Python through one continuous story: a fictional air accident investigation. The learner joins an investigation team as an intern on their first day. The only person who could talk to the flight recorder, a data analyst named Nusrat, has left for a week. Her handwritten notebook is on the desk. The recorder answers Python and nothing else. So the learner reads her notebook and types what she wrote, and the investigation moves forward one question at a time. Python is never the subject of the lesson. It is the tool the story keeps forcing the learner to pick up.

---

## 2. The problem this product solves

Three problems, in order of importance.

**2.1 Syntax first teaching kills the reason to learn.** A normal Python course opens with data types. The learner is told what a list is before they have ever felt the need for one. There is no pressure, so there is nothing to remember it by. Flight 218 inverts this. In every chapter the need arrives first, stated by a person with a reason to want it, and the construct arrives as the answer to a question the learner is already holding.

**2.2 Learners get stuck in the loop of revisiting basics.** Prakash Sir's original framing was the array problem: you come back to arrays, feel underconfident, go back further, and lose months. That happens because there is no signal of sufficiency. Flight 218 gives that signal in narrative terms instead of score terms. Each chapter ends with one fact added to an investigation board. When the board is full, the case is closed. The learner has a visible, finite, completed thing.

**2.3 Case studies are usually stories with code bolted on.** A story that could be removed without changing the lesson is decoration. Here the removal test is the design constraint: take the investigation out and every single chapter loses its reason to exist. The registration is stored in a variable because typing it fifty times will cause one wrong aircraft. The loop exists because there will be hundreds of events tomorrow. The condition exists because normal data is not evidence. The function exists because the same four questions get asked every morning.

---

## 3. Target learner

- Knows enough English to follow a scene of dialogue
- Has never written a line of Python and may have never written code at all
- Has no CS vocabulary: does not know what a variable, a data structure, or a function is
- Is not assumed to be a student, a professional, or any particular age

The case study is the first hook into the language. It sits at the beginning of a learner's path in PyBe, not after a fundamentals module.

**Assumptions the design refuses to make:** that the learner will read instructions before acting, that the learner will finish in one sitting, that the learner has a keyboard they are fast on, that the learner will ask for help before getting stuck.

---

## 4. Design principles, in priority order

1. **The story earns the construct.** No construct may appear before the story has created a need for it.
2. **No Python vocabulary in the fiction.** Deshpande and Meera never say variable, list, dictionary, loop, or function. They say what they want. The Python word appears only inside the notebook page and inside the code.
3. **One new idea per chapter.** Everything else in that chapter is reused from earlier chapters.
4. **Never punish.** No fail state, no lives, no timer, no lost points. A wrong attempt gets a hint from a character and another try.
5. **The tone matches the stakes.** Sixty two people died in this story. There is no confetti, no badge, no "great job", no gamified copy anywhere.
6. **Everything must survive being opened offline by double click.** No server, no CDN, no npm, no external state.
7. **Simple words everywhere in learner facing text.** If a sentence needs a second reading, rewrite it.

---

## 5. Framework selection

This section exists because choosing the framework is the decision that shaped everything else. Below is what was considered and why the chosen combination won.

### 5.1 Frameworks considered

| Framework | What it would have produced | Verdict |
|---|---|---|
| Syllabus order (types, then control flow, then functions) | A chapter list with exercises | Rejected. Produces exactly the syntax first product this project exists to replace. |
| Pure gamification (points, streaks, levels, badges) | A quiz app with a skin | Rejected. Conflicts with a fatal accident narrative, and rewards the wrong thing. Prakash Sir's NaNoWriMo argument applies: if scoring is the incentive, cheating becomes rational. |
| Spaced repetition / flashcards | Drill on syntax recall | Rejected as the primary structure. Syntax recall is explicitly the lowest priority in PyBe. Possibly useful as a later layer, not here. |
| Computational thinking (Wing: decomposition, pattern recognition, abstraction, algorithm) | A problem broken into named thinking stages | Partly adopted. Used to order the chapters, not to frame the learner facing text. Naming the stages to a beginner is jargon by another route. |
| Jonassen's problem taxonomy | A classified problem type per chapter | **Adopted** as the problem design layer. |
| Barrows' problem based learning | Trigger first, resource second | **Adopted** as the chapter structure. |
| Vygotsky's zone of proximal development | Scaffolds that shrink | **Adopted** as the scaffolding rule. |
| Piaget's stages | Concrete to abstract sequencing | **Adopted** as the ordering rule. |
| Socratic method | Questions instead of answers | **Adopted** as the help system. |
| Rhizomatic learning | Learner chosen paths | **Partly adopted.** This file is a fixed spine. Branch points are documented in section 18 for the platform to use, but are not implemented in this file. Reasoning in that section. |

### 5.2 How the four adopted frameworks divide the work

**Jonassen decides what kind of problem each thing is.** The frame problem, "why did Flight 218 come down", is a situated case problem with the shape of a dilemma: there is no clean answer waiting at the end, only what the recorder is willing to give up. That ill structured problem is what the learner sits inside for the whole file. Nested inside it, each of the seven chapters is a well structured rule using sub problem, because a beginner cannot be given an ill structured problem and an unknown language at the same time. The ill structure lives in the case; the well structure lives in the task. That split is deliberate and it is the single most important design decision in this file.

**Barrows decides the order inside a chapter.** Trigger, then resource, then attempt. Every chapter opens with Deshpande stating an operational need in plain language. Only after the need is on the table does the notebook become available. The learner never reads a lesson they did not want.

**Vygotsky decides how much help is given.** The notebook page is the scaffold. It gives the pattern needed for this one step and nothing beyond it. The task then asks for the same pattern with one piece missing. The distance between what is shown and what is asked is one blank, held constant across all seven chapters, so the difficulty curve comes from the ideas and not from the size of the gap.

**Piaget decides the sequence.** Concrete to abstract, one abstraction added at a time:

| # | Cognitive move | Construct |
|---|---|---|
| 1 | A thing can be shown | `print()` |
| 2 | A thing can have a name | variable |
| 3 | Many things can be one thing | list |
| 4 | One instruction can act on many things | `for` |
| 5 | One thing can contain labelled parts | dict |
| 6 | An instruction can be conditional | `if` |
| 7 | A set of instructions can itself be a named thing | `def` |

Chapter 7 is the point where the learner applies the naming idea from chapter 2 to behaviour instead of to data. That is the intended peak of the file, and every earlier chapter is arranged so that this one lands.

**Socratic method decides how help behaves.** See section 10.

---

## 6. Learning outcomes

After completing this case study a learner should be able to say, in their own words and without correct syntax:

1. I can make Python show me something.
2. I can give a value a name and use the name afterwards.
3. When I have many values of the same kind, I can keep them together in one place.
4. I can tell Python to do the same thing to every item without writing it out each time.
5. When one item has several details, I can label the details and ask for one by its label.
6. I can make Python act only when something is true.
7. I can bundle several steps under one name and start all of them with one line.

Note the phrasing. The outcome is recognition and articulation, not recall of syntax. A learner who can say "I need the thing that repeats" and then look up the syntax has met the outcome.

**Explicit non-outcome:** the learner is not expected to write any of these constructs from a blank editor. That is the job of a later case study.

---

## 7. Narrative design

### 7.1 The spine

The file runs in three movements.

**Movement one, the flight.** Seven story screens with one image each. Pune, five twelve in the morning. A captain who walks around the aircraft even though she does not have to. Sixty two people board. Take off is normal. Four minutes in, something happens in the cockpit with no alarm and no warning light. At 5:53 the captain keys the radio and says one line, completely calm: "Pune, 218. It's doing it again." At 5:55 the aircraft leaves radar. No survivors.

The purpose of this movement is to make the data mean something before the data exists. Nothing is asked of the learner here. The radio line is the hinge of the whole file: "again" is the word that makes the later fault timeline matter.

**Movement two, the room.** A briefing screen introduces three people and the learner's own role, then the investigation room opens. Deshpande explains the recorder in plain language: it writes the whole flight while the flight is happening, it does not open like a file, it answers only Python. Nusrat is gone. Nobody else in the room knows Python. Her notebook is on the desk. The constraint is now explicit and the learner has a job.

**Movement three, the seven chapters.** Each one is a question the team needs answered. See section 8.

The file closes without solving the crash. Deshpande says the recorder has more in it and they will go deeper tomorrow. This is intentional and is discussed in section 21.

### 7.2 Characters and why each one exists

| Person | Role in the fiction | Role in the pedagogy |
|---|---|---|
| **Deshpande**, head investigator | Decides what the team needs | Delivers the trigger. Speaks only in needs, never in solutions. He is the character who creates pressure. |
| **Meera**, forensic expert | Reads the evidence | Delivers the hint and the interpretation. She is the character who says what a result means, so the learner is never left holding a number with no meaning. |
| **Nusrat**, data analyst, absent | The one who talks to the recorder | She is the scaffold, and she is absent on purpose. Her notebook can only answer what she already wrote, which is exactly the constraint that keeps help finite. Her absence is what makes the learner necessary. |
| **The learner**, intern, day one | Types the Python | Being an intern on day one licenses not knowing anything without shame. The fiction states directly that nobody expects them to become a programmer today. |

Nusrat being away rather than uncooperative matters. There is no adversary in this file. The obstacle is circumstance, which keeps the room supportive and matches principle 4.

### 7.3 The rule about vocabulary

The recorder is called the black box or the recorder, never the FDR. Values are called the time, the height, the speed, the warning. Constructs are described by effect: "make it say something back", "give it a short name", "keep them together", "do it for every one", "show me only the ones where". The Python term appears for the first time in the notebook page, which is where a real Python word belongs because it is a real Python page written by a real Python user inside the fiction.

---

## 8. Curriculum map

Every chapter has the same six part shape: **open** (trigger dialogue), **nb** (notebook page), **task**, **goal** (machine check), **hint** (on failure), **react** (dialogue on success), **fact** (added to the board).

| # | Trigger stated in the room | Construct | Notebook tool line | Learner action | Passes when | Fact added |
|---|---|---|---|---|---|---|
| 1 | We do not know if the recorder is even responding. If it cannot hear us there is no investigation. | `print()` | `print( )` | Type `print("Flight 218")` from the page | any output at all | Recorder communication established |
| 2 | We will mention this aircraft many times. One typing mistake and we are asking about the wrong aircraft. | variable | `name = information` | Fill the blank in `print(___)` | output contains VT-SKR | Aircraft identified |
| 3 | Something unusual happened more than once. I want every recorded time, all four. | list | `[ brackets, commas ]` | Ask for the whole set, not one item | output contains first and last time | Fault timeline recovered |
| 4 | That list is hard to read, and imagine hundreds of events. | `for … in …:` | `for one item in the whole set:` | Complete the loop body | 4 or more lines out, no `[` in output | Complete timeline displayed |
| 5 | The time alone is not enough. I want the height, the speed, the warning too. | dict lookup | `{ "label": value }` then `event["label"]` | Fill in the quoted label | output contains 10980 | Event details recovered |
| 6 | The recorder stores thousands of normal values. Nobody has time to read normal. | `if … == …:` | `if this == that:` | Fill the compared value | contains both YES times, excludes a NO time | Important events isolated |
| 7 | We ask the recorder the same four questions every single time. | `def name():` | `def name():` | Write the line that starts it | 7 or more lines, contains VT-SKR and WARNING | Investigation tool created |

Two details worth defending in review.

**Chapter 4's check forbids `[` in the output.** A learner who prints the whole list inside the loop gets four bracketed lines, which looks like it worked. The check catches that specific misunderstanding rather than just counting lines.

**Chapter 6's check requires an exclusion.** Passing requires the two YES events present and a NO event absent. A learner who removes the condition and prints everything cannot pass by accident. The check tests the idea, not the output length.

**Chapter 7 runs at a deliberately slowed line rate** so the learner watches one line produce seven lines of output. The realisation is the point, so it is given time on screen.

---

## 9. The Python runtime

There is no Pyodide, no server, no eval. The file contains a hand written mini Python interpreter of roughly 550 lines. This was a deliberate cost.

**Why write one.** Pyodide is several megabytes and needs a network fetch, which breaks the offline double click requirement. `eval` of JavaScript would run JavaScript, so a learner's Python mistakes would produce JavaScript errors, which is pedagogically worthless. The whole value of the help system in section 11 depends on the learner seeing real Python error names.

**What it supports.** One scanner produces tokens used both for syntax colouring and for execution, so what the learner sees coloured is exactly what the interpreter reads. Strings with escapes, numbers, names, comments, the operators a beginner meets, list literals, dict literals, indexing by key, variable assignment, `print` with multiple arguments, `for … in`, `if` with `==`, `def` and calling a function, and indentation as block structure.

**What it deliberately does not support.** `while`, `range`, comprehensions, classes, imports, slicing, arithmetic beyond the basics. These are out of scope for this case study, and an interpreter that silently accepts them would let a learner wander into constructs the story has not earned.

**Errors are raised with real Python names and real messages:** SyntaxError, NameError, IndentationError, KeyError, TypeError, IndexError, ValueError, ZeroDivisionError, AttributeError. This matters because the first time a learner meets a real interpreter, the error text will be familiar rather than frightening.

**Preloading.** Chapters declare what already exists in the session (`preload: ["events"]`). Chapter 6 does not require the learner to retype the four event dictionaries. The recorder "still has them open" in the fiction, and this is the mechanism that keeps one new idea per chapter honest.

---

## 10. The doubt system, Call Nusrat

A dock is present in every chapter. Opening it starts a call with Nusrat, who is away but reachable.

**Structure.** Each chapter carries five to seven anticipated doubts, phrased the way a beginner would actually phrase them: "Why do we need the brackets?", "Why is the name on the left and the value on the right?", "Does flight really contain the value?", "Is print storing the value somewhere?". Across the seven chapters there are about 68 of these entries including the error responses.

**Every answer has the same three part shape.** Two or three short spoken lines, then a small animated visual, then one line of takeaway in capitals. Examples of takeaways in the file: `VALUE → PRINT → SCREEN`, `name ← value`, `QUOTES = TEXT · NO QUOTES = A NAME`, `USING A NAME DOES NOT EMPTY THE BOX`, `PRINT SHOWS · IT DOES NOT KEEP`.

**Why this shape.** The takeaway is the thing a learner can carry away and repeat. The spoken lines give it context and the visual gives it a shape. All three carry one idea, so nothing in an answer is spare.

**Why anticipated doubts rather than free text chat.** Four reasons. It runs offline with no API. It cannot hallucinate. It keeps the character consistent, because Nusrat can only say what she would actually know. And most importantly, the list of questions is itself a teaching object: a learner who did not know they were confused reads "Why are there quote marks?" and recognises their own confusion. A blank chat box does not do that.

**Why she is called rather than present.** Help is a decision the learner makes. Nothing volunteers itself.

### 10.1 Visual explainer types

Eleven reusable animated visual types back the answers, all built from SVG and DOM with no image assets: `print`, `box`, `compare`, `list`, `loop`, `dict`, `filter`, `func`, `indent`, `scale`, `symbol`.

The most used is `compare`, a side by side of the right way and the wrong way with the real output under each and a verdict badge. It appears thirteen times. It is used because the misconception is usually not "what does this do" but "why is my version different", and a side by side answers that question directly.

---

## 11. The error system

When the interpreter raises, the learner is not left with a red line.

The error class is matched against that chapter's error entries and Nusrat answers in character with a response written for that specific mistake in that specific chapter. Chapter 1 SyntaxError is about the four marks that come in pairs: two brackets and two quotes, shown as a compare between an accepted line and a refused one. Chapter 2 NameError is about a name Python has never been told about. Chapter 4 and 6 IndentationError is about the four spaces that decide what belongs inside. Chapter 5 KeyError is about a label spelled differently from the way it was stored.

Three rules govern this system:

1. The error is named, not hidden. The learner sees `IndentationError` and learns that this word means this thing.
2. The response describes the mistake pattern, never the answer.
3. The response is chapter specific. A generic explanation of SyntaxError would be true and useless.

---

## 12. Content data model

This is the part that generalises beyond this one case study, and it is the answer to Prakash Sir's question about how the parts of a case study are stored so that new ones can be produced.

The entire case study is one JavaScript object literal called `COURSE`, sitting near the top of the file, holding no logic. Everything below it is a renderer. Swap the object and you have a different case study on the same engine.

```
COURSE
├── meta        { fileNo, registration, chapters }
├── ui          all fixed interface strings, so wording is edited in one place
├── images      { id: { src, alt } }        alt text authored, not generated
├── people      { d: "Deshpande", m: "Meera", n: "Nusrat" }
├── loaded      the dataset the fiction's recorder holds
│                 flight       : string
│                 fault_times  : list of strings
│                 events       : list of dicts { time, altitude, speed, warning }
└── acts[]      ordered movements
      ├── id, number, card (does this get a chapter title card), title, tool
      └── screens[]
            k: "story"   { img, text[], chevron, quoteLast, sfx }
            k: "brief"   { kicker, lede, crew[], you }
            k: "room"    { say: [ { w: speaker, t: line } ] }
            k: "lesson"  { open[], nb{}, task, starter, caret, preload[],
                           every, goal{}, hint[], react[], fact }
            k: "end"     {}
```

The lesson screen is the unit worth studying, because it is the reusable shape of a PyBe chapter:

```
open     : the trigger dialogue          (Barrows: problem before resource)
nb       : { page, problem, why, tool, code, shows, note }
                                          (Vygotsky: the scaffold, bounded)
task     : one sentence, one action
starter  : the code already in the editor, with ___ where the learner types
preload  : names that already exist from earlier chapters
goal     : { kind: "any" | "has" | "lines", any[], all[], none[], min, notContains }
hint     : what a character says on a failed attempt
react    : what the characters say on success, including what it means
fact     : the one line added to the investigation board
```

Note that `goal` checks the **output**, not the source text. A learner who reaches the right result by a different route passes. This is not laziness in the checker, it is the position that there is more than one correct way and the platform should not punish the unexpected one.

Note also that `nb` separates `problem` from `why`. The `problem` is what the learner wants. The `why` is the reason the construct exists in the language at all. A generator producing new case studies must fill both, because a page with only the tool is a syntax reference and that is the thing this project is refusing to build.

**What a case study author supplies to make a new one:** a dataset, a situation that needs it, a person who needs it answered, a person who reads the results, an absent expert with a notebook, and seven needs in an order that is concrete to abstract. Everything else is engine.

---

## 13. Visual design system

**Palette.** Deep green black background (`#050908`, `#0D1512`), pale paper (`#E4EAE4`) for text, steel green (`#6E8B80`) for secondary text, amber (`#C8802A`) for focus and warmth, and one signal green (`#4FE39C`) that appears only for things coming from the recorder itself.

**Why this palette.** It is a near monochrome with a single accent, which is the colour theory approach chosen from the six Prakash Sir pointed at. A single accent means the accent carries meaning: green on this screen always means the machine is speaking. A recorder readout, the radio transmission line, a live output, all green. Nothing decorative is ever green. A learner learns the colour code without being told it.

**Why green and not the obvious amber cockpit look.** Amber is used sparingly for human warmth, focus rings and lamp light. If the whole screen were amber the recorder would have nothing to be. The split is: warm means people, green means machine, paper means document.

**Typography, four voices deliberately kept apart.**

| Family | Used for | Why |
|---|---|---|
| serif | narration and documents | reads as a printed report |
| geometric sans | the story screens | modern, calm, cinematic at large sizes |
| monospace | code, recorder output, the radio line | anything a machine produced |
| handwriting | Nusrat's notebook | it is a person's notebook, and it should not look typeset |

Story text is `clamp(1.28rem, 1.75vw, 1.62rem)` and the quoted radio line is `clamp(1.75rem, 2.9vw, 2.45rem)`, so the one sentence that matters most is the largest text in the file.

**Texture.** An SVG turbulence grain, scanlines on the recorder screen, and a vignette. These place the file in a room with equipment rather than on a webpage. They are pure CSS and SVG with no image weight.

**The set.** The investigation room is a single hand written SVG drawing, 1600 by 900, with Deshpande on the left, Meera on the right, the recorder wall behind and the laptop in front. No photographs of people are used, which avoids both licensing questions and the uncanny problem of stock faces attached to a fatal accident.

**Scaling.** The stage sets its own font size from `min(width/32, height/21)` and every element inside is measured in that unit, then an autofit pass steps the whole scene down if it overflows. This is why the same scene works on a laptop and on a phone without a separate mobile layout.

---

## 14. Audio design

All sound is synthesised at runtime with the Web Audio API. There are no audio files, which keeps the single file requirement intact.

Sound is used exactly twice as narrative: the radio transmission at the captain's line, and the room tone. Everything else is silence. A `SOUND` toggle is in the corner and its state is respected everywhere. Sound is never required to understand anything, and no information exists only in audio.

---

## 15. Accessibility

- `lang="en"` on the document
- Every one of the seven story images has hand authored alt text describing the frame, not the file name
- The recorder output region is `aria-live="polite"` with `role="log"`, so new output is announced
- The editor is a real `<textarea>` with `aria-label`, not a contenteditable div, so it works with assistive tech and with a phone keyboard
- The notebook, the board and the call are real `role="dialog" aria-modal="true"` with labels
- Navigation buttons carry text labels, decorative SVG is `aria-hidden`
- Visible focus rings in amber, never removed
- `prefers-reduced-motion` is honoured in five separate places, and the animated explainers scale their own beats rather than simply cutting animation, so a reduced motion learner still sees the sequence, just without the movement
- No information is conveyed by colour alone. Every green readout is also labelled in text.

---

## 16. Assessment and the position on scoring

**There is no score in this file.** No points, no percentage, no stars, no time.

The reasoning follows the platform philosophy directly. If the visible reward is a number, the rational behaviour is to optimise the number, and copying an answer optimises it perfectly. If the visible reward is the investigation board filling up, copying an answer produces a board the learner did not earn, and there is nothing to show anyone for it. The harm of faking it is entirely self inflicted, which is the NaNoWriMo position Prakash Sir described.

**What is measured instead, and available to the platform if it wants it:**

- which chapters were completed
- how many attempts each chapter took
- which doubts were opened, per chapter
- which errors were triggered, per chapter

The third one is the interesting signal. A learner who opened "Why are there quote marks?" in chapter 1 and again in chapter 5 has a specific, nameable gap. That is Anuj's teacher from the transcript: no marks, but the teacher knows exactly what you are weak at. This file produces that data as a side effect of helping, not as a test.

**Recommendation to the platform:** if a threshold score is needed for level progression, derive it from chapters completed and let the doubt log drive what gets recommended next. Do not put a number in front of the learner inside a case study about a fatal accident.

---

## 17. What is locked and what is open

**Locked.** The chapter shape (trigger, notebook, task, check, reaction, fact), the seven construct sequence, the one new idea per chapter rule, the no fail state rule, and the no Python vocabulary in fiction rule. These are the pedagogy. Changing them changes what the file is.

**Open to revision.** The narrative wrapper, character names, the visual theme, the document wording, the number of story screens, the audio, and the images.

This distinction exists because two revision rounds have already been applied to the wrapper (the theme change to green, and the reduction from about 47 screens to about 36) with no change to the mechanic. Future revisions should be able to move at the same speed with the same guarantee.

---

## 18. Rhizomatic branches

This file is a fixed spine, not a branching tree. That is a deliberate scoping decision, not an oversight: a learner with zero Python cannot meaningfully choose between paths they have no vocabulary to distinguish. The branching belongs one level up, once the learner has met enough constructs to have a preference.

The branch points this case study creates for the platform to pick up:

| A learner who asks | Branches toward | Natural next case |
|---|---|---|
| How does the recorder decide something is a fault? | comparison operators, `>` and `<` | threshold analysis |
| What if the recorder gives a label we did not expect? | `try` / `except`, KeyError handling | the Meridian 402 fuel unit case |
| What if I want the events in order of severity? | sorting, keys | any ranked dataset |
| What if there are two aircraft? | nested structures, list of dicts of lists | fleet wide analysis |
| What if the recorder is missing a value? | `None`, absence as a value | incomplete data |
| Can the tool ask a different question each time? | function parameters | generalising chapter 7 |

Chapter 7 is the deliberate hand off point. The learner has just built `investigate()`. The next case study should begin by needing `investigate()` to take an argument.

---

## 19. Non-goals

Stating these prevents scope drift and prevents review confusion about what is missing on purpose.

- Not teaching aviation. Every aviation detail exists only to carry a Python idea.
- Not simulating a real accident investigation. The procedure is simplified past the point of realism.
- Not a reference. A learner cannot look up syntax here.
- Not a full Python environment. See section 9 on what the interpreter refuses.
- Not adaptive. Every learner sees the same seven chapters in the same order in this build.
- Not multiplayer, not social, no leaderboard.
- Not tracking anyone. Nothing is sent anywhere. There is no storage, no cookie, no network call.

---

## 20. Technical specification

| Item | Value |
|---|---|
| Output | one HTML file, roughly 7,650 lines |
| Dependencies | none |
| Build step | none |
| Network | none at runtime |
| Storage | none, no localStorage, no cookies |
| Assets | seven `.webp` images in `img/`, everything else drawn in SVG or CSS |
| Audio | synthesised at runtime, no files |
| Browsers | current Chrome, Firefox, Safari, Edge |
| Widths tested | desktop and mobile, single scaling system, no separate mobile build |
| Review method | open the file in a browser |

**Structure inside the file:** styles, then markup, then `COURSE` (all content), then `PY` (the interpreter), then `SOUND`, then the SVG set, then the engine, then `NUSRAT_CALLS` (all doubt content), then `VZ` (the visual explainers), then the per chapter explainer builders.

Content and engine are kept apart on purpose. A person editing wording should never have to read the engine.

**Testing done:** `node --check` on the extracted script, a data verification pass on the fault counts and threshold readouts against the intended timeline, a run through all seven chapters with correct answers, a run with deliberately wrong answers to trigger each error class, and visual capture at desktop and mobile widths.

---

## 21. Version history and roadmap

**v1** six part files assembled, syntax checked, data verified.
**Revision one** visual theme moved to the green cyber palette, scanlines, green tinted paper documents.
**Revision two** language simplified throughout, screen count reduced from about 47 to about 36, evidence sheets consolidated with a plain language "so what does this mean" callout on each, story typography moved to geometric sans at responsive sizing, radio line set in monospace green with a glow.
**v6** current file, smoke tested and captured clean at both widths.

**Next, in order of value:**

1. Case 003 as the direct sequel, opening with `investigate()` needing a parameter
2. A short authoring guide extracted from section 12 so another team member can produce a case on this engine without reading the engine
3. Optional English simplification pass with a readability target on all learner facing strings
4. Emitting the doubt and error log to the platform, if the platform wants section 16's data

---

## 22. Traceability

Every non obvious decision and the reason it can be defended.

| Decision | Grounded in |
|---|---|
| Story before any code appears | Barrows: the trigger precedes the resource |
| Deshpande states needs, never solutions | Barrows: the problem must not contain its own answer |
| Notebook page gives the pattern and stops | Vygotsky: scaffold sized to the gap, not to the topic |
| Blank size held constant across chapters | Vygotsky: keep the ZPD stable while the ideas grow |
| Construct order print → def | Piaget: concrete to abstract, one abstraction at a time |
| `def` last, as naming applied to behaviour | Piaget: formal operational move, needs everything before it |
| Ill structured case, well structured tasks | Jonassen: a beginner cannot hold an unknown problem type and an unknown language at once |
| Case framed as a situated case problem | Jonassen: the type that matches evidence driven reasoning |
| Anticipated doubts with one takeaway each | Socratic method, made offline and non hallucinating |
| Help must be called, never volunteered | learner agency, and help that arrives uninvited teaches dependence |
| No score, no fail state | non punitive learning; the anti cheating position from the transcript |
| Fact board instead of points | a signal of sufficiency, which is the fix for the array loop problem |
| One accent colour with a fixed meaning | single accent colour theory, applied so colour carries information |
| Four typefaces, four voices | separating machine, document, person and narration without labels |
| Real Python error names shown | the first real interpreter should feel familiar, not hostile |
| Fixed spine, branches documented not built | rhizomatic learning belongs above the beginner level, not inside it |

---

## 23. Open questions for Prakash Sir

1. **The fiction stays fiction.** Flight 218, VT-SKR and everyone in the room are invented. There is no real incident reveal at the end. The alternative, the fictional then real reveal used elsewhere, was avoided here because this is a learner's first ever Python case study and a reveal that reframes what they just did could read as deception rather than as productive surprise. Is that the right call, and if the reveal is worth doing, is a later case the better place for it?

2. **Scoring at platform level.** This file deliberately has none. If PyBe needs a threshold for level progression, should it come from chapters completed, or should this case study expose something richer?

3. **The doubt log.** It is the clearest signal in the file of what a learner did not understand. Should it be persisted and used to recommend the next case study, and does that conflict with the position that nothing is tracked?

4. **Chapter 7 as a hand off.** The case ends without solving the crash, on purpose, so that case 003 has a reason to exist. Is an unresolved ending acceptable for a learner who may never open case 003?

5. **Where this sits in the level structure.** This is written as the first hook into Python. Is that where it belongs, or should something even smaller come before it?
