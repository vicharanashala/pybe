class Protein:
    """Base class for all proteins."""
    def __init__(self, name, sequence):
        self.name = name
        self.sequence = sequence

    def get_length(self):
        """Returns the number of amino acids in the sequence."""
        return len(self.sequence)

    def perform_function(self):
        """Generic biological function."""
        print(f"{self.name} is doing generic protein stuff.")


class StructuralProtein(Protein):
    """Subclass representing structural proteins."""
    def __init__(self, name, sequence):
        # Inherit attributes from the Base class
        super().__init__(name, sequence)

    def perform_function(self):
        """Override the base method for structural behavior."""
        print(f"{self.name} is providing structural support.")


class Enzyme(Protein):
    """Subclass representing catalytic enzymes."""
    def __init__(self, name, sequence, target_molecule):
        # Inherit base attributes
        super().__init__(name, sequence)
        # Add enzyme-specific attribute
        self.target_molecule = target_molecule

    def perform_function(self):
        """Override the base method for enzyme behavior."""
        print(f"{self.name} is catalyzing the breakdown of {self.target_molecule}.")


if __name__ == "__main__":
    # Instantiate specific proteins
    keratin = StructuralProtein("Keratin", "AVLSGHTY")
    amylase = Enzyme("Amylase", "MKTLLILV", "Starch")

    # Group them in a common list
    biology_system = [keratin, amylase]

    # Polymorphism in action! 
    # We call the exact same method on both, but they behave differently.
    print("--- Simulating Biological System ---")
    for protein in biology_system:
        print(f"Sequence length: {protein.get_length()}")
        protein.perform_function()
        print("-" * 20)
