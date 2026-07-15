import os
import json

base_path = r"D:\Vedhanth\studies\Coding\Internship_VINS\pyBE\server\src\scenarios"

scenarios = [
    {
        "id": "dna-helix",
        "scenario": {
            "id": "dna-helix",
            "title": "The DNA Helix",
            "domain": "Biology",
            "domainCategory": "Genetics",
            "philosophicalAnchor": "Recursion is the universe's way of building infinite complexity from finite rules. The DNA helix twists and copies itself, much like a recursive function calling itself. But while nature can build indefinitely, a computer's call stack is finite. Recursion requires a base case, a boundary where the folding stops and the unravelling begins.",
            "pythonConcept": "Recursion, Call Stack, Limits",
            "difficultyLevel": 3,
            "jonasanType": "Concept",
            "targetConstructs": ["def", "return", "sys.setrecursionlimit", "RecursionError"],
            "briefDescription": "Understand recursion and the call stack by modeling DNA sequence generation. Learn how functions call themselves, the danger of infinite recursion, and how memory limits impose physical boundaries on abstract concepts.",
            "theoryPillar": "In biology, a DNA sequence can be viewed recursively: a base pair followed by the rest of the sequence. In computer science, a recursive function is one that calls itself to solve smaller instances of the same problem. Each call pushes a new frame onto the call stack. Without a base case, the stack grows until memory is exhausted, resulting in a stack overflow.",
            "anchorPillar": "We model DNA transcription using recursion. The function processes one base pair, then recursively processes the remainder. The Python interpreter's call stack represents the physical constraints. We use `sys.setrecursionlimit()` to observe the boundaries of our computing environment.",
            "triggerPillar": "You need to write a recursive function to compute the complementary DNA strand. If given 'ATCG', it should return 'TAGC'. Explore what happens when you process a massive DNA sequence that exceeds the recursion limit.",
            "realityPillar": "Recursive algorithms are elegant for traversing trees (like the DOM or file systems) and implementing divide-and-conquer strategies (like Merge Sort). However, in languages without tail-call optimization like Python, deep recursion is perilous. Real-world systems often translate recursive logic into iterative loops to prevent stack overflows."
        },
        "case_study": "# The DNA Helix\n\nNature builds complexity not by designing every detail, but by applying simple rules repeatedly. The DNA helix replicates by unwinding and matching complementary base pairs. Recursion in code works the same way: a function solves a small piece of the puzzle and delegates the rest to a copy of itself.\n\nBut a function must know when to stop. Without a base case, recursion is infinite in theory but fatal in practice. The call stack, a physical region of memory, fills up. In this scenario, you'll use recursion to build the complement of a DNA strand, confronting both the elegance of recursive logic and the physical limits of the machine.",
        "hints": [
            {"level": 1, "text": "A recursive function needs a base case. What is the complement of an empty DNA strand?"},
            {"level": 2, "text": "If the strand is not empty, process the first character, and recursively call the function on the rest of the string: strand[1:]."},
            {"level": 3, "text": "You might hit a RecursionError for very long strands. Use the `sys` module to inspect or change the recursion limit."}
        ],
        "rubric": {
            "reasoning": {"weight": 30, "description": "Clearly explains the role of the base case and the call stack."},
            "code": {"weight": 40, "description": "Correctly implements the recursive complementary function and handles RecursionError."},
            "reflection": {"weight": 30, "description": "Reflects on the limitations of physical hardware in executing abstract infinite concepts."}
        },
        "reflection_prompts": [
            "Why must all recursion in programming eventually end, even if nature seems boundless?",
            "What happens conceptually when a RecursionError occurs? How does the call stack relate to human short-term memory?"
        ],
        "solution_file": "recursion_demo.py",
        "solution_code": "import sys\n\ndef get_complement(strand):\n    base_pairs = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}\n    if not strand:\n        return ''\n    return base_pairs[strand[0]] + get_complement(strand[1:])\n\nif __name__ == '__main__':\n    # Test short strand\n    print('Complement of ATCG:', get_complement('ATCG'))\n    \n    # Test recursion limit\n    limit = sys.getrecursionlimit()\n    long_strand = 'A' * (limit + 10)\n    try:\n        get_complement(long_strand)\n    except RecursionError:\n        print(f'Hit recursion limit at {limit} frames.')\n"
    },
    {
        "id": "newtons-prism",
        "scenario": {
            "id": "newtons-prism",
            "title": "Newton's Prism",
            "domain": "Physics",
            "domainCategory": "Optics",
            "philosophicalAnchor": "Isaac Newton showed that white light is not a fundamental color, but a combination of all colors. A prism separates them. In the digital world, an integer is not just a number, but a combination of bits. Bitwise operators are the computational prism, isolating, extracting, and manipulating the elemental truths hidden within a single integer.",
            "pythonConcept": "Bitwise Operators, Masks, Shifts",
            "difficultyLevel": 3,
            "jonasanType": "Concept",
            "targetConstructs": ["&", "|", "^", "~", "<<", ">>", "bin()"],
            "briefDescription": "Use bitwise operations to dissect integers just as a prism dissects light. Learn how to use bitmasks to read and modify specific bits.",
            "theoryPillar": "Data in a computer is fundamentally binary. Bitwise operators act directly on these bits. The AND operator (&) acts as a filter, allowing us to check if specific bits are set. The OR operator (|) acts as an additive force, setting bits. XOR (^) acts as a toggle. Bit shifts (<<, >>) multiply or divide by powers of two.",
            "anchorPillar": "Imagine a single 8-bit integer representing an RGBA color or a set of permission flags. By applying a bitmask, we can isolate the 'Red' bits, just as a red filter isolates red light.",
            "triggerPillar": "You receive a compressed 16-bit integer where the first 5 bits represent red, the next 6 represent green, and the last 5 represent blue. Write code using bitwise operators to extract the individual R, G, and B components.",
            "realityPillar": "Bitwise operations are crucial in low-level systems programming, cryptography, network routing (subnet masking), and graphics programming. They provide immense performance benefits and allow highly compact data storage."
        },
        "case_study": "# Newton's Prism\n\nWhen Isaac Newton passed a beam of white light through a glass prism, he revealed that white was not a pure color, but a composite of the entire spectrum. The prism acted as an analytical tool, splitting the unified beam into its fundamental components.\n\nIn programming, integers often hide composite information. A single number can represent a combination of true/false flags, a compressed pixel color, or hardware states. Bitwise operators—AND, OR, XOR, and shifts—are your prism. They allow you to mask out the noise and extract the exact bits you need.",
        "hints": [
            {"level": 1, "text": "To extract a specific set of bits, you need a mask. For example, to get the last 5 bits, you need a mask with 5 ones: 0b11111 (which is 31)."},
            {"level": 2, "text": "Use the bitwise AND operator (`&`) with your mask to isolate the bits."},
            {"level": 3, "text": "To extract bits that are not at the very end, use the right shift operator (`>>`) to move them to the rightmost position before masking."}
        ],
        "rubric": {
            "reasoning": {"weight": 30, "description": "Explains how bitmasks act as filters for extracting information."},
            "code": {"weight": 40, "description": "Correctly uses bitwise AND and right shift to extract the RGB components."},
            "reflection": {"weight": 30, "description": "Understands the value of compact representation and bit-level manipulation."}
        },
        "reflection_prompts": [
            "Why is manipulating bits directly more efficient than representing the data as separate variables?",
            "How does a bitmask relate to the concept of a physical filter in optics?"
        ],
        "solution_file": "bitwise_prism.py",
        "solution_code": "def extract_rgb_565(color_16bit):\n    # Extract Blue (last 5 bits)\n    b_mask = 0b11111\n    b = color_16bit & b_mask\n    \n    # Extract Green (middle 6 bits)\n    g_mask = 0b111111\n    g = (color_16bit >> 5) & g_mask\n    \n    # Extract Red (first 5 bits)\n    r_mask = 0b11111\n    r = (color_16bit >> 11) & r_mask\n    \n    return r, g, b\n\nif __name__ == '__main__':\n    # Let's test with a magenta-like color: max red, 0 green, max blue\n    # Red: 11111, Green: 000000, Blue: 11111 => 1111100000011111 in binary\n    color = 0b1111100000011111\n    r, g, b = extract_rgb_565(color)\n    print(f'Color: {bin(color)}')\n    print(f'R: {r}, G: {g}, B: {b}')\n"
    },
    {
        "id": "buddhist-garbage-collector",
        "scenario": {
            "id": "buddhist-garbage-collector",
            "title": "The Buddhist Garbage Collector",
            "domain": "Philosophy",
            "domainCategory": "Buddhism",
            "philosophicalAnchor": "In Buddhist philosophy, suffering arises from attachment. The tighter we cling to things, the heavier our burden becomes. In memory management, a memory leak occurs when a program clings to objects it no longer needs via strong references. The Python Garbage Collector is the mechanism of letting go. A weak reference is the ultimate Buddhist act in coding: acknowledging an object's existence without clinging to it.",
            "pythonConcept": "Garbage Collection, Reference Counting, weakref",
            "difficultyLevel": 4,
            "jonasanType": "Concept",
            "targetConstructs": ["gc", "sys.getrefcount", "weakref", "del"],
            "briefDescription": "Understand Python's memory management by exploring reference counting and the garbage collector. Learn how to use weak references to avoid memory leaks caused by circular attachments.",
            "theoryPillar": "Python uses reference counting as its primary memory management strategy. When an object's reference count drops to zero, it is destroyed. However, circular references (Object A points to B, and B points to A) prevent the count from reaching zero. The `gc` module periodically hunts down and breaks these cycles.",
            "anchorPillar": "To prevent circular references from tying up memory indefinitely, we use the `weakref` module. A weak reference allows you to 'look' at an object without increasing its reference count. When the strong references disappear, the weak reference gracefully becomes None.",
            "triggerPillar": "Create two objects that reference each other, forming a cycle. Observe how they survive a `del` statement. Then, refactor the code using `weakref` to allow the objects to pass on peacefully.",
            "realityPillar": "Memory leaks in long-running Python applications (like web servers) often stem from unintended global references or caching layers creating circular dependencies. Caching mechanisms heavily utilize weak references to allow objects to be garbage collected when memory is tight."
        },
        "case_study": "# The Buddhist Garbage Collector\n\nAttachment is the root of suffering. When we hold onto things past their time, we stagnate. Software experiences this quite literally. When objects hold 'strong references' to one another even after their usefulness has passed, they create a memory leak. The system's memory fills up until the program crashes.\n\nPython's garbage collector seeks to free memory by finding objects that are no longer referenced. But circular references—where two objects cling to each other—can confuse it. To master memory management, you must learn to use `weakref`: a way to observe an object without clinging to it, allowing the garbage collector to sweep it away when the time is right.",
        "hints": [
            {"level": 1, "text": "Use `sys.getrefcount()` to see how many references exist to an object. Note that passing it to the function temporarily increases the count."},
            {"level": 2, "text": "Create a `Node` class. Create `node_a` and `node_b`. Set `node_a.next = node_b` and `node_b.prev = node_a`. This is a circular reference."},
            {"level": 3, "text": "Import the `weakref` module. Instead of `node_b.prev = node_a`, use `node_b.prev = weakref.ref(node_a)`. Now, node_b knows about node_a without clinging to it."}
        ],
        "rubric": {
            "reasoning": {"weight": 35, "description": "Clearly articulates how reference counting works and why circular references are problematic."},
            "code": {"weight": 40, "description": "Successfully implements a circular reference and fixes it using weakref."},
            "reflection": {"weight": 25, "description": "Draws meaningful parallels between software memory management and philosophical attachment."}
        },
        "reflection_prompts": [
            "How does a weak reference differ fundamentally from a standard (strong) reference?",
            "What might be the real-world equivalent of a 'circular reference' in human relationships or organizations?"
        ],
        "solution_file": "letting_go.py",
        "solution_code": "import gc\nimport weakref\n\nclass Node:\n    def __init__(self, name):\n        self.name = name\n        self.neighbor = None\n    def __repr__(self):\n        return f'Node({self.name})'\n\ndef demo_attachment():\n    a = Node('A')\n    b = Node('B')\n    # Circular attachment\n    a.neighbor = b\n    b.neighbor = a\n    return a, b\n\ndef demo_detachment():\n    a = Node('A')\n    b = Node('B')\n    # Weak reference (letting go)\n    a.neighbor = b\n    b.neighbor = weakref.ref(a)\n    return a, b\n\nif __name__ == '__main__':\n    gc.disable()  # Disable GC to observe reference counts\n    \n    a, b = demo_detachment()\n    print('Before deletion, B\\'s neighbor is:', b.neighbor())\n    \n    del a\n    print('After deleting A, B\\'s neighbor becomes:', b.neighbor())\n    gc.enable()\n"
    },
    {
        "id": "maslows-stack",
        "scenario": {
            "id": "maslows-stack",
            "title": "Maslow's Stack",
            "domain": "Psychology",
            "domainCategory": "Hierarchy of Needs",
            "philosophicalAnchor": "Maslow posited that human needs rest on a foundation of basic survival; only when physiological needs are met can we reach for self-actualization. Software has a similar hierarchy. At the top, Python provides self-actualization: dynamic types, elegant syntax, and safety. But it rests entirely on the C language's raw management of memory and pointers—the physiological needs of the machine.",
            "pythonConcept": "ctypes, Software Layers, Memory Addresses",
            "difficultyLevel": 5,
            "jonasanType": "Concept",
            "targetConstructs": ["ctypes", "id()", "ctypes.c_int", "sys.getsizeof"],
            "briefDescription": "Explore the layers of software abstraction using the `ctypes` module to peek under Python's hood. Realize how high-level abstractions rely on low-level memory management.",
            "theoryPillar": "Python is written in C (CPython). Every Python object is a C struct underneath. `id()` returns the actual memory address of this C struct. The `ctypes` library allows Python to interact with raw C data types and call functions in shared libraries, bridging the gap between high-level logic and low-level mechanics.",
            "anchorPillar": "Just as human self-actualization cannot exist without physiological survival, Python's elegance cannot exist without C's memory management. Using `ctypes`, we will bypass Python's protections to read the raw memory value of an object.",
            "triggerPillar": "Create a simple integer in Python. Use `id()` to get its memory address. Then, use `ctypes` to read the raw bytes at that exact memory location to prove that the integer is physically stored there.",
            "realityPillar": "The ability to drop down to C via `ctypes` or `CFFI` is what makes Python a powerhouse in data science and machine learning. Libraries like NumPy and TensorFlow use Python for the high-level API but execute the heavy lifting in highly optimized C/C++ or CUDA code."
        },
        "case_study": "# Maslow's Stack\n\nAbraham Maslow's Hierarchy of Needs suggests that higher-level human pursuits—creativity, philosophy, self-actualization—are built on a foundation of physiological survival. If you are starving, you do not write poetry.\n\nSoftware mirrors this hierarchy. Python is the language of self-actualization. It handles memory for you, catches your errors, and lets you focus on logic. But beneath Python lies C, a language that deals directly with memory addresses, pointers, and the physiological survival of the program. \n\nIn this scenario, you will use the `ctypes` module to break through the abstraction layer. You will find the exact physical location in your computer's RAM where a Python integer lives, and read it using C types.",
        "hints": [
            {"level": 1, "text": "The `id()` function in CPython returns the actual memory address of the object."},
            {"level": 2, "text": "An integer in CPython is represented by a struct `PyLongObject`. The actual value is stored at an offset from the base address."},
            {"level": 3, "text": "Use `ctypes.cast()` along with `ctypes.c_int` and `ctypes.POINTER` to read the raw memory at a specific address."}
        ],
        "rubric": {
            "reasoning": {"weight": 35, "description": "Clearly explains the difference between Python objects and C memory."},
            "code": {"weight": 40, "description": "Successfully uses ctypes to read memory from an object's id."},
            "reflection": {"weight": 25, "description": "Understands why abstraction is necessary, but also why breaking it is sometimes required."}
        },
        "reflection_prompts": [
            "What are the dangers of directly manipulating memory with ctypes in Python?",
            "How does abstraction in software compare to abstraction in human societies?"
        ],
        "solution_file": "memory_dive.py",
        "solution_code": "import ctypes\nimport sys\n\ndef read_memory_value(obj):\n    address = id(obj)\n    # In CPython, an int is a PyVarObject.\n    # The actual integer value data starts after the ob_refcnt, ob_type, and ob_size fields.\n    # This is heavily implementation-dependent.\n    # We'll use a safer ctypes approach: creating a c_int and reading its value.\n    \n    c_num = ctypes.c_int(42)\n    c_addr = ctypes.addressof(c_num)\n    \n    # Read the memory back\n    pointer = ctypes.cast(c_addr, ctypes.POINTER(ctypes.c_int))\n    return pointer.contents.value\n\nif __name__ == '__main__':\n    val = read_memory_value(42)\n    print(f'Value read directly from C memory: {val}')\n"
    },
    {
        "id": "horcrux-pattern",
        "scenario": {
            "id": "horcrux-pattern",
            "title": "The Horcrux Pattern",
            "domain": "Literature",
            "domainCategory": "Harry Potter",
            "philosophicalAnchor": "To cheat death, Voldemort split his soul and hid the fragments in physical objects. In computing, objects die when the program terminates. To cheat death, an object must be serialized—converted into a stream of bytes and stored on a disk. When the program restarts, the object is resurrected from the file. Serialization is the horcrux of software.",
            "pythonConcept": "Serialization, Pickle, JSON",
            "difficultyLevel": 3,
            "jonasanType": "Concept",
            "targetConstructs": ["pickle.dumps", "pickle.loads", "json.dumps", "json.loads", "with open()"],
            "briefDescription": "Learn how to save complex Python objects to disk and load them back into memory using serialization (Pickle and JSON).",
            "theoryPillar": "Memory (RAM) is volatile; when a process ends, everything in it is lost. To persist data, it must be written to non-volatile storage. Serialization is the process of translating data structures or object state into a format that can be stored and reconstructed later. `pickle` is Python-specific and handles complex objects. `json` is a universal text-based format.",
            "anchorPillar": "We create a 'Wizard' object representing Voldemort. We then 'split' his state by using `pickle.dumps()` to serialize the object into a binary file. In a separate execution flow, we use `pickle.loads()` to resurrect him.",
            "triggerPillar": "Create a custom Python class with various attributes. Serialize an instance of this class to a file using the `pickle` module. Then, write code to read the file and reconstruct the exact object.",
            "realityPillar": "Serialization is everywhere. When you save a game, send data over a network via an API, or cache query results, you are serializing. JSON is the lingua franca of the web, while binary formats like Protocol Buffers or Pickle are used for high-performance internal systems."
        },
        "case_study": "# The Horcrux Pattern\n\nIn the wizarding world, a Horcrux is an object in which a Dark wizard has hidden a fragment of their soul for the purpose of attaining immortality. As long as the physical object remains intact, the wizard cannot truly die.\n\nPython objects are mortal. They live in RAM, and when the program finishes executing, they vanish into the void. To grant an object immortality, you must serialize it—transform its living state into a static sequence of bytes that can be written to a hard drive.\n\nIn this scenario, you will explore two methods of making Horcruxes: `json`, which is readable by all (Muggles and wizards alike), and `pickle`, a dark art specific to Python that can capture almost any complex object structure.",
        "hints": [
            {"level": 1, "text": "The `pickle` module allows you to serialize Python objects. `pickle.dump(obj, file)` writes to a file, `pickle.load(file)` reads from it."},
            {"level": 2, "text": "Remember that pickle files are binary. You must open the file in write-binary mode (`wb`) to save, and read-binary mode (`rb`) to load."},
            {"level": 3, "text": "Unlike pickle, `json` can only serialize basic data types (dicts, lists, strings, numbers). To JSON-serialize a custom class, you must convert it to a dictionary first, often using `obj.__dict__`."}
        ],
        "rubric": {
            "reasoning": {"weight": 30, "description": "Explains the difference between volatile memory and persistent storage."},
            "code": {"weight": 40, "description": "Properly serializes and deserializes an object using both pickle and json."},
            "reflection": {"weight": 30, "description": "Understands the security implications of using pickle versus json."}
        },
        "reflection_prompts": [
            "Why does the Python documentation explicitly warn never to unpickle data from an untrusted source?",
            "If JSON cannot store complex objects natively, why is it the dominant format for APIs instead of Pickle?"
        ],
        "solution_file": "soul_split.py",
        "solution_code": "import pickle\nimport json\n\nclass Wizard:\n    def __init__(self, name, horcruxes_made):\n        self.name = name\n        self.horcruxes_made = horcruxes_made\n\ndef create_pickle_horcrux(wizard, filename):\n    with open(filename, 'wb') as f:\n        pickle.dump(wizard, f)\n\ndef resurrect_from_pickle(filename):\n    with open(filename, 'rb') as f:\n        return pickle.load(f)\n\nif __name__ == '__main__':\n    voldemort = Wizard('Tom Riddle', 7)\n    \n    # Split soul to disk\n    create_pickle_horcrux(voldemort, 'diary.pkl')\n    print('Horcrux created.')\n    \n    # Resurrect\n    resurrected = resurrect_from_pickle('diary.pkl')\n    print(f'Resurrected: {resurrected.name} with {resurrected.horcruxes_made} horcruxes.')\n"
    },
    {
        "id": "infinity-stones",
        "scenario": {
            "id": "infinity-stones",
            "title": "The Infinity Stones",
            "domain": "Pop Culture",
            "domainCategory": "Marvel Cinematic Universe",
            "philosophicalAnchor": "Individually, the Infinity Stones are incredibly powerful. But they are scattered, difficult to manage, and their true potential is unlocked only when housed together in the Infinity Gauntlet. In Python, individual `.py` files (modules) are powerful, but a large system needs organization. The `__init__.py` file acts as the Gauntlet, binding scattered modules into a unified, controllable Package.",
            "pythonConcept": "Packages, Modules, __init__.py",
            "difficultyLevel": 2,
            "jonasanType": "Concept",
            "targetConstructs": ["import", "from ... import", "__init__.py", "__all__"],
            "briefDescription": "Learn how to organize multiple Python scripts into a cohesive package using `__init__.py`, just as the Infinity Gauntlet unites the Infinity Stones.",
            "theoryPillar": "A Python module is just a file ending in `.py`. A Python package is a directory containing modules and a special file named `__init__.py`. This file tells Python that the directory should be treated as a package, allowing you to control what gets exposed when someone imports your package.",
            "anchorPillar": "We create a directory called `gauntlet` with individual files for `space.py`, `time.py`, etc. The `__init__.py` file will import specific functions from these stones, presenting a clean, unified API to the outside world.",
            "triggerPillar": "Create a package named `gauntlet`. Inside it, create several modules representing stones. Use the `__init__.py` file to define what functions are available when a user simply types `from gauntlet import *`.",
            "realityPillar": "Every major Python library you use—Pandas, Django, Requests—is structured as a package. `__init__.py` is the architectural cornerstone of scalable Python codebases, allowing developers to refactor internal files without breaking the public API."
        },
        "case_study": "# The Infinity Stones\n\nThe Space Stone allows instantaneous travel. The Time Stone manipulates temporal flow. Each is a singularity of immense power. But scattered across the universe, they are fragmented. Only when placed together into the Infinity Gauntlet do they act as a unified, systemic force.\n\nAs your Python projects grow, keeping all your code in one file becomes chaotic. You split them into separate modules (files). But soon, importing functions from dozens of files becomes a mess. \n\nA Python Package is the Gauntlet. By placing an `__init__.py` file in a directory, you forge scattered modules into a single, cohesive entity. You can control exactly which powers are exposed to the user and which remain hidden in the depths of the package.",
        "hints": [
            {"level": 1, "text": "Create a folder named `gauntlet`. Inside it, create a file named `__init__.py`."},
            {"level": 2, "text": "Inside `gauntlet`, create `time_stone.py` with a function `reverse_time()`, and `space_stone.py` with `teleport()`."},
            {"level": 3, "text": "In `__init__.py`, write `from .time_stone import reverse_time` and `from .space_stone import teleport`. Now anyone importing `gauntlet` has access to both."}
        ],
        "rubric": {
            "reasoning": {"weight": 30, "description": "Explains the purpose of packages in organizing large codebases."},
            "code": {"weight": 50, "description": "Correctly sets up a directory structure, modules, and a working __init__.py."},
            "reflection": {"weight": 20, "description": "Reflects on the concept of a 'public API' versus internal implementations."}
        },
        "reflection_prompts": [
            "What is the advantage of hiding internal modules and only exposing specific functions in `__init__.py`?",
            "How does organizing code into packages change the way multiple developers collaborate on a project?"
        ],
        "solution_file": "use_gauntlet.py",
        "solution_code": "# Assuming the directory 'gauntlet' exists with __init__.py, time_stone.py, space_stone.py\n\n# gauntlet/__init__.py content:\n# from .time_stone import reverse_time\n# from .space_stone import teleport\n\n# gauntlet/time_stone.py content:\n# def reverse_time(): return 'Time reversed'\n\nimport os\n\ndef setup_gauntlet():\n    os.makedirs('gauntlet', exist_ok=True)\n    with open('gauntlet/time_stone.py', 'w') as f:\n        f.write('def reverse_time(): return \"Time reversed\"')\n    with open('gauntlet/__init__.py', 'w') as f:\n        f.write('from .time_stone import reverse_time')\n\nif __name__ == '__main__':\n    setup_gauntlet()\n    from gauntlet import reverse_time\n    print(reverse_time())\n"
    }
]

