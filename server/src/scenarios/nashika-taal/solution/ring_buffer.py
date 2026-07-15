"""
The Nashika Taal Engine Solution: Ring Buffer
===============================================
Using collections.deque(maxlen=n) to keep only the last N beats.

In a live performance, the sound engineer cares about the last 100
beats, not beat #1 from three hours ago. A ring buffer (circular
buffer) holds exactly N items. When a new item arrives, the oldest
is automatically discarded.

collections.deque with a maxlen parameter provides this behaviour
natively in Python O(1) append, O(1) automatic eviction.

Real-world uses:
- Audio processing: keep the last N samples for real-time analysis
- Network monitoring: keep the last N packets for throughput calculation
- Log rotation: keep the last N log entries in memory
- Stock tickers: keep the last N price points for moving average
"""

from collections import deque
import sys


def demonstrate_ring_buffer():
    """Show how deque(maxlen=n) works as a ring buffer."""
    print("=" * 60)
    print("RING BUFFER collections.deque(maxlen=n)")
    print("=" * 60)

    # Create a ring buffer that holds the last 5 beats
    buffer = deque(maxlen=5)

    print(f"\nRing buffer created with maxlen=5")
    print(f"Initial state: {list(buffer)} (length: {len(buffer)})")

    # Add beats one by one watch the oldest get evicted
    for beat in range(1, 12):
        buffer.append({"beat": beat, "player1": beat % 2 == 0})
        evicted = "← oldest evicted!" if beat > 5 else ""
        print(f"  After beat {beat:2d}: {[b['beat'] for b in buffer]} {evicted}")

    print(f"\nFinal buffer: {[b['beat'] for b in buffer]}")
    print(f"The buffer NEVER exceeded 5 items.")
    print(f"Beats 1-6 were automatically discarded as new beats arrived.")


def simulate_with_ring_buffer(intervals: list, total_beats: int,
                              window_size: int = 100):
    """
    Simulate beats using a generator + ring buffer.

    The generator produces beats lazily (no memory for past beats).
    The ring buffer keeps only the last N beats (constant memory).
    Together, they process unlimited beats in bounded memory.

    This is the sound engineer's dashboard always showing the
    most recent window of activity.
    """
    print(f"\n{'='*60}")
    print(f"GENERATOR + RING BUFFER Bounded Memory Simulation")
    print(f"{'='*60}")

    # Ring buffer: keeps last `window_size` beats
    recent_beats = deque(maxlen=window_size)

    # Statistics computed on the fly (no storage needed)
    total_syncs = 0
    total_strikes = {i + 1: 0 for i in range(len(intervals))}

    # Generator: produces beats lazily
    def beat_gen():
        for beat in range(1, total_beats + 1):
            active = [i + 1 for i, iv in enumerate(intervals) if beat % iv == 0]
            yield beat, active

    # Process beats
    for beat_num, active_players in beat_gen():
        # Add to ring buffer (oldest auto-evicted if full)
        recent_beats.append({
            "beat": beat_num,
            "active": active_players,
            "is_sync": len(active_players) == len(intervals),
        })

        # Update running statistics
        for p in active_players:
            total_strikes[p] += 1
        if len(active_players) == len(intervals):
            total_syncs += 1

    # Report
    print(f"\n  Total beats processed: {total_beats:,}")
    print(f"  Ring buffer window: last {window_size} beats")
    print(f"  Total sync points: {total_syncs:,}")
    print(f"  Player strikes: {total_strikes}")

    # Show the last few beats in the window
    print(f"\n  Last 10 beats in the buffer:")
    for entry in list(recent_beats)[-10:]:
        active_str = f"Players {entry['active']}" if entry['active'] else "silence"
        sync_str = " ← SYNC!" if entry['is_sync'] else ""
        print(f"    Beat {entry['beat']:>8,}: {active_str}{sync_str}")

    # Memory analysis
    buffer_mem = sys.getsizeof(recent_beats)
    print(f"\n  Ring buffer memory: {buffer_mem} bytes")
    print(f"  This stays constant regardless of total beats processed.")

    return recent_beats


def analyze_recent_window(buffer: deque):
    """
    Analyze the ring buffer to detect rhythmic patterns.

    This is what the sound engineer does: look at recent history
    to assess performance quality.
    """
    print(f"\n{'='*60}")
    print(f"WINDOW ANALYSIS Sound Engineer's Dashboard")
    print(f"{'='*60}")

    window = list(buffer)
    if not window:
        print("  Buffer is empty.")
        return

    # Count syncs in the window
    syncs = [b for b in window if b["is_sync"]]
    sync_rate = len(syncs) / len(window) * 100

    # Count active beats per player
    player_activity = {}
    for b in window:
        for p in b["active"]:
            player_activity[p] = player_activity.get(p, 0) + 1

    # Detect gaps (consecutive beats with no strikes)
    max_gap = 0
    current_gap = 0
    for b in window:
        if not b["active"]:
            current_gap += 1
            max_gap = max(max_gap, current_gap)
        else:
            current_gap = 0

    print(f"  Window size: {len(window)} beats")
    print(f"  Sync points in window: {len(syncs)} ({sync_rate:.1f}%)")
    print(f"  Player activity:")
    for player, count in sorted(player_activity.items()):
        pct = count / len(window) * 100
        bar = "█" * int(pct / 5) + "░" * (20 - int(pct / 5))
        print(f"    Player {player}: {count:3d} strikes ({pct:5.1f}%) {bar}")
    print(f"  Longest silence gap: {max_gap} beats")


# ---------------------------------------------------------------------------
# Demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Basic ring buffer demo
    demonstrate_ring_buffer()

    # Full simulation with ring buffer
    buffer = simulate_with_ring_buffer(
        intervals=[2, 3, 5],
        total_beats=1_000_000,
        window_size=100,
    )

    # Analyze the window
    analyze_recent_window(buffer)

    # Memory comparison: ring buffer vs full list
    print(f"\n{'='*60}")
    print(f"MEMORY: Ring Buffer vs Full List")
    print(f"{'='*60}")

    for n in [100, 1_000, 10_000]:
        full_list = list(range(n))
        ring = deque(range(n), maxlen=100)  # Always keeps last 100

        list_size = sys.getsizeof(full_list)
        ring_size = sys.getsizeof(ring)

        print(f"  {n:>6,} items → List: {list_size:>8,} bytes | "
              f"Ring(100): {ring_size:>6,} bytes | "
              f"Saved: {(1 - ring_size/list_size)*100:.0f}%")

        del full_list
