const keywords = [
  ['False', '🌑', 'Boolean', 'Represents a false Boolean value', 'is_open = False'],
  ['None', '⭕', 'Special Value', 'Represents the absence of a value', 'result = None'],
  ['True', '☀️', 'Boolean', 'Represents a true Boolean value', 'is_ready = True'],
  ['and', '🔗', 'Logic', 'Requires both connected conditions to be true', 'if age >= 18 and has_id:'],
  ['as', '🏷️', 'Modules', 'Gives an imported module or name an alternate name', 'import pandas as pd'],
  ['assert', '🛡️', 'Checking', 'Checks that a condition is true and raises an error if it is not', 'assert score >= 0'],
  ['async', '⚡', 'Async', 'Marks an asynchronous function or context', 'async def fetch_data():'],
  ['await', '⏳', 'Async', 'Waits for an asynchronous operation inside an async context', 'result = await get_data()'],
  ['break', '🛑', 'Loop Control', 'Immediately stops the nearest loop', 'if item == "exit":\n    break'],
  ['case', '🧩', 'Pattern Matching', 'Defines a pattern branch inside a match statement', 'match command:\n    case "start":'],
  ['class', '🏛️', 'OOP', 'Starts the definition of a class', 'class Student:\n    pass'],
  ['continue', '⏭️', 'Loop Control', 'Skips the rest of the current loop iteration', 'if page == 2:\n    continue'],
  ['def', '📜', 'Functions', 'Starts the definition of a function', 'def greet(name):\n    print(name)'],
  ['del', '🗑️', 'Objects', 'Deletes a name, item, attribute, or slice', 'del books[0]'],
  ['elif', '🔀', 'Decision', 'Checks another condition when earlier if conditions are false', 'elif score >= 50:'],
  ['else', '↪️', 'Decision', 'Provides the alternative block when a condition or branch is not selected', 'else:\n    print("Try again")'],
  ['except', '🧯', 'Exceptions', 'Handles an exception raised by code in a try block', 'try:\n    risky()\nexcept ValueError:'],
  ['finally', '🔚', 'Exceptions', 'Runs after try/except processing, whether an exception occurs or not', 'finally:\n    close_file()'],
  ['for', '🌀', 'Loops', 'Iterates through items of an iterable', 'for book in books:\n    print(book)'],
  ['from', '📥', 'Modules', 'Selects names from a module when used with import', 'from math import sqrt'],
  ['global', '🌍', 'Scope', 'Declares that a name in a function refers to a global variable', 'global counter'],
  ['if', '🚪', 'Decision', 'Runs a block when its condition is true', 'if score >= 50:\n    print("Pass")'],
  ['import', '📚', 'Modules', 'Brings a module into the program', 'import math'],
  ['in', '🔎', 'Membership', 'Tests membership or is used to iterate through an iterable', 'if "Python" in books:'],
  ['is', '👁️', 'Identity', 'Tests whether two references point to the same object', 'if value is None:'],
  ['lambda', '⚙️', 'Functions', 'Creates a small anonymous function expression', 'double = lambda x: x * 2'],
  ['match', '🎯', 'Pattern Matching', 'Starts structural pattern matching', 'match command:'],
  ['nonlocal', '🪆', 'Scope', 'Refers to a variable in an enclosing function scope', 'nonlocal count'],
  ['not', '🔄', 'Logic', 'Reverses the truth value of a Boolean expression', 'if not locked:'],
  ['or', '⚖️', 'Logic', 'Combines conditions where at least one can be true', 'if red or blue:'],
  ['pass', '⏸️', 'Placeholder', 'Does nothing and can be used as a placeholder for an empty block', 'def future_feature():\n    pass'],
  ['raise', '🚨', 'Exceptions', 'Raises an exception intentionally', 'raise ValueError("Invalid")'],
  ['return', '↩️', 'Functions', 'Ends a function and optionally sends a value back', 'return a + b'],
  ['try', '🧪', 'Exceptions', 'Starts a block of code where exceptions can be handled', 'try:\n    risky_code()'],
  ['while', '♾️', 'Loops', 'Repeats a block while its condition remains true', 'while lives > 0:'],
  ['with', '📦', 'Context', 'Wraps code in a context manager for controlled resource handling', 'with open("book.txt") as f:'],
  ['yield', '🌱', 'Generators', 'Produces a value from a generator and pauses its execution', 'yield number']
].map(([word, icon, category, explanation, code]) => ({ word, icon, category, explanation, code }));

const learningOrder = [
  'True', 'False', 'None', 'if', 'else', 'elif', 'for', 'while', 'break', 'continue',
  'def', 'return', 'import', 'from', 'as', 'in', 'and', 'or', 'not', 'is',
  'pass', 'class', 'del', 'try', 'except', 'finally', 'raise', 'assert', 'with',
  'lambda', 'yield', 'global', 'nonlocal', 'match', 'case', 'async', 'await'
];

