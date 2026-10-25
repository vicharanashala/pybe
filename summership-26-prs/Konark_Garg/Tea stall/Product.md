# PyBe — Team Product Document

**Project:** PyBe / Pycrates, an open source platform for learning Python through case studies
**Repo:** `vicharanashala/pybe`
**Document owner:** the contributor team, jointly
**Version:** 1.0, team merge of four individual product documents
**Contributors:** Writwik Das, Akshat Sharma, Konark Garg, Kajal Kumari

---

## 0. How to read this document

This is not a feature list. It is the reasoning that produced the features.

Sections 1 to 4 state what PyBe is, who it is for, and the rules every contributor agreed to follow. Section 5 explains why four people deliberately used four different learning theories instead of picking one. Sections 6 to 9 are the shared specification: the common shape of a case study, the data model, the position on scoring, and the help system. Sections 10 to 13 are the engineering and design contract. Sections 14 to 16 are process, open conflicts, and roadmap.

Each contributor keeps a module level document with the fine detail of their own build. This document holds only what is shared.

---

## 1. What PyBe is

PyBe teaches Python through case studies instead of syntax lessons. A learner meets a situation first, feels the need for something, and only then meets the Python construct that answers that need. Syntax is the last thing introduced and the least important thing tested.

The target is not a course. The target is a platform that can hold hundreds of case studies, written by different people, in different worlds, using different learning theories, that a learner can move through on a path of their own choosing.

---

## 2. The problem

**2.1 Syntax first teaching removes the reason to learn.** A normal Python course opens with data types. The learner is told what a list is before they have ever wanted one. Nothing is at stake, so nothing sticks.

**2.2 Learners get stuck revisiting basics.** You come back to arrays, feel underconfident, go back further, and lose months. This happens because there is no signal of sufficiency. Nothing tells you that you know enough to move on.

**2.3 Most case studies are stories with code bolted on.** If the story can be removed without changing the lesson, the story is decoration. The test every PyBe case study must pass: remove the situation and every step should lose its reason to exist.

**2.4 Machines are the difficult party, not the learner.** A person is not dumb for failing to remember a semicolon. The language is the thing that refuses to speak like a human. PyBe treats the learner as capable and the syntax as an accident of history.

---

## 3. Target learner

- Knows enough English to follow a scene of dialogue
- May have never written a line of code
- Has no computer science vocabulary, does not know what a variable or a function is
- Not assumed to be a student, a professional, or any particular age

Konark's module targets the 12 to 18 school band specifically. Writwik's is written for absolute zero with no age assumption. Both fit under the same umbrella, which is why the platform routes by learner type rather than by age.

**Assumptions the design refuses to make:** that the learner reads instructions before acting, finishes in one sitting, types quickly, or asks for help before getting stuck.

---

## 4. Shared design principles

These seven rules bind every module in the repo. A pull request that breaks one of them needs an argument in the description.

1. **The situation earns the construct.** No Python construct appears before the story has created a need for it.
2. **No Python vocabulary inside the fiction.** Characters say what they want in plain words. The Python word appears only at the bridge step and inside code.
3. **One new idea per step.** Everything else in that step is reused from earlier.
4. **Never punish.** No fail state, no lives, no timer, no lost points. A wrong attempt gets a hint and another try, unlimited times.
5. **Tone matches stakes.** A comic about a chai stall may celebrate. A case study about a fatal accident may not. The module author decides, and the decision is defended in the module document.
6. **Runs offline by double click.** No server, no CDN, no build step, no npm. A reviewer opens the file in a browser.
7. **Simple words in all learner facing text.** If a sentence needs a second reading, rewrite it.

---

## 5. Why four frameworks and not one

Prakash Sir's position is that the framework you choose changes the product completely, and that different learner types deserve different starting points. So the team did not standardise on one theory. Each contributor selected the framework that fits the concept they teach and the learner they imagine, and the platform lets the learner pick the door.

