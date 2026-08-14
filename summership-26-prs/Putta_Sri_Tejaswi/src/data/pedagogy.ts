export interface PedagogyStage {
  name: string;
  sanskrit: string;
  description: string;
  journeyDescription: string;
  color: string;
}

export const pedagogyStages: PedagogyStage[] = [
  { name: 'Shravana', sanskrit: 'श्रवण', description: 'Listening and hearing the story', journeyDescription: 'You are listening to the ancient tale — absorbing the world, the characters, and the problem they face.', color: 'text-amber-600 dark:text-amber-400' },
  { name: 'Manana', sanskrit: 'मनन', description: 'Contemplation and choosing your path', journeyDescription: 'You are reflecting on what you heard — considering which path the characters should take.', color: 'text-green-600 dark:text-green-400' },
  { name: 'Chintana', sanskrit: 'चिन्तन', description: 'Deep thought and immersion in the world', journeyDescription: 'You are thinking deeply about the problem — predicting what will happen and why.', color: 'text-blue-600 dark:text-blue-400' },
  { name: 'Acharya Samvada', sanskrit: 'आचार्य संवाद', description: 'Dialogue with the mentor', journeyDescription: 'You are in conversation with your mentor — exchanging ideas and discovering the Python way.', color: 'text-purple-600 dark:text-purple-400' },
  { name: 'Bodha', sanskrit: 'बोध', description: 'Understanding and insight', journeyDescription: 'You are gaining understanding — the concept clicks and you see how it works.', color: 'text-red-600 dark:text-red-400' },
  { name: 'Prayoga', sanskrit: 'प्रयोग', description: 'Hands-on interactive practice', journeyDescription: 'You are practicing with your hands — dragging, clicking, and building to reinforce learning.', color: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Jnana', sanskrit: 'ज्ञान', description: 'Knowledge through inner reflection', journeyDescription: 'You are internalizing knowledge — connecting the concept to your own understanding.', color: 'text-indigo-600 dark:text-indigo-400' },
  { name: 'Anubhava', sanskrit: 'अनुभव', description: 'Direct experience and mastery', journeyDescription: 'You are learning by doing — writing code, testing ideas, and seeing results firsthand.', color: 'text-orange-600 dark:text-orange-400' },
  { name: 'Siddhi', sanskrit: 'सिद्धि', description: 'Mastery and completion', journeyDescription: 'You have achieved mastery — reflecting on your journey and collecting your reward.', color: 'text-rose-600 dark:text-rose-400' },
];

export const stepPedagogyMap: Record<number, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 7,
  9: 7,
  10: 7,
  11: 8,
  12: 8,
  13: 8,
  14: 8,
};

export function getCurrentPedagogyStage(currentStep: number): PedagogyStage {
  const stageIndex = stepPedagogyMap[currentStep] ?? 0;
  return pedagogyStages[stageIndex];
}