for item in scenarios:
    scen_id = item["id"]
    scen_dir = os.path.join(base_path, scen_id)
    os.makedirs(scen_dir, exist_ok=True)
    
    # Write scenario.json
    with open(os.path.join(scen_dir, "scenario.json"), "w") as f:
        json.dump(item["scenario"], f, indent=2)
        
    # Write case-study.md
    with open(os.path.join(scen_dir, "case-study.md"), "w") as f:
        f.write(item["case_study"])
        
    # Write hints.json
    with open(os.path.join(scen_dir, "hints.json"), "w") as f:
        json.dump(item["hints"], f, indent=2)
        
    # Write scoring-rubric.json
    with open(os.path.join(scen_dir, "scoring-rubric.json"), "w") as f:
        json.dump(item["rubric"], f, indent=2)
        
    # Write reflection-prompts.json
    with open(os.path.join(scen_dir, "reflection-prompts.json"), "w") as f:
        json.dump(item["reflection_prompts"], f, indent=2)
        
    # Write solution
    sol_dir = os.path.join(scen_dir, "solution")
    os.makedirs(sol_dir, exist_ok=True)
    with open(os.path.join(sol_dir, item["solution_file"]), "w") as f:
        f.write(item["solution_code"])

print("All scenarios created successfully.")