| Module | Primary frameworks | Learner it serves best |
|---|---|---|
| Flight 218 (Writwik) | Jonassen problem taxonomy, Barrows PBL, Vygotsky ZPD, Piaget sequencing, Socratic help | A learner who wants stakes and a real problem to sit inside |
| The Mango Harvest (Akshat) | Constructivism, Cognitive Load Theory, concrete to abstract progression, analogical transfer | A learner who wants a guided, well signposted path |
| The Tea Stall (Konark) | Kolb's experiential cycle, Dewey induction, Bloom's taxonomy, Mastery Learning | A learner who wants a short, warm, comic style session with a clear finish |
| The Library Sort (Kajal) | Kolb's cycle, SOLO taxonomy, Dewey constructivism | A learner who wants to see a process run and play with it |

**Frameworks the team considered and rejected as a platform default:**

| Rejected | Why |
|---|---|
| Syllabus order, types then control flow then functions | Produces the syntax first product PyBe exists to replace |
| Points, streaks, badges, leaderboards | Rewards the wrong thing. If the score is the goal, copying an answer is the rational move |
| Spaced repetition as the main structure | Drills syntax recall, which is explicitly the lowest priority here |
| Free text AI chat as the main help channel | Cannot run offline, can hallucinate, and a blank box does not tell a learner what they are confused about |

**What the shared homepage does with this.** The learner is not asked to fill a profile. They are shown the worlds and pick one. The platform learns their preference from how they move, which is the Socratic and implicit profiling position from the sessions.

---

## 6. The common case study shape

Four people built four modules independently, and the same six part shape appeared in all of them under different names. That shape is now the platform standard.

| Step kind | What it does | Framework it comes from |
|---|---|---|
| **hook** | The situation. A person with a reason states a need. No code on screen. | Barrows: the trigger precedes the resource |
| **socratic** | A question that makes the learner notice the pattern themselves. | Socratic method, Kolb reflective observation |
| **bridge** | The one place where story maps to Python, side by side. | Analogical transfer, Kolb abstract conceptualisation |
| **practice** | The learner does it. Types, fills a blank, drags blocks, or runs a visualiser. | Kolb active experimentation, Vygotsky scaffolded attempt |
| **check** | A non punitive check of understanding, not of syntax. | Mastery learning, retry without penalty |
| **close** | One takeaway carried away, plus the branch points this case opens. | Rhizomatic learning |

Every module maps onto this. Writwik's chapter is hook, notebook, task, goal, reaction, fact. Akshat's eight stage flow is the same six with the computational thinking stage split out. Konark's three acts collapse hook and socratic into the story scenes. Kajal's four modes are hook, socratic, practice, and a visualiser that is a second practice.

**The rule about the bridge.** Only one step in a case study may show the mapping from story to Python. If two steps do it, the story stopped being the lesson and became an illustration of the lesson.

---

## 7. Content data model

This section answers the question of how case study parts are stored so that new ones can be produced without rewriting the engine.

A case study is one data object holding no logic. Everything else in the file is a renderer. Swap the object and you have a different case study on the same engine.

```
CASE
├── meta       { id, title, concept, level, world, author,
│                jonassen_type, frameworks[] }
├── cast       { id: { name, role, speaks_needs | speaks_meaning | observer } }
├── assets     { id: { src, alt } }          alt text authored, never generated
├── data       the dataset the story runs on
├── steps[]    ordered
│     kind: "hook"     { media[], text[], say[] }
│     kind: "socratic" { prompt, options[], correctIndex, followUp }
│     kind: "bridge"   { analogy_pairs[], code, legend[] }
│     kind: "practice" { instructions, mode, starter, preload[], goal{}, hint[] }
│     kind: "check"    { questions[{ prompt, options[], correctIndex,
│                        explanation, misconception }] }
│     kind: "close"    { takeaway, fact }
└── branches[] { learner_asks, branches_toward, suggested_next_case }
```

**Notes that matter for anyone generating new cases.**

