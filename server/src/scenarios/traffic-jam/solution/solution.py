"""
The Traffic Jam Solution
===========================
Mutexes, Threading, Concurrency, and Synchronization

This solution demonstrates how to coordinate multiple threads accessing
shared resources without race conditions, deadlocks, or data corruption.

The traffic jam metaphor: cars (threads) sharing a road (memory).
Without traffic rules (locks), chaos. With too strict rules, gridlock.
"""

import threading
import time
import random
from typing import Set, List, Optional
from queue import Queue, Empty
from dataclasses import dataclass, field


# ============================================================================
# PART 1: The Problem Race Conditions
# ============================================================================

print("=" * 70)
print("PART 1: Race Conditions The Unsafe Queue")
print("=" * 70)

"""
A race condition occurs when two threads access shared state
simultaneously, and the outcome depends on execution order.
"""

class UnsafeURLQueue:
    """Demonstrates what happens WITHOUT synchronization."""

    def __init__(self):
        self.urls = []
        self.visited = set()

    def add(self, url: str) -> bool:
        """Add URL if not already visited. UNSAFE!"""
        if url not in self.visited:
            self.urls.append(url)
            self.visited.add(url)
            return True
        return False

    def get(self) -> Optional[str]:
        """Get next URL. UNSAFE!"""
        if self.urls:
            return self.urls.pop(0)
        return None

    def size(self) -> int:
        return len(self.urls)


def simulate_race_condition():
    """
    Simulate multiple threads racing to add URLs.
    Without synchronization, duplicates or data corruption can occur.
    """
    queue = UnsafeURLQueue()
    errors = []
    duplicate_adds = []

    def worker(thread_id: int, url_count: int):
        for i in range(url_count):
            url = f"http://example.com/page_{i % 10}"  # Some duplicates
            result = queue.add(url)
            if not result:
                duplicate_adds.append(f"Thread {thread_id} duplicate: {url}")

    # Run 5 threads, each trying to add 100 URLs (with duplicates)
    threads = []
    for i in range(5):
        t = threading.Thread(target=worker, args=(i, 100))
        threads.append(t)

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    print(f"\nUnsafe queue results:")
    print(f"  URLs in queue: {queue.size()}")
    print(f"  Unique URLs added: {len(queue.visited)}")
    print(f"  Duplicate attempts: {len(duplicate_adds)}")
    print(f"  Expected unique: 10 (pages 0-9)")
    print(f"  Problem: Race condition may cause wrong count!")


# Run demonstration (may or may not show error depending on timing)
print("\nSimulating race condition...")
simulate_race_condition()


# ============================================================================
# PART 2: The Solution Mutex with threading.Lock
# ============================================================================

print("\n" + "=" * 70)
print("PART 2: Thread-Safe Queue with threading.Lock")
print("=" * 70)

"""
threading.Lock provides mutual exclusion.
Only one thread can hold the lock at a time.
Threads wait (block) until the lock is released.
"""

class SafeURLQueue:
    """URL queue WITH synchronization using Lock."""

    def __init__(self):
        self.urls = []
        self.visited: Set[str] = set()
        self.lock = threading.Lock()  # The mutex!

    def add(self, url: str) -> bool:
        """
        Add URL if not visited. Thread-safe with lock.

        The lock ensures only one thread can modify at a time.
        """
        with self.lock:  # Acquire lock, execute, release lock
            if url not in self.visited:
                self.urls.append(url)
                self.visited.add(url)
                return True
            return False

    def get(self) -> Optional[str]:
        """Get next URL. Thread-safe with lock."""
        with self.lock:
            if self.urls:
                return self.urls.pop(0)
            return None

    def size(self) -> int:
        """Get queue size. Thread-safe with lock."""
        with self.lock:
            return len(self.urls)

    def is_empty(self) -> bool:
        """Check if empty. Thread-safe with lock."""
        with self.lock:
            return len(self.urls) == 0


