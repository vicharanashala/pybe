# The Traffic Jam Case Study

## The Web Crawler

You are building a web crawler that uses 10 concurrent threads to fetch pages from the internet. All threads share a common URL queue when one thread finishes processing a URL, it discovers new links and adds them to the queue for other threads to process.

## The Problem

Your first implementation looks like this:

```python
class UnsafeURLQueue:
    def __init__(self):
        self.urls = []

    def add(self, url):
        self.urls.append(url)  # No synchronization!

    def get(self):
        if self.urls:
            return self.urls.pop(0)  # No synchronization!
        return None
```

You run it and immediately encounter problems:

1. **Two threads add the same URL simultaneously** duplicate work, wasted bandwidth
2. **One thread reads while another is modifying** `IndexError`, corrupted internal state
3. **The list grows without bound** no tracking of what's been seen

You need thread-safe synchronization.

## The Traffic Jam Metaphor

Imagine a narrow one-lane bridge. Cars (threads) approach from both ends. Without a traffic light:
- Cars crash (data corruption)
- No one can move (deadlock)
- Some cars push through regardless (race conditions)

With a traffic light (lock):
- One direction goes, the other waits
- Order is enforced, safety is maintained
- But: if the light breaks or both sides always go green, chaos returns

## The Questions

1. **What is a race condition?** When two threads access shared state simultaneously, and the final outcome depends on the order of execution. How does this differ from a simple "slow" operation?

2. **What is a critical section?** The code that accesses shared state and must be protected. Why must critical sections be as short as possible?

3. **What is a mutex?** A lock that ensures only one thread can access a resource at a time. How does this prevent race conditions?

4. **What is a deadlock?** When two or more threads are waiting for each other to release locks, and none can proceed. What are the conditions for deadlock?

5. **What is the tradeoff between safety and liveness?** Strict locking ensures safety (no corruption) but can cause threads to wait forever (poor liveness). How do you balance?

## The Four Conditions for Deadlock

For deadlock to occur, all four must be true:
1. **Mutual Exclusion** only one thread can hold the lock
2. **Hold and Wait** threads hold locks while waiting for others
3. **No Preemption** locks cannot be forcibly taken away
4. **Circular Wait** thread A waits for thread B, B waits for A

To prevent deadlock, break any one of these conditions.

## Your Task

Implement a thread-safe URL queue using Python's `threading` module:

1. Use `threading.Lock` to protect the critical sections
2. Handle the case where the queue is empty (don't busy-wait)
3. Ensure no duplicate URLs enter the queue
4. Prevent deadlocks by avoiding circular wait conditions
5. Consider using `queue.Queue` a thread-safe queue implementation

Bonus: Simulate the traffic jam with multiple threads adding and removing URLs concurrently, and demonstrate that your synchronized version works while the unsafe version fails.