"""
benchmark.py Performance Comparison: JSON vs Pickle
=======================================================
Measures serialization speed, deserialization speed, and file sizes
for json, pickle (various protocols), and shelve.

Which horcrux container is fastest? Let's find out.
"""

import json
import pickle
import shelve
import time
import os
import sys
import glob


def generate_test_data(size='medium'):
    """Generate test data of varying complexity."""
    if size == 'small':
        return {'name': 'Voldemort', 'horcruxes': 7}
    elif size == 'medium':
        return {
            'wizards': [
                {
                    'name': f'Wizard_{i}',
                    'house': ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'][i % 4],
                    'spells': [f'spell_{j}' for j in range(10)],
                    'scores': list(range(100)),
                    'metadata': {f'key_{k}': f'value_{k}' for k in range(20)},
                }
                for i in range(50)
            ],
            'settings': {f'setting_{i}': i * 3.14 for i in range(100)},
        }
    else:  # large
        return {
            'matrix': [[float(i * j) for j in range(100)] for i in range(100)],
            'records': [
                {
                    'id': i,
                    'data': list(range(50)),
                    'tags': [f'tag_{j}' for j in range(20)],
                    'nested': {'a': {'b': {'c': i}}},
                }
                for i in range(200)
            ],
        }


def benchmark_json(data, iterations=100):
    """Benchmark JSON serialization and deserialization."""
    # Serialize
    start = time.perf_counter()
    for _ in range(iterations):
        serialized = json.dumps(data)
    serialize_time = (time.perf_counter() - start) / iterations
    
    # Deserialize
    start = time.perf_counter()
    for _ in range(iterations):
        _ = json.loads(serialized)
    deserialize_time = (time.perf_counter() - start) / iterations
    
    return {
        'format': 'JSON',
        'serialize_ms': serialize_time * 1000,
        'deserialize_ms': deserialize_time * 1000,
        'size_bytes': len(serialized.encode('utf-8')),
    }


def benchmark_pickle(data, protocol=None, iterations=100):
    """Benchmark pickle serialization and deserialization."""
    if protocol is None:
        protocol = pickle.HIGHEST_PROTOCOL
    
    # Serialize
    start = time.perf_counter()
    for _ in range(iterations):
        serialized = pickle.dumps(data, protocol=protocol)
    serialize_time = (time.perf_counter() - start) / iterations
    
    # Deserialize
    start = time.perf_counter()
    for _ in range(iterations):
        _ = pickle.loads(serialized)
    deserialize_time = (time.perf_counter() - start) / iterations
    
    return {
        'format': f'pickle (p{protocol})',
        'serialize_ms': serialize_time * 1000,
        'deserialize_ms': deserialize_time * 1000,
        'size_bytes': len(serialized),
    }


def benchmark_shelve(data, iterations=20):
    """Benchmark shelve write and read."""
    shelf_name = '_bench_shelf'
    
    # Write
    start = time.perf_counter()
    for i in range(iterations):
        with shelve.open(shelf_name) as db:
            db['test'] = data
    write_time = (time.perf_counter() - start) / iterations
    
    # Read
    start = time.perf_counter()
    for _ in range(iterations):
        with shelve.open(shelf_name) as db:
            _ = db['test']
    read_time = (time.perf_counter() - start) / iterations
    
    # Measure file size
    total_size = 0
    for ext in ['', '.db', '.dir', '.bak', '.dat']:
        path = shelf_name + ext
        if os.path.exists(path):
            total_size += os.path.getsize(path)
    
    # Cleanup
    for ext in ['', '.db', '.dir', '.bak', '.dat']:
        path = shelf_name + ext
        if os.path.exists(path):
            os.remove(path)
    
    return {
        'format': 'shelve',
        'serialize_ms': write_time * 1000,
        'deserialize_ms': read_time * 1000,
        'size_bytes': total_size,
    }


def run_benchmark(size='medium'):
    """Run complete benchmark suite."""
    print(f"  Generating '{size}' test data...")
    data = generate_test_data(size)
    
    results = []
    
    # JSON
    results.append(benchmark_json(data))
    
    # Pickle with different protocols
    results.append(benchmark_pickle(data, protocol=0))
    results.append(benchmark_pickle(data, protocol=2))
    results.append(benchmark_pickle(data, protocol=pickle.HIGHEST_PROTOCOL))
    
    # Shelve (fewer iterations because it involves disk I/O)
    results.append(benchmark_shelve(data))
    
    return results


def print_results(results, title):
    """Print benchmark results in a formatted table."""
    print(f"\n  {title}")
    print("  " + "-" * 65)
    print(f"  {'Format':<18} {'Serialize':<14} {'Deserialize':<14} {'Size':<14}")
    print("  " + "-" * 65)
    
    for r in results:
        size_str = format_size(r['size_bytes'])
        print(f"  {r['format']:<18} {r['serialize_ms']:<14.3f} {r['deserialize_ms']:<14.3f} {size_str:<14}")
    
    # Find winners
    fastest_ser = min(results, key=lambda x: x['serialize_ms'])
    fastest_deser = min(results, key=lambda x: x['deserialize_ms'])
    smallest = min(results, key=lambda x: x['size_bytes'])
    
    print()
    print(f"  🏆 Fastest serialize:   {fastest_ser['format']} ({fastest_ser['serialize_ms']:.3f} ms)")
    print(f"  🏆 Fastest deserialize: {fastest_deser['format']} ({fastest_deser['deserialize_ms']:.3f} ms)")
    print(f"  🏆 Smallest size:       {smallest['format']} ({format_size(smallest['size_bytes'])})")


def format_size(bytes_count):
    """Format byte count as human-readable string."""
    if bytes_count < 1024:
        return f"{bytes_count} B"
    elif bytes_count < 1024 * 1024:
        return f"{bytes_count / 1024:.1f} KB"
    else:
        return f"{bytes_count / (1024 * 1024):.1f} MB"


if __name__ == '__main__':
    print("=" * 70)
    print("  Horcrux Performance Benchmark: JSON vs Pickle vs Shelve")
    print("=" * 70)
    print()
    
    for size in ['small', 'medium', 'large']:
        results = run_benchmark(size)
        print_results(results, f"Data Size: {size.upper()}")
        print()
    
    # Summary
    print("=" * 70)
    print("  Summary & Recommendations")
    print("=" * 70)
    print()
    print("  • JSON: Best for interoperability and debugging. Slowest for")
    print("    large data, but produces readable output.")
    print()
    print("  • pickle (latest protocol): Best for speed and Python-only apps.")
    print("    Handles complex objects. Not safe for untrusted data.")
    print()
    print("  • shelve: Best for key-value access patterns where you need")
    print("    to read/write individual entries without loading everything.")
    print()
    print("  Choose based on your needs:")
    print("    Need cross-language? → JSON")
    print("    Need speed + Python objects? → pickle")
    print("    Need dict-like persistence? → shelve")