def demonstrate_safe_queue():
    """Demonstrate the thread-safe queue."""
    queue = SafeURLQueue()

    def worker(thread_id: int, url_count: int):
        for i in range(url_count):
            url = f"http://example.com/page_{i % 10}"
            queue.add(url)

    threads = []
    for i in range(5):
        t = threading.Thread(target=worker, args=(i, 100))
        threads.append(t)

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    print(f"\nSafe queue results:")
    print(f"  URLs in queue: {queue.size()}")
    print(f"  Unique URLs: {len(queue.visited)}")
    print(f"  Expected: 10 unique pages")
    print(f"  Correct: {queue.size() == 10}")


print("\nSimulating safe queue...")
demonstrate_safe_queue()


# ============================================================================
# PART 3: Critical Sections and the with Statement
# ============================================================================

print("\n" + "=" * 70)
print("PART 3: Critical Sections and the with Statement")
print("=" * 70)

"""
A CRITICAL SECTION is the code that accesses shared state.
It should be:
1. As short as possible (less contention)
2. Protected by a lock
3. Free of blocking operations (no wait, sleep inside lock)

The 'with' statement ensures the lock is released even if
an exception occurs.
"""

class BankAccount:
    """Thread-safe bank account."""

    def __init__(self, balance: float = 0):
        self.balance = balance
        self.lock = threading.Lock()

    def deposit(self, amount: float):
        """Deposit money. Critical section is short."""
        with self.lock:
            # Only the balance update is critical
            # Any logging, validation, etc. should happen OUTSIDE
            new_balance = self.balance + amount
            self.balance = new_balance  # This is the critical section

    def withdraw(self, amount: float) -> bool:
        """Withdraw money. Returns False if insufficient funds."""
        with self.lock:
            if self.balance >= amount:
                self.balance -= amount
                return True
            return False

    def get_balance(self) -> float:
        """Get balance. Also needs lock for consistent read."""
        with self.lock:
            return self.balance


# Demonstrate atomic operations
account = BankAccount(1000)

def transfer(source: BankAccount, dest: BankAccount, amount: float):
    """Transfer between accounts atomically."""
    with source.lock:
        with dest.lock:
            if source.balance >= amount:
                source.balance -= amount
                dest.balance += amount


print("\nBank account operations:")
print(f"  Initial balance: {account.get_balance()}")
account.deposit(500)
print(f"  After deposit of 500: {account.get_balance()}")
account.withdraw(200)
print(f"  After withdrawal of 200: {account.get_balance()}")


# ============================================================================
# PART 4: Deadlock The Four Conditions
# ============================================================================

print("\n" + "=" * 70)
print("PART 4: Deadlock The Four Conditions")
print("=" * 70)

"""
DEADLOCK occurs when threads are waiting for each other,
and none can proceed.

Four conditions required for deadlock:
1. Mutual Exclusion only one thread can hold a lock
2. Hold and Wait threads hold locks while waiting for others
3. No Preemption locks can't be forcibly taken
4. Circular Wait A waits for B, B waits for A

Break ANY one condition to prevent deadlock.
"""

def demonstrate_deadlock():
    """
    Demonstrate deadlock with two threads and two locks.
    THIS WILL DEADLOCK if uncommented!
    """

    lock_a = threading.Lock()
    lock_b = threading.Lock()

    def thread_1():
        """Acquire A then B."""
        print("  Thread 1: acquiring A")
        with lock_a:
            time.sleep(0.1)  # Simulate work
            print("  Thread 1: acquiring B")
            with lock_b:
                print("  Thread 1: got both!")

    def thread_2():
        """Acquire B then A OPPOSITE ORDER!"""
        print("  Thread 2: acquiring B")
        with lock_b:
            time.sleep(0.1)  # Simulate work
            print("  Thread 2: acquiring A")
            with lock_a:
                print("  Thread 2: got both!")

    print("\nDemonstrating deadlock potential:")
    print("  Thread 1: lock A then B")
    print("  Thread 2: lock B then A")
    print("  If timing is unlucky, they wait forever!")

    # Simulate without actual deadlock (using timeouts would be real prevention)
    print("\n(Actual deadlock not run to avoid hanging)")


demonstrate_deadlock()


