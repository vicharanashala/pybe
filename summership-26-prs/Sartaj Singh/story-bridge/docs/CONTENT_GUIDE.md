# Content guide — authoring a Story Bridge story

Everything a new story needs, in the order you should build it. Read
[`product.md`](product.md) first if you have not — the rules below only make sense
against the reasoning there.

A finished story is one object in `server/src/data/stories.json` plus four SVG panels
under `client/public/stories/<storyId>/`. Nothing else needs to change. No component,
no route, no CSS.

---

## 0. Before you write anything: pick a mapping that survives a reviewer

This is the step people skip, and it is the step that decides whether the story is
worth shipping.

You need a tale whose **mechanism** is structurally identical to the construct — not a
tale that is thematically adjacent to it.

Apply this test. Write the story's rule in one sentence, without using any Python
words. Then write the construct's rule in one sentence, without using any story words.
If the two sentences say the same thing, you have a mapping.

> **The Thirsty Crow.** *The bird keeps doing one thing as long as a condition it
> checks each time is still unmet.*
> **While loops.** *The body repeats as long as a condition, tested before every
> repetition, is still true.*
> Same sentence. Ship it.

> **The Tortoise and the Hare.** *Someone slow and steady beats someone fast and
> careless.*
> **Loops.** *…nothing. There is no mechanism here, only a moral.*
> Not a mapping. This is the failure mode — a tale everybody knows, attached to a
> construct by vibe.

Two more things to check:

- **Does the tale have a turn?** The best mappings have a moment where the mechanism
  becomes visible: the howl, the rabbit at the well, the tortoise opening its mouth.
  That moment is usually what the `map` question is about.
- **Is there a gotcha in the tale?** The failure mode of the construct should have a
  home in the story. Infinite loop = the crow never checking. Bare `except` = agreeing
  to any story you're told. If nothing in the tale corresponds to the way the construct
  breaks, the bridge is only half built.

Unclaimed mappings that have already been vetted are listed at the end of this file.

---

## 0.1 Authoring an alternate telling

A concept may carry **two** tales. The second exists for one reason: a learner who does
not know the first one. It is a fallback, not a sequel, and the library shows it only
from inside its sibling.

The contract, all of it enforceable except the last line:

- **`concept`, `conceptLabel` and `difficulty` must match the primary exactly.** These
  are what group the pair. A typo in `conceptLabel` silently splits the group and ships
  two cards where the design promises one.
- **`order` must be higher than the primary's.** The primary is defined as the lowest
  `order` in the group; nothing else marks it.
- **The transfer question must be set in a different domain from the primary's.** Read
  the primary's third question before you write yours. If both tellings transfer to
  "filling a bucket from a slow tap," a learner who swaps has gained nothing — they get
  a second telling of the tale and a second run at the same question.
- **The tale must be independently well known.** This is the whole point and the one
  thing no script can check. An alternate nobody has heard is not a fallback, it is a
  one more story wearing a fallback's label. Rank candidates by §7's familiarity
  ordering, and prefer Panchatantra.
- **A tale can only be spent once.** If it is listed against another concept in §7,
  either strike that row or pick a different tale. It cannot be both.

Aim the alternate at the half of the construct the primary cannot reach. The Thirsty
Crow's loop terminates; the Titibha's does not, so the pair covers both. If the second
telling teaches exactly what the first one taught, it is a duplicate, not a fallback.

At most two tellings per concept. A third is not wrong, it is un-designed — the "2
tellings" mark and the swap copy both assume a single sibling, and §6's contract check
fails loudly on a third.

---

## 0.2 Authoring a real-world story

The **Real world** tab holds real incidents and real systems. It lives in the same
`stories.json`, and a story joins it by carrying `"collection": "real-world"`. With the field
absent, the story is a folk tale. The whole contract above still applies: exact mapping, four
panels, no Python vocabulary on the story screen, and map → code → transfer. On top of it:

- **Every factual claim needs a `sources` entry**: `[{ "label": "...", "url": "https://..." }]`.
  Check the claim against the source before you write it, then write it in your own words. A
  wrong date in a story that says "this really happened" costs the whole tab its credibility.
