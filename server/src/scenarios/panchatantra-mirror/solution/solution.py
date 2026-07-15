"""
The Panchatantra Mirror Solution
===================================
Metaclasses, abc.ABC, and @abstractmethod

This solution demonstrates how Python classes are themselves objects,
created by metaclasses. We explore:
1. What creates a class (type())
2. Custom metaclasses that intercept class creation
3. abc.ABC and @abstractmethod for enforcing method contracts
4. A real-world plugin registry using metaclasses

The Panchatantra lesson: The rabbit never needed to fight the lion.
He only needed to show the lion a mirror. Similarly, metaclasses
don't need to know what a class WILL do they only need to enforce
what a class MUST do before it can exist.
"""

from abc import ABC, abstractmethod
import inspect


# ============================================================================
# PART 1: Understanding type() What Creates a Class?
# ============================================================================

print("=" * 70)
print("PART 1: type() The Default Metaclass")
print("=" * 70)

class Patient:
    """A simple class. What creates this?"""
    pass

# Every class is an instance of type
print(f"\nPatient is an instance of: {type(Patient)}")
print(f"type(Patient) is type: {type(Patient) is type}")

# type() can be used to create classes dynamically
DynamicClass = type('DynamicClass', (), {'value': 42})
obj = DynamicClass()
print(f"\nDynamically created class: {obj.value}")

# The Panchatantra insight: type() is the default metaclass.
# Every class you define with 'class' is created by type().


# ============================================================================
# PART 2: The Plugin Crisis Why NotImplementedError Fails
# ============================================================================

print("\n" + "=" * 70)
print("PART 2: The Problem with Runtime Enforcement")
print("=" * 70)

class PatientProcessor:
    """Base processor using NotImplementedError (FAILS at runtime)."""

    def process(self, patient_data):
        raise NotImplementedError("Subclass must implement process()")

    def validate(self, patient_data):
        raise NotImplementedError("Subclass must implement validate()")


# This subclass FORGOT to implement validate()
# The class is created successfully error only occurs at runtime
class BrokenProcessor(PatientProcessor):
    def process(self, patient_data):
        return f"Processed: {patient_data['name']}"


# This crash only happens when the method is CALLED
try:
    bp = BrokenProcessor()
    result = bp.validate({"name": "Test Patient"})  # Crashes here!
except NotImplementedError as e:
    print(f"\nRuntime error: {e}")
    print("The class was ALLOWED to be created even though it's incomplete!")
    print("This is the problem metaclasses solve.")


# ============================================================================
# PART 3: Custom Metaclass Enforcing Contracts at Creation Time
# ============================================================================

print("\n" + "=" * 70)
print("PART 3: Custom Metaclass with __new__")
print("=" * 70)


class RequiredMethodsMeta(type):
    """
    A metaclass that enforces method implementation at class-creation time.

    The Panchatantra's lesson applied: instead of waiting for the lion to
    react to his reflection (runtime error), we catch the problem at the
    moment of creation (the well).

    __new__ is called before __init__ when a class is being constructed.
    Here we can examine the class attributes and reject incomplete ones.
    """

    # Required method names that subclasses MUST implement
    REQUIRED_METHODS = ['process', 'validate']

    def __new__(mcs, name, bases, namespace):
        # Only check subclasses (not the base class itself)
        if bases:  # If there are base classes, this is a subclass
            for method_name in mcs.REQUIRED_METHODS:
                if method_name not in namespace or namespace[method_name] is None:
                    # Check if it's still the abstract placeholder
                    raise TypeError(
                        f"Class '{name}' must implement '{method_name}()' "
                        f"before it can be used. "
                        f"This error is caught at CLASS CREATION TIME "
                        f"not at runtime like NotImplementedError."
                    )

        return super().__new__(mcs, name, bases, namespace)


class EnforcedProcessor(metaclass=RequiredMethodsMeta):
    """Base processor that ENFORCES implementation at class creation."""

    REQUIRED_METHODS = ['process', 'validate']

    def process(self, patient_data):
        """Process a patient record. Override in subclass."""
        return NotImplementedError

    def validate(self, patient_data):
        """Validate a patient record. Override in subclass."""
        return NotImplementedError


# This works both methods are implemented
class WorkingProcessor(EnforcedProcessor):
    def process(self, patient_data):
        return f"Processed: {patient_data.get('name', 'Unknown')}"

    def validate(self, patient_data):
        return 'name' in patient_data and 'admission_date' in patient_data


# This FAILS immediately when the class is defined not when it's used!
try:
    exec("""
class StillBrokenProcessor(EnforcedProcessor):
    def process(self, patient_data):
        return f"Processed: {patient_data['name']}"
    # Forgot to implement validate()
""")
except TypeError as e:
    print(f"\nImmediate error at class creation: {e}")
    print("The class was REJECTED at definition time just like the lion falling into the well!")


