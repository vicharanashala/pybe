// src/data/problems.ts
// Beginner problems aligned with W3Schools Python topics
// https://www.w3schools.com/python/python_comments.asp
// Format: input_code is prepended before solution_code when running tests.
// Solutions must be plain functions that print() their result.

export interface TestCase {
  label: string
  input_code: string       // variables set up BEFORE solution runs
  expected_output: string  // exact stdout after strip()
}

export interface Problem {
  id: string
  title: string
  topic: string            // W3Schools section name
  difficulty: 'Easy'
  tags: string[]
  description: string
  hint: string
  examples: { input: string; output: string; explanation?: string }[]
  starterCode: string
  testCases: TestCase[]
}

export const PROBLEMS: Problem[] = [

  // ── Comments ────────────────────────────────────────────────────────────
  {
    id: 'comments-greeting',
    title: 'Add a Comment',
    topic: 'Comments',
    difficulty: 'Easy',
    tags: ['Comments', 'Print'],
    description: `A comment in Python starts with the **#** symbol. Comments are not executed — they are just notes for the reader.\n\nWrite code that:\n1. Has a comment that says \`# This prints my name\`\n2. Prints your name (use \`"Alice"\`)`,
    hint: 'Use # to write a comment, then print("Alice") on the next line.',
    examples: [
      { input: '(no input)', output: 'Alice', explanation: 'The comment is ignored; only print runs.' },
    ],
    starterCode: `# Write your comment here
print("Alice")`,
    testCases: [
      { label: 'Prints Alice', input_code: '', expected_output: 'Alice' },
    ],
  },

  // ── Variables ────────────────────────────────────────────────────────────
  {
    id: 'variables-store',
    title: 'Store and Print a Variable',
    topic: 'Variables',
    difficulty: 'Easy',
    tags: ['Variables'],
    description: `Variables are containers for storing values.\n\nWrite a function **store_value()** that:\n1. Creates a variable called \`city\` and assigns it the value \`"Paris"\`\n2. Prints the variable`,
    hint: 'city = "Paris" then print(city)',
    examples: [
      { input: '(no input)', output: 'Paris' },
    ],
    starterCode: `def store_value():
    city = "Paris"
    print(city)

store_value()`,
    testCases: [
      { label: 'Prints Paris', input_code: '', expected_output: 'Paris' },
    ],
  },

  {
    id: 'variables-multiple',
    title: 'Assign Multiple Variables',
    topic: 'Variables',
    difficulty: 'Easy',
    tags: ['Variables'],
    description: `Python lets you assign values to multiple variables in one line.\n\nWrite a function **multi_vars()** that assigns:\n- \`x = 1\`\n- \`y = 2\`\n- \`z = 3\`\n\nThen print them all on one line separated by spaces.`,
    hint: 'print(x, y, z) prints them separated by spaces automatically.',
    examples: [
      { input: '(no input)', output: '1 2 3' },
    ],
    starterCode: `def multi_vars():
    x = 1
    y = 2
    z = 3
    print(x, y, z)

multi_vars()`,
    testCases: [
      { label: 'Prints 1 2 3', input_code: '', expected_output: '1 2 3' },
    ],
  },

  // ── Data Types ───────────────────────────────────────────────────────────
  {
    id: 'datatypes-check',
    title: 'Check the Data Type',
    topic: 'Data Types',
    difficulty: 'Easy',
    tags: ['Data Types', 'type()'],
    description: `Python has many built-in data types. You can check the type of any variable using **type()**.\n\nWrite a function **check_types()** that prints the type of each of these values:\n- \`42\` → should print \`<class 'int'>\`\n- \`3.14\` → should print \`<class 'float'>\`\n- \`"hello"\` → should print \`<class 'str'>\``,
    hint: 'print(type(42)) prints the type of the number 42.',
    examples: [
      { input: '(no input)', output: "<class 'int'>\n<class 'float'>\n<class 'str'>" },
    ],
    starterCode: `def check_types():
    print(type(42))
    print(type(3.14))
    print(type("hello"))

check_types()`,
    testCases: [
      { label: 'Correct types', input_code: '', expected_output: "<class 'int'>\n<class 'float'>\n<class 'str'>" },
    ],
  },

  // ── Numbers ──────────────────────────────────────────────────────────────
  {
    id: 'numbers-arithmetic',
    title: 'Basic Arithmetic',
    topic: 'Numbers',
    difficulty: 'Easy',
    tags: ['Numbers', 'Operators'],
    description: `Write a function **calc(a, b)** that prints the result of:\n- \`a + b\`\n- \`a - b\`\n- \`a * b\`\n- \`a // b\` (integer division)\n\nEach result on a new line.`,
    hint: 'Use print() four times, once for each operation.',
    examples: [
      { input: 'a = 10, b = 3', output: '13\n7\n30\n3' },
    ],
    starterCode: `def calc(a, b):
    print(a + b)
    print(a - b)
    print(a * b)
    print(a // b)

calc(a, b)`,
    testCases: [
      { label: 'a=10, b=3', input_code: 'a = 10\nb = 3', expected_output: '13\n7\n30\n3' },
      { label: 'a=8, b=2',  input_code: 'a = 8\nb = 2',  expected_output: '10\n6\n16\n4' },
      { label: 'a=7, b=2',  input_code: 'a = 7\nb = 2',  expected_output: '9\n5\n14\n3' },
    ],
  },

  // ── Casting ──────────────────────────────────────────────────────────────
  {
    id: 'casting-convert',
    title: 'Type Casting',
    topic: 'Casting',
    difficulty: 'Easy',
    tags: ['Casting', 'int()', 'str()', 'float()'],
    description: `Sometimes you need to convert a value from one type to another. This is called **casting**.\n\nWrite a function **convert(s)** that:\n1. Converts the string \`s\` to an integer\n2. Multiplies it by 2\n3. Prints the result`,
    hint: 'Use int(s) to convert a string to an integer.',
    examples: [
      { input: 's = "5"', output: '10' },
      { input: 's = "3"', output: '6' },
    ],
    starterCode: `def convert(s):
    number = int(s)
    print(number * 2)

convert(s)`,
    testCases: [
      { label: 's="5"', input_code: 's = "5"', expected_output: '10' },
      { label: 's="3"', input_code: 's = "3"', expected_output: '6'  },
      { label: 's="7"', input_code: 's = "7"', expected_output: '14' },
    ],
  },

  // ── Strings ──────────────────────────────────────────────────────────────
  {
    id: 'strings-length',
    title: 'String Length',
    topic: 'Strings',
    difficulty: 'Easy',
    tags: ['Strings', 'len()'],
    description: `Write a function **string_length(s)** that prints the number of characters in the string \`s\` using **len()**.`,
    hint: 'len("hello") returns 5.',
    examples: [
      { input: 's = "hello"',   output: '5' },
      { input: 's = "Python"',  output: '6' },
    ],
    starterCode: `def string_length(s):
    print(len(s))

string_length(s)`,
    testCases: [
      { label: '"hello"',   input_code: 's = "hello"',   expected_output: '5' },
      { label: '"Python"',  input_code: 's = "Python"',  expected_output: '6' },
      { label: '"cat"',     input_code: 's = "cat"',     expected_output: '3' },
    ],
  },

  {
    id: 'strings-upper-lower',
    title: 'Upper and Lower Case',
    topic: 'Strings',
    difficulty: 'Easy',
    tags: ['Strings', 'upper()', 'lower()'],
    description: `Write a function **shout_and_whisper(s)** that prints the string \`s\` in:\n1. ALL UPPERCASE (using \`.upper()\`)\n2. all lowercase (using \`.lower()\`)`,
    hint: '"hello".upper() gives "HELLO".',
    examples: [
      { input: 's = "Hello"', output: 'HELLO\nhello' },
    ],
    starterCode: `def shout_and_whisper(s):
    print(s.upper())
    print(s.lower())

shout_and_whisper(s)`,
    testCases: [
      { label: '"Hello"',   input_code: 's = "Hello"',   expected_output: 'HELLO\nhello'   },
      { label: '"Python"',  input_code: 's = "Python"',  expected_output: 'PYTHON\npython'  },
      { label: '"World"',   input_code: 's = "World"',   expected_output: 'WORLD\nworld'    },
    ],
  },

  {
    id: 'strings-replace',
    title: 'Replace in a String',
    topic: 'Strings',
    difficulty: 'Easy',
    tags: ['Strings', 'replace()'],
    description: `Write a function **swap_word(s)** that takes a string \`s\` and replaces every occurrence of \`"cat"\` with \`"dog"\`, then prints the result.\n\nUse the **.replace()** method.`,
    hint: '"I love cat".replace("cat", "dog") gives "I love dog".',
    examples: [
      { input: 's = "I love cat"',        output: 'I love dog'        },
      { input: 's = "cat and cat"',       output: 'dog and dog'       },
    ],
    starterCode: `def swap_word(s):
    print(s.replace("cat", "dog"))

swap_word(s)`,
    testCases: [
      { label: 'one cat',  input_code: 's = "I love cat"',   expected_output: 'I love dog'   },
      { label: 'two cats', input_code: 's = "cat and cat"',  expected_output: 'dog and dog'  },
      { label: 'no cat',   input_code: 's = "I love fish"',  expected_output: 'I love fish'  },
    ],
  },

  {
    id: 'strings-slice',
    title: 'Slice a String',
    topic: 'Strings',
    difficulty: 'Easy',
    tags: ['Strings', 'Slicing'],
    description: `You can extract part of a string using **slicing**: \`s[start:end]\`.\n\nWrite a function **first_three(s)** that prints only the **first 3 characters** of the string \`s\`.`,
    hint: 's[0:3] gives the first 3 characters.',
    examples: [
      { input: 's = "Python"', output: 'Pyt' },
      { input: 's = "Hello"',  output: 'Hel' },
    ],
    starterCode: `def first_three(s):
    print(s[0:3])

first_three(s)`,
    testCases: [
      { label: '"Python"', input_code: 's = "Python"', expected_output: 'Pyt' },
      { label: '"Hello"',  input_code: 's = "Hello"',  expected_output: 'Hel' },
      { label: '"Banana"', input_code: 's = "Banana"', expected_output: 'Ban' },
    ],
  },

  // ── Booleans ─────────────────────────────────────────────────────────────
  {
    id: 'booleans-compare',
    title: 'Compare Two Numbers',
    topic: 'Booleans',
    difficulty: 'Easy',
    tags: ['Booleans', 'Comparison'],
    description: `Write a function **is_bigger(a, b)** that prints **True** if \`a\` is greater than \`b\`, and **False** otherwise.`,
    hint: 'print(a > b) directly prints True or False.',
    examples: [
      { input: 'a=5, b=3', output: 'True'  },
      { input: 'a=2, b=8', output: 'False' },
    ],
    starterCode: `def is_bigger(a, b):
    print(a > b)

is_bigger(a, b)`,
    testCases: [
      { label: '5 > 3',  input_code: 'a = 5\nb = 3', expected_output: 'True'  },
      { label: '2 > 8',  input_code: 'a = 2\nb = 8', expected_output: 'False' },
      { label: '7 > 7',  input_code: 'a = 7\nb = 7', expected_output: 'False' },
    ],
  },

  // ── Operators ────────────────────────────────────────────────────────────
  {
    id: 'operators-modulo',
    title: 'Even or Odd?',
    topic: 'Operators',
    difficulty: 'Easy',
    tags: ['Operators', 'Modulo'],
    description: `The **modulo operator** \`%\` gives the remainder of a division.\n\nWrite a function **even_odd(n)** that prints \`"even"\` if \`n\` is divisible by 2, and \`"odd"\` otherwise.`,
    hint: 'If n % 2 == 0, the number is even.',
    examples: [
      { input: 'n = 4', output: 'even' },
      { input: 'n = 7', output: 'odd'  },
    ],
    starterCode: `def even_odd(n):
    if n % 2 == 0:
        print("even")
    else:
        print("odd")

even_odd(n)`,
    testCases: [
      { label: 'n=4',  input_code: 'n = 4',  expected_output: 'even' },
      { label: 'n=7',  input_code: 'n = 7',  expected_output: 'odd'  },
      { label: 'n=10', input_code: 'n = 10', expected_output: 'even' },
    ],
  },

  // ── If...Else ────────────────────────────────────────────────────────────
  {
    id: 'if-else-grade',
    title: 'Pass or Fail',
    topic: 'If...Else',
    difficulty: 'Easy',
    tags: ['If...Else'],
    description: `Write a function **pass_fail(score)** that:\n- Prints \`"Pass"\` if the score is **50 or above**\n- Prints \`"Fail"\` if the score is **below 50**`,
    hint: 'Use if score >= 50: ... else: ...',
    examples: [
      { input: 'score = 75', output: 'Pass' },
      { input: 'score = 40', output: 'Fail' },
    ],
    starterCode: `def pass_fail(score):
    if score >= 50:
        print("Pass")
    else:
        print("Fail")

pass_fail(score)`,
    testCases: [
      { label: 'score=75', input_code: 'score = 75', expected_output: 'Pass' },
      { label: 'score=40', input_code: 'score = 40', expected_output: 'Fail' },
      { label: 'score=50', input_code: 'score = 50', expected_output: 'Pass' },
    ],
  },

  {
    id: 'if-elif-grade',
    title: 'Letter Grade',
    topic: 'If...Else',
    difficulty: 'Easy',
    tags: ['If...Else', 'elif'],
    description: `Write a function **letter_grade(score)** that prints the grade letter:\n- **A** if score >= 90\n- **B** if score >= 80\n- **C** if score >= 70\n- **F** otherwise`,
    hint: 'Use if / elif / elif / else in that order.',
    examples: [
      { input: 'score = 95', output: 'A' },
      { input: 'score = 82', output: 'B' },
      { input: 'score = 55', output: 'F' },
    ],
    starterCode: `def letter_grade(score):
    if score >= 90:
        print("A")
    elif score >= 80:
        print("B")
    elif score >= 70:
        print("C")
    else:
        print("F")

letter_grade(score)`,
    testCases: [
      { label: 'score=95', input_code: 'score = 95', expected_output: 'A' },
      { label: 'score=82', input_code: 'score = 82', expected_output: 'B' },
      { label: 'score=55', input_code: 'score = 55', expected_output: 'F' },
    ],
  },

  // ── While Loops ──────────────────────────────────────────────────────────
  {
    id: 'while-count',
    title: 'Count to N',
    topic: 'While Loops',
    difficulty: 'Easy',
    tags: ['While Loops'],
    description: `Write a function **count_up(n)** that prints every number from **1 to n** (inclusive), one per line, using a **while loop**.`,
    hint: 'Start with i = 1, loop while i <= n, print i, then i = i + 1.',
    examples: [
      { input: 'n = 3', output: '1\n2\n3' },
      { input: 'n = 5', output: '1\n2\n3\n4\n5' },
    ],
    starterCode: `def count_up(n):
    i = 1
    while i <= n:
        print(i)
        i = i + 1

count_up(n)`,
    testCases: [
      { label: 'n=3', input_code: 'n = 3', expected_output: '1\n2\n3'         },
      { label: 'n=5', input_code: 'n = 5', expected_output: '1\n2\n3\n4\n5'   },
      { label: 'n=1', input_code: 'n = 1', expected_output: '1'               },
    ],
  },

  // ── For Loops ────────────────────────────────────────────────────────────
  {
    id: 'for-loop-sum',
    title: 'Sum of a List',
    topic: 'For Loops',
    difficulty: 'Easy',
    tags: ['For Loops', 'Lists'],
    description: `Write a function **list_sum(numbers)** that uses a **for loop** to add up all numbers in the list and prints the total.`,
    hint: 'Start total = 0, then for n in numbers: total = total + n',
    examples: [
      { input: 'numbers = [1, 2, 3, 4]', output: '10' },
      { input: 'numbers = [5, 5, 5]',    output: '15' },
    ],
    starterCode: `def list_sum(numbers):
    total = 0
    for n in numbers:
        total = total + n
    print(total)

list_sum(numbers)`,
    testCases: [
      { label: '[1,2,3,4]', input_code: 'numbers = [1, 2, 3, 4]', expected_output: '10' },
      { label: '[5,5,5]',   input_code: 'numbers = [5, 5, 5]',    expected_output: '15' },
      { label: '[10,20]',   input_code: 'numbers = [10, 20]',     expected_output: '30' },
    ],
  },

  {
    id: 'for-range',
    title: 'Multiply with range()',
    topic: 'For Loops',
    difficulty: 'Easy',
    tags: ['For Loops', 'range()'],
    description: `Write a function **times_table(n)** that prints the **multiplication table** for \`n\` from 1 to 5.\n\nEach line should look like: \`n x i = result\``,
    hint: 'Use for i in range(1, 6): print(n, "x", i, "=", n*i)',
    examples: [
      { input: 'n = 3', output: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15' },
    ],
    starterCode: `def times_table(n):
    for i in range(1, 6):
        print(n, "x", i, "=", n * i)

times_table(n)`,
    testCases: [
      { label: 'n=3', input_code: 'n = 3', expected_output: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15' },
      { label: 'n=2', input_code: 'n = 2', expected_output: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10' },
    ],
  },

  // ── Lists ────────────────────────────────────────────────────────────────
  {
    id: 'lists-append',
    title: 'Add Items to a List',
    topic: 'Lists',
    difficulty: 'Easy',
    tags: ['Lists', 'append()'],
    description: `Write a function **grow_list()** that:\n1. Starts with an empty list \`items = []\`\n2. Appends \`"apple"\`, \`"banana"\`, \`"cherry"\` one by one\n3. Prints the final list`,
    hint: 'Use items.append("apple") three times, then print(items).',
    examples: [
      { input: '(no input)', output: "['apple', 'banana', 'cherry']" },
    ],
    starterCode: `def grow_list():
    items = []
    items.append("apple")
    items.append("banana")
    items.append("cherry")
    print(items)

grow_list()`,
    testCases: [
      { label: 'three fruits', input_code: '', expected_output: "['apple', 'banana', 'cherry']" },
    ],
  },

  {
    id: 'lists-index',
    title: 'Access List Items',
    topic: 'Lists',
    difficulty: 'Easy',
    tags: ['Lists', 'Indexing'],
    description: `Write a function **get_items(fruits)** that prints:\n1. The **first** item (index 0)\n2. The **last** item (index -1)`,
    hint: 'fruits[0] is first, fruits[-1] is last.',
    examples: [
      { input: 'fruits = ["apple", "banana", "cherry"]', output: 'apple\ncherry' },
    ],
    starterCode: `def get_items(fruits):
    print(fruits[0])
    print(fruits[-1])

get_items(fruits)`,
    testCases: [
      { label: '3 fruits', input_code: 'fruits = ["apple", "banana", "cherry"]', expected_output: 'apple\ncherry'  },
      { label: '2 fruits', input_code: 'fruits = ["mango", "grape"]',            expected_output: 'mango\ngrape'   },
    ],
  },

  // ── Tuples ───────────────────────────────────────────────────────────────
  {
    id: 'tuples-access',
    title: 'Access Tuple Items',
    topic: 'Tuples',
    difficulty: 'Easy',
    tags: ['Tuples'],
    description: `Tuples are like lists but **cannot be changed** after creation. They use **()** instead of **[]**.\n\nWrite a function **tuple_info(t)** that prints:\n1. The length of the tuple\n2. The first item`,
    hint: 'Use len(t) and t[0].',
    examples: [
      { input: 't = (10, 20, 30)', output: '3\n10' },
    ],
    starterCode: `def tuple_info(t):
    print(len(t))
    print(t[0])

tuple_info(t)`,
    testCases: [
      { label: '(10,20,30)', input_code: 't = (10, 20, 30)',   expected_output: '3\n10' },
      { label: '("a","b")',  input_code: 't = ("a", "b")',     expected_output: '2\na'  },
    ],
  },

  // ── Sets ─────────────────────────────────────────────────────────────────
  {
    id: 'sets-unique',
    title: 'Remove Duplicates with a Set',
    topic: 'Sets',
    difficulty: 'Easy',
    tags: ['Sets'],
    description: `A **set** automatically removes duplicate values.\n\nWrite a function **unique_count(items)** that:\n1. Converts the list \`items\` to a set\n2. Prints how many **unique** items there are`,
    hint: 'len(set(items)) gives the number of unique items.',
    examples: [
      { input: 'items = [1, 2, 2, 3, 3, 3]', output: '3' },
      { input: 'items = [5, 5, 5]',           output: '1' },
    ],
    starterCode: `def unique_count(items):
    print(len(set(items)))

unique_count(items)`,
    testCases: [
      { label: '[1,2,2,3,3,3]', input_code: 'items = [1, 2, 2, 3, 3, 3]', expected_output: '3' },
      { label: '[5,5,5]',       input_code: 'items = [5, 5, 5]',           expected_output: '1' },
      { label: '[1,2,3]',       input_code: 'items = [1, 2, 3]',           expected_output: '3' },
    ],
  },

  // ── Dictionaries ─────────────────────────────────────────────────────────
  {
    id: 'dict-access',
    title: 'Get a Dictionary Value',
    topic: 'Dictionaries',
    difficulty: 'Easy',
    tags: ['Dictionaries'],
    description: `A **dictionary** stores key-value pairs. You access values by their key.\n\nWrite a function **get_age(person)** that prints the value stored under the key \`"age"\` in the dictionary \`person\`.`,
    hint: 'person["age"] gets the value for the key "age".',
    examples: [
      { input: 'person = {"name": "Alice", "age": 25}', output: '25' },
    ],
    starterCode: `def get_age(person):
    print(person["age"])

get_age(person)`,
    testCases: [
      { label: 'age=25', input_code: 'person = {"name": "Alice", "age": 25}', expected_output: '25' },
      { label: 'age=30', input_code: 'person = {"name": "Bob",   "age": 30}', expected_output: '30' },
    ],
  },

  {
    id: 'dict-loop',
    title: 'Loop Through a Dictionary',
    topic: 'Dictionaries',
    difficulty: 'Easy',
    tags: ['Dictionaries', 'For Loops'],
    description: `Write a function **print_keys(d)** that prints all the **keys** of dictionary \`d\`, one per line.\n\nUse a **for loop**.`,
    hint: 'for key in d: print(key)',
    examples: [
      { input: 'd = {"a": 1, "b": 2, "c": 3}', output: 'a\nb\nc' },
    ],
    starterCode: `def print_keys(d):
    for key in d:
        print(key)

print_keys(d)`,
    testCases: [
      { label: '3 keys', input_code: 'd = {"a": 1, "b": 2, "c": 3}', expected_output: 'a\nb\nc' },
      { label: '2 keys', input_code: 'd = {"x": 10, "y": 20}',        expected_output: 'x\ny'   },
    ],
  },

  // ── Functions ────────────────────────────────────────────────────────────
  {
    id: 'functions-greet',
    title: 'Write Your First Function',
    topic: 'Functions',
    difficulty: 'Easy',
    tags: ['Functions'],
    description: `Write a function **greet(name)** that prints \`"Hello, "\` followed by the name.\n\nFor example: \`greet("Alice")\` prints \`Hello, Alice\``,
    hint: 'print("Hello, " + name)',
    examples: [
      { input: 'name = "Alice"', output: 'Hello, Alice' },
      { input: 'name = "Bob"',   output: 'Hello, Bob'   },
    ],
    starterCode: `def greet(name):
    print("Hello, " + name)

greet(name)`,
    testCases: [
      { label: '"Alice"', input_code: 'name = "Alice"', expected_output: 'Hello, Alice' },
      { label: '"Bob"',   input_code: 'name = "Bob"',   expected_output: 'Hello, Bob'   },
      { label: '"Sam"',   input_code: 'name = "Sam"',   expected_output: 'Hello, Sam'   },
    ],
  },

  {
    id: 'functions-return',
    title: 'Return a Value',
    topic: 'Functions',
    difficulty: 'Easy',
    tags: ['Functions', 'Return'],
    description: `Write a function **add(a, b)** that **returns** the sum of \`a\` and \`b\`.\n\nThen print the result of calling \`add(a, b)\`.`,
    hint: 'Use return a + b inside the function, then print(add(a, b)).',
    examples: [
      { input: 'a=3, b=4', output: '7'  },
      { input: 'a=10, b=5', output: '15' },
    ],
    starterCode: `def add(a, b):
    return a + b

print(add(a, b))`,
    testCases: [
      { label: '3+4',  input_code: 'a = 3\nb = 4',   expected_output: '7'  },
      { label: '10+5', input_code: 'a = 10\nb = 5',  expected_output: '15' },
      { label: '0+0',  input_code: 'a = 0\nb = 0',   expected_output: '0'  },
    ],
  },

  {
    id: 'functions-default',
    title: 'Default Parameter Value',
    topic: 'Functions',
    difficulty: 'Easy',
    tags: ['Functions', 'Default Parameters'],
    description: `You can give a function parameter a **default value**. If the caller doesn't pass that argument, the default is used.\n\nWrite a function **greet(name="World")** that prints \`"Hello, "\` + name.\n\nCall it twice:\n1. \`greet()\` → uses default\n2. \`greet("Alice")\``,
    hint: 'def greet(name="World"): print("Hello, " + name)',
    examples: [
      { input: '(no input)', output: 'Hello, World\nHello, Alice' },
    ],
    starterCode: `def greet(name="World"):
    print("Hello, " + name)

greet()
greet("Alice")`,
    testCases: [
      { label: 'default + Alice', input_code: '', expected_output: 'Hello, World\nHello, Alice' },
    ],
  },

  // ── Lambda ───────────────────────────────────────────────────────────────
  {
    id: 'lambda-double',
    title: 'Lambda Function',
    topic: 'Lambda',
    difficulty: 'Easy',
    tags: ['Lambda'],
    description: `A **lambda** is a small anonymous function written in one line.\n\nWrite a lambda function called \`double\` that takes a number and returns it multiplied by 2.\n\nThen print \`double(n)\`.`,
    hint: 'double = lambda x: x * 2',
    examples: [
      { input: 'n = 5',  output: '10' },
      { input: 'n = 7',  output: '14' },
    ],
    starterCode: `double = lambda x: x * 2

print(double(n))`,
    testCases: [
      { label: 'n=5', input_code: 'n = 5', expected_output: '10' },
      { label: 'n=7', input_code: 'n = 7', expected_output: '14' },
      { label: 'n=3', input_code: 'n = 3', expected_output: '6'  },
    ],
  },

  // ── Classes ──────────────────────────────────────────────────────────────
  {
    id: 'classes-basic',
    title: 'Create a Class',
    topic: 'Classes/Objects',
    difficulty: 'Easy',
    tags: ['Classes', 'Objects'],
    description: `A **class** is a blueprint for creating objects.\n\nCreate a class **Dog** with:\n- An \`__init__\` method that takes \`name\` and \`age\`\n- A method \`describe()\` that prints: \`"Name: {name}, Age: {age}"\`\n\nThen create a Dog with name=\`"Rex"\` and age=\`3\` and call \`describe()\`.`,
    hint: 'Inside __init__, use self.name = name and self.age = age.',
    examples: [
      { input: '(no input)', output: 'Name: Rex, Age: 3' },
    ],
    starterCode: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def describe(self):
        print("Name: " + self.name + ", Age: " + str(self.age))

d = Dog("Rex", 3)
d.describe()`,
    testCases: [
      { label: 'Rex age 3', input_code: '', expected_output: 'Name: Rex, Age: 3' },
    ],
  },

  // ── Inheritance ──────────────────────────────────────────────────────────
  {
    id: 'inheritance-basic',
    title: 'Simple Inheritance',
    topic: 'Inheritance',
    difficulty: 'Easy',
    tags: ['Inheritance', 'Classes'],
    description: `**Inheritance** lets a class reuse code from another class.\n\nYou are given a \`Animal\` class with a method \`speak()\` that prints \`"..."\`.\n\nCreate a class **Cat** that inherits from \`Animal\` and **overrides** \`speak()\` to print \`"Meow"\`.`,
    hint: 'class Cat(Animal): then def speak(self): print("Meow")',
    examples: [
      { input: '(no input)', output: 'Meow' },
    ],
    starterCode: `class Animal:
    def speak(self):
        print("...")

class Cat(Animal):
    def speak(self):
        print("Meow")

c = Cat()
c.speak()`,
    testCases: [
      { label: 'Cat says Meow', input_code: '', expected_output: 'Meow' },
    ],
  },

  // ── String Formatting ────────────────────────────────────────────────────
  {
    id: 'fstring-basic',
    title: 'f-String Formatting',
    topic: 'String Formatting',
    difficulty: 'Easy',
    tags: ['Strings', 'f-strings'],
    description: `**f-strings** let you embed variables directly inside strings.\n\nWrite a function **introduce(name, age)** that uses an f-string to print:\n\`"My name is {name} and I am {age} years old."\``,
    hint: 'print(f"My name is {name} and I am {age} years old.")',
    examples: [
      { input: 'name="Alice", age=25', output: 'My name is Alice and I am 25 years old.' },
    ],
    starterCode: `def introduce(name, age):
    print(f"My name is {name} and I am {age} years old.")

introduce(name, age)`,
    testCases: [
      { label: 'Alice 25', input_code: 'name = "Alice"\nage = 25', expected_output: 'My name is Alice and I am 25 years old.' },
      { label: 'Bob 30',   input_code: 'name = "Bob"\nage = 30',   expected_output: 'My name is Bob and I am 30 years old.'   },
    ],
  },

  // ── List Comprehension ───────────────────────────────────────────────────
  {
    id: 'list-comp-squares',
    title: 'List Comprehension',
    topic: 'List Comprehension',
    difficulty: 'Easy',
    tags: ['List Comprehension'],
    description: `**List comprehension** is a short way to create a new list.\n\nWrite a function **squares(n)** that uses list comprehension to create a list of squares from 1 to \`n\` (inclusive) and prints it.`,
    hint: '[x*x for x in range(1, n+1)]',
    examples: [
      { input: 'n = 4', output: '[1, 4, 9, 16]' },
      { input: 'n = 3', output: '[1, 4, 9]'     },
    ],
    starterCode: `def squares(n):
    result = [x * x for x in range(1, n + 1)]
    print(result)

squares(n)`,
    testCases: [
      { label: 'n=4', input_code: 'n = 4', expected_output: '[1, 4, 9, 16]'      },
      { label: 'n=3', input_code: 'n = 3', expected_output: '[1, 4, 9]'          },
      { label: 'n=5', input_code: 'n = 5', expected_output: '[1, 4, 9, 16, 25]'  },
    ],
  },

]

export const DEFAULT_PROBLEM = PROBLEMS[0]

// Group problems by topic for the sidebar
export const TOPICS = [...new Set(PROBLEMS.map(p => p.topic))]

export function getProblemsByTopic(topic: string) {
  return PROBLEMS.filter(p => p.topic === topic)
}