function shuffle(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

const orderedKeywords = learningOrder.map(word => keywords.find(k => k.word === word)).filter(Boolean);

const questionVariants = {
  True: [
    { mission: 'A lantern is ready. Use the keyword that represents a true Boolean value.', code: `is_ready = True\nif is_ready:\n    print("Lantern on")`, steps: ['Python stores the Boolean value True in is_ready.', 'The if statement checks the value of is_ready.', 'True makes the condition succeed.', 'Python enters the indented block and prints “Lantern on”.'], intro: 'True represents a Boolean value that means yes, on, or a condition that is true.' },
    { mission: 'The librarian marks a book as available. Identify the Boolean keyword that means the condition is true.', code: `available = True\nprint(available)`, steps: ['Python assigns True to available.', 'True is a Boolean value, not a string.', 'print receives the value stored in available.', 'Python displays True.'], intro: 'Use True when a Boolean condition or flag should represent a true state.' }
  ],
  False: [
    { mission: 'A book is locked. Use the Boolean keyword that represents a false state.', code: `locked = False\nif not locked:\n    print("Open")`, steps: ['Python stores False in locked.', 'not reverses the Boolean value for the condition.', 'not False becomes True.', 'Python prints “Open”.'], intro: 'False represents a Boolean value that means no, off, or a condition that is not true.' },
    { mission: 'The lamp is not glowing. Which keyword represents this false state?', code: `lamp_on = False\nprint(lamp_on)`, steps: ['Python assigns False to lamp_on.', 'False is a Boolean value.', 'print receives lamp_on.', 'Python displays False.'], intro: 'False is the Boolean value used for a false condition or state.' }
  ],
  None: [
    { mission: 'A shelf has no selected book yet. Use the keyword that represents no value.', code: `selected_book = None\nprint(selected_book)`, steps: ['Python creates the variable selected_book.', 'None means that no actual value has been assigned.', 'print receives the None value.', 'Python displays None.'], intro: 'None is used when a value is intentionally absent or not available.' },
    { mission: 'The librarian has no result yet. Which keyword should represent the missing value?', code: `result = None\nif result is None:\n    print("Nothing found")`, steps: ['Python stores None in result.', 'The is keyword checks whether result refers to None.', 'The comparison is true because result is None.', 'Python prints “Nothing found”.'], intro: 'None is commonly used as a clear marker for “no value yet”.' }
  ],
  if: [
    { mission: 'The first gate opens only when the visitor is old enough. Find the decision keyword.', code: `age = 20\nif age >= 18:\n    print("Gate opened")`, steps: ['Python stores 20 in age.', 'if checks whether age is at least 18.', 'The condition is true.', 'Python runs the indented print statement.'], intro: 'if starts a conditional block that runs when its condition is true.' },
    { mission: 'The librarian wants to show a welcome message only when a visitor has a pass.', code: `has_pass = True\nif has_pass:\n    print("Welcome")`, steps: ['Python stores True in has_pass.', 'if checks the value of has_pass.', 'The value is True, so the condition succeeds.', 'Python prints “Welcome”.'], intro: 'if lets a program make a decision based on a condition.' }
  ],
  else: [
    { mission: 'The visitor does not meet the first condition. Choose the keyword for the alternative path.', code: `age = 15\nif age >= 18:\n    print("Enter")\nelse:\n    print("Wait")`, steps: ['Python stores 15 in age.', 'The if condition age >= 18 is false.', 'Python skips the if block and moves to else.', 'Python prints “Wait”.'], intro: 'else provides the alternative block when the if condition is false.' },
    { mission: 'A spell needs a fallback message when the first choice fails.', code: `password_ok = False\nif password_ok:\n    print("Unlocked")\nelse:\n    print("Try again")`, steps: ['Python stores False in password_ok.', 'The if condition is false.', 'Python selects the else block.', 'Python prints “Try again”.'], intro: 'else is the fallback branch of an if statement.' }
  ],
  elif: [
    { mission: 'The first score check failed, so the librarian checks one more condition.', code: `score = 65\nif score >= 90:\n    print("Gold")\nelif score >= 60:\n    print("Silver")`, steps: ['Python stores 65 in score.', 'The first if condition is false.', 'elif checks the next condition, score >= 60.', 'That condition is true, so Python prints “Silver”.'], intro: 'elif lets Python test another condition after an earlier if condition is false.' },
    { mission: 'Choose the keyword that checks another possibility between if and else.', code: `temp = 20\nif temp > 30:\n    print("Hot")\nelif temp > 15:\n    print("Warm")\nelse:\n    print("Cold")`, steps: ['Python stores 20 in temp.', 'The if condition is false.', 'elif checks whether temp is greater than 15.', 'That condition is true, so Python prints “Warm”.'], intro: 'Use elif for additional conditional branches.' }
  ],
  for: [
    { mission: 'Read every book on the shelf one by one. Which keyword creates the loop?', code: `books = ["AI", "DBMS", "Python"]\nfor book in books:\n    print(book)`, steps: ['Python creates the list of three books.', 'for takes the next item from books.', 'That item is assigned to book.', 'Python prints book and repeats until all items are processed.'], intro: 'for repeats code for each item in an iterable such as a list.' },
    { mission: 'The librarian wants to count through five shelves.', code: `for shelf in range(5):\n    print(shelf)`, steps: ['range(5) provides the values 0 through 4.', 'for takes the next value from the range.', 'That value is stored in shelf.', 'Python prints shelf and repeats for the remaining values.'], intro: 'for is useful when you want to repeat an action for each item or value.' }
  ],
  while: [
    { mission: 'Keep turning the pages while there are still pages left.', code: `pages = 3\nwhile pages > 0:\n    print(pages)\n    pages -= 1`, steps: ['Python starts with pages equal to 3.', 'while checks whether pages > 0.', 'The condition is true, so Python prints pages and subtracts 1.', 'Python checks again and repeats until the condition becomes false.'], intro: 'while repeats a block as long as its condition remains true.' },
    { mission: 'A candle should burn while its fuel is above zero.', code: `fuel = 2\nwhile fuel > 0:\n    print("Burning")\n    fuel -= 1`, steps: ['Python stores 2 in fuel.', 'while checks whether fuel is greater than 0.', 'The loop prints “Burning” and decreases fuel.', 'When fuel reaches 0, the condition is false and the loop stops.'], intro: 'while is condition-controlled repetition.' }
  ],
  break: [
    { mission: 'Stop searching as soon as the missing book is found.', code: `for book in ["Math", "Python", "AI"]:\n    if book == "Python":\n        break\n    print(book)`, steps: ['for starts with the first book.', 'Python checks whether the current book is “Python”.', 'When Python is found, break immediately stops the loop.', 'The loop does not continue to later items.'], intro: 'break exits the nearest loop immediately.' },
    { mission: 'The alarm is triggered. Use the keyword that ends the loop at once.', code: `for level in range(5):\n    if level == 2:\n        break\n    print(level)`, steps: ['The loop starts with level values from range(5).', 'Python checks whether level equals 2.', 'At level 2, break ends the loop.', 'Values after 2 are not processed.'], intro: 'break is used when continuing the loop is no longer necessary.' }
  ],
  continue: [
    { mission: 'Skip the damaged page but keep reading the rest of the book.', code: `for page in range(4):\n    if page == 2:\n        continue\n    print(page)`, steps: ['for produces page values 0, 1, 2 and 3.', 'Python checks whether page is 2.', 'At page 2, continue skips the remaining code for that iteration.', 'The loop continues with page 3.'], intro: 'continue skips the current iteration but keeps the loop running.' },
    { mission: 'Ignore empty shelves while continuing the search.', code: `for shelf in [1, 0, 2]:\n    if shelf == 0:\n        continue\n    print(shelf)`, steps: ['for takes each shelf value in order.', 'Python checks whether the current value is 0.', 'For 0, continue skips print for that iteration.', 'The loop continues and prints the next non-zero value.'], intro: 'continue means “skip this turn and move to the next iteration”.' }
  ],
  def: [
    { mission: 'The librarian wants a reusable spell for greeting visitors.', code: `def greet(name):\n    print("Hello", name)\n\ngreet("Alex")`, steps: ['def creates the greet function with a name parameter.', 'Python finishes defining the function.', 'greet is called with “Alex”.', 'The function body runs and prints the greeting.'], intro: 'def starts a function definition so code can be reused.' },
    { mission: 'Create a reusable spell that multiplies a number by two.', code: `def double(x):\n    return x * 2\n\nprint(double(4))`, steps: ['def defines the double function.', 'Python stores the function definition for later use.', 'double is called with 4.', 'The function calculates and returns 8, which print displays.'], intro: 'def defines a function; the function body runs when the function is called.' }
  ],
  return: [
    { mission: 'A function must send the answer back to the caller.', code: `def add(a, b):\n    return a + b\n\nanswer = add(2, 3)\nprint(answer)`, steps: ['def defines add with two parameters.', 'add is called with 2 and 3.', 'return calculates 5 and sends it back.', 'The returned value is stored in answer and printed.'], intro: 'return ends the function and optionally sends a value back.' },
    { mission: 'A spell should calculate the area and hand the result back.', code: `def area(side):\n    return side * side\n\nprint(area(4))`, steps: ['def defines area with side as a parameter.', 'area is called with 4.', 'return calculates 4 * 4 and sends back 16.', 'print displays the returned value.'], intro: 'return is how a function gives a result back to the code that called it.' }
  ],
  import: [
    { mission: 'The recipe needs the math toolbox before using square root.', code: `import math\nanswer = math.sqrt(25)\nprint(answer)`, steps: ['import brings the math module into the program.', 'Python uses math.sqrt to calculate the square root.', 'The result 5.0 is stored in answer.', 'Python prints answer.'], intro: 'import makes a module available so its tools can be used.' },
    { mission: 'Bring the random toolbox into the library program.', code: `import random\nnumber = random.randint(1, 6)\nprint(number)`, steps: ['import loads the random module.', 'Python calls random.randint with 1 and 6.', 'The generated number is stored in number.', 'Python prints number.'], intro: 'import loads a module so you can use the functionality it provides.' }
  ],
  from: [
    { mission: 'Take only sqrt from the math library.', code: `from math import sqrt\nprint(sqrt(16))`, steps: ['from selects the math module.', 'import brings the sqrt name into the program.', 'sqrt is called with 16.', 'Python prints 4.0.'], intro: 'from is commonly used with import to bring a specific name from a module.' },
    { mission: 'The librarian wants only one tool from the random module.', code: `from random import randint\nprint(randint(1, 3))`, steps: ['from selects the random module.', 'import brings randint into the current namespace.', 'randint generates a value from 1 to 3.', 'Python prints the generated value.'], intro: 'from module import name lets you import a particular name from a module.' }
  ],
  as: [
    { mission: 'Give the math module a shorter nickname.', code: `import math as m\nprint(m.sqrt(9))`, steps: ['Python imports the math module.', 'as gives the imported module the name m.', 'm.sqrt is called with 9.', 'Python prints 3.0.'], intro: 'as creates an alias, or alternate name, for an imported name.' },
    { mission: 'Rename the random toolbox so the code is shorter.', code: `import random as rnd\nprint(rnd.randint(1, 5))`, steps: ['Python imports random.', 'as assigns it the alias rnd.', 'rnd.randint is called.', 'Python prints the generated number.'], intro: 'as is often used to make imported module names shorter or clearer.' }
  ],
  in: [
    { mission: 'Check whether the word Python is inside the book list.', code: `books = ["Python", "AI"]\nif "Python" in books:\n    print("Found")`, steps: ['Python creates the books list.', 'in checks whether “Python” is a member of the list.', 'The membership test is true.', 'Python prints “Found”.'], intro: 'in tests membership and is also used by for loops to iterate over items.' },
    { mission: 'Find out whether a key exists in the library bag.', code: `bag = ["key", "map", "lamp"]\nprint("map" in bag)`, steps: ['Python creates the bag list.', 'in checks whether “map” appears in the list.', 'The item is present, so the expression becomes True.', 'print displays True.'], intro: 'in answers the question “is this item inside this collection?”' }
  ],
  and: [
    { mission: 'Both the password and key must be correct to open the vault.', code: `password_ok = True\nkey_ok = True\nif password_ok and key_ok:\n    print("Vault open")`, steps: ['Python stores True in both flags.', 'and combines the two conditions.', 'Both conditions are true, so the combined condition is true.', 'Python prints “Vault open”.'], intro: 'and makes a combined condition true only when both sides are true.' },
    { mission: 'The door opens only when the visitor has a pass and an ID.', code: `has_pass = True\nhas_id = True\nif has_pass and has_id:\n    print("Enter")`, steps: ['Python stores the two Boolean values.', 'and checks both conditions together.', 'Both are True, so the if condition succeeds.', 'Python prints “Enter”.'], intro: 'and requires all connected conditions to be true.' }
  ],
  or: [
    { mission: 'Either the red key or the blue key can open the chest.', code: `red_key = False\nblue_key = True\nif red_key or blue_key:\n    print("Chest open")`, steps: ['Python stores the two key states.', 'or combines the two conditions.', 'At least one condition is True.', 'Python prints “Chest open”.'], intro: 'or makes a combined condition true when at least one side is true.' },
    { mission: 'The alarm sounds if the window or the door is open.', code: `window_open = True\ndoor_open = False\nif window_open or door_open:\n    print("Alarm")`, steps: ['Python stores the two Boolean states.', 'or checks whether at least one is true.', 'window_open is True, so the combined condition is true.', 'Python prints “Alarm”.'], intro: 'or is useful when any one of several conditions is enough.' }
  ],
  not: [
    { mission: 'The door opens when it is not locked.', code: `locked = False\nif not locked:\n    print("Open")`, steps: ['Python stores False in locked.', 'not reverses the Boolean value.', 'not False becomes True.', 'Python runs the if block and prints “Open”.'], intro: 'not reverses a Boolean condition: True becomes False and False becomes True.' },
    { mission: 'Show a warning only when the lamp is not on.', code: `lamp_on = False\nif not lamp_on:\n    print("Turn on the lamp")`, steps: ['Python stores False in lamp_on.', 'not reverses the value to True.', 'The if condition succeeds.', 'Python prints the warning.'], intro: 'not is used when you want to test the opposite of a Boolean condition.' }
  ],
  is: [
    { mission: 'Check whether the result is exactly the special None object.', code: `result = None\nif result is None:\n    print("No result")`, steps: ['Python stores None in result.', 'is checks object identity with None.', 'result refers to None, so the test is true.', 'Python prints “No result”.'], intro: 'is tests whether two references point to the same object; it is commonly used with None.' },
    { mission: 'Two names point to the same list. Test their identity.', code: `books = []\nother = books\nprint(books is other)`, steps: ['Python creates one empty list and stores its reference in books.', 'other is assigned the same list object.', 'is checks whether both names refer to the same object.', 'Python prints True.'], intro: 'is checks identity, not ordinary value equality.' }
  ],
  pass: [
    { mission: 'Leave an empty function room ready for a spell you will write later.', code: `def future_spell():\n    pass\n\nprint("Ready")`, steps: ['def starts the function definition.', 'Python needs an indented statement inside the function.', 'pass does nothing and keeps the block syntactically valid.', 'The program continues and prints “Ready”.'], intro: 'pass is a do-nothing statement often used as a placeholder.' },
    { mission: 'Create an empty class before adding its details.', code: `class Book:\n    pass\n\nprint("Class ready")`, steps: ['class starts the Book class definition.', 'The class body cannot be empty.', 'pass supplies a valid placeholder statement.', 'Python finishes the class definition.'], intro: 'pass lets you create an intentionally empty block while keeping valid Python syntax.' }
  ],
  class: [
    { mission: 'Create a blueprint for books in the library.', code: `class Book:\n    def __init__(self, title):\n        self.title = title`, steps: ['class starts the Book class definition.', 'The __init__ method describes object initialization.', 'A title is received and stored on self.title.', 'Python can now create Book objects from this blueprint.'], intro: 'class starts a class definition, which is a blueprint for creating objects.' },
    { mission: 'Create a simple Student blueprint for the library records.', code: `class Student:\n    def __init__(self, name):\n        self.name = name`, steps: ['class starts the Student definition.', '__init__ describes how a Student object is initialized.', 'The name parameter is stored on the object.', 'The class can now be used to create Student objects.'], intro: 'class is used to define custom object types and their behavior.' }
  ],
  del: [
    { mission: 'Remove the first book from the shelf list.', code: `books = ["Old", "New"]\ndel books[0]\nprint(books)`, steps: ['Python creates the books list.', 'del targets the item at index 0.', 'The first item is removed from the list.', 'Python prints the remaining list.'], intro: 'del removes a name, item, attribute, or slice.' },
    { mission: 'Delete a temporary variable after the spell is finished.', code: `temp = 42\ndel temp\nprint("Cleaned")`, steps: ['Python creates the name temp.', 'del removes the name temp.', 'The deleted name is no longer available.', 'Python continues to the next statement and prints “Cleaned”.'], intro: 'del can remove a name from the current namespace.' }
  ],
  try: [
    { mission: 'A risky conversion may fail. Start the protected section with the correct keyword.', code: `try:\n    number = int("abc")\nexcept ValueError:\n    print("Invalid")`, steps: ['Python enters the try block.', 'int("abc") attempts a conversion and raises ValueError.', 'Python leaves the try block because an exception occurred.', 'The matching except block handles the error.'], intro: 'try begins a block where exceptions can be caught and handled.' },
    { mission: 'Protect a file operation that might fail.', code: `try:\n    value = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide")`, steps: ['Python enters the try block.', '10 / 0 raises ZeroDivisionError.', 'Python looks for a matching exception handler.', 'The except block prints the safe message.'], intro: 'Use try around code that may raise an exception.' }
  ],
  except: [
    { mission: 'Catch the error from a bad number conversion.', code: `try:\n    number = int("abc")\nexcept ValueError:\n    number = 0\nprint(number)`, steps: ['Python enters try and attempts the conversion.', 'int("abc") raises ValueError.', 'except catches the matching ValueError.', 'number becomes 0 and Python prints it.'], intro: 'except handles an exception raised inside a corresponding try block.' },
    { mission: 'Handle division by zero without crashing the program.', code: `try:\n    answer = 8 / 0\nexcept ZeroDivisionError:\n    answer = 0\nprint(answer)`, steps: ['Python attempts 8 / 0 inside try.', 'ZeroDivisionError is raised.', 'except catches that specific exception.', 'answer becomes 0 and is printed.'], intro: 'except lets you provide a response when a specific exception occurs.' }
  ],
  finally: [
    { mission: 'The archive door must close whether the operation succeeds or fails.', code: `try:\n    print("Reading")\nfinally:\n    print("Close archive")`, steps: ['Python enters the try block and prints “Reading”.', 'The try block finishes.', 'finally runs after the try processing.', 'Python prints “Close archive”.'], intro: 'finally contains cleanup code that runs after try/except processing.' },
    { mission: 'Always switch off the library lamp after the attempt.', code: `try:\n    print("Working")\nfinally:\n    print("Lamp off")`, steps: ['Python starts the try block.', 'The work message is printed.', 'Python reaches the finally block.', 'The cleanup message is printed.'], intro: 'finally is commonly used for actions that should happen regardless of success or failure.' }
  ],
  raise: [
    { mission: 'Stop the spell deliberately when the age is invalid.', code: `age = -1\nif age < 0:\n    raise ValueError("Invalid age")`, steps: ['Python stores -1 in age.', 'if checks whether age is below 0.', 'The condition is true, so raise creates a ValueError.', 'Python stops normal execution unless the exception is handled elsewhere.'], intro: 'raise intentionally triggers an exception.' },
    { mission: 'Signal an error when a required book title is missing.', code: `title = ""\nif not title:\n    raise ValueError("Title required")`, steps: ['Python stores an empty string in title.', 'not title evaluates to True.', 'raise creates a ValueError with a message.', 'The exception is sent to the surrounding error-handling mechanism.'], intro: 'raise is used when your program needs to report an exceptional situation itself.' }
  ],
  assert: [
    { mission: 'The library expects the score never to be negative.', code: `score = 80\nassert score >= 0\nprint("Valid")`, steps: ['Python stores 80 in score.', 'assert checks whether score >= 0 is true.', 'The condition is true, so no exception is raised.', 'Python continues and prints “Valid”.'], intro: 'assert checks an assumption; if the condition is false, Python raises AssertionError.' },
    { mission: 'Make sure the visitor has a valid ID before continuing.', code: `has_id = True\nassert has_id\nprint("Continue")`, steps: ['Python stores True in has_id.', 'assert checks the value of has_id.', 'The assertion succeeds.', 'Python continues and prints “Continue”.'], intro: 'assert is useful for checking conditions that should always be true at that point in the program.' }
  ],
  with: [
    { mission: 'Open the old book safely and let Python manage the resource.', code: `with open("book.txt") as f:\n    text = f.read()\nprint("Read complete")`, steps: ['with enters the file context and opens book.txt.', 'as gives the opened file object the name f.', 'f.read() reads the file contents.', 'Leaving the with block lets Python perform the context manager cleanup.'], intro: 'with manages a context and is commonly used for safe resource handling such as files.' },
    { mission: 'Use a file context so the archive file is handled cleanly.', code: `with open("notes.txt", "w") as file:\n    file.write("Python")`, steps: ['with opens notes.txt for writing.', 'as gives the file object the name file.', 'file.write writes “Python”.', 'Leaving the block closes the file automatically.'], intro: 'with is useful when setup and cleanup should happen automatically.' }
  ],
  lambda: [
    { mission: 'Create a tiny spell that doubles a number without naming a full function.', code: `double = lambda x: x * 2\nprint(double(5))`, steps: ['lambda creates a small anonymous function.', 'The function receives x = 5.', 'The expression x * 2 produces 10.', 'print displays 10.'], intro: 'lambda creates a small anonymous function expression.' },
    { mission: 'Make a quick one-line spell that adds two numbers.', code: `add = lambda a, b: a + b\nprint(add(2, 4))`, steps: ['lambda creates a small function with a and b.', 'add is called with 2 and 4.', 'The expression calculates 6.', 'print displays 6.'], intro: 'lambda is useful for short functions that can be expressed as one expression.' }
  ],
  yield: [
    { mission: 'A generator should hand out one book number at a time.', code: `def books():\n    yield 1\n    yield 2`, steps: ['def defines the generator function.', 'yield 1 produces the first value and pauses execution.', 'When resumed, execution continues to the next statement.', 'yield 2 produces the next value and pauses again.'], intro: 'yield produces a value from a generator and pauses its execution so it can resume later.' },
    { mission: 'Create a generator that gives the next shelf number only when requested.', code: `def shelves():\n    for n in range(2):\n        yield n`, steps: ['def defines the shelves generator.', 'for prepares the values 0 and 1.', 'yield produces one value and pauses the generator.', 'Resuming the generator continues the loop and yields the next value.'], intro: 'yield is useful when values should be produced lazily, one at a time.' }
  ],
  global: [
    { mission: 'A function must update the library-wide counter instead of creating a local one.', code: `counter = 0\ndef add_book():\n    global counter\n    counter += 1`, steps: ['Python creates the global counter with value 0.', 'def defines add_book.', 'global tells Python that counter inside the function refers to the global name.', 'counter is increased when add_book runs.'], intro: 'global lets a function assign to a variable defined in the global scope.' },
    { mission: 'Let the function change the shared visitor count.', code: `visitors = 10\ndef new_visitor():\n    global visitors\n    visitors += 1`, steps: ['visitors starts as a global variable.', 'def creates new_visitor.', 'global visitors connects the function to the outer global name.', 'The function increases the shared count by 1.'], intro: 'Use global sparingly when a function truly needs to modify a global variable.' }
  ],
  nonlocal: [
    { mission: 'An inner spell should update a variable from its enclosing function.', code: `def outer():\n    count = 0\n    def inner():\n        nonlocal count\n        count += 1\n    inner()\n    return count`, steps: ['outer creates the enclosing variable count.', 'inner is defined inside outer.', 'nonlocal tells inner to use outer’s count.', 'inner increases count, and outer returns the updated value.'], intro: 'nonlocal lets a nested function assign to a variable in an enclosing function scope.' },
    { mission: 'A nested counter should remember its enclosing value.', code: `def make_counter():\n    value = 0\n    def next_value():\n        nonlocal value\n        value += 1\n        return value\n    return next_value`, steps: ['make_counter creates the enclosing value variable.', 'next_value is defined inside make_counter.', 'nonlocal connects value to the enclosing scope.', 'Each call can update and return that remembered value.'], intro: 'nonlocal is used for variables in an enclosing function scope, not the global scope.' }
  ],
  match: [
    { mission: 'Choose the pattern-matching keyword that starts the command check.', code: `command = "open"\nmatch command:\n    case "open":\n        print("Door opened")`, steps: ['Python stores “open” in command.', 'match starts structural pattern matching on command.', 'Python tests the available case patterns.', 'The matching case runs and prints “Door opened”.'], intro: 'match starts a structural pattern-matching statement.' },
    { mission: 'A library command can have several patterns. Start the pattern check.', code: `symbol = "+"\nmatch symbol:\n    case "+":\n        print("Add")\n    case "-":\n        print("Subtract")`, steps: ['Python stores “+” in symbol.', 'match begins pattern matching on symbol.', 'Python compares the value with the case patterns.', 'The “+” case matches and prints “Add”.'], intro: 'match chooses among patterns based on the value being inspected.' }
  ],
  case: [
    { mission: 'Inside a match statement, define the branch for the “open” command.', code: `command = "open"\nmatch command:\n    case "open":\n        print("Open")`, steps: ['match begins checking the command.', 'case defines the “open” pattern branch.', 'The command value matches that pattern.', 'Python runs the indented branch and prints “Open”.'], intro: 'case defines an individual pattern branch inside match.' },
    { mission: 'Add a pattern branch for the “quit” command.', code: `command = "quit"\nmatch command:\n    case "quit":\n        print("Goodbye")`, steps: ['Python stores “quit” in command.', 'match begins pattern matching.', 'case defines the “quit” pattern.', 'The pattern matches and Python prints “Goodbye”.'], intro: 'case describes one possible pattern and the code to run when it matches.' }
  ],
  async: [
    { mission: 'Mark a function as asynchronous so it can work with await.', code: `async def fetch_book():\n    return "Python"`, steps: ['async marks the function as asynchronous.', 'def defines fetch_book.', 'The function body returns the string when executed in the async context.', 'The async function can be awaited by its caller.'], intro: 'async marks a function or context as asynchronous.' },
    { mission: 'Create an asynchronous library task.', code: `async def read_catalog():\n    print("Reading catalog")`, steps: ['async marks read_catalog as an asynchronous function.', 'def defines the function name and body.', 'The body contains the catalog action.', 'The function can participate in asynchronous execution.'], intro: 'async is used with asynchronous code, commonly alongside await.' }
  ],
  await: [
    { mission: 'Wait for the asynchronous book search to finish.', code: `async def find_book():\n    result = await get_book()\n    return result`, steps: ['async defines an asynchronous function.', 'await pauses this coroutine until get_book() produces a result.', 'The result is stored in result.', 'return sends the completed result back.'], intro: 'await waits for an asynchronous operation inside an async context.' },
    { mission: 'Wait for the library data before returning it.', code: `async def load_data():\n    data = await fetch_data()\n    return data`, steps: ['async defines load_data as asynchronous.', 'await waits for fetch_data to complete.', 'The completed data is assigned to data.', 'return sends the data back.'], intro: 'await is used to pause an async function until an awaitable operation completes.' }
  ]
};

const puzzleBank = shuffle(learningOrder).slice(0, 5).map(word => ({ word, variants: questionVariants[word] }));
const puzzles = puzzleBank.map(item => {
  const v = item.variants[Math.floor(Math.random() * item.variants.length)];
  return {
    word: item.word,
    icon: (keywords.find(k => k.word === item.word) || {}).icon || '🧩',
    title: `Keyword Puzzle: ${item.word}`,
    ...v
  };
});

let xp = 0, score = 0, discovered = new Set(), currentPuzzle = 0, currentSteps = [], draggedIndex = null, activeCategory = 'All';
const xpEl = document.getElementById('xp');
const grid = document.getElementById('keywordGrid');

function addXP(n) {
  xp += n;
  xpEl.textContent = xp;
}

function esc(t) {
  return t.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderFilters() {
  const cats = ['All', ...new Set(keywords.map(k => k.category))];
  const f = document.getElementById('keywordFilter');
  f.innerHTML = cats.map(c =>
    `<button class="filter-btn ${c === activeCategory ? 'active' : ''}" data-category="${c}">${c}</button>`
  ).join('');
  f.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      activeCategory = b.dataset.category;
      renderFilters();
      renderKeywords();
    };
  });
}

