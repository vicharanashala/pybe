/**
 * Per-case-study reveal content.
 *
 * INV-PB-1: revealed content MAY contain minimal Python syntax, but the
 * scenario above the gate is syntax-free.
 *
 * Each entry pairs the case study with:
 * - construct: short label of the constructs the learner just discovered
 * - firstCode: a tiny runnable snippet (Phase 4 will execute this in-browser)
 * - visualKind: which concept visual to render
 * - explanation: a concrete walkthrough in plain English first
 * - didYouKnow (optional): a real-world / historical / cultural fact that
 *   makes the construct stick
 * - whyItMatters (optional): a one-line "in the wild" reason to care
 */

export type VisualKind = 'string-slicing' | 'dictionary' | 'loop' | 'none';

export interface RevealEntry {
  construct: string;
  explanation: string;
  firstCode: string;
  visualKind: VisualKind;
  didYouKnow?: string;
  whyItMatters?: string;
}

export const REVEALS: Record<string, RevealEntry> = {
  cs_001: {
    construct: 'list, for, sum, len',
    explanation:
      'A Python list groups many values together. You can walk through the list with a for loop, ' +
      'total them with sum(), and divide by the count from len() to get the average. ' +
      'Strings can also be sliced to extract parts of a longer text.',
    firstCode:
      'marks = [78, 92, 65, 88, 71]\n' +
      'total = sum(marks)\n' +
      'count = len(marks)\n' +
      'average = total / count\n' +
      'print(average)  # 78.8',
    visualKind: 'string-slicing',
    didYouKnow:
      'The word "average" comes from the Arabic "awariya", which referred to the loss of goods ' +
      'in a shipwreck — the owner of the lost cargo paid "the average" to the other merchants. ' +
      'Mathematicians in 17th-century Florence adopted the word to mean the equal share each ' +
      'merchant should bear.',
    whyItMatters:
      'Averages are the most-cited statistic in news headlines. The next time a politician says ' +
      '"the average family", you can write the four lines above and check the number yourself.',
  },
  cs_002: {
    construct: 'dict',
    explanation:
      'A Python dictionary stores labelled fields. You give each value a name (the key), and you ' +
      'fetch the value by that name later. Think of it like a contact card: name, phone, city — ' +
      'each labeled.',
    firstCode:
      'person = {\n' +
      '  "name": "Ansh",\n' +
      '  "height_cm": 172,\n' +
      '  "weight_kg": 70,\n' +
      '}\n' +
      'bmi = person["weight_kg"] / (person["height_cm"] / 100) ** 2\n' +
      'print(bmi)  # 23.7',
    visualKind: 'dictionary',
    didYouKnow:
      'The BMI was invented in the 1830s by Adolphe Quetelet, a Belgian astronomer — not a ' +
      'doctor. He wanted a single number to describe the "average man", and the medical world ' +
      'only started using his index a century later.',
    whyItMatters:
      'Dictionaries are the data structure behind every JSON API, every cookie in your browser, ' +
      'and every database row you will ever read. Master this, and you have mastered the shape ' +
      'of the modern web.',
  },
  cs_003: {
    construct: 'if, elif, else',
    explanation:
      'A chain of if / elif / else checks walks the value through one bucket after another. ' +
      "The first match wins — the rest is skipped. The chain must cover all the cases, " +
      'and the order usually goes from most restrictive to most lenient.',
    firstCode:
      'score = 84\n' +
      'if score >= 90:\n' +
      '    grade = "A"\n' +
      'elif score >= 80:\n' +
      '    grade = "B"\n' +
      'elif score >= 70:\n' +
      '    grade = "C"\n' +
      'elif score >= 60:\n' +
      '    grade = "D"\n' +
      'else:\n' +
      '    grade = "F"\n' +
      'print(grade)  # B',
    visualKind: 'none',
    didYouKnow:
      'The first "grade classifier" in software history was the 1889 Hollerith census tabulator — ' +
      'it sorted punched cards by age, marital status, and literacy into different physical bins. ' +
      'A modern if / elif / else is the in-memory version of the same idea.',
    whyItMatters:
      'The 90/80/70/60/else chain is the shape of almost every business rule — loan approvals, ' +
      'tax brackets, content moderation, even Tinder matches. One short program covers a family ' +
      'of decisions.',
  },
  cs_004: {
    construct: 'list, for, sum, len',
    explanation:
      'When you cannot type every number by hand, you need a for loop to walk through them. ' +
      'A running total accumulates one value at a time. Combined with len() you get the average ' +
      'without ever knowing the size of the list in advance.',
    firstCode:
      'marks = [78, 92, 65, 88, 71]\n' +
      'total = 0\n' +
      'for m in marks:\n' +
      '    total = total + m\n' +
      'average = total / len(marks)\n' +
      'print(average)  # 78.8',
    visualKind: 'loop',
    didYouKnow:
      'The accumulator pattern in this snippet is the same shape used by Google to count ' +
      'PageRank votes across a billion web pages — one link at a time, into a running total. ' +
      'A for loop with a running sum is, in miniature, a search engine.',
    whyItMatters:
      'Any time data is in a list — sensor readings, exam scores, daily rainfall — the ' +
      'for / accumulator pair is the right tool. You will use it on the first day of any job.',
  },
  cs_005: {
    construct: 'set',
    explanation:
      'A set is a collection that holds each item only once. Adding the same value twice ' +
      'leaves the set unchanged. So if you build a set from a list full of duplicates, the ' +
      'set is automatically the unique-only list.',
    firstCode:
      'signups = ["a@x.com", "b@y.com", "a@x.com", "c@z.com", "b@y.com"]\n' +
      'unique = set(signups)\n' +
      'print(len(unique))  # 3\n' +
      'print(unique)        # {"a@x.com", "b@y.com", "c@z.com"}',
    visualKind: 'none',
    didYouKnow:
      'The Python set is a direct descendant of the mathematical set introduced by Georg Cantor ' +
      'in 1874. Cantor used sets to prove that some infinities are larger than others — a ' +
      'result that shocked the mathematics world.',
    whyItMatters:
      'Deduplication — finding unique values — is a daily task in every real database. SQL ' +
      'DISTINCT, the Excel "remove duplicates" button, and your browser\'s blocker "unique ' +
      'trackers seen today" are all sets under the hood.',
  },
  // ─── Phase-7 generated cases — hand-curated reveal content ──────────────
  cs_006: {
    construct: 'list, dict',
    explanation:
      'You can hold each row as a dictionary with named fields, then put every row into a list. ' +
      'The list keeps the order; the dict keeps the labels. Together they form the standard ' +
      'table shape in Python — the same shape you see in a CSV file.',
    firstCode:
      'rows = [\n' +
      '  {"name": "Asha", "score": 78},\n' +
      '  {"name": "Rohit", "score": 92},\n' +
      '  {"name": "Mira", "score": 65},\n' +
      ']\n' +
      'for r in rows:\n' +
      '    if r["score"] >= 70:\n' +
      '        print(r["name"], "passes")\n',
    visualKind: 'dictionary',
    didYouKnow:
      'The first spreadsheet, VisiCalc (1979), stored each cell as a label-value pair — the ' +
      'same dict shape. Every spreadsheet cell in Excel and Google Sheets is, at heart, a ' +
      'dictionary entry indexed by its address.',
    whyItMatters:
      'Tabular data — log lines, sales records, survey responses — is the input to 80% of ' +
      'real-world Python. The list-of-dicts pattern is the lingua franca of data work.',
  },
  cs_007: {
    construct: 'list, dict',
    explanation:
      'Group rows that share a property by storing the property as the dictionary key and the ' +
      'matching rows as a list under it. A single pass through the data builds the whole table.',
    firstCode:
      'rows = [\n' +
      '  {"city": "Pune", "temp": 31},\n' +
      '  {"city": "Delhi", "temp": 41},\n' +
      '  {"city": "Pune", "temp": 29},\n' +
      ']\n' +
      'by_city = {}\n' +
      'for r in rows:\n' +
      '    by_city.setdefault(r["city"], []).append(r["temp"])\n' +
      'print(by_city)  # {"Pune": [31, 29], "Delhi": [41]}\n',
    visualKind: 'dictionary',
    didYouKnow:
      'The `setdefault` trick is the oldest of Python\'s "group-by" idioms — Guido van ' +
      'Rossum mentioned it in his 1998 history-of-Python essay as one of the patterns that ' +
      'made Python feel "small and powerful".',
    whyItMatters:
      'Grouping data by a key is the foundation of every pivot table, every "users per ' +
      'country" chart, every "orders per day" dashboard. One for loop with a dict does it.',
  },
  cs_008: {
    construct: 'list, for, append',
    explanation:
      'A list can grow as you discover new items. Start with [], then for each new item call ' +
      'list.append(item). The list keeps the order you added things in, so you can also walk ' +
      'it back in the same order later.',
    firstCode:
      'cart = []\n' +
      'cart.append("Mango")\n' +
      'cart.append("Rice")\n' +
      'cart.append("Olive Oil")\n' +
      'for item in cart:\n' +
      '    print("  •", item)\n' +
      'print("Total items:", len(cart))\n',
    visualKind: 'none',
    didYouKnow:
      'The list in Python is a dynamic array — it grows by allocating a slightly bigger array ' +
      'and copying the items over. CPython uses a geometric growth factor of 1.125, which ' +
      'keeps the amortised append cost at O(1).',
    whyItMatters:
      'append is the verb of every accumulating process: harvesting, queueing, building a ' +
      'report row by row, collecting sensor readings, even writing a chat log.',
  },
  cs_009: {
    construct: 'open, with',
    explanation:
      '`with open(path) as f:` gives you a safe handle to a file. The handle lets you read the ' +
      'file line by line, and the `with` block makes sure the file is closed even if something ' +
      'throws in the middle.',
    firstCode:
      'with open("server.log") as f:\n' +
      '    for line in f:\n' +
      '        if "ERROR" in line:\n' +
      '            print(line.strip())\n',
    visualKind: 'none',
    didYouKnow:
      'Reading a file is so common that the "open / with" pattern was promoted to a dedicated ' +
      'keyword in Python 2.5 (2006) — without it, every program that crashed mid-read leaked ' +
      'a file handle, slowly exhausting the operating system\'s open-file limit.',
    whyItMatters:
      'Logs, CSV exports, configuration files, JSON snapshots — almost every piece of real ' +
      'data you meet lives in a file. `with open(...) as f:` is the only line you need to read it.',
  },
  cs_010: {
    construct: 'set, for',
    explanation:
      'A set keeps only one copy of each value. Build a set by adding every guest name; if a ' +
      'name is added twice, it is still in the set only once. The set is the natural way to ' +
      'de-duplicate a list of people.',
    firstCode:
      'invitees = ["Asha", "Rohit", "Asha", "Mira", "Rohit", "Anil"]\n' +
      'unique = set()\n' +
      'for name in invitees:\n' +
      '    unique.add(name)\n' +
      'print(len(unique), "distinct guests:", sorted(unique))\n',
    visualKind: 'none',
    didYouKnow:
      'Set lookup in Python is so fast that "is X already in this collection?" is a constant-time ' +
      'question even when the collection has 10 million entries. This is why Python uses sets ' +
      'internally for member checks.',
    whyItMatters:
      'Removing duplicates, finding overlaps, building a "who has already been here" log — ' +
      'all set operations. They show up in fraud detection, friend suggestions, and Venn ' +
      'diagrams in journalism.',
  },
  cs_011: {
    construct: 'list, for, append',
    explanation:
      'A leaderboard is just a list of (name, score) pairs kept in the order of insertion. ' +
      'A short loop with append adds new entries; sorted() reorders the list at the end.',
    firstCode:
      'scores = []\n' +
      'scores.append(("Asha", 78))\n' +
      'scores.append(("Rohit", 92))\n' +
      'scores.append(("Mira", 65))\n' +
      'ranked = sorted(scores, key=lambda p: p[1], reverse=True)\n' +
      'for i, (name, sc) in enumerate(ranked, 1):\n' +
      '    print(f"{i}. {name} — {sc}")\n',
    visualKind: 'none',
    didYouKnow:
      'The 1999 Mars Climate Orbiter burned up in the Martian atmosphere because one NASA team ' +
      'used English units and another used metric. A leaderboard-style reconciliation log would ' +
      'have caught the mismatch at the first data entry.',
    whyItMatters:
      'Sorted leaderboards are the engine of every ranking — exam scores, sports, even dating ' +
      'apps. The list-append + sorted pattern is the shortest path from raw events to a ' +
      'visible rank.',
  },
  cs_012: {
    construct: 'dict, for, get',
    explanation:
      'A dict can hold a count for every key. For each student, ask `counts.get(name, 0)` to ' +
      'read the current count (or 0 if not seen yet), then write back the new value. After ' +
      'one pass, every name has a frequency.',
    firstCode:
      'attendance = ["Asha", "Rohit", "Asha", "Mira", "Asha", "Rohit"]\n' +
      'counts = {}\n' +
      'for name in attendance:\n' +
      '    counts[name] = counts.get(name, 0) + 1\n' +
      'print(counts)  # {"Asha": 3, "Rohit": 2, "Mira": 1}\n',
    visualKind: 'dictionary',
    didYouKnow:
      '`dict.get(key, default)` exists in Python because the very first PEP (PEP 8, 2001) ' +
      'argued that "read-with-default" was a common enough pattern to deserve a built-in. ' +
      'Without it, every dict loop would need a `if key in d` check first.',
    whyItMatters:
      'Counting how often things happen is the seed of every histogram, every bar chart, and ' +
      'every "top N" list. The dict-of-counts pattern is the first thing a data scientist ' +
      'writes on a new dataset.',
  },
  cs_013: {
    construct: 'dict, for, get',
    explanation:
      '`dict.get(key)` returns None when the key is missing, and `dict.get(key, default)` ' +
      'returns the default. This is the safe way to fetch a value without raising KeyError, ' +
      'and it powers almost every "is this contact in the phonebook?" lookup.',
    firstCode:
      'phonebook = {"Asha": "98...", "Rohit": "87..."}\n' +
      'for name in ["Asha", "Mira"]:\n' +
      '    number = phonebook.get(name, "no number on file")\n' +
      '    print(name, "->", number)\n',
    visualKind: 'dictionary',
    didYouKnow:
      'The first electronic phone book was the 1879 Connecticut directory — 250 subscribers, ' +
      'listed by hand, in a leather-bound book. A Python dict of 250 entries fits in 16 ' +
      'kilobytes of memory.',
    whyItMatters:
      'Lookups are the verb of every "is this in the list?" question. dict.get is the safe, ' +
      'no-KeyError version. Master it and you master most of what real apps do all day.',
  },
  cs_014: {
    construct: 'slice, for, list',
    explanation:
      'A slice like `s[-N:]` gives you the last N characters of a string. The `-N` counts ' +
      'backwards from the end; the colon and the empty second index mean "all the way to the ' +
      'end".',
    firstCode:
      'pin = "5295-1234-9876-4567"\n' +
      'last4 = pin[-4:]\n' +
      'print("Last 4 digits:", last4)  # 4567\n',
    visualKind: 'string-slicing',
    didYouKnow:
      'Negative indices are a Python invention. In C, asking for `s[-1]` would be undefined ' +
      'behaviour. Guido van Rossum added them in 1990 because slicing the last N characters ' +
      'came up in every piece of text-processing code he wrote.',
    whyItMatters:
      'Last-N-digit masking is the single most common privacy pattern in software: credit ' +
      'cards, phone numbers, Aadhaar, passport numbers. `s[-4:]` is the heart of it.',
  },
  cs_015: {
    construct: 'slice, for, list',
    explanation:
      'A palindrome reads the same forwards and backwards. The cheapest palindrome test is ' +
      '`s == s[::-1]` — the `[::-1]` slice steps through the string backwards, giving the ' +
      'reversed string in O(n).',
    firstCode:
      'def is_palindrome(s):\n' +
      '    s = s.lower().replace(" ", "")\n' +
      '    return s == s[::-1]\n' +
      '\n' +
      'print(is_palindrome("A man a plan a canal Panama"))  # True\n' +
      'print(is_palindrome("MadamImAdam"))  # True\n',
    visualKind: 'string-slicing',
    didYouKnow:
      'The longest single-word palindrome in the dictionary is "racecar" — and it was ' +
      'deliberately invented for palindrome puzzles, not from any real-world use. "Madam" ' +
      'and "civic" are equally long natural palindromes.',
    whyItMatters:
      'Palindrome tests show up in bioinformatics (DNA palindromes are restriction-enzyme ' +
      'sites) and in the simplest unit tests in computer-science textbooks. The `[::-1]` ' +
      'slice is the shortest possible answer.',
  },
  cs_016: {
    construct: 'for, range, sum, len',
    explanation:
      '`range(n)` produces the integers 0, 1, …, n−1. Combined with sum() and len() you can ' +
      'compute aggregates without ever materialising the list — Python\'s range is lazy.',
    firstCode:
      'days = 30\n' +
      'total = sum(range(1, days + 1))  # 1 + 2 + ... + 30\n' +
      'print("Total inventory in 30 days:", total)\n' +
      'print("Average per day:", total / days)\n',
    visualKind: 'loop',
    didYouKnow:
      'There is a closed-form for `sum(range(1, n+1))` — it is `n * (n + 1) / 2`, the same ' +
      'formula 7-year-old Gauss is famous for inventing in his classroom. Python will happily ' +
      'compute either one in a single line.',
    whyItMatters:
      'Range-driven loops are how you do "do something N times" or "walk from i to j" without ' +
      'typing a list. They show up in animations, simulations, and every piece of code that ' +
      'processes a fixed number of items.',
  },
  cs_017: {
    construct: 'for, range, sum, len',
    explanation:
      'To count pages of a website, you loop from page 1 to N and tally what you find. ' +
      'A for loop with range is the right tool when you know in advance how many iterations ' +
      'you want — unlike a while loop, which depends on a condition.',
    firstCode:
      'pages_to_crawl = 5\n' +
      'total = 0\n' +
      'for p in range(1, pages_to_crawl + 1):\n' +
      '    total += p * 12  # 12 links per page\n' +
      'print("Total links crawled:", total)\n',
    visualKind: 'loop',
    didYouKnow:
      'Googlebot started as a fixed-N crawler in 1996 — Larry Page wanted to index the first ' +
      '10 million web pages, so the original crawler had a hard-coded cap. Modern crawlers ' +
      'still prefer bounded loops when the bound is known.',
    whyItMatters:
      'When the data has a known size (5 pages, 30 days, 100 transactions), a range loop is ' +
      'clearer than a while. Readable code is a competitive advantage.',
  },
  cs_018: {
    construct: 'for, range, sum, len',
    explanation:
      'Iterating through poll readings one by one, accumulating a running total, is the same ' +
      'loop pattern in disguise. The only difference is what you do inside the loop — here, ' +
      'you treat a missing reading (None) as 0.',
    firstCode:
      'readings = [31, 29, None, 30, 32, None, 28]\n' +
      'total = 0\n' +
      'count = 0\n' +
      'for r in readings:\n' +
      '    if r is not None:\n' +
      '        total += r\n' +
      '        count += 1\n' +
      'print("Average:", total / count)\n',
    visualKind: 'loop',
    didYouKnow:
      'In real sensor data, missing readings are not rare — they are the norm. The ' +
      '`None`-skipping pattern in this snippet is the seed of the data-quality libraries ' +
      'pandas and polars.',
    whyItMatters:
      'Real data is dirty. The ability to write a loop that gracefully skips the bad rows is ' +
      'a daily necessity. A 4-line for loop with an `if` guard does the job cleanly.',
  },
  cs_019: {
    construct: 'for, range, sum, len',
    explanation:
      'FizzBuzz is the canonical loop warm-up. The rule: print numbers 1 to 15, but replace ' +
      'multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of 15 with ' +
      '"FizzBuzz". The if/elif/else chain inside a for loop expresses the rule directly.',
    firstCode:
      'for n in range(1, 16):\n' +
      '    if n % 15 == 0:\n' +
      '        print("FizzBuzz")\n' +
      '    elif n % 3 == 0:\n' +
      '        print("Fizz")\n' +
      '    elif n % 5 == 0:\n' +
      '        print("Buzz")\n' +
      '    else:\n' +
      '        print(n)\n',
    visualKind: 'loop',
    didYouKnow:
      'FizzBuzz was a drinking game in British schools before it became a programmer\'s rite ' +
      'of passage. Imran Ghory popularised it as a coding-interview question in a 2007 blog ' +
      'post, and it has trapped new graduates ever since.',
    whyItMatters:
      'FizzBuzz teaches three things at once: a for loop, a modulo, and a chained condition. ' +
      'Every larger program is a FizzBuzz grown up — a loop, a check, a rule, a print.',
  },
  cs_020: {
    construct: 'str, f-string, slice',
    explanation:
      'An f-string lets you embed Python expressions directly inside a string: `f"Hello, ' +
      '{name}!"`. The braces are placeholders; the value of `name` is inserted when the ' +
      'string is built.',
    firstCode:
      'name = "Asha"\n' +
      'hour = 11\n' +
      'print(f"Good {hour}am, {name}! Welcome back.")\n' +
      'greeting = f"Hello, {name.upper()}! You are {2026 - 2005} years old."\n' +
      'print(greeting)\n',
    visualKind: 'none',
    didYouKnow:
      'f-strings (formatted string literals) arrived in Python 3.6 in late 2016. Before them, ' +
      'you had to call `.format()` or use `%`-style formatting — both noticeably more verbose ' +
      'and slower. The f-string spec is one of the shortest PEPs in history (PEP 498).',
    whyItMatters:
      'String formatting is the heartbeat of every user-facing message: greetings, error ' +
      'messages, log lines, emails. f-strings are the most readable way to do it in any ' +
      'mainstream language.',
  },
  cs_021: {
    construct: 'str, f-string, slice',
    explanation:
      '`str.split()` breaks a sentence into words. Combine it with a len() and you have a ' +
      'one-line word counter.',
    firstCode:
      'sentence = "Pybe teaches Python through real problems not syntax."\n' +
      'words = sentence.split()\n' +
      'print("Words:", len(words))\n' +
      'print("Longest word:", max(words, key=len))\n' +
      'print("First 3 words:", words[:3])\n',
    visualKind: 'string-slicing',
    didYouKnow:
      'The longest word in any major English dictionary is "pneumonoultramicroscopicsilicovolcanoconiosis" ' +
      '— 45 letters, a lung disease caused by silica dust. Python splits it into one token: ' +
      'no special-casing needed.',
    whyItMatters:
      'Word counts, sentence counts, paragraph counts — text metrics are the front line of ' +
      'search engines, content moderation, and the famous "average read time" widget on ' +
      'every blog.',
  },
  cs_022: {
    construct: 'str, f-string, slice',
    explanation:
      'A CSV line is a string with commas. `str.split(",")` breaks it into a list of fields. ' +
      'A tiny loop over those fields builds a record.',
    firstCode:
      'line = "Asha,Pune,98\"\n' +
      'name, city, marks = line.split(",")\n' +
      'print(f"{name} from {city} scored {marks}")\n' +
      '\n' +
      'multi = "a,b,c\\n1,2,3"\n' +
      'for row in multi.splitlines():\n' +
      '    print("row:", row.split(","))\n',
    visualKind: 'none',
    didYouKnow:
      'CSV (Comma-Separated Values) is older than the personal computer — chemists in the ' +
      '1960s used comma-separated ASCII to send instrument data over teletypes. The format ' +
      'has outlived every storage technology invented since.',
    whyItMatters:
      'CSV is the lowest common denominator of data exchange. Every spreadsheet, every ' +
      'database, every stats package reads it. The `split(",")` trick is your first data ' +
      'parser.',
  },
  cs_023: {
    construct: 'function, return',
    explanation:
      'A function bundles a calculation behind a name. `def tip(bill, pct)` is a recipe: ' +
      'feed it a bill amount and a percentage, and it returns the tip. Calling the function ' +
      'with different arguments gives different answers — without rewriting the math.',
    firstCode:
      'def tip(bill, pct=10):\n' +
      '    return round(bill * pct / 100, 2)\n' +
      '\n' +
      'print(tip(500))         # 50.0\n' +
      'print(tip(500, 15))     # 75.0\n' +
      'print(tip(500, 20) + 500)  # total with a 20% tip\n',
    visualKind: 'none',
    didYouKnow:
      'The default argument `pct=10` in this snippet is the original Python "default value" ' +
      'feature from 1991. Most modern languages copied it from Python — JavaScript added ' +
      'default arguments in 2015 (ES6), almost 25 years later.',
    whyItMatters:
      'A function is a named, reusable piece of logic. Every larger program is a tree of ' +
      'functions calling functions. The `def` keyword is the smallest unit of code reuse.',
  },
  cs_024: {
    construct: 'function, return',
    explanation:
      'A function can call other functions. `roll(n)` returns a list of n random rolls; ' +
      '`total(rolls)` sums them. Together they form a two-step pipeline that reads like a ' +
      'sentence.',
    firstCode:
      'import random\n' +
      'def roll_die():\n' +
      '    return random.randint(1, 6)\n' +
      'def roll(n):\n' +
      '    return [roll_die() for _ in range(n)]\n' +
      'print("3 dice:", roll(3))\n',
    visualKind: 'none',
    didYouKnow:
      'The first truly random numbers on a computer came from a hardware device connected to ' +
      'a Geiger counter (the 1950s ERNIE machine). Today `random.randint` uses a deterministic ' +
      'algorithm called Mersenne Twister — fast, but not cryptographically secure.',
    whyItMatters:
      'Composing small functions is the heart of clean code. `roll_die` and `roll` are each ' +
      'one job; together they cover the "roll N dice" question. This is how every library is ' +
      'built.',
  },
  cs_025: {
    construct: 'module, import',
    explanation:
      'A module is a file full of code you can borrow. `import datetime` brings the standard ' +
      '`datetime` module into your program; `datetime.date.today()` returns today\'s date. ' +
      'You didn\'t write that code — but you can use it as if it were your own.',
    firstCode:
      'import datetime\n' +
      'today = datetime.date.today()\n' +
      'print("Today is", today)\n' +
      'print("ISO format:", today.isoformat())\n' +
      'print("Year:", today.year)\n',
    visualKind: 'none',
    didYouKnow:
      'Python\'s standard library is so large that "batteries included" is one of its slogans. ' +
      'You get a date library, a JSON parser, a math library, an HTTP client, and a unit-test ' +
      'framework without ever installing anything.',
    whyItMatters:
      'Importing code is how you stop reinventing wheels. Master the standard library and you ' +
      'have 200+ well-tested tools at your fingertips before writing a single new line.',
  },
  cs_026: {
    construct: 'module, import',
    explanation:
      '`csv` is a standard-library module for reading CSV files. `csv.reader(f)` yields a ' +
      'list of lists — one list per row, with each row split on commas (and quoted fields ' +
      'handled correctly).',
    firstCode:
      'import csv\n' +
      'rows = [\n' +
      '  ["name", "city"],\n' +
      '  ["Asha", "Pune"],\n' +
      '  ["Rohit", "Delhi"],\n' +
      ']\n' +
      'with open("people.csv", "w", newline="") as f:\n' +
      '    csv.writer(f).writerows(rows)\n' +
      '\n' +
      'with open("people.csv") as f:\n' +
      '    for row in csv.reader(f):\n' +
      '        print(row)\n',
    visualKind: 'none',
    didYouKnow:
      'The csv module was added to the standard library in Python 1.4 (1996). Its ' +
      'implementation is a state machine — a tiny piece of code that reads one character at ' +
      'a time and tracks whether it is inside a quoted field or not.',
    whyItMatters:
      'Most business data is in CSV. The csv module is the difference between "I can read ' +
      'this 10-MB file" and "I have to write my own parser". Always import, never reimplement.',
  },
  cs_027: {
    construct: 'try, except',
    explanation:
      'A try / except block runs a piece of code, and if it raises an error, you catch the ' +
      'error in the except clause. The program keeps going — it does not crash on bad input. ' +
      'The error is logged, the function returns a safe default, the user moves on.',
    firstCode: [
      'def safe_int(text, default=0):',
      '    try:',
      '        return int(text)',
      '    except ValueError:',
      "        print(f\"  couldn't parse {text!r}, using {default}\")",
      '        return default',
      '',
      'print(safe_int("42"))         # 42',
      'print(safe_int("not a num"))  # 0',
    ].join('\n'),
    visualKind: 'none',
    didYouKnow:
      'The term "exception" was popularised by Ada and PL/I in the 1970s. Python adopted it ' +
      'in 1991 with a key innovation: exceptions are objects you can catch by class, not just ' +
      'a single error code. That is what makes `except ValueError` possible.',
    whyItMatters:
      'Robust code is code that fails gracefully. try / except is the difference between a ' +
      'program that asks "what if the user typed abc?" and one that crashes when they do.',
  },
  cs_028: {
    construct: 'list, for',
    explanation:
      'A list comprehension is a for loop inside a list, written on one line. The syntax is ' +
      '`[expression for item in iterable if condition]`. It is the most concise way to build ' +
      'a new list from another collection.',
    firstCode:
      'nums = [1, 2, 3, 4, 5]\n' +
      'squares = [n * n for n in nums]\n' +
      'evens = [n for n in nums if n % 2 == 0]\n' +
      'print("squares:", squares)\n' +
      'print("evens:", evens)\n',
    visualKind: 'none',
    didYouKnow:
      'List comprehensions were borrowed from the functional language Haskell, where the ' +
      'notation `[x * x | x <- [1..5]]` has been used since 1990. Python adopted them in ' +
      'Python 2.0 (2000) and they have been a productivity multiplier ever since.',
    whyItMatters:
      'Comprehensions turn a 4-line for loop into a single readable line. They are how Python ' +
      'programmers "filter and transform" data — every pandas, NumPy, and Django query uses ' +
      'this same shape under the hood.',
  },
  cs_029: {
    construct: 'class, function',
    explanation:
      'A class bundles data and the functions that act on that data. `Rectangle` has a ' +
      'width and a height; its `area()` and `perimeter()` methods know how to read those ' +
      'values and compute. The class is a small factory for rectangle objects.',
    firstCode:
      'class Rectangle:\n' +
      '    def __init__(self, w, h):\n' +
      '        self.w = w\n' +
      '        self.h = h\n' +
      '    def area(self):\n' +
      '        return self.w * self.h\n' +
      '    def perimeter(self):\n' +
      '        return 2 * (self.w + self.h)\n' +
      'r = Rectangle(3, 4)\n' +
      'print("area:", r.area(), "perimeter:", r.perimeter())\n',
    visualKind: 'none',
    didYouKnow:
      'Classes in Python are themselves objects — instances of a built-in class called ' +
      '`type`. This "metaclass" idea is what lets frameworks like Django and SQLAlchemy ' +
      'inspect and modify class definitions at import time.',
    whyItMatters:
      'Every larger codebase is built from classes. The Rectangle pattern — data + methods ' +
      'that act on the data — is the blueprint for every model, controller, and view in ' +
      'every framework you will ever use.',
  },
  cs_030: {
    construct: 're, str',
    explanation:
      'A regular expression (regex) is a mini-language for matching text. `r"\\b[A-Z0-9._%+-]+' +
      '@[A-Z0-9.-]+\\.[A-Z]{2,}\\b"` is a single line that recognises most email addresses. ' +
      '`re.findall(pattern, text)` returns every match.',
    firstCode:
      'import re\n' +
      'text = "Mail Asha at asha@x.com or mira@pune.in for details."\n' +
      'emails = re.findall(r"[\\w.]+@[\\w.]+", text)\n' +
      'print(emails)  # [\'asha@x.com\', \'mira@pune.in\']\n',
    visualKind: 'none',
    didYouKnow:
      'Regular expressions were invented in 1956 by Stephen Kleene, a mathematician, to ' +
      'describe "regular events" in nerve nets. Ken Thompson put them inside ed, the first ' +
      'Unix editor, in 1968. 70 years later, every text editor still has them.',
    whyItMatters:
      'Log parsing, web scraping, form validation, data cleaning — regex is the swiss-army ' +
      'knife of text. Learn to read a regex and you can skim through 10 MB of text in a ' +
      'single line of code.',
  },
  cs_031: {
    construct: 'function, async',
    explanation:
      '`async`/`await` lets one program do many things that wait at the same time. While one ' +
      'network request is in flight, the program can start the next one — instead of waiting ' +
      'for each one in turn.',
    firstCode:
      'import asyncio\n' +
      'async def fetch_one(url):\n' +
      '    await asyncio.sleep(1)  # pretend network call\n' +
      '    return f"got {url}"\n' +
      '\n' +
      'async def main():\n' +
      '    results = await asyncio.gather(\n' +
      '        fetch_one("a.com"),\n' +
      '        fetch_one("b.com"),\n' +
      '        fetch_one("c.com"),\n' +
      '    )\n' +
      '    print(results)\n' +
      '\n' +
      'asyncio.run(main())\n',
    visualKind: 'none',
    didYouKnow:
      'Python\'s async/await arrived in 3.5 (2015), borrowing the syntax from C# 5.0. Before ' +
      'it, the same idea lived in the older `yield`-based coroutines — still in the language, ' +
      'but rarely used directly.',
    whyItMatters:
      'Async is how modern web servers, scrapers, and chat apps handle thousands of requests ' +
      'per second without spinning up thousands of threads. It is the difference between an ' +
      'app that scales and one that does not.',
  },
  // ─── Phase-11 hand-crafted case studies ─────────────────────────────────
  cs_033: {
    construct: 'list, while, append',
    explanation:
      'The Fibonacci sequence starts 1, 1, 2, 3, 5, 8, 13, 21, 34 — each number is the sum of ' +
      'the previous two. You can build the whole sequence by keeping a list and appending the ' +
      'sum of the last two elements, over and over. A `while` loop is the right tool when you ' +
      'do not know in advance how many iterations you need.',
    firstCode:
      'fibs = [1, 1]\n' +
      'while fibs[-1] < 1000:\n' +
      '    fibs.append(fibs[-1] + fibs[-2])\n' +
      'print("Fibonacci under 1000:", fibs)\n',
    visualKind: 'loop',
    didYouKnow:
      'The golden ratio (≈ 1.618) is the limit of the ratio of consecutive Fibonacci numbers. ' +
      'It appears in the spirals of sunflowers (34 and 55 are consecutive Fibonacci numbers, ' +
      'just like in this case), in the chambered nautilus shell, in the breeding of rabbits ' +
      '(Fibonacci\'s original 1202 puzzle), and in the proportions of the Parthenon. The ' +
      'sequence was first described in India by Pingala, around 200 BC — long before Leonardo ' +
      'of Pisa (Fibonacci) wrote it down in Europe.',
    whyItMatters:
      'The Fibonacci sequence is a recurring character in finance (the Elliott Wave theory), ' +
      'biology (phylotaxis — the way leaves spiral around a stem), and algorithm design ' +
      '(memoised Fibonacci is the classic intro to dynamic programming). One short loop in ' +
      'Python, and you have generated the same numbers nature does.',
  },
  cs_034: {
    construct: 'str, *, len',
    explanation:
      'Python lets you multiply a string by a number: `"Mango" * 3` gives "MangoMangoMango". ' +
      'The `*` operator on a string is the same kind of repetition you would write by hand, ' +
      'but it works for any count and is a single expression. Combined with `len()` to plan ' +
      'the count, you can fill a 36-inch border with no partial motifs at the end.',
    firstCode:
      'motif = "MangoPeacock"\n' +
      'border_inches = 36\n' +
      'motif_inches = len(motif) * 0.3  # roughly 6 inches\n' +
      'count = border_inches // motif_inches\n' +
      'border = motif * count\n' +
      'print(f"{count} motifs of {motif} = a {len(border)*0.3:.1f}-inch border")\n' +
      'print(border)\n',
    visualKind: 'none',
    didYouKnow:
      'Tiruchirappalli Central Jail in Tamil Nadu has been weaving sarees since 1922, when ' +
      'British prison authorities started a "productive labour" programme. Today the looms ' +
      'produce around 4,000 metres of fabric a month, and the sarees are sold under the ' +
      '"Freedom" brand — partly because the work prepares inmates for jobs after release. ' +
      'The mango-and-peacock motif on the border is one of the most recognisable in South ' +
      'India.',
    whyItMatters:
      'String multiplication shows up in unit-test data (repeat a sample string 1,000 times to ' +
      'measure throughput), in graphics (a line of dashes), and in the absolute simplest way ' +
      'to "fill" something. The trick `motif * n` is one of those tiny Python details that ' +
      'feels like a superpower the first time you see it.',
  },
  cs_035: {
    construct: 'for, range, sum',
    explanation:
      'Triangular numbers — 1, 3, 6, 10, 15, 21, ... — count how many items fit in a triangle ' +
      'where the i-th row has i items. You can build the whole list with one accumulator: ' +
      'start at 0, then for each i in 1..n, add i to the running total. After n rows, the ' +
      'total is the triangular number T(n).',
    firstCode:
      'rows = 4\n' +
      'total = 0\n' +
      'for r in range(1, rows + 1):\n' +
      '    total = total + r\n' +
      '    print(f"  row {r}: {r} diyas, running total {total}")\n' +
      'print(f"{rows} rows of diyas needs {total} lamps total")\n',
    visualKind: 'loop',
    didYouKnow:
      'The story that Carl Friedrich Gauss, at age 7, silenced his teacher by instantly ' +
      'summing the integers 1 to 100 is one of the most-cited anecdotes in mathematics. The ' +
      'formula T(n) = n(n+1)/2 he improvised is the same closed form Python would compute ' +
      'for the running total above. Bowling pins are arranged in a 10-row triangular number, ' +
      'and the 15-puzzle (a 4-row triangle of 15 pegs with one empty hole) is the most ' +
      'popular solitaire game of the 1870s.',
    whyItMatters:
      'The accumulator pattern — start at 0, add the next thing, repeat — is the seed of ' +
      'every aggregate calculation you will ever write. Sum of sales, sum of votes, sum of ' +
      'calories: every running total is a triangular-number computation in disguise.',
  },
};