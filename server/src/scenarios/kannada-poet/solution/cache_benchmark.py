import time
import random
from functools import lru_cache

# A slow function to simulate heavy computation or DB lookup
def slow_function(x):
    time.sleep(0.01)
    return x * x

# Same function but cached
@lru_cache(maxsize=128)
def cached_slow_function(x):
    time.sleep(0.01)
    return x * x

if __name__ == "__main__":
    # Generate requests with some locality (repeating inputs)
    requests = [random.randint(1, 10) for _ in range(100)]
    
    start = time.time()
    for req in requests:
        slow_function(req)
    unached_time = time.time() - start
    
    start = time.time()
    for req in requests:
        cached_slow_function(req)
    cached_time = time.time() - start
    
    print(f"Uncached time: {unached_time:.2f}s")
    print(f"Cached time:   {cached_time:.2f}s")
    print(f"Cache info: {cached_slow_function.cache_info()}")
