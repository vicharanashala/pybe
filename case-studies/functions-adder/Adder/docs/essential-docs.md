# Essential Docs — Story-Based Discovery Learning: Adder

**Author:** Ravada Lakshitha
**Email:** ravadalakshitha6@gmail.com
**GitHub:** https://github.com/RAVADA-LAKSHITHA

## Summary

This contribution integrates one story-based lesson — **Adder**,
teaching the concept of a function — into PyBe's existing client,
alongside the existing AI Mentor scenario UI. It's designed around the
philosophy "Think First. Discover Next. Code Last.": the lesson opens
with a relatable story, leads the learner to discover the underlying
concept through their own reasoning, and only then introduces the
Python syntax that expresses it.

## Scope of this contribution

**This PR adds exactly one lesson, integrated into the official PyBe
repository:** Adder (functions), reachable from the existing client via
a sidebar button. Full technical detail — architecture, every file
added, every version of the implementation, and the testing performed
at each step — is in
[`docs/lessons/README.md`](./lessons/README.md) and
the documents it links to.

**Not part of this contribution:** two other lessons — Thirsty Crow
(loops) and Crane and Fish (conditional statements) — exist as
standalone prototype deployments, illustrating the same underlying
philosophy applied to different Python concepts:

| Concept | Lesson | Deployment | In this PR? |
|---|---|---|---|
| Loops | Thirsty Crow | [pybe-discovery.vercel.app](https://pybe-discovery.vercel.app/) | No — external prototype only |
| Conditional statements | Crane and Fish | [pybe-discovery.vercel.app](https://pybe-discovery.vercel.app/) | No — external prototype only |
| Functions | Adder | [adder-mu.vercel.app/lesson/adder](https://adder-mu.vercel.app/lesson/adder) | **Yes — integrated in this PR** |

They're referenced here only as context for the philosophy described
below and in `product-document.md` — evidence the underlying idea
extends to more than one kind of concept — not as something this PR
adds to the codebase. Whether to bring either of them into PyBe is a
separate, future decision, to be made once this smaller, single-lesson
contribution has been reviewed on its own.

## What was intentionally kept out of this contribution

Documented in full in `docs/lessons/formal-specification.md`
("Constraints"), summarized here: no TypeScript, no Tailwind, no
`react-router-dom` — the existing client's plain JavaScript/CSS, no
router, no server changes. None were needed to ship one lesson well.

## Further Reading

- **[`product-document.md`](./product-document.md)** — the educational
  philosophy, the design goals it implies, and the case studies
  (including the two external prototypes above) that motivated it.
- **[`design-principles.md`](./design-principles.md)** — the design
  principles this lesson follows, and how they map onto what was
  actually implemented.
- **[`docs/lessons/README.md`](./lessons/README.md)**
  — the technical entry point: architecture, every file, every version
  of the implementation in order, and the error-handling catalogue.
