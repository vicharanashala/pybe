const keywords = [

    {
        keyword: "if",
        category: "Conditions",
        description:
            "Executes code when a condition is true.",

        syntax:
`if condition:
    statement`,

        example:
`age = 18

if age >= 18:
    print("Adult")`,

        output:
`Adult`
    },


    {
        keyword: "else",
        category: "Conditions",
        description:
            "Executes code when the if condition is false.",

        syntax:
`if condition:
    statement
else:
    statement`,

        example:
`age = 15

if age >= 18:
    print("Adult")
else:
    print("Minor")`,

        output:
`Minor`
    },


    {
        keyword: "elif",
        category: "Conditions",
        description:
            "Checks another condition if the previous condition is false.",

        syntax:
`if condition:
    statement
elif condition:
    statement`,

        example:
`marks = 75

if marks >= 90:
    print("A")
elif marks >= 60:
    print("B")`,

        output:
`B`
    },


    {
        keyword: "for",
        category: "Loops",
        description:
            "Used to iterate over a sequence.",

        syntax:
`for variable in sequence:
    statement`,

        example:
`for i in range(3):
    print(i)`,

        output:
`0
1
2`
    },


    {
        keyword: "while",
        category: "Loops",
        description:
            "Repeats code while a condition is true.",

        syntax:
`while condition:
    statement`,

        example:
`count = 1

while count <= 3:
    print(count)
    count += 1`,

        output:
`1
2
3`
    },


    {
        keyword: "break",
        category: "Loops",
        description:
            "Immediately stops a loop.",

        syntax:
`break`,

        example:
`for i in range(5):
    if i == 3:
        break
    print(i)`,

        output:
`0
1
2`
    },


    {
        keyword: "continue",
        category: "Loops",
        description:
            "Skips the current iteration of a loop.",

        syntax:
`continue`,

        example:
`for i in range(5):
    if i == 2:
        continue
    print(i)`,

        output:
`0
1
3
4`
    },


    {
        keyword: "def",
        category: "Functions",
        description:
            "Used to define a function.",

        syntax:
`def function_name():
    statement`,

        example:
`def greet():
    print("Hello")

greet()`,

        output:
`Hello`
    },


    {
        keyword: "return",
        category: "Functions",
        description:
            "Returns a value from a function.",

        syntax:
`return value`,

        example:
`def add(a, b):
    return a + b

print(add(2, 3))`,

        output:
`5`
    },


    {
        keyword: "lambda",
        category: "Functions",
        description:
            "Creates an anonymous function.",

        syntax:
`lambda arguments: expression`,

        example:
`square = lambda x: x * x

print(square(4))`,

        output:
`16`
    },


    {
        keyword: "try",
        category: "Exceptions",
        description:
            "Contains code that may produce an exception.",

        syntax:
`try:
    statement`,

        example:
`try:
    print(10 / 0)
except:
    print("Error")`,

        output:
`Error`
    },


    {
        keyword: "except",
        category: "Exceptions",
        description:
            "Handles exceptions raised inside a try block.",

        syntax:
`except ExceptionType:
    statement`,

        example:
`try:
    print(number)
except NameError:
    print("Variable not found")`,

        output:
`Variable not found`
    },


    {
        keyword: "import",
        category: "Modules",
        description:
            "Used to import a Python module.",

        syntax:
`import module_name`,

        example:
`import math

print(math.sqrt(25))`,

        output:
`5.0`
    },


    {
        keyword: "from",
        category: "Modules",
        description:
            "Imports a specific item from a module.",

        syntax:
`from module import item`,

        example:
`from math import sqrt

print(sqrt(16))`,

        output:
`4.0`
    },


    {
        keyword: "class",
        category: "OOP",
        description:
            "Used to create a class.",

        syntax:
`class ClassName:
    statement`,

        example:
`class Student:
    pass

print("Class Created")`,

        output:
`Class Created`
    },


    {
        keyword: "pass",
        category: "Functions",
        description:
            "Acts as a placeholder and performs no operation.",

        syntax:
`pass`,

        example:
`def future_function():
    pass

print("Done")`,

        output:
`Done`
    },


    {
        keyword: "with",
        category: "Modules",
        description:
            "Used with context managers, commonly for file handling.",

        syntax:
`with open(file) as f:
    statement`,

        example:
`with open("demo.txt", "w") as file:
    file.write("Hello")`,

        output:
`File written successfully`
    }

];



/* =========================
   QUIZ QUESTIONS
========================= */

const quizQuestions = [

    {
        question:
            "Which keyword is used to define a function?",

        options: [
            "function",
            "def",
            "func",
            "define"
        ],

        answer: "def"
    },


    {
        question:
            "Which keyword immediately stops a loop?",

        options: [
            "stop",
            "exit",
            "break",
            "continue"
        ],

        answer: "break"
    },


    {
        question:
            "Which keyword handles exceptions?",

        options: [
            "catch",
            "error",
            "except",
            "handle"
        ],

        answer: "except"
    },


    {
        question:
            "Which keyword creates a class?",

        options: [
            "object",
            "class",
            "struct",
            "create"
        ],

        answer: "class"
    },


    {
        question:
            "Which keyword imports a module?",

        options: [
            "include",
            "require",
            "using",
            "import"
        ],

        answer: "import"
    },


    {
        question:
            "Which keyword skips the current loop iteration?",

        options: [
            "skip",
            "continue",
            "pass",
            "next"
        ],

        answer: "continue"
    },


    {
        question:
            "Which keyword returns a value from a function?",

        options: [
            "send",
            "return",
            "output",
            "give"
        ],

        answer: "return"
    },


    {
        question:
            "Which keyword creates an anonymous function?",

        options: [
            "anonymous",
            "lambda",
            "function",
            "def"
        ],

        answer: "lambda"
    },


    {
        question:
            "Which keyword checks another condition?",

        options: [
            "elseif",
            "elif",
            "another",
            "condition"
        ],

        answer: "elif"
    },


    {
        question:
            "Which keyword acts as a placeholder?",

        options: [
            "empty",
            "skip",
            "pass",
            "null"
        ],

        answer: "pass"
    }

];
