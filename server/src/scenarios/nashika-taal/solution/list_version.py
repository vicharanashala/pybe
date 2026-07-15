"""
The Nashika Taal Engine Solution: List Version (Naive Approach)
================================================================
This is the "memorise every beat" approach like a drummer who tries to
remember all million beats instead of internalising the rule.

It works for small sequences but demonstrates why storing everything
in a list is unsustainable for large simulations.
"""

import sys
import math


def find_sync_points_list(intervals: list, num_beats: int) -> list:
    """
    Find synchronisation points where ALL players strike together.

    The sync point is the LCM (Least Common Multiple) of all intervals.
    Using math.lcm for correctness, then verifying by brute force.

    Parameters:
        intervals: list of beat intervals for each player [2, 3, 5]
        num_beats: total number of beats to simulate

    Returns:
        list of beat numbers where all players strike simultaneously
    """
    # Calculate LCM of all intervals
    lcm = intervals[0]
    for interval in intervals[1:]:
        lcm = math.lcm(lcm, interval)

    print(f"Intervals: {intervals}")
    print(f"LCM (sync every {lcm} beats): confirmed mathematically")

    # Generate all sync points up to num_beats
    sync_points = list(range(lcm, num_beats + 1, lcm))

    print(f"First 10 sync points: {sync_points[:10]}")
    print(f"Total sync points in {num_beats:,} beats: {len(sync_points):,}")

    return sync_points


def simulate_beats_list(intervals: list, num_beats: int) -> list:
    """
    Simulate all beats by storing them in a list.

    For each beat, record which players are active.
    This stores EVERYTHING in memory the anti-pattern we'll fix later.

    Parameters:
        intervals: list of beat intervals for each player
        num_beats: total number of beats to simulate

    Returns:
        list of dicts, one per beat
    """
    print(f"\nSimulating {num_beats:,} beats using LIST approach...")
    print(f"Building complete beat list in memory...")

    beats = []
    for beat in range(1, num_beats + 1):
        active_players = []
        for i, interval in enumerate(intervals):
            if beat % interval == 0:
                active_players.append(i + 1)

        beats.append({
            "beat": beat,
            "active_players": active_players,
            "is_sync": len(active_players) == len(intervals),
        })

    return beats


def measure_memory(beats_list: list, num_beats: int):
    """
    Measure and report memory usage of the list approach.

    sys.getsizeof() returns the size of the container object itself.
    For a list, this doesn't include the size of the contained objects,
    so we need to add those too for an accurate picture.
    """
    # Size of the list container itself
    list_size = sys.getsizeof(beats_list)

    # Size of each dict in the list (sample from first 100)
    if beats_list:
        sample_sizes = [sys.getsizeof(beats_list[i]) for i in range(min(100, len(beats_list)))]
        avg_item_size = sum(sample_sizes) / len(sample_sizes)
        estimated_total = list_size + avg_item_size * len(beats_list)
    else:
        estimated_total = list_size

    print(f"\n{'='*50}")
    print(f"MEMORY REPORT List Approach")
    print(f"{'='*50}")
    print(f"  Number of beats stored: {num_beats:,}")
    print(f"  List container size:    {list_size:,} bytes ({list_size/1024/1024:.2f} MB)")
    print(f"  Avg item size:          {avg_item_size:.0f} bytes")
    print(f"  Estimated total:        {estimated_total:,.0f} bytes ({estimated_total/1024/1024:.2f} MB)")
    print(f"  64 MB limit:            {64 * 1024 * 1024:,} bytes")

    fits = estimated_total < 64 * 1024 * 1024
    print(f"  Fits in 64 MB?          {'YES ✓' if fits else 'NO ✗ MEMORY EXCEEDED'}")

    if not fits:
        print(f"\n  ⚠ The list approach CANNOT fit in 64 MB.")
        print(f"  ⚠ A drummer cannot memorise every beat of a 3-hour session.")
        print(f"  ⚠ We need the generator approach hold the RULE, not the DATA.")

    return estimated_total


# ---------------------------------------------------------------------------
# Demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    intervals = [2, 3, 5]

    # Task 1: Find sync points
    print("=" * 50)
    print("TASK 1: Synchronisation Points")
    print("=" * 50)
    sync_points = find_sync_points_list(intervals, 100)

    # Task 2: Simulate start small, then scale up
    for num_beats in [1_000, 10_000, 100_000, 1_000_000]:
        print(f"\n{'='*50}")
        print(f"SIMULATION: {num_beats:,} beats")
        print(f"{'='*50}")

        beats = simulate_beats_list(intervals, num_beats)
        total_mem = measure_memory(beats, num_beats)

        # Count some statistics
        sync_count = sum(1 for b in beats if b["is_sync"])
        print(f"  Sync beats (all 3 players): {sync_count:,}")

        # Clean up to free memory before next iteration
        del beats

        # Stop if we're getting too big
        if total_mem > 100 * 1024 * 1024:  # 100 MB safety limit
            print(f"\n  ⛔ Stopping memory usage too high for demonstration.")
            print(f"  ⛔ This is exactly why we need generators.")
            break
