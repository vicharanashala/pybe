// src/data/builtins.ts
// Descriptions for Python built-in functions AND common methods on
// str, list, tuple, dict, set, int/float (math), file objects, exceptions.
// Used in the visualizer annotation bar.

export const BUILTINS: Record<string, string> = {

  // ── Output / Input ────────────────────────────────────────────────────────
  print:          'Prints values to the screen, separated by spaces by default.',
  input:          'Reads a line of text typed by the user and returns it as a string.',

  // ── Type conversion ───────────────────────────────────────────────────────
  int:            'Converts a value to an integer, dropping any decimal part.',
  float:          'Converts a value to a floating-point (decimal) number.',
  str:            'Converts a value to its text (string) representation.',
  bool:           'Converts a value to True or False — empty/zero values become False.',
  list:           'Creates a new list, optionally from another iterable.',
  tuple:          'Creates an immutable (unchangeable) sequence from an iterable.',
  set:            'Creates a collection of unique items with no duplicates.',
  dict:           'Creates a key-value mapping from keyword arguments or pairs.',
  bytes:          'Creates an immutable sequence of raw bytes.',
  bytearray:      'Creates a mutable sequence of raw bytes.',
  complex:        'Creates a complex number with a real and imaginary part.',
  frozenset:      'Creates an immutable set that cannot be changed after creation.',

  // ── Math built-ins ────────────────────────────────────────────────────────
  abs:            'Returns the absolute (positive) value of a number.',
  round:          'Rounds a number to a given number of decimal places (default 0).',
  pow:            'Returns base raised to the power of exp — same as base ** exp.',
  divmod:         'Returns a (quotient, remainder) tuple for the two numbers.',
  max:            'Returns the largest item from a sequence or from given arguments.',
  min:            'Returns the smallest item from a sequence or from given arguments.',
  sum:            'Adds up all items in an iterable and returns the total.',

  // ── Sequences / iterables ─────────────────────────────────────────────────
  len:            'Returns the number of items in a sequence, collection, or string.',
  range:          'Generates a sequence of integers — commonly used in for loops.',
  enumerate:      'Returns (index, value) pairs for each item in an iterable.',
  zip:            'Combines multiple iterables into tuples, stopping at the shortest.',
  map:            'Applies a function to every item in an iterable and returns the results.',
  filter:         'Keeps only items from an iterable for which a function returns True.',
  reversed:       'Returns an iterator that goes through a sequence in reverse order.',
  sorted:         'Returns a new sorted list from any iterable.',
  iter:           'Returns an iterator object for a given iterable.',
  next:           'Retrieves the next item from an iterator.',

  // ── Object / type inspection ──────────────────────────────────────────────
  type:           'Returns the type (class) of an object — e.g. <class "int">.',
  isinstance:     'Checks whether an object is an instance of a given class or type.',
  issubclass:     'Checks whether a class is a subclass of another class.',
  id:             'Returns the unique memory identity (address) of an object.',
  hash:           'Returns the hash value of an object, used in sets and dict keys.',
  dir:            'Lists the attributes and methods available on an object.',
  vars:           'Returns the __dict__ of an object — its writable attributes.',
  getattr:        'Gets the value of a named attribute from an object.',
  setattr:        'Sets a named attribute on an object to a given value.',
  delattr:        'Deletes a named attribute from an object.',
  hasattr:        'Returns True if an object has the named attribute.',
  callable:       'Returns True if the object can be called like a function.',

  // ── String / repr ─────────────────────────────────────────────────────────
  repr:           'Returns a developer-readable string representation of an object.',
  chr:            'Returns the character for a given Unicode code point number.',
  ord:            'Returns the Unicode code point number for a single character.',
  format:         'Formats a value using a format specification string.',
  bin:            'Converts an integer to its binary string like 0b1010.',
  oct:            'Converts an integer to its octal string like 0o17.',
  hex:            'Converts an integer to its hexadecimal string like 0xff.',

  // ── Functional ────────────────────────────────────────────────────────────
  any:            'Returns True if at least one item in the iterable is truthy.',
  all:            'Returns True only if every item in the iterable is truthy.',

  // ── I/O / files ───────────────────────────────────────────────────────────
  open:           'Opens a file and returns a file object for reading or writing.',

  // ── Execution ────────────────────────────────────────────────────────────
  eval:           'Evaluates a Python expression given as a string and returns its result.',
  exec:           'Executes a block of Python code given as a string.',
  globals:        'Returns the dictionary of the current global symbol table.',
  locals:         'Returns the dictionary of the current local symbol table.',
  super:          'Returns a proxy to call methods from a parent (base) class.',

  // ── Misc ──────────────────────────────────────────────────────────────────
  help:           'Displays the documentation / help text for an object or function.',
}

