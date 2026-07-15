"""
The Protein Blueprint: OOP Inheritance and Polymorphism Solution

This scenario models biological proteins using Object-Oriented Programming,
demonstrating the core OOP principles of inheritance, polymorphism, and
code reuse through a biological metaphor.

In nature, proteins share a common blueprint - a sequence of amino acids
with physical properties like molecular weight. However, different protein
types serve vastly different functions:
- Structural proteins (like Keratin) provide physical support
- Enzymes (like Amylase) catalyze biochemical reactions

This mirrors OOP inheritance where a base class defines common properties
and methods, while subclasses specialize behavior through overriding.
"""

from abc import ABC, abstractmethod
from typing import List


class Protein:
    """
    Base class representing the universal blueprint for all proteins.

    In biological terms, every protein is defined by:
    - A sequence of amino acids (the 'sequence' attribute)
    - A name identifying the protein
    - A molecular weight that can be calculated

    The perform_function() method is abstract here - each protein type
    must define what its biological function is.
    """

    def __init__(self, name: str, sequence: str):
        """
        Initialize a Protein with its identifying information.

        Args:
            name: The protein's common name (e.g., 'Hemoglobin', 'Insulin')
            sequence: The amino acid sequence (single-letter codes: A, C, D, E, etc.)
        """
        self.name = name
        self.sequence = sequence.upper()
        self._molecular_weight = self._calculate_molecular_weight()

    def _calculate_molecular_weight(self) -> float:
        """
        Calculate molecular weight based on amino acid composition.

        Each amino acid has a specific average molecular weight.
        This method sums the weights of all amino acids in the sequence.

        Returns:
            The calculated molecular weight in Daltons (Da).
        """
        # Average molecular weights of amino acids (in Daltons)
        amino_acid_weights = {
            'A': 89,   # Alanine
            'R': 174,  # Arginine
            'N': 132,  # Asparagine
            'D': 133,  # Aspartic acid
            'C': 121,  # Cysteine
            'E': 147,  # Glutamic acid
            'Q': 146,  # Glutamine
            'G': 75,   # Glycine
            'H': 155,  # Histidine
            'I': 131,  # Isoleucine
            'L': 131,  # Leucine
            'K': 146,  # Lysine
            'M': 149,  # Methionine
            'F': 165,  # Phenylalanine
            'P': 115,  # Proline
            'S': 105,  # Serine
            'T': 119,  # Threonine
            'W': 204,  # Tryptophan
            'Y': 181,  # Tyrosine
            'V': 117,  # Valine
        }
        weight = sum(amino_acid_weights.get(aa, 0) for aa in self.sequence)
        return weight

    @property
    def molecular_weight(self) -> float:
        """Get the molecular weight of this protein."""
        return self._molecular_weight

    @property
    def sequence_length(self) -> int:
        """Get the number of amino acids in the sequence."""
        return len(self.sequence)

    def get_sequence_info(self) -> str:
        """
        Return a formatted string with protein information.

        Returns:
            Human-readable description of the protein.
        """
        return f"{self.name}: {self.sequence_length} amino acids, MW: {self.molecular_weight:.1f} Da"

    @abstractmethod
    def perform_function(self) -> str:
        """
        Execute this protein's biological function.

        Each subclass MUST override this method to implement
        its specific biological behavior.

        Returns:
            A description of what the protein is doing.
        """
        pass

    def __str__(self) -> str:
        return f"{self.__class__.__name__}({self.name})"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(name='{self.name}', sequence='{self.sequence[:20]}...')"


class StructuralProtein(Protein):
    """
    Proteins that provide physical structure and support.

    Structural proteins are like the "building materials" of biology.
    Examples include:
    - Keratin: Found in hair, nails, and horns - provides rigidity
    - Collagen: The most abundant protein in mammals, provides tensile strength
    - Elastin: Found in connective tissue, provides elasticity

    These proteins don't catalyze reactions - they form physical structures.
    """

    def __init__(self, name: str, sequence: str, structural_role: str):
        """
        Initialize a StructuralProtein.

        Args:
            name: The protein's name
            sequence: Amino acid sequence
            structural_role: Description of the structural function (e.g., 'rigid support')
        """
        super().__init__(name, sequence)
        self.structural_role = structural_role

    def perform_function(self) -> str:
        """
        Perform the protein's structural function.

        Structural proteins provide physical support - they don't catalyze
        reactions but instead form matrices, fibers, or protective barriers.

        Returns:
            Description of the structural support being provided.
        """
        return f"{self.name} provides {self.structural_role} to tissues"


