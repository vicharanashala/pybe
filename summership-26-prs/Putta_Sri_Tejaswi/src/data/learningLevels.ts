import type { TopicId } from './curriculum';

export interface LearningLevel {
  id: string;
  name: string;
  description: string;
  topics: TopicId[];
  threshold: number;
  icon: string;
}

export const learningLevels: LearningLevel[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'Master the building blocks of Python: variables, arithmetic, and comparison.',
    topics: ['variables', 'arithmetic', 'comparison', 'strings'],
    threshold: 0.8,
    icon: '📚',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Navigate collections and data structures used in everyday programming.',
    topics: ['lists', 'tuples', 'sets', 'dictionaries'],
    threshold: 0.8,
    icon: '🧭',
  },
  {
    id: 'thinker',
    name: 'Thinker',
    description: 'Learn to make decisions and repeat actions with control flow.',
    topics: ['conditionals', 'loops', 'while-loops', 'functions'],
    threshold: 0.8,
    icon: '🧠',
  },
  {
    id: 'builder',
    name: 'Builder',
    description: 'Develop skills in data manipulation, search, and transformation.',
    topics: ['indexing', 'searching', 'filtering', 'counting', 'formatting', 'mutation'],
    threshold: 0.8,
    icon: '🔨',
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Validate input, organise code, and sort with confidence.',
    topics: ['validation', 'modules', 'sorting'],
    threshold: 0.8,
    icon: '🏆',
  },
];

export function getLevelForTopic(topicId: TopicId): LearningLevel | undefined {
  return learningLevels.find(l => l.topics.includes(topicId));
}

export function getCompletedTopicsInLevel(level: LearningLevel, completedTopics: TopicId[]): TopicId[] {
  return level.topics.filter(t => completedTopics.includes(t));
}

export function isLevelUnlocked(level: LearningLevel, completedTopics: TopicId[]): boolean {
  const levelIndex = learningLevels.indexOf(level);
  if (levelIndex === 0) return true;
  const prevLevel = learningLevels[levelIndex - 1];
  const completed = getCompletedTopicsInLevel(prevLevel, completedTopics).length;
  return completed >= Math.ceil(prevLevel.topics.length * prevLevel.threshold);
}

export function getLevelProgress(level: LearningLevel, completedTopics: TopicId[]): number {
  const completed = getCompletedTopicsInLevel(level, completedTopics).length;
  return Math.min(1, completed / level.topics.length);
}
