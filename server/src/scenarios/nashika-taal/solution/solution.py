"""
The Nashika Taal Engine - Generators, Lazy Evaluation & Threading

This scenario explores generator functions and lazy evaluation through the
rhythmic patterns of Nashik Dhol players. The metaphor is precise: a taal
player internalizes a RULE (the rhythmic pattern) rather than memorizing
a million beats. The rule generates beats on demand, just as a Python
generator holds a formula (yield) rather than a sequence.

Key Concepts:
- Generator functions: Functions that use yield instead of return
- yield: Pauses function execution, yields a value, maintains state
- Lazy evaluation: Compute values only when needed, not upfront
- next(): Pull the next value from a generator
- sys.getsizeof(): Shows memory difference between generators and lists
- threading.Thread: Concurrent execution for synchronized players
- threading.Event: Synchronization primitive for coordinating threads
- collections.deque with maxlen: Ring buffer for recent history
- LCM (Least Common Multiple): Finding synchronization points

The taal pattern is the generator function - it encodes the RULE for
producing beats. Each yield is one beat played. The next() call is the
passage of time - it asks the generator for the next beat.
"""

import sys
import threading
import time
from collections import deque
from typing import Generator, Iterator


class TaalGenerator:
    """
    A generator that produces beats according to a taal (rhythmic cycle).

    The taal is NOT stored as a list of beats. Instead, it exists as a
    formula (the generator function) that produces beats on demand.

    This is the core insight: the taal is the ALGORITHM, not the DATA.

    Teentaal (16 beats):
    - 4 vibhag (sections) of 4 beats each
    - sam (first beat of cycle) is the anchor
    - khali (9th beat) is the "empty" beat
    """

    def __init__(self, cycle_length: int = 16, tempo_bpm: float = 60):
        """
        Initialize the taal generator.

        Args:
            cycle_length: Number of beats in the cycle (default 16 for Teentaal)
            tempo_bpm: Beats per minute (determines timing)
        """
        self.cycle_length = cycle_length
        self.tempo_bpm = tempo_bpm
        self.beat_interval = 60.0 / tempo_bpm  # Seconds between beats

    def generate_beat(self) -> Generator[int, None, None]:
        """
        Generate beats indefinitely following the taal pattern.

        This is a GENERATOR FUNCTION. When called, it returns a generator
        object but does NOT execute the function body. Each call to next()
        on the generator resumes execution until the next yield.

        The while True makes this an INFINITE generator - the drummer
        never stops mid-cycle. The cycle repeats forever.

        Yields:
            int: The current beat number (1 to cycle_length)
        """
        beat = 1
        while True:
            yield beat
            beat = (beat % self.cycle_length) + 1

    def generate_taal_pattern(self) -> Generator[dict, None, None]:
        """
        Generate beats with taal structure metadata.

        Yields dictionaries with beat info including whether it's
        a sam (first beat), khali (empty beat), or regular beat.

        Yields:
            dict: Beat information with number, type, and vibhag
        """
        beat_gen = self.generate_beat()
        vibhag_size = self.cycle_length // 4  # 4 beats per vibhag

        while True:
            beat = next(beat_gen)
            vibhag = (beat - 1) // vibhag_size + 1  # Which vibhag (1-4)
            position_in_vibhag = (beat - 1) % vibhag_size + 1  # Position 1-4

            # Determine beat type
            if beat == 1:
                beat_type = "SAM"  # The anchor beat
            elif beat == self.cycle_length // 2 + 1:
                beat_type = "KHALI"  # The empty beat
            elif position_in_vibhag == 1:
                beat_type = "VIBHAG_START"
            else:
                beat_type = "REGULAR"

            yield {
                "beat": beat,
                "type": beat_type,
                "vibhag": vibhag,
                "position": position_in_vibhag
            }

    def demonstrate_memory_efficiency(self):
        """
        Show the memory difference between storing a list vs using a generator.

        A list of 1 million beats consumes megabytes of RAM.
        A generator that yields them consumes only bytes.
        """
        print("=" * 70)
        print("MEMORY EFFICIENCY: Generator vs List")
        print("=" * 70)

        print("""
        A list stores ALL values in memory upfront.
        A generator computes ONE value at a time, on demand.

        For 1 million beats:
        - List: Allocates 1 million integers immediately
        - Generator: Allocates almost nothing until next() called
        """)

        # Create a list of beats
        large_list = list(range(1, 1_000_001))
        list_size = sys.getsizeof(large_list)

        # Create a generator
        large_generator = (i for i in range(1, 1_000_001))
        generator_size = sys.getsizeof(large_generator)

        print(f"\n  List size:     {list_size:,} bytes ({list_size / 1024 / 1024:.2f} MB)")
        print(f"  Generator size: {generator_size:,} bytes ({generator_size / 1024:.2f} KB)")
        print(f"\n  Memory saved: {(list_size - generator_size) / list_size * 100:.1f}%")

        # Verify both produce the same values
        print("\n  Both produce the same sequence:")
        print(f"    List first 5:   {large_list[:5]}")
        # Need to recreate generator since we consumed it
        gen = (i for i in range(1, 1_000_001))
        print(f"    Generator first 5: {[next(gen) for _ in range(5)]}")

        print("""
        REAL-WORLD EXAMPLES where generators save memory:

        1. Reading a 50GB log file:
           - List: Would need 50GB RAM to store all lines
           - Generator: Uses ~50 bytes, yields one line at a time

        2. range() in Python 3:
           - range(1_000_000_000) does NOT create a billion integers
           - It creates a lazy sequence object that generates on demand

        3. Django/Flask streaming responses:
           - Send large file to client without buffering in RAM
        """)


