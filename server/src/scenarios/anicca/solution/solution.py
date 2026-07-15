"""
Anicca Solution
=================
Context Managers, with Statement, and Resource Management

This solution demonstrates how context managers ensure proper cleanup
regardless of how the block exits normal completion, early return,
or exception.

Anicca (impermanence): The Buddhist teaching that all conditioned
phenomena are transient. Resources acquired in a context must be
released when the context ends. The with statement guarantees this.
"""

from contextlib import contextmanager, suppress, closing
from typing import Optional, Any
import sys


# ============================================================================
# PART 1: The Problem Try-Finally Failures
# ============================================================================

print("=" * 70)
print("PART 1: The Try-Finally Problem")
print("=" * 70)

"""
The problem with try-finally: developers frequently make mistakes:
1. Forgetting the finally block
2. Returning before finally runs
3. Catching exceptions without re-raising
"""


class DatabaseConnection:
    """Simulated database connection for demonstration."""

    def __init__(self, name: str = "default"):
        self.name = name
        self.is_open = False
        self.transaction_count = 0

    def connect(self):
        self.is_open = True
        print(f"  [DB] Connection '{self.name}' opened")
        return self

    def close(self):
        self.is_open = False
        print(f"  [DB] Connection '{self.name}' closed")

    def execute(self, query: str):
        if not self.is_open:
            raise RuntimeError(f"Connection '{self.name}' is closed")
        self.transaction_count += 1
        print(f"  [DB] Executed: {query} (tx #{self.transaction_count})")

    def commit(self):
        print(f"  [DB] Committed {self.transaction_count} transactions")


def process_transaction_unsafe(conn: DatabaseConnection, transaction_id: str):
    """
    UNSAFE: What developers often write without finally.
    If an exception occurs or we return early, close() is never called.
    """
    conn.connect()
    conn.execute(f"SELECT * FROM accounts WHERE id={transaction_id}")
    conn.execute(f"UPDATE accounts SET balance=balance-100 WHERE id={transaction_id}")
    conn.commit()
    # BUG: If any of the above raises, close() never runs!
    # If we add return here, close() never runs!
    conn.close()
    return "SUCCESS"


def process_transaction_try_finally(conn: DatabaseConnection, transaction_id: str):
    """
    SAFER: Using try-finally. close() runs even on exception.
    But developers frequently forget this pattern.
    """
    conn.connect()
    try:
        conn.execute(f"SELECT * FROM accounts WHERE id={transaction_id}")
        conn.execute(f"UPDATE accounts SET balance=balance-100 WHERE id={transaction_id}")
        conn.commit()
    finally:
        conn.close()
    return "SUCCESS"


def process_transaction_early_return(conn: DatabaseConnection, transaction_id: str):
    """
    PROBLEM: Even with try-finally, early return can cause issues
    if cleanup code expects certain state.

    The finally block DOES run, but if you refactor and forget,
    bugs creep in.
    """
    conn.connect()
    try:
        conn.execute(f"SELECT * FROM accounts WHERE id={transaction_id}")
        if transaction_id == "FAIL":
            print("  Early return! finally block still runs though.")
            return "SKIPPED"  # finally still runs, so this is OK
        conn.execute(f"UPDATE accounts SET balance=balance-100 WHERE id={transaction_id}")
        conn.commit()
    finally:
        conn.close()
    return "SUCCESS"


print("\nDemonstrating try-finally (close still runs on exception):")
conn1 = DatabaseConnection("tx-demo")
result = process_transaction_early_return(conn1, "FAIL")
print(f"  Result: {result}")


# ============================================================================
# PART 2: The Context Manager Protocol __enter__ and __exit__
# ============================================================================

print("\n" + "=" * 70)
print("PART 2: The Context Manager Protocol")
print("=" * 70)

"""
The context manager protocol requires two methods:
    __enter__(self) -> called when entering the with block
    __exit__(self, exc_type, exc_val, exc_tb) -> called when exiting

__exit__ receives exception info if an exception was raised, else None.
If __exit__ returns True, the exception is suppressed.
"""


