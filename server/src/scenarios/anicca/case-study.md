# Anicca Case Study

## The Trading System Crisis

You work on a high-frequency financial trading system that processes thousands of transactions per second. Each transaction requires:

1. Opening a database connection
2. Executing queries to verify account status
3. Recording the transaction
4. Closing the database connection

Your first implementation uses try-finally:

```python
def process_transaction(transaction_id, amount):
    conn = db.connect()
    try:
        verify_account(conn, transaction_id)
        record_transaction(conn, transaction_id, amount)
        db.commit()
    finally:
        conn.close()
```

Developers frequently make mistakes:
- Forgetting the finally block entirely
- Returning early before finally runs
- Catching and suppressing exceptions before close()

After 3 hours of running, the database crashes with 10,000 open, unclosed connections. The cleanup code was never reached because developers returned early on error conditions.

## The Buddhist Teaching

In Buddhism, Anicca (impermanence) teaches that all conditioned phenomena arise and pass away. Nothing is permanent. The flame of a candle exists only as long as its conditions persist when any condition fails, the flame extinguishes.

The with statement in Python embodies this teaching: resources exist within a bounded context. When the context ends normally or via exception the resource is automatically released. The with statement does not assume permanence; it accepts transience and ensures proper endings regardless of circumstances.

## The with Statement Pattern

```python
with expression as variable:
    # use variable
# cleanup happens automatically
```

The expression must return an object implementing the context manager protocol:
- `__enter__(self)` → setup, returns value bound to `as variable`
- `__exit__(self, exc_type, exc_val, exc_tb)` → cleanup, called even on exception

## The Questions

1. **What is the context manager protocol?** What methods must an object implement to be usable with with?

2. **What does __enter__ return?** It returns the resource that will be bound to the `as` variable. For files, it returns the file object itself.

3. **What does __exit__ receive?** It receives exception information (type, value, traceback) if an exception occurred, or None if the block completed normally.

4. **What does contextlib.contextmanager do?** It decorates a generator function to create a context manager. The code before yield is __enter__; after yield is __exit__.

5. **Why is with better than try-finally?** Because with makes cleanup automatic, even on early returns and suppressed exceptions. Developers cannot forget to clean up.

## The Philosophical Question

The Buddhist teacher says: "Clinging to the transient causes suffering."

The Python programmer asks: "Why does the with statement guarantee cleanup, even when I forget?"

The Buddhist teacher replies: "Because you accepted the truth of impermanence when you entered the context. The flame that arises must extinguish. You made peace with this truth at the beginning."

The Python programmer replies: "I used contextlib.contextmanager."

## Your Task

Implement context managers for the trading system:

1. Create a DatabaseConnection class implementing the context manager protocol
2. Create a TransactionContext using contextlib.contextmanager decorator
3. Use contextlib.suppress to handle specific exceptions silently
4. Use contextlib.closing for resources that don't support context management natively
5. Demonstrate that all implementations properly clean up even when exceptions occur