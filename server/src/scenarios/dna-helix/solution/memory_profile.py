"""
memory_profile.py Stack Frame Memory Growth Profiler
=======================================================
Uses tracemalloc to measure how memory grows with each recursive call.
Each function invocation adds a stack frame, consuming memory for local
variables, return addresses, and the call itself. This script makes
that invisible cost visible.
"""

import tracemalloc
import sys


def get_complement_recursive(strand):
    """Recursive complement each call adds a stack frame."""
    if not strand:
        return ''
    base_pairs = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
    return base_pairs[strand[0]] + get_complement_recursive(strand[1:])


def measure_recursive_memory(strand_length):
    """
    Measures peak memory usage for a recursive complement call
    on a strand of given length. Returns (peak_bytes, result_length).
    """
    strand = 'A' * strand_length

    # Start tracing memory allocations
    tracemalloc.start()

    # Reset the peak to get an accurate measurement for just this call
    tracemalloc.reset_peak()

    result = get_complement_recursive(strand)

    # Capture current and peak memory usage
    current, peak = tracemalloc.get_traced_memory()

    tracemalloc.stop()

    return peak, len(result)


def profile_memory_growth():
    """
    Profiles memory usage across increasing strand lengths.
    Demonstrates that recursive memory grows linearly with depth.
    """
    print("=" * 60)
    print("  Recursive DNA Decoder Memory Growth Profile")
    print("=" * 60)
    print(f"  Python recursion limit: {sys.getrecursionlimit()}")
    print()

    # Test with progressively larger strands
    # (stay well below the recursion limit)
    sizes = [10, 50, 100, 200, 500, 800]

    print(f"{'Strand Length':<15} {'Peak Memory (KB)':<20} {'Bytes/Frame (est)':<20}")
    print("-" * 55)

    prev_peak = 0
    prev_size = 0

    for size in sizes:
        peak, _ = measure_recursive_memory(size)
        peak_kb = peak / 1024

        # Estimate bytes per stack frame from the delta
        if prev_size > 0:
            delta_bytes = peak - prev_peak
            delta_frames = size - prev_size
            bytes_per_frame = delta_bytes / delta_frames if delta_frames else 0
            print(f"{size:<15} {peak_kb:<20.2f} {bytes_per_frame:<20.1f}")
        else:
            print(f"{size:<15} {peak_kb:<20.2f} {'(baseline)':<20}")

        prev_peak = peak
        prev_size = size

    print()
    print("KEY INSIGHT: Memory grows roughly linearly with recursion depth.")
    print("Each stack frame costs ~hundreds of bytes for local variables,")
    print("the partial string slice, and Python's internal frame bookkeeping.")


def compare_with_iterative():
    """
    Shows that an iterative version uses constant stack memory
    regardless of input size.
    """
    print()
    print("=" * 60)
    print("  Iterative Comparison Constant Stack Memory")
    print("=" * 60)
    print()

    def get_complement_iterative(strand):
        """Iterative complement no stack frame growth."""
        base_pairs = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
        return ''.join(base_pairs[b] for b in strand)

    sizes = [10, 50, 100, 200, 500, 800]

    print(f"{'Strand Length':<15} {'Peak Memory (KB)':<20}")
    print("-" * 35)

    for size in sizes:
        strand = 'A' * size

        tracemalloc.start()
        tracemalloc.reset_peak()

        _ = get_complement_iterative(strand)

        _, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        print(f"{size:<15} {peak / 1024:<20.2f}")

    print()
    print("KEY INSIGHT: Iterative version uses roughly constant memory")
    print("because it doesn't accumulate stack frames.")


if __name__ == '__main__':
    profile_memory_growth()
    compare_with_iterative()
