# The Mice and the Elephants — Nested loops

> **Concept:** Nested loops · **Difficulty:** Explorer · **Source:** Panchatantra · public domain · original retelling

## The story

A colony of mice lived in the ruins of an old town, in burrows under what had once been streets. There were thousands of them, and they had been there for generations, and nothing had ever come through big enough to matter.

Then a herd of elephants began crossing the ruins twice a day on the way to a lake. There were hundreds of elephants. Each one, on each crossing, came down on burrow after burrow after burrow.

The mice counted their losses and found the number did not make sense at first. It was not the hundreds of elephants. It was not the thousands of mice. It was every elephant meeting every burrow in its path, one after another.

So the mouse king went to the elephant king and asked for a different road to the lake. The elephants had no reason to refuse, and took it. The cost went to nothing, and it went to nothing all at once.

## The bridge

The damage was not the number of elephants, and it was not the number of mice. It was the two numbers multiplied.

| In the story | In Python | Why |
|---|---|---|
| The herd, crossed one elephant at a time | The outer loop | Runs once per elephant. Everything inside it happens all over again for the next one. |
| The burrows in one elephant's path | The inner loop | Runs from the start, in full, for every single pass of the outer loop. |
| One elephant, one burrow | The innermost body | The unit of work. Count these and you know what the pair of loops actually costs. |
| Hundreds times thousands | The cost is the product | Not hundreds plus thousands. Loops of n and m do n × m units of work, and products grow fast. |

### The same rule, in Python

```python
elephants = ["tusker", "matriarch", "calf"]
burrows = ["north", "east", "south", "well", "gate"]

crushed = 0
for elephant in elephants:            # outer: once per elephant
    for burrow in burrows:            # inner: all of them, every time
        crushed = crushed + 1
        print(elephant, "passes over the", burrow, "burrow")

print(crushed)        # 15, which is 3 * 5 — not 3 + 5
```

The inner loop starts again from the beginning every time the outer one advances. Read the indentation as the herd: everything indented twice happens once per elephant per burrow. The final number is the one to watch, because it is a product.

**Where it breaks:** Nested loops are how a program that is fine on your test data dies on real data. Three elephants and five burrows is fifteen steps; three hundred and five thousand is one and a half million, with nothing in the code changed. If the inner loop is only searching for something, a `set` or a `dict` can usually replace it with a single lookup — and note that the mice's answer was to stop the crossing happening at all, not to make each crossing faster.

## Check yourself

**1. Find it in the story.** Which part of the story is the inner loop?

- A) The burrows one elephant passes over during a single crossing
- B) The herd of elephants
- C) The mouse king going to the elephant king
- D) The lake the elephants were walking to

**2. Read the Python.** Which version prints every elephant-and-burrow pair?

- A)

  ```python
  for elephant in elephants:
      for burrow in burrows:
          print(elephant, burrow)
  ```

- B)

  ```python
  for elephant in elephants:
      print(elephant, burrows)
  ```

- C)

  ```python
  for elephant in elephants:
      for burrow in burrows:
          print(elephant, burrow)
          break
  ```

- D)

  ```python
  for elephant in elephants:
  for burrow in burrows:
      print(elephant, burrow)
  ```

**3. Somewhere new.** A different situation: you have 2,000 customers and 5,000 orders, and for each customer you loop through every order to find theirs. It works on ten test rows and times out in production. Why?

- A) The work is 2,000 × 5,000 — ten million comparisons, not seven thousand
- B) Production hardware is slower than your machine
- C) 5,000 orders is simply too much data for Python
- D) The two loops should be combined into one loop with an `and`

<details><summary>Answer key</summary>

1. **A** — Right. It runs all the way through, and then it runs all the way through again for the next elephant.
2. **A** — Yes. The inner loop runs in full for each pass of the outer one, which gives every combination.
3. **A** — Yes. Nested loops multiply. Ten test rows hid it because 10 × 10 is nothing; the real numbers are the product.

</details>
