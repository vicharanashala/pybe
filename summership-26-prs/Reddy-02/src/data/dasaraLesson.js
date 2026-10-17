/**
 * dasaraLesson.js
 * ─────────────────────────────────────────────────────────────────
 * Structured lesson data for the Dasara Festival Discovery Lab.
 * Teaches Python exception handling: try, except, else, finally,
 * ValueError, and KeyError — through fictional festival-software
 * scenarios inspired by Dasara / Vijayadashami traditions.
 *
 * Schema mirrors the PyBe summership-26-prs case-study pattern
 * (scenario → think → discover → reveal → learn → code → practice
 *  → assessment → trophy) with an added audio/narration reference
 *  and chapter-state metadata.
 *
 * Cultural note: The Durga–Mahishasura and Rama–Ravana traditions
 * are presented as distinct regional narratives associated with
 * Dasara / Vijayadashami; neither is claimed to be the only or
 * canonical account.
 * ─────────────────────────────────────────────────────────────────
 */

export const MODULE_META = {
  id: 'dasara-discovery-lab',
  version: '1.0.0',
  title: 'The Dasara Festival Discovery Lab',
  subtitle: 'Nine nights of courage. A day of victory. A lesson in handling the unexpected.',
  description:
    'An immersive Python exception-handling module set against the traditions of Dasara and Vijayadashami.',
  concepts: ['try', 'except', 'else', 'finally', 'ValueError', 'KeyError'],
  learningObjectives: [
    'Explain what a Python exception is.',
    'Identify a ValueError caused by invalid integer conversion.',
    'Recognize a KeyError from accessing a missing dictionary key.',
    'Write appropriate try and except blocks.',
    'Explain the difference between else and finally.',
    'Predict program output when an exception is raised.',
    'Complete a short Python exception-handling exercise independently.',
  ],
  estimatedMinutes: 30,
  difficulty: 'Beginner',
  prerequisiteConcepts: ['variables', 'functions', 'print'],
  author: 'Reddy-02 / Vicharanashala',
};

/* ──────────────────────────────────────────────────────
   CHAPTERS
   Each chapter has: id, type, title, narration (text for
   TTS / captions), and chapter-specific fields.
────────────────────────────────────────────────────── */

