# Story Authoring — PyKatha

This guide explains exactly how to add a new story while preserving the learning methodology. Stories are **pure data** — adding one does **not** require touching any React page.

---

## 1. Story Requirements

A story must:

- **Teach exactly one Python concept.** One story → one control-flow idea. If you can name two concepts from the story, split it.
- **Have a clear beginning, middle, and end.** The behaviour that maps to the concept should be the story's *central* conflict, not a sub-plot.
- **Contain a discoverable logical pattern.** There must be a rule a reader can infer: a condition that gates an action, a repetition that stops, or an ordered set of items.
- **Work as a normal story without Python knowledge.** A reader must be able to enjoy and understand it with zero programming background.
- **Contain enough evidence for reasoning questions.** The story needs enough consistent detail that a learner can answer observation, pattern, reasoning, and prediction questions from memory.
- **Avoid explicit Python terminology.** No "loop", no "condition", no code, no keyword names — the concept is *represented*, never *named*.
- **Avoid directly revealing the answer.** The concept label may be shown *on the story card* as priming, but the narrative itself must not state the rule. The learner is meant to *discover* the rule.

## 2. Story → Concept Mapping

Before writing a story, decide which situation shape you are building:

| Concept | Situation shape | Story boilerplate |
|---|---|---|
| `if` | "**Only when** X happens does Y happen." | A single action gated by a condition. E.g. the rabbit crosses only when the path appears. |
| `while` | "Y **keeps happening while** X remains true." | A repeating action that stops when a condition flips. E.g. the crow keeps dropping pebbles while the water is out of reach. |
| `for` | "Y **happens once for each** item/step." | One action repeated across a known, ordered set. E.g. the turtle passes each milestone of the journey. |

Choose the concept **first**, then design a story whose central conflict *is* that shape. If the natural story for your idea keeps sliding into a second shape, choose one and revise.

## 3. Expected Structure

Create a new folder under `src/stories/` named after your story's route id (`kebab-case`, no spaces):

```
stories/
└── new-story-id/
    ├── story.js
    ├── questions.js
    ├── code.js
    ├── practice.js
    └── moral.js
```

Then register the id in **three places** so navigation stays consistent:

1. `src/pages/StorySelection.jsx` — add an entry to the `STORIES` array (see "Registration" below).
2. `src/pages/StoryReader.jsx` — add the id to `STORY_IDS` **in chapter order** (this drives prev/next).
3. `src/pages/Practice.jsx` — add the id to `PRACTICE_STORIES` (drives "Problem X of N").

That's it. Every page already handles loading, missing data, and routing generically.

---

## 4. Field Reference

### `story.js`

Exports a default object **and** matching named exports (the reader uses `.default`; the named exports keep things readable):

| Field | Type | Meaning |
|---|---|---|
| `title` | string | Story title shown on the card, reader header, and metadata. |
| `concept` | string | The displayed concept, e.g. `"Python while Loop"`. Shows on badges. |
| `readingTime` | number | Minutes; shown as "X min read" on the reader and used on the card. |
| `chapter` | string | E.g. `"Chapter Two"`. Shown as the reader's eyebrow and in "Take a Moment". |
| `paragraphs` | string[] | The story body. One string per paragraph. **Never mention Python.** |
| `illustrationType` | string | Art scene key. Must exist in `StoryIllustration`'s `SCENES` (`"moon"`, `"crow"`, `"turtle"`), or add a new scene. |

```js
// story.js
export const title = "The Fox and the Grapes";
export const concept = "Python while Loop";
export const readingTime = 5;
export const chapter = "Chapter Four";
export const illustrationType = "moon";

export const paragraphs = [
  "A fox saw a cluster of grapes hanging high on a vine.",
  "He leaped, but the grapes were just beyond his reach.",
  "So he tried once more, and once more again, until at last he stopped and looked at the vine.",
];

export default { title, concept, readingTime, chapter, paragraphs, illustrationType };
```

### `questions.js`

Exports an array (either `export const questions = [...]` **or** `export default [...]` — the page accepts both). Each question:

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Unique question id (informational; not rendered). |
| `type` | string | `"mcq"` (multiple choice) or `"blank"` (fill-in-the-blank; see note). |
| `skill` | string | One of: `Observation`, `Pattern recognition`, `Reasoning`, `Prediction`, `Fill in the Blank`. Drives the badge icon + color. |
| `question` | string | The question text. For `blank`, include exactly one `____`. |
| `options` | string[] | 4 answer choices. |
| `answer` | number | **Index** (0-based) of the correct option. |
| `explanation` | string | Shown as feedback after the learner answers. |

```js
// questions.js
export const questions = [
  {
    id: "fox-q1",
    type: "mcq",
    skill: "Prediction",
    question: "If a taller vine grew next week, what would the fox most likely do?",
    options: [
      "Try again before giving up",
      "Ignore the grapes forever",
      "Climb the vine and sit on top",
      "Ask a bird to bring them down",
    ],
    answer: 0,
    explanation: "The fox only gave up after many attempts; a taller vine would just mean more tries.",
  },
];

export default questions;
```

