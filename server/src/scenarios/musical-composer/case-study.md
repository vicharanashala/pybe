You are building a digital synthesizer backend that processes raw sequences of musical notes. The input data is a list of note dictionaries, each containing a `frequency` (in Hz) and `duration` (in milliseconds).

Task 1: The composer wants to transpose the entire melody up one octave. In acoustics, this means doubling the frequency of each note. Write a functional pipeline using `map` and a `lambda` to apply this transformation.

Task 2: Some generated notes fall outside the human audible range (20 Hz to 20,000 Hz). Use `filter` to discard any notes that cannot be heard.

Task 3: To allocate the correct amount of audio buffer, the system needs the total duration of the track. Use `functools.reduce` to sum the `duration` of all valid notes in the sequence.

Combine these operations into a clean functional pipeline.
