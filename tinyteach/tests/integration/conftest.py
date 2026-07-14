"""Integration-test fixtures.

The integration suite generates a realistic-looking PDF on disk (no
binary fixtures committed to git) and reuses the same data directory
across tests via ``tmp_data_dir`` from ``tests/conftest.py``.
"""

from __future__ import annotations

from pathlib import Path

import pymupdf
import pytest

# --- begin: realistic-pdf --------------------------------------------------
_PYTHON_PAGES = [
    """Chapter 1 — Introduction to Python.

    Python is a high-level, interpreted programming language created by
    Guido van Rossum and first released in 1991. It emphasises code
    readability and a syntax that lets programmers express ideas in
    fewer lines than languages like C++ or Java.

    def greet(name):
        return f"hello {name}"

    print(greet("aditya"))
    """,
    """Chapter 2 — Functions and Decorators.

    A decorator in Python is a function that takes another function and
    extends its behaviour without permanently modifying it. The @ syntax
    is syntactic sugar for ``my_fn = my_decorator(my_fn)``.

    def border(fn):
        def inner(*args, **kwargs):
            print("=" * 20)
            result = fn(*args, **kwargs)
            print("=" * 20)
            return result
        return inner

    @border
    def say(msg):
        print(msg)
    """,
    """Chapter 3 — Loops and Iteration.

    Python's for-loop iterates over any iterable. The same loop body
    works on lists, tuples, sets, dicts, strings, and file objects —
    a uniformity that functional languages envy and static languages
    struggle to match.

    for token in "python":
        print(token)

    numbers = [1, 2, 3, 4, 5]
    squares = [n * n for n in numbers]
    """,
    """Chapter 4 — Recursion.

    A recursive function calls itself with a smaller sub-problem. The
    Ackermann function A(m, n) grows so fast it overflows even at
    A(4, 1) on any practical machine. Python's recursion limit is
    configurable via ``sys.setrecursionlimit``.

    def factorial(n):
        if n <= 1:
            return 1
        return n * factorial(n - 1)
    """,
    """Chapter 5 — Data Structures.

    Python's built-in ``dict`` is a hash map with a fascinating
    implementation detail: it switches from open addressing to a
    compact layout once it exceeds 2/3 load. This is the kind of
    detail that LISP hackers debate over coffee, while Python
    programmers take it for granted.

    ages = {"alice": 30, "bob": 25}
    ages["carol"] = 28
    """,
]


@pytest.fixture()
def python_book_pdf(tmp_path: Path) -> Path:
    """A 5-page realistic-Python-content PDF on disk for integration tests."""
    path = tmp_path / "python_book.pdf"
    doc = pymupdf.open()
    try:
        for body in _PYTHON_PAGES:
            page = doc.new_page()
            # Each page gets the full text on its own. insert_textbox
            # wraps automatically; we pass a large rect so nothing is
            # truncated for our short chapters.
            rect = pymupdf.Rect(72, 72, page.rect.width - 72, page.rect.height - 72)
            page.insert_textbox(rect, body, fontsize=10, fontname="helv")
        doc.save(str(path))
    finally:
        doc.close()
    assert path.exists() and path.stat().st_size > 0
    return path


# --- end: realistic-pdf ---------------------------------------------------
