# Story Bridge — product and pedagogy

A module for PyBe. Twenty-five tales, most of them Indian folk tales, each mapped onto
one of nineteen Python constructs and followed by three questions that test whether
the idea moved. A second tab, **Real world**, tells twenty real incidents and systems the
same way (§10).

---

## 1. The problem

Beginner Python material almost always teaches a construct by inventing a situation
to hold it. "You are managing a warehouse inventory." "A bank account has a balance."
"Imagine a to-do list app." The situation is disposable — it exists to give the syntax
something to stand on.

This costs more than it looks like it costs. Before a learner can think about the
`while` loop, they have to build the warehouse: what is in it, who moves the stock,
what counts as done. That construction is real work, and it is work spent on
scaffolding that will be thrown away the moment the exercise ends. Sweller's account
of cognitive load calls this *extraneous* load — effort demanded by the presentation
rather than by the thing being learned (Sweller, 1988). Working memory is small and
undifferentiated. Every unit spent assembling a fictional warehouse is a unit not
spent noticing that the loop condition is checked *before* each repetition.

There is a second cost, harder to see. When the scenario is invented for the lesson,
the learner has no independent purchase on it. They cannot check the code against
their own understanding of the situation, because their understanding of the situation
came from the same paragraph as the code. Story and construct arrive together and are
learned together, which means a learner can end up knowing "the warehouse example"
without knowing `while`.

**Story Bridge removes the construction cost entirely by using situations the learner
already holds.**

---

## 2. What the module is

Twenty-five stories across nineteen concepts. Most are folk tales the target learner — an Indian student, school or
early undergraduate — has almost certainly met before, from a grandparent, a school
reader, an Amar Chitra Katha, a television retelling. The Thirsty Crow. The Blue
Jackal. The Monkey and the Crocodile.

Each story runs through three screens, in fixed order.

### Story

Four illustrated panels. Text and image only. **No Python vocabulary appears on this
screen at all** — not in the prose, not in the captions, not in the alt text.

This is a deliberate and slightly costly decision. It would be easy, and it would feel
more efficient, to write "notice how the crow repeats this — that's a loop!" underneath
panel three. The module does not, because the value of the tale is that it is already
complete in the learner's head. Naming the construct early converts the story from
something they *know* into something they are *being taught with*, and the knowing is
the whole asset.

So the first screen does one job: bring the tale fully back into working memory,
including its causal structure — not just *what happened* but *why the crow stopped
fetching pebbles*. The learner arrives at the second screen with the situation loaded
and no Python yet attached to it.

### Bridge

The signature screen, and the one the module's argument rests on.

Story elements sit on the left. Python elements sit on the right. Drawn connectors
join them, one at a time, in sequence. Below the mapping: the same rule as runnable
Python, notes on how to *read* that code as the story, and a "where this breaks"
gotcha tied back to the tale.

The connectors draw one after another rather than appearing at once. Each is one
correspondence, presented alone, so the learner's attention has somewhere specific to
be. The line is the only loud element in the whole visual system; everything else is
kept quiet so that it reads as the point.

### Questions

Three multiple-choice questions, one of each type described in §5. Every option —
right and wrong — carries an explanation shown after grading. Wrong-answer text names
the specific misconception rather than saying "incorrect."

---

## 3. Why this order

The sequence is not arbitrary and it is not reversible.

**Story before Bridge** because the mapping is only cheap if the source is already
loaded. Show the mapping first and the learner is doing two unfamiliar things at once.

**Bridge before Questions** because of a specific and well-replicated finding about
analogy, discussed in §4.4: people who hold both halves of an analogy frequently fail
to connect them unless the correspondence is made explicit. The Bridge screen exists
precisely because "read the story, now here's a loop" does not work on its own.

**Questions last, and of three different kinds**, because a learner who has just been
shown a mapping can echo it back without owning it. The third question type is designed
to break that echo.

---

## 4. The pedagogy

Four claims, each with a literature behind it. They are separable — the module would
still be worth something if one turned out to be weaker than expected — but together
they are the reason it is shaped this way.

### 4.1 Funds of knowledge — why folk tales specifically