class NashikDholEnsemble:
    """
    Simulates multiple dhol players striking at different intervals,
    demonstrating threading and synchronization with threading.Event.

    When multiple players perform together:
    - Player 1 strikes on every 2nd beat
    - Player 2 strikes on every 3rd beat
    - Player 3 strikes on every 5th beat
    - They must synchronize at specific points (LCM of their intervals)

    The LCM (Least Common Multiple) tells us when they all strike together:
    LCM(2, 3, 5) = 30, so they synchronize every 30 beats.
    """

    def __init__(self, player_intervals: list):
        """
        Initialize the ensemble with player strike intervals.

        Args:
            player_intervals: List of intervals (in beats) for each player
        """
        self.player_intervals = player_intervals
        self.lcm_beat = self._calculate_lcm(player_intervals)
        self.shared_event = threading.Event()
        self.hits = {i: [] for i in range(len(player_intervals))}
        self.sync_hits = []
        self._stop_event = threading.Event()

    @staticmethod
    def _calculate_lcm(numbers: list) -> int:
        """Calculate the Least Common Multiple of a list of numbers."""
        def gcd(a, b):
            while b:
                a, b = b, a % b
            return a

        def lcm(a, b):
            return a * b // gcd(a, b)

        result = numbers[0]
        for num in numbers[1:]:
            result = lcm(result, num)
        return result

    def player_thread(self, player_id: int, interval: int):
        """
        A thread representing one dhol player.

        The player strikes every 'interval' beats. When the shared
        event is set (synchronization signal), all players strike together.

        Args:
            player_id: Which player this is (0-indexed)
            interval: How often this player strikes (in beats)
        """
        beat = 0
        while not self._stop_event.is_set():
            beat += 1

            # Check if this player should strike on this beat
            if beat % interval == 0:
                self.hits[player_id].append(beat)

                # Check if this is a synchronization point
                if beat % self.lcm_beat == 0:
                    self.sync_hits.append(beat)
                    # Signal synchronization - in real code this might trigger an event
                    self.shared_event.set()
                    self.shared_event.clear()

            # Simulate the beat interval (real timing would use actual sleep)
            time.sleep(0.001)  # Small delay to prevent CPU spin

    def run_simulation(self, total_beats: int = 90):
        """
        Run the ensemble simulation.

        Creates threads for each player, runs for a number of beats,
        then demonstrates the synchronization pattern.

        Args:
            total_beats: How many beats to simulate
        """
        print("=" * 70)
        print("NASHIK DHOL ENSEMBLE: Thread Synchronization")
        print("=" * 70)

        print(f"""
        Ensemble Setup:
        - {len(self.player_intervals)} dhol players
        - Strike intervals: {self.player_intervals}
        - LCM (synchronization every {self.lcm_beat} beats)

        Each player strikes at different intervals:
        """)

        for i, interval in enumerate(self.player_intervals):
            print(f"  Player {i+1}: Every {interval} beats")

        # Create and start threads
        threads = []
        beat_counter = [0]  # Using list to allow modification in thread

        def beat_counter_thread():
            """Increments beat counter to track simulation progress."""
            while beat_counter[0] < total_beats and not self._stop_event.is_set():
                beat_counter[0] += 1
                time.sleep(0.001)

        counter_thread = threading.Thread(target=beat_counter_thread)
        counter_thread.start()

        for i, interval in enumerate(self.player_intervals):
            t = threading.Thread(target=self.player_thread, args=(i, interval))
            threads.append(t)
            t.start()

        # Wait for simulation to complete
        counter_thread.join()
        self._stop_event.set()

        for t in threads:
            t.join(timeout=1)

        # Display results
        print(f"\n  Simulation ran for {beat_counter[0]} beats")
        print("\n  Player strike patterns (first 20 hits):")

        for player_id, hits in self.hits.items():
            print(f"    Player {player_id+1}: {hits[:20]}...")

        print(f"\n  All players strike together at beats: {self.sync_hits}")
        print(f"  These are multiples of LCM({self.player_intervals}) = {self.lcm_beat}")

        # Verify synchronization
        print("\n  Verification:")
        for sync_beat in self.sync_hits[:5]:
            print(f"    Beat {sync_beat}:", end=" ")
            for player_id, interval in enumerate(self.player_intervals):
                struck = "STRUCK" if sync_beat % interval == 0 else "-"
                print(f"Player{player_id+1}({interval})={struck}", end=" ")
            print()