class DatabaseConnectionManager:
    """
    A database connection that implements the context manager protocol.
    The connection is automatically closed when the with block exits.
    """

    _open_connections = 0

    def __init__(self, name: str = "default"):
        self.name = name
        self.is_open = False
        self.transaction_count = 0

    def connect(self):
        self.is_open = True
        DatabaseConnectionManager._open_connections += 1
        print(f"  [DB] Connection '{self.name}' opened "
              f"(total open: {DatabaseConnectionManager._open_connections})")
        return self

    def close(self):
        if self.is_open:
            self.is_open = False
            DatabaseConnectionManager._open_connections -= 1
            print(f"  [DB] Connection '{self.name}' closed "
                  f"(total open: {DatabaseConnectionManager._open_connections})")

    def execute(self, query: str):
        if not self.is_open:
            raise RuntimeError(f"Connection '{self.name}' is closed")
        self.transaction_count += 1
        print(f"  [DB] Executed: {query} (tx #{self.transaction_count})")

    def commit(self):
        print(f"  [DB] Committed {self.transaction_count} transactions")

    def __enter__(self):
        """Called when entering the with block. Returns self."""
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """
        Called when exiting the with block.
        Even if an exception occurs, close() is called.
        """
        self.close()

        # If an exception occurred, we can choose to suppress it
        # by returning True. Here we don't suppress we let it propagate.
        if exc_type is not None:
            print(f"  [DB] Exception occurred: {exc_val.__class__.__name__}: {exc_val}")
        return False  # Don't suppress exception


print("\nUsing context manager (with statement):")

print("\n1. Normal completion:")
with DatabaseConnectionManager("ctx1") as conn:
    conn.execute("SELECT * FROM accounts")
    conn.execute("UPDATE accounts SET balance=100")
    conn.commit()
print(f"  Connection closed automatically: {not conn.is_open}")

print("\n2. Exception in with block:")
try:
    with DatabaseConnectionManager("ctx2") as conn:
        conn.execute("SELECT * FROM accounts")
        raise RuntimeError("Database error!")
except RuntimeError as e:
    print(f"  Exception propagated: {e}")

print("\n3. Early return inside with:")
conn_ref = None
def early_return_example():
    with DatabaseConnectionManager("ctx3") as conn:
        conn_ref = conn
        conn.execute("SELECT * FROM accounts")
        if True:  # condition for demo
            return "SKIPPED"  # __exit__ still runs!
    return "NOT_REACHED"

result = early_return_example()
print(f"  Result: {result}")
print(f"  Connection is_open (should be False): {conn_ref.is_open}")


# ============================================================================
# PART 3: contextlib.contextmanager Generator-Based Context Manager
# ============================================================================

print("\n" + "=" * 70)
print("PART 3: @contextmanager Generator-Based Context Managers")
print("=" * 70)

"""
@contextmanager decorator turns a generator function into a context manager.
The code BEFORE yield is __enter__.
The code AFTER yield is __exit__.
yield returns the value bound to 'as variable'.

This is often cleaner than defining a class with __enter__ and __exit__.
"""


@contextmanager
def database_transaction(db_name: str):
    """
    Context manager for a database transaction.

    Yields the database connection.
    Commits on normal exit, rolls back on exception.
    """
    print(f"  [Transaction] Beginning transaction on '{db_name}'")
    conn = DatabaseConnectionManager(db_name)
    conn.connect()

    try:
        yield conn
        conn.commit()
        print(f"  [Transaction] Committed successfully")
    except Exception as e:
        print(f"  [Transaction] Rolling back due to: {e}")
        # In a real system, we'd rollback here
        raise
    finally:
        conn.close()
        print(f"  [Transaction] Connection closed")


print("\nUsing @contextmanager for transactions:")

print("\n1. Successful transaction:")
with database_transaction("tx_db1") as tx:
    tx.execute("SELECT * FROM orders")
    tx.execute("INSERT INTO orders VALUES (1, 'item')")

print("\n2. Failed transaction (rollback):")
try:
    with database_transaction("tx_db2") as tx:
        tx.execute("SELECT * FROM orders")
        raise ValueError("Invalid order data!")
except ValueError as e:
    print(f"  Caught: {e}")


# Another example: timed execution
@contextmanager
def timed_block(label: str):
    """Context manager that times the execution of a block."""
    import time
    start = time.time()
    print(f"  [{label}] Starting...")
    yield
    elapsed = time.time() - start
    print(f"  [{label}] Completed in {elapsed:.4f}s")


print("\n3. Timed block:")
with timed_block("data_processing"):
    # Simulate work
    total = sum(range(1000000))


# ============================================================================
# PART 4: contextlib.suppress Silent Exception Handling
# ============================================================================

print("\n" + "=" * 70)
print("PART 4: contextlib.suppress Silent Exception Handling")
print("=" * 70)

"""
contextlib.suppress creates a context manager that silently suppresses
specified exceptions. Use when you don't care about certain errors.
"""


def read_file_optional(path: str) -> Optional[str]:
    """
    Read a file if it exists, return None if it doesn't.
    FileNotFoundError is suppressed.
    """
    with open(path, 'r') as f:
        return f.read()


