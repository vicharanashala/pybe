# The Philosopher's Walk Case Study

## The Climate Observatory

You work for a climate monitoring system that collects temperature data from 10,000 sensors distributed across a continent. Each sensor takes readings every second temperature, humidity, pressure, and wind speed. That's 10,000 readings per second, 600,000 per minute, and 864,000,000 per day.

Your system must process this continuous stream of data and detect anomalies sudden temperature spikes, pressure drops, or humidity changes that might indicate severe weather. But you cannot load all this data into memory. The system must run continuously for months without memory growth.

## The Challenge

You need to build a data processing pipeline that:

1. **Reads sensor data one reading at a time** not batched, not pre-loaded

2. **Computes rolling statistics** average temperature over the last hour without storing all readings

3. **Detects anomalies as they occur** a sensor reading that deviates significantly from recent history

4. **Handles the stream continuously** an infinite sequence that never 'finishes' in the traditional sense

## Zeno's Paradox Applied

The ancient philosopher Zeno argued that to walk across a room, you must first cross the halfway point. To cross the halfway point, you must cross the quarter point. And so on infinitely. The conclusion: motion is impossible because you must complete an infinite number of steps.

The flaw in Zeno's argument is mathematical: an infinite series can have a finite sum. But the deeper insight remains: **an infinite process does not require infinite memory to traverse**. In Python, iterators and generators engage with exactly this idea.

## The Questions

1. **What is an iterator?** An object that maintains state and returns one element at a time. How does it differ from a list?

2. **How does the iterator protocol work?** What methods must an object implement to be used in a `for` loop?

3. **What is a generator?** A function that uses `yield` to produce values lazily. How does it differ from returning a list?

4. **What does 'lazy evaluation' mean?** Why does `yield`ing values one at a time use less memory than building a list?

5. **How do you detect when an iterator is exhausted?** What exception is raised, and how should you handle it?

6. **What is an infinite sequence?** Python's `itertools.count()` counts forever. How is this possible without crashing?

## The Deeper Question

Zeno's philosopher asked: "How can a walk with infinitely many steps ever complete?"

Python's answer: **You don't need to complete the infinite to use it.**

A generator produces values on-demand. You can process one billion sensor readings without ever loading them into memory. The iterator protocol `__iter__` and `__next__` is the mechanism. `StopIteration` is the signal that the sequence is (temporarily or permanently) exhausted.

The question is not "how do you finish an infinite walk?" The question is "what does each step of the walk reveal?"

## Your Task

Design a sensor monitoring system using generators:

1. Create a generator that simulates infinite sensor readings
2. Create a generator that computes a rolling window average
3. Create a generator that detects anomalies (readings that deviate from the rolling average by more than a threshold)
4. Chain these generators together: sensor readings -> rolling average -> anomaly detection
5. Run the system and demonstrate it processes readings without memory growth