"""
The Nashika Taal Engine Solution: Threading Demo
===================================================
Three Dhol players performing simultaneously, synchronising at
convergence points using threading.Event.

In a live Nashik Dhol performance, players don't take turns.
They play at the same time, each following their own interval,
and they align at the sam (the first beat of the taal cycle).

In Python, threading allows multiple functions to execute
concurrently. threading.Event provides the synchronisation
mechanism one thread signals, others wait.

Note: Python's GIL means threads don't truly run in parallel
for CPU-bound work, but for I/O-bound or simulation work
(which this is), threading is appropriate and idiomatic.
"""

import threading
import time
import math


class DholPlayer:
    """
    A Dhol player that runs as an independent thread.

    Each player has their own interval and plays beats independently.
    At synchronisation points (LCM beats), all players must align
    before continuing just like in a real ensemble.
    """

    def __init__(self, player_id: int, interval: int, max_beats: int,
                 sync_barrier: threading.Barrier, results: list,
                 results_lock: threading.Lock):
        self.player_id = player_id
        self.interval = interval
        self.max_beats = max_beats
        self.sync_barrier = sync_barrier
        self.results = results
        self.results_lock = results_lock
        self.beats_played = 0
        self.thread = threading.Thread(
            target=self._play,
            name=f"Player-{player_id}",
            daemon=True,
        )

    def start(self):
        """Start the player's thread."""
        self.thread.start()

    def join(self):
        """Wait for the player's thread to finish."""
        self.thread.join()

    def _play(self):
        """
        The player's main loop runs in its own thread.

        The player processes beats from 1 to max_beats.
        On beats where their interval divides evenly, they "strike."
        At sync points (LCM beats), they wait at the barrier for
        all other players to catch up.
        """
        lcm = self.sync_barrier._parties  # We'll compute this externally
        # Recalculate LCM from the outside stored in the shared state
        sync_interval = getattr(self.sync_barrier, '_sync_interval', 30)

        for beat in range(1, self.max_beats + 1):
            # Check if this player strikes on this beat
            if beat % self.interval == 0:
                self.beats_played += 1

                # Record the strike (thread-safe via lock)
                with self.results_lock:
                    self.results.append({
                        "beat": beat,
                        "player": self.player_id,
                        "time": time.perf_counter(),
                    })

            # At sync points, wait for all players to align
            if beat % sync_interval == 0:
                try:
                    self.sync_barrier.wait(timeout=5.0)
                except threading.BrokenBarrierError:
                    print(f"  [Player {self.player_id}] Barrier broken at beat {beat}")
                    return


def run_ensemble_simulation(intervals: list, max_beats: int):
    """
    Run a threaded simulation of the Dhol ensemble.

    Each player runs in its own thread. They synchronise at LCM points
    using a threading.Barrier (all must arrive before any can proceed).
    """
    num_players = len(intervals)

    # Calculate LCM for sync points
    lcm = intervals[0]
    for interval in intervals[1:]:
        lcm = math.lcm(lcm, interval)

    print(f"{'='*60}")
    print(f"THREADED ENSEMBLE SIMULATION")
    print(f"{'='*60}")
    print(f"  Players: {num_players}")
    print(f"  Intervals: {intervals}")
    print(f"  Sync every {lcm} beats (LCM)")
    print(f"  Total beats: {max_beats:,}")

    # Shared state (thread-safe)
    results = []
    results_lock = threading.Lock()
    sync_barrier = threading.Barrier(num_players)
    sync_barrier._sync_interval = lcm  # Attach sync interval

    # Create players
    players = [
        DholPlayer(
            player_id=i + 1,
            interval=interval,
            max_beats=max_beats,
            sync_barrier=sync_barrier,
            results=results,
            results_lock=results_lock,
        )
        for i, interval in enumerate(intervals)
    ]

    # Start all players simultaneously
    print(f"\n  Starting all players...")
    start_time = time.perf_counter()

    for player in players:
        player.start()

    # Wait for all players to finish
    for player in players:
        player.join()

    elapsed = time.perf_counter() - start_time

    # Report results
    print(f"\n  Simulation completed in {elapsed*1000:.1f}ms")
    for player in players:
        print(f"  Player {player.player_id} (every {player.interval} beats): "
              f"{player.beats_played:,} strikes")

    # Verify sync points
    print(f"\n  Verifying synchronisation...")
    sync_beats = set()
    for beat in range(lcm, max_beats + 1, lcm):
        sync_beats.add(beat)

    # Check that all players struck at each sync point
    for sync_beat in sorted(list(sync_beats)[:5]):
        players_at_beat = set()
        with results_lock:
            for r in results:
                if r["beat"] == sync_beat:
                    players_at_beat.add(r["player"])
        all_present = len(players_at_beat) == num_players
        status = "✓ ALL" if all_present else f"✗ MISSING ({num_players - len(players_at_beat)})"
        print(f"    Beat {sync_beat:6d}: {status} players struck")

    return results


def demonstrate_event_sync():
    """
    Demonstrate threading.Event for simple signal-wait coordination.

    threading.Event is simpler than Barrier one thread signals,
    others wait. This models a conductor giving the downbeat.
    """
    print(f"\n{'='*60}")
    print(f"THREADING.EVENT Conductor/Player Model")
    print(f"{'='*60}")

    conductor_signal = threading.Event()
    player_done_events = []

    def player_thread(player_id: int, interval: int, signal: threading.Event,
                      done: threading.Event):
        """A player that waits for the conductor's signal before playing."""
        print(f"  Player {player_id}: waiting for conductor...")
        signal.wait()  # Block until the conductor signals

        # Play 5 beats
        for beat in range(1, 6):
            actual_beat = beat * interval
            print(f"  Player {player_id}: strike at beat {actual_beat}")
            time.sleep(0.05)  # Simulate playing time

        done.set()  # Signal that this player is done

    # Create player threads
    intervals = [2, 3, 5]
    threads = []
    for i, interval in enumerate(intervals):
        done_event = threading.Event()
        player_done_events.append(done_event)
        t = threading.Thread(
            target=player_thread,
            args=(i + 1, interval, conductor_signal, done_event),
        )
        threads.append(t)
        t.start()

    # Conductor waits, then signals
    print(f"\n  Conductor: preparing... (players are waiting)")
    time.sleep(0.2)
    print(f"  Conductor: GO! (setting event)")
    conductor_signal.set()  # All players start simultaneously

    # Wait for all players to finish
    for done_event in player_done_events:
        done_event.wait()

    for t in threads:
        t.join()

    print(f"\n  All players finished. Performance complete.")


# ---------------------------------------------------------------------------
# Demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Event-based conductor demo (small, visual)
    demonstrate_event_sync()

    # Full ensemble simulation (larger scale)
    print()
    results = run_ensemble_simulation(
        intervals=[2, 3, 5],
        max_beats=10_000,
    )
