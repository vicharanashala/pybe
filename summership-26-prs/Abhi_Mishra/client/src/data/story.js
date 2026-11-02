// How many wrong chart choices the investors tolerate before the deal breaks.
// 1 = the original rule (one wrong chart ends the pitch). Set 2 or 3 for a gentler classroom mode.
export const MAX_MISTAKES = 1;
export const CONFIDENCE = { start: 48, correct: 7, wrong: -8, quizRight: 3, quizWrong: -3 };

export const stages = [
  { id: 'welcome', eyebrow: 'NOVA-01 / INVESTOR DAY', title: 'The room is waiting.',
    body: 'Your manager has just asked you to present NovaTech to the investors. You have one opportunity to show that the company deserves its next round of funding.',
    action: 'Enter the investor room' },
  { id: 'meeting', eyebrow: 'THE FIRST QUESTION', title: 'Make the case.',
    body: 'We love the idea. Can you show us how the business is performing?', action: 'Present the numbers' },
  { id: 'table', eyebrow: 'THE PROBLEM', title: 'The numbers are true. The story is hidden.',
    body: 'The table is accurate, but the room is quiet. Investors need to see momentum, not hunt for it.', action: 'Find a clearer story' },
  { id: 'plots', eyebrow: 'THE PIVOT', title: 'Choose the view that answers the question.',
    body: 'Your data is ready. Your next decision is visual.', action: 'Begin visualization challenge' }
];
