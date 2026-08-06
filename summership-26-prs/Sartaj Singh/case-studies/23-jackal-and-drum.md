# The Jackal and the War Drum — Error handling

> **Concept:** Error handling · **Difficulty:** Builder · **Source:** Panchatantra · public domain · original retelling
> _Alternate telling for **Error handling** — see also [The Monkey and the Crocodile](13-monkey-crocodile.md)._

## The story

The jackal had eaten nothing for two days and was working his way along a dry thicket when a sound came out of it that he had never heard before. It was enormous and it kept coming, at intervals, always the same.

Everything he had told him to leave. Nothing that made a noise that size was smaller than he was, and the sensible thing, the thing that had kept him alive so far, was to be somewhere else before it came out.

He went towards it instead, slowly, and a good deal of the afternoon went on it. In the middle of the thicket was a war drum an army had left behind, with a branch above it that knocked against the skin whenever the wind moved.

There was nothing inside it and nothing to eat anywhere near it. But he had spent an afternoon and come away knowing exactly what the sound was, which is more than he would ever have known from the far side of the field.

## The bridge

The noise told him something was wrong. Going and reading it told him what.

| In the story | In Python | Why |
|---|---|---|
| The sound out of the thicket | The exception being raised | Both announce that something has happened. Neither one is the thing that happened. |
| The urge to be elsewhere | except Exception: pass | The program keeps running and you keep your ignorance. The noise stops mattering and the cause is still there. |
| Walking into the thicket | except ValueError as e: | Binding the exception is the walk. It is the difference between knowing something failed and holding the thing that failed. |
| A branch on a drum skin | str(e) — the message | The specific, dull, useful fact. It was available the whole time to anyone willing to go and look. |

### The same rule, in Python

```python
rows = ["12", "7", "not a number", "5"]
total = 0

for row in rows:
    try:
        total += int(row)
    except ValueError as e:
        print("skipped:", e)
        # invalid literal for int() with base 10: 'not a number'

print(total)   # 24

# the other jackal, the one who ran:
#     except ValueError:
#         pass
# same total, and you never find out which row was bad
```

The try block holds one line, so when it fails there is no question about which line it was. Binding with as e is the walk into the thicket — e carries the offending text, so the message names the exact row that could not be read. The commented version at the bottom produces an identical total and tells you nothing, which is the version that gets shipped because it looks tidy.

**Where it breaks:** The monkey's mistake would be catching everything. This one is catching something and then throwing away what it said. except Exception: pass and except Exception: print("something went wrong") are the same bug — the drum booms, you leave, and you never learn it was hollow. Bind the exception with as e and put e in the message, or let it raise. An error you cannot read costs far more than the failure it was reporting.

## Check yourself

**1. Find it in the story.** Which part of the story is reading the exception rather than merely surviving it?

- A) Walking into the thicket to find the drum
- B) Hearing the sound come out of the thicket
- C) The urge to be somewhere else
- D) Finding nothing inside the drum to eat

**2. Read the Python.** Some rows in a file cannot be read as numbers. Which version lets you find out which ones?

- A)

  ```python
  try:
      total += int(row)
  except ValueError as e:
      print("skipped:", e)
  ```

- B)

  ```python
  try:
      total += int(row)
  except ValueError:
      pass
  ```

- C)

  ```python
  try:
      total += int(row)
  except ValueError:
      print("something went wrong")
  ```

- D)

  ```python
  try:
      total += int(row)
  except:
      print("skipped")
  ```

**3. Somewhere new.** A nightly job reads two hundred config files. It finishes successfully every night, but a few settings never take effect. The log line for each failure reads "could not load config, skipping". Where is the real problem?

- A) The handler catches the error but never records which file failed or what was wrong with it
- B) The job should not be catching the error at all, so that it crashes on the first bad file
- C) The job needs to be run more often so the failures are noticed sooner
- D) The config files should be validated before the job starts

<details><summary>Answer key</summary>

1. **A** — He ends the afternoon holding the actual cause instead of a memory of the noise. That is what binding an exception and reading its message gets you — the specific fact, not just the fact that something happened.
2. **A** — as e binds the exception, and printing it names the exact text that could not be converted. The try block holds one line, so there is no doubt about what failed either.
3. **A** — The job is reporting the noise and discarding the drum. Bind the exception and log the filename with str(e), and the same run that hides the fault becomes the run that names it.

</details>
