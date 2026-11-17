# Idea Summary

**Name:** Patan Jamsheer
**Email:** jamsheerkhan118@gmail.com

## The Idea

A story-based, level-wise interactive lesson teaching **OOP Inheritance** in Python for pyBe.

Instead of presenting inheritance as a syntax rule, the feature opens by showing *why* it exists
(duplicated code across similar classes), then walks the learner through a single story — a
family of birds — where each bird demonstrates one distinct inheritance concept: getting
everything for free (Eagle), adding new behavior (Sparrow), replacing behavior (Penguin), and
extending behavior with `super()` (Owl).

Each concept is its own level: a short intro connecting it to real-world code, a hands-on
code simulator with live visual feedback, and a quick recap before moving to the next. Two
rounds of quizzes — one testing understanding of the pattern, one testing the code mapping —
check comprehension along the way, with specific feedback on wrong answers rather than a generic
"try again."

Built as a MERN feature (React/Vite frontend, Express + MongoDB backend) so it slots into pyBe's
existing lesson format and can track learner progress the same way other lessons do.