class RingBufferDemo:
    """
    Demonstrates collections.deque with maxlen as a ring buffer.

    A ring buffer (circular buffer) keeps only the N most recent items.
    When full, new items push out old items. This is used in:
    - Audio processing: Keep last N samples for visualization
    - Network packets: Keep recent packets for retransmission
    - Real-time monitoring: Keep recent readings for alerts
    """

    def __init__(self, capacity: int = 10):
        """
        Initialize ring buffer with fixed capacity.

        Args:
            capacity: Maximum number of items to store
        """
        self.buffer = deque(maxlen=capacity)

    def add_beat(self, beat_info: dict):
        """
        Add a beat to the ring buffer.

        If buffer is full, the oldest beat is automatically evicted.
        This is O(1) operation - no shifting needed.

        Args:
            beat_info: Dictionary with beat details
        """
        self.buffer.append(beat_info)

    def get_recent_beats(self, count: int = None) -> list:
        """
        Get the most recent N beats.

        Args:
            count: Number of recent beats to return (default: all)

        Returns:
            List of recent beat info dictionaries
        """
        if count is None:
            return list(self.buffer)
        return list(self.buffer)[-count:]

    def demonstrate(self):
        """
        Demonstrate ring buffer behavior.
        """
        print("\n" + "=" * 70)
        print("RING BUFFER: Recent History with Fixed Memory")
        print("=" * 70)

        print("""
        Ring buffers (fixed-size queues) are essential for:
        - Real-time audio: Keep last N samples for visualization
        - Network buffers: Keep recent packets for retransmission
        - Chat logs: Keep last N messages in memory

        In Python, collections.deque with maxlen provides this:
            buffer = deque(maxlen=10)

        When full, adding new items automatically removes oldest.
        """)

        taal = TaalGenerator(cycle_length=16, tempo_bpm=60)
        ring_buffer = RingBufferDemo(capacity=10)

        beat_gen = taal.generate_taal_pattern()

        print("\n  Adding beats to ring buffer (capacity=10):")
        print("  " + "-" * 50)

        for i in range(15):
            beat = next(beat_gen)
            ring_buffer.add_beat(beat)
            recent = ring_buffer.get_recent_beats(5)
            print(f"  Beat {beat['beat']:2d} ({beat['type']:5s}) | "
                  f"Recent: {[b['beat'] for b in recent]}")

        print(f"""
        Notice:
        - At beat 1-10, buffer fills up
        - At beat 11+, oldest beats are evicted
        - Beat 1 is gone after beat 11 is added
        - Only the 10 most recent beats remain
        - This uses FIXED memory regardless of total beats!
        """)


