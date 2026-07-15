import timeit
import bisect
import random

# Setup a list of 10,000 sorted items
data = sorted([random.randint(0, 1000) for _ in range(10000)])
target = data[5000]

def linear_search():
    for item in data:
        if item == target:
            return True
    return False

def binary_search():
    idx = bisect.bisect_left(data, target)
    if idx != len(data) and data[idx] == target:
        return True
    return False

print("Benchmarking search on 10,000 items...")

linear_time = timeit.timeit(linear_search, number=10000)
binary_time = timeit.timeit(binary_search, number=10000)

print(f"Linear Search Time: {linear_time:.4f} seconds")
print(f"Binary Search Time: {binary_time:.4f} seconds")
print(f"Binary search is {linear_time/binary_time:.1f}x faster!")