// ─── String methods ───────────────────────────────────────────────────────────
export const STRING_METHODS: Record<string, string> = {
  upper:          'Converts all characters to uppercase — "hello" → "HELLO".',
  lower:          'Converts all characters to lowercase — "HELLO" → "hello".',
  capitalize:     'Makes the first character uppercase and the rest lowercase.',
  title:          'Capitalizes the first letter of every word.',
  strip:          'Removes leading and trailing whitespace (or given characters).',
  lstrip:         'Removes leading (left-side) whitespace or given characters.',
  rstrip:         'Removes trailing (right-side) whitespace or given characters.',
  split:          'Splits the string into a list of words by a separator (default: space).',
  rsplit:         'Splits from the right side, up to a maximum number of splits.',
  splitlines:     'Splits the string at line breaks and returns a list of lines.',
  join:           'Joins items of an iterable into one string using this string as separator.',
  replace:        'Replaces all occurrences of one substring with another.',
  find:           'Returns the index of the first occurrence of a substring, or -1 if not found.',
  rfind:          'Returns the index of the last occurrence of a substring, or -1.',
  index:          'Like find(), but raises ValueError if the substring is not found.',
  rindex:         'Like rfind(), but raises ValueError if the substring is not found.',
  count:          'Returns how many times a substring appears in the string.',
  startswith:     'Returns True if the string begins with the given prefix.',
  endswith:       'Returns True if the string ends with the given suffix.',
  format:         'Inserts values into the string at {} placeholders.',
  format_map:     'Like format() but takes a mapping (dict) instead of keyword arguments.',
  encode:         'Encodes the string to bytes using a given encoding (default UTF-8).',
  decode:         'Decodes bytes back to a string using a given encoding.',
  isalpha:        'Returns True if all characters are letters (a-z, A-Z) and the string is not empty.',
  isdigit:        'Returns True if all characters are digits (0-9) and the string is not empty.',
  isalnum:        'Returns True if all characters are letters or digits.',
  isspace:        'Returns True if all characters are whitespace (spaces, tabs, newlines).',
  isupper:        'Returns True if all cased characters are uppercase.',
  islower:        'Returns True if all cased characters are lowercase.',
  istitle:        'Returns True if the string is titlecased (each word starts with uppercase).',
  isnumeric:      'Returns True if all characters are numeric characters.',
  isdecimal:      'Returns True if all characters are decimal digit characters.',
  isidentifier:   'Returns True if the string is a valid Python identifier/variable name.',
  isprintable:    'Returns True if all characters are considered printable.',
  center:         'Centers the string in a field of given width, padded with a fill character.',
  ljust:          'Left-justifies the string in a field of given width.',
  rjust:          'Right-justifies the string in a field of given width.',
  zfill:          'Pads the string on the left with zeros to reach a given total width.',
  expandtabs:     'Replaces tab characters with spaces to align at tab stop positions.',
  maketrans:      'Creates a translation table for use with translate().',
  translate:      'Replaces characters according to a translation table.',
  partition:      'Splits the string at the first occurrence of a separator into 3 parts.',
  rpartition:     'Splits the string at the last occurrence of a separator into 3 parts.',
  removeprefix:   'Removes a given prefix from the start of the string if it exists.',
  removesuffix:   'Removes a given suffix from the end of the string if it exists.',
  swapcase:       'Swaps uppercase letters to lowercase and vice versa.',
}

// ─── List methods ─────────────────────────────────────────────────────────────
export const LIST_METHODS: Record<string, string> = {
  append:         'Adds a single item to the end of the list.',
  extend:         'Adds all items from another iterable to the end of the list.',
  insert:         'Inserts an item at a given position index.',
  remove:         'Removes the first occurrence of a given value from the list.',
  pop:            'Removes and returns the item at a given index (default: last item).',
  clear:          'Removes all items from the list, leaving it empty.',
  index:          'Returns the index of the first occurrence of a value.',
  count:          'Returns how many times a value appears in the list.',
  sort:           'Sorts the list in place (modifies the original list).',
  reverse:        'Reverses the order of items in the list in place.',
  copy:           'Returns a shallow copy of the list.',
}