class EnzymeProtein(Protein):
    """
    Proteins that catalyze biochemical reactions.

    Enzymes are biological catalysts - they speed up chemical reactions
    without being consumed. Without enzymes, biochemical reactions would
    proceed too slowly to sustain life.

    Examples:
    - Amylase: Breaks down starches into sugars
    - Pepsin: Digests proteins in the stomach
    - ATP Synthase: Produces cellular energy
    """

    def __init__(self, name: str, sequence: str, substrate: str, reaction_type: str):
        """
        Initialize an EnzymeProtein.

        Args:
            name: The enzyme's name
            sequence: Amino acid sequence
            substrate: The molecule the enzyme acts upon
            reaction_type: Description of the chemical reaction (e.g., 'hydrolysis')
        """
        super().__init__(name, sequence)
        self.substrate = substrate
        self.reaction_type = reaction_type
        self._catalysis_count = 0

    def perform_function(self) -> str:
        """
        Catalyze the enzyme's biochemical reaction.

        The enzyme binds to its substrate (the molecule it acts upon),
        catalyzes the reaction, and releases products. The enzyme
        itself is unchanged and can catalyze many more reactions.

        Returns:
            Description of the catalysis occurring.
        """
        self._catalysis_count += 1
        return f"{self.name} catalyzes {self.reaction_type} of {self.substrate} (reaction #{self._catalysis_count})"

    @property
    def catalysis_count(self) -> int:
        """Number of reactions this enzyme has catalyzed."""
        return self._catalysis_count


class TransportProtein(Protein):
    """
    Proteins that transport molecules across membranes or through the body.

    Transport proteins move substances that couldn't move on their own:
    - Hemoglobin: Transports oxygen in blood
    - Myoglobin: Stores oxygen in muscles
    - Sodium-potassium pump: Moves ions across cell membranes
    """

    def __init__(self, name: str, sequence: str, cargo: str, transport_medium: str):
        """
        Initialize a TransportProtein.

        Args:
            name: The protein's name
            sequence: Amino acid sequence
            cargo: What the protein transports (e.g., 'oxygen', 'ions')
            transport_medium: Where transport occurs (e.g., 'bloodstream', 'cell membrane')
        """
        super().__init__(name, sequence)
        self.cargo = cargo
        self.transport_medium = transport_medium
        self._delivered_amount = 0

    def perform_function(self) -> str:
        """
        Transport cargo through the appropriate medium.

        Returns:
            Description of the transport activity.
        """
        return f"{self.name} transports {self.cargo} through {self.transport_medium}"


def demonstrate_polymorphism(proteins: List[Protein]) -> None:
    """
    Demonstrate polymorphism by iterating through mixed protein types.

    This function shows the power of polymorphism: we can treat all proteins
    uniformly through the common base class interface, yet each protein
    exhibits its own unique behavior when perform_function() is called.

    The correct method is determined at RUNTIME based on the actual object
    type, not the declared type. This is late binding and is a hallmark
    of object-oriented programming.

    Args:
        proteins: A list containing different types of Protein subclasses.
    """
    print("\n" + "=" * 70)
    print("POLYMORPHISM IN ACTION: Calling perform_function() on mixed proteins")
    print("=" * 70)

    for protein in proteins:
        print(f"\n[{protein.__class__.__name__}]")
        print(f"  Info: {protein.get_sequence_info()}")
        print(f"  Action: {protein.perform_function()}")


def demonstrate_inheritance():
    """
    Show how subclasses inherit from the base Protein class.
    """
    print("\n" + "=" * 70)
    print("INHERITANCE DEMONSTRATION")
    print("=" * 70)

    # Create instances of different protein types
    keratin = StructuralProtein(
        name="Keratin",
        sequence="ACDEFGHIKLMPSTWYV" * 10,  # Simplified repeating sequence
        structural_role="rigid support and protection"
    )

    amylase = EnzymeProtein(
        name="Amylase",
        sequence="MVTFPLLSQAFGLVAGV",  # Simplified human amylase fragment
        substrate="starch",
        reaction_type="hydrolysis"
    )

    hemoglobin = TransportProtein(
        name="Hemoglobin",
        sequence="MVHLTPEEKSAVTALWG",  # Simplified hemoglobin fragment
        cargo="oxygen",
        transport_medium="bloodstream"
    )

    print(f"\nKeratin (StructuralProtein):")
    print(f"  Has structural_role: {keratin.structural_role}")
    print(f"  Does NOT have substrate: {not hasattr(keratin, 'substrate')}")

    print(f"\nAmylase (EnzymeProtein):")
    print(f"  Has substrate: {amylase.substrate}")
    print(f"  Has reaction_type: {amylase.reaction_type}")

    print(f"\nHemoglobin (TransportProtein):")
    print(f"  Has cargo: {hemoglobin.cargo}")
    print(f"  Does NOT have structural_role: {not hasattr(hemoglobin, 'structural_role')}")
    print(f"  Has cargo: {hemoglobin.cargo}")
    print(f"  Does NOT have structural_role: {not hasattr(hemoglobin, 'structural_role')}")


