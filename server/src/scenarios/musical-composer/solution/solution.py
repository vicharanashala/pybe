"""
The Musical Composer - Functional Programming with map, filter, reduce

This scenario explores functional programming concepts using Python's built-in
higher-order functions: map(), filter(), and reduce(). The metaphor is a composer
who transforms simple notes into symphonies through systematic transformations.

Just as a composer applies rules to elevate simple notes into a symphony,
functional programming treats computation as the evaluation of mathematical
functions, avoiding changing state and mutable data.

Key Concepts:
- map(): Apply a function to every element in a sequence
- filter(): Keep only elements that satisfy a predicate function
- reduce(): Combine all elements into a single value using a combining function
- lambda: Anonymous functions for one-off transformations
- Functional composition: Chaining transformations into pipelines
- immutability: Transformations create new data, don't modify original
"""

from functools import reduce
import math


class Note:
    """
    Represents a musical note with frequency and duration.

    In the music world:
    - Frequency (Hz) determines pitch - higher = higher pitch
    - Duration (seconds) determines how long the note sounds
    - Human hearing range: 20Hz to 20,000Hz
    """

    def __init__(self, name: str, frequency: float, duration: float):
        self.name = name
        self.frequency = frequency
        self.duration = duration

    def __repr__(self):
        return f"Note({self.name}, {self.frequency}Hz, {self.duration}s)"

    def to_dict(self):
        """Convert note to dictionary format for compatibility."""
        return {"name": self.name, "frequency": self.frequency, "duration": self.duration}


def create_sample_song():
    """
    Create a sample song with various notes for demonstration.

    Returns a list of note dictionaries as would come from a music file parser.
    """
    return [
        {"name": "C4", "frequency": 261.63, "duration": 0.5},   # Middle C
        {"name": "D4", "frequency": 293.66, "duration": 0.5},
        {"name": "E4", "frequency": 329.63, "duration": 0.5},
        {"name": "F4", "frequency": 349.23, "duration": 0.5},
        {"name": "G4", "frequency": 392.00, "duration": 0.5},
        {"name": "A4", "frequency": 440.00, "duration": 0.5},   # A above middle C
        {"name": "B4", "frequency": 493.88, "duration": 0.5},
        {"name": "C5", "frequency": 523.25, "duration": 0.5},   # High C (one octave up)
        {"name": "15", "frequency": 15.0, "duration": 1.0},     # Sub-bass (below hearing)
        {"name": "25000", "frequency": 25000.0, "duration": 1.0}, # Ultrasound (above hearing)
        {"name": "C3", "frequency": 130.81, "duration": 1.0},   # Low C (one octave down)
    ]


def demonstrate_map():
    """
    Demonstrate the map() function for transforming data.

    map() applies a function to every element and yields the results.
    It's like a composer transposing every note up by one octave.
    """
    print("=" * 70)
    print("map(): The Composition's Transcription")
    print("=" * 70)

    notes = create_sample_song()

    print("""
    map(function, iterable)
    ========================

    map() applies 'function' to every element of 'iterable'
    and returns an iterator with all the results.

    Musical metaphor: A music transcriber copying a piece
    but transposing every note up by one octave.

    Original notes → Transcriber applies transpose → New notes
    """)

    # Define the transpose function (move up one octave = double frequency)
    def transpose_up_octave(note: dict) -> dict:
        """Transpose a note up by one octave (double the frequency)."""
        return {
            "name": note["name"] + "↑",
            "frequency": note["frequency"] * 2,
            "duration": note["duration"]
        }

    # Use map to transpose all notes
    transposed_notes = list(map(transpose_up_octave, notes))

    print("\n  ORIGINAL NOTES:")
    for note in notes[:5]:  # Show first 5
        print(f"    {note['name']}: {note['frequency']}Hz")

    print("\n  TRANSPOSED UP ONE OCTAVE (via map):")
    for note in transposed_notes[:5]:
        print(f"    {note['name']}: {note['frequency']}Hz")

    print("\n  Key insight:")
    print("    - map() does NOT modify the original notes")
    print("    - It creates NEW transformed notes")
    print("    - This is functional programming: immutability")
    print(f"    - Original still has C4 at {notes[0]['frequency']}Hz")
    print(f"    - Transposed has C4↑ at {transposed_notes[0]['frequency']}Hz")


