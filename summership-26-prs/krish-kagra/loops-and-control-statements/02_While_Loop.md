# 2 while Loop

**The Thirsty Crow**

**Concept:** while Loop
**Difficulty:** Beginner
**Source:** Indian folk tale

---

## The Story

It had not rained in weeks. A crow flew from field to field with a dry throat, finding every pond cracked and every trough empty. By afternoon it could barely call out.

At the edge of a village it found a clay pot. There was water inside — but far down, past the reach of its beak. The crow pushed its head in as far as it would go. Nothing. The pot was too narrow to climb into and too heavy to tip.

The crow looked around and saw pebbles scattered in the dirt. It picked one up, dropped it into the pot, and looked again. The water was a little higher. Not enough. So it fetched another. And another. And another.

The crow did not count its pebbles. It only checked, each time, whether the water had come close enough to drink. When at last it had, the crow stopped fetching pebbles and drank.

---

## The Bridge

The crow never decided how many pebbles it would need. It decided on a rule: *keep dropping pebbles as long as the water is out of reach.*

| In the story                                | In Python                          | Why                                                                              |
| ------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| The water is still too low to drink         | The loop condition                 | Checked before every single pebble. While it stays true, the crow keeps working. |
| Fetch one pebble and drop it in             | The loop body                      | One repetition, one small change. The body runs again and again.                 |
| The water rises a little                    | The state the condition depends on | Something inside the body has to move the world closer to stopping.              |
| The water is close enough — the crow drinks | The condition becomes false        | The loop stops on its own. Nobody told it the number.                            |

---

## The Python Code

```python
water_level = 10
beak_reach = 25

while water_level < beak_reach:
    water_level = water_level + 3   # drop one pebble
    print("Pebble dropped, water now at", water_level)

print("The crow drinks.")
```

---

## Check Yourself

**1. In the crow's story, which moment is the loop condition?**

* A) Checking whether the water is still out of reach
* B) Dropping a pebble into the pot
* C) Finding the pot at the edge of the village
* D) Drinking the water at the end

**2. Which loop matches what the crow actually did?**

* A) `while water_level < beak_reach: water_level += 3`
* B) `for pebble in range(400): water_level += 3`
* C) `if water_level < beak_reach: water_level += 3`
* D) `while water_level < beak_reach: print("still thirsty")`

**3. A new situation: you are filling a bucket from a slow tap. You do not know how long it will take — you just keep the tap running until the bucket is full. Which construct fits?**

* A) A while loop, because the stopping point is a condition rather than a count
* B) A for loop over `range(60)`, because filling a bucket takes about a minute
* C) A single if statement checking whether the bucket is full
* D) No loop is needed — just set the bucket to full

---

## Answer Key

**1. A** — The condition is the test that runs before every repetition and decides whether there is another one.

**2. A** — The crow repeats while the water is below its reach, and each repetition raises the water.

**3. A** — Exactly the crow's shape: repeat an action while something is not yet true. The number of repetitions is unknown until it happens.
