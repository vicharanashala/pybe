# The Titibha Bird and the Sea — While loops

> **Concept:** While loops · **Difficulty:** Beginner · **Source:** Panchatantra · public domain · original retelling
> _Alternate telling for **While loops** — see also [The Thirsty Crow](01-thirsty-crow.md)._

## The story

The titibha bird laid her eggs above the tideline, where the water had never come. The water came that night and took them. In the morning there was smooth wet sand where the nest had been, and nothing in it.

She stood at the edge and asked the sea to give them back. The sea did what it had been doing before she arrived. So she decided she would take the water out herself, and she started that afternoon.

A beakful carried up the beach and tipped into the sand. Back to the edge, look at the water, another beakful. She was not working to a number. She was looking each time to see whether there was still sea in front of her, and there was.

Behind her the tide came in over everything she had emptied. Other birds heard about it and joined her, and a thousand beaks made no more difference than one. What ended it was the sea giving the eggs back. Nothing she did to the water was ever going to.

## The bridge

She was not working to a number. She was checking, each time, whether there was still sea in front of her — and there always was.

| In the story | In Python | Why |
|---|---|---|
| Still sea in front of her | The condition, tested before every pass | Both are looked at again each time round rather than settled once at the start. This much she has exactly right. |
| One beakful, carried and tipped out | The body of the loop | The work done on each pass. It runs, and it genuinely moves water — this is not where it goes wrong. |
| The tide filling in behind her | The body's effect undone before the next test | She did change the sea. The net change across a pass was zero, so a test that was true stays true. |
| A thousand beaks, no difference | A faster body does not make a loop end | If nothing drives the condition toward false, more speed only reaches nowhere sooner. |

### The same rule, in Python

```python
sea = 1000
beakfuls = 0

while sea > 0:
    sea = sea - 1          # one beakful carried up the beach
    sea = sea + 1          # the tide, filling in behind her
    beakfuls += 1
    if beakfuls == 5:
        break              # only here so this example can finish

print("beakfuls:", beakfuls)   # 5
print("sea:", sea)             # 1000 — exactly where it started
```

The test at the top is the right shape: it looks at the water every time round instead of deciding a number in advance. The body works too — the first line really does remove a beakful. The second line is the tide, and between them the water finishes each pass exactly where it began. Take the break out and this runs until you stop it, and sea still prints 1000.

**Where it breaks:** The crow shows you a while loop that forgets to change the variable at all. This one is harder to see, because the body does change it — the change is simply cancelled, or moves the wrong way, or is too small ever to arrive. The loop reads correctly on the page and never ends. When a while hangs, print the condition's variable at the top of every pass and watch whether it is actually travelling toward false.

## Check yourself

**1. Find it in the story.** Which part of the story is the reason her loop never ends?

- A) The tide filling in behind her every time
- B) Carrying one beakful up the beach
- C) Looking at the water each time she came back
- D) The other birds coming to join her

**2. Read the Python.** sea starts at 1000. Which of these loops actually ends?

- A)

  ```python
  while sea > 0:
      sea = sea - 1
  ```

- B)

  ```python
  while sea > 0:
      sea = sea - 1
      sea = sea + 1
  ```

- C)

  ```python
  while sea > 0:
      beakfuls = beakfuls + 1
  ```

- D)

  ```python
  while sea > 0:
      sea = sea + 1
  ```

**3. Somewhere new.** A script clears out a download folder: while count_files(folder) > 0, delete the oldest file. It runs on a machine where a camera saves a new photo into that same folder about once a second, and deleting one file takes about a second. What happens?

- A) It never finishes, even though the body really does delete a file on every pass
- B) It finishes as soon as the folder is empty, because the condition is rechecked every pass
- C) It raises an error when a new file appears part-way through the loop
- D) It deletes one file and stops, because the condition was only true once

<details><summary>Answer key</summary>

1. **A** — The body ran and it did remove water, and the tide put back exactly as much. The test at the top asks whether there is still sea, and after every pass there still is. A loop ends only when something drives its condition toward false.
2. **A** — Every pass leaves sea strictly smaller than it was, so the test is driven toward false and eventually reaches it. This is the crow, whose water really does rise and stay risen.
3. **A** — One file out, about one file in. The count is tested every pass and never reaches zero, so the loop runs until something stops it from outside — the tide, with a camera instead of a sea.

</details>
