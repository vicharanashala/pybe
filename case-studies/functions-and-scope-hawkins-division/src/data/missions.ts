import type { Mission } from '../types/mission'

export const missions: Mission[] = [
  // ============================================================
  // MISSION 1 — WHY REPETITION IS BAD
  // ============================================================
  {
    id: 'm1',
    number: 1,
    codename: 'SIGNAL FLARE',
    title: 'Why We Repeat Ourselves',
    location: 'Hawkins Middle School — A/V Club Room',
    riftLevel: 1,
    briefing:
      'A rift flickered open behind the gym at 9:14 PM. Three kids are still out past curfew in three different parts of town. Somebody has to warn all of them, right now, over the radio.',
    story: [
      { speaker: 'dustin', text: 'Base to all units. We have a Code Red. Rift activity behind the gym.' },
      { speaker: 'dustin', text: 'Everyone past curfew needs to hear this: get inside, lock your doors, stay off the streets.' },
      { speaker: 'robin', text: 'Okay so... how are we actually getting that message to Mike, Lucas, AND Max?' },
      { speaker: 'dustin', text: 'I guess I just... say it three times? Once for each of them?' },
      { speaker: 'system', text: 'RADIO LOG — DUSTIN keys the mic.' },
    ],
    decisionPrompt: 'Dustin has one warning and three kids to reach. What does he do?',
    choices: [
      {
        id: 'a',
        label: 'Type out the full warning three separate times, once per kid',
        best: false,
        consequence:
          'Dustin retypes the entire warning from scratch for Mike. Then again for Lucas — except this time he fumbles a word and it comes out garbled. Then a third time for Max, and by now his hands are cramping and the message has drifted from the original.',
        reaction: {
          speaker: 'steve',
          text: 'Dude, you just said the same thing three times and it came out different every time. That\u2019s... not great for a warning that needs to be exact.',
        },
      },
      {
        id: 'b',
        label: 'Write the warning once, and reuse it for each kid',
        best: true,
        consequence:
          'Dustin drafts the warning once, reads it clean, then simply repeats the same reliable script for Mike, then Lucas, then Max — word-for-word, no drift, no typos.',
        reaction: {
          speaker: 'robin',
          text: 'See, that\u2019s smart. Same script, same result, every single time. You basically just invented... something.',
        },
      },
      {
        id: 'c',
        label: 'Ignore it — they\u2019ll probably be fine',
        best: false,
        consequence:
          'Nobody gets the warning. Ten minutes later, Lucas radios in, panicked, having walked straight past the rift without knowing it was there.',
        reaction: {
          speaker: 'hopper',
          text: 'Static crackles. "This is Hopper. We almost lost a kid because NOBODY sent the warning. That radio silence nearly got somebody hurt."',
        },
      },
    ],
    concept: {
      heading: 'The Problem: Repeated Work Breaks Down',
      insight:
        'Every time Dustin retyped the warning by hand, he risked getting it wrong. The fix wasn\u2019t "try harder" — it was writing the message ONCE and reusing it reliably. That reusable block of instructions is exactly what a function is.',
      explanation:
        'In Python, a function is a named, reusable block of code that you define once and can run as many times as you need — identically, every time. Instead of retyping the same three print statements, you\u2019ll soon wrap them in one function and just call it. Mission 2 shows you how to build one.',
      code: '# Right now, without a function, this is what Dustin is doing:\nprint("Code Red. Get inside. Lock your doors.")\nprint("Code Red. Get inside. Lock your doors.")\nprint("Code Red. Get inside. Lock your doors.")\n\n# Notice: three identical lines. Copy-paste waiting to break.',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'mcq',
      prompt: 'Dustin\u2019s radio log has the SAME line typed three times. What\u2019s the core problem with this pattern?',
      options: [
        {
          id: 'a',
          label: 'It\u2019s too easy to make a typo or a slip on one of the copies, and there\u2019s no single place to fix it',
          correct: true,
          hint: 'Exactly — one small edit means hunting down every copy. That\u2019s the repetition trap.',
        },
        {
          id: 'b',
          label: 'Python doesn\u2019t allow you to print the same message more than once',
          correct: false,
          hint: 'Python is fine with repeated print statements — the problem is maintaining them, not running them.',
        },
        {
          id: 'c',
          label: 'It uses too much electricity on the walkie-talkie',
          correct: false,
          hint: 'Nice try — no, this is about code maintenance, not battery life.',
        },
      ],
    },
    challengeSuccess: {
      speaker: 'dustin',
      text: 'Yes! If I ever need to change the warning, I want to change it in ONE place — not hunt down three copies.',
    },
    reward: { xp: 100, badge: 'Signal Runner', badgeIcon: '\uD83D\uDCE1' },
    cassette: {
      title: 'Cassette 01 — Field Note',
      tip: 'Programmers call unnecessary repetition "code smell." If you\u2019re copy-pasting the same lines more than once, that\u2019s usually a sign you need a function.',
    },
  },

  // ============================================================
  // MISSION 2 — CREATING FUNCTIONS (def)
  // ============================================================
  {
    id: 'm2',
    number: 2,
    codename: 'FIRST BLUEPRINT',
    title: 'Building the Warning, Once',
    location: 'Radio Shack — Back Workshop',
    riftLevel: 1,
    briefing:
      'Robin has an idea: what if the warning message lived in exactly one place, and everyone just... used that one place? She needs your help defining it.',
    story: [
      { speaker: 'robin', text: 'Okay, hear me out. We give this warning a NAME. We define it once. Then whenever we need it, we just point at the name.' },
      { speaker: 'dustin', text: 'Like... a blueprint? You build the blueprint once, and then you can build the thing from it whenever.' },
      { speaker: 'robin', text: 'Exactly like that. In Python, we start the blueprint with the word "def" — short for "define."' },
      { speaker: 'system', text: 'ROBIN opens the terminal and starts typing.' },
    ],
    decisionPrompt: 'How should Robin start building the reusable warning blueprint in Python?',
    choices: [
      {
        id: 'a',
        label: 'def warn_team():',
        best: true,
        consequence:
          'Robin types "def warn_team():" and the cursor blinks under it, waiting patiently. Nothing runs yet — the blueprint is just sitting there, ready.',
        reaction: {
          speaker: 'robin',
          text: 'That\u2019s it. "def" tells Python "I\u2019m about to define something." "warn_team" is the name I\u2019m giving it. Nothing happens yet — I just built the blueprint.',
        },
      },
      {
        id: 'b',
        label: 'function warn_team():',
        best: false,
        consequence:
          'The terminal flashes red. SyntaxError. Robin frowns at the screen.',
        reaction: {
          speaker: 'steve',
          text: 'Uh, the screen just turned red. I think "function" isn\u2019t the magic word Python is looking for — it\u2019s "def."',
        },
      },
      {
        id: 'c',
        label: 'warn_team() = def',
        best: false,
        consequence:
          'Nothing about this looks right to Robin, and Python agrees — another SyntaxError, this time worse.',
        reaction: {
          speaker: 'robin',
          text: 'Nope. "def" always comes first, then the name, then parentheses, then a colon. Order matters here.',
        },
      },
    ],
    concept: {
      heading: 'Defining a Function',
      insight:
        'Writing "def warn_team():" doesn\u2019t send the warning yet — it just creates the blueprint. Python remembers the name "warn_team" and everything indented underneath it, ready to run later.',
      explanation:
        'A function definition always follows the same shape: the keyword "def", a name you choose, parentheses "()", and a colon ":". Everything indented below that line is the function\u2019s body — the instructions it will run every time it\u2019s used.',
      code: 'def warn_team():\n    print("Code Red. Get inside. Lock your doors.")',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'fill',
      prompt: 'Complete the blueprint. Robin wants to define a function named exactly "warn_team".',
      codeTemplate: '___ warn_team():\n    print("Code Red. Get inside. Lock your doors.")',
      acceptedAnswers: ['def'],
      hint: 'It\u2019s the three-letter keyword that means "I\u2019m defining something."',
    },
    challengeSuccess: {
      speaker: 'robin',
      text: 'There it is. The blueprint exists now. It won\u2019t run on its own though — for that, we need to actually CALL it. That\u2019s next.',
    },
    reward: { xp: 120, badge: 'Blueprint Architect', badgeIcon: '\uD83D\uDCD0' },
    cassette: {
      title: 'Cassette 02 — Field Note',
      tip: 'def only builds the function. It does NOT run it. Think of it like writing a recipe — writing it down doesn\u2019t cook the meal.',
    },
  },

  // ============================================================
  // MISSION 3 — CALLING FUNCTIONS
  // ============================================================
  {
    id: 'm3',
    number: 3,
    codename: 'OPEN CHANNEL',
    title: 'Nothing Happens Until You Call It',
    location: 'Radio Shack — Back Workshop',
    riftLevel: 1,
    briefing:
      'The blueprint exists. Robin runs the file... and silence. No warning went out. Something\u2019s missing.',
    story: [
      { speaker: 'dustin', text: 'Wait, I thought we built the warning function already?' },
      { speaker: 'robin', text: 'We did. We DEFINED it. But defining a function is like writing instructions — it doesn\u2019t DO anything until someone actually follows them.' },
      { speaker: 'steve', text: 'So how do we get it to actually go off?' },
      { speaker: 'robin', text: 'We call it. By name. With parentheses.' },
    ],
    decisionPrompt: 'The function warn_team() is defined but never runs. What line makes it actually execute?',
    choices: [
      {
        id: 'a',
        label: 'warn_team()',
        best: true,
        consequence:
          'Robin adds "warn_team()" beneath the definition and reruns the file. The warning prints instantly to the terminal — clean, correct, exactly as written.',
        reaction: {
          speaker: 'robin',
          text: 'There it is. Typing the name with parentheses is how you CALL a function — it tells Python "run those instructions now."',
        },
      },
      {
        id: 'b',
        label: 'warn_team',
        best: false,
        consequence:
          'Robin types just the name, no parentheses. Python prints something odd back: a reference to the function itself, not the warning message.',
        reaction: {
          speaker: 'robin',
          text: 'Close — but without the parentheses, Python just points AT the function. It doesn\u2019t run it. The () is what triggers it.',
        },
      },
      {
        id: 'c',
        label: 'run warn_team',
        best: false,
        consequence:
          'SyntaxError again. Python has no idea what "run" is supposed to mean here.',
        reaction: {
          speaker: 'steve',
          text: 'Python doesn\u2019t use the word "run" — it just wants the function\u2019s name, followed by parentheses. That\u2019s the whole trick.',
        },
      },
    ],
    concept: {
      heading: 'Calling a Function',
      insight:
        'def builds the function. Calling it — writing its name followed by () — is what actually executes the code inside. You can call the same function as many times as you want, from anywhere in your program.',
      explanation:
        'Once a function is defined, calling it is simple: write its name followed by parentheses. Python jumps into the function body, runs every line inside it, then returns to where it left off.',
      code: 'def warn_team():\n    print("Code Red. Get inside. Lock your doors.")\n\nwarn_team()   # <- this line actually runs it\nwarn_team()   # <- and you can call it again, any time',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'fill',
      prompt: 'The function is defined above. Add the line that actually calls it.',
      codeTemplate: 'def warn_team():\n    print("Code Red. Get inside. Lock your doors.")\n\n___',
      acceptedAnswers: ['warn_team()'],
      hint: 'Function name, then parentheses — no "run", no extra words.',
    },
    challengeSuccess: {
      speaker: 'dustin',
      text: 'Whoa. Now Mike, Lucas AND Max can all get the exact same warning, just by calling warn_team() three times. No retyping. Ever.',
    },
    reward: { xp: 120, badge: 'Channel Opener', badgeIcon: '\uD83D\uDCFB' },
    cassette: {
      title: 'Cassette 03 — Field Note',
      tip: 'Defining vs. calling trips up a lot of beginners. def = write the recipe. name() = actually cook the meal.',
    },
  },

  // ============================================================
  // MISSION 4 — PARAMETERS
  // ============================================================
  {
    id: 'm4',
    number: 4,
    codename: 'MOVING TARGET',
    title: 'The Rift Keeps Changing Location',
    location: 'Hawkins — Mobile Command Van',
    riftLevel: 2,
    briefing:
      'Good news: warn_team() works. Bad news: the rift isn\u2019t staying behind the gym. It\u2019s appeared near the quarry, then the junkyard. The warning needs to say WHERE — and that location keeps changing.',
    story: [
      { speaker: 'steve', text: 'Okay, warn_team() is great, but it always says "behind the gym." The rift just opened at the quarry!' },
      { speaker: 'dustin', text: 'So do we write a whole new function for every single location? warn_team_gym(), warn_team_quarry(), warn_team_junkyard()...' },
      { speaker: 'robin', text: 'Absolutely not. That\u2019s just... repetition again, wearing a disguise. We need the function to accept the location as an input.' },
      { speaker: 'system', text: 'ROBIN sketches parentheses on the whiteboard with a blank inside them.' },
    ],
    decisionPrompt: 'How do we let one function handle ANY location without copy-pasting a new function each time?',
    choices: [
      {
        id: 'a',
        label: 'Give the function a parameter: def warn_team(location):',
        best: true,
        consequence:
          'Robin rewrites the function with "location" sitting inside the parentheses. Now the function can receive whatever place gets passed in — gym, quarry, junkyard, anywhere.',
        reaction: {
          speaker: 'robin',
          text: 'That\u2019s a parameter. It\u2019s a placeholder name that receives whatever value we hand the function when we call it.',
        },
      },
      {
        id: 'b',
        label: 'Write a brand new function for every possible location',
        best: false,
        consequence:
          'Steve starts typing warn_team_gym(), warn_team_quarry(), warn_team_junkyard()... and immediately realizes there could be dozens of locations. This will never scale.',
        reaction: {
          speaker: 'steve',
          text: 'This is exactly the copy-paste mess from Mission 1, just with function names instead of print statements. There has to be a better way.',
        },
      },
      {
        id: 'c',
        label: 'Just hardcode "the quarry" into warn_team() and hope the rift doesn\u2019t move again',
        best: false,
        consequence:
          'Twenty minutes later the rift shifts to the junkyard, and the warning still says "the quarry." Two kids nearly walk right past it.',
        reaction: {
          speaker: 'hopper',
          text: 'Your warning told them the wrong location. A function that can\u2019t adapt is almost as bad as no function at all.',
        },
      },
    ],
    concept: {
      heading: 'Parameters — Giving a Function an Input',
      insight:
        'A parameter is a named slot inside the parentheses of a function definition. It lets the SAME function behave differently depending on what value you feed it — instead of writing a new function for every case.',
      explanation:
        'Define a parameter by naming it inside the parentheses: def warn_team(location):. Inside the function body, you can now use "location" like any variable. When you call the function, you pass in the actual value — called an "argument" — that fills that slot.',
      code: 'def warn_team(location):\n    print("Code Red near " + location + ". Get inside.")\n\nwarn_team("the quarry")\nwarn_team("the junkyard")',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'fill',
      prompt: 'Rewrite the function so it accepts a "location" parameter.',
      codeTemplate: 'def warn_team(___):\n    print("Code Red near " + location + ". Get inside.")',
      acceptedAnswers: ['location'],
      hint: 'Whatever name you put inside the parentheses becomes usable inside the function body — match it to what\u2019s used in the print line.',
    },
    challengeSuccess: {
      speaker: 'steve',
      text: 'One function, infinite locations. That\u2019s so much cleaner than writing warn_team_everywhere().',
    },
    reward: { xp: 140, badge: 'Coordinate Tracker', badgeIcon: '\uD83D\uDCCD' },
    cassette: {
      title: 'Cassette 04 — Field Note',
      tip: 'Parameter vs. argument: the parameter is the name in the function\u2019s definition. The argument is the actual value you pass in when calling it.',
    },
  },

  // ============================================================
  // MISSION 5 — MULTIPLE PARAMETERS
  // ============================================================
  {
    id: 'm5',
    number: 5,
    codename: 'FULL BRIEFING',
    title: 'Location Isn\u2019t Enough Anymore',
    location: 'Hawkins Lab — Monitoring Bay',
    riftLevel: 2,
    briefing:
      'Hopper wants more than a location now. He wants the location AND the danger level in every warning — "the quarry, danger level 4" — not just a bare place name.',
    story: [
      { speaker: 'hopper', text: 'I need more than a location in that warning. I need to know how bad it is. Danger level, one through five.' },
      { speaker: 'dustin', text: 'So... two pieces of information going into one function?' },
      { speaker: 'robin', text: 'Sure. A function can take more than one parameter. You just separate them with a comma.' },
    ],
    decisionPrompt: 'How does Robin add a second input — danger_level — to the function?',
    choices: [
      {
        id: 'a',
        label: 'def warn_team(location, danger_level):',
        best: true,
        consequence:
          'Robin adds a comma and a second name inside the parentheses. Now the function can receive both the place AND how dangerous it is, in one call.',
        reaction: {
          speaker: 'robin',
          text: 'Two parameters, separated by a comma. When we call it, we just pass both values in the same order.',
        },
      },
      {
        id: 'b',
        label: 'def warn_team(location) def warn_team(danger_level):',
        best: false,
        consequence:
          'Robin tries stacking two "def" lines with the same name. Python only keeps the second one — the location warning quietly disappears from the program entirely.',
        reaction: {
          speaker: 'robin',
          text: 'You can\u2019t define the same function twice like that — the second definition just overwrites the first. We need BOTH values in ONE definition.',
        },
      },
      {
        id: 'c',
        label: 'def warn_team(location danger_level):',
        best: false,
        consequence:
          'No comma between the two names. Python throws a SyntaxError — it has no idea where one parameter ends and the next begins.',
        reaction: {
          speaker: 'steve',
          text: 'Screen\u2019s red again. I think it needs a comma between them or Python can\u2019t tell they\u2019re two separate things.',
        },
      },
    ],
    concept: {
      heading: 'Multiple Parameters',
      insight:
        'A function isn\u2019t limited to one input. List several parameter names inside the parentheses, separated by commas, and the function can accept that many values every time it\u2019s called.',
      explanation:
        'Multiple parameters are declared with commas: def warn_team(location, danger_level):. When calling the function, the arguments are matched to parameters in order — the first value goes to the first parameter, the second to the second, and so on.',
      code: 'def warn_team(location, danger_level):\n    print("Code Red near " + location + ". Danger level: " + str(danger_level))\n\nwarn_team("the quarry", 4)\nwarn_team("the junkyard", 2)',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'order',
      prompt: 'Hopper\u2019s console glitched and scrambled the warning script. Drag the lines back into working order.',
      blocks: [
        { id: 'b1', code: 'def warn_team(location, danger_level):' },
        { id: 'b2', code: '    print("Code Red near " + location + ". Danger level: " + str(danger_level))' },
        { id: 'b3', code: 'warn_team("the quarry", 4)' },
      ],
      correctOrder: ['b1', 'b2', 'b3'],
      hint: 'A function must be fully defined (its def line, then its indented body) before you can call it.',
    },
    challengeSuccess: {
      speaker: 'hopper',
      text: 'Now THAT\u2019S a warning I can use. Location and danger level, every time, no guesswork.',
    },
    reward: { xp: 150, badge: 'Threat Assessor', badgeIcon: '\u26A0\uFE0F' },
    cassette: {
      title: 'Cassette 05 — Field Note',
      tip: 'Order matters with parameters. warn_team("the quarry", 4) is not the same as warn_team(4, "the quarry") — Python matches by position.',
    },
  },

  // ============================================================
  // MISSION 6 — RETURN VALUES
  // ============================================================
  {
    id: 'm6',
    number: 6,
    codename: 'DATA RECOVERY',
    title: 'Printing Isn\u2019t the Same as Answering',
    location: 'Hawkins Lab — Analysis Room',
    riftLevel: 3,
    briefing:
      'Elle needs to know the actual danger SCORE for a location so the team can decide whether to evacuate. The function prints a message — but nothing gives them back a usable number to work with.',
    story: [
      { speaker: 'elle', text: 'I need the number. Not a sentence. The number.' },
      { speaker: 'dustin', text: 'Our function prints "Danger level: 4" to the screen, but... we can\u2019t actually grab that 4 and use it anywhere else.' },
      { speaker: 'robin', text: 'Right — print() just displays text. It doesn\u2019t hand a value back to the rest of the program. For that, we need "return."' },
    ],
    decisionPrompt: 'The team needs the function to hand back a usable danger score instead of just printing it. What do they add?',
    choices: [
      {
        id: 'a',
        label: 'return danger_level inside the function',
        best: true,
        consequence:
          'Robin swaps the print statement for "return danger_level". Now when the function runs, that number gets sent back out — and can be stored, compared, or used to trigger an evacuation.',
        reaction: {
          speaker: 'elle',
          text: 'Now I can store that number in a variable and use it. That\u2019s what I needed.',
        },
      },
      {
        id: 'b',
        label: 'print(danger_level) louder, in all caps',
        best: false,
        consequence:
          'The message just looks more dramatic on screen. Elle still can\u2019t DO anything with the number — it\u2019s still just text on a screen, not a usable value.',
        reaction: {
          speaker: 'elle',
          text: 'It looks scarier. It\u2019s still useless to me. I can\u2019t save "DANGER 4!!!" into a decision.',
        },
      },
      {
        id: 'c',
        label: 'Just remember the danger level in your head and tell Elle later',
        best: false,
        consequence:
          'Dustin says he\u2019ll remember it. Ninety seconds later, someone asks him again, and he\u2019s already forgotten. Manual memory doesn\u2019t scale.',
        reaction: {
          speaker: 'robin',
          text: 'We need the PROGRAM to remember it, not you. That\u2019s literally what return values are for.',
        },
      },
    ],
    concept: {
      heading: 'Return Values',
      insight:
        'print() only displays something on screen — it doesn\u2019t give the rest of your program a value to work with. return sends a value back out of the function so it can be stored in a variable and used later.',
      explanation:
        'Use the "return" keyword inside a function to send a value back to wherever the function was called. You can then capture that value: score = check_danger("the quarry") stores whatever the function returned into the variable "score".',
      code: 'def check_danger(location):\n    if location == "the quarry":\n        return 4\n    return 1\n\nscore = check_danger("the quarry")\nprint(score)   # 4 — a real number we can use',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'fill',
      prompt: 'Complete the function so it sends the danger score back out instead of just printing it.',
      codeTemplate: 'def check_danger(location):\n    if location == "the quarry":\n        ___ 4\n    return 1',
      acceptedAnswers: ['return'],
      hint: 'The keyword that hands a value back out of a function.',
    },
    challengeSuccess: {
      speaker: 'elle',
      text: 'Good. Now the number goes where it\u2019s needed, not just onto a screen nobody\u2019s watching.',
    },
    reward: { xp: 160, badge: 'Data Recoverer', badgeIcon: '\uD83D\uDCCA' },
    cassette: {
      title: 'Cassette 06 — Field Note',
      tip: 'A function without "return" gives back a special value called None. If your code expects a real answer, make sure your function actually returns one.',
    },
  },

  // ============================================================
  // MISSION 7 — LOCAL VARIABLES
  // ============================================================
  {
    id: 'm7',
    number: 7,
    codename: 'CONTAINMENT',
    title: 'What Happens Inside, Stays Inside',
    location: 'Hawkins Lab — Isolation Chamber',
    riftLevel: 3,
    briefing:
      'Steve tries to check a value that was created inside check_danger() from OUTSIDE the function — and Python has no idea what he\u2019s talking about.',
    story: [
      { speaker: 'steve', text: 'Wait, inside check_danger() there\u2019s a variable called "score." Let me just print it out here, outside the function too.' },
      { speaker: 'system', text: 'NameError: name \'score\' is not defined' },
      { speaker: 'steve', text: 'What? It\u2019s RIGHT there, I can see it in the function!' },
      { speaker: 'robin', text: 'It\u2019s "local" to the function. It only exists while the function is running, in its own little sealed room. Once the function finishes, that variable is gone.' },
    ],
    decisionPrompt: 'Steve wants access to a variable that lives inside a function, from outside it. What\u2019s actually going on?',
    choices: [
      {
        id: 'a',
        label: 'Accept that the variable is local — it only exists inside the function while it runs',
        best: true,
        consequence:
          'Robin explains it clearly: variables created inside a function are sealed inside it, like a containment chamber. If Steve wants the value outside, he needs the function to RETURN it, and then store that return value in a variable outside.',
        reaction: {
          speaker: 'robin',
          text: 'Exactly. That containment isn\u2019t a bug — it\u2019s protection. It keeps functions from accidentally messing with each other\u2019s variables.',
        },
      },
      {
        id: 'b',
        label: 'Assume Python is broken and restart the computer',
        best: false,
        consequence:
          'The computer restarts. The error is exactly the same when it boots back up, because the issue was never the computer — it was a misunderstanding about scope.',
        reaction: {
          speaker: 'dustin',
          text: 'The computer was never the problem, Steve. Restarting it just wastes five minutes we don\u2019t have.',
        },
      },
      {
        id: 'c',
        label: 'Just copy-paste the variable\u2019s value by hand wherever it\u2019s needed',
        best: false,
        consequence:
          'It works for one moment, but the moment the danger score changes inside the function, the copied value outside is instantly wrong and out of date.',
        reaction: {
          speaker: 'elle',
          text: 'That number is already old. It doesn\u2019t update. We need the real connection, not a snapshot.',
        },
      },
    ],
    concept: {
      heading: 'Local Variables and Scope',
      insight:
        'A variable created inside a function only exists inside that function — this is called its "local scope." It\u2019s created fresh each time the function runs and disappears when the function finishes, keeping functions from stepping on each other\u2019s toes.',
      explanation:
        'Variables defined inside a function body are "local" to it. They cannot be accessed from outside the function. If you need a value outside, the function must return it, and you capture that returned value in a variable in the outer scope.',
      code: 'def check_danger(location):\n    score = 4          # local — only exists inside this function\n    return score\n\nresult = check_danger("the quarry")  # captured outside, safely\nprint(result)         # 4\nprint(score)          # NameError — score doesn\u2019t exist out here',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'mcq',
      prompt: 'A variable named "score" is created inside a function. What happens if you try to print(score) outside that function?',
      options: [
        {
          id: 'a',
          label: 'A NameError — "score" only exists inside the function\u2019s local scope',
          correct: true,
          hint: 'Right. Local variables are sealed inside the function they were created in.',
        },
        {
          id: 'b',
          label: 'It prints the value fine, exactly as it was inside the function',
          correct: false,
          hint: 'Not quite — local variables don\u2019t leak out into the surrounding code automatically.',
        },
        {
          id: 'c',
          label: 'Python asks you to re-type the function definition again',
          correct: false,
          hint: 'Python doesn\u2019t do that — it simply doesn\u2019t recognize the name outside the function.',
        },
      ],
    },
    challengeSuccess: {
      speaker: 'steve',
      text: 'Okay, containment makes sense now. If I want it outside, the function has to hand it to me with return.',
    },
    reward: { xp: 170, badge: 'Containment Officer', badgeIcon: '\uD83D\uDD12' },
    cassette: {
      title: 'Cassette 07 — Field Note',
      tip: 'Scope isn\u2019t a limitation — it\u2019s a safety feature. Two different functions can both use a variable named "score" without ever colliding.',
    },
  },

  // ============================================================
  // MISSION 8 — GLOBAL VARIABLES
  // ============================================================
  {
    id: 'm8',
    number: 8,
    codename: 'BROADCAST STATE',
    title: 'Some Things Everyone Needs to See',
    location: 'Mobile Command Van',
    riftLevel: 3,
    briefing:
      'Hopper wants one shared number — total_rifts_detected — that every function across the whole system can read, and that updates as new rifts are found. Not everything should be locked away in local scope.',
    story: [
      { speaker: 'hopper', text: 'I want ONE running total. Every function that finds a rift should be able to add to it. Everyone reads from the same number.' },
      { speaker: 'dustin', text: 'So this can\u2019t be local — it needs to live outside any one function, at the top level of the whole program.' },
      { speaker: 'robin', text: 'That\u2019s a global variable. Defined outside every function, so any function can read it.' },
    ],
    decisionPrompt: 'The team needs a variable that every function can see and share. Where should it live?',
    choices: [
      {
        id: 'a',
        label: 'Define total_rifts_detected outside of any function, at the top level',
        best: true,
        consequence:
          'Robin writes "total_rifts_detected = 0" right at the top of the file, outside every function. Now any function in the program can read that value.',
        reaction: {
          speaker: 'robin',
          text: 'That\u2019s a global variable. It lives at the top level, so it\u2019s visible everywhere — not sealed into one function\u2019s local scope.',
        },
      },
      {
        id: 'b',
        label: 'Create a fresh local copy of total_rifts_detected inside every single function',
        best: false,
        consequence:
          'Each function gets its OWN separate copy that starts back at 0 every time it runs. Nothing actually adds up — the "total" never grows.',
        reaction: {
          speaker: 'hopper',
          text: 'Every function thinks it\u2019s starting from zero. That\u2019s not a shared total, that\u2019s five different numbers pretending to be one.',
        },
      },
      {
        id: 'c',
        label: 'Have Dustin manually announce the total over the radio every time it changes',
        best: false,
        consequence:
          'It works for the first two rifts, then Dustin gets distracted mid-mission and the "total" everyone has in their heads drifts apart within minutes.',
        reaction: {
          speaker: 'steve',
          text: 'We\u2019re back to "remember it by hand" again. We need the program itself to hold this number, not a person.',
        },
      },
    ],
    concept: {
      heading: 'Global Variables',
      insight:
        'A global variable is defined outside every function, at the top level of your file. Unlike local variables, functions CAN read global variables — but to change one from inside a function, you need the "global" keyword.',
      explanation:
        'Declare a global variable at the top of your file. Any function can read it directly. To modify it from inside a function, first write "global variable_name" inside that function, so Python knows you mean the outer variable, not a new local one.',
      code: 'total_rifts_detected = 0   # global — lives outside every function\n\ndef log_rift():\n    global total_rifts_detected\n    total_rifts_detected += 1\n\nlog_rift()\nlog_rift()\nprint(total_rifts_detected)   # 2 — shared and updated by every call',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'fill',
      prompt: 'Complete the function so it\u2019s allowed to modify the global counter, not just read it.',
      codeTemplate: 'total_rifts_detected = 0\n\ndef log_rift():\n    ___ total_rifts_detected\n    total_rifts_detected += 1',
      acceptedAnswers: ['global'],
      hint: 'The keyword that tells Python "use the outer variable, don\u2019t make a new local one."',
    },
    challengeSuccess: {
      speaker: 'hopper',
      text: 'Now every function that spots a rift adds to the SAME number. That\u2019s the shared picture I needed.',
    },
    reward: { xp: 180, badge: 'State Broadcaster', badgeIcon: '\uD83D\uDCE1' },
    cassette: {
      title: 'Cassette 08 — Field Note',
      tip: 'Use globals sparingly. Too many shared variables make it hard to track who changed what. Prefer parameters and return values when you can.',
    },
  },

  // ============================================================
  // MISSION 9 — NESTED FUNCTIONS
  // ============================================================
  {
    id: 'm9',
    number: 9,
    codename: 'INNER CHAMBER',
    title: 'A Function, Hidden Inside Another',
    location: 'Hawkins Lab — Sub-Basement',
    riftLevel: 4,
    briefing:
      'The team needs a small helper calculation — converting a raw sensor reading into a danger score — that ONLY makes sense inside the bigger check_danger() process. It shouldn\u2019t clutter the rest of the program.',
    story: [
      { speaker: 'elle', text: 'I need a small conversion step. Raw sensor number into a 1-to-5 danger score. But it\u2019s only useful inside check_danger — nowhere else.' },
      { speaker: 'dustin', text: 'So do we just add it as its own separate function floating around the file?' },
      { speaker: 'robin', text: 'We could... or we could define it INSIDE check_danger itself. A function inside a function. It stays hidden unless check_danger uses it.' },
    ],
    decisionPrompt: 'The helper calculation is only ever needed inside check_danger(). How should the team organize it?',
    choices: [
      {
        id: 'a',
        label: 'Define the helper function inside check_danger() — a nested function',
        best: true,
        consequence:
          'Robin writes "def convert_reading(raw):" indented inside check_danger(). It works perfectly, and it\u2019s invisible to the rest of the program — exactly as private as it needs to be.',
        reaction: {
          speaker: 'robin',
          text: 'That\u2019s a nested function. It only exists inside check_danger, used right where it\u2019s needed, without cluttering up the rest of the file.',
        },
      },
      {
        id: 'b',
        label: 'Define it as a totally separate top-level function next to check_danger',
        best: false,
        consequence:
          'It works, but now anyone reading the file sees a "convert_reading" function floating around that looks important, when really it\u2019s just a private detail of one other function.',
        reaction: {
          speaker: 'dustin',
          text: 'It works, but it\u2019s confusing — like leaving spare parts on the lab floor instead of inside the machine that actually uses them.',
        },
      },
      {
        id: 'c',
        label: 'Copy-paste the conversion math directly into check_danger every time it\u2019s needed',
        best: false,
        consequence:
          'It works for now — until the conversion formula needs to change, and Elle realizes she has to hunt down and fix it in three different spots.',
        reaction: {
          speaker: 'elle',
          text: 'We\u2019re back to Mission 1\u2019s problem. Copy-pasted math is still repetition, even if it\u2019s hidden inside a bigger function.',
        },
      },
    ],
    concept: {
      heading: 'Nested Functions',
      insight:
        'A function can be defined inside another function. That inner function only exists while the outer function is running, and only the outer function (and its inner code) can see it — perfect for small helper logic that has no use anywhere else.',
      explanation:
        'Indent a "def" statement inside another function\u2019s body to nest it. The inner function is created fresh each time the outer function runs, and it\u2019s only callable from within the outer function\u2019s scope.',
      code: 'def check_danger(raw_reading):\n    def convert_reading(raw):\n        return min(5, raw // 20)\n\n    score = convert_reading(raw_reading)\n    return score\n\nprint(check_danger(83))   # 4',
      codeLabel: 'radio_log.py',
    },
    challenge: {
      type: 'order',
      prompt: 'Arrange the lines so convert_reading is properly nested inside check_danger, and gets used correctly.',
      blocks: [
        { id: 'n1', code: 'def check_danger(raw_reading):' },
        { id: 'n2', code: '    def convert_reading(raw):' },
        { id: 'n3', code: '        return min(5, raw // 20)' },
        { id: 'n4', code: '    return convert_reading(raw_reading)' },
      ],
      correctOrder: ['n1', 'n2', 'n3', 'n4'],
      hint: 'The nested def and its body must sit fully inside the outer function, before the outer function uses it.',
    },
    challengeSuccess: {
      speaker: 'elle',
      text: 'Now the conversion logic is exactly where it belongs. Nobody outside check_danger even needs to know it exists.',
    },
    reward: { xp: 200, badge: 'Inner Chamber Keeper', badgeIcon: '\uD83D\uDDDD\uFE0F' },
    cassette: {
      title: 'Cassette 09 — Field Note',
      tip: 'Nested functions are great for one-off helpers. If a helper is useful in MULTIPLE places, pull it back out to the top level instead.',
    },
  },

  // ============================================================
  // MISSION 10 — RECURSION
  // ============================================================
  {
    id: 'm10',
    number: 10,
    codename: 'ECHO CHAMBER',
    title: 'A Function That Calls Itself',
    location: 'The Upside Down — Vine Tunnels',
    riftLevel: 5,
    briefing:
      'The vine network branches endlessly — each vine splits into more vines, which split again. The team needs to count every branch, but nobody knows how many layers deep it goes.',
    story: [
      { speaker: 'elle', text: 'Every vine splits into more vines. I can\u2019t write a separate function for "layer 1", "layer 2", "layer 3"... it doesn\u2019t end.' },
      { speaker: 'dustin', text: 'What if the function, while counting a vine\u2019s branches, just... called itself again on each smaller branch?' },
      { speaker: 'robin', text: 'That\u2019s recursion. A function that calls itself to solve a smaller version of the same problem, until it hits a base case that stops it.' },
    ],
    decisionPrompt: 'The branching structure is unknown in depth. How should the counting function handle that?',
    choices: [
      {
        id: 'a',
        label: 'Write a function that calls itself on each smaller branch, with a base case to stop',
        best: true,
        consequence:
          'Robin writes count_branches(vine), and inside it, calls count_branches() again on every smaller branch — with a base case that says "if there are no more branches, stop and return 0."',
        reaction: {
          speaker: 'robin',
          text: 'That base case is critical. Without it, the function would call itself forever and crash. With it, recursion naturally handles ANY depth.',
        },
      },
      {
        id: 'b',
        label: 'Guess the maximum depth in advance and write that many nested loops',
        best: false,
        consequence:
          'The team guesses "10 layers should be enough" and hardcodes ten nested loops. Layer 11 appears, and the counting function silently misses an entire section of vines.',
        reaction: {
          speaker: 'dustin',
          text: 'We guessed wrong. The vines don\u2019t care about our assumptions — we need something that adapts to ANY depth, not a fixed guess.',
        },
      },
      {
        id: 'c',
        label: 'Manually count each branch by hand as the team explores',
        best: false,
        consequence:
          'Twenty minutes in, Steve loses count somewhere around branch 47 and has to start over from the entrance.',
        reaction: {
          speaker: 'steve',
          text: 'I lost count. Again. We need the computer doing this, not me standing here muttering numbers into a flashlight beam.',
        },
      },
    ],
    concept: {
      heading: 'Recursion',
      insight:
        'A recursive function solves a problem by calling itself on a smaller version of that same problem. Every recursive function needs a "base case" — a condition where it stops calling itself — or it will recurse forever.',
      explanation:
        'Recursion has two essential parts: the base case (the simplest version of the problem, which returns directly without recursing) and the recursive case (where the function calls itself with a smaller or simpler input, moving toward the base case).',
      code: 'def count_branches(vine):\n    if not vine.branches:      # base case — no more branches\n        return 0\n    total = 0\n    for branch in vine.branches:\n        total += 1 + count_branches(branch)  # recursive case\n    return total',
      codeLabel: 'vine_scanner.py',
    },
    challenge: {
      type: 'mcq',
      prompt: 'What happens to a recursive function if it never reaches a base case?',
      options: [
        {
          id: 'a',
          label: 'It keeps calling itself indefinitely until Python runs out of memory and crashes',
          correct: true,
          hint: 'Right — that\u2019s a "stack overflow." Every recursive function needs a way to eventually stop.',
        },
        {
          id: 'b',
          label: 'Python automatically stops it after exactly 5 calls, no matter what',
          correct: false,
          hint: 'Not automatic — Python doesn\u2019t cap recursion at 5. Without a base case, it keeps going.',
        },
        {
          id: 'c',
          label: 'It quietly returns None and moves on with no error at all',
          correct: false,
          hint: 'Not quite — a missing base case causes a real crash (a RecursionError), not a silent None.',
        },
      ],
    },
    challengeSuccess: {
      speaker: 'elle',
      text: 'Now it doesn\u2019t matter how deep the vines go. The function handles the whole thing, one branch at a time, calling itself down to the base case.',
    },
    reward: { xp: 220, badge: 'Echo Chamber Survivor', badgeIcon: '\uD83C\uDF00' },
    cassette: {
      title: 'Cassette 10 — Field Note',
      tip: 'Every recursive function is really two functions in one: "if I\u2019m done, stop" (base case) and "otherwise, do less work and call myself again" (recursive case).',
    },
  },

  // ============================================================
  // FINAL BOSS — COMBINE EVERYTHING
  // ============================================================
  {
    id: 'boss',
    number: 11,
    isFinalBoss: true,
    codename: 'GATE CLOSURE',
    title: 'Seal the Rift — Final Protocol',
    location: 'Hawkins Lab — The Gate',
    riftLevel: 5,
    briefing:
      'This is it. The Gate is destabilizing. Closing it requires every system the team has built across every mission — defined functions, parameters, return values, scope, nesting, and recursion — running together as one protocol.',
    story: [
      { speaker: 'hopper', text: 'Everyone, listen up. We close this Gate with everything we\u2019ve built. No shortcuts, no copy-paste. Just the system.' },
      { speaker: 'robin', text: 'We\u2019ve got warn_team() with parameters. check_danger() with a return value. A global rift counter. Nested helpers. And recursive vine scanning.' },
      { speaker: 'dustin', text: 'So now we just... wire it all together into one closing protocol?' },
      { speaker: 'elle', text: 'That\u2019s the plan. One function, calling all the others, closing the Gate.' },
    ],
    decisionPrompt: 'How does the team assemble the final closing protocol from everything they\u2019ve built?',
    choices: [
      {
        id: 'a',
        label: 'Write one close_gate() function that calls warn_team(), check_danger(), and the recursive scanner together, using their return values',
        best: true,
        consequence:
          'The team builds close_gate(location, danger_level). It calls warn_team(location) to alert everyone, uses check_danger(location) to get a real number back, and calls the recursive vine scanner to clear every branch — combining every concept from every mission into one coordinated protocol.',
        reaction: {
          speaker: 'hopper',
          text: 'That\u2019s it. That\u2019s a real system — pieces built separately, each doing one job well, working together through clean function calls.',
        },
      },
      {
        id: 'b',
        label: 'Write one gigantic function with all the logic crammed into a single body, no smaller functions at all',
        best: false,
        consequence:
          'It sort of works, but the single giant function is nearly 200 lines long, impossible to test in pieces, and the moment something breaks, nobody can tell which part failed.',
        reaction: {
          speaker: 'robin',
          text: 'This is exactly why we built separate functions in the first place. One giant blob is just Mission 1\u2019s problem, wearing a trench coat.',
        },
      },
      {
        id: 'c',
        label: 'Panic and try to close the Gate by hand, without using any of the functions the team built',
        best: false,
        consequence:
          'Without the tools they built across ten missions, the team is overwhelmed trying to track locations, danger levels, and branching vines all manually. The Gate keeps flickering, unstable.',
        reaction: {
          speaker: 'steve',
          text: 'We spent ten missions building these functions for exactly this moment. Let\u2019s actually use them.',
        },
      },
    ],
    concept: {
      heading: 'Functions Working Together',
      insight:
        'This is the whole point: small, well-named functions — each responsible for one clear job — can be combined into a larger system. Definitions, parameters, return values, scope, nesting, and recursion aren\u2019t separate tricks. They\u2019re one toolkit, and real programs use all of it together.',
      explanation:
        'A well-designed program is a set of small functions that call each other, pass values through parameters, and hand results back through return values — not one giant block of code. That\u2019s what makes it readable, testable, and reusable.',
      code: 'total_rifts_detected = 0\n\ndef warn_team(location, danger_level):\n    print("Code Red near " + location + ". Danger level: " + str(danger_level))\n\ndef check_danger(location):\n    def convert_reading(raw):\n        return min(5, raw // 20)\n    return convert_reading(83)\n\ndef count_branches(vine):\n    if not vine.branches:\n        return 0\n    return sum(1 + count_branches(b) for b in vine.branches)\n\ndef close_gate(location, vine):\n    global total_rifts_detected\n    danger_level = check_danger(location)\n    warn_team(location, danger_level)\n    cleared = count_branches(vine)\n    total_rifts_detected += 1\n    return cleared',
      codeLabel: 'close_gate.py',
    },
    challenge: {
      type: 'order',
      prompt: 'Assemble the final closing protocol. Put the pieces in an order that actually runs correctly.',
      blocks: [
        { id: 'f1', code: 'def check_danger(location):\n    return 4' },
        { id: 'f2', code: 'def warn_team(location, danger_level):\n    print("Code Red near " + location)' },
        { id: 'f3', code: 'def close_gate(location):\n    danger_level = check_danger(location)\n    warn_team(location, danger_level)\n    return "GATE CLOSED"' },
        { id: 'f4', code: 'print(close_gate("the lab"))' },
      ],
      correctOrder: ['f1', 'f2', 'f3', 'f4'],
      hint: 'Every function referenced inside close_gate must be defined before close_gate is called.',
    },
    challengeSuccess: {
      speaker: 'elle',
      text: 'The Gate is closing. Every function did its one job, and together, that was enough.',
    },
    reward: { xp: 500, badge: 'Hawkins Division Commander', badgeIcon: '\uD83C\uDFC6' },
    cassette: {
      title: 'Cassette 11 — Final Field Note',
      tip: 'You now know: def, calling functions, parameters, multiple parameters, return values, local scope, global scope, nested functions, and recursion. That\u2019s the real toolkit. Go build something with it.',
    },
  },
]

export const totalMissions = missions.length
