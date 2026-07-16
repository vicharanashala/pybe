export interface GuidedExample {
  id: string;
  title: string;
  code: string;
  explanation: string;
  whyExplanation: string;
  tryItYourself: {
    instruction: string;
    starterCode: string;
    expectedOutputContains: string[];
    successMessage: string;
    hint: string;
  };
}

export interface QuizQuestionData {
  id: string;
  type: 'mcq' | 'fill_blank' | 'predict_output' | 'debug';
  concept: string;
  question: string;
  codeContext?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface VariableMatchPair {
  name: string;
  value: string;
}

export interface LearningPathModule {
  title: string;
  simpleExplanation: string;
  funnyScenario: string;
  voiceLines: string[];
  examples: GuidedExample[];
  games: {
    game1_nameTheBox: {
      value: string;
      choices: string[];
      correct: string;
    };
    game2_fixTheVariable: {
      buggyCode: string;
      prompt: string;
      correctAnswer: string;
      starterCode: string;
    };
    game3_treasureHunt: {
      prompt: string;
      requiredVariables: string[];
      starterCode: string;
    };
    game4_matchGame: {
      pairs: VariableMatchPair[];
    };
    game5_finalChallenge: {
      prompt: string;
      starterCode: string;
      expectedOutputContains: string[];
    };
  };
}

export const VARIABLES_MODULE: LearningPathModule = {
  title: "Variables — Python’s Storage Boxes",
  funnyScenario: "“A variable is like a labelled lunch box. If the label says `score`, Python knows what is inside that box.”",
  simpleExplanation: "A variable stores information. The left side is the variable name. The right side is the value. `=` means “store this value in this variable.” It does NOT mean “is equal to” in this situation.",
  voiceLines: [
    "Welcome, future wizard! Think of a variable as a labeled lunch box. If the label says score, Python knows exactly what's inside!",
    "Let's look at Ravi's box. It has name 'Ravi', age 21, and score 100.",
    "The left side is the label name, the right side is the value, and the single equals sign means STORE THIS VALUE!",
    "Don't worry, we will practice with 5 beautiful, real-world examples right now!",
    "Remember to type the code yourself so your brain can absorb the magic."
  ],
  examples: [
    {
      id: "var_ex1",
      title: "Example 1: Student Name",
      code: `name = "Ravi"\nprint(name)`,
      explanation: "`name` stores the text `\"Ravi\"`. `print(name)` displays the value stored in the box.",
      whyExplanation: "We use a variable like `name` so we can store any student's name once and print it or change it later without rewriting all print statements!",
      tryItYourself: {
        instruction: "Create a variable called `student_name` and store your own name inside it as text. Then print it!",
        starterCode: "# Create student_name and store your name\nstudent_name = \nprint(student_name)",
        expectedOutputContains: [], // We will validate if student_name is defined
        successMessage: "Splendid job, Code Explorer! Python now knows your name! 😄",
        hint: "Write: student_name = \"YourName\" on the first line, then run it."
      }
    },
    {
      id: "var_ex2",
      title: "Example 2: Student Age",
      code: `age = 21\nprint(age)`,
      explanation: "Numbers do not need quotation marks. If you put quotes, Python treats it like words instead of a number!",
      whyExplanation: "We store age as a plain number (without quotes) so Python can perform mathematical calculations (like adding years) on it later.",
      tryItYourself: {
        instruction: "Create a variable called `my_age` and store your age as a number. Then print it!",
        starterCode: "# Create my_age variable\n",
        expectedOutputContains: [],
        successMessage: "Boom! You stored a number safely. No quotes needed! 🎉",
        hint: "Write: my_age = 21 (or your age) and print(my_age)."
      }
    },
    {
      id: "var_ex3",
      title: "Example 3: Game Score Power-Up",
      code: `score = 0\nscore = score + 10\nprint(score)`,
      explanation: "The score starts at 0. Then Python adds 10 to the old score and stores the new value back inside `score`.",
      whyExplanation: "Variables are dynamic storage slots! Instead of having a locked number, score variables can constantly increase or decrease as the game is played.",
      tryItYourself: {
        instruction: "Start with a variable `coins` set to 5. Add 10 coins to it, and print the final coins.",
        starterCode: "# Start with coins = 5\ncoins = 5\n# Add 10 coins here\n\n# Print final coins\nprint(coins)",
        expectedOutputContains: ["15"],
        successMessage: "Your score got a power-up! From 5 to 15. Tiny victory dance! 💃✨",
        hint: "Add 10 by writing: coins = coins + 10 or coins += 10."
      }
    },
    {
      id: "var_ex4",
      title: "Example 4: Car Game Variables",
      code: `car_name = "Speedy"\nspeed = 80\nfuel = 50\n\nprint(car_name)\nprint(speed)\nprint(fuel)`,
      explanation: "Use meaningful names because they explain the purpose of the value. It makes your code highly readable!",
      whyExplanation: "Why not name variables 'a' and 'b'? If you write a = 80, b = 50, the code works perfectly, but nobody knows what a and b mean. Use descriptive names in real programs, and keep a and b only for tiny, quick tests.",
      tryItYourself: {
        instruction: "Create three variables: `player_name` with \"Ravi\", `player_score` with 500, and `player_health` with 100. Print all three.",
        starterCode: "# Create player_name, player_score, and player_health\n",
        expectedOutputContains: ["Ravi", "500", "100"],
        successMessage: "Outstanding! Your player card has descriptive, clean variable tags. 🏆",
        hint: "player_name = \"Ravi\"\nplayer_score = 500\nplayer_health = 100\nprint(player_name)\n..."
      }
    },
    {
      id: "var_ex5",
      title: "Example 5: x and y Coordinates",
      code: `car_x = 10\ncar_y = 5\nprint("Car X:", car_x)\nprint("Car Y:", car_y)`,
      explanation: "`car_x` represents left-right position, and `car_y` represents up-down position. Coordinate grids use variables to move characters seamlessly.",
      whyExplanation: "X and Y coordinates are industry standards for describing spatial layouts in 2D gaming, physics, and design grids.",
      tryItYourself: {
        instruction: "Change `car_x` to 20 and `car_y` to 10 so our car shifts on the interactive map! Then print both.",
        starterCode: "car_x = 20\ncar_y = 10\nprint(car_x)\nprint(car_y)",
        expectedOutputContains: ["20", "10"],
        successMessage: "Vroom! The car raced to its new coordinate position on the grid! 🏎️💨",
        hint: "Assign 20 to car_x and 10 to car_y, then print both on separate lines."
      }
    }
  ],
  games: {
    game1_nameTheBox: {
      value: "Value is: 90 (representing speed limit)",
      choices: ["a", "speed", "hello", "banana"],
      correct: "speed"
    },
    game2_fixTheVariable: {
      buggyCode: "player score = 100",
      prompt: "Variable names cannot have spaces! Fix this code so it compiles cleanly:",
      correctAnswer: "player_score = 100",
      starterCode: "player score = 100"
    },
    game3_treasureHunt: {
      prompt: "A locked ancient pirate chest is found! Initialize exactly 4 storage variables to crack the chest: `gold` set to 500, `has_map` set to True, `key_color` set to \"Golden\", and `is_door_open` set to False.",
      requiredVariables: ["gold", "has_map", "key_color", "is_door_open"],
      starterCode: `# Crack the pirate chest!\ngold = \nhas_map = \nkey_color = \nis_door_open = \n`
    },
    game4_matchGame: {
      pairs: [
        { name: "health", value: "100" },
        { name: "player_name", value: '"Ravi"' },
        { name: "is_game_over", value: "False" }
      ]
    },
    game5_finalChallenge: {
      prompt: "Construct a complete Mini Car Game Profile! Create: `car_name` with \"Hyper\", `speed` with 120, `fuel` with 95, `car_x` with 35, `car_y` with 45. Then print all five variables on separate lines.",
      starterCode: `# Build your hyper racer profile!\n`,
      expectedOutputContains: ["Hyper", "120", "95", "35", "45"]
    }
  }
};

export const INPUT_OUTPUT_MODULE: LearningPathModule = {
  title: "Input and Output — Talking with the User",
  funnyScenario: "“Output is Python talking to us. Input is Python asking us a question.”",
  simpleExplanation: "To communicate, computer systems need input and output. `print()` handles output, and `input()` handles user queries, returning their typing as a text string.",
  voiceLines: [
    "Hey there! Ready to converse with Python? Output is Python talking to us, and Input is Python asking us a question!",
    "Think of it like a conversation with a friendly robot.",
    "We use the print command to output words, and input command to listen to what the user writes back.",
    "Let's practice talking with Python across 6 spectacular guided exercises!",
    "Remember: code typed manually builds muscle memory. Let's make this robot speak!"
  ],
  examples: [
    {
      id: "io_ex1",
      title: "Example 1: Output using print()",
      code: `print("Hello, Ravi!")`,
      explanation: "`print()` displays a line of text on the screen. Anything inside the quotes is outputted exactly.",
      whyExplanation: "We use print() to communicate status updates, values, victory messages, and logs directly back to our user.",
      tryItYourself: {
        instruction: "Print the phrase: \"Welcome to Pybe!\" exactly on the screen.",
        starterCode: "# Print the welcome message\n",
        expectedOutputContains: ["Welcome to Pybe!"],
        successMessage: "Splendid speaking! The Python terminal echoes your welcome! 🗣️✨",
        hint: "Write: print(\"Welcome to Pybe!\")"
      }
    },
    {
      id: "io_ex2",
      title: "Example 2: Printing Variables",
      code: `name = "Ravi"\nprint(name)`,
      explanation: "When you print a variable name, Python does NOT print its label. It opens the box and prints the value inside!",
      whyExplanation: "Printing variables lets us output dynamic values (like current player points or scores) that change over time.",
      tryItYourself: {
        instruction: "Create a variable called `favorite_game` and set it to \"Car Racing\". Print the variable.",
        starterCode: "# Define favorite_game and print it\n",
        expectedOutputContains: ["Car Racing"],
        successMessage: "Brilliant! You fetched the variable's value and printed it perfectly! 🎮💎",
        hint: "favorite_game = \"Car Racing\"\nprint(favorite_game)"
      }
    },
    {
      id: "io_ex3",
      title: "Example 3: User Input",
      code: `name = input("What is your name? ")\nprint("Hello", name)`,
      explanation: "`input()` pauses Python and waits for the user to type something. The typed text is then stored in the variable on the left.",
      whyExplanation: "Using input() makes programs interactive! It lets users input custom choices, usernames, and game directions.",
      tryItYourself: {
        instruction: "Ask the learner for their name using input() with prompt \"What is your name? \", and then print \"Welcome, \" followed by their name.",
        starterCode: "# Ask name and print Welcome, [name]\nname = input(\"What is your name? \")\nprint(\"Welcome,\", name)",
        expectedOutputContains: ["Welcome,"],
        successMessage: "Superb! You created a dynamic conversational dialog flow! 🤖💬",
        hint: "Create a variable: name = input(\"What is your name? \")\nthen: print(\"Welcome,\", name)"
      }
    },
    {
      id: "io_ex4",
      title: "Example 4: Input in a Car Game",
      code: `player_name = input("Enter your player name: ")\ncar_name = input("Enter your car name: ")\nprint(player_name, "is driving", car_name)`,
      explanation: "You can ask for multiple inputs sequentially and join them inside print() separated by commas.",
      whyExplanation: "Gathering multiple variables lets us build rich personalized narratives or registration menus in our applications.",
      tryItYourself: {
        instruction: "Ask for: `player_name`, `car_name`, and `favorite_color` using input(). Then print: `[player_name] is driving [car_name] in a [favorite_color] racing suit!`",
        starterCode: `# Ask for the 3 inputs\nplayer_name = input("Player: ")\ncar_name = input("Car: ")\nfavorite_color = input("Color: ")\n# Print the funny sentence\nprint(player_name, "is driving", car_name, "in a", favorite_color, "racing suit!")`,
        expectedOutputContains: ["is driving", "racing suit!"],
        successMessage: "Hilarious! Ravi is driving Blue Thunder in a pink racing suit! Absolutely magical! 🏎️👚",
        hint: "Use three input() statements, then combine them in one print() separated by commas."
      }
    },
    {
      id: "io_ex5",
      title: "Example 5: Integer Number Input",
      code: `age = int(input("Enter your age: "))\nprint(age)`,
      explanation: "`input()` always returns words/text. We must wrap it inside `int()` to convert that text into a math-ready whole number!",
      whyExplanation: "If we don't convert input to an integer, Python cannot do mathematical operations (like adding bonus points) on it.",
      tryItYourself: {
        instruction: "Ask for the number of coins using `int(input(\"Enter coins: \"))`. Create a variable `final_coins` that adds 10 bonus coins, then print it.",
        starterCode: `# Ask for coins count as integer\ncoins = int(input("Enter coins: "))\n# Add 10 bonus coins\nfinal_coins = \n# Print final_coins\n`,
        expectedOutputContains: [], // Evaluated dynamically in tests
        successMessage: "Math success! You converted text input into an actual computable integer! 🪙➕",
        hint: "coins = int(input(\"Enter coins: \"))\nfinal_coins = coins + 10\nprint(final_coins)"
      }
    },
    {
      id: "io_ex6",
      title: "Example 6: Game Score Input",
      code: `score = int(input("Enter your score: "))\nbonus = 50\nfinal_score = score + bonus\nprint("Your final score is:", final_score)`,
      explanation: "Here we read the user's base score as an integer, append a static bonus value of 50, and output the computed total.",
      whyExplanation: "Almost all games require loading baseline user scores, running calculations, and outputting their high scores.",
      tryItYourself: {
        instruction: "Ask the user for their score using `int(input(\"Enter score: \"))`. Store it, add a bonus of 100, and print \"Final score: \" with the result.",
        starterCode: `# Ask score, add 100 bonus, print result\n`,
        expectedOutputContains: ["Final score:"],
        successMessage: "Marvelous score processing! You are officially an input-output guru! 🎖️📈",
        hint: "score = int(input(\"Enter score: \"))\nfinal = score + 100\nprint(\"Final score:\", final)"
      }
    }
  ],
  games: {
    game1_nameTheBox: {
      value: "Robot prompt: What is your name?",
      choices: ["input('What is your name? ')", "print('What is your name? ')", "ask('What is your name? ')", "robot()"],
      correct: "input('What is your name? ')"
    },
    game2_fixTheVariable: {
      buggyCode: `name = input("Enter name")\nprint("Hello" name)`,
      prompt: "There is a missing comma separating the text and variable inside print! Fix the code:",
      correctAnswer: `name = input("Enter name")\nprint("Hello", name)`,
      starterCode: `name = input("Enter name")\nprint("Hello" name)`
    },
    game3_treasureHunt: {
      prompt: "Register a space car for racing! Ask for: player_name, car_name, and car_speed using input(). Print a complete profile on separate lines.",
      requiredVariables: ["player_name", "car_name", "car_speed"],
      starterCode: `# Ask variables\nplayer_name = \ncar_name = \ncar_speed = \n# Print profile\n`
    },
    game4_matchGame: {
      pairs: [
        { name: "Output action", value: "print('Hi')" },
        { name: "Input action", value: "input('Your name? ')" },
        { name: "Integer converter", value: "int('50')" }
      ]
    },
    game5_finalChallenge: {
      prompt: "Construct a Game Player Card program! Ask for: name, age (converted to int), favorite_game, and score (converted to int). Print exactly:\n\nPlayer Card\nName: Ravi\nAge: 21\nFavorite Game: Car Racing\nScore: 100",
      starterCode: `# Write Player Card Generator\nname = input("Enter name: ")\nage = int(input("Enter age: "))\nfavorite_game = input("Enter game: ")\nscore = int(input("Enter score: "))\n\n# Print the exact layout specified below:\nprint("Player Card")\nprint("Name:", name)\nprint("Age:", age)\nprint("Favorite Game:", favorite_game)\nprint("Score:", score)`,
      expectedOutputContains: ["Player Card", "Name:", "Age:", "Favorite Game:", "Score:"]
    }
  }
};

export const REFRESHED_QUIZZES: QuizQuestionData[] = [
  // Variables Skill Check
  {
    id: "var_quiz_q1",
    type: "mcq",
    concept: "Variables & Data Types",
    question: "Which of the following is a valid variable name in Python?",
    options: ["player score", "player_score", "2player_score", "player-score"],
    correctAnswer: "player_score",
    explanation: "Variable names in Python can only contain letters, numbers, and underscores, and they cannot start with a number or contain spaces/hyphens."
  },
  {
    id: "var_quiz_q2",
    type: "fill_blank",
    concept: "Variables & Data Types",
    question: "Fill in the blank to assign the integer 100 to the variable high_score: high_score ____ 100",
    correctAnswer: "=",
    explanation: "We use a single equals sign (=) to store values inside variables. It represents 'store' or 'assignment' in coding, not mathematical equality."
  },
  {
    id: "var_quiz_q3",
    type: "predict_output",
    concept: "Variables & Data Types",
    question: "What will be printed when this Python code runs?",
    codeContext: `score = 5\nscore = score + 10\nprint(score)`,
    options: ["5", "10", "15", "score"],
    correctAnswer: "15",
    explanation: "Python evaluates the right side: current score (5) + 10 is 15, then stores that new total back inside score. So print(score) shows 15!"
  },
  {
    id: "var_quiz_q4",
    type: "debug",
    concept: "Variables & Data Types",
    question: "Find and fix the syntax error in this variable assignment (replace spaces with an underscore):",
    codeContext: `my age = 21`,
    correctAnswer: "my_age = 21",
    explanation: "Variable names cannot contain spaces. Use underscores (e.g., my_age) to connect multiple words."
  },
  {
    id: "var_quiz_q5",
    type: "mcq",
    concept: "Variables & Data Types",
    question: "Why should we avoid naming variables simple letters like 'a' and 'b' in larger programs?",
    options: [
      "Because Python runs slower when variable names are short.",
      "Because 'a' and 'b' are reserved Python commands.",
      "Because they are hard to understand and do not explain the purpose of the value.",
      "Because they can only store whole numbers."
    ],
    correctAnswer: "Because they are hard to understand and do not explain the purpose of the value.",
    explanation: "Descriptive variable names make programs self-explanatory and easy to debug for yourself and other engineers."
  },

  // Input/Output Skill Check
  {
    id: "io_quiz_q1",
    type: "mcq",
    concept: "Input and Output",
    question: "What is the primary function used to display information on the screen in Python?",
    options: ["input()", "print()", "display()", "write()"],
    correctAnswer: "print()",
    explanation: "The print() function is Python's command to output text or variable values directly to the screen terminal."
  },
  {
    id: "io_quiz_q2",
    type: "fill_blank",
    concept: "Input and Output",
    question: "Complete the blank to query user input: user_name = ____('Enter name: ')",
    correctAnswer: "input",
    explanation: "The input() function asks a question, pauses program execution, and waits for the user to type text."
  },
  {
    id: "io_quiz_q3",
    type: "predict_output",
    concept: "Input and Output",
    question: "If the user types the number 10, what will be the printed output of this code?",
    codeContext: `coins = input("Enter coins: ")\nprint(coins + "10")`,
    options: ["20", "1010", "Error", "10"],
    correctAnswer: "1010",
    explanation: "The input() function always returns text (a string). Using the + operator on strings joins them together (concatenates), producing '1010'!"
  },
  {
    id: "io_quiz_q4",
    type: "fill_blank",
    concept: "Input and Output",
    question: "Fill in the blank to convert input text into a computable whole number: speed = ____(input('Enter speed: '))",
    correctAnswer: "int",
    explanation: "Wrapping the input() inside int() converts the user's string answer into an integer so you can do math operations like addition."
  },
  {
    id: "io_quiz_q5",
    type: "debug",
    concept: "Input and Output",
    question: "Fix the missing separating comma syntax error in this print statement:",
    codeContext: `name = "Ravi"\nprint("Hello" name)`,
    correctAnswer: "print(\"Hello\", name)",
    explanation: "To print a text string and a variable together in Python, you must separate them with a comma."
  }
];
