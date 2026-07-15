"""
The Philosopher's Walk Solution
==================================
Iterators, Generators, and Lazy Evaluation

This solution demonstrates how to process infinite sequences
and large data streams using Python's iterator protocol.

Zeno's paradox: to complete a walk, you must complete infinitely
many steps. Python's answer: you don't need to complete the infinite
to use it. Each step reveals new insight. The walk is the goal.
"""

from typing import Iterator, Generator, Callable, List, Tuple, Any
import random
import time


# ============================================================================
# PART 1: The Iterator Protocol __iter__ and __next__
# ============================================================================

print("=" * 70)
print("PART 1: The Iterator Protocol")
print("=" * 70)

"""
An iterator is an object that implements:
    __iter__() -> returns the iterator itself
    __next__() -> returns the next element, or raises StopIteration

The for loop uses this protocol:
    for item in iterable:
        # internally calls iter() to get iterator, then next() repeatedly
"""

class Counter:
    """A simple iterator that counts from start to stop."""

    def __init__(self, start: int, stop: int):
        self.current = start
        self.stop = stop

    def __iter__(self):
        return self  # Iterator returns itself

    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        value = self.current
        self.current += 1
        return value


print("\nUsing Counter iterator:")
counter = Counter(1, 5)
print(f"  Created counter: {list(counter)}")
print(f"  Exhausted counter: {list(counter)}")  # Empty - already exhausted


class FibonacciIterator:
    """An iterator that generates Fibonacci numbers indefinitely."""

    def __init__(self):
        self.a = 0
        self.b = 1

    def __iter__(self):
        return self

    def __next__(self):
        result = self.a
        self.a, self.b = self.b, self.a + self.b
        return result


print("\nFibonacci iterator (first 10):")
fib = FibonacciIterator()
fib_numbers = [next(fib) for _ in range(10)]
print(f"  {fib_numbers}")


# ============================================================================
# PART 2: Generators The yield Keyword
# ============================================================================

print("\n" + "=" * 70)
print("PART 2: Generators with yield")
print("=" * 70)

"""
A generator is a function that uses 'yield' to produce values.
When called, a generator doesn't execute it returns a generator object.
Each call to next() executes until the next yield, then suspends.

Key insight: generators maintain state between yields. No instance variables needed.
"""

def count_generator(start: int, stop: int):
    """Generator version of Counter much simpler!"""
    current = start
    while current < stop:
        yield current
        current += 1


def fibonacci_generator():
    """Infinite Fibonacci generator."""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b


print("\nGenerator vs Iterator:")
print(f"  Generator: {list(count_generator(1, 5))}")

fib_gen = fibonacci_generator()
print(f"  Infinite fib: {[next(fib_gen) for _ in range(10)]}")


# ============================================================================
# PART 3: The Sensor Data Pipeline Infinite Sequence
# ============================================================================

print("\n" + "=" * 70)
print("PART 3: Infinite Sensor Data Stream")
print("=" * 70)

"""
Zeno's paradox in code: an infinite sequence doesn't need to 'finish'
to be useful. Each step reveals new insight.
"""

SENSOR_IDS = [f"SENSOR_{i:04d}" for i in range(100)]  # 100 sensors for demo


def sensor_reading_generator(sensor_ids: List[str]) -> Generator[Tuple[str, float, float, float], None, None]:
    """
    Infinite generator of sensor readings.

    Yields:
        (sensor_id, temperature, humidity, pressure)
    """
    # Simulate realistic sensor data with some noise
    base_temp = 22.0  # Celsius
    base_humidity = 60.0  # Percent
    base_pressure = 1013.25  # hPa

    reading_count = 0
    while True:
        sensor_id = random.choice(sensor_ids)
        # Add realistic variations
        temp = base_temp + random.gauss(0, 5) + 5 * (reading_count % 100) / 100
        humidity = base_humidity + random.gauss(0, 10)
        pressure = base_pressure + random.gauss(0, 5)

        reading_count += 1
        yield (sensor_id, round(temp, 2), round(humidity, 2), round(pressure, 2))


def take(n: int, iterator: Iterator) -> List:
    """Take only the first n items from an iterator."""
    return [next(iterator) for _ in range(n)]


