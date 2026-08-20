import type { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-tunnel',
    name: 'First Tunnels',
    description: 'Watched the workers dig the colony\'s first tunnel.',
    icon: 'Pickaxe',
    condition: { type: 'completeScene', value: 3 },
    xp: 50,
  },
  {
    id: 'pattern-spotter',
    name: 'Pattern Spotter',
    description: 'Recognized the repeating excavation rule across chambers.',
    icon: 'Repeat',
    condition: { type: 'completeScene', value: 5 },
    xp: 120,
  },
  {
    id: 'recursion-revealed',
    name: 'Recursion Revealed',
    description: 'Unlocked the concept of recursion from the colony pattern.',
    icon: 'Sparkles',
    condition: { type: 'discoverRecursion' },
    xp: 200,
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Answered every scene quiz correctly.',
    icon: 'Brain',
    condition: { type: 'allQuizzesCorrect' },
    xp: 250,
  },
  {
    id: 'colony-architect',
    name: 'Colony Architect',
    description: 'Completed the full colony build (all scenes).',
    icon: 'Castle',
    condition: { type: 'earnXp', value: 1000 },
    xp: 300,
  },
];
