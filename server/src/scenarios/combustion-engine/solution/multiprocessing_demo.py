from concurrent.futures import ProcessPoolExecutor
import time

def cpu_heavy_task(name):
    """CPU bound task that runs in a separate process."""
    count = 0
    for _ in range(10_000_000):
        count += 1
    return f"Task {name} done with count {count}"

if __name__ == "__main__":
    start_time = time.time()
    
    # ProcessPoolExecutor bypasses the GIL by creating entirely new Python processes
    with ProcessPoolExecutor(max_workers=2) as executor:
        future1 = executor.submit(cpu_heavy_task, "A")
        future2 = executor.submit(cpu_heavy_task, "B")
        
        print(future1.result())
        print(future2.result())
        
    end_time = time.time()
    print(f"Total time with multiprocessing: {end_time - start_time:.2f}s")
    print("Notice how this can be faster than threading for CPU-bound tasks!")