# ============================================================================
# PART 4: abc.ABC The Standard Library Solution
# ============================================================================

print("\n" + "=" * 70)
print("PART 4: abc.ABC and @abstractmethod")
print("=" * 70)

"""
The abc (abstract base class) module provides Python's official way to
enforce method contracts at creation time.

Key components:
- ABC: A class that, when used as a metaclass, enables abstract method enforcement
- @abstractmethod: A decorator that marks a method as abstract (must be overridden)
- ABCMeta: The metaclass underlying ABC

When you inherit from a class whose metaclass is ABCMeta, Python checks
that all abstract methods have been implemented BEFORE the class creation
completes.
"""


class AbstractProcessor(ABC):
    """Base processor using abc.ABC (enforced at creation time)."""

    @abstractmethod
    def process(self, patient_data):
        """Process a patient record. Must be implemented by subclass."""
        pass

    @abstractmethod
    def validate(self, patient_data):
        """Validate a patient record. Must be implemented by subclass."""
        pass


# This works both abstract methods are implemented
class ValidABCProcessor(AbstractProcessor):
    def process(self, patient_data):
        return f"ABC Processed: {patient_data.get('name', 'Unknown')}"

    def validate(self, patient_data):
        return bool(patient_data.get('name'))


# Try to instantiate this immediately tells you what's wrong
try:
    incomplete = AbstractProcessor()  # Can't instantiate ABC!
except TypeError as e:
    print(f"\nCan't instantiate ABC directly: {e}")

# Try to create a subclass without implementing all abstract methods
try:
    exec("""
class PartialABCProcessor(AbstractProcessor):
    def process(self, patient_data):
        return f"Processed: {patient_data['name']}"
    # Forgot validate()
""")
except TypeError as e:
    print(f"\nSubclass rejected at creation time: {e}")


# ============================================================================
# PART 5: issubclass() and isinstance() Metaclass Introspection
# ============================================================================

print("\n" + "=" * 70)
print("PART 5: issubclass() and isinstance()")
print("=" * 70)

processor = ValidABCProcessor()

# issubclass() checks class hierarchy
print(f"\nissubclass(ValidABCProcessor, AbstractProcessor): {issubclass(ValidABCProcessor, AbstractProcessor)}")

# isinstance() checks if an object is an instance of a class
print(f"isinstance(processor, AbstractProcessor): {isinstance(processor, AbstractProcessor)}")

# Check what type() an ABC-derived class is
print(f"\ntype(ValidABCProcessor): {type(ValidABCProcessor)}")
print(f"type(ValidABCProcessor) is ABC: {type(ValidABCProcessor) is ABC}")  # False
print(f"ABC in type(ValidABCProcessor).__mro__: {ABC in type(ValidABCProcessor).__mro__}")

# The metaclass of an ABC-derived class
print(f"\nMetaclass of ValidABCProcessor: {type(ValidABCProcessor)}")


# ============================================================================
# PART 6: The Plugin Registry A Real Metaclass Pattern
# ============================================================================

print("\n" + "=" * 70)
print("PART 6: Plugin Registry via Metaclass")
print("=" * 70)

"""
This is the BONUS CHALLENGE: track every subclass automatically.

Instead of asking developers to register their plugins manually,
a metaclass can intercept every class creation and add it to a registry.
This is how Django's ORM automatically discovers Model classes.
"""


class PluginRegistryMeta(type):
    """
    A metaclass that maintains a registry of all subclasses.

    Every time a class is created with this metaclass, it gets
    automatically added to PLUGINS[class_name] = class_object.

    This is the Panchatantra's rabbit: using the class's own
    creation event to build a catalog of what's been created.
    """

    PLUGINS = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)

        # Register this class (unless it's the base class itself)
        if bases:  # Has base classes = is a subclass = is a plugin
            mcs.PLUGINS[name] = cls
            print(f"  Registered plugin: {name}")

        return cls


class DataProcessor(metaclass=PluginRegistryMeta):
    """Base processor that automatically registers all subclasses."""

    @abstractmethod
    def process(self, data):
        pass


class BillingProcessor(DataProcessor):
    """Processes billing codes."""
    def process(self, data):
        return f"Billing: {data.get('billing_code', 'N/A')}"


class InsuranceProcessor(DataProcessor):
    """Processes insurance claims."""
    def process(self, data):
        return f"Insurance: {data.get('insurance_id', 'N/A')}"


class RiskProcessor(DataProcessor):
    """Processes risk assessments."""
    def process(self, data):
        return f"Risk: {data.get('risk_score', 'N/A')}"


