# Context: The Royal Scribe's Secret

## Educational context

This module follows PyBe's established story-first philosophy, also seen in other `summership-26-prs/` contributions (e.g. the Akbar & Birbal dictionary module, the Rajgad Fort decorators module): a real-world (or fictional) problem creates friction, the learner reasons about it without programming vocabulary, and Python syntax is introduced only once as a precise label for an idea the learner has already built. This module applies that same progression to strings, indexing, and slicing.

## Story context

Suryagarh is an original, fictional Indian-inspired kingdom — it makes no claim to historical authenticity. The learner plays Ira, a newly appointed Royal Scribe, working through a set of ancient inscriptions carved as continuous strings without spaces (matching how the underlying Python strings are actually represented, with no delimiters to lean on).

Each stage's problem was chosen so that the *only* reasonable way to solve it is the computational idea the stage is meant to teach:

- Stage 1 gives the learner nothing to solve yet — only something to notice: characters sit in an unchanging order.
- Stage 2's question ("what is at position 4?") only makes sense once positions have been noticed. It cannot be answered by memorizing the word "MEETATTHEGOLDENTEMPLE" — it requires counting to a specific spot.
- Stage 3's hidden word ("GOLDEN") cannot be retrieved with a single position — it requires a *range*, motivating slicing, and the natural act of tapping a start and an end tile mirrors `start:stop` syntax before the syntax is shown.
- Stage 4's instruction ("without counting from the beginning") is deliberately impossible to solve efficiently with positive indexing alone, motivating negative indexing as a genuine shortcut rather than an arbitrary alternative notation.
- Stage 5's backward-carved warning cannot be read at all without some notion of "walking in the opposite direction," which is exactly what a negative step expresses.
- Stage 6's uneven, miscarved inscription is a concrete instance of "text needs to be cleaned before use," which is what `upper()`/`replace()` are for — it is deliberately kept to two methods so the stage does not become a string-methods tutorial.
- Stage 7 varies the *messages* used in each round (never reusing MEETATTHEGOLDENTEMPLE or RETURNBEFORESUNSET), so a learner cannot pattern-match on previously seen answers.
- Stage 8's cipher format `SURYA-1842-AR27` mixes several sub-problems (a prefix, a middle segment, a suffix, and a segment that must be reversed) so the learner must choose the appropriate tool per sub-task rather than following a single previously-modeled pattern.

## Why the story maps naturally to indexing/slicing

Indexing and slicing are, at their core, about *position* and *range*. A carved inscription is a naturally positional medium: every mark occupies one fixed, physical spot on the stone, in a fixed order, with no gaps and no repeats — which is exactly the mental model a Python string requires. Framing the inscription as continuous (no spaces) reinforces that positions are counted character-by-character, not word-by-word, which is the detail learners most often get wrong when they first meet slicing.

## Non-claims

This module does not claim any historical accuracy for Suryagarh, its characters, or its inscriptions. It is original fiction created to motivate the Python concepts above, in keeping with PyBe's use of engaging narrative framing rather than textbook examples.
