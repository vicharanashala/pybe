/**
 * Engineering the Workshop - The Interceptor Engine (Error Handling)
 * Intercepts Pyodide traceback strings and maps them to Orion's narrative dialogue.
 * 
 * @param {string} traceback - The raw error message string from Pyodide.
 * @param {string} userCode - The raw string of code the user typed.
 * @returns {Object} { status: "error", message: string, errorType: string }
 */
export function handleOrionMisfire(traceback = '', userCode = '') {
  const tb = String(traceback);
  const code = String(userCode);

  let orionMessage = "";
  let errorType = "Misfire";

  // 1. Indentation Check
  if (tb.includes("IndentationError")) {
    errorType = "IndentationError";
    orionMessage = "Careful, your wand slipped! Your tether fell completely outside the __init__ spell. Press 'Tab' to tuck your lines safely inside.";
  }
  // 2. Missing 'self' Parameter Check
  else if (tb.includes("TypeError") && tb.includes("takes 0 positional arguments but 1 was given")) {
    errorType = "TypeError";
    orionMessage = "Wait! When you shout an action, how does the forest know WHO should perform it? Put the 'self' tether inside the parentheses of your spell!";
  }
  // 3. Unbound Variables (NameError)
  else if (tb.includes("NameError")) {
    errorType = "NameError";
    orionMessage = "The magic evaporated! You used a name the scroll doesn't recognize. Did you forget to attach it to the 'self' tether?";
  }
  // 4. Pre-execution Code Analysis (Case sensitivity)
  else if (code.includes("Self.")) {
    errorType = "CapitalizationError";
    orionMessage = "Magic is very particular about capitalization. The tether is woven with lowercase threads. Use 'self', not 'Self'!";
  }
  // 5. Missing self positional argument when calling method on class instead of object
  else if (tb.includes("TypeError") && tb.includes("missing 1 required positional argument: 'self'")) {
    errorType = "TypeError";
    orionMessage = "Careful! You just told the glowing parchment to act! A Blueprint cannot jump or sleep. You must command the physical fox object you instantiated.";
  }
  // Fallback Error
  else {
    errorType = "SyntaxError";
    orionMessage = "Something went wrong with the incantation. Check your spelling and try again!";
    console.error("Raw Traceback for Debugging:", tb);
  }

  return {
    status: "error",
    message: orionMessage,
    errorType: errorType,
    rawTraceback: tb,
  };
}
