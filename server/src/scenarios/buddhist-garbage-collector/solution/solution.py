"""
The Buddhist Garbage Collector - Reference Solution
====================================================
Domain: Philosophy / Memory Management

Target Constructs:
- Reference counting with sys.getrefcount()
- Circular references
- gc module for garbage collection
- weakref for non-owning references
- del statement and its limitations

This solution demonstrates how circular references prevent objects from
being garbage collected, and how weakref provides a Buddhist solution -
acknowledging existence without clinging.
"""

import sys
import gc
import weakref
from typing import Optional


class Monk:
    """
    Represents a monk in our Buddhist meditation system.

    Monks can form teacher-student relationships (circular references).
    When a monk is deleted, their references to others should be cleared
    so everyone can "pass on peacefully" (be garbage collected).
    """

    def __init__(self, name: str):
        self.name = name
        self.teacher: Optional['Monk'] = None
        self.students: list = []
        print(f"[Monk] {name} entered the monastery")

    def set_teacher(self, teacher: 'Monk') -> None:
        """Set this monk's teacher (creates a reference)."""
        self.teacher = teacher
        teacher.students.append(self)

    def meditate(self) -> str:
        """Simulate meditation."""
        return f"{self.name} is meditating"

    def __del__(self):
        print(f"[Monk] {self.name} has left the monastery (finalizer called)")

    def __repr__(self) -> str:
        teacher_name = self.teacher.name if self.teacher else "None"
        return f"Monk({self.name}, teacher={teacher_name})"


def demonstrate_reference_counting() -> None:
    """
    Demonstrate how reference counting works in Python.

    Every object has a reference count that increases when a reference
    is created and decreases when a reference is deleted. When count
    reaches zero, the object is immediately destroyed.
    """
    print("\n" + "=" * 60)
    print("REFERENCE COUNTING: The Foundation of Python Memory")
    print("=" * 60)

    obj = object()
    initial_count = sys.getrefcount(obj)
    print(f"\n* Created an empty object *")
    print(f"  Reference count: {initial_count}")

    ref1 = obj
    count_with_ref = sys.getrefcount(obj)
    print(f"\n* Created second reference (ref1 = obj) *")
    print(f"  Reference count: {count_with_ref}")

    ref2 = obj
    count_again = sys.getrefcount(obj)
    print(f"\n* Created third reference (ref2 = obj) *")
    print(f"  Reference count: {count_again}")

    del ref1
    count_after_del = sys.getrefcount(obj)
    print(f"\n* Deleted ref1 (del ref1) *")
    print(f"  Reference count: {count_after_del}")

    del ref2
    print(f"\n* Deleted ref2 (del ref2) *")
    print(f"  Reference count: {sys.getrefcount(obj)}")

    print(f"\n* Only 'obj' reference remains *")
    del obj
    print(f"  Object destroyed when last reference deleted")


def demonstrate_circular_reference() -> None:
    """
    Demonstrate how circular references prevent garbage collection.

    When two objects reference each other (A -> B, B -> A), their
    reference counts never reach zero even after all external refs
    are deleted. Python's gc module must periodically detect and
    break these cycles.
    """
    print("\n" + "=" * 60)
    print("CIRCULAR REFERENCES: The Attachment Problem")
    print("=" * 60)

    monk1 = Monk("Ajahn Chah")
    monk2 = Monk("Mahasi")

    print(f"\n* Before circular reference: *")
    print(f"  monk1 refcount: {sys.getrefcount(monk1) - 1}")
    print(f"  monk2 refcount: {sys.getrefcount(monk2) - 1}")

    print(f"\n* Creating teacher-student bond (circular reference)... *")
    monk1.set_teacher(monk2)

    print(f"\n* After circular reference: *")
    print(f"  monk1 refcount: {sys.getrefcount(monk1) - 1}")
    print(f"  monk2 refcount: {sys.getrefcount(monk2) - 1}")

    external_ref = monk1

    print(f"\n* Deleting local references (but keeping external_ref)... *")
    del monk1
    del monk2

    print(f"  monk1 and monk2 still exist due to circular reference!")
    print(f"  External reference points to: {external_ref}")

    print(f"\n* Even deleting external reference doesn't free them: *")
    del external_ref

    print("  monk1 and monk2 still exist in memory!")
    print("  They can only be freed by the garbage collector...")

    collected = gc.collect()
    print(f"\n* gc.collect() ran and collected {collected} objects *")


