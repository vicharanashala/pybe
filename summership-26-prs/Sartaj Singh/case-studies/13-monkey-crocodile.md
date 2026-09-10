# The Monkey and the Crocodile — Error handling

> **Concept:** Error handling · **Difficulty:** Builder · **Source:** Panchatantra · public domain · original retelling

## The story

A monkey lived in a jamun tree on the riverbank and ate the fruit all season. A crocodile took to resting under it, and the monkey began dropping fruit down to him, and then more to carry home, and they became friends the way daily small kindnesses do it.

The crocodile's wife ate that fruit for months and then said a monkey who lived on it must have a very sweet heart, and that she wanted it. The crocodile argued. Then he stopped arguing, went to the tree, and offered his friend a ride across the river.

Midstream, with no bank in reach and nothing to hold, the crocodile told him why they were going. The monkey said nothing for a moment. Then he said it was a pity the crocodile had not mentioned it earlier.

Monkeys, he said, leave their hearts in the tree. Go back and I will fetch it. The crocodile turned around. At the bank the monkey climbed into the branches, sat where he could not be reached, and stayed there.

## The bridge

The dangerous stretch was the part the monkey could not control. He did not avoid it — he crossed it with an answer ready in case it went wrong.

| In the story | In Python | Why |
|---|---|---|
| The river crossing | The try block | The stretch where something outside your control might fail. You mark it; you do not refuse to cross. |
| The confession midstream | The exception being raised | Normal execution stops right there. Nothing further down the try block runs. |
| "My heart is back in the tree" | The except block | The prepared response. It runs instead of the crash, and only for the failure it was written for. |
| Climbing back into the branches | Recovery — the program carries on in a safe state | The point is not that nothing went wrong. It is that the program is still running and still correct. |

### The same rule, in Python

```python
class Betrayal(Exception):
    pass

def cross_river(passenger):
    print(passenger, "gets on")
    raise Betrayal("the crocodile explains himself")

try:
    cross_river("monkey")
    print("we reach the far bank")     # never runs
except Betrayal as problem:
    print("plan B:", problem)          # my heart is in the tree
finally:
    print("the monkey gets off his back")

print("back in the tree, still alive")
```

Everything under `try:` is the crossing. The `raise` is the confession. `except Betrayal` is the sentence about the heart — prepared in advance, for that one specific problem. `finally` runs whichever way the crossing went, which is where the things that must happen regardless belong: closing a file, hanging up the call, getting off the crocodile.

**Where it breaks:** A bare `except:` catches everything — your own typos included, and the interrupt you press to stop the program. The monkey did not agree to whatever story he was told; he had an answer for one specific betrayal. Catch the exception you expect, by name, and keep the `try` block short, or you will never know which line actually failed.

## Check yourself

**1. Find it in the story.** Which part of the story is the `except` block?

- A) The monkey's answer about leaving his heart in the tree
- B) The crocodile telling him midstream
- C) The ride across the river
- D) The wife asking for the heart

**2. Read the Python.** Which version survives a missing file *and* tells you what went wrong?

- A)

  ```python
  try:
      f = open("data.txt")
  except FileNotFoundError as e:
      print("no file:", e)
  ```

- B)

  ```python
  try:
      f = open("data.txt")
  except:
      pass
  ```

- C)

  ```python
  if open("data.txt"):
      ...
  else:
      print("no file")
  ```

- D)

  ```python
  try:
      f = open("data.txt")
  except FileNotFoundError:
      raise
  ```

**3. Somewhere new.** A different situation: your app calls a payment API over the network. It usually works. Occasionally the network times out. Where does the try block go?

- A) Around the API call itself, catching the timeout, with a retry or a clear message for the user
- B) Around the whole function, catching everything, so nothing can ever crash
- C) Nowhere — check the network connection first with an `if`
- D) Around the call, catching `Exception`, then carrying on as though the payment succeeded

<details><summary>Answer key</summary>

1. **A** — Right. It is the prepared response that runs instead of the disaster, and it was thought of before it was needed.
2. **A** — Yes. One specific exception, caught by name, with the detail kept and reported.
3. **A** — Yes. Wrap the part that can fail for reasons outside your program, and handle the specific failure you expect.

</details>
