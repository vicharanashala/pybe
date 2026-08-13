# The Monkey and the Wedge — Changing a list while looping

> **Concept:** Changing a list while looping · **Difficulty:** Builder · **Source:** Panchatantra · public domain · original retelling

## The story

Carpenters were building a temple at the edge of the town. At midday they left a log half split, with an iron wedge driven into the cut to hold the two halves apart, and went into the shade to eat.

A troop of monkeys came down into the yard. Most of them went through the tools and the wood shavings, looking for something to eat. One of them found the log, and the gap running down it, and sat in the gap with a leg on either side.

It could see the wedge in the cut below it and had no idea what the wedge was for. It took hold with both hands and worked the thing back and forth until it began to give.

The wedge came free. The log closed. The monkey had been holding the one thing keeping open the space it was sitting in, and it had pulled that thing out itself, from the inside.

## The bridge

The monkey was inside the structure and it changed the structure. What broke was not the log — it was the position the monkey was occupying.

| In the story | In Python | Why |
|---|---|---|
| The half-split log | The list you are looping over | A structure with positions in it. Its shape is exactly what the loop depends on. |
| The monkey sitting in the gap | The loop's current position | A `for` holds an index into the list. That index is only meaningful while the list stays the same length. |
| Pulling the wedge out | Removing items during the loop | `for x in items: items.remove(x)`. The list shrinks while something is still counting through it. |
| The log closing on it | Skipped items | Everything after the removal shifts down one, the index moves up one, and the loop steps straight over an element it never saw. |

### The same rule, in Python

```python
animals = ["monkey", "monkey", "crow"]

for animal in animals:            # the log
    if animal == "monkey":
        animals.remove(animal)    # the wedge

print(animals)    # ['monkey', 'crow']   <- one monkey survived

# it did not crash. it quietly gave the wrong answer.

# loop over a copy, change the original:
animals = ["monkey", "monkey", "crow"]
for animal in list(animals):
    if animal == "monkey":
        animals.remove(animal)
print(animals)    # ['crow']

# or build a new list instead of editing in place:
animals = ["monkey", "monkey", "crow"]
animals = [a for a in animals if a != "monkey"]
print(animals)    # ['crow']
```

The loop is counting positions while the list is losing them. Trace the first block: the loop is at position 0 and removes what it finds there, so the list becomes `["monkey", "crow"]` and everything slides down one. The loop then moves to position 1 — which now holds the crow. The second monkey slid down into position 0, which the loop has already been past, so it is never looked at. One pass, one survivor, no error.

**Where it breaks:** It does not raise an error, and that is the dangerous part. The loop finishes, the program carries on, and the list is quietly wrong — a monkey left in a list you asked to have no monkeys in it. Removing while iterating fails silently; only running off the end fails loudly. Loop over `list(items)`, or build a new list with a comprehension.

## Check yourself

**1. Find it in the story.** What does the wedge correspond to?

- A) The list keeping its shape while the loop runs through it
- B) The loop's condition
- C) The item being removed
- D) The carpenters

**2. Read the Python.** `animals = ["monkey", "monkey", "crow"]`. What does this leave behind?

- A)

  ```python
  for animal in animals:
      if animal == "monkey":
          animals.remove(animal)
  
  # leaves ['monkey', 'crow']
  ```

- B)

  ```python
  for animal in animals:
      if animal == "monkey":
          animals.remove(animal)
  
  # leaves ['crow']
  ```

- C)

  ```python
  for animal in animals:
      if animal == "monkey":
          animals.remove(animal)
  
  # raises IndexError
  ```

- D)

  ```python
  for animal in animals:
      if animal == "monkey":
          animals.remove(animal)
  
  # leaves ['monkey', 'monkey', 'crow']
  ```

**3. Somewhere new.** A different situation: you loop over a dictionary of sessions and delete the expired ones inside the loop. Python raises `RuntimeError: dictionary changed size during iteration`. What is the fix?

- A) Loop over a copy of the keys — `for sid in list(sessions):` — and delete from the original
- B) Catch the RuntimeError and carry on
- C) Use a `while` loop instead, since only `for` has this restriction
- D) Nothing — dictionaries are unordered, so removing from them mid-loop is safe

<details><summary>Answer key</summary>

1. **A** — Right. The loop depends on the length and the positions staying put. The wedge is that assumption, and the monkey removes it.
2. **A** — Right. Removing index 0 slides everything down; the loop moves to index 1 and steps straight over the second monkey. No error, wrong answer.
3. **A** — Yes. The copy is a stable thing to walk; the original is then free to change. Same fix as the log: do not remove what you are standing on.

</details>
