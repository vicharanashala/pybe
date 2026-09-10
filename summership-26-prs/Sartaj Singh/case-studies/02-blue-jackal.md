# The Blue Jackal — Data types and casting

> **Concept:** Data types and casting · **Difficulty:** Beginner · **Source:** Panchatantra · public domain · original retelling

## The story

A hungry jackal wandered into a village at night and was chased by dogs. Running blind through a dyer's yard, it fell into a great vat of indigo.

It climbed out soaked in blue. Back in the forest, no animal recognised it. They had never seen such a creature. The tiger stepped back. The elephant lowered its head.

The jackal saw its chance. "I was sent to rule this forest," it announced. The animals believed it and served it, and for many days it lived as king.

Then one evening a pack of jackals passed nearby and howled. The blue king forgot itself and howled back. Every animal turned. The colour had never been the animal — the howl was.

## The bridge

The animals judged the jackal by how it looked. Python does not. Every value has a type underneath, and the way it prints is not that type.

| In the story | In Python | Why |
|---|---|---|
| The jackal's real nature | The value's type | Fixed and underneath. `5` is an int whether or not anything is looking at it. |
| The blue coat of dye | Its printed appearance | `print(5)` and `print("5")` put the same mark on the screen. The screen is not the truth. |
| The forest animals believing the disguise | Assuming a type from how a value looks | This is where beginners get caught: input() always hands you a string, even when it looks like a number. |
| The howl that gave it away | type(), and errors at runtime | Ask directly and the truth comes out. Or try to use the value and Python tells you what it really was. |

### The same rule, in Python

```python
disguise = "5"      # a string that looks like a number
real = 5            # an actual number

print(disguise)     # 5
print(real)         # 5      <- identical on screen

print(type(disguise))   # <class 'str'>   <- the howl
print(type(real))       # <class 'int'>

print(real + 1)         # 6
print(disguise + 1)     # TypeError: can only concatenate str to str

print(int(disguise) + 1)   # 6   <- wash off the dye first
```

`int(disguise)` does not change the original value. It produces a new one of a different type — the way the rain would have washed the jackal clean rather than making it never have fallen in.

**Where it breaks:** `input()` hands back a string every single time. Ask for someone's age and you get `"21"`, not `21`. Adding to it fails, and comparing it to a number gives wrong answers rather than an error — which is worse, because nothing tells you.

## Check yourself

**1. Find it in the story.** In the story, what plays the role of type() — the thing that reveals what a value really is?

- A) The howl
- B) The indigo dye
- C) The tiger bowing
- D) The dyer's yard

**2. Read the Python.** A program runs `age = input("Your age: ")` and the user types 21. What does `age + 1` do?

- A) Raises a TypeError, because age is the string "21"
- B) Gives 22, because Python sees it is a number
- C) Gives "211", joining the two together
- D) Gives 21, ignoring the +1

**3. Somewhere new.** A form collects a price as "49.99" and a quantity as "3", both from input(). You need the total. What has to happen first?

- A) Cast each one to a number — float("49.99") and int("3") — then multiply
- B) Multiply them directly, since they both contain digits
- C) Use int() on both, since money is a number
- D) Nothing — Python converts automatically when it sees multiplication

<details><summary>Answer key</summary>

1. **A** — Right. It is the moment the underlying nature is exposed, regardless of appearance.
2. **A** — Correct. input() always returns a string. It looks like a number on screen, but it howls like a string.
3. **A** — Yes. Wash off the dye before you use the value. The cast produces new values of the right types.

</details>
