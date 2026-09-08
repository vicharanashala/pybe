# 4 continue_statement

**The Elephant and the Greedy King**

**Concept:** continue
**Difficulty:** Beginner
**Source:** Indian folk tale 

---

## The Story

In a grand kingdom, there was a king who wanted to count all the elephants in his royal stable. There were many elephants, and each had to be inspected and counted.

The king's minister started counting: "One... Two... Three..." But the king had a special rule: "If an elephant is grey, count it. If an elephant is white, do not count it today — it will be counted separately tomorrow. Just move on to the next elephant."

The minister inspected each elephant one by one. When he saw a grey elephant, he counted it. When he saw a white elephant, he said, "Not today," and moved to the next elephant without counting it. He inspected every elephant, but only counted the grey ones.

---

## The Bridge

The minister didn't stop the process when he saw a white elephant — he just skipped that one and continued with the next. This is exactly what `continue` does: it skips the current iteration and moves to the next one.

| In the story                            | In Python                 | Why                                            |
| --------------------------------------- | ------------------------- | ---------------------------------------------- |
| The minister goes through each elephant | The loop iterates         | Each elephant represents one loop iteration.   |
| "If it's grey, count it"                | The normal loop body      | The main action happens for most items.        |
| "If it's white, move on to the next"    | `continue` statement      | Skips this elephant and goes to the next.      |
| The minister never stops the process    | The loop doesn't break    | Unlike `break`, the loop continues to the end. |
| The minister checks the next elephant   | The next iteration begins | The loop continues normally after `continue`.  |

---

## The Python Code

```python id="c8m3qv"
elephants = ["grey", "grey", "white", "grey", "white", "grey"]
count = 0

for elephant in elephants:
    if elephant == "white":
        print("White elephant - not counting today")
        continue  # Skip this elephant and move to the next

    count += 1
    print("Counting a grey elephant. Total:", count)

print("Total grey elephants:", count)
```

---

## Check Yourself

**1. What did the minister do when he saw a white elephant?**

* A) He stopped the entire counting process
* B) He skipped it and moved to the next elephant
* C) He counted it anyway
* D) He sent it away

**2. In Python, what is the difference between `break` and `continue`?**

* A) `break` skips one iteration; `continue` ends the loop
* B) `break` ends the loop; `continue` skips one iteration
* C) Both do the same thing
* D) `break` is for for loops; `continue` is for while loops

**3. You are going through a list of items to buy. If an item is damaged, you skip it and check the next one. If the item is the last item on your list, you stop shopping. Which would you use?**

* A) `continue` for damaged items; `break` for the last item
* B) `break` for damaged items; `continue` for the last item
* C) `continue` for both situations
* D) `break` for both situations

---

## Answer Key

**1. B** — The minister skipped white elephants and moved on to the next one, just like `continue` does.

**2. B** — `break` exits the entire loop; `continue` skips only the current iteration and continues with the next.

**3. A** — `continue` skips damaged items; `break` stops shopping when you reach the last item.
