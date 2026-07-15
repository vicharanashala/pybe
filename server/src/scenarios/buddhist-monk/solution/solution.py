"""
The Buddhist Monk Solution
=============================
Reduce, Fold, functools.reduce, and Cumulative Operations

This solution demonstrates how reduce/fold operations accumulate state
across a sequence, transforming a collection into a single value.

The Buddhist monk metaphor: at each step, the monk carries forward
his accumulated experience. The arrival is a fold of the journey,
not just the final step.
"""

from functools import reduce
from itertools import accumulate
from typing import Callable, Iterator, Dict, List, Tuple, Any
from collections import Counter, defaultdict
from operator import add, mul
import re


# ============================================================================
# PART 1: Understanding Reduce The Basic Pattern
# ============================================================================

print("=" * 70)
print("PART 1: Understanding Reduce")
print("=" * 70)

"""
reduce(function, iterable, initial_value)
    Applies function cumulatively to items:
    result = function(initial_value, items[0])
    result = function(result, items[1])
    ...
    return result

Visualization:
    reduce(f, [a, b, c, d], init)
        = f(f(f(f(init, a), b), c), d)
"""

# Simple example: sum
numbers = [1, 2, 3, 4, 5]

# Manual reduction
total = 0
for n in numbers:
    total = total + n
print(f"\nSum via for loop: {total}")

# Sum via reduce
total_reduce = reduce(add, numbers, 0)
print(f"Sum via reduce: {total_reduce}")

# Product via reduce
product_reduce = reduce(mul, numbers, 1)
print(f"Product via reduce: {product_reduce}")


# ============================================================================
# PART 2: The Buddhist Monk Model
# ============================================================================

print("\n" + "=" * 70)
print("PART 2: The Buddhist Monk Model")
print("=" * 70)

"""
The monk's position at step n is a fold of all previous steps:
    position[n] = f(position[n-1], step[n])

Similarly, reduce accumulates state through a sequence.
"""

def simulate_monk_climb(steps: List[int]) -> List[int]:
    """
    Simulate the monk's position through each step.
    Each step is a vertical gain (positive) or loss (negative).
    """
    positions = list(accumulate(steps, add, initial=0))
    return positions


mountain_steps = [
    100,   # Step 1: gain 100m
    -20,   # Step 2: slip back 20m
    80,    # Step 3: gain 80m
    50,    # Step 4: gain 50m
    -30,   # Step 5: slide back
    120,   # Step 6: final push
    0,     # Step 7: rest
    40     # Step 8: reach summit
]

positions = simulate_monk_climb(mountain_steps)
print("\nMonk's climb progression:")
print(f"  Steps: {mountain_steps}")
print(f"  Positions: {positions}")
print(f"  Summit reached: {positions[-1]}m")


def fold_summary(values: List[int], operation: Callable) -> Any:
    """Generic fold operation demonstrates the pattern."""
    return reduce(operation, values)

print(f"\nFold operations on positions:")
print(f"  Sum: {fold_summary(positions[1:], add)}")
print(f"  Max: {fold_summary(positions[1:], lambda a, b: a if a > b else b)}")


# ============================================================================
# PART 3: DNA Sequence Analysis with Reduce
# ============================================================================

print("\n" + "=" * 70)
print("PART 3: DNA Sequence Analysis Nucleotide Counter")
print("=" * 70)

"""
Task: Count occurrences of each nucleotide in a DNA sequence.
This is a classic fold operation.
"""

DNA_COMPLEMENT = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
VALID_NUCLEOTIDES = set('ACGT')

dna_sequence = "ACCGTAGCTTAGGCATCGATCGATCGCTAGCTAGCATCGTAGCGTACG"


def count_nucleotides_reduce(sequence: str) -> Dict[str, int]:
    """
    Count nucleotides using reduce.

    Initial state: {'A': 0, 'C': 0, 'G': 0, 'T': 0}
    At each base: increment the count for that base
    """
    initial_state = {'A': 0, 'C': 0, 'G': 0, 'T': 0}

    def update_counts(counts: Dict[str, int], nucleotide: str) -> Dict[str, int]:
        counts = counts.copy()  # Immutable update
        if nucleotide in VALID_NUCLEOTIDES:
            counts[nucleotide] += 1
        return counts

    return reduce(update_counts, sequence, initial_state)