print("\nSimulated sensor readings (first 5):")
sensor_gen = sensor_reading_generator(SENSOR_IDS)
for reading in take(5, sensor_gen):
    print(f"  {reading}")


# ============================================================================
# PART 4: Generator Transformations Processing on Demand
# ============================================================================

print("\n" + "=" * 70)
print("PART 4: Generator Pipeline (Lazy Evaluation)")
print("=" * 70)

"""
The key insight of generators: lazy evaluation.
Values are computed ONLY when next() is called.
This means we can chain transformations without materializing intermediate lists.
"""

def filter_by_temperature(readings: Iterator, min_temp: float) -> Generator:
    """Filter readings by minimum temperature lazy."""
    for sensor_id, temp, humidity, pressure in readings:
        if temp >= min_temp:
            yield (sensor_id, temp, humidity, pressure)


def annotate_reading(readings: Iterator, sensor_baselines: dict) -> Generator:
    """Add deviation from baseline to each reading lazy."""
    for sensor_id, temp, humidity, pressure in readings:
        baseline = sensor_baselines.get(sensor_id, 22.0)
        deviation = temp - baseline
        yield {
            'sensor_id': sensor_id,
            'temperature': temp,
            'humidity': humidity,
            'pressure': pressure,
            'deviation': round(deviation, 2),
            'is_anomaly': abs(deviation) > 3.0
        }


# Build sensor baselines from historical data
sensor_baselines = {sid: 22.0 + random.gauss(0, 2) for sid in SENSOR_IDS}

# Create the pipeline
sensor_gen = sensor_reading_generator(SENSOR_IDS)
warm_readings = filter_by_temperature(sensor_gen, min_temp=25.0)
annotated = annotate_reading(warm_readings, sensor_baselines)

print("\nPipeline processing (first 5 warm readings with annotations):")
for reading in take(5, annotated):
    anomaly_flag = "** ANOMALY **" if reading['is_anomaly'] else ""
    print(f"  {reading['sensor_id']}: {reading['temperature']}C "
          f"(deviation: {reading['deviation']:+.2f}) {anomaly_flag}")


# ============================================================================
# PART 5: Rolling Window Statistics Infinite Memory Problem
# ============================================================================

print("\n" + "=" * 70)
print("PART 5: Rolling Statistics (Memory-Efficient)")
print("=" * 70)

"""
The challenge: compute average temperature over the last 100 readings
without storing all 100 readings in memory.

Solution: maintain a running sum and count. Each new reading updates
the sum, oldest reading is conceptually 'removed'.
But for a true rolling window, we need to remember what's in the window.
"""

def rolling_average(readings: Iterator, window_size: int) -> Generator:
    """
    Compute rolling average of temperatures.

    Maintains a deque of the last N readings.
    Memory usage is O(window_size), not O(total_readings).
    """
    from collections import deque

    window = deque(maxlen=window_size)  # Fixed-size buffer!

    for sensor_id, temp, humidity, pressure in readings:
        window.append(temp)
        if len(window) == window_size:
            avg = sum(window) / len(window)
            yield (sensor_id, temp, avg, len(window))


def detect_anomalies(readings: Iterator, threshold: float = 2.5) -> Generator:
    """
    Detect readings that deviate significantly from the rolling average.

    This is the key use case for generators: real-time anomaly detection
    without batch processing.
    """
    # Track recent readings for context
    recent = []
    window = 20

    for reading in readings:
        sensor_id, temp, avg_temp, count = reading

        if count >= window:
            # We have enough data for anomaly detection
            std_dev = (sum((t - avg_temp) ** 2 for t in recent) / len(recent)) ** 0.5
            deviation = abs(temp - avg_temp)

            if deviation > threshold * std_dev:
                yield {
                    'sensor_id': sensor_id,
                    'temperature': temp,
                    'rolling_avg': round(avg_temp, 2),
                    'deviation': round(deviation, 2),
                    'severity': 'HIGH' if deviation > 3 * std_dev else 'MEDIUM'
                }

            # Update recent readings (rolling window)
            recent.append(temp)
            if len(recent) > window:
                recent.pop(0)


