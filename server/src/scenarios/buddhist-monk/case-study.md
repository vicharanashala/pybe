# The Buddhist Monk Case Study

## The Genomic Research Lab

You work for a genomic research lab analyzing DNA sequences. Your input is a string of millions of characters representing base pairs:

```
A C C G T A A G C T T A G G C A T T A
```

Each character is one of four nucleotides:
- **A** (Adenine)
- **C** (Cytosine)
- **G** (Guanine)
- **T** (Thymine)

Your tasks require computing various statistics that all fold over the sequence in different ways:

1. **Nucleotide frequency count** How many of each base?
2. **Longest homopolymer run** What is the longest consecutive sequence of the same base?
3. **GC-content** What fraction of bases are G or C?
4. **Complementary strand** Given one strand, produce the other (A↔T, C↔G)

## The Buddhist Monk's Mountain

A Buddhist monk begins climbing a mountain at dawn. He rests sometimes. He slips occasionally and falls back. Yet by dusk, he reaches the summit.

Consider this question: **What does the monk carry with him at each step?**

He carries:
- His accumulated exhaustion or energy
- His current altitude
- His understanding of the terrain ahead
- His intention to continue

At step i, his state is a **fold** of all previous steps. The journey is not just start and end it is every intermediate state, accumulated.

## The Reduce/Fold Concept

In functional programming, **reduce** (also called **fold**) takes a sequence and a function, and applies the function cumulatively:

```python
reduce(f, [a, b, c, d]) = f(f(f(a, b), c), d)
```

The function `f` takes two arguments:
1. The **accumulated state** (result of previous applications)
2. The **next element** from the sequence

And returns the **new accumulated state**.

## The Questions

1. **How do you count nucleotides using reduce?** What initial state and accumulator function would you use?

2. **How do you find the longest run?** At each step, what state must you maintain to detect runs?

3. **What is the relationship between map-reduce and the Buddhist monk's journey?** Is the monk's position the 'reduce' of his steps, or is there a 'map' phase too?

4. **Why is reduce considered a 'fold' operation?** What is being folded, and into what?

5. **How does reduce differ from a simple for loop?** If you can solve a problem with a for loop, why use reduce?

## The Philosophical Question

The Buddhist monk reaches the summit. Does his arrival **erase** the journey? Or is the journey **contained within** the arrival?

In reduce: the accumulated state at each step contains all previous steps' influence. The final value is not just the last element it is the **fold** of the entire sequence.

## Your Task

Using `functools.reduce` (or the `accumulate` function from itertools), implement:

1. A nucleotide counter using reduce
2. A longest-run finder using reduce
3. A GC-content calculator using reduce
4. A strand complement generator using reduce
5. A word frequency counter using reduce (for a text corpus)

Each should demonstrate the fold pattern: accumulate state through the sequence, producing a single result.