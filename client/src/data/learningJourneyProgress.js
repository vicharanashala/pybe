const LEARNING_JOURNEY_PROGRESS_KEY = 'pybe-learning-journey-progress';

const DEFAULT_LEARNING_JOURNEY_STATUS = {
  stage: 'story-selection',
  stageLabel: 'Choose a story',
  storyId: null,
  storyTitle: null,
  sceneIndex: null,
  sceneCount: null,
  score: null,
  progressPercent: 0,
  updatedAt: null
};

function readLearningJourneyStatus() {
  if (typeof window === 'undefined') {
    return DEFAULT_LEARNING_JOURNEY_STATUS;
  }

  try {
    const stored = window.localStorage.getItem(LEARNING_JOURNEY_PROGRESS_KEY);
    return stored
      ? { ...DEFAULT_LEARNING_JOURNEY_STATUS, ...JSON.parse(stored) }
      : DEFAULT_LEARNING_JOURNEY_STATUS;
  } catch (error) {
    return DEFAULT_LEARNING_JOURNEY_STATUS;
  }
}

function saveLearningJourneyStatus(status) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LEARNING_JOURNEY_PROGRESS_KEY, JSON.stringify(status));
  window.dispatchEvent(new Event('learning-journey-progress-updated'));
}

export { readLearningJourneyStatus, saveLearningJourneyStatus };