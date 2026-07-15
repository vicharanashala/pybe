"""
The DNA Helix: Recursive DNA Complement with Call Stack Limits
==============================================================

Scenario: You need to write a recursive function to compute the complementary
DNA strand. If given 'ATCG', it should return 'TAGC'. Explore what happens when
you process a massive DNA sequence that exceeds the recursion limit.

This solution demonstrates:
- Recursive function definition and call stack mechanics
- Base case: The termination condition that prevents infinite recursion
- sys.setrecursionlimit(): Adjusting the maximum stack depth
- RecursionError: What happens when the stack overflows
- How nature's recursive patterns (DNA helix copying) map to code

In biology, a DNA sequence can be viewed recursively: a base pair followed by
the rest of the sequence. A recursive function calls itself to solve smaller
instances of the same problem. Each call pushes a new frame onto the call stack.
Without a base case, the stack grows until memory is exhausted - stack overflow.
"""

import sys
from typing import Optional


class DNAComplementCalculator:
    """
    Models DNA transcription using recursion.

    In DNA, adenine (A) pairs with thymine (T), and guanine (G) pairs with
    cytosine (C). The complement of 'ATGC' is 'TACG'.

    This class demonstrates:
    - Base case: Empty string returns empty string
    - Recursive case: Return complement of first char + complement of rest
    - Call stack: Each recursive call adds a frame to the stack
    """

    # DNA base pair complement mapping
    COMPLEMENT = str.maketrans('ATGC', 'TACG')

    def __init__(self):
        self.call_count = 0  # Track number of recursive calls

    def complement_recursive(self, dna: str) -> str:
        """
        Compute DNA complement recursively.

        The recursive strategy:
        1. Base case: If string is empty, return empty string
        2. Recursive case: Complement the first character,
           then recursively complement the rest

        Each call adds a frame to the call stack:
        complement_recursive('ATCG')
        └─ complement('A') + complement_recursive('TCG')
                                └─ complement('T') + complement_recursive('CG')
                                                        └─ complement('C') + complement_recursive('G')
                                                                                └─ complement('G') + complement_recursive('')
                                                                                                        └─ returns '' (base case)

        Args:
            dna: The DNA sequence to complement

        Returns:
            The complementary DNA sequence

        Raises:
            RecursionError: If sequence is too long for the call stack
        """
        self.call_count += 1

        # BASE CASE: The foundation of all recursion.
        # Without this, we would recurse forever (until stack overflow).
        # In DNA replication, the base case is when polymerase reaches
        # the end of the chromosome - it stops adding nucleotides.
        if not dna:
            return ""

        # RECURSIVE CASE: Process first character, then recurse on remainder.
        # This is analogous to how DNA helicase unzips the double helix:
        # it processes one base pair at a time, moving forward as it goes.
        first_base = dna[0]
        rest_of_sequence = dna[1:]

        # Look up the complement using our mapping
        # A ↔ T, G ↔ C
        complement_base = first_base.translate(self.COMPLEMENT)

        # Recursive call: Process the rest of the sequence.
        # This is the "recursive step" - we call ourselves with
        # a smaller problem (shorter string).
        rest_complement = self.complement_recursive(rest_of_sequence)

        # Combine: This base's complement + rest of sequence's complement
        # As the recursion unwinds, each call combines its result with
        # the results from deeper calls, building the final string.
        return complement_base + rest_complement

    def complement_iterative(self, dna: str) -> str:
        """
        Iterative version for comparison - no recursion, no stack growth.

        The iterative approach uses a loop instead of recursive calls.
        It builds the result string from left to right, maintaining a
        running result. This avoids stack overflow entirely.

        In nature, DNA polymerase uses an iterative approach - it doesn't
        spawn "child polymerases" to process the rest of the strand!

        Args:
            dna: The DNA sequence to complement

        Returns:
            The complementary DNA sequence
        """
        result = []
        for base in dna:
            result.append(base.translate(self.COMPLEMENT))
        return ''.join(result)

    def reset_count(self):
        """Reset the call counter for fresh measurements."""
        self.call_count = 0


def demonstrate_recursion_limit():
    """
    Explore the physical limits of the call stack.

    Python's call stack is finite. sys.getrecursionlimit() returns the maximum
    depth. sys.setrecursionlimit() can increase it, but there's a physical
    limit based on your system's memory and C stack size.

    This is why recursive algorithms must have:
    1. A proper base case
    2. Progress toward that base case
    3. Awareness of stack limits for large inputs
    """
    print("\n" + "=" * 60)
    print("RECURSION LIMIT EXPLORATION")
    print("=" * 60)

    # Show current recursion limit
    current_limit = sys.getrecursionlimit()
    print(f"\nCurrent recursion limit: {current_limit}")

    # Default is typically 1000 - sufficient for most algorithms
    # but not for processing entire chromosomes

    # Demonstrate what happens with deep recursion
    calculator = DNAComplementCalculator()

    # Test with reasonable sequence length
    test_sequence = "ATGC" * 100  # 400 bases
    calculator.reset_count()
    result = calculator.complement_recursive(test_sequence)
    print(f"\nSequence length: {len(test_sequence)} bases")
    print(f"Recursion depth (calls made): {calculator.call_count}")
    print(f"Expected result length: {len(result)}")
    print(f"First 20 chars: {result[:20]}...")

    # Now try with a sequence that approaches the limit
    # This would cause RecursionError without careful handling
    very_long_sequence = "ATGC" * 250  # 1000 bases - at the limit

    print(f"\n[Attempting to process {len(very_long_sequence)} bases...]")
    calculator.reset_count()
    try:
        # Temporarily lower the limit to demonstrate RecursionError
        # (Lowering makes it easier to trigger without actually using lots of memory)
        original_limit = sys.getrecursionlimit()
        sys.setrecursionlimit(500)  # Set lower than our sequence length

        result = calculator.complement_recursive(very_long_sequence)
        print(f"Success! Processed {calculator.call_count} calls")

    except RecursionError as e:
        print(f"\n[RecursionError caught!]")
        print(f"  The call stack exceeded {sys.getrecursionlimit()} frames.")
        print(f"  This is the 'stack overflow' that occurs in deep recursion.")
        print(f"  In biological terms: the replication machinery ran out of")
        print(f"  'cellular resources' before completing the chromosome.")

    finally:
        # Restore original limit
        sys.setrecursionlimit(original_limit)


