"""
The Panchatantra Mirror Advanced: Metaclass Auto-Logger
=========================================================

A metaclass is a "class of a class." Just as objects are instances of classes,
classes themselves are instances of metaclasses. The default metaclass is `type`.

In the Panchatantra, the well was not built by the rabbit it already existed.
The rabbit only knew how to use it. Similarly, a metaclass defines the rules
by which classes are constructed. It operates at class CREATION time, not at
instance creation time.

This pattern is used in production:
- Django ORM: ModelBase metaclass transforms class definitions into database models
- SQLAlchemy: DeclarativeMeta builds table mappings from class attributes
- Audit systems: metaclasses wrap methods with logging for compliance
- API frameworks: metaclasses auto-register endpoint handlers

Here, we build AutoLogMeta a metaclass that automatically wraps every
method in a class with logging, so every call is recorded without modifying
the original class code.
"""

import functools
import time
import inspect


class AutoLogMeta(type):
    """
    A metaclass that automatically wraps every public method with logging.

    When a class uses this metaclass, every method call on instances of that
    class will be logged with:
    - The method name
    - The arguments passed
    - The return value
    - The execution time

    This happens at CLASS CREATION TIME the metaclass inspects the class
    being created and modifies it before any instance is ever made.
    """

    def __new__(mcs, name, bases, namespace):
        """
        Called when a new class is being created with this metaclass.

        Parameters:
            mcs: the metaclass itself (AutoLogMeta)
            name: the name of the class being created
            bases: tuple of base classes
            namespace: dict of the class body (attributes, methods)
        """
        # Create the class first
        cls = super().__new__(mcs, name, bases, namespace)

        # Now inspect every attribute in the class
        for attr_name, attr_value in namespace.items():
            # Skip dunder methods and non-callables
            if attr_name.startswith('_') or not callable(attr_value):
                continue

            # Wrap the method with logging
            wrapped = mcs._wrap_with_logging(attr_name, attr_value)
            setattr(cls, attr_name, wrapped)

        print(f"[AutoLogMeta] Class '{name}' created with auto-logging on: "
              f"{[k for k in namespace if not k.startswith('_') and callable(namespace[k])]}")

        return cls

    @staticmethod
    def _wrap_with_logging(method_name, method):
        """Wrap a method with automatic logging."""

        @functools.wraps(method)
        def wrapper(*args, **kwargs):
            # args[0] is 'self' for instance methods
            instance_info = type(args[0]).__name__ if args else "?"

            # Log the call
            arg_str = ", ".join(
                [repr(a) for a in args[1:]] +
                [f"{k}={v!r}" for k, v in kwargs.items()]
            )
            print(f"  [LOG] {instance_info}.{method_name}({arg_str}) called")

            # Execute the original method
            start = time.perf_counter()
            result = method(*args, **kwargs)
            elapsed = time.perf_counter() - start

            # Log the result
            print(f"  [LOG] {instance_info}.{method_name} → {result!r} "
                  f"({elapsed*1000:.2f}ms)")

            return result

        return wrapper


# ---------------------------------------------------------------------------
# Example: Hospital audit system using the metaclass
# ---------------------------------------------------------------------------

class AuditedPatientProcessor(metaclass=AutoLogMeta):
    """
    A patient processor where every method call is automatically logged.

    In a real hospital system, this audit trail would be required for
    regulatory compliance (HIPAA, GDPR, etc.). The metaclass provides it
    without cluttering the business logic with logging code.
    """

    def validate_insurance(self, patient_name: str, insurance_id: str) -> bool:
        """Check if insurance is valid."""
        # Simulate validation
        is_valid = insurance_id.startswith("INS-")
        return is_valid

    def calculate_billing(self, billing_code: str, amount: float) -> dict:
        """Calculate the billing based on code and amount."""
        # Simulate billing calculation
        tax = amount * 0.18  # 18% GST
        return {
            "billing_code": billing_code,
            "base_amount": amount,
            "tax": tax,
            "total": amount + tax,
        }

    def assess_readmission_risk(self, risk_score: float) -> str:
        """Categorize the readmission risk level."""
        if risk_score > 0.7:
            return "HIGH"
        elif risk_score > 0.4:
            return "MEDIUM"
        else:
            return "LOW"


class AuditedPharmacy(metaclass=AutoLogMeta):
    """Another class using the same metaclass logging is automatic."""

    def dispense_medication(self, patient_name: str, medication: str) -> str:
        """Record medication dispensing."""
        return f"{medication} dispensed to {patient_name}"

    def check_interactions(self, medications: list) -> bool:
        """Check for drug interactions."""
        # Simplified: flag if more than 3 medications
        return len(medications) > 3


# ---------------------------------------------------------------------------
# Demonstration: The metaclass in action
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("METACLASS AUTO-LOGGER DEMONSTRATION")
    print("=" * 60)

    # The metaclass has already run at class creation time (see output above).
    # Now every method call will be automatically logged.

    processor = AuditedPatientProcessor()
    pharmacy = AuditedPharmacy()

    print("\n--- Processing Patient: Arjun Mehta ---")
    processor.validate_insurance("Arjun Mehta", "INS-MH-7890123")
    processor.calculate_billing("BRN-A-004521", 15000.0)
    processor.assess_readmission_risk(0.82)

    print("\n--- Pharmacy Operations ---")
    pharmacy.dispense_medication("Arjun Mehta", "Metformin 500mg")
    pharmacy.check_interactions(["Metformin", "Lisinopril", "Aspirin", "Atorvastatin"])

    # ---------------------------------------------------------------------------
    # Inspect the metaclass itself metaclasses are introspectable too!
    # ---------------------------------------------------------------------------
    print("\n" + "=" * 60)
    print("INTROSPECTING THE METACLASS ITSELF")
    print("=" * 60)

    print(f"\nAuditedPatientProcessor's metaclass: {type(AuditedPatientProcessor)}")
    print(f"AutoLogMeta's metaclass: {type(AutoLogMeta)}")
    print(f"AutoLogMeta's bases: {AutoLogMeta.__bases__}")

    print(f"\nMRO of AuditedPatientProcessor:")
    for cls in AuditedPatientProcessor.__mro__:
        print(f"  → {cls.__name__} (metaclass: {type(cls).__name__})")

    print(f"\nMethods on AuditedPatientProcessor (via inspect):")
    for name, method in inspect.getmembers(AuditedPatientProcessor, predicate=inspect.isfunction):
        if not name.startswith('_'):
            print(f"  {name}: {inspect.signature(method)}")

    # ---------------------------------------------------------------------------
    # The Panchatantra connection:
    #
    # The metaclass is the WELL-BUILDER. It doesn't interact with individual
    # lions (objects) it constructs the wells (classes) in which reflections
    # (introspection data) will appear.
    #
    # Django's ModelBase metaclass works the same way: when you write
    #   class MyModel(models.Model):
    #       name = models.CharField(max_length=100)
    #
    # The ModelBase metaclass intercepts the class creation, reads the field
    # definitions, and constructs the database table mapping all before
    # you ever create a MyModel instance.
    #
    # The rabbit didn't build the well. But the rabbit knew it was there.
    # The metaclass builds the well. The programmer just needs to look in.
    # ---------------------------------------------------------------------------
