"""
The Kannada Poet - LRU Cache Implementation

This scenario explores the Least Recently Used (LRU) Cache pattern using Python's
collections.OrderedDict. The metaphor is a poet's assistant who memorizes poems
to avoid the poet having to recompose them.

A famous Kannada poet in a royal court takes 2 seconds to compose a poem on any
given topic. The assistant memorizes recently requested poems but can only hold
3 in memory. When a 4th topic is requested, the oldest (least recently used)
poem is forgotten to make room.

Key Concepts:
- HashMap (dict): Provides O(1) key-value lookups
- OrderedDict: Maintains insertion order AND supports move_to_end()
- LRU (Least Recently Used) eviction policy
- Cache hit vs cache miss optimization
- Memory-speed trade-off in computing
"""

import time
import random
from collections import OrderedDict


class PoetCache:
    """
    LRU Cache for storing composed poems.

    Uses OrderedDict to maintain both O(1) lookup (via dict) and
    ordering for LRU eviction. When the cache exceeds capacity,
    the least recently used item (first item in OrderedDict) is removed.

    The poet's assistant metaphor:
    - compose_poem() is the slow poet who takes time to create
    - get_poem() is the assistant who checks the cache first
    - If topic in cache: instant response (cache hit)
    - If topic not in cache: ask poet, store result, evict LRU if needed (cache miss)
    """

    def __init__(self, capacity: int = 3):
        """
        Initialize the cache with a given capacity.

        In the metaphor, capacity is how many poems the assistant can memorize.

        Args:
            capacity: Maximum number of poems to store (default 3)
        """
        self.capacity = capacity
        # OrderedDict maintains insertion order; first item = LRU, last item = MRU
        self._cache = OrderedDict()
        self._poet_compose_count = 0  # Track how many times poet actually composed

    def get_poem(self, topic: str) -> str:
        """
        Retrieve a poem for the given topic.

        If the poem is in cache, return it instantly (cache hit).
        If not in cache, compose it via the poet, store it, evict if needed (cache miss).

        The key insight: calling move_to_end() on access updates the ordering,
        making this item the Most Recently Used (MRU).

        Args:
            topic: The subject of the poem

        Returns:
            The poem text
        """
        if topic in self._cache:
            # CACHE HIT: Poem is memorized, return instantly
            # Move to end to mark as Most Recently Used
            self._cache.move_to_end(topic)
            return f"[CACHE HIT] \"{self._cache[topic]}\" (returned instantly)"
        else:
            # CACHE MISS: Need to ask the poet to compose
            poem = self._compose_poem(topic)
            self._store_poem(topic, poem)
            return f"[CACHE MISS] \"{poem}\" (composed by poet in 2 seconds)"

    def _compose_poem(self, topic: str) -> str:
        """
        Simulate the poet composing a poem (takes 2 seconds).

        In real systems, this might be:
        - Database query execution
        - API network call
        - Expensive computation
        - File I/O operation
        """
        self._poet_compose_count += 1
        print(f"  [POET] Composing new poem for topic: '{topic}'...")

        # Simulate the slow composition process (2 seconds)
        time.sleep(2)

        # Generate a unique poem based on topic and randomness
        poem_templates = [
            "The {topic} whispers ancient verses",
            "In shadows of {topic}, stories grow",
            "{topic} dances beneath moonlight",
            "The eternal {topic} sings its song",
            "{topic} bears witness to time's flow"
        ]
        template = random.choice(poem_templates)
        return template.format(topic=topic.title())

    def _store_poem(self, topic: str, poem: str):
        """
        Store a newly composed poem in the cache.

        If cache is at capacity, evict the Least Recently Used item
        (the first item in OrderedDict) before adding the new one.

        Args:
            topic: The poem topic (key)
            poem: The poem text (value)
        """
        # Add to cache (or update if exists - which would move to end)
        self._cache[topic] = poem

        # Check if we exceeded capacity
        if len(self._cache) > self.capacity:
            # EVICTION: Remove the Least Recently Used item
            # popitem(last=False) removes the FIRST item (oldest/LRU)
            evicted_topic, evicted_poem = self._cache.popitem(last=False)
            print(f"  [EVICTION] Cache full! Forgetting '{evicted_topic}' (LRU)")
            print(f"  [CACHE] Now storing '{topic}'")

    def cache_status(self) -> dict:
        """
        Return current cache status for debugging.

        Returns:
            Dictionary with cache contents and statistics
        """
        return {
            "contents": dict(self._cache),
            "capacity": self.capacity,
            "size": len(self._cache),
            "poet_compose_count": self._poet_compose_count,
            "cache_hits": len(self._cache),  # Approximate
        }

    def display_cache_order(self):
        """
        Display the current cache ordering from LRU to MRU.
        Useful for understanding how OrderedDict maintains order.
        """
        print("\n  Cache Order (LRU → MRU):")
        for i, (topic, _) in enumerate(self._cache.items()):
            position = "LRU" if i == 0 else ("MRU" if i == len(self._cache) - 1 else "middle")
            print(f"    {i+1}. [{position}] {topic}")