def count_nucleotides_counter(sequence: str) -> Counter:
    """Count nucleotides using Counter built-in reduce."""
    return Counter(sequence)


print(f"\nDNA Sequence: {dna_sequence}")
print(f"\nNucleotide counts (via reduce): {count_nucleotides_reduce(dna_sequence)}")
print(f"Nucleotide counts (via Counter): {count_nucleotides_counter(dna_sequence)}")


# ============================================================================
# PART 4: Longest Homopolymer Run Stateful Reduce
# ============================================================================

print("\n" + "=" * 70)
print("PART 4: Longest Homopolymer Run")
print("=" * 70)

"""
Task: Find the longest consecutive run of the same nucleotide.
Requires tracking: (current_run_char, current_run_length, max_run)
"""

def find_longest_run(sequence: str) -> Tuple[str, int]:
    """
    Find the longest run of identical characters.

    State: (run_char, run_length, max_char, max_length)
    """
    initial_state = ('', 0, '', 0)

    def update(state: Tuple, nucleotide: str) -> Tuple:
        run_char, run_length, max_char, max_length = state

        if nucleotide not in VALID_NUCLEOTIDES:
            return state

        if nucleotide == run_char:
            # Continue the run
            new_run_length = run_length + 1
        else:
            # Start new run
            new_run_length = 1
            run_char = nucleotide

        # Update max if needed
        if new_run_length > max_length:
            return (nucleotide, new_run_length, nucleotide, new_run_length)
        else:
            return (nucleotide, new_run_length, max_char, max_length)

    final_state = reduce(update, sequence, initial_state)
    return (final_state[2], final_state[3])  # (max_char, max_length)


longest_char, longest_length = find_longest_run(dna_sequence)
print(f"\nLongest run: '{longest_char}' repeated {longest_length} times")


# ============================================================================
# PART 5: GC Content Ratio Fold
# ============================================================================

print("\n" + "=" * 70)
print("PART 5: GC Content Calculation")
print("=" * 70)

"""
Task: Calculate GC content fraction of G+C bases.
Expresses as ratio, computed via reduce.
"""

def calculate_gc_content(sequence: str) -> float:
    """
    Calculate GC content using reduce.

    State: (gc_count, total_count)
    Returns: gc_count / total_count
    """
    initial_state = (0, 0)

    def update(state: Tuple[int, int], nucleotide: str) -> Tuple[int, int]:
        gc_count, total = state
        if nucleotide in VALID_NUCLEOTIDES:
            total += 1
            if nucleotide in 'GC':
                gc_count += 1
        return (gc_count, total)

    gc_count, total = reduce(update, sequence, initial_state)

    if total == 0:
        return 0.0
    return gc_count / total


gc_ratio = calculate_gc_content(dna_sequence)
print(f"\nGC Content: {gc_ratio:.2%}")
print(f"  (G+C count: {Counter(dna_sequence)['G'] + Counter(dna_sequence)['C']}, "
      f"Total valid: {Counter(c for c in dna_sequence if c in VALID_NUCLEOTIDES)})")


# ============================================================================
# PART 6: Complementary Strand Transform Fold
# ============================================================================

print("\n" + "=" * 70)
print("PART 6: Complementary DNA Strand")
print("=" * 70)

"""
Task: Generate the complementary strand.
A pairs with T, C pairs with G.
"""

def complementary_strand(sequence: str) -> str:
    """
    Generate complementary strand using reduce.

    State: accumulated_complement
    Each base: append its complement
    """
    return reduce(lambda acc, base: acc + DNA_COMPLEMENT.get(base, base),
                  sequence, "")


def complementary_strand_join(sequence: str) -> str:
    """Using join with generator more Pythonic."""
    return ''.join(DNA_COMPLEMENT.get(base, base) for base in sequence)


original = "ACCGTAGCT"
complement = complementary_strand(original)
print(f"\nOriginal:  {original}")
print(f"Complement: {complement}")


# ============================================================================
# PART 7: Word Frequency Reduce on Text
# ============================================================================

print("\n" + "=" * 70)
print("PART 7: Word Frequency with Reduce")
print("=" * 70)