def demonstrate_weakref_solution() -> None:
    """
    Demonstrate how weakref prevents the attachment problem.

    A weak reference doesn't increase the reference count. It's like
    acknowledging someone's existence without clinging to them. When
    all strong references are gone, the weak reference gracefully
    becomes None.
    """
    print("\n" + "=" * 60)
    print("WEAKREF: The Buddhist Solution")
    print("=" * 60)

    class Student:
        def __init__(self, name: str):
            self.name = name
            self.mentor_ref: Optional[weakref.ref] = None
            print(f"[Student] {name} enrolled")

        def set_mentor(self, mentor: 'Mentor') -> None:
            self.mentor_ref = weakref.ref(mentor)

        def get_mentor(self) -> Optional['Mentor']:
            return self.mentor_ref() if self.mentor_ref else None

        def __del__(self):
            print(f"[Student] {self.name} graduated (finalizer)")

    class Mentor:
        def __init__(self, name: str):
            self.name = name
            self.students: list = []
            print(f"[Mentor] {name} started teaching")

        def add_student(self, student: Student) -> None:
            self.students.append(student)
            student.set_mentor(self)

        def __del__(self):
            print(f"[Mentor] {self.name} retired (finalizer)")

    print("\n* Creating mentor-student relationship with weakref... *")
    mentor = Mentor("Master Fu")
    student = Student("Leo")

    mentor.add_student(student)

    print(f"\n* Leo's mentor (via weakref): {student.get_mentor()} *")
    print(f"  Reference count of mentor: {sys.getrefcount(mentor) - 1}")

    print(f"\n* Deleting the mentor... *")
    del mentor

    print(f"* Leo's mentor after deletion: {student.get_mentor()} *")
    print("  The mentor was properly garbage collected!")
    print("  No circular reference kept it alive.")

    print(f"\n* Now deleting Leo... *")
    del student
    print("  Leo was also properly garbage collected!")


def demonstrate_weakref_with_caching() -> None:
    """
    Demonstrate using weakref for caching to avoid memory leaks.

    A common use of weakref is in caches - the cached objects can be
    garbage collected when memory is needed, preventing cache bloat.
    """
    print("\n" + "=" * 60)
    print("WEAKREF CACHE: Letting Go When Memory Is Tight")
    print("=" * 60)

    cache: dict = {}
    data_store = {}

    class CacheEntry:
        def __init__(self, value):
            self.value = value

        def __repr__(self):
            return f"CacheEntry({self.value!r})"

    def get_from_cache(key: str) -> Optional[str]:
        """Get value from cache if available."""
        entry_ref = cache.get(key)
        if entry_ref:
            entry = entry_ref()
            if entry:
                return entry.value
            else:
                del cache[key]
        return None

    def put_in_cache(key: str, value: str) -> None:
        """Store value in cache using weak reference."""
        cache[key] = weakref.ref(CacheEntry(value))

    print("\n* Populating cache... *")
    put_in_cache("config", "user_settings")
    put_in_cache("session", "abc123")
    put_in_cache("temp", "intermediate_data")

    print(f"  Cache keys: {list(cache.keys())}")
    print(f"  Retrieved 'config': {get_from_cache('config')}")

    print("\n* Checking cache after simulated memory pressure... *")
    print(f"  Cache entries still valid: {sum(1 for r in cache.values() if r() is not None)}")
    print("  Entries whose objects were collected will return None")


def demonstrate_gc_module() -> None:
    """Demonstrate the gc module's capabilities for cycle detection."""
    print("\n" + "=" * 60)
    print("GC MODULE: Breaking the Cycles")
    print("=" * 60)

    gc.collect()

    class Node:
        def __init__(self, value):
            self.value = value
            self.next: Optional[Node] = None

        def __repr__(self):
            return f"Node({self.value})"

    print("\n* Creating a circular linked list: A -> B -> C -> A *")
    a = Node("A")
    b = Node("B")
    c = Node("C")
    a.next = b
    b.next = c
    c.next = a

    print(f"  a={a}, b={b}, c={c}")
    print(f"  gc.get_count(): {gc.get_count()}")
    print(f"  gc.garbage: {gc.garbage}")

    print("\n* Deleting all references... *")
    del a, b, c

    print(f"  gc.get_count(): {gc.get_count()}")
    print(f"  Objects in garbage: {len(gc.garbage)}")

    print("\n* Running gc.collect()... *")
    collected = gc.collect()
    print(f"  Collected {collected} objects")
    print(f"  gc.garbage is now empty: {len(gc.garbage) == 0}")


if __name__ == "__main__":
    print("=" * 60)
    print("BUDDHIST GARBAGE COLLECTOR: Letting Go of References")
    print("=" * 60)

    demonstrate_reference_counting()

    demonstrate_circular_reference()

    demonstrate_weakref_solution()

    demonstrate_weakref_with_caching()

    demonstrate_gc_module()

    print("\n" + "=" * 60)
    print("KEY INSIGHT: Memory leaks from circular references mirror")
    print("Buddhist attachment - objects cling to each other, preventing")
    print("release. weakref is the Buddhist approach: acknowledge an")
    print("object's existence without clinging to it (no refcount increase).")
    print("When all strong references disappear, the weakref gracefully")
    print("returns None, and the object is freed.")
    print("=" * 60)