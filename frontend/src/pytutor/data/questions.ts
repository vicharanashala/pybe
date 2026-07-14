// src/data/questions.ts
// Questions sourced from PYBE_Python_Practice_Questions.docx
// 3 per topic: Very Easy → Easy → A Bit Difficult

export interface Question {
  id:       string
  level:    'easy' | 'medium' | 'hard'
  badge:    string
  title:    string
  description: string
  starter:  string
  hint:     string
  check:    (output: string) => boolean
  expected: string
}

type TopicMap = Record<string, Question[]>

const Q: TopicMap = {

  // ── Variables ───────────────────────────────────────────────────────────
  Variables: [
    {
      id:'var-1', level:'easy', badge:'Very Easy',
      title:'Print a variable',
      description:'Create a variable x with value 10 and print it.',
      starter:'# create x = 10 and print it\n',
      hint:'x = 10  then  print(x)',
      check: o => o.trim() === '10',
      expected: '10',
    },
    {
      id:'var-2', level:'medium', badge:'Easy',
      title:'Hello with your name',
      description:'Store the name "Alice" in a variable called name and print: Hello Alice',
      starter:'name = "Alice"\n# print Hello Alice\n',
      hint:'print("Hello", name)',
      check: o => o.trim() === 'Hello Alice',
      expected: 'Hello Alice',
    },
    {
      id:'var-3', level:'hard', badge:'A Bit Difficult',
      title:'Swap without temp',
      description:'a = 5 and b = 8. Swap them without a third variable and print a then b.',
      starter:'a, b = 5, 8\n# swap and print a then print b\n',
      hint:'a, b = b, a',
      check: o => o.trim().replace(/\s+/g,'\n') === '8\n5',
      expected: '8\n5  (or 8 5 on same line)',
    },
  ],

  // ── Input & Output ──────────────────────────────────────────────────────
  'Input & Output': [
    {
      id:'io-1', level:'easy', badge:'Very Easy',
      title:'Print Hello World',
      description:'Print exactly: Hello, World!',
      starter:'# print Hello, World!\n',
      hint:'print("Hello, World!")',
      check: o => o.trim() === 'Hello, World!',
      expected: 'Hello, World!',
    },
    {
      id:'io-2', level:'medium', badge:'Easy',
      title:'Sum of two numbers',
      description:'a = 3, b = 7. Print their sum.',
      starter:'a = 3\nb = 7\n# print their sum\n',
      hint:'print(a + b)',
      check: o => o.trim() === '10',
      expected: '10',
    },
    {
      id:'io-3', level:'hard', badge:'A Bit Difficult',
      title:'Format a sentence',
      description:'name = "Riya", age = "20". Print: Riya is 20 years old',
      starter:'name = "Riya"\nage = "20"\n# print: Riya is 20 years old\n',
      hint:'print(f"{name} is {age} years old")',
      check: o => o.trim() === 'Riya is 20 years old',
      expected: 'Riya is 20 years old',
    },
  ],

  // ── Operators ───────────────────────────────────────────────────────────
  Operators: [
    {
      id:'op-1', level:'easy', badge:'Very Easy',
      title:'Add two numbers',
      description:'Print the result of 7 + 3.',
      starter:'# print 7 + 3\n',
      hint:'print(7 + 3)',
      check: o => o.trim() === '10',
      expected: '10',
    },
    {
      id:'op-2', level:'medium', badge:'Easy',
      title:'Greater than check',
      description:'Print the result of checking whether 10 is greater than 5.',
      starter:'# print whether 10 > 5\n',
      hint:'print(10 > 5)',
      check: o => o.trim() === 'True',
      expected: 'True',
    },
    {
      id:'op-3', level:'hard', badge:'A Bit Difficult',
      title:'Divisible by 3 and 5',
      description:'n = 15. Print True if n is divisible by both 3 and 5, else False.',
      starter:'n = 15\n# print True or False\n',
      hint:'print(n % 3 == 0 and n % 5 == 0)',
      check: o => o.trim() === 'True',
      expected: 'True',
    },
  ],

  // ── Conditions ──────────────────────────────────────────────────────────
  Conditions: [
    {
      id:'cond-1', level:'easy', badge:'Very Easy',
      title:'Positive check',
      description:'n = 7. Print "Positive" if n > 0.',
      starter:'n = 7\n# print Positive if n > 0\n',
      hint:'if n > 0:  print("Positive")',
      check: o => o.trim() === 'Positive',
      expected: 'Positive',
    },
    {
      id:'cond-2', level:'medium', badge:'Easy',
      title:'Even or odd',
      description:'n = 14. Print "Even" if divisible by 2, else "Odd".',
      starter:'n = 14\n# print Even or Odd\n',
      hint:'print("Even" if n % 2 == 0 else "Odd")',
      check: o => o.trim() === 'Even',
      expected: 'Even',
    },
    {
      id:'cond-3', level:'hard', badge:'A Bit Difficult',
      title:'Largest of three',
      description:'a=3, b=9, c=6. Print the largest of the three numbers.',
      starter:'a = 3\nb = 9\nc = 6\n# print the largest\n',
      hint:'print(max(a, b, c))',
      check: o => o.trim() === '9',
      expected: '9',
    },
  ],

  // ── Loops ───────────────────────────────────────────────────────────────
  Loops: [
    {
      id:'loop-1', level:'easy', badge:'Very Easy',
      title:'Print 1 to 5',
      description:'Print numbers 1 to 5, each on its own line.',
      starter:'# print 1 to 5\n',
      hint:'for i in range(1, 6):  print(i)',
      check: o => o.trim() === '1\n2\n3\n4\n5',
      expected: '1\n2\n3\n4\n5',
    },
    {
      id:'loop-2', level:'medium', badge:'Easy',
      title:'Sum of first 10 naturals',
      description:'Find the sum of the first 10 natural numbers and print it.',
      starter:'# sum 1 to 10\n',
      hint:'s = 0; for i in range(1, 11): s += i',
      check: o => o.trim() === '55',
      expected: '55',
    },
    {
      id:'loop-3', level:'hard', badge:'A Bit Difficult',
      title:'Multiplication table',
      description:'n = 3. Print its multiplication table from 3×1 to 3×5. Each line: 3 x 1 = 3',
      starter:'n = 3\n# print multiplication table n×1 to n×5\n',
      hint:'for i in range(1, 6):  print(f"{n} x {i} = {n*i}")',
      check: o => o.trim() === '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15',
      expected: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15',
    },
  ],

  // ── Functions ───────────────────────────────────────────────────────────
  Functions: [
    {
      id:'fn-1', level:'easy', badge:'Very Easy',
      title:'Greet function',
      description:'Create a function greet() that prints "Hello" then call it.',
      starter:'# define greet() and call it\n',
      hint:'def greet():  print("Hello")',
      check: o => o.trim() === 'Hello',
      expected: 'Hello',
    },
    {
      id:'fn-2', level:'medium', badge:'Easy',
      title:'Square function',
      description:'Create a function square(n) that returns n*n. Print square(5).',
      starter:'# define square(n) and print square(5)\n',
      hint:'def square(n):  return n * n',
      check: o => o.trim() === '25',
      expected: '25',
    },
    {
      id:'fn-3', level:'hard', badge:'A Bit Difficult',
      title:'Is prime?',
      description:'Define is_prime(n) that returns True if n is prime, else False. Print is_prime(7).',
      starter:'# define is_prime(n) and print is_prime(7)\n',
      hint:'return n > 1 and all(n % i for i in range(2, int(n**0.5)+1))',
      check: o => o.trim() === 'True',
      expected: 'True',
    },
  ],

  // ── Lists ───────────────────────────────────────────────────────────────
  Lists: [
    {
      id:'lst-1', level:'easy', badge:'Very Easy',
      title:'Create a list',
      description:'Create a list called fruits with "apple", "banana", "mango" and print it.',
      starter:'# create fruits list and print it\n',
      hint:'fruits = ["apple", "banana", "mango"]  then  print(fruits)',
      check: o => o.includes('apple') && o.includes('banana') && o.includes('mango'),
      expected: "['apple', 'banana', 'mango']",
    },
    {
      id:'lst-2', level:'medium', badge:'Easy',
      title:'Append to list',
      description:'nums = [1, 2]. Append 3 to it and print the list.',
      starter:'nums = [1, 2]\n# append 3 and print\n',
      hint:'nums.append(3)  then  print(nums)',
      check: o => o.trim() === '[1, 2, 3]',
      expected: '[1, 2, 3]',
    },
    {
      id:'lst-3', level:'hard', badge:'A Bit Difficult',
      title:'Largest in list',
      description:'nums = [4, 7, 2, 9, 1]. Print the largest element.',
      starter:'nums = [4, 7, 2, 9, 1]\n# print the largest element\n',
      hint:'print(max(nums))',
      check: o => o.trim() === '9',
      expected: '9',
    },
  ],

  // ── Tuples ──────────────────────────────────────────────────────────────
  Tuples: [
    {
      id:'tup-1', level:'easy', badge:'Very Easy',
      title:'Create a tuple',
      description:'Create a tuple t with values 1, 2, 3 and print it.',
      starter:'# create tuple t and print it\n',
      hint:'t = (1, 2, 3)  then  print(t)',
      check: o => o.trim() === '(1, 2, 3)',
      expected: '(1, 2, 3)',
    },
    {
      id:'tup-2', level:'medium', badge:'Easy',
      title:'Access tuple element',
      description:'t = (10, 20, 30). Print the second element.',
      starter:'t = (10, 20, 30)\n# print second element\n',
      hint:'print(t[1])',
      check: o => o.trim() === '20',
      expected: '20',
    },
    {
      id:'tup-3', level:'hard', badge:'A Bit Difficult',
      title:'Unpack a tuple',
      description:'Unpack (10, 20, 30) into a, b, c and print them on separate lines.',
      starter:'# unpack (10, 20, 30) into a, b, c and print each\n',
      hint:'a, b, c = (10, 20, 30)',
      check: o => o.trim() === '10\n20\n30' || o.trim() === '10\r\n20\r\n30',
      expected: '10\n20\n30',
    },
  ],

  // ── Dictionaries ────────────────────────────────────────────────────────
  Dictionaries: [
    {
      id:'dct-1', level:'easy', badge:'Very Easy',
      title:'Create a dictionary',
      description:'Create d = {"name": "Riya", "age": 20} and print d["name"].',
      starter:'d = {"name": "Riya", "age": 20}\n# print d["name"]\n',
      hint:'print(d["name"])',
      check: o => o.trim() === 'Riya',
      expected: 'Riya',
    },
    {
      id:'dct-2', level:'medium', badge:'Easy',
      title:'Add a key',
      description:'d = {"a": 1}. Add key "b" with value 2. Print d["b"].',
      starter:'d = {"a": 1}\n# add "b": 2 and print d["b"]\n',
      hint:'d["b"] = 2  then  print(d["b"])',
      check: o => o.trim() === '2',
      expected: '2',
    },
    {
      id:'dct-3', level:'hard', badge:'A Bit Difficult',
      title:'Count frequencies',
      description:'arr = ["a","b","a","c","b","a"]. Count how many times each appears. Print freq["a"].',
      starter:'arr = ["a","b","a","c","b","a"]\nfreq = {}\n# count frequencies, print freq["a"]\n',
      hint:'for x in arr:  freq[x] = freq.get(x, 0) + 1',
      check: o => o.trim() === '3',
      expected: '3',
    },
  ],

  // ── Sets ────────────────────────────────────────────────────────────────
  Sets: [
    {
      id:'set-1', level:'easy', badge:'Very Easy',
      title:'Create a set',
      description:'Create a set s = {1, 2, 3} and print its length.',
      starter:'s = {1, 2, 3}\n# print length\n',
      hint:'print(len(s))',
      check: o => o.trim() === '3',
      expected: '3',
    },
    {
      id:'set-2', level:'medium', badge:'Easy',
      title:'Add to set',
      description:'s = {1, 2, 3}. Add 4. Print the length.',
      starter:'s = {1, 2, 3}\n# add 4 and print length\n',
      hint:'s.add(4)',
      check: o => o.trim() === '4',
      expected: '4',
    },
    {
      id:'set-3', level:'hard', badge:'A Bit Difficult',
      title:'Intersection of sets',
      description:'a = {1,2,3,4}, b = {3,4,5,6}. Print the length of their intersection.',
      starter:'a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n# print length of intersection\n',
      hint:'print(len(a & b))',
      check: o => o.trim() === '2',
      expected: '2',
    },
  ],

  // ── String Handling ─────────────────────────────────────────────────────
  'String Handling': [
    {
      id:'str-1', level:'easy', badge:'Very Easy',
      title:'String length',
      description:'text = "hello". Print the length of the string.',
      starter:'text = "hello"\n# print the length\n',
      hint:'print(len(text))',
      check: o => o.trim() === '5',
      expected: '5',
    },
    {
      id:'str-2', level:'medium', badge:'Easy',
      title:'Uppercase',
      description:'text = "hello". Convert to uppercase and print.',
      starter:'text = "hello"\n# print in uppercase\n',
      hint:'print(text.upper())',
      check: o => o.trim() === 'HELLO',
      expected: 'HELLO',
    },
    {
      id:'str-3', level:'hard', badge:'A Bit Difficult',
      title:'Palindrome check',
      description:'text = "racecar". Print True if it reads the same forwards and backwards.',
      starter:'text = "racecar"\n# print True if palindrome\n',
      hint:'print(text == text[::-1])',
      check: o => o.trim() === 'True',
      expected: 'True',
    },
  ],

  // ── File Handling ───────────────────────────────────────────────────────
  'File Handling': [
    {
      id:'file-1', level:'easy', badge:'Very Easy',
      title:'Split into lines',
      description:'text = "line1\\nline2\\nline3". Split into lines and print the count.',
      starter:'text = "line1\\nline2\\nline3"\n# split into lines and print count\n',
      hint:'lines = text.split("\\n")  then  print(len(lines))',
      check: o => o.trim() === '3',
      expected: '3',
    },
    {
      id:'file-2', level:'medium', badge:'Easy',
      title:'First line',
      description:'data = "apple\\nbanana\\ncherry". Print only the first line.',
      starter:'data = "apple\\nbanana\\ncherry"\n# print first line\n',
      hint:'print(data.split("\\n")[0])',
      check: o => o.trim() === 'apple',
      expected: 'apple',
    },
    {
      id:'file-3', level:'hard', badge:'A Bit Difficult',
      title:'Count lines',
      description:'content = "a\\nb\\nc\\nd\\ne". Print how many lines it has.',
      starter:'content = "a\\nb\\nc\\nd\\ne"\n# print number of lines\n',
      hint:'print(len(content.split("\\n")))',
      check: o => o.trim() === '5',
      expected: '5',
    },
  ],

  // ── Comments ────────────────────────────────────────────────────────────
  Comments: [
    {
      id:'com-1', level:'easy', badge:'Very Easy',
      title:'Write a comment',
      description:'Add a comment that says # I love Python then print "hello".',
      starter:'# I love Python\nprint("hello")',
      hint:'Anything after # is a comment and is ignored',
      check: o => o.trim() === 'hello',
      expected: 'hello',
    },
    {
      id:'com-2', level:'medium', badge:'Easy',
      title:'Comment out a line',
      description:'Only "one" should print. Comment out the second print line.',
      starter:'print("one")\nprint("two")',
      hint:'Add # in front of print("two")',
      check: o => o.trim() === 'one',
      expected: 'one',
    },
    {
      id:'com-3', level:'hard', badge:'A Bit Difficult',
      title:'Inline comment',
      description:'Print 42 and add an inline comment after it explaining what it is.',
      starter:'print(42)  # put your comment here',
      hint:'Anything after # on the same line is ignored',
      check: o => o.trim() === '42',
      expected: '42',
    },
  ],

  // ── Data Types ──────────────────────────────────────────────────────────
  'Data Types': [
    {
      id:'dt-1', level:'easy', badge:'Very Easy',
      title:'Integer type',
      description:'Print the type of 42. Output should contain "int".',
      starter:'# print type of 42\n',
      hint:'print(type(42))',
      check: o => o.includes('int'),
      expected: "<class 'int'>",
    },
    {
      id:'dt-2', level:'medium', badge:'Easy',
      title:'String type',
      description:'Print the type of "hello". Output should contain "str".',
      starter:'# print type of "hello"\n',
      hint:'print(type("hello"))',
      check: o => o.includes('str'),
      expected: "<class 'str'>",
    },
    {
      id:'dt-3', level:'hard', badge:'A Bit Difficult',
      title:'Float type',
      description:'Print the type of 3.14. Output should contain "float".',
      starter:'# print type of 3.14\n',
      hint:'print(type(3.14))',
      check: o => o.includes('float'),
      expected: "<class 'float'>",
    },
  ],

  // ── Numbers ─────────────────────────────────────────────────────────────
  Numbers: [
    {
      id:'num-1', level:'easy', badge:'Very Easy',
      title:'Basic addition',
      description:'Print the result of 7 + 3.',
      starter:'# print 7 + 3\n',
      hint:'print(7 + 3)',
      check: o => o.trim() === '10',
      expected: '10',
    },
    {
      id:'num-2', level:'medium', badge:'Easy',
      title:'Remainder',
      description:'Print the remainder of 17 divided by 5.',
      starter:'# print 17 % 5\n',
      hint:'print(17 % 5)',
      check: o => o.trim() === '2',
      expected: '2',
    },
    {
      id:'num-3', level:'hard', badge:'A Bit Difficult',
      title:'Power and floor',
      description:'Print 2**8 on line 1 and 17//3 on line 2.',
      starter:'# print 2**8 then 17//3\n',
      hint:'** is power, // is floor division',
      check: o => o.trim() === '256\n5' || o.trim() === '256\r\n5',
      expected: '256\n5',
    },
  ],

  // ── Casting ─────────────────────────────────────────────────────────────
  Casting: [
    {
      id:'cast-1', level:'easy', badge:'Very Easy',
      title:'Int to string',
      description:'Convert 99 to a string and print its type. Output should contain "str".',
      starter:'# convert 99 to string and print its type\n',
      hint:'print(type(str(99)))',
      check: o => o.includes('str'),
      expected: "<class 'str'>",
    },
    {
      id:'cast-2', level:'medium', badge:'Easy',
      title:'String to int',
      description:'Convert "42" to an integer, add 1, and print the result.',
      starter:'# convert "42" to int, add 1, print\n',
      hint:'print(int("42") + 1)',
      check: o => o.trim() === '43',
      expected: '43',
    },
    {
      id:'cast-3', level:'hard', badge:'A Bit Difficult',
      title:'Float to int',
      description:'Convert 7.9 to an integer and print it. (int() truncates, not rounds)',
      starter:'# convert 7.9 to int and print\n',
      hint:'print(int(7.9))',
      check: o => o.trim() === '7',
      expected: '7',
    },
  ],

  // ── Booleans ────────────────────────────────────────────────────────────
  Booleans: [
    {
      id:'bool-1', level:'easy', badge:'Very Easy',
      title:'Print True',
      description:'Print the Python boolean True.',
      starter:'# print True\n',
      hint:'print(True)',
      check: o => o.trim() === 'True',
      expected: 'True',
    },
    {
      id:'bool-2', level:'medium', badge:'Easy',
      title:'Compare numbers',
      description:'Print the result of 10 > 5.',
      starter:'# print 10 > 5\n',
      hint:'print(10 > 5)',
      check: o => o.trim() === 'True',
      expected: 'True',
    },
    {
      id:'bool-3', level:'hard', badge:'A Bit Difficult',
      title:'Two comparisons',
      description:'Print 7 == 7 on line 1 and 3 == 4 on line 2.',
      starter:'# print 7==7 then 3==4\n',
      hint:'print(7 == 7)  then  print(3 == 4)',
      check: o => o.trim() === 'True\nFalse' || o.trim() === 'True\r\nFalse',
      expected: 'True\nFalse',
    },
  ],

  // ── While Loops ─────────────────────────────────────────────────────────
  'While Loops': [
    {
      id:'wh-1', level:'easy', badge:'Very Easy',
      title:'Count to 3',
      description:'Use a while loop to print 1, 2, 3 each on its own line.',
      starter:'# while loop to print 1, 2, 3\n',
      hint:'n=1; while n<=3: print(n); n+=1',
      check: o => o.trim() === '1\n2\n3',
      expected: '1\n2\n3',
    },
    {
      id:'wh-2', level:'medium', badge:'Easy',
      title:'Double until 32',
      description:'Start n=1. Double it each loop while n < 32. Print the final value.',
      starter:'n = 1\n# double while n < 32, print final n\n',
      hint:'while n < 32:  n = n * 2',
      check: o => o.trim() === '32',
      expected: '32',
    },
    {
      id:'wh-3', level:'hard', badge:'A Bit Difficult',
      title:'Sum with while',
      description:'Sum numbers 1 to 10 using a while loop. Print the total.',
      starter:'# sum 1 to 10 using while loop\n',
      hint:'total=0; i=1; while i<=10: total+=i; i+=1',
      check: o => o.trim() === '55',
      expected: '55',
    },
  ],

  // ── For Loops ───────────────────────────────────────────────────────────
  'For Loops': [
    {
      id:'for-1', level:'easy', badge:'Very Easy',
      title:'Count to 5',
      description:'Print numbers 1 through 5, each on its own line.',
      starter:'# print 1 to 5\n',
      hint:'for i in range(1, 6):  print(i)',
      check: o => o.trim() === '1\n2\n3\n4\n5',
      expected: '1\n2\n3\n4\n5',
    },
    {
      id:'for-2', level:'medium', badge:'Easy',
      title:'Sum 1 to 10',
      description:'Use a for loop to sum 1 to 10 and print the result.',
      starter:'# sum 1 to 10\n',
      hint:'total=0; for i in range(1,11): total+=i',
      check: o => o.trim() === '55',
      expected: '55',
    },
    {
      id:'for-3', level:'hard', badge:'A Bit Difficult',
      title:'3× table',
      description:'Print the 3 times table from 3×1 to 3×5. Each line: 3 x 1 = 3',
      starter:'# print 3 times table 3×1 to 3×5\n',
      hint:'for i in range(1,6):  print(f"3 x {i} = {3*i}")',
      check: o => o.trim() === '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15',
      expected: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15',
    },
  ],

  // ── 'If...Else' ─────────────────────────────────────────────────────────
  'If...Else': [
    {
      id:'if-1', level:'easy', badge:'Very Easy',
      title:'Positive check',
      description:'n = 7. Print "Positive" if n > 0.',
      starter:'n = 7\n# print Positive if n > 0\n',
      hint:'if n > 0:  print("Positive")',
      check: o => o.trim() === 'Positive',
      expected: 'Positive',
    },
    {
      id:'if-2', level:'medium', badge:'Easy',
      title:'Even or odd',
      description:'n = 14. Print "Even" if divisible by 2, else "Odd".',
      starter:'n = 14\n# print Even or Odd\n',
      hint:'print("Even" if n % 2 == 0 else "Odd")',
      check: o => o.trim() === 'Even',
      expected: 'Even',
    },
    {
      id:'if-3', level:'hard', badge:'A Bit Difficult',
      title:'Grade classifier',
      description:'score = 72. Print A if ≥90, B if ≥75, C if ≥60, else F.',
      starter:'score = 72\n# print the grade\n',
      hint:'Use if / elif / elif / else',
      check: o => o.trim() === 'C',
      expected: 'C',
    },
  ],
}

const FALLBACK: Question[] = [
  { id:'fb-1', level:'easy',   badge:'Very Easy', title:'Print done',   description:'Print the word "done".',            starter:'# print done\n',        hint:'print("done")',       check:o=>o.trim()==='done', expected:'done' },
  { id:'fb-2', level:'medium', badge:'Easy',      title:'Simple math',  description:'Print the result of 100 - 37.',     starter:'# print 100 - 37\n',    hint:'print(100 - 37)',    check:o=>o.trim()==='63',   expected:'63'   },
  { id:'fb-3', level:'hard',   badge:'A Bit Difficult', title:'Count to 3', description:'Print 1, 2, 3 each on a separate line.', starter:'# print 1 then 2 then 3\n', hint:'for i in range(1,4): print(i)', check:o=>o.trim()==='1\n2\n3', expected:'1\n2\n3' },
]

export function getQuestions(topic: string): Question[] {
  return Q[topic] ?? FALLBACK
}
