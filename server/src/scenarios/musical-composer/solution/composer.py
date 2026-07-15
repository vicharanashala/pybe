from functools import reduce

def process_music(notes):
    # Task 1: Transpose up one octave (double frequency)
    transposed = map(lambda note: {'frequency': note['frequency'] * 2, 'duration': note['duration']}, notes)
    
    # Task 2: Filter audible range (20 Hz to 20,000 Hz)
    audible = filter(lambda note: 20 <= note['frequency'] <= 20000, transposed)
    
    # We must consume the iterator into a list so we can pass it to reduce and return it
    audible_notes = list(audible)
    
    # Task 3: Reduce to total duration
    total_duration = reduce(lambda acc, note: acc + note['duration'], audible_notes, 0)
    
    return audible_notes, total_duration

if __name__ == "__main__":
    raw_notes = [
        {'frequency': 10, 'duration': 500},    # Inaudible even after doubling (20Hz) - wait, 10*2=20, so audible. Let's make it 5.
        {'frequency': 5, 'duration': 500},     # 10Hz, inaudible
        {'frequency': 220, 'duration': 1000},  # 440Hz, audible
        {'frequency': 440, 'duration': 500},   # 880Hz, audible
        {'frequency': 15000, 'duration': 200}  # 30000Hz, inaudible
    ]
    
    notes, duration = process_music(raw_notes)
    print("Audible Notes:", notes)
    print("Total Duration:", duration)
