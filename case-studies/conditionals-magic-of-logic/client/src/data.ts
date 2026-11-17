import { Chapter } from './types';

export const chapters: Chapter[] = [
  {
    id: 'ch1',
    title: 'Chapter 1: The Magic of Logic',
    theme: 'Harry Potter',
    concept: 'Conditional Statements',
    isLocked: false,
    lessons: [
      { id: 'l1', title: 'The Train Duel' },
      { id: 'l2', title: 'The Sorting Ceremony' },
      { id: 'l3', title: 'Defense Against the Dark Arts' },
      { id: 'l4', title: 'The Potions Dungeon' },
      { id: 'l5', title: 'First Flying Class' }
    ]
  }
];
