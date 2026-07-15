You are building a bio-informatics database to catalog the different types of proteins found in the human body. 

All proteins share common traits: they have a `name`, an `amino_acid_sequence`, and a way to compute their `length`. However, their biological functions vary wildly. 

- **Structural Proteins** (like Keratin in hair) provide physical support and rigidity.
- **Enzymes** (like Amylase in saliva) catalyze chemical reactions to break down molecules.

Your tasks:
1. Define a base class `Protein`. Its `__init__` should accept `name` and `sequence`. Add a method `get_length()` that returns the length of the sequence. Add a method `perform_function()` that simply prints a generic message: "Doing protein stuff."
2. Create a subclass `StructuralProtein` that inherits from `Protein`. Override the `perform_function()` to print: "{name} is providing structural support."
3. Create another subclass `Enzyme` that inherits from `Protein`, but its `__init__` should also accept a `target_molecule`. Override `perform_function()` to print: "{name} is catalyzing the breakdown of {target_molecule}."
4. Instantiate one StructuralProtein ("Keratin", "AVLS...") and one Enzyme ("Amylase", "MKT...", "Starch").
5. Put both objects in a single list called `biology_system`. Loop through the list and call `perform_function()` on each.

Observe how the same method call produces different behaviors based on the object's specific class!