def demonstrate_super_function():
    """
    Demonstrate the use of super() to call parent class methods.
    """
    print("\n" + "=" * 70)
    print("super() FUNCTION: Calling Parent Class Methods")
    print("=" * 70)

    print("""
When a subclass initializes, it often needs to:
1. Use functionality from the parent class
2. Add its own additional attributes
3. Ensure proper initialization order

Using super().__init__() ensures:
- Parent initialization logic runs
- Parent sets up its attributes
- Child adds its own attributes on top
""")


def create_protein_catalog() -> List[Protein]:
    """
    Create a diverse catalog of proteins to demonstrate polymorphism.

    Returns:
        A list of various protein types for demonstration.
    """
    return [
        StructuralProtein(
            name="Keratin",
            sequence="ACDEFGHIKLMPSTWYV" * 5,
            structural_role="rigid support in hair and nails"
        ),
        EnzymeProtein(
            name="Amylase",
            sequence="MVTFPLLSQAFGLVAGV" * 3,
            substrate="starch",
            reaction_type="hydrolysis"
        ),
        EnzymeProtein(
            name="Pepsin",
            sequence="MKWVTFISLLFLFSSAYS",  # Simplified
            substrate="proteins",
            reaction_type="proteolysis"
        ),
        TransportProtein(
            name="Hemoglobin",
            sequence="MVHLTPEEKSAVTALWGKVN" * 2,
            cargo="oxygen",
            transport_medium="bloodstream"
        ),
        StructuralProtein(
            name="Collagen",
            sequence="GPHGPPGPPGPPGPPGPPS",  # Collagen motif
            structural_role="tensile strength in connective tissue"
        ),
        TransportProtein(
            name="Myoglobin",
            sequence="MDFGADAQGAMTKAL",  # Simplified
            cargo="oxygen",
            transport_medium="muscle cells"
        ),
    ]


if __name__ == "__main__":
    print("=" * 70)
    print("THE PROTEIN BLUEPRINT: OOP Inheritance and Polymorphism")
    print("=" * 70)

    demonstrate_inheritance()

    proteins = create_protein_catalog()
    demonstrate_polymorphism(proteins)

    print("\n" + "=" * 70)
    print("BIOLOGICAL CATALOG SUMMARY")
    print("=" * 70)

    print(f"\nTotal proteins in catalog: {len(proteins)}")
    structural_count = sum(1 for p in proteins if isinstance(p, StructuralProtein))
    enzyme_count = sum(1 for p in proteins if isinstance(p, EnzymeProtein))
    transport_count = sum(1 for p in proteins if isinstance(p, TransportProtein))

    print(f"  Structural proteins: {structural_count}")
    print(f"  Enzyme proteins: {enzyme_count}")
    print(f"  Transport proteins: {transport_count}")

    print("\n" + "=" * 70)
    print("OOP PRINCIPLES DEMONSTRATED")
    print("=" * 70)
    print("""
1. ENCAPSULATION
   - Each protein class bundles data (name, sequence) with behavior
   - Private methods like _calculate_molecular_weight() are internal

2. INHERITANCE
   - StructuralProtein, EnzymeProtein, TransportProtein all inherit from Protein
   - Each subclass gets name, sequence, and molecular_weight for free
   - super().__init__() ensures proper parent initialization

3. POLYMORPHISM
   - The same call (protein.perform_function()) produces different behavior
   - Determined at runtime based on actual object type
   - Enables treating diverse proteins uniformly through common interface

4. ABSTRACTION
   - Base Protein class defines common interface
   - Abstract method perform_function() forces specialization
   - Details of catalysis or structural support hidden from caller
""")