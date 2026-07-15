import sys

def get_complement(strand):
    base_pairs = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
    if not strand:
        return ''
    return base_pairs[strand[0]] + get_complement(strand[1:])

if __name__ == '__main__':
    # Test short strand
    print('Complement of ATCG:', get_complement('ATCG'))
    
    # Test recursion limit
    limit = sys.getrecursionlimit()
    long_strand = 'A' * (limit + 10)
    try:
        get_complement(long_strand)
    except RecursionError:
        print(f'Hit recursion limit at {limit} frames.')
