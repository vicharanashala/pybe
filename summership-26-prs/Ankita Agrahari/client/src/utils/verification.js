/**
 * Verification Engine for PyBe Scenarios
 * Evaluates student code using static analysis (regex/substring)
 * and runtime environment inspection in Pyodide.
 */

export const verifyScenario = async (scenarioTitle, codeText, pyodide) => {
  const errors = [];
  const warnings = [];
  const codeLower = codeText.toLowerCase();

  // Helper: check if keyword exists in code
  const hasKeyword = (kw) => new RegExp(`\\b${kw}\\b`, 'i').test(codeText);

  // Helper: check if character sequence exists (for symbols like '+', '%')
  const hasSymbol = (sym) => codeText.includes(sym);

  // Helper: check if a variable matching a substring exists in Python globals
  const findPyValPartial = (substring) => {
    try {
      const keys = pyodide.runPython("list(globals().keys())").toJs();
      for (const k of keys) {
        if (k.toLowerCase().includes(substring.toLowerCase())) {
          const val = pyodide.globals.get(k);
          // Convert PyProxy to JS objects if necessary
          const jsVal = (val && typeof val.toJs === 'function') ? val.toJs() : val;
          return { name: k, value: jsVal };
        }
      }
    } catch (e) {
      console.warn("Error finding python global variable:", e);
    }
    return null;
  };

  switch (scenarioTitle) {
    case 'Bag Weight Label':
      if (!codeLower.includes('weight')) {
        errors.push("Please name a variable to represent the bag weight (e.g. 'weight' or 'bag_weight').");
      }
      const wt = findPyValPartial('weight');
      if (!wt) {
        errors.push("Could not find a variable representing weight in your program.");
      } else if (typeof wt.value !== 'number') {
        errors.push(`The variable '${wt.name}' was found, but it must be a numeric value (integer or float).`);
      }
      break;

    case 'Rainy Day Choice':
      if (!hasKeyword('if') || !hasKeyword('else')) {
        errors.push("Use a conditional statement structure with 'if' and 'else' to decide whether to carry an umbrella.");
      }
      if (!codeLower.includes('rain')) {
        warnings.push("Tip: It is good practice to represent the condition with a variable like 'is_raining' or 'raining'.");
      }
      break;

    case 'Two Snack Prices':
      if (!hasSymbol('+')) {
        errors.push("Use the addition operator (+) to calculate the sum of the two snack prices.");
      }
      const sumVar = findPyValPartial('total') || findPyValPartial('cost') || findPyValPartial('sum') || findPyValPartial('price');
      if (!sumVar) {
        errors.push("Store the calculation result in a variable (e.g. 'total_cost' or 'sum_prices').");
      } else if (typeof sumVar.value !== 'number') {
        errors.push(`Your sum variable '${sumVar.name}' must store a number.`);
      }
      break;

    case 'Greeting by Name':
      const nameVar = findPyValPartial('name');
      const greetVar = findPyValPartial('greeting') || findPyValPartial('message') || findPyValPartial('text');
      
      if (!nameVar) {
        errors.push("Define a variable containing the learner's name (e.g. 'name' or 'learner_name').");
      } else if (typeof nameVar.value !== 'string') {
        errors.push("The name variable should be a string value (text wrapped in quotes).");
      }
      
      if (!greetVar) {
        errors.push("Store the final greeting sentence in a variable (e.g. 'greeting' or 'message').");
      } else if (typeof greetVar.value !== 'string' || !greetVar.value.toLowerCase().includes(String(nameVar?.value || '').toLowerCase())) {
        errors.push("Ensure your greeting variable contains a message that incorporates the student's name.");
      }
      break;

    case 'Pass Mark Check':
      if (!hasKeyword('if')) {
        errors.push("Use an 'if' statement to verify if the test score is passing.");
      }
      if (!hasSymbol('>') && !hasSymbol('<') && !hasSymbol('=') && !hasSymbol('!')) {
        errors.push("Use a comparison operator (e.g., '>=', '>') to compare the score with the pass mark.");
      }
      break;

    case 'Pocket Money Left':
      if (!hasSymbol('-')) {
        errors.push("Use the subtraction operator (-) to subtract the spent amount from the starting pocket money.");
      }
      const leftVar = findPyValPartial('left') || findPyValPartial('rem') || findPyValPartial('balance') || findPyValPartial('money');
      if (!leftVar) {
        errors.push("Store the remaining pocket money in a variable (e.g., 'money_left' or 'balance').");
      } else if (typeof leftVar.value !== 'number') {
        errors.push("The remaining money variable should be a number.");
      }
      break;

    case 'Favorite Color List':
      const colorVar = findPyValPartial('color');
      if (!colorVar) {
        errors.push("Define a variable to store the group of colors (e.g., 'colors' or 'fav_colors').");
      } else if (!Array.isArray(colorVar.value)) {
        errors.push("The colors variable must be a Python list (wrapped in brackets, e.g. ['red', 'blue'] ).");
      } else if (colorVar.value.length < 3) {
        errors.push("Store favorite colors of all three friends (at least 3 values in the list).");
      }
      break;

    case 'First Item in a Bag':
      if (!hasSymbol('[0]') && !hasSymbol('[ 0 ]')) {
        errors.push("Use zero-based indexing ( `[0]` ) to request the first item of the list.");
      }
      break;

    case 'Attendance Count':
      if (!codeLower.includes('len(')) {
        errors.push("Use the built-in `len()` function to count the number of elements in the present list.");
      }
      break;

    case 'Temperature Message':
      if (!hasKeyword('if') || !hasKeyword('else')) {
        errors.push("Use 'if' and 'else' conditionals to decide which message to display.");
      }
      if (!hasSymbol('>') && !hasSymbol('<') && !hasSymbol('=')) {
        errors.push("Set a temperature threshold and compare it using operators like '>'.");
      }
      break;

    case 'Water Bottle Reminder':
      if (!hasKeyword('for') && !hasKeyword('while')) {
        errors.push("Use a loop statement ('for' or 'while') to avoid repeating the print code.");
      }
      break;

    case 'Find the Longest Pencil':
      if (!hasKeyword('for') && !hasKeyword('while')) {
        errors.push("Use a loop to iterate through the pencil lengths.");
      }
      if (!hasSymbol('>') && !hasSymbol('<') && !hasKeyword('max')) {
        errors.push("Verify you are comparing lengths (e.g., using `>` or the `max()` function) to track the longest pencil.");
      }
      break;

    case 'Clean Chore Checklist':
      if (!hasKeyword('for') && !hasKeyword('while')) {
        errors.push("Use a loop ('for chore in chores:') to go through each chore in the checklist.");
      }
      const listVar = findPyValPartial('chore') || findPyValPartial('task') || findPyValPartial('list');
      if (!listVar) {
        errors.push("Define a list variable representing the checklist of chores.");
      }
      break;

    case 'Movie Age Filter':
      if (!hasKeyword('if')) {
        errors.push("Use a conditional 'if' statement inside your filter logic to check movie age ratings.");
      }
      if (!hasSymbol('>=') && !hasSymbol('>') && !hasSymbol('<') && !hasSymbol('<=') && !codeLower.includes('filter')) {
        errors.push("Verify movie age limits by comparing the user's age with a comparison operator.");
      }
      break;

    case 'Classroom Supply Lookup':
      const dictVar = findPyValPartial('supply') || findPyValPartial('supplies') || findPyValPartial('count') || findPyValPartial('stock') || findPyValPartial('inventory');
      if (!dictVar) {
        errors.push("Define a variable representing your supply counts (e.g. 'supplies').");
      } else if (typeof dictVar.value !== 'object' || Array.isArray(dictVar.value) || dictVar.value === null) {
        errors.push("Store key-value pairs using a Python dictionary structure (wrapped in curly braces, e.g., `{'markers': 5}`).");
      }
      break;

    case 'Bus Stop Search':
      if (!hasKeyword('for') && !hasKeyword('while')) {
        errors.push("Scan the bus stops by looping through the stop list.");
      }
      if (!hasKeyword('if')) {
        errors.push("Use an 'if' statement inside the loop to compare each stop with the target.");
      }
      break;

    case 'Average Practice Score':
      if (!hasSymbol('/') && !codeLower.includes('mean')) {
        errors.push("Calculate the average by dividing the sum of the scores by the total count (/).");
      }
      if (!codeLower.includes('len(') && !hasKeyword('len')) {
        warnings.push("Tip: Use the `len()` function to dynamically compute the number of scores instead of hardcoding 5.");
      }
      break;

    case 'Separate Even Roll Numbers':
      if (!hasSymbol('%')) {
        errors.push("Use the modulo operator (%) with 2 (e.g., `num % 2 == 0`) to test if a roll number is even.");
      }
      if (!hasKeyword('if')) {
        errors.push("Use an 'if' conditional to filter out odd numbers and keep only even roll numbers.");
      }
      break;

    case 'Capitalize Name Tags':
      if (!hasKeyword('for') && !hasKeyword('while')) {
        errors.push("Use a loop to apply the formatting action to each name in the list.");
      }
      if (!codeLower.includes('.title()') && !codeLower.includes('.capitalize()') && !codeLower.includes('.upper()')) {
        errors.push("Use string formatting methods (e.g., `.title()` or `.capitalize()`) to clean and normalize name tags.");
      }
      break;

    case 'Find Missing Homework':
      if (!hasSymbol('-') && !codeLower.includes('.difference(') && !codeLower.includes('set(')) {
        errors.push("Convert your student groups into sets and use set operations (like the `-` operator or `.difference()`) to find who is missing.");
      }
      break;

    case 'Reusable Discount Rule':
      if (!hasKeyword('def')) {
        errors.push("Use the 'def' keyword to define a reusable function (e.g. `def calculate_discount(bill):`).");
      }
      if (!hasKeyword('return')) {
        errors.push("A reusable logic helper must 'return' the calculated discounted price.");
      }
      break;

    case 'Mini Quiz Checker':
      if (!hasKeyword('def')) {
        errors.push("Define a reusable function to compare input and correct answers.");
      }
      if (!hasSymbol('==') && !hasKeyword('return')) {
        errors.push("Compare values using `==` inside your function and return the verification result.");
      }
      break;

    case 'Step Counter Function':
      if (!hasKeyword('def')) {
        errors.push("Define a function to sum up step counts.");
      }
      if (!codeLower.includes('sum(') && !hasKeyword('for')) {
        errors.push("Calculate total steps inside the function, either using `sum(steps_list)` or by iterating through elements with a loop.");
      }
      break;

    case 'Safe Username Maker':
      if (!hasKeyword('def')) {
        errors.push("Define a username builder function.");
      }
      if (!codeLower.includes('.lower()') && !codeLower.includes('.replace()') && !codeLower.includes('.strip()')) {
        errors.push("Make sure the function normalizes the input name using methods like `.lower()` or `.replace()`. ");
      }
      break;

    case 'Retry Until Valid':
      if (!hasKeyword('while')) {
        errors.push("Use a 'while' loop to keep repeating input requests as long as the condition is invalid.");
      }
      if (hasKeyword('for')) {
        warnings.push("Tip: For open-ended user retry inputs, a 'while' loop is preferred over 'for' loops.");
      }
      break;

    case 'Simple Score Report':
      if (!hasKeyword('def')) {
        errors.push("Define a function to compile the student report.");
      }
      const funcName = findPyValPartial('report') || findPyValPartial('score') || findPyValPartial('create') || findPyValPartial('make');
      if (funcName && typeof funcName.value === 'function') {
        try {
          // Attempt to call the python function in Pyodide to inspect its return value
          const output = pyodide.runPython(`${funcName.name}("Alice", 95)`).toJs();
          if (typeof output !== 'object' || Array.isArray(output) || output === null) {
            errors.push("The function must return a Python dictionary representation of the report.");
          }
        } catch (err) {
          console.warn("Function execution failed in validator:", err);
        }
      } else {
        if (!codeLower.includes('{') || !codeLower.includes('}')) {
          errors.push("Ensure your function creates and returns a dictionary structure (using curly braces `{}`).");
        }
      }
      break;

    case 'Task Status Updater':
      if (!hasSymbol('[') || !hasSymbol(']')) {
        errors.push("Access dictionary keys using bracket notation (e.g. `task['status']`) to update values.");
      }
      if (!hasSymbol('=')) {
        errors.push("Use the assignment operator (=) to mutate the value of the task status key.");
      }
      break;

    case 'Small Receipt Builder':
      if (!hasKeyword('def')) {
        errors.push("Define a receipt builder function.");
      }
      if (!hasKeyword('return')) {
        errors.push("The receipt builder function should return the formatted string line.");
      }
      break;

    case 'Choose Next Scenario':
      if (!hasKeyword('if') || (!hasKeyword('elif') && !hasKeyword('else'))) {
        errors.push("Use a branching conditional structure ('if' / 'elif' / 'else') to evaluate the multiple score ranges.");
      }
      break;

    case 'Reflection Keyword Finder':
      if (!hasKeyword('in')) {
        errors.push("Use the string search operator 'in' (e.g., `word in reflection_text`) to check for keywords.");
      }
      break;

    default:
      // Generic fallback for any other scenarios
      if (codeText.trim().length === 0) {
        errors.push("Please write some Python code to resolve the objectives.");
      }
      break;
  }

  return {
    success: errors.length === 0,
    errors,
    warnings
  };
};