text_corpus = """
The Buddhist monk climbs the mountain
The mountain stands eternal and still
The monk changes yet the mountain remains
Enlightenment comes to those who climb
""".lower()

words = re.findall(r'\b[a-z]+\b', text_corpus)


def word_frequency_reduce(words: List[str]) -> Dict[str, int]:
    """Count word frequencies using reduce."""
    return reduce(
        lambda acc, word: {**acc, word: acc.get(word, 0) + 1},
        words,
        {}
    )


def word_frequency_counter(words: List[str]) -> Counter:
    """Count using Counter built-in."""
    return Counter(words)


print(f"\nText: {text_corpus.strip()[:60]}...")
print(f"\nWord frequencies (via reduce): {word_frequency_reduce(words)}")
print(f"Word frequencies (via Counter): {dict(word_frequency_counter(words))}")


# ============================================================================
# PART 8: The Map-Reduce Pattern
# ============================================================================

print("\n" + "=" * 70)
print("PART 8: Map-Reduce Pattern")
print("=" * 70)

"""
Map-Reduce has two phases:
1. MAP: Transform each element independently
2. REDUCE: Fold the transformed elements into a result

The Buddhist monk's journey:
- MAP: Each step is taken (the terrain is encountered)
- REDUCE: The positions are accumulated into the final position

Let's implement a word count with map-reduce:
"""

sentences = [
    "the monk climbs the mountain",
    "the mountain is high",
    "the monk reaches the summit"
]

# MAP: split each sentence into (word, 1) pairs
def map_phase(sentences: List[str]) -> List[Tuple[str, int]]:
    pairs = []
    for sentence in sentences:
        for word in sentence.split():
            pairs.append((word.lower(), 1))
    return pairs


# REDUCE: fold (word, count) pairs into word frequency dict
def reduce_phase(pairs: List[Tuple[str, int]]) -> Dict[str, int]:
    def fold_fn(acc: Dict, pair: Tuple[str, int]) -> Dict:
        word, count = pair
        acc[word] = acc.get(word, 0) + count
        return acc

    return reduce(fold_fn, pairs, {})


def map_reduce_word_count(sentences: List[str]) -> Dict[str, int]:
    """Complete map-reduce word count."""
    pairs = map_phase(sentences)
    return reduce_phase(pairs)


mapped = map_phase(sentences)
reduced = map_reduce_word_count(sentences)

print("\nMap-Reduce Word Count:")
print(f"  Sentences: {sentences}")
print(f"  Mapped pairs: {mapped}")
print(f"  Reduced counts: {reduced}")


# ============================================================================
# PART 9: Accumulate Lazy Reduce
# ============================================================================

print("\n" + "=" * 70)
print("PART 9: itertools.accumulate Lazy Folding")
print("=" * 70)

"""
accumulate() is like reduce() but returns all intermediate results.
Useful when you want to see the fold progress, not just the final value.
"""

numbers = [1, 2, 3, 4, 5]

# reduce() returns only final result
final_sum = reduce(add, numbers)
print(f"\nreduce(add, [1,2,3,4,5]) = {final_sum}")

# accumulate() returns all intermediate results
running_totals = list(accumulate(numbers, add))
print(f"accumulate(add, [1,2,3,4,5]) = {running_totals}")


def running_max(seq: List[int]) -> List[int]:
    """Running maximum using accumulate."""
    return list(accumulate(seq, lambda a, b: a if a > b else b))


nums = [3, 1, 4, 1, 5, 9, 2, 6]
print(f"\nRunning max of {nums}: {running_max(nums)}")


# ============================================================================
# PART 10: Group By Reduce into Collections
# ============================================================================

print("\n" + "=" * 70)
print("PART 10: Group By with Reduce")
print("=" * 70)

"""
Group items by some key using reduce.
"""

people = [
    {'name': 'Alice', 'domain': 'Biology'},
    {'name': 'Bob', 'domain': 'Music'},
    {'name': 'Carol', 'domain': 'Biology'},
    {'name': 'Dave', 'domain': 'Philosophy'},
    {'name': 'Eve', 'domain': 'Music'},
]


