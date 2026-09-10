# The Hydra — Recursion and base cases

> **Concept:** Recursion and base cases · **Difficulty:** Builder · **Source:** Greek myth · public domain · original retelling

## The story

The thing in the marsh at Lerna had nine heads, and it had killed everyone who had come before. Heracles waded in with a sword and took the nearest head off at the neck. That part was not difficult.

Two grew back from the stump while he watched. He took another, and there were two more. Cutting was work he could do all day, and at the end of the day there would be more of the creature than there had been at the start.

His nephew Iolaus came down to the water with a torch. Heracles cut, and Iolaus put the fire to the open neck before it could answer. Nothing came back. What stood in the marsh was the same creature it had been, with one head fewer.

So they did that. Cut, then burn, then look at what was left — which was always the same thing, one head smaller than the last time they had looked. When there were none, there was nothing left to do, and they stopped.

## The bridge

Each head was dealt with the same way, and each time it left them the same creature with one head fewer.

| In the story | In Python | Why |
|---|---|---|
| The creature standing in front of them | The value the function is called with | What they face at each step is never a new problem. It is the same problem, arriving at a smaller size. |
| Cut, then burn the stump | The work done in the body, before the next call | One head is handled here and now. Everything else is handed on unchanged in kind, which is what makes the next step identical in shape. |
| One head fewer, every time | clear(heads - 1) | Descent is the whole requirement. If what is handed on is not smaller, the chain has no reason to ever end. |
| No heads left, so nothing to do | if heads == 0: return 0 | The one branch that does not call again. It is where the chain stops, and without it the calls keep going until Python gives up. |

### The same rule, in Python

```python
def cut_and_burn(n):
    print("head", n, "dealt with")

def clear(heads):
    if heads == 0:               # none left: nothing to do
        return 0
    cut_and_burn(heads)          # one head, handled here
    return 1 + clear(heads - 1)  # the same creature, one head smaller

print(clear(9))                  # 9
```

clear is called on a creature, and the first thing it asks is whether there is anything left — that is the pair of them looking at the water at the end. If there is, one head is handled here and the rest is handed straight back to clear with a smaller number. Every call does the same work on a smaller creature, and the whole chain unwinds once the count reaches zero.

**Where it breaks:** The torch is the base case. Remove the if heads == 0 line and nothing ever refuses to call again; remove the - 1 and every call hands on a creature exactly as big as the one it received, which is Heracles cutting all day. Both give RecursionError: maximum recursion depth exceeded — the same failure reached from two directions. A base case also has to be reachable: clear(heads - 2) starting from nine steps straight over zero and never stops.

## Check yourself

**1. Find it in the story.** Which moment in the story is the base case — the point where the work stops handing itself on?

- A) Looking at the marsh and finding no heads left
- B) Putting the torch to the cut neck
- C) Two heads growing back from the first stump
- D) Heracles wading into the marsh at the start

**2. Read the Python.** Which version clears a nine-headed creature and actually stops?

- A)

  ```python
  def clear(heads):
      if heads == 0:
          return 0
      return 1 + clear(heads - 1)
  ```

- B)

  ```python
  def clear(heads):
      return 1 + clear(heads - 1)
  ```

- C)

  ```python
  def clear(heads):
      if heads == 0:
          return 0
      return 1 + clear(heads)
  ```

- D)

  ```python
  def clear(heads):
      if heads == 0:
          return 0
      return 1 + clear(heads - 2)
  ```

**3. Somewhere new.** You are counting every file in a folder, including the files inside its sub-folders, and their sub-folders, all the way down. Which part of that job is the base case?

- A) Reaching a folder that has no sub-folders inside it
- B) Counting the files sitting directly in the current folder
- C) Opening a sub-folder and counting inside it
- D) Reaching a folder containing a shortcut that points back to itself

<details><summary>Answer key</summary>

1. **A** — It is the one look that ends with nothing being handed on. Every other step passes a smaller creature to the next round; this one has nothing to pass, so the chain stops here.
2. **A** — There is a branch that does not call again, and every call that does hands on a strictly smaller number. Nine reaches zero in nine steps, and the chain unwinds.
3. **A** — There is nothing left to descend into, so that call returns instead of handing the job on. It is the empty marsh — the one place the chain has no smaller version of itself to pass along.

</details>