Moll and colleagues introduced *funds of knowledge* to describe the accumulated
knowledge and competence that students already carry from their households and
communities, and argued that instruction which draws on it outperforms instruction
that treats the learner as empty (Moll, Amanti, Neff & González, 1992). The original
work was ethnographic and concerned with working-class Mexican-American households in
Arizona, but the mechanism generalises: knowledge the learner already has is free to
use and expensive to ignore.

Indian folk tales are an unusually clean fund for this purpose. They are:

- **Widely held.** The Panchatantra corpus is transmitted through school readers,
  family telling, comics, and television. Coverage across the target population is
  high in a way that few other shared references manage.
- **Structurally sharp.** These are not mood pieces. Each tale is built around a
  decision, a rule, or a mechanism — which is exactly what makes them mappable onto
  control flow. A tale with no mechanism would have nothing to bridge to.
- **Public domain.** The tales themselves are ancient and unencumbered. (Modern
  translations are *not* — see §7.)
- **Culturally located without being exclusionary.** A learner meeting The Blue Jackal
  for the first time still gets a complete, short, comprehensible story. The module
  degrades to "a nicely illustrated short story" rather than breaking.

### 4.2 Narrative transportation — why a story rather than a scenario

Green and Brock's work on *transportation* describes the state of being absorbed into
a narrative, and links it to durable changes in belief and to better recall of story
content (Green & Brock, 2000). Willingham makes the related and more practical claim
that stories are "psychologically privileged" — better attended to, better remembered,
and easier to reason about than equivalent expository material (Willingham, 2009).

A scenario is not a story. "You are managing a warehouse" has no causal spine, no
tension, and no ending. A tale where a thirsty bird works out how to raise water it
cannot reach has all three, and those are the parts that make it stick. The module
uses narrative because narrative is a better container for a mechanism than a premise
is.

### 4.3 Dual coding — why illustrations

Paivio's dual coding theory holds that verbal and imaginal information are processed
in separate but connected systems, and that material encoded in both is more reliably
retrieved than material encoded in one (Paivio, 1971, 1986; Clark & Paivio, 1991).
Mayer's multimedia principle is the applied form of the same result: people learn
better from words and pictures together than from words alone (Mayer, 2009).

Hence four illustrated panels rather than four paragraphs. The illustration is not
decoration and is not there to make the module look finished — it is a second
retrieval route to the same structure. When the learner later meets an unfamiliar
`while` loop, the intended recall path is *image of a crow at a pot* → *the rule it
was following* → *the loop*.

This also constrains the art. Panels must depict the **mechanism**, not just the mood:
the pot must visibly show a water level, and that level must visibly change between
panel two and panel four. A beautiful drawing of a crow that does not show the water
rising has failed at the only job the picture has.

### 4.4 Analogical transfer — why the Bridge screen must exist

This is the load-bearing one.

Gick and Holyoak gave participants a story about a general capturing a fortress by
splitting his army and converging from several roads, then gave them Duncker's
radiation problem — destroy a tumour with rays that would damage healthy tissue at
full strength. The solutions are structurally identical. Most participants did not
transfer. When prompted that the earlier story might help, a large majority then
solved it (Gick & Holyoak, 1980, 1983).

The finding that matters here is the gap between *having both pieces* and *connecting
them*. Spontaneous transfer between structurally analogous problems is unreliable
because retrieval is driven by surface similarity, not structure. Explicit mapping
closes the gap.

This is the entire argument for the Bridge screen. A module that presented the story
and then presented the Python, trusting the learner to notice, would be reproducing
the condition in which most participants failed. Drawing the correspondence — this
element of the story *is* this element of the code, one line at a time — is the
intervention, not the packaging.

It also sets a hard quality bar on the content. The mapping has to be **structurally
exact**, not thematically pleasant. "The jackal is dyed blue, and a string looks like
a number" works because both are cases of appearance diverging from underlying type,
and the resolution in both — the howl, `type()` — reveals the underlying thing
directly. A mapping that is merely evocative teaches the learner to reason by vibe,
which is worse than teaching nothing.

### 4.5 The cognitive load argument, stated plainly

Every design decision above spends the learner's attention on one thing: the
correspondence between a story structure and a code structure.