def prevent_deadlock():
    """
    Prevent deadlock by enforcing lock ordering.
    Always acquire locks in the same order.
    """

    lock_a = threading.Lock()
    lock_b = threading.Lock()

    def thread_1():
        """Acquire A then B same order as thread_2."""
        with lock_a:
            with lock_b:
                print("  Thread 1: got both!")

    def thread_2():
        """Acquire A then B SAME ORDER as thread_1."""
        with lock_a:
            with lock_b:
                print("  Thread 2: got both!")

    print("\nPreventing deadlock with lock ordering:")
    print("  Both threads acquire A then B")
    print("  No circular wait deadlock prevented!")


prevent_deadlock()


# ============================================================================
# PART 5: Semaphores Multiple Concurrent Access
# ============================================================================

print("\n" + "=" * 70)
print("PART 5: Semaphores Bounded Resource Access")
print("=" * 70)

"""
A Semaphore allows N threads to access a resource simultaneously.
Unlike Lock (1 thread), Semaphore(N) allows N threads.

Use case: database connection pool of size 10.
"""

class ConnectionPool:
    """Simulated database connection pool."""

    def __init__(self, pool_size: int):
        self.pool_size = pool_size
        self.semaphore = threading.Semaphore(pool_size)
        self.connections_used = 0
        self.lock = threading.Lock()
        print(f"  Created connection pool with {pool_size} connections")

    def acquire_connection(self, thread_id: int) -> int:
        """Acquire a connection from the pool."""
        print(f"  Thread {thread_id}: waiting for connection...")
        self.semaphore.acquire()  # Wait if all connections in use
        with self.lock:
            self.connections_used += 1
            conn_id = self.connections_used
        print(f"  Thread {thread_id}: acquired connection {conn_id}")
        return conn_id

    def release_connection(self, thread_id: int, conn_id: int):
        """Release a connection back to the pool."""
        print(f"  Thread {thread_id}: releasing connection {conn_id}")
        self.connections_used -= 1
        self.semaphore.release()  # Signal that a connection is free


def demonstrate_semaphore():
    """Show how semaphores limit concurrent access."""
    pool = ConnectionPool(pool_size=3)

    def worker(thread_id: int):
        conn = pool.acquire_connection(thread_id)
        time.sleep(random.uniform(0.1, 0.3))  # Simulate query
        pool.release_connection(thread_id, conn)

    threads = []
    for i in range(6):  # 6 threads, but only 3 connections
        t = threading.Thread(target=worker, args=(i,))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print("\n  All threads completed. Pool size prevented overload.")


print("\nDemonstrating semaphore (connection pool):")
demonstrate_semaphore()


# ============================================================================
# PART 6: Events Thread Signaling
# ============================================================================

print("\n" + "=" * 70)
print("PART 6: Events Thread Signaling")
print("=" * 70)

"""
threading.Event allows threads to wait for a signal from another thread.
Useful for: 'start now', 'shutdown', 'data ready' signals.
"""

class CrawlerWithShutdown:
    """Web crawler that responds to shutdown signal."""

    def __init__(self):
        self.url_queue = SafeURLQueue()
        self.shutdown_event = threading.Event()
        self.crawled_count = 0
        self.lock = threading.Lock()

    def signal_shutdown(self):
        """Signal all workers to stop."""
        print("  Main: signaling shutdown...")
        self.shutdown_event.set()

    def should_continue(self) -> bool:
        """Check if we should keep crawling."""
        return not self.shutdown_event.is_set()

    def crawl(self, thread_id: int):
        """Worker that checks shutdown event."""
        while self.should_continue():
            url = self.url_queue.get()
            if url is None:
                time.sleep(0.1)  # Wait for more URLs
                continue

            with self.lock:
                self.crawled_count += 1
            # Simulate crawling
            time.sleep(0.05)

        print(f"  Thread {thread_id}: shutdown received, exiting")


def demonstrate_event():
    """Show event-based shutdown."""
    crawler = CrawlerWithShutdown()

    # Add some URLs
    for i in range(20):
        crawler.url_queue.add(f"http://example.com/page_{i}")

    # Start workers
    threads = []
    for i in range(3):
        t = threading.Thread(target=crawler.crawl, args=(i,))
        threads.append(t)
        t.start()

    # Let them run briefly, then shutdown
    time.sleep(0.5)
    crawler.signal_shutdown()

    for t in threads:
        t.join()

    print(f"\n  Crawled {crawler.crawled_count} pages before shutdown")


