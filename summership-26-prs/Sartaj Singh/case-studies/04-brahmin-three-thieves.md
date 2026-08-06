# The Brahmin and the Three Thieves — Variables and reassignment

> **Concept:** Variables and reassignment · **Difficulty:** Beginner · **Source:** Panchatantra · public domain · original retelling

## The story

A Brahmin bought a goat at the market and set out for home with it across his shoulders. Three thieves saw him on the road. The goat was worth more than anything else they would find that day, and the Brahmin was bigger than any one of them.

So they spread out along the road. The first stepped out of the trees and asked why a learned man was carrying a dog. The Brahmin told him it was a goat, and walked on.

A mile later the second thief asked why he was carrying a dead calf. The Brahmin checked the animal, said nothing, and kept walking, slower now. Near the village the third asked him plainly why he had a dog on his back.

The Brahmin set the animal down, washed himself, and hurried home ashamed. The thieves came out of the trees and took it. It had been a goat the whole time. Only its name had changed, and only in one man's head.

## The bridge

Nothing was ever done to the animal. What changed was the word bound to it — and each new word threw the last one away.

| In the story | In Python | Why |
|---|---|---|
| The animal standing there on the road | The value in memory | It has its own nature. Calling it something else does not reach it. |
| The word the Brahmin uses for it | The variable name | A label pointed at a value. The label is not the value and never was. |
| Each thief insisting it is a dog | Reassignment — animal = "dog" | The name is unhooked from the old value and hooked onto a new one. Instant, silent, complete. |
| He can no longer say what he bought | The old value is unreachable through that name | Assignment has no undo. Overwrite a name and what it held is gone, unless some other name still holds it. |

### The same rule, in Python

```python
animal = "goat"          # what he bought
print(animal)            # goat

animal = "dog"           # the first thief
animal = "dead calf"     # the second
animal = "dog"           # the third

print(animal)            # dog   <- the only answer left

# nothing was ever done to the animal itself.
# to keep the first value, point a second name at it before overwriting:
bought = "goat"
animal = "dog"
print(bought, animal)    # goat dog
```

Read `=` as *point this name at that value*, not as *these two are equal*. Each line in the middle block is one thief pointing the name somewhere new.

**Where it breaks:** Reassignment is silent and there is no undo. `total = total + 1` works because the right-hand side is worked out first, using the old value, and only then is the name repointed. Write `total + 1` on a line by itself and Python computes it and throws it away — the name still holds the old number, and nothing warns you.

## Check yourself

**1. Find it in the story.** In the story, what plays the role of the variable name?

- A) The word people use for the animal — "goat", then "dog"
- B) The animal on the Brahmin's shoulders
- C) The Brahmin himself
- D) The road to the village

**2. Read the Python.** What does this print?

- A)

  ```python
  animal = "goat"
  animal = "dog"
  print(animal)
  
  # prints: dog
  ```

- B)

  ```python
  animal = "goat"
  animal = "dog"
  print(animal)
  
  # prints: goat
  ```

- C)

  ```python
  animal = "goat"
  animal = "dog"
  print(animal)
  
  # prints: goat dog
  ```

- D)

  ```python
  animal = "goat"
  animal = "dog"
  print(animal)
  
  # raises NameError: animal was defined twice
  ```

**3. Somewhere new.** A different situation: you are tracking a running score. You write `score = 0`, then on a later line `score + 10`, then `print(score)`. What prints?

- A) 0 — `score + 10` computes a value and never binds it to anything
- B) 10 — Python updates score with the addition
- C) 10 — `+` modifies the variable in place
- D) An error, because the line has no effect

<details><summary>Answer key</summary>

1. **A** — Right. It is the label being moved around. The creature underneath it is a separate thing entirely.
2. **A** — Right. The second line repoints the name. Only the most recent binding survives.
3. **A** — Yes. Addition produces a result; only `=` attaches it to a name. Without `score = score + 10` the result is worked out and dropped.

</details>
