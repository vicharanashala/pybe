# The Fox and the Crow — Validating input

> **Concept:** Validating input · **Difficulty:** Explorer · **Source:** Aesop · public domain · original retelling

## The story

A crow found a piece of cheese in a yard and carried it up into a tree to eat where nothing could reach it. A fox came past below, looked up, and worked out that it had no way to climb.

So it spoke instead. It said the crow's feathers were the finest it had seen, that its shape was better than any bird's, and that if its voice matched the rest of it, then the crow was first among birds.

None of this was checkable from where the crow sat. It was pleasant, and it was specific, and it arrived in complete sentences. The crow accepted all of it and opened its beak to prove the last part.

The cheese fell. The fox took it, and said before leaving that the crow had a fine voice and no judgement at all, and that it should have asked itself who was asking.

## The bridge

Everything the fox said was well formed. Not one word of it had been checked. Those are two different properties, and only one of them was the crow's job.

| In the story | In Python | Why |
|---|---|---|
| What the fox said | Input from outside your program | It arrives in the right shape. That tells you nothing about whether it is true or safe to act on. |
| It sounded correct and complete | Well formed, but unvalidated | Parsing succeeded. `int("-5")` works perfectly; -5 may still be nonsense for what you are about to do. |
| It never asked who was asking | The missing check | One `if` between the value arriving and the value being used. That is the whole of the defence. |
| Opening its beak | Acting on the value | The point of no return. After this the cheese is gone and any check you add is too late. |

### The same rule, in Python

```python
raw = input("How many copies? ")     # the fox speaks

try:
    count = int(raw)                # layer 1: is it a number at all?
except ValueError:
    print("that is not a number")
else:
    # layer 2: is it a number that makes sense here?
    if count <= 0:
        print("you cannot print fewer than one copy")
    elif count > 100:
        print("the limit is 100")
    else:
        for _ in range(count):
            print("printing…")
```

Two checks, not one. The `try` asks whether the value is the right *kind* of thing. The `if`s ask whether it is a *sensible* thing to act on. `"-5"` passes the first and fails the second, which is exactly the fox's trick: correctly formed, and still not to be acted on.

**Where it breaks:** Checking the type is not checking the value. `int("-5")` succeeds, `float("1e400")` quietly gives `inf`, and an empty name passes any test that only asks whether it is a string. Decide what range, length and shape you actually need and check for that. The crow's mistake was not that it failed to parse the fox — it was that it never asked whether the source could be trusted at all.

## Check yourself

**1. Find it in the story.** Which part of the story is the missing validation check?

- A) The question the crow never asked about who was speaking, and why
- B) The fox's speech
- C) The cheese falling
- D) The crow flying up into the tree

**2. Read the Python.** A form asks for an age. Which version is actually validated?

- A)

  ```python
  raw = input("Age: ")
  try:
      age = int(raw)
  except ValueError:
      print("not a number")
  else:
      if 0 < age < 130:
          register(age)
      else:
          print("not a plausible age")
  ```

- B)

  ```python
  raw = input("Age: ")
  age = int(raw)
  register(age)
  ```

- C)

  ```python
  raw = input("Age: ")
  if raw:
      register(int(raw))
  ```

- D)

  ```python
  raw = input("Age: ")
  if isinstance(raw, str):
      register(int(raw))
  ```

**3. Somewhere new.** A different situation: your API receives a JSON order with `quantity: 1000000`. The field is present and is an integer. What still has to happen before you use it?

- A) A range check — it is well formed and still not a value you should act on
- B) Nothing — it parsed as an integer, so it is valid
- C) Convert it to a string so it cannot be used in arithmetic
- D) Wrap the whole request handler in a try/except

<details><summary>Answer key</summary>

1. **A** — Right. One check between the input arriving and it being acted on. That is what validation is.
2. **A** — Yes. First whether it is a number at all, then whether it is a number that makes sense here.
3. **A** — Yes. Schema validation says the shape is right. Whether a million of something is a sane order is a separate question, and only your code knows the answer.

</details>
