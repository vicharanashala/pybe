# Product Document: The Royal Scribe's Secret

## 1. Problem

Python string indexing and slicing are usually taught as a syntax reference: `s[start:stop:step]`, memorize what each part means. Learners can often reproduce the syntax without ever forming an intuition for *why* a string behaves like an ordered, positional sequence, or why a slice's stop index is excluded. This leads to common, persistent bugs (off-by-one errors, forgetting that indexing starts at 0, confusion about negative indices).

## 2. Solution

The Royal Scribe's Secret reframes indexing and slicing as a problem the learner solves before it has a name. The learner plays a royal scribe who must physically point at, select, and reason about sections of an ancient inscription. Only after the learner has correctly identified a character or a range "by hand" is the matching Python expression revealed. The syntax is presented as the natural, precise way to describe something the learner has already figured out.

## 3. Target learner

Beginner-to-intermediate Python learners on the PyBe platform who already understand that a program can store a single value (variables) and are ready to understand that a string is a sequence with positions — typically learners who have just finished, or are close to finishing, an introductory strings/variables scenario.

## 4. Learning objectives

By the end of the module, the learner should be able to:

- Explain that a string is an ordered sequence of characters, each with a fixed position.
- Read a single character from a string using a positive index.
- Extract a range of characters using a slice, and explain why the stop index is excluded.
- Read characters from the end of a string using negative indices, without counting from the start.
- Reverse a string using a slice with a negative step.
- Choose an appropriate simple string method (`upper()`, `lower()`, `replace()`) to clean up text.
- Independently decide whether a given problem calls for indexing or slicing, without being told which to use.

## 5. User journey

1. **The Inscription** — notice that a string is an ordered sequence, with no syntax yet.
2. **Every Character Has a Place** — discover indexing by finding a character at a stated position.
3. **The Hidden Word** — discover slicing by selecting a range, and learn the exclusive stop index.
4. **The Scribe's Shortcut** — discover negative indexing as a shortcut to the end of a string.
5. **The Reversed Inscription** — discover the reverse-slice idiom, `[::-1]`.
6. **Repair the Royal Message** — apply `upper()` / `replace()` to a concrete, story-motivated cleanup problem.
7. **Codebreaker Training** — six varied, low-stakes practice rounds with immediate, explanatory feedback.
8. **The Final Cipher** — an unscaffolded assessment where the learner chooses the right operation for five different sub-tasks on a new string format.

## 6. Expected learning outcome

A learner who completes the module should be able to look at a new string-processing problem (e.g. "get the file extension," "check the last four digits of a card number," "reverse a word") and correctly reach for indexing or slicing on their own, because they have already invented and practiced the underlying reasoning — reading a position, describing a range, and counting from the end — multiple times, in increasingly unscaffolded contexts.
