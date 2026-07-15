const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set. Add your MongoDB Atlas connection string to backend/.env (see .env.example).');
  process.exit(1);
}

const Challenge = require('../models/Challenge');

/**
 * Discovery-learning content, themed, for all 18 concepts.
 *
 * Every concept carries FIVE parallel themes (sports, daily-life,
 * philosophy, food, movies). Each theme carries:
 *   - three free-text scenario steps (scenario + prompt), answered one at
 *     a time, reflected on together by one AI call
 *   - ONE follow-up decisionScenario — a real-life analogy (not code),
 *     with optionA/optionB/correctOption — shown after that reflection,
 *     analyzed by a second, separate AI call
 *   - a worked Python example told through that same story world
 * Plus a theme-agnostic `blanks` section (Section 3): one conceptual and
 * one code drag-and-drop fill-in-the-blank exercise (each with a short
 * hint shown if the learner gets it wrong), shared across themes.
 */
const challenges = [
  {
    "conceptSlug": "hello-world",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A stadium announcer wants to welcome thousands of fans as the match is about to begin.",
            "prompt": "How would the announcer make sure the welcome message appears on the screen right as the match begins?",
            "image": "/scenario-art/images/Sports/1_1.png",
          },
          {
            "scenario": "A referee asks the announcer to clearly call out the home team's name before kickoff.",
            "prompt": "How should the team's name be written down so it's clearly understood as something to say aloud, not an instruction?",
            "image": "/scenario-art/images/Sports/1_2.png"
          },
          {
            "scenario": "Before the players enter the field, two short announcements need to be made one after another.",
            "prompt": "How would you make two separate announcements happen one right after the other?",
            "image": "/scenario-art/images/Sports/1_3.png"
          }
        ],
        "example": {
          "code": "print(\"Welcome to the match!\")\nprint(\"Starting lineup: Rossi, Silva, Chen\")",
          "explanation": "Each print() call puts one line on the screen, in the order the calls appear — the simplest way a program talks back to you.",
          "syntaxBreakdown": [
          {
            "code": "print(\"Welcome to the match!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Welcome to the match! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Starting lineup: Rossi, Silva, Chen\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Starting lineup: Rossi, Silva, Chen is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach walks into the team's training facility for the very first time, and nobody there knows they've arrived yet.",
          "question": "What should the new coach do right away so everyone immediately knows they're there?",
          "optionA": "Speak up and introduce themselves out loud the moment they walk in",
          "optionB": "Stay quiet and wait for someone to eventually notice them on their own",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You just wrote your very first words on computer.",
            "prompt": "How would you get 'Hello, welcome!' to actually show up when the you write?",
            "image": "/scenario-art/images/Daily/0_1.jpeg"
          },
          {
            "scenario": "You want the greeting to appear exactly as you typed it, not be confused with a Python command.",
            "prompt": "How should the greeting be written so Python knows it's text to display, not an instruction?",
            "image": "/scenario-art/images/Daily/0_2.jpeg"
          },
          {
            "scenario": "Right after the greeting, you also want today's to-do reminder to show up underneath it.",
            "prompt": "How would you add a second line so both messages appear, one after the other?",
            "image": "/scenario-art/images/Daily/0_3.jpeg"
          }
        ],
        "example": {
          "code": "print(\"Hello, welcome!\")\nprint(\"Reminder: water the plants today\")",
          "explanation": "Two separate print() calls produce two separate lines, top to bottom — that's the program 'talking' to you.",
          "syntaxBreakdown": [
          {
            "code": "print(\"Hello, welcome!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Hello, welcome! is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Reminder: water the plants today\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Reminder: water the plants today is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate walks into your shared apartment for the very first time, and nobody there knows they've arrived yet.",
          "question": "What should your roommate do right away so everyone immediately knows they're there?",
          "optionA": "Stay quiet and wait for someone to eventually notice them on their own",
          "optionB": "Speak up and introduce themselves out loud the moment they walk in",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Aristotle believed that \"All human beings by nature desire to know.\" Every field of knowledge begins with a simple first step. Before mastering a subject, learners first need proof that they can interact with it successfully.",
        "scenarios": [
          {
            "scenario": "A child learns to speak by saying their very first word.",
            "prompt": "Why is speaking the first word more important than knowing thousands of words in theory?",
            "image": ""
          },
          {
            "scenario": "Someone learning to paint begins by making a single brush stroke on a blank canvas.",
            "prompt": "Why doesn't an artist begin with a masterpiece?",
            "image": ""
          },
          {
            "scenario": "A musician plays a single note before attempting an entire song.",
            "prompt": "What purpose does this first successful attempt serve?",
            "image": ""
          }
        ],
        "example": {
          "code": "print(\"The unexamined life is not worth living.\")\nprint(\"- Socrates\")",
          "explanation": "Each print() outputs exactly one line, in the order it's called — the most basic way a program shows something to the world.",
          "syntaxBreakdown": [
          {
            "code": "print(\"Hello, welcome!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Hello, welcome! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Reminder: water the plants today\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Reminder: water the plants today is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor walks into the seminar room for the very first time, and nobody there knows they've arrived yet.",
          "question": "What should the philosophy professor do right away so everyone immediately knows they're there?",
          "optionA": "Stay quiet and wait for someone to eventually notice them on their own",
          "optionB": "Speak up and introduce themselves out loud the moment they walk in",
          "correctOption": "B",
          "image": ""
        }
      },
      "food": {
        "scenarios": [
          {
            "scenario": "A food blogger's first word in a video should be a greeting.",
            "prompt": " Why is greeting so important?",
            "image": "/scenario-art/images/Food/0_1.jpeg"
          },
          {
            "scenario": "The greeting needs to be sound natural not scripted",
            "prompt": "How should the greeting be actually sound attracted?",
            "image": "scenario-art/images/Food/0_2.jpeg"
          },
          {
            "scenario": "Right after the greeting, the blogger will tell today's featured recipe name",
            "prompt": " Why there is a particular order for these things?",
            "image": "scenario-art/images/Food/0_3.jpeg"
          }
        ],
        "example": {
          "code": "print(\"Welcome to my kitchen!\")\nprint(\"Todays recipe: Lemon Garlic Pasta\")",
          "explanation": "Two print() calls produce two lines of output in the order they run — the first thing every Python program learns to do.",
          "syntaxBreakdown": [
          {
            "code": "print(\"Welcome to my kitchen!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Welcome to my kitchen! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Todays recipe: Lemon Garlic Pasta\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Todays recipe: Lemon Garlic Pasta is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef walks into the restaurant kitchen for the very first time, and nobody there knows they've arrived yet.",
          "question": "What should the head chef do right away so everyone immediately knows they're there?",
          "optionA": "Stay quiet and wait for someone to eventually notice them on their own",
          "optionB": "Speak up and introduce themselves out loud the moment they walk in",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "In 1960, Dr. Jane Goodall began studying wild chimpanzees in Gombe National Park, Tanzania. Instead of immediately conducting experiments, she spent days quietly observing the animals. Her first successful interaction marked the beginning of decades of groundbreaking research. Every meaningful journey begins with one successful first interaction. It may seem small, but it confirms that communication has started.",
        "scenarios": [
          {
            "scenario": "For several days, the chimpanzees avoid the researcher and keep their distance.",
            "prompt": "Why is building the first successful interaction important before beginning detailed observations?",
            "image": ""
          },
          {
            "scenario": "One chimpanzee finally becomes comfortable enough to approach.",
            "prompt": "How does this first interaction change what the researcher can do next?",
            "image": ""
          },
          {
            "scenario": "After trust is established, researchers begin recording detailed observations every day.",
            "prompt": "Why couldn't this work begin before the first successful interaction?",
            "image": ""
          }
        ],
        "example": {
          "code": "print(\"The unexamined life is not worth living.\")\nprint(\"- Socrates\")",
          "explanation": "Programming also begins with a simple first interaction. Before solving complex problems, we first make sure our program can communicate successfully.",
          "syntaxBreakdown": [
          {
            "code": "print(\"Hello, welcome!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Hello, welcome! is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Reminder: water the plants today\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Reminder: water the plants today is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A baby bird has just hatched in its nest, but its mother is resting nearby and doesn't know it has hatched yet.",
          "question": "What should the baby bird do so its mother notices it right away?",
          "optionA": "Chirp loudly right away so its mother hears it",
          "optionB": "Stay completely silent and wait for its mother to notice on her own",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "print() is how a Python program displays text to the screen — the most basic form of output.",
    "conceptIntro": "Every Python program can talk back to you using print(\"your text here\"). Text inside quotes is called a string, and each print() call outputs one line.",
    "reinforcement": {
      "prompt": "Write two print statements: one that says 'Hello, Python!' and one that says your favorite hobby.",
      "hint": "Use print() with quotes around the text.",
      "keyPoints": [
        "Uses print() correctly",
        "Text is inside quotes",
        "Two separate lines are printed"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "The ____ function displays text on the screen.",
        "options": [
          "print",
          "input",
          "def",
          "return"
        ],
        "answer": "print",
        "hint": "print() is the function that sends text to the screen — nothing shows up without it."
      },
      "code": {
        "text": "____(\"Hello, World!\")",
        "options": [
          "print",
          "input",
          "return",
          "class"
        ],
        "answer": "print",
        "hint": "print(...) is what actually displays the text inside the parentheses."
      }
    }
  },
  {
    "conceptSlug": "variables",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A cricket scoreboard shows the batter's name, current score, and balls faced during the innings.",
            "prompt": "How could the scoreboard keep track of these three details while the match is live?",
            "image": "/scenario-art/images/Sports/2_1.jpg"
          },
          {
            "scenario": "A batter hits a boundary, so the score changes while the player's name stays the same.",
            "prompt": "What does it mean that the score keeps changing while the batter's name stays the same?",
            "image": "/scenario-art/images/Sports/2_2.jpg"
          },
          {
            "scenario": "As the innings continues, the score and balls faced keep changing throughout the match.",
            "prompt": "How would the scoreboard keep updating these values as the match continues?",
            "image": "/scenario-art/images/Sports/2_3.jpg"
          }
        ],
        "example": {
          "code": "batsman_name = \"Kohli\"\nruns_scored = 45\nballs_faced = 30\n\nprint(batsman_name, \"has scored\", runs_scored, \"runs off\", balls_faced, \"balls\")\n\nruns_scored = 52  # he just hit a boundary\nprint(batsman_name, \"now has\", runs_scored, \"runs\")",
          "explanation": "batsman_name never changes, but runs_scored gets reassigned as the over unfolds — that's exactly what a variable is: a name pointing at a value that can change.",
          "syntaxBreakdown": [
          {
            "code": "batsman_name = \"Kohli\"",
            "points": [
              "batsman_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Kohli is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "runs_scored = 45",
            "points": [
              "runs_scored is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "45 is a number, used here as a literal value."
            ]
          },
          {
            "code": "balls_faced = 30",
            "points": [
              "balls_faced is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "30 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(batsman_name, \"has scored\", runs_scored, \"runs off\", balls_faced, \"balls\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "batsman_name refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "has scored is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "runs_scored refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "runs off is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "balls_faced refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "balls is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "runs_scored = 52  # he just hit a boundary",
            "points": [
              "runs_scored is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "52 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"he just hit a boundary\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(batsman_name, \"now has\", runs_scored, \"runs\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "batsman_name refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "now has is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "runs_scored refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "runs is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach needs to keep track of a number that changes constantly throughout the day in the team's training facility.",
          "question": "What's the best way for the new coach to keep track of that changing number?",
          "optionA": "Give it a clear label and update that same label's value whenever it changes",
          "optionB": "Write the number down fresh on a sticky note every single time it changes, with no label connecting them",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You are going to a birthday party. Your friend tells you the birthday person's favorite cake flavor is Chocolate.",
            "prompt": "Your friend tells you the favorite flavor is Chocolate. What information would you need to remember?",
            "image": "/scenario-art/images/Daily/1_1.jpg"
          },
          {
            "scenario": "Later you learn the favorite flavor is actually Red Velvet.",
            "prompt": "What information should be updated?",
            "image": "/scenario-art/images/Daily/1_2.jpg"
          },
          {
            "scenario": "At the bakery, the shopkeeper asks: 'What flavor cake would you like?'",
            "prompt": "How would you know what to answer?",
            "image": "/scenario-art/images/Daily/1_3.jpg"
          }
        ],
        "example": {
          "code": "rent = 1200\ngroceries = 340\nleftover = 2500 - rent - groceries\n\nprint(\"Rent:\", rent)\nprint(\"Groceries:\", groceries)\nprint(\"Leftover:\", leftover)\n\ngroceries = 380  # spent a bit more this week\nleftover = 2500 - rent - groceries\nprint(\"Updated leftover:\", leftover)",
          "explanation": "rent stays fixed while groceries and leftover update as the month goes on — each variable holds a value you can check and change independently.",
          "syntaxBreakdown": [
          {
            "code": "rent = 1200",
            "points": [
              "rent is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "1200 is a number, used here as a literal value."
            ]
          },
          {
            "code": "groceries = 340",
            "points": [
              "groceries is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "340 is a number, used here as a literal value."
            ]
          },
          {
            "code": "leftover = 2500 - rent - groceries",
            "points": [
              "leftover is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "2500 is a number, used here as a literal value.",
              "- subtracts the right side from the left side.",
              "rent refers back to the value already stored under that name.",
              "- subtracts the right side from the left side.",
              "groceries refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Rent:\", rent)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Rent: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "rent refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Groceries:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Groceries: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Leftover:\", leftover)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Leftover: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "leftover refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "groceries = 380  # spent a bit more this week",
            "points": [
              "groceries is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "380 is a number, used here as a literal value.",
              "The # starts a comment — everything after it on this line (\"spent a bit more this week\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "leftover = 2500 - rent - groceries",
            "points": [
              "leftover is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "2500 is a number, used here as a literal value.",
              "- subtracts the right side from the left side.",
              "rent refers back to the value already stored under that name.",
              "- subtracts the right side from the left side.",
              "groceries refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Updated leftover:\", leftover)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated leftover: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "leftover refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate needs to keep track of a number that changes constantly throughout the day in your shared apartment.",
          "question": "What's the best way for your roommate to keep track of that changing number?",
          "optionA": "Write the number down fresh on a sticky note every single time it changes, with no label connecting them",
          "optionB": "Give it a clear label and update that same label's value whenever it changes",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Around 500 BCE, the philosopher Heraclitus proposed that change is the natural state of reality. Things may keep the same identity while their condition continuously changes over time.",
        "scenarios": [
          {
            "scenario": "A river keeps flowing throughout the day, and the water present in the morning is no longer there by evening.",
            "prompt": "If the water changes constantly, why do we still call it the same river?",
            "image": ""
          },
          {
            "scenario": "A tree grows taller each year while leaves grow, fall, and regrow.",
            "prompt": "Has the tree become a different object, or has only its condition changed?",
            "image": ""
          },
          {
            "scenario": "People grow from childhood into adulthood while their appearance, knowledge, and experiences change.",
            "prompt": "What stays the same, and what continues changing?",
            "image": ""
          }
        ],
        "example": {
          "code": "claim = \"All swans are white\"\nstrength = 8\n\nprint(claim, \"- strength:\", strength)\n\nstrength = 3  # a black swan was just observed\nprint(claim, \"- updated strength:\", strength)",
          "explanation": "The claim itself doesn't change, but new evidence updates how strong you judge it to be — variables let you track that shift.",
          "syntaxBreakdown": [
          {
            "code": "rent = 1200",
            "points": [
              "rent is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "1200 is a number, used here as a literal value."
            ]
          },
          {
            "code": "groceries = 340",
            "points": [
              "groceries is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "340 is a number, used here as a literal value."
            ]
          },
          {
            "code": "leftover = 2500 - rent - groceries",
            "points": [
              "leftover is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "2500 is a number, used here as a literal value.",
              "- subtracts the right side from the left side.",
              "rent refers back to the value already stored under that name.",
              "- subtracts the right side from the left side.",
              "groceries refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Rent:\", rent)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Rent: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "rent refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Groceries:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Groceries: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Leftover:\", leftover)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Leftover: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "leftover refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "groceries = 380  # spent a bit more this week",
            "points": [
              "groceries is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "380 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"spent a bit more this week\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "leftover = 2500 - rent - groceries",
            "points": [
              "leftover is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "2500 is a number, used here as a literal value.",
              "- subtracts the right side from the left side.",
              "rent refers back to the value already stored under that name.",
              "- subtracts the right side from the left side.",
              "groceries refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Updated leftover:\", leftover)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated leftover: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "leftover refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor needs to keep track of a number that changes constantly throughout the day in the seminar room.",
          "question": "What's the best way for the philosophy professor to keep track of that changing number?",
          "optionA": "Give it a clear label and update that same label's value whenever it changes",
          "optionB": "Write the number down fresh on a sticky note every single time it changes, with no label connecting them",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Making Tea for the Whole Family",
        "scenarios": [
          {
            "scenario": "It's Sunday morning. Your mother pours one cup of milk into a pan and asks you to keep an eye on it while she brings the tea leaves.",
            "prompt": "How would you remember how much milk is currently in the pan?",
            "image": "/scenario-art/images/Food/1_1.jpeg",
            "reasoningKeyPoints": [
              "Remember the current amount",
              "Keep track of it",
              "Use the latest amount"
            ]
          },
          {
            "scenario": "Your uncle arrives unexpectedly, so your mother pours another cup of milk into the same pan.",
            "prompt": "Without starting over, how would you know how much milk is there now?",
            "image": "/scenario-art/images/Food/1_2.jpeg",
            "reasoningKeyPoints": [
              "Update the remembered amount",
              "The previous amount changes",
              "Always remember the newest amount"
            ]
          },
          {
            "scenario": "While the tea boils, some milk spills out of the pan.",
            "prompt": "How would you know how much milk is left now?",
            "image": "/scenario-art/images/Food/1_3.jpeg",
            "reasoningKeyPoints": [
              "Reduce the remembered amount",
              "Update it again",
              "Keep only the latest state"
            ]
          }
        ],
        "example": {
          "code": "dish_name = \"Margherita Pizza\"\nprice = 9\nsold_today = 12\n\nprint(dish_name, \"-\", sold_today, \"sold at $\", price)\n\nsold_today = 18  # lunch rush hit\nprint(dish_name, \"now at\", sold_today, \"sold\")",
          "explanation": "dish_name and price stay put while sold_today keeps climbing through the day — that's a variable being reassigned as reality changes.",
          "syntaxBreakdown": [
          {
            "code": "rent = 1200",
            "points": [
              "rent is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "1200 is a number, used here as a literal value."
            ]
          },
          {
            "code": "groceries = 340",
            "points": [
              "groceries is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "340 is a number, used here as a literal value."
            ]
          },
          {
            "code": "leftover = 2500 - rent - groceries",
            "points": [
              "leftover is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "2500 is a number, used here as a literal value.",
              "- subtracts the right side from the left side.",
              "rent refers back to the value already stored under that name.",
              "- subtracts the right side from the left side.",
              "groceries refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Rent:\", rent)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Rent: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "rent refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Groceries:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Groceries: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Leftover:\", leftover)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Leftover: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "leftover refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "groceries = 380  # spent a bit more this week",
            "points": [
              "groceries is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "380 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"spent a bit more this week\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "leftover = 2500 - rent - groceries",
            "points": [
              "leftover is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "2500 is a number, used here as a literal value.",
              "- subtracts the right side from the left side.",
              "rent refers back to the value already stored under that name.",
              "- subtracts the right side from the left side.",
              "groceries refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Updated leftover:\", leftover)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated leftover: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "leftover refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef needs to keep track of a number that changes constantly throughout the day in the restaurant kitchen.",
          "question": "What's the best way for the head chef to keep track of that changing number?",
          "optionA": "Give it a clear label and update that same label's value whenever it changes",
          "optionB": "Write the number down fresh on a sticky note every single time it changes, with no label connecting them",
          "correctOption": "A",
          "image": ""
        }
      },
            "environmental": {
        "background": "Water is constantly moving through Earth's environment. It changes between liquid, vapor, and ice while remaining the same substance. Scientists continuously measure these changing conditions to understand weather and climate. Many things in nature keep their identity while their current state changes continuously.",
        "scenarios": [
          {
            "scenario": "Morning sunlight slowly warms a lake, causing water to evaporate.",
            "prompt": "Has the water disappeared, or has its condition simply changed?",
            "image": ""
          },
          {
            "scenario": "Later, the vapor cools and forms clouds.",
            "prompt": "What changed, and what remained the same?",
            "image": ""
          },
          {
            "scenario": "Rain falls back into rivers and lakes.",
            "prompt": "How can the same water appear in different forms throughout its journey?",
            "image": ""
          }
        ],
        "example": {
          "code": "claim = \"All swans are white\"\nstrength = 8\n\nprint(claim, \"- strength:\", strength)\n\nstrength = 3  # a black swan was just observed\nprint(claim, \"- updated strength:\", strength)",
          "explanation": "Programming models changing information in the same way using variables.",
          "syntaxBreakdown": [
          {
            "code": "rent = 1200",
            "points": [
              "rent is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "1200 is a number, used here as a literal value."
            ]
          },
          {
            "code": "groceries = 340",
            "points": [
              "groceries is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "340 is a number, used here as a literal value."
            ]
          },
          {
            "code": "leftover = 2500 - rent - groceries",
            "points": [
              "leftover is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "2500 is a number, used here as a literal value.",
              "- subtracts the right side from the left side.",
              "rent refers back to the value already stored under that name.",
              "- subtracts the right side from the left side.",
              "groceries refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Rent:\", rent)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Rent: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "rent refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Groceries:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Groceries: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Leftover:\", leftover)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Leftover: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "leftover refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "groceries = 380  # spent a bit more this week",
            "points": [
              "groceries is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "380 is a number, used here as a literal value.",
              "The # starts a comment — everything after it on this line (\"spent a bit more this week\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "leftover = 2500 - rent - groceries",
            "points": [
              "leftover is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "2500 is a number, used here as a literal value.",
              "- subtracts the right side from the left side.",
              "rent refers back to the value already stored under that name.",
              "- subtracts the right side from the left side.",
              "groceries refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Updated leftover:\", leftover)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated leftover: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "leftover refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A pond's water level rises after a heavy rain, then slowly drops again during a dry week.",
          "question": "How should you keep track of the pond's water level as the days pass?",
          "optionA": "Only remember the very first level you ever saw and never change it",
          "optionB": "Update what you remember every time the level actually changes",
          "correctOption": "B",
          "image": ""
        }
      }
    },
    "conceptHint": "A variable is just a name bound to a value that can change.",
    "conceptIntro": "In Python, a variable is a name that points to a value in memory. You create one simply by assigning a value to a name with `=` — there's no need to declare a type up front, because Python figures that out for you (dynamic typing).",
    "reinforcement": {
      "prompt": "Create three variables for a movie ticket order — `movie_title`, `ticket_price`, and `seats` — then compute and print the total cost.",
      "hint": "Multiply ticket_price by seats to get the total, then print it with an f-string.",
      "keyPoints": [
        "Assign values to movie_title, ticket_price, and seats using the = operator",
        "Multiply ticket price by number of seats to compute the total cost",
        "Print the total using a formatted string"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "A ____ is a name that points to a value which can change.",
        "options": [
          "variable",
          "function",
          "loop",
          "tuple"
        ],
        "answer": "variable",
        "hint": "A variable needs a name and a value — the whole point is that value can be reassigned later."
      },
      "code": {
        "text": "age ____ 25\nprint(age)",
        "options": [
          "=",
          "==",
          "+",
          "-"
        ],
        "answer": "=",
        "hint": "The = sign assigns a value to a variable name; == would compare instead of assign."
      }
    }
  },
  {
    "conceptSlug": "input-output",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A coach asks each new player for their name before introducing them to the rest of the team.",
            "prompt": "How would the coach capture what each new player says, and then use it in the introduction?",
            "image": "/scenario-art/images/Sports/3_1.png"
          },
          {
            "scenario": "A volunteer writes a player's name with extra spaces, so it needs to be cleaned before announcing it.",
            "prompt": "What needs to happen between hearing the player's name and announcing it clearly?",
            "image": "/scenario-art/images/Sports/3_2.png"
          },
          {
            "scenario": "Before training begins, every player says both their name and playing position.",
            "prompt": "How would you capture both a player's name and their position, and use them together?",
            "image": "/scenario-art/images/Sports/3_3.png"
          }
        ],
        "example": {
          "code": "member_name = \"Priya\"   # imagine this came from input()\nclass_name = \"Yoga\"     # imagine this came from input()\n\nprint(\"Hi\", member_name + \"! You're checked into:\", class_name)",
          "explanation": "input() would capture what the member types as text; print() takes that captured value and weaves it into a message — hardcoded here so you can see the output pattern clearly.",
          "syntaxBreakdown": [
          {
            "code": "member_name = \"Priya\"   # imagine this came from input()",
            "points": [
              "member_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The # starts a comment \u2014 everything after it on this line (\"imagine this came from input()\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "class_name = \"Yoga\"     # imagine this came from input()",
            "points": [
              "class_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Yoga is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The # starts a comment \u2014 everything after it on this line (\"imagine this came from input()\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Hi\", member_name + \"! You're checked into:\", class_name)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Hi is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "member_name refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "! You're checked into: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "class_name refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach needs an answer from someone else before they can move forward in the team's training facility.",
          "question": "How should the new coach actually get that answer?",
          "optionA": "Assume what the answer probably is and move forward without ever asking",
          "optionB": "Ask the question directly and wait to hear the actual reply before continuing",
          "correctOption": "B",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You are in a new city and don't know where the bus station is.",
            "prompt": "You are in a new city and don't know where the bus station is. What would you do?",
            "image": "/scenario-art/images/Daily/2_1.jpg"
          },
          {
            "scenario": "A person gives you directions.",
            "prompt": "What have you received?",
            "image": "/scenario-art/images/Daily/2_2.jpg"
          },
          {
            "scenario": "You call your family and tell them you arrived.",
            "prompt": "What are you doing?",
            "image": "/scenario-art/images/Daily/2_3.jpg"
          }
        ],
        "example": {
          "code": "servings = 4                    # imagine this came from input()\ndish = \"Pasta Primavera\"\n\nprint(\"Scaling\", dish, \"for\", servings, \"people\")\nprint(\"You'll need\", servings * 2, \"cups of pasta\")",
          "explanation": "Whatever the app reads in becomes a value you can use right away — here to scale a recipe and build a sentence out of it.",
          "syntaxBreakdown": [
          {
            "code": "servings = 4                    # imagine this came from input()",
            "points": [
              "servings is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "4 is a number, used here as a literal value.",
              "The # starts a comment — everything after it on this line (\"imagine this came from input()\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "dish = \"Pasta Primavera\"",
            "points": [
              "dish is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pasta Primavera is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Scaling\", dish, \"for\", servings, \"people\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Scaling is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "dish refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "for is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "servings refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "people is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"You'll need\", servings * 2, \"cups of pasta\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "You'll need is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "servings refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "2 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cups of pasta is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate needs an answer from someone else before they can move forward in your shared apartment.",
          "question": "How should your roommate actually get that answer?",
          "optionA": "Assume what the answer probably is and move forward without ever asking",
          "optionB": "Ask the question directly and wait to hear the actual reply before continuing",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Socrates believed that understanding begins by asking questions. Instead of giving immediate answers, he first gathered information and then responded based on what he learned.",
        "scenarios": [
          {
            "scenario": "Two students approach Socrates with completely different questions.",
            "prompt": "Should both students receive exactly the same response?",
            "image": ""
          },
          {
            "scenario": "Before replying, Socrates asks each student several questions.",
            "prompt": "Why might collecting information first lead to a better answer?",
            "image": ""
          },
          {
            "scenario": "A third student arrives with another problem, and Socrates begins questioning again.",
            "prompt": "Why doesn't he simply repeat his previous advice?",
            "image": ""
          }
        ],
        "example": {
          "code": "belief = \"Free will exists\"     # imagine this came from input()\nreason = \"I feel like I choose my actions\"\n\nprint(\"You believe:\", belief)\nprint(\"Because:\", reason)",
          "explanation": "Captured text isn't just stored — print() lets you hand it right back to the person, confirming what they typed.",
          "syntaxBreakdown": [
          {
            "code": "servings = 4                    # imagine this came from input()",
            "points": [
              "servings is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "4 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"imagine this came from input()\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "dish = \"Pasta Primavera\"",
            "points": [
              "dish is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pasta Primavera is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Scaling\", dish, \"for\", servings, \"people\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Scaling is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "dish refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "for is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "servings refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "people is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"You'll need\", servings * 2, \"cups of pasta\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "You'll need is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "servings refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "2 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cups of pasta is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor needs an answer from someone else before they can move forward in the seminar room.",
          "question": "How should the philosophy professor actually get that answer?",
          "optionA": "Ask the question directly and wait to hear the actual reply before continuing",
          "optionB": "Assume what the answer probably is and move forward without ever asking",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Sunday Breakfast",
        "scenarios": [
          {
            "scenario": "It's Sunday morning, and everyone in your family wakes up at different times. Your mother wants to prepare breakfast but doesn't know what everyone wants.",
            "prompt": "Before she starts cooking, what should she do?",
            "image": "/scenario-art/images/Food/2_1.jpeg",
            "reasoningKeyPoints": [
              "Ask each family member",
              "Everyone may have a different choice",
              "She needs their preference first"
            ]
          },
          {
            "scenario": "Your father asks for poha, your sister wants sandwiches, and your brother wants idli. Your mother prepares each dish accordingly.",
            "prompt": "Why didn't she make the same breakfast for everyone?",
            "image": "/scenario-art/images/Food/2_2.jpeg",
            "reasoningKeyPoints": [
              "She used each person's response",
              "Different choices lead to different dishes",
              "She prepared food based on what she learned"
            ]
          },
          {
            "scenario": "Once everything is ready, your mother serves the correct dish to each family member.",
            "prompt": "Why is serving the food just as important as preparing it?",
            "image": "/scenario-art/images/Food/2_3.jpeg",
            "reasoningKeyPoints": [
              "The final result reaches the right person",
              "Cooking is complete only after serving",
              "People receive what they asked for"
            ]
          }
        ],
        "example": {
          "code": "customer_name = \"Jordan\"        # imagine this came from input()\npickup_time = \"7:30 PM\"\n\nprint(\"Thanks,\", customer_name + \"! Your order is ready at\", pickup_time)",
          "explanation": "Two separately captured answers get combined into one printed message — that's the whole input -> output loop.",
          "syntaxBreakdown": [
          {
            "code": "servings = 4                    # imagine this came from input()",
            "points": [
              "servings is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "4 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"imagine this came from input()\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "dish = \"Pasta Primavera\"",
            "points": [
              "dish is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pasta Primavera is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Scaling\", dish, \"for\", servings, \"people\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Scaling is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "dish refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "for is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "servings refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "people is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"You'll need\", servings * 2, \"cups of pasta\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "You'll need is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "servings refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "2 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cups of pasta is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef needs an answer from someone else before they can move forward in the restaurant kitchen.",
          "question": "How should the head chef actually get that answer?",
          "optionA": "Assume what the answer probably is and move forward without ever asking",
          "optionB": "Ask the question directly and wait to hear the actual reply before continuing",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "Bees collect nectar from flowers while unknowingly carrying pollen between plants. This exchange allows plants to reproduce and helps maintain healthy ecosystems. Nature often works through receiving something, processing it, and producing a result elsewhere.",
        "scenarios": [
          {
            "scenario": "A bee lands on a flower and collects nectar.",
            "prompt": "What does the bee receive from the flower?",
            "image": ""
          },
          {
            "scenario": "As the bee flies to another flower, pollen sticks to its body.",
            "prompt": "What is the bee carrying without intentionally trying to?",
            "image": ""
          },
          {
            "scenario": "The bee visits another flower, where some pollen is transferred.",
            "prompt": "How did one interaction produce an effect somewhere else?",
            "image": ""
          }
        ],
        "example": {
          "code": "belief = \"Free will exists\"     # imagine this came from input()\nreason = \"I feel like I choose my actions\"\n\nprint(\"You believe:\", belief)\nprint(\"Because:\", reason)",
          "explanation": "Programs also receive information, process it, and produce an output.",
          "syntaxBreakdown": [
          {
            "code": "servings = 4                    # imagine this came from input()",
            "points": [
              "servings is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "4 is a number, used here as a literal value.",
              "The # starts a comment — everything after it on this line (\"imagine this came from input()\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "dish = \"Pasta Primavera\"",
            "points": [
              "dish is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pasta Primavera is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Scaling\", dish, \"for\", servings, \"people\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Scaling is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "dish refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "for is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "servings refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "people is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"You'll need\", servings * 2, \"cups of pasta\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "You'll need is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "servings refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "2 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cups of pasta is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A flower opens its petals when morning sunlight touches it, and closes them again once it gets dark.",
          "question": "What makes the flower open its petals?",
          "optionA": "The sunlight reaching it causes it to open in response",
          "optionB": "The flower opens for no reason at all, at random times",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "input() reads from the user, print() shows something back.",
    "conceptIntro": "Python's `input()` function pauses your program, waits for the user to type something and press Enter, and returns whatever they typed as a string. `print()` sends output back to the screen. Together they let a program have a two-way conversation with the person running it.",
    "reinforcement": {
      "prompt": "Ask the user for their favorite exercise using input(), then print a message that includes their answer.",
      "hint": "Store the result of input() in a variable and use it inside an f-string in print().",
      "keyPoints": [
        "Use input() to capture the user's favorite exercise",
        "Store the input in a variable",
        "Use print() with an f-string to include the variable in the output"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "____() pauses the program and reads text typed by the user.",
        "options": [
          "input",
          "print",
          "open",
          "def"
        ],
        "answer": "input",
        "hint": "input() is what pauses the program and waits for the user to type something."
      },
      "code": {
        "text": "name = input(\"Name: \")\n____(\"Hello\", name)",
        "options": [
          "print",
          "input",
          "return",
          "class"
        ],
        "answer": "print",
        "hint": "print() is what actually shows text to the user — input() only reads, it never displays."
      }
    }
  },
  {
    "conceptSlug": "operators",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "Five teammates split the cost of hiring a practice ground equally.",
            "prompt": "How would the teammates divide the total cost evenly among themselves?",
            "image": "/scenario-art/images/Sports/4_1.png"
          },
          {
            "scenario": "A coach checks whether each runner finished under the qualifying time.",
            "prompt": "How would the coach compare a runner's time to the qualifying time and decide yes or no?",
            "image": "/scenario-art/images/Sports/4_2.png"
          },
          {
            "scenario": "A sprinter must finish under 11 seconds and beat their personal best to qualify.",
            "prompt": "How would you combine both requirements into one overall qualification check?",
            "image": "/scenario-art/images/Sports/4_3.png"
          }
        ],
        "example": {
          "code": "total_cost = 250\npeople = 5\nshare = total_cost / people\nprint(\"Each person pays:\", share)\n\ntip_planned = 40\nis_generous = tip_planned >= total_cost * 0.15\nprint(\"Is this a generous tip?\", is_generous)\n\nsprint_time = 10.8\nprevious_best = 11.0\nis_new_record = sprint_time < 11 and sprint_time < previous_best\nprint(\"New record?\", is_new_record)",
          "explanation": "/ divides evenly, >= compares two values, and and combines two true-or-false checks into one — the three operator types side by side.",
          "syntaxBreakdown": [
          {
            "code": "total_cost = 250",
            "points": [
              "total_cost is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "250 is a number, used here as a literal value."
            ]
          },
          {
            "code": "people = 5",
            "points": [
              "people is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "5 is a number, used here as a literal value."
            ]
          },
          {
            "code": "share = total_cost / people",
            "points": [
              "share is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "total_cost refers back to the value already stored under that name.",
              "/ divides the left side by the right side.",
              "people refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Each person pays:\", share)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Each person pays: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "share refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "tip_planned = 40",
            "points": [
              "tip_planned is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "40 is a number, used here as a literal value."
            ]
          },
          {
            "code": "is_generous = tip_planned >= total_cost * 0.15",
            "points": [
              "is_generous is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "tip_planned refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "total_cost refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "0.15 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Is this a generous tip?\", is_generous)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Is this a generous tip? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "is_generous refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "sprint_time = 10.8",
            "points": [
              "sprint_time is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "10.8 is a number, used here as a literal value."
            ]
          },
          {
            "code": "previous_best = 11.0",
            "points": [
              "previous_best is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "11.0 is a number, used here as a literal value."
            ]
          },
          {
            "code": "is_new_record = sprint_time < 11 and sprint_time < previous_best",
            "points": [
              "is_new_record is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "sprint_time refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "11 is a number, used here as a literal value.",
              "and combines two conditions \u2014 the whole expression is only True if BOTH sides are True.",
              "sprint_time refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "previous_best refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"New record?\", is_new_record)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "New record? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "is_new_record refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach has two different amounts in the team's training facility and needs to know which is bigger, or what they add up to.",
          "question": "How should the new coach find that out?",
          "optionA": "Actually compare or combine the two amounts using the right operation for what's being asked",
          "optionB": "Guess based on which one looks bigger without actually comparing them",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "A group of students is preparing a project presentation together. Different team members bring ideas for the project.",
            "prompt": "How can all ideas be included in one plan?",
            "image": "/scenario-art/images/Daily/3_1.jpg"
          },
          {
            "scenario": "One idea is found to be irrelevant.",
            "prompt": "What should happen to it?",
            "image": "/scenario-art/images/Daily/3_2.jpg"
          },
          {
            "scenario": "Several tasks need to be completed by the team.",
            "prompt": "How should the work be assigned?",
            "image": "/scenario-art/images/Daily/3_2.jpg"
          }
        ],
        "example": {
          "code": "bill = 84\nfriends = 4\nshare = bill / friends\nprint(\"Each person owes:\", share)\n\ntip = 14\nis_good_tip = tip >= bill * 0.15\nprint(\"Is the tip at least 15%?\", is_good_tip)\n\nis_raining = True\nhour = 21\ntake_cab = is_raining and hour >= 21\nprint(\"Take a cab?\", take_cab)",
          "explanation": "Division splits the bill, a comparison checks the tip against a threshold, and and requires both conditions to hold before you take the cab.",
          "syntaxBreakdown": [
          {
            "code": "bill = 84",
            "points": [
              "bill is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "84 is a number, used here as a literal value."
            ]
          },
          {
            "code": "friends = 4",
            "points": [
              "friends is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "4 is a number, used here as a literal value."
            ]
          },
          {
            "code": "share = bill / friends",
            "points": [
              "share is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "bill refers back to the value already stored under that name.",
              "/ divides the left side by the right side.",
              "friends refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Each person owes:\", share)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Each person owes: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "share refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "tip = 14",
            "points": [
              "tip is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "14 is a number, used here as a literal value."
            ]
          },
          {
            "code": "is_good_tip = tip >= bill * 0.15",
            "points": [
              "is_good_tip is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "tip refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "bill refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "0.15 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Is the tip at least 15%?\", is_good_tip)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Is the tip at least 15%? is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "is_good_tip refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "is_raining = True",
            "points": [
              "is_raining is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "True is one of Python's two boolean values, representing \"yes\" / \"this condition holds\"."
            ]
          },
          {
            "code": "hour = 21",
            "points": [
              "hour is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "21 is a number, used here as a literal value."
            ]
          },
          {
            "code": "take_cab = is_raining and hour >= 21",
            "points": [
              "take_cab is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "is_raining refers back to the value already stored under that name.",
              "and combines two conditions — the whole expression is only True if BOTH sides are True.",
              "hour refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "21 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Take a cab?\", take_cab)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Take a cab? is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "take_cab refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate has two different amounts in your shared apartment and needs to know which is bigger, or what they add up to.",
          "question": "How should your roommate find that out?",
          "optionA": "Actually compare or combine the two amounts using the right operation for what's being asked",
          "optionB": "Guess based on which one looks bigger without actually comparing them",
          "correctOption": "A",
          "image": ""
        }
      },
      "philosophy": {
        "background": "In Taoist philosophy, Yin and Yang represent complementary forces. They are meaningful not because they exist separately, but because of how they interact with one another.",
        "scenarios": [
          {
            "scenario": "The Yin-Yang symbol combines two opposite halves into one complete circle.",
            "prompt": "Why is neither half complete on its own?",
            "image": ""
          },
          {
            "scenario": "Imagine removing one half of the symbol.",
            "prompt": "How would this affect the meaning of the entire symbol?",
            "image": ""
          },
          {
            "scenario": "Two symbols are shown\u2014one balanced and one incomplete.",
            "prompt": "How would you determine which one truly represents harmony?",
            "image": ""
          }
        ],
        "example": {
          "code": "argument_a = 9\nargument_b = 6\na_is_stronger = argument_a > argument_b\nprint(\"Is argument A stronger?\", a_is_stronger)\n\nis_convincing = argument_a >= 7\nprint(\"Is argument A convincing?\", is_convincing)\n\nis_valid = True\npremises_true = True\nis_sound = is_valid and premises_true\nprint(\"Is the argument sound?\", is_sound)",
          "explanation": "> compares two scores, >= checks against a threshold, and and only returns True when both the validity and the premises hold at once.",
          "syntaxBreakdown": [
          {
            "code": "bill = 84",
            "points": [
              "bill is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "84 is a number, used here as a literal value."
            ]
          },
          {
            "code": "friends = 4",
            "points": [
              "friends is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "4 is a number, used here as a literal value."
            ]
          },
          {
            "code": "share = bill / friends",
            "points": [
              "share is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "bill refers back to the value already stored under that name.",
              "/ divides the left side by the right side.",
              "friends refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Each person owes:\", share)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Each person owes: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "share refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "tip = 14",
            "points": [
              "tip is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "14 is a number, used here as a literal value."
            ]
          },
          {
            "code": "is_good_tip = tip >= bill * 0.15",
            "points": [
              "is_good_tip is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "tip refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "bill refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "0.15 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Is the tip at least 15%?\", is_good_tip)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Is the tip at least 15%? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "is_good_tip refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "is_raining = True",
            "points": [
              "is_raining is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "True is one of Python's two boolean values, representing \"yes\" / \"this condition holds\"."
            ]
          },
          {
            "code": "hour = 21",
            "points": [
              "hour is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "21 is a number, used here as a literal value."
            ]
          },
          {
            "code": "take_cab = is_raining and hour >= 21",
            "points": [
              "take_cab is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "is_raining refers back to the value already stored under that name.",
              "and combines two conditions \u2014 the whole expression is only True if BOTH sides are True.",
              "hour refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "21 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Take a cab?\", take_cab)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Take a cab? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "take_cab refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor has two different amounts in the seminar room and needs to know which is bigger, or what they add up to.",
          "question": "How should the philosophy professor find that out?",
          "optionA": "Actually compare or combine the two amounts using the right operation for what's being asked",
          "optionB": "Guess based on which one looks bigger without actually comparing them",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Making Vegetable Sandwiches",
        "scenarios": [
          {
            "scenario": "You're helping your sister make sandwiches. She places slices of cucumber, tomato, onion, and cheese together between two bread slices.",
            "prompt": "How does she turn separate ingredients into one sandwich?",
            "image": "/scenario-art/images/Food/3_1.jpeg",
            "reasoningKeyPoints": [
              "Different ingredients are combined",
              "Several things work together",
              "The final result is created from multiple parts"
            ]
          },
          {
            "scenario": "One sandwich is too spicy, so your sister removes a few chilli slices before serving it.",
            "prompt": "How does the sandwich change after removing an ingredient?",
            "image": "/scenario-art/images/Food/3_2.jpeg",
            "reasoningKeyPoints": [
              "Something can be removed",
              "The result changes",
              "The ingredients become different"
            ]
          },
          {
            "scenario": "Now two sandwiches are ready. One has extra cheese while the other has only one cheese slice.",
            "prompt": "How would you decide which sandwich is cheesier?",
            "image": "/scenario-art/images/Food/3_3.jpeg",
            "reasoningKeyPoints": [
              "Compare both sandwiches",
              "Observe the difference",
              "Decide based on what you see"
            ]
          }
        ],
        "example": {
          "code": "bill = 68\nfriends = 4\nshare = bill / friends\nprint(\"Each person pays:\", share)\n\ntip = 11\nis_good_tip = tip >= bill * 0.15\nprint(\"Is the tip at least 15%?\", is_good_tip)\n\norder_total = 25\nplaced_before_9pm = True\nfree_delivery = order_total > 20 and placed_before_9pm\nprint(\"Free delivery?\", free_delivery)",
          "explanation": "Division splits the bill fairly, a comparison checks the tip, and and combines two separate conditions into one delivery decision.",
          "syntaxBreakdown": [
          {
            "code": "bill = 84",
            "points": [
              "bill is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "84 is a number, used here as a literal value."
            ]
          },
          {
            "code": "friends = 4",
            "points": [
              "friends is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "4 is a number, used here as a literal value."
            ]
          },
          {
            "code": "share = bill / friends",
            "points": [
              "share is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "bill refers back to the value already stored under that name.",
              "/ divides the left side by the right side.",
              "friends refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Each person owes:\", share)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Each person owes: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "share refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "tip = 14",
            "points": [
              "tip is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "14 is a number, used here as a literal value."
            ]
          },
          {
            "code": "is_good_tip = tip >= bill * 0.15",
            "points": [
              "is_good_tip is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "tip refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "bill refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "0.15 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Is the tip at least 15%?\", is_good_tip)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Is the tip at least 15%? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "is_good_tip refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "is_raining = True",
            "points": [
              "is_raining is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "True is one of Python's two boolean values, representing \"yes\" / \"this condition holds\"."
            ]
          },
          {
            "code": "hour = 21",
            "points": [
              "hour is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "21 is a number, used here as a literal value."
            ]
          },
          {
            "code": "take_cab = is_raining and hour >= 21",
            "points": [
              "take_cab is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "is_raining refers back to the value already stored under that name.",
              "and combines two conditions \u2014 the whole expression is only True if BOTH sides are True.",
              "hour refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "21 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Take a cab?\", take_cab)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Take a cab? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "take_cab refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef has two different amounts in the restaurant kitchen and needs to know which is bigger, or what they add up to.",
          "question": "How should the head chef find that out?",
          "optionA": "Actually compare or combine the two amounts using the right operation for what's being asked",
          "optionB": "Guess based on which one looks bigger without actually comparing them",
          "correctOption": "A",
          "image": ""
        }
      },
            "environmental": {
        "background": "An ecosystem survives because different organisms interact with one another. Predators, herbivores, plants, and decomposers each influence the balance of the entire system. Nature depends on interactions. Individual elements become meaningful because of the relationships between them.",
        "scenarios": [
          {
            "scenario": "Grass provides food for deer.",
            "prompt": "Why can't the deer survive without the grass?",
            "image": ""
          },
          {
            "scenario": "A tiger depends on deer for food.",
            "prompt": "How does the population of deer affect the tiger?",
            "image": ""
          },
          {
            "scenario": "Scientists study the entire food web instead of one species alone.",
            "prompt": "Why is understanding relationships more important than studying each organism separately?",
            "image": ""
          }
        ],
        "example": {
          "code": "argument_a = 9\nargument_b = 6\na_is_stronger = argument_a > argument_b\nprint(\"Is argument A stronger?\", a_is_stronger)\n\nis_convincing = argument_a >= 7\nprint(\"Is argument A convincing?\", is_convincing)\n\nis_valid = True\npremises_true = True\nis_sound = is_valid and premises_true\nprint(\"Is the argument sound?\", is_sound)",
          "explanation": "Programming also combines, compares, and relates values using operators.",
          "syntaxBreakdown": [
          {
            "code": "bill = 84",
            "points": [
              "bill is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "84 is a number, used here as a literal value."
            ]
          },
          {
            "code": "friends = 4",
            "points": [
              "friends is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "4 is a number, used here as a literal value."
            ]
          },
          {
            "code": "share = bill / friends",
            "points": [
              "share is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "bill refers back to the value already stored under that name.",
              "/ divides the left side by the right side.",
              "friends refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Each person owes:\", share)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Each person owes: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "share refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "tip = 14",
            "points": [
              "tip is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "14 is a number, used here as a literal value."
            ]
          },
          {
            "code": "is_good_tip = tip >= bill * 0.15",
            "points": [
              "is_good_tip is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "tip refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "bill refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "0.15 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Is the tip at least 15%?\", is_good_tip)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Is the tip at least 15%? is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "is_good_tip refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "is_raining = True",
            "points": [
              "is_raining is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "True is one of Python's two boolean values, representing \"yes\" / \"this condition holds\"."
            ]
          },
          {
            "code": "hour = 21",
            "points": [
              "hour is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "21 is a number, used here as a literal value."
            ]
          },
          {
            "code": "take_cab = is_raining and hour >= 21",
            "points": [
              "take_cab is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "is_raining refers back to the value already stored under that name.",
              "and combines two conditions — the whole expression is only True if BOTH sides are True.",
              "hour refers back to the value already stored under that name.",
              ">= checks whether the left side is greater than or equal to the right side.",
              "21 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(\"Take a cab?\", take_cab)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Take a cab? is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "take_cab refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A farmer has two pumpkins and wants to pick the bigger one to enter into the village fair.",
          "question": "How should the farmer decide which pumpkin to pick?",
          "optionA": "Compare the two pumpkins' sizes side by side first",
          "optionB": "Pick one without ever comparing them",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "Arithmetic operators compute values; comparison operators produce True/False.",
    "conceptIntro": "Python operators fall into a few families: arithmetic (`+ - * / // % **`) for calculations, comparison (`== != > < >= <=`) which always produce `True` or `False`, and logical (`and or not`) for combining conditions.",
    "reinforcement": {
      "prompt": "Given a distance of 12.5 and a speed of 5, calculate the time (distance / speed) and check whether that time is less than 3 hours.",
      "hint": "Use / for the division and < for the comparison.",
      "keyPoints": [
        "Divide distance by speed using the / operator to get time",
        "Use the < comparison operator to check if time is less than 3",
        "The comparison produces a boolean True or False result"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "The ____ operator checks if two values are equal and returns True or False.",
        "options": [
          "==",
          "=",
          "+",
          "and"
        ],
        "answer": "==",
        "hint": "== compares two values and returns True or False; a single = would assign instead of compare."
      },
      "code": {
        "text": "total = 5 ____ 3\nprint(total)  # 8",
        "options": [
          "+",
          "and",
          "==",
          "or"
        ],
        "answer": "+",
        "hint": "+ adds the two numbers together to get 8."
      }
    }
  },
  {
    "conceptSlug": "conditions",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A marathon awards Gold, Silver, or Bronze medals depending on finishing time.",
            "prompt": "How would you decide between three different medals depending on the finishing time?",
            "image": "/scenario-art/images/Sports/5_1.png"
          },
          {
            "scenario": "A runner should receive only one medal, even if they qualify for multiple time ranges.",
            "prompt": "How do you make sure a runner only receives one medal, never more than one?",
            "image": "/scenario-art/images/Sports/5_2.png"
          },
          {
            "scenario": "Some runners finish outside every medal category and receive a participation certificate instead.",
            "prompt": "What would you add to make sure runners who don't qualify for any medal still get something?",
            "image": "/scenario-art/images/Sports/5_3.png"
          }
        ],
        "example": {
          "code": "finish_time = 3.9  # hours\n\nif finish_time < 4:\n    print(\"Gold medal pace!\")\nelif finish_time < 4.5:\n    print(\"Silver medal pace!\")\nelif finish_time < 5:\n    print(\"Bronze medal pace!\")\nelse:\n    print(\"Keep training — you'll get there!\")",
          "explanation": "Python checks each condition top to bottom and runs only the first branch that matches — the rest are skipped entirely.",
          "syntaxBreakdown": [
          {
            "code": "finish_time = 3.9  # hours",
            "points": [
              "finish_time is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "3.9 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"hours\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "if finish_time < 4:",
            "points": [
              "if starts a conditional check \u2014 the code indented below it only runs when the condition right after if turns out to be True.",
              "finish_time refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "4 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Gold medal pace!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Gold medal pace! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "elif finish_time < 4.5:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False \u2014 it's another chance to match a different case.",
              "finish_time refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "4.5 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Silver medal pace!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Silver medal pace! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "elif finish_time < 5:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False \u2014 it's another chance to match a different case.",
              "finish_time refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "5 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Bronze medal pace!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bronze medal pace! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "else:",
            "points": [
              "else is the fallback \u2014 its indented block runs only if none of the if/elif conditions above it were True.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Keep training \u2014 you'll get there!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Keep training \u2014 you'll get there! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach has to make a different decision in the team's training facility depending on which situation comes up.",
          "question": "How should the new coach handle that?",
          "optionA": "Check the situation first, then follow whichever path actually matches it",
          "optionB": "Always follow the same path regardless of which situation actually comes up",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You are about to leave home. Dark clouds are visible.",
            "prompt": "You are about to leave home. Dark clouds are visible. What would you check?",
            "image": "/scenario-art/images/Daily/4_1.jpg"
          },
          {
            "scenario": "It starts raining.",
            "prompt": "What decision would you make?",
            "image": "/scenario-art/images/Daily/4_2.jpg"
          },
          {
            "scenario": "The rain stops completely.",
            "prompt": "Would your decision stay the same?",
            "image": "/scenario-art/images/Daily/4_3.jpg"
          }
        ],
        "example": {
          "code": "temperature = 8  # celsius\n\nif temperature < 5:\n    print(\"Wear a heavy coat\")\nelif temperature < 15:\n    print(\"A jacket should do\")\nelif temperature < 25:\n    print(\"T-shirt weather\")\nelse:\n    print(\"Stay cool, it's hot out!\")",
          "explanation": "Only one recommendation ever prints, because Python stops checking as soon as a condition is true.",
          "syntaxBreakdown": [
          {
            "code": "temperature = 8  # celsius",
            "points": [
              "temperature is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "8 is a number, used here as a literal value.",
              "The # starts a comment — everything after it on this line (\"celsius\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "if temperature < 5:",
            "points": [
              "if starts a conditional check — the code indented below it only runs when the condition right after if turns out to be True.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "5 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Wear a heavy coat\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Wear a heavy coat is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "elif temperature < 15:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False — it's another chance to match a different case.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "15 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"A jacket should do\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "A jacket should do is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "elif temperature < 25:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False — it's another chance to match a different case.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "25 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"T-shirt weather\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "T-shirt weather is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "else:",
            "points": [
              "else is the fallback — its indented block runs only if none of the if/elif conditions above it were True.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Stay cool, it's hot out!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Stay cool, it's hot out! is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate has to make a different decision in your shared apartment depending on which situation comes up.",
          "question": "How should your roommate handle that?",
          "optionA": "Check the situation first, then follow whichever path actually matches it",
          "optionB": "Always follow the same path regardless of which situation actually comes up",
          "correctOption": "A",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Stoic philosophers believed that wise decisions should be based on the present situation rather than assumptions or emotions. Before acting, reality must first be examined.",
        "scenarios": [
          {
            "scenario": "A traveler reaches a bridge that appears damaged.",
            "prompt": "Should the traveler cross immediately?",
            "image": ""
          },
          {
            "scenario": "Engineers inspect the bridge and declare it unsafe.",
            "prompt": "Should this information change the traveler's decision?",
            "image": ""
          },
          {
            "scenario": "A week later, the bridge is repaired and reopened.",
            "prompt": "Should the previous decision still be followed?",
            "image": ""
          }
        ],
        "example": {
          "code": "action = \"returning a lost wallet\"\nharms_others = False\nhelps_others = True\n\nif harms_others:\n    print(action, \"-> impermissible\")\nelif helps_others:\n    print(action, \"-> obligatory\")\nelse:\n    print(action, \"-> permissible\")",
          "explanation": "The elif chain guarantees the action gets exactly one classification, never more than one.",
          "syntaxBreakdown": [
          {
            "code": "temperature = 8  # celsius",
            "points": [
              "temperature is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "8 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"celsius\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "if temperature < 5:",
            "points": [
              "if starts a conditional check \u2014 the code indented below it only runs when the condition right after if turns out to be True.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "5 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Wear a heavy coat\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Wear a heavy coat is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "elif temperature < 15:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False \u2014 it's another chance to match a different case.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "15 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"A jacket should do\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "A jacket should do is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "elif temperature < 25:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False \u2014 it's another chance to match a different case.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "25 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"T-shirt weather\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "T-shirt weather is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "else:",
            "points": [
              "else is the fallback \u2014 its indented block runs only if none of the if/elif conditions above it were True.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Stay cool, it's hot out!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Stay cool, it's hot out! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor has to make a different decision in the seminar room depending on which situation comes up.",
          "question": "How should the philosophy professor handle that?",
          "optionA": "Check the situation first, then follow whichever path actually matches it",
          "optionB": "Always follow the same path regardless of which situation actually comes up",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Making Perfect Dosas",
        "scenarios": [
          {
            "scenario": "Your mother heats the dosa pan. She doesn't pour the batter immediately.",
            "prompt": "Why does she wait before pouring the batter?",
            "image": "/scenario-art/images/Food/4_1.jpeg",
            "reasoningKeyPoints": [
              "The pan should be ready first",
              "Check before acting",
              "Timing matters"
            ]
          },
          {
            "scenario": "After sprinkling a few drops of water, they sizzle instantly.",
            "prompt": "What does that tell her?",
            "image": "/scenario-art/images/Food/4_2.jpeg",
            "reasoningKeyPoints": [
              "The pan is ready",
              "The situation has changed",
              "Now the next step can happen"
            ]
          },
          {
            "scenario": "She pours the batter and waits until one side becomes golden brown before flipping it.",
            "prompt": "How does she decide when it's time to flip the dosa?",
            "image": "/scenario-art/images/Food/4_3.jpeg",
            "reasoningKeyPoints": [
              "Observe the current state",
              "Wait until the right moment",
              "Act only when the condition is met"
            ]
          }
        ],
        "example": {
          "code": "people_in_line = 8\n\nif people_in_line == 0:\n    print(\"No wait — come on in!\")\nelif people_in_line <= 5:\n    print(\"Short wait, about 10 minutes\")\nelif people_in_line <= 15:\n    print(\"Longer wait, about 25 minutes\")\nelse:\n    print(\"It's busy tonight — maybe grab a drink while you wait\")",
          "explanation": "The else at the end catches any case the earlier checks didn't cover, so the program always has something sensible to say.",
          "syntaxBreakdown": [
          {
            "code": "temperature = 8  # celsius",
            "points": [
              "temperature is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "8 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"celsius\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "if temperature < 5:",
            "points": [
              "if starts a conditional check \u2014 the code indented below it only runs when the condition right after if turns out to be True.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "5 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Wear a heavy coat\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Wear a heavy coat is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "elif temperature < 15:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False \u2014 it's another chance to match a different case.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "15 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"A jacket should do\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "A jacket should do is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "elif temperature < 25:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False \u2014 it's another chance to match a different case.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "25 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"T-shirt weather\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "T-shirt weather is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "else:",
            "points": [
              "else is the fallback \u2014 its indented block runs only if none of the if/elif conditions above it were True.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Stay cool, it's hot out!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Stay cool, it's hot out! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef has to make a different decision in the restaurant kitchen depending on which situation comes up.",
          "question": "How should the head chef handle that?",
          "optionA": "Always follow the same path regardless of which situation actually comes up",
          "optionB": "Check the situation first, then follow whichever path actually matches it",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "Many migratory birds travel thousands of kilometers every year. They do not migrate randomly---changes in daylight, temperature, and food availability trigger the journey. The same action isn't always appropriate. Nature responds differently depending on current conditions.",
        "scenarios": [
          {
            "scenario": "Summer provides abundant food, so the birds remain where they are.",
            "prompt": "Why don't they migrate immediately?",
            "image": ""
          },
          {
            "scenario": "As winter approaches, temperatures drop and food becomes scarce.",
            "prompt": "Why does this change their behavior?",
            "image": ""
          },
          {
            "scenario": "Spring arrives, temperatures rise, and food becomes plentiful again.",
            "prompt": "Should the birds continue migrating, or return?",
            "image": ""
          }
        ],
        "example": {
          "code": "action = \"returning a lost wallet\"\nharms_others = False\nhelps_others = True\n\nif harms_others:\n    print(action, \"-> impermissible\")\nelif helps_others:\n    print(action, \"-> obligatory\")\nelse:\n    print(action, \"-> permissible\")",
          "explanation": "Programs also make decisions by checking conditions before acting.",
          "syntaxBreakdown": [
          {
            "code": "temperature = 8  # celsius",
            "points": [
              "temperature is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "8 is a number, used here as a literal value.",
              "The # starts a comment — everything after it on this line (\"celsius\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "if temperature < 5:",
            "points": [
              "if starts a conditional check — the code indented below it only runs when the condition right after if turns out to be True.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "5 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Wear a heavy coat\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Wear a heavy coat is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "elif temperature < 15:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False — it's another chance to match a different case.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "15 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"A jacket should do\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "A jacket should do is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "elif temperature < 25:",
            "points": [
              "elif (\"else if\") is checked only if every condition above it was False — it's another chance to match a different case.",
              "temperature refers back to the value already stored under that name.",
              "< checks whether the left side is smaller than the right side.",
              "25 is a number, used here as a literal value.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"T-shirt weather\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "T-shirt weather is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "else:",
            "points": [
              "else is the fallback — its indented block runs only if none of the if/elif conditions above it were True.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Stay cool, it's hot out!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Stay cool, it's hot out! is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Dark clouds are gathering above an anthill, and the ants are deciding what to do with the food they've gathered outside.",
          "question": "What should the ants do?",
          "optionA": "Move the food inside only if it actually starts raining",
          "optionB": "Move the food inside every single day no matter what the sky looks like",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "if/elif/else lets the program choose one path out of several based on a condition.",
    "conceptIntro": "Python's `if`, `elif`, and `else` statements let a program branch: it checks conditions in order and runs the code under the first one that evaluates to `True`, skipping the rest.",
    "reinforcement": {
      "prompt": "Write an if/elif/else chain that prints \"Low\", \"Medium\", or \"High\" based on a battery percentage: below 20 is Low, below 80 is Medium, otherwise High.",
      "hint": "Order your conditions from smallest threshold to largest, using elif in between.",
      "keyPoints": [
        "Use if to check if battery percentage is below 20 and print Low",
        "Use elif to check if it is below 80 and print Medium",
        "Use else to cover everything else and print High"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "____ runs a block of code only when a condition is true.",
        "options": [
          "if",
          "for",
          "def",
          "class"
        ],
        "answer": "if",
        "hint": "if only runs its block when the condition is true — nothing else runs without more branches."
      },
      "code": {
        "text": "if age >= 18:\n    print(\"Adult\")\n____:\n    print(\"Minor\")",
        "options": [
          "else",
          "elif",
          "break",
          "return"
        ],
        "answer": "else",
        "hint": "else catches every case the earlier if didn't match."
      }
    }
  },
  {
    "conceptSlug": "loops",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A coach shakes hands with every player before practice begins.",
            "prompt": "How would you repeat the handshake for every player without doing it one by one manually?",
            "image": "/scenario-art/images/Sports/6_1.png"
          },
          {
            "scenario": "During warm-up, each player performs the same drill, although each performs it slightly differently.",
            "prompt": "What stays the same about how the drill is repeated, even though each player performs it a bit differently?",
            "image": "/scenario-art/images/Sports/6_2.png"
          },
          {
            "scenario": "A goalkeeper keeps practicing penalty saves until finally making a successful save.",
            "prompt": "How is repeating this drill until a save is made different from repeating it a fixed number of times?",
            "image": "/scenario-art/images/Sports/6_3.png"
          }
        ],
        "example": {
          "code": "teams = [\"Falcons\", \"Tigers\", \"Sharks\", \"Eagles\"]\n\nfor team in teams:\n    print(team, \"- registration confirmed!\")",
          "explanation": "The for loop repeats the same print action once for every team in the list — no copy-pasting needed.",
          "syntaxBreakdown": [
          {
            "code": "teams = [\"Falcons\", \"Tigers\", \"Sharks\", \"Eagles\"]",
            "points": [
              "teams is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening square bracket starts a list \u2014 an ordered collection of items.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Falcons is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Tigers is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sharks is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Eagles is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "for team in teams:",
            "points": [
              "for starts a loop that repeats its indented body once for every item in the collection that follows.",
              "team refers back to the value already stored under that name.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "teams refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(team, \"- registration confirmed!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "team refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "- registration confirmed! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach has a whole stack of items in the team's training facility that each need the exact same action done to them.",
          "question": "What's the smartest way for the new coach to get through all of them?",
          "optionA": "Repeat the same action once for each item in turn until the whole stack is done",
          "optionB": "Do the first item, then stop, assuming the rest will get handled the same way automatically",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You have several plants and each one needs water.",
            "prompt": "You have several plants. Each one needs water. How would you approach this task?",
            "image": "/scenario-art/images/Daily/5_1.jpg"
          },
          {
            "scenario": "You continue watering the plants.",
            "prompt": "What action keeps happening repeatedly?",
            "image": "/scenario-art/images/Daily/5_2.jpg"
          },
          {
            "scenario": "All the plants have been watered.",
            "prompt": "How do you know when the task is finished?",
            "image": "/scenario-art/images/Daily/5_3.jpg"
          }
        ],
        "example": {
          "code": "family = [\"Mom\", \"Dad\", \"Priya\", \"Sam\"]\n\nfor person in family:\n    print(\"Hey\", person + \", we're meeting up this weekend!\")",
          "explanation": "person changes on every pass through the loop while the message structure stays exactly the same.",
          "syntaxBreakdown": [
          {
            "code": "family = [\"Mom\", \"Dad\", \"Priya\", \"Sam\"]",
            "points": [
              "family is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening square bracket starts a list — an ordered collection of items.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Mom is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Dad is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "for person in family:",
            "points": [
              "for starts a loop that repeats its indented body once for every item in the collection that follows.",
              "person refers back to the value already stored under that name.",
              "in here checks membership/iterates over a collection — either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "family refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Hey\", person + \", we're meeting up this weekend!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Hey is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "person refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              ", we're meeting up this weekend! is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate has a whole stack of items in your shared apartment that each need the exact same action done to them.",
          "question": "What's the smartest way for your roommate to get through all of them?",
          "optionA": "Do the first item, then stop, assuming the rest will get handled the same way automatically",
          "optionB": "Repeat the same action once for each item in turn until the whole stack is done",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Many philosophical traditions describe mastery as the result of consistent repetition. Improvement comes not from doing something once, but from repeating it with purpose.",
        "scenarios": [
          {
            "scenario": "A violinist practices the same scales every morning.",
            "prompt": "Why repeat the same exercise instead of learning a new one each day?",
            "image": ""
          },
          {
            "scenario": "Weeks later, the practice routine remains almost unchanged.",
            "prompt": "How can repeating the same activity continue to produce improvement?",
            "image": ""
          },
          {
            "scenario": "Months later, the musician performs confidently with very few mistakes.",
            "prompt": "What role did repetition play in reaching this level?",
            "image": ""
          }
        ],
        "example": {
          "code": "claims = [\n    \"The sun will rise tomorrow\",\n    \"All bachelors are unmarried\",\n    \"There is a teapot orbiting the sun\",\n]\n\nfor claim in claims:\n    print(claim, \"- is this falsifiable? Let's think it through.\")",
          "explanation": "The same reasoning prompt gets applied to every claim in the list, one at a time, through a single loop.",
          "syntaxBreakdown": [
          {
            "code": "family = [\"Mom\", \"Dad\", \"Priya\", \"Sam\"]",
            "points": [
              "family is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening square bracket starts a list \u2014 an ordered collection of items.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Mom is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Dad is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "for person in family:",
            "points": [
              "for starts a loop that repeats its indented body once for every item in the collection that follows.",
              "person refers back to the value already stored under that name.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "family refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Hey\", person + \", we're meeting up this weekend!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Hey is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "person refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              ", we're meeting up this weekend! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor has a whole stack of items in the seminar room that each need the exact same action done to them.",
          "question": "What's the smartest way for the philosophy professor to get through all of them?",
          "optionA": "Do the first item, then stop, assuming the rest will get handled the same way automatically",
          "optionB": "Repeat the same action once for each item in turn until the whole stack is done",
          "correctOption": "B",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Dinner for the Whole Family",
        "scenarios": [
          {
            "scenario": "Your grandmother starts making chapatis for dinner. Everyone in the family will need one.",
            "prompt": "How should she prepare enough chapatis for everyone?",
            "image": "/scenario-art/images/Food/5_1.jpeg",
            "reasoningKeyPoints": [
              "Repeat the same steps",
              "Make one after another",
              "Continue until everyone has one"
            ]
          },
          {
            "scenario": "Some relatives arrive unexpectedly, so more chapatis are needed.",
            "prompt": "What should your grandmother do now?",
            "image": "/scenario-art/images/Food/5_2.jpeg",
            "reasoningKeyPoints": [
              "Continue the same process",
              "Keep making more",
              "Stop only when enough are ready"
            ]
          },
          {
            "scenario": "Finally, everyone has received a chapati and no one else needs one.",
            "prompt": "What tells your grandmother it's time to stop cooking?",
            "image": "/scenario-art/images/Food/5_3.jpeg",
            "reasoningKeyPoints": [
              "The goal has been reached",
              "No more repetition is needed",
              "The work is complete"
            ]
          }
        ],
        "example": {
          "code": "orders = [\"Chocolate cake - Table 3\", \"Red velvet - Table 7\", \"Cheesecake - Table 1\"]\n\nfor order in orders:\n    print(\"Pickup label printed:\", order)",
          "explanation": "Each order gets its own printed label automatically — the loop handles repetition so you don't have to.",
          "syntaxBreakdown": [
          {
            "code": "family = [\"Mom\", \"Dad\", \"Priya\", \"Sam\"]",
            "points": [
              "family is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening square bracket starts a list \u2014 an ordered collection of items.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Mom is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Dad is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "for person in family:",
            "points": [
              "for starts a loop that repeats its indented body once for every item in the collection that follows.",
              "person refers back to the value already stored under that name.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "family refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Hey\", person + \", we're meeting up this weekend!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Hey is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "person refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              ", we're meeting up this weekend! is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef has a whole stack of items in the restaurant kitchen that each need the exact same action done to them.",
          "question": "What's the smartest way for the head chef to get through all of them?",
          "optionA": "Do the first item, then stop, assuming the rest will get handled the same way automatically",
          "optionB": "Repeat the same action once for each item in turn until the whole stack is done",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "Pacific salmon travel hundreds of kilometers upstream to reach their breeding grounds. Throughout the journey they continue swimming despite rocks, waterfalls, and strong currents until they finally reach their destination. Large goals are often achieved through repeated actions performed until the objective is reached.",
        "scenarios": [
          {
            "scenario": "A salmon begins swimming upstream.",
            "prompt": "Why doesn't it stop after crossing just one section of the river?",
            "image": ""
          },
          {
            "scenario": "The fish continues repeating the same movement over long distances.",
            "prompt": "Why repeat the same action again and again?",
            "image": ""
          },
          {
            "scenario": "Eventually the salmon reaches its breeding ground.",
            "prompt": "What tells the salmon that its journey is complete?",
            "image": ""
          }
        ],
        "example": {
          "code": "claims = [\n    \"The sun will rise tomorrow\",\n    \"All bachelors are unmarried\",\n    \"There is a teapot orbiting the sun\",\n]\n\nfor claim in claims:\n    print(claim, \"- is this falsifiable? Let's think it through.\")",
          "explanation": "Programming performs repeated tasks using loops.",
          "syntaxBreakdown": [
          {
            "code": "family = [\"Mom\", \"Dad\", \"Priya\", \"Sam\"]",
            "points": [
              "family is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening square bracket starts a list — an ordered collection of items.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Mom is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Dad is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "for person in family:",
            "points": [
              "for starts a loop that repeats its indented body once for every item in the collection that follows.",
              "person refers back to the value already stored under that name.",
              "in here checks membership/iterates over a collection — either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "family refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(\"Hey\", person + \", we're meeting up this weekend!\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Hey is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "person refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              ", we're meeting up this weekend! is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A woodpecker keeps pecking the same spot on a tree trunk again and again, searching for a bug hiding inside.",
          "question": "When should the woodpecker stop pecking?",
          "optionA": "Keep pecking, over and over, until it finally finds a bug",
          "optionB": "Peck exactly one time and give up right away",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A for loop repeats code once per item; a while loop repeats while a condition holds.",
    "conceptIntro": "A `for` loop iterates over a sequence (like a list or a `range()`), running the loop body once per item. A `while` loop instead keeps running as long as its condition stays `True`. Both let you repeat work without copy-pasting code.",
    "reinforcement": {
      "prompt": "Write a for loop that prints the numbers 1 through 5 using range(), each on its own line.",
      "hint": "range(1, 6) produces 1, 2, 3, 4, 5.",
      "keyPoints": [
        "Use a for loop with range to iterate over the numbers",
        "range(1, 6) produces numbers from 1 up to but not including 6",
        "Print each number on its own line inside the loop body"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "A ____ loop repeats a block of code for each item in a sequence.",
        "options": [
          "for",
          "if",
          "def",
          "class"
        ],
        "answer": "for",
        "hint": "for loops repeat a block once per item in a sequence automatically."
      },
      "code": {
        "text": "for i in range(5):\n    ____(i)",
        "options": [
          "print",
          "input",
          "return",
          "class"
        ],
        "answer": "print",
        "hint": "print(i) is what actually displays each value the loop produces."
      }
    }
  },
  {
    "conceptSlug": "functions",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "Before every match, every player follows the same warm-up routine.",
            "prompt": "How would you avoid writing out the same warm-up steps every time a player needs to warm up?",
            "image": "/scenario-art/images/Sports/7_1.png"
          },
          {
            "scenario": "The coach changes one stretch in the warm-up, and everyone follows the updated routine.",
            "prompt": "If the warm-up lived in one shared routine, how many places would need to change when the coach updates a stretch?",
            "image": "/scenario-art/images/Sports/7_2.png"
          },
          {
            "scenario": "Players from different teams all perform the same warm-up before their matches.",
            "prompt": "How would the same warm-up routine be reused across different teams?",
            "image": "/scenario-art/images/Sports/7_3.png"
          }
        ],
        "example": {
          "code": "def win_percentage(wins, losses):\n    total = wins + losses\n    return round((wins / total) * 100, 1)\n\nprint(\"Team A win rate:\", win_percentage(18, 6), \"%\")\nprint(\"Team B win rate:\", win_percentage(10, 12), \"%\")",
          "explanation": "The calculation is written once inside the function, then reused for as many teams as you need — no duplicated logic.",
          "syntaxBreakdown": [
          {
            "code": "def win_percentage(wins, losses):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "win_percentage is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "wins is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "losses is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "total = wins + losses",
            "points": [
              "total is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "wins refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "losses refers back to the value already stored under that name."
            ]
          },
          {
            "code": "return round((wins / total) * 100, 1)",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "round(...) calls the round function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening parenthesis groups together what comes next.",
              "wins refers back to the value already stored under that name.",
              "/ divides the left side by the right side.",
              "total refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "* multiplies the two sides together.",
              "100 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "1 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Team A win rate:\", win_percentage(18, 6), \"%\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Team A win rate: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "win_percentage(...) calls the win_percentage function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "18 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "6 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "% is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Team B win rate:\", win_percentage(10, 12), \"%\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Team B win rate: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "win_percentage(...) calls the win_percentage function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "10 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "12 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "% is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach keeps having to do the exact same multi-step routine over and over in the team's training facility, just with small details changing each time.",
          "question": "What should the new coach do instead of repeating all those steps by hand every time?",
          "optionA": "Keep manually redoing every step from scratch each time, changing the details as they go",
          "optionB": "Turn it into one reusable routine that can be triggered anytime, adjusting just the details that change",
          "correctOption": "B",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "Every morning you: Brush, Wash face, Pack bag.",
            "prompt": "Every morning you: Brush, Wash face, Pack bag. What do you notice?",
            "image": "/scenario-art/images/Daily/6_1.jpg"
          },
          {
            "scenario": "The next day arrives.",
            "prompt": "Do you need to redesign the routine?",
            "image": "/scenario-art/images/Daily/6_2.jpg"
          },
          {
            "scenario": "You continue following the same routine every morning.",
            "prompt": "Would it help if the entire routine had a name?",
            "image": "/scenario-art/images/Daily/6_3.jpg"
          }
        ],
        "example": {
          "code": "def total_with_tax(price, tax_rate=0.08):\n    return round(price * (1 + tax_rate), 2)\n\nprint(\"Groceries total:\", total_with_tax(45))\nprint(\"Electronics total:\", total_with_tax(200, 0.1))",
          "explanation": "tax_rate has a default, but you can override it per call — one function, reused for every purchase with different rates.",
          "syntaxBreakdown": [
          {
            "code": "def total_with_tax(price, tax_rate=0.08):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "total_with_tax is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "price is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "tax_rate is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "0.08 is a number, used here as a literal value.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return round(price * (1 + tax_rate), 2)",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "round(...) calls the round function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "price refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "The opening parenthesis groups together what comes next.",
              "1 is a number, used here as a literal value.",
              "+ adds the two sides together (or joins them, if they're text).",
              "tax_rate refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The comma separates this from the next item in the list.",
              "2 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Groceries total:\", total_with_tax(45))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Groceries total: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "total_with_tax(...) calls the total_with_tax function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "45 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Electronics total:\", total_with_tax(200, 0.1))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Electronics total: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "total_with_tax(...) calls the total_with_tax function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "200 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "0.1 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate keeps having to do the exact same multi-step routine over and over in your shared apartment, just with small details changing each time.",
          "question": "What should your roommate do instead of repeating all those steps by hand every time?",
          "optionA": "Keep manually redoing every step from scratch each time, changing the details as they go",
          "optionB": "Turn it into one reusable routine that can be triggered anytime, adjusting just the details that change",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Aristotle argued that excellence is built through habits rather than isolated actions. A reliable process becomes valuable because it can be repeated whenever the same task needs to be performed.",
        "scenarios": [
          {
            "scenario": "A carpenter follows the same sequence of steps each time a chair is built.",
            "prompt": "Why not invent a completely new process every single time?",
            "image": ""
          },
          {
            "scenario": "One chair is slightly larger than another, yet the overall method remains the same.",
            "prompt": "Should a small change require rebuilding the entire process?",
            "image": ""
          },
          {
            "scenario": "Years later, apprentices continue using the same method.",
            "prompt": "Why has the process remained useful over generations?",
            "image": ""
          }
        ],
        "example": {
          "code": "def is_valid_argument(premises_support_conclusion):\n    return premises_support_conclusion\n\nprint(\"Argument 1 valid?\", is_valid_argument(True))\nprint(\"Argument 2 valid?\", is_valid_argument(False))",
          "explanation": "If the definition of validity ever changes, you'd only update it in one place — inside the function — and every call benefits.",
          "syntaxBreakdown": [
          {
            "code": "def total_with_tax(price, tax_rate=0.08):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "total_with_tax is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "price is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "tax_rate is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "0.08 is a number, used here as a literal value.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return round(price * (1 + tax_rate), 2)",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "round(...) calls the round function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "price refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "The opening parenthesis groups together what comes next.",
              "1 is a number, used here as a literal value.",
              "+ adds the two sides together (or joins them, if they're text).",
              "tax_rate refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The comma separates this from the next item in the list.",
              "2 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Groceries total:\", total_with_tax(45))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Groceries total: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "total_with_tax(...) calls the total_with_tax function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "45 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Electronics total:\", total_with_tax(200, 0.1))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Electronics total: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "total_with_tax(...) calls the total_with_tax function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "200 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "0.1 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor keeps having to do the exact same multi-step routine over and over in the seminar room, just with small details changing each time.",
          "question": "What should the philosophy professor do instead of repeating all those steps by hand every time?",
          "optionA": "Turn it into one reusable routine that can be triggered anytime, adjusting just the details that change",
          "optionB": "Keep manually redoing every step from scratch each time, changing the details as they go",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "The Family Chai Recipe",
        "scenarios": [
          {
            "scenario": "Every evening, your father makes tea using the same family recipe.",
            "prompt": "Why doesn't he invent a new method every evening?",
            "image": "/scenario-art/images/Food/6_1.jpeg",
            "reasoningKeyPoints": [
              "The same steps already work",
              "Following the recipe saves effort",
              "The process can be reused"
            ]
          },
          {
            "scenario": "Today, Grandma wants less sugar while your brother wants extra ginger. The basic recipe remains the same.",
            "prompt": "How can the tea taste different without changing the whole recipe?",
            "image": "/scenario-art/images/Food/6_2.jpeg",
            "reasoningKeyPoints": [
              "Only small details change",
              "The main process stays the same",
              "The recipe can be reused with variations"
            ]
          },
          {
            "scenario": "The next day, guests visit, and your father again follows the same tea-making process.",
            "prompt": "Why is it useful to have one trusted recipe?",
            "image": "/scenario-art/images/Food/6_3.jpeg",
            "reasoningKeyPoints": [
              "It can be used again and again",
              "Everyone follows the same method",
              "Only the preferences change"
            ]
          }
        ],
        "example": {
          "code": "def total_with_tax(price, tax_rate=0.07):\n    return round(price * (1 + tax_rate), 2)\n\nprint(\"Pizza order total:\", total_with_tax(24))\nprint(\"Catering order total:\", total_with_tax(180, 0.09))",
          "explanation": "Same function, different prices and rates each time — that's the point of writing reusable logic once.",
          "syntaxBreakdown": [
          {
            "code": "def total_with_tax(price, tax_rate=0.08):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "total_with_tax is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "price is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "tax_rate is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "0.08 is a number, used here as a literal value.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return round(price * (1 + tax_rate), 2)",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "round(...) calls the round function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "price refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "The opening parenthesis groups together what comes next.",
              "1 is a number, used here as a literal value.",
              "+ adds the two sides together (or joins them, if they're text).",
              "tax_rate refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The comma separates this from the next item in the list.",
              "2 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Groceries total:\", total_with_tax(45))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Groceries total: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "total_with_tax(...) calls the total_with_tax function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "45 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Electronics total:\", total_with_tax(200, 0.1))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Electronics total: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "total_with_tax(...) calls the total_with_tax function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "200 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "0.1 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef keeps having to do the exact same multi-step routine over and over in the restaurant kitchen, just with small details changing each time.",
          "question": "What should the head chef do instead of repeating all those steps by hand every time?",
          "optionA": "Turn it into one reusable routine that can be triggered anytime, adjusting just the details that change",
          "optionB": "Keep manually redoing every step from scratch each time, changing the details as they go",
          "correctOption": "A",
          "image": ""
        }
      },
            "environmental": {
        "background": "Most spiders build their webs by following nearly the same sequence of actions every time. Even after a web is destroyed, the spider rebuilds it using the same reliable process. Reliable processes can be used repeatedly without being reinvented every time.",
        "scenarios": [
          {
            "scenario": "A spider begins constructing a web.",
            "prompt": "Why does it follow a consistent sequence instead of building randomly?",
            "image": ""
          },
          {
            "scenario": "Wind destroys the web overnight.",
            "prompt": "Does the spider need to invent a completely new building method?",
            "image": ""
          },
          {
            "scenario": "Researchers observe the same species rebuilding similar webs many times.",
            "prompt": "Why is repeating the same process beneficial?",
            "image": ""
          }
        ],
        "example": {
          "code": "def is_valid_argument(premises_support_conclusion):\n    return premises_support_conclusion\n\nprint(\"Argument 1 valid?\", is_valid_argument(True))\nprint(\"Argument 2 valid?\", is_valid_argument(False))",
          "explanation": "Programming organizes reusable processes using functions.",
          "syntaxBreakdown": [
          {
            "code": "def total_with_tax(price, tax_rate=0.08):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "total_with_tax is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "price is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "tax_rate is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "0.08 is a number, used here as a literal value.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return round(price * (1 + tax_rate), 2)",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "round(...) calls the round function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "price refers back to the value already stored under that name.",
              "* multiplies the two sides together.",
              "The opening parenthesis groups together what comes next.",
              "1 is a number, used here as a literal value.",
              "+ adds the two sides together (or joins them, if they're text).",
              "tax_rate refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The comma separates this from the next item in the list.",
              "2 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Groceries total:\", total_with_tax(45))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Groceries total: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "total_with_tax(...) calls the total_with_tax function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "45 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Electronics total:\", total_with_tax(200, 0.1))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Electronics total: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "total_with_tax(...) calls the total_with_tax function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "200 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "0.1 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A bee flies from flower to flower in a garden, collecting nectar from each new flower it visits.",
          "question": "What lets the bee collect nectar quickly from every new flower?",
          "optionA": "Using that same nectar-collecting action on every flower it visits",
          "optionB": "Inventing a brand-new way of collecting nectar for every single flower",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A function packages reusable logic behind a name, taking inputs and returning outputs.",
    "conceptIntro": "A Python function is defined with `def name(parameters):` and can `return` a value. Once defined, you can call it as many times as you like with different arguments, instead of duplicating the logic inline.",
    "reinforcement": {
      "prompt": "Write a function called square_area(side) that returns the area of a square given its side length, then call it with side=6.",
      "hint": "Area of a square is side multiplied by itself.",
      "keyPoints": [
        "Define a function using def with a parameter named side",
        "Return the value of side multiplied by side",
        "Call the function with an argument and use or print the result"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "The ____ keyword sends a value back out of a function.",
        "options": [
          "return",
          "print",
          "import",
          "class"
        ],
        "answer": "return",
        "hint": "return is what sends a value back out of a function so it can be used elsewhere."
      },
      "code": {
        "text": "____ greet(name):\n    return \"Hi \" + name",
        "options": [
          "def",
          "class",
          "for",
          "if"
        ],
        "answer": "def",
        "hint": "def is the keyword that starts a function definition."
      }
    }
  },
  {
    "conceptSlug": "lists",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A coach writes down the batting order before the match.",
            "prompt": "How would you keep track of an ordered group of players arranged in a specific order?",
            "image": "/scenario-art/images/Sports/8_1.png"
          },
          {
            "scenario": "One injured player is replaced by a substitute before the game starts.",
            "prompt": "What would let you remove one player from the order and add another in their place?",
            "image": "/scenario-art/images/Sports/8_2.png"
          },
          {
            "scenario": "The coach counts how many players are currently in the squad.",
            "prompt": "How would you find out how many players are currently in the squad?",
            "image": "/scenario-art/images/Sports/8_3.png"
          }
        ],
        "example": {
          "code": "lineup = [\"Sharma\", \"Kohli\", \"Rahul\", \"Pant\"]\nprint(\"Starting lineup:\", lineup)\n\nlineup.remove(\"Rahul\")  # injured\nlineup.append(\"Iyer\")   # substitute\nprint(\"Updated lineup:\", lineup)\nprint(\"Total players:\", len(lineup))",
          "explanation": "Lists stay ordered but are fully editable — remove() and append() let the lineup change right up to match time.",
          "syntaxBreakdown": [
          {
            "code": "lineup = [\"Sharma\", \"Kohli\", \"Rahul\", \"Pant\"]",
            "points": [
              "lineup is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening square bracket starts a list \u2014 an ordered collection of items.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sharma is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Kohli is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Rahul is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pant is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Starting lineup:\", lineup)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Starting lineup: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lineup refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "lineup.remove(\"Rahul\")  # injured",
            "points": [
              "lineup refers back to the value already stored under that name.",
              ".remove(...) calls the remove method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Rahul is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"injured\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "lineup.append(\"Iyer\")   # substitute",
            "points": [
              "lineup refers back to the value already stored under that name.",
              ".append(...) calls the append method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Iyer is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"substitute\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated lineup:\", lineup)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated lineup: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lineup refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Total players:\", len(lineup))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Total players: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "len(...) calls the len function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "lineup refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach has a growing number of related items in the team's training facility that need to stay together and be looked up by their order.",
          "question": "How should the new coach keep track of them?",
          "optionA": "Keep each item as a totally separate, disconnected note with no shared order between them",
          "optionB": "Keep them together in one ordered collection so any one of them can be found by its position",
          "correctOption": "B",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "Your mother asks you to buy: Milk, Bread, Eggs, Sugar.",
            "prompt": "Your mother asks you to buy several items. How would you keep track?",
            "image": "/scenario-art/images/Daily/7_1.jpg"
          },
          {
            "scenario": "You are at the store buying the items.",
            "prompt": "At the store, how do you know what is left to buy?",
            "image": "/scenario-art/images/Daily/7_2.jpg"
          },
          {
            "scenario": "You return home after shopping.",
            "prompt": "How do you confirm everything is purchased?",
            "image": "/scenario-art/images/Daily/7_3.jpg"
          }
        ],
        "example": {
          "code": "groceries = [\"Milk\", \"Eggs\", \"Bread\"]\nprint(\"Shopping list:\", groceries)\n\ngroceries.append(\"Coffee\")\ngroceries.remove(\"Bread\")  # already had some at home\nprint(\"Updated list:\", groceries)\nprint(\"Items to buy:\", len(groceries))",
          "explanation": "append() adds to the end, remove() takes an item out by name, and len() tells you how many items are left.",
          "syntaxBreakdown": [
          {
            "code": "groceries = [\"Milk\", \"Eggs\", \"Bread\"]",
            "points": [
              "groceries is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening square bracket starts a list — an ordered collection of items.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Milk is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Eggs is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bread is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Shopping list:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Shopping list: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "groceries.append(\"Coffee\")",
            "points": [
              "groceries refers back to the value already stored under that name.",
              ".append(...) calls the append method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Coffee is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "groceries.remove(\"Bread\")  # already had some at home",
            "points": [
              "groceries refers back to the value already stored under that name.",
              ".remove(...) calls the remove method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bread is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The # starts a comment — everything after it on this line (\"already had some at home\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated list:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated list: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Items to buy:\", len(groceries))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Items to buy: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "len(...) calls the len function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate has a growing number of related items in your shared apartment that need to stay together and be looked up by their order.",
          "question": "How should your roommate keep track of them?",
          "optionA": "Keep each item as a totally separate, disconnected note with no shared order between them",
          "optionB": "Keep them together in one ordered collection so any one of them can be found by its position",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "In the 18th century, Carl Linnaeus introduced a systematic way to organize living organisms into collections. His classification system allowed scientists to manage and expand knowledge in an organized manner.",
        "scenarios": [
          {
            "scenario": "A botanist records hundreds of plant species in one organized collection.",
            "prompt": "Why keep all the observations together instead of writing them in separate places?",
            "image": ""
          },
          {
            "scenario": "Several new species are discovered the following year.",
            "prompt": "How should these new discoveries be added to the existing collection?",
            "image": ""
          },
          {
            "scenario": "Scientists later discover that one plant was placed in the wrong category.",
            "prompt": "Should the collection stay unchanged, or should it be updated?",
            "image": ""
          }
        ],
        "example": {
          "code": "premises = [\"All humans are mortal\", \"Socrates is a human\"]\nprint(\"Argument so far:\", premises)\n\npremises.append(\"Therefore, Socrates is mortal\")\nprint(\"Full argument:\", premises)\nprint(\"Number of steps:\", len(premises))",
          "explanation": "The order of a list matters here — each new premise is added onto the end, building the argument step by step.",
          "syntaxBreakdown": [
          {
            "code": "groceries = [\"Milk\", \"Eggs\", \"Bread\"]",
            "points": [
              "groceries is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening square bracket starts a list \u2014 an ordered collection of items.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Milk is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Eggs is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bread is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Shopping list:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Shopping list: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "groceries.append(\"Coffee\")",
            "points": [
              "groceries refers back to the value already stored under that name.",
              ".append(...) calls the append method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Coffee is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "groceries.remove(\"Bread\")  # already had some at home",
            "points": [
              "groceries refers back to the value already stored under that name.",
              ".remove(...) calls the remove method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bread is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"already had some at home\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated list:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated list: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Items to buy:\", len(groceries))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Items to buy: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "len(...) calls the len function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor has a growing number of related items in the seminar room that need to stay together and be looked up by their order.",
          "question": "How should the philosophy professor keep track of them?",
          "optionA": "Keep them together in one ordered collection so any one of them can be found by its position",
          "optionB": "Keep each item as a totally separate, disconnected note with no shared order between them",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Preparing for Biryani",
        "scenarios": [
          {
            "scenario": "Your mother begins collecting all the ingredients needed for biryani onto the kitchen counter.",
            "prompt": "Why is it helpful to gather everything together first?",
            "image": "/scenario-art/images/Food/7_1.jpeg",
            "reasoningKeyPoints": [
              "Everything stays in one place",
              "Nothing gets forgotten",
              "It's easier to manage"
            ]
          },
          {
            "scenario": "She realizes mint leaves are missing and quickly adds them to the ingredients.",
            "prompt": "What happens to the collection of ingredients now?",
            "image": "/scenario-art/images/Food/7_2.jpeg",
            "reasoningKeyPoints": [
              "New items can be added",
              "The collection changes",
              "Everything still stays together"
            ]
          },
          {
            "scenario": "Later she notices an extra packet of food colour that won't be used and removes it.",
            "prompt": "How should the ingredient collection change now?",
            "image": "/scenario-art/images/Food/7_3.jpeg",
            "reasoningKeyPoints": [
              "Items can also be removed",
              "The collection updates",
              "Only useful items remain"
            ]
          }
        ],
        "example": {
          "code": "tasting_menu = [\"Soup\", \"Salad\", \"Steak\"]\nprint(\"Tonight's menu:\", tasting_menu)\n\ntasting_menu.remove(\"Steak\")  # ran out\ntasting_menu.append(\"Salmon\")\nprint(\"Updated menu:\", tasting_menu)\nprint(\"Total courses:\", len(tasting_menu))",
          "explanation": "The menu list can be edited right up until service — remove what's unavailable, append the substitute.",
          "syntaxBreakdown": [
          {
            "code": "groceries = [\"Milk\", \"Eggs\", \"Bread\"]",
            "points": [
              "groceries is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening square bracket starts a list \u2014 an ordered collection of items.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Milk is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Eggs is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bread is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Shopping list:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Shopping list: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "groceries.append(\"Coffee\")",
            "points": [
              "groceries refers back to the value already stored under that name.",
              ".append(...) calls the append method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Coffee is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "groceries.remove(\"Bread\")  # already had some at home",
            "points": [
              "groceries refers back to the value already stored under that name.",
              ".remove(...) calls the remove method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bread is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"already had some at home\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated list:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated list: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Items to buy:\", len(groceries))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Items to buy: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "len(...) calls the len function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef has a growing number of related items in the restaurant kitchen that need to stay together and be looked up by their order.",
          "question": "How should the head chef keep track of them?",
          "optionA": "Keep each item as a totally separate, disconnected note with no shared order between them",
          "optionB": "Keep them together in one ordered collection so any one of them can be found by its position",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "Forest ecologists conduct biodiversity surveys to record every plant and animal species found within a study area. Keeping observations organized is essential for monitoring changes over time. Scientific collections remain useful because they can grow, change, and be organized while keeping related information together.",
        "scenarios": [
          {
            "scenario": "Researchers begin recording every species found during the survey.",
            "prompt": "Why keep all observations together instead of scattered across separate notebooks?",
            "image": ""
          },
          {
            "scenario": "Several new species are discovered later in the day.",
            "prompt": "How should these discoveries be added to the existing records?",
            "image": ""
          },
          {
            "scenario": "One observation is later found to be incorrect.",
            "prompt": "Should the record remain unchanged, or be updated?",
            "image": ""
          }
        ],
        "example": {
          "code": "premises = [\"All humans are mortal\", \"Socrates is a human\"]\nprint(\"Argument so far:\", premises)\n\npremises.append(\"Therefore, Socrates is mortal\")\nprint(\"Full argument:\", premises)\nprint(\"Number of steps:\", len(premises))",
          "explanation": "Programming also stores multiple related items together using lists.",
          "syntaxBreakdown": [
          {
            "code": "groceries = [\"Milk\", \"Eggs\", \"Bread\"]",
            "points": [
              "groceries is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening square bracket starts a list — an ordered collection of items.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Milk is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Eggs is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bread is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Shopping list:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Shopping list: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "groceries.append(\"Coffee\")",
            "points": [
              "groceries refers back to the value already stored under that name.",
              ".append(...) calls the append method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Coffee is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "groceries.remove(\"Bread\")  # already had some at home",
            "points": [
              "groceries refers back to the value already stored under that name.",
              ".remove(...) calls the remove method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Bread is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The # starts a comment — everything after it on this line (\"already had some at home\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated list:\", groceries)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated list: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Items to buy:\", len(groceries))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Items to buy: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "len(...) calls the len function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "groceries refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A squirrel gathers acorns one at a time all through autumn and keeps them together in the same burrow.",
          "question": "How should the squirrel keep track of all the acorns it has gathered so far?",
          "optionA": "Keep them together in one place, in the order it found them",
          "optionB": "Forget about the earlier acorns every time it finds a new one",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A list is an ordered, mutable collection — perfect for things that grow and shrink.",
    "conceptIntro": "A Python list, written with square brackets `[]`, stores an ordered sequence of items that can be changed after creation — you can add, remove, or update items whenever you like.",
    "reinforcement": {
      "prompt": "Create a list of three fruits, append a fourth fruit to it, then print the list and its length using len().",
      "hint": "Use append() to add, and len() to count items.",
      "keyPoints": [
        "Create a list containing three fruit names",
        "Use append to add a fourth fruit to the list",
        "Use len() to print the number of items in the list"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "The ____ method adds a new item to the end of a list.",
        "options": [
          "append",
          "insert",
          "pop",
          "remove"
        ],
        "answer": "append",
        "hint": "append() is the method that adds one new item onto the end of an existing list."
      },
      "code": {
        "text": "fruits = [\"apple\", \"banana\"]\nfruits.____(\"cherry\")",
        "options": [
          "append",
          "add",
          "push",
          "insert"
        ],
        "answer": "append",
        "hint": "fruits.append(\"cherry\") adds \"cherry\" onto the end of the list."
      }
    }
  },
  {
    "conceptSlug": "tuples",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "Every stadium seat is identified by its row and seat number.",
            "prompt": "How would you group a row and seat number together as one fixed pair?",
            "image": "/scenario-art/images/Sports/9_1.jpg"
          },
          {
            "scenario": "An usher reads the row and seat number separately while helping a fan find their seat.",
            "prompt": "How would you split that fixed pair back into two separate values?",
            "image": "/scenario-art/images/Sports/9_2.jpg"
          },
          {
            "scenario": "A referee records each important event as a pair of minute and decision.",
            "prompt": "Why would an unchangeable pairing be a better fit here than one that can be edited afterward?",
            "image": "/scenario-art/images/Sports/9_3.jpg"
          }
        ],
        "example": {
          "code": "seat = (14, \"C\")  # (row, column) - fixed once assigned\nrow, column = seat\nprint(\"Seat is in row\", row, \"column\", column)\n\n# seat[0] = 20  # this would raise an error - tuples can't be changed",
          "explanation": "Unpacking a tuple pulls both values out into their own names — and because tuples are immutable, that seat assignment can't be accidentally edited.",
          "syntaxBreakdown": [
          {
            "code": "seat = (14, \"C\")  # (row, column) - fixed once assigned",
            "points": [
              "seat is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening parenthesis groups together what comes next.",
              "14 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "C is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"(row, column) - fixed once assigned\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "row, column = seat",
            "points": [
              "row is a variable name \u2014 a label we're about to store a value under.",
              "The comma separates this from the next item in the list.",
              "column is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "seat refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Seat is in row\", row, \"column\", column)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Seat is in row is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "row refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "column is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "column refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "# seat[0] = 20  # this would raise an error - tuples can't be changed",
            "points": [
              "This whole line is a comment (starts with #) \u2014 Python ignores it completely; it's just a note for humans reading the code (\"seat[0] = 20  # this would raise an error - tuples can't be changed\")."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach has a small fixed set of details in the team's training facility that should never be edited once they're set.",
          "question": "How should the new coach treat that fixed set of details?",
          "optionA": "Lock them in as a fixed set that nothing is allowed to edit afterward",
          "optionB": "Keep them in a flexible format that anyone could edit whenever they felt like it",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "Your date of birth is recorded on official documents.",
            "prompt": "Your date of birth is recorded on official documents. Can it change every day?",
            "image": "/scenario-art/images/Daily/8_1.jpg"
          },
          {
            "scenario": "The same information continues to be used on your official documents.",
            "prompt": "Why should this information remain unchanged?",
            "image": "/scenario-art/images/Daily/8_2.jpg"
          },
          {
            "scenario": "Imagine the date of birth changed frequently.",
            "prompt": "What could happen if it changed frequently?",
            "image": "/scenario-art/images/Daily/8_3.jpg"
          }
        ],
        "example": {
          "code": "location = (28.6139, 77.2090)  # (latitude, longitude)\nlat, lon = location\nprint(\"Saved location — lat:\", lat, \"lon:\", lon)",
          "explanation": "A tuple groups the two coordinates as one fixed unit, and unpacking hands them back out whenever you need to plot the location.",
          "syntaxBreakdown": [
          {
            "code": "location = (28.6139, 77.2090)  # (latitude, longitude)",
            "points": [
              "location is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening parenthesis groups together what comes next.",
              "28.6139 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "77.2090 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The # starts a comment — everything after it on this line (\"(latitude, longitude)\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "lat, lon = location",
            "points": [
              "lat is a variable name — a label we're about to store a value under.",
              "The comma separates this from the next item in the list.",
              "lon is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "location refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Saved location — lat:\", lat, \"lon:\", lon)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Saved location — lat: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lat refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "lon: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lon refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate has a small fixed set of details in your shared apartment that should never be edited once they're set.",
          "question": "How should your roommate treat that fixed set of details?",
          "optionA": "Lock them in as a fixed set that nothing is allowed to edit afterward",
          "optionB": "Keep them in a flexible format that anyone could edit whenever they felt like it",
          "correctOption": "A",
          "image": ""
        }
      },
      "philosophy": {
        "background": "More than 2,000 years ago, Euclid developed geometry using a small set of axioms\u2014fundamental statements accepted as permanently true. Every mathematical proof relied on these foundations remaining unchanged.",
        "scenarios": [
          {
            "scenario": "One axiom is referenced throughout hundreds of geometric proofs.",
            "prompt": "Why must this statement remain exactly the same each time it is used?",
            "image": ""
          },
          {
            "scenario": "A student proposes changing one of Euclid's original axioms.",
            "prompt": "How could changing one foundation affect everything built upon it?",
            "image": ""
          },
          {
            "scenario": "Even centuries later, mathematicians continue teaching the same foundational axioms.",
            "prompt": "Why is consistency so important for foundational knowledge?",
            "image": ""
          }
        ],
        "example": {
          "code": "syllogism = (\"All humans are mortal; Socrates is a human\", \"Socrates is mortal\")\npremise, conclusion = syllogism\nprint(\"Premise:\", premise)\nprint(\"Conclusion:\", conclusion)",
          "explanation": "The premise and conclusion are locked together as a fixed pair — exactly what you want for a syllogism that shouldn't be edited after the fact.",
          "syntaxBreakdown": [
          {
            "code": "location = (28.6139, 77.2090)  # (latitude, longitude)",
            "points": [
              "location is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening parenthesis groups together what comes next.",
              "28.6139 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "77.2090 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"(latitude, longitude)\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "lat, lon = location",
            "points": [
              "lat is a variable name \u2014 a label we're about to store a value under.",
              "The comma separates this from the next item in the list.",
              "lon is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "location refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Saved location \u2014 lat:\", lat, \"lon:\", lon)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Saved location \u2014 lat: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lat refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "lon: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lon refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor has a small fixed set of details in the seminar room that should never be edited once they're set.",
          "question": "How should the philosophy professor treat that fixed set of details?",
          "optionA": "Lock them in as a fixed set that nothing is allowed to edit afterward",
          "optionB": "Keep them in a flexible format that anyone could edit whenever they felt like it",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Grandma's Secret Pickle Recipe",
        "scenarios": [
          {
            "scenario": "Every summer, your grandmother takes out a handwritten recipe for her famous mango pickle. It has been used for years.",
            "prompt": "Why does she always use the same recipe instead of changing it?",
            "image": "/scenario-art/images/Food/8_1.jpeg",
            "reasoningKeyPoints": [
              "The recipe has been perfected",
              "It should stay unchanged",
              "Everyone trusts this version"
            ]
          },
          {
            "scenario": "Your cousin suggests adding chocolate powder to the pickle recipe just for fun.",
            "prompt": "Should your grandmother change the original recipe?",
            "image": "/scenario-art/images/Food/8_2.jpeg",
            "reasoningKeyPoints": [
              "Some things shouldn't be changed",
              "The original recipe should remain intact",
              "Consistency is important"
            ]
          },
          {
            "scenario": "The recipe is carefully folded and placed back into the recipe book for next year.",
            "prompt": "Why is it useful that the recipe stays exactly the same every time?",
            "image": "/scenario-art/images/Food/8_3.jpeg",
            "reasoningKeyPoints": [
              "The recipe remains reliable",
              "Everyone expects the same result",
              "No accidental changes happen"
            ]
          }
        ],
        "example": {
          "code": "menu_item = (\"Margherita Pizza\", 9.50)\nname, price = menu_item\nprint(name, \"costs $\", price)",
          "explanation": "A menu item's name and price are bundled as one immutable pair, then unpacked into separate variables when you need to display them.",
          "syntaxBreakdown": [
          {
            "code": "location = (28.6139, 77.2090)  # (latitude, longitude)",
            "points": [
              "location is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening parenthesis groups together what comes next.",
              "28.6139 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "77.2090 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"(latitude, longitude)\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "lat, lon = location",
            "points": [
              "lat is a variable name \u2014 a label we're about to store a value under.",
              "The comma separates this from the next item in the list.",
              "lon is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "location refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Saved location \u2014 lat:\", lat, \"lon:\", lon)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Saved location \u2014 lat: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lat refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "lon: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lon refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef has a small fixed set of details in the restaurant kitchen that should never be edited once they're set.",
          "question": "How should the head chef treat that fixed set of details?",
          "optionA": "Lock them in as a fixed set that nothing is allowed to edit afterward",
          "optionB": "Keep them in a flexible format that anyone could edit whenever they felt like it",
          "correctOption": "A",
          "image": ""
        }
      },
            "environmental": {
        "background": "Sea turtles often return to the same nesting beaches where they were born. Conservationists carefully record important details such as nesting location and hatch date because these historical records should never change. Some information represents permanent facts rather than changing observations. Preserving these facts ensures consistency and accuracy in scientific research.",
        "scenarios": [
          {
            "scenario": "A newly hatched sea turtle's nesting beach is officially recorded.",
            "prompt": "Should this birthplace ever be changed later?",
            "image": ""
          },
          {
            "scenario": "Years later, scientists continue using the same nesting record during conservation studies.",
            "prompt": "Why is it important that this information remains accurate?",
            "image": ""
          },
          {
            "scenario": "Researchers discover additional information about the turtle, but the original birthplace remains unchanged.",
            "prompt": "Why should some facts remain permanent even as new information is collected?",
            "image": ""
          }
        ],
        "example": {
          "code": "syllogism = (\"All humans are mortal; Socrates is a human\", \"Socrates is mortal\")\npremise, conclusion = syllogism\nprint(\"Premise:\", premise)\nprint(\"Conclusion:\", conclusion)",
          "explanation": "Programming also stores collections of information that should remain unchanged using tuples.",
          "syntaxBreakdown": [
          {
            "code": "location = (28.6139, 77.2090)  # (latitude, longitude)",
            "points": [
              "location is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening parenthesis groups together what comes next.",
              "28.6139 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "77.2090 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The # starts a comment — everything after it on this line (\"(latitude, longitude)\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "lat, lon = location",
            "points": [
              "lat is a variable name — a label we're about to store a value under.",
              "The comma separates this from the next item in the list.",
              "lon is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "location refers back to the value already stored under that name."
            ]
          },
          {
            "code": "print(\"Saved location — lat:\", lat, \"lon:\", lon)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Saved location — lat: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lat refers back to the value already stored under that name.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "lon: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "lon refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A tree's rings show the exact year it first sprouted, and that birth year never changes no matter how old the tree grows.",
          "question": "Should the tree's birth year ever be changed later on?",
          "optionA": "No, that fact stays fixed and permanent forever",
          "optionB": "Yes, it should be updated whenever it's convenient",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A tuple is like a list, but locked — it can't be modified once created.",
    "conceptIntro": "A tuple, written with parentheses `()`, is an ordered collection just like a list — except it's immutable, meaning once created its contents can't be changed. That makes tuples ideal for fixed groupings of values, like coordinates.",
    "reinforcement": {
      "prompt": "Create a tuple named rgb holding three numbers representing a color (e.g. 255, 0, 0), then unpack it into r, g, b and print them.",
      "hint": "You can unpack a tuple of three values into three variables in one line.",
      "keyPoints": [
        "Create a tuple with three numeric values for red, green, and blue",
        "Unpack the tuple into three separate variables",
        "Print the unpacked values"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "A ____ is an ordered collection that cannot be changed after it's created.",
        "options": [
          "tuple",
          "list",
          "dictionary",
          "set"
        ],
        "answer": "tuple",
        "hint": "A tuple is the collection type that's ordered but can't be changed once it's created."
      },
      "code": {
        "text": "point = (3, ____)\nprint(point[1])  # 4",
        "options": [
          "4",
          "3",
          "5",
          "0"
        ],
        "answer": "4",
        "hint": "point[1] refers to the second item in the tuple, which is 4."
      }
    }
  },
  {
    "conceptSlug": "dictionaries",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "Each player on a team has a jersey number, playing position, and years of experience.",
            "prompt": "How would you look up these details by a player's name instead of by their spot on a list?",
            "image": "/scenario-art/images/Sports/10_1.jpg"
          },
          {
            "scenario": "A player changes position during the season while keeping all other details the same.",
            "prompt": "How would you update just one detail on the roster without touching the others?",
            "image": "/scenario-art/images/Sports/10_2.jpg"
          },
          {
            "scenario": "Before a match, the coach checks whether a player's name appears on the team roster.",
            "prompt": "How would you check whether a specific player's name is on the roster before using their details?",
            "image": "/scenario-art/images/Sports/10_3.jpg"
          }
        ],
        "example": {
          "code": "player = {\"number\": 18, \"position\": \"Forward\", \"years_experience\": 6}\nprint(\"Jersey number:\", player[\"number\"])\n\nplayer[\"position\"] = \"Midfielder\"  # switched positions\nprint(\"Updated position:\", player[\"position\"])\n\nprint(\"Has 'number' key?\", \"number\" in player)",
          "explanation": "Each detail is looked up by name (a key), not by position — updating one key never disturbs the others.",
          "syntaxBreakdown": [
          {
            "code": "player = {\"number\": 18, \"position\": \"Forward\", \"years_experience\": 6}",
            "points": [
              "player is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "number is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "18 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "position is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Forward is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "years_experience is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "6 is a number, used here as a literal value.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Jersey number:\", player[\"number\"])",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Jersey number: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "player refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "number is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "player[\"position\"] = \"Midfielder\"  # switched positions",
            "points": [
              "player refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "position is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Midfielder is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The # starts a comment \u2014 everything after it on this line (\"switched positions\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated position:\", player[\"position\"])",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated position: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "player refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "position is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Has 'number' key?\", \"number\" in player)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Has 'number' key? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "number is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "player refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach needs to look up specific details in the team's training facility, but remembering which position each one is in is getting confusing.",
          "question": "What would make looking things up easier for the new coach?",
          "optionA": "Label each detail with a clear name and look it up by that name instead of its position",
          "optionB": "Keep memorizing which numbered position each detail happens to be in",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You want Ravi's phone number.",
            "prompt": "How do you find it?",
            "image": "/scenario-art/images/Daily/9_1.jpg"
          },
          {
            "scenario": "Later, you save Priya's number too.",
            "prompt": "What information is connected?",
            "image": "/scenario-art/images/Daily/9_2.jpg"
          },
          {
            "scenario": "Priya changes her phone number.",
            "prompt": "What should be updated?",
            "image": "/scenario-art/images/Daily/9_3.jpg"
          }
        ],
        "example": {
          "code": "recipe = {\"ingredients\": [\"Pasta\", \"Tomato\", \"Basil\"], \"cook_time\": 20, \"servings\": 4}\nprint(\"Cook time:\", recipe[\"cook_time\"], \"minutes\")\n\nrecipe[\"cook_time\"] = 25  # tested again, took longer\nprint(\"Updated cook time:\", recipe[\"cook_time\"])\n\nprint(\"Has 'servings' key?\", \"servings\" in recipe)",
          "explanation": "Dictionaries let you grab exactly the detail you want by key, and the in check confirms whether a key exists before you use it.",
          "syntaxBreakdown": [
          {
            "code": "recipe = {\"ingredients\": [\"Pasta\", \"Tomato\", \"Basil\"], \"cook_time\": 20, \"servings\": 4}",
            "points": [
              "recipe is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "ingredients is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "The opening square bracket starts a list — an ordered collection of items.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pasta is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Tomato is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Basil is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "20 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "servings is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "4 is a number, used here as a literal value.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Cook time:\", recipe[\"cook_time\"], \"minutes\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cook time: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "minutes is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "recipe[\"cook_time\"] = 25  # tested again, took longer",
            "points": [
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "25 is a number, used here as a literal value.",
              "The # starts a comment — everything after it on this line (\"tested again, took longer\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated cook time:\", recipe[\"cook_time\"])",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated cook time: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Has 'servings' key?\", \"servings\" in recipe)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Has 'servings' key? is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "servings is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection — either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "recipe refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate needs to look up specific details in your shared apartment, but remembering which position each one is in is getting confusing.",
          "question": "What would make looking things up easier for your roommate?",
          "optionA": "Keep memorizing which numbered position each detail happens to be in",
          "optionB": "Label each detail with a clear name and look it up by that name instead of its position",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Confucius proposed the principle of Rectification of Names, which states that society functions properly only when names accurately represent the people, roles, or responsibilities they refer to. Clear naming creates clarity and order.",
        "scenarios": [
          {
            "scenario": "In a community, a doctor, a teacher, and a judge each perform very different responsibilities.",
            "prompt": "Why is it important that each role has its own distinct name?",
            "image": ""
          },
          {
            "scenario": "Imagine the labels of a hospital and a fire station are accidentally swapped.",
            "prompt": "What confusion or problems could arise because of incorrect naming?",
            "image": ""
          },
          {
            "scenario": "A completely new profession is introduced into society.",
            "prompt": "Should it receive its own name, or share an existing one?",
            "image": ""
          }
        ],
        "example": {
          "code": "glossary = {\"empiricism\": \"Knowledge comes from sensory experience\", \"coined_by\": \"John Locke\"}\nprint(\"Definition:\", glossary[\"empiricism\"])\n\nglossary[\"empiricism\"] = \"Knowledge comes primarily from sensory experience\"  # refined\nprint(\"Updated definition:\", glossary[\"empiricism\"])\n\nprint(\"Has 'coined_by' key?\", \"coined_by\" in glossary)",
          "explanation": "You can refine one definition without touching anything else stored in the glossary — that's the point of keying by term.",
          "syntaxBreakdown": [
          {
            "code": "recipe = {\"ingredients\": [\"Pasta\", \"Tomato\", \"Basil\"], \"cook_time\": 20, \"servings\": 4}",
            "points": [
              "recipe is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "ingredients is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "The opening square bracket starts a list \u2014 an ordered collection of items.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pasta is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Tomato is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Basil is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "20 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "servings is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "4 is a number, used here as a literal value.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Cook time:\", recipe[\"cook_time\"], \"minutes\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cook time: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "minutes is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "recipe[\"cook_time\"] = 25  # tested again, took longer",
            "points": [
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "25 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"tested again, took longer\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated cook time:\", recipe[\"cook_time\"])",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated cook time: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Has 'servings' key?\", \"servings\" in recipe)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Has 'servings' key? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "servings is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "recipe refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor needs to look up specific details in the seminar room, but remembering which position each one is in is getting confusing.",
          "question": "What would make looking things up easier for the philosophy professor?",
          "optionA": "Keep memorizing which numbered position each detail happens to be in",
          "optionB": "Label each detail with a clear name and look it up by that name instead of its position",
          "correctOption": "B",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "The Spice Rack",
        "scenarios": [
          {
            "scenario": "Your mother has neatly arranged spice jars. Every jar has a label like Turmeric, Chilli Powder, Cumin, and Coriander.",
            "prompt": "How can she quickly find turmeric without opening every jar?",
            "image": "/scenario-art/images/Food/9_1.jpeg",
            "reasoningKeyPoints": [
              "Each jar has its own label",
              "The label points to the correct spice",
              "Finding becomes quick"
            ]
          },
          {
            "scenario": "While cooking, your father asks for cumin. Your mother immediately picks the correct jar.",
            "prompt": "How did she know exactly which jar to choose?",
            "image": "/scenario-art/images/Food/9_2.jpeg",
            "reasoningKeyPoints": [
              "She looked for the label",
              "Each label matches one spice",
              "The label helps identify it"
            ]
          },
          {
            "scenario": "A new spice jar arrives, and your mother writes its label before placing it on the rack.",
            "prompt": "Why is adding the label important?",
            "image": "/scenario-art/images/Food/9_3.jpeg",
            "reasoningKeyPoints": [
              "Every spice needs identification",
              "Labels prevent confusion",
              "New items fit into the same system"
            ]
          }
        ],
        "example": {
          "code": "dish = {\"price\": 14, \"prep_time\": 12, \"allergens\": [\"nuts\"]}\nprint(\"Price:\", dish[\"price\"])\n\ndish[\"price\"] = 16  # new season pricing\nprint(\"Updated price:\", dish[\"price\"])\n\nprint(\"Has 'allergens' key?\", \"allergens\" in dish)",
          "explanation": "Updating the price key leaves prep_time and allergens completely untouched — each key is independent.",
          "syntaxBreakdown": [
          {
            "code": "recipe = {\"ingredients\": [\"Pasta\", \"Tomato\", \"Basil\"], \"cook_time\": 20, \"servings\": 4}",
            "points": [
              "recipe is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "ingredients is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "The opening square bracket starts a list \u2014 an ordered collection of items.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pasta is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Tomato is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Basil is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "20 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "servings is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "4 is a number, used here as a literal value.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Cook time:\", recipe[\"cook_time\"], \"minutes\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cook time: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "minutes is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "recipe[\"cook_time\"] = 25  # tested again, took longer",
            "points": [
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "25 is a number, used here as a literal value.",
              "The # starts a comment \u2014 everything after it on this line (\"tested again, took longer\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated cook time:\", recipe[\"cook_time\"])",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated cook time: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Has 'servings' key?\", \"servings\" in recipe)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Has 'servings' key? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "servings is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "recipe refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef needs to look up specific details in the restaurant kitchen, but remembering which position each one is in is getting confusing.",
          "question": "What would make looking things up easier for the head chef?",
          "optionA": "Label each detail with a clear name and look it up by that name instead of its position",
          "optionB": "Keep memorizing which numbered position each detail happens to be in",
          "correctOption": "A",
          "image": ""
        }
      },
            "environmental": {
        "background": "Scientists organize the natural world using named categories, where each category label instantly connects to every specific member that belongs under it, making the whole system easy to search. Nature is organized around labeled categories, where each label instantly connects to everything that belongs under it, making the natural world easier to search and understand.",
        "scenarios": [
          {
            "scenario": "The category \"Trees\" groups together many specific kinds, such as oak, palm, and banana trees.",
            "prompt": "Why is it useful to look up the category \"Trees\" and instantly get every specific kind grouped under it?",
            "image": ""
          },
          {
            "scenario": "The category \"Animals\" is divided into groups such as insects, birds, and mammals, each holding many different species.",
            "prompt": "How does grouping animals under a category make it easier to find related species later?",
            "image": ""
          },
          {
            "scenario": "Even humans are organized under labels such as gender or race, with each label covering many individuals who share that trait.",
            "prompt": "Why is it helpful to attach one shared label to a group instead of describing every individual separately?",
            "image": ""
          }
        ],
        "example": {
          "code": "glossary = {\"empiricism\": \"Knowledge comes from sensory experience\", \"coined_by\": \"John Locke\"}\nprint(\"Definition:\", glossary[\"empiricism\"])\n\nglossary[\"empiricism\"] = \"Knowledge comes primarily from sensory experience\"  # refined\nprint(\"Updated definition:\", glossary[\"empiricism\"])\n\nprint(\"Has 'coined_by' key?\", \"coined_by\" in glossary)",
          "explanation": "Programming organizes information the same way using dictionaries, where each key instantly looks up the value or group of values connected to it.",
          "syntaxBreakdown": [
          {
            "code": "recipe = {\"ingredients\": [\"Pasta\", \"Tomato\", \"Basil\"], \"cook_time\": 20, \"servings\": 4}",
            "points": [
              "recipe is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "ingredients is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "The opening square bracket starts a list — an ordered collection of items.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Pasta is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Tomato is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Basil is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "20 is a number, used here as a literal value.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "servings is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The colon marks the end of this line's header and signals that an indented block follows right below.",
              "4 is a number, used here as a literal value.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Cook time:\", recipe[\"cook_time\"], \"minutes\")",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cook time: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "minutes is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "recipe[\"cook_time\"] = 25  # tested again, took longer",
            "points": [
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "25 is a number, used here as a literal value.",
              "The # starts a comment — everything after it on this line (\"tested again, took longer\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Updated cook time:\", recipe[\"cook_time\"])",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Updated cook time: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "recipe refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "cook_time is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing square bracket closes off the list or lookup that started with the matching [.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Has 'servings' key?\", \"servings\" in recipe)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Has 'servings' key? is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "servings is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection — either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "recipe refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A child sorts their toy animals into three labeled boxes: \"Birds\", \"Fish\", and \"Insects.\"",
          "question": "How does labeling each box help the child find a toy quickly later?",
          "optionA": "Look at a box's label to instantly know what kind of toy is inside",
          "optionB": "Search through every single box at random each time",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A dictionary maps keys to values, so you look things up by name, not position.",
    "conceptIntro": "A Python dictionary, written with curly braces `{}`, stores key-value pairs. Instead of accessing items by numeric position like a list, you access them by their key, which makes look-ups fast and expressive.",
    "reinforcement": {
      "prompt": "Create a dictionary named book with keys title, author, and year for a book of your choice, then print the author.",
      "hint": "Use curly braces and colon-separated key: value pairs.",
      "keyPoints": [
        "Create a dictionary with keys title, author, and year",
        "Assign values to each key",
        "Access and print the value stored under the author key"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "A dictionary stores data as ____ pairs.",
        "options": [
          "key-value",
          "index-value",
          "name-name",
          "item-item"
        ],
        "answer": "key-value",
        "hint": "Dictionaries store data as key-value pairs, not just a plain list of values."
      },
      "code": {
        "text": "person = {\"name\": \"Sam\"}\nprint(person.____(\"name\"))",
        "options": [
          "get",
          "append",
          "pop",
          "add"
        ],
        "answer": "get",
        "hint": "get() is the dictionary method used to look up a value by its key."
      }
    }
  },
  {
    "conceptSlug": "sets",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "Tournament organizers ensure that no team is registered more than once.",
            "prompt": "How would you automatically prevent the same team name from being registered more than once?",
            "image": "/scenario-art/images/Sports/11_1.jpg"
          },
          {
            "scenario": "A duplicate registration form is submitted for the same team.",
            "prompt": "What should happen when a team that's already registered gets submitted again?",
            "image": "/scenario-art/images/Sports/11_2.jpg"
          },
          {
            "scenario": "Two practice groups are compared to find players who belong to both.",
            "prompt": "How would you find only the players that appear in both groups?",
            "image": "/scenario-art/images/Sports/11_3.jpg"
          }
        ],
        "example": {
          "code": "registered_teams = {\"Falcons\", \"Tigers\"}\nregistered_teams.add(\"Falcons\")  # accidental duplicate submission\nprint(\"Registered teams:\", registered_teams)\n\noffense = {\"Sam\", \"Alex\", \"Jordan\"}\ndefense = {\"Jordan\", \"Riley\", \"Sam\"}\nprint(\"Players on both:\", offense & defense)",
          "explanation": "A set silently ignores the duplicate \"Falcons\" add, and & finds only the players who show up in both rosters.",
          "syntaxBreakdown": [
          {
            "code": "registered_teams = {\"Falcons\", \"Tigers\"}",
            "points": [
              "registered_teams is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Falcons is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Tigers is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "registered_teams.add(\"Falcons\")  # accidental duplicate submission",
            "points": [
              "registered_teams refers back to the value already stored under that name.",
              ".add(...) calls the add method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Falcons is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"accidental duplicate submission\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Registered teams:\", registered_teams)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Registered teams: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "registered_teams refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "offense = {\"Sam\", \"Alex\", \"Jordan\"}",
            "points": [
              "offense is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Jordan is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "defense = {\"Jordan\", \"Riley\", \"Sam\"}",
            "points": [
              "defense is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Jordan is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Riley is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Players on both:\", offense & defense)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Players on both: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "offense refers back to the value already stored under that name.",
              "& gives back only the items that appear in BOTH sets \u2014 the intersection.",
              "defense refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach has a list of names in the team's training facility where the same name accidentally got added more than once.",
          "question": "How should the new coach clean that up?",
          "optionA": "Keep only the unique names, automatically removing any duplicates",
          "optionB": "Leave every duplicate name in, just to be safe",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "Students register for a workshop, and some students accidentally register twice.",
            "prompt": "Students register for a workshop. Some students accidentally register twice. Should they get two seats?",
            "image": "/scenario-art/images/Daily/10_1.jpg"
          },
          {
            "scenario": "The registration list is being checked before the event begins.",
            "prompt": "If the same student's name appears multiple times in the registration list, how should the organizer treat those entries?",
            "image": "/scenario-art/images/Daily/10_2.jpg"
          },
          {
            "scenario": "The organizer prepares the final participant list.",
            "prompt": "What should the final participant list contain?",
            "image": "/scenario-art/images/Daily/10_3.jpg"
          }
        ],
        "example": {
          "code": "carpool_emails = {\"a@mail.com\", \"b@mail.com\"}\ncarpool_emails.add(\"a@mail.com\")  # duplicate sign-up\nprint(\"Registered emails:\", carpool_emails)\n\nsaturday_free = {\"Sam\", \"Priya\", \"Jordan\"}\nsunday_free = {\"Priya\", \"Alex\", \"Sam\"}\nprint(\"Free both days:\", saturday_free & sunday_free)",
          "explanation": "Sets automatically dedupe, and the & operator gives you exactly the people free on both days at once.",
          "syntaxBreakdown": [
          {
            "code": "carpool_emails = {\"a@mail.com\", \"b@mail.com\"}",
            "points": [
              "carpool_emails is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "a@mail.com is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "b@mail.com is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "carpool_emails.add(\"a@mail.com\")  # duplicate sign-up",
            "points": [
              "carpool_emails refers back to the value already stored under that name.",
              ".add(...) calls the add method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "a@mail.com is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The # starts a comment — everything after it on this line (\"duplicate sign-up\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Registered emails:\", carpool_emails)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Registered emails: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "carpool_emails refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "saturday_free = {\"Sam\", \"Priya\", \"Jordan\"}",
            "points": [
              "saturday_free is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Jordan is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "sunday_free = {\"Priya\", \"Alex\", \"Sam\"}",
            "points": [
              "sunday_free is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Free both days:\", saturday_free & sunday_free)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Free both days: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "saturday_free refers back to the value already stored under that name.",
              "& gives back only the items that appear in BOTH sets — the intersection.",
              "sunday_free refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate has a list of names in your shared apartment where the same name accidentally got added more than once.",
          "question": "How should your roommate clean that up?",
          "optionA": "Leave every duplicate name in, just to be safe",
          "optionB": "Keep only the unique names, automatically removing any duplicates",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "The philosopher William of Occam proposed a principle now known as Occam's Razor: when multiple explanations are equally effective, prefer the simplest one without unnecessary duplication or complexity.",
        "scenarios": [
          {
            "scenario": "Two reports contain exactly the same information, but one repeats several points multiple times.",
            "prompt": "Which report would be easier to understand, and why?",
            "image": ""
          },
          {
            "scenario": "A researcher combines observations from several sources and notices that many entries are repeated.",
            "prompt": "Should every repeated entry be kept, or only the unique ones?",
            "image": ""
          },
          {
            "scenario": "Two collections contain identical information except one contains duplicate entries.",
            "prompt": "Which collection communicates the information more clearly?",
            "image": ""
          }
        ],
        "example": {
          "code": "logged_arguments = {\"All swans are white\"}\nlogged_arguments.add(\"All swans are white\")  # duplicate submission\nprint(\"Logged arguments:\", logged_arguments)\n\nphilosopher_a_premises = {\"All men are mortal\", \"Socrates is a man\"}\nphilosopher_b_premises = {\"Socrates is a man\", \"Mortality is universal\"}\nprint(\"Shared premises:\", philosopher_a_premises & philosopher_b_premises)",
          "explanation": "The duplicate argument never actually gets added twice, and & reveals which premises two philosophers have in common.",
          "syntaxBreakdown": [
          {
            "code": "carpool_emails = {\"a@mail.com\", \"b@mail.com\"}",
            "points": [
              "carpool_emails is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "a@mail.com is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "b@mail.com is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "carpool_emails.add(\"a@mail.com\")  # duplicate sign-up",
            "points": [
              "carpool_emails refers back to the value already stored under that name.",
              ".add(...) calls the add method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "a@mail.com is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"duplicate sign-up\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Registered emails:\", carpool_emails)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Registered emails: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "carpool_emails refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "saturday_free = {\"Sam\", \"Priya\", \"Jordan\"}",
            "points": [
              "saturday_free is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Jordan is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "sunday_free = {\"Priya\", \"Alex\", \"Sam\"}",
            "points": [
              "sunday_free is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Free both days:\", saturday_free & sunday_free)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Free both days: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "saturday_free refers back to the value already stored under that name.",
              "& gives back only the items that appear in BOTH sets \u2014 the intersection.",
              "sunday_free refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor has a list of names in the seminar room where the same name accidentally got added more than once.",
          "question": "How should the philosophy professor clean that up?",
          "optionA": "Leave every duplicate name in, just to be safe",
          "optionB": "Keep only the unique names, automatically removing any duplicates",
          "correctOption": "B",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Shopping for Vegetables",
        "scenarios": [
          {
            "scenario": "Your mother and your father both return from the market with vegetables for dinner.",
            "prompt": "What should you do before putting everything into the kitchen?",
            "image": "/scenario-art/images/Food/10_1.jpeg",
            "reasoningKeyPoints": [
              "Check both collections",
              "See what's common",
              "Organize everything"
            ]
          },
          {
            "scenario": "You notice both of them bought tomatoes and onions.",
            "prompt": "Should you keep two separate piles of the same vegetable?",
            "image": "/scenario-art/images/Food/10_2.jpeg",
            "reasoningKeyPoints": [
              "Repeated items are unnecessary",
              "Keep only one of each kind",
              "Avoid duplicates"
            ]
          },
          {
            "scenario": "After organizing, every vegetable appears only once in the basket.",
            "prompt": "Why is this basket easier to manage?",
            "image": "/scenario-art/images/Food/10_3.jpeg",
            "reasoningKeyPoints": [
              "Everything is unique",
              "Nothing repeats",
              "The basket stays organized"
            ]
          }
        ],
        "example": {
          "code": "loyalty_emails = {\"a@mail.com\", \"b@mail.com\"}\nloyalty_emails.add(\"a@mail.com\")  # duplicate RSVP\nprint(\"Loyalty members:\", loyalty_emails)\n\nthis_menu = {\"nuts\", \"dairy\", \"gluten\"}\nwatch_list = {\"gluten\", \"shellfish\"}\nprint(\"Ingredients to flag:\", this_menu & watch_list)",
          "explanation": "Sets handle the duplicate email automatically, and & pinpoints exactly which allergens need a warning label.",
          "syntaxBreakdown": [
          {
            "code": "carpool_emails = {\"a@mail.com\", \"b@mail.com\"}",
            "points": [
              "carpool_emails is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "a@mail.com is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "b@mail.com is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "carpool_emails.add(\"a@mail.com\")  # duplicate sign-up",
            "points": [
              "carpool_emails refers back to the value already stored under that name.",
              ".add(...) calls the add method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "a@mail.com is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The # starts a comment \u2014 everything after it on this line (\"duplicate sign-up\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Registered emails:\", carpool_emails)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Registered emails: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "carpool_emails refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "saturday_free = {\"Sam\", \"Priya\", \"Jordan\"}",
            "points": [
              "saturday_free is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Jordan is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "sunday_free = {\"Priya\", \"Alex\", \"Sam\"}",
            "points": [
              "sunday_free is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Free both days:\", saturday_free & sunday_free)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Free both days: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "saturday_free refers back to the value already stored under that name.",
              "& gives back only the items that appear in BOTH sets \u2014 the intersection.",
              "sunday_free refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef has a list of names in the restaurant kitchen where the same name accidentally got added more than once.",
          "question": "How should the head chef clean that up?",
          "optionA": "Keep only the unique names, automatically removing any duplicates",
          "optionB": "Leave every duplicate name in, just to be safe",
          "correctOption": "A",
          "image": ""
        }
      },
            "environmental": {
        "background": "Every year, wildlife researchers conduct biodiversity surveys in national parks like Kaziranga. During the survey, the same animal may be spotted many times by different researchers. To estimate biodiversity accurately, scientists are interested in how many unique species were found, not how many times each was observed. In ecological surveys, duplicate observations are valuable for research but not for counting biodiversity. Scientists often need a collection containing only unique entries.",
        "scenarios": [
          {
            "scenario": "Three research teams independently report seeing Asian elephants throughout the day.",
            "prompt": "Should each sighting count as a different species, or should they all represent the same animal species?",
            "image": ""
          },
          {
            "scenario": "Researchers combine observations from all teams into one report.",
            "prompt": "How should repeated observations of the same species be treated?",
            "image": ""
          },
          {
            "scenario": "At the end of the survey, scientists prepare the final biodiversity list.",
            "prompt": "Should the report contain every observation, or only one entry for each species?",
            "image": ""
          }
        ],
        "example": {
          "code": "logged_arguments = {\"All swans are white\"}\nlogged_arguments.add(\"All swans are white\")  # duplicate submission\nprint(\"Logged arguments:\", logged_arguments)\n\nphilosopher_a_premises = {\"All men are mortal\", \"Socrates is a man\"}\nphilosopher_b_premises = {\"Socrates is a man\", \"Mortality is universal\"}\nprint(\"Shared premises:\", philosopher_a_premises & philosopher_b_premises)",
          "explanation": "Python provides sets, which automatically store only unique items while ignoring duplicates.",
          "syntaxBreakdown": [
          {
            "code": "carpool_emails = {\"a@mail.com\", \"b@mail.com\"}",
            "points": [
              "carpool_emails is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "a@mail.com is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "b@mail.com is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "carpool_emails.add(\"a@mail.com\")  # duplicate sign-up",
            "points": [
              "carpool_emails refers back to the value already stored under that name.",
              ".add(...) calls the add method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "a@mail.com is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The # starts a comment — everything after it on this line (\"duplicate sign-up\") is ignored by Python; it's just a note for humans."
            ]
          },
          {
            "code": "print(\"Registered emails:\", carpool_emails)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Registered emails: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "carpool_emails refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "saturday_free = {\"Sam\", \"Priya\", \"Jordan\"}",
            "points": [
              "saturday_free is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Jordan is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "sunday_free = {\"Priya\", \"Alex\", \"Sam\"}",
            "points": [
              "sunday_free is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening curly brace starts a dictionary (key-value pairs) or a set (a collection of unique items), depending on what's inside.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing curly brace closes off the { that opened this dictionary or set."
            ]
          },
          {
            "code": "print(\"Free both days:\", saturday_free & sunday_free)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Free both days: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "saturday_free refers back to the value already stored under that name.",
              "& gives back only the items that appear in BOTH sets — the intersection.",
              "sunday_free refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A child is collecting unique leaves for a school project and already has one leaf that looks exactly like a new one they just found.",
          "question": "What should the child do with the new leaf that looks exactly like one they already have?",
          "optionA": "Skip it, since they already have one exactly like it",
          "optionB": "Collect it anyway, even though it's an exact duplicate",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A set automatically keeps only unique values — duplicates just disappear.",
    "conceptIntro": "A Python set, written with curly braces `{}` or `set()`, stores unique values only — adding a value that's already present has no effect. Sets also support mathematical operations like union (`|`) and intersection (`&`).",
    "reinforcement": {
      "prompt": "Create two sets of numbers with some overlap, then print their intersection using &.",
      "hint": "The & operator returns only the elements present in both sets.",
      "keyPoints": [
        "Create two sets containing some overlapping numbers",
        "Use the & operator to compute the intersection",
        "Print the resulting intersection set"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "A ____ automatically removes duplicate values.",
        "options": [
          "set",
          "list",
          "tuple",
          "dictionary"
        ],
        "answer": "set",
        "hint": "A set automatically drops duplicate values, keeping only unique ones."
      },
      "code": {
        "text": "nums = {1, 2, 2, 3}\nprint(____(nums))  # 3",
        "options": [
          "len",
          "sum",
          "sorted",
          "list"
        ],
        "answer": "len",
        "hint": "len() counts how many unique items remain in the set."
      }
    }
  },
  {
    "conceptSlug": "string-handling",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A player's name is written with extra spaces and inconsistent capitalization on the registration form.",
            "prompt": "How would you clean up this written name so the spacing and capitalization look correct?",
            "image": "/scenario-art/images/Sports/12_1.jpg"
          },
          {
            "scenario": "Only the first three letters of each team's name are printed on the scoreboard.",
            "prompt": "How would you pick out just the first three letters of a team's name?",
            "image": "/scenario-art/images/Sports/12_2.jpg"
          },
          {
            "scenario": "The tournament organizer checks whether a team's name contains the word \"United.\"",
            "prompt": "How would you check whether a specific word appears somewhere inside a team's full name?",
            "image": "/scenario-art/images/Sports/12_3.jpg"
          }
        ],
        "example": {
          "code": "raw_name = \"  cristiano ronaldo  \"\nclean_name = raw_name.strip().title()\nprint(\"Cleaned name:\", clean_name)\n\nabbreviation = clean_name[:3]\nprint(\"Scoreboard abbreviation:\", abbreviation)\n\nteam_name = \"Manchester United\"\nprint(\"Has 'United'?\", \"United\" in team_name)",
          "explanation": "strip() removes stray spaces, title() fixes capitalization, slicing grabs the first few letters, and in checks for a substring.",
          "syntaxBreakdown": [
          {
            "code": "raw_name = \"  cristiano ronaldo  \"",
            "points": [
              "raw_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "  cristiano ronaldo   is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "clean_name = raw_name.strip().title()",
            "points": [
              "clean_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "raw_name refers back to the value already stored under that name.",
              ".strip(...) calls the strip method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              ".title(...) calls the title method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Cleaned name:\", clean_name)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cleaned name: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "clean_name refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "abbreviation = clean_name[:3]",
            "points": [
              "abbreviation is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "clean_name refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "The colon here is a slice separator \u2014 it marks off a range (start:stop) instead of grabbing a single item.",
              "3 is a number, used here as a literal value.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Scoreboard abbreviation:\", abbreviation)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Scoreboard abbreviation: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "abbreviation refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "team_name = \"Manchester United\"",
            "points": [
              "team_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Manchester United is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Has 'United'?\", \"United\" in team_name)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Has 'United'? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "United is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "team_name refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach has a block of text in the team's training facility and only needs a small transformed piece of it.",
          "question": "How should the new coach get just what they need from that text?",
          "optionA": "Use the right tool to transform or pull out exactly the part of the text that's needed",
          "optionB": "Retype the entire block of text by hand just to get the one small piece needed",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You type a birthday message before sending it.",
            "prompt": "You type a birthday message. Why do you read it before sending?",
            "image": "/scenario-art/images/Daily/11_1.jpg"
          },
          {
            "scenario": "While reading the message, you notice your friend's name is misspelled.",
            "prompt": "What would you do?",
            "image": "/scenario-art/images/Daily/11_2.jpg"
          },
          {
            "scenario": "Before sending the message, you decide to add 'Have a great day!' at the end.",
            "prompt": "What would you do?",
            "image": "/scenario-art/images/Daily/11_3.jpg"
          }
        ],
        "example": {
          "code": "raw_name = \"  sam patel  \"\nclean_name = raw_name.strip().title()\nprint(\"Cleaned name:\", clean_name)\n\ninitial = clean_name[0]\nprint(\"Avatar initial:\", initial)\n\nemail = \"sam.patel@mail.com\"\nprint(\"Looks like an email?\", \"@\" in email)",
          "explanation": "The same few string operations — strip, title, slice, and in — clean and inspect text no matter what it says.",
          "syntaxBreakdown": [
          {
            "code": "raw_name = \"  sam patel  \"",
            "points": [
              "raw_name is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "  sam patel   is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "clean_name = raw_name.strip().title()",
            "points": [
              "clean_name is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "raw_name refers back to the value already stored under that name.",
              ".strip(...) calls the strip method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              ".title(...) calls the title method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Cleaned name:\", clean_name)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cleaned name: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "clean_name refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "initial = clean_name[0]",
            "points": [
              "initial is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "clean_name refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "0 is a number, used here as a literal value.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Avatar initial:\", initial)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Avatar initial: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "initial refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "email = \"sam.patel@mail.com\"",
            "points": [
              "email is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "sam.patel@mail.com is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Looks like an email?\", \"@\" in email)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Looks like an email? is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "@ is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection — either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "email refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate has a block of text in your shared apartment and only needs a small transformed piece of it.",
          "question": "How should your roommate get just what they need from that text?",
          "optionA": "Retype the entire block of text by hand just to get the one small piece needed",
          "optionB": "Use the right tool to transform or pull out exactly the part of the text that's needed",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "The philosopher Ludwig Wittgenstein believed that language shapes understanding. Small changes in words, punctuation, or structure can completely change the meaning of a message.",
        "scenarios": [
          {
            "scenario": "Compare these two sentences: \"Let's eat, Grandma.\" and \"Let's eat Grandma.\"",
            "prompt": "How does a single punctuation mark change the meaning?",
            "image": ""
          },
          {
            "scenario": "A sentence contains unnecessary spaces and inconsistent capitalization.",
            "prompt": "Why might someone want to clean or reorganize the text before using it?",
            "image": ""
          },
          {
            "scenario": "A document contains the word \"Python\" written in many different forms such as \"python\", \"PYTHON\", and \"PyThOn\".",
            "prompt": "Why might treating all of these consistently be useful?",
            "image": ""
          }
        ],
        "example": {
          "code": "raw_quote = \"  i think, therefore i am  \"\nclean_quote = raw_quote.strip().capitalize()\nprint(\"Cleaned quote:\", clean_quote)\n\npreview = \" \".join(clean_quote.split()[:3])\nprint(\"Preview:\", preview)\n\nprint(\"Contains 'therefore'?\", \"therefore\" in clean_quote)",
          "explanation": "split() breaks the quote into words so you can preview just the first few, and in checks whether a specific word shows up anywhere in the text.",
          "syntaxBreakdown": [
          {
            "code": "raw_name = \"  sam patel  \"",
            "points": [
              "raw_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "  sam patel   is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "clean_name = raw_name.strip().title()",
            "points": [
              "clean_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "raw_name refers back to the value already stored under that name.",
              ".strip(...) calls the strip method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              ".title(...) calls the title method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Cleaned name:\", clean_name)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cleaned name: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "clean_name refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "initial = clean_name[0]",
            "points": [
              "initial is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "clean_name refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "0 is a number, used here as a literal value.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Avatar initial:\", initial)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Avatar initial: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "initial refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "email = \"sam.patel@mail.com\"",
            "points": [
              "email is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "sam.patel@mail.com is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Looks like an email?\", \"@\" in email)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Looks like an email? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "@ is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "email refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor has a block of text in the seminar room and only needs a small transformed piece of it.",
          "question": "How should the philosophy professor get just what they need from that text?",
          "optionA": "Retype the entire block of text by hand just to get the one small piece needed",
          "optionB": "Use the right tool to transform or pull out exactly the part of the text that's needed",
          "correctOption": "B",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Writing the Recipe Book",
        "scenarios": [
          {
            "scenario": "Your sister writes today's recipe in the family recipe notebook, but accidentally leaves many extra spaces between the words.",
            "prompt": "How could she make the recipe look neat?",
            "image": "/scenario-art/images/Food/11_1.jpeg",
            "reasoningKeyPoints": [
              "Remove unnecessary spaces",
              "Keep the important words",
              "Improve readability"
            ]
          },
          {
            "scenario": "Your grandmother asks everyone to write recipe names in CAPITAL letters so they are easy to find.",
            "prompt": "Why would writing them in the same style help?",
            "image": "/scenario-art/images/Food/11_2.jpeg",
            "reasoningKeyPoints": [
              "Maintain consistency",
              "Everything follows one format",
              "Recipes become easier to recognize"
            ]
          },
          {
            "scenario": "Later, your father wants the recipe for 'Kheer' and starts looking through the notebook.",
            "prompt": "How can he quickly find it?",
            "image": "/scenario-art/images/Food/11_3.jpeg",
            "reasoningKeyPoints": [
              "Search for the name",
              "Find matching text",
              "Locate the required recipe"
            ]
          }
        ],
        "example": {
          "code": "raw_name = \"  jordan lee  \"\nclean_name = raw_name.strip().title()\nprint(\"Cleaned name:\", clean_name)\n\ndish_title = \"Spicy Szechuan Noodles\"\nshort_label = dish_title[:12]\nprint(\"Ticket label:\", short_label)\n\nprint(\"Contains 'Spicy'?\", \"Spicy\" in dish_title)",
          "explanation": "Cleaning up typed text, shortening a long title for a small label, and checking for a keyword are all just a few string methods away.",
          "syntaxBreakdown": [
          {
            "code": "raw_name = \"  sam patel  \"",
            "points": [
              "raw_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "  sam patel   is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "clean_name = raw_name.strip().title()",
            "points": [
              "clean_name is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "raw_name refers back to the value already stored under that name.",
              ".strip(...) calls the strip method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              ".title(...) calls the title method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Cleaned name:\", clean_name)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cleaned name: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "clean_name refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "initial = clean_name[0]",
            "points": [
              "initial is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "clean_name refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "0 is a number, used here as a literal value.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Avatar initial:\", initial)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Avatar initial: is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "initial refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "email = \"sam.patel@mail.com\"",
            "points": [
              "email is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "sam.patel@mail.com is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Looks like an email?\", \"@\" in email)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Looks like an email? is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "@ is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection \u2014 either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "email refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef has a block of text in the restaurant kitchen and only needs a small transformed piece of it.",
          "question": "How should the head chef get just what they need from that text?",
          "optionA": "Retype the entire block of text by hand just to get the one small piece needed",
          "optionB": "Use the right tool to transform or pull out exactly the part of the text that's needed",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "Marine biologists study whale songs to understand communication and migration. Thousands of underwater recordings are collected every year, but before scientists can analyze them, the recordings are cleaned, organized, and compared for recurring sound patterns. Before information becomes useful, it often needs to be cleaned, examined, modified, and extended.",
        "scenarios": [
          {
            "scenario": "Several recordings contain background noise along with whale calls.",
            "prompt": "Why should researchers remove unnecessary sounds before analysis?",
            "image": ""
          },
          {
            "scenario": "Scientists discover that different whales repeat similar sound patterns in different recordings.",
            "prompt": "Why compare individual parts of each song instead of listening to the entire recording every time?",
            "image": ""
          },
          {
            "scenario": "A newly recorded whale introduces a previously unheard sound pattern.",
            "prompt": "How should this new pattern be incorporated into existing research?",
            "image": ""
          }
        ],
        "example": {
          "code": "raw_quote = \"  i think, therefore i am  \"\nclean_quote = raw_quote.strip().capitalize()\nprint(\"Cleaned quote:\", clean_quote)\n\npreview = \" \".join(clean_quote.split()[:3])\nprint(\"Preview:\", preview)\n\nprint(\"Contains 'therefore'?\", \"therefore\" in clean_quote)",
          "explanation": "Programming performs similar operations when working with text through string handling.",
          "syntaxBreakdown": [
          {
            "code": "raw_name = \"  sam patel  \"",
            "points": [
              "raw_name is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "  sam patel   is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "clean_name = raw_name.strip().title()",
            "points": [
              "clean_name is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "raw_name refers back to the value already stored under that name.",
              ".strip(...) calls the strip method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              ".title(...) calls the title method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(\"Cleaned name:\", clean_name)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Cleaned name: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "clean_name refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "initial = clean_name[0]",
            "points": [
              "initial is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "clean_name refers back to the value already stored under that name.",
              "The opening square bracket looks something up by position or by key inside the collection just to its left.",
              "0 is a number, used here as a literal value.",
              "The closing square bracket closes off the list or lookup that started with the matching [."
            ]
          },
          {
            "code": "print(\"Avatar initial:\", initial)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Avatar initial: is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "initial refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "email = \"sam.patel@mail.com\"",
            "points": [
              "email is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "sam.patel@mail.com is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "print(\"Looks like an email?\", \"@\" in email)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Looks like an email? is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "@ is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "in here checks membership/iterates over a collection — either \"is this value inside that collection\" or \"go through each item in this collection\".",
              "email refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A songbird sings a tune made up of many small notes, one after another, in a specific order.",
          "question": "If the songbird wants to sing a longer tune, what does it do?",
          "optionA": "String more notes together, one after another, in order",
          "optionB": "Repeat the exact same single note forever",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "Strings come with built-in methods like strip() and title() for cleaning text.",
    "conceptIntro": "Python strings have many built-in methods: `.strip()` removes surrounding whitespace, `.title()` capitalizes each word, `.lower()`/`.upper()` change case, and slicing (`text[0:3]`) extracts part of a string.",
    "reinforcement": {
      "prompt": "Given the string \"  Hello World  \", strip the whitespace, convert it to uppercase, and print the result.",
      "hint": "Chain .strip() and .upper() together.",
      "keyPoints": [
        "Use the strip method to remove leading and trailing whitespace",
        "Use the upper method to convert the string to uppercase",
        "Print the cleaned and transformed string"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "The ____ method converts text to all uppercase letters.",
        "options": [
          "upper",
          "lower",
          "split",
          "strip"
        ],
        "answer": "upper",
        "hint": "upper() is the string method that converts text to all uppercase."
      },
      "code": {
        "text": "name = \"katie\"\nprint(name.____())",
        "options": [
          "upper",
          "append",
          "pop",
          "add"
        ],
        "answer": "upper",
        "hint": "name.upper() transforms the text to uppercase without retyping it."
      }
    }
  },
  {
    "conceptSlug": "file-handling",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A runner keeps a training diary that they add to after every workout.",
            "prompt": "How would the diary save data so it's still there the next time the runner opens it?",
            "image": "/scenario-art/images/Sports/13_1.jpg"
          },
          {
            "scenario": "After each practice session, today's workout is added to yesterday's notes instead of replacing them.",
            "prompt": "How would the runner add new data without erasing what's already saved?",
            "image": "/scenario-art/images/Sports/13_2.jpg"
          },
          {
            "scenario": "Before planning the next race, the runner reads through all previous training entries.",
            "prompt": "How would you read everything that's been saved in the diary back out?",
            "image": "/scenario-art/images/Sports/13_3.jpg"
          }
        ],
        "example": {
          "code": "with open(\"workout_log.txt\", \"a\") as f:\n    f.write(\"Ran 5km in 28 minutes\\n\")\n\nwith open(\"workout_log.txt\", \"r\") as f:\n    print(f.read())",
          "explanation": "\"a\" mode appends without erasing what's already in the file, and \"r\" mode reads everything back out.",
          "syntaxBreakdown": [
          {
            "code": "with open(\"workout_log.txt\", \"a\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "workout_log.txt is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "a is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "f.write(\"Ran 5km in 28 minutes\\n\")",
            "points": [
              "f refers back to the value already stored under that name.",
              ".write(...) calls the write method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Ran 5km in 28 minutes\\n is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "with open(\"workout_log.txt\", \"r\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "workout_log.txt is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "r is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(f.read())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "f refers back to the value already stored under that name.",
              ".read(...) calls the read method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach needs today's notes in the team's training facility to still be available tomorrow, even after everything shuts down for the night.",
          "question": "How should the new coach make sure of that?",
          "optionA": "Save the notes somewhere permanent so they're still there after everything closes",
          "optionB": "Just keep the notes in their head, assuming they'll remember everything tomorrow",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You write your thoughts in a diary.",
            "prompt": "You write your thoughts in a diary. Where are those thoughts kept?",
            "image": "/scenario-art/images/Daily/12_1.jpg"
          },
          {
            "scenario": "Next week, you want to read what you wrote.",
            "prompt": "What would you do?",
            "image": "/scenario-art/images/Daily/12_2.jpg"
          },
          {
            "scenario": "Today, you want to add a new entry without removing the old one.",
            "prompt": "What should happen?",
            "image": "/scenario-art/images/Daily/12_3.jpg"
          }
        ],
        "example": {
          "code": "with open(\"journal.txt\", \"a\") as f:\n    f.write(\"Today was a good day.\\n\")\n\nwith open(\"journal.txt\", \"r\") as f:\n    print(f.read())",
          "explanation": "Every new entry gets appended to the same file, so nothing you wrote before ever gets lost.",
          "syntaxBreakdown": [
          {
            "code": "with open(\"journal.txt\", \"a\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "journal.txt is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "a is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "f.write(\"Today was a good day.\\n\")",
            "points": [
              "f refers back to the value already stored under that name.",
              ".write(...) calls the write method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Today was a good day.\\n is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "with open(\"journal.txt\", \"r\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "journal.txt is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "r is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(f.read())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "f refers back to the value already stored under that name.",
              ".read(...) calls the read method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate needs today's notes in your shared apartment to still be available tomorrow, even after everything shuts down for the night.",
          "question": "How should your roommate make sure of that?",
          "optionA": "Save the notes somewhere permanent so they're still there after everything closes",
          "optionB": "Just keep the notes in their head, assuming they'll remember everything tomorrow",
          "correctOption": "A",
          "image": ""
        }
      },
      "philosophy": {
        "background": "The Library of Alexandria was one of the greatest centers of knowledge in the ancient world. Scholars carefully preserved thousands of manuscripts so that future generations could read, study, and expand upon existing knowledge.",
        "scenarios": [
          {
            "scenario": "A scholar finishes writing a discovery.",
            "prompt": "Why record it in a manuscript instead of relying only on memory?",
            "image": ""
          },
          {
            "scenario": "Years later, another scholar studies the same manuscript.",
            "prompt": "What advantage does preserved information provide?",
            "image": ""
          },
          {
            "scenario": "A librarian adds new discoveries while keeping the earlier records safe.",
            "prompt": "Why is it important that both old and new knowledge remain accessible?",
            "image": ""
          }
        ],
        "example": {
          "code": "with open(\"reading_log.txt\", \"a\") as f:\n    f.write(\"Finished: Meditations by Marcus Aurelius\\n\")\n\nwith open(\"reading_log.txt\", \"r\") as f:\n    print(f.read())",
          "explanation": "Appending keeps your whole reading history intact, and reading it back shows everything that's ever been logged.",
          "syntaxBreakdown": [
          {
            "code": "with open(\"journal.txt\", \"a\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "journal.txt is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "a is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "f.write(\"Today was a good day.\\n\")",
            "points": [
              "f refers back to the value already stored under that name.",
              ".write(...) calls the write method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Today was a good day.\\n is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "with open(\"journal.txt\", \"r\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "journal.txt is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "r is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(f.read())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "f refers back to the value already stored under that name.",
              ".read(...) calls the read method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor needs today's notes in the seminar room to still be available tomorrow, even after everything shuts down for the night.",
          "question": "How should the philosophy professor make sure of that?",
          "optionA": "Save the notes somewhere permanent so they're still there after everything closes",
          "optionB": "Just keep the notes in their head, assuming they'll remember everything tomorrow",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Grandma's Recipe Notebook",
        "scenarios": [
          {
            "scenario": "Your grandmother writes every new recipe in her special notebook.",
            "prompt": "Why doesn't she simply memorize every recipe?",
            "image": "/scenario-art/images/Food/12_1.jpeg",
            "reasoningKeyPoints": [
              "Recipes stay safe",
              "They can be used later",
              "Nothing gets forgotten"
            ]
          },
          {
            "scenario": "A month later, she wants to make a sweet dish she hasn't cooked for a long time.",
            "prompt": "How can she remember the exact recipe?",
            "image": "/scenario-art/images/Food/12_2.jpeg",
            "reasoningKeyPoints": [
              "Look inside the notebook",
              "Old information is still available",
              "Written records help"
            ]
          },
          {
            "scenario": "She learns a new dessert recipe and writes it on the next empty page.",
            "prompt": "Why doesn't she replace the old recipes?",
            "image": "/scenario-art/images/Food/12_3.jpeg",
            "reasoningKeyPoints": [
              "Old recipes remain useful",
              "New recipes are added",
              "Everything is preserved"
            ]
          }
        ],
        "example": {
          "code": "with open(\"daily_sales.txt\", \"a\") as f:\n    f.write(\"Total sales today: $842\\n\")\n\nwith open(\"daily_sales.txt\", \"r\") as f:\n    print(f.read())",
          "explanation": "Each day's totals get appended onto the log file rather than overwriting the days before it.",
          "syntaxBreakdown": [
          {
            "code": "with open(\"journal.txt\", \"a\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "journal.txt is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "a is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "f.write(\"Today was a good day.\\n\")",
            "points": [
              "f refers back to the value already stored under that name.",
              ".write(...) calls the write method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Today was a good day.\\n is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "with open(\"journal.txt\", \"r\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "journal.txt is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "r is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(f.read())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "f refers back to the value already stored under that name.",
              ".read(...) calls the read method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef needs today's notes in the restaurant kitchen to still be available tomorrow, even after everything shuts down for the night.",
          "question": "How should the head chef make sure of that?",
          "optionA": "Just keep the notes in their head, assuming they'll remember everything tomorrow",
          "optionB": "Save the notes somewhere permanent so they're still there after everything closes",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "Scientists studying climate change drill deep into Antarctic ice sheets and collect ice cores. Each layer of ice preserves information about Earth's atmosphere from thousands of years ago, allowing researchers to study past climates and compare them with present-day conditions. Scientific knowledge becomes valuable when it can be preserved, reopened, and expanded over time.",
        "scenarios": [
          {
            "scenario": "A newly extracted ice core is carefully preserved inside a research laboratory.",
            "prompt": "Why shouldn't scientists rely only on memory instead of preserving the sample?",
            "image": ""
          },
          {
            "scenario": "Years later, another research team studies the same ice core to answer a different scientific question.",
            "prompt": "What advantage comes from preserving information over long periods?",
            "image": ""
          },
          {
            "scenario": "A new ice layer forms after another year of snowfall.",
            "prompt": "Should the previous climate record be replaced, or should the new information simply be added?",
            "image": ""
          }
        ],
        "example": {
          "code": "with open(\"reading_log.txt\", \"a\") as f:\n    f.write(\"Finished: Meditations by Marcus Aurelius\\n\")\n\nwith open(\"reading_log.txt\", \"r\") as f:\n    print(f.read())",
          "explanation": "Programs also store information so it can be retrieved and updated later using file handling.",
          "syntaxBreakdown": [
          {
            "code": "with open(\"journal.txt\", \"a\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "journal.txt is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "a is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "f.write(\"Today was a good day.\\n\")",
            "points": [
              "f refers back to the value already stored under that name.",
              ".write(...) calls the write method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Today was a good day.\\n is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "with open(\"journal.txt\", \"r\") as f:",
            "points": [
              "with opens a resource (like a file) and guarantees it gets closed properly afterward, even if something goes wrong inside the indented block.",
              "open(...) calls the open function, handing it whatever is inside these parentheses to work with.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "journal.txt is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "r is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "as gives a short, local name to whatever with just opened, so the indented block below can refer to it by that name.",
              "f refers back to the value already stored under that name.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "print(f.read())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "f refers back to the value already stored under that name.",
              ".read(...) calls the read method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A bear gathers extra food and stores it in its den so it will have something to eat later during the winter.",
          "question": "Why does the bear store the food now instead of eating all of it right away?",
          "optionA": "So it can come back and use the stored food later when it's needed",
          "optionB": "Storing food serves no purpose at all",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "open() lets you write data to disk so it survives after the program ends.",
    "conceptIntro": "Python's `open(filename, mode)` opens a file for reading (`\"r\"`), writing (`\"w\"`), or appending (`\"a\"`). Using a `with open(...) as f:` block automatically closes the file when you're done, even if an error occurs.",
    "reinforcement": {
      "prompt": "Write code that opens a file called notes.txt in write mode, writes the line \"Learning Python!\" to it, then reopens and reads it back, printing the contents.",
      "hint": "Use \"w\" mode to write, then \"r\" mode to read, both inside with blocks.",
      "keyPoints": [
        "Open a file in write mode using open with w",
        "Write a line of text to the file",
        "Reopen the file in read mode and print its contents"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "Opening a file in ____ mode adds new content without erasing what's already there.",
        "options": [
          "append",
          "write",
          "read",
          "create"
        ],
        "answer": "append",
        "hint": "Append mode adds new content to a file without erasing what's already saved there."
      },
      "code": {
        "text": "with open(\"log.txt\", \"____\") as f:\n    f.write(\"done\\n\")",
        "options": [
          "a",
          "r",
          "x",
          "b"
        ],
        "answer": "a",
        "hint": "\"a\" is the mode string that opens a file for appending."
      }
    }
  },
  {
    "conceptSlug": "classes",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "Every player on a team has a name, jersey number, and playing position.",
            "prompt": "How would you define a reusable blueprint that every player can be built from?",
            "image": "/scenario-art/images/Sports/14_1.jpg"
          },
          {
            "scenario": "Every new player who joins the club receives these basic details immediately.",
            "prompt": "How would the blueprint automatically set these values the moment a new player joins?",
            "image": "/scenario-art/images/Sports/14_2.jpg"
          },
          {
            "scenario": "Every player can introduce themselves in the same way.",
            "prompt": "How would you give the blueprint one shared way for every player to introduce themselves?",
            "image": "/scenario-art/images/Sports/14_3.jpg"
          }
        ],
        "example": {
          "code": "class Player:\n    def __init__(self, name, team):\n        self.name = name\n        self.team = team\n\n    def intro(self):\n        return f\"{self.name} plays for {self.team}\"\n\np1 = Player(\"Diaz\", \"Falcons\")\nprint(p1.intro())",
          "explanation": "The class is the blueprint, __init__ sets up each player's own data, and intro() is behavior every player object shares.",
          "syntaxBreakdown": [
          {
            "code": "class Player:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Player is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Player(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, name, team):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "name is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "team is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.name = name",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "name refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.team = team",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".team reaches into the object on the left and grabs the piece of data stored there under the name team.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "team refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def intro(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "intro is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.name} plays for {self.team}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string \u2014 anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "\" plays for \" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".team reaches into the object on the left and grabs the piece of data stored there under the name team.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "p1 = Player(\"Diaz\", \"Falcons\")",
            "points": [
              "p1 is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Player(...) creates a new Player object \u2014 Python runs Player's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Diaz is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Falcons is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(p1.intro())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "p1 refers back to the value already stored under that name.",
              ".intro(...) calls the intro method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach keeps creating many similar things in the team's training facility, and each one needs the exact same starting shape.",
          "question": "What should the new coach set up first?",
          "optionA": "Create one reusable blueprint that every one of those things gets built from",
          "optionB": "Design each one completely from scratch with no shared blueprint between them",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "The school wants every ID card to contain a student's name, roll number, and class.",
            "prompt": "What should be decided before printing the cards?",
            "image": "/scenario-art/images/Daily/13_1.jpg"
          },
          {
            "scenario": "A new student joins the school.",
            "prompt": "Should a completely new ID card design be created?",
            "image": "/scenario-art/images/Daily/13_2.jpg"
          },
          {
            "scenario": "The school continues issuing ID cards to new students.",
            "prompt": "Why is having one standard format useful?",
            "image": "/scenario-art/images/Daily/13_3.jpg"
          }
        ],
        "example": {
          "code": "class Member:\n    def __init__(self, name, allowance):\n        self.name = name\n        self.allowance = allowance\n\n    def summary(self):\n        return f\"{self.name} has {self.allowance} left\"\n\nm1 = Member(\"Alex\", 200)\nprint(m1.summary())",
          "explanation": "__init__ runs the moment Member(...) is called, giving each object its own name and allowance; summary() is shared behavior.",
          "syntaxBreakdown": [
          {
            "code": "class Member:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Member is the name being given to this class (this blueprint) — every object made from it will be created by calling Member(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, name, allowance):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "name is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "allowance is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.name = name",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "name refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.allowance = allowance",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".allowance reaches into the object on the left and grabs the piece of data stored there under the name allowance.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "allowance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def summary(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "summary is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.name} has {self.allowance} left\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string — anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "\" has \" is plain literal text — it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".allowance reaches into the object on the left and grabs the piece of data stored there under the name allowance.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "\" left\" is plain literal text — it appears exactly as written, with nothing substituted in.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "m1 = Member(\"Alex\", 200)",
            "points": [
              "m1 is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Member(...) creates a new Member object — Python runs Member's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "200 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(m1.summary())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "m1 refers back to the value already stored under that name.",
              ".summary(...) calls the summary method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate keeps creating many similar things in your shared apartment, and each one needs the exact same starting shape.",
          "question": "What should your roommate set up first?",
          "optionA": "Create one reusable blueprint that every one of those things gets built from",
          "optionB": "Design each one completely from scratch with no shared blueprint between them",
          "correctOption": "A",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Plato believed that every object we encounter is an instance of a perfect, abstract idea called a Form. Although individual objects may differ in appearance, they all originate from the same underlying concept.",
        "scenarios": [
          {
            "scenario": "Wooden chairs, plastic chairs, and office chairs all look different.",
            "prompt": "Why do we still recognize them all as chairs?",
            "image": ""
          },
          {
            "scenario": "A furniture company manufactures hundreds of chairs from a single design blueprint.",
            "prompt": "Why is using one blueprint more practical than designing every chair individually?",
            "image": ""
          },
          {
            "scenario": "A new chair is built using stronger materials but follows the same overall design.",
            "prompt": "What remained the same despite the change in material?",
            "image": ""
          }
        ],
        "example": {
          "code": "class Philosopher:\n    def __init__(self, name, belief):\n        self.name = name\n        self.belief = belief\n\n    def state(self):\n        return f\"{self.name} believes: {self.belief}\"\n\np1 = Philosopher(\"Kant\", \"Act only on universal principles\")\nprint(p1.state())",
          "explanation": "Each Philosopher object gets its own name and belief via __init__, and state() is behavior shared by every one of them.",
          "syntaxBreakdown": [
          {
            "code": "class Member:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Member is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Member(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, name, allowance):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "name is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "allowance is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.name = name",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "name refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.allowance = allowance",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".allowance reaches into the object on the left and grabs the piece of data stored there under the name allowance.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "allowance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def summary(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "summary is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.name} has {self.allowance} left\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string \u2014 anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "\" has \" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".allowance reaches into the object on the left and grabs the piece of data stored there under the name allowance.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "\" left\" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "m1 = Member(\"Alex\", 200)",
            "points": [
              "m1 is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Member(...) creates a new Member object \u2014 Python runs Member's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "200 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(m1.summary())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "m1 refers back to the value already stored under that name.",
              ".summary(...) calls the summary method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor keeps creating many similar things in the seminar room, and each one needs the exact same starting shape.",
          "question": "What should the philosophy professor set up first?",
          "optionA": "Design each one completely from scratch with no shared blueprint between them",
          "optionB": "Create one reusable blueprint that every one of those things gets built from",
          "correctOption": "B",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Opening a Small Tiffin Service",
        "scenarios": [
          {
            "scenario": "Your family starts a tiffin service. Every lunch box follows the same structure: rice, curry, chapati, and salad.",
            "prompt": "Why should every lunch box follow the same arrangement?",
            "image": "/scenario-art/images/Food/13_1.jpeg",
            "reasoningKeyPoints": [
              "Consistency",
              "Easy preparation",
              "Everyone follows one pattern"
            ]
          },
          {
            "scenario": "Today, 50 lunch boxes need to be prepared.",
            "prompt": "How can everyone in the kitchen prepare them efficiently?",
            "image": "/scenario-art/images/Food/13_2.jpeg",
            "reasoningKeyPoints": [
              "Follow one standard arrangement",
              "Repeat the same structure",
              "Only food portions may differ"
            ]
          },
          {
            "scenario": "Next week the business grows and 100 lunch boxes are needed.",
            "prompt": "Why is having one standard arrangement even more useful now?",
            "image": "/scenario-art/images/Food/13_3.jpeg",
            "reasoningKeyPoints": [
              "It scales easily",
              "Preparation stays organized",
              "Everyone knows the structure"
            ]
          }
        ],
        "example": {
          "code": "class Dish:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n    def listing(self):\n        return f\"{self.name} - ${self.price}\"\n\nd1 = Dish(\"Ramen\", 12)\nprint(d1.listing())",
          "explanation": "__init__ sets each dish's own name and price as soon as it's created, and listing() is shared behavior every Dish has.",
          "syntaxBreakdown": [
          {
            "code": "class Member:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Member is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Member(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, name, allowance):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "name is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "allowance is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.name = name",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "name refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.allowance = allowance",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".allowance reaches into the object on the left and grabs the piece of data stored there under the name allowance.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "allowance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def summary(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "summary is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.name} has {self.allowance} left\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string \u2014 anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "\" has \" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".allowance reaches into the object on the left and grabs the piece of data stored there under the name allowance.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "\" left\" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "m1 = Member(\"Alex\", 200)",
            "points": [
              "m1 is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Member(...) creates a new Member object \u2014 Python runs Member's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "200 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(m1.summary())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "m1 refers back to the value already stored under that name.",
              ".summary(...) calls the summary method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef keeps creating many similar things in the restaurant kitchen, and each one needs the exact same starting shape.",
          "question": "What should the head chef set up first?",
          "optionA": "Design each one completely from scratch with no shared blueprint between them",
          "optionB": "Create one reusable blueprint that every one of those things gets built from",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "Honeybees construct thousands of hexagonal cells inside a hive. Remarkably, almost every cell follows the same geometric design, allowing the hive to grow efficiently while maintaining a consistent structure. Nature often develops one reliable design that can be reused repeatedly to build many similar structures.",
        "scenarios": [
          {
            "scenario": "The first honeycomb cell is constructed using a hexagonal pattern.",
            "prompt": "Why begin with a consistent design instead of creating random shapes?",
            "image": ""
          },
          {
            "scenario": "Hundreds of additional cells are built using the same structure.",
            "prompt": "Why continue following the original design rather than inventing a new one for every cell?",
            "image": ""
          },
          {
            "scenario": "A new hive is started nearby.",
            "prompt": "Should bees create an entirely different pattern, or reuse the same successful design?",
            "image": ""
          }
        ],
        "example": {
          "code": "class Philosopher:\n    def __init__(self, name, belief):\n        self.name = name\n        self.belief = belief\n\n    def state(self):\n        return f\"{self.name} believes: {self.belief}\"\n\np1 = Philosopher(\"Kant\", \"Act only on universal principles\")\nprint(p1.state())",
          "explanation": "Programming follows the same principle through classes, which define a common blueprint for creating many similar objects.",
          "syntaxBreakdown": [
          {
            "code": "class Member:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Member is the name being given to this class (this blueprint) — every object made from it will be created by calling Member(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, name, allowance):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "name is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "allowance is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.name = name",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "name refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.allowance = allowance",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".allowance reaches into the object on the left and grabs the piece of data stored there under the name allowance.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "allowance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def summary(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "summary is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.name} has {self.allowance} left\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string — anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "\" has \" is plain literal text — it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".allowance reaches into the object on the left and grabs the piece of data stored there under the name allowance.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "\" left\" is plain literal text — it appears exactly as written, with nothing substituted in.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "m1 = Member(\"Alex\", 200)",
            "points": [
              "m1 is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Member(...) creates a new Member object — Python runs Member's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Alex is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "200 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(m1.summary())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "m1 refers back to the value already stored under that name.",
              ".summary(...) calls the summary method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Every honeycomb cell that bees build follows the same six-sided hexagon shape, no matter which bee builds it.",
          "question": "Why do bees keep making the same hexagon shape for every single cell?",
          "optionA": "They all follow the same shared pattern every time they build",
          "optionB": "Each bee invents a completely new, different shape each time",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A class is a blueprint; __init__ sets up each object's own data when it's created, and methods define shared behavior.",
    "conceptIntro": "class defines a reusable blueprint. def __init__(self, ...): runs automatically when you create a new object, setting its starting attributes. Other methods inside the class define behavior every object built from it can use.",
    "reinforcement": {
      "prompt": "Define a class Book with __init__ that sets title and author, and a method summary() that returns a string describing the book.",
      "hint": "Use self.title and self.author inside __init__.",
      "keyPoints": [
        "Defines a class with __init__",
        "Sets attributes using self",
        "Includes a method that uses those attributes"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "The ____ method runs automatically every time a new object is created from a class.",
        "options": [
          "__init__",
          "__main__",
          "__str__",
          "__call__"
        ],
        "answer": "__init__",
        "hint": "__init__ is the method that runs automatically every time a new object is created."
      },
      "code": {
        "text": "____ Dog:\n    def __init__(self, name):\n        self.name = name",
        "options": [
          "class",
          "def",
          "object",
          "import"
        ],
        "answer": "class",
        "hint": "class is the keyword used to define a new blueprint."
      }
    }
  },
  {
    "conceptSlug": "objects",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "Diaz and Kim are two different players on the same team.",
            "prompt": "Are Diaz and Kim built from the same blueprint, and does that mean they share the same data?",
            "image": "/scenario-art/images/Sports/15_1.jpg"
          },
          {
            "scenario": "Diaz scores a goal during the match.",
            "prompt": "What should happen to Kim's data at the moment Diaz's data is updated?",
            "image": "/scenario-art/images/Sports/15_2.jpg"
          },
          {
            "scenario": "The coach checks Diaz's statistics before selecting the starting lineup.",
            "prompt": "How would you look up just Diaz's data instead of any other player's?",
            "image": "/scenario-art/images/Sports/15_3.jpg"
          }
        ],
        "example": {
          "code": "class Player:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\ndiaz = Player(\"Diaz\", 2)\nkim = Player(\"Kim\", 1)\ndiaz.score = 3\nprint(diaz.score, kim.score)",
          "explanation": "diaz and kim are separate objects built from the same class — changing diaz.score never touches kim.score.",
          "syntaxBreakdown": [
          {
            "code": "class Player:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Player is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Player(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, name, score):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "name is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "score is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.name = name",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "name refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.score = score",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".score reaches into the object on the left and grabs the piece of data stored there under the name score.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "score refers back to the value already stored under that name."
            ]
          },
          {
            "code": "diaz = Player(\"Diaz\", 2)",
            "points": [
              "diaz is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Player(...) creates a new Player object \u2014 Python runs Player's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Diaz is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "2 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "kim = Player(\"Kim\", 1)",
            "points": [
              "kim is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Player(...) creates a new Player object \u2014 Python runs Player's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Kim is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "1 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "diaz.score = 3",
            "points": [
              "diaz refers back to the value already stored under that name.",
              ".score reaches into the object on the left and grabs the piece of data stored there under the name score.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "3 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(diaz.score, kim.score)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "diaz refers back to the value already stored under that name.",
              ".score reaches into the object on the left and grabs the piece of data stored there under the name score.",
              "The comma separates this from the next item in the list.",
              "kim refers back to the value already stored under that name.",
              ".score reaches into the object on the left and grabs the piece of data stored there under the name score.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach built two things from the same blueprint in the team's training facility, and then changed something about just one of them.",
          "question": "What should happen to the other one?",
          "optionA": "Nothing — the other one keeps its own separate data, completely unaffected",
          "optionB": "It should change too, since they came from the same blueprint",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "The school has already created the ID card format. Rahul receives an ID card with his own details.",
            "prompt": "What does the card represent?",
            "image": "/scenario-art/images/Daily/14_1.jpg"
          },
          {
            "scenario": "Priya also receives an ID card using the same format.",
            "prompt": "Is it the same card as Rahul's?",
            "image": "/scenario-art/images/Daily/14_2.jpg"
          },
          {
            "scenario": "Both students now have their own ID cards.",
            "prompt": "What is common between Rahul's and Priya's cards?",
            "image": "/scenario-art/images/Daily/14_3.jpg"
          }
        ],
        "example": {
          "code": "class Wallet:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.balance = balance\n\npriya = Wallet(\"Priya\", 500)\nsam = Wallet(\"Sam\", 300)\npriya.balance += 100\nprint(priya.balance, sam.balance)",
          "explanation": "priya and sam are independent objects — updating priya.balance leaves sam.balance completely untouched.",
          "syntaxBreakdown": [
          {
            "code": "class Wallet:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Wallet is the name being given to this class (this blueprint) — every object made from it will be created by calling Wallet(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, owner, balance):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "owner is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "balance is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.owner = owner",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "owner refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.balance = balance",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "balance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "priya = Wallet(\"Priya\", 500)",
            "points": [
              "priya is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Wallet(...) creates a new Wallet object — Python runs Wallet's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "500 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "sam = Wallet(\"Sam\", 300)",
            "points": [
              "sam is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Wallet(...) creates a new Wallet object — Python runs Wallet's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "300 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "priya.balance += 100",
            "points": [
              "priya refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "+= takes the current value on the left, adds the value on the right to it, and stores the result back into that same name.",
              "100 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(priya.balance, sam.balance)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "priya refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The comma separates this from the next item in the list.",
              "sam refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate built two things from the same blueprint in your shared apartment, and then changed something about just one of them.",
          "question": "What should happen to the other one?",
          "optionA": "It should change too, since they came from the same blueprint",
          "optionB": "Nothing — the other one keeps its own separate data, completely unaffected",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "The Ship of Theseus is a famous philosophical thought experiment that explores identity. It asks whether an object remains the same if every one of its parts is gradually replaced over time.",
        "scenarios": [
          {
            "scenario": "One damaged plank of the ship is replaced during a repair.",
            "prompt": "Would you still consider it the same ship?",
            "image": ""
          },
          {
            "scenario": "Over many years, every plank is replaced until none of the original material remains.",
            "prompt": "At what point, if any, does it become a different ship?",
            "image": ""
          },
          {
            "scenario": "Someone rebuilds another ship using all the original planks that were removed.",
            "prompt": "Which ship should be considered the original one?",
            "image": ""
          }
        ],
        "example": {
          "code": "class Thinker:\n    def __init__(self, name, stance):\n        self.name = name\n        self.stance = stance\n\nlocke = Thinker(\"Locke\", \"tabula rasa\")\nhume = Thinker(\"Hume\", \"empiricism\")\nlocke.stance = \"revised view\"\nprint(locke.stance, hume.stance)",
          "explanation": "locke and hume are separate objects — changing locke.stance has zero effect on hume.stance.",
          "syntaxBreakdown": [
          {
            "code": "class Wallet:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Wallet is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Wallet(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, owner, balance):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "owner is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "balance is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.owner = owner",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "owner refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.balance = balance",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "balance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "priya = Wallet(\"Priya\", 500)",
            "points": [
              "priya is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Wallet(...) creates a new Wallet object \u2014 Python runs Wallet's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "500 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "sam = Wallet(\"Sam\", 300)",
            "points": [
              "sam is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Wallet(...) creates a new Wallet object \u2014 Python runs Wallet's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "300 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "priya.balance += 100",
            "points": [
              "priya refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "+= takes the current value on the left, adds the value on the right to it, and stores the result back into that same name.",
              "100 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(priya.balance, sam.balance)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "priya refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The comma separates this from the next item in the list.",
              "sam refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor built two things from the same blueprint in the seminar room, and then changed something about just one of them.",
          "question": "What should happen to the other one?",
          "optionA": "Nothing — the other one keeps its own separate data, completely unaffected",
          "optionB": "It should change too, since they came from the same blueprint",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Today's Special Biryani",
        "scenarios": [
          {
            "scenario": "Your mother prepares one pot of vegetable biryani for lunch.",
            "prompt": "How would you describe this particular biryani?",
            "image": "/scenario-art/images/Food/14_1.jpeg",
            "reasoningKeyPoints": [
              "It has its own ingredients",
              "It has its own quantity",
              "It is one specific dish"
            ]
          },
          {
            "scenario": "In the evening, she prepares another biryani for guests using different ingredients.",
            "prompt": "Should both biryanis be considered exactly the same?",
            "image": "/scenario-art/images/Food/14_2.jpeg",
            "reasoningKeyPoints": [
              "Each dish is different",
              "Each has its own details",
              "Treat them individually"
            ]
          },
          {
            "scenario": "One biryani is completely served while the other remains in the kitchen.",
            "prompt": "Should both dishes now be considered in the same condition?",
            "image": "/scenario-art/images/Food/14_3.jpeg",
            "reasoningKeyPoints": [
              "Each dish has its own state",
              "Changes affect only one dish",
              "The other remains unchanged"
            ]
          }
        ],
        "example": {
          "code": "class Order:\n    def __init__(self, table, total):\n        self.table = table\n        self.total = total\n\nt4 = Order(4, 25)\nt7 = Order(7, 40)\nt4.total += 6\nprint(t4.total, t7.total)",
          "explanation": "t4 and t7 are independent objects from the same Order class — updating t4.total never changes t7.total.",
          "syntaxBreakdown": [
          {
            "code": "class Wallet:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Wallet is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Wallet(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, owner, balance):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "owner is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "balance is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.owner = owner",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "owner refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.balance = balance",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "balance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "priya = Wallet(\"Priya\", 500)",
            "points": [
              "priya is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Wallet(...) creates a new Wallet object \u2014 Python runs Wallet's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "500 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "sam = Wallet(\"Sam\", 300)",
            "points": [
              "sam is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Wallet(...) creates a new Wallet object \u2014 Python runs Wallet's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "300 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "priya.balance += 100",
            "points": [
              "priya refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "+= takes the current value on the left, adds the value on the right to it, and stores the result back into that same name.",
              "100 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(priya.balance, sam.balance)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "priya refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The comma separates this from the next item in the list.",
              "sam refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef built two things from the same blueprint in the restaurant kitchen, and then changed something about just one of them.",
          "question": "What should happen to the other one?",
          "optionA": "It should change too, since they came from the same blueprint",
          "optionB": "Nothing — the other one keeps its own separate data, completely unaffected",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "Although every banyan tree belongs to the same species, no two trees are completely identical. Each grows in a different location, develops unique branches, and experiences different environmental conditions. Individual members may share the same overall design while still having their own unique identity and characteristics.",
        "scenarios": [
          {
            "scenario": "Two banyan trees grow in different parts of the same forest.",
            "prompt": "Even though they belong to the same species, what makes them different?",
            "image": ""
          },
          {
            "scenario": "One tree grows taller because it receives more sunlight.",
            "prompt": "Has it become a different species, or is it simply developing differently?",
            "image": ""
          },
          {
            "scenario": "Researchers assign identification numbers to every tree they study.",
            "prompt": "Why identify each tree individually if they all belong to the same species?",
            "image": ""
          }
        ],
        "example": {
          "code": "class Thinker:\n    def __init__(self, name, stance):\n        self.name = name\n        self.stance = stance\n\nlocke = Thinker(\"Locke\", \"tabula rasa\")\nhume = Thinker(\"Hume\", \"empiricism\")\nlocke.stance = \"revised view\"\nprint(locke.stance, hume.stance)",
          "explanation": "Programming represents individual entities as objects, each created from the same class but maintaining its own identity and state.",
          "syntaxBreakdown": [
          {
            "code": "class Wallet:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Wallet is the name being given to this class (this blueprint) — every object made from it will be created by calling Wallet(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, owner, balance):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "owner is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "balance is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.owner = owner",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "owner refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.balance = balance",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "balance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "priya = Wallet(\"Priya\", 500)",
            "points": [
              "priya is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Wallet(...) creates a new Wallet object — Python runs Wallet's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "500 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "sam = Wallet(\"Sam\", 300)",
            "points": [
              "sam is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Wallet(...) creates a new Wallet object — Python runs Wallet's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Sam is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "300 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "priya.balance += 100",
            "points": [
              "priya refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "+= takes the current value on the left, adds the value on the right to it, and stores the result back into that same name.",
              "100 is a number, used here as a literal value."
            ]
          },
          {
            "code": "print(priya.balance, sam.balance)",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "priya refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The comma separates this from the next item in the list.",
              "sam refers back to the value already stored under that name.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Two sunflowers grown from the same type of seed still end up with their own individual height and their own number of petals.",
          "question": "Are the two sunflowers grown from the same seed type exactly identical to each other?",
          "optionA": "No, each one is its own individual with its own particular details",
          "optionB": "Yes, they are completely interchangeable, identical copies",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "An object is a specific instance of a class, with its own independent copy of the attributes __init__ set up.",
    "conceptIntro": "Every time you call a class like Player(...), Python creates a new object with its own separate attributes. Two objects from the same class never share data — changing one never changes the other.",
    "reinforcement": {
      "prompt": "Create two objects from a class Car with attribute mileage, update one object's mileage, then print both to show they're independent.",
      "hint": "Instantiate the class twice into two different variables.",
      "keyPoints": [
        "Creates two separate objects from one class",
        "Updates only one object's attribute",
        "Shows the other object's attribute is unaffected"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "An ____ is a specific instance created from a class, with its own data.",
        "options": [
          "object",
          "function",
          "module",
          "loop"
        ],
        "answer": "object",
        "hint": "An object is one specific instance built from a class, with its own independent data."
      },
      "code": {
        "text": "d1 = Dog(\"Rex\")\nprint(d1.____)",
        "options": [
          "name",
          "class",
          "def",
          "self"
        ],
        "answer": "name",
        "hint": "d1.name accesses that specific object's own name attribute."
      }
    }
  },
  {
    "conceptSlug": "access-modifiers",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "A player's jersey number is visible to everyone, but their fitness assessment is shared only with the coaching staff.",
            "prompt": "How would you signal that the fitness assessment should stay internal rather than fully public?",
            "image": "/scenario-art/images/Sports/16_1.jpg"
          },
          {
            "scenario": "Only the team doctor is allowed to update a player's fitness assessment after a medical check.",
            "prompt": "How should the fitness assessment actually get updated, rather than being changed directly?",
            "image": "/scenario-art/images/Sports/16_2.jpg"
          },
          {
            "scenario": "The coaching staff changes how they evaluate fitness without changing how players see their own reports.",
            "prompt": "Why does keeping the internal calculation private make this kind of change safer?",
            "image": "/scenario-art/images/Sports/16_3.jpg"
          }
        ],
        "example": {
          "code": "class Player:\n    def __init__(self, name):\n        self.name = name\n        self.__fitness = 80\n\n    def update_fitness(self, value):\n        self.__fitness = value\n\np = Player(\"Rae\")\np.update_fitness(85)",
          "explanation": "__fitness is name-mangled as private — code outside the class updates it only through update_fitness(), never by touching it directly.",
          "syntaxBreakdown": [
          {
            "code": "class Player:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Player is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Player(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, name):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "name is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.name = name",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "name refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.__fitness = 80",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".__fitness reaches into the object on the left and grabs the piece of data stored there under the name __fitness.",
              "The double underscore in front of __fitness is a signal that this is meant to be private \u2014 Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "80 is a number, used here as a literal value."
            ]
          },
          {
            "code": "def update_fitness(self, value):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "update_fitness is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "value is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__fitness = value",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".__fitness reaches into the object on the left and grabs the piece of data stored there under the name __fitness.",
              "The double underscore in front of __fitness is a signal that this is meant to be private \u2014 Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "value refers back to the value already stored under that name."
            ]
          },
          {
            "code": "p = Player(\"Rae\")",
            "points": [
              "p is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Player(...) creates a new Player object \u2014 Python runs Player's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Rae is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "p.update_fitness(85)",
            "points": [
              "p refers back to the value already stored under that name.",
              ".update_fitness(...) calls the update_fitness method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "85 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach has a sensitive detail in the team's training facility that shouldn't be changed by just anyone poking at it directly.",
          "question": "How should the new coach handle that sensitive detail?",
          "optionA": "Keep it private and only let it be changed through one approved, controlled process",
          "optionB": "Leave it fully open so literally anyone can walk up and change it directly",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "A school keeps student information, but not everyone can view every detail. The notice board shows student names and classes.",
            "prompt": "Can everyone see this information?",
            "image": "/scenario-art/images/Daily/15_1.jpg"
          },
          {
            "scenario": "The principal's office stores confidential disciplinary records.",
            "prompt": "Should every student access them?",
            "image": "/scenario-art/images/Daily/15_2.jpg"
          },
          {
            "scenario": "Some information is visible only to teachers and administrators.",
            "prompt": "Why?",
            "image": "/scenario-art/images/Daily/15_3.jpg"
          }
        ],
        "example": {
          "code": "class Account:\n    def __init__(self):\n        self.__balance = 0\n\n    def deposit(self, amount):\n        self.__balance += amount\n\na = Account()\na.deposit(100)",
          "explanation": "__balance stays private — the only way to change it from outside the class is through deposit(), which can validate the amount.",
          "syntaxBreakdown": [
          {
            "code": "class Account:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Account is the name being given to this class (this blueprint) — every object made from it will be created by calling Account(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__balance = 0",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".__balance reaches into the object on the left and grabs the piece of data stored there under the name __balance.",
              "The double underscore in front of __balance is a signal that this is meant to be private — Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "0 is a number, used here as a literal value."
            ]
          },
          {
            "code": "def deposit(self, amount):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "deposit is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "amount is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__balance += amount",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".__balance reaches into the object on the left and grabs the piece of data stored there under the name __balance.",
              "The double underscore in front of __balance is a signal that this is meant to be private — Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "+= takes the current value on the left, adds the value on the right to it, and stores the result back into that same name.",
              "amount refers back to the value already stored under that name."
            ]
          },
          {
            "code": "a = Account()",
            "points": [
              "a is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Account(...) creates a new Account object — Python runs Account's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "a.deposit(100)",
            "points": [
              "a refers back to the value already stored under that name.",
              ".deposit(...) calls the deposit method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "100 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate has a sensitive detail in your shared apartment that shouldn't be changed by just anyone poking at it directly.",
          "question": "How should your roommate handle that sensitive detail?",
          "optionA": "Leave it fully open so literally anyone can walk up and change it directly",
          "optionB": "Keep it private and only let it be changed through one approved, controlled process",
          "correctOption": "B",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Many ancient philosophical schools shared knowledge at different levels. Some teachings were public, some were reserved for students, and the most advanced knowledge was accessible only to experienced members.",
        "scenarios": [
          {
            "scenario": "A philosopher delivers a lecture in the town square for everyone.",
            "prompt": "Why should some knowledge be publicly available?",
            "image": ""
          },
          {
            "scenario": "Only students enrolled in the academy attend advanced discussions.",
            "prompt": "Why might certain information be shared only within a learning community?",
            "image": ""
          },
          {
            "scenario": "A master's personal research notes are kept private until the work is complete.",
            "prompt": "Why shouldn't every piece of information be accessible to everyone?",
            "image": ""
          }
        ],
        "example": {
          "code": "class Debater:\n    def __init__(self, name):\n        self.name = name\n        self.__credibility = 50\n\n    def adjust(self, points):\n        self.__credibility += points\n\nd = Debater(\"Nia\")\nd.adjust(10)",
          "explanation": "__credibility is private — it can only be changed through adjust(), keeping the scoring logic in one controlled place.",
          "syntaxBreakdown": [
          {
            "code": "class Account:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Account is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Account(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__balance = 0",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".__balance reaches into the object on the left and grabs the piece of data stored there under the name __balance.",
              "The double underscore in front of __balance is a signal that this is meant to be private \u2014 Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "0 is a number, used here as a literal value."
            ]
          },
          {
            "code": "def deposit(self, amount):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "deposit is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "amount is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__balance += amount",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".__balance reaches into the object on the left and grabs the piece of data stored there under the name __balance.",
              "The double underscore in front of __balance is a signal that this is meant to be private \u2014 Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "+= takes the current value on the left, adds the value on the right to it, and stores the result back into that same name.",
              "amount refers back to the value already stored under that name."
            ]
          },
          {
            "code": "a = Account()",
            "points": [
              "a is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Account(...) creates a new Account object \u2014 Python runs Account's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "a.deposit(100)",
            "points": [
              "a refers back to the value already stored under that name.",
              ".deposit(...) calls the deposit method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "100 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor has a sensitive detail in the seminar room that shouldn't be changed by just anyone poking at it directly.",
          "question": "How should the philosophy professor handle that sensitive detail?",
          "optionA": "Leave it fully open so literally anyone can walk up and change it directly",
          "optionB": "Keep it private and only let it be changed through one approved, controlled process",
          "correctOption": "B",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Inside the Family Kitchen",
        "scenarios": [
          {
            "scenario": "The spice rack is kept on an open shelf where anyone cooking can use it.",
            "prompt": "Why is this shelf kept open?",
            "image": "/scenario-art/images/Food/15_1.jpeg",
            "reasoningKeyPoints": [
              "Everyone needs these ingredients",
              "Easy access is helpful",
              "They are meant to be shared"
            ]
          },
          {
            "scenario": "The family's special homemade garam masala is kept inside a cupboard that only family members use.",
            "prompt": "Why isn't it placed on the open shelf?",
            "image": "/scenario-art/images/Food/15_2.jpeg",
            "reasoningKeyPoints": [
              "Not everyone should use it",
              "Access is limited",
              "It is reserved"
            ]
          },
          {
            "scenario": "A small locker contains expensive saffron and secret spice mixes. Only your grandmother has the key.",
            "prompt": "Why are these ingredients locked away?",
            "image": "/scenario-art/images/Food/15_3.jpeg",
            "reasoningKeyPoints": [
              "They are highly valuable",
              "Only one trusted person should access them",
              "Protection prevents misuse"
            ]
          }
        ],
        "example": {
          "code": "class Dish:\n    def __init__(self, name):\n        self.name = name\n        self.__cost = 4\n\n    def update_cost(self, value):\n        self.__cost = value\n\nd = Dish(\"Soup\")\nd.update_cost(5)",
          "explanation": "__cost is private — outside code can only change it through update_cost(), never by assigning to it directly.",
          "syntaxBreakdown": [
          {
            "code": "class Account:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Account is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Account(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__balance = 0",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".__balance reaches into the object on the left and grabs the piece of data stored there under the name __balance.",
              "The double underscore in front of __balance is a signal that this is meant to be private \u2014 Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "0 is a number, used here as a literal value."
            ]
          },
          {
            "code": "def deposit(self, amount):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "deposit is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "amount is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__balance += amount",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".__balance reaches into the object on the left and grabs the piece of data stored there under the name __balance.",
              "The double underscore in front of __balance is a signal that this is meant to be private \u2014 Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "+= takes the current value on the left, adds the value on the right to it, and stores the result back into that same name.",
              "amount refers back to the value already stored under that name."
            ]
          },
          {
            "code": "a = Account()",
            "points": [
              "a is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Account(...) creates a new Account object \u2014 Python runs Account's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "a.deposit(100)",
            "points": [
              "a refers back to the value already stored under that name.",
              ".deposit(...) calls the deposit method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "100 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef has a sensitive detail in the restaurant kitchen that shouldn't be changed by just anyone poking at it directly.",
          "question": "How should the head chef handle that sensitive detail?",
          "optionA": "Keep it private and only let it be changed through one approved, controlled process",
          "optionB": "Leave it fully open so literally anyone can walk up and change it directly",
          "correctOption": "A",
          "image": ""
        }
      },
            "environmental": {
        "background": "A honeybee colony is highly organized. Worker bees, drones, and the queen each have specific responsibilities and access to different areas of the hive. Not every bee performs every task. Complex systems remain organized when different members have different responsibilities and levels of access.",
        "scenarios": [
          {
            "scenario": "Worker bees freely move through storage chambers while collecting nectar.",
            "prompt": "Why are these areas accessible to all workers?",
            "image": ""
          },
          {
            "scenario": "The queen spends most of her time inside a protected chamber where only certain bees attend her.",
            "prompt": "Why restrict access to this area?",
            "image": ""
          },
          {
            "scenario": "Some bees spend their entire lives performing only one specialized task.",
            "prompt": "Why doesn't every bee have permission to perform every role?",
            "image": ""
          }
        ],
        "example": {
          "code": "class Debater:\n    def __init__(self, name):\n        self.name = name\n        self.__credibility = 50\n\n    def adjust(self, points):\n        self.__credibility += points\n\nd = Debater(\"Nia\")\nd.adjust(10)",
          "explanation": "Programming also controls who can access different parts of a system through public, protected, and private members.",
          "syntaxBreakdown": [
          {
            "code": "class Account:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Account is the name being given to this class (this blueprint) — every object made from it will be created by calling Account(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__balance = 0",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".__balance reaches into the object on the left and grabs the piece of data stored there under the name __balance.",
              "The double underscore in front of __balance is a signal that this is meant to be private — Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "0 is a number, used here as a literal value."
            ]
          },
          {
            "code": "def deposit(self, amount):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "deposit is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "amount is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.__balance += amount",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".__balance reaches into the object on the left and grabs the piece of data stored there under the name __balance.",
              "The double underscore in front of __balance is a signal that this is meant to be private — Python renames it internally so it's awkward to reach from outside the class, discouraging (though not strictly blocking) outside code from touching it directly.",
              "+= takes the current value on the left, adds the value on the right to it, and stores the result back into that same name.",
              "amount refers back to the value already stored under that name."
            ]
          },
          {
            "code": "a = Account()",
            "points": [
              "a is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Account(...) creates a new Account object — Python runs Account's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "a.deposit(100)",
            "points": [
              "a refers back to the value already stored under that name.",
              ".deposit(...) calls the deposit method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "100 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A turtle keeps its soft body tucked safely inside its hard shell, only sticking its head out when it feels safe.",
          "question": "Why does the turtle keep its soft body hidden inside the shell?",
          "optionA": "To protect its sensitive, private parts from the outside world",
          "optionB": "To let anything from the outside touch its soft body directly",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A leading underscore (or double underscore) signals an attribute is private; outside code should go through the class's own methods instead of touching it directly.",
    "conceptIntro": "Python doesn't fully enforce private attributes, but a single _underscore is a convention meaning 'internal use', and a double __underscore triggers name mangling. Either way, the class exposes methods so outside code doesn't need to touch internal data directly.",
    "reinforcement": {
      "prompt": "Write a class BankAccount with a private __balance attribute, and methods deposit() and get_balance() to interact with it safely.",
      "hint": "Use self.__balance and only change it inside the class's own methods.",
      "keyPoints": [
        "Attribute is marked private with double underscore",
        "A method updates the private attribute",
        "A method returns the private attribute's value"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "A leading ____ before an attribute name signals it should be treated as private.",
        "options": [
          "underscore",
          "asterisk",
          "colon",
          "hashtag"
        ],
        "answer": "underscore",
        "hint": "An underscore before a name is the convention that marks it as meant to stay private."
      },
      "code": {
        "text": "class Account:\n    def __init__(self):\n        self.____balance = 0",
        "options": [
          "__",
          "--",
          "**",
          "::"
        ],
        "answer": "__",
        "hint": "Two leading underscores (__) trigger Python's name-mangling for private attributes."
      }
    }
  },
  {
    "conceptSlug": "inheritance",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "Every athlete at a sports club follows the same basic training routine, but each sport adds its own specialized practice.",
            "prompt": "How would a specific sport reuse the shared training routine without rewriting it?",
            "image": "/scenario-art/images/Sports/17_1.jpg"
          },
          {
            "scenario": "Swimmers spend extra time practicing turns and breathing techniques.",
            "prompt": "How would swimmers add their own extra training without losing what's shared with everyone else?",
            "image": "/scenario-art/images/Sports/17_2.jpg"
          },
          {
            "scenario": "Before entering the pool, swimmers complete the same warm-up as every other athlete.",
            "prompt": "How would swimmers reuse the original warm-up instead of duplicating it?",
            "image": "/scenario-art/images/Sports/17_3.jpg"
          }
        ],
        "example": {
          "code": "class Athlete:\n    def __init__(self, name):\n        self.name = name\n    def train(self):\n        return f\"{self.name} does general conditioning\"\n\nclass Swimmer(Athlete):\n    def train(self):\n        base = super().train()\n        return base + \" plus pool drills\"\n\ns = Swimmer(\"Lia\")\nprint(s.train())",
          "explanation": "Swimmer inherits name and the base behavior from Athlete, overrides train(), and super() reuses the original instead of duplicating it.",
          "syntaxBreakdown": [
          {
            "code": "class Athlete:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Athlete is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Athlete(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, name):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "name is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.name = name",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "name refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def train(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "train is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.name} does general conditioning\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string \u2014 anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".name reaches into the object on the left and grabs the piece of data stored there under the name name.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "\" does general conditioning\" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "class Swimmer(Athlete):",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Swimmer is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Swimmer(...).",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "Athlete is the parent class this one inherits from \u2014 it automatically gets all of Athlete's methods, unless it defines its own version to override them.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def train(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "train is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "base = super().train()",
            "points": [
              "base is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "super() gives access to the parent class's version of a method, so it can be reused instead of rewritten.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              ".train(...) calls the train method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "return base + \" plus pool drills\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "base refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              " plus pool drills is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "s = Swimmer(\"Lia\")",
            "points": [
              "s is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Swimmer(...) creates a new Swimmer object \u2014 Python runs Swimmer's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Lia is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(s.train())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "s refers back to the value already stored under that name.",
              ".train(...) calls the train method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach already has a general version of something in the team's training facility, and now needs a more specialized version that's almost the same, with one extra twist.",
          "question": "What should the new coach do to build that specialized version?",
          "optionA": "Build it on top of the general version, reusing what already works and only adding the extra twist",
          "optionB": "Start completely from scratch, rewriting everything the general version already had",
          "correctOption": "A",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "A daughter learns a family recipe that has been passed down through generations.",
            "prompt": "Did she create it herself?",
            "image": "/scenario-art/images/Daily/16_1.jpg"
          },
          {
            "scenario": "She decides to make the recipe in her own style.",
            "prompt": "Can she still add her own special ingredient to the recipe?",
            "image": "/scenario-art/images/Daily/16_2.jpg"
          },
          {
            "scenario": "The recipe is now prepared using both the traditional method and her improvements.",
            "prompt": "What does the final recipe contain?",
            "image": "/scenario-art/images/Daily/16_3.jpg"
          }
        ],
        "example": {
          "code": "class Account:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.balance = balance\n    def statement(self):\n        return f\"{self.owner}: {self.balance}\"\n\nclass SavingsAccount(Account):\n    def statement(self):\n        base = super().statement()\n        return base + \" (earning interest)\"\n\ns = SavingsAccount(\"Priya\", 500)\nprint(s.statement())",
          "explanation": "SavingsAccount inherits owner/balance and reuses Account's statement() via super(), only adding what's different.",
          "syntaxBreakdown": [
          {
            "code": "class Account:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Account is the name being given to this class (this blueprint) — every object made from it will be created by calling Account(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, owner, balance):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "owner is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "balance is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.owner = owner",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "owner refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.balance = balance",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "balance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def statement(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "statement is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.owner}: {self.balance}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string — anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "\": \" is plain literal text — it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "class SavingsAccount(Account):",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "SavingsAccount is the name being given to this class (this blueprint) — every object made from it will be created by calling SavingsAccount(...).",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "Account is the parent class this one inherits from — it automatically gets all of Account's methods, unless it defines its own version to override them.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def statement(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "statement is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "base = super().statement()",
            "points": [
              "base is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "super() gives access to the parent class's version of a method, so it can be reused instead of rewritten.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              ".statement(...) calls the statement method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "return base + \" (earning interest)\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "base refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              " (earning interest) is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "s = SavingsAccount(\"Priya\", 500)",
            "points": [
              "s is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "SavingsAccount(...) creates a new SavingsAccount object — Python runs SavingsAccount's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "500 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(s.statement())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "s refers back to the value already stored under that name.",
              ".statement(...) calls the statement method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate already has a general version of something in your shared apartment, and now needs a more specialized version that's almost the same, with one extra twist.",
          "question": "What should your roommate do to build that specialized version?",
          "optionA": "Build it on top of the general version, reusing what already works and only adding the extra twist",
          "optionB": "Start completely from scratch, rewriting everything the general version already had",
          "correctOption": "A",
          "image": ""
        }
      },
      "philosophy": {
        "background": "Charles Darwin proposed that living organisms evolve from common ancestors. Different species inherit many characteristics from earlier generations while also developing their own unique adaptations.",
        "scenarios": [
          {
            "scenario": "Dogs, wolves, and foxes share many physical characteristics.",
            "prompt": "What similarities suggest that these animals are related?",
            "image": ""
          },
          {
            "scenario": "Despite their similarities, each species behaves differently and has unique abilities.",
            "prompt": "How can they be alike while still being different?",
            "image": ""
          },
          {
            "scenario": "Scientists discover a newly evolved species with traits similar to wolves but also possessing new characteristics.",
            "prompt": "How would scientists explain both the similarities and the differences?",
            "image": ""
          }
        ],
        "example": {
          "code": "class Philosopher:\n    def __init__(self, name):\n        self.name = name\n    def argue(self):\n        return f\"{self.name} reasons carefully\"\n\nclass Empiricist(Philosopher):\n    def argue(self):\n        base = super().argue()\n        return base + \" from direct experience\"\n\ne = Empiricist(\"Locke\")\nprint(e.argue())",
          "explanation": "Empiricist inherits name and reuses Philosopher's argue() through super(), adding only what makes it distinct.",
          "syntaxBreakdown": [
          {
            "code": "class Account:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Account is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Account(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, owner, balance):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "owner is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "balance is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.owner = owner",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "owner refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.balance = balance",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "balance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def statement(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "statement is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.owner}: {self.balance}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string \u2014 anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "\": \" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "class SavingsAccount(Account):",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "SavingsAccount is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling SavingsAccount(...).",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "Account is the parent class this one inherits from \u2014 it automatically gets all of Account's methods, unless it defines its own version to override them.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def statement(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "statement is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "base = super().statement()",
            "points": [
              "base is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "super() gives access to the parent class's version of a method, so it can be reused instead of rewritten.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              ".statement(...) calls the statement method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "return base + \" (earning interest)\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "base refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              " (earning interest) is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "s = SavingsAccount(\"Priya\", 500)",
            "points": [
              "s is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "SavingsAccount(...) creates a new SavingsAccount object \u2014 Python runs SavingsAccount's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "500 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(s.statement())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "s refers back to the value already stored under that name.",
              ".statement(...) calls the statement method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor already has a general version of something in the seminar room, and now needs a more specialized version that's almost the same, with one extra twist.",
          "question": "What should the philosophy professor do to build that specialized version?",
          "optionA": "Build it on top of the general version, reusing what already works and only adding the extra twist",
          "optionB": "Start completely from scratch, rewriting everything the general version already had",
          "correctOption": "A",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "One Curry, Many Variations",
        "scenarios": [
          {
            "scenario": "Your mother prepares a basic curry gravy with onions, tomatoes, and spices.",
            "prompt": "Why make the gravy before deciding the final dish?",
            "image": "/scenario-art/images/Food/16_1.jpeg",
            "reasoningKeyPoints": [
              "It forms a common base",
              "Many dishes can start from it",
              "The foundation is shared"
            ]
          },
          {
            "scenario": "She adds paneer to one pan and potatoes to another.",
            "prompt": "How are these dishes similar and different?",
            "image": "/scenario-art/images/Food/16_2.jpeg",
            "reasoningKeyPoints": [
              "They share the same gravy",
              "Each has its own ingredient",
              "Both are related"
            ]
          },
          {
            "scenario": "Later she prepares mixed vegetable curry using the same gravy again.",
            "prompt": "Why didn't she prepare a completely new gravy?",
            "image": "/scenario-art/images/Food/16_3.jpeg",
            "reasoningKeyPoints": [
              "Reuse what already exists",
              "Only the final ingredient changes",
              "The common base stays the same"
            ]
          }
        ],
        "example": {
          "code": "class Dish:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n    def describe(self):\n        return f\"{self.name}: ${self.price}\"\n\nclass SpicyDish(Dish):\n    def describe(self):\n        base = super().describe()\n        return base + \" (very spicy!)\"\n\nd = SpicyDish(\"Vindaloo\", 11)\nprint(d.describe())",
          "explanation": "SpicyDish inherits name/price and reuses Dish's describe() via super(), only adding the spice warning on top.",
          "syntaxBreakdown": [
          {
            "code": "class Account:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Account is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Account(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, owner, balance):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "owner is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "balance is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.owner = owner",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "owner refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.balance = balance",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "balance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def statement(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "statement is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.owner}: {self.balance}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string \u2014 anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "\": \" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "class SavingsAccount(Account):",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "SavingsAccount is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling SavingsAccount(...).",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "Account is the parent class this one inherits from \u2014 it automatically gets all of Account's methods, unless it defines its own version to override them.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def statement(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "statement is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "base = super().statement()",
            "points": [
              "base is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "super() gives access to the parent class's version of a method, so it can be reused instead of rewritten.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included.",
              ".statement(...) calls the statement method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "return base + \" (earning interest)\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "base refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              " (earning interest) is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "s = SavingsAccount(\"Priya\", 500)",
            "points": [
              "s is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "SavingsAccount(...) creates a new SavingsAccount object \u2014 Python runs SavingsAccount's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "500 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(s.statement())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "s refers back to the value already stored under that name.",
              ".statement(...) calls the statement method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef already has a general version of something in the restaurant kitchen, and now needs a more specialized version that's almost the same, with one extra twist.",
          "question": "What should the head chef do to build that specialized version?",
          "optionA": "Start completely from scratch, rewriting everything the general version already had",
          "optionB": "Build it on top of the general version, reusing what already works and only adding the extra twist",
          "correctOption": "B",
          "image": ""
        }
      },
            "environmental": {
        "background": "While studying the Galápagos Islands, Charles Darwin observed several species of finches. Although they shared a common ancestor, each species developed unique beak shapes adapted to different food sources. New species often retain inherited characteristics while developing adaptations suited to new environments.",
        "scenarios": [
          {
            "scenario": "Several finch species share similar body structures.",
            "prompt": "What suggests that these birds are related?",
            "image": ""
          },
          {
            "scenario": "Some finches eat seeds, while others feed on insects or cactus flowers.",
            "prompt": "Why do closely related species develop different characteristics?",
            "image": ""
          },
          {
            "scenario": "Scientists discover another finch species with both familiar and new features.",
            "prompt": "How would they explain the similarities and the differences?",
            "image": ""
          }
        ],
        "example": {
          "code": "class Philosopher:\n    def __init__(self, name):\n        self.name = name\n    def argue(self):\n        return f\"{self.name} reasons carefully\"\n\nclass Empiricist(Philosopher):\n    def argue(self):\n        base = super().argue()\n        return base + \" from direct experience\"\n\ne = Empiricist(\"Locke\")\nprint(e.argue())",
          "explanation": "Programming uses inheritance to create new structures that reuse existing characteristics while introducing new behavior.",
          "syntaxBreakdown": [
          {
            "code": "class Account:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Account is the name being given to this class (this blueprint) — every object made from it will be created by calling Account(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def __init__(self, owner, balance):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "__init__ is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "owner is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The comma separates this from the next item in the list.",
              "balance is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self.owner = owner",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "owner refers back to the value already stored under that name."
            ]
          },
          {
            "code": "self.balance = balance",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "balance refers back to the value already stored under that name."
            ]
          },
          {
            "code": "def statement(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "statement is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "return f\"{self.owner}: {self.balance}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string — anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".owner reaches into the object on the left and grabs the piece of data stored there under the name owner.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "\": \" is plain literal text — it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              ".balance reaches into the object on the left and grabs the piece of data stored there under the name balance.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "class SavingsAccount(Account):",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "SavingsAccount is the name being given to this class (this blueprint) — every object made from it will be created by calling SavingsAccount(...).",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "Account is the parent class this one inherits from — it automatically gets all of Account's methods, unless it defines its own version to override them.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def statement(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "statement is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "base = super().statement()",
            "points": [
              "base is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "super() gives access to the parent class's version of a method, so it can be reused instead of rewritten.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included.",
              ".statement(...) calls the statement method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "return base + \" (earning interest)\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "base refers back to the value already stored under that name.",
              "+ adds the two sides together (or joins them, if they're text).",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              " (earning interest) is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "s = SavingsAccount(\"Priya\", 500)",
            "points": [
              "s is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "SavingsAccount(...) creates a new SavingsAccount object — Python runs SavingsAccount's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The opening \" starts a string — it tells Python \"everything from here until the matching \" is text, not code\".",
              "Priya is the actual text (the string) itself — this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here.",
              "The comma separates this from the next item in the list.",
              "500 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(s.statement())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "s refers back to the value already stored under that name.",
              ".statement(...) calls the statement method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A kitten is born with the same whisker length and fur pattern as its mother cat.",
          "question": "Where did the kitten's whiskers and fur pattern most likely come from?",
          "optionA": "It inherited those traits from its parent",
          "optionB": "Those traits appeared with no connection to its parent at all",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "A subclass inherits attributes and methods from a parent class, can override specific methods, and can reuse the parent's version with super().",
    "conceptIntro": "class Child(Parent): makes Child inherit everything from Parent. Child can override a method to change its behavior, and use super().method() to still call the parent's original version instead of duplicating its code.",
    "reinforcement": {
      "prompt": "Create a class Animal with a speak() method, then a subclass Dog that overrides speak() but also calls the parent version using super().",
      "hint": "Use super().speak() inside Dog's speak() method.",
      "keyPoints": [
        "Dog inherits from Animal",
        "Dog overrides the speak method",
        "super() is used to reuse the parent's method"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "A subclass ____ the attributes and methods of its parent class.",
        "options": [
          "inherits",
          "deletes",
          "hides",
          "copies"
        ],
        "answer": "inherits",
        "hint": "A subclass inherits its parent's attributes and methods automatically."
      },
      "code": {
        "text": "class Dog(____):\n    pass",
        "options": [
          "Animal",
          "self",
          "object",
          "class"
        ],
        "answer": "Animal",
        "hint": "The parent class name goes in parentheses after the subclass name to set up inheritance."
      }
    }
  },
  {
    "conceptSlug": "abstraction",
    "themes": {
      "sports": {
        "scenarios": [
          {
            "scenario": "An athlete begins training simply by following the coach's instruction to \"Start.\"",
            "prompt": "How would you set things up so the athlete only needs to follow one simple instruction?",
            "image": "/scenario-art/images/Sports/18_1.jpg"
          },
          {
            "scenario": "Behind the scenes, the coach has already prepared the equipment, checked attendance, and organized the drills.",
            "prompt": "Should these internal steps be exposed directly to the athlete, or hidden behind the one instruction?",
            "image": "/scenario-art/images/Sports/18_2.jpg"
          },
          {
            "scenario": "The coach changes how training is organized, but the athletes still begin practice the same way.",
            "prompt": "Why does hiding these internal steps make it safe to change how training is organized?",
            "image": "/scenario-art/images/Sports/18_3.jpg"
          }
        ],
        "example": {
          "code": "class Workout:\n    def _calibrate(self):\n        pass\n    def _log_heart_rate(self):\n        pass\n    def start_workout(self):\n        self._calibrate()\n        self._log_heart_rate()\n        return \"Workout started\"\n\nw = Workout()\nprint(w.start_workout())",
          "explanation": "The user only ever calls start_workout() — the calibration and logging details stay hidden behind that one simple interface.",
          "syntaxBreakdown": [
          {
            "code": "class Workout:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Workout is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Workout(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def _calibrate(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "_calibrate is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing \u2014 it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def _log_heart_rate(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "_log_heart_rate is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing \u2014 it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def start_workout(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "start_workout is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self._calibrate()",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "._calibrate(...) calls the _calibrate method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "self._log_heart_rate()",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "._log_heart_rate(...) calls the _log_heart_rate method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "return \"Workout started\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The opening \" starts a string \u2014 it tells Python \"everything from here until the matching \" is text, not code\".",
              "Workout started is the actual text (the string) itself \u2014 this is exactly what it will contain.",
              "The closing \" ends the string, telling Python the text stops here."
            ]
          },
          {
            "code": "w = Workout()",
            "points": [
              "w is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Workout(...) creates a new Workout object \u2014 Python runs Workout's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(w.start_workout())",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "w refers back to the value already stored under that name.",
              ".start_workout(...) calls the start_workout method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The new coach wants to use a complicated tool in the team's training facility without needing to learn every internal step of how it works.",
          "question": "What should the tool's design let the new coach do?",
          "optionA": "Require the new coach to manually perform every internal step themselves each time",
          "optionB": "Use one simple action to trigger it, with all the complicated steps handled invisibly behind the scenes",
          "correctOption": "B",
          "image": ""
        }
      },
            "daily-life": {
        "scenarios": [
          {
            "scenario": "You use a TV remote every day. You press the Power button.",
            "prompt": "What do you expect to happen?",
            "image": "/scenario-art/images/Daily/17_1.jpg"
          },
          {
            "scenario": "You continue using the remote without knowing how it works internally.",
            "prompt": "Do you need to understand the internal circuits of the remote to use it?",
            "image": "/scenario-art/images/Daily/17_2.jpg"
          },
          {
            "scenario": "You use the remote comfortably every day.",
            "prompt": "Why is this convenient?",
            "image": "/scenario-art/images/Daily/17_3.jpg"
          }
        ],
        "example": {
          "code": "class Thermostat:\n    def _read_temp(self):\n        pass\n    def _send_signal(self, target):\n        pass\n    def set_temperature(self, target):\n        self._read_temp()\n        self._send_signal(target)\n        return f\"Set to {target}\"\n\nt = Thermostat()\nprint(t.set_temperature(22))",
          "explanation": "Users only ever call set_temperature() — the sensor reading and signaling details stay hidden behind that one method.",
          "syntaxBreakdown": [
          {
            "code": "class Thermostat:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Thermostat is the name being given to this class (this blueprint) — every object made from it will be created by calling Thermostat(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def _read_temp(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "_read_temp is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing — it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def _send_signal(self, target):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "_send_signal is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "target is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing — it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def set_temperature(self, target):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "set_temperature is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "target is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self._read_temp()",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "._read_temp(...) calls the _read_temp method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "self._send_signal(target)",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "._send_signal(...) calls the _send_signal method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "target refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "return f\"Set to {target}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string — anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "\"Set to \" is plain literal text — it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "target refers back to the value already stored under that name.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "t = Thermostat()",
            "points": [
              "t is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Thermostat(...) creates a new Thermostat object — Python runs Thermostat's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(t.set_temperature(22))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "t refers back to the value already stored under that name.",
              ".set_temperature(...) calls the set_temperature method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "22 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "Your roommate wants to use a complicated tool in your shared apartment without needing to learn every internal step of how it works.",
          "question": "What should the tool's design let your roommate do?",
          "optionA": "Use one simple action to trigger it, with all the complicated steps handled invisibly behind the scenes",
          "optionB": "Require your roommate to manually perform every internal step themselves each time",
          "correctOption": "A",
          "image": ""
        }
      },
      "philosophy": {
        "background": "In Plato's famous Allegory of the Cave, prisoners spend their lives watching shadows projected on a wall. Since they cannot see the real objects creating those shadows, they believe the shadows are reality itself.",
        "scenarios": [
          {
            "scenario": "The prisoners observe moving shadows every day.",
            "prompt": "Can they understand the objects creating the shadows simply by watching them?",
            "image": ""
          },
          {
            "scenario": "One prisoner leaves the cave and discovers the fire and the real objects behind the shadows.",
            "prompt": "How has this new knowledge changed the prisoner's understanding?",
            "image": ""
          },
          {
            "scenario": "The freed prisoner returns and explains the outside world, but the others refuse to believe him.",
            "prompt": "Why do people often rely only on what they can directly observe?",
            "image": ""
          }
        ],
        "example": {
          "code": "class ArgumentChecker:\n    def _parse(self, text):\n        pass\n    def _apply_rules(self, parsed):\n        pass\n    def check_argument(self, text):\n        parsed = self._parse(text)\n        self._apply_rules(parsed)\n        return \"Checked\"\n\nc = ArgumentChecker()\nprint(c.check_argument(\"All men are mortal\"))",
          "explanation": "Students only ever call check_argument() — the parsing and rule-checking stay hidden behind that single simple interface.",
          "syntaxBreakdown": [
          {
            "code": "class Thermostat:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Thermostat is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Thermostat(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def _read_temp(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "_read_temp is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing \u2014 it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def _send_signal(self, target):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "_send_signal is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "target is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing \u2014 it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def set_temperature(self, target):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "set_temperature is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "target is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self._read_temp()",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "._read_temp(...) calls the _read_temp method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "self._send_signal(target)",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "._send_signal(...) calls the _send_signal method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "target refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "return f\"Set to {target}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string \u2014 anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "\"Set to \" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "target refers back to the value already stored under that name.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "t = Thermostat()",
            "points": [
              "t is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Thermostat(...) creates a new Thermostat object \u2014 Python runs Thermostat's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(t.set_temperature(22))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "t refers back to the value already stored under that name.",
              ".set_temperature(...) calls the set_temperature method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "22 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The philosophy professor wants to use a complicated tool in the seminar room without needing to learn every internal step of how it works.",
          "question": "What should the tool's design let the philosophy professor do?",
          "optionA": "Require the philosophy professor to manually perform every internal step themselves each time",
          "optionB": "Use one simple action to trigger it, with all the complicated steps handled invisibly behind the scenes",
          "correctOption": "B",
          "image": ""
        }
      },
      "food": {
        "storyTitle": "Using the Pressure Cooker",
        "scenarios": [
          {
            "scenario": "Your mother puts rice and water into a pressure cooker and closes the lid.",
            "prompt": "Does she need to watch every grain cook inside?",
            "image": "/scenario-art/images/Food/17_1.jpeg",
            "reasoningKeyPoints": [
              "Only the basic steps matter",
              "The cooking happens inside",
              "She doesn't need every detail"
            ]
          },
          {
            "scenario": "The cooker whistles a few times while everyone waits.",
            "prompt": "Why doesn't anyone open the cooker after every whistle to check the rice?",
            "image": "/scenario-art/images/Food/17_2.jpeg",
            "reasoningKeyPoints": [
              "The cooker handles the process",
              "The internal work stays hidden",
              "Trust the process"
            ]
          },
          {
            "scenario": "After switching off the stove, your mother opens the cooker and perfectly cooked rice is ready.",
            "prompt": "Why was it enough to simply use the cooker correctly?",
            "image": "/scenario-art/images/Food/17_3.jpeg",
            "reasoningKeyPoints": [
              "The complicated work happened automatically",
              "Only the important steps were needed",
              "The user focuses on the result, not the internal process"
            ]
          }
        ],
        "example": {
          "code": "class CoffeeMachine:\n    def _heat_water(self):\n        pass\n    def _grind_beans(self):\n        pass\n    def brew(self):\n        self._heat_water()\n        self._grind_beans()\n        return \"Coffee ready\"\n\nm = CoffeeMachine()\nprint(m.brew())",
          "explanation": "The user only ever calls brew() — heating and grinding stay hidden behind that one simple method.",
          "syntaxBreakdown": [
          {
            "code": "class Thermostat:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects \u2014 everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Thermostat is the name being given to this class (this blueprint) \u2014 every object made from it will be created by calling Thermostat(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def _read_temp(self):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "_read_temp is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing \u2014 it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def _send_signal(self, target):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "_send_signal is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "target is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing \u2014 it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def set_temperature(self, target):",
            "points": [
              "def is the keyword that starts a function definition \u2014 everything indented below it becomes that function's body.",
              "set_temperature is the name being given to this function \u2014 this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "target is a parameter \u2014 a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self._read_temp()",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "._read_temp(...) calls the _read_temp method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "self._send_signal(target)",
            "points": [
              "self refers to \"this particular object\" \u2014 whichever one the method is currently being run on.",
              "._send_signal(...) calls the _send_signal method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "target refers back to the value already stored under that name.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "return f\"Set to {target}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string \u2014 anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "\"Set to \" is plain literal text \u2014 it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string \u2014 whatever is written up to the matching } gets evaluated and dropped in as text.",
              "target refers back to the value already stored under that name.",
              "The closing curly brace closes this expression slot \u2014 everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "t = Thermostat()",
            "points": [
              "t is a variable name \u2014 a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left \u2014 from this point on, that name holds that value.",
              "Thermostat(...) creates a new Thermostat object \u2014 Python runs Thermostat's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          },
          {
            "code": "print(t.set_temperature(22))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "t refers back to the value already stored under that name.",
              ".set_temperature(...) calls the set_temperature method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "22 is a number, used here as a literal value.",
              "The closing parenthesis closes the call \u2014 everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "The head chef wants to use a complicated tool in the restaurant kitchen without needing to learn every internal step of how it works.",
          "question": "What should the tool's design let the head chef do?",
          "optionA": "Use one simple action to trigger it, with all the complicated steps handled invisibly behind the scenes",
          "optionB": "Require the head chef to manually perform every internal step themselves each time",
          "correctOption": "A",
          "image": ""
        }
      },
            "environmental": {
        "background": "A healthy forest appears peaceful from the outside, yet beneath the soil exists a vast underground network of fungi, microorganisms, roots, and nutrients constantly exchanging resources. Most of these interactions remain invisible to casual observers. Many natural systems hide enormous complexity beneath simple, visible interactions. Understanding every internal detail is not always necessary to use or appreciate the system.",
        "scenarios": [
          {
            "scenario": "Visitors admire healthy trees without seeing what happens underground.",
            "prompt": "Can the forest function only because of what is visible above the ground?",
            "image": ""
          },
          {
            "scenario": "Scientists discover underground fungal networks connecting many different trees.",
            "prompt": "Why were these important processes unnoticed for so long?",
            "image": ""
          },
          {
            "scenario": "Even after learning about these underground systems, visitors continue enjoying the forest without needing to understand every biological interaction.",
            "prompt": "Is it always necessary to know every hidden process to benefit from the system?",
            "image": ""
          }
        ],
        "example": {
          "code": "class ArgumentChecker:\n    def _parse(self, text):\n        pass\n    def _apply_rules(self, parsed):\n        pass\n    def check_argument(self, text):\n        parsed = self._parse(text)\n        self._apply_rules(parsed)\n        return \"Checked\"\n\nc = ArgumentChecker()\nprint(c.check_argument(\"All men are mortal\"))",
          "explanation": "Programming applies the same principle through abstraction, allowing us to use systems without needing to understand every implementation detail.",
          "syntaxBreakdown": [
          {
            "code": "class Thermostat:",
            "points": [
              "class is the keyword that starts a blueprint for creating objects — everything indented below it defines what every object made from this blueprint will have and be able to do.",
              "Thermostat is the name being given to this class (this blueprint) — every object made from it will be created by calling Thermostat(...).",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "def _read_temp(self):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "_read_temp is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing — it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def _send_signal(self, target):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "_send_signal is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "target is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "pass",
            "points": [
              "pass is a placeholder that does nothing — it's here because Python requires an indented block after a colon, even an empty one."
            ]
          },
          {
            "code": "def set_temperature(self, target):",
            "points": [
              "def is the keyword that starts a function definition — everything indented below it becomes that function's body.",
              "set_temperature is the name being given to this function — this is what you'll call it by everywhere else in the code.",
              "The opening parenthesis marks the start of the list of parameters this function accepts.",
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "The comma separates this from the next item in the list.",
              "target is a parameter — a placeholder name that will receive whatever value gets passed in for it when this function is called.",
              "The closing parenthesis marks the end of the parameter list.",
              "The colon marks the end of this line's header and signals that an indented block follows right below."
            ]
          },
          {
            "code": "self._read_temp()",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "._read_temp(...) calls the _read_temp method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "self._send_signal(target)",
            "points": [
              "self refers to \"this particular object\" — whichever one the method is currently being run on.",
              "._send_signal(...) calls the _send_signal method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "target refers back to the value already stored under that name.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "return f\"Set to {target}\"",
            "points": [
              "return sends a value back out of the function to wherever it was called from, and immediately ends the function.",
              "The f right before the opening quote marks this as an f-string — anything inside curly braces {} gets swapped out for its live value instead of being treated as plain text.",
              "The opening quote starts the string.",
              "\"Set to \" is plain literal text — it appears exactly as written, with nothing substituted in.",
              "The opening curly brace opens a live expression slot inside the f-string — whatever is written up to the matching } gets evaluated and dropped in as text.",
              "target refers back to the value already stored under that name.",
              "The closing curly brace closes this expression slot — everything between { and } has now been evaluated and inserted.",
              "The closing quote ends the f-string."
            ]
          },
          {
            "code": "t = Thermostat()",
            "points": [
              "t is a variable name — a label we're about to store a value under.",
              "The equals sign assigns the value on the right to the name on the left — from this point on, that name holds that value.",
              "Thermostat(...) creates a new Thermostat object — Python runs Thermostat's __init__ behind the scenes, handing it whatever is inside these parentheses to set the new object up.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          },
          {
            "code": "print(t.set_temperature(22))",
            "points": [
              "print is a function used to display whatever is given to it on the console, so users (or we) can see it.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "t refers back to the value already stored under that name.",
              ".set_temperature(...) calls the set_temperature method (a function that belongs to the object on the left), handing it whatever is inside these parentheses.",
              "The opening parenthesis marks the start of whatever is being handed over in this call.",
              "22 is a number, used here as a literal value.",
              "The closing parenthesis closes the call — everything needed has now been included."
            ]
          }
        ]
        },
        "decisionScenario": {
          "scenario": "A dog simply barks when the doorbell rings, without knowing anything about the wiring or electronics inside the doorbell.",
          "question": "Does the dog need to understand the doorbell's internal wiring in order to react to it?",
          "optionA": "No, it only needs to notice the sound and react to it",
          "optionB": "Yes, it must first understand the full internal wiring",
          "correctOption": "A",
          "image": ""
        }
      }
    },
    "conceptHint": "Abstraction hides internal complexity behind a simple method or interface, so users interact with the 'what' without needing the 'how'.",
    "conceptIntro": "Abstraction means exposing only what's necessary through a simple method, while the complicated steps happen privately behind the scenes. Callers use the simple interface without needing to understand or reproduce the internal logic.",
    "reinforcement": {
      "prompt": "Write a class CoffeeMachine with a public brew() method that internally calls two private helper methods (_heat_water and _grind_beans) without the caller needing to know about them.",
      "hint": "Define the private helpers with a leading underscore and call them from inside brew().",
      "keyPoints": [
        "brew() is the single public method",
        "Internal steps are private helper methods",
        "Caller only ever calls brew(), not the internal steps directly"
      ]
    },
    "blanks": {
      "conceptual": {
        "text": "Abstraction means hiding complex details behind a ____ interface.",
        "options": [
          "simple",
          "complicated",
          "private",
          "broken"
        ],
        "answer": "simple",
        "hint": "A simple interface is what abstraction hides the complicated internal steps behind."
      },
      "code": {
        "text": "car.____()  # user doesn't need to know how the engine works",
        "options": [
          "start",
          "engine_ignition_sequence",
          "spark_calc",
          "fuel_ratio"
        ],
        "answer": "start",
        "hint": "start() is the single public method the user calls, without seeing what's inside it."
      }
    }
  }
];


async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    await Challenge.insertMany(challenges);
    console.log(`Seeded ${challenges.length} discovery challenges (5 themes x [3 free-text scenarios + 1 decision scenario + 1 worked example] + blanks each)`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();