# Product Document: The Savage Mountain (Python Sets)

## 1. Problem

Python sets are typically taught through formal mathematical set theory or syntax definitions (`s.union(t)`, `s.intersection(t)`). Learners memorize operator tables (`|`, `&`, `-`, `^`) without developing an intuition for *when* a set is the natural data structure to choose over a list. Consequently, beginners often write cumbersome loops to filter duplicate items, manually check for common elements, or perform linear membership scans.

## 2. Solution

*The Savage Mountain* reframes sets around tangible physical dilemmas encountered on a Himalayan high-altitude expedition. The learner physically taps items into containers: duplicates naturally bounce back, manifests merge into single unique lists, and consumed goods are subtracted. Only after the learner solves each challenge "by hand" is the Python code revealed as the concise notation for the solution they just devised.

## 3. Target Learner

Beginner Python students on the PyBe platform who understand basic variables and lists, and are ready to learn about unique collections, set operations, and membership checking.

## 4. Learning Objectives

By the end of this module, the learner should be able to:
- Explain that a set is an unordered collection containing only unique elements.
- Use `set(...)` or `{...}` to eliminate duplicates from raw data.
- Combine two collections without duplicating shared items using the union operator `|`.
- Identify elements shared across two collections using the intersection operator `&`.
- Subtract elements of one collection from another using the difference operator `-`.
- Test whether an element exists in a set using the membership keyword `in`.
- Articulate the distinction between a set (which tracks *what* is present) and a dictionary (which tracks *how many* of each).

## 5. User Journey

1. **Darjeeling Depot:** Notice that repeated packing slips waste space; duplicate gear collapses into single instances (`set(...)`).
2. **The Fork:** Merge two convoy manifests into one master procurement list (`a | b`).
3. **Skardu Checkpost:** Filter cargo against official military permits to allow only common authorized items (`a & b`).
4. **Baltoro Glacier:** Remove consumed rations from the remaining sled inventory (`a - b`).
5. **The Bottleneck:** Conduct a high-stakes safety audit testing whether critical gear is in the kit (`"oxygen" in kit`).
6. **K2 Summit:** Reflect at the summit on what sets do (presence) versus what they cannot do (multiplicity), prompting the transition to dictionaries.

## 6. Expected Learning Outcome

Learners should instinctively reach for a Python `set` whenever a problem requires uniqueness, mutual overlap, exclusion, or fast membership testing, having formed strong mental models through concrete expedition metaphors.