print("\nAll registered processors:")
for name, cls in PluginRegistryMeta.PLUGINS.items():
    print(f"  {name}: {cls}")


# ============================================================================
# PART 7: __call__ in Metaclasses Controlling Instance Creation
# ============================================================================

print("\n" + "=" * 70)
print("PART 7: __call__ in Metaclasses")
print("=" * 70)

"""
A metaclass can also intercept how instances of the class are created.
The __call__ method of a metaclass is called when you invoke the class
constructor (e.g., Patient()).
"""


class ValidationMeta(type):
    """
    A metaclass that validates constructor arguments before creating
    an instance.
    """

    def __call__(cls, *args, **kwargs):
        print(f"\n  __call__ invoked: creating instance of {cls.__name__}")
        print(f"    Args: {args}")
        print(f"    Kwargs: {kwargs}")

        # Pre-creation validation
        if cls.__name__ == 'Patient' and not kwargs.get('name'):
            raise ValueError("Patient name is required!")

        # Proceed with normal instance creation
        instance = super().__call__(*args, **kwargs)
        print(f"    Created: {instance}")

        return instance


class Patient(metaclass=ValidationMeta):
    def __init__(self, name, admission_date):
        self.name = name
        self.admission_date = admission_date

    def __repr__(self):
        return f"Patient(name='{self.name}', admission_date='{self.admission_date}')"


# Successful creation
print("Creating valid patient:")
p1 = Patient(name="Arjun Mehta", admission_date="2025-03-15")

# Failed creation
print("\nAttempting invalid patient:")
try:
    p2 = Patient(admission_date="2025-03-16")  # Missing name!
except ValueError as e:
    print(f"  Caught at creation time: {e}")


# ============================================================================
# PART 8: Method Resolution Order (MRO) with Metaclasses
# ============================================================================

print("\n" + "=" * 70)
print("PART 8: Method Resolution Order")
print("=" * 70)

class Base(ABC):
    @abstractmethod
    def step_one(self):
        pass


class Middle(Base):
    @abstractmethod
    def step_two(self):
        pass


class Final(Middle):
    def step_one(self):
        return "Step 1 complete"

    def step_two(self):
        return "Step 2 complete"

    def step_three(self):
        return "Step 3 complete"


print(f"\nMRO for Final: {[c.__name__ for c in Final.__mro__]}")
print(f"All abstract methods implemented: {Final.__mro__}")

# Check if a class is "concrete" (all abstract methods implemented)
def is_concrete_class(cls):
    """Check if all abstract methods are implemented."""
    for klass in cls.__mro__:
        if klass in (ABC, type):
            continue
        if hasattr(klass, '__abstractmethods__'):
            if klass.__abstractmethods__:
                return False
    return True

print(f"\nIs Final concrete? {is_concrete_class(Final)}")

try:
    exec("""
class Incomplete(Final):
    pass  # Forgot step_two!
""")
except TypeError as e:
    print(f"\nIncomplete class rejected: {e}")


# ============================================================================
# The Panchatantra Lesson
# ============================================================================

print("\n" + "=" * 70)
print("THE PANCHANTRA LESSON")
print("=" * 70)

print("""
The rabbit never needed to fight the lion directly.
The rabbit created the conditions for the lion to confront himself.

With metaclasses:
- You don't need to check every instance at runtime
- You enforce constraints at the MOMENT a class is created
- The class itself validates its own contract before it exists

This is the deepest form of introspection: not asking "what is this object?"
but controlling "how does this class come into being?"

When you use abc.ABC and @abstractmethod, Python performs the rabbit's
work for you: it makes every subclass confront its own reflection and
rejects incomplete classes at creation time, not at 3 AM in production.
""")


# ============================================================================
# Demonstration
# ============================================================================

if __name__ == "__main__":
    print("\n" + "#" * 70)
    print("RUNNING DEMONSTRATION")
    print("#" * 70)

    # Test the plugin system
    patient_a_data = {"name": "Arjun Mehta", "billing_code": "BRN-A-004521"}
    patient_b_data = {"name": "Priya Sharma", "insurance_id": "INS-MH-7890123"}

    print("\nProcessing with registered plugins:")
    for name, cls in PluginRegistryMeta.PLUGINS.items():
        if name != 'DataProcessor':  # Skip base class
            processor = cls()
            print(f"  {name}: {processor.process(patient_a_data)}")

    # Test ABC
    print("\nVerifying ABC processor:")
    abc_processor = ValidABCProcessor()
    print(f"  Valid: {abc_processor.process({'name': 'Test'})}")
    print(f"  Is valid: {is_concrete_class(ValidABCProcessor)}")