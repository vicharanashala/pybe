"""Report every catalog entry; heuristic source flags are review aids, not proof."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / 'library/catalog.json').read_text(encoding='utf-8'))
patterns = {
    'drag/drop or sorting interaction': re.compile(r'onDragStart|dataTransfer|@dnd-kit|draggable\s*[=:]'),
    'canvas/scene code': re.compile(r'getContext\(|<canvas|THREE\.|phaser', re.I),
    'Python execution': re.compile(r'pyodide|runPython|executePython|pythonRunner', re.I),
    'quiz/answer feedback': re.compile(r'correctAnswer|isCorrect|quiz|attempt2', re.I),
    'retained reward/prototype references': re.compile(r'leaderboard|achievement|awardBadge|\bsetScore\b|\bsetStars\b|\bsetPoints\b', re.I),
}
ignored = {'node_modules', '.git', 'dist', 'build', 'pyodide', '__pycache__', '.vite'}


def source_files(directory):
    for path in directory.iterdir():
        if path.name in ignored:
            continue
        if path.is_dir():
            yield from source_files(path)
        elif path.suffix in {'.js', '.jsx', '.ts', '.tsx', '.html', '.py'}:
            yield path


flags = {}
for directory in (ROOT / 'case-studies').iterdir():
    if not directory.is_dir():
        continue
    found = set()
    for file in source_files(directory):
        text = file.read_text(encoding='utf-8', errors='replace')
        found.update(name for name, pattern in patterns.items() if pattern.search(text))
    flags[directory.name] = sorted(found)

registry = json.loads((ROOT / 'shared/lesson-registry.json').read_text(encoding='utf-8'))
integrated = [s for s in catalog['stories'] if s['mode'] == 'integrated']
lines = [
    '# Shared-player migration status', '',
    f'{len(catalog["stories"])} catalog entries retained; {len(integrated)} integrated; '
    f'{len(catalog["stories"])-len(integrated)} awaiting migration.', '',
    'Every catalog entry now uses the shared PyBe route. No case study has been deleted. Original source files and inactive prototypes remain available; an inactive prototype is not presented as a completed additional lesson.', '',
    'Teaching constraint: preserve each authored flow and reveal timing. Shared components are not a fixed lesson template. Flight 218 is a protected reference for story-driven pacing; see shared/README.md.', '',
    '## Working shared path', '',
    '- Guided collections retain their existing reasoning → concept reveal → code-building sequence.',
    '- Sequence-based stories retain their own ordered story, discovery, activity, syntax, assessment, and reflection steps.',
    '- Native scene adapters retain original React components or authored HTML/module scripts, with scoped styles, assets, timers, events, and audio cleanup. They run inside the PyBe route without an iframe or a separate app server.',
    '- Topic and level order, token hints, editable open-ended exercises, output validation, and optional variable inspection.',
    '- Shared warm-white/orange UI, browser progress, one main server, worker-backed Python with cancellation and timeouts.',
    '- No points, stars, reward labels, badges, ranks, or leaderboards in the shared player.',
    '- Two identical 72-exercise data collections use one canonical payload; all original catalog choices remain. '
    'The sorting collection adds eight distinct exercises.', '',
    '## Necessary fixes', '',
    '- Mia’s Smart Parking Gate: the final question previously locked all choices after a wrong answer, preventing completion. It now allows another attempt. The scene sequence and authored components remain in use.', '',
    '- Royal Supply Scroll: removed the final award, connected the next-concept button to PyBe, and cloned scene data on replay so a previous choice cannot erase the original dialogue.',
    '- Campus Fest and Restaurant Orders: removed local mastery labels while retaining final challenges, summaries and reflections.',
    '- Everyday Python: the original three branching stories use their original data and components; illustrations resolve through the shared server. Completion is recorded after all three endings.', '',
    '- Lost Library, Wind Crystal, Sealed Record, Sets Auction and Maple Heights: removed local XP, points, ranks, achievement awards or star certifications. Original narrative resources, explanatory labels and correct/incorrect feedback remain. Wind Crystal records each completed challenge once.',
    '- Royal Messengers: its original console now uses the shared worker-backed Python runtime, preserving its authored syntax/name-error explanations and thirteen examples.',
    '- Adder: uses the original standalone lesson components directly, with the original four illustrations and five-screen sequence, without launching its surrounding prototype app.', '',
    '- Kitchen Lab: its four original chapter pages now navigate within PyBe, retaining browser Back/Forward and the authored file interactions. Quiz scores and ranks were removed; explanations and retries remain.',
    '- Himalayan Ride: retained all twelve activities, with neutral trail notes replacing its certificate. Fixed drag-preview coordinates inside PyBe and prevented embedded arrow controls from also advancing the surrounding scene.',
    '- NovaTech Investor Room: retained all six charts, rejection/retry, quiz and reflection; bundled the canonical local assets and removed confidence scores and skill awards.',
    '- Mela and Dashavatara: retained each eleven-chapter story and special simulations. Shared Code, Feedback, Choice and chapter-shell markup replaces actual repeated UI; it does not determine either story sequence.',
    '- Lost Forest: retained fourteen stages and the late nine-command codebook. XP and the achievement overlay were removed. Its two coding challenges now execute in the shared worker and check the requested output and final backpack state.',
    '- Samsung OOP Stories: all five eight-stage stories share one canonical data module with the retained standalone source. Fixed quiz choices that previously locked after a wrong answer despite promising a retry; original final narrative conclusions replace trophies.', '',
    '- Betaal Tales: all twenty-five original fables, randomized riddles and exercise variants remain. The one-minute reflection pause is preserved. Shared worker execution and browser progress replace its private Python loader and session API; XP and achievement badges are removed. Mini-project briefs and hints now appear, and regenerated exercises require their own completion.', '',
    '- Iteration Journey: retained all eighteen authored theatre beats, illustrations and four gated questions with optional explanations. A shared scoped utility-CSS compiler supports its original components; the warm responsive frame keeps both panes within PyBe.',
    '- Messy Attendance List: the original written submission is rendered from its unchanged Markdown inside PyBe, preserving every section, concept table, code example and output.', '',
    '- Cricket Chase and Loop Control Discovery: preserved the seventeen-beat cricket story, thirteen-beat note counter and ten-beat cinema story. The identical navbar and completion storage rules share one implementation; score awards and the private quiz transport are retired. Authored quiz data and answer checks remain local and canonical.',
    '- Palace of Whispers: all eight original illustrated pages, scene scripts, animations, sound toggle, LEGB search and late code reveal remain. Its nested hash addresses use real browser history within the PyBe route, preserving in-memory page unlocks on Back/Forward.', '',
    '- Memory Modules: preserved all four crash/recovery stories and the ten-question final review. Score accumulation and certification awards are removed; per-question correctness still gates the practical patches. Repeated line-explanation markup now shares one component with every original explanation point retained. Shared timer groups serve React and authored-script stories; pending work and audio are cleaned up on exit.', '',
    '- Tiffin Trail: all fifteen Mumbai delivery stops, SVG illustrations, prediction feedback, code building, crossed-cart debugging and capstone closure remain. XP and badges are removed; the original concept-acknowledgment pause remains as a neutral review action. Added the missing `handoff()` definition used by its relay exercise, so the demonstrated program actually runs. Optional photos were never supplied in the submission; its original illustrated fallback remains in use.', '',
    '- PyFarm: both seven-screen authored chapters remain, including Maya’s decision moments, late syntax explanations, scaffold/free-code modes, farm reactions and both weather scenarios. Uses the shared Python worker and completion storage; XP and levels are removed. Editing a previously correct program clears its old success result.', '',
    '- Calico Jack: retained all seven cinematic opening scenes, both raid outcomes, the seven-island ladder, replay controls and six retryable questions. Local artwork is bundled; first-try scores are removed. The continuous scroll voyage stays continuous.',
    '- Magic of Logic: retained all five original Hogwarts activities, drawn-spell recognition, trait matching, potion controls, broom timing and late code explanation phases. Uses the shared animation dependency and timer lifecycle; final mastery and trophy awards are removed.',
    '- Raidurg Adventure: retained all thirty-nine original slides, choices, metro/canteen/seat interactions, discovery timeline and supplied coding tasks. Its previous keyword-based fabricated output is replaced by real shared-worker execution, stdout checks and Python syntax-tree checks. Added a local five-by-six seat illustration because the originally referenced auditorium image was missing. Quiz totals and final mastery awards are removed.',
    '- Hawkins Division: retained all eleven original missions, dialogue, branching consequence, challenge and cassette field note. Shared completion storage replaces XP, badges and ranks; narrative rift threat levels remain. A data-reference hash protects all original teaching content apart from retired reward metadata.', '',
    '- Oracle Journey: preserved all ten internal pages, relic and gate choices, reflection, late exception-handling explanations, four exception trials and final scenarios. Shares the internal router inside PyBe; removes quiz scores and repairs the original wrong-answer lockout with review buttons while retaining its learning gate.', '',
    '- Dharma Validator: retained both foundations stories, its introduction and all sixteen authored lessons, practice editors and local reflection guides. Shared Python execution and completion replace private runtime and badges. Fixed a source animation that made teaching text disappear and kept program input available.',
    '- Dasara Festival: retained all nine chapters, predictions, recovery choices, simulated lab branches and five review questions. Corrected the final try/except/else/finally template so the taught Python is valid; it now uses the shared blank parser. Scores and trophy awards are removed.',
    '- Tuple Playground: retained all thirty-two tour conversations, biscuit and mixed-wrapper activities, nested battery replacement, nine code puzzles and ten questions. Identical biscuit artwork and drag-target checks now have shared implementations. Quiz retry and completion remain without scores or trophies.',
    '- Wildlife Journal: retained all eight active inheritance acts, original illustrations, observations, transfer scenarios, questions, summaries, story bridges and late syntax slides. Shared completion and local journal notes replace private API storage and XP. The originally unlisted alternate saga source remains retained and unlisted.',
    '- Recursion Discovery: retained all seven illustrated mirror scenes, story/concept/key-idea reveals, original execution animation, three concept pillars, five questions and review retry. Fixed click bubbling that could skip a panel. Shared timers and completion replace unscoped callbacks and scoring; the activity remains an authored code trace.',
    '- Doraemon Collections: retained both nine-stage episodes, stamp sorting/checking/unique piles, gadget-action pairing, late concept reveals, practice activities, reflections, Q&A and assessments. The original three coding challenges now run once in the shared Python worker with the authored assertions. Shared completion replaces scores, streaks and ranks. Reflection retry repairs a lockout; stamp animation callbacks no longer nest inside React state updates.',
    '- Dabbo’s Orchard: retained all eight original Streamlit teaching screens and arithmetic examples as a native PyBe story, using an extracted payload checked against the untouched Python source. Its original orchard photograph and five timed box-search frames remain; Previous and Start Again work in place. The Streamlit source is retained.',
    '- Treasure Kingdom: retained all thirteen pages, carry and memory choices, iterator/exhaustion/reset demonstration, water taps, yield pause/resume, matching game and six final questions. Uses shared timers, sound cleanup and completion; removed the static learner rank. Mobile iterator boxes now stack within the same story.',
    '- Rosewood Manor: retained all six case files, fifty-eight slides, twenty-four deductions, suspect portraits and evolving suspicion board, four annotated code reveals, ledger and original ending. Authored data is separated from private learner sessions. Correct choices and progress are local, the theme stays scoped to PyBe, and closing the case preserves the PyBe route. Suspect suspicion scores remain narrative evidence.',
    '- Sign the Squad: retained both submitted animations locally, all thirteen report signings, three concept scenes, six blueprint beats, editable player fields and the original three challenges. Two animation implementations now share one locally hosted player/runtime. The original handoff opens Bird Family in the same PyBe route. Removed the local mastery award.',
    '- Bird Family: retained six story cards, reflection, reasoning questions, six term scenes, five trait flips and gene splices, hybrid practice, micro-checks, four code questions, nine code pieces and all five bird simulators. Shared completion and local notes replace private progress API calls, points, streaks, XP, stars and achievement popups. Difficulty labels and narrative class badges remain teaching content.',
    '- Thieves at the Well: retained the original landing, prologue, five illustrated story decisions with retries, epilogue and five late code-building trials. Authored module data loads directly, progress is scoped to the story, illustrations use the main server, and final completion is recorded inside PyBe. Inactive prototype screens are not inserted into the submitted active sequence.',
    '- Robo and Doraemon: retained both original paths: ten Memory Pockets scenes and the garden/library/well discovery, number-line/flowchart/sorting, live execution trace, eight cumulative garden programs, playground and ten final questions. Shared Python, timers, typewriter, storage and completion replace private implementations. Removed gems, crystals and aggregate scores; repaired ambiguous gadget decoys, overlapping plant targets and stale evaluation results.',
    '- Ant Colony: retained all thirteen scenes, progressive excavation and camera controls, narration, activities, quizzes, real-photo bridge and animated recursion/call-stack reveal. Shared timers, audio cleanup and completion replace XP and achievements; scene text panels stay readable over the unchanged colony artwork.',
    '- Gurukul: retained the cinematic introduction, lamp discovery, seven-era chronicle, three anatomy demonstrations, seven lotus stages, three illustrative missions, well and twelve coding challenges. The previously missing Play/Step/Reset implementations now animate the authored lotus model. Code checks execute actual Python and compare the submitted sample output, replacing fabricated success and performance metrics. Removed stars, seals and certificates; closing reflection and blessing remain.',
    '- Eternal Mold: retained three ten-attribute manual foxes, exhaustion/epiphany, blueprint rune placement, generated blueprint and repeated-instantiation finale. The supplied blueprint illustration replaces a missing scroll image. Its active ending is preserved; unused editor/chapter prototypes are retained without adding a new route. The retained editor now uses the shared editor/runtime, and delayed transitions no longer overwrite later scenes.',
    '- Poko: retained all twenty-two original teaching parts, ten intro scenes, twelve butterflies, matching, thirty-four questions, six guided exercises, token explanations, real Python playground/winter mission and both five-item final levels. Shared execution replaces JavaScript code evaluation. Fixed answer-index/text mismatches, mislabeled options and replay mutations; hints and retries remain. Impossible percentage gates, scores, XP, rewards and leaderboard are retired.',
    '- Magic Pet Shop: retained all seventeen active episodes, choreography, choice retries, pet-care safety actions, guided code, final quiz and recap. The conflicted launcher now opens the actual authored story. Shared timers/progress and audio cleanup replace local rewards, scores and certificates. The original future-scope inheritance, polymorphism and abstraction tabs remain locked; their source files remain retained.',
    '- Dictionary Discovery: retained all five story/lab/checkpoint chapters, drawer search, nine-scene hash activity and collision, bug fixes, safe lookup and final review. Lookup uses the submitted local treasure/quiz data. XP, paid hints, badges and certificates are retired. Fixed progress-effect cleanup and local illustration paths.',
    '- Find and Squash the Bug: all 30 reasoning scenarios and 54 debugging challenges remain. Shared CodeMirror and actual Python execution replace the private editor/server. Documented native corrections for 36 challenges repair invalid expectations, missing inputs, broken reference solutions, and already-correct starters; the submitted database remains unchanged. Every reference solution is checked, and every starter demonstrates a failing test. Local reading aids and hints replace model calls; grades are retired.',
    '- Royal Bakery / Thirsty Crow: retains three six-part submitted skeleton diagrams (including nested dictionary teach-back), original zoom/replay controls, and 30 reasoning scenarios. Diagrams render inside the current study. The reasoning workbench and feedback are shared with Debugging and Arcade.',
    '- Python Arcade: retains all three pixel challenges, ten-day pet simulation, spaceship combat, five internal routes and 30 reasoning scenarios. Identical 72-case learning data reuses the canonical guided collection. A shared bridge executes the original game APIs in the common Python worker. Async combat frames run sequentially; resets/unmounts stop old work. Learner scores are removed; pet resources, lives and waves remain story state.',
    '- Story Traditions: retains the 21-topic authored path, prerequisite levels, active problem/solution scenes, six activity types, concept guide, bridge, five-part lessons, console, challenges, reflection and summary. Shared Python replaces two partial JavaScript simulators; explicit narrative fixtures and corrected generated statement examples make the code runnable. Awards, cards and numeric reflection grades are retired. Drag activities retain dragging and add tap/keyboard alternatives.', '',
    '## Verification', '',
    '- Final checks: `npm test` passes all 52 automated checks. Browser walkthroughs pass across the catalog, run in checkpointed batches, including real Python, authored interactions, retries, same-page navigation, persistence and mobile widths. Accelerated-clock tests use isolated browser contexts so their mock timing cannot affect other stories.',
    '- Catalog preservation baseline: `shared/catalog-baseline.json`. Flight 218’s original HTML is also protected by a SHA-256 reference check.',
    '- Browser checks traverse both sequence-based stories and Mia’s original scenes through their endings, including retries, drag/drop, lookup, registry operations, and shared completion recording.',
    '- Additional browser walkthroughs cover Flight 218 (seven chapters), Traffic System (18 scenes), Why Classes (12 observations), Postman (seven stages), Campus Fest (11 scenes), Royal Supply Scroll (14 scenes), Humans & Aliens (12 pages), Royal Scribe (eight stages), Everyday Python (three branching stories), Restaurant Orders (11 chapters), and Khul Ja Sim Sim (ten scenes).',
    '- Further walkthroughs cover Royal Messengers (four chapters and thirteen Python examples), Sealed Record (17 chapters), Lost Library (37 keyword cards and 37 puzzles), Maple Heights (eight cases), Wind Crystal (three simulations and an ordering puzzle), Birbal (22 scenes), Sets Auction (15 screens), Flow Tales (four introduction slides and 22 steps), Gates of Rajgad (ten screens), and Adder (four story scenes, five questions, three discovery prompts and the Python reveal).',
    '- Additional full walkthroughs cover Kitchen Lab (four pages and eight quiz explanations), Himalayan Ride (twelve activities), NovaTech Investor Room (six charts and rejection/retry), Mela and Dashavatara (eleven chapters each), Lost Forest (fourteen stages, nine codebook lessons and two real Python challenges), and Samsung OOP (five eight-stage stories, code-line explanations, code-order exercises and quiz retries).',
    '- Betaal walkthroughs cover all twenty-five stories and fifty Python activities, randomized riddle retries, reflection gates, late concept reveals and saved completion. Data-reference hashes protect the complete narrative and exercise payloads for Samsung and Betaal, excluding only retired reward fields.',
    '- Iteration Journey checks traverse all eighteen beats, load all illustrations, exercise wrong/correct answers and optional explanations, and check mobile width. Messy Attendance checks protect section order and the exact Python example.',
    '- Cricket and Loop Control checks traverse all forty beats, six quiz retries and five code-building activities. Palace checks traverse all eight pages, both choice retries, repeated animated LEGB search, final Python discovery, nested history and replay.',
    '- Memory Modules checks traverse every crash/recovery, both prediction modes, every available code-line explanation and its ordered points, quiz retry, four practical patches, ten final review questions and mobile width. Timer checks cover cancellation, stale callbacks and Strict Mode effect replay.',
    '- Tiffin checks traverse all fifteen stops, three predictions, four concept acknowledgments, three code-building activities, the bug hunt, capstone output and replay. Python checks execute its four reference programs. Data hashes protect Tiffin pages and all Memory Modules slides, questions, practical patches and line explanations.',
    '- PyFarm checks cover both seven-stage chapters, actual Python errors, scaffold retries, both weather scenarios, persistence and mobile width. Calico checks cover all seven cinematic scenes, both raid branches, ladder replay and six quiz retries. Magic of Logic checks draw real spells, control the potion and catch the broom. Raidurg checks all thirty-nine slides, every original interaction and all three real Python programs.',
    '- Tests compare all migrated topics, levels, cases, and reflection branches with their authored source.',
    '- All 80 distinct guided reference programs execute with the shared Python wrapper in CPython and browser Pyodide. The Monkey and the Crocodile also executes its authored exception-handling code with the story operation supplied as a fixture.',
    '- Representative browser flows cover incorrect reasoning, reflection, concept reveal, token hints, Python execution, '
    'variable inspection, progression, persistence, in-page navigation, and mobile width.',
    '- Source flags below are review aids. They can include decorative effects or example data, '
    'and do not certify that an interaction has been migrated. Educational examples about scores are not reward systems.', '',
    '## Every catalog entry', '',
    '| Case study | Migration | Source review flags |',
    '|---|---|---|',
]
for story in catalog['stories']:
    folder = Path(story['source']).parts[1]
    status = 'Pending — existing implementation retained'
    if story['mode'] == 'integrated':
        definition = registry['collections'][registry['studies'][story['id']]['collection']]
        if isinstance(definition, dict):
            status = {'component': 'Integrated — original scene components', 'html': 'Integrated — original authored scripts', 'book': 'Integrated — original chapter pages'}.get(definition.get('kind'), 'Integrated — authored sequence')
        else:
            status = 'Integrated — original guided sequence'
    lines.append(f'| {story["title"]} | {status} | {"; ".join(flags[folder]) or "Review authored sequence and interactions"} |')
lines += [
    '', '## Future submissions', '',
    'New studies must be reviewed for story flow, model calls, awards and execution, then registered and verified inside the shared player. Do not reintroduce standalone app launches or a fixed teaching template.',
    '', 'New case studies continue to arrive in `new-pr-submissions/`.', '',
    'Regenerate this report with `python tools/build_migration_status.py` after updating the catalog.', '',
]
(ROOT / 'MIGRATION_STATUS.md').write_text('\n'.join(lines), encoding='utf-8')
print(f'Migration report: {len(catalog["stories"])} entries accounted for.')
