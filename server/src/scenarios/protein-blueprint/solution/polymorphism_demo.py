from protein_classes import Protein, StructuralProtein, EnzymeProtein

def run_simulation(proteins):
    """
    Demonstrates polymorphism: we iterate over a list of Protein objects
    and call perform_function(). The correct subclass method is executed.
    """
    print("Running protein functions simulation...\n")
    for i, p in enumerate(proteins, 1):
        print(f"Protein #{i} ({p.__class__.__name__}):")
        p.perform_function()
        print("-" * 30)

if __name__ == "__main__":
    # A mixed list of different protein types
    mixed_proteins = [
        StructuralProtein("GASGASGAS"), # Collagen-like
        EnzymeProtein("MVHLTPE", "ATP"), # Kinase-like
        Protein("MKTLLL"), # Unknown/Generic
        StructuralProtein("CGGCGG") # Keratin-like
    ]
    
    run_simulation(mixed_proteins)
