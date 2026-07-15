"""
The Name Ceremony — Solution
=============================

Variables, Naming, References, and Assignment in Python.

This solution demonstrates what variables truly are: not containers,
but labels that refer to objects in memory.

Namakarana: The Hindu naming ceremony. The name is not the child —
the child exists before and after the ceremony. The name is a social
label that allows the world to address the child. Similarly, in Python,
a variable is not the data — it is a label that refers to the data.

The object exists before the name is assigned. The name does not
create the object. The object persists even after the name is removed.
"""

# ============================================================================
# PART 1: BEFORE THE NAME — OBJECTS EXIST BEFORE VARIABLES
# ============================================================================

print("=" * 70)
print("PART 1: Before the Name")
print("=" * 70)

# When you write x = 10, Python first creates the integer 10 as an object
# in memory, then binds the name 'x' to that object.
#
# The object exists before the name. This is like the newborn who exists
# before their naming ceremony.

x = 10
print(f"x = {x}")
print(f"type(x) = {type(x)}")
print(f"id(x) = {id(x)}")

print()
print("The integer 10 existed before we wrote 'x = 10'.")
print("We did not create 10 by naming it. We labeled 10 as x.")
print()

# You can verify the order: Python evaluates the right side first
# then assigns the result to the left side.
#
# This is different from algebra, where x = 10 means x is fixed at 10.
# In Python, x = 10 means x currently refers to 10. It can change.


# ============================================================================
# PART 2: MANY NAMES, ONE CHILD — SHARED REFERENCES
# ============================================================================

print("=" * 70)
print("PART 2: Many Names, One Child")
print("=" * 70)

# At a naming ceremony, multiple relatives may call the child by the
# same nickname. They all refer to the SAME child. If the child laughs,
# all who called the name see the laugh.

a = [1, 2, 3]
b = a  # b is another name for the SAME list in memory

print(f"a = {a}")
print(f"b = {b}")
print(f"a is b: {a is b}")  # True — same object
print(f"id(a) = {id(a)}")
print(f"id(b) = {id(b)}")

print()
print("Now modify through b:")
b.append(4)
print(f"After b.append(4):")
print(f"  a = {a}")  # a also changed!
print(f"  b = {b}")  # b also shows the change
print()
print("This is because a and b are TWO NAMES for the SAME OBJECT.")
print("There is one list in memory, with two labels pointing to it.")
print()

# The same applies to dictionaries and other mutable objects
d1 = {"name": "Arjun", "age": 0}
d2 = d1
d2["age"] = 1  # d1 also changes
print(f"d1 = {d1}")  # {'name': 'Arjun', 'age': 1}
print(f"d2 = {d2}")  # {'name': 'Arjun', 'age': 1}
print(f"d1 is d2: {d1 is d2}")  # True


# ============================================================================
# PART 3: IDENTITY VS EQUALITY — ARE YOU THE SAME CHILD?
# ============================================================================

print()
print("=" * 70)
print("PART 3: Identity vs Equality")
print("=" * 70)

# is  -->  Are you THE SAME object in memory?
# ==  -->  Do you have THE SAME VALUE?

x = 10
y = 10
print(f"x = {x}, y = {y}")
print(f"x == y: {x == y}")  # True — same value
print(f"x is y: {x is y}")  # ??? — depends on interning

print()
print("For small integers (-5 to 256), Python 'interns' the values.")
print("This means it reuses the same object for the same value.")
print("So x = 10 and y = 10 might point to the SAME object.")
print()

# For larger integers, Python creates new objects
big_x = 1000
big_y = 1000
print(f"big_x = 1000, big_y = 1000")
print(f"big_x == big_y: {big_x == big_y}")  # True — same value
print(f"big_x is big_y: {big_x is big_y}")  # False — different objects

print()
print("For lists, identity is always distinct:")
list_x = [1, 2, 3]
list_y = [1, 2, 3]
print(f"list_x = [1, 2, 3], list_y = [1, 2, 3]")
print(f"list_x == list_y: {list_x == list_y}")  # True — same values
print(f"list_x is list_y: {list_x is list_y}")  # False — different objects