> **Note on `blank` questions:** the `____` token is rendered inline with selectable option chips. Keep exactly **one** `____` per question and 4 short options.

### `code.js`

Exports a default object used by the Hidden Logic reveal, which walks 4 steps:

| Field | Type | Meaning |
|---|---|---|
| `storyMoment` | string | Step 1 — quote the exact story behavior ("Remember the story"). |
| `pattern` | string | Step 2 — the abstract pattern ("See the pattern"). |
| `logic` | string | Step 3 — the logical statement ("Shape the logic"). |
| `code` | string | Step 4 — the actual Python ("The secret appears"). Must be **syntactically valid Python**. |
| `conceptName` | string | Optional metadata; the formal concept name (not currently rendered). |
| `finalNote` | string | Optional metadata; a one-line definition (not currently rendered). |

```js
// code.js
export default {
  storyMoment: "The fox tried again only while the grapes were still out of reach.",
  pattern: "When something repeats, and keeps repeating, until a condition is met.",
  logic: "While the condition is true, the action keeps happening.",
  code: "while grapes_out_of_reach:\n    leap()",
  conceptName: "WHILE Loop",
  finalNote: "A step repeats while a condition stays true.",
};
```

### `practice.js`

Exports a default object. The page renders `codeTemplate` with a `______` blank and one selectable option will replace it.

| Field | Type | Meaning |
|---|---|---|
| `prompt` | string | Instruction above the code, e.g. `"Complete the code based on what you discovered."` |
| `codeTemplate` | string | Code with exactly one `______` blank. |
| `options` | string[] | The chips the learner can pick from. Include exactly four. |
| `answer` | string | **String value** of the correct option (must exactly equal one of `options`). |
| `output` | string | The story outcome shown when correct ("See What Happens"). Hand-written story text — the code is **not** executed. |
| `reminder` | string | A small italic hint tying the practice back to the story. |

```js
// practice.js
export default {
  prompt: "Complete the code based on what you discovered.",
  codeTemplate: "while ______:\n    leap()",
  options: ["grapes_out_of_reach", "vine_tall", "sun_is_up", "fox_hungry"],
  answer: "grapes_out_of_reach",
  output: "The fox plucks the grapes.",
  reminder: "Remember how the fox kept leaping while the grapes stayed out of reach?",
};
```

### `moral.js`

Exports a default object rendered by the Moral page.

| Field | Type | Meaning |
|---|---|---|
| `conceptName` | string | Large display name — `IF`, `WHILE`, `FOR`, etc. |
| `conceptLine` | string | One-line correct definition of the concept. |
| `storyReflection` | string | "In the story" paragraph — must relate to the actual story. |
| `realLife` | string | "In your life" paragraph — human/moral takeaway tied to the concept. |
| `closing` | string | The italic closing aphorism. |

```js
// moral.js
export default {
  conceptName: "WHILE",
  conceptLine: "A step repeats while a condition stays true.",
  storyReflection:
    "The fox never gave up while the grapes stayed out of reach — leap after leap until his goal was met.",
  realLife:
    "Big goals are reached by repeating a small honest step while the need remains. Keep going while the goal is still out of reach.",
  closing: "Keep leaping. The grapes will come closer.",
};
```

---

## 5. Registration (required for pick-up)

### 1. `StorySelection.jsx` — `STORIES` entry

```js
{
  title: "The Fox and the Grapes",
  concept: "Python while Loop",
  difficulty: "Beginner",
  minutes: 5,
  href: "/story/fox-grapes",
  variant: "moon",      // art key; must exist in StoryCard's ARTWORK or be added
  artSpan: "44%",
  accent: "#c66a2b",
},
```

### 2. `StoryReader.jsx` — `STORY_IDS`

```js
const STORY_IDS = ["rabbit-if", "crow-while", "turtle-for", "fox-grapes"];
```

Chapters display as "One / Two / Three…" based on list position.

### 3. `Practice.jsx` — `PRACTICE_STORIES`

```js
const PRACTICE_STORIES = ["rabbit-if", "crow-while", "turtle-for", "fox-grapes"];
```

---

## 6. Question Authoring

Questions carry the **reasoning** burden of the methodology. They must test understanding of the story's *structure*, not recall of its facts, and they **must not leak Python**.

### The strategy

The challenge tests four cognitive operations plus a fill-in-the-blank, one of each:

1. **Observation** — "what sign appeared again and again?" Notices the recurring evidence.
2. **Pattern recognition** — "what order did the events repeat in?" Notices the structure/rhythm.
3. **Reasoning** — "why did the character act this way?" Explains the cause.
4. **Prediction** — "what would happen if X changed?" Applies the rule to a new case.
5. **Fill in the Blank** — "the rule's essential word goes here." Condenses the rule into a word.

### Good questions

- Ask about **the behaviour and its rule**:
  - "Pip crossed only when the path appeared. When the moon is bright but no path appears, what should he do?" (Prediction — exercises the condition)
  - "With every pebble, what changed a little?" (Observation — the state the loop updates)
  - "Turtle's road was split into stages. What marked the end of one stage and the start of the next?" (Observation — the items the loop iterates)
