# The Four Scholars and the Lion — Functions

> **Concept:** Functions · **Difficulty:** Explorer · **Source:** Panchatantra · public domain · original retelling
> _Alternate telling for **Functions** — see also [The Four Friends](08-four-friends.md)._

## The story

Four young men set out together to look for work. Three of them had studied for years and each had come away with one thing he could do better than anyone. The fourth had studied nothing much and was mostly useful for noticing things.

Beside the road, half covered, were the bones of some large animal. The first said he could put bones in their proper order, and did, and a skeleton stood up out of the dust while the others watched.

The second said he could cover a frame with flesh and hide, and did. The third said he could put breath into a thing that had none. The fourth said that was fine, and that he would say the rest of it from the tree, and started walking.

From up there he asked whether anyone had thought about what the thing would want first. Nobody answered, because the third had already done his part, and it had worked exactly as well as he had promised.

## The bridge

Every one of them did precisely what he said he could do, and one of those was a call that should never have been made.

| In the story | In Python | Why |
|---|---|---|
| Each scholar with his one skill | A function — one job, called by name | The same shape as the four friends: work written down once and invoked when wanted. |
| Handing the same bones on | Passing the same object to each call | Nobody makes a copy. Each one works on the thing itself, so every change is waiting for the next. |
| Putting breath into it | A call with a side effect | It returns nothing useful and changes the world. The value of a call is not the only thing a call does. |
| Going up the tree first | Reading what a function does before calling it | The one precaution available. After the call, being right about it is worth nothing. |

### The same rule, in Python

```python
def add_flesh(bones):
    bones.append("hide")     # changes the caller's list
    return bones

mine = ["skull", "ribs"]
result = add_flesh(mine)

print(result)            # ['skull', 'ribs', 'hide']
print(mine)              # ['skull', 'ribs', 'hide']  <- yours too
print(result is mine)    # True — one object, not two
```

add_flesh looks like it builds something and hands it back. It does hand something back, and it is the very list you passed in — the same bones, altered where they lay. result is mine prints True, which is the whole story: there was never a second set. If you want the caller's list left alone, copy it first with bones[:] or list(bones) and work on that.

**Where it breaks:** The four friends warn you about the call you forgot to make. This is the opposite: a call that runs perfectly and does more than you wanted. A function handed a list, dict or set can change it in place, and nothing in the call site tells you so — names.sort() reorders the caller's list and returns None. The deeper version is a mutable default, def add(item, cart=[]), where every call shares one list that survives between them. Read what a function does to what you hand it, before you hand it over.

## Check yourself

**1. Find it in the story.** Which part of the story is the call that succeeds and should not have been made?

- A) Putting breath into the finished shape
- B) Arranging the bones into order
- C) Climbing the tree
- D) Four men setting out to look for work

**2. Read the Python.** mine = ["skull", "ribs"], then result = add_flesh(mine), where add_flesh appends to the list it is given. What does mine hold afterwards?

- A) ['skull', 'ribs', 'hide'] — the same list the function changed
- B) ['skull', 'ribs'] — the function worked on its own copy
- C) It raises an error, because a function cannot change its argument
- D) None — because .append() returns None

**3. Somewhere new.** A helper def tidy(names): names.sort(); return names is called to print a sorted guest list for a report. Afterwards the seating plan, built from the same list, has come out in the wrong order. Why?

- A) sort() reorders the list in place, so the helper rearranged the caller's own list
- B) return names hands back a copy, so the original could not have changed
- C) The report and the seating plan were generated in the wrong order
- D) sort() returns None, so nothing was ever assigned

<details><summary>Answer key</summary>

1. **A** — It did exactly what it promised, on the first attempt. That is what makes it dangerous — a call that fails is a call you notice, and this one worked.
2. **A** — Passing a list hands over the list itself, not a copy, so appending inside the function is appending to yours. result is mine is True — the two names point at one object.
3. **A** — The helper was handed the list itself, and sort() rewrites it where it sits. The report got what it wanted and the seating plan quietly inherited the damage — the same bones, altered by a call that looked read-only.

</details>
