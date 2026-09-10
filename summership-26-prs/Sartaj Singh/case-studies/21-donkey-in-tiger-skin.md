# The Donkey in the Tiger Skin — Data types and casting

> **Concept:** Data types and casting · **Difficulty:** Beginner · **Source:** Panchatantra · public domain · original retelling
> _Alternate telling for **Data types and casting** — see also [The Blue Jackal](02-blue-jackal.md)._

## The story

The washerman had a donkey who was worked hard and fed badly, and there was good barley growing in fields that were not theirs. One night the washerman brought out a tiger skin that had been folded in a box for years, and put it over the donkey.

It worked. The villagers saw the shape moving through the barley in the dark and stayed behind their doors, and the donkey ate as much as he wanted and walked home at dawn. He did this for many nights, and nothing about the skin ever failed.

Then one night a donkey called from somewhere across the field, the ordinary complaining call of a donkey wanting company. He heard it, and he answered it, because that is the sound he had.

They came out with sticks before he had finished. The skin lay in the barley afterwards, exactly as orange and exactly as striped as it had been the whole time. It had never been the thing they were afraid of.

## The bridge

The skin was a perfect tiger right up to the moment he had to make a sound.

| In the story | In Python | Why |
|---|---|---|
| The tiger skin | How a value looks when you print it | Both are surface. print(3) and print("3") put the identical character on your screen and tell you nothing about what you are holding. |
| Villagers keeping their doors shut | Code that happens to work | It behaved correctly for many nights. Working for a while is not the same as being the right type. |
| The bray | type(x), or any operation only one type supports | The moment something needs what the thing actually is, the surface stops counting. |
| Sticks, and no surprise | A wrong answer arriving late | The failure lands far from the disguise, at whatever line first needed the truth. |

### The same rule, in Python

```python
grazed = "3"            # read from a file, and it looks like a number

print(grazed)          # 3    <- the skin
print(3)               # 3    <- identical on screen

print(type(grazed))    # <class 'str'>   <- the bray

print(grazed * 2)      # 33, not 6
print(sorted(["10", "9", "100"]))
# ['10', '100', '9'] — compared one character at a time
```

The first two lines are the disguise: the screen shows the same character either way, so nothing you can see distinguishes them. type() is the bray — it makes the thing say what it is. The last two lines are the sticks: multiplying gives "33" instead of 6, and sorting puts "100" before "9" because it is comparing characters, not quantities. Neither of them raises.

**Where it breaks:** The screen cannot tell you what you have. Because print("3") and print(3) look the same, a value read from a file, a form or a spreadsheet can travel a long way through your code wearing the wrong type without anything complaining. "3" * 2 gives "33", and "10" < "9" is True. Use type(x) or isinstance(x, int) when you want to know, and convert at the edge where the data comes in rather than at the line that finally breaks.

## Check yourself

**1. Find it in the story.** Which moment in the story is the moment the real type is revealed?

- A) The bray
- B) The tiger skin going on
- C) The villagers staying behind their doors
- D) The sticks

**2. Read the Python.** values = ["10", "9", "100"] was read from a file. Which line gives the true largest number?

- A) max(int(v) for v in values)
- B) max(values)
- C) max(values, key=len)
- D) int(max(values))

**3. Somewhere new.** A spreadsheet of exam scores is exported and read back in. The report sorts the column and prints the top score as 9, when several pupils clearly scored higher. Nothing raised an error. What happened?

- A) The scores are strings, so they were compared one character at a time
- B) The scores are numbers, but sorted() returned them in reverse order
- C) The scores are floats and lost precision on the way out of the file
- D) sorted() always needs key=int, even for numbers

<details><summary>Answer key</summary>

1. **A** — It is the one thing the skin could not do for him. An operation that only his actual kind can perform is exactly what type() is — it makes the value state what it is rather than what it resembles.
2. **A** — Each value is converted before anything is compared, so the comparison is between numbers. This returns 100.
3. **A** — Text out of a spreadsheet arrives as text. "9" sorts after "100" because the first character decides it, and no line ever asked what type it was holding — the skin, all the way to the report.

</details>
