# The Monkey and the Cap Seller — Lists

> **Concept:** Lists · **Difficulty:** Beginner · **Source:** Indian folk tale · public domain · original retelling

## The story

A cap seller carried his stock to market in a bundle on his head — red caps, stacked one on top of the next. Halfway there the road ran under a banyan tree, and the afternoon was hot enough that he lay down in the shade and slept.

The tree was full of monkeys. They came down while he slept, took the caps one at a time from the top of the stack, and carried them up into the branches. When he woke, the bundle was empty and every monkey above him was wearing red.

He shouted. They shouted back. He waved his arms and the branches waved theirs. Whatever he did, the tree did after him. He sat down in the dirt and thought about the walk home with nothing.

Then he pulled off his own cap and flung it on the ground. Every monkey pulled off its cap and flung it down. He gathered them up — all of them back in the bundle, though not in the order they had left it.

## The bridge

The bundle is one thing holding many things in a definite order, and every move in the story has a name in Python.

| In the story | In Python | Why |
|---|---|---|
| The bundle of caps | The list | One object holding many, keeping them in order, growing and shrinking as needed. |
| A single red cap | An element | Elements need not be unique. Six identical caps are six separate items. |
| A monkey lifting the top cap | caps.pop() | Removes an item and hands it back. Both halves matter, and the bundle is one shorter after. |
| Every cap thrown back down | caps.append(cap) | Adds to the end. Which is exactly why the stack comes back in a different order. |

### The same rule, in Python

```python
caps = ["red", "red", "red", "red", "red", "red"]
print(len(caps))            # 6

# the monkeys empty the bundle, one cap at a time
taken = []
while caps:
    taken.append(caps.pop())

print(caps)                 # []
print(len(taken))           # 6

# he throws his own down; every monkey copies
caps.append("the seller's own")
for cap in taken:
    caps.append(cap)

print(len(caps))            # 7
print(caps[0])              # the seller's own   <- his hit the ground first
```

`caps.pop()` takes from the end, `caps.append()` puts on the end, and `caps[0]` asks for whatever sits at position zero. Positions start at 0, so the first cap on the ground is `caps[0]`, not `caps[1]`.

**Where it breaks:** A list remembers order, and removing from the middle moves everything after it. `caps.remove("red")` deletes only the first match and shifts every later item down one position. Code that walks a list while deleting from it will skip items, because the positions moved underneath it while it was reading.

## Check yourself

**1. Find it in the story.** A monkey lifts one cap off the top of the stack. Which list operation is that?

- A) `.pop()` — it removes an item and hands it back
- B) `.append()` — it adds an item
- C) `len()` — it counts the items
- D) Indexing with `caps[0]`

**2. Read the Python.** The seller wants to print how many caps he has left, then add one more to the bundle. Which lines do that?

- A)

  ```python
  print(len(caps))
  caps.append("red")
  ```

- B)

  ```python
  print(caps.count())
  caps.add("red")
  ```

- C)

  ```python
  print(len(caps))
  caps.pop("red")
  ```

- D)

  ```python
  print(caps.length)
  caps += "red"
  ```

**3. Somewhere new.** A different situation: you are holding the queue of people waiting at a clinic. People join at the back and are called from the front. Which pair of operations models that?

- A) `queue.append(name)` to join, `queue.pop(0)` to call the next
- B) `queue.append(name)` to join, `queue.pop()` to call the next
- C) `queue.add(name)` to join, `queue.first()` to call the next
- D) A dictionary keyed by each person's name

<details><summary>Answer key</summary>

1. **A** — Right. The cap leaves the bundle and ends up in the monkey's hands. Both halves matter: removed, and returned.
2. **A** — Yes. `len()` counts what is there; `append()` puts one on the end.
3. **A** — Yes. Append adds at the end, `pop(0)` takes from the front. Order is the whole point of a queue, and a list keeps order.

</details>