print("\nDemonstrating event-based shutdown:")
demonstrate_event()


# ============================================================================
# PART 7: queue.Queue The Production-Ready Solution
# ============================================================================

print("\n" + "=" * 70)
print("PART 7: queue.Queue Thread-Safe Queue")
print("=" * 70)

"""
queue.Queue is a thread-safe queue implementation.
It handles all synchronization internally.

Benefits over manual Lock:
1. Built-in blocking (get() blocks until item available)
2. Built-in size limiting (maxsize)
3. Automatic handling of Empty/Full exceptions
4. JoinableQueue for batch jobs
"""

class URLCrawlerWithQueue:
    """Web crawler using queue.Queue for thread-safe operations."""

    def __init__(self, num_workers: int = 3):
        self.url_queue = Queue()  # Thread-safe!
        self.num_workers = num_workers
        self.crawled_urls = []
        self.crawled_lock = threading.Lock()

    def add_urls(self, urls: List[str]):
        """Add URLs to the queue."""
        for url in urls:
            self.url_queue.put(url)

    def crawl_worker(self, worker_id: int):
        """Worker that pulls URLs from queue."""
        while True:
            try:
                # block=True, timeout=1 allows graceful shutdown
                url = self.url_queue.get(block=True, timeout=0.5)
            except Empty:
                # No URLs for 0.5s, check if queue is truly empty
                if self.url_queue.empty():
                    break
                continue

            # Simulate crawling
            time.sleep(random.uniform(0.05, 0.1))

            with self.crawled_lock:
                self.crawled_urls.append(url)

            self.url_queue.task_done()

    def run(self) -> int:
        """Run crawler and return count of crawled URLs."""
        threads = []
        for i in range(self.num_workers):
            t = threading.Thread(target=self.crawl_worker, args=(i,))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        return len(self.crawled_urls)


def demonstrate_queue():
    """Show queue.Queue usage."""
    crawler = URLCrawlerWithQueue(num_workers=3)

    # Add URLs with some duplicates
    urls = [f"http://example.com/page_{i % 15}" for i in range(30)]
    crawler.add_urls(urls)

    count = crawler.run()

    print(f"\nQueue-based crawler:")
    print(f"  URLs added: {len(urls)}")
    print(f"  URLs crawled: {count}")
    print(f"  (Duplicates filtered by your SafeURLQueue if used)")


print("\nDemonstrating queue.Queue:")
demonstrate_queue()


# ============================================================================
# PART 8: The Producer-Consumer Pattern
# ============================================================================

print("\n" + "=" * 70)
print("PART 8: Producer-Consumer Pattern")
print("=" * 70)

"""
The producer-consumer pattern: producers create work,
consumers process it. The queue is the buffer between them.

This is exactly how the web crawler works:
- Main thread produces URLs
- Worker threads consume URLs
"""

@dataclass
class WorkItem:
    url: str
    priority: int = 0


class PriorityWorkQueue:
    """Thread-safe priority queue for work items."""

    def __init__(self):
        self.queue = Queue()
        self.processed = 0
        self.lock = threading.Lock()

    def add_work(self, item: WorkItem):
        """Add a work item."""
        self.queue.put(item)

    def get_work(self, timeout: float = 1.0) -> Optional[WorkItem]:
        """Get next work item."""
        try:
            return self.queue.get(block=True, timeout=timeout)
        except Empty:
            return None

    def mark_done(self):
        """Mark work item as done."""
        self.queue.task_done()
        with self.lock:
            self.processed += 1


def demonstrate_producer_consumer():
    """Show producer-consumer pattern."""

    work_queue = PriorityWorkQueue()

    def producer():
        """Produce work items."""
        for i in range(20):
            priority = random.randint(1, 3)
            item = WorkItem(url=f"http://example.com/{i}", priority=priority)
            work_queue.add_work(item)
            print(f"  Producer: added {item.url} (priority {priority})")

    def consumer(consumer_id: int):
        """Consume work items."""
        processed = 0
        while True:
            item = work_queue.get_work(timeout=0.5)
            if item is None:
                break
            print(f"  Consumer {consumer_id}: processing {item.url}")
            time.sleep(0.1)
            processed += 1
            work_queue.mark_done()

        print(f"  Consumer {consumer_id}: finished, processed {processed} items")

    # Run with one producer, three consumers
    producer_thread = threading.Thread(target=producer)
    consumer_threads = [threading.Thread(target=consumer, args=(i,)) for i in range(3)]

    producer_thread.start()
    for t in consumer_threads:
        t.start()

    producer_thread.join()
    for t in consumer_threads:
        t.join()

    print(f"\n  Total processed: {work_queue.processed}")


