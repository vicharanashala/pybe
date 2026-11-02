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
- Search concepts, skills, story titles, and contributors. Filter by Submitted, Pending, or All.
- Choose among original submissions for a concept, save stories, and mark them explored.

## Original case studies

The learner flow opens only original submissions. There are no shared readers, extracted quizzes, rewritten stories, or replacement lesson designs.

Standalone HTML opens inside the library, with a full-tab option. Original React/Vite applications start through the local launcher. Their own Vite config, components, CSS, assets, routes, and backend code are used. Opening another app stops the previously managed app to avoid collisions between originals that use the same API port.

On first launch, the launcher installs the original app's dependencies into its own node_modules folder. This needs internet access and can take a few minutes. Tracked package files and lockfiles are not rewritten. Local package dependencies are installed as copies rather than Windows symlinks; legacy peer dependency resolution is retried only when needed.

Apps using newer Vite versions run with a private Node 22 installation under work/ when the system Node is older. The system Node installation is not changed.

Some originals still require their own external services (for example MongoDB or Prisma setup), API configuration, or Python packages. Their setup failures are displayed with the original source and README path. Python/Streamlit submissions require Python and Streamlit to be installed. Written/script-only submissions open as original source. The launcher does not replace a failed original with a common lesson.

Library bookmarks and “explored” marks are local to this browser. Each original app retains its own progress behavior. Originals run on distinct local ports to separate their browser storage.

## New PR submissions

All new PRs submitted from November 2, 2026 onward must place their case studies in the `new-pr-submissions/` directory.

## Coverage and maintenance

### Concepts already covered

- **First steps:** Variables & assignment; data types; keywords & identifiers; printing & built-in functions; arithmetic operators.
- **Decisions & loops:** Comparisons & Boolean logic; if, elif & else; for loops & range; while loops; break, continue & return; nested loops; truthiness & short-circuiting.
- **Strings & data structures:** Strings & text processing; indexing & slicing; lists; tuples & immutability; sets; dictionaries & hashing.
- **Functions & scope:** Defining & calling functions; scope & name resolution; closures & nested functions; recursion & backtracking.
- **Object-oriented Python:** Classes & objects; encapsulation & data hiding; inheritance; polymorphism & duck typing; abstraction.
- **Files & exceptions:** File handling & persistence; exception handling; understanding Python errors; input validation.
- **Special topics:** Sorting & searching; filtering & counting; modules & imports; decorators; iterators & generators; references, mutation & memory; multithreading; data visualization with Matplotlib; compilers & interpreters; dates & times.

### Concepts not covered yet

These topics do not yet have a dedicated submitted case study:

| No. | Concept | What students should learn |
|---:|---|---|
| 42 | User input and type conversion | `input()`, `int()`, `float()`, `str()` and handling user input |
| 43 | String formatting | f-strings, formatting numbers, alignment and precision |
| 44 | List, set and dictionary comprehensions | Creating and transforming collections concisely |
| 45 | Unpacking and multiple assignment | Tuple unpacking, `*args`, `**kwargs` and starred expressions |
| 46 | Lambda functions | Anonymous functions and their use with `sorted()`, `map()` and `filter()` |
| 47 | Enumeration and parallel iteration | `enumerate()`, `zip()` and iterating over multiple collections |
| 48 | Context managers | `with` statements and safe resource management |
| 49 | Working with JSON and CSV | Reading, writing and exchanging structured data |
| 50 | Working with paths and directories | `pathlib`, `os`, navigating and managing files |
| 51 | Regular expressions | Pattern matching, extraction and text validation |
| 52 | Copying and equality | Shallow copy, deep copy, `==` versus `is` |
| 53 | Type hints and annotations | Improving code readability and checking types |
| 54 | Virtual environments and package management | `venv`, `pip`, dependencies and reproducibility |
| 55 | Standard library essentials | `collections`, `itertools`, `math`, `random` and `statistics` |
| 56 | Debugging techniques | Breakpoints, stepping through code and inspecting variables |
| 57 | Unit testing | `unittest`, `pytest`, assertions and test cases |
| 58 | Logging | Recording application events and diagnosing failures |
| 59 | Code quality and style | PEP 8, meaningful names, formatting and linting |
| 60 | Documentation | Docstrings, README files and documenting functions |
| 61 | Dataclasses | Organizing structured data using `@dataclass` |
| 62 | Advanced object-oriented design | Composition, properties, special methods and operator overloading |
| 63 | Command-line applications | Command-line arguments using `argparse` |
| 64 | HTTP requests and APIs | Making requests, handling responses and consuming REST APIs |
| 65 | Working with databases | SQLite, SQL queries and Python database connections |
| 66 | Asynchronous programming | `async`, `await`, `asyncio` and concurrent I/O |
| 67 | Multiprocessing | Process-based parallelism and CPU-intensive tasks |
| 68 | Data processing with NumPy | Arrays, vectorized operations and numerical computing |
| 69 | Data analysis with Pandas | DataFrames, cleaning, grouping and aggregation |
| 70 | Web application development | Building simple applications with Flask or FastAPI |
| 71 | Packaging and distributing Python projects | Project structure, `pyproject.toml`, building and installing packages |

See [CONCEPT_COVERAGE.md](CONCEPT_COVERAGE.md) for original contributors and source paths. Pending topics are a suggested backlog, not an approved syllabus; some may already be mentioned within a broader submission.

```powershell
npm run catalog
npm test
```

Catalog rebuilds require Python 3. Reviewed mappings live in tools/build_catalog.py and tools/original_catalog.py. The catalog contains original entry points and runtime metadata only; it does not extract lesson content.

The tests verify original-only catalog entries, submitted/pending status, multiple while-loop choices, source and runtime paths, local HTTP responses, asset rebasing, and launch API restrictions.

## Project layout

- library/: main interface and generated catalog
- server.mjs: local library server
- original-runtime.mjs: original app dependency setup and lifecycle
- tools/run-original.mjs: launches an original Vite application using its own config
- tools/build_catalog.py and tools/original_catalog.py: reviewed concept and source mappings
- summership-26-prs/ and rekhabattu-pr/: student originals, preserved
- work/: ignored local runtime, npm caches, and verification scratch files
