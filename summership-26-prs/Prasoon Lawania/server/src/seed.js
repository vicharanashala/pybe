const { resetData } = require('./data/store');
require('dotenv').config();

const scenarios = [
  {
    title: 'Bag Weight Label',
    difficulty: 'Beginner',
    concepts: ['variables'],
    context: 'A student has one school bag with a weight written on a scale.',
    prompt: 'What single piece of information would you store so the computer can remember the bag weight?',
    objectives: ['Identify one value', 'Give the value a name', 'Connect naming to a variable'],
    sampleReasoning: 'I only need to remember the bag weight, so I would store it with a clear name.',
    effectivenessScore: 96
  },
  {
    title: 'Rainy Day Choice',
    difficulty: 'Beginner',
    concepts: ['conditionals'],
    context: 'Before leaving home, a learner checks whether it is raining.',
    prompt: 'What small decision rule would help the learner decide whether to carry an umbrella?',
    objectives: ['Notice one condition', 'Choose one action', 'Map the rule to if/else'],
    sampleReasoning: 'If it is raining, carry an umbrella. Otherwise, leave it at home.',
    effectivenessScore: 95
  },
  {
    title: 'Two Snack Prices',
    difficulty: 'Beginner',
    concepts: ['arithmetic', 'variables'],
    context: 'A learner buys one samosa and one juice from the canteen.',
    prompt: 'How would you figure out the total cost using just the two prices?',
    objectives: ['Store two values', 'Add values', 'Name the result'],
    sampleReasoning: 'I would keep the two prices separately and add them to get the total.',
    effectivenessScore: 94
  },
  {
    title: 'Greeting by Name',
    difficulty: 'Beginner',
    concepts: ['strings', 'variables'],
    context: 'A classroom screen should greet one learner by name.',
    prompt: 'What text should the computer remember, and how should it combine that text into a greeting?',
    objectives: ['Store text', 'Combine text', 'Recognize strings'],
    sampleReasoning: 'The computer should store the learner name and place it inside a greeting sentence.',
    effectivenessScore: 93
  },
  {
    title: 'Pass Mark Check',
    difficulty: 'Beginner',
    concepts: ['comparisons', 'conditionals'],
    context: 'A learner receives one test score and wants to know whether it is at least the pass mark.',
    prompt: 'What comparison would decide if the learner passed?',
    objectives: ['Compare two numbers', 'Create a yes/no result', 'Map comparison to condition'],
    sampleReasoning: 'I would compare the score with the pass mark and decide pass if it is high enough.',
    effectivenessScore: 92
  },
  {
    title: 'Pocket Money Left',
    difficulty: 'Beginner',
    concepts: ['subtraction', 'variables'],
    context: 'A learner starts with pocket money and spends a small amount on stationery.',
    prompt: 'What two values matter, and how would you find the money left?',
    objectives: ['Name starting amount', 'Name spent amount', 'Subtract to find remaining value'],
    sampleReasoning: 'Start with the original money, subtract the spent amount, and store what remains.',
    effectivenessScore: 91
  },
  {
    title: 'Favorite Color List',
    difficulty: 'Beginner',
    concepts: ['lists'],
    context: 'Three friends each say their favorite color.',
    prompt: 'How would you keep all three colors together instead of making separate notes?',
    objectives: ['Group related values', 'Recognize a collection', 'Map grouping to a list'],
    sampleReasoning: 'Since all values are colors, I would keep them together in one list.',
    effectivenessScore: 90
  },
  {
    title: 'First Item in a Bag',
    difficulty: 'Beginner',
    concepts: ['lists', 'indexing'],
    context: 'A bag contains a pencil, eraser, and ruler in that order.',
    prompt: 'How would you ask for only the first item?',
    objectives: ['Notice order', 'Pick one position', 'Connect position to indexing'],
    sampleReasoning: 'The first item is based on its position in the ordered group.',
    effectivenessScore: 89
  },
  {
    title: 'Attendance Count',
    difficulty: 'Beginner',
    concepts: ['counting', 'lists'],
    context: 'A teacher has a short list of students present today.',
    prompt: 'What question would help you find how many students are present?',
    objectives: ['Recognize a group', 'Ask for its size', 'Connect size to length'],
    sampleReasoning: 'I would count how many names are in the present-students list.',
    effectivenessScore: 88
  },
  {
    title: 'Temperature Message',
    difficulty: 'Beginner',
    concepts: ['conditionals', 'comparisons'],
    context: 'A weather display has one temperature reading.',
    prompt: 'What simple rule would decide whether to show Hot or Comfortable?',
    objectives: ['Set a threshold', 'Compare one value', 'Choose one message'],
    sampleReasoning: 'If the temperature is above the threshold, show Hot; otherwise show Comfortable.',
    effectivenessScore: 87
  },
  {
    title: 'Water Bottle Reminder',
    difficulty: 'Explorer',
    concepts: ['loops'],
    context: 'A learner wants a reminder for each break in the school day.',
    prompt: 'How would you avoid writing the same reminder separately for every break?',
    objectives: ['Recognize repeated action', 'Identify each break', 'Map repetition to a loop'],
    sampleReasoning: 'For every break, show the same water reminder.',
    effectivenessScore: 96
  },
  {
    title: 'Find the Longest Pencil',
    difficulty: 'Explorer',
    concepts: ['loops', 'comparisons'],
    context: 'A learner has several pencil lengths and wants to know which one is longest.',
    prompt: 'What small comparison would you repeat as you look through the lengths?',
    objectives: ['Keep current best', 'Compare one item at a time', 'Update when larger'],
    sampleReasoning: 'Start with one pencil as the longest, then compare each next pencil against it.',
    effectivenessScore: 95
  },
  {
    title: 'Clean Chore Checklist',
    difficulty: 'Explorer',
    concepts: ['lists', 'loops'],
    context: 'A family has a checklist of small chores for Saturday morning.',
    prompt: 'How would you go through each chore and mark it as done?',
    objectives: ['Store chores in a list', 'Process one chore at a time', 'Repeat a simple action'],
    sampleReasoning: 'Put chores in a list and handle each chore one by one.',
    effectivenessScore: 94
  },
  {
    title: 'Movie Age Filter',
    difficulty: 'Explorer',
    concepts: ['filtering', 'conditionals'],
    context: 'A movie app has a list of films, each with a minimum age.',
    prompt: 'What rule would decide which movies a 12-year-old can see?',
    objectives: ['Check one item rule', 'Keep allowed items', 'Map rule to filtering'],
    sampleReasoning: 'For each movie, keep it only if the learner age is at least the minimum age.',
    effectivenessScore: 93
  },
  {
    title: 'Classroom Supply Lookup',
    difficulty: 'Explorer',
    concepts: ['dictionaries'],
    context: 'A class monitor tracks how many chalk pieces, markers, and notebooks are available.',
    prompt: 'How would you store each supply name with its count?',
    objectives: ['Pair names with values', 'Look up by name', 'Map pairs to a dictionary'],
    sampleReasoning: 'Each supply has a count, so I would store supply names as keys with counts as values.',
    effectivenessScore: 92
  },
  {
    title: 'Bus Stop Search',
    difficulty: 'Explorer',
    concepts: ['search', 'loops'],
    context: 'A route list contains several bus stops, and a learner wants to know if Library Stop is included.',
    prompt: 'How would you check the stops one at a time until you find the target?',
    objectives: ['Identify target', 'Scan a list', 'Stop when found'],
    sampleReasoning: 'Look at each stop and compare it with the stop I want.',
    effectivenessScore: 91
  },
  {
    title: 'Average Practice Score',
    difficulty: 'Explorer',
    concepts: ['averages', 'loops'],
    context: 'A learner has five practice scores and wants one average score.',
    prompt: 'What two small steps are needed before dividing?',
    objectives: ['Add all scores', 'Count scores', 'Divide total by count'],
    sampleReasoning: 'Find the total of all scores, count how many scores there are, then divide.',
    effectivenessScore: 90
  },
  {
    title: 'Separate Even Roll Numbers',
    difficulty: 'Explorer',
    concepts: ['modulo', 'filtering'],
    context: 'A class list has roll numbers, and the teacher wants only even-numbered students for Team A.',
    prompt: 'What small test tells you whether a roll number is even?',
    objectives: ['Test divisibility by two', 'Keep matching numbers', 'Connect remainder to modulo'],
    sampleReasoning: 'A roll number is even if dividing by two leaves no remainder.',
    effectivenessScore: 89
  },
  {
    title: 'Capitalize Name Tags',
    difficulty: 'Explorer',
    concepts: ['strings', 'loops'],
    context: 'A club has names typed in lowercase and wants neat name tags.',
    prompt: 'What same text-cleaning action should happen to every name?',
    objectives: ['Recognize repeated string change', 'Apply to each name', 'Create cleaned names'],
    sampleReasoning: 'For each name, convert it to title case before printing the tag.',
    effectivenessScore: 88
  },
  {
    title: 'Find Missing Homework',
    difficulty: 'Explorer',
    concepts: ['sets', 'comparison'],
    context: 'A teacher has one list of all students and another list of students who submitted homework.',
    prompt: 'How would you reason about who is missing from the submitted list?',
    objectives: ['Compare two groups', 'Find difference', 'Map group difference to sets'],
    sampleReasoning: 'Take everyone in the class and remove the students who submitted.',
    effectivenessScore: 87
  },
  {
    title: 'Reusable Discount Rule',
    difficulty: 'Builder',
    concepts: ['functions', 'conditionals'],
    context: 'A shop gives the same discount rule to many different bills.',
    prompt: 'What inputs should a reusable discount helper receive?',
    objectives: ['Identify reusable rule', 'Choose inputs', 'Return discounted price'],
    sampleReasoning: 'The helper needs the bill amount and should return the final price after applying the rule.',
    effectivenessScore: 96
  },
  {
    title: 'Mini Quiz Checker',
    difficulty: 'Builder',
    concepts: ['functions', 'comparisons'],
    context: 'A quiz app needs to check one answer against one correct answer.',
    prompt: 'How would you design a tiny reusable checker for one question?',
    objectives: ['Accept learner answer', 'Accept correct answer', 'Return right or wrong'],
    sampleReasoning: 'Compare the learner answer with the correct answer and return whether they match.',
    effectivenessScore: 95
  },
  {
    title: 'Step Counter Function',
    difficulty: 'Builder',
    concepts: ['functions', 'lists'],
    context: 'A fitness note has a list of step counts from different walks.',
    prompt: 'How would you make a reusable helper that returns the total steps?',
    objectives: ['Accept a list', 'Add all values', 'Return total'],
    sampleReasoning: 'The function should take step counts, add them, and give back the total.',
    effectivenessScore: 94
  },
  {
    title: 'Safe Username Maker',
    difficulty: 'Builder',
    concepts: ['functions', 'strings'],
    context: 'A classroom app needs to turn a full name into a simple username.',
    prompt: 'What small text transformations should a username function perform?',
    objectives: ['Accept a name', 'Normalize text', 'Return username'],
    sampleReasoning: 'Make the name lowercase and remove spaces so it can be used as a username.',
    effectivenessScore: 93
  },
  {
    title: 'Retry Until Valid',
    difficulty: 'Builder',
    concepts: ['while loops', 'validation'],
    context: 'A form should keep asking until the learner enters a positive number.',
    prompt: 'What condition tells the program to keep asking?',
    objectives: ['Define valid input', 'Repeat while invalid', 'Stop after valid value'],
    sampleReasoning: 'Keep asking while the number is not positive, then stop once it is valid.',
    effectivenessScore: 92
  },
  {
    title: 'Simple Score Report',
    difficulty: 'Builder',
    concepts: ['dictionaries', 'functions'],
    context: 'A tutor wants a small report showing a learner name and score together.',
    prompt: 'How would you package two related pieces of information in one result?',
    objectives: ['Create key-value structure', 'Return structured result', 'Connect structure to dictionary'],
    sampleReasoning: 'Return a dictionary with the learner name and score as labeled values.',
    effectivenessScore: 91
  },
  {
    title: 'Task Status Updater',
    difficulty: 'Builder',
    concepts: ['dictionaries', 'mutation'],
    context: 'A to-do app has tasks with statuses and needs to mark one task as done.',
    prompt: 'What exact value changes when a task is completed?',
    objectives: ['Find one task', 'Change one status', 'Understand updating data'],
    sampleReasoning: 'Find the task by name and change its status from pending to done.',
    effectivenessScore: 90
  },
  {
    title: 'Small Receipt Builder',
    difficulty: 'Builder',
    concepts: ['functions', 'formatting'],
    context: 'A cafe wants a short text receipt for one item and its price.',
    prompt: 'What pieces should a receipt function combine into a readable line?',
    objectives: ['Accept item and price', 'Format text', 'Return one receipt line'],
    sampleReasoning: 'Combine the item name and price into one clear sentence.',
    effectivenessScore: 89
  },
  {
    title: 'Choose Next Scenario',
    difficulty: 'Builder',
    concepts: ['conditionals', 'adaptive logic'],
    context: 'PyBe wants to choose an easier or harder next scenario based on one score.',
    prompt: 'What simple score rule could decide the next difficulty?',
    objectives: ['Set score thresholds', 'Branch by score', 'Return next level'],
    sampleReasoning: 'If the score is high choose harder, if low choose easier, otherwise stay similar.',
    effectivenessScore: 88
  },
  {
    title: 'Reflection Keyword Finder',
    difficulty: 'Builder',
    concepts: ['strings', 'search'],
    context: 'PyBe reads a short reflection and checks whether the learner mentioned confusion.',
    prompt: 'What tiny search would detect that the reflection may need extra support?',
    objectives: ['Choose keywords', 'Search text', 'Return support signal'],
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