function renderKeywords() {
  const list = activeCategory === 'All'
    ? orderedKeywords
    : orderedKeywords.filter(k => k.category === activeCategory);

  grid.innerHTML = list.map(k => `
    <article class="keyword-card" data-word="${k.word}">
      <div class="key-symbol">${k.icon}</div>
      <h3>${k.word}</h3>
      <div class="keyword-meta">
        <span class="meta-chip category-chip">${k.category}</span>
      </div>
      <div class="keyword-detail">
        <strong>${k.explanation}</strong>
        <pre><code>${esc(k.code)}</code></pre>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.keyword-card').forEach(card => {
    card.onclick = () => {
      const w = card.dataset.word;
      const open = card.classList.contains('open');
      grid.querySelectorAll('.keyword-card').forEach(c => c.classList.remove('open'));
      if (!open) {
        card.classList.add('open');
        if (!discovered.has(w)) {
          discovered.add(w);
          addXP(5);
          updateDiscovery();
        }
      }
    };
  });
}

function updateDiscovery() {
  document.getElementById('discovered').textContent = discovered.size;
  document.getElementById('totalKeywords').textContent = keywords.length;
}

function loadPuzzle() {
  const p = puzzles[currentPuzzle];
  document.getElementById('puzzleCount').textContent = `Question ${currentPuzzle + 1} / ${puzzles.length}`;
  document.getElementById('score').textContent = score;
  document.getElementById('puzzleIcon').textContent = p.icon;
  document.getElementById('puzzleTitle').textContent = p.title;
  document.getElementById('puzzleMission').textContent = p.mission;
  document.getElementById('puzzleCode').textContent = p.code;
  document.getElementById('puzzleFeedback').textContent = '';
  document.getElementById('puzzleFeedback').className = 'feedback';
  document.getElementById('solutionPanel').classList.add('hidden');
  document.getElementById('nextPuzzle').classList.add('hidden');
  document.getElementById('checkPuzzle').classList.remove('hidden');
  currentSteps = shuffle(p.steps);
  renderSteps();
}

function renderSteps() {
  const box = document.getElementById('stepPuzzle');
  box.innerHTML = '';
  currentSteps.forEach((step, i) => {
    const card = document.createElement('div');
    card.className = 'step-card';
    card.draggable = true;
    card.dataset.index = i;
    card.innerHTML = `
      <span class="drag-handle">⠿</span>
      <span class="step-number">${i + 1}</span>
      <span class="step-text">${step}</span>
    `;
    card.ondragstart = () => {
      draggedIndex = i;
      card.classList.add('dragging');
    };
    card.ondragend = () => {
      draggedIndex = null;
      card.classList.remove('dragging');
    };
    card.ondragover = e => {
      e.preventDefault();
      card.classList.add('drag-over');
    };
    card.ondragleave = () => card.classList.remove('drag-over');
    card.ondrop = e => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const t = +card.dataset.index;
      if (draggedIndex === null || draggedIndex === t) return;
      [currentSteps[draggedIndex], currentSteps[t]] = [currentSteps[t], currentSteps[draggedIndex]];
      renderSteps();
    };
    box.appendChild(card);
  });
}

function showSolution() {
  const p = puzzles[currentPuzzle];
  document.getElementById('solutionIntro').textContent = p.intro;
  document.getElementById('solutionSteps').innerHTML = p.steps
    .map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${s}</li>`)
    .join('');
  document.getElementById('solutionPanel').classList.remove('hidden');
  document.getElementById('puzzleFeedback').textContent =
    '💡 Solution revealed. Use it to understand the code, then try the puzzle again.';
  document.getElementById('puzzleFeedback').className = 'feedback';
}

