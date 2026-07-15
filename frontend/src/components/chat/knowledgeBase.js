// src/components/chat/knowledgeBase.js
// RAG knowledge base — no LLM, no API calls.
// Each topic has a list of { keywords, answer } entries.
// The engine scores each entry by keyword matches and returns the best one.

const KB = {
  variables: [
    {
      keywords: ['variable', 'what is', 'define', 'meaning', 'store', 'store data', 'hold'],
      answer: 'A variable is a name you give to a piece of information so Python can remember it. You write: name = "Alice" — the name is on the left, the = sign stores it, and the value is on the right.',
    },
    {
      keywords: ['=', 'equals', 'assign', 'assignment', 'operator'],
      answer: 'The = sign in Python means "store this value under this name". It does not mean "equal" like in maths. So x = 5 means "store 5 under the name x".',
    },
    {
      keywords: ['name', 'naming', 'rules', 'valid', 'underscore', 'can i', 'allowed'],
      answer: 'Variable names can contain letters, numbers, and underscores (_). They cannot start with a number and cannot have spaces. Good names are descriptive — like student_age or total_price.',
    },
    {
      keywords: ['type', 'int', 'string', 'str', 'float', 'number', 'text', 'automatically'],
      answer: 'Python figures out the type automatically. x = 10 stores an integer, x = "hello" stores text (string), x = 3.14 stores a decimal (float). You never have to say the type yourself.',
    },
    {
      keywords: ['change', 'update', 'reassign', 'overwrite', 'new value'],
      answer: 'You can change a variable\'s value anytime by assigning a new one. x = 5 then x = 10 — now x holds 10. The old value is replaced.',
    },
    {
      keywords: ['multiple', 'two', 'several', 'same line', 'at once'],
      answer: 'You can assign multiple variables at once: a, b, c = 1, 2, 3. Python matches them in order — a gets 1, b gets 2, c gets 3.',
    },
    {
      keywords: ['print', 'display', 'show', 'output', 'see'],
      answer: 'To see a variable\'s value, use print(). For example: name = "Alice" then print(name) will display Alice on screen.',
    },
    {
      keywords: ['difference', 'vs', 'constant', 'final'],
      answer: 'Python does not have built-in constants, but by convention, variables written in ALL_CAPS (like MAX_SIZE = 100) signal to other developers that the value should not be changed.',
    },
    {
      keywords: ['swap', 'exchange', 'switch values', 'without temp'],
      answer: 'Python lets you swap two variables in one line: a, b = b, a. No temporary third variable needed — Python evaluates the right side first, then assigns both at once.',
    },
    {
      keywords: ['del', 'delete variable', 'remove variable', 'undefine'],
      answer: 'del x removes the variable x entirely — trying to use it afterward raises a NameError, because Python has forgotten it ever existed.',
    },
    {
      keywords: ['type()', 'check type', 'what type', 'find out type'],
      answer: 'Use type(x) to see what kind of value a variable holds. type(5) shows <class \'int\'>, type("hi") shows <class \'str\'>, type(3.14) shows <class \'float\'>.',
    },
    {
      keywords: ['none', 'null', 'nothing', 'empty value', 'no value'],
      answer: 'None is Python\'s way of saying "no value here". It is its own type (NoneType), different from 0, False, or an empty string. Variables are often set to None before they have a real value: result = None.',
    },
    {
      keywords: ['boolean', 'bool', 'true', 'false', 'true/false variable'],
      answer: 'A boolean variable holds either True or False (capitalized, no quotes). Example: is_logged_in = True. Booleans are the result of comparisons like x > 5, and are used constantly in conditions.',
    },
    {
      keywords: ['a = b = c', 'chain assignment', 'same value multiple', 'assign same value'],
      answer: 'You can assign the same value to several variables at once: a = b = c = 0. All three now hold 0 — but be careful, if the value is a mutable object like a list, all three names point to the exact same object.',
    },
    {
      keywords: ['+=', '-=', '*=', '/=', 'augmented', 'shorthand', 'increment'],
      answer: 'Augmented assignment operators are shorthand for "update and store". x += 1 means x = x + 1. The same pattern works for -=, *=, /=, //=, %=, and **=.',
    },
    {
      keywords: ['string + number', 'typeerror', 'concatenate error', 'can only concatenate'],
      answer: 'Python won\'t automatically combine text and numbers: "Age: " + 25 raises a TypeError. Convert the number first with str(): "Age: " + str(25), or use an f-string instead: f"Age: {25}".',
    },
    {
      keywords: ['case sensitive', 'capital', 'age vs Age', 'uppercase lowercase name'],
      answer: 'Variable names are case-sensitive: age, Age, and AGE are three completely different variables in Python. This trips a lot of beginners up — stick to one consistent style.',
    },
    {
      keywords: ['snake_case', 'camelcase', 'naming convention', 'style guide', 'pep8'],
      answer: 'Python\'s style guide (PEP 8) recommends snake_case for variable names — lowercase words separated by underscores, like total_price or first_name — not camelCase, which is more common in JavaScript.',
    },
    {
      keywords: ['reserved', 'keyword', 'cannot use as name', 'list as variable name'],
      answer: 'You can\'t use Python keywords (if, for, while, class, list, str, etc.) as variable names — Python reserves them for the language itself. Trying to write list = [1, 2, 3] would work but shadows the built-in list() function, which usually causes confusing bugs later.',
    },
    {
      keywords: ['dynamic typing', 'change type', 'hold different types', 'retype'],
      answer: 'Python variables are dynamically typed — the same name can hold an integer, then later a string, with no error: x = 5 then x = "now text" is totally valid. The variable just points at whatever value it was last assigned.',
    },
    {
      keywords: ['best practice', 'good variable name', 'descriptive', 'single letter'],
      answer: 'Good variable names describe what they hold: student_age is clearer than sa or x. Short names like i, j are fine for loop counters, but anything that matters to the logic deserves a real name.',
    },
    {
      keywords: ['box', 'label', 'analogy', 'real life', 'think of it as'],
      answer: 'A helpful way to picture a variable: it\'s a labeled box. score = 10 puts the value 10 into a box labeled "score". Later, score = 15 doesn\'t create a new box — it just puts a new value into the same labeled box.',
    },
    {
      keywords: ['expression inside f-string', 'calculation in f-string', 'f"{x+1}"', 'math inside'],
      answer: 'f-strings can hold more than just variable names — you can put any expression inside the curly braces: f"Next year you\'ll be {age + 1}" runs the calculation age + 1 and inserts the result directly.',
    },
    {
      keywords: ['nameerror', 'not defined', 'undefined variable', 'used before'],
      answer: 'A NameError ("name \'x\' is not defined") means you tried to use a variable before ever assigning it a value. Double check for typos in the name, and make sure the assignment happens before the line that uses it.',
    },
  ],

  'input-output': [
    {
      keywords: ['input', 'what is', 'how', 'ask', 'user', 'type', 'read'],
      answer: 'input() pauses your program and waits for the user to type something. Whatever they type is returned as text. Example: name = input("What is your name? ")',
    },
    {
      keywords: ['print', 'display', 'show', 'output', 'screen'],
      answer: 'print() displays things on screen. You can print text, numbers, or variables: print("Hello") or print(age) or print("Hello", name).',
    },
    {
      keywords: ['f-string', 'fstring', 'f string', 'format', 'combine', 'variable in text'],
      answer: 'An f-string lets you put variable values inside text. Write f before the quote: print(f"Hello {name}!"). The {name} is replaced by whatever name holds.',
    },
    {
      keywords: ['number', 'integer', 'int', 'convert', 'cast', 'input number'],
      answer: 'input() always returns text, even if the user types a number. To use it as a number, convert it: age = int(input("Enter age: ")). This converts the text "25" to the number 25.',
    },
    {
      keywords: ['multiple', 'several', 'two', 'more than one', 'sep', 'separator'],
      answer: 'print() can display multiple things separated by commas: print(name, age). By default they are separated by a space. Use sep="," to change the separator.',
    },
    {
      keywords: ['newline', 'new line', 'end', 'next line', 'stay same line'],
      answer: 'By default print() adds a new line after each call. To stay on the same line use end="": print("Hello", end="") print("World") prints HelloWorld.',
    },
    {
      keywords: ['prompt', 'message', 'question', 'text inside input'],
      answer: 'The text inside input() is the prompt — it shows the user what to type. Example: city = input("Which city are you from? "). The prompt is optional.',
    },
    {
      keywords: ['sep=', 'separator meaning', 'change separator', 'comma separated print'],
      answer: 'sep= controls what goes between the values you pass to print(). print("a", "b", "c", sep="-") prints a-b-c instead of the default a b c.',
    },
    {
      keywords: ['multiple values one line', 'split()', 'two numbers input', 'input on same line'],
      answer: 'To read several values typed on one line, combine input() with split(): a, b = input("Enter two numbers: ").split(). This splits on spaces and unpacks the results into a and b, both still as text.',
    },
    {
      keywords: ['round', 'decimal places', 'format number', ':.2f', 'two decimal'],
      answer: 'To control how many decimal places print(), use an f-string format spec: f"{price:.2f}" shows exactly two decimal places, e.g. 9.50 instead of 9.5. round(price, 2) does the same rounding on the number itself.',
    },
    {
      keywords: ['print list', 'print dictionary', 'print object directly'],
      answer: 'print() can take any value directly, including a list or dictionary: print([1, 2, 3]) shows [1, 2, 3] exactly as Python represents it internally — useful for quick debugging.',
    },
    {
      keywords: ['blocking', 'wait', 'pause program', 'stop until'],
      answer: 'input() blocks — the program pauses on that line and does absolutely nothing else until the user presses Enter. This is different from print(), which runs instantly.',
    },
    {
      keywords: ['escape character', 'backslash n', 'tab', 'quote inside string', 'special character'],
      answer: 'Backslash escape sequences let you include special characters in a string: \\n is a newline, \\t is a tab, \\\\ is a literal backslash, and \\" lets you put a double-quote inside a double-quoted string.',
    },
    {
      keywords: ['triple quote', 'multi-line string', 'multiple lines text', '\'\'\''],
      answer: 'Triple quotes (either \'\'\' or """) let a string span multiple lines exactly as typed, without needing \\n: message = """Line one\\nLine two""" versus the triple-quoted version which keeps real line breaks.',
    },
    {
      keywords: ['typeerror concatenate', 'str + int error', 'can only concatenate str'],
      answer: 'A very common beginner error: "TypeError: can only concatenate str (not \\"int\\") to str" happens when you try "Age: " + age without converting age to text first. Fix it with str(age) or switch to an f-string.',
    },
    {
      keywords: ['print vs return', 'difference print return', 'confuse print return'],
      answer: 'print() only displays a value on screen — it does not give the value back to your code. return (used inside a function) hands a value back so it can be stored or used elsewhere. Mixing the two up is one of the most common beginner confusions.',
    },
    {
      keywords: ['format()', 'old style format', '.format method'],
      answer: 'Before f-strings existed, Python used .format(): print("Hello {}!".format(name)). f-strings (print(f"Hello {name}!")) do the same thing with less typing and are preferred in modern Python.',
    },
    {
      keywords: ['% formatting', 'percent format', 'printf style'],
      answer: 'Very old Python code sometimes uses %-formatting: print("Hello %s!" % name). It works but is considered outdated — f-strings are the recommended way to build strings with variables today.',
    },
    {
      keywords: ['input always string', 'input returns string', 'why is input text'],
      answer: 'No matter what the user types — even if it looks like a number — input() always hands it back as a string (text). That is why age = input("Age: ") followed by age + 1 raises an error: age is still text, not a number, until you explicitly convert it.',
    },
    {
      keywords: ['float input', 'decimal input', 'input with decimal'],
      answer: 'To read a decimal number from the user, wrap input() in float() instead of int(): price = float(input("Enter price: ")). float() correctly parses text like "9.99" into a real decimal number.',
    },
    {
      keywords: ['print nothing', 'blank line', 'empty print'],
      answer: 'Calling print() with no arguments at all just prints a blank line — handy for adding spacing between sections of output.',
    },
    {
      keywords: ['comma vs plus', 'print comma', 'concatenation in print'],
      answer: 'Inside print(), commas automatically add a space and handle type conversion for you: print("Age:", age) works even if age is a number. Using + instead (print("Age: " + age)) requires age to already be a string, or it raises a TypeError.',
    },
  ],

  operators: [
    {
      keywords: ['operator', 'what is', 'types', 'list', 'kinds'],
      answer: 'Python has arithmetic operators (+, -, *, /, //, %, **), comparison operators (==, !=, >, <, >=, <=), and logical operators (and, or, not).',
    },
    {
      keywords: ['+', 'add', 'addition', 'plus', 'sum'],
      answer: '+ adds two numbers: 3 + 4 gives 7. It also joins (concatenates) two strings: "Hello" + " World" gives "Hello World".',
    },
    {
      keywords: ['-', 'subtract', 'minus', 'subtraction'],
      answer: '- subtracts: 10 - 3 gives 7. For negative numbers, just write -5.',
    },
    {
      keywords: ['*', 'multiply', 'multiplication', 'times'],
      answer: '* multiplies numbers: 4 * 5 gives 20. It also repeats strings: "ha" * 3 gives "hahaha".',
    },
    {
      keywords: ['/', 'divide', 'division'],
      answer: '/ divides and always gives a decimal result: 10 / 2 gives 5.0, not 5. Use // for whole number division.',
    },
    {
      keywords: ['//', 'floor', 'integer division', 'whole number', 'floor division'],
      answer: '// is floor division — it divides and drops the decimal: 17 // 5 gives 3. It rounds down to the nearest whole number.',
    },
    {
      keywords: ['%', 'modulo', 'remainder', 'mod', 'leftover'],
      answer: '% gives the remainder after division: 17 % 5 gives 2 (because 17 = 5×3 + 2). Useful for checking if a number is even: n % 2 == 0.',
    },
    {
      keywords: ['**', 'power', 'exponent', 'squared', 'cubed'],
      answer: '** raises to a power: 2 ** 8 gives 256. 3 ** 2 gives 9 (three squared).',
    },
    {
      keywords: ['==', 'equal', 'equals', 'comparison', 'compare', 'same'],
      answer: '== checks if two values are equal and returns True or False: 5 == 5 gives True, 5 == 6 gives False. Do not confuse with = which stores a value.',
    },
    {
      keywords: ['!=', 'not equal', 'different', 'unequal'],
      answer: '!= checks if two values are NOT equal: 5 != 6 gives True, 5 != 5 gives False.',
    },
    {
      keywords: ['>', '<', 'greater', 'less', 'greater than', 'less than'],
      answer: '> means greater than, < means less than: 10 > 5 gives True, 3 < 2 gives False. >= means greater than or equal, <= means less than or equal.',
    },
    {
      keywords: ['and', 'or', 'not', 'logical', 'both', 'either'],
      answer: '"and" requires both conditions to be True. "or" requires at least one. "not" flips True to False. Example: x > 0 and x < 100 checks if x is between 0 and 100.',
    },
    {
      keywords: ['precedence', 'order of operations', 'pemdas', 'which runs first'],
      answer: 'Python follows the usual maths order of operations: parentheses first, then ** (power), then * / // % (left to right), then + - (left to right). Use parentheses to make your intended order explicit and easier to read.',
    },
    {
      keywords: ['chain comparison', '1 < x < 10', 'chained comparison', 'between'],
      answer: 'Python lets you chain comparisons naturally: 1 < x < 10 checks whether x is between 1 and 10 in one expression — equivalent to (1 < x) and (x < 10), but shorter and reads just like maths notation.',
    },
    {
      keywords: ['is', 'is not', 'identity operator', 'same object'],
      answer: 'is checks whether two variables point to the exact same object in memory, not just whether their values look equal. Use == to compare values (5 == 5.0 is True); use is mainly to check against None: if x is None.',
    },
    {
      keywords: ['in', 'not in', 'membership', 'check list contains'],
      answer: 'in checks whether a value exists inside a list, string, or other collection: "a" in "cat" is True, 5 in [1, 2, 3] is False. not in is the opposite.',
    },
    {
      keywords: ['augmented', '+=', '-=', '*=', '/=', '//=', '%=', '**=', 'shorthand operator'],
      answer: 'Every arithmetic operator has a shorthand "update in place" version: x += 5 means x = x + 5. The same pattern works for -=, *=, /=, //=, %=, and **=.',
    },
    {
      keywords: ['string times number', 'repeat string', 'string multiplication'],
      answer: 'Multiplying a string by a number repeats it: "-" * 20 creates a line of twenty dashes, useful for quick visual separators in printed output.',
    },
    {
      keywords: ['division result type', 'float vs int division', '10/2 is 5.0'],
      answer: 'Regular division (/) in Python 3 always returns a float, even when the numbers divide evenly: 10 / 2 gives 5.0, not 5. Use // if you specifically need a whole-number (int) result.',
    },
    {
      keywords: ['bitwise', '&', '|', '^', '~', '<<', '>>', 'binary operator'],
      answer: 'Bitwise operators (&, |, ^, ~, <<, >>) work directly on the binary representation of numbers. They are an advanced topic mostly used in low-level or performance-critical code, not everyday scripts.',
    },
    {
      keywords: ['comparing different types', 'str vs int comparison', 'compare string number'],
      answer: 'Comparing incompatible types with < or > raises a TypeError: "5" > 3 fails because you cannot say whether text is "greater than" a number. == is safer — "5" == 5 just returns False instead of erroring.',
    },
    {
      keywords: ['short circuit', 'short-circuit', 'stops early', 'and or evaluate'],
      answer: 'Python stops evaluating an and/or expression as soon as the result is already decided. In a and b, if a is False, Python never even looks at b — the whole expression is already False. This is called short-circuit evaluation.',
    },
    {
      keywords: ['not operator', 'negate', 'flip boolean', 'opposite of true'],
      answer: 'not flips a boolean the other way: not True is False, not (x > 5) is True whenever x is 5 or less. It reads naturally in conditions: if not is_ready: means "if it is NOT ready".',
    },
    {
      keywords: ['negative floor division', 'floor division negative numbers'],
      answer: 'Floor division always rounds toward negative infinity, not toward zero: -7 // 2 gives -4, not -3, because -4 is the largest whole number that is still less than or equal to -3.5.',
    },
    {
      keywords: ['plus works on lists', 'operator overloading', '+ on different types'],
      answer: 'The same operator can behave differently depending on the type: + adds numbers, joins strings, and also joins two lists together ([1, 2] + [3, 4] gives [1, 2, 3, 4]). This is called operator overloading.',
    },
  ],

  conditions: [
    {
      keywords: ['if', 'what is', 'how', 'condition', 'conditional', 'decision'],
      answer: 'if runs a block of code only when a condition is True. Example:\nif age >= 18:\n    print("Adult")\nThe indented line only runs if age is 18 or more.',
    },
    {
      keywords: ['else', 'otherwise', 'fallback', 'default'],
      answer: 'else runs when the if condition is False. Example:\nif score >= 50:\n    print("Pass")\nelse:\n    print("Fail")\nOne of the two blocks always runs.',
    },
    {
      keywords: ['elif', 'else if', 'multiple', 'more than two', 'chain'],
      answer: 'elif lets you check multiple conditions in sequence. Python checks each one top to bottom and runs the first one that is True:\nif score >= 90: print("A")\nelif score >= 75: print("B")\nelif score >= 60: print("C")\nelse: print("F")',
    },
    {
      keywords: ['indent', 'indentation', 'spaces', 'tab', 'block'],
      answer: 'Indentation (4 spaces) is how Python knows which lines belong inside an if. Every line inside the if must be indented by the same amount. Missing indentation causes an error.',
    },
    {
      keywords: ['colon', ':', 'syntax', 'error', 'missing'],
      answer: 'The colon : at the end of if, elif, and else is required. It tells Python that the indented block below belongs to this condition. Forgetting it causes a SyntaxError.',
    },
    {
      keywords: ['nested', 'inside', 'if inside if', 'inner'],
      answer: 'You can put an if inside another if — this is called nesting. Each level needs its own indentation:\nif x > 0:\n    if x < 100:\n        print("Between 0 and 100")',
    },
    {
      keywords: ['ternary', 'one line', 'short', 'inline', 'single line'],
      answer: 'Python has a one-line if-else called a ternary expression:\nresult = "pass" if score >= 50 else "fail"\nThis stores "pass" or "fail" in result depending on the score.',
    },
    {
      keywords: ['true', 'false', 'truthy', 'falsy', 'what is true', 'boolean'],
      answer: 'In Python, 0, empty string "", empty list [], and None are treated as False in a condition. Everything else is treated as True. So "if name:" checks if name is not empty.',
    },
    {
      keywords: ['match case', 'switch statement', 'match', 'python switch'],
      answer: 'Python 3.10+ has match-case as an alternative to a long elif chain when comparing one value against many options:\\nmatch day:\\n    case "Mon": print("Start of week")\\n    case "Fri": print("Almost weekend")\\n    case _: print("Regular day")\\nThe case _: is the catch-all default.',
    },
    {
      keywords: ['compare strings', 'string condition', 'if string equals'],
      answer: 'Comparing strings works exactly like numbers: if name == "Alice": checks for an exact match, including capitalization — "alice" and "Alice" are considered different.',
    },
    {
      keywords: ['check multiple values', 'if x in list', 'value in several options'],
      answer: 'Instead of a long chain of or comparisons, check membership in a list: if day in ["Sat", "Sun"]: print("Weekend"). This is shorter and easier to read than day == "Sat" or day == "Sun".',
    },
    {
      keywords: ['early return', 'guard clause', 'exit early'],
      answer: 'A guard clause checks for a problem case first and exits immediately, so the rest of the function does not need deep nesting:\\nif not data:\\n    return None\\n# rest of the function assumes data is valid',
    },
    {
      keywords: ['combine and or not', 'multiple conditions together', 'complex condition'],
      answer: 'You can combine and, or, and not in one condition, using parentheses to group them clearly: if (age >= 18 and has_id) or is_vip: makes the intended grouping obvious rather than relying on default precedence.',
    },
    {
      keywords: ['indentationerror', 'unexpected indent', 'inconsistent indentation'],
      answer: 'An IndentationError means the spacing before a line does not match what Python expects — often from mixing tabs and spaces, or forgetting to indent a line inside an if block. Most editors can be set to insert spaces automatically to avoid this.',
    },
    {
      keywords: ['is none', 'check none', 'if x is none', 'checking for no value'],
      answer: 'To check whether a variable holds no value, use if x is None: rather than if x == None:. is is the conventional and slightly faster way to check specifically for None.',
    },
    {
      keywords: ['ternary example', 'conditional expression', 'inline if else example'],
      answer: 'A ternary reads left to right as "value if condition else other value": status = "adult" if age >= 18 else "minor". It is best kept short — for anything complex, a regular if/else block is more readable.',
    },
    {
      keywords: ['nested vs elif', 'when to nest', 'elif or nested if'],
      answer: 'Use elif when you are checking variations of the same single question (like score ranges). Use nested if when the second check only makes sense after the first condition is already true, and is a genuinely separate question.',
    },
    {
      keywords: ['boolean variable in if', 'if is_valid', 'flag variable condition'],
      answer: 'If a variable already holds True or False, you do not need to compare it: if is_valid: is exactly the same as if is_valid == True:, just cleaner. Use if not is_valid: for the opposite case.',
    },
    {
      keywords: ['float precision', '0.1 + 0.2', 'floating point comparison', 'decimal not equal'],
      answer: 'Because of how computers store decimals, 0.1 + 0.2 == 0.3 actually returns False in Python (the real result is 0.30000000000000004). For decimal comparisons, check if the difference is very small instead: abs(a - b) < 0.0001.',
    },
    {
      keywords: ['empty list falsy', 'empty string falsy', 'if empty list'],
      answer: 'An empty list, empty string, or empty dictionary are all treated as False in a condition. if my_list: is a common, readable way to check "does this list have anything in it?" without writing len(my_list) > 0.',
    },
    {
      keywords: ['pass statement', 'placeholder', 'empty if block', 'do nothing'],
      answer: 'pass is a placeholder that does nothing — useful when Python requires an indented block but you have not written the logic yet: if condition:\\n    pass  # TODO: handle this case later',
    },
    {
      keywords: ['= instead of ==', 'single equals mistake', 'assignment vs comparison'],
      answer: 'Writing if x = 5: (single =) is actually a SyntaxError in Python — unlike some other languages, Python will not silently let you assign inside a condition by accident. It is one thing Python protects you from that other languages do not.',
    },
  ],

  loops: [
    {
      keywords: ['loop', 'what is', 'why', 'purpose', 'use', 'repeat'],
      answer: 'A loop repeats a block of code multiple times without you writing it out again and again. Python has two types: for loops (for a fixed number of repetitions) and while loops (while a condition is true).',
    },
    {
      keywords: ['for', 'for loop', 'how', 'syntax'],
      answer: 'A for loop goes through each item in a sequence:\nfor i in range(5):\n    print(i)\nThis prints 0, 1, 2, 3, 4 — range(5) generates numbers from 0 to 4.',
    },
    {
      keywords: ['while', 'while loop', 'how', 'when to use'],
      answer: 'A while loop keeps running as long as its condition is True:\nn = 1\nwhile n < 100:\n    n = n * 2\nprint(n)\nThis doubles n until it reaches or exceeds 100.',
    },
    {
      keywords: ['range', 'range()', 'start', 'stop', 'step'],
      answer: 'range() generates numbers. range(5) gives 0-4. range(1, 6) gives 1-5. range(0, 10, 2) gives 0, 2, 4, 6, 8 (step of 2). The stop number is never included.',
    },
    {
      keywords: ['break', 'stop', 'exit', 'leave', 'end loop early'],
      answer: 'break immediately exits the loop regardless of the condition:\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)\nThis prints 0 to 4 then stops.',
    },
    {
      keywords: ['continue', 'skip', 'next iteration', 'skip one'],
      answer: 'continue skips the rest of the current iteration and moves to the next one:\nfor i in range(5):\n    if i == 2:\n        continue\n    print(i)\nThis prints 0, 1, 3, 4 — skipping 2.',
    },
    {
      keywords: ['infinite', 'forever', 'never stop', 'infinite loop'],
      answer: 'An infinite loop runs forever because its condition never becomes False. while True: is intentionally infinite — you use break to exit. Accidental infinite loops happen when you forget to update the condition variable.',
    },
    {
      keywords: ['list', 'iterate', 'through', 'each item', 'for each'],
      answer: 'To loop through a list: for item in my_list: print(item). Python automatically gives you each item one by one. You can also get the index: for i, item in enumerate(my_list).',
    },
    {
      keywords: ['nested', 'inside', 'loop inside loop', 'inner loop'],
      answer: 'You can put a loop inside another loop — nested loops. The inner loop completes fully for each iteration of the outer loop. Be careful: they can be slow for large numbers.',
    },
    {
      keywords: ['for vs while', 'difference', 'when', 'choose', 'which'],
      answer: 'Use a for loop when you know how many times you want to repeat (or are going through a list). Use a while loop when you want to keep going until a condition changes.',
    },
    {
      keywords: ['enumerate', 'index and value', 'get index in loop', 'i, item'],
      answer: 'enumerate() gives you both the position and the value while looping: for i, name in enumerate(names): print(i, name). Without it you would have to track the index yourself with a separate counter.',
    },
    {
      keywords: ['zip', 'loop two lists together', 'parallel lists', 'combine two lists loop'],
      answer: 'zip() lets you loop through two lists at the same time, pairing up matching positions: for name, age in zip(names, ages): print(name, age). It stops as soon as the shorter list runs out.',
    },
    {
      keywords: ['loop dictionary', 'for key in dict', 'iterate dictionary'],
      answer: 'Looping over a dictionary directly (for key in my_dict:) gives you the keys one at a time. To get both key and value together, use for key, value in my_dict.items():.',
    },
    {
      keywords: ['reversed', 'loop backwards', 'reverse order loop'],
      answer: 'reversed() lets you loop through a sequence back to front: for item in reversed(my_list): print(item) — without actually changing the order of the original list.',
    },
    {
      keywords: ['list comprehension shorthand', 'loop in one line', 'compact loop'],
      answer: 'A list comprehension is a compact way to build a list using a loop-like syntax in one line: squares = [x**2 for x in range(10)] does the same thing as a full for loop that appends to a list, just shorter.',
    },
    {
      keywords: ['forgot to update counter', 'infinite loop bug', 'loop never ends'],
      answer: 'The most common accidental infinite loop happens with a while loop where the variable in the condition never changes inside the loop body — for example forgetting n += 1 inside while n < 10:. Always double-check that something inside the loop moves it toward the stopping condition.',
    },
    {
      keywords: ['break only exits inner', 'nested loop break', 'break in nested loop'],
      answer: 'break only exits the loop it is directly inside — in a nested loop, break in the inner loop does not affect the outer loop at all, which keeps running normally.',
    },
    {
      keywords: ['while true break', 'infinite loop with break', 'while true pattern'],
      answer: 'while True: paired with an if...break inside is a common pattern when you do not know in advance how many times you will loop — like repeatedly asking for input until it is valid:\\nwhile True:\\n    answer = input("yes or no? ")\\n    if answer in ["yes", "no"]:\\n        break',
    },
    {
      keywords: ['loop fixed number of times', 'repeat n times', 'range(n) loop'],
      answer: 'To repeat something exactly n times without caring about the number itself, loop over range(n) and ignore the loop variable (often named _ by convention): for _ in range(5): print("Hi").',
    },
    {
      keywords: ['range with step', 'skip numbers loop', 'every other number'],
      answer: 'The third argument to range() is the step size: range(0, 20, 5) gives 0, 5, 10, 15. A negative step counts down: range(10, 0, -1) gives 10 down to 1.',
    },
    {
      keywords: ['off by one', 'one too many', 'one too few', 'range off by one'],
      answer: 'A very common bug is looping one time too many or too few — remembering that range(5) stops BEFORE 5 (giving 0-4) trips people up. If you need to include the last number, use range(1, n + 1) instead of range(1, n).',
    },
    {
      keywords: ['modify list while looping', 'change list during iteration', 'remove item while looping'],
      answer: 'Removing or adding items to a list while looping over it directly can skip items or cause errors, because the list is changing size mid-loop. Loop over a copy instead: for item in my_list.copy(): or build a new list rather than modifying the original in place.',
    },
    {
      keywords: ['sum with loop vs built-in', 'sum() function', 'total with loop'],
      answer: 'You can total a list by looping and adding, but Python already provides sum(my_list), max(my_list), and min(my_list) as built-in functions — they are faster and clearer than writing the loop yourself for these common cases.',
    },
  ],

  functions: [
    {
      keywords: ['function', 'what is', 'define', 'why', 'purpose'],
      answer: 'A function is a named block of code you write once and reuse many times. You define it with def, give it a name, and describe what it should do. Then call it by name whenever needed.',
    },
    {
      keywords: ['def', 'define', 'create', 'syntax', 'how to write'],
      answer: 'To define a function:\ndef greet(name):\n    print(f"Hello, {name}!")\ngreet("Alice")  # calling it\ngreet("Bob")\ndef is the keyword, greet is the name, name is the parameter.',
    },
    {
      keywords: ['parameter', 'argument', 'input', 'pass', 'pass in'],
      answer: 'Parameters are the names listed inside the brackets in the def line. Arguments are the actual values you pass when calling the function. def add(a, b) — a and b are parameters. add(3, 5) — 3 and 5 are arguments.',
    },
    {
      keywords: ['return', 'give back', 'result', 'output', 'value back'],
      answer: 'return sends a value back to whoever called the function:\ndef square(n):\n    return n * n\nresult = square(4)  # result is 16\nWithout return, the function gives back None.',
    },
    {
      keywords: ['scope', 'local', 'global', 'inside', 'outside', 'access'],
      answer: 'Variables created inside a function are local — they only exist while the function runs. Variables outside are global. Functions can read globals but to change them you need the global keyword.',
    },
    {
      keywords: ['default', 'default value', 'optional', 'optional parameter'],
      answer: 'You can give parameters default values:\ndef greet(name, greeting="Hello"):\n    print(f"{greeting}, {name}!")\ngreet("Alice") uses the default "Hello". greet("Alice", "Hi") uses "Hi".',
    },
    {
      keywords: ['multiple return', 'return two', 'return more', 'return multiple'],
      answer: 'A function can return multiple values separated by commas — Python packs them into a tuple:\ndef min_max(lst):\n    return min(lst), max(lst)\nsmall, big = min_max([3, 1, 9, 2])',
    },
    {
      keywords: ['call', 'invoke', 'run', 'execute', 'use function'],
      answer: 'To call (use) a function, write its name followed by brackets with any arguments: result = square(5). The function runs, does its job, and returns the result.',
    },
    {
      keywords: ['lambda', 'anonymous', 'one line function'],
      answer: 'A lambda is a tiny one-line function without a name:\ndouble = lambda x: x * 2\nprint(double(5))  # 10\nUseful for simple operations but for anything complex use a regular def.',
    },
    {
      keywords: ['docstring', 'documentation', 'describe function', 'triple quote comment'],
      answer: 'A docstring is a triple-quoted string right after the def line, describing what the function does:\ndef area(radius):\n    """Returns the area of a circle given its radius."""\n    return 3.14159 * radius ** 2\nTools and other developers can read this to understand the function without reading all its code.',
    },
    {
      keywords: ['*args', '**kwargs', 'variable arguments', 'any number of arguments'],
      answer: '*args lets a function accept any number of extra positional arguments (collected into a tuple), and **kwargs collects any number of extra named arguments (into a dictionary):\ndef total(*numbers):\n    return sum(numbers)\ntotal(1, 2, 3, 4)  # works with any amount of numbers',
    },
    {
      keywords: ['recursion', 'recursive function', 'function calls itself'],
      answer: 'A recursive function calls itself to solve a smaller version of the same problem, until it reaches a simple base case:\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\nEvery recursive function needs a base case, or it will call itself forever.',
    },
    {
      keywords: ['side effect', 'pure function', 'no side effects'],
      answer: 'A pure function only depends on its inputs and only communicates through its return value — it does not print, modify global variables, or change anything outside itself. Pure functions are easier to test and reason about.',
    },
    {
      keywords: ['mutable default argument', 'def f(x=[])', 'default list gotcha'],
      answer: 'A famous Python gotcha: def add_item(item, my_list=[]): reuses the SAME list across every call that does not pass one in, because default arguments are only created once. Use None instead and create the list inside: def add_item(item, my_list=None): if my_list is None: my_list = [].',
    },
    {
      keywords: ['keyword argument', 'named argument', 'call with name='],
      answer: 'Keyword arguments let you pass values by name instead of position: greet(name="Alice", greeting="Hi") — this works even if you list them in a different order than the function defines them, because Python matches by name.',
    },
    {
      keywords: ['function as first class', 'pass function as argument', 'higher order function'],
      answer: 'In Python, functions are values just like numbers or strings — you can store them in variables, pass them into other functions, or return them. A function that takes another function as an argument (like sorted(list, key=some_function)) is called a higher-order function.',
    },
    {
      keywords: ['built-in function', 'user-defined function', 'difference builtin custom'],
      answer: 'Built-in functions like print(), len(), and range() come with Python and are always available. User-defined functions are ones you write yourself with def. Both are called exactly the same way.',
    },
    {
      keywords: ['function naming convention', 'snake_case function name'],
      answer: 'Like variables, function names should use snake_case: calculate_total() not calculateTotal(). The name should describe what the function does, ideally starting with a verb: get_average(), send_email().',
    },
    {
      keywords: ['function returns none', 'no return statement', 'implicit none'],
      answer: 'If a function never hits a return statement (or has none at all), it automatically returns None when it finishes. This trips people up when they expect a value back but forgot to write return.',
    },
    {
      keywords: ['closure', 'nested function', 'function inside function'],
      answer: 'A function defined inside another function is a nested function, and if it remembers variables from the outer function even after that function has finished, it is called a closure. This is an intermediate topic used for things like custom decorators.',
    },
    {
      keywords: ['type hint', 'annotation', 'def f(x: int)'],
      answer: 'Type hints are optional notes about what types a function expects and returns: def add(a: int, b: int) -> int: return a + b. Python does not enforce them at runtime, but they help other developers (and tools) understand your code.',
    },
    {
      keywords: ['test function', 'unit test', 'check function works'],
      answer: 'A simple way to check a function works as expected is to call it with known inputs and compare the result: assert square(4) == 16. Larger projects use testing frameworks like pytest to automate this across many cases.',
    },
  ],

  lists: [
    {
      keywords: ['list', 'what is', 'define', 'create', 'make'],
      answer: 'A list holds multiple items in order under one name. Create one with square brackets:\nfruits = ["apple", "banana", "mango"]\nItems can be any type and the list can grow or shrink.',
    },
    {
      keywords: ['index', 'access', 'get item', 'position', 'element'],
      answer: 'Access items by position (index), starting from 0:\nfruits = ["apple", "banana", "mango"]\nfruits[0] is "apple", fruits[1] is "banana", fruits[-1] is "mango" (last item).',
    },
    {
      keywords: ['append', 'add', 'add item', 'insert', 'push'],
      answer: 'append() adds to the end: my_list.append("new item")\ninsert() adds at a position: my_list.insert(1, "new item") inserts at index 1.\nextend() adds all items from another list.',
    },
    {
      keywords: ['remove', 'delete', 'pop', 'del'],
      answer: 'remove("value") deletes the first matching item.\npop() removes and returns the last item. pop(0) removes the first.\ndel my_list[2] deletes the item at index 2.',
    },
    {
      keywords: ['length', 'len', 'count', 'how many', 'size'],
      answer: 'len(my_list) returns the number of items in the list:\nfruits = ["apple", "banana", "mango"]\nprint(len(fruits))  # 3',
    },
    {
      keywords: ['loop', 'iterate', 'through', 'for each', 'go through'],
      answer: 'Loop through a list with for:\nfor fruit in fruits:\n    print(fruit)\nOr with index: for i in range(len(fruits)): print(i, fruits[i])',
    },
    {
      keywords: ['sort', 'sorted', 'order', 'ascending', 'descending'],
      answer: 'sort() sorts the list in place (modifies original):\nmy_list.sort() — ascending\nmy_list.sort(reverse=True) — descending\nsorted(my_list) returns a new sorted list without changing the original.',
    },
    {
      keywords: ['slice', 'slicing', 'part', 'portion', 'subset', ':'],
      answer: 'Slicing gets a portion of a list:\nmy_list[1:4] — items from index 1 to 3 (not including 4)\nmy_list[:3] — first 3 items\nmy_list[2:] — from index 2 to end\nmy_list[::-1] — reversed',
    },
    {
      keywords: ['in', 'contains', 'check', 'exists', 'member', 'is in'],
      answer: 'Check if an item is in a list using "in":\nif "apple" in fruits:\n    print("Yes!")\n"not in" checks the opposite.',
    },
    {
      keywords: ['list comprehension', 'comprehension', 'one line', 'create from'],
      answer: 'List comprehension creates a new list in one line:\nsquares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]\nWith condition: evens = [x for x in range(10) if x % 2 == 0]',
    },
    {
      keywords: ['negative index', 'last item', 'fruits[-1]', 'index from end'],
      answer: 'Negative indexes count from the end of the list: my_list[-1] is the last item, my_list[-2] is the second-to-last. This avoids having to calculate len(my_list) - 1 to reach the end.',
    },
    {
      keywords: ['copy list', 'shallow copy', 'my_list2 = my_list', 'copying pitfall'],
      answer: 'Writing new_list = old_list does NOT copy the list — both names point to the exact same list, so changing one changes the other. To get an actual independent copy, use new_list = old_list.copy() or new_list = list(old_list).',
    },
    {
      keywords: ['nested list', '2d list', 'list of lists', 'grid'],
      answer: 'A list can contain other lists, useful for grids or tables: grid = [[1, 2], [3, 4]]. Access an inner item with two indexes: grid[0][1] gives 2 (row 0, column 1).',
    },
    {
      keywords: ['extend vs append', 'difference extend append', 'add whole list'],
      answer: 'append(x) adds x as a single new item, even if x is a list — my_list.append([1,2]) adds one item that is itself a list. extend(x) adds each item from x individually — my_list.extend([1,2]) adds two separate items, 1 and 2.',
    },
    {
      keywords: ['reverse()', 'reverse list in place', 'flip list order'],
      answer: 'my_list.reverse() flips the order of the list in place (changes the original). If you want a reversed copy without changing the original, use my_list[::-1] instead.',
    },
    {
      keywords: ['count()', 'count occurrences', 'how many times in list'],
      answer: 'my_list.count(value) tells you how many times a value appears in the list: [1, 2, 2, 3].count(2) returns 2.',
    },
    {
      keywords: ['index()', 'find position', 'where is item in list'],
      answer: 'my_list.index(value) returns the position of the first matching item: ["a", "b", "c"].index("b") returns 1. It raises a ValueError if the value is not found at all.',
    },
    {
      keywords: ['min max sum list', 'largest smallest total', 'aggregate list'],
      answer: 'Python has built-in functions for common list summaries: sum(my_list) totals the numbers, max(my_list) finds the largest, min(my_list) finds the smallest — no loop needed.',
    },
    {
      keywords: ['multiply list', '[0]*5', 'repeat list', 'list times number'],
      answer: 'Multiplying a list by a number repeats its contents: [0] * 5 gives [0, 0, 0, 0, 0]. Handy for quickly creating a list of a fixed size filled with the same starting value.',
    },
    {
      keywords: ['check empty list', 'is list empty', 'if not my_list'],
      answer: 'The cleanest way to check if a list has anything in it is if my_list: (True when it has items) or if not my_list: (True when empty) — no need to compare against len(my_list) == 0.',
    },
    {
      keywords: ['join list into string', 'list to string', 'combine list items text'],
      answer: '"separator".join(my_list) combines a list of strings into one string: ", ".join(["apple", "banana"]) gives "apple, banana". All items in the list must already be strings — convert numbers first with str().',
    },
    {
      keywords: ['list vs tuple vs set vs dict', 'which collection to use', 'compare data structures'],
      answer: 'Use a list when order matters and you need to change it. Use a tuple when the data should not change. Use a set when you need automatic duplicate removal and do not care about order. Use a dictionary when you need to look things up by name (key) instead of position.',
    },
    {
      keywords: ['clear list', 'empty a list', 'remove all items'],
      answer: 'my_list.clear() removes every item, leaving an empty list [] behind — the list itself still exists, it is just now empty, which is different from setting my_list = None.',
    },
    {
      keywords: ['list of different types', 'mixed types list', 'can list hold different'],
      answer: 'A single list can hold different types of values at once: mixed = [1, "two", 3.0, True] is completely valid Python — there is no requirement that every item be the same type.',
    },
  ],

  tuples: [
    {
      keywords: ['tuple', 'what is', 'define', 'create', 'make'],
      answer: 'A tuple is like a list but it cannot be changed after creation. Create one with round brackets:\ncoords = (10, 20)\ndate = (15, 8, 1990)',
    },
    {
      keywords: ['immutable', 'cannot change', 'fixed', 'locked', 'modify'],
      answer: 'Tuples are immutable — once created, you cannot add, remove, or change items. Trying to do so gives a TypeError. This is intentional — use tuples for data that must stay fixed.',
    },
    {
      keywords: ['unpack', 'unpacking', 'destructure', 'separate', 'extract'],
      answer: 'Unpacking assigns each item to a separate variable:\nx, y, z = (1, 2, 3)\nNow x is 1, y is 2, z is 3. The number of variables must match the number of items.',
    },
    {
      keywords: ['index', 'access', 'get item', 'position'],
      answer: 'Access tuple items the same way as a list — by index starting at 0:\ncoords = (10, 20)\nprint(coords[0])  # 10\nprint(coords[1])  # 20',
    },
    {
      keywords: ['list vs tuple', 'difference', 'when', 'choose', 'which'],
      answer: 'Use a tuple when the data should not change (coordinates, dates, RGB colours). Use a list when you need to add, remove, or update items. Tuples are slightly faster than lists.',
    },
    {
      keywords: ['one item', 'single', 'one element', 'trailing comma'],
      answer: 'A tuple with one item needs a trailing comma, otherwise Python treats the brackets as grouping:\nsingle = (42,)  # this is a tuple\nnot_tuple = (42)  # this is just the number 42',
    },
    {
      keywords: ['length', 'len', 'count', 'how many', 'size'],
      answer: 'len() works on tuples just like lists:\ncoords = (10, 20, 30)\nprint(len(coords))  # 3',
    },
    {
      keywords: ['loop', 'iterate', 'for', 'through'],
      answer: 'You can loop through a tuple exactly like a list:\nfor item in my_tuple:\n    print(item)',
    },
    {
      keywords: ['why use tuple', 'benefit tuple over list', 'why tuple instead of list', 'tuple instead of', 'instead of a list'],
      answer: 'Tuples signal intent: writing coords = (10, 20) tells anyone reading your code that this pair should never change. They are also slightly faster than lists and use a little less memory, since Python knows their contents are fixed.',
    },
    {
      keywords: ['tuple as dictionary key', 'hashable', 'can tuple be key'],
      answer: 'Tuples can be used as dictionary keys (lists cannot) because tuples are immutable and therefore hashable: locations = {(0, 0): "origin", (1, 1): "corner"}. This is a common way to key data by coordinate pairs.',
    },
    {
      keywords: ['return tuple from function', 'multiple return values tuple'],
      answer: 'When a function does return a, b, it is actually returning a single tuple (a, b) behind the scenes. That is why you can unpack the result directly: x, y = get_coordinates().',
    },
    {
      keywords: ['named tuple', 'namedtuple', 'tuple with field names'],
      answer: 'A namedtuple (from the collections module) lets you access tuple items by name instead of just position: Point = namedtuple("Point", ["x", "y"]); p = Point(3, 4); p.x gives 3. It is an intermediate topic worth knowing exists.',
    },
    {
      keywords: ['concatenate tuples', 'combine tuples', 'add two tuples'],
      answer: 'Like lists, tuples can be joined with +: (1, 2) + (3, 4) gives (1, 2, 3, 4). This creates a brand new tuple rather than modifying either original one, since tuples cannot be modified anyway.',
    },
    {
      keywords: ['nested tuple', 'tuple inside tuple', 'tuple of tuples'],
      answer: 'Tuples can contain other tuples: points = ((0, 0), (3, 4)). Access an inner value with two indexes: points[1][0] gives 3.',
    },
    {
      keywords: ['convert list to tuple', 'tuple() function', 'list to tuple and back'],
      answer: 'tuple(my_list) converts a list into a tuple, and list(my_tuple) converts it back. This is handy when you need a temporarily-locked version of a list, e.g. to use as a dictionary key.',
    },
    {
      keywords: ['tuple methods', 'count index on tuple'],
      answer: 'Tuples only have two built-in methods, since they cannot be changed: count(value) tells you how many times a value appears, and index(value) tells you its position — both work exactly like the list versions.',
    },
    {
      keywords: ['single element tuple mistake', 'forgot comma tuple', 'why is my tuple a number'],
      answer: 'A very common mistake: writing x = (5) thinking it makes a tuple — it does not, it is just the number 5 in parentheses. You need the trailing comma: x = (5,) to actually create a one-item tuple.',
    },
    {
      keywords: ['extended unpacking', 'star unpacking', 'a, *rest = tuple'],
      answer: 'You can unpack part of a tuple and collect the rest with a star: first, *rest = (1, 2, 3, 4) gives first = 1 and rest = [2, 3, 4] (note rest becomes a list, not a tuple).',
    },
    {
      keywords: ['compare tuples', 'tuple equality', 'are two tuples equal'],
      answer: 'Two tuples are equal if they have the same items in the same order: (1, 2) == (1, 2) is True, but (1, 2) == (2, 1) is False. Comparison happens item by item, left to right.',
    },
  ],

  dictionaries: [
    {
      keywords: ['dictionary', 'dict', 'what is', 'define', 'create'],
      answer: 'A dictionary stores information as labelled pairs. Each label (key) points to a value:\nperson = {"name": "Alice", "age": 30}\nYou look things up by label, not by position.',
    },
    {
      keywords: ['key', 'value', 'key-value', 'pair'],
      answer: 'Each entry in a dictionary is a key-value pair separated by a colon. Keys must be unique. Values can be any type:\nd = {"colour": "blue", "size": 42, "active": True}',
    },
    {
      keywords: ['access', 'get', 'lookup', 'retrieve', 'find'],
      answer: 'Access a value using its key in square brackets:\nprint(person["name"])  # Alice\nOr safely with .get() which returns None instead of an error if the key is missing:\nperson.get("email")  # None',
    },
    {
      keywords: ['add', 'insert', 'new key', 'new entry'],
      answer: 'Add a new key-value pair by assigning to a new key:\nperson["email"] = "alice@example.com"\nIf the key already exists, its value is updated.',
    },
    {
      keywords: ['update', 'change', 'modify', 'edit'],
      answer: 'Update a value by assigning to an existing key:\nperson["age"] = 31\nOr use update() to add/update multiple pairs at once:\nperson.update({"age": 31, "city": "Delhi"})',
    },
    {
      keywords: ['delete', 'remove', 'del', 'pop'],
      answer: 'del person["age"] removes the key entirely.\nperson.pop("age") removes it and returns the value.\nperson.clear() removes everything.',
    },
    {
      keywords: ['keys', 'values', 'items', 'all keys', 'list keys'],
      answer: 'person.keys() returns all keys.\nperson.values() returns all values.\nperson.items() returns all key-value pairs as tuples.\nThese are useful for looping.',
    },
    {
      keywords: ['loop', 'iterate', 'through', 'for each', 'go through'],
      answer: 'Loop through a dictionary:\nfor key in person:\n    print(key, person[key])\nOr: for key, value in person.items():\n    print(key, value)',
    },
    {
      keywords: ['check', 'in', 'exists', 'has key', 'contains'],
      answer: 'Check if a key exists using "in":\nif "name" in person:\n    print("Name is set")\nThis checks keys, not values.',
    },
    {
      keywords: ['nested', 'dictionary inside', 'nested dict'],
      answer: 'Dictionary values can themselves be dictionaries:\nstudent = {"name": "Alice", "marks": {"maths": 90, "science": 85}}\nAccess nested values: student["marks"]["maths"]  # 90',
    },
    {
      keywords: ['dict comprehension', 'dictionary comprehension', 'build dict in one line'],
      answer: 'A dict comprehension builds a dictionary in one line, similar to a list comprehension: squares = {x: x**2 for x in range(5)} gives {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}.',
    },
    {
      keywords: ['get() default value', 'get with fallback', 'safe lookup default'],
      answer: 'get() lets you supply a fallback value if the key does not exist: person.get("email", "not provided") returns "not provided" instead of None or raising an error, which is often more useful.',
    },
    {
      keywords: ['setdefault', 'set if missing', 'add if not exists'],
      answer: 'setdefault(key, value) returns the existing value if the key is already there, or sets and returns the given value if it is not: counts.setdefault("apple", 0) ensures "apple" has a starting count without overwriting an existing one.',
    },
    {
      keywords: ['merge dictionaries', 'combine two dicts', 'dict update or pipe', 'merge two', 'combine two dictionaries'],
      answer: 'Merge two dictionaries with update() (modifies the first one in place): dict_a.update(dict_b). In modern Python (3.9+) you can also use the pipe operator to create a new merged dictionary: merged = dict_a | dict_b.',
    },
    {
      keywords: ['length of dictionary', 'len(dict)', 'how many keys'],
      answer: 'len(my_dict) returns the number of key-value pairs in the dictionary — the same len() function used for lists and strings.',
    },
    {
      keywords: ['pop with default', 'pop key safely', 'remove key no error'],
      answer: 'person.pop("age", None) removes the key "age" and returns its value, but returns None instead of raising an error if the key does not exist — safer than a plain pop() when you are not sure the key is there.',
    },
    {
      keywords: ['insertion order', 'dictionary order', 'do dicts keep order'],
      answer: 'Since Python 3.7, dictionaries remember the order keys were added in — looping over a dictionary will visit keys in that same order, not randomly. This was not guaranteed in much older Python versions.',
    },
    {
      keywords: ['dictionary vs list when to use', 'list or dict choose'],
      answer: 'Use a dictionary when you need to look things up by a meaningful name (like a username or product code). Use a list when order and position matter more than naming each item individually.',
    },
    {
      keywords: ['chained nested access', 'multiple brackets dict', 'deep dictionary access'],
      answer: 'You can chain as many key lookups as needed for deeply nested data: data["users"][0]["address"]["city"] — just make sure every level actually exists, or you will hit a KeyError partway through.',
    },
    {
      keywords: ['create dict from two lists', 'zip into dictionary', 'dict from lists'],
      answer: 'zip() combined with dict() turns two parallel lists into a dictionary: dict(zip(names, ages)) pairs up each name with the matching age from the same position in each list.',
    },
    {
      keywords: ['keyerror', 'key not found', 'dictionary key error'],
      answer: 'A KeyError happens when you use square brackets to look up a key that does not exist: person["email"] raises an error if "email" was never set. Use .get("email") instead if the key might be missing, so it returns None rather than crashing.',
    },
    {
      keywords: ['copy dictionary', 'shallow copy dict', 'copying pitfall dict'],
      answer: 'Just like lists, writing new_dict = old_dict does not make a real copy — both names point to the same dictionary. Use new_dict = old_dict.copy() to get an independent copy you can safely modify.',
    },
    {
      keywords: ['sort dictionary by value', 'order dict by value', 'sorted items'],
      answer: 'Dictionaries themselves cannot be sorted, but you can get a sorted list of their items: sorted(person.items(), key=lambda pair: pair[1]) sorts the key-value pairs by value.',
    },
    {
      keywords: ['count with dictionary', 'counting pattern', 'tally with dict'],
      answer: 'A dictionary is the classic way to count things: counts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\nThis builds a tally of how many times each word appears.',
    },
  ],

  sets: [
    {
      keywords: ['set', 'what is', 'define', 'create', 'make'],
      answer: 'A set holds unique items — duplicates are automatically removed. Create one with curly braces:\ns = {1, 2, 3, 2, 1}  # becomes {1, 2, 3}\nOr from a list: s = set(my_list)',
    },
    {
      keywords: ['unique', 'duplicate', 'remove duplicate', 'only once'],
      answer: 'Sets automatically keep only unique values. If you try to add a duplicate, nothing happens — no error, no extra copy. This makes sets perfect for deduplication.',
    },
    {
      keywords: ['add', 'insert', 'new item'],
      answer: 'add() adds a single item to a set:\ns = {1, 2, 3}\ns.add(4)  # now {1, 2, 3, 4}\ns.add(2)  # nothing changes — 2 is already there',
    },
    {
      keywords: ['remove', 'delete', 'discard', 'pop'],
      answer: 'remove("item") deletes an item — raises an error if not found.\ndiscard("item") deletes silently if found, does nothing if not.\npop() removes and returns an arbitrary item (sets have no order).',
    },
    {
      keywords: ['union', '|', 'combine', 'all items', 'together'],
      answer: 'Union combines all items from both sets (no duplicates):\na = {1, 2, 3}\nb = {3, 4, 5}\na | b  # {1, 2, 3, 4, 5}\nOr: a.union(b)',
    },
    {
      keywords: ['intersection', '&', 'common', 'both', 'shared'],
      answer: 'Intersection finds items that appear in BOTH sets:\na = {1, 2, 3}\nb = {2, 3, 4}\na & b  # {2, 3}\nOr: a.intersection(b)',
    },
    {
      keywords: ['difference', '-', 'only in one', 'not in other'],
      answer: 'Difference finds items in one set but NOT in the other:\na = {1, 2, 3}\nb = {2, 3, 4}\na - b  # {1} — items in a but not in b\nb - a  # {4} — items in b but not in a',
    },
    {
      keywords: ['order', 'ordered', 'index', 'position', 'access by index'],
      answer: 'Sets have NO guaranteed order — you cannot access items by index. s[0] will cause an error. If you need order, use a list or sorted(s) to convert.',
    },
    {
      keywords: ['check', 'in', 'member', 'contains', 'exists'],
      answer: 'Check membership with "in" — this is very fast for sets:\nif "Alice" in names_set:\n    print("Found!")\nSets are much faster than lists for membership checks on large data.',
    },
    {
      keywords: ['empty set', 'create empty set', 'set() not curly braces'],
      answer: 'To create an empty set you must use set(), not {} — empty curly braces actually create an empty dictionary in Python: empty_set = set() is correct, empty_dict = {} is what you get if you try {}.',
    },
    {
      keywords: ['frozenset', 'immutable set', 'set that cannot change'],
      answer: 'A frozenset is an immutable version of a set — once created it cannot be changed, which makes it usable as a dictionary key or inside another set (regular sets cannot be, since they are mutable).',
    },
    {
      keywords: ['set comprehension', 'build set in one line'],
      answer: 'A set comprehension works just like a list comprehension but with curly braces: unique_lengths = {len(word) for word in words} builds a set of all the different word lengths, with duplicates automatically removed.',
    },
    {
      keywords: ['symmetric difference', '^', 'items in either but not both'],
      answer: 'Symmetric difference (^) finds items that are in exactly one of the two sets, but not both: {1, 2, 3} ^ {2, 3, 4} gives {1, 4} — the items that are NOT shared.',
    },
    {
      keywords: ['subset', 'superset', 'issubset', 'issuperset'],
      answer: 'a.issubset(b) checks whether every item in a is also in b. a.issuperset(b) checks the opposite — whether a contains everything in b. {1, 2}.issubset({1, 2, 3}) is True.',
    },
    {
      keywords: ['convert list to set remove duplicates', 'dedupe list', 'unique items from list'],
      answer: 'The fastest way to remove duplicates from a list is set(my_list) — since a set cannot hold duplicates, converting drops them automatically. Convert back with list(set(my_list)) if you need a list again, though the order may change.',
    },
    {
      keywords: ['set vs list performance', 'set faster than list', 'lookup speed'],
      answer: 'Checking if something "is in" a set is dramatically faster than checking a list, especially for large collections — sets use a hashing technique that finds items almost instantly, while a list has to check items one by one.',
    },
    {
      keywords: ['clear() set', 'empty a set', 'remove all set items'],
      answer: 's.clear() removes every item from a set, leaving it empty but still a valid set object — different from setting s = None.',
    },
    {
      keywords: ['copy() set', 'copying a set', 'shallow copy set'],
      answer: 'Like lists and dictionaries, writing new_set = old_set does not create an independent copy — both names refer to the same set. Use new_set = old_set.copy() to get a true separate copy.',
    },
    {
      keywords: ['set no order guaranteed', 'sets unordered', 'why is my set order different'],
      answer: 'Sets do not preserve the order you added items in, and printing the same set twice might even show items in a different order — never rely on a specific order when working with a set.',
    },
    {
      keywords: ['set equality', 'compare two sets', 'are sets equal'],
      answer: 'Two sets are equal if they contain exactly the same items, regardless of the order they were added in: {1, 2, 3} == {3, 2, 1} is True.',
    },
    {
      keywords: ['update() set', 'union in place', 'add multiple items to set'],
      answer: 's.update(other_set) adds every item from other_set into s directly (modifying s in place) — like union(), but it changes the original set instead of returning a new one.',
    },
  ],

  'string-handling': [
    {
      keywords: ['string', 'what is', 'text', 'define', 'create'],
      answer: 'A string is a sequence of characters (letters, numbers, symbols) enclosed in quotes. You can use single or double quotes:\nname = "Alice"\ngreeting = \'Hello\'',
    },
    {
      keywords: ['length', 'len', 'count', 'how many', 'characters'],
      answer: 'len() returns the number of characters:\nprint(len("Hello"))  # 5\nSpaces count as characters: len("Hi there") is 8.',
    },
    {
      keywords: ['upper', 'uppercase', 'lower', 'lowercase', 'title', 'case'],
      answer: '"hello".upper() → "HELLO"\n"HELLO".lower() → "hello"\n"hello world".title() → "Hello World"\n"hello".capitalize() → "Hello" (only first letter)',
    },
    {
      keywords: ['strip', 'trim', 'whitespace', 'spaces', 'remove spaces'],
      answer: 'strip() removes spaces (and newlines) from both ends:\n"  hello  ".strip()  → "hello"\nlstrip() removes only from the left, rstrip() only from the right.',
    },
    {
      keywords: ['split', 'separate', 'divide', 'words', 'list from string'],
      answer: 'split() breaks a string into a list of parts:\n"hello world".split()  → ["hello", "world"]\n"a,b,c".split(",")  → ["a", "b", "c"]\nDefault separator is whitespace.',
    },
    {
      keywords: ['join', 'combine', 'merge', 'list to string'],
      answer: 'join() combines a list of strings into one:\n", ".join(["Alice", "Bob", "Carol"])  → "Alice, Bob, Carol"\nThe string before .join() is the separator between items.',
    },
    {
      keywords: ['replace', 'substitute', 'change', 'swap text'],
      answer: 'replace() swaps one substring for another:\n"I like cats".replace("cats", "dogs")  → "I like dogs"\nIt replaces ALL occurrences by default.',
    },
    {
      keywords: ['find', 'index', 'search', 'position', 'where', 'locate'],
      answer: 'find() returns the index of the first occurrence of a substring, or -1 if not found:\n"hello world".find("world")  → 6\nindex() is similar but raises an error if not found.',
    },
    {
      keywords: ['startswith', 'endswith', 'starts', 'ends', 'begins'],
      answer: '"hello".startswith("he")  → True\n"hello".endswith("lo")  → True\nUseful for checking file extensions or message prefixes.',
    },
    {
      keywords: ['slice', 'slicing', 'part', 'substring', 'portion'],
      answer: 'Strings support slicing just like lists:\ntext = "Hello World"\ntext[0:5]  → "Hello"\ntext[6:]   → "World"\ntext[::-1] → "dlroW olleH" (reversed)',
    },
    {
      keywords: ['f-string', 'format', 'fstring', 'curly', 'variable in string'],
      answer: 'f-strings embed variable values inside text:\nname = "Alice"\nage = 30\nprint(f"{name} is {age} years old")  → Alice is 30 years old\nWrite f before the opening quote.',
    },
    {
      keywords: ['in', 'contains', 'check', 'substring', 'exists'],
      answer: 'Check if a substring is in a string using "in":\nif "hello" in "hello world":\n    print("Found!")\nThis is case-sensitive — "Hello" is not the same as "hello".',
    },
    {
      keywords: ['immutable string', 'strings cannot change', 'why cant I change a character'],
      answer: 'Strings are immutable — you cannot change a single character in place: name[0] = "J" raises a TypeError. Instead, build a new string: name = "J" + name[1:], or use a method like replace() that returns a new string.',
    },
    {
      keywords: ['concatenation vs f-string performance', 'plus vs f-string', 'best way to build string'],
      answer: 'While "Hello " + name + "!" works, f-strings (f"Hello {name}!") are generally preferred — they are easier to read, handle type conversion automatically, and are usually a bit faster for anything beyond one or two pieces.',
    },
    {
      keywords: ['multiline string', 'triple quote string', 'string across lines'],
      answer: 'Triple-quoted strings (""" or \'\'\') can span multiple lines exactly as typed: message = """Dear Alice,\nThank you for joining."""  keeps the real line break, no \\n needed.',
    },
    {
      keywords: ['repeat string', 'string times number', 'string multiplication'],
      answer: 'Multiplying a string by a number repeats it: "ab" * 3 gives "ababab". Common for building simple separators: "=" * 40 draws a line of forty equals signs.',
    },
    {
      keywords: ['isdigit', 'isalpha', 'isupper', 'check string type', 'is numeric string'],
      answer: 'Strings have handy check methods: "123".isdigit() is True, "abc".isalpha() is True, "ABC".isupper() is True. These are useful for validating input before converting it, e.g. checking isdigit() before calling int().',
    },
    {
      keywords: ['compare strings alphabetically', 'string less than', 'sort strings'],
      answer: 'Strings can be compared with < and > just like numbers — they compare alphabetically (technically by character code): "apple" < "banana" is True. Comparison is case-sensitive, so "Zebra" < "apple" is actually True, because uppercase letters come before lowercase in character codes.',
    },
    {
      keywords: ['reverse string', 'flip string', 'backwards text', 'reverse a string', 'reverse the string'],
      answer: 'The classic way to reverse a string is slicing with a step of -1: "hello"[::-1] gives "olleh". There is no built-in .reverse() method for strings since they are immutable.',
    },
    {
      keywords: ['string to list of characters', 'list(string)', 'split into characters'],
      answer: 'Wrapping a string in list() splits it into a list of individual characters: list("abc") gives ["a", "b", "c"] — different from .split(), which breaks on whitespace or a separator into whole words.',
    },
    {
      keywords: ['remove characters from string', 'delete substring', 'strip specific characters'],
      answer: 'To remove specific characters (not just whitespace), use replace() with an empty string as the replacement: "hello world".replace(" ", "") removes every space, giving "helloworld".',
    },
    {
      keywords: ['pad string', 'zfill', 'ljust', 'rjust', 'align text'],
      answer: '"7".zfill(3) pads with zeros on the left to reach a length of 3, giving "007" — handy for things like invoice numbers. "hi".ljust(10) and "hi".rjust(10) pad with spaces instead, aligning text left or right within a fixed width.',
    },
    {
      keywords: ['count substring', 'how many times word appears', 'string count method'],
      answer: '"banana".count("a") counts how many times a substring appears: it returns 3 here. Works for whole words too: "the cat sat on the mat".count("the") gives 2.',
    },
    {
      keywords: ['isnumeric before int', 'check if string is number before converting'],
      answer: 'Before calling int() on user input, it is good practice to check age_text.isdigit() first — this avoids a ValueError crash if the user typed something that is not actually a number.',
    },
    {
      keywords: ['raw string', 'r-string', 'r"" prefix', 'backslash in path'],
      answer: 'A raw string (prefixed with r, like r"C:\\Users\\name") tells Python to treat backslashes as literal characters instead of the start of an escape sequence — very useful for Windows file paths and regular expressions.',
    },
    {
      keywords: ['encode decode', 'bytes string', 'utf-8'],
      answer: 'encode() converts a string into bytes (the raw format used for files and networks): "hello".encode("utf-8"). decode() does the reverse, turning bytes back into a readable string. This mostly matters when working with files or network data at a lower level.',
    },
  ],

  'file-handling': [
    {
      keywords: ['file', 'what is', 'open', 'how', 'read file'],
      answer: 'Python can read from and write to files using open(). Always use a with block so the file is closed automatically:\nwith open("data.txt", "r") as f:\n    content = f.read()',
    },
    {
      keywords: ['mode', 'r', 'w', 'a', 'modes', 'read write append'],
      answer: 'The second argument to open() is the mode:\n"r" — read (default)\n"w" — write (creates or overwrites)\n"a" — append (adds to end without deleting)\n"x" — create (fails if file exists)',
    },
    {
      keywords: ['read', 'read()', 'read all', 'entire file', 'full content'],
      answer: 'f.read() reads the entire file as one string.\nf.readline() reads one line.\nf.readlines() reads all lines into a list — each line is a separate item.',
    },
    {
      keywords: ['write', 'save', 'create file', 'write to', 'write()'],
      answer: 'Open in "w" mode to write:\nwith open("output.txt", "w") as f:\n    f.write("Hello!\\n")\nEach write() call adds text. \\n creates a new line. "w" mode deletes the file first.',
    },
    {
      keywords: ['append', 'add to', 'add without deleting', 'keep old'],
      answer: 'Open in "a" mode to add to the end without deleting existing content:\nwith open("log.txt", "a") as f:\n    f.write("New entry\\n")\nThis is how you keep a running log.',
    },
    {
      keywords: ['with', 'context manager', 'close', 'why with', 'automatically'],
      answer: 'The with block ensures the file is closed automatically when you are done, even if an error occurs. Without with, you must manually call f.close() — forgetting can cause data loss.',
    },
    {
      keywords: ['line', 'lines', 'each line', 'loop through', 'iterate'],
      answer: 'Loop through lines directly:\nwith open("file.txt", "r") as f:\n    for line in f:\n        print(line.strip())\nstrip() removes the newline character at the end of each line.',
    },
    {
      keywords: ['exist', 'check', 'file exists', 'os', 'path'],
      answer: 'Check if a file exists before opening:\nimport os\nif os.path.exists("data.txt"):\n    print("File found")\nThis prevents errors when trying to read a file that is not there.',
    },
    {
      keywords: ['write list to file', 'save list of lines', 'loop write to file'],
      answer: 'To write each item of a list as its own line, loop while writing: with open("names.txt", "w") as f:\n    for name in names:\n        f.write(name + "\\n")',
    },
    {
      keywords: ['read file into list', 'file lines as list', 'readlines strip'],
      answer: 'f.readlines() gives every line as a list item, but each one keeps its trailing newline character. Strip them off with a list comprehension: lines = [line.strip() for line in f.readlines()].',
    },
    {
      keywords: ['csv file', 'comma separated values', 'csv module'],
      answer: 'For structured data with columns, Python has a built-in csv module rather than parsing commas by hand: import csv, then csv.reader(f) or csv.writer(f) handle the details (like commas inside quoted fields) correctly.',
    },
    {
      keywords: ['json file', 'save dictionary to file', 'json module'],
      answer: 'The json module saves and loads dictionaries and lists as text: import json, then json.dump(data, f) writes it, and json.load(f) reads it back into a real Python dictionary/list, not just plain text.',
    },
    {
      keywords: ['filenotfounderror', 'file not found error', 'handle missing file'],
      answer: 'Trying to open a file that does not exist in "r" mode raises a FileNotFoundError. Wrap it in try/except to handle this gracefully:\ntry:\n    with open("data.txt") as f:\n        content = f.read()\nexcept FileNotFoundError:\n    print("That file does not exist yet")',
    },
    {
      keywords: ['absolute path', 'relative path', 'file path difference'],
      answer: 'A relative path ("data.txt") is looked up starting from wherever your program is currently running from. An absolute path ("/home/user/data.txt" or "C:\\Users\\name\\data.txt") always points to the exact same location, regardless of where the program runs.',
    },
    {
      keywords: ['working directory', 'current directory', 'os.getcwd'],
      answer: 'os.getcwd() tells you the folder your program is currently running from — relative file paths like "data.txt" are resolved against this location.',
    },
    {
      keywords: ['binary mode', 'rb', 'wb', 'binary file'],
      answer: '"rb" and "wb" open a file in binary mode (raw bytes) instead of text — needed for non-text files like images or audio. For plain text files, the default text mode ("r"/"w") is what you want.',
    },
    {
      keywords: ['delete file', 'remove file', 'os.remove'],
      answer: 'os.remove("old.txt") deletes a file from disk. Like opening a missing file, deleting one that does not exist raises a FileNotFoundError — check os.path.exists() first if you are not sure.',
    },
    {
      keywords: ['rename file', 'os.rename'],
      answer: 'os.rename("old.txt", "new.txt") renames (or moves) a file. Both the os module functions live in import os at the top of your script.',
    },
    {
      keywords: ['create folder', 'make directory', 'os.makedirs'],
      answer: 'os.makedirs("my_folder") creates a new directory. Add exist_ok=True (os.makedirs("my_folder", exist_ok=True)) so it does not raise an error if the folder is already there.',
    },
    {
      keywords: ['large file memory', 'read big file efficiently', 'line by line memory'],
      answer: 'For very large files, avoid f.read() (which loads the whole file into memory at once) — instead loop line by line with for line in f:, which only keeps one line in memory at a time.',
    },
    {
      keywords: ['file encoding', 'utf-8 parameter', 'encoding= open'],
      answer: 'For text with special characters (accents, emojis, non-English scripts), specify an encoding explicitly: open("data.txt", "r", encoding="utf-8") — this avoids errors on files that are not in your system\'s default encoding.',
    },
  ],
};

