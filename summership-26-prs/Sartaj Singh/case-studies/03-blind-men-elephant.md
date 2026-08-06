# The Blind Men and the Elephant — Dictionaries

> **Concept:** Dictionaries · **Difficulty:** Explorer · **Source:** Indian parable · public domain · original retelling

## The story

Six men who had been blind since birth were brought to an elephant and asked to describe it. Each reached out and touched a different part.

The one holding a leg said the elephant was a pillar. The one at the trunk said it was a thick snake. The one at the ear said a great fan; the one at the side, a wall; the one at the tusk, a smooth spear; the one at the tail, a rope.

They argued until nightfall. Every man was certain, and no man was lying. Each had found something true and none had found the whole.

A traveller listening nearby said: you are not disagreeing. Write each answer next to the part it came from, and put the six together. That list is the elephant.

## The bridge

The men had six answers with no labels on them. A dictionary is exactly that missing label: every value stored next to the thing it describes.

| In the story | In Python | Why |
|---|---|---|
| The part each man touched — leg, trunk, ear | The keys | Unique and meaningful. You look things up by them, never by position. |
| What that man said it was — pillar, snake, fan | The values | The information itself. Values can repeat; keys cannot. |
| Writing each answer beside the part it came from | A key-value pair | This is the whole idea. The answer stops floating loose and gets attached to its question. |
| All six pairs together on the slate | The dictionary | No single man is the elephant. The collection of labelled pairs is. |

### The same rule, in Python

```python
elephant = {
    "leg": "a pillar",
    "trunk": "a thick snake",
    "ear": "a great fan",
    "side": "a wall",
    "tusk": "a smooth spear",
    "tail": "a rope"
}

print(elephant["trunk"])        # a thick snake

print("tail" in elephant)       # True
print(elephant.get("eye", "nobody reached it"))

for part, description in elephant.items():
    print(part, "->", description)
```

`elephant["trunk"]` is a man being asked what he found. `.items()` is every man reporting in turn, each one saying which part he held.

**Where it breaks:** `elephant["eye"]` raises a KeyError — nobody touched the eye, so there is no answer to give. `.get("eye", default)` asks the same question but accepts "nobody reached it" instead of crashing.

## Check yourself

**1. Find it in the story.** Which part of the story is the key, and which is the value?

- A) The body part touched is the key; the description given is the value
- B) The description is the key; the body part is the value
- C) Each man is a key and the elephant is the value
- D) There are no keys — it is just a list of six descriptions

**2. Read the Python.** Nobody in the story touched the elephant's eye. What does `elephant["eye"]` do?

- A) Raises a KeyError, because that key was never stored
- B) Returns None, since the key is missing
- C) Returns an empty string
- D) Adds "eye" to the dictionary with no value

**3. Somewhere new.** You are storing the capital city of each Indian state so you can look up any state by name. List or dictionary?

- A) A dictionary, because each capital belongs to a specific state you will look it up by
- B) A list, because there are many states and lists hold many things
- C) Two lists kept in the same order, one of states and one of capitals
- D) A dictionary with the capitals as keys

<details><summary>Answer key</summary>

1. **A** — Right. You look things up by the part — that is what makes it the key.
2. **A** — Correct. Square brackets demand an answer, and there is none to give.
3. **A** — Yes. When one piece of data identifies another, that identifier is a key — same shape as part-to-description.

</details>
