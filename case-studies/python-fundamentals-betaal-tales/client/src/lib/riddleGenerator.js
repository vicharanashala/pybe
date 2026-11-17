function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Each entry: { question, explanation, options: [ { text, correct } x4 ] }
// Options are written so all four are naturally comparable in length, with the
// correct answer marked. The generator shuffles positions at runtime so the
// correct answer is neither always longest nor always in the same slot.
const RIDDLES = {
  'thirsty-crow': {
    question: 'The crow remembers how many pebbles it has dropped, and that number grows with every stone. What is the crow really keeping?',
    explanation: 'Each drop updates the count - a changing value the crow carries forward. In Python that is a variable: a named box of information it can reassign.',
    options: [
      { text: 'The ever-growing count the crow keeps', correct: true },
      { text: 'A hidden list of every pebble colour', correct: false },
      { text: 'A fixed rule that never changes at all', correct: false },
      { text: 'The one exact shape of the pot', correct: false }
    ]
  },
  'milkmaid-pail': {
    question: 'Meera keeps a running total - milk to money, money to eggs. Each new step changes a value she is tracking. What is she using?',
    explanation: 'The total is stored in one named box that she rewrites at every step. That reusable, changeable box is the idea of a variable.',
    options: [
      { text: 'A named box whose stored value can change', correct: true },
      { text: 'A single print line that never varies', correct: false },
      { text: 'A branch that chooses one of two paths', correct: false },
      { text: 'A number locked so it can never be edited', correct: false }
    ]
  },
  'dog-reflection': {
    question: 'The dog starts with one bone, reaches for a second, and ends with none. The value it was holding changes each time. What explains this?',
    explanation: 'Each new fact is a fresh assignment that replaces the old value. A new value simply overwrites what a variable held before.',
    options: [
      { text: 'A new assignment replaces the old value', correct: true },
      { text: 'A variable can only ever hold text', correct: false },
      { text: 'A value once set can never be read again', correct: false },
      { text: 'A variable keeps its first value forever', correct: false }
    ]
  },
  'elephant-dog': {
    question: 'The elephant swings from lonely to joyful to sad. One thing keeps a record of how his feelings change. Which is it?',
    explanation: 'A variable is a named box of state - assign it new values as the story unfolds, and it always holds the current situation.',
    options: [
      { text: 'A changing box of state', correct: true },
      { text: 'A loop repeating one fixed action', correct: false },
      { text: 'A single decision made just once', correct: false },
      { text: 'A list holding many items in order', correct: false }
    ]
  },
  'blue-jackal': {
    question: 'The jackal looks blue, then brown again - his appearance is not fixed. What lets a value change like that?',
    explanation: 'A variable holds one value at a time, but that stored value is not permanent - assign a new one and the variable updates.',
    options: [
      { text: 'A stored value that can be reassigned', correct: true },
      { text: 'A loop that runs without ever stopping', correct: false },
      { text: 'A list that gathers many items', correct: false },
      { text: 'A helper that returns a fixed result', correct: false }
    ]
  },
  'monkey-crocodile': {
    question: 'The monkey must decide whether to trust the crocodile before crossing. His move depends on a condition. What does he use?',
    explanation: 'He chooses one path based on a check - if the danger is real he stays, otherwise he crosses. That conditional decision is Python\'s if/else.',
    options: [
      { text: 'A path chosen from a condition', correct: true },
      { text: 'The same action repeated often', correct: false },
      { text: 'A count that grows each step', correct: false },
      { text: 'A value looked up by its name', correct: false }
    ]
  },
  'heron-crab': {
    question: 'The crab checks the bones and picks a response to the danger. He weighs the evidence before acting. What is this?',
    explanation: 'The crab tests a condition and then acts-one-way-or-another. That is exactly an if/else: check, then choose the matching branch.',
    options: [
      { text: 'Checking a clue, choosing a path', correct: true },
      { text: 'Repeating one action over and over', correct: false },
      { text: 'Adding up the fish in the pond', correct: false },
      { text: 'Storing a name inside a variable', correct: false }
    ]
  },
  'brahmin-goat': {
    question: 'The Brahmin hears three very different claims about the animal and must test each one in order. What structure does he need?',
    explanation: 'He must check several possibilities and act on the first that fits. That is an if / elif / else chain testing each condition in turn.',
    options: [
      { text: 'A chain of checks in turn', correct: true },
      { text: 'An assignment holding one value', correct: false },
      { text: 'A loop repeating the same step', correct: false },
      { text: 'A list of facts, all at once', correct: false }
    ]
  },
  'monkey-king': {
    question: 'The monkey king watches the season, the water, and his troop, and reacts to whichever danger shows first. What does he use?',
    explanation: 'He tests each warning in order and acts on the first that matches. That is an if / elif / else chain of conditions.',
    options: [
      { text: 'Testing each warning in order', correct: true },
      { text: 'A single print statement only', correct: false },
      { text: 'Fixing one value for ever', correct: false },
      { text: 'A loop that never ends', correct: false }
    ]
  },
  'crow-snake': {
    question: 'The crow weighs several possible moves - guarding, fighting, luring - and picks the first that suits each situation. What is this?',
    explanation: 'She checks each situation in turn and acts on the first that fits. That is an if / elif / else chain.',
    options: [
      { text: 'Checking each situation in turn', correct: true },
      { text: 'Repeating one action many times', correct: false },
      { text: 'Storing a single value forever', correct: false },
      { text: 'Printing the same message always', correct: false }
    ]
  },
  'tortoise-hare': {
    question: 'The tortoise wins by doing the same simple step - walking - again and again on a steady rhythm. What pattern is this?',
    explanation: "One step is repeated over and over in order until the race's laps are done. That is a loop.",
    options: [
      { text: 'The same step repeated in a rhythm', correct: true },
      { text: 'One decision, then the race stops', correct: false },
      { text: 'A single count that only grows', correct: false },
      { text: 'Choosing between two different racers', correct: false }
    ]
  },
  'banyan-deer': {
    question: 'Every morning the same routine - drop lots, walk a deer - repeats until the king finally changes the rule. What drives it?',
    explanation: 'The ritual repeats again and again until a condition finally changes. That is a loop running while a condition holds, then stopping.',
    options: [
      { text: 'A ritual repeating until change', correct: true },
      { text: 'One choice between two actions', correct: false },
      { text: 'All the names stored in one box', correct: false },
      { text: 'A single message printed once', correct: false }
    ]
  },
  'ant-dove': {
    question: 'The ant cannot reach shore in one jump, so she takes many small steps until she finally arrives. What pattern is this?',
    explanation: 'Small steps repeat over and over until the goal is reached. That is a loop that keeps going until the outcome is done.',
    options: [
      { text: 'Small steps, repeated to the goal', correct: true },
      { text: 'One choice between two actions', correct: false },
      { text: 'A single value that never changes', correct: false },
      { text: 'One message printed and done', correct: false }
    ]
  },
  'golden-goose': {
    question: 'The goose does not give one gift - he returns week after week, one feather every time. What is the pattern?',
    explanation: 'The same action is done once for each period as it passes. That is a loop - often a for loop over the weeks.',
    options: [
      { text: 'One action per passing period', correct: true },
      { text: 'A single choice between two', correct: false },
      { text: 'All the coins in an unchanging box', correct: false },
      { text: 'A message written just once', correct: false }
    ]
  },
  'monkey-wedge': {
    question: 'The monkey tugs again and again while the wedge holds, and stops the instant it gives way. What does this need?',
    explanation: 'A while loop repeats while a condition is True and stops the moment it becomes False - the exact tug-till-it-breaks rhythm.',
    options: [
      { text: 'Repeat while a condition holds', correct: true },
      { text: 'A loop that fixes its own count', correct: false },
      { text: 'A single if choice made one time', correct: false },
      { text: 'A variable you declare and drop', correct: false }
    ]
  },
  'elephant-blind-men': {
    question: 'Each blind man holds one piece - wall, spear, rope. How should all six pieces be kept so they stay together and in order?',
    explanation: 'The pieces belong to one collection that keeps their order. That is a list - reached by position using an index.',
    options: [
      { text: 'One collection, kept in order', correct: true },
      { text: 'A single yes-or-no choice', correct: false },
      { text: 'One separate number per piece', correct: false },
      { text: 'A decision made at the start', correct: false }
    ]
  },
  'crows-owls': {
    question: 'The crow kingdom keeps its name all through the war, yet what it contains never stops changing. What fits that?',
    explanation: 'A collection keeps its identity and order while items are added, replaced, and removed. That is a mutable list.',
    options: [
      { text: 'Keeps its order as it changes', correct: true },
      { text: 'A value that is fixed forever', correct: false },
      { text: 'A single count of all the crows', correct: false },
      { text: 'One single yes-or-no decision', correct: false }
    ]
  },
  'five-friends': {
    question: 'Five very different friends each have a role, and each must be reached by name and handled in turn. What helps?',
    explanation: 'All five live in one list, reached by index, and visited one by one in a loop - exactly how each friend gets their turn.',
    options: [
      { text: 'One list visited one by one', correct: true },
      { text: 'Five separate lonely variables', correct: false },
      { text: 'A single number counting them', correct: false },
      { text: 'A single yes-or-no decision', correct: false }
    ]
  },
  'elephant-caravan': {
    question: 'Both caravans hold the same kinds of elephants, yet one arrives safely. The difference is the order they are handled. What matters?',
    explanation: 'A list keeps items in an exact sequence, and processing follows that stored order - the theme of the marching caravan.',
    options: [
      { text: 'Order stored and followed exactly', correct: true },
      { text: 'Lists scramble themselves to fit', correct: false },
      { text: 'Every item behaves the same anywhere', correct: false },
      { text: 'Order only matters for numbers', correct: false }
    ]
  },
  'wise-quail': {
    question: 'The wise quail never speaks of birds one by one - she speaks of the whole flock at once. How should the birds be kept?',
    explanation: 'The entire flock sits in one list - counted with len() and visited with a loop, so the group acts as one.',
    options: [
      { text: 'The whole flock in one list', correct: true },
      { text: 'One separate variable per bird', correct: false },
      { text: 'A single yes-or-no choice', correct: false },
      { text: 'One large number for all', correct: false }
    ]
  },
  'lion-mouse': {
    question: 'The mouse does one small, useful job - gnaw ropes to free a friend. How should that job be wrapped so it can be reused?',
    explanation: 'The task becomes a small helper that takes the job and hands back a result - a function that returns its answer.',
    options: [
      { text: 'A reusable helper with a result', correct: true },
      { text: 'One print repeated many times over', correct: false },
      { text: 'A decision that is made just once', correct: false },
      { text: 'One long string holding every word', correct: false }
    ]
  },
  'tortoise-geese': {
    question: 'The geese have one plan that works for any traveller - today the tortoise, tomorrow someone new. What makes this possible?',
    explanation: 'The flight is a function defined once; its parameter receives a different argument on every call, so one plan fits all.',
    options: [
      { text: 'One function serves many calls', correct: true },
      { text: 'Rewrite the whole plan each time', correct: false },
      { text: 'A single value that never changes', correct: false },
      { text: 'A single yes-or-no decision', correct: false }
    ]
  },
  'ruru-deer': {
    question: 'Ruru takes in a drowning man and gives back safety - input in, answer out, the same way every time. What is this?',
    explanation: 'The rescue is a function: it receives input through parameters and hands back a result with return.',
    options: [
      { text: 'Takes input, gives a result back', correct: true },
      { text: 'Keeps one value forever fixed', correct: false },
      { text: 'A loop that never finishes its run', correct: false },
      { text: 'Two programs running far apart', correct: false }
    ]
  },
  'jackal-drum': {
    question: 'The jackal does not invent a new plan for every noise - he uses one method, called again and again, on each mystery. What is this?',
    explanation: 'The whole procedure is wrapped once in a function, ready to be called with any new mystery - one method for every fright.',
    options: [
      { text: 'One method called anew per mystery', correct: true },
      { text: 'Retype every step from scratch', correct: false },
      { text: 'Store a single value forever', correct: false },
      { text: 'Make a choice without looking', correct: false }
    ]
  },
  'sparrow-elephant': {
    question: 'No one friend can fight the elephant, yet the plan works because each owns one clear action and they run in turn. What builds this?',
    explanation: 'The big task is split into small named functions - each doing one job - and called in order, so separate actions combine into one plan.',
    options: [
      { text: 'Split one task into small helpers', correct: true },
      { text: 'One huge block that never changes', correct: false },
      { text: 'Copy the same code everywhere', correct: false },
      { text: 'Trust the task to solve itself', correct: false }
    ]
  }
};

export function generateRiddle(storyId, fallback) {
  const def = RIDDLES[storyId];
  if (!def) return fallback;

  const shuffled = shuffle(def.options.map((o) => o.text));
  const correctText = def.options.find((o) => o.correct).text;

  return {
    question: def.question,
    explanation: def.explanation,
    options: shuffled,
    correctIndex: shuffled.indexOf(correctText)
  };
}
