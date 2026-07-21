const challenges = [
  {
    day: 1,
    title: 'Hello World',
    difficulty: 'Easy',
    problem: 'Write a program that prints "Hello, World!" to the screen.',
    exampleInput: '',
    exampleOutput: 'Hello, World!',
    hint: 'Use the print() function with a string inside quotes.',
    concepts: ['print', 'strings']
  },
  {
    day: 2,
    title: 'Variable Swap',
    difficulty: 'Easy',
    problem: 'Given two variables a = 5 and b = 10, swap their values without using a third variable.',
    exampleInput: 'a = 5\nb = 10',
    exampleOutput: 'a = 10\nb = 5',
    hint: 'Python allows tuple unpacking: a, b = b, a',
    concepts: ['variables', 'assignment']
  },
  {
    day: 3,
    title: 'Even or Odd',
    difficulty: 'Easy',
    problem: 'Write a function that takes a number and prints "Even" if it is even, or "Odd" if it is odd.',
    exampleInput: 'check_number(7)',
    exampleOutput: 'Odd',
    hint: 'Use the modulo operator % to check divisibility by 2.',
    concepts: ['conditionals', 'modulo']
  },
  {
    day: 4,
    title: 'Sum of Numbers',
    difficulty: 'Easy',
    problem: 'Write a function that returns the sum of all numbers from 1 to n.',
    exampleInput: 'sum_upto(5)',
    exampleOutput: '15',
    hint: 'Use a loop or the formula n * (n + 1) // 2.',
    concepts: ['loops', 'arithmetic']
  },
  {
    day: 5,
    title: 'Reverse a String',
    difficulty: 'Easy',
    problem: 'Write a function that reverses a given string.',
    exampleInput: 'reverse_string("hello")',
    exampleOutput: 'olleh',
    hint: 'Python strings support slicing: string[::-1] reverses a string.',
    concepts: ['strings', 'slicing']
  },
  {
    day: 6,
    title: 'Find Maximum',
    difficulty: 'Easy',
    problem: 'Write a function that finds the maximum value in a list of numbers without using the max() function.',
    exampleInput: 'find_max([3, 7, 2, 9, 4])',
    exampleOutput: '9',
    hint: 'Start by assuming the first element is the largest, then compare each remaining element.',
    concepts: ['loops', 'comparisons']
  },
  {
    day: 7,
    title: 'Count Vowels',
    difficulty: 'Easy',
    problem: 'Write a function that counts the number of vowels (a, e, i, o, u) in a string.',
    exampleInput: 'count_vowels("programming")',
    exampleOutput: '3',
    hint: 'Loop through each character and check if it is in the set of vowels.',
    concepts: ['strings', 'loops', 'counting']
  },
  {
    day: 8,
    title: 'FizzBuzz',
    difficulty: 'Medium',
    problem: 'Print numbers from 1 to 30. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
    exampleInput: '',
    exampleOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n...',
    hint: 'Use the modulo operator. Check divisibility by both 15 first, then by 3, then by 5.',
    concepts: ['loops', 'conditionals', 'modulo']
  },
  {
    day: 9,
    title: 'List Comprehension Squares',
    difficulty: 'Medium',
    problem: 'Using a list comprehension, create a list of squares of numbers from 1 to 10.',
    exampleInput: '',
    exampleOutput: '[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]',
    hint: 'List comprehension syntax: [expression for item in range]',
    concepts: ['lists', 'list comprehensions']
  },
  {
    day: 10,
    title: 'Palindrome Check',
    difficulty: 'Medium',
    problem: 'Write a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
    exampleInput: 'is_palindrome("racecar")',
    exampleOutput: 'True',
    hint: 'Compare the string with its reverse. Ignore case and spaces.',
    concepts: ['strings', 'comparisons']
  },
  {
    day: 11,
    title: 'Temperature Converter',
    difficulty: 'Easy',
    problem: 'Write functions to convert Celsius to Fahrenheit and back. Formula: F = C * 9/5 + 32',
    exampleInput: 'c_to_f(100)',
    exampleOutput: '212.0',
    hint: 'Create two functions, one for each direction of conversion.',
    concepts: ['functions', 'arithmetic']
  },
  {
    day: 12,
    title: 'Factorial',
    difficulty: 'Medium',
    problem: 'Write a function that calculates the factorial of a number (n! = n * (n-1) * ... * 1).',
    exampleInput: 'factorial(5)',
    exampleOutput: '120',
    hint: 'Use a loop starting from 1, multiplying at each step. Factorial of 0 is 1.',
    concepts: ['loops', 'functions', 'arithmetic']
  },
  {
    day: 13,
    title: 'Dictionary Word Counter',
    difficulty: 'Medium',
    problem: 'Write a function that takes a sentence and returns a dictionary with each word as key and its count as value.',
    exampleInput: 'word_count("the cat and the dog")',
    exampleOutput: "{'the': 2, 'cat': 1, 'and': 1, 'dog': 1}",
    hint: 'Split the sentence into words, then loop through and count using a dictionary.',
    concepts: ['dictionaries', 'strings', 'counting']
  },
  {
    day: 14,
    title: 'Prime Numbers',
    difficulty: 'Medium',
    problem: 'Write a function that returns all prime numbers up to n.',
    exampleInput: 'primes_up_to(20)',
    exampleOutput: '[2, 3, 5, 7, 11, 13, 17, 19]',
    hint: 'A number is prime if it is only divisible by 1 and itself. Check divisibility up to the square root.',
    concepts: ['loops', 'conditionals', 'modulo']
  },
  {
    day: 15,
    title: 'Matrix Transpose',
    difficulty: 'Medium',
    problem: 'Write a function that transposes a 2D matrix (swaps rows and columns).',
    exampleInput: 'transpose([[1,2,3],[4,5,6]])',
    exampleOutput: '[[1,4],[2,5],[3,6]]',
    hint: 'Use zip() to pair elements from each row, then convert tuples to lists.',
    concepts: ['lists', 'list comprehensions', 'zip']
  },
  {
    day: 16,
    title: 'Caesar Cipher',
    difficulty: 'Medium',
    problem: 'Implement a Caesar cipher that shifts each letter in a string by a given number of positions.',
    exampleInput: 'caesar("hello", 3)',
    exampleOutput: 'khoor',
    hint: 'Use ord() to get character codes and chr() to convert back. Handle wrapping from z to a.',
    concepts: ['strings', 'loops', 'modulo']
  },
  {
    day: 17,
    title: 'Flatten Nested Lists',
    difficulty: 'Medium',
    problem: 'Write a function that flattens a nested list into a single list.',
    exampleInput: 'flatten([[1,2],[3,[4,5]],6])',
    exampleOutput: '[1, 2, 3, 4, 5, 6]',
    hint: 'Use recursion: if an item is a list, flatten it; otherwise, add it to the result.',
    concepts: ['recursion', 'lists']
  },
  {
    day: 18,
    title: 'Merge Sorted Lists',
    difficulty: 'Medium',
    problem: 'Write a function that merges two sorted lists into one sorted list without using sort().',
    exampleInput: 'merge_sorted([1,3,5], [2,4,6])',
    exampleOutput: '[1, 2, 3, 4, 5, 6]',
    hint: 'Use two pointers, one for each list. Compare elements and append the smaller one.',
    concepts: ['lists', 'comparisons', 'pointers']
  },
  {
    day: 19,
    title: 'File Word Frequency',
    difficulty: 'Medium',
    problem: 'Write a function that reads text and returns the 5 most frequent words.',
    exampleInput: 'top_words("the cat sat on the mat the cat")',
    exampleOutput: "[('the', 3), ('cat', 2), ('sat', 1), ('on', 1), ('mat', 1)]",
    hint: 'Count words in a dictionary, then sort by value in descending order.',
    concepts: ['dictionaries', 'sorting', 'strings']
  },
  {
    day: 20,
    title: 'Binary Search',
    difficulty: 'Hard',
    problem: 'Implement binary search that finds the index of a target in a sorted list.',
    exampleInput: 'binary_search([1,3,5,7,9,11], 7)',
    exampleOutput: '3',
    hint: 'Compare the target with the middle element. If smaller, search the left half; if larger, search the right half.',
    concepts: ['algorithms', 'divde and conquer']
  },
  {
    day: 21,
    title: 'Linked List',
    difficulty: 'Hard',
    problem: 'Implement a singly linked list with append, prepend, and display operations.',
    exampleInput: 'll = LinkedList(); ll.append(1); ll.append(2); ll.prepend(0); ll.display()',
    exampleOutput: '0 -> 1 -> 2 -> None',
    hint: 'Create a Node class with value and next attributes. The LinkedList class manages the head.',
    concepts: ['classes', 'data structures', 'pointers']
  },
  {
    day: 22,
    title: 'Decorators',
    difficulty: 'Hard',
    problem: 'Write a decorator that logs the execution time of a function.',
    exampleInput: '@timer\ndef slow():\n    time.sleep(1)\nslow()',
    exampleOutput: 'slow took 1.0012 seconds',
    hint: 'A decorator is a function that takes a function and returns a new function. Use time.time() to measure.',
    concepts: ['decorators', 'functions', 'time']
  },
  {
    day: 23,
    title: 'Generators',
    difficulty: 'Hard',
    problem: 'Implement a generator that yields Fibonacci numbers indefinitely.',
    exampleInput: 'fib = fibonacci(); next(fib); next(fib); next(fib)',
    exampleOutput: '0, 1, 1',
    hint: 'Use "yield" instead of "return". Keep track of the last two values and yield their sum.',
    concepts: ['generators', 'yield', 'iterators']
  },
  {
    day: 24,
    title: 'Context Manager',
    difficulty: 'Hard',
    problem: 'Create a custom context manager that times a block of code.',
    exampleInput: 'with Timer("block"):\n    sum(range(1000000))',
    exampleOutput: 'block took 0.045 seconds',
    hint: 'Implement __enter__ and __exit__ methods in a class, or use the contextlib decorator.',
    concepts: ['context managers', 'classes', 'with statement']
  },
  {
    day: 25,
    title: 'Web Scraper',
    difficulty: 'Hard',
    problem: 'Write a function that fetches a webpage and extracts all links using only standard libraries.',
    exampleInput: 'get_links("https://example.com")',
    exampleOutput: "['/about', '/contact', '/products']",
    hint: 'Use urllib.request to fetch the page, then parse the HTML with string methods or regex.',
    concepts: ['urllib', 'string parsing', 'web']
  },
  {
    day: 26,
    title: 'Threading Basics',
    difficulty: 'Hard',
    problem: 'Write a program that downloads 3 URLs concurrently using threads.',
    exampleInput: 'download_all(["url1", "url2", "url3"])',
    exampleOutput: 'All downloads completed in ~1 second instead of ~3 seconds',
    hint: 'Use the threading module. Create a Thread for each download and call start() on all of them.',
    concepts: ['threading', 'concurrency']
  },
  {
    day: 27,
    title: 'SQL Injection Prevention',
    difficulty: 'Hard',
    problem: 'Write a secure database query function that prevents SQL injection. Compare it with an insecure version.',
    exampleInput: 'secure_query("users", "admin\' OR 1=1--")',
    exampleOutput: 'Secure: Uses parameterized query\nInsecure: Vulnerable to injection',
    hint: 'Never concatenate user input into SQL strings. Use parameterized queries instead.',
    concepts: ['security', 'SQL', 'parameterized queries']
  },
  {
    day: 28,
    title: 'Design Patterns - Singleton',
    difficulty: 'Hard',
    problem: 'Implement the Singleton pattern so that only one instance of a class can exist.',
    exampleInput: 'a = Singleton(); b = Singleton()\nprint(a is b)',
    exampleOutput: 'True',
    hint: 'Override __new__ to check if an instance already exists. If so, return the existing one.',
    concepts: ['design patterns', 'classes', '__new__']
  },
  {
    day: 29,
    title: 'Async Programming',
    difficulty: 'Hard',
    problem: 'Write an async function that simulates fetching data from 3 APIs concurrently.',
    exampleInput: 'await fetch_all()',
    exampleOutput: 'All data fetched concurrently',
    hint: 'Use "async def" and "await". Use asyncio.gather() to run multiple async tasks together.',
    concepts: ['asyncio', 'async/await', 'concurrency']
  },
  {
    day: 30,
    title: 'Build a CLI Tool',
    difficulty: 'Hard',
    problem: 'Build a command-line tool using argparse that takes a filename and finds the most common word.',
    exampleInput: 'python wordcount.py myfile.txt',
    exampleOutput: 'Most common word: "the" (appears 42 times)',
    hint: 'Use argparse for CLI arguments, read the file, split into words, and count with collections.Counter.',
    concepts: ['argparse', 'file I/O', 'collections']
  }
];

module.exports = { challenges };