- The situation is free, because they already have it (§4.1).
- It stays loaded, because narrative holds attention (§4.2).
- It is encoded twice, verbally and visually (§4.3).
- The correspondence is drawn rather than implied, because implied does not work (§4.4).

The measure of success is not that the learner enjoys the story. It is that the
transfer question — a situation the tale never mentioned — comes out right.

---

## 5. Assessment: the three question types

Every story has exactly three questions, one of each type, in this order. This is a
hard invariant of the content contract, not a stylistic preference.

**1. `map` — locate the construct inside the story.**
*"Which moment is the loop condition?"* Checks that the learner can find the structure
in the source they already understand. Cheapest question, and the one that fails first
if the mapping was sloppy.

**2. `code` — match the rule to the Python that expresses it.**
Options are code snippets. Checks the mapping in the direction that matters for
writing code. Distractors are drawn from real beginner errors — `for` where the count
is unknown, a loop body that never changes the condition, calling a function without
brackets.

**3. `transfer` — a new situation the story never mentioned.**
*"You are filling a bucket from a slow tap..."* This is the only question that
distinguishes learning the concept from learning the tale. Everything else in the
module could be passed by a learner who has memorised the crow; this one cannot.

The transfer question is deliberately the hardest to author, because writing a good
one requires knowing which surface features are incidental and which are structural.
It is also the one most likely to be quietly dropped by a contributor in a hurry,
which is why the invariant is enforced in the content contract and why the API reports
`transferred` as a separate signal from `score`.

Barnett and Ceci's taxonomy of transfer is the useful frame for calibrating these:
transfer varies along dimensions of knowledge domain, physical context, temporal
context, functional context, social context, and modality (Barnett & Ceci, 2002). The
module's transfer questions aim at a change of *domain and functional context* while
holding the structure fixed — a bucket and a tap instead of a crow and a pot. That is a
near-to-moderate transfer distance: far enough that memorising the tale does not carry
you, close enough to be a fair question for a beginner.

**Answers never reach the browser before they are earned.** `storyStore.getStory()`
strips `correct` and `why` from every option; grading happens server-side in
`gradeAttempt()`. This is an assessment-integrity property, and any change to the
option schema has to preserve it.

---

## 6. How this differs from PR #26 and PR #25

The neighbouring submissions in this repo make it worth being precise about what is
and is not novel here.

**PR #26 (merged)** owns the "scenario → concept → code" progression and earned its
merge with a thorough pedagogy document built on a SOLO/Kolb frame. Story Bridge does
not dispute that progression and does not duplicate it. The differences are:

| | PR #26 | Story Bridge |
|---|---|---|
| Source situation | Modern scenarios, authored for the lesson | Folk tales the learner already holds |
| Medium | Text only | Text **and** illustration, four panels per tale |
| Theoretical frame | SOLO taxonomy, Kolb's experiential cycle | Dual coding, transportation, funds of knowledge, analogical transfer |
| Assessment | Code sandbox | Three-type MCQ set with a mandatory far-transfer item |
| Explicit mapping step | Not a distinct phase | The Bridge screen — the module's centre |

The frames are genuinely different rather than relabelled. SOLO describes the
structural complexity of a learner's response; Kolb describes a cycle through
experience and reflection. Neither predicts that a *culturally familiar* source will
outperform an invented one, and neither says anything about whether the analogy needs
to be drawn explicitly. Those are the two claims Story Bridge is actually making, and
they come from Moll and from Gick & Holyoak respectively.

**PR #25** used the phrase "story-based" in its documentation but shipped no story
content — no corpus, no illustrations, no story-specific assessment. The overlap is
therefore in vocabulary rather than in artifact. Story Bridge ships twenty-five authored
tales, one hundred panels, seventy-five questions, and the grading path for them.

**What nobody else in the repo has:** a folk-tale corpus, illustrations, and a
transfer-style assessment instead of a code sandbox. Those three together are the
submission.

---

## 7. The corpus

Twenty-five stories across nineteen concepts, ordered as a difficulty ramp. Six concepts
carry two independent tellings, so a learner who does not know one tale can take the
other; the library shows one card per concept, and the second telling is reachable only
from inside its sibling.

