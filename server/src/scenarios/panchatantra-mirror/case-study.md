# The Panchatantra Mirror Case Study

## The Plugin Architecture Crisis

You work on the data integration team at a regional healthcare network. Your system receives patient records from three hospital branches, and each branch was built by a different vendor over a different decade. There is no shared schema. There is no common interface. There is only the data that arrives at your processing engine, and the need to handle it without breaking.

**Branch A** the oldest hospital sends patient objects that carry a `billing_code`. This is a six-digit alphanumeric string tied to the hospital's legacy accounting system. There is no insurance information. There is no unified patient ID. Just the billing code, the patient's name, and their admission date.

**Branch B** the mid-sized suburban branch sends patient objects that carry an `insurance_id`. This is a national insurance identifier. There is no billing code. The vendor who built Branch B's system believed billing should be handled downstream, so the object carries insurance details, the patient's name, their admission date, and a list of active prescriptions.

**Branch C** the newest hospital sends patient objects that carry both a `billing_code` and an `insurance_id`. The architects of Branch C's system tried to bridge the gap between the two older systems. These objects also carry a `risk_score` a floating-point number between 0 and 1 that estimates the patient's likelihood of readmission within 30 days.

Your processing engine receives a patient object. You do not know which branch it came from. You cannot look at a header or a tag to determine its origin the network layer strips that metadata for privacy compliance. All you have is the object itself.

## The Problem With Plugins

Your boss loves the design. "Make it extensible," she says. "Let third-party developers build their own processors." So you create a base class that other developers subclass:

```python
class PatientProcessor:
    def process(self, patient_data):
        raise NotImplementedError

    def validate(self, patient_data):
        raise NotImplementedError
```

Then you publish the documentation and wait for the plugins to pour in.

Six months later, a plugin crashes the production pipeline at 3 AM. A developer's subclass never implemented `validate()`. Python's `raise NotImplementedError` only triggers when the method is *called* and their code was deployed and running in production for two weeks before anyone tried to process a patient through it. The crash happened at runtime, after deployment, when it was too late to fix cleanly.

## What Went Wrong

The problem is that `NotImplementedError` is a *runtime* guard, not a *creation* guard. By the time the error was raised, the broken class had already been imported, registered, and deployed. The error should have occurred when the developer *defined* the class not when their code was *executed*.

This is the question that drives metaclasses: **How do you enforce constraints at the moment a class is created, rather than when an instance is used?**

## The Questions

1. **What is the type of a class itself?** When you write `class Patient: pass`, what creates that class object? What is `type(Patient)`?

2. **How do you intercept class creation?** If you wanted to run code the moment a class is defined before any instances are created where would you hook that code?

3. **How do you use `__new__` in a metaclass?** The `__new__` method is called before `__init__`. In a metaclass, `__new__` is called when the *class* is being created. What can you examine and modify at that moment?

4. **How do you enforce that a subclass implements a specific method?** If a developer subclasses your base processor but forgets to implement `validate()`, how do you make their class definition *fail immediately* with a clear error message?

5. **What is `abc.ABC` and why does it exist?** The `abc` module provides `ABC` (Abstract Base Class) and `@abstractmethod`. How do they enforce method implementation at class-creation time?

## The Deeper Question

The rabbit in the Panchatantra did not need to know the lion's fighting style, his speed, or his strength. The rabbit only needed to know one thing: the lion would react to his own reflection. Your code does not need to know how a third-party developer will subclass your base processor. Your code only needs to ensure that when they define their subclass, Python *immediately* tells them if they've forgotten something critical.

How do you build a class that enforces its own contract at creation time?

## Bonus Challenge

Suppose you want to track every PatientProcessor subclass that gets defined across your entire application without modifying any of the subclass code. Each time a developer writes `class MyProcessor(PatientProcessor)`, you want to automatically add it to a registry. How would you use a metaclass to do this?

This is the deepest well of introspection: not examining what an object *is*, but controlling how a *class* comes into existence.