document.getElementById('checkPuzzle').onclick = () => {
  const correct = puzzles[currentPuzzle].steps;
  const ok = currentSteps.every((s, i) => s === correct[i]);
  const fb = document.getElementById('puzzleFeedback');
  if (ok) {
    score += 20;
    addXP(20);
    document.getElementById('score').textContent = score;
    fb.textContent = '✨ Perfect! You rebuilt the execution path correctly.';
    fb.className = 'feedback good';
    document.querySelectorAll('.step-card').forEach(c => {
      c.classList.add('solved');
      c.draggable = false;
    });
    document.getElementById('checkPuzzle').classList.add('hidden');
    document.getElementById('nextPuzzle').classList.remove('hidden');
  } else {
    fb.textContent = '🔎 Not quite. Try again, or use “Show Solution” if you are stuck.';
    fb.className = 'feedback bad';
  }
};

document.getElementById('resetPuzzle').onclick = () => {
  currentSteps = shuffle(puzzles[currentPuzzle].steps);
  draggedIndex = null;
  document.getElementById('puzzleFeedback').textContent = '';
  document.getElementById('puzzleFeedback').className = 'feedback';
  document.getElementById('solutionPanel').classList.add('hidden');
  renderSteps();
};

document.getElementById('showSolution').onclick = showSolution;

