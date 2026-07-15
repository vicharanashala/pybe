"""
recursive_decoder.py Clean Recursive DNA Decoder
====================================================
Demonstrates recursion with a clear base case for decoding DNA strands.
Each recursive call processes one nucleotide and delegates the rest,
mirroring how the double helix unwinds one base pair at a time.
"""

# Codon table: maps 3-letter DNA codons to amino acids (simplified)
CODON_TABLE = {
    'ATG': 'Met', 'TTT': 'Phe', 'TTC': 'Phe', 'TTA': 'Leu',
    'TTG': 'Leu', 'CTT': 'Leu', 'CTC': 'Leu', 'CTA': 'Leu',
    'CTG': 'Leu', 'ATT': 'Ile', 'ATC': 'Ile', 'ATA': 'Ile',
    'GTT': 'Val', 'GTC': 'Val', 'GTA': 'Val', 'GTG': 'Val',
    'TCT': 'Ser', 'TCC': 'Ser', 'TCA': 'Ser', 'TCG': 'Ser',
    'CCT': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
    'ACT': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
    'GCT': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
    'GGT': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly',
    'TAA': 'STOP', 'TAG': 'STOP', 'TGA': 'STOP',
}


def get_complement(strand):
    """
    Recursively builds the complementary DNA strand.
    
    Base case: empty string → return empty string.
    Recursive case: complement the first base, recurse on the rest.
    """
    # --- BASE CASE ---
    # An empty strand has no complement; recursion terminates here.
    if not strand:
        return ''
    
    # Mapping: A↔T, C↔G
    base_pairs = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
    
    # --- RECURSIVE CASE ---
    # Process the first nucleotide, then recurse on strand[1:]
    first = base_pairs[strand[0]]
    rest = get_complement(strand[1:])
    return first + rest


def decode_codons(strand, depth=0):
    """
    Recursively decodes a DNA strand into amino acids, 3 bases at a time.
    
    Base case 1: strand is empty → translation complete.
    Base case 2: strand has fewer than 3 bases → incomplete codon, stop.
    Base case 3: codon is a stop codon (TAA, TAG, TGA) → stop translation.
    Recursive case: translate first codon, recurse on remaining strand.
    """
    indent = '  ' * depth  # Visual indentation to show recursion depth
    
    # --- BASE CASE 1: No more bases ---
    if len(strand) == 0:
        print(f"{indent}↳ Base case: strand is empty. Done!")
        return []
    
    # --- BASE CASE 2: Incomplete codon ---
    if len(strand) < 3:
        print(f"{indent}↳ Base case: only {len(strand)} bases left (need 3). Skipping.")
        return []
    
    # Extract the current codon (3 bases)
    codon = strand[:3]
    amino_acid = CODON_TABLE.get(codon, '???')
    
    # --- BASE CASE 3: Stop codon encountered ---
    if amino_acid == 'STOP':
        print(f"{indent}↳ Codon '{codon}' → STOP. Translation halted.")
        return []
    
    print(f"{indent}Codon '{codon}' → {amino_acid}")
    
    # --- RECURSIVE CASE ---
    # Translate the rest of the strand (everything after the first 3 bases)
    remaining_acids = decode_codons(strand[3:], depth + 1)
    
    # Combine: current amino acid + results from recursive call
    return [amino_acid] + remaining_acids


if __name__ == '__main__':
    # --- Demo 1: Complement ---
    dna = 'ATCGATCG'
    print("=== Recursive Complement ===")
    print(f"Original:   {dna}")
    print(f"Complement: {get_complement(dna)}")
    
    # --- Demo 2: Codon decoding ---
    # ATG=Met (start), TTT=Phe, GCT=Ala, TAA=STOP
    coding_strand = 'ATGTTTGCTTAA'
    print(f"\n=== Recursive Codon Decoder ===")
    print(f"Strand: {coding_strand}")
    print(f"Length: {len(coding_strand)} bases ({len(coding_strand)//3} codons)\n")
    
    protein = decode_codons(coding_strand)
    print(f"\nDecoded protein chain: {' → '.join(protein)}")