print()
print("Moral: use 'is' to ask 'are we the same object?',")
print("use '==' to ask 'are our values equal?'")


# ============================================================================
# PART 4: REBINDING — A CHILD GROWS, THE NAME CHANGES
# ============================================================================

print()
print("=" * 70)
print("PART 4: Rebinding — The Child Grows")
print("=" * 70)

# A child grows. They may earn new titles: "boy", "student", "scholar".
# The child does not change — only the labels we use change.

x = 10
print(f"x = {x}, id(x) = {id(x)}")

x = 20
print(f"x = {x}, id(x) = {id(x)}")

print()
print("x was rebound from 10 to 20.")
print("The integer 10 still exists (maybe). But x now refers to 20.")
print("Rebinding does not change the old object — it moves the label.")
print()

# The object 10 still exists? Maybe, until garbage collected
print(f"id(10) = {id(10)}")  # same as old id(x)?
# If interned, it might be the same. If not, it's a new object.


# ============================================================================
# PART 5: NONE — THE ABSENCE OF A NAME
# ============================================================================

print()
print("=" * 70)
print("PART 5: None — The Absence of a Name")
print("=" * 70)

# None is not "nothing" as in void — it is a specific object that
# represents the absence of a value. It is the "no child" placeholder.

child_record = None
print(f"child_record = {child_record}")
print(f"type(child_record) = {type(child_record)}")

print()
print("None is not zero. None is not an empty string.")
print("None is None — the object that represents 'no reference'.")


# ============================================================================
# PART 6: NAMING CONVENTIONS — CEREMONIAL RULES
# ============================================================================

print()
print("=" * 70)
print("PART 6: Naming Conventions — The Ceremonial Rules")
print("=" * 70)

# In a naming ceremony, names follow traditions:
# - Based on nakshatra (birth star)
# - Based on family lineage
# - Based on sound made at birth
#
# Python has naming ceremonies too — conventions that communicate intent:

child_name = "Priya"       # snake_case — standard variable
FAMILY_NAME = "Sharma"     # SCREAMING_SNAKE_CASE — constant by convention
_private_thought = "..."   # underscore prefix — "internal, do not touch"
__dunder_method__ = ...    # dunder — Python special method (like __init__)

print(f"child_name = {child_name} (snake_case variable)")
print(f"FAMILY_NAME = {FAMILY_NAME} (SCREAMING_SNAKE_CASE constant)")
print(f"_private_thought = hidden (single underscore prefix)")
print(f"__dunder_method__ = Python special method (double underscore)")

print()
print("The underscore is not required by Python syntax.")
print("It is a ceremonial convention — a signal of intent.")
print("By prefixing _, you say: 'this name is not for external use'.")


# ============================================================================
# PART 7: THE NAME SURVIVES THE OBJECT — GARBAGE COLLECTION
# ============================================================================

print()
print("=" * 70)
print("PART 7: The Name Survives the Object")
print("=" * 70)

# In the ceremony, when the last person who knew the child's name dies,
# does the child cease to have existed? The child's life was real,
# even if no one can name them anymore.

x = [1, 2, 3]
y = x

print(f"x = {x}, y = {y}, id(x) = {id(x)}, id(y) = {id(y)}")

del x  # Remove the name 'x'
print(f"After del x: y = {y}")  # y still refers to the list

del y  # Remove the name 'y'
print(f"After del y: no names refer to the list anymore")
print("Python's garbage collector may now reclaim the list object.")

# Creating a new list at the same address is possible but not guaranteed
new_list = [1, 2, 3]
print(f"new_list = {new_list}, id(new_list) = {id(new_list)}")


# ============================================================================
# PART 8: PRACTICAL BUG — THE SHARED REFERENCE TRAP
# ============================================================================

print()
print("=" * 70)
print("PART 8: The Shared Reference Trap (A Common Bug)")
print("=" * 70)