def demonstrate_filter():
    """
    Demonstrate the filter() function for selecting data.

    filter() keeps only elements where the predicate function returns True.
    It's like a sound engineer who removes frequencies humans can't hear.
    """
    print("\n" + "=" * 70)
    print("filter(): The Sound Engineer's Ear")
    print("=" * 70)

    notes = create_sample_song()

    print("""
    filter(predicate, iterable)
    ============================

    filter() keeps only elements where 'predicate' returns True.
    The predicate is a function that returns True or False.

    Musical metaphor: A sound engineer filters out frequencies
    that humans cannot hear (below 20Hz or above 20,000Hz).

    All notes → Engineer applies filter → Only audible notes
    """)

    # Define the audible range predicate
    def is_audible(note: dict) -> bool:
        """
        Returns True if the note is in the human audible range.
        Human hearing: 20Hz to 20,000Hz
        """
        return 20 <= note["frequency"] <= 20000

    # Use filter to keep only audible notes
    audible_notes = list(filter(is_audible, notes))

    print("\n  ALL NOTES (including inaudible):")
    for note in notes:
        audible = "✓" if is_audible(note) else "✗"
        print(f"    {audible} {note['name']}: {note['frequency']}Hz ({note['duration']}s)")

    print("\n  ONLY AUDIBLE NOTES (via filter, 20Hz-20kHz):")
    for note in audible_notes:
        print(f"    ✓ {note['name']}: {note['frequency']}Hz ({note['duration']}s)")

    print(f"\n  Filtered out {len(notes) - len(audible_notes)} inaudible notes")
    print("  (15Hz sub-bass and 25000Hz ultrasound)")


def demonstrate_reduce():
    """
    Demonstrate the reduce() function for aggregating data.

    reduce() applies a combining function cumulatively, reducing
    the entire sequence to a single value.
    It's like a concert promoter counting total duration of a performance.
    """
    print("\n" + "=" * 70)
    print("reduce(): The Concert Promoter's Tally")
    print("=" * 70)

    notes = create_sample_song()
    audible_notes = list(filter(lambda n: 20 <= n["frequency"] <= 20000, notes))

    print("""
    reduce(function, iterable, initializer)
    =======================================

    reduce() applies 'function' cumulatively:
    - Start with initializer (or first element)
    - Apply function(current_accumulator, next_element)
    - Result becomes new accumulator
    - Continue until all elements processed

    Musical metaphor: A concert promoter adding up the duration
    of all songs to get total concert length.

    [0.5, 0.5, 0.5, ...] → 0.5 + 0.5 + 0.5 + ... → Total: 6.5 seconds
    """)

    # Define the addition function for durations
    def add_durations(total: float, note: dict) -> float:
        """Add a note's duration to the running total."""
        return total + note["duration"]

    # Use reduce to calculate total duration
    total_duration = reduce(add_durations, audible_notes, 0.0)

    print("\n  NOTES AND THEIR DURATIONS:")
    running_total = 0.0
    for note in audible_notes:
        running_total += note["duration"]
        print(f"    {note['name']}: {note['duration']}s  (running: {running_total}s)")

    print(f"\n  TOTAL DURATION (via reduce): {total_duration} seconds")
    print(f"  That's {total_duration / 60:.2f} minutes of music")

    # More complex reduce: find the highest note
    def higher_frequency(note1: dict, note2: dict) -> dict:
        """Return the note with higher frequency."""
        return note1 if note1["frequency"] > note2["frequency"] else note2

    highest_note = reduce(higher_frequency, audible_notes)
    print(f"\n  HIGHEST NOTE (via reduce): {highest_note['name']} at {highest_note['frequency']}Hz")


def demonstrate_full_pipeline():
    """
    Demonstrate chaining map, filter, and reduce into a processing pipeline.

    This is the essence of functional programming: build complex
    transformations by composing simple, pure functions.
    """
    print("\n" + "=" * 70)
    print("FUNCTIONAL PIPELINE: Compose → Filter → Aggregate")
    print("=" * 70)

    print("""
    Functional programming shines when you chain transformations:

        result = reduce(
            aggregate,
            filter(
                predicate,
                map(
                    transformer,
                    data
                )
            )
        )

    Reading from inside out:
    1. Take data
    2. Map (transform each element)
    3. Filter (keep only valid elements)
    4. Reduce (aggregate into single result)
    """)

    notes = create_sample_song()

    # Step 1: Map - transpose everything up one octave
    transposed = list(map(lambda n: {
        "name": n["name"] + "↑",
        "frequency": n["frequency"] * 2,
        "duration": n["duration"]
    }, notes))

    # Step 2: Filter - keep only audible frequencies
    audible = list(filter(lambda n: 20 <= n["frequency"] <= 20000, transposed))

    # Step 3: Reduce - sum total duration
    total = reduce(lambda acc, n: acc + n["duration"], audible, 0.0)

    print("\n  FULL PIPELINE EXAMPLE:")
    print("  1. Start with original notes")
    print("  2. Transpose up one octave (map)")
    print("  3. Keep only audible frequencies (filter)")
    print("  4. Calculate total duration (reduce)")

    print(f"\n  Original notes: {len(notes)}")
    print(f"  After transposition: {len(transposed)}")
    print(f"  After filtering: {len(audible)}")
    print(f"  Total duration: {total} seconds")

    print("\n  Alternative: Use lambda for the whole pipeline")
    pipeline_result = reduce(
        lambda acc, n: acc + n["duration"],
        filter(
            lambda n: 20 <= n["frequency"] <= 20000,
            map(
                lambda n: {**n, "frequency": n["frequency"] * 2, "name": n["name"] + "↑"},
                notes
            )
        ),
        0.0
    )
    print(f"  Pipeline result: {pipeline_result} seconds")