def demonstrate_lru_cache():
    """
    Demonstrate the LRU cache behavior with a sequence of poem requests.
    Shows how the cache hit/miss works and how LRU eviction occurs.
    """
    print("=" * 70)
    print("LRU CACHE DEMONSTRATION: The Kannada Poet")
    print("=" * 70)

    # Create cache with capacity of 3 (assistant can memorize 3 poems)
    cache = PoetCache(capacity=3)

    print("""
    Scenario: The royal court requests poems on various topics.
    The poet takes 2 seconds to compose each NEW topic.
    The assistant can only memorize 3 poems at once.

    Cache Capacity: 3 poems
    """)

    # Sequence of topics requested by the royal court
    requests = [
        ("Monsoon", "First request - cache miss, poet composes"),
        ("Tiger", "Second request - cache miss, poet composes"),
        ("Lotus", "Third request - cache miss, poet composes"),
        ("Monsoon", "Fourth request - CACHE HIT! Instant response"),
        ("King", "Fifth request - cache miss + LRU eviction"),
        ("Tiger", "Sixth request - CACHE HIT! Instant response"),
        ("Elephant", "Seventh request - cache miss + LRU eviction"),
    ]

    print("\n" + "-" * 70)
    print("ROYAL COURT REQUESTS")
    print("-" * 70)

    for i, (topic, explanation) in enumerate(requests, 1):
        print(f"\n{i}. Request for poem about '{topic}'")
        print(f"   Explanation: {explanation}")
        cache.display_cache_order()
        result = cache.get_poem(topic)
        print(f"   Result: {result}")

    print("\n" + "=" * 70)
    print("CACHE STATISTICS")
    print("=" * 70)
    status = cache.cache_status()
    print(f"  Capacity: {status['capacity']}")
    print(f"  Current Size: {status['size']}")
    print(f"  Times Poet Composed: {status['poet_compose_count']}")
    print(f"  Topics in Cache: {list(status['contents'].keys())}")


def demonstrate_hashmap_lookup():
    """
    Demonstrate why HashMap (dict) provides O(1) lookup.
    This is why LRU caches use dict internally.
    """
    print("\n" + "=" * 70)
    print("HASHMAP O(1) LOOKUP EXPLANATION")
    print("=" * 70)

    print("""
    Why is dict lookup O(1)?

    1. Hash Function: Given a key, compute an address directly
       key "Monsoon" → hash() → 5834723948273 → array index

    2. Direct Access: No searching through all items
       List: ["Monsoon", "Tiger", "Lotus"] → O(n) search
       Dict: {"Monsoon": poem, ...} → O(1) direct address

    3. Collision Handling: Modern dicts handle this efficiently
       Python's dict uses open addressing with a carefully tuned load factor

    This is why Redis and Memcached (distributed caches) are HashMaps:
    - O(1) read/write per key
    - Predictable latency regardless of cache size
    """)


def demonstrate_functools_lru_cache():
    """
    Show the standard library's @functools.lru_cache decorator,
    which provides LRU caching with zero boilerplate.
    """
    print("\n" + "=" * 70)
    print("functools.lru_cache - The Magic Decorator")
    print("=" * 70)

    from functools import lru_cache
    import math

    print("""
    Python's standard library provides automatic LRU caching:

        @lru_cache(maxsize=128)
        def slow_function(arg):
            # expensive computation
            return result

    Example: Fibonacci with and without caching
    """)

    # Without cache - exponential time complexity
    def fib_without_cache(n):
        if n <= 1:
            return n
        return fib_without_cache(n-1) + fib_without_cache(n-2)

    # With cache - linear time complexity
    @lru_cache(maxsize=100)
    def fib_with_cache(n):
        if n <= 1:
            return n
        return fib_with_cache(n-1) + fib_with_cache(n-2)

    # Demonstrate the speed difference
    print("\n  Fibonacci(20) WITHOUT cache:")
    start = time.time()
    result1 = fib_without_cache(20)
    print(f"    Result: {result1}, Time: {time.time() - start:.4f}s")

    print("\n  Fibonacci(20) WITH lru_cache:")
    start = time.time()
    result2 = fib_with_cache(20)
    print(f"    Result: {result2}, Time: {time.time() - start:.4f}s")

    print(f"""
    The cached version is dramatically faster because:
    - First call: compute and store result in cache
    - Subsequent calls: return cached result instantly (O(1))

    lru_cache also provides:
    - cache_info(): Debugging (hits, misses, size)
    - cache_clear(): Manually clear the cache
    - maxsize: Limit cache size (LRU eviction for large caches)
    """)

    # Show cache info
    print(f"  Cache info: {fib_with_cache.cache_info()}")


def reflection_prompts():
    """
    Reflection questions for deeper understanding.
    """
    print("\n" + "=" * 70)
    print("REFLECTION QUESTIONS")
    print("=" * 70)
    print("""
    1. REAL-WORLD CONNECTIONS:
       - Think about web caching: CDN, browser cache, Redis
       - How does a CPU L1/L2/L3 cache work differently?

    2. EVICTION POLICIES:
       - LRU (Least Recently Used) - what we implemented
       - LFU (Least Frequently Used) - evict least accessed
       - FIFO (First In First Out) - simple queue
       - Random Replacement - randomly evict any item
       Why is LRU so popular?

    3. MEMORY VS SPEED TRADE-OFF:
       - Larger cache = more memory = more cache hits
       - Smaller cache = less memory = more evictions
       How do you choose the right cache size?

    4. THREAD SAFETY:
       - Our PoetCache is NOT thread-safe
       - What happens if two threads access simultaneously?
       - functools.lru_cache IS thread-safe

    5. CACHE INVALIDATION (HARD PROBLEM):
       - When should a cached item be invalidated?
       - TTL (Time To Live)? Explicit invalidation?
       - What if the underlying data changes?
    """)


if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                    THE KANNADA POET - LRU CACHE                      ║
    ║              OrderedDict-based Caching Demonstration                 ║
    ╚══════════════════════════════════════════════════════════════════════╝
    """)

    demonstrate_lru_cache()
    demonstrate_hashmap_lookup()
    demonstrate_functools_lru_cache()
    reflection_prompts()

    print("\nDemonstration complete. The assistant has learned the art of caching!\n")