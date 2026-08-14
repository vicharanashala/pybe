// ---------------------------------------------------------------------------
// The five gadgets Nobita keeps needing, and the pocket each one belongs in.
// varName is the "good" Python identifier the learner will discover in
// Scene 5, then actually use in Scenes 6-10. badNames are the joke options
// shown alongside it so the learner can feel, not just read, why a
// meaningful name matters.
// ---------------------------------------------------------------------------

export const GADGETS = [
  { id: 'door', name: 'Anywhere Door', emoji: '🚪', pocketId: 'travel', pocketLabel: 'Travel Pocket', varName: 'travelDoor', badNames: ['box1', 'thing', 'abc'] },
  { id: 'copter', name: 'Take-copter', emoji: '🪁', pocketId: 'flying', pocketLabel: 'Flying Pocket', varName: 'takeCopter', badNames: ['item2', 'stuff', 'x'] },
  { id: 'light', name: 'Small Light', emoji: '🔦', pocketId: 'light', pocketLabel: 'Light Pocket', varName: 'smallLight', badNames: ['thing2', 'obj', 'data1'] },
  { id: 'cloth', name: 'Time Cloth', emoji: '🧣', pocketId: 'time', pocketLabel: 'Time Pocket', varName: 'timeCloth', badNames: ['box2', 'val', 'temp'] },
  { id: 'bread', name: 'Memory Bread', emoji: '🍞', pocketId: 'food', pocketLabel: 'Food Pocket', varName: 'memoryBread', badNames: ['thing3', 'item1', 'foo'] }
];

// Gadget that later overwrites the Travel Pocket in Scene 8, to demonstrate
// that a variable replaces its value rather than keeping both.
export const TIME_MACHINE = { id: 'timeMachine', name: 'Time Machine', emoji: '⏰' };

// A brand-new gadget used only in the Scene 10 finale, so the naming
// activity there feels like a fresh decision rather than a repeat.
export const ROBOT_DOG = {
  id: 'robotDog',
  name: 'Robot Dog',
  emoji: '🐕',
  pocketLabel: 'New Pocket',
  varName: 'robotDog',
  badNames: ['thing4', 'pet', 'x2']
};

// Junk gadgets used purely to fill the messy pocket in Scenes 1-2 -- pure
// visual/interaction noise, never assigned to a real memory pocket.
export const JUNK_GADGETS = [
  '🚀', '🥁', '🎺', '📻', '🎈', '🪁', '🧸', '🎯',
  '🎲', '🪄', '🔮', '📦', '🪢', '🧶', '📣', '🎀',
  '🪅', '🔔', '🧵', '🎏'
];
