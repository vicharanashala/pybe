export function explainError(rawError) {
  if (!rawError) return "";

  if (rawError.includes("Execution timed out")) {
    return "Your code ran for too long and was stopped. This usually happens when a loop runs forever because its stopping condition is never reached (an infinite loop). Check if you are modifying the loop list or if the loop variable is never updating.";
  }

  if (rawError.includes("SyntaxError")) {
    if (rawError.includes("invalid syntax")) {
      return "There is a syntax error in your code. Double check if you forgot a colon (`:`) at the end of a `for` loop header, `if` statement, or `else` statement. Also check for open parentheses or quotation marks.";
    }
    return "Python could not parse your code. Check for typos, missing characters like colons `:`, brackets, or mismatched quote marks.";
  }

  if (rawError.includes("IndentationError")) {
    return "You have an indentation problem. Python requires lines of code inside a loop or conditional block to be indented (press Tab or add spaces). Check if the code block under your loop or `if` statement is properly aligned.";
  }

  if (rawError.includes("NameError")) {
    const match = rawError.match(/name '([^']+)' is not defined/);
    const varName = match ? match[1] : "a variable";
    return `You tried to use ${varName} before creating it. Check if you misspelled the variable name, or if you forgot to initialize it (like ${varName} = 0) at the start of your code.`;
  }

  if (rawError.includes("IndexError")) {
    return "You tried to access an item in a list using an index that is out of range. For example, asking for the 5th item when the list only contains 3 items. Remember that list indexing in Python starts at 0, not 1.";
  }

  if (rawError.includes("TypeError")) {
    if (
      rawError.includes("object of type") &&
      rawError.includes("has no len")
    ) {
      return "You tried to get the length (`len()`) of a single value (like an integer or boolean) which does not have a length. Make sure you pass a list or dictionary to `len()`, not a single number.";
    }
    if (
      rawError.includes("can only concatenate str") ||
      rawError.includes("unsupported operand type")
    ) {
      return "You tried to perform arithmetic or combine values of incompatible types (such as adding text/string to a number). You may need to convert types, e.g., converting a number to a string using `str(value)`.";
    }
    return "You are performing an operation on incompatible data types. Check what values you are passing to functions or operators.";
  }

  if (rawError.includes("KeyError")) {
    const match = rawError.match(/KeyError: '([^']+)'/);
    const keyName = match ? match[1] : "a key";
    return `You tried to look up the key '${keyName}' in a dictionary, but that key does not exist. Check if the key is spelled correctly or check if the key is missing in the dictionary.`;
  }

  return "An error occurred during execution. Read the traceback below to identify which line failed, and check your syntax or values.";
}

// Deterministic reading aid; unknown lines are shown as Python, not invented explanations.
export async function translateCodeToEnglish(code) {
  if (!code) return "No code provided.";
  return String(code)
    .split("\n")
    .map((line) => {
      const indent = line.match(/^\s*/)[0];
      const text = line.trim();
      let explanation;
      if (!text) return "";
      if (text.startsWith("#"))
        explanation = "Comment: " + text.slice(1).trim();
      else if (/^print\(/.test(text))
        explanation = "Display " + text.slice(6).replace(/\)$/, "");
      else if (/^if /.test(text))
        explanation =
          "If " +
          text.slice(3).replace(/:$/, "") +
          ", follow the indented steps.";
      else if (/^elif /.test(text))
        explanation =
          "Otherwise, if " +
          text.slice(5).replace(/:$/, "") +
          ", follow these steps.";
      else if (text === "else:") explanation = "Otherwise, follow these steps.";
      else if (/^while /.test(text))
        explanation =
          "Repeat while " + text.slice(6).replace(/:$/, "") + " remains true.";
      else if (/^for /.test(text))
        explanation =
          "For each " +
          text.slice(4).replace(/:$/, "") +
          ", follow the indented steps.";
      else if (/^def /.test(text))
        explanation = "Define " + text.slice(4).replace(/:$/, "") + ".";
      else if (/^return(?: |$)/.test(text))
        explanation = "Return " + text.slice(6).trim() + " to the caller.";
      else if (text === "break") explanation = "Leave the current loop.";
      else if (text === "continue")
        explanation = "Move to the next loop iteration.";
      else if (/^[A-Za-z_]\w*\s*=(?!=)/.test(text))
        explanation =
          "Store the right-hand value using " + text.split("=")[0].trim() + ".";
      else explanation = "Read this Python instruction: " + text;
      return indent + explanation;
    })
    .join("\n");
}

export async function localDebugGuide(challenge, userCode, message) {
  const title = challenge?.title || "this challenge";
  const q = String(message || "").toLowerCase();
  let hint =
    "Trace the values one line at a time, then run the provided tests and compare the actual result with the stated goal.";
  if (/loop|repeat|stop/.test(q))
    hint =
      "Check the loop condition, the value that changes each round, and the condition that stops repetition.";
  else if (/index|list|range/.test(q))
    hint =
      "Check the collection length and remember that the first index is 0; the last valid index is length minus 1.";
  else if (/if|condition|branch/.test(q))
    hint =
      "Write down when each condition is True and check which branch will run for the test input.";
  else if (/return|function|print/.test(q))
    hint =
      "A return sends a result to the caller; print displays it. Check which result the challenge expects.";
  return {
    message: "Local debugging guide for " + title + ": " + hint,
    solved: false,
  };
}
