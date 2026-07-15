"""
The Nashika Taal Engine Solution: Generator Version
=====================================================
This is the "internalise the rule" approach like a real Nashik Dhol
player who holds the taal pattern (the formula) and generates each beat
on demand, using almost no memory.

The key construct: yield

A function with yield is a generator function. When called, it returns
a generator object that produces values one at a time. The function's
state (local variables, position in loops) is preserved between calls.
"""

import math


def beat_generator(intervals: list, max_beats: int = None):
    """
    Generator function that yields one beat at a time.

    This is the TAAL the rule, not the data. It does not store
    a million beats in memory. It holds the formula and produces
    each beat only when asked via next() or a for loop.

    Parameters:
        intervals: list of beat intervals for each player [2, 3, 5]
        max_beats: optional limit on total beats (None = infinite)

    Yields:
        dict with beat number, active players, and sync flag
    """
    beat = 0

    # The while loop IS the taal cycle it runs as long as the
    # drummer keeps playing. The yield pauses execution at each beat,
    # exactly like a drummer pausing between strikes.
    while True:
        beat += 1

        if max_beats is not None and beat > max_beats:
            return  # The performance is over

        # Check which players are active on this beat
        active_players = [
            i + 1
            for i, interval in enumerate(intervals)
            if beat % interval == 0
        ]

        # yield pauses here and returns the value.
        # The function's entire state beat number, loop position,
        # local variables is frozen until next() is called again.
        yield {
            "beat": beat,
            "active_players": active_players,
            "is_sync": len(active_players) == len(intervals),
        }


def player_generator(player_id: int, interval: int, max_beats: int = None):
    """
    Generator for a single player's beat pattern.

    Yields only the beats where this player strikes.
    Silence (non-strike beats) are skipped the generator
    jumps directly to the next strike beat.
    """
    beat = interval  # First strike is at the interval
    while True:
        if max_beats is not None and beat > max_beats:
            return
        yield beat
        beat += interval


def sync_point_generator(intervals: list, max_beats: int = None):
    """
    Generator that yields only synchronisation points.

    Uses LCM to jump directly to sync beats no iteration through
    every single beat. This is the most efficient approach: compute
    only what you need.
    """
    lcm = intervals[0]
    for interval in intervals[1:]:
        lcm = math.lcm(lcm, interval)

    beat = lcm
    while True:
        if max_beats is not None and beat > max_beats:
            return
        yield beat
        beat += lcm


def demonstrate_generator_basics():
    """Show how generators work step by step."""
    print("=" * 50)
    print("GENERATOR BASICS How yield works")
    print("=" * 50)

    intervals = [2, 3, 5]
    gen = beat_generator(intervals, max_beats=30)

    # Calling beat_generator() does NOT execute the function.
    # It returns a generator object. The function body hasn't run yet.
    print(f"\nGenerator object: {gen}")
    print(f"Type: {type(gen)}")

    # next() executes the function until the next yield statement.
    print(f"\nCalling next() the drummer strikes:")
    for _ in range(10):
        beat = next(gen)
        active = beat["active_players"]
        marker = " ← SYNC!" if beat["is_sync"] else ""
        players = f"Players {active}" if active else "silence"
        print(f"  Beat {beat['beat']:3d}: {players}{marker}")

    # You can also iterate with a for loop it calls next() automatically.
    print(f"\nRemaining beats (via for loop):")
    for beat in gen:  # Continues from where next() left off!
        active = beat["active_players"]
        if active:
            marker = " ← SYNC!" if beat["is_sync"] else ""
            print(f"  Beat {beat['beat']:3d}: Players {active}{marker}")


def demonstrate_individual_players():
    """Show individual player generators."""
    print(f"\n{'='*50}")
    print("INDIVIDUAL PLAYER GENERATORS")
    print("=" * 50)

    intervals = [2, 3, 5]
    max_beats = 30

    for i, interval in enumerate(intervals):
        gen = player_generator(i + 1, interval, max_beats)
        beats = list(gen)  # Collect all strikes for display
        print(f"  Player {i+1} (every {interval} beats): {beats}")


def demonstrate_sync_generator():
    """Show the efficient sync point generator."""
    print(f"\n{'='*50}")
    print("SYNC POINT GENERATOR (LCM-based)")
    print("=" * 50)

    intervals = [2, 3, 5]

    # Get first 10 sync points
    gen = sync_point_generator(intervals)
    sync_points = [next(gen) for _ in range(10)]
    print(f"  Intervals: {intervals}")
    print(f"  LCM: {math.lcm(*intervals)}")
    print(f"  First 10 sync points: {sync_points}")


def simulate_million_beats():
    """Simulate 1,000,000 beats using the generator almost no memory."""
    print(f"\n{'='*50}")
    print("MILLION BEAT SIMULATION Generator Version")
    print("=" * 50)

    intervals = [2, 3, 5]
    num_beats = 1_000_000

    # The generator produces beats one at a time.
    # We process each beat and move on nothing is stored.
    gen = beat_generator(intervals, max_beats=num_beats)

    sync_count = 0
    player_counts = {1: 0, 2: 0, 3: 0}
    last_sync = 0

    for beat_data in gen:
        # Process this beat
        for player in beat_data["active_players"]:
            player_counts[player] += 1

        if beat_data["is_sync"]:
            sync_count += 1
            last_sync = beat_data["beat"]

    print(f"  Total beats processed: {num_beats:,}")
    print(f"  Sync points found: {sync_count:,}")
    print(f"  Last sync at beat: {last_sync:,}")
    print(f"  Player strikes: {player_counts}")
    print(f"\n  Memory used by generator: ~120 bytes")
    print(f"  Memory a list would need: ~{num_beats * 200 / 1024 / 1024:.0f} MB")
    print(f"  The drummer held the RULE, not the MILLION BEATS.")


# ---------------------------------------------------------------------------
# Generator chaining composing generators like taal layers
# ---------------------------------------------------------------------------

def compose_layers(intervals: list, max_beats: int):
    """
    Compose multiple player generators into a unified beat stream.

    This demonstrates generator chaining a technique used in
    data pipelines (Apache Beam, PySpark) to process data in stages
    without materialising intermediate results.
    """
    import heapq

    # Create a generator for each player
    player_gens = [
        ((beat, i + 1) for beat in player_generator(i + 1, interval, max_beats))
        for i, interval in enumerate(intervals)
    ]

    # Merge all player streams in beat order using heapq.merge
    for beat_num, player_id in heapq.merge(*player_gens):
        yield beat_num, player_id


# ---------------------------------------------------------------------------
# Demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    demonstrate_generator_basics()
    demonstrate_individual_players()
    demonstrate_sync_generator()
    simulate_million_beats()

    # Bonus: composed layers
    print(f"\n{'='*50}")
    print("COMPOSED LAYERS Merged player streams")
    print("=" * 50)
    print("  First 20 events (beat, player):")
    for i, (beat, player) in enumerate(compose_layers([2, 3, 5], 30)):
        print(f"    Beat {beat:3d}: Player {player}")
        if i >= 19:
            break