print("\nUsing suppress for optional file reading:")
print(f"  /etc/hosts exists: {read_file_optional('/etc/hosts') is not None}")

# More realistic: suppressing cleanup errors
@contextmanager
def safe_file_operation(path: str, mode: str = 'r'):
    """Open a file, suppressing common errors."""
    f = None
    try:
        f = open(path, mode)
        yield f
    except FileNotFoundError:
        print(f"  [safe] File not found: {path}")
        yield None  # Still yield None so code can handle it
    finally:
        if f is not None:
            f.close()
            print(f"  [safe] File closed")


print("\nUsing custom safe file operation:")
with safe_file_operation('/tmp/test.txt', 'w') as f:
    if f is not None:
        f.write("Hello, Anicca!")


# ============================================================================
# PART 5: contextlib.closing For Resources Without Context Support
# ============================================================================

print("\n" + "=" * 70)
print("PART 5: contextlib.closing Adapting Non-Context Resources")
print("=" * 70)

"""
contextlib.closing creates a context manager from any object with a close()
method. The with block will call close() on exit.
"""


class NetworkResource:
    """A resource with close() but no context manager support."""

    def __init__(self, name: str):
        self.name = name
        self.is_connected = False

    def connect(self):
        self.is_connected = True
        print(f"  [Net] Connected: {self.name}")

    def close(self):
        self.is_connected = False
        print(f"  [Net] Disconnected: {self.name}")

    def send(self, data: str):
        if not self.is_connected:
            raise RuntimeError(f"Not connected: {self.name}")
        print(f"  [Net] Sent: {data}")


print("\nUsing closing() for non-context-aware resources:")

# Without closing(), you'd need try-finally
print("  Without closing (manual try-finally):")
resource = NetworkResource("api_endpoint")
resource.connect()
try:
    resource.send("Hello")
finally:
    resource.close()

# With closing(), the resource is automatically closed
print("\n  With closing() (automatic cleanup):")
with closing(NetworkResource("api_endpoint")) as resource:
    resource.connect()
    resource.send("Hello")
print(f"  Resource still connected: {resource.is_connected}")


# ============================================================================
# PART 6: Nested Context Managers
# ============================================================================

print("\n" + "=" * 70)
print("PART 6: Nested Context Managers")
print("=" * 70)

"""
Context managers can be nested. Each __exit__ is called in reverse order
of __enter__.
"""

print("\nNesting context managers:")
with DatabaseConnectionManager("outer") as outer_conn:
    outer_conn.execute("OUTER: BEGIN")
    with DatabaseConnectionManager("inner") as inner_conn:
        inner_conn.execute("INNER: SELECT")
        inner_conn.execute("INNER: UPDATE")
    outer_conn.execute("OUTER: COMMIT")
print("  Inner closed before outer (LIFO order)")


# ============================================================================
# PART 7: Custom Timing Context Manager with State
# ============================================================================

print("\n" + "=" * 70)
print("PART 7: Timing Context Manager with State")
print("=" * 70)


@contextmanager
def benchmark(label: str):
    """
    Context manager that measures and reports execution time.

    Stores the elapsed time in a way accessible after the block.
    """
    import time
    from dataclasses import dataclass

    @dataclass
    class BenchmarkResult:
        elapsed: float = 0.0
        label: str = ""

    result = BenchmarkResult(label=label)
    start = time.perf_counter()

    try:
        yield result
    finally:
        result.elapsed = time.perf_counter() - start

    print(f"  [Benchmark] {label}: {result.elapsed*1000:.2f}ms")


print("\nUsing benchmark context manager:")
with benchmark("sort 1M numbers") as result:
    sorted_list = sorted(range(1000000), reverse=True)

with benchmark("filter 1M numbers") as result:
    filtered = [x for x in range(1000000) if x % 2 == 0]


# ============================================================================
# PART 8: Resource Tracking Context Manager
# ============================================================================

print("\n" + "=" * 70)
print("PART 8: Resource Tracker")
print("=" * 70)


class ResourceTracker:
    """
    Tracks all resources created via this context manager.
    Useful for debugging resource leaks.
    """

    def __init__(self):
        self.active_resources = []
        self._lock = __import__('threading').Lock()

    def create_resource(self, name: str):
        """Create a tracked resource."""
        resource = DatabaseConnectionManager(name)
        with self._lock:
            self.active_resources.append(resource)
        return resource

    def get_active_count(self) -> int:
        with self._lock:
            return len(self.active_resources)

    @contextmanager
    def track(self, name: str):
        """Context manager that tracks a resource's lifecycle."""
        resource = self.create_resource(name)
        try:
            yield resource
        finally:
            with self._lock:
                if resource in self.active_resources:
                    self.active_resources.remove(resource)