def demonstrate_generator_protocol():
    """
    Explain the generator protocol and state maintenance.
    """
    print("=" * 70)
    print("GENERATOR PROTOCOL: How yield Works")
    print("=" * 70)

    print("""
    Generator functions are NOT like regular functions:

    REGULAR FUNCTION:
    1. Call function
    2. Execute until return
    3. Return value
    4. Function scope destroyed

    GENERATOR FUNCTION:
    1. Call function → Returns generator OBJECT (does NOT execute)
    2. Call next(generator) → Execute until yield
    3. Yield value + PAUSE (state preserved!)
    4. Call next() again → Resume from where paused
    5. Repeat until function ends or raise StopIteration

    Key insight: The generator function's LOCAL STATE (variables,
    position in loop) is PRESERVED between yields. This is why
    generators can produce infinite sequences - they never need
    to hold everything in memory, just the current state.
    """)

    def simple_generator():
        """A simple generator that yields values 1, 2, 3."""
        print("  [Generator] About to yield 1")
        yield 1
        print("  [Generator] Resumed, about to yield 2")
        yield 2
        print("  [Generator] Resumed, about to yield 3")
        yield 3
        print("  [Generator] Done, raising StopIteration")

    print("\n  Creating generator (function body NOT executed yet):")
    gen = simple_generator()
    print(f"  Generator object: {gen}")
    print(f"  Generator type: {type(gen)}")

    print("\n  Calling next() three times:")
    try:
        while True:
            value = next(gen)
            print(f"  next() returned: {value}")
    except StopIteration:
        print("  StopIteration raised - generator exhausted")

    print("""
    Notice:
    - 'Creating' the generator did NOT print anything
    - First next() started execution and ran until first yield
    - After yielding, execution PAUSED (print after yield not run yet)
    - Second next() RESUMED from where it paused
    - Each next() only runs code UNTIL the next yield
    """)


def real_world_generators():
    """
    Show real-world uses of generators in Python ecosystem.
    """
    print("\n" + "=" * 70)
    print("GENERATORS IN THE REAL WORLD")
    print("=" * 70)

    print("""
    1. READING LARGE FILES:

        with open("huge_file.txt") as f:
            for line in f:  # f is a generator!
                process(line)

        Only one line in memory at a time, not the entire file.

    2. range() IN PYTHON 3:

        for i in range(1_000_000_000):
            pass

        Does NOT create a billion integers. Creates lazy sequence.

    3. PANDAS read_csv CHUNKING:

        for chunk in pd.read_csv("big.csv", chunksize=1000):
            process(chunk)

        Process 1000 rows at a time, not entire file.

    4. DJANGO ORM queries:

        User.objects.filter(active=True).iterator()

        Yields one user at a time, not entire query set.

    5. GENERATOR EXPRESSIONS (like list comprehensions but lazy):

        squares = (x**2 for x in range(1_000_000))
        # Does not compute anything yet!

        for sq in squares:
            print(sq)  # Computes one at a time
    """)


def reflection_questions():
    """
    Reflection questions about generators and their philosophical implications.
    """
    print("\n" + "=" * 70)
    print("REFLECTION: The Taal is the Formula, Not the Data")
    print("=" * 70)

    print("""
    1. THE FUNDAMENTAL INSIGHT:
       A list stores VALUES. A generator stores a FORMULA.

       Which does the drummer carry in their head?
       - NOT: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16..."
       - YES: "Strike on 1, rest on 9, fill in between"

       The formula is infinitely reusable. The list is fixed.

    2. LAZY VS EAGER:
       Python 2's range() was EAGER: range(1000000) created a million ints
       Python 3's range() is LAZY: range(1000000) creates a small object

       What other computations could benefit from lazy evaluation?

    3. INFINITE SEQUENCES:
       Generators can represent infinite sequences:

           def all_even_numbers():
               n = 0
               while True:
                   yield n
                   n += 2

       Can you think of other infinite things that could be generators?

    4. THE THREADING METAPHOR:
       Multiple musicians playing together, each with their own rhythm,
       but synchronized at key moments (the LCM).

       How does this relate to concurrent programming in web servers?
       Multiple requests, each with their own processing, but sharing
       resources and synchronizing on shared state (databases, caches).

    5. MEMORY VS TIME TRADE-OFF:
       - Generators: Low memory, potentially more computation (recompute values)
       - Lists: High memory, fast iteration (no recomputation)

       When would you choose each approach?

    6. THE MUSICALITY OF CODE:
       The taal is a pattern that generates beats. The generator is a
       pattern that yields values. The composer internalizes rules,
       not notes.

       What rules do YOU carry in your head that generate your actions?
    """)


if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                    THE NASHIKA TAAL ENGINE                           ║
    ║           Generators, Lazy Evaluation & Threading                    ║
    ╚══════════════════════════════════════════════════════════════════════╝
    """)

    taal = TaalGenerator(cycle_length=16, tempo_bpm=60)

    demonstrate_generator_protocol()
    taal.demonstrate_memory_efficiency()

    ensemble = NashikDholEnsemble(player_intervals=[2, 3, 5])
    ensemble.run_simulation(total_beats=90)

    ring_buffer = RingBufferDemo()
    ring_buffer.demonstrate()

    real_world_generators()
    reflection_questions()

    print("\n" + "=" * 70)
    print("The taal plays on, one beat at a time, forever.")
    print("=" * 70 + "\n")