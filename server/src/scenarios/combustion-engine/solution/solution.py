"""
The Combustion Engine: Asynchronous V4 Engine Simulation
=========================================================

Scenario: You are writing the ECU (Engine Control Unit) firmware for a new V4 engine.
You must write an asynchronous simulation where 4 cylinders run their 4-stroke cycles
(Intake, Compression, Power, Exhaust) concurrently.

This solution demonstrates:
- async def: Defining coroutine functions for each cylinder
- await: Yielding control back to the event loop during I/O-bound operations
- asyncio.gather(): Running multiple coroutines concurrently
- asyncio.sleep(): Non-blocking delays simulating stroke duration
- Event Loop: The crankshaft that coordinates all coroutines without blocking

In a combustion engine, cylinders don't wait for each other. While Cylinder 1 is
exhausting, Cylinder 2 might be firing. The crankshaft coordinates them all.
In Python, the Event Loop is the crankshaft. The cylinders are coroutines.
`await` is the moment a cylinder finishes its stroke and yields control back.
An asynchronous engine never blocks.
"""

import asyncio
import time
from typing import List


class V4Engine:
    """
    Simulates a V4 combustion engine using asyncio.

    A V4 engine has 4 cylinders firing in a specific order (firing order).
    Each cylinder cycles through 4 strokes: Intake, Compression, Power, Exhaust.
    We use asyncio to simulate concurrent cylinder operations without blocking.
    """

    # Stroke durations in seconds (simulating real engine timing)
    STROKE_DURATION = 0.05  # 50ms per stroke = 200ms per full cycle per cylinder

    # Firing order offsets to create realistic interleaving
    # Cylinder 0 starts at 0ms, Cylinder 1 at 50ms, etc.
    # This models the 90-degree offset between crank positions in a real V4
    FIRING_ORDER_OFFSETS = {
        0: 0.0,      # Cylinder 1 (front)
        1: 0.05,     # Cylinder 2 (90° crank rotation later)
        2: 0.10,     # Cylinder 3 (180°)
        3: 0.15,     # Cylinder 4 (270°)
    }

    def __init__(self):
        self.cylinders: List[asyncio.Task] = []
        self.log: List[str] = []
        self.stroke_count = 0

    async def cylinder_operation(self, cylinder_id: int) -> None:
        """
        Simulate a single cylinder cycling through 4 strokes.

        Each stroke is a coroutine that yields control back to the event loop
        via `await asyncio.sleep()`. This is the key to non-blocking behavior:
        unlike `time.sleep()`, `asyncio.sleep()` allows other coroutines to run
        while this one waits.

        Args:
            cylinder_id: Unique identifier for this cylinder (0-3)
        """
        strokes = ["Intake", "Compression", "Power", "Exhaust"]

        # Apply firing order offset - cylinders are staggered to simulate
        # real crankshaft positions. This creates the "lapping" effect where
        # cylinders appear to fire in sequence despite running concurrently.
        if cylinder_id in self.FIRING_ORDER_OFFSETS:
            await asyncio.sleep(self.FIRING_ORDER_OFFSETS[cylinder_id])

        # Cycle through all 4 strokes repeatedly
        cycle = 0
        while True:
            for stroke in strokes:
                # Log the current stroke with timestamp for later analysis
                # Using asyncio's internal clock for precise ordering
                timestamp = asyncio.get_event_loop().time()
                log_entry = (
                    f"[T+{timestamp:.3f}s] Cylinder {cylinder_id + 1}: {stroke}"
                )
                self.log.append(log_entry)
                print(log_entry)

                # AWAIT is the heart of async programming.
                # This yields control to the event loop, allowing other coroutines
                # to execute. If we used time.sleep() instead, the entire event
                # loop would block and no other cylinder could run.
                await asyncio.sleep(self.STROKE_DURATION)

            cycle += 1
            self.stroke_count += 1

    async def start_engine(self, duration_seconds: float = 1.0) -> None:
        """
        Start all cylinders concurrently and run for specified duration.

        asyncio.gather() is used to start all cylinder coroutines simultaneously.
        The event loop will schedule them based on their await points, creating
        the interleaved "concurrent" execution that mimics real engine behavior.

        Args:
            duration_seconds: How long to run the simulation
        """
        print("=" * 60)
        print("Starting V4 Engine Simulation")
        print("=" * 60)
        print(f"Cylinders: 4")
        print(f"Stroke duration: {self.STROKE_DURATION * 1000:.0f}ms each")
        print(f"Total cycle time per cylinder: {self.STROKE_DURATION * 4 * 1000:.0f}ms")
        print(f"Firing order offsets create realistic staggered timing")
        print("=" * 60)
        print("\n[Event Loop: Cranking up all cylinders simultaneously...]\n")

        # Create coroutines for each cylinder
        cylinder_coroutines = [
            self.cylinder_operation(i) for i in range(4)
        ]

        # asyncio.gather() runs all coroutines concurrently.
        # This is equivalent to starting all 4 cylinders at once.
        # The event loop will interleave their execution at each await point.
        # If we ran them sequentially (await one, then next), it would be
        # like a single-cylinder engine - slow and inefficient!
        await asyncio.gather(*cylinder_coroutines)

    def get_log(self) -> List[str]:
        """Return the execution log for analysis."""
        return self.log