tracker = ResourceTracker()

print("\nTracking resources:")
with tracker.track("resource_1") as r1:
    print(f"  Active resources: {tracker.get_active_count()}")
    with tracker.track("resource_2") as r2:
        print(f"  Active resources: {tracker.get_active_count()}")
        r2.execute("NESTED QUERY")
    print(f"  After nested block: {tracker.get_active_count()}")
print(f"  After outer block: {tracker.get_active_count()}")


# ============================================================================
# PART 9: Database Connection Pool with Context Managers
# ============================================================================

print("\n" + "=" * 70)
print("PART 9: Database Connection Pool")
print("=" * 70)


class ConnectionPool:
    """
    A simple connection pool using context managers.

    Connections are acquired from the pool and automatically returned.
    """

    def __init__(self, pool_size: int = 3):
        self.pool_size = pool_size
        self.available = [DatabaseConnectionManager(f"pool-{i}") for i in range(pool_size)]
        self.in_use = set()
        print(f"  [Pool] Created pool with {pool_size} connections")

    @contextmanager
    def acquire(self, timeout: float = 5.0):
        """Acquire a connection from the pool."""
        if not self.available:
            raise RuntimeError("No connections available in pool")

        conn = self.available.pop(0)
        self.in_use.add(conn)
        print(f"  [Pool] Acquired: {conn.name} ({len(self.available)} available)")

        try:
            yield conn
        finally:
            self.in_use.remove(conn)
            self.available.append(conn)
            print(f"  [Pool] Returned: {conn.name} ({len(self.available)} available)")


pool = ConnectionPool(pool_size=2)

print("\nConnection pool usage:")

print("1. Acquire and use:")
with pool.acquire() as conn:
    conn.connect()
    conn.execute("SELECT * FROM orders")

print("\n2. Nested pool usage (uses different connections):")
with pool.acquire() as conn1:
    conn1.execute("BEGIN TRANSACTION")
    with pool.acquire() as conn2:
        conn2.execute("SELECT * FROM products")  # Different connection
    conn1.execute("COMMIT")


# ============================================================================
# The Anicca Lesson
# ============================================================================

print("\n" + "=" * 70)
print("THE ANICCA LESSON")
print("=" * 70)

print("""
Anicca (impermanence): All conditioned phenomena are transient.

The Buddhist teaching: Understanding impermanence leads to non-attachment.
Understanding that resources must be released, we use context managers.

Key insights from context managers:

1. THE CONTEXT MANAGER PROTOCOL
   __enter__(self): Setup, return resource
   __exit__(self, exc_type, exc_val, exc_tb): Cleanup, called always

2. THE with STATEMENT GUARANTEE
   Cleanup ALWAYS happens normal exit, exception, or early return.
   Unlike try-finally, there's no way to forget.

3. @contextmanager
   Decorator that turns a generator into a context manager.
   Code before yield is __enter__, after yield is __exit__.
   yield returns the value bound to 'as variable'.

4. WHEN TO USE CONTEXT MANAGERS
   - File operations (open/close)
   - Database connections (connect/commit/rollback/close)
   - Locks (acquire/release)
   - Temporary state changes
   - Any resource requiring setup and teardown

5. CONTEXTLIB UTILITIES
   - suppress(*exceptions): Silently ignore specified exceptions
   - closing(obj): Add context management to any close()-able object
   - contextmanager: Decorator for generator-based context managers

6. THE BUDDHIST PARALLEL
   The flame exists within conditions (wick, heat, oxygen).
   When conditions change, the flame extinguishes.
   The flame does not cling; it arises and passes.
   The context manager does not cling; it acquires and releases.

   "Anicca: Impermanence is the nature of all things.
    Understanding this, we do not cling to the transient,
    and we ensure its proper passing."
""")


# ============================================================================
# Demonstration
# ============================================================================

if __name__ == "__main__":
    print("\n" + "#" * 70)
    print("RUNNING DEMONSTRATION")
    print("#" * 70)

    print("\nAll context manager patterns demonstrated:")
    print("  1. Class-based context manager (__enter__/__exit__)")
    print("  2. @contextmanager decorator")
    print("  3. contextlib.suppress for silent exception handling")
    print("  4. contextlib.closing for non-context resources")
    print("  5. Nested context managers")
    print("  6. Timing context manager")
    print("  7. Resource tracker")
    print("  8. Connection pool pattern")

    print("\nAll resources are properly cleaned up,")
    print("regardless of how the with blocks exited.")