| # | Story | Concept | Level | The structural link |
|---|---|---|---|---|
| 1 | The Thirsty Crow | While loops | Beginner | Repeat while a condition holds; the count is unknown in advance |
| 2 | The Blue Jackal | Data types and casting | Beginner | Appearance vs. underlying type; the howl is `type()` |
| 3 | The Blind Men and the Elephant | Dictionaries | Explorer | Six answers with no labels; the fix is key-value pairs |
| 4 | The Brahmin and the Three Thieves | Variables and reassignment | Beginner | The animal never changes; the name bound to it does |
| 5 | The Monkey and the Cap Seller | Lists | Beginner | An ordered bundle: `len`, `pop`, `append`, index |
| 6 | The Talkative Tortoise | Compound conditions | Beginner | Safe only while gripping **and** silent; one fatal branch |
| 7 | The Lion and the Rabbit | For loops and break | Explorer | One animal per day in order; the rabbit is `break` |
| 8 | The Four Friends | Functions | Explorer | One skill each, called by name; the mouse's second rescue is reuse |
| 9 | The Crows and the Serpent | Imports and built-ins | Explorer | Can't win with your own beak; call in capability you didn't write |
| 10 | The Frog in the Well | Scope: local and global | Explorer | The well's names exist only inside it; it can hear about the sea, the sea can't see in |
| 11 | The Fox and the Crow | Validating input | Explorer | Well formed is not the same as trustworthy; nobody checked the source |
| 12 | The Mice and the Elephants | Nested loops | Explorer | Not elephants plus mice — elephants times mice |
| 13 | The Monkey and the Crocodile | Error handling | Builder | Betrayal midstream, plus a prepared answer: try/except/recover |
| 14 | The Monkey and the Wedge | Changing a list while looping | Builder | It removes the one thing holding open the position it occupies |
| 15 | The Brahmin's Dream | Files and persistence | Builder | Everything in one place that only hangs there; one kick and it is gone |
| 16 | Nasruddin Counts the Donkeys | Off-by-one errors | Explorer | He counts from the saddle; the one he is sitting on is never in the count |
| 17 | The Word of Harishchandra | Tuples and immutability | Explorer | A sentence already spoken cannot be reached into; you may only add another |
| 18 | The Hydra | Recursion and base cases | Builder | Cut, cauterise, face the same creature one head smaller — and stop at none |
| 19 | The Ant and the Grasshopper | Doing the work once | Builder | One pays the whole cost in a season; the other pays a little every day |
| 20 | The Titibha Bird and the Sea | While loops *(second telling)* | Beginner | Same loop as the crow, with the non-terminating case foregrounded — the tide undoes each pass |
| 21 | The Donkey in the Tiger Skin | Data types and casting *(second telling)* | Beginner | The disguise holds until an operation demands what the thing actually is |
| 22 | The Cat as Judge | Validating input *(second telling)* | Explorer | Every fact about the judge came from the judge — a check the source controls |
| 23 | The Jackal and the War Drum | Error handling *(second telling)* | Builder | The noise is inspected rather than fled from; the message was the useful part |
| 24 | The Four Scholars and the Lion | Functions *(second telling)* | Explorer | Each applies his one skill by name; the last call succeeds and should not have been made |
| 25 | The Milkmaid and her Pail | Files and persistence *(second telling)* | Builder | Written is not saved; it was never anywhere but the pail |

Every retelling is original prose. The tales are public domain; modern translations
are not, and no published translation was consulted or paraphrased. Panels run
150–250 words across four screens.

**On corpus choice.** Twenty-one of the twenty-five are Indian — fifteen Panchatantra,
plus cognate folk, parable, epic and Nasruddin material. Three are Aesop (The Fox and
the Crow, The Ant and the Grasshopper, The Milkmaid and her Pail), and The Thirsty Crow
is counted Indian but is both — it is Aesop's "The Crow and the Pitcher" as much as it
is Indian. That overlap is not accidental. The Panchatantra reached Europe by descent —
Sanskrit → Middle Persian → Arabic as *Kalila wa Dimna* → Latin → the vernaculars, with
La Fontaine crediting "Pilpay" outright — so the European fable tradition is largely
downstream of this one rather than parallel to it. The practical consequence for §4.1
is that Aesop is a *safe* extension for an Indian audience (widely taught in Indian
schools, and often the same tale) in a way that Grimm or Norse material is not.