- `goal` checks the **output**, not the source text. A learner who reaches the right result by a different route passes. There is more than one correct way and the platform must not punish the unexpected one.
- `practice.mode` is one of `type`, `fill`, `drag`, `simulate`. The mode is a choice about cognitive load, not about taste. Use `drag` when the idea is structure and typing would get in the way. Use `type` when the muscle of writing the line is part of the point.
- Every wrong option in a `check` must target a named misconception. An option that nobody would pick teaches nothing.
- `branches[]` is what makes rhizomatic learning possible at platform level. Each case study declares the questions it provokes and where those questions lead. The platform, not the case study, decides what to offer next.

**What an author supplies to make a new case:** a dataset, a situation that needs it, a person who states needs, a person who explains what results mean, and a sequence of needs ordered concrete to abstract. Everything else is engine.

---

## 8. Assessment and the position on scoring

The team position, agreed across all four modules:

- **No penalty, ever.** Retries are unlimited. Nothing is lost for a wrong answer.
- **No score shown inside a case study.** Progress is shown as something filling up: an investigation board, a completed sweep, a finished quiz. Not a number.
- **Mastery gate is allowed and encouraged.** Konark's module requires all five correct before moving on, with unlimited retries. This is not punishment, it is a refusal to let a learner advance on a fragile foundation.
- **Syntax is never graded.** Checks target whether the learner identified the pattern, the order, and the fallback.

**On cheating.** Do not complicate the product for the small number who will copy. Copying produces a filled board the learner did not earn and there is nothing to show anyone for it. The harm is self inflicted. If a learner wants AI help, the platform should provide it in the window rather than pushing them elsewhere, and treat the usage as data about where they struggled.

**What is measured and handed to the platform instead of a score:**

- steps completed
- attempts per step
- which doubts were opened, per step
- which errors were triggered, per step

The doubt log is the strongest signal in the system. A learner who opens "why are there quote marks" twice has a specific, nameable gap. This is the no marks teacher model: no grade, but the teacher knows exactly what you are weak at.

---

## 9. Help, feedback, and error handling

**Help must be asked for, never volunteered.** Help that arrives uninvited teaches dependence.

**Help is a finite, authored list, not a chat box.** Each step carries five to seven anticipated doubts, phrased the way a beginner would actually phrase them. This runs offline, cannot hallucinate, keeps characters consistent, and is itself a teaching object: a learner who did not know they were confused reads the list and recognises their own confusion.

**Every answer has the same three parts:** two or three short spoken lines, a small visual, and one line of takeaway in capitals. All three carry one idea.

**Errors are named, not hidden.** Where a module runs real code, the learner sees the real Python error name and a response written for that specific mistake in that specific step. The response describes the mistake pattern, never the answer. A generic explanation of SyntaxError would be true and useless.

---

## 10. Engineering standard

| Item | Standard |
|---|---|
| Stack | Vanilla HTML, CSS, JavaScript. No framework, no build step |
| Delivery | Opens offline by double click, no network call at runtime |
| Dependencies | None at runtime. Fonts must have a system fallback |
| File layout | Single self contained HTML while under roughly 1,500 lines. Beyond that, split as Akshat's module does: `index.html`, `css/`, `js/`, `assets/` |
| Content separation | Content lives in one data object or one data file. Someone editing wording must never have to read the engine |
| State | Held in memory. No tracking, no analytics, no cookies. Local progress persistence is allowed only if the module works with it cleared |
| Naming | Functions carry a header comment with name, description, parameters, return type. Magic numbers extracted to named constants at the top |
| Syntax check | `node --check` on the extracted script before any pull request |
| Responsive | One scaling system, no separate mobile build. Tested at desktop and at 375px |
| Assets | Images compressed and under 300 KB each. Every image needs hand written alt text |

**On running Python.** Two approaches exist in the repo and both are valid. Writwik's module ships a small hand written Python interpreter of roughly 550 lines so that learner mistakes produce real Python errors offline. Other modules use drag and drop block construction and validate structure instead. Do not use `eval`, because a learner's Python mistake would produce a JavaScript error, which teaches nothing. Do not use Pyodide, because the download breaks the offline rule.

