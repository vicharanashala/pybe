/**
 * Hints Database for PyBe Scenarios
 * Provides progressive hints to guide learners without giving away the direct code.
 */

const hintsMap = {
  'Bag Weight Label': [
    "Identify the bag weight value (e.g. 5 or 8.5) and give it a descriptive variable name, like 'weight' or 'bag_weight'.",
    "Assign the value using the equals sign: `weight = 5`. Then, use `print(weight)` to display it."
  ],
  'Rainy Day Choice': [
    "To represent the condition, define a boolean variable like `is_raining = True`.",
    "Use conditional statements: `if is_raining:` print the umbrella message, and use `else:` for the alternative."
  ],
  'Two Snack Prices': [
    "Store each snack price in its own variable, e.g. `samosa = 15` and `juice = 10`.",
    "Add the two variables together using the `+` operator, and store the outcome in a variable like `total_cost = samosa + juice`."
  ],
  'Greeting by Name': [
    "Create a name variable with a string value (e.g., `name = 'Alex'`).",
    "Combine the string values together. You can do this with f-strings: `greeting = f'Hello, {name}!'` or concatenation: `'Hello, ' + name`."
  ],
  'Pass Mark Check': [
    "Set up two variables: one for the learner's score and one for the pass mark threshold.",
    "Use a comparison operator (`>=`) inside an `if` statement to check if the score meets or exceeds the pass mark."
  ],
  'Pocket Money Left': [
    "Declare two variables: `starting_money` and `spent_money`.",
    "Subtract spent from starting using the `-` operator and store it: `money_left = starting_money - spent_money`."
  ],
  'Favorite Color List': [
    "Group related string values into a Python list by using square brackets, e.g. `colors = ['red', 'blue', 'green']`.",
    "Ensure your list contains at least three distinct color strings separated by commas."
  ],
  'First Item in a Bag': [
    "Lists in Python use zero-based indexing. The first element is always at index `0`.",
    "If your list is `bag`, get the first item by referencing `bag[0]`."
  ],
  'Attendance Count': [
    "You don't need to manually loop to count elements. Python has a built-in helper for length.",
    "Use the `len()` function, passing your attendance list as the argument: `count = len(present_students)`."
  ],
  'Temperature Message': [
    "Use an `if` statement to compare your temperature variable with a threshold temperature (e.g., 30).",
    "Print 'Hot' in the `if` block, and use `else:` to print 'Comfortable'."
  ],
  'Water Bottle Reminder': [
    "Instead of writing several print statements, create a loop to iterate through school breaks.",
    "Use a `for` loop: `for break_time in breaks:` and put the print reminder inside the loop."
  ],
  'Find the Longest Pencil': [
    "Initialize a variable like `longest = 0` to keep track of the largest value seen so far.",
    "Loop through each length. Inside the loop, check `if length > longest:` and update `longest` to the new value."
  ],
  'Clean Chore Checklist': [
    "Create a list of chores. Then, loop through them one by one.",
    "Use `for chore in chores:` and print a status message showing that each chore is completed."
  ],
  'Movie Age Filter': [
    "Loop through each movie in your collection. Inside the loop, access its age rating.",
    "Use an `if` condition to compare the viewer's age with the rating, and only print or keep movies where `viewer_age >= rating`."
  ],
  'Classroom Supply Lookup': [
    "Store item names as keys and counts as values inside a dictionary.",
    "Use curly braces and key-value pairs: `supplies = {'chalk': 10, 'markers': 5}`."
  ],
  'Bus Stop Search': [
    "Iterate through the stops list using a loop.",
    "Inside the loop, compare the current stop to the target stop (e.g., `if stop == 'Library Stop':`). Stop or print when a match is found."
  ],
  'Average Practice Score': [
    "Sum all the numbers in your scores list and find the total count of scores.",
    "Use `sum(scores) / len(scores)` to calculate the average score dynamically."
  ],
  'Separate Even Roll Numbers': [
    "Use a loop to check each roll number. To check if a number is even, look at the remainder when dividing by 2.",
    "Use the modulo operator: `if roll % 2 == 0:` to identify even numbers."
  ],
  'Capitalize Name Tags': [
    "Loop through each lowercase name in the list.",
    "Apply string capitalization. You can use the `.title()` method to capitalize the first letter of each name, e.g. `name.title()`."
  ],
  'Find Missing Homework': [
    "Convert your student lists into sets using `set()`.",
    "Use the subtraction operator (`-`) or `.difference()` between the full class set and the submitted set to identify who is missing."
  ],
  'Reusable Discount Rule': [
    "Define a function with the `def` keyword, e.g. `def apply_discount(bill):`.",
    "Perform the math inside, and make sure to return the resulting price using `return discounted_price`."
  ],
  'Mini Quiz Checker': [
    "Define a function that accepts two inputs: the learner's answer and the correct answer.",
    "Use the equality comparison operator `==` inside the function, and return the boolean result (`True` or `False`)."
  ],
  'Step Counter Function': [
    "Create a function using `def total_steps(steps_list):`.",
    "Use the `sum()` function on the input list inside the function, and return that sum."
  ],
  'Safe Username Maker': [
    "Define a function that takes a full name string as an argument.",
    "Convert the name to lowercase using `.lower()` and replace spaces using `.replace(' ', '')`. Return the sanitized username."
  ],
  'Retry Until Valid': [
    "Use a `while` loop that continues running as long as the user's input is negative or zero.",
    "Check: `while user_input <= 0:` and ask for input again inside the loop body, then stop when a positive number is entered."
  ],
  'Simple Score Report': [
    "Define a function that accepts a name string and a score integer.",
    "Inside the function, package them into a dictionary like `{'student_name': name, 'score': score}` and return it."
  ],
  'Task Status Updater': [
    "Access the task dictionary at the status key using bracket notation: `task['status']`.",
    "Use the assignment operator `=` to assign a new value: `task['status'] = 'done'` to mutate the task object."
  ],
  'Small Receipt Builder': [
    "Define a function that accepts item name and item price.",
    "Return a formatted string using f-strings, e.g. `return f'{item}: ${price}'`."
  ],
  'Choose Next Scenario': [
    "Define a function that evaluates a score. Use `if`, `elif`, and `else` blocks.",
    "Return the appropriate difficulty tier ('Builder', 'Explorer', or 'Beginner') based on the score threshold branches."
  ],
  'Reflection Keyword Finder': [
    "Use the membership operator `in` to search for words in a text.",
    "Write: `if 'confused' in reflection_text:` to test if a key word appears in the learner's reflection statement."
  ]
};

export const getScenarioHint = (scenarioTitle, hintIndex = 0) => {
  const hints = hintsMap[scenarioTitle] || ["Write a script that matches the objectives listed above."];
  return hints[Math.min(hintIndex, hints.length - 1)];
};
