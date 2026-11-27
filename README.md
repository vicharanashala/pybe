> Local-only policy (17 November 2026): external LLM transports, provider SDKs, cloud-generation developer utilities, and AI image requests have been removed. Feedback uses local rules or authored lesson text. Cloud-only generation tools are explicitly unavailable; stored studies remain. The current refactor standardizes visual designs while retaining the authored learning content. Normal localhost APIs, package downloads, fonts, and Python runtime downloads are separate from this policy. `npm test` includes a guard against reintroducing model calls.

# PyBe — Python through stories

PyBe is an interactive platform that teaches Python through stories and case studies. Learners might investigate an airplane mystery, manage a royal kitchen, or explore a magical world. Each story invites them to make decisions, experiment, and solve problems before revealing the Python concepts and syntax behind their actions. The collection covers variables, loops, data structures, functions, object-oriented programming, exceptions, and more. Learners can choose different stories for the same concept, with activities, simulations, and coding exercises that suit each narrative. PyBe makes programming approachable and memorable by helping learners understand the purpose of code through exploration, feedback, and practice.

## Run locally

Requires Node.js 20+ and npm. From the directory where you downloaded or cloned this repository, run:

```powershell
npm install
npm run dev
```

Then open [localhost:5173](http://localhost:5173). If that port is already running an older PyBe server, stop it in its terminal and run the command again. For another port:

```powershell
$env:PORT = '5174'
npm run dev
```

## Homepage

- All 42 submitted concept groups appear on the homepage, organized into seven chapters.
- Eleven proposed pending topics are marked “Pending · proposed” and “Case study to be designed.”
- The pending list is a suggested backlog, not an approved syllabus. An idea may already be mentioned within a broader submission without having a dedicated case study.
- Search concepts, skills, and story titles. Filter by Submitted, Pending, or All.
- Cards and the study toolbar show concepts rather than student names. Original author credits remain in submission files.
- Choose among original submissions for a concept, save stories, and mark them explored.

## Original case studies

Build a story-based case study that helps learners understand a Python concept through a clear narrative. Use [Birbal and the Royal Reward](case-studies/conditionals-birbals-royal-reward/README.md) or [The Royal Scribe's Secret](case-studies/strings-royal-scribes-secret/README.md) as examples.

## New PR submissions

Existing case studies live in `case-studies/`. New case studies must go under `new-pr-submissions/`. Use a lowercase concept-and-story folder name, with hyphens between words, for example:

```text
case-studies/
  lists-royal-supply-scroll/
  inheritance-wildlife-field-journal/
  classes-why-classes-exist/
new-pr-submissions/
  concept-story-name/
```

Use a story suffix to distinguish multiple studies of the same concept. Keep each original application's files together, especially when several lessons share a frontend and backend. Platform tools are named by function; `empty-submission/` contains only a blank README and is not a playable study. The old `summership-26-prs/` and `rekhabattu-pr/` folders are no longer used. `new-pr-submissions/` is the intake directory for new case studies.

To add a study:

1. Add the original files under a concept-and-story folder in `new-pr-submissions/`.
2. Include a README describing the concepts, entry point, dependencies, and how to run the study. Preserve author credits in the submission files.
3. Use shared Python execution, progress and UI infrastructure while preserving the submitted story sequence. Do not add local scores, stars, badges, external LLM calls or AI image requests.
4. Keep new submissions in `new-pr-submissions/` for review. Promote reviewed studies into `case-studies/`, register the native entry in `shared/lesson-registry.json`, and add a walkthrough for its authored interactions.

## Coverage and maintenance

### Concepts already covered

- **First steps:** Variables & assignment; data types; keywords & identifiers; printing & built-in functions; arithmetic operators.
- **Decisions & loops:** Comparisons & Boolean logic; if, elif & else; for loops & range; while loops; break, continue & return; nested loops; truthiness & short-circuiting.
- **Strings & data structures:** Strings & text processing; indexing & slicing; lists; stacks & LIFO; tuples & immutability; sets; dictionaries & hashing.
- **Functions & scope:** Defining & calling functions; scope & name resolution; closures & nested functions; recursion & backtracking.
- **Object-oriented Python:** Classes & objects; encapsulation & data hiding; inheritance; polymorphism & duck typing; abstraction.
- **Files & exceptions:** File handling & persistence; exception handling; understanding Python errors; input validation.
- **Special topics:** Sorting & searching; filtering & counting; modules & imports; decorators; iterators & generators; references, mutation & memory; multithreading; data visualization with Matplotlib; compilers & interpreters; dates & times.

### Proposed pending concepts

The homepage currently lists these eleven proposed topics for dedicated case studies. This is a suggested backlog, not an approved syllabus; some skills may already appear within broader submissions.

| Concept | Proposed focus |
|---|---|
| Comprehensions | A dedicated story for list, set, and dictionary comprehensions. |
| Regular expressions | Find and validate text patterns with Python’s re module. |
| JSON & CSV serialization | Move structured information between files and Python objects. |
| Testing Python code | Write assertions, test edge cases, and learn unit testing. |
| Type hints | Describe the inputs and outputs of Python code with annotations. |
| Dataclasses | Model records with generated initialization and comparison methods. |
| Async / await & asyncio | Coordinate waiting tasks using coroutines and an event loop. |
| HTTP requests & APIs | Request data from a service and handle its responses. |
| SQLite & databases | Store, query, and update persistent records using SQL. |
| Packages, pip & virtual environments | Set up a reproducible Python environment and install packages. |
| Custom context managers | Design resource cleanup with __enter__, __exit__, and contextlib. |

See [CONCEPT_COVERAGE.md](CONCEPT_COVERAGE.md) for original contributors and source paths. Pending topics are a suggested backlog, not an approved syllabus; some may already be mentioned within a broader submission.

```powershell
npm run catalog
npm test
```

Python executes in the browser through one worker. The first execution downloads the Pyodide runtime from jsDelivr; this is separate from model APIs, which are not used. The supported learning entry point is the main PyBe route; retained private backends and inactive prototypes are submission records.

Dabbo’s Orchard retains its original Python source and renders all eight authored screens from an extracted payload. After intentionally editing that source, run `python tools/build_dabbo.py` to regenerate it. Submitted Sign the Squad animations and their shared player runtime are hosted locally.

Catalog rebuilds require Python 3. Reviewed mappings live in `tools/build_catalog.py`, `tools/original_catalog.py`, and `tools/submission-folders.json`. Rebuilding updates both `library/catalog.json` and `CONCEPT_COVERAGE.md`. The catalog contains entry points and runtime metadata. `shared/lesson-registry.json` explicitly selects the collections that use the integrated player; migrated studies read their authored lesson data through the main PyBe server.

The tests verify retention of every pre-migration study, submitted/pending status, source paths, lesson APIs, reflection branches, worker cancellation and recovery, shared progress, authored reference programs, and the absence of model calls. Python 3 is required for the Python-runner checks.

Run `npm run test:browser` for real browser Python execution and representative lesson-flow checks. It uses installed Chrome on Windows by default; set `PYBE_BROWSER_PATH` to another Chromium executable when needed. The walkthroughs cover authored paths, retries and representative failure cases; they do not prove every possible learner program is correct.

## Project layout

- new-pr-submissions/: intake directory for new case studies
- client/src/learning/: shared React lesson stages and player
- library/learning/: shared lesson rules, progress, styling, and worker-backed Python runtime
- shared/: explicit integrated-study registry and pre-migration preservation baseline
- library/: main interface and generated catalog
- server.mjs: local library server
- original-runtime.mjs: retained legacy launcher support; no current catalog entry uses it
- tools/run-original.mjs: retained standalone source helper; unnecessary for the PyBe learning interface
- tools/build_catalog.py and tools/original_catalog.py: reviewed concept and source mappings
- case-studies/: retained submissions for all 71 catalog entries, named by concepts, stories, or tool function; includes `classes-why-classes-exist/`
- tools/submission-folders.json: internal contributor-to-folder mappings
- work/: ignored local runtime, npm caches, and verification scratch files

Submission folders use concept and story names. `tools/submission-folders.json` maps the original contributor labels to the current folders for catalog rebuilding; original author credits remain in submission files.