export const CHAPTERS = [

  /* ══════════════════════════════════════
     CHAPTER 0 — CINEMATIC OPENING
  ══════════════════════════════════════ */
  {
    id: 'opening',
    type: 'cinematic',
    chapterNum: 0,
    title: 'The Dasara Festival Discovery Lab',
    subtitle: 'Nine nights of courage. A day of victory. A lesson in handling the unexpected.',
    narration:
      'Welcome to the Dasara Festival Discovery Lab. Dasara — also known as Dussehra and Vijayadashami — is one of India\'s most celebrated festivals, associated with the victory of good over evil across many traditions and regions. In this journey, you will help a fictional festival information system face unexpected inputs, missing data, and incomplete operations. By the end, you will understand how Python handles the unexpected — using exceptions. Begin when you are ready.',
    cta: 'Begin the Journey',
    ctaAlt: 'Explore without narration',
  },

  /* ══════════════════════════════════════
     CHAPTER 1 — ENTER THE STORY
  ══════════════════════════════════════ */
  {
    id: 'enter-story',
    type: 'story-intro',
    chapterNum: 1,
    eyebrow: 'The Festival',
    title: 'Vijayadashami — A Day of Victory',
    narration:
      'Dasara, also called Dussehra or Vijayadashami, marks the tenth day of the Navratri festival and is celebrated across India in diverse ways. In many South and East Indian traditions, Vijayadashami celebrates the victory of Goddess Durga over the buffalo demon Mahishasura. In many North, West, and Central Indian traditions, the festival commemorates Rama\'s victory over Ravana, as narrated in the Ramayana. Across regions, Dasara is a time of community, cultural performance, and the triumph of good over evil. In Mysuru, the Jamboo Savari procession and illuminated palace are famous worldwide. In Ayodhya and Varanasi, Ramlila performances and effigy burning mark Dussehra. Elsewhere, Bommai Kolu, Ayudha Puja, and Vidyarambham are observed.',
    paragraphs: [
      'Dasara — also known as Dussehra or Vijayadashami — is celebrated across India with remarkable diversity. The tenth day of Navratri brings different stories to different communities.',
      'In many South and East Indian traditions, Vijayadashami honours Goddess Durga\'s victory over Mahishasura. In many North, West, and Central Indian traditions, it celebrates Rama\'s victory over Ravana. Both traditions share the same theme: courage in the face of the unexpected, and the ultimate triumph of good.',
      'In this learning experience, you will enter a fictional digital festival-information system built to guide visitors through Dasara celebrations. When the system encounters the unexpected — and it will — you will learn how Python handles it.',
    ],
    choices: [
      { id: 'durga-path', label: 'Explore the Durga–Mahishasura tradition', icon: '🌺' },
      { id: 'main-path', label: 'Continue the guided learning path', icon: '📜' },
    ],
    culturalNote:
      'The traditions described represent distinct regional and religious contexts. Neither is presented as the only or definitive account of Dasara.',
  },

  /* ══════════════════════════════════════
     CHAPTER 2 — THE RISE OF MAHISHASURA
  ══════════════════════════════════════ */
  {
    id: 'mahishasura-rise',
    type: 'story-challenge',
    chapterNum: 2,
    eyebrow: 'The Story · Chapter I',
    title: 'The Arrogance of Certainty',
    narration:
      'In the traditional account, Mahishasura obtained a boon that made him believe he could not be defeated by any man or god. This certainty without regard for the unexpected left him unprepared. When the unexpected finally arrived — in the form of Goddess Durga, the united energy of all the gods — he had no plan to handle it. Programs face a similar challenge. When a program assumes its input is always valid and never plans for the unexpected, it too is left without a handler.',
    story: `In the traditional account associated with many South and East Indian Dasara observances, Mahishasura — the buffalo demon — obtained a powerful boon. Convinced that no man or god could ever defeat him, he allowed this certainty to become his weakness.

His arrogance was not in his strength, but in his refusal to plan for the unexpected. He had no strategy for anything outside his assumptions.

When the gods, overwhelmed by his power, united their divine energies and manifested Goddess Durga, Mahishasura faced something entirely outside his plan. He had no handler for this situation.

The festival information system you are helping to build faces its own version of this problem.`,
    scenePrediction: {
      prompt:
        'The festival system receives a visitor input and tries to process it. Before we look at the code, what do you think should happen when a program receives an input it cannot understand?',
      options: [
        { id: 'a', text: 'The program should immediately stop and crash.' },
        { id: 'b', text: 'The program should silently ignore the unexpected input.' },
        { id: 'c', text: 'The program should detect the problem and respond gracefully.' },
        { id: 'd', text: 'It depends — the program cannot know what is unexpected.' },
      ],
      bestAnswer: 'c',
      explanations: {
        a: 'Crashing does signal a problem, but it ends the experience for the visitor. A well-designed system catches the problem and continues helping.',
        b: 'Silently ignoring the input could produce wrong results or leave the system in an invalid state — often worse than crashing.',
        c: 'Exactly. A resilient program detects that something unexpected has happened and responds with a clear, graceful message instead of crashing or hiding the problem. This is what exception handling enables.',
        d: 'Programs can describe the kinds of problems they expect to encounter — and respond to each specifically. Python\'s exception system is built for exactly this.',
      },
    },
  },

  /* ══════════════════════════════════════
     CHAPTER 3 — THE NINE-DAY BATTLE
     ValueError challenge
  ══════════════════════════════════════ */
  {
    id: 'nine-day-battle',
    type: 'concept-challenge',
    chapterNum: 3,
    eyebrow: 'The Story · Chapter II + Python Concept: ValueError',
    title: 'Nine Nights — and an Invalid Input',
    narration:
      'In the traditional account, Goddess Durga\'s nine-night battle with Mahishasura is commemorated during Navratri — nine nights of worship, music, and dance. Our festival information system needs to read how many days remain until the festival. A visitor types the word "nine" instead of the number 9. When Python tries to convert the string "nine" into an integer, it raises a ValueError. This is not a bug in the program\'s logic — it is Python saying: I cannot do what you asked with this input.',
    story: `Navratri — literally "nine nights" — is observed across India before Vijayadashami. In many traditions, each night honours one of nine forms of Goddess Durga. By the tenth day, Vijayadashami, her victory is celebrated.

The festival information system is asked: how many days remain until the festival?

A visitor types their answer: the word "nine."

The system attempts to process this — and encounters something Python calls an exception.`,
    codeProblem: {
      title: 'What happens when Python runs this?',
      code: `days_input = "nine"
days = int(days_input)
print(f"Festival in {days} days!")`,
      question:
        'Python tries to convert the string "nine" into an integer. What happens?',
      options: [
        { id: 'a', text: 'Python converts it to 9 automatically.' },
        { id: 'b', text: 'Python raises a ValueError.' },
        { id: 'c', text: 'Python raises a SyntaxError.' },
        { id: 'd', text: 'Python prints "nine" as-is.' },
      ],
      correctId: 'b',
      explanations: {
        a: 'Python does not guess at meaning. It cannot convert the word "nine" to an integer — it would need "9" (the digit). Attempting the impossible conversion raises an exception.',
        b: 'Correct. int("nine") raises a ValueError: invalid literal for int() with base 10: \'nine\'. Python is telling you: I cannot convert this string to an integer.',
        c: 'A SyntaxError means the code itself is not valid Python syntax. The code here is syntactically correct — it runs, but then fails at runtime when int() cannot do its job.',
        d: 'Python does not fall through to print when the conversion fails. The exception interrupts normal execution at the int() call.',
      },
      exceptionTrace: [
        { line: 1, code: 'days_input = "nine"', status: 'ok',        note: 'Assignment succeeds. days_input now holds the string "nine".' },
        { line: 2, code: 'days = int(days_input)', status: 'raises',  note: 'int("nine") raises ValueError — "nine" cannot be converted to an integer.' },
        { line: 3, code: 'print(...)',            status: 'skipped', note: 'This line is never reached. The exception interrupted execution.' },
      ],
    },
    conceptIntro: {
      title: 'What is an Exception?',
      body: `An exception is Python's way of saying: something unexpected happened while the program was running, and I cannot continue normally.

When int("nine") is called, Python tries to parse the string as a number. It cannot. Rather than producing a wrong result, Python raises a ValueError — a signal that the value provided was not usable for the requested operation.

The program stops at the line that raised the exception. Any code after that line — in the same block — is skipped.

An exception is not a syntax error. The code is correct Python. The problem is what happened when it ran.`,
    },
  },

  /* ══════════════════════════════════════
     CHAPTER 4 — INTRODUCING try / except
  ══════════════════════════════════════ */
  {
    id: 'try-except',
    type: 'code-lab',
    chapterNum: 4,
    eyebrow: 'Python Concept: try and except',
    title: 'Building the Handler',
    narration:
      'Goddess Durga prepared for the unexpected. Python lets you do the same with try and except. A try block contains the code you want to attempt. If an exception is raised inside the try block, Python immediately jumps to the matching except block and runs that code instead. Execution then continues normally after the except block. The exception is handled, and the program does not crash.',
    code: `try:
    days = int("nine")
    print(days)
except ValueError:
    print("Please enter a valid number.")`,
    codeLines: [
      {
        lineNum: 1,
        code: 'try:',
        status: 'normal',
        explain: '"try" tells Python: I am about to attempt something that might fail. Watch for exceptions in the indented block below.',
      },
      {
        lineNum: 2,
        code: '    days = int("nine")',
        status: 'raises',
        explain: 'int("nine") raises a ValueError. Python immediately stops this line and looks for a matching except handler.',
      },
      {
        lineNum: 3,
        code: '    print(days)',
        status: 'skipped',
        explain: 'Skipped. Because line 2 raised an exception, execution jumps directly to the except block. This line never runs.',
      },
      {
        lineNum: 4,
        code: 'except ValueError:',
        status: 'handled',
        explain: '"except ValueError" matches the ValueError that was raised on line 2. Python enters this block.',
      },
      {
        lineNum: 5,
        code: '    print("Please enter a valid number.")',
        status: 'handled',
        explain: 'This line runs because the ValueError was caught. Output: "Please enter a valid number."',
      },
    ],
    executionPaths: {
      withException: {
        label: 'When input is "nine" (invalid)',
        path: [1, 2, 4, 5],
        output: 'Please enter a valid number.',
      },
      withoutException: {
        label: 'When input is "9" (valid)',
        path: [1, 2, 3],
        output: '9',
        note: 'When no exception is raised, the except block is skipped entirely.',
      },
    },
    editableExample: {
      prompt: 'Change the input from "nine" to "9" and observe how execution changes.',
      variants: [
        { input: '"nine"', expectedOutput: 'Please enter a valid number.' },
        { input: '"9"',    expectedOutput: '9' },
        { input: '"0"',    expectedOutput: '0' },
        { input: '""',     expectedOutput: 'Please enter a valid number.' },
      ],
    },
  },

  /* ══════════════════════════════════════
     CHAPTER 5 — RAMA'S JOURNEY
     KeyError challenge
  ══════════════════════════════════════ */
  {
    id: 'rama-journey',
    type: 'story-challenge',
    chapterNum: 5,
    eyebrow: 'The Story · Chapter III + Python Concept: KeyError',
    title: 'A Key the Map Does Not Contain',
    narration:
      'In the Ramayana tradition associated with many North, West, and Central Indian Dussehra observances, Rama journeys to Lanka with the help of Hanuman, Lakshmana, Sugriva, and the Vanara army to rescue Sita. The journey requires careful planning and trust in information that exists. When the mission-information dictionary is asked for a key it does not contain, Python raises a KeyError. This is similar to asking a map for directions to a place that is not on the map. The map exists — but the destination you asked for is not recorded there.',
    story: `In the Ramayana tradition, when Rama learned that Sita had been taken to Lanka, he sought help from Sugriva and the Vanara army. Hanuman, the most devoted among them, crossed the ocean to find Sita and report back.

The mission required precise information: the destination, the guide, the path forward.

Our festival information system stores mission data in a Python dictionary:`,
    codeProblem: {
      title: 'A key the dictionary does not contain',
      code: `mission = {
    "destination": "Lanka",
    "guide": "Hanuman"
}

print(mission["bridge"])`,
      question:
        'The dictionary has "destination" and "guide" — but not "bridge". What happens?',
      options: [
        { id: 'a', text: 'Python prints None.' },
        { id: 'b', text: 'Python prints an empty string.' },
        { id: 'c', text: 'Python raises a KeyError.' },
        { id: 'd', text: 'Python adds the key "bridge" with an empty value.' },
      ],
      correctId: 'c',
      explanations: {
        a: 'Python does not return None for missing keys when you use bracket notation — it raises a KeyError. The dict.get() method would return None, but direct bracket access does not.',
        b: 'Python does not fill in empty strings for missing keys. It raises a KeyError.',
        c: 'Correct. Accessing a key that does not exist in a dictionary with bracket notation raises a KeyError: \'bridge\'.',
        d: 'Python does not auto-create keys. Reading a missing key raises a KeyError immediately.',
      },
      exceptionTrace: [
        { line: 1, code: 'mission = { "destination": "Lanka", "guide": "Hanuman" }', status: 'ok',     note: 'Dictionary created with two keys.' },
        { line: 5, code: 'print(mission["bridge"])',                                  status: 'raises', note: 'KeyError: \'bridge\' — this key does not exist in the dictionary.' },
      ],
    },
    recoveryChallenge: {
      title: 'How would you recover from a missing key?',
      prompt:
        'The mission needs bridge information. Which approach correctly handles the missing key?',
      options: [
        {
          id: 'a',
          label: 'Use dict.get() with a default',
          code: 'bridge = mission.get("bridge", "No bridge recorded")\nprint(bridge)',
          correct: true,
          explain: 'dict.get(key, default) returns the default value when the key is absent — no exception is raised. This is often the best approach when a missing key is a normal expected case.',
        },
        {
          id: 'b',
          label: 'Use try / except KeyError',
          code: 'try:\n    bridge = mission["bridge"]\nexcept KeyError:\n    bridge = "No bridge recorded"\nprint(bridge)',
          correct: true,
          explain: 'Wrapping bracket access in a try/except KeyError block is appropriate when a missing key represents an exceptional case that needs specific handling.',
        },
        {
          id: 'c',
          label: 'Check before accessing',
          code: 'if "bridge" in mission:\n    bridge = mission["bridge"]\nelse:\n    bridge = "No bridge recorded"\nprint(bridge)',
          correct: true,
          explain: '"key in dict" checks existence without raising an exception. All three approaches are valid — the best choice depends on whether a missing key is routine or exceptional.',
        },
        {
          id: 'd',
          label: 'Just delete the line',
          code: '# Remove the print line',
          correct: false,
          explain: 'Removing the code does not solve the problem — it just hides it. The system still needs a way to handle the case where "bridge" may or may not be in the mission data.',
        },
      ],
    },
  },

  /* ══════════════════════════════════════
     CHAPTER 6 — VIJAYADASHAMI: THE VICTORY
     try / except / else / finally
  ══════════════════════════════════════ */
  {
    id: 'vijayadashami',
    type: 'complete-concept',
    chapterNum: 6,
    eyebrow: 'The Story · Chapter IV + Python Concept: else and finally',
    title: 'The Day of Victory — Complete Exception Handling',
    narration:
      'Vijayadashami marks the day of victory: Goddess Durga\'s triumph over Mahishasura in one tradition, and Rama\'s victory over Ravana in another. Across India, the day is observed in many ways — from the Jamboo Savari procession in Mysuru to Ramlila performances and effigy burning at Dussehra celebrations. Our festival system now needs to register visitors — an operation that might succeed or fail. Python\'s try block holds the attempt, except handles the failure, else runs only when the try succeeded without exception, and finally runs no matter what — success or failure.',
    story: `Vijayadashami is observed differently across India. In Mysuru, the grand Jamboo Savari procession carries Goddess Chamundeshwari through illuminated streets. In Varanasi, Ayodhya, and many other cities, Ramlila performances culminate in the burning of a Ravana effigy. Bommai Kolu, Ayudha Puja, and Vidyarambham are observed in Tamil Nadu, Karnataka, Andhra Pradesh, and Telangana.

Each tradition is distinct. Each marks the victory in its own way.

Our festival visitor-registration system must now handle three outcomes: success, a bad input, and a necessary cleanup.`,
    regionalNote:
      'The traditions listed represent distinct regional and religious practices. Not all communities observe all of them. This presentation does not suggest that any tradition is more or less authentic than another.',
    finalCodeChallenge: {
      title: 'Complete the registration system',
      description:
        'The system tries to register a visitor by reading their festival-day preference. Fill in the blanks to complete the try / except / else / finally structure.',
      template: `festival_days = {
    "vijayadashami": 10,
    "navami": 9,
    "ashtami": 8
}

day_input = "vijayadashami"   # visitor's choice

_____:
    day_num = festival_days[day_input]
    _____:
        print(f"Registered for day {day_num}.")
_____  KeyError:
    print(f"Unknown festival day: {day_input}")
_____:
    print("Registration desk closed for this request.")`,
      blanks: [
        { id: 'b1', answer: 'try',     hint: 'The keyword that begins the block to attempt', position: 'line 9'  },
        { id: 'b2', answer: 'else',    hint: 'Runs only when the try block succeeds without an exception', position: 'line 11' },
        { id: 'b3', answer: 'except',  hint: 'The keyword that catches a specific exception type', position: 'line 13' },
        { id: 'b4', answer: 'finally', hint: 'Runs whether an exception occurred or not', position: 'line 15' },
      ],
      executionPaths: {
        validKey: {
          label: 'day_input = "vijayadashami" (key exists)',
          output: 'Registered for day 10.\nRegistration desk closed for this request.',
          path: ['try', 'else', 'finally'],
        },
        invalidKey: {
          label: 'day_input = "diwali" (key missing)',
          output: 'Unknown festival day: diwali\nRegistration desk closed for this request.',
          path: ['try', 'except KeyError', 'finally'],
        },
      },
    },
    conceptSummary: {
      title: 'The complete structure',
      items: [
        { keyword: 'try',     role: 'Attempt the operation that might fail.' },
        { keyword: 'except',  role: 'Run if a matching exception was raised inside try.' },
        { keyword: 'else',    role: 'Run only if try completed without any exception.' },
        { keyword: 'finally', role: 'Always run — whether an exception occurred or not. Used for cleanup.' },
      ],
    },
  },

  /* ══════════════════════════════════════
     CHAPTER 7 — INTERACTIVE CODE LAB
  ══════════════════════════════════════ */
  {
    id: 'code-lab',
    type: 'interactive-lab',
    chapterNum: 7,
    eyebrow: 'Code Laboratory',
    title: 'Explore Exception Handling',
    narration:
      'The code laboratory lets you explore all three examples from this module. Select an example, read the explanation, step through the execution line by line, and change the input to see how the execution path changes. The execution engine simulates Python output for the supported examples — it does not run arbitrary code.',
    labNote:
      'This laboratory simulates Python execution for the lesson examples. Output shown is deterministic based on the selected input — it is not running a live Python interpreter.',
    examples: [
      {
        id: 'ex-valueerror',
        title: 'ValueError — int conversion',
        code: `try:
    days = int("{INPUT}")
    print(days)
except ValueError:
    print("Please enter a valid number.")`,
        inputs: [
          { label: '"nine"  (invalid)', value: 'nine',  output: 'Please enter a valid number.', path: [1,2,4,5] },
          { label: '"9"     (valid)',   value: '9',     output: '9', path: [1,2,3] },
          { label: '"0"     (valid)',   value: '0',     output: '0', path: [1,2,3] },
          { label: '""      (empty)',   value: '',      output: 'Please enter a valid number.', path: [1,2,4,5] },
        ],
      },
      {
        id: 'ex-keyerror',
        title: 'KeyError — missing dictionary key',
        code: `mission = {
    "destination": "Lanka",
    "guide": "Hanuman"
}

try:
    info = mission["{INPUT}"]
    print(info)
except KeyError:
    print(f"Key not found: {INPUT}")`,
        inputs: [
          { label: '"destination" (exists)', value: 'destination', output: 'Lanka', path: [1,6,7,8] },
          { label: '"guide"       (exists)', value: 'guide',       output: 'Hanuman', path: [1,6,7,8] },
          { label: '"bridge"      (missing)', value: 'bridge',     output: 'Key not found: bridge', path: [1,6,9,10] },
          { label: '"weapon"      (missing)', value: 'weapon',     output: 'Key not found: weapon', path: [1,6,9,10] },
        ],
      },
      {
        id: 'ex-complete',
        title: 'try / except / else / finally',
        code: `festival_days = {
    "vijayadashami": 10,
    "navami": 9,
    "ashtami": 8
}

try:
    day_num = festival_days["{INPUT}"]
except KeyError:
    print(f"Unknown day: {INPUT}")
else:
    print(f"Registered for day {day_num}.")
finally:
    print("Registration desk closed.")`,
        inputs: [
          { label: '"vijayadashami" (valid)', value: 'vijayadashami', output: 'Registered for day 10.\nRegistration desk closed.', path: [7,8,11,12,13,14] },
          { label: '"navami"        (valid)', value: 'navami',        output: 'Registered for day 9.\nRegistration desk closed.', path: [7,8,11,12,13,14] },
          { label: '"diwali"        (missing)', value: 'diwali',      output: 'Unknown day: diwali\nRegistration desk closed.', path: [7,8,9,10,13,14] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════
     CHAPTER 8 — FINAL ASSESSMENT
  ══════════════════════════════════════ */
  {
    id: 'assessment',
    type: 'assessment',
    chapterNum: 8,
    eyebrow: 'Final Assessment',
    title: 'Test Your Understanding',
    narration:
      'Five questions to confirm what you have learned. Each question has one best answer. You will see an explanation after you answer. You can retry any question you get wrong.',
    passMark: 4,
    questions: [
      {
        id: 'q1',
        text: 'In Python, what is an exception?',
        options: [
          { id: 'a', text: 'A syntax mistake that prevents the program from running at all.' },
          { id: 'b', text: 'A runtime signal that something unexpected happened and normal execution cannot continue.' },
          { id: 'c', text: 'A warning that the program prints before continuing.' },
          { id: 'd', text: 'A type of comment that documents known errors.' },
        ],
        correctId: 'b',
        explanation:
          'An exception is raised at runtime — when the code is actually executing. A syntax error, by contrast, prevents the program from running at all. Exceptions do not just print warnings; they interrupt normal execution until they are handled (or cause the program to crash).',
        concept: 'exception basics',
      },
      {
        id: 'q2',
        text: 'What output does this code produce?\n\ntry:\n    x = int("abc")\nexcept ValueError:\n    print("caught")',
        options: [
          { id: 'a', text: 'Nothing — the program crashes.' },
          { id: 'b', text: 'caught' },
          { id: 'c', text: '0' },
          { id: 'd', text: 'ValueError' },
        ],
        correctId: 'b',
        explanation:
          'int("abc") raises a ValueError. The except ValueError block catches it and runs print("caught"). Output: caught. The program does not crash because the exception was handled.',
        concept: 'ValueError + try/except',
        isOutputPrediction: true,
      },
      {
        id: 'q3',
        text: 'A dictionary called "event" has keys "name" and "date" — but not "venue". What does event["venue"] produce?',
        options: [
          { id: 'a', text: 'None' },
          { id: 'b', text: 'An empty string' },
          { id: 'c', text: 'A KeyError' },
          { id: 'd', text: 'The string "venue"' },
        ],
        correctId: 'c',
        explanation:
          'Accessing a missing key with bracket notation raises a KeyError immediately. If you want a safe fallback, use event.get("venue") which returns None, or event.get("venue", "TBD") which returns the specified default.',
        concept: 'KeyError',
      },
      {
        id: 'q4',
        text: 'In a try / except / else / finally block, when does the "else" block execute?',
        options: [
          { id: 'a', text: 'Always — whether or not an exception occurred.' },
          { id: 'b', text: 'Only when an exception was raised and caught.' },
          { id: 'c', text: 'Only when the try block completed without raising any exception.' },
          { id: 'd', text: 'Whenever the except block does not handle the exception.' },
        ],
        correctId: 'c',
        explanation:
          'The "else" block runs only when the try suite completes without any exception being raised. If the try block raises an exception that is caught by except, the else block is skipped.',
        concept: 'else clause',
      },
      {
        id: 'q5',
        text: 'What does the "finally" block guarantee?',
        options: [
          { id: 'a', text: 'It runs only when all exceptions have been successfully handled.' },
          { id: 'b', text: 'It runs before the try block.' },
          { id: 'c', text: 'It runs whether an exception occurred or not, making it suitable for cleanup.' },
          { id: 'd', text: 'It runs only when no exception handler is found.' },
        ],
        correctId: 'c',
        explanation:
          '"finally" is guaranteed to execute regardless of whether the try block raised an exception or completed normally. It is the right place for cleanup actions — like closing files or releasing resources — that must happen in either case.',
        concept: 'finally clause',
      },
    ],
  },
];

export const CONCEPTS_SUMMARY = [
  {
    keyword: 'Exception',
    definition: 'A runtime signal that something unexpected happened and normal execution cannot continue.',
  },
  {
    keyword: 'ValueError',
    definition: 'Raised when a value is the wrong type for an operation — such as int("nine").',
  },
  {
    keyword: 'KeyError',
    definition: 'Raised when a dictionary is accessed with a key that does not exist.',
  },
  {
    keyword: 'try / except',
    definition: 'Attempt code in try; handle specific exceptions in except.',
  },
  {
    keyword: 'else',
    definition: 'Runs only when the try block completed without any exception.',
  },
  {
    keyword: 'finally',
    definition: 'Always runs — whether an exception occurred or not. Used for cleanup.',
  },
];

/* Helper: get chapter by id */
export const getChapter = (id) => CHAPTERS.find((c) => c.id === id);

/* Helper: ordered chapter ids for navigation */
export const CHAPTER_ORDER = CHAPTERS.map((c) => c.id);
