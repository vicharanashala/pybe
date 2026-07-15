"""
iterative_decoder.py Optimized Iterative DNA Decoder
========================================================
Replaces recursion with collections.deque for O(1) popleft operations.
This version can process strands of ANY length without hitting Python's
recursion limit, and uses constant stack space.
"""

import sys
import time
from collections import deque

# Codon table (simplified)
CODON_TABLE = {
    'ATG': 'Met', 'TTT': 'Phe', 'TTC': 'Phe', 'TTA': 'Leu',
    'TTG': 'Leu', 'CTT': 'Leu', 'CTC': 'Leu', 'CTA': 'Leu',
    'CTG': 'Leu', 'ATT': 'Ile', 'ATC': 'Ile', 'ATA': 'Ile',
    'GTT': 'Val', 'GTC': 'Val', 'GTA': 'Val', 'GTG': 'Val',
    'GCT': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
    'GGT': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly',
    'TAA': 'STOP', 'TAG': 'STOP', 'TGA': 'STOP',
}


def get_complement_iterative(strand):
    """
    Iterative complement using deque.
    
    Why deque?
    - deque.popleft() is O(1), whereas list.pop(0) is O(n).
    - For a strand of 10,000 bases, this difference is dramatic.
    - deque also supports appendleft, making it ideal for queue-like processing.
    """
    base_pairs = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
    
    # Load all bases into a deque for efficient left-to-right consumption
    bases = deque(strand)
    complement = []
    
    # Process each base iteratively no stack frames accumulate
    while bases:
        base = bases.popleft()  # O(1) operation
        complement.append(base_pairs[base])
    
    return ''.join(complement)


def decode_codons_iterative(strand):
    """
    Iterative codon decoder using deque.
    
    Consumes 3 bases at a time from the deque, translates each codon,
    and stops at a stop codon or when fewer than 3 bases remain.
    """
    bases = deque(strand)
    protein_chain = []
    
    while len(bases) >= 3:
        # Pop 3 bases to form a codon
        codon = bases.popleft() + bases.popleft() + bases.popleft()
        amino_acid = CODON_TABLE.get(codon, '???')
        
        # Check for stop codon
        if amino_acid == 'STOP':
            print(f"  Codon '{codon}' → STOP. Translation halted.")
            break
        
        print(f"  Codon '{codon}' → {amino_acid}")
        protein_chain.append(amino_acid)
    
    return protein_chain


def benchmark_recursive_vs_iterative():
    """
    Compares performance of recursive vs iterative complement.
    The recursive version will crash on long strands; the iterative one won't.
    """
    print("=" * 60)
    print("  Benchmark: Recursive vs Iterative Complement")
    print("=" * 60)
    
    # Recursive version for comparison
    def get_complement_recursive(strand):
        if not strand:
            return ''
        base_pairs = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
        return base_pairs[strand[0]] + get_complement_recursive(strand[1:])
    
    test_sizes = [100, 500, 900]
    
    for size in test_sizes:
        strand = 'ATCG' * (size // 4)
        
        # Time recursive
        start = time.perf_counter()
        _ = get_complement_recursive(strand)
        recursive_time = time.perf_counter() - start
        
        # Time iterative
        start = time.perf_counter()
        _ = get_complement_iterative(strand)
        iterative_time = time.perf_counter() - start
        
        speedup = recursive_time / iterative_time if iterative_time > 0 else float('inf')
        print(f"\n  Strand length: {size}")
        print(f"    Recursive: {recursive_time * 1000:.3f} ms")
        print(f"    Iterative: {iterative_time * 1000:.3f} ms")
        print(f"    Speedup:   {speedup:.1f}x")
    
    # Now test beyond recursion limit
    print(f"\n  --- Beyond recursion limit ({sys.getrecursionlimit()}) ---")
    huge_strand = 'ATCG' * 5000  # 20,000 bases
    
    print(f"  Strand length: {len(huge_strand)}")
    
    try:
        get_complement_recursive(huge_strand)
        print("    Recursive: completed (unexpected!)")
    except RecursionError:
        print("    Recursive: ❌ RecursionError!")
    
    start = time.perf_counter()
    result = get_complement_iterative(huge_strand)
    elapsed = time.perf_counter() - start
    print(f"    Iterative: ✓ completed in {elapsed * 1000:.3f} ms")
    print(f"    Result length: {len(result)} bases")


if __name__ == '__main__':
    # --- Demo 1: Iterative complement ---
    dna = 'ATCGATCG'
    print("=== Iterative Complement (deque) ===")
    print(f"Original:   {dna}")
    print(f"Complement: {get_complement_iterative(dna)}")
    
    # --- Demo 2: Iterative codon decoding ---
    coding_strand = 'ATGTTTGCTTAA'
    print(f"\n=== Iterative Codon Decoder ===")
    print(f"Strand: {coding_strand}\n")
    protein = decode_codons_iterative(coding_strand)
    print(f"\nProtein chain: {' → '.join(protein)}")
    
    # --- Demo 3: Benchmark ---
    print()
    benchmark_recursive_vs_iterative()
