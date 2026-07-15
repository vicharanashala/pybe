import time
from collections import OrderedDict

def compose_poem(topic):
    """Simulates an expensive, time-consuming function."""
    print(f"Poet is thinking deeply about '{topic}'... (takes 2 seconds)")
    time.sleep(2)
    return f"A beautiful Kannada poem about the majestic {topic}."

class PoetCache:
    def __init__(self, capacity):
        self.capacity = capacity
        # OrderedDict maintains insertion order, allowing us to track LRU
        self.cache = OrderedDict()

    def get_poem(self, topic):
        if topic in self.cache:
            # CACHE HIT
            print(f"[CACHE HIT] Instantly reciting the poem about '{topic}'!")
            # Move the accessed item to the end (Most Recently Used position)
            self.cache.move_to_end(topic)
            return self.cache[topic]
        else:
            # CACHE MISS
            print(f"[CACHE MISS] I don't remember a poem about '{topic}'. Asking the poet...")
            # Call the expensive function
            poem = compose_poem(topic)
            
            # Store the result in the cache
            self.cache[topic] = poem
            
            # Check if we exceeded our memory capacity
            if len(self.cache) > self.capacity:
                # Remove the first item (Least Recently Used)
                # popitem(last=False) acts like a Queue (FIFO)
                forgotten_topic, _ = self.cache.popitem(last=False)
                print(f"[EVICTION] My memory is full. I have forgotten the poem about '{forgotten_topic}'.")
            
            return poem

if __name__ == "__main__":
    # Initialize the assistant with a memory of 3 poems
    assistant = PoetCache(capacity=3)
    
    # Sequence of requests
    requests = [
        "Monsoon",  # Miss -> Cache: [Monsoon]
        "Tiger",    # Miss -> Cache: [Monsoon, Tiger]
        "Lotus",    # Miss -> Cache: [Monsoon, Tiger, Lotus]
        "Monsoon",  # Hit  -> Cache: [Tiger, Lotus, Monsoon] (Monsoon is now MRU)
        "King",     # Miss -> Cache exceeds 3. 'Tiger' is LRU and evicted. Cache: [Lotus, Monsoon, King]
        "Tiger"     # Miss -> 'Tiger' was evicted, so it must be composed again!
    ]
    
    for req in requests:
        print(f"\n--- Requesting poem about: {req} ---")
        start_time = time.time()
        poem = assistant.get_poem(req)
        end_time = time.time()
        print(f"Result: {poem}")
        print(f"Time taken: {end_time - start_time:.2f} seconds")
