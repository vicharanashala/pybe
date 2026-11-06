"""
The Smart Factory: Assembly Line Sensor Stream Simulation
Companion Python script for PyBe discovery module.

Demonstrates the practical difference in memory consumption and execution timing
between standard lists (eager evaluation) and generators (lazy evaluation).
"""

import sys
import time
import tracemalloc

# Ensure UTF-8 output on Windows consoles if supported
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def sensor_batch_list(total_parts: int):
    """
    TRADITIONAL APPROACH: Eager Evaluation.
    Builds the entire list of readings in memory before returning.
    Like piling all finished goods on the factory floor before inspection!
    """
    records = []
    for part_id in range(1, total_parts + 1):
        # Simulated sensor record: (part_id, temperature_celsius, vibration_hz)
        records.append((part_id, 24.5 + (part_id % 7) * 0.4, 120.0 + (part_id % 5) * 1.2))
    return records


def sensor_stream_generator(total_parts: int):
    """
    GENERATOR APPROACH: Lazy Evaluation (Conveyor Belt).
    Yields exactly one reading at a time. Function state freezes at 'yield'
    and resumes only when the consumer asks for the next item.
    """
    for part_id in range(1, total_parts + 1):
        # Simulated sensor record: produced on demand!
        yield (part_id, 24.5 + (part_id % 7) * 0.4, 120.0 + (part_id % 5) * 1.2)


def run_memory_benchmark(sample_size: int = 300_000):
    print("=" * 65)
    print(f">> RUNNING SMART FACTORY MEMORY BENCHMARK ({sample_size:,} Parts)")
    print("=" * 65)

    # 1. Benchmark Traditional List
    tracemalloc.start()
    start_time = time.perf_counter()
    
    batch = sensor_batch_list(sample_size)
    processed_count = 0
    for reading in batch:
        if reading[1] > 26.0:  # defect threshold
            processed_count += 1
            
    time_list = time.perf_counter() - start_time
    current, peak_list = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    print(f"\n[1] EAGER LIST APPROACH (Function returning full list):")
    print(f"    - Execution Time : {time_list:.4f} seconds")
    print(f"    - Peak RAM Used  : {peak_list / (1024 * 1024):.2f} MB")
    print(f"    - Total defects  : {processed_count:,}")

    # 2. Benchmark Generator
    tracemalloc.start()
    start_time = time.perf_counter()
    
    stream = sensor_stream_generator(sample_size)
    processed_count_gen = 0
    for reading in stream:
        if reading[1] > 26.0:
            processed_count_gen += 1
            
    time_gen = time.perf_counter() - start_time
    current, peak_gen = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    print(f"\n[2] LAZY GENERATOR APPROACH (Python 'yield' conveyor belt):")
    print(f"    - Execution Time : {time_gen:.4f} seconds")
    print(f"    - Peak RAM Used  : {peak_gen / 1024:.2f} KB ({peak_gen / (1024 * 1024):.4f} MB)")
    print(f"    - Total defects  : {processed_count_gen:,}")

    # Comparison summary
    memory_ratio = peak_list / max(peak_gen, 1)
    print("\n" + "-" * 65)
    print(f">> VERDICT: Generator reduced peak memory usage by {memory_ratio:.1f}x!")
    print(f"   Object size of generator alone: {sys.getsizeof(sensor_stream_generator(sample_size))} bytes")
    print("-" * 65)


def demonstrate_iterator_protocol():
    """Demonstrates manual stepping with next() and handling StopIteration."""
    print("\n>> DEMONSTRATING THE ITERATOR PROTOCOL WITH next() AND StopIteration:")
    short_stream = sensor_stream_generator(3)

    print(f"   Step 1 -> Calling next(): {next(short_stream)}")
    print(f"   Step 2 -> Calling next(): {next(short_stream)}")
    print(f"   Step 3 -> Calling next(): {next(short_stream)}")

    try:
        print("   Step 4 -> Calling next() when factory shift is done...")
        next(short_stream)
    except StopIteration:
        print("   >> Caught StopIteration! Conveyor belt safely stopped with zero crash.")


if __name__ == "__main__":
    run_memory_benchmark(sample_size=300_000)
    demonstrate_iterator_protocol()
