const THEMES = {
  variables: {
    message: 'A single pebble changed the water for the crow. Before I reveal the idea, recall what grew and changed as the tale went on.',
    prompt: 'Think of the things that changed as the story unfolds. What kept a value, what was updated, and what stayed the same?'
  },
  conditionals: {
    message: 'Every animal chose a path based on what they saw. Before I reveal the idea, think about the choices made along the way.',
    prompt: 'Recall the decisions in the story. What did each character look at before choosing, and what happened for each choice?'
  },
  loops: {
    message: 'Those steps were repeated again and again. Before I reveal the idea, think about what happened over and over — and what finally ended it.',
    prompt: 'Notice the repeats in the tale. Which action came around many times, and what changed with each repeat until it was done?'
  },
  lists: {
    message: 'Many things gathered into one place. Before I reveal the idea, think about how every one was kept together and touched in order.',
    prompt: 'Think about how the many things in the story were gathered. How were they kept together, and how were they each visited safely?'
  },
  functions: {
    message: 'One clear action, called upon again and again, saved the day. Before I reveal the idea, think about what was reused throughout the tale.',
    prompt: 'Notice what was done more than once. How did the characters reuse a plan, give it a name, and call on it whenever it was needed?'
  }
};

const GENERIC_MESSAGE = 'Take a moment to reflect…';
const GENERIC_PROMPT =
  'Before the hidden idea is revealed, sit quietly with what the story showed you. What did you notice? What do you think the tale was really about?';