def demonstrate_vs_list_comprehension():
    """
    Compare functional programming with Python's list comprehensions.

    List comprehensions are often more readable for simple cases,
    but map/filter/reduce compose better for complex pipelines.
    """
    print("\n" + "=" * 70)
    print("map/filter/reduce vs LIST COMPREHENSIONS")
    print("=" * 70)

    notes = create_sample_song()

    print("""
    In Python, list comprehensions often replace map/filter:

        # map + filter equivalent:
        [f(x) for x in data if p(x)]

        # vs
        list(map(f, filter(p, data)))

    Which is better? It depends!
    """)

    # Using list comprehension
    lc_result = [n["frequency"] * 2 for n in notes if 20 <= n["frequency"] <= 20000]

    # Using map/filter
    mf_result = list(map(
        lambda n: n["frequency"] * 2,
        filter(lambda n: 20 <= n["frequency"] <= 20000, notes)
    ))

    print(f"\n  List comprehension: {lc_result}")
    print(f"  map/filter:          {mf_result}")
    print(f"  Same result: {lc_result == mf_result}")

    print("""
    LIST COMPREHENSIONS are better when:
    - Simple, single transformations
    - Readability is paramount
    - Transforming one list to another

    map/filter/reduce are better when:
    - Complex multi-step pipelines
    - Need to pass functions around (callbacks)
    - Composing multiple transformations
    - Working with non-list iterables (generators, files)
    """)


def demonstrate_real_world_usage():
    """
    Show real-world applications of functional programming in Python.
    """
    print("\n" + "=" * 70)
    print("REAL-WORLD FUNCTIONAL PROGRAMMING")
    print("=" * 70)

    print("""
    1. DATA PROCESSING PIPELINES (Apache Spark):

        rdd = sc.textFile("logs.txt") \\
              .map(parse_log_line) \\
              .filter(is_error) \\
              .map(lambda e: (e.status_code, 1)) \\
              .reduceByKey(lambda a, b: a + b)

    2. PYTHON'S range() (lazy evaluation in Python 3):

        for i in range(1_000_000_000):  # Does NOT allocate a billion ints!
            process(i)

    3. ITERATOR CHAINS:

        sum(x**2 for x in range(100) if x % 2 == 0)
        # Generator expression (lazy) + sum (reduces to scalar)

    4. PANDAS DataFrames:

        df.filter(df['age'] > 18) \\
          .withColumn('name_upper', upper(col('name'))) \\
          .reduce(lambda a, b: merge_rows(a, b))

    5. CONFIGURATION PROCESSING:

        config = reduce(
            merge_dicts,
            map(load_json_file, config_files)
        )
    """)


def reflection_questions():
    """
    Reflection questions for deeper understanding.
    """
    print("\n" + "=" * 70)
    print("REFLECTION: The Philosophy of Functional Programming")
    print("=" * 70)

    print("""
    1. IMMUTABILITY:
       Why does functional programming prefer not modifying data?
       What problems does mutability cause in concurrent code?

    2. PURE FUNCTIONS:
       A pure function has no side effects and always returns the
       same output for the same input. Why is this desirable?
       Why is len(list) a pure function but list.append() is not?

    3. COMPOSITION OVER INHERITANCE:
       Functional programs build complexity by composing simple
       functions, not by inheriting from class hierarchies.
       Which approach feels more natural to you?

    4. LAZY EVALUATION:
       map() and filter() return iterators, not lists.
       They don't execute until you iterate. Why is this useful?
       What happens if you do map(slow_function, huge_list)?

    5. THE MUSIC CONNECTION:
       Music composition IS functional transformation:
       - Notes → Transpose (map) → Notes
       - Notes → Filter silence (filter) → Notes
       - Notes → Count total (reduce) → Duration

       How does understanding this help you think about code?

    6. MAP/REDUCE IN DATABASES:
       - SELECT duration FROM notes (projection = map)
       - WHERE frequency > 20 (selection = filter)
       - SUM(duration) (aggregation = reduce)

       SQL is secretly a functional programming language!
    """)


if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                    THE MUSICAL COMPOSER                              ║
    ║            Functional Programming with map, filter, reduce           ║
    ╚══════════════════════════════════════════════════════════════════════╝
    """)

    demonstrate_map()
    demonstrate_filter()
    demonstrate_reduce()
    demonstrate_full_pipeline()
    demonstrate_vs_list_comprehension()
    demonstrate_real_world_usage()
    reflection_questions()

    print("\n" + "=" * 70)
    print("The symphony of transformations plays on!")
    print("=" * 70 + "\n")