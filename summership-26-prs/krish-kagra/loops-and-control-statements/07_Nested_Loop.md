# 7 Nested Loops

**The Fisherman and the Golden Fish**

**Concept:** Nested Loops
**Difficulty:** Intermediate
**Source:** Indian folk tale 

---

## The Story

In a coastal village, there lived a fisherman named Matsya. Every day, he would cast his net into the sea to catch fish. But Matsya was very particular — he wanted to organize his catch neatly.

One day, after a good catch, Matsya sat on the shore with his baskets. He had 3 baskets, and each basket could hold 5 fish. He began sorting his fish:

"First basket: fish number 1, fish number 2, fish number 3, fish number 4, fish number 5."
"Second basket: fish number 1, fish number 2, fish number 3, fish number 4, fish number 5."
"Third basket: fish number 1, fish number 2, fish number 3, fish number 4, fish number 5."

Matsya repeated the same action of placing 5 fish into each basket. He worked systematically: for each basket, he put 5 fish in it. He had to keep track of both which basket he was filling and which fish he was placing.

---

## The Bridge

Matsya had a loop inside a loop! The outer loop went through each basket, and the inner loop went through the fish for that basket. This is called a nested loop.

| In the story                             | In Python                          | Why                                           |
| ---------------------------------------- | ---------------------------------- | --------------------------------------------- |
| "3 baskets"                              | Outer loop                         | The outer loop runs once for each basket.     |
| "Each basket holds 5 fish"               | Inner loop                         | For each basket, the inner loop runs 5 times. |
| "First basket: fish 1, 2, 3, 4, 5"       | Inner loop completes               | The inner loop finishes for one basket.       |
| "Second basket: fish 1, 2, 3, 4, 5"      | Outer loop moves to next iteration | Then the next basket begins.                  |
| Matsya knows which basket and which fish | Two variables track progress       | Nested loops need to track both positions.    |

---

## The Python Code

```python id="u3d9qx"
baskets = 3
fish_per_basket = 5

for basket in range(1, baskets + 1):
    print("Starting basket", basket)
    for fish in range(1, fish_per_basket + 1):
        print("  Placing fish", fish, "in basket", basket)
    print("Finished basket", basket)
    print("---")

print("All fish sorted!")
```

---

## Check Yourself

**1. How many total fish did Matsya place in all baskets?**

* A) 3
* B) 5
* C) 8
* D) 15

**2. In a nested loop, what happens first?**

* A) The inner loop runs for the first outer loop iteration
* B) The outer loop finishes before the inner loop starts
* C) Both loops run at the same time
* D) The inner loop runs for all iterations before the outer loop starts

**3. You have a classroom with 5 rows of desks, and each row has 4 desks. You want to clean each desk in every row. Which structure would you use?**

* A) One loop for rows, another nested loop for desks in each row
* B) A single loop for all desks
* C) Two separate loops that run one after another
* D) No loops — just clean each desk individually

---

## Answer Key

**1. D** — 3 baskets × 5 fish per basket = 15 total fish.

**2. A** — The inner loop completes all its iterations for the first outer loop iteration before the outer loop moves to the next iteration.

**3. A** — This is a perfect nested loop situation: the outer loop goes through each row, and the inner loop goes through each desk in that row.
