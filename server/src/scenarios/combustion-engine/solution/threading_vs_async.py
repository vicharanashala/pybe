import threading
import time

# A CPU-bound task that demonstrates the Global Interpreter Lock (GIL) constraint
def cpu_heavy_task(name):
    print(f"Task {name} started")
    count = 0
    for _ in range(10_000_000):
        count += 1
    print(f"Task {name} finished")

if __name__ == "__main__":
    start_time = time.time()
    
    # Because of the GIL, these threads will not execute bytecodes in parallel 
    # on multiple cores. They will context switch, making the total time roughly
    # equal to running them sequentially.
    t1 = threading.Thread(target=cpu_heavy_task, args=("A",))
    t2 = threading.Thread(target=cpu_heavy_task, args=("B",))
    
    t1.start()
    t2.start()
    
    t1.join()
    t2.join()
    
    end_time = time.time()
    print(f"Total time with threading: {end_time - start_time:.2f}s")
