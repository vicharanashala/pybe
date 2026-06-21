# Conversational Questioning

## Aim

PyBe's own roadmap (`server/src/data/roadmap.js`) lists five V0
deliverables. Four were already built — Abstraction Mapper, Python
Construct Generator, Prompt Evaluation Engine, and the scenario library
itself. **Conversational Questioning** was the one named but never
implemented.

The gap was visible in the existing data model before any code was
written: every scenario already had an `objectives` array of exactly 3
short goal phrases (e.g. `"Identify one value"`, `"Give the value a name"`, `"Connect naming to a variable"`), but the UI only ever displayed
them as static tags. The learner submitted one single block of reasoning
and got one single shot at being evaluated. The `objectives` field was
sitting there, already structured as a natural ladder of sub-questions,
unused for the one thing it was clearly meant for: a turn-by-turn
dialogue.

So the aim was narrow and grounded in what already existed: turn the
existing `objectives` array into an actual guided conversation, where the
learner is probed one objective at a time, and the system adapts —
hinting, clarifying, or advancing — based on each answer, before still
producing the same kind of session record the rest of the app already
understands (dashboard, analytics, mastery signals).

## Plan

1. **Additive, not a replacement.** The existing one-shot free-form form
stays exactly as it is. A mode toggle is added; guided mode is a second
path, not a rewrite of the first.
2. **No new infrastructure.** Conversations persist to the same local
`db.json` file store as scenarios and sessions. No database, no LLM, no
external API — consistent with the rest of the project.
3. **State machine over the existing `objectives`.** Each answer is
classified against the *current* objective only, as one of:

   * `off\_topic` → ask a clarifying question, retry the same objective
   * `partial` → give a hint, retry the same objective
   * `solid` → advance to the next objective
   * after 2 failed attempts on one objective → force-advance automatically,
so a learner can never get stuck in an infinite loop
4. **Converge back into the existing pipeline on completion.** Once all 3
objectives are resolved, the learner's final answers are assembled into
a reasoning transcript and turned into a normal `session` record — the
same shape free-form mode produces — so guided-mode results appear in
the dashboard and analytics without any schema fork.

## How it was implemented

### Classification model .



the model was built on a
simpler, more direct design:

* Each `objective` is now `{ text, keywords }`, where `keywords` is a short
hand-authored(ai pre-generated) list of **2 words/phrases per objective** (90 lists total
— 30 scenarios × 3 objectives), chosen from that specific scenario's own
context and sample reasoning — not generic concept-wide vocabulary, and
not derived from the objective's own wording.
* Classification became a pure keyword-overlap count against that
objective's own list:

  * **none of the 2 keywords appear** → `off\_topic`
  * **one of the 2 appears** → `partial`
  * **both keywords appear** → `solid`

This removes the echo-detection problem at its root — the keyword list no
longer needs to defend itself against the objective's own phrasing, since
it isn't derived from that phrasing in the first place. It also makes the
bar transparent to the learner: hints can name exactly which concept was
matched and what's still missing.

Word-boundary regex matching (`\\bkeyword\\b`) is used throughout instead of
plain substring matching, so short keywords like `"if"` don't accidentally
match inside unrelated words like `"identify"`.

### Files

**New:**

* `server/src/services/conversationEngine.js` — the dialogue state machine
and per-turn answer classifier.
* `server/src/services/conversationAnalysis.js` — guided-mode-only
abstraction mapping, code generation, and scoring, used once a
conversation completes.
* `server/src/routes/conversations.js` — `POST /api/conversations` (start),
`POST /api/conversations/:id/turns` (submit an answer), `GET /api/conversations/:id` (resume after reload), `GET /api/conversations`
(list).

**Modified:**

* `server/src/seed.js` — every scenario's `objectives` changed from
`string\[]` to `{ text, keywords }\[]`; all 90 keyword lists hand-authored.
* `server/src/data/store.js` — added conversation CRUD functions, mirroring
the existing session functions' style. `readDb()` defaults in an empty
`conversations: \[]` array if an existing `db.json` predates this feature,
so it's safe to drop into an already-seeded local environment.
* `server/src/index.js` — one line registering the new route.
* `client/src/main.jsx` — a Free-form / Guided mode toggle next to the
scenario header; a new `GuidedConversation` component that renders the
chat thread, posts answers, and feeds the completed result into the
*same* `<Result>` panel free-form mode already uses. Objective chips
updated to read `.text` from the new objective shape.
* `client/src/styles.css` — chat bubble and mode-toggle styles, matching
the project's existing cream/forest-green palette and spacing.

### API surface

```
GET  /api/conversations          → list (latest 30, hydrated with scenario)
GET  /api/conversations/:id      → single conversation (for resume)
POST /api/conversations          → { scenarioId, learnerName? } → start, returns conversation
POST /api/conversations/:id/turns → { text } → returns { conversation, session }
```

`session` is `null` until the conversation completes, then populated with
a full session record (same shape as `POST /api/sessions` returns), with
an added `conversationId` field linking back to the conversation.

## Test cases

These were run directly against the API during development, and are also
the ones to verify by hand in the browser.

### 1\. All-solid happy path — "Bag Weight Label"

|Objective|Keywords|Answer|Expected|
|-|-|-|-|
|Identify one value|`weight`, `value`|"I need to store the weight, which is a single numerical value."|`solid` → advance|
|Give the value a name|`name`, `label`|"I would give it a name like bag\_weight as a clear label."|`solid` → advance|
|Connect naming to a variable|`variable`, `store`|"I would store it in a variable so the computer can remember the weight."|`solid` → **completes**, session created with `variables` in the abstraction map|

### 2\. Partial → hint → retry → solid — "Rainy Day Choice"

|Step|Answer|Expected|
|-|-|-|
|Objective 1, attempt 1|"I need to check the weather."|`off\_topic` (no `rain`/`condition`) → clarify, retry|
|Objective 1, attempt 2|"The condition I need to check is whether it is raining."|`solid` (matches both) → advance|
|Objective 2|"I would decide to carry an umbrella if it rains."|`solid` → advance|
|Objective 3|"If raining then carry umbrella, else leave it at home."|`solid` → **completes**|

### 3\. Force-advance after repeated failure — "Favorite Color List"

|Step|Answer|Expected|
|-|-|-|
|Objective 1, attempt 1|"Colors are colors."|`off\_topic` → clarify, retry|
|Objective 1, attempt 2|"I like red, blue, and green."|`off\_topic` again → **force-advance** note, auto-moves to objective 2 without a solid answer|
|Objective 2|"All three colors form a collection that I can group together."|`solid` → advance|
|Objective 3|"I would store all items in a list data structure."|`solid` → **completes**|

### Edge cases also verified

* Invalid `scenarioId` on conversation start → `404`
* Empty/whitespace answer text → `400`
* Submitting a turn to a non-existent conversation → `404`
* Submitting a turn to an already-completed conversation → `409`
* Resuming a conversation via `GET /api/conversations/:id` after a page
reload restores full turn history and lets the learner continue
* Free-form mode (`POST /api/sessions`, `GET /api/sessions`, `GET /api/analytics`, `GET /api/roadmap`, `GET /api/health`) verified
byte-for-byte unchanged in behavior from before this PR
* `npm run build` (Vite) succeeds with no errors
* Patch applies cleanly to a fresh clone of the base repo, and the full
test suite above passes when run from that fresh clone