# Demo the rolling average
print("\nRolling average (window=5) for one sensor:")
sensor_gen = sensor_reading_generator(SENSOR_IDS)
# Filter to one sensor
one_sensor = ((sid, temp, hum, press) for sid, temp, hum, press in sensor_gen
              if sid == "SENSOR_0000")
rolling = rolling_average(one_sensor, window_size=5)
print("  (sensor_id, current_temp, rolling_avg, count)")
for reading in take(10, rolling):
    print(f"  {reading}")


# ============================================================================
# PART 6: Generator Expressions Memory Efficiency
# ============================================================================

print("\n" + "=" * 70)
print("PART 6: Generator Expressions")
print("=" * 70)

"""
A generator expression is like a list comprehension, but with () instead of [].
It creates a generator object, not a list.

This is crucial for memory efficiency with large datasets.
"""

# List comprehension evaluates everything immediately
numbers = list(range(1000000))
list_memory = sum(1 for n in numbers if n % 2 == 0)

# Generator expression evaluates lazily
gen_exp = (n for n in range(1000000) if n % 2 == 0)
# gen_exp doesn't use memory until we iterate

print("\nGenerator expression vs list comprehension:")
print(f"  List of squares (first 5): {[x**2 for x in range(5)]}")
print(f"  Generator of squares (first 5): {list(gen_exp for _ in range(5))}")

# Practical example: processing a large file
print("\nProcessing with generators (memory-efficient):")
large_sum = sum(n for n in range(1000000))  # O(1) memory!
print(f"  Sum of 1M numbers: {large_sum}")


# ============================================================================
# PART 7: itertools Infinite Sequences
# ============================================================================

print("\n" + "=" * 70)
print("PART 7: Infinite Sequences with itertools")
print("=" * 70)

"""
Python's itertools module provides tools for working with iterators,
including infinite sequences that count forever.
"""

import itertools

def demo_itertools():
    """Demonstrate itertools infinite sequences."""

    # count() infinite counter
    print("\n  itertools.count():")
    counter = itertools.count(10, 2)  # Start at 10, step by 2
    print(f"    First 5 even numbers from 10: {take(5, counter)}")

    # cycle() repeat an iterable forever
    print("\n  itertools.cycle():")
    cycle_gen = itertools.cycle(['ON', 'OFF'])
    print(f"    First 8 states: {take(8, cycle_gen)}")

    # repeat() repeat a value forever or n times
    print("\n  itertools.repeat():")
    repeat_gen = itertools.repeat("tick", times=3)
    print(f"    Tock three times: {list(repeat_gen)}")

    # islice() slice an iterator without indexing
    print("\n  itertools.islice():")
    infinite_count = itertools.count()
    sliced = itertools.islice(infinite_count, 10, 20)  # Elements 10-19
    print(f"    count() from 10 to 19: {list(sliced)}")

demo_itertools()


# ============================================================================
# PART 8: The Complete Climate Monitoring Pipeline
# ============================================================================

print("\n" + "=" * 70)
print("PART 8: Complete Climate Monitoring Pipeline")
print("=" * 70)

"""
The full system: sensor readings -> rolling average -> anomaly detection

This runs continuously without memory growth.
"""

def climate_monitor_pipeline(sensor_ids: List[str], duration_readings: int = 100):
    """
    Complete climate monitoring pipeline.

    Demonstrates:
    - Infinite generator for sensor data
    - Lazy transformation pipeline
    - Memory-efficient anomaly detection
    """
    # Stage 1: Raw sensor readings (infinite)
    readings = sensor_reading_generator(sensor_ids)

    # Stage 2: Rolling statistics (window=10)
    rolling_stats = rolling_average(readings, window_size=10)

    # Stage 3: Anomaly detection
    anomalies = detect_anomalies(rolling_stats, threshold=2.0)

    # Run for specified number of readings
    results = {
        'readings_processed': 0,
        'anomalies_detected': [],
        'sensors_monitored': set()
    }

    for anomaly in anomalies:
        results['readings_processed'] += 1
        results['sensors_monitored'].add(anomaly['sensor_id'])
        if len(results['anomalies_detected']) < 5:  # Collect first 5
            results['anomalies_detected'].append(anomaly)

        if results['readings_processed'] >= duration_readings:
            break

    return results


