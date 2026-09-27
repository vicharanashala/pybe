/* =========================================================
   lessonData.js
   Pure content. No logic. No DOM access.
   Pedagogy: let the learner discover that a string is an
   ordered sequence of characters, and that positions can be
   used to read one character or a whole section, BEFORE any
   Python indexing/slicing syntax is shown.
   ========================================================= */

/* ---------------------------------------------------------
   MACRO STAGE LABELS (progress bar)
   --------------------------------------------------------- */
const MACRO_STAGE_LABELS = [
  'The Inscription',
  'Every Character Has a Place',
  'The Hidden Word',
  "The Scribe's Shortcut",
  'The Reversed Inscription',
  'Repair the Message',
  'Codebreaker Training',
  'The Final Cipher'
];

/* ---------------------------------------------------------
   LESSON STEPS
   --------------------------------------------------------- */
const LESSON_STEPS = [

  /* ============ STAGE 1 — THE MYSTERIOUS INSCRIPTION ============ */
  {
    id: 'inscription-intro',
    type: 'explore',
    macroIndex: 0,
    eyebrow: 'Chapter One · Suryagarh, the Sunlit Kingdom',
    title: 'The Mysterious Inscription',
    paragraphs: [
      'You are Ira, the newest Royal Scribe of Suryagarh. At dawn, a temple guard leads you to a weathered stone wall bearing a single unbroken line of carved letters — no spaces, no punctuation, just one long message left by scribes long before you.',
      'Your first task is not to translate anything. It is simply to look closely. Tap a few letters below and get a feel for the inscription.'
    ],
    message: 'MEETATTHEGOLDENTEMPLE',
    minInspected: 6,
    completionLine: 'You have inspected {count} of the {total} characters. Notice: every character sits in exactly one spot, in exactly one order — nothing repeats a place, nothing overlaps. That order is the whole secret of a string.'
  },

  /* ============ STAGE 2 — EVERY CHARACTER HAS A PLACE ============ */
  {
    id: 'position-four',
    type: 'index-reveal',
    macroIndex: 1,
    eyebrow: 'Chapter Two',
    title: 'Every Character Has a Place',
    paragraphs: [
      'The temple archivist joins you and points at the wall. "Every mark has a place, Scribe — the first mark, the second, the third. We count starting from zero, as the old registers always have."',
      'The numbers below each letter show its position. Find the character sitting at position 4, and tap it.'
    ],
    message: 'MEETATTHEGOLDENTEMPLE',
    targetIndex: 4,
    reveal: {
      lines: [
        'message = "MEETATTHEGOLDENTEMPLE"',
        'message[4]'
      ],
      output: "'A'",
      explanation: 'A position like this is called an index. message[4] asks Python for the single character sitting at index 4 — counting starts at 0, so that is the 5th letter, "A".'
    }
  },

  /* ============ STAGE 3 — THE HIDDEN WORD ============ */
  {
    id: 'hidden-word',
    type: 'slice-challenge',
    macroIndex: 2,
    eyebrow: 'Chapter Three',
    title: 'The Hidden Word',
    paragraphs: [
      'The archivist frowns at the wall. "There is a word hidden in the middle of this line — a place name, I think. See if you can find where it begins and where it ends."',
      'Tap the character where the hidden word starts, then tap the character where it ends. Every letter in between will be selected too.'
    ],
    message: 'MEETATTHEGOLDENTEMPLE',
    targetStart: 9,
    targetEndInclusive: 14,
    targetWord: 'GOLDEN',
    reveal: {
      lines: [
        'message = "MEETATTHEGOLDENTEMPLE"',
        'message[9:15]'
      ],
      output: "'GOLDEN'",
      explanation: 'This is called slicing. message[9:15] means "start at index 9, and stop right before index 15." The start position is included, but the stop position is excluded — that is why 15, not 14, marks the end.'
    }
  },

  /* ============ STAGE 4 — THE SCRIBE'S SHORTCUT ============ */
  {
    id: 'scribes-shortcut',
    type: 'negative-index',
    macroIndex: 3,
    eyebrow: 'Chapter Four',
    title: "The Scribe's Shortcut",
    paragraphs: [
      'A second inscription awaits at the granary gate: an order about when the gates must close.',
      'The archivist asks: "Quickly — what is the very last mark on this wall? Do not waste time counting from the start."'
    ],
    message: 'RETURNBEFORESUNSET',
    lastCharTarget: 17,
    lastCharReveal: {
      lines: [
        'message = "RETURNBEFORESUNSET"',
        'message[-1]'
      ],
      output: "'T'",
      explanation: 'A negative index counts backward from the end. message[-1] is always the last character, message[-2] the one before it, and so on — no counting from the beginning required.'
    },
    wordPrompt: 'Now find the final word of the order, using the same shortcut — count backward from the end.',
    wordStart: 12,
    wordEndInclusive: 17,
    wordTarget: 'SUNSET',
    wordReveal: {
      lines: [
        'message = "RETURNBEFORESUNSET"',
        'message[-6:]'
      ],
      output: "'SUNSET'",
      explanation: 'message[-6:] starts 6 characters from the end and continues to the very end of the string. Leaving the stop position empty means "go all the way to the end."'
    }
  },

  /* ============ STAGE 5 — THE REVERSED INSCRIPTION ============ */
  {
    id: 'reversed-inscription',
    type: 'reverse-challenge',
    macroIndex: 4,
    eyebrow: 'Chapter Five',
    title: 'The Reversed Inscription',
    paragraphs: [
      'Deep in the temple vault, you find a smaller tablet. Its letters make no sense read left to right — until the archivist tilts her head. "Some warnings," she says, "were carved to be read backward, so only a careful scribe would ever notice."',
      'Use the button below to read the tablet from its last letter to its first, and choose the message it reveals.'
    ],
    reversedMessage: 'TNEPRESEHTFOERAWEB',
    options: [
      'BEWAREOFTHESERPENT',
      'BEFOREWETHESERPENT',
      'BEWARETHESERPENTOF',
      'THESERPENTBEWAREOF'
    ],
    correctIndex: 0,
    reveal: {
      lines: [
        'message = "TNEPRESEHTFOERAWEB"',
        'message[::-1]'
      ],
      output: "'BEWAREOFTHESERPENT'",
      explanation: 'message[::-1] uses a step of -1, meaning "walk through the string one position at a time, but backward." A negative step is what reverses the whole string.'
    }
  },

  /* ============ STAGE 6 — REPAIR THE ROYAL MESSAGE ============ */
  {
    id: 'repair-message',
    type: 'repair',
    macroIndex: 5,
    eyebrow: 'Chapter Six',
    title: 'Repair the Royal Message',
    paragraphs: [
      'An apprentice carved the temple inscription in a hurry — the case is uneven, and one rune near the middle looks miscut. The Royal Archive accepts only clean, uppercase records.',
      'Choose the right method for each problem below.'
    ],
    corrupted: 'meetATtheGOLDBNtemple',
    upperResult: 'MEETATTHEGOLDBNTEMPLE',
    finalResult: 'MEETATTHEGOLDENTEMPLE',
    tasks: [
      {
        id: 'case-fix',
        problem: 'The lettering mixes upper and lower case. Standardize it to match every other royal record.',
        methods: [
          { label: 'message.upper()', correct: true },
          { label: 'message.lower()', correct: false, note: 'That would make everything lowercase — the Royal Archive requires uppercase.' },
          { label: 'message.title()', correct: false, note: "That only capitalizes the first letter of each word, and this inscription has no spaces to mark words." }
        ]
      },
      {
        id: 'rune-fix',
        problem: 'One rune was miscarved: "GOLDBN" should read "GOLDEN". Fix only that section.',
        methods: [
          { label: 'message.replace("GOLDBN", "GOLDEN")', correct: true },
          { label: 'message.upper()', correct: false, note: "That only changes letter case — it won't fix a wrong letter." },
          { label: 'message[9:15]', correct: false, note: 'That would only read the section, not correct it.' }
        ]
      }
    ],
    reveal: {
      lines: [
        'message = "meetATtheGOLDBNtemple"',
        'message = message.upper()',
        'message = message.replace("GOLDBN", "GOLDEN")'
      ],
      output: "'MEETATTHEGOLDENTEMPLE'",
      explanation: 'upper() rewrites every letter as uppercase, and replace(old, new) swaps one exact section of text for another. Neither one changes the original string — each returns a new, corrected string.'
    }
  },

  /* ============ STAGE 7 — ROYAL CODEBREAKER TRAINING ============ */
  {
    id: 'codebreaker-training',
    type: 'practice',
    macroIndex: 6,
    eyebrow: 'Chapter Seven',
    title: 'Royal Codebreaker Training',
    intro: 'The archivist hands you a stack of fresh tablets from around the kingdom. Six short tests — solve each before moving to the next.',
    rounds: [
      {
        message: 'SUNRISEATDAWN',
        prompt: 'What single character is at message[3]?',
        options: ['R', 'S', 'I', 'N'],
        correctIndex: 0,
        wrongExplanation: 'Count from 0: S(0) U(1) N(2) R(3) — index 3 lands on "R", not the letter you picked.',
        rightExplanation: 'Correct — counting from 0, index 3 is "R".'
      },
      {
        message: 'THEHIDDENGATE',
        prompt: 'Which slice extracts the hidden word "HIDDEN"?',
        options: ['message[3:9]', 'message[3:8]', 'message[2:9]', 'message[4:9]'],
        correctIndex: 0,
        wrongExplanation: '"HIDDEN" runs from index 3 through index 8. Remember the stop index in a slice is excluded, so you need one past the last letter you want — that means message[3:9].',
        rightExplanation: 'Correct — message[3:9] starts at index 3 and stops just before index 9, capturing exactly "HIDDEN".'
      },
      {
        message: 'NORTHWATCHTOWER',
        prompt: 'Which expression grabs the last 5 characters, "TOWER"?',
        options: ['message[-5:]', 'message[5:]', 'message[-5]', 'message[:-5]'],
        correctIndex: 0,
        wrongExplanation: 'To count from the end, the negative number belongs on the start side of the colon, with nothing after it: message[-5:] means "5 from the end, all the way to the finish."',
        rightExplanation: 'Correct — message[-5:] starts 5 characters before the end and continues to the end of the string.'
      },
      {
        message: 'SOUTHERNGARDEN',
        prompt: 'Which expression removes the last 4 characters and keeps the rest?',
        options: ['message[:-4]', 'message[:4]', 'message[4:]', 'message[-4:]'],
        correctIndex: 0,
        wrongExplanation: 'message[:-4] means "from the start, up to (but not including) 4 characters before the end" — that is what drops the last 4 while keeping everything else.',
        rightExplanation: 'Correct — message[:-4] keeps everything except the final 4 characters.'
      },
      {
        message: 'ANCIENTSCROLL',
        prompt: 'Which expression reverses this message?',
        options: ['message[::-1]', 'message[::1]', 'message[:-1]', 'message[1::-1]'],
        correctIndex: 0,
        wrongExplanation: 'A step of -1, written as message[::-1], is what walks through the whole string backward. The other options either leave the order unchanged or only touch part of the string.',
        rightExplanation: 'Correct — message[::-1] reverses the entire string.'
      },
      {
        message: 'royalseal',
        prompt: 'Which method converts this to uppercase, "ROYALSEAL"?',
        options: ['message.upper()', 'message.title()', 'message.capitalize()', 'message.swapcase()'],
        correctIndex: 0,
        wrongExplanation: 'upper() is the method that rewrites every letter in the string as uppercase, regardless of its starting case.',
        rightExplanation: 'Correct — message.upper() makes every letter uppercase.'
      }
    ]
  },

  /* ============ STAGE 8 — THE FINAL CIPHER ============ */
  {
    id: 'final-cipher',
    type: 'assessment',
    macroIndex: 7,
    eyebrow: 'Chapter Eight · Final Trial',
    title: 'The Final Cipher',
    paragraphs: [
      'The last tablet bears a single dense code, used by royal messengers to identify themselves at the border: SURYA-1842-AR27.',
      "This time, no one will tell you whether to index or slice. Decide for yourself what each piece of the code requires."
    ],
    message: 'SURYA-1842-AR27',
    tasks: [
      {
        id: 'kingdom',
        label: 'The kingdom name',
        prompt: 'Which expression extracts the kingdom name, "SURYA"?',
        kind: 'choice',
        options: ['message[0:5]', 'message[0:4]', 'message[1:5]', 'message[:6]'],
        correctIndex: 0,
        explanation: '"SURYA" occupies indices 0 through 4, so the slice needs to stop at index 5: message[0:5].'
      },
      {
        id: 'year',
        label: 'The year',
        prompt: 'Which expression extracts the year, "1842"?',
        kind: 'choice',
        options: ['message[6:10]', 'message[5:9]', 'message[6:9]', 'message[7:10]'],
        correctIndex: 0,
        explanation: 'After the first dash, "1842" runs from index 6 through index 9, so the slice is message[6:10].'
      },
      {
        id: 'id',
        label: "The messenger's ID",
        prompt: 'Which expression extracts the ID, "AR27"?',
        kind: 'choice',
        options: ['message[-4:]', 'message[-5:]', 'message[11:14]', 'message[10:14]'],
        correctIndex: 0,
        explanation: 'The ID is the final 4 characters, so counting from the end with message[-4:] captures it without needing to count the whole string.'
      },
      {
        id: 'last-two',
        label: 'The last two characters',
        prompt: 'Which expression extracts just "27"?',
        kind: 'choice',
        options: ['message[-2:]', 'message[-2]', 'message[13:]', 'message[:-2]'],
        correctIndex: 0,
        explanation: 'message[-2:] takes the last 2 characters of the whole message, which are "27".'
      },
      {
        id: 'reversed-id',
        label: 'The reversed ID',
        prompt: 'Type the reversed form of the ID, "AR27" — combine what you have learned about slicing and reversing.',
        kind: 'text',
        correctAnswer: '72RA',
        hint: 'First isolate the ID with message[-4:], then reverse that result — or think of it as reading "AR27" from its last character to its first.',
        explanation: 'message[-4:][::-1] first isolates "AR27", then reverses it, giving "72RA".'
      }
    ],
    transferPrompt: 'Where else, outside this ancient kingdom, could selecting part of a string be useful in a real program?'
  }
];