**The Hydra is the one exception, and it is not covered by that argument.** Greek myth
sits below Aesop in the familiarity ordering and has no descent relationship to the
Panchatantra, so the transmission case does nothing for it. It is admitted on separate
and weaker grounds: no folk tale was found that carries descent to a base case, and
recursion was judged worth shipping on a medium-familiarity tale rather than not at all.
This is the corpus's weakest familiarity claim, it is the reason the story is written to
stand on its own without prior knowledge of Heracles, and `CONTENT_GUIDE.md` §7 records
it as the first candidate for an alternate telling of its own.

What predicts a usable tale is genre, not culture. Fables, trickster tales and
riddle-tales carry mechanisms; most fairy tales carry morals and map to nothing. That
is the filter to apply to any new source, and it is the test written up in
`CONTENT_GUIDE.md` §0.

Art constraint, and the reason it is a constraint: no real people and no branded or
IP characters. Folk tales are safe ground for generated or hand-drawn illustration in
a way that recognisable franchise characters are not.

---

## 8. Scope boundaries

Things this module deliberately does not do.

- **No code sandbox.** The assessment is transfer, not execution. A sandbox would test
  whether the learner can get syntax past an interpreter, which is a different and
  already-covered skill.
- **No spaced repetition, no streaks, no XP.** The module is a small number of deep
  encounters, not a drill. Retention machinery would be a separate piece of work with
  its own justification.
- **No authoring UI.** Stories are authored as JSON against a documented contract
  (see `CONTENT_GUIDE.md`). A CMS is not the bottleneck; writing exact mappings is.
- **No changes to the base app.** Four additions, and no more without asking: the
  mounted route in `server/src/index.js`; the mode switch in `client/src/main.jsx` with
  appended, prefixed CSS; `server/nodemon.json`, which stops the API restarting on
  every quiz submission — `gradeAttempt()` writes `storyProgress.json` into the watched
  `server/src/data/`, and the restart was killing POSTs mid-flight; and the Story Bridge
  section appended to `README.md`. Every module class is namespaced `.sb-`.

---

## 9. Limitations, honestly

- **Familiarity is now partly measured, and the measurement is a lower bound.** The
  central claim is that the tale is free because the learner already has it. Six of the
  nineteen concepts now carry a second, independent telling, and taking the "don't know
  this one?" link records `swappedFrom` on the attempt — a learner who swaps has told us
  they did not hold the first tale, without being asked and without an extra tap. Two
  limits are worth stating plainly. It is a **lower bound**: a learner who does not know
  the tale can read on without swapping, and that silence is indistinguishable from
  familiarity. And it is **partial**: the signal exists only for the six paired concepts,
  not the other thirteen. A single "did you already know this story?" prompt is still the
  thing that would close the gap, and would let the transfer results be split on it.
- **Three questions is a short instrument.** Enough to signal, not enough to grade on.
  A learner can pass a transfer item by elimination.
- **Cultural reach is uneven.** The corpus is strong for South Asian learners and
  weaker elsewhere. The module's structure is portable to other traditions — the
  argument is about familiarity, not about the Panchatantra specifically — but the
  current content is not.
- **The illustrations are generated SVG placeholders.** They are drawn to the real
  palette and composition rules and they do depict the mechanism, but they are flat
  vector figures rather than finished artwork. Replacing them with consistent rendered
  illustration is the highest-value remaining improvement, and the panel paths are
  stable so it can be done without touching content.
- **No efficacy data.** Nothing here has been tested on learners. The design is
  argued from literature, not validated. The next honest step is small: run ten
  learners through one story each, record whether the transfer question comes out
  right, and compare against the same concept taught with a modern scenario. Part of
  the instrument for that exists: every wrong option names a specific misconception, and
  first-try answers are rolled up per option at `GET /api/stories/misconceptions` (or
  `node tools/misconceptions.js`). Retries are excluded, because by then the answer has
  been shown. The data counts answers, not people: the module has no learner
  identity, and every attempt is recorded as "Guest learner".

