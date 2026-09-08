# 1 for Loop

**The Monkey and the Mangoes**

**Concept:** for Loop
**Difficulty:** Beginner
**Source:** Indian folk tale 

---

## The Story

Once upon a time, in a dense forest, there lived a clever monkey named Bandar. One sunny afternoon, Bandar discovered a magnificent mango tree loaded with ripe, golden mangoes. There were exactly 12 mangoes hanging from the lowest branch.

Bandar was hungry and decided to eat every single mango from that branch. He climbed up, sat on the branch, and began counting:

"One mango... I'll eat this one."
"Two mangoes... I'll eat this one too."
"Three mangoes... and this one..."

Bandar continued counting from 1 to 12, eating each mango in order. He didn't need to check if there were mangoes left after each one — he knew exactly how many there were because he had counted them first. When he reached the twelfth mango, he ate it, and his task was complete.

The monkey sat back, patted his full belly, and thought, "I knew exactly how many mangoes I had to eat. I just worked through each one in order."

---

## The Bridge

Bandar knew the number of items beforehand, just like how a `for` loop works when you know the exact number of times something needs to repeat.

| In the story                           | In Python                          | Why                                                           |
| -------------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| Bandar counted 12 mangoes first        | `range(12)`                        | The loop knows exactly how many times to run before it starts |
| "One mango... I'll eat this one"       | `for mango in range(12):`          | The loop runs once for each item in the sequence              |
| Bandar eats whichever mango is next    | `eat(mango)`                       | The same action happens for each item                         |
| After the 12th mango, Bandar stops     | Loop finishes after 12 iterations  | The loop automatically stops after the last item              |
| Bandar doesn't check "are there more?" | The loop doesn't check a condition | For loops run for a predetermined number of times             |

---

## The Python Code

```python
mangoes = 12

for mango in range(mangoes):
    print("Eating mango number", mango + 1)
    # The monkey eats each mango

print("All mangoes eaten! The monkey is full.")
```

---

## Check Yourself

**1. What made Bandar's task suitable for a for loop?**

* A) He had to check after each mango if he was full
* B) He knew exactly how many mangoes there were
* C) He didn't know when to stop
* D) He had to adjust his plan based on each mango

**2. Which Python code best represents Bandar eating 12 mangoes?**

* A) `while mangoes > 0: eat(mangoes); mangoes -= 1`
* B) `for mango in range(12): eat(mango)`
* C) `if mangoes == 12: eat(mangoes)`
* D) `for mango in range(100): eat(mango)`

**3. A farmer has 20 chickens and wants to feed each one exactly 1 cup of grain. Which loop fits best?**

* A) A for loop, because the number of chickens is known
* B) A while loop, because chickens might not be hungry
* C) An if statement, because each chicken needs the same amount
* D) No loop, because feeding is a one-time action

---

## Answer Key

**1. B** — Bandar knew exactly how many mangoes were on the branch, making it a perfect `for` loop situation where the count is known beforehand.

**2. B** — The `for` loop with `range(12)` matches Bandar's situation perfectly: he knows the exact count and processes each item in order.

**3. A** — Since the farmer knows there are exactly 20 chickens and each gets the same treatment, a `for` loop is the right choice.