const STORY_OVERRIDES = {
  'thirsty-crow': {
    prompt: 'As the story unfolded, what did the crow need to remember and keep track of?',
    revealed: 'We give names to things so we can remember them, keep track of them, and notice how they change.'
  },
  'milkmaid-pail': {
    message: 'Meera carries a pail of milk and begins imagining all the things it could help her gain. Before I reveal the idea, recall what she kept track of in her thoughts.',
    prompt: 'As the story unfolded, what did Meera need to remember and keep track of as she imagined what could happen?',
    revealed: 'We give names to things so we can remember what we have, keep track of what we hope for, and notice how things can change.'
  },
  'dog-reflection': {
    message: 'The dog sees his reflection and believes another dog has something he wants. Before I reveal the idea, recall how what the dog had in mind changed as the story unfolded.',
    prompt: 'As the story unfolded, what changed in the dog\u2019s thoughts when he saw the other dog?',
    revealed: 'We give things names so we can remember them, and what they hold can change as the story unfolds.'
  },
  'elephant-dog': {
    message: 'The elephant and the dog share a friendship, and their relationship changes through what they experience together. Before I reveal the idea, recall what the story shows us about keeping track of something that can change.',
    prompt: 'As the story unfolded, what did we need to keep track of as the elephant and the dog\u2019s situation changed?',
    revealed: 'We can give something a name so we can keep track of it, even when it changes.'
  },
  'blue-jackal': {
    message: 'The blue jackal\u2019s appearance changes how the other animals see him, and his identity seems to shift with it. Before I reveal the idea, recall what changed and what the jackal wanted others to believe.',
    prompt: 'As the story unfolded, what changed about the jackal and what others believed about him?',
    revealed: 'The name stays the same, but what it represents can change.'
  },
  'monkey-crocodile': {
    message: 'The monkey finds himself in danger when the crocodile reveals his true intention. Before I reveal the idea, recall how the monkey changed what he chose to do when the situation changed.',
    prompt: 'As the story unfolded, what did the monkey notice that made him change his decision?',
    revealed: 'Sometimes what we choose to do depends on what is happening around us. We look at the situation, check what is true, and then decide what to do next.'
  },
  'heron-crab': {
    message: 'The heron makes a promise that seems helpful, but the crab notices clues that something is not right. Before I reveal the idea, recall what the crab noticed and how it guided his next choice.',
    prompt: 'As the story unfolded, what clue did the crab notice that helped him choose what to do next?',
    revealed: 'When we notice a clue, we can check it and choose what to do next. A program can do the same by checking a condition and choosing a path.'
  },
  'brahmin-goat': {
    message: 'The Brahmin hears different warnings about the goat, and each one makes him question what he sees. Before I reveal the idea, recall how each new claim changed the path he considered.',
    prompt: 'As the story unfolded, how did the Brahmin\u2019s choices change when he heard different warnings about the goat?',
    revealed: 'When there are different possibilities, we can check them one by one and choose the path that fits.'
  },
  'monkey-king': {
    message: 'The Monkey King faces a dangerous situation and must decide what to do to protect his troop. Before I reveal the idea, recall how he judged the situation and chose his next step.',
    prompt: 'As the story unfolded, what did the Monkey King notice that helped him decide what to do?',
    revealed: 'When there are different possibilities, we can test each condition in order and choose the path that fits.'
  },
  'crow-snake': {
    message: 'The crow faces a dangerous snake and must find a way to protect its nest. Before I reveal the idea, recall how the crow considered the situation and chose what to do next.',
    prompt: 'As the story unfolded, what did the crow notice that helped it decide which path to take?',
    revealed: 'Checking each condition in turn helps us choose the path that fits.'
  },
  'tortoise-hare': {
    message: 'The tortoise keeps moving forward while the hare rushes ahead and stops along the way. Before I reveal the idea, recall what the tortoise continued doing again and again.',
    prompt: 'As the story unfolded, what did the tortoise keep doing that helped him move closer to the finish?',
    revealed: 'Repeating a small action again and again can help us keep moving toward a goal.'
  },
  'banyan-deer': {
    message: 'The Banyan Deer faces the same danger each day as the deer are taken away one by one. Before I reveal the idea, recall what the deer kept doing each day and how their actions continued.',
    prompt: 'As the story unfolded, what did the deer keep doing again and again until the situation finally changed?',
    revealed: 'Sometimes a repeated action continues until something changes.'
  },
  'ant-dove': {
    message: 'The ant falls into danger, but the dove notices what is happening and helps. Before I reveal the idea, recall how the dove kept responding when the ant needed help.',
    prompt: 'As the story unfolded, how did the dove keep helping the ant when danger appeared?',
    revealed: 'Small steps, repeated to the goal.'
  },
  'golden-goose': {
    message: 'The farmer discovers that the golden goose gives him one golden egg each day. Before I reveal the idea, recall what kept happening day after day and how the farmer responded.',
    prompt: 'As the story unfolded, what kept happening each day when the farmer cared for the golden goose?',
    revealed: 'One small action, repeated with each passing day.'
  },
  'monkey-wedge': {
    message: 'The monkey notices the workers leave their work behind and becomes curious about the wedge holding the logs apart. Before I reveal the idea, recall what the monkey kept doing and what happened as he continued.',
    prompt: 'As the story unfolded, what did the monkey keep doing while the wedge was still holding the logs apart?',
    revealed: 'An action can keep repeating while a condition still holds.'
  },
  'elephant-blind-men': {
    message: 'The blind men each discover a different part of the elephant, and each holds on to what they have learned. Before I reveal the idea, recall how their separate discoveries came together to tell a bigger story.',
    prompt: 'As the story unfolded, what did each person discover, and how did their different discoveries fit together?',
    revealed: 'Different pieces can be kept together as one collection.'
  },
  'crows-owls': {
    message: 'The crows live and act together as a group, while the owls remain their enemies. Before I reveal the idea, recall how the crows stayed connected and worked together as one group.',
    prompt: 'As the story unfolded, what did the crows keep together as they worked as a group?',
    revealed: 'Things can change while their order stays connected.'
  },
  'five-friends': {
    message: 'The dove, crow, mouse, tortoise, and deer each play an important part in helping one another. Before I reveal the idea, recall how all of them stayed connected as their story unfolded.',
    prompt: 'As the story unfolded, who were the different friends working together, and how did each one have a place in the group?',
    revealed: 'Each one can be visited, one by one.'
  },
  'elephant-caravan': {
    message: 'The elephants travel together in a careful order, with each one following along the path. Before I reveal the idea, recall how the elephants stayed together as the caravan moved forward.',
    prompt: 'As the story unfolded, how did the elephants move together while keeping their place in the caravan?',
    revealed: 'A list keeps each item stored in order, so we can follow it exactly.'
  },
  'wise-quail': {
    message: 'The wise quail keeps the birds together as they face danger, with each bird playing its part in the group. Before I reveal the idea, recall how the quail kept the flock together.',
    prompt: 'As the story unfolded, how did the wise quail keep the whole flock together as they faced danger?',
    revealed: 'A list lets us keep the whole flock together in one place, with each bird stored as an item.'
  },
  'lion-mouse': {
    message: 'The lion spares the little mouse, and later the mouse returns to help when the lion is trapped. Before I reveal the idea, recall how one small act of help became useful again when it was needed.',
    prompt: 'As the story unfolded, how did the mouse\u2019s small act of help become useful again when the lion needed it?',
    revealed: 'A function is a named action we can call again whenever we need it.'
  },
  'tortoise-geese': {
    message: 'The tortoise wants to travel with the geese, so they find a clever way to carry him through the sky. Before I reveal the idea, recall how their clever plan could help whenever they needed to carry the tortoise.',
    prompt: 'As the story unfolded, how did the same clever plan help the geese carry the tortoise safely?',
    revealed: 'One named action can serve many calls, just as the geese could use the same plan whenever they needed to carry the tortoise.'
  },
  'ruru-deer': {
    message: 'The Ruru Deer faces a difficult situation and responds with courage and compassion. Before I reveal the idea, recall what the deer was given by the situation and what came from his response.',
    prompt: 'As the story unfolded, what did the Ruru Deer receive from the situation, and what did his actions bring about?',
    revealed: 'A function can take something in and give something back, just as the Ruru Deer\u2019s response led to an outcome.'
  },
  'jackal-drum': {
    message: 'The jackal hears a strange sound and carefully investigates until he discovers where it is coming from. Before I reveal the idea, recall how the jackal followed a clear way of finding the answer.',
    prompt: 'As the story unfolded, what steps did the jackal follow to discover what was really making the sound?',
    revealed: 'A function can hold a useful set of steps in one named action, ready to be called whenever that job needs to be done.'
  },
  'sparrow-elephant': {
    message: 'The sparrow faces a problem much bigger than herself, but she does not try to solve everything alone. Different helpers each play their part until the elephant is finally overcome. Before I reveal the idea, recall how the smaller actions came together.',
    prompt: 'As the story unfolded, how did the sparrow and her helpers each play a small part in solving a much bigger problem?',
    revealed: 'A big task can be broken into smaller named actions, with each function doing its own part.'
  }
};

export function generateReflection(story) {
  const theme = THEMES[story.conceptSlug] ||
    (THEMES[story.concept] ? THEMES[story.concept] : null);
  const base = theme || { message: GENERIC_MESSAGE, prompt: GENERIC_PROMPT };
  const override = STORY_OVERRIDES[story.id];
  return override
    ? { ...base, ...override }
    : base;
}