document.getElementById('nextPuzzle').onclick = () => {
  currentPuzzle++;
  if (currentPuzzle < puzzles.length) {
    loadPuzzle();
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
  } else {
    showResult();
  }
};

function showResult() {
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  const total = puzzles.length * 20;
  const percent = Math.round((score / total) * 100);
  document.getElementById('finalScore').textContent = `${percent}%`;
  document.getElementById('finalXp').textContent = xp;
  document.getElementById('finalDiscovered').textContent = discovered.size;
  const title = document.getElementById('resultTitle');
  const text = document.getElementById('resultText');
  if (percent >= 85) {
    title.textContent = '🐍 Python Keyword Guardian';
    text.textContent = `Excellent! You solved the full puzzle journey and scored ${percent}%. The Lost Library is fully restored.`;
  } else if (percent >= 60) {
    title.textContent = '📚 Python Code Explorer';
    text.textContent = `Great work! You completed the journey and scored ${percent}%. Review the solution cards and try again to master the trickier ones.`;
  } else {
    title.textContent = '🔎 Curious Python Beginner';
    text.textContent = `You completed the journey and scored ${percent}%. Use the explanations and solutions, then play again with fresh questions.`;
  }
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('startBtn').onclick = () =>
  document.getElementById('quest').scrollIntoView({ behavior: 'smooth' });

document.querySelectorAll('.next-btn').forEach(b => {
  b.onclick = () =>
    document.getElementById(b.dataset.target).scrollIntoView({ behavior: 'smooth' });
});

updateDiscovery();
renderFilters();
renderKeywords();
loadPuzzle();