- Use phrasing that maps to computation **without naming it**: "what sign came first", "what kept happening", "what would change", "what stayed the same".

### Bad questions

- **Factual recall a learner could only look up**: "What colour was Pip's coat?" — tests nothing transferable.
- **Python terminology**: "What was the `if` condition?" — exposes the concept before the reveal.
- **Directly answerable only from the reveal**: "Which boolean made the rabbit cross?" — requires the concept, not the story.
- **Searchable text**: any question answered by re-reading the exact paragraph rather than reconstructing the rule — which is precisely why the story is hidden during the challenge.

### Rule of thumb

> Ask *what the story does*, never *what the code is*. The learner should be able to answer every challenge question immediately after finishing the story, from understanding alone.

## 7. Reveal Authoring

The reveal (`code.js`) must escalate in four faithful steps:

1. **storyMoment** — quote a *real event* from your story ("The crow dropped pebble after pebble, and did not stop until the water reached his beak."). Ground the learner in the story.
2. **pattern** — generalise it into a pattern ("When something repeats, and keeps repeating, until a condition becomes true."). Note the *repetition* and *stopping condition*.
3. **logic** — state the programming logic in words ("While the condition is true, the action keeps happening."). Now the control flow is explicit, still syntax-free.
4. **code** — express the logic in valid Python ("while water_out_of_reach: drop_pebble()"). This is the *translation* of the learner's own conclusion.

Each step must be a strict generalisation of the previous one: story → pattern → logic → code, nothing skipped.

## 8. Practice Authoring

The practice (`practice.js`) asks the learner to **reconstruct** the revealed logic:

- **blank** — the one word whose replacement would change the concept (for the reveal above: `water_out_of_reach` is the *condition*; for a `for` loop it is the *collection* being iterated). Never blank a function name or a cosmetic word.
- **available options** — exactly four chips: the correct answer plus three plausible-but-wrong alternatives that test the concept itself (e.g. a count, a weather condition, a constant). For a `for` loop, include single members of the set (`meadow`, `oak_tree`) to test that the blank is the *whole set*.
- **correct answer** — the string must exactly equal the reveal code's variable (see practice `answer`). Rabbit: reveal `if path_visible:` ↔ blank `path_visible`.
- **feedback** — wrong answers show a gentle hint ("Think about what controls the action in the story."), never the answer.
- **story reminder** — ties the blank back to the story moment ("Remember how the rabbit crossed only when the silver path appeared?").

> The practice `answer` must produce the revealed behaviour; the `output` is the hand-written story outcome shown on success (the MVP does not execute code).

## 9. Content Validation Checklist

Before adding a story, verify every item:

- [ ] Story makes sense without Python (read aloud, without opening `code.js`).
- [ ] Exactly one concept is taught (you can name exactly one situation shape).
- [ ] Pattern can be discovered from the story alone (no hint text or code).
- [ ] Questions don't reveal syntax or name the concept.
- [ ] Story isn't visible during the challenge (it never is — verify you don't rely on it being on screen).
- [ ] Reveal logically follows from story (storyMoment → pattern → logic → code, no jumps).
- [ ] Code is syntactically valid Python (run it: `python -c "<snippet>"`).
- [ ] Practice answer matches reveal code (same condition / collection, same spelling).
- [ ] Final lesson (moral) matches the story (same events, same concept).
- [ ] All story IDs match routing/data (folder = `STORIES.href` = `STORY_IDS` = `PRACTICE_STORIES`).
- [ ] Exactly 5 questions (observation, pattern, reasoning, prediction, +1 fill-blank), 4 options each, correct `answer` indices/strings.
- [ ] `npm run lint` and `npm run build` pass.

## 10. Authoring Rules (Condensed)

1. **One Python concept per story.** The story must map cleanly onto exactly one control-flow idea.
2. **The story must not mention Python.** No code, no keywords, no "loop", no "condition". The concept is *represented*, never *named*.
3. **Questions test reasoning.** Observation, pattern, prediction — never a fact you can only look up.
4. **The hidden logic maps story → concept.** `storyMoment` is a real event; `pattern`, `logic`, `code` follow in escalating abstraction and stay faithful to it.
5. **Practice must reinforce the same concept.** The blank gates/repeats/iterates on the exact variable `code.js` revealed, and the `answer` must genuinely produce the `output`.
6. **Moral connects story and concept.** Reflections reference your story's actual events; the concept line is a correct Python definition.
7. **Every snippet is valid Python.** If in doubt, run it.
8. **Counts & consistency.** 5 questions (4 skill-based + 1 fill-in-the-blank), 4 options each, correct `answer`/`options` indices and strings.

## 11. Full Walk-Through Example

The definitive worked examples for the three existing stories are in **[CASE_STUDIES.md](CASE_STUDIES.md)** — each follows scenario → observation → pattern → reasoning → computational thinking → syntax reasoning → Python → practice mapping. Mirror that structure when authoring new content.