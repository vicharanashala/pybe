> Local-only policy (17 November 2026): external LLM transports, provider SDKs, cloud-generation developer utilities, and AI image requests have been removed. Feedback uses local rules or authored lesson text. Cloud-only generation tools are explicitly unavailable; stored studies and their original visual designs remain. Normal localhost APIs, package downloads, fonts, and Python runtime downloads are separate from this policy. `npm test` includes a guard against reintroducing model calls.

# PyBe — original Python case studies

The main library uses warm white and orange and organizes the original student submissions by concept. Case studies keep their submitted colors, layout, interactions, and learning sequence.

## Run locally

Requires Node.js 18+ and npm. From the directory where you downloaded or cloned this repository, run:

```powershell
npm run dev
```

Then open [localhost:5173](http://localhost:5173). If that port is already running an older PyBe server, stop it in its terminal and run the command again. For another port:

```powershell
$env:PORT = '5174'
npm run dev
```

## Homepage

- All 41 submitted concept groups appear on the homepage, organized into seven chapters.
- Eleven proposed pending topics are marked “Pending · proposed” and “Case study to be designed.”
- The pending list is a suggested backlog, not an approved syllabus. An idea may already be mentioned within a broader submission without having a dedicated case study.
- Search concepts, skills, and story titles. Filter by Submitted, Pending, or All.
- Cards and the study toolbar show concepts rather than student names. Original author credits remain in submission files.
- Choose among original submissions for a concept, save stories, and mark them explored.

## Original case studies

The learner flow opens only original submissions. There are no shared readers, extracted quizzes, rewritten stories, or replacement lesson designs.

Standalone HTML opens inside the library, with a full-tab option. Original React/Vite applications start through the local launcher. Their own Vite config, components, CSS, assets, routes, and backend code are used. Opening another app stops the previously managed app to avoid collisions between originals that use the same API port.

On first launch, the launcher installs the original app's dependencies into its own node_modules folder. This needs internet access and can take a few minutes. Tracked package files and lockfiles are not rewritten. Local package dependencies are installed as copies rather than Windows symlinks; legacy peer dependency resolution is retried only when needed.

Apps using newer Vite versions run with a private Node 22 installation under work/ when the system Node is older. The system Node installation is not changed.

Some originals still require database setup (for example MongoDB or Prisma/SQLite) or Python packages. No LLM provider keys are required; features that depended entirely on cloud generation are unavailable. Their setup failures are displayed with the original source and README path. Python/Streamlit submissions require Python and Streamlit to be installed. Written/script-only submissions open as original source. The launcher does not replace a failed original with a common lesson.

Library bookmarks and “explored” marks are local to this browser. Each original app retains its own progress behavior. Originals run on distinct local ports to separate their browser storage.

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

Use a story suffix to distinguish multiple studies of the same concept. Keep each original application's files together, especially when several lessons share a frontend and backend. Platform tools are named by function; `empty-submission/` contains only a blank README and is not a playable study. The old `summership-26-prs/` and `rekhabattu-pr/` folders are no longer used. `new-pr-submissions/` is the intake directory for new case studies. New submissions are not automatically added to the homepage catalog.

To add a study:

1. Add the original files under a concept-and-story folder in `new-pr-submissions/`.
2. Include a README describing the concepts, entry point, dependencies, and how to run the study. Preserve author credits in the submission files.
3. Do not add external LLM or AI image calls.

Homepage integration is a separate review step: the current catalog builder and launcher use `case-studies/`. Adding a folder to `new-pr-submissions/` alone does not make it appear in the app. When integrating a submission, update the catalog and runtime paths as needed, run `npm run catalog` and `npm test`, and verify the original study interactively.

## Coverage and maintenance

### Concepts already covered

- **First steps:** Variables & assignment; data types; keywords & identifiers; printing & built-in functions; arithmetic operators.
- **Decisions & loops:** Comparisons & Boolean logic; if, elif & else; for loops & range; while loops; break, continue & return; nested loops; truthiness & short-circuiting.
- **Strings & data structures:** Strings & text processing; indexing & slicing; lists; tuples & immutability; sets; dictionaries & hashing.
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

Catalog rebuilds require Python 3. Reviewed mappings live in `tools/build_catalog.py`, `tools/original_catalog.py`, and `tools/submission-folders.json`. Rebuilding updates both `library/catalog.json` and `CONCEPT_COVERAGE.md`. The catalog contains original entry points and runtime metadata only; it does not extract lesson content.

The tests verify original-only catalog entries, submitted/pending status, multiple while-loop choices, source and runtime paths, local HTTP responses, asset rebasing, launch API restrictions, and the absence of model calls. These checks do not guarantee every original lesson works end to end; verify new or changed studies interactively.

## Project layout

- new-pr-submissions/: intake directory for new case studies
- library/: main interface and generated catalog
- server.mjs: local library server
- original-runtime.mjs: original app dependency setup and lifecycle
- tools/run-original.mjs: launches an original Vite application using its own config
- tools/build_catalog.py and tools/original_catalog.py: reviewed concept and source mappings
- case-studies/: all 71 submission folders, named by concepts, stories, or tool function; includes `classes-why-classes-exist/`
- tools/submission-folders.json: internal contributor-to-folder mappings
- work/: ignored local runtime, npm caches, and verification scratch files

Submission folders use concept and story names. `tools/submission-folders.json` maps the original contributor labels to the current folders for catalog rebuilding; original author credits remain in submission files.
