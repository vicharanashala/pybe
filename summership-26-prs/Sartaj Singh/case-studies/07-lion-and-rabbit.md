# The Lion and the Rabbit — For loops and break

> **Concept:** For loops and break · **Difficulty:** Explorer · **Source:** Panchatantra · public domain · original retelling

## The story

A lion hunted the forest without counting. He killed what he wanted and left most of it, and the animals began to find their families thinner every season. So they went to him with an arrangement.

Every day, they said, one animal will come to you. You will not have to hunt and we will not have to lose ten for one. The lion agreed. From then on the forest sent one animal each day, in turn, and each day the lion ate what arrived.

In time the turn reached a rabbit. It walked slowly, and arrived late, and the lion was already angry. The rabbit said it was sorry — it had been held up by another lion on the far side of the forest, one who claimed the whole place was his.

Show me, said the lion. The rabbit led him to an old stone well and stood back. The lion looked over the edge, saw the other lion looking up at him, and jumped. Nobody walked to the lion the next day, or any day after.

## The bridge

The forest handed over its animals one at a time, in order — exactly what a for loop does to a list. The rabbit is the line that ends it early.

| In the story | In Python | Why |
|---|---|---|
| The animals waiting their turn | The iterable | A sequence known in advance. The loop walks it from the beginning. |
| Whichever animal walks up that day | The loop variable | One item at a time, bound to a name for the length of a single repetition. |
| One day, one animal, in order | for animal in animals: | The loop stops by running out of items — unless something inside it interrupts. |
| The rabbit's trick at the well | break | Leaves the loop immediately. Everything still queued is never reached. |

### The same rule, in Python

```python
animals = ["deer", "boar", "monkey", "rabbit", "elephant", "peacock"]

for animal in animals:
    print("the", animal, "walks to the lion")
    if animal == "rabbit":
        print("the lion follows it to the well")
        break                 # the arrangement ends here

print("the forest is quiet")

# the elephant and the peacock were never reached.
```

`for animal in animals` reads as *take them one at a time, in this order*. `break` is the only thing in the story that was not part of the arrangement. Python also offers `for ... else`, where the `else` runs only if the loop finished without a break — here that would mean the queue emptied and every animal was eaten.

**Where it breaks:** `break` leaves one loop: the innermost one it sits inside. Put this inside another loop and the outer one carries on as if nothing happened. And do not reach for `continue` by mistake — that skips the rest of *this* repetition and moves to the next animal, which would leave the lion waiting for tomorrow rather than gone.

## Check yourself

**1. Find it in the story.** What is the loop variable in the arrangement the animals made?

- A) The animal whose turn it is that day
- B) The list of all the animals in the forest
- C) The lion
- D) The number of days that pass

**2. Read the Python.** Which loop matches the arrangement, including the way it ended?

- A)

  ```python
  for animal in animals:
      eaten(animal)
      if animal == "rabbit":
          break
  ```

- B)

  ```python
  while animals:
      eaten(animals.pop())
  ```

- C)

  ```python
  for animal in animals:
      if animal == "rabbit":
          continue
      eaten(animal)
  ```

- D)

  ```python
  for i in range(len(animals)):
      eaten(animals[i])
      break
  ```

**3. Somewhere new.** A different situation: you are searching a list of orders for the first one over ₹10,000. Once you have it, the rest do not matter. What belongs in the loop?

- A) `break`, the moment the first match is found
- B) `continue`, to move past the orders that are too small
- C) Nothing — let the loop finish and keep the last match
- D) `return` — a loop cannot be stopped any other way

<details><summary>Answer key</summary>

1. **A** — Right. Each repetition binds one item out of the sequence to a name, and the body works with that one.
2. **A** — Yes. One item at a time out of a known sequence, stopped early by a condition inside the body.
3. **A** — Yes. The work is done and every remaining item is wasted effort — the same shape as the rabbit. The sequence had more in it, and none of it mattered.

</details>