# BUG: Accidentally sharing a mutable default argument
def add_item_to_list(item, items=[]):  # DANGER: mutable default argument
    items.append(item)
    return items

print("DANGER: mutable default arguments share state across calls!")
r1 = add_item_to_list("apple")
print(f"r1 = {r1}")  # ['apple']
r2 = add_item_to_list("banana")
print(f"r2 = {r2}")  # ['apple', 'banana'] — r1 also changed!

print()
print("CORRECT: Use None as sentinel and create new list inside:")
def add_item_fixed(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

r3 = add_item_fixed("apple")
print(f"r3 = {r3}")  # ['apple']
r4 = add_item_fixed("banana")
print(f"r4 = {r4}")  # ['banana'] — no shared state!

print()
print("This bug occurs because the default list [] is created ONCE")
print("at function definition time, and shared across all calls.")


# ============================================================================
# PART 9: CLONING — GIVING A CHILD A TWIN NAME
# ============================================================================

print()
print("=" * 70)
print("PART 9: Cloning — A Separate Child with the Same Value")
print("=" * 70)

# If you want a SEPARATE object with the same value, you must clone:
original = [1, 2, 3]
cloned = list(original)  # or original[:] or copy.copy(original)
cloned.append(4)

print(f"original = {original}")  # [1, 2, 3] — unchanged
print(f"cloned = {cloned}")      # [1, 2, 3, 4] — new object
print(f"original is cloned: {original is cloned}")  # False


# ============================================================================
# THE NAMAKARANA LESSON
# ============================================================================

print()
print("=" * 70)
print("THE NAMAKARANA LESSON")
print("=" * 70)

print("""
In the Hindu Namakarana ceremony, a newborn receives their name.

The child existed before the ceremony. The child exists after.
The name does not create the child — it addresses the child.

In Python, variables work the same way:

1. OBJECTS EXIST BEFORE NAMES
   x = 10 creates the object 10 first, then binds x to it.

2. NAMES ARE LABELS, NOT CONTAINERS
   x does not 'hold' 10. x is a label pointing to the object 10.

3. ONE OBJECT, MANY NAMES
   a = b = [] means a and b are two names for the same list.

4. REBINDING MOVES THE LABEL
   x = 10; x = 20 moves x to a new object. The old object persists.

5. IDENTITY VS EQUALITY
   is — same object in memory?
   == — same value?

6. None IS A REFERENCE TO NOTHING
   None is not zero or empty. It is the object that represents
   'no reference', like an unnamed child in a record.

7. SHARED MUTABLE STATE IS THE SOURCE OF BUGS
   a = []; b = a; b.append(1) — a and b are the same list.
   The fix is cloning: b = list(a) or b = a[:].

8. THE NAME IS NOT THE THING
   Just as the child's identity transcends their given name,
   an object's identity transcends its variable name.

   "What we call a rose by any other name would smell as sweet."
   — William Shakespeare

   "What we call x by any other name would refer to the same object."
   — Python
""")


# ============================================================================
# Demonstration
# ============================================================================

if __name__ == "__main__":
    print("\n" + "#" * 70)
    print("RUNNING DEMONSTRATION")
    print("#" * 70)

    print("\nAll key behaviors demonstrated:")
    print("  1. Variables are labels, not containers")
    print("  2. Multiple names can refer to the same object")
    print("  3. Modifying through one name affects all names")
    print("  4. Identity (is) vs equality (==)")
    print("  5. Rebinding moves the label, not the object")
    print("  6. None is a reference to nothing")
    print("  7. Naming conventions communicate intent")
    print("  8. Garbage collection reclaims unreferenced objects")
    print("  9. Mutable default arguments share state (common bug)")
    print(" 10. Cloning creates separate objects")

    print("\nThe naming ceremony is complete.")
    print("The child has received their name.")
    print("But remember: the name is not the child.")
    print("The variable is not the object.")
    print("The reference is not the thing referred to.")