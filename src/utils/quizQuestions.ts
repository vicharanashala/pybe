import { QuizQuestion } from '../types';

export const LIVE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'lq_1',
    type: 'mcq',
    concept: 'Variables & Data Types',
    question: 'In Minecraft, you set steve_gold = 10. Then you mine some more and do steve_gold += 5. What is the value of steve_gold now?',
    options: ['10', '5', '15', 'Error'],
    correctAnswer: '15',
    explanation: 'The += operator adds the right-hand value to the existing variable. 10 + 5 equals 15.'
  },
  {
    id: 'lq_2',
    type: 'mcq',
    concept: 'Lists',
    question: 'In Hogwarts, spells = ["Lumos", "Alohomora", "Expelliarmus"]. What is the value of spells[1]?',
    options: ['Lumos', 'Alohomora', 'Expelliarmus', 'IndexError'],
    correctAnswer: 'Alohomora',
    explanation: 'Python lists are 0-indexed, meaning spells[0] is "Lumos" and spells[1] is "Alohomora".'
  },
  {
    id: 'lq_3',
    type: 'mcq',
    concept: 'Dictionaries',
    question: "You have a dictionary: house_points = {'Gryffindor': 350, 'Slytherin': 340}. What does house_points.get('Ravenclaw', 10) return?",
    options: ['350', '340', '10', 'None'],
    correctAnswer: '10',
    explanation: 'The get() method returns the value of the key if it exists, otherwise it returns the default value specified (in this case, 10).'
  },
  {
    id: 'lq_4',
    type: 'mcq',
    concept: 'Loops',
    question: 'How many creepers will be spawned by this Python loop?\n\nfor i in range(3):\n    print("Creeper!")',
    codeContext: 'for i in range(3):\n    print("Creeper!")',
    options: ['0', '3', '4', 'Infinite'],
    correctAnswer: '3',
    explanation: 'range(3) generates numbers 0, 1, and 2, which causes the loop to run exactly 3 times.'
  },
  {
    id: 'lq_5',
    type: 'mcq',
    concept: 'Conditionals',
    question: 'Given potions = 3 and is_night = True. If the following code executes, what is printed?\n\nif potions > 2 and not is_night:\n    print("Safe")\nelse:\n    print("Danger!")',
    codeContext: 'potions = 3\nis_night = True\nif potions > 2 and not is_night:\n    print("Safe")\nelse:\n    print("Danger!")',
    options: ['Safe', 'Danger!', 'Error', 'Nothing'],
    correctAnswer: 'Danger!',
    explanation: 'Although potions > 2 is True, not is_night is False (since is_night is True). True and False yields False, so the else block runs.'
  },
  {
    id: 'lq_6',
    type: 'mcq',
    concept: 'String Formatting',
    question: "You write: player = 'Alex' and score = 100. What is the value of f'{player} got {score + 10} XP'?",
    options: ['Alex got 100 XP', 'Alex got 110 XP', 'player got score + 10 XP', 'Error'],
    correctAnswer: 'Alex got 110 XP',
    explanation: "F-strings evaluate expressions inside curly braces. Alex is substituted, and score + 10 is calculated as 100 + 10 = 110."
  },
  {
    id: 'lq_7',
    type: 'mcq',
    concept: 'Boolean Logic',
    question: 'What is the boolean result of: True and False or not False?',
    options: ['True', 'False', 'None', 'SyntaxError'],
    correctAnswer: 'True',
    explanation: 'Operator precedence: "not" evaluates first, giving True. "and" evaluates next (True and False = False). "or" evaluates last (False or True = True).'
  },
  {
    id: 'lq_8',
    type: 'mcq',
    concept: 'Lists',
    question: "Given inventory = ['sword', 'shield']. You run: inventory.append('potion'). What is the value of inventory now?",
    options: ["['potion', 'sword', 'shield']", "['sword', 'shield', 'potion']", "['sword', 'shield']", "['potion']"],
    correctAnswer: "['sword', 'shield', 'potion']",
    explanation: 'The append() method adds an item to the very end of the list.'
  },
  {
    id: 'lq_9',
    type: 'mcq',
    concept: 'Slicing',
    question: "For a string: spell = 'Expelliarmus'. What does spell[:5] evaluate to?",
    options: ["'Expe'", "'Expel'", "'Expell'", "'liarmus'"],
    correctAnswer: "'Expel'",
    explanation: 'Slicing [:5] grabs characters from index 0 up to (but not including) index 5. The characters are E, x, p, e, l.'
  },
  {
    id: 'lq_10',
    type: 'mcq',
    concept: 'Functions',
    question: 'What value is returned when calling compute_damage(50, 10)?\n\ndef compute_damage(base, armor):\n    reduction = armor * 2\n    return base - reduction',
    codeContext: 'def compute_damage(base, armor):\n    reduction = armor * 2\n    return base - reduction',
    options: ['50', '40', '30', '0'],
    correctAnswer: '30',
    explanation: 'armor (10) * 2 = 20. base (50) - reduction (20) yields 30, which is returned.'
  }
];