---

## 11. Design system

Each world keeps its own palette. What is shared is the method, not the colours.

**Shared rules.**

- One accent colour per module with a fixed meaning, so colour carries information rather than decoration. Palette choice must name which colour theory approach it used.
- Separate typefaces for separate voices, so the learner can tell a machine from a document from a person without being told.
- No information conveyed by colour alone. Every coloured readout is also labelled in text.
- CSS custom properties for all tokens. No hardcoded hex values in component rules.
- Light and dark mode supported through a `data-theme` attribute where the module's tone allows it.

**Current module palettes, for reference.**

| Module | Accent | Meaning carried |
|---|---|---|
| Flight 218 | signal green `#4FE39C` on deep green black | Green means the machine is speaking, nothing decorative is green |
| The Mango Harvest | blue `#2563eb` and sky `#38bdf8` on parchment | Warm reading surface, cool interactive elements |
| The Tea Stall | orange `#E67E22` on dark, warm caption boxes `#fff9d6` | Comic panel language, warm and informal |
| The Library Sort | orange `#E67E22` and sky `#38bdf8` | Natural tone with soft colors |

---

## 12. Characters and worlds

PyBe holds more than one world on purpose. A learner picks the world that appeals to them, which is the rhizomatic entry point.

**The Village world.** Dada and the Fox. Dada is the practical person who solves problems by doing. The Fox is the observer who notices patterns and asks questions. The Fox is the learner. Used by Akshat, Konark, Kajal, and the original bridge keeper story.

**The Investigation world.** Deshpande states needs and never solutions. Meera explains what results mean. Nusrat is the absent expert whose notebook is the scaffold. The learner is an intern on day one, which licenses not knowing anything without shame. Used by Writwik.

**Cast rules for any new world.**

- One character states needs and never solutions, so the problem does not contain its own answer.
- One character explains what a result means, so the learner is never left holding a number with no meaning.
- The obstacle is circumstance, never a person. No adversary characters.
- The scaffold character is bounded. They can only give what they already know, which is what keeps help finite.

**Open item:** the Fox is currently named Bunku in the Tea Stall module and Priya in the Library Sort module, and is unnamed elsewhere. The team needs one name before merge. See section 15.

---

## 13. Accessibility baseline

Every module must meet this before a pull request.

- `lang` set on the document
- Hand written alt text on every image, describing the frame rather than the file name
- Live output regions marked `aria-live="polite"` with `role="log"`
- Real form elements, a real `<textarea>` rather than a contenteditable div, so phone keyboards and assistive tech work
- Modals as real `role="dialog" aria-modal="true"` with labels
- Text labels on navigation buttons, decorative SVG marked `aria-hidden`
- Visible focus rings, never removed
- `prefers-reduced-motion` honoured. Animated explainers slow their beats rather than disappearing, so a reduced motion learner still sees the sequence

---

## 14. Repository and process

**Layout.**

```
pybe/
├── product.md                     this document
├── summership-26-prs/
│   ├── <contributor>/
│   │   ├── product.md             module level reasoning
│   │   ├── <module>.html          or index.html plus css/ js/ assets/
│   │   └── assets/
└── wiki/                          graphical abstracts per contributor
```

**Pull request rules.**

1. Show the prototype before the pull request. The idea gets reviewed first, the code second.
2. Every pull request description names the frameworks used and what they changed about the build. A pull request that only describes features is incomplete.
3. `git pull origin main` before every push. A local `git checkout main` reporting up to date only reflects a cached state, not the remote.
4. Separate repositories get separate local clones. Do not mix them.
5. There is no outright rejection. The end goal is the process of learning.

**Credits.** Contributions are shown as graphical abstracts, one per contributor, on the wiki. Pictures, not text descriptions.

---

## 15. Open conflicts and decisions needed

These are real disagreements between the four modules. They are listed rather than smoothed over, because the resolutions need Prakash Sir's call.