def demonstrate_biological_mapping():
    """
    Show how recursive function mechanics map to DNA replication.

    DNA replication is inherently recursive in concept:
    - Helicase unwinds the double helix
    - Primase creates a starting point (like our base case)
    - DNA polymerase adds nucleotides in sequence (like our recursive calls)
    - The process continues until the entire chromosome is copied

    The key insight: Nature uses recursion because it's elegant and efficient.
    But nature also has safeguards (termination signals, enzyme limits) just
    like our code has base cases and stack limits.
    """
    print("\n" + "=" * 60)
    print("BIOLOGICAL MAPPING: DNA Replication as Recursion")
    print("=" * 60)

    calculator = DNAComplementCalculator()

    # Simple example to trace through
    dna = "ATCG"
    print(f"\nInput DNA:  {dna}")
    print(f"Complement: {calculator.complement_recursive(dna)}")

    print("\n[Call Stack Trace for 'ATCG']")
    print("  complement_recursive('ATCG')")
    print("    ├─ returns complement('A') + complement_recursive('TCG')")
    print("    │                           ├─ returns complement('T') + complement_recursive('CG')")
    print("    │                           │                             ├─ returns complement('C') + complement_recursive('G')")
    print("    │                           │                             │   ├─ returns complement('G') + complement_recursive('')")
    print("    │                           │                             │   │   └─ BASE CASE: returns ''")
    print("    │                           │                             │   └─ returns 'C' + '' = 'C'")
    print("    │                           │                             └─ returns 'G' + 'C' = 'GC'")
    print("    │                           └─ returns 'A' + 'GC' = 'AGC'")
    print("    └─ returns 'T' + 'AGC' = 'TAGC'")

    print("\n[Unwinding the Recursion]")
    print("  complement_recursive('')     = ''       (base case)")
    print("  complement_recursive('G')    = 'C' + '' = 'C'")
    print("  complement_recursive('CG')   = 'G' + 'C' = 'GC'")
    print("  complement_recursive('TCG')  = 'A' + 'GC' = 'AGC'")
    print("  complement_recursive('ATCG') = 'T' + 'AGC' = 'TAGC'")


def compare_iterative_vs_recursive():
    """
    Compare recursive and iterative approaches.

    Python doesn't have tail-call optimization, so deep recursion is
    dangerous. Real-world systems often translate recursive logic
    to iterative loops to prevent stack overflow.
    """
    print("\n" + "=" * 60)
    print("RECURSIVE vs ITERATIVE: Performance Comparison")
    print("=" * 60)

    calculator = DNAComplementCalculator()

    test_sizes = [100, 500, 1000, 2000]

    for size in test_sizes:
        dna = "ATGC" * size

        # Recursive approach
        calculator.reset_count()
        import time
        start = time.time()
        result_recursive = calculator.complement_recursive(dna)
        time_recursive = time.time() - start

        # Iterative approach
        start = time.time()
        result_iterative = calculator.complement_iterative(dna)
        time_iterative = time.time() - start

        print(f"\n{size * 4} bases:")
        print(f"  Recursive: {calculator.call_count} calls, {time_recursive*1000:.3f}ms")
        print(f"  Iterative: {size * 4} loop iterations, {time_iterative*1000:.3f}ms")
        print(f"  Results match: {result_recursive == result_iterative}")


if __name__ == "__main__":
    print("DNA Helix - Recursive Complement Simulation")
    print("=" * 60)

    # Core demonstration
    demonstrate_biological_mapping()

    # Explore stack limits
    demonstrate_recursion_limit()

    # Compare approaches
    compare_iterative_vs_recursive()

    print("\n" + "=" * 60)
    print("KEY INSIGHTS")
    print("=" * 60)
    print("""
1. BASE CASE: Every recursive function needs a termination condition.
   DNA replication has termination signals. Our code has `if not dna: return ""`.

2. CALL STACK: Each recursive call uses stack memory. Python's default
   limit is ~1000 calls. A human chromosome has ~3 billion base pairs.

3. RECURSION ERROR: When the stack exceeds its limit, Python raises
   RecursionError. Nature has similar resource constraints.

4. ITERATIVE ALTERNATIVE: For large inputs, use iteration to avoid
   stack overflow. Python doesn't have tail-call optimization, so
   real-world systems often convert recursion to loops.

5. ELEGANCE vs EFFICIENCY: Recursive solutions are often more elegant
   and mirror the problem's natural structure. But they must respect
   physical hardware limitations.
    """)