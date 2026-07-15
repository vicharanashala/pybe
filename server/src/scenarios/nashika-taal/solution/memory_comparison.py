"""
The Nashika Taal Engine Solution: Memory Comparison
=====================================================
Direct, measurable comparison of list vs generator memory usage.

This is the empirical proof that holding the RULE (generator) is
vastly more memory-efficient than holding the DATA (list).

The Nashik Dhol analogy: a drummer's brain uses the same amount
of energy whether they play for 10 minutes or 3 hours because
they hold the pattern, not every individual beat. Similarly, a
generator uses the same amount of memory whether it yields 100
items or 100 million.
"""

import sys


def create_beat_list(num_beats: int) -> list:
    """Create a list storing all beat data."""
    return [
        {
            "beat": i,
            "p1": i % 2 == 0,
            "p2": i % 3 == 0,
            "p3": i % 5 == 0,
        }
        for i in range(1, num_beats + 1)
    ]


def create_beat_generator(num_beats: int):
    """Create a generator that yields beat data one at a time."""
    for i in range(1, num_beats + 1):
        yield {
            "beat": i,
            "p1": i % 2 == 0,
            "p2": i % 3 == 0,
            "p3": i % 5 == 0,
        }


def deep_getsizeof(obj, seen=None):
    """
    Recursively calculate the total memory of an object and all
    objects it references.

    sys.getsizeof() only returns the shallow size of the container.
    This function follows references to get the true total.
    """
    if seen is None:
        seen = set()

    obj_id = id(obj)
    if obj_id in seen:
        return 0
    seen.add(obj_id)

    size = sys.getsizeof(obj)

    if isinstance(obj, dict):
        size += sum(deep_getsizeof(k, seen) + deep_getsizeof(v, seen)
                    for k, v in obj.items())
    elif isinstance(obj, (list, tuple, set, frozenset)):
        size += sum(deep_getsizeof(item, seen) for item in obj)

    return size


def compare_memory():
    """Run the memory comparison across different scales."""
    print("=" * 65)
    print("MEMORY COMPARISON: List vs Generator")
    print("=" * 65)
    print(f"\n{'Beats':>12} {'List Size':>15} {'Generator Size':>15} {'Ratio':>10}")
    print("-" * 65)

    sizes = [100, 1_000, 10_000, 100_000]

    for n in sizes:
        # Create and measure the list
        beat_list = create_beat_list(n)
        list_size = deep_getsizeof(beat_list)

        # Create and measure the generator
        beat_gen = create_beat_generator(n)
        gen_size = sys.getsizeof(beat_gen)  # Generator is always small

        ratio = list_size / gen_size if gen_size > 0 else float('inf')

        list_str = format_bytes(list_size)
        gen_str = format_bytes(gen_size)

        print(f"{n:>12,} {list_str:>15} {gen_str:>15} {ratio:>9.0f}x")

        # Clean up the list to free memory
        del beat_list

    # Show the generator size stays constant
    print(f"\n{'='*65}")
    print("KEY INSIGHT: Generator size is CONSTANT regardless of data size")
    print("=" * 65)

    for n in [10, 1_000, 1_000_000, 100_000_000]:
        gen = create_beat_generator(n)
        size = sys.getsizeof(gen)
        print(f"  Generator for {n:>13,} beats: {size:>6} bytes")

    print(f"""
  ─────────────────────────────────────────────────────────────
  The list grows linearly with the number of beats.
  The generator stays the same size always.

  This is because the generator stores only:
  - The function's bytecode reference
  - The current state of local variables
  - The position in the code where it last yielded

  It does NOT store any of the values it has yielded or will yield.
  Each value is computed on the fly and discarded after use.

  The drummer holds the TAAL (pattern), not the MILLION BEATS.
  The generator holds the FORMULA (yield), not the MILLION VALUES.
  ─────────────────────────────────────────────────────────────
""")


def format_bytes(num_bytes: int) -> str:
    """Format bytes into human-readable string."""
    if num_bytes < 1024:
        return f"{num_bytes} B"
    elif num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    else:
        return f"{num_bytes / 1024 / 1024:.1f} MB"


def demonstrate_processing_equivalence():
    """
    Show that both approaches produce the same results.

    The output is identical only the memory footprint differs.
    """
    print("=" * 65)
    print("PROCESSING EQUIVALENCE Same results, different memory")
    print("=" * 65)

    num_beats = 100_000
    intervals = [2, 3, 5]

    # Count sync points using the list approach
    beat_list = create_beat_list(num_beats)
    list_syncs = sum(1 for b in beat_list if b["p1"] and b["p2"] and b["p3"])
    del beat_list

    # Count sync points using the generator approach
    beat_gen = create_beat_generator(num_beats)
    gen_syncs = sum(1 for b in beat_gen if b["p1"] and b["p2"] and b["p3"])

    print(f"\n  Beats processed: {num_beats:,}")
    print(f"  Sync points (list):      {list_syncs:,}")
    print(f"  Sync points (generator): {gen_syncs:,}")
    print(f"  Results match: {list_syncs == gen_syncs}")
    print(f"\n  Same computation. Same result. Different memory footprint.")


if __name__ == "__main__":
    compare_memory()
    demonstrate_processing_equivalence()