| # | Conflict | Positions | Proposed resolution |
|---|---|---|---|
| 1 | Celebration on completion | Tea Stall uses confetti. Flight 218 forbids any celebration language | Keep both. Tone follows stakes, and the module document must state which and why |
| 2 | Concept overlap | For loops appear in both Mango Harvest and Flight 218. Functions appear in both Tea Stall and Flight 218 | Not a defect. Different worlds teach the same construct for different learner types. The level map must mark them as alternates, not duplicates |
| 3 | Fox naming | Bunku, Priya, and unnamed | Pick one name for the Village world before merge |
| 4 | Scoring at platform level | Flight 218 exposes no score. Tea Stall gates at 100 percent | Derive level progression from steps completed, and let the doubt log drive what is recommended next. No number shown to the learner inside a case |
| 5 | Single file versus multi file | Three modules are single file, one is split | Threshold rule in section 10. Both must open without a build step |
| 6 | Fictional then real reveal | Flight 218 deliberately stays fictional | Needs a ruling on whether a reveal reads as productive surprise or as deception for a first time learner |
| 7 | Where a case sits in the level structure | Flight 218 is written as the first hook. Mango Harvest assumes some comfort already | Needs the level map in section 16 finalised |

---

## 16. Level map and roadmap

**Current coverage.**

| Level | Cognitive move | Constructs | Modules |
|---|---|---|---|
| 1 | A thing can be shown, a thing can have a name | `print`, variables | Flight 218 chapters 1 to 2 |
| 2 | Many things can be one thing, decisions follow a chain | lists, `if` / `elif` / `else` | Flight 218 chapters 3 and 6, the Bridge Keeper story |
| 3 | One instruction can act on many things | `for` | Mango Harvest, Flight 218 chapter 4 |
| 4 | One thing can contain labelled parts | dictionaries | Flight 218 chapter 5 |
| 5 | A set of instructions can be a named thing | `def` | Tea Stall, Flight 218 chapter 7 |
| 6 | A process can be reasoned about and optimised | algorithms, comparison and swap | Library Sort |

**Next, in order of value.**

1. Finalise the level map and the alternates rule, so a learner has more than one door into every level
2. An authoring guide extracted from section 7, so a contributor can produce a case study without reading any engine
3. Parameters and return values, which is the gap between Tea Stall's functions and anything reusable
4. `try` / `except`, which Flight 218 already branches toward
5. Classes and objects, which is where the platform can finally show why Python is an object oriented language
6. A homepage that offers worlds rather than a syllabus, built last, so that interface work never limits the thinking

---

## 17. Traceability

Every non obvious shared decision and the reason it can be defended.

| Decision | Grounded in |
|---|---|
| Situation before any code appears | Barrows: the trigger precedes the resource |
| One character states needs, never solutions | Barrows: the problem must not contain its own answer |
| Scaffold bounded to the current step | Vygotsky: scaffold sized to the gap, not to the topic |
| Constructs ordered concrete to abstract | Piaget: one abstraction added at a time |
| Ill structured case, well structured tasks inside it | Jonassen: a beginner cannot hold an unknown problem type and an unknown language at once |
| Story, then reflection, then abstraction, then experiment | Kolb: the full experiential cycle, which is why practice steps are mandatory |
| Questions span at least three cognitive levels | Bloom: recall alone does not show understanding |
| Unlimited retries, gate at full correctness | Mastery learning: patience instead of penalty |
| No score inside a case study | Non punitive learning, and the NaNoWriMo position on self inflicted harm |
| Branch points declared, paths not hardcoded | Rhizomatic learning: the learner curates the path, the platform offers it |
| No profile form at login | Socratic and implicit profiling: discover the learner from how they act |
| Four frameworks kept, not merged into one | Different philosophies serve different learner types, and the homepage lets the learner choose |
| One accent colour with a fixed meaning | Single accent colour theory, applied so colour carries information |
| Offline single file delivery | Review by double click, and no learner blocked by a connection |
