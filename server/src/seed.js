const { resetData } = require('./data/store');
require('dotenv').config();

const scenarios = [
  {
    title: 'Bag Weight Label',
    difficulty: 'Beginner',
    concepts: ['variables'],
    context: 'A student has one school bag with a weight written on a scale.',
    prompt: 'What single piece of information would you store so the computer can remember the bag weight?',
    objectives: [
      { text: 'Identify one value', keywords: ['weight', 'value'] },
      { text: 'Give the value a name', keywords: ['name', 'label'] },
      { text: 'Connect naming to a variable', keywords: ['variable', 'store'] }
    ],
    sampleReasoning: 'I only need to remember the bag weight, so I would store it with a clear name.',
    effectivenessScore: 96
  },
  {
    title: 'Rainy Day Choice',
    difficulty: 'Beginner',
    concepts: ['conditionals'],
    context: 'Before leaving home, a learner checks whether it is raining.',
    prompt: 'What small decision rule would help the learner decide whether to carry an umbrella?',
    objectives: [
      { text: 'Notice one condition', keywords: ['rain', 'condition'] },
      { text: 'Choose one action', keywords: ['umbrella', 'decide'] },
      { text: 'Map the rule to if/else', keywords: ['if', 'else'] }
    ],
    sampleReasoning: 'If it is raining, carry an umbrella. Otherwise, leave it at home.',
    effectivenessScore: 95
  },
  {
    title: 'Two Snack Prices',
    difficulty: 'Beginner',
    concepts: ['arithmetic', 'variables'],
    context: 'A learner buys one samosa and one juice from the canteen.',
    prompt: 'How would you figure out the total cost using just the two prices?',
    objectives: [
      { text: 'Store two values', keywords: ['price', 'store'] },
      { text: 'Add values', keywords: ['add', 'total'] },
      { text: 'Name the result', keywords: ['total', 'result'] }
    ],
    sampleReasoning: 'I would keep the two prices separately and add them to get the total.',
    effectivenessScore: 94
  },
  {
    title: 'Greeting by Name',
    difficulty: 'Beginner',
    concepts: ['strings', 'variables'],
    context: 'A classroom screen should greet one learner by name.',
    prompt: 'What text should the computer remember, and how should it combine that text into a greeting?',
    objectives: [
      { text: 'Store text', keywords: ['name', 'store'] },
      { text: 'Combine text', keywords: ['combine', 'greeting'] },
      { text: 'Recognize strings', keywords: ['string', 'text'] }
    ],
    sampleReasoning: 'The computer should store the learner name and place it inside a greeting sentence.',
    effectivenessScore: 93
  },
  {
    title: 'Pass Mark Check',
    difficulty: 'Beginner',
    concepts: ['comparisons', 'conditionals'],
    context: 'A learner receives one test score and wants to know whether it is at least the pass mark.',
    prompt: 'What comparison would decide if the learner passed?',
    objectives: [
      { text: 'Compare two numbers', keywords: ['score', 'compare'] },
      { text: 'Create a yes/no result', keywords: ['pass', 'fail'] },
      { text: 'Map comparison to condition', keywords: ['if', 'condition'] }
    ],
    sampleReasoning: 'I would compare the score with the pass mark and decide pass if it is high enough.',
    effectivenessScore: 92
  },
  {
    title: 'Pocket Money Left',
    difficulty: 'Beginner',
    concepts: ['subtraction', 'variables'],
    context: 'A learner starts with pocket money and spends a small amount on stationery.',
    prompt: 'What two values matter, and how would you find the money left?',
    objectives: [
      { text: 'Name starting amount', keywords: ['starting', 'amount'] },
      { text: 'Name spent amount', keywords: ['spent', 'cost'] },
      { text: 'Subtract to find remaining value', keywords: ['subtract', 'remaining'] }
    ],
    sampleReasoning: 'Start with the original money, subtract the spent amount, and store what remains.',
    effectivenessScore: 91
  },
  {
    title: 'Favorite Color List',
    difficulty: 'Beginner',
    concepts: ['lists'],
    context: 'Three friends each say their favorite color.',
    prompt: 'How would you keep all three colors together instead of making separate notes?',
    objectives: [
      { text: 'Group related values', keywords: ['group', 'together'] },
      { text: 'Recognize a collection', keywords: ['collection', 'group'] },
      { text: 'Map grouping to a list', keywords: ['list', 'items'] }
    ],
    sampleReasoning: 'Since all values are colors, I would keep them together in one list.',
    effectivenessScore: 90
  },
  {
    title: 'First Item in a Bag',
    difficulty: 'Beginner',
    concepts: ['lists', 'indexing'],
    context: 'A bag contains a pencil, eraser, and ruler in that order.',
    prompt: 'How would you ask for only the first item?',
    objectives: [
      { text: 'Notice order', keywords: ['order', 'first'] },
      { text: 'Pick one position', keywords: ['position', 'pick'] },
      { text: 'Connect position to indexing', keywords: ['index', 'position'] }
    ],
    sampleReasoning: 'The first item is based on its position in the ordered group.',
    effectivenessScore: 89
  },
  {
    title: 'Attendance Count',
    difficulty: 'Beginner',
    concepts: ['counting', 'lists'],
    context: 'A teacher has a short list of students present today.',
    prompt: 'What question would help you find how many students are present?',
    objectives: [
      { text: 'Recognize a group', keywords: ['students', 'group'] },
      { text: 'Ask for its size', keywords: ['how many', 'count'] },
      { text: 'Connect size to length', keywords: ['length', 'count'] }
    ],
    sampleReasoning: 'I would count how many names are in the present-students list.',
    effectivenessScore: 88
  },
  {
    title: 'Temperature Message',
    difficulty: 'Beginner',
    concepts: ['conditionals', 'comparisons'],
    context: 'A weather display has one temperature reading.',
    prompt: 'What simple rule would decide whether to show Hot or Comfortable?',
    objectives: [
      { text: 'Set a threshold', keywords: ['threshold', 'temperature'] },
      { text: 'Compare one value', keywords: ['compare', 'above'] },
      { text: 'Choose one message', keywords: ['hot', 'message'] }
    ],
    sampleReasoning: 'If the temperature is above the threshold, show Hot; otherwise show Comfortable.',
    effectivenessScore: 87
  },
  {
    title: 'Water Bottle Reminder',
    difficulty: 'Explorer',
    concepts: ['loops'],
    context: 'A learner wants a reminder for each break in the school day.',
    prompt: 'How would you avoid writing the same reminder separately for every break?',
    objectives: [
      { text: 'Recognize repeated action', keywords: ['repeat', 'every'] },
      { text: 'Identify each break', keywords: ['each break', 'breaks'] },
      { text: 'Map repetition to a loop', keywords: ['loop', 'for'] }
    ],
    sampleReasoning: 'For every break, show the same water reminder.',
    effectivenessScore: 96
  },
  {
    title: 'Find the Longest Pencil',
    difficulty: 'Explorer',
    concepts: ['loops', 'comparisons'],
    context: 'A learner has several pencil lengths and wants to know which one is longest.',
    prompt: 'What small comparison would you repeat as you look through the lengths?',
    objectives: [
      { text: 'Keep current best', keywords: ['longest', 'best'] },
      { text: 'Compare one item at a time', keywords: ['compare', 'each'] },
      { text: 'Update when larger', keywords: ['update', 'larger'] }
    ],
    sampleReasoning: 'Start with one pencil as the longest, then compare each next pencil against it.',
    effectivenessScore: 95
  },
  {
    title: 'Clean Chore Checklist',
    difficulty: 'Explorer',
    concepts: ['lists', 'loops'],
    context: 'A family has a checklist of small chores for Saturday morning.',
    prompt: 'How would you go through each chore and mark it as done?',
    objectives: [
      { text: 'Store chores in a list', keywords: ['list', 'chores'] },
      { text: 'Process one chore at a time', keywords: ['each', 'one at a time'] },
      { text: 'Repeat a simple action', keywords: ['repeat', 'mark'] }
    ],
    sampleReasoning: 'Put chores in a list and handle each chore one by one.',
    effectivenessScore: 94
  },
  {
    title: 'Movie Age Filter',
    difficulty: 'Explorer',
    concepts: ['filtering', 'conditionals'],
    context: 'A movie app has a list of films, each with a minimum age.',
    prompt: 'What rule would decide which movies a 12-year-old can see?',
    objectives: [
      { text: 'Check one item rule', keywords: ['minimum age', 'check'] },
      { text: 'Keep allowed items', keywords: ['keep', 'allowed'] },
      { text: 'Map rule to filtering', keywords: ['filter', 'only'] }
    ],
    sampleReasoning: 'For each movie, keep it only if the learner age is at least the minimum age.',
    effectivenessScore: 93
  },
  {
    title: 'Classroom Supply Lookup',
    difficulty: 'Explorer',
    concepts: ['dictionaries'],
    context: 'A class monitor tracks how many chalk pieces, markers, and notebooks are available.',
    prompt: 'How would you store each supply name with its count?',
    objectives: [
      { text: 'Pair names with values', keywords: ['pair', 'supply'] },
      { text: 'Look up by name', keywords: ['look up', 'find by name'] },
      { text: 'Map pairs to a dictionary', keywords: ['dictionary', 'key'] }
    ],
    sampleReasoning: 'Each supply has a count, so I would store supply names as keys with counts as values.',
    effectivenessScore: 92
  },
  {
    title: 'Bus Stop Search',
    difficulty: 'Explorer',
    concepts: ['search', 'loops'],
    context: 'A route list contains several bus stops, and a learner wants to know if Library Stop is included.',
    prompt: 'How would you check the stops one at a time until you find the target?',
    objectives: [
      { text: 'Identify target', keywords: ['library stop', 'target'] },
      { text: 'Scan a list', keywords: ['scan', 'each stop'] },
      { text: 'Stop when found', keywords: ['stop', 'found'] }
    ],
    sampleReasoning: 'Look at each stop and compare it with the stop I want.',
    effectivenessScore: 91
  },
  {
    title: 'Average Practice Score',
    difficulty: 'Explorer',
    concepts: ['averages', 'loops'],
    context: 'A learner has five practice scores and wants one average score.',
    prompt: 'What two small steps are needed before dividing?',
    objectives: [
      { text: 'Add all scores', keywords: ['add', 'total'] },
      { text: 'Count scores', keywords: ['count', 'how many'] },
      { text: 'Divide total by count', keywords: ['divide', 'average'] }
    ],
    sampleReasoning: 'Find the total of all scores, count how many scores there are, then divide.',
    effectivenessScore: 90
  },
  {
    title: 'Separate Even Roll Numbers',
    difficulty: 'Explorer',
    concepts: ['modulo', 'filtering'],
    context: 'A class list has roll numbers, and the teacher wants only even-numbered students for Team A.',
    prompt: 'What small test tells you whether a roll number is even?',
    objectives: [
      { text: 'Test divisibility by two', keywords: ['divisible', 'even'] },
      { text: 'Keep matching numbers', keywords: ['keep', 'even'] },
      { text: 'Connect remainder to modulo', keywords: ['remainder', 'modulo'] }
    ],
    sampleReasoning: 'A roll number is even if dividing by two leaves no remainder.',
    effectivenessScore: 89
  },
  {
    title: 'Capitalize Name Tags',
    difficulty: 'Explorer',
    concepts: ['strings', 'loops'],
    context: 'A club has names typed in lowercase and wants neat name tags.',
    prompt: 'What same text-cleaning action should happen to every name?',
    objectives: [
      { text: 'Recognize repeated string change', keywords: ['every name', 'lowercase'] },
      { text: 'Apply to each name', keywords: ['each', 'apply'] },
      { text: 'Create cleaned names', keywords: ['capitalize', 'clean'] }
    ],
    sampleReasoning: 'For each name, convert it to title case before printing the tag.',
    effectivenessScore: 88
  },
  {
    title: 'Find Missing Homework',
    difficulty: 'Explorer',
    concepts: ['sets', 'comparison'],
    context: 'A teacher has one list of all students and another list of students who submitted homework.',
    prompt: 'How would you reason about who is missing from the submitted list?',
    objectives: [
      { text: 'Compare two groups', keywords: ['two lists', 'compare'] },
      { text: 'Find difference', keywords: ['difference', 'missing'] },
      { text: 'Map group difference to sets', keywords: ['set', 'sets'] }
    ],
    sampleReasoning: 'Take everyone in the class and remove the students who submitted.',
    effectivenessScore: 87
  },
  {
    title: 'Reusable Discount Rule',
    difficulty: 'Builder',
    concepts: ['functions', 'conditionals'],
    context: 'A shop gives the same discount rule to many different bills.',
    prompt: 'What inputs should a reusable discount helper receive?',
    objectives: [
      { text: 'Identify reusable rule', keywords: ['reusable', 'rule'] },
      { text: 'Choose inputs', keywords: ['input', 'bill amount'] },
      { text: 'Return discounted price', keywords: ['return', 'discount'] }
    ],
    sampleReasoning: 'The helper needs the bill amount and should return the final price after applying the rule.',
    effectivenessScore: 96
  },
  {
    title: 'Mini Quiz Checker',
    difficulty: 'Builder',
    concepts: ['functions', 'comparisons'],
    context: 'A quiz app needs to check one answer against one correct answer.',
    prompt: 'How would you design a tiny reusable checker for one question?',
    objectives: [
      { text: 'Accept learner answer', keywords: ['learner answer', 'accept'] },
      { text: 'Accept correct answer', keywords: ['correct answer', 'accept'] },
      { text: 'Return right or wrong', keywords: ['return', 'match'] }
    ],
    sampleReasoning: 'Compare the learner answer with the correct answer and return whether they match.',
    effectivenessScore: 95
  },
  {
    title: 'Step Counter Function',
    difficulty: 'Builder',
    concepts: ['functions', 'lists'],
    context: 'A fitness note has a list of step counts from different walks.',
    prompt: 'How would you make a reusable helper that returns the total steps?',
    objectives: [
      { text: 'Accept a list', keywords: ['list', 'accept'] },
      { text: 'Add all values', keywords: ['add', 'total'] },
      { text: 'Return total', keywords: ['return', 'total'] }
    ],
    sampleReasoning: 'The function should take step counts, add them, and give back the total.',
    effectivenessScore: 94
  },
  {
    title: 'Safe Username Maker',
    difficulty: 'Builder',
    concepts: ['functions', 'strings'],
    context: 'A classroom app needs to turn a full name into a simple username.',
    prompt: 'What small text transformations should a username function perform?',
    objectives: [
      { text: 'Accept a name', keywords: ['name', 'accept'] },
      { text: 'Normalize text', keywords: ['lowercase', 'clean'] },
      { text: 'Return username', keywords: ['return', 'username'] }
    ],
    sampleReasoning: 'Make the name lowercase and remove spaces so it can be used as a username.',
    effectivenessScore: 93
  },
  {
    title: 'Retry Until Valid',
    difficulty: 'Builder',
    concepts: ['while loops', 'validation'],
    context: 'A form should keep asking until the learner enters a positive number.',
    prompt: 'What condition tells the program to keep asking?',
    objectives: [
      { text: 'Define valid input', keywords: ['valid', 'positive'] },
      { text: 'Repeat while invalid', keywords: ['repeat', 'invalid'] },
      { text: 'Stop after valid value', keywords: ['stop', 'valid'] }
    ],
    sampleReasoning: 'Keep asking while the number is not positive, then stop once it is valid.',
    effectivenessScore: 92
  },
  {
    title: 'Simple Score Report',
    difficulty: 'Builder',
    concepts: ['dictionaries', 'functions'],
    context: 'A tutor wants a small report showing a learner name and score together.',
    prompt: 'How would you package two related pieces of information in one result?',
    objectives: [
      { text: 'Create key-value structure', keywords: ['key', 'value'] },
      { text: 'Return structured result', keywords: ['return', 'result'] },
      { text: 'Connect structure to dictionary', keywords: ['dictionary', 'dict'] }
    ],
    sampleReasoning: 'Return a dictionary with the learner name and score as labeled values.',
    effectivenessScore: 91
  },
  {
    title: 'Task Status Updater',
    difficulty: 'Builder',
    concepts: ['dictionaries', 'mutation'],
    context: 'A to-do app has tasks with statuses and needs to mark one task as done.',
    prompt: 'What exact value changes when a task is completed?',
    objectives: [
      { text: 'Find one task', keywords: ['find', 'task'] },
      { text: 'Change one status', keywords: ['status', 'change'] },
      { text: 'Understand updating data', keywords: ['update', 'modify'] }
    ],
    sampleReasoning: 'Find the task by name and change its status from pending to done.',
    effectivenessScore: 90
  },
  {
    title: 'Small Receipt Builder',
    difficulty: 'Builder',
    concepts: ['functions', 'formatting'],
    context: 'A cafe wants a short text receipt for one item and its price.',
    prompt: 'What pieces should a receipt function combine into a readable line?',
    objectives: [
      { text: 'Accept item and price', keywords: ['item', 'price'] },
      { text: 'Format text', keywords: ['format', 'readable'] },
      { text: 'Return one receipt line', keywords: ['return', 'receipt'] }
    ],
    sampleReasoning: 'Combine the item name and price into one clear sentence.',
    effectivenessScore: 89
  },
  {
    title: 'Choose Next Scenario',
    difficulty: 'Builder',
    concepts: ['conditionals', 'adaptive logic'],
    context: 'PyBe wants to choose an easier or harder next scenario based on one score.',
    prompt: 'What simple score rule could decide the next difficulty?',
    objectives: [
      { text: 'Set score thresholds', keywords: ['threshold', 'score'] },
      { text: 'Branch by score', keywords: ['branch', 'depends on score'] },
      { text: 'Return next level', keywords: ['return', 'next level'] }
    ],
    sampleReasoning: 'If the score is high choose harder, if low choose easier, otherwise stay similar.',
    effectivenessScore: 88
  },
  {
    title: 'Reflection Keyword Finder',
    difficulty: 'Builder',
    concepts: ['strings', 'search'],
    context: 'PyBe reads a short reflection and checks whether the learner mentioned confusion.',
    prompt: 'What tiny search would detect that the reflection may need extra support?',
    objectives: [
      { text: 'Choose keywords', keywords: ['keyword', 'confused'] },
      { text: 'Search text', keywords: ['search', 'reflection'] },
      { text: 'Return support signal', keywords: ['return', 'flag'] }
    ],
    sampleReasoning: 'Look for words like confused or stuck and flag the reflection if they appear.',
    effectivenessScore: 87
  }
];

async function run() {
  await resetData(scenarios);
  console.log(`Seeded ${scenarios.length} PyBe scenarios`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