// ─── Tuple methods ────────────────────────────────────────────────────────────
export const TUPLE_METHODS: Record<string, string> = {
  count:          'Returns how many times a value appears in the tuple.',
  index:          'Returns the index of the first occurrence of a value in the tuple.',
}

// ─── Dictionary methods ───────────────────────────────────────────────────────
export const DICT_METHODS: Record<string, string> = {
  get:            'Returns the value for a key, or a default value if the key is not found.',
  keys:           'Returns a view of all keys in the dictionary.',
  values:         'Returns a view of all values in the dictionary.',
  items:          'Returns a view of all (key, value) pairs in the dictionary.',
  update:         'Updates the dictionary with key-value pairs from another dict or iterable.',
  pop:            'Removes and returns the value for a key; raises KeyError if not found.',
  popitem:        'Removes and returns the last inserted (key, value) pair.',
  clear:          'Removes all key-value pairs from the dictionary.',
  copy:           'Returns a shallow copy of the dictionary.',
  setdefault:     'Returns the value for a key; if missing, inserts it with a default value.',
  fromkeys:       'Creates a new dictionary from a list of keys with a shared default value.',
}

// ─── Set methods ──────────────────────────────────────────────────────────────
export const SET_METHODS: Record<string, string> = {
  add:            'Adds a single element to the set (ignored if already present).',
  remove:         'Removes an element from the set; raises KeyError if not found.',
  discard:        'Removes an element if present; does nothing if not found.',
  pop:            'Removes and returns an arbitrary element from the set.',
  clear:          'Removes all elements from the set.',
  union:          'Returns a new set with elements from this set and all others.',
  intersection:   'Returns a new set with only elements common to all sets.',
  difference:     'Returns a new set with elements in this set but not in the others.',
  symmetric_difference: 'Returns a new set with elements in either set but not both.',
  update:              'Adds all elements from another set or iterable into this set.',
  intersection_update: 'Keeps only elements found in this set and all others.',
  difference_update:   'Removes all elements found in another set from this set.',
  issubset:       'Returns True if every element of this set is in the other set.',
  issuperset:     'Returns True if this set contains every element of the other set.',
  isdisjoint:     'Returns True if the two sets have no elements in common.',
  copy:           'Returns a shallow copy of the set.',
}

// ─── Math module functions ────────────────────────────────────────────────────
export const MATH_FUNCTIONS: Record<string, string> = {
  sqrt:           'Returns the square root of a number.',
  ceil:           'Rounds a number UP to the nearest integer.',
  floor:          'Rounds a number DOWN to the nearest integer.',
  trunc:          'Truncates a number toward zero (removes the decimal part).',
  fabs:           'Returns the absolute value of a float.',
  factorial:      'Returns the factorial of a non-negative integer (n!).',
  gcd:            'Returns the greatest common divisor of two integers.',
  lcm:            'Returns the least common multiple of two integers.',
  log:            'Returns the natural logarithm, or log to a given base.',
  log2:           'Returns the base-2 logarithm of a number.',
  log10:          'Returns the base-10 logarithm of a number.',
  exp:            'Returns e raised to the power of a number.',
  pow:            'Returns x raised to the power y (math.pow always returns float).',
  sin:            'Returns the sine of an angle given in radians.',
  cos:            'Returns the cosine of an angle given in radians.',
  tan:            'Returns the tangent of an angle given in radians.',
  asin:           'Returns the arcsine (inverse sine) of a value in radians.',
  acos:           'Returns the arccosine (inverse cosine) of a value in radians.',
  atan:           'Returns the arctangent (inverse tangent) of a value in radians.',
  atan2:          'Returns the angle in radians between the x-axis and point (y, x).',
  degrees:        'Converts an angle from radians to degrees.',
  radians:        'Converts an angle from degrees to radians.',
  hypot:          'Returns the Euclidean distance (hypotenuse) from the origin to a point.',
  isnan:          'Returns True if the value is NaN (Not a Number).',
  isinf:          'Returns True if the value is positive or negative infinity.',
  isfinite:       'Returns True if the value is finite (not NaN or infinity).',
  comb:           'Returns the number of ways to choose k items from n (combinations).',
  perm:           'Returns the number of ways to arrange k items from n (permutations).',
  prod:           'Returns the product of all elements in an iterable.',
  dist:           'Returns the Euclidean distance between two points.',
  modf:           'Returns the fractional and integer parts of a number as a tuple.',
  fmod:           'Returns the remainder of x / y (like % but for floats).',
  copysign:       'Returns a value with the magnitude of x and the sign of y.',
  fsum:           'Returns an accurate floating-point sum of values in an iterable.',
}

