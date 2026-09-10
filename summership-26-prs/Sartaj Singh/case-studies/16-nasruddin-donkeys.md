# Nasruddin Counts the Donkeys — Off-by-one errors

> **Concept:** Off-by-one errors · **Difficulty:** Explorer · **Source:** Mulla Nasruddin · public domain · original retelling

## The story

Nasruddin bought ten donkeys at the spring fair and set out for home. He climbed onto the back of one and let the rest walk ahead of him down the road. The morning was long and the road was dusty, and somewhere past the second village it occurred to him that he ought to check.

He counted the animals ahead of him. Nine. He counted them again, slower. Nine. He counted a third time, touching each one with his eyes and moving his lips as he went, and there were nine, and he had paid for ten.

He got down to look along the road for the missing one. Standing in the dust with the reins still in his hand, he counted what was in front of him. Ten. Every animal he had paid for was there, and not one of them had wandered off.

He climbed back up, satisfied, and counted once more out of habit. Nine. He got down. Ten. He got up. Nine. Nasruddin walked the rest of the way to his own gate, leading all ten, and did not try it again.

## The bridge

Nasruddin never miscounted. He counted correctly, from a place that left one animal out.

| In the story | In Python | Why |
|---|---|---|
| The ten donkeys he paid for | donkeys — the whole collection | The group itself is never in doubt. What changes between his two answers is how much of it the counting reaches. |
| Counting from the saddle | range(1, len(donkeys)) | A count that begins one place in. The animal underneath him is the item the walk starts just after. |
| Nine | A total that is one short | Nothing was lost and nothing wandered off. The boundary of the count moved, and the answer moved with it. |
| Getting down to count | range(len(donkeys)) | Standing where nothing is excluded. The fix is where you start, not how carefully you count. |

### The same rule, in Python

```python
donkeys = ["grey", "brown", "black", "roan", "dun",
           "white", "piebald", "bay", "cream", "dapple"]

counted = []
for i in range(1, len(donkeys)):      # counted from the saddle
    counted.append(donkeys[i])
print(len(counted))                   # 9

counted = []
for i in range(len(donkeys)):         # counted from the ground
    counted.append(donkeys[i])
print(len(counted))                   # 10
```

The two walks differ by one character. range(1, len(donkeys)) starts at the second animal, because the first one is the one he is sitting on — it is in the group, but the count never arrives at it. range(len(donkeys)) starts at the first. Nothing was lost either time; only the starting place changed.

**Where it breaks:** range(1, len(items)) is the version that skips the first item; range(len(items) - 1) is the version that skips the last. Both are off by exactly one and both look reasonable on the page. The same mistake shows up as items[len(items)], which raises IndexError: the last position is len(items) - 1, because positions start at zero and the animal underneath you was never in the count.

## Check yourself

**1. Find it in the story.** Nasruddin's count is wrong in the same way an off-by-one error is wrong. Which part of the story is the item that falls outside the boundary of the count?

- A) The donkey he is sitting on
- B) The nine donkeys walking ahead of him
- C) Buying ten donkeys at the spring fair
- D) Walking the rest of the way to his gate

**2. Read the Python.** Ten donkeys are in donkeys. Which snippet counts all ten?

- A)

  ```python
  counted = 0
  for i in range(len(donkeys)):
      counted += 1
  ```

- B)

  ```python
  counted = 0
  for i in range(1, len(donkeys)):
      counted += 1
  ```

- C)

  ```python
  counted = 0
  for i in range(len(donkeys) - 1):
      counted += 1
  ```

- D)

  ```python
  counted = donkeys.length
  ```

**3. Somewhere new.** A school prints name badges. There are thirty names in students, and the code is:

```python
for i in range(1, len(students)):
    print_badge(students[i])
```

Thirty pupils arrive and one has no badge. Which one?

- A) The first pupil in students
- B) The last pupil in students
- C) A pupil somewhere in the middle
- D) None of them — all thirty get a badge

<details><summary>Answer key</summary>

1. **A** — It is in the group he paid for and it is never in the number he says. That is exactly what an off-by-one error drops — an item that belongs to the collection but sits outside the stretch the count walks.
2. **A** — range(len(donkeys)) produces 0 through 9 — ten positions, every animal reached. This is Nasruddin standing on the ground.
3. **A** — range(1, 30) starts at position 1, and the first name sits at position 0. It is the saddle again — the name is in the collection, and the walk begins just past it.

</details>