print("\nRunning climate monitoring pipeline (100 readings):")
results = climate_monitor_pipeline(SENSOR_IDS, duration_readings=100)

print(f"\n  Readings processed: {results['readings_processed']}")
print(f"  Sensors monitored: {len(results['sensors_monitored'])}")
print(f"\n  First anomalies detected:")
for anomaly in results['anomalies_detected']:
    print(f"    {anomaly['sensor_id']}: {anomaly['temperature']}C "
          f"(avg: {anomaly['rolling_avg']}C, deviation: {anomaly['deviation']}C) "
          f"[{anomaly['severity']}]")


# ============================================================================
# PART 9: Why Lazy Evaluation Matters
# ============================================================================

print("\n" + "=" * 70)
print("PART 9: Memory Comparison Eager vs Lazy")
print("=" * 70)

"""
The key insight: generators enable processing data larger than memory.
"""

def memory_check():
    """Show memory behavior of eager vs lazy evaluation."""
    import sys

    # Eager: list of million squares
    eager_list = [x**2 for x in range(1000000)]
    eager_size = sys.getsizeof(eager_list)

    # Lazy: generator of million squares
    lazy_gen = (x**2 for x in range(1000000))
    lazy_size = sys.getsizeof(lazy_gen)

    print(f"\n  List (eager): {eager_size:,} bytes")
    print(f"  Generator (lazy): {lazy_size:,} bytes")
    print(f"  Memory savings: {(1 - lazy_size/eager_size)*100:.1f}%")

    # But both can yield the same results when iterated
    print(f"\n  Both produce same values: {next(lazy_gen) == eager_list[0]}")

memory_check()


# ============================================================================
# The Zeno's Paradox Lesson
# ============================================================================

print("\n" + "=" * 70)
print("THE PHILOSOPHER'S WALK LESSON")
print("=" * 70)

print("""
Zeno asked: "How can a walk with infinitely many steps ever complete?"

Python's answer: "You don't need to complete the infinite to use it."

Key insights from generators and iterators:

1. LAZY VS EAGER EVALUATION
   Eager: compute everything, store in memory
   Lazy: compute on-demand, suspend between yields
   Generators are lazy by default.

2. ITERATOR PROTOCOL
   __iter__() returns the iterator
   __next__() returns the next element or raises StopIteration
   for loops use this protocol internally.

3. YIELD VS RETURN
   return: exits the function, sends one value
   yield: suspends the function, sends one value, maintains state

4. INFINITE SEQUENCES
   iterators.count(), itertools.cycle() generate forever
   No memory usage growth values computed on-demand

5. MEMORY EFFICIENCY
   Generator: O(1) memory for the sequence
   List: O(n) memory for n elements

6. PIPELINE COMPOSITION
   Chain generators: readings -> filter -> transform -> detect
   Each stage processes lazily as data flows through

Zeno's philosopher walks a path with infinitely many steps.
The path is not known in advance it unfolds through walking.
Each step reveals new insight. The walk is the goal.
""")


# ============================================================================
# Demonstration
# ============================================================================

if __name__ == "__main__":
    print("\n" + "#" * 70)
    print("RUNNING DEMONSTRATION")
    print("#" * 70)

    # Fibonacci infinite sequence
    print("\nFirst 15 Fibonacci numbers (from infinite generator):")
    fib_gen = fibonacci_generator()
    print(f"  {[next(fib_gen) for _ in range(15)]}")

    # Sensor pipeline
    print("\nClimate monitoring (first 5 readings from pipeline):")
    sensor_gen = sensor_reading_generator(SENSOR_IDS)
    rolling = rolling_average(sensor_gen, window_size=10)
    anomalies = detect_anomalies(rolling, threshold=2.0)

    count = 0
    for reading in anomalies:
        count += 1
        if count > 5:
            break

    print(f"\nMemory-efficient pipeline complete.")
    print(f"Note: Only a fixed window of readings was stored in memory.")