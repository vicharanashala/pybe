const tips = [
    {
        title: "Use enumerate()",
        text: "Use enumerate() when you need both the index and value while looping through a list.",
        code: `for index, value in enumerate(items):
    print(index, value)`
    },

    {
        title: "Use f-strings",
        text: "F-strings make it easy to insert variables directly into a string.",
        code: `name = "Python"
print(f"Hello, {name}!")`
    },

    {
        title: "Use list comprehensions",
        text: "List comprehensions provide a short and readable way to create lists.",
        code: `squares = [x * x for x in range(5)]`
    },

    {
        title: "Use the in operator",
        text: "Use the in operator to check whether an item exists in a list or string.",
        code: `if "Python" in languages:
    print("Found!")`
    },

    {
        title: "Use len()",
        text: "The len() function returns the number of items in a sequence.",
        code: `numbers = [10, 20, 30]
print(len(numbers))`
    },

    {
        title: "Use type()",
        text: "The type() function tells you the data type of a value.",
        code: `value = 10
print(type(value))`
    },

    {
        title: "Use input()",
        text: "The input() function allows your program to receive information from the user.",
        code: `name = input("Enter your name: ")
print(name)`
    },

    {
        title: "Use try-except",
        text: "Use try-except to handle errors without crashing your program.",
        code: `try:
    number = int("abc")
except ValueError:
    print("Invalid number")`
    },

    {
        title: "Use append()",
        text: "Use append() to add an item to the end of a list.",
        code: `numbers = [1, 2, 3]
numbers.append(4)`
    },

    {
        title: "Use pop()",
        text: "The pop() method removes and returns an item from a list.",
        code: `numbers = [1, 2, 3]
last = numbers.pop()`
    },

    {
        title: "Use sorted()",
        text: "Use sorted() when you want a sorted copy of a list without changing the original.",
        code: `numbers = [3, 1, 2]
result = sorted(numbers)`
    },

    {
        title: "Use max() and min()",
        text: "max() returns the largest value and min() returns the smallest value.",
        code: `numbers = [4, 8, 2, 6]

print(max(numbers))
print(min(numbers))`
    },

    {
        title: "Use sum()",
        text: "The sum() function quickly adds all numbers in an iterable.",
        code: `numbers = [1, 2, 3, 4]
total = sum(numbers)`
    },

    {
        title: "Use zip()",
        text: "zip() lets you iterate over multiple sequences at the same time.",
        code: `names = ["A", "B"]
scores = [90, 80]

for name, score in zip(names, scores):
    print(name, score)`
    },

    {
        title: "Use dictionary get()",
        text: "Use get() to safely access a dictionary value without getting a KeyError.",
        code: `student = {"name": "Alex"}

print(student.get("age"))`
    },

    {
        title: "Use sets for unique values",
        text: "A set automatically removes duplicate values.",
        code: `numbers = [1, 2, 2, 3, 3]

unique = set(numbers)`
    },

    {
        title: "Use == for comparison",
        text: "Use == to check whether two values are equal. A single = is used for assignment.",
        code: `x = 10

if x == 10:
    print("Equal")`
    },

    {
        title: "String comparisons are case-sensitive",
        text: "Python treats uppercase and lowercase letters as different when comparing strings.",
        code: `print("Python" == "python")
# False`
    },

    {
        title: "Use range() in loops",
        text: "range() generates a sequence of numbers and is commonly used with for loops.",
        code: `for i in range(5):
    print(i)`
    },

    {
        title: "Keep functions small",
        text: "Small functions are easier to understand, test, debug, and reuse.",
        code: `def add(a, b):
    return a + b`
    }
];

const tipTitle = document.getElementById("tip-title");
const tipText = document.getElementById("tip-text");
const tipCode = document.getElementById("tip-code");
const tipNumber = document.getElementById("tip-number");
const nextButton = document.getElementById("next-tip");

let currentTip = new Date().getDate() % tips.length;

function showTip(index) {
    const tip = tips[index];

    tipTitle.textContent = tip.title;
    tipText.textContent = tip.text;
    tipCode.textContent = tip.code;
    tipNumber.textContent = index + 1;
}

nextButton.addEventListener("click", function () {
    currentTip = (currentTip + 1) % tips.length;
    showTip(currentTip);
});

showTip(currentTip);