// ── Fuzzy keyword scorer ──────────────────────────────────────────────────────
function score(question, entry) {
  const q = question.toLowerCase();
  let total = 0;
  for (const kw of entry.keywords) {
    if (q.includes(kw.toLowerCase())) total += kw.length; // longer match = higher score
  }
  return total;
}

// ── Fallback answers for generic questions ────────────────────────────────────
const GENERIC_FALLBACKS = [
  {
    keywords: ['hello', 'hi', 'hey'],
    answer: 'Hello! Ask me anything about this topic — I\'m here to help.',
  },
  {
    keywords: ['help', 'what can you do', 'how do you work'],
    answer: 'I can answer questions about the current Python topic you are studying. Just ask anything — like "what is a variable?" or "how do I use a loop?" and I\'ll explain it clearly.',
  },
  {
    keywords: ['example', 'show me', 'code example'],
    answer: 'Ask me a specific question about the topic and I\'ll include a code example in my answer. For example: "how do I create a list?" or "what does return do?"',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    answer: 'You are welcome! Feel free to ask more questions about this topic any time.',
  },
  {
    keywords: ['confused', "don't understand", 'do not understand', 'still confused', 'lost'],
    answer: 'No worries — try asking about one small piece at a time, like "what does this word mean?" or "can you show a simple example?" Breaking it down usually helps.',
  },
  {
    keywords: ['error', 'not working', 'broken', 'bug in my code'],
    answer: 'I can help explain common errors for this topic conceptually, but I cannot see your actual code. Try asking about the specific error message you are seeing, like "what does IndentationError mean?"',
  },
  {
    keywords: ['difference between', 'compare', 'vs'],
    answer: 'Try asking about the two things you want compared directly, like "difference between a list and a tuple" — I have specific answers for a lot of these common comparisons.',
  },
  {
    keywords: ['best practice', 'good habit', 'tips'],
    answer: 'Good general habits: use descriptive variable names, keep functions small and focused, and test your code with simple examples as you go rather than writing everything at once.',
  },
  {
    keywords: ['why python', 'why learn python', 'is python good'],
    answer: 'Python is popular because its syntax reads almost like English, it has huge community support, and it is used everywhere from web development to data science to automation — a great first language.',
  },
  {
    keywords: ['bye', 'goodbye', 'see you'],
    answer: 'Good luck with the rest of the lesson! Come back anytime you have a question.',
  },
];

// ── Main search function ──────────────────────────────────────────────────────
export function search(slug, question) {
  if (!question.trim()) return null;

  const entries = KB[slug];

  // Try topic-specific knowledge base first
  if (entries) {
    const scored = entries.map(e => ({ ...e, score: score(question, e) }));
    const best = scored.sort((a, b) => b.score - a.score)[0];
    if (best.score > 0) return best.answer;
  }

  // Try generic fallbacks
  const genScored = GENERIC_FALLBACKS.map(e => ({ ...e, score: score(question, e) }));
  const bestGen = genScored.sort((a, b) => b.score - a.score)[0];
  if (bestGen.score > 0) return bestGen.answer;

  // No match
  return null;
}

export const SUPPORTED_SLUGS = Object.keys(KB);