def demonstrate_blocking_vs_async():
    """
    Demonstrate the critical difference between blocking and non-blocking code.

    This is why we use asyncio instead of time.sleep() in concurrent code.
    """
    print("\n" + "=" * 60)
    print("DEMONSTRATION: Blocking vs Non-Blocking")
    print("=" * 60)

    async def non_blocking_demo():
        """Uses asyncio.sleep - other tasks can run while waiting."""
        print("  [async] Starting task A (non-blocking sleep)...")
        await asyncio.sleep(0.1)  # Yields control to event loop
        print("  [async] Task A completed")

    async def blocking_demo():
        """Uses time.sleep - blocks entire event loop."""
        print("  [async] Starting task B (will attempt blocking)...")
        # We can't actually use time.sleep in async context without
        # blocking, so this demonstrates what NOT to do
        print("  [async] If we used time.sleep() here, Task A couldn't run!")
        print("  [async] That's why we use await asyncio.sleep()")


if __name__ == "__main__":
    print("V4 Combustion Engine - Asyncio Simulation")
    print("=" * 60)

    # Part 1: Demonstrate the blocking vs non-blocking concept
    asyncio.run(demonstrate_blocking_vs_async())

    # Part 2: Run the full engine simulation
    # Note: We limit runtime to avoid infinite loop
    print("\n" + "=" * 60)
    print("ENGINE SIMULATION (limited to 2 seconds)")
    print("=" * 60 + "\n")

    engine = V4Engine()

    # We use asyncio.run() to create an event loop and run the coroutine
    # In a real application, the event loop would be managed by a framework
    try:
        asyncio.run(asyncio.wait_for(engine.start_engine(duration_seconds=2.0), timeout=2.0))
    except asyncio.TimeoutError:
        print("\n[Simulation complete - timeout reached]")

    # Analyze the log to show interleaving
    print("\n" + "=" * 60)
    print("ANALYSIS: Cylinder Execution Interleaving")
    print("=" * 60)

    log = engine.get_log()
    print(f"\nTotal stroke events logged: {len(log)}")
    print(f"Cycles completed per cylinder: ~{engine.stroke_count // 4}")

    # Show first 20 entries to demonstrate interleaving
    print("\nFirst 20 log entries (note how cylinders interleave):")
    for entry in log[:20]:
        print(f"  {entry}")

    print("\n" + "=" * 60)
    print("KEY INSIGHT:")
    print("=" * 60)
    print("""
Notice how the cylinders fire in a staggered pattern:
  - Cylinder 1 starts at T+0.000
  - Cylinder 2 starts at T+0.050 (50ms offset)
  - Cylinder 3 starts at T+0.100
  - Cylinder 4 starts at T+0.150

At any given time, different cylinders are in different strokes.
This is exactly how a real V4 engine works - the crankshaft
coordinates the timing so power strokes overlap, producing smooth
rotation. The asyncio event loop plays the role of the crankshaft,
coordinating coroutine execution without ever blocking.
    """)