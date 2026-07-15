class Protein:
    """Base class representing a general Protein."""
    def __init__(self, sequence):
        self.sequence = sequence

    def perform_function(self):
        """Method to be overridden by subclasses."""
        print("Generic protein function")

class StructuralProtein(Protein):
    """Subclass for structural proteins like Collagen or Keratin."""
    def perform_function(self):
        print(f"Providing structural support with sequence length {len(self.sequence)}")

class EnzymeProtein(Protein):
    """Subclass for enzymes that catalyze reactions."""
    def __init__(self, sequence, substrate):
        super().__init__(sequence)
        self.substrate = substrate

    def perform_function(self):
        print(f"Catalyzing reaction for substrate: {self.substrate}")

if __name__ == "__main__":
    p = Protein("ACDEFGH")
    p.perform_function()