// ─── File object methods ──────────────────────────────────────────────────────
export const FILE_METHODS: Record<string, string> = {
  read:           'Reads the entire file content (or up to n bytes) as a string.',
  readline:       'Reads and returns one line from the file.',
  readlines:      'Reads all lines from the file and returns them as a list.',
  write:          'Writes a string to the file and returns the number of characters written.',
  writelines:     'Writes a list of strings to the file (no newlines added automatically).',
  close:          'Closes the file and releases its resources.',
  flush:          'Forces any buffered data to be written to the file immediately.',
  seek:           'Moves the file cursor to a specific byte position.',
  tell:           'Returns the current byte position of the file cursor.',
  truncate:       'Truncates the file to at most the given size in bytes.',
  readable:       'Returns True if the file can be read.',
  writable:       'Returns True if the file can be written to.',
  seekable:       'Returns True if the file supports random access (seek/tell).',
}

// ─── Exception / error methods ────────────────────────────────────────────────
export const EXCEPTION_METHODS: Record<string, string> = {
  // Common exceptions shown as call events when raised
  ValueError:     'Raised when a function receives the right type but an inappropriate value.',
  TypeError:      'Raised when an operation is applied to an object of the wrong type.',
  IndexError:     'Raised when trying to access an index that is out of range.',
  KeyError:       'Raised when a dictionary key is not found.',
  AttributeError: 'Raised when an attribute or method does not exist on an object.',
  NameError:      'Raised when a variable name is used before it has been defined.',
  ZeroDivisionError: 'Raised when dividing by zero.',
  FileNotFoundError: 'Raised when a file or directory does not exist.',
  IOError:        'Raised when an input/output operation fails (e.g. file not found).',
  OSError:        'Raised when a system operation fails.',
  OverflowError:  'Raised when the result of a numeric operation is too large.',
  RecursionError: 'Raised when the maximum recursion depth is exceeded.',
  StopIteration:  'Raised by next() when an iterator has no more items.',
  RuntimeError:   'Raised when an error doesn\'t fit any other category.',
  NotImplementedError: 'Raised when an abstract method hasn\'t been implemented yet.',
  MemoryError:    'Raised when an operation runs out of memory.',
  AssertionError: 'Raised when an assert statement fails.',
  ImportError:    'Raised when an import statement fails to find a module.',
  ModuleNotFoundError: 'Raised when an imported module cannot be found.',
  PermissionError:'Raised when lacking permission to perform a file/OS operation.',
  TimeoutError:   'Raised when a system function times out.',
  UnicodeDecodeError: 'Raised when decoding bytes to a string fails.',
  UnicodeEncodeError: 'Raised when encoding a string to bytes fails.',
  UnicodeError:   'Base class for encoding/decoding errors.',
  SyntaxError:    'Raised when Python encounters invalid syntax in the code.',
  IndentationError: 'Raised when indentation is incorrect.',
  Exception:      'The base class for all non-system-exiting exceptions.',
  BaseException:  'The base class for ALL exceptions in Python.',
  // Common exception methods
  args:           'Tuple containing the arguments passed to the exception.',
  with_traceback: 'Sets the traceback for an exception and returns the exception.',
}

// ─── Merged lookup ────────────────────────────────────────────────────────────
// All categories merged — method name collision is intentional
// (e.g. "pop" exists in list, dict, set — description is contextual but similar enough)
const ALL: Record<string, string> = {
  ...BUILTINS,
  ...STRING_METHODS,
  ...LIST_METHODS,
  ...TUPLE_METHODS,
  ...DICT_METHODS,
  ...SET_METHODS,
  ...MATH_FUNCTIONS,
  ...FILE_METHODS,
  ...EXCEPTION_METHODS,
}

/**
 * Look up any built-in function, method, or exception by name.
 * Returns the one-line description, or null if unknown.
 */
export function getBuiltinDesc(name: string): string | null {
  return ALL[name] ?? null
}