print("\nDemonstrating producer-consumer pattern:")
demonstrate_producer_consumer()


# ============================================================================
# PART 9: RLock Reentrant Lock
# ============================================================================

print("\n" + "=" * 70)
print("PART 9: RLock Reentrant Lock")
print("=" * 70)

"""
RLock (Reentrant Lock) allows the SAME THREAD to acquire the lock
multiple times. The lock is released only when the outermost
acquire is released.

Use case: a recursive function that calls itself while holding a lock.
"""

class RecursiveDataStructure:
    """A tree that uses RLock so nested operations work."""

    def __init__(self):
        self.lock = threading.RLock()  # Reentrant!
        self.data = {}

    def insert_path(self, path: List[str], value):
        """
        Insert value along a path. Uses recursion.
        With Lock, this would deadlock on recursive calls.
        With RLock, same thread can re-enter.
        """
        with self.lock:
            if len(path) == 1:
                self.data[path[0]] = value
            else:
                # Recursive call same thread can still use lock!
                self.insert_path(path[1:], value)


print("\nRLock demonstration (recursive operations):")
rds = RecursiveDataStructure()
rds.insert_path(['users', 'alice', 'profile'], {'name': 'Alice'})
rds.insert_path(['users', 'bob', 'profile'], {'name': 'Bob'})
print(f"  Data structure: {rds.data}")


# ============================================================================
# The Traffic Jam Lesson
# ============================================================================

print("\n" + "=" * 70)
print("THE TRAFFIC JAM LESSON")
print("=" * 70)

print("""
The traffic jam is an emergent phenomenon: individual optimization
leads to collective suboptimal outcomes.

In concurrent programming:

1. RACE CONDITIONS
   Two threads access shared state simultaneously.
   Outcome depends on execution order unpredictable and buggy.

2. CRITICAL SECTIONS
   Code that accesses shared state.
   Must be protected by locks. Keep them SHORT.

3. MUTEX (MUTUAL EXCLUSION)
   Only one thread can hold the lock at a time.
   Threads wait (block) until lock is released.

4. DEADLOCK
   Threads wait forever for each other.
   Four conditions: mutual exclusion, hold & wait, no preemption, circular wait.
   Prevention: break any condition (e.g., lock ordering).

5. SEMAPHORES
   Allow N threads to access a resource.
   Like a pool of connections or tickets.

6. EVENTS
   One thread signals, others wait.
   Like a starting gun or shutdown button.

7. QUEUE.QUEUE
   Thread-safe queue with built-in synchronization.
   The production-ready solution for producer-consumer patterns.

8. RLOCK
   Same thread can acquire lock multiple times.
   Used in recursive operations.

The traffic jam lesson: coordination enables individual threads
to achieve collective efficiency. Without locks (traffic rules),
chaos. With proper synchronization, flow.
""")


# ============================================================================
# Demonstration
# ============================================================================

if __name__ == "__main__":
    print("\n" + "#" * 70)
    print("RUNNING DEMONSTRATION")
    print("#" * 70)

    # Quick summary of what we demonstrated
    print("\nSummary of concurrency patterns:")
    print("  1. Unsafe queue -> race conditions")
    print("  2. Safe queue with Lock -> thread-safe")
    print("  3. Bank account -> atomic operations")
    print("  4. Deadlock demo -> lock ordering prevents it")
    print("  5. Connection pool -> Semaphore limits")
    print("  6. Crawler with Event -> graceful shutdown")
    print("  7. Queue.Queue -> production-ready")
    print("  8. RLock -> recursive safety")

    print("\nAll patterns prevent the traffic jam of data corruption.")