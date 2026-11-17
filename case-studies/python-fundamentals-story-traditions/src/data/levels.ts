import type { TopicId } from './curriculum';

export interface LearningLevel {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: TopicId[];
  unlockThreshold: number; // percentage of previous level needed
}

export const learningLevels: LearningLevel[] = [
  {
    id: 1,
    name: 'Foundation',
    description: 'Build your first Python building blocks — variables, numbers, comparisons, text, and lists.',
    icon: '🌱',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    topics: ['variables', 'arithmetic', 'comparison', 'strings', 'lists'],
    unlockThreshold: 0,
  },
  {
    id: 2,
    name: 'Explorer',
    description: 'Discover new data structures — tuples, sets, dictionaries, conditionals, and loops.',
    icon: '🧭',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    topics: ['tuples', 'sets', 'dictionaries', 'conditionals', 'loops'],
    unlockThreshold: 80,
  },
  {
    id: 3,
    name: 'Thinker',
    description: 'Think like a programmer — functions, indexing, searching, and while loops.',
    icon: '🧠',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    topics: ['while-loops', 'functions', 'indexing', 'searching'],
    unlockThreshold: 80,
  },
  {
    id: 4,
    name: 'Builder',
    description: 'Build real solutions with filtering, counting, formatting, and mutation.',
    icon: '⚒️',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    topics: ['filtering', 'counting', 'formatting', 'mutation'],
    unlockThreshold: 80,
  },
  {
    id: 5,
    name: 'Master',
    description: 'Master advanced skills — validation, modules, and sorting.',
    icon: '👑',
    color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    topics: ['validation', 'modules', 'sorting'],
    unlockThreshold: 80,
  },
];

export function getLevelForTopic(topicId: TopicId): LearningLevel | undefined {
  return learningLevels.find(level => level.topics.includes(topicId));
}

export function getLevelProgress(level: LearningLevel, completedTopics: TopicId[]): number {
  const completed = level.topics.filter(t => completedTopics.includes(t)).length;
  return Math.round((completed / level.topics.length) * 100);
}

export function isLevelUnlocked(level: LearningLevel, completedTopics: TopicId[]): boolean {
  if (level.id === 1) return true;
  const prevLevel = learningLevels.find(l => l.id === level.id - 1);
  if (!prevLevel) return true;
  const prevProgress = getLevelProgress(prevLevel, completedTopics);
  return prevProgress >= level.unlockThreshold;
}

export function getUnlockedLevels(completedTopics: TopicId[]): LearningLevel[] {
  return learningLevels.filter(level => isLevelUnlocked(level, completedTopics));
}

export function getCurrentLevel(completedTopics: TopicId[]): LearningLevel {
  const unlocked = getUnlockedLevels(completedTopics);
  return unlocked[unlocked.length - 1] ?? learningLevels[0];
}