- **Hypothetical practical cases are allowed**, but they must say so. Put "Hypothetical" in
  the `source` line, and `sources` may then be an empty array. Never dress an invented case
  up as an incident.
- **Images live under `/real/<storyId>/panel-N.svg`** and come from `tools/make_real_panels.py`.
  Draw objects (screens, tickets, counters), not people's faces. No logos, and no real
  individuals in the art.
- **`order` starts at 101.** Order stays globally unique across both tabs.
- **Existing concepts copy the folk `concept` and `conceptLabel` exactly**, so the
  misconception report can compare the tabs. `difficulty` is chosen for the telling. Pairs
  (two tellings) form only within a collection.
- **The code question asks what would have prevented or reproduced the failure.** The
  transfer question is a practical problem in a different domain, and it must not re-skin
  the incident.

## 1. The object

Add one object to the array in `server/src/data/stories.json`.

```jsonc
{
  "storyId": "kebab-case-unique",        // also the folder name for the art
  "title": "The Thirsty Crow",
  "source": "Panchatantra · public domain · original retelling",
  "concept": "while-loops",              // machine key, kebab-case
  "conceptLabel": "While loops",         // display; keep it short, it sits on a card
  "difficulty": "Beginner",              // Beginner | Explorer | Builder
  "order": 1,                            // sort position in the library
  "blurb": "One line for the library card. Dry. No spoiler, no Python word.",

  "panels": [                            // exactly 4
    {
      "n": 1,                            // 1-based, must match position
      "text": "…",
      "image": "/stories/<storyId>/panel-1.svg",
      "alt": "What is depicted, for screen readers. Not the story text again."
    }
  ],

  "bridge": {
    "hook": "One sentence naming the rule in plain words. No Python vocabulary.",
    "mapping": [                         // 3–4 rows
      {
        "story": "The story element",
        "python": "The Python element",
        "detail": "One clause on why they are the same thing."
      }
    ],
    "code": "runnable python\\nwith \\\\n for newlines",
    "codeNotes": "How to READ that code as the story. Optional but almost always worth it.",
    "gotcha": "Where the construct breaks, tied back to the tale."
  },

  "quiz": [                              // exactly 3: map, then code, then transfer
    {
      "id": "<prefix>-q1",               // unique within the story; keep it unique globally
      "type": "map",
      "question": "…",
      "options": [
        { "text": "…", "correct": true,  "why": "Why this is right." },
        { "text": "…", "correct": false, "why": "Which specific misconception this is." }
      ]
    }
  ]
}
```

### Hard rules

These are enforced by the checks in §6 and by `storyStore.js`. Breaking one produces
either a broken screen or, worse, a leaked answer key.

1. **Exactly four panels**, numbered 1–4, `n` matching position.
2. **Exactly three questions**, in the order `map`, `code`, `transfer`. Never three of
   the same kind. If you find yourself writing three `map` questions, the story is
   under-built — go back to §0.
3. **Exactly one option per question has `"correct": true`.** Grading finds the
   correct answer with `findIndex`, so a second one is silently ignored and a missing
   one makes the question unanswerable. Writing the correct option first is fine: `getStory()`
   shows the options in a fixed shuffled order seeded by the question id
   (`optionOrder()` in `storyStore.js`), and grading still compares stored indexes.
   Until 2026-09-26 nothing shuffled them, so the answer was the top option in all 147
   questions.
4. **Every option needs a `why`**, including the correct one.
5. **Question `id`s globally unique**, not merely unique within the story. At 75
   questions across 25 stories this stopped being a nicety — §6's contract check fails
   on a collision. The `<prefix>-q1` convention gives you this for free as long as the
   prefix is unused; §7 lists the prefixes already taken.
6. **Image paths start `/stories/`** — they are served from `client/public`, so the
   path in JSON has no `client/public` prefix.
7. **Answers stay server-side.** `storyStore.getStory()` strips `correct` and `why`
   before sending anything to the browser. If you add a field to an option, check that
   the strip logic still hides it. Never send an answer key to the client by any route.
8. **Original prose only.** The tales are public domain; modern translations are under
   copyright. Write the retelling yourself. Do not paste from a published translation
   and reword it.
