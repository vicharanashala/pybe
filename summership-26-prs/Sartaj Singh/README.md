# Story Bridge — folk tales as Python case studies

Twenty-five folk tales, mostly Panchatantra, each mapped to one Python concept.
Nineteen concepts are covered; six of them carry two independent tellings, so a reader
who does not know the first tale still has a way in.

**Start at [`case-studies/index.md`](case-studies/index.md)** — it groups every case study
by concept and links each one.

## The idea

A learner meeting a new construct usually has to do two things at once: understand the
situation the example is set in, and understand the construct. If the situation is a tale
they were told as a child, the first cost is already paid, and all of their attention goes
into the mapping itself.

So each case study retells the tale, lines its parts up against the Python in a table,
shows the same rule as runnable code, and then says **where the analogy breaks** — because
a mapping that is never qualified quietly becomes a misconception of its own.

Three questions close every study: locate the construct inside the story, read it in
Python, then apply it to a situation the story never mentioned. The third is the one that
distinguishes learning the concept from learning the tale. Answer keys are folded into a
`<details>` block so the questions can be attempted first.

## What is in this folder

| Path | What it is |
|---|---|
| `case-studies/index.md` | Concept-by-concept index of all case studies |
| `case-studies/NN-story-id.md` | One case study per tale, numbered as a difficulty ramp |

## Scope of this submission

This contribution is **markdown only** — no application code. The case studies were
generated from an authored corpus (`stories.json`) that, along with the interactive module
that renders it, lives outside this pull request. The pedagogy write-up and the authoring
contract for that corpus are kept with it rather than duplicated here.

All retellings are original prose of public-domain tales. Modern translations of the
Panchatantra and Aesop remain in copyright and none was used.