def group_by_domain(people: List[Dict]) -> Dict[str, List[str]]:
    """
    Group people by their domain using reduce.

    State: {domain: [list of names]}
    """
    def fold_fn(groups: Dict[str, List], person: Dict) -> Dict[str, List]:
        domain = person['domain']
        if domain not in groups:
            groups[domain] = []
        groups[domain].append(person['name'])
        return groups

    return reduce(fold_fn, people, {})


def group_by_key(items: List[Dict], key: str) -> Dict[str, List]:
    """Generalized group-by using reduce."""
    return reduce(
        lambda acc, item: {**acc, key: [*acc.get(key, []), item['name']]},
        items,
        {}
    )


grouped = group_by_domain(people)
print("\nPeople grouped by domain:")
for domain, names in grouped.items():
    print(f"  {domain}: {names}")


# ============================================================================
# PART 11: Complex State Folding Multiple Accumulators
# ============================================================================

print("\n" + "=" * 70)
print("PART 11: Multiple Accumulators")
print("=" * 70)

"""
Sometimes you need to track multiple values in the fold.
Return a tuple or namedtuple to accumulate multiple states.
"""

from collections import namedtuple

Stats = namedtuple('Stats', ['count', 'total', 'min', 'max'])


def running_statistics(numbers: List[float]) -> Stats:
    """
    Compute running statistics using reduce.
    Tracks: count, sum, min, max simultaneously.
    """
    def update(stats: Stats, num: float) -> Stats:
        return Stats(
            count=stats.count + 1,
            total=stats.total + num,
            min=min(stats.min, num) if stats.count > 0 else num,
            max=max(stats.max, num) if stats.count > 0 else num
        )

    return reduce(update, numbers, Stats(0, 0.0, float('inf'), float('-inf')))


test_scores = [85, 92, 78, 95, 88, 73, 91]
stats = running_statistics(test_scores)

print(f"\nTest scores: {test_scores}")
print(f"Statistics: count={stats.count}, sum={stats.total}, "
      f"min={stats.min}, max={stats.max}, avg={stats.total/stats.count:.1f}")


# ============================================================================
# The Buddhist Lesson
# ============================================================================

print("\n" + "=" * 70)
print("THE BUDDHIST MONK'S LESSON")
print("=" * 70)

print("""
The Buddhist monk climbs the mountain.

At each step, he carries forward:
- His accumulated exhaustion or energy
- His position (altitude)
- His understanding of the terrain
- His intention to continue

This is reduce: the journey folded into arrival.

Key insights from reduce/fold:

1. CUMULATIVE STATE
   At each step, the accumulator contains all previous transformations.
   The journey is not lost in the arrival.

2. THE FOLD METAPHOR
   reduce(f, [a, b, c, d]) = f(f(f(a, b), c), d)
   Each element folds into the next, carrying the accumulated state.

3. MAP-REDUCE
   MAP: transform each element independently
   REDUCE: fold all transformed elements into final result
   Like the monk's individual steps (map) and final position (reduce).

4. IMMUTABLE ACCUMULATION
   Each fold creates new state. The previous state is preserved in the new.
   This is functional programming's approach to state.

5. MULTIPLE ACCUMULATORS
   You can track multiple values simultaneously by accumulating a tuple.
   The monk simultaneously tracks position, energy, and wisdom.

6. LAZY ACCUMULATION
   itertools.accumulate() returns all intermediate results.
   See the journey, not just the arrival.

The mountain is the sequence. The monk is reduce.
The summit is the final folded state, containing the entire journey.
""")


# ============================================================================
# Demonstration
# ============================================================================

if __name__ == "__main__":
    print("\n" + "#" * 70)
    print("RUNNING DEMONSTRATION")
    print("#" * 70)

    # DNA analysis
    dna = "ACGTACGTACGT"
    print(f"\nDNA analysis of {dna}:")
    print(f"  Counts: {count_nucleotides_reduce(dna)}")
    print(f"  GC Content: {calculate_gc_content(dna):.1%}")
    print(f"  Complement: {complementary_strand(dna)}")
    print(f"  Longest run: {find_longest_run(dna)}")

    # Map-reduce
    sentences = ["hello world", "hello python", "world of python"]
    print(f"\nMap-reduce on {sentences}:")
    print(f"  Word counts: {map_reduce_word_count(sentences)}")