9. **No real people, no branded or IP characters** in text or art.
10. **No markdown in any content string.** `ConceptBridge.jsx` and `Quiz.jsx` render
    `codeNotes`, `gotcha`, `detail`, questions and options as plain text, so a backtick or
    an asterisk appears on screen exactly as you typed it. 345 backtick pairs and 21
    emphasis spans were stripped out of the corpus on 2026-09-22 for this reason. If a
    term needs setting apart, use double quotes — `"and"`, not `` `and` `` — and note that
    a bare word usually *needs* them: "the two are one and apart" is not a sentence.

---

## 2. Writing the panels

Four panels, **150–250 words total** across all four. Roughly 40–60 words each. The
authored stories run 167–204; that is a comfortable target. Two of the three that came
with the original zip sit below the floor — `blue-jackal` at 120 and
`blind-men-elephant` at 132 — and are left alone by decision, not by exemption. Anything
authored from here on holds to 150–250.

**No Python vocabulary on this screen.** Not "loop", not "condition", not "variable",
not "this repeats". Not in the text, not in the alt, not in the panel caption art.
This is the rule most likely to be broken by accident and it matters — see `product.md`
§2 for why.

Panel jobs:

| Panel | Job |
|---|---|
| 1 | Situation and the problem. Who, where, what is wrong. |
| 2 | The constraint. Why the obvious thing does not work. |
| 3 | The mechanism, shown in action. This is the panel the bridge points at. |
| 4 | The turn and the outcome. |

**Voice.** Plain, concrete, a little dry. Never peppy, never exclamatory, no
narrator winking at the reader. Past tense. Short declaratives are fine; so is a long
sentence if it is carrying something. Trust the reader to get the point without being
told the moral — the tales all have morals and the module is not interested in them.

Read the three original stories before writing. Some calibration:

> *"The crow did not count its pebbles. It only checked, each time, whether the water
> had come close enough to drink."*

> *"They argued until nightfall. Every man was certain, and no man was lying."*

> *"It had been a goat the whole time. Only its name had changed, and only in one
> man's head."*

Not this:

> *"Wow! The clever crow had a brilliant idea! 🐦 Can you guess what it did next?"*

**Alt text** describes what is *drawn*, not what is written. It is for someone who
cannot see the panel but is reading the text beside it, so repeating the text is
useless to them.

---

## 3. Writing the bridge

**`hook`** — one sentence, plain words, naming the rule. Still no Python vocabulary;
this is the hinge between the two screens, and it should land as an observation about
the story. *"The crow never decided how many pebbles it would need. It decided on a
rule."*

**`mapping`** — 3 or 4 rows, ordered so they build. Convention that works: element,
action, state, exit.

- `story` — phrased as it appears in the tale, concrete.
- `python` — the construct term, or a short snippet.
- `detail` — one clause on *why* they correspond. Not a restatement of the pair.
  This is where you earn the mapping.

**`code`** — runnable Python. Actually run it before you paste it. Keep it under about
sixteen lines. Use the story's nouns for variables (`water_level`, `holding_stick`,
`caps`) so the code reads as the tale. Inline comments are good; a comment that names
the story moment is better than one that names the syntax.

**`codeNotes`** — how to read the code as the story. This is the second explicit pass
at the analogy and it is cheap to write. Use it.

**`gotcha`** — where the construct breaks, tied to the tale. Prefer the failure mode a
beginner will actually hit over the one that is most interesting. Infinite loops,
`input()` returning a string, `or` where you meant `and`, forgetting the brackets on a
call, bare `except`.

---

## 4. Writing the three questions

### `map` — locate the construct in the story

*"Which moment is the loop condition?"*

Distractors should be other parts of the same story, each wrong for a **different
structural reason**: one is the body, one is setup that runs before the loop, one is
what happens after it exits. That set teaches the shape of the construct even when the
learner guesses.

### `code` — match the rule to the Python

Options are code snippets. Distractors come from real beginner errors, not typos:

- the right idea with the wrong construct (`for` with a known count, where the count
  is not knowable)
- the right condition with a body that never changes it (infinite loop)
- a method that does not exist but sounds like it should (`.add()` on a list,
  `.length`)
- correct code in the wrong order (calls before the `def`)

A distractor that is obviously nonsense is a wasted option.

### `transfer` — a situation the story never mentioned

**This is the question the module exists for.** Do not write a re-skin of the same
tale with different animals; that tests memory of the tale, which is the thing you are
trying to control for.

Change the domain and the surface features. Hold the structure fixed.

- Crow and pot → filling a bucket from a slow tap
- Blue jackal → a form collecting a price as `"49.99"`
- Lion and rabbit → searching a list for the first order over ₹10,000

Aim for near-to-moderate transfer distance: far enough that memorising the tale does
not carry the learner, close enough to be fair for a beginner. Something they might
plausibly build.

### `why` text, for every option

Name the **specific misconception**, not the verdict. Second person, present tense,
same dry register as the panels.

- Bad: *"Incorrect. Try again."*
- Bad: *"This is wrong because it is not a while loop."*
- Good: *"This decides the number of pebbles in advance. The crow never knew the
  number — it only knew when to stop."*
- Good: *"Lists have no `.length` attribute, and `+= "red"` adds three separate items:
  'r', 'e', 'd'."*

For the correct option, say why it is right rather than just confirming it. That text
is the last thing the learner reads about the concept.

---

## 5. Panel art

Panels live at `client/public/stories/<storyId>/panel-{1..4}.svg`.

The generator is `tools/make_panels.py`. To add a story:

1. Add any new figure helpers next to the existing ones (they are grouped together,
   above `caption()`). Each takes `(x, y, s=1.0, …, flip=False)`, returns an SVG
   fragment, and draws from the module palette constants at the top of the file —
   `NIGHT`, `INDIGO`, `INDIGO_SOFT`, `PALM`, `PALM_WARM`, `HALDI`, `SINDOOR`,
   `VERDIGRIS`, `SOOT`. These must stay in step with the CSS variables in
   `client/src/stories/stories.css`.
2. Add a `"<storyId>": [ … ]` entry to `PANELS` with four `svg(...)` calls.
3. Run it:

```bash
python tools/make_panels.py
```

Composition notes learned the hard way:

- The canvas is 800×600. `svg(body, sky=…, ground=…)` fills the top with `sky` and,
  if `ground` is given, a band from y=408 down. Figures at y≈440–500 stand on the
  ground; y≈200–350 is sky or canopy.
- **Check contrast against the ground colour.** A dark green crocodile on a dark green
  ground is invisible, and you will not notice in the code.
- `caption()` sits at y=554. Keep figures above y≈530 or they collide with it.
- The panel must show the **mechanism**, not just the cast. Water level visibly
  different between panels. Caps visibly off the head and in the tree. If the picture
  does not carry the structure, it is decoration and it has failed its only job
  (`product.md` §4.3).

To see what you made without starting the app, render a contact sheet with headless
Chrome:

```bash
# build a page of <img> tags pointing at the SVGs, then
chrome --headless --disable-gpu --hide-scrollbars \
       --screenshot=sheet.png --window-size=1300,1000 sheet.html
```

The SVGs are placeholders by intent. They are drawn to the real palette and
composition rules so the app is presentable, and the paths are stable so rendered
illustration can replace them later without touching content.

---

## 6. Verify before you open the PR

Two checks. Run both. Neither needs the app running.

**Contract check** — per story: panel counts, question types and order, exactly one
correct answer, image paths. Then across the corpus: one `conceptLabel` per `concept`
key, at most two tellings per concept, distinct `order` within a group, equal
`difficulty` across a pair, distinct transfer questions across a pair, and globally
unique `storyId` / `order` / question `id`.

Run this from a POSIX shell (Git Bash on Windows). PowerShell mangles the single-quoted
script body.

```bash
node -e '
const s=require("./server/src/data/stories.json");

// ---- per-story ----
for(const st of s){
  const p=[];
  if(st.panels.length!==4) p.push("panels="+st.panels.length);
  st.panels.forEach((pn,i)=>{
    if(pn.n!==i+1) p.push("panel n mismatch");
    const dir=st.collection==="real-world"?"real":"stories";
    if(pn.image!==`/${dir}/${st.storyId}/panel-${i+1}.svg`) p.push("bad image path");
    if(!pn.alt) p.push("missing alt");
  });
  if(st.quiz.map(q=>q.type).join(",")!=="map,code,transfer") p.push("wrong question types/order");
  for(const q of st.quiz){
    if(q.options.filter(o=>o.correct===true).length!==1) p.push(q.id+": not exactly one correct");
    if(q.options.some(o=>!o.why)) p.push(q.id+": option missing why");
  }
  if(st.collection!==undefined && st.collection!=="real-world") p.push("unknown collection "+st.collection);
  if(st.collection==="real-world"){
    const src=st.sources;
    const okSrc=Array.isArray(src) && src.every(x=>x.label && /^https?:\/\//.test(x.url||""));
    if(!okSrc) p.push("sources missing or malformed");
    else if(!src.length && !/hypothetical/i.test(st.source)) p.push("factual story with no sources");
  }
  console.log(st.storyId.padEnd(26), p.length?("!! "+p.join(" | ")):"ok");
}

// ---- corpus-wide: the pair invariants ----
const problems=[];
const byConcept={};
// Pairs form within a collection only: the two tabs share concept keys on purpose.
for(const st of s){
  const key=(st.collection||"folk")+"/"+st.concept;
  if(!byConcept[key]) byConcept[key]=[];
  byConcept[key].push(st);
}
for(const key of Object.keys(byConcept)){
  const g=byConcept[key];
  const labels=[...new Set(g.map(x=>x.conceptLabel))];
  if(labels.length!==1) problems.push(key+": "+labels.length+" conceptLabels ("+labels.join(" / ")+")");
  if(g.length>2) problems.push(key+": "+g.length+" tellings, at most 2 are designed for");
  if(new Set(g.map(x=>x.order)).size!==g.length) problems.push(key+": duplicate order within the group");
  const diffs=[...new Set(g.map(x=>x.difficulty))];
  if(diffs.length!==1) problems.push(key+": difficulty differs ("+diffs.join(" / ")+")");
  if(g.length===2){
    const t=g.map(x=>(x.quiz.find(q=>q.type==="transfer")||{}).question||"");
    if(t[0].trim()===t[1].trim()) problems.push(key+": both tellings share a transfer question");
  }
}
const dupes=a=>[...new Set(a.filter((v,i)=>a.indexOf(v)!==i))];
const checks=[["storyId",s.map(x=>x.storyId)],["order",s.map(x=>x.order)],
              ["question id",s.flatMap(x=>x.quiz.map(q=>q.id))]];
for(const [name,list] of checks){
  const d=dupes(list);
  if(d.length) problems.push("duplicate "+name+": "+d.join(", "));
}
console.log("");
console.log(problems.length ? "!! "+problems.join("\n!! ")
  : "corpus ok ("+s.length+" stories, "+Object.keys(byConcept).length+" collection/concept groups)");
'
```

The corpus block only asserts that a pair's transfer questions *differ as text*. Whether
they land in genuinely different **domains** is a human read — it is a checklist line
below, and §0.1 explains why it matters.

**Grading and answer-stripping check** — submits the authored answer key through the
real `storyStore` path and confirms 3/3, then confirms the reader payload carries no
answers:

```bash
cd server && node -e '
const store=require("./src/data/storyStore"), raw=require("./src/data/stories.json");
(async()=>{ for(const st of raw){
  const reader=await store.getStory(st.storyId);
  const leaked=/"correct"\s*:|"why"\s*:/.test(JSON.stringify(reader));
  const answers={}; for(const q of st.quiz) answers[q.id]=q.options.findIndex(o=>o.correct);
  const r=await store.gradeAttempt(st.storyId,{learnerName:"check",answers});
  console.log(st.storyId.padEnd(26), leaked?"ANSWER LEAK":"stripped", r.score+"/"+r.total,
              "transferred:"+r.transferred);
}

// swappedFrom round-trips onto the persisted attempt, and is ABSENT when unused —
// "was this a swap?" is a key test, so a null would quietly break it.
const a=await store.gradeAttempt(raw[0].storyId,{learnerName:"check",answers:{},swappedFrom:"probe-source"});
const b=await store.gradeAttempt(raw[0].storyId,{learnerName:"check",answers:{}});
console.log("swappedFrom persists:", a.swappedFrom==="probe-source");
console.log("swappedFrom absent when unused:", !("swappedFrom" in b));

// The library moved to concept counts, but storiesTotal still has readers.
const p=await store.summariseProgress();
console.log("legacy stories* fields kept:",
  ["storiesTotal","storiesAttempted","storiesMastered"].every(k=>Number.isInteger(p[k])));
console.log("concepts* fields present:",
  ["conceptsTotal","conceptsAttempted","conceptsMastered"].every(k=>Number.isInteger(p[k])));
})();'
```

