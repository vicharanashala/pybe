# The Milkmaid and her Pail — Files and persistence

> **Concept:** Files and persistence · **Difficulty:** Builder · **Source:** Aesop · public domain · original retelling
> _Alternate telling for **Files and persistence** — see also [The Brahmin's Dream](15-brahmins-dream.md)._

## The story

The morning's milk went into one pail and the pail went onto her head, and she set off for the market at the other end of the valley. It was a long walk and there was nothing to do on it but think.

The milk would buy eggs. The eggs would come to something like a dozen birds by spring, and the birds would pay for the dress with the deep red hem she had been looking at since the last fair.

None of it was written anywhere. It did not need to be, because she was carrying the beginning of it on her head and had both hands free, and the pail had never once come off on any of the mornings before this one.

She tossed her head at something, the way anyone does. The pail went over. The milk went into the road and the dress went with it, and the eggs and the birds, none of which had ever been anywhere but in the pail.

## The bridge

Everything she owned that morning was in one container, and the container was in motion.

| In the story | In Python | Why |
|---|---|---|
| The milk in the pail | Bytes sitting in the write buffer | Real, and yours, and not yet anywhere that would survive you dropping it. |
| The walk to market | The stretch between write() and close() | The window in which everything is true and none of it is safe. |
| Both hands free | No with block, no close in a finally | Nothing arranged for the case where the journey does not finish the way it usually does. |
| The toss of the head | An exception, or the process being killed | Ordinary, unremarkable, and enough. The file on disk is empty and the code that wrote it never failed. |

### The same rule, in Python

```python
f = open("milk.txt", "w")
f.write("three eggs, then birds, then the dress")

print(repr(open("milk.txt").read()))   # ''  <- nothing on disk yet

f.close()
print(repr(open("milk.txt").read()))   # 'three eggs, then birds, ...'

# the pail, carried properly:
with open("milk.txt", "w") as f:
    f.write("safe")                    # closed even if this block raises
```

The middle line is the point of the whole story. The write has happened, the program believes it, and reading the file from disk at that moment gives back an empty string — the milk is in the pail and the pail is still on her head. Only close() puts it somewhere. The with block does the close for you, including on the way out of an exception, which is the toss of the head.

**Where it breaks:** Writing is not saving. f.write() puts characters in a buffer in memory and they reach the disk when the file is closed or the buffer fills, so a process that is killed — or an exception that jumps over your f.close() — leaves a file that is empty or half written, with no error anywhere. Always use with open(path) as f:. Note this is a different failure from the Brahmin's: his pot existed and got kicked, while her milk had never been anywhere but the pail.

## Check yourself

**1. Find it in the story.** Which part of the story is the stretch where the data exists but is not yet safe?

- A) The walk to market with the pail on her head
- B) The milk being poured into the pail that morning
- C) The plans about eggs and birds and the dress
- D) The toss of the head

**2. Read the Python.** f = open("out.txt", "w") then f.write("hello"), and the program is killed before anything else runs. What is in out.txt?

- A) Nothing — the file exists and is empty
- B) "hello", because write() puts it on the disk straight away
- C) The file does not exist, because it was never closed
- D) "hello" but with no newline, which makes it unreadable

**3. Somewhere new.** A service appends to a log file with f.write() and keeps the handle open for its whole run. While it is running you watch the log, and the newest lines are missing — then a batch of them all appears at once. What is going on?

- A) The lines are sitting in the write buffer and only reach the file when it is closed or the buffer fills
- B) The service is writing to a different path than the one being watched
- C) The tool watching the file cannot show lines written after it started
- D) The service is writing faster than the disk accepts, so lines are dropped

<details><summary>Answer key</summary>

1. **A** — The milk is real and it is hers for the whole walk, and it is in the one place that cannot survive a stumble. That is the gap between write() and close(), where the bytes are in memory and not on the disk.
2. **A** — open(..., "w") creates and empties the file immediately, but write() only fills a buffer in memory. Without a close or a flush, those characters never reach the disk, so an empty file is left behind by code that never failed.
3. **A** — The all-at-once arrival is the tell: that is the buffer flushing when it fills. The service is honestly writing every line, and every line spends time on the milkmaid's head before it lands.

</details>
