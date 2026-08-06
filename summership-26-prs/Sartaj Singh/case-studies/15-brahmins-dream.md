# The Brahmin's Dream — Files and persistence

> **Concept:** Files and persistence · **Difficulty:** Builder · **Source:** Panchatantra · public domain · original retelling

## The story

A poor Brahmin was given a pot of rice flour, more than he could eat at once. He hung it from a nail in the wall above his bed, where the rats and the damp could not get at it, and lay down to look at it.

He worked out what it was worth. Sell the flour in a famine year and he would have goats; the goats would give him a herd; the herd would buy cattle, and the cattle a house, and the house a wife.

He got as far as a son. He imagined the boy running underfoot while his wife was busy at the stove, and imagined calling out to her to come and take the child away, and imagined her not hearing him.

So he kicked out, in the dark, to get her attention. His foot caught the pot. The flour went across the floor, and everything he had built that evening had been standing on it.

## The bridge

Everything he owned, and everything he had planned on top of it, existed in exactly one place — and that place was only hanging on a nail.

| In the story | In Python | Why |
|---|---|---|
| The pot on the nail | Data held only in memory | Fast to reach, and gone the instant something goes wrong. Nothing outside the program knows it exists. |
| Everything built on top of it | State derived from that data | The goats, the cattle, the house. All of it depends on the pot and none of it is stored anywhere else. |
| The kick | The process ending — a crash, a restart, a power cut | It does not have to be dramatic. It only has to happen once. |
| Writing it down, or selling the flour that morning | Writing to a file | The moment the value leaves the program and lands somewhere that outlives it. |

### The same rule, in Python

```python
# in memory only — the pot on the nail
plans = ["goats", "cattle", "a house"]
plans.append("a son")

# the kick: if the program ends here, so do the plans.

# on disk — this survives the process
with open("plans.txt", "w") as handle:
    for plan in plans:
        handle.write(plan + "\n")

# a later run can pick it up again
with open("plans.txt") as handle:
    recovered = [line.strip() for line in handle]

print(recovered)      # ['goats', 'cattle', 'a house', 'a son']
```

`with open(...)` opens the file and closes it again when the block ends, even if something fails inside — which is the point. An unclosed file may still be sitting in a buffer, written nowhere, when the process dies. The `with` is what takes the pot off the nail.

**Where it breaks:** `open(path, "w")` empties the file before writing a single byte. Point it at the wrong name and the old contents are gone, with no warning and no undo — the kick, delivered by your own code. Use `"a"` to append and `"r"` to read, and check the path before you open anything for writing.

## Check yourself

**1. Find it in the story.** What does the pot hanging on the nail correspond to?

- A) Data that exists only in memory while the program is running
- B) A file saved to disk
- C) A variable name
- D) His plans for the goats and the cattle

**2. Read the Python.** You want to add a line to an existing log file without destroying what is in it. Which is right?

- A)

  ```python
  with open("log.txt", "a") as f:
      f.write("one more line\n")
  ```

- B)

  ```python
  with open("log.txt", "w") as f:
      f.write("one more line\n")
  ```

- C)

  ```python
  f = open("log.txt", "a")
  f.write("one more line\n")
  ```

- D)

  ```python
  with open("log.txt", "r") as f:
      f.write("one more line\n")
  ```

**3. Somewhere new.** A different situation: a shopping cart is held in a Python list on the server. A deploy restarts the process and every cart in progress vanishes. What was the mistake?

- A) Treating memory as storage — the carts were never written anywhere that outlives the process
- B) Deploying during business hours
- C) Not using a server with more memory
- D) Not wrapping the deploy in a try/except

<details><summary>Answer key</summary>

1. **A** — Right. Reachable, useful, and gone the moment the process stops. Nothing outside it holds a copy.
2. **A** — Yes. `"a"` appends, and `with` closes the file even if something fails partway through.
3. **A** — Yes. A restart is not an accident to be prevented; it is a thing that will happen. Anything that must survive it has to be written down.

</details>