This writes test attempts into `server/src/data/storyProgress.json`. Delete that file
afterwards, or don't commit it.

With the app running, the same path over HTTP:

```bash
curl localhost:5000/api/stories
curl localhost:5000/api/stories/<storyId>          # must contain no answers
curl -X POST localhost:5000/api/stories/<storyId>/attempt \
     -H 'Content-Type: application/json' \
     -d '{"learnerName":"check","answers":{"<id>-q1":0,"<id>-q2":0,"<id>-q3":0}}'
```

### Checklist

- [ ] Mapping passes the two-sentence test in §0
- [ ] 4 panels, 150–250 words total, **no Python vocabulary anywhere on them**
- [ ] Alt text describes the drawing, not the prose
- [ ] Bridge has 3–4 mapping rows, each `detail` saying *why*
- [ ] `code` actually runs
- [ ] `gotcha` names a real beginner failure and ties to the tale
- [ ] 3 questions: `map`, `code`, `transfer`, in that order
- [ ] Transfer question is a genuinely new domain, not a re-skin
- [ ] If this is an alternate telling: `concept`, `conceptLabel` and `difficulty` match
      the primary **exactly**, and `order` is higher
- [ ] If this is an alternate telling: its transfer question is set in a **different
      domain** from the primary's — a script can only prove the text differs, so read
      both and judge
- [ ] Every option has `why`; wrong ones name the misconception
- [ ] Exactly one `correct: true` per question
- [ ] Four panels generated and eyeballed; mechanism visible; contrast checked
- [ ] Both verification scripts pass
- [ ] `storyProgress.json` not committed
- [ ] Prose is your own

---

## 7. Unclaimed mappings

Vetted for structural exactness. Take one.

| Concept | Story | Corpus | The link to preserve |
|---|---|---|---|
| Traversal and backtracking | Theseus and Ariadne's thread | Greek | The thread *is* the path stack; you unwind it to get back |
| Interface vs. implementation | Belling the Cat | Aesop | The spec is agreed and correct; nobody can execute it |
| Truncating data to a schema | Procrustes' bed | Greek | Everything forced to one fixed size, in both directions |
| Debugging / where you search | Nasruddin's keys under the streetlight | Nasruddin | Searching where it is convenient rather than where the answer is |
| Stale reference after mutation | Carving the boat to find the sword (刻舟求剑) | Chengyu | He marks the boat, not the river — the reference outlives what it pointed at |
| Sets | (open) | — | Needs a tale where duplicates collapsing is the *mechanism*, not decoration. Three candidates failed §0: Akbar/Birbal's well of milk (everyone made the *identical* choice — that is not deduplication), Nasruddin counting donkeys (that is off-by-one, now spent on order 16), Belling the Cat (assembly and proposal, no set mechanism) |
| Recursion | ~~(open)~~ **claimed** — The Hydra, order 18 | Greek | Told as the *solution*: cut, cauterise, face a hydra one head smaller. Not "cut one, two grow" — that is growth, and recursion needs descent |

The **Milkmaid and her Pail** was listed here under *chained unhandled assumptions*. That
row is struck: she is the file-handling alternate as of order 25, and a tale can only be
spent once.

**Corpora worth mining**, roughly by familiarity to an Indian learner — which is the
constraint that matters (`product.md` §4.1), not literary merit: Jataka ≈ Hitopadesha ≈
Panchatantra > Vikram and Betaal > Tenali Rama / Akbar-Birbal > Mulla Nasruddin >
Aesop > Greek myth >> Grimm, Norse, Andersen. The last group is not held by the
audience, so those tales degrade to "a nicely illustrated short story" — the documented
fallback, not the design.