---

## 10. The Real World tab

Added on 2026-09-14, when the mentor asked for real-world examples. The folk tales stay.
The new stories sit behind a **Folk tales | Real world** switch at the top of the library.

**What counts as real world here.** Real incidents and real systems, not invented everyday
scenarios. That choice is deliberate. The base app's Scenario workshop already ships thirty
everyday scenarios, PR #26 is a real-world case-study engine, and a merged sibling submission
tells daily Indian life (a UPI mistake for tuples, a shopkeeper's blackboard for caching). A
true event keeps this module's argument intact. The learner may already know it, and the
mapping has to be exact, because the event cannot be bent to fit the construct. Nobody else
in the repository takes this angle.

**Same screens, one change of emphasis.** Story → Bridge → Questions is unchanged, and so are
the three question types. The code question asks what would have prevented or reproduced
the failure. The transfer question is a practical problem in a different domain. Each story
is one of three kinds:

- **An incident:** the Zune freeze of 31 December 2008, Y2K, the Vancouver Stock Exchange
  index of 1982–83, gene symbols rewritten as dates by spreadsheet software, the eleven
  lines withdrawn from npm in March 2016, the two billion comparisons behind a six-minute
  load screen, and the OpenSSL heartbeat defect of April 2014.
- **A system learners use:** three UPI PIN tries, the railway waitlist, the RBI's reversal
  rule for a pending UPI payment, PIN codes, write caching on a removable drive, and the
  order a folder puts file names in.
- **A practical case labelled as hypothetical:** an attendance register that counted taps
  instead of students.

**Facts carry sources.** Every factual claim is checked against a source before it is written,
the sources are listed under the panels, and the prose is original. A wrong date in a story
that says "this really happened" would cost the whole tab its credibility.

**What it adds.** Five concepts that no folk tale carried: sets, floats and rounding, dates
and times, sorting and keys, and strings and characters. Sets had been the open gap in
`CONTENT_GUIDE.md` §7. And because the shared
concepts reuse the folk `concept` keys, the misconception report can compare how the same
construct lands when told as a folk tale and when told as a real incident
(`node tools/misconceptions.js --collection real-world`). That comparison is the most direct
test available of the familiarity argument in §4.

**Where it stands.** Twenty-four stories covering twenty-four concepts: all nineteen folk
concepts, and five of the tab's own. That meets the plan of 23–25 stories covering every folk
concept plus four to six new ones; JSON, the sixth candidate, was never needed. For
school learners, familiarity with a real incident is a weaker claim than familiarity with a
folk tale: Y2K and a 1982 stock index are known by name, if at all, not in detail. The stories
are therefore written to stand on their own.

---

## 11. References

Barnett, S. M., & Ceci, S. J. (2002). When and where do we apply what we learn? A
taxonomy for far transfer. *Psychological Bulletin, 128*(4), 612–637.

Clark, J. M., & Paivio, A. (1991). Dual coding theory and education. *Educational
Psychology Review, 3*(3), 149–210.

Gick, M. L., & Holyoak, K. J. (1980). Analogical problem solving. *Cognitive
Psychology, 12*(3), 306–355.

Gick, M. L., & Holyoak, K. J. (1983). Schema induction and analogical transfer.
*Cognitive Psychology, 15*(1), 1–38.

Green, M. C., & Brock, T. C. (2000). The role of transportation in the persuasiveness
of public narratives. *Journal of Personality and Social Psychology, 79*(5), 701–721.

Mayer, R. E. (2009). *Multimedia learning* (2nd ed.). Cambridge University Press.

Moll, L. C., Amanti, C., Neff, D., & González, N. (1992). Funds of knowledge for
teaching: Using a qualitative approach to connect homes and classrooms. *Theory Into
Practice, 31*(2), 132–141.

Paivio, A. (1971). *Imagery and verbal processes*. Holt, Rinehart & Winston.

Paivio, A. (1986). *Mental representations: A dual coding approach*. Oxford University
Press.

Sweller, J. (1988). Cognitive load during problem solving: Effects on learning.
*Cognitive Science, 12*(2), 257–285.

Willingham, D. T. (2009). *Why don't students like school?* Jossey-Bass.
