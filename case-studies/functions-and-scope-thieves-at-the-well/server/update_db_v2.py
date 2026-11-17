import json

updates = {
    "While Loops": {
        "rookie": [
            {
                "hint": "Check which option increases the value of x rather than decreasing it towards 0.",
                "explanation": "Because x is 5 and we add 1 in each iteration, it will never reach 0, making x > 0 always True."
            },
            {
                "hint": "Think about breaking out of jail.",
                "explanation": "The 'break' keyword immediately terminates the innermost enclosing loop, skipping the else clause if any."
            },
            {
                "hint": "Think about a word that means 'keep going'.",
                "explanation": "The 'continue' statement jumps to the next iteration of the loop, skipping the rest of the code in the current iteration."
            }
        ],
        "intermediate": [
            {
                "hint": "Look at what happens to 'count' in the loop.",
                "explanation": "You must increment 'count' (e.g., count += 1) inside the loop, otherwise it remains 1 and the condition is forever True."
            },
            {
                "hint": "If you are counting down, you need to subtract.",
                "explanation": "To decrement the counter, you need 'count -= 1' inside the loop so it reaches 0 and terminates."
            },
            {
                "hint": "Look closely at the modulo operator % logic.",
                "explanation": "The modulo operation for even numbers is 'num % 2 == 0'. The provided code incorrectly checked for '== 1', which is odd."
            }
        ],
        "programmer": [
            {
                "hint": "You need a counter for attempts and a while condition that checks both PIN correctness and attempts left.",
                "explanation": "Using a variable for attempts and checking 'attempts > 0' along with the pin match ensures the loop terminates correctly in both success and failure cases."
            },
            {
                "hint": "Fibonacci requires keeping track of the previous two numbers.",
                "explanation": "By maintaining 'a' and 'b', and updating them simultaneously 'a, b = b, a + b', you can easily print the sequence inside a while loop."
            },
            {
                "hint": "Use input() inside the loop to repeatedly ask.",
                "explanation": "A while loop checking 'guess != secret_number' will keep prompting the user. Once the loop exits, it means the guess was correct."
            }
        ]
    },
    "Object-Oriented Programming": {
        "rookie": [
            {"hint": "Think about what happens when an object is initially born or initialized.", "explanation": "The '__init__' method is a special constructor automatically called when a new instance of a class is created."},
            {"hint": "This sounds like inheriting traits from a parent.", "explanation": "Inheritance allows a new class to take on the attributes and methods of an existing class, promoting code reuse."},
            {"hint": "It's a reference to the object looking at itself.", "explanation": "'self' is the first parameter of instance methods and refers to the specific object the method is being called on."}
        ],
        "intermediate": [
            {"hint": "Look at the __init__ method parameters.", "explanation": "Instance methods must always define 'self' as their first parameter. '__init__(self, name)' fixes the error."},
            {"hint": "What is missing from the honk method's definition?", "explanation": "Every instance method must take 'self' as its first parameter. 'def honk(self):' is required."},
            {"hint": "How do you attach an attribute to the object instance?", "explanation": "You must assign it to 'self.brand = brand' instead of just a local variable 'brand = brand'."}
        ],
        "programmer": [
            {"hint": "Store the balance as self.balance. Check it before withdrawing.", "explanation": "Creating instance variables and validating state before mutating it (checking if amount <= self.balance) is a core OOP concept."},
            {"hint": "Make sure health doesn't go below 0 using max().", "explanation": "Encapsulating state changes inside methods ensures the object remains in a valid state (health >= 0)."},
            {"hint": "Store books in a list attribute self.books.", "explanation": "Using a list as an instance attribute allows the object to maintain a dynamic state across method calls."}
        ]
    },
    "Variables & Data Types": {
        "rookie": [
            {"hint": "Variable names cannot start with numbers and cannot contain hyphens.", "explanation": "Valid variable names must start with a letter or underscore. 'first_name' follows standard snake_case conventions."},
            {"hint": "Look for a decimal point.", "explanation": "Any number with a decimal point is represented as a Float in Python."},
            {"hint": "Python is case-sensitive for booleans.", "explanation": "Boolean values in Python must be capitalized: 'True' or 'False'."}
        ],
        "intermediate": [
            {"hint": "You cannot concatenate a string and an integer directly.", "explanation": "You must explicitly cast the integer to a string using 'str(age)' or use an f-string."},
            {"hint": "'class' is a reserved keyword in Python.", "explanation": "Reserved words cannot be used as variable names. Using 'course' or 'class_name' avoids the SyntaxError."},
            {"hint": "Look at how 'total' is casted.", "explanation": "Casting a float to an 'int()' truncates the decimal. You should remove the 'int()' cast to preserve the accurate float price."}
        ],
        "programmer": [
            {"hint": "Use f'{title} has {rating} rating'.", "explanation": "F-strings provide a clean way to interpolate different data types into a string without explicit casting."},
            {"hint": "Python allows simultaneous assignment.", "explanation": "You can swap variables cleanly in one line using tuple unpacking: 'a, b = b, a'."},
            {"hint": "Area is width multiplied by height.", "explanation": "Multiplying two floats yields a float. Storing the result in a variable 'area = width * height' accurately computes the area."}
        ]
    },
    "Lists & Arrays": {
        "rookie": [
            {"hint": "Remember that Python is 0-indexed.", "explanation": "The first element of any list or array in Python is located at index 0."},
            {"hint": "Think of adding to the end of a document (an appendix).", "explanation": "The '.append()' method exclusively adds a single item to the very end of a list in-place."},
            {"hint": "What is the three-letter abbreviation for length?", "explanation": "'len()' is a built-in Python function that returns the total number of items in a sequence or collection."}
        ],
        "intermediate": [
            {"hint": "If a list has 3 items, what is the maximum index?", "explanation": "Because Python is 0-indexed, a list with 3 items has indices 0, 1, and 2. Attempting to access index 3 causes an IndexError."},
            {"hint": "Lists do not have an 'add' method.", "explanation": "To add an item to a list, you must use '.append('Batman')'."},
            {"hint": "Strings are immutable. Simply replace the entire element.", "explanation": "You must reassign the element completely with \"animals[1] = 'lion'\" rather than calling a string method on it."}
        ],
        "programmer": [
            {"hint": "Use .append() and then .pop(0).", "explanation": "Lists are mutable. Using .append() adds an item, and .pop(0) removes the first item, demonstrating dynamic list management."},
            {"hint": "Use the .sort() method or sorted() function.", "explanation": "The .sort() method modifies a list in-place, while sorted() returns a new list. Both are valid for sorting numerics."},
            {"hint": "Use the .reverse() method or slicing [::-1].", "explanation": "Python provides multiple clean ways to reverse a list, either in-place via .reverse() or via slicing [::-1]."}
        ]
    },
    "If/Else Conditionals": {
        "rookie": [
            {"hint": "A single = is for assignment. You need the comparison operator.", "explanation": "The double equals '==' evaluates whether two values are strictly equal to each other."},
            {"hint": "It's a portmanteau of 'else if'.", "explanation": "Python uses 'elif' as the keyword for checking secondary conditions in an if-statement block."},
            {"hint": "Unlike other languages, Python doesn't use curly braces for blocks.", "explanation": "Indentation is syntactically required in Python to define the scope of loops, conditionals, and functions."}
        ],
        "intermediate": [
            {"hint": "Look at the end of the 'if' statement line.", "explanation": "Every conditional statement must end with a colon ':' to indicate the start of the indented block."},
            {"hint": "You are assigning 'admin' instead of checking for equality.", "explanation": "The single '=' operator assigns a value. You must use '==' to check if password is equal to 'admin'."},
            {"hint": "The print statement is not indented.", "explanation": "Python strictly enforces indentation. The body of the 'if' block must be indented (usually 4 spaces) to avoid an IndentationError."}
        ],
        "programmer": [
            {"hint": "Use if, elif, and else.", "explanation": "Chaining 'if temperature > 25:', 'elif temperature >= 15:', and 'else:' provides a clean logical flow for mutually exclusive conditions."},
            {"hint": "Use the 'and' logical operator.", "explanation": "The 'and' operator requires both conditions (username == 'admin' and password == 'secret') to be True for the block to execute."},
            {"hint": "An even number has a remainder of 0 when divided by 2.", "explanation": "The modulo operator '%' returns the remainder. 'num % 2 == 0' is the standard way to check for evenness."}
        ]
    },
    "Dictionaries": {
        "rookie": [
            {"hint": "Think of the curly shape.", "explanation": "Dictionaries in Python are defined using curly braces '{}' surrounding key-value pairs."},
            {"hint": "Accessing a dictionary uses the same brackets as lists.", "explanation": "You access dictionary values by providing the string key inside square brackets, like `person['age']`."},
            {"hint": "Keys in a dictionary must be strictly unique.", "explanation": "Dictionaries cannot have duplicate keys. Assigning a value to an existing key simply overwrites the old value."}
        ],
        "intermediate": [
            {"hint": "Use the safe access method instead of brackets.", "explanation": "The '.get('age', 'Unknown')' method returns the value if the key exists, and a default fallback value if it doesn't, preventing crashes."},
            {"hint": "Dictionary keys must be immutable types.", "explanation": "Lists are mutable and cannot be hashed, so they cannot be keys. Using a string or tuple as the key fixes the TypeError."},
            {"hint": "You cannot use dot notation for dictionary keys like in JavaScript.", "explanation": "In Python, you must use bracket notation `car['year'] = 2020` to assign a new key-value pair."}
        ],
        "programmer": [
            {"hint": "Use bracket notation to set a new key or overwrite an old one.", "explanation": "Dictionaries are mutable. `student['grade'] = 'A+'` successfully overwrites the existing grade value."},
            {"hint": "Use `counts['apples'] = 5` and similarly for oranges.", "explanation": "Adding values via bracket notation and then summing them `counts['apples'] + counts['oranges']` demonstrates data extraction and math."},
            {"hint": "Use the `del` keyword or `.pop()` method.", "explanation": "`del dict['key']` removes a key-value pair. Using `.keys()` gives you the remaining keys to print."}
        ]
    },
    "For Loops": {
        "rookie": [
            {"hint": "You want numbers from 0 to 4. How many numbers is that?", "explanation": "`range(5)` generates exactly 5 numbers starting from 0 (0, 1, 2, 3, 4)."},
            {"hint": "A string is just a sequence of characters.", "explanation": "Iterating over a string yields one character at a time, so it will print 'c', 'a', 't' on separate lines."},
            {"hint": "Which word implies completely stopping?", "explanation": "The `break` keyword immediately halts the loop, regardless of remaining iterations."}
        ],
        "intermediate": [
            {"hint": "You cannot iterate over an integer.", "explanation": "Integers are not iterable. You must use `range(limit)` to generate a sequence of numbers to loop through."},
            {"hint": "Look at the modulo condition for odd numbers.", "explanation": "`i % 2 == 0` checks for even numbers. To filter odd numbers, use `i % 2 != 0` or `i % 2 == 1`."},
            {"hint": "You cannot use both pass and continue together.", "explanation": "`pass` does nothing, while `continue` skips the iteration. Using both is a syntax error. Just use `continue`."}
        ],
        "programmer": [
            {"hint": "Initialize a sum variable to 0 outside the loop.", "explanation": "A running total requires a variable outside the loop (`total = 0`), which you add to during each iteration (`total += i`)."},
            {"hint": "Loop through the list directly.", "explanation": "Python allows direct iteration: `for name in names: print('Hello ' + name)`, which is cleaner than using indices."},
            {"hint": "Use range(1, 21) and the modulo operator.", "explanation": "Checking `if i % 5 == 0:` allows you to conditionally print 'Bingo' while letting other numbers print normally."}
        ]
    },
    "Functions": {
        "rookie": [
            {"hint": "It stands for 'define'.", "explanation": "The `def` keyword tells Python you are starting a function definition block."},
            {"hint": "You just need the name and parentheses.", "explanation": "Functions are executed by writing their name followed by parentheses `()` containing any required arguments."},
            {"hint": "It sends the result back.", "explanation": "The `return` statement ends the function's execution and outputs the specified value to wherever the function was called."}
        ],
        "intermediate": [
            {"hint": "Look at the end of the 'def' line.", "explanation": "Every function definition must end with a colon `:` to start the indented code block."},
            {"hint": "The function calculates the result but doesn't hand it back.", "explanation": "Without a `return result` statement, the function implicitly returns `None`."},
            {"hint": "Default parameters use an equals sign.", "explanation": "The colon is used for type hinting. To set a default value, use `def greet(name='Guest'):`."}
        ],
        "programmer": [
            {"hint": "Use def multiply(a, b): return a * b", "explanation": "Functions encapsulate math logic cleanly, allowing you to pass parameters in and get a computed return value out."},
            {"hint": "Use the modulo operator.", "explanation": "Returning `num % 2 == 0` evaluates directly to True or False, making the function incredibly concise."},
            {"hint": "Use string splitting and indexing.", "explanation": "Splitting the string into parts with `.split()`, taking the first character `[0]` of each part, and joining them returns the initials."}
        ]
    },
    "Tuples & Sets": {
        "rookie": [
            {"hint": "Lists can be changed after creation. Tuples cannot.", "explanation": "Tuples are entirely immutable, meaning their size and elements are permanently locked upon creation."},
            {"hint": "Which one guarantees unique items?", "explanation": "Sets mathematically forbid duplicate values, automatically discarding them during insertion."},
            {"hint": "A single item in parentheses is just grouped math.", "explanation": "To differentiate a single-item tuple from a math expression, Python requires a trailing comma: `(1,)`."}
        ],
        "intermediate": [
            {"hint": "Tuples do not support item assignment.", "explanation": "Because tuples are immutable, you must convert it to a list: `coords = list(coords)`, modify it, then convert back to a tuple."},
            {"hint": "Sets do not have an 'append' method.", "explanation": "Lists use `.append()`, but Sets use the `.add()` method to insert new unique elements."},
            {"hint": "Sets are completely unordered.", "explanation": "Sets do not support indexing because they have no order. Convert it via `list(names)[0]` to access an element by position."}
        ],
        "programmer": [
            {"hint": "Define it with parentheses.", "explanation": "Creating `weekend = ('Saturday', 'Sunday')` and accessing `weekend[1]` demonstrates zero-indexing on immutable tuples."},
            {"hint": "Wrap the list in set().", "explanation": "Passing a list into the `set()` constructor instantly filters out all duplicates, demonstrating the primary utility of sets."},
            {"hint": "Use the intersection method or the & operator.", "explanation": "Sets excel at mathematical operations. `a.intersection(b)` or `a & b` efficiently yields the common elements."}
        ]
    },
    "File Handling": {
        "rookie": [
            {"hint": "It stands for Read.", "explanation": "The 'r' mode opens a file strictly for reading, meaning you cannot modify its contents."},
            {"hint": "It manages the cleanup for you.", "explanation": "The `with` context manager handles opening and, crucially, automatically closing the file even if exceptions occur."},
            {"hint": "It pulls everything into memory.", "explanation": "The `.read()` method consumes the entire file and returns it as a single contiguous string."}
        ],
        "intermediate": [
            {"hint": "You cannot write in 'r' mode.", "explanation": "You must open the file in 'w' (write) or 'a' (append) mode to use `.write()`. 'r' is strictly read-only."},
            {"hint": "Manual opening requires manual closing.", "explanation": "Without `with`, failing to call `f.close()` leaves the file locked in memory, potentially corrupting data."},
            {"hint": "The correct method name reads multiple lines.", "explanation": "The built-in method is `.readlines()`, which returns a list where each element is a line from the file."}
        ],
        "programmer": [
            {"hint": "Open with 'w' mode.", "explanation": "Using `with open('hello.txt', 'w') as f:` and `f.write('Hello, World!')` securely creates the file and injects the text."},
            {"hint": "Open with 'r' mode.", "explanation": "Using `with open('data.txt', 'r') as f:` followed by `print(f.read())` safely extracts and displays the text."},
            {"hint": "Open with 'a' mode.", "explanation": "Append mode ('a') places the cursor at the end of the file, allowing you to `f.write('\\nNew entry')` without destroying old data."}
        ]
    }
}

db_path = 'src/data/db.json'
with open(db_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for module in data.get('modules', []):
    mod_name = module.get('concept')
    evals = module.get('evaluations', {})
    if mod_name in updates:
        mod_updates = updates[mod_name]
        for tier in ['rookie', 'intermediate', 'programmer']:
            items = evals.get(tier, [])
            tier_updates = mod_updates.get(tier, [])
            
            for i, item in enumerate(items):
                if isinstance(item, dict) and i < len(tier_updates):
                    item['hint'] = tier_updates[i]['hint']
                    item['explanation'] = tier_updates[i]['explanation']
                    
with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated 90 highly specific hints and explanations successfully!")
