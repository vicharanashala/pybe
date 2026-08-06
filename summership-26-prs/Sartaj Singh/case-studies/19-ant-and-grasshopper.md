# The Ant and the Grasshopper — Doing the work once

> **Concept:** Doing the work once · **Difficulty:** Builder · **Source:** Aesop · public domain · original retelling

## The story

All summer the ant went out and came back, out and came back, carrying what she found to a hole under a flat stone. It took her the whole season. The grasshopper watched her do it, then went to look for his own supper, which took him about an hour.

He was not idle. Every day he went out, and every day he found enough, and an hour was a fair price for a day of food. He paid it on the Monday and paid it again on the Tuesday, and in June that was a perfectly good arrangement.

In December the ant went down to the hole under the stone, took what she needed, and came back up. It cost her nothing at all; she had spent the whole of it in July. The grasshopper went out as he always did. He was gone all day and came back with very little.

Her price had never changed either. She had simply paid all of it at once, in a month when she had the time, and every day after that was free. He had paid a small price every day of his life, and one day the price was more than he had.

## The bridge

The ant did not do less work than the grasshopper. She did all of it at once, in a season when it was cheap.

| In the story | In Python | Why |
|---|---|---|
| Carrying seed to the hole all summer | Building the lookup once, above the loop | One long stretch of work done when there is room for it, producing something that will be read many times afterwards. |
| The hole under the stone | The stored result — a dict, a list, a cached value | It exists so the expensive part never has to happen again. Its entire value is that it was filled earlier. |
| Going down and taking what she needs | index[item] | Cheap only because the work behind it is already done. The cost was moved, not removed. |
| Going out to search every single day | Rebuilding the lookup inside the loop | The same answer found again from scratch on every pass. It is affordable right up until the day it is not. |

### The same rule, in Python

```python
def build_index(rows):
    print("indexing...")          # the whole season's work
    return {name: price for name, price in rows}

rows = [("rice", 60), ("dal", 110), ("oil", 180)]
orders = [("rice", 3), ("dal", 2), ("oil", 1), ("rice", 5)]

total = 0
for item, qty in orders:
    index = build_index(rows)     # the grasshopper: pays on every pass
    total += index[item] * qty

index = build_index(rows)         # the ant: pays once
total = 0
for item, qty in orders:
    total += index[item] * qty

print(total)                      # 880
```

build_index is the summer. The first loop calls it on every order, which is the grasshopper going out each day — it works, it gives exactly the right answer, and it does the whole job four times over. The second loop calls it once before the loop starts and only reads it inside. Same rows, same total. Count the "indexing..." lines and you are counting how many times the season was paid for.

**Where it breaks:** The dangerous version is the one that still returns the right answer. Nothing raises, nothing looks broken — it is just slower every time the data grows, so it passes review and fails in production. Watch for a build, load, open, sorted or database call sitting in a loop body when nothing inside it depends on the loop variable. If the result would be identical on every pass, it belongs above the loop.

## Check yourself

**1. Find it in the story.** Which part of the story is the work done once so that all the later work is free?

- A) The ant carrying seed to the hole all summer
- B) The ant going down to the hole in December
- C) The grasshopper's hour of searching each day
- D) The hole under the flat stone

**2. Read the Python.** rows never changes while the orders are processed. Which version pays for the index once?

- A)

  ```python
  index = build_index(rows)
  for item, qty in orders:
      total += index[item] * qty
  ```

- B)

  ```python
  for item, qty in orders:
      index = build_index(rows)
      total += index[item] * qty
  ```

- C)

  ```python
  for item, qty in orders:
      total += build_index(rows)[item] * qty
  ```

- D)

  ```python
  for item, qty in orders:
      total += index[item] * qty
  index = build_index(rows)
  ```

**3. Somewhere new.** A page lists 500 comments and shows each commenter's display name. The 500 comments were written by only 40 different people. Which arrangement is the ant's?

- A) Fetch all 40 people once before the loop into a dict keyed by id, then look each name up inside the loop
- B) Fetch the commenter from the database inside the loop, once per comment
- C) Fetch all 40 people from the database inside the loop, once per comment
- D) Re-fetch all 500 comments inside the loop each time a name is needed

<details><summary>Answer key</summary>

1. **A** — It is one long stretch of work, paid in a season when there was room for it, and it is what makes every December trip cost nothing. That is precomputation — the same total work, moved to a moment when it is cheap.
2. **A** — The expensive call sits above the loop, so it happens once no matter how many orders arrive. Inside the loop there is only a lookup, which is the December trip to the stone.
3. **A** — One trip pays for all 500 rows, and everything inside the loop is a lookup. The number of comments can grow without the expensive part growing with it — the hole under the stone, filled once.

</details>
