# The Word of Harishchandra — Tuples and immutability

> **Concept:** Tuples and immutability · **Difficulty:** Explorer · **Source:** Indian epic tradition · public domain · original retelling

## The story

Harishchandra was known for one thing before he was known for anything else: what he said was what happened. A sage came to his court one morning and asked for a gift. The king answered without waiting. Whatever you name from my house is yours.

The sage named the kingdom. The ministers were on their feet at once, saying it had been a courtesy, a form of words, that he should take it back before the hour was out. Harishchandra said that a thing already spoken is not a thing you can reach into.

So he spoke again, beside it rather than over it. He would give up the throne, and he would serve until whatever remained was paid. The first sentence stood where it was, word for word. There were simply two of them now.

He left before evening and served for years, and the name held. Only one thing had moved: the sentence had named the treasury, and coin had gone in and out of the treasury all year. What the words pointed at was never as fixed as the words.

## The bridge

The king could add a sentence. He could not reach back into the one he had already spoken.

| In the story | In Python | Why |
|---|---|---|
| The sentence he spoke to the sage | A tuple | Both are settled at the moment they are made. Nothing that happens later reaches back and edits one part of them. |
| The ministers asking him to unsay it | word[0] = "something smaller" | The refusal is not stubbornness. There is no route into a thing already made that would let one piece of it be swapped. |
| Speaking a second sentence beside the first | word + ("and I will serve",) | He does not alter the old sentence, he builds another from it. The original survives the operation exactly as spoken. |
| The treasury the sentence named | A list held inside the tuple | The words naming the store never moved, and the store emptied anyway. Naming a thing does not freeze the thing. |

### The same rule, in Python

```python
word = ("the kingdom", "the treasury")

try:
    word[0] = "a smaller gift"        # the court, asking him to unsay it
except TypeError as e:
    print("cannot alter:", e)

spoken_again = word + ("and I will serve",)
print(word)                           # unchanged
print(spoken_again)

promise = ("the treasury", ["gold", "grain"])
promise[1].append("silver")           # the walls were named, not what stands inside
print(promise)
```

The first block is the ministers asking him to take the word back, and Python refuses for the same reason he does — the sentence is already made. The second block is what he does instead: a new sentence built out of the old one, leaving the first exactly as spoken. The last block is the treasury. The promise still names the same store, and the store's contents moved anyway.

**Where it breaks:** A tuple holding a list is not as frozen as it looks. promise[1] = [...] raises TypeError, but promise[1].append(...) succeeds — a tuple fixes which objects it holds, not what those objects contain. The other reliable trap is the missing comma: ("only one",) is a one-item tuple, while ("only one") is just a string in brackets.

## Check yourself

**1. Find it in the story.** Which part of the story is the thing that cannot be changed once it is made?

- A) The sentence the king spoke to the sage
- B) The ministers' request that he take it back
- C) The second sentence he spoke afterwards
- D) The coin moving in and out of the treasury

**2. Read the Python.** word = ("the kingdom", "the treasury"). Which line records the added promise and leaves word exactly as it was?

- A) spoken_again = word + ("and I will serve",)
- B) word[2] = "and I will serve"
- C) word.append("and I will serve")
- D) spoken_again = word + "and I will serve"

**3. Somewhere new.** A shop records each completed order as order = ("ORD-7741", "2026-08-01", ["socks", "lamp"]). Which one of these runs without raising an error?

- A) order[2].append("kettle")
- B) order[0] = "ORD-7742"
- C) order.append("kettle")
- D) order[2] = ["socks", "lamp", "kettle"]

<details><summary>Answer key</summary>

1. **A** — It is settled the moment it leaves him, and everything afterwards has to work around it rather than inside it. That is exactly what a tuple is — a value that is finished when it is built.
2. **A** — Adding two tuples builds a third and leaves both originals untouched. word still holds its two items afterwards — the first sentence, standing where it was.
3. **A** — The tuple fixes which three objects the order holds; it does not freeze the list sitting in the third slot. Appending changes that list while the order itself is untouched — the treasury behind the walls that were named.

</details>