Two traps:

- **Vikram and Betaal** is tempting — very high familiarity, and its frame really is
  `while carrying: if he speaks: break`. But "speaking costs you what you are carrying"
  is the Talkative Tortoise's mechanism exactly. Running both makes the two mappings
  feel interchangeable, which is worse than shipping neither.
- **The Tortoise and the Hare** is the worked example of a *failing* mapping in §0.
  Don't let it back in from the Aesop side.

Already authored — do not redo: Thirsty Crow, Blue Jackal, Blind Men and the Elephant,
Brahmin and the Three Thieves, Monkey and the Cap Seller, Talkative Tortoise, Lion and
the Rabbit, Four Friends, Crows and the Serpent, Frog in the Well, Fox and the Crow,
Mice and the Elephants, Monkey and the Crocodile, Monkey and the Wedge, Brahmin's Dream.

**Spent in the 2026-08 round — do not re-map these:** Nasruddin Counts the Donkeys
(off-by-one), The Word of Harishchandra (immutability), The Hydra (recursion), The Ant
and the Grasshopper (precomputation), The Titibha Bird and the Sea (while-loops, alt),
The Donkey in the Tiger Skin (data-types, alt), The Cat as Judge (validation, alt), The
Jackal and the War Drum (error-handling, alt), The Four Scholars and the Lion
(functions, alt), The Milkmaid and her Pail (file-handling, alt).

**Two candidates offered and declined**, recorded so they are not re-proposed as new:
*exponential growth* (grains on the chessboard / Ambalappuzha Paal Payasam) — very high
familiarity, but numeric intuition more than a construct, and "accumulating in a loop"
overlaps the Thirsty Crow; and *return vs. print* (a messenger who announces the answer
in the street rather than bringing it back) — a real beginner killer, but no
public-domain tale has been identified for it.

**Quiz prefixes in use.** Pick an unused one; §1 rule 5 now requires globally unique
question ids, across both collections.

```
tc bj be btt mcs tt lr ff cs fw fc me mcr mw bd   folk, orders 1–15
nd wh hy ag ts dts cj jd fs mp                   folk, orders 16–25
zf tp iw yk vx up at pc                          real world, orders 101–108
gn sr lp gl hb fn                                real world, orders 109–114
a5 ac al ds sg pl                                real world, orders 115–120
gt lh dr oc                                      real world, orders 121–124
```

**Real-world concepts already told** (orders 101–124), so a new one in that collection would
be a second telling and needs §0.1's pair rules: while-loops, for-loops, lists, dates-times,
floats-rounding, error-handling, sets, dictionaries, data-types, file-handling, imports,
nested-loops, validation, sorting, functions, immutability, precomputation, recursion,
strings, conditionals, variables, scope, mutating-while-iterating, off-by-one. That is every
folk concept plus five of the tab's own, so the coverage goal is met. Anything added from here
is either a new concept or a deliberate second telling.

**Rejected for the real tab, recorded so it is not re-proposed.** Reinhart and Rogoff's
"Growth in a Time of Debt" (2010), whose spreadsheet averaged a range that missed five of
twenty countries — a superb incident, offered as off-by-one and dropped because it is
off-by-*five*. §0's two sentences do not match: "the average covered only the rows that
happened to be selected" is not "a range that stops one item short of its last item." If it
is picked up later it belongs to slicing or to lists. Also declined: the millennium starting
in 2001 rather than 2000, a true off-by-one, but it shares its calendar setting with `y2k`
at order 104.

**Off-by-one was the awkward gap, and is now closed** by `ssh-channel` (order 124): OpenSSH's
channel guard refused numbers *above* the count and let the count itself through, and the
2002 fix was `>` to `>=`. It passed §0 where two earlier candidates did not, because it is
off by exactly one. The rule stands for any future telling: an inclusive bound read as
exclusive, a fencepost, a range that stops one short. "The wrong number of things" is not
this concept.

**Declined for mutating-while-iterating:** no public incident with a primary source was found
for the skipped-item bug. Bug-tracker threads exist but are not incidents. `deleting-rows`
(order 123) is told as documented system behaviour instead: a spreadsheet shifting rows up on
deletion, per Microsoft's own support page.
