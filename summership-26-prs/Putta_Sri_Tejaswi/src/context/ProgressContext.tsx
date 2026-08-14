import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { TopicId } from '../data/curriculum';
import { allTopics } from '../data/curriculum';
import { getRandomCard, type CharacterCard } from '../data/characterCards';
import { getCurrentLevel, type LearningLevel, getLevelForTopic, learningLevels, getLevelProgress } from '../data/levels';
import { getArtifactForTradition, getGadgetForTopic, type StoryArtifact, type StoryGadget } from '../data/rewards';
import { stepPedagogyMap } from '../data/pedagogy';

export interface AIScores {
  reasoning: number;
  reflection: number;
  criticalThinking: number;
  creativity: number;
  communication: number;
  promptQuality: number;
}

export interface ProgressContextType {
  currentStep: number;
  completedSteps: boolean[];
  completedTopics: TopicId[];
  userReflection: string;
  aiScores: AIScores | null;
  aiFeedback: string;
  unlockedBadges: string[];
  theme: 'light' | 'dark';
  vaultState: Record<string, any>;
  challengesCompleted: boolean[];
  activeTopicId: TopicId;
  collectedCards: CharacterCard[];
  collectedArtifacts: StoryArtifact[];
  collectedGadgets: StoryGadget[];
  pedagogyProgress: Record<number, boolean>;
  currentLevel: LearningLevel;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitReflection: (text: string, scores: AIScores, feedback: string) => void;
  unlockBadge: (badge: string) => void;
  toggleTheme: () => void;
  updateVault: (key: string, value: any, action: 'add' | 'update' | 'delete') => void;
  resetVault: () => void;
  completeChallenge: (index: number) => void;
  selectTopic: (topicId: TopicId) => void;
  resetAll: () => void;
  collectRandomCard: (topicId: TopicId) => CharacterCard | null;
  collectArtifact: (tradition: string) => StoryArtifact | null;
  collectGadget: (topicId: TopicId) => StoryGadget | null;
  markPedagogy: (step: number) => void;
  getNextUnlockedTopic: () => TopicId | null;
  continueToNextTopic: () => void;
}

const initialVault = {
  "Persia": "Gold Coins",
  "Calicut": "Black Pepper",
  "Golconda": "Star Emerald"
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(15).fill(false));
  const [userReflection, setUserReflection] = useState<string>('');
  const [aiScores, setAiScores] = useState<AIScores | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [vaultState, setVaultState] = useState<Record<string, any>>(initialVault);
  const [challengesCompleted, setChallengesCompleted] = useState<boolean[]>(new Array(4).fill(false));
  const [activeTopicId, setActiveTopicId] = useState<TopicId>('dictionaries');
  const [completedTopics, setCompletedTopics] = useState<TopicId[]>([]);
  const [collectedCards, setCollectedCards] = useState<CharacterCard[]>([]);
  const [collectedArtifacts, setCollectedArtifacts] = useState<StoryArtifact[]>([]);
  const [collectedGadgets, setCollectedGadgets] = useState<StoryGadget[]>([]);
  const [pedagogyProgress, setPedagogyProgress] = useState<Record<number, boolean>>({});

  const currentLevel = getCurrentLevel(completedTopics);

  useEffect(() => {
    const savedTheme = localStorage.getItem('pybe-theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pybe-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setStep = (step: number) => {
    if (step >= 0 && step < 15) {
      setCurrentStep(step);
      setCompletedSteps(prev => {
        const next = [...prev];
        next[step] = true;
        return next;
      });
      if (step === 13) {
        setCompletedTopics(prev => {
          if (prev.includes(activeTopicId)) return prev;
          return [...prev, activeTopicId];
        });
      }
      // Auto-mark pedagogy stage for this step and all prior stages
      const stageIndex = stepPedagogyMap[step];
      if (stageIndex !== undefined) {
        setPedagogyProgress(prev => {
          const next = { ...prev, [step]: true };
          // Also mark all steps whose stage <= current stage as visited
          for (let s = 0; s <= step; s++) {
            const sStage = stepPedagogyMap[s];
            if (sStage !== undefined && sStage <= stageIndex) {
              next[s] = true;
            }
          }
          return next;
        });
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 14) {
      setStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectTopic = (topicId: TopicId) => {
    const targetLevel = getLevelForTopic(topicId);
    
    if (!targetLevel) {
      return;
    }
    
    // Allow only if level 1 (Foundation) or previous level is unlocked
    if (targetLevel.id > 1) {
      const prevLevel = learningLevels.find(l => l.id === targetLevel.id - 1);
      if (prevLevel) {
        const prevProgress = getLevelProgress(prevLevel, completedTopics);
        if (prevProgress < targetLevel.unlockThreshold) {
          return; // Level not unlocked yet
        }
      }
    }
    
    setActiveTopicId(topicId);
    setChallengesCompleted([]);
    setStep(2);
  };

  const getNextUnlockedTopic = useCallback((): TopicId | null => {
    const currentIdx = allTopics.findIndex(t => t.id === activeTopicId);
    if (currentIdx === -1) return null;

    // Search forward from current topic
    for (let i = currentIdx + 1; i < allTopics.length; i++) {
      const candidate = allTopics[i];
      if (completedTopics.includes(candidate.id)) continue;
      const targetLevel = getLevelForTopic(candidate.id);
      if (!targetLevel) continue;
      if (targetLevel.id === 1) return candidate.id;
      const prevLevel = learningLevels.find(l => l.id === targetLevel.id - 1);
      if (prevLevel) {
        const prevProgress = getLevelProgress(prevLevel, completedTopics);
        if (prevProgress >= targetLevel.unlockThreshold) return candidate.id;
      }
    }
    // Wrap around to beginning
    for (let i = 0; i < currentIdx; i++) {
      const candidate = allTopics[i];
      if (completedTopics.includes(candidate.id)) continue;
      const targetLevel = getLevelForTopic(candidate.id);
      if (!targetLevel) continue;
      if (targetLevel.id === 1) return candidate.id;
      const prevLevel = learningLevels.find(l => l.id === targetLevel.id - 1);
      if (prevLevel) {
        const prevProgress = getLevelProgress(prevLevel, completedTopics);
        if (prevProgress >= targetLevel.unlockThreshold) return candidate.id;
      }
    }
    return null;
  }, [activeTopicId, completedTopics]);

  const continueToNextTopic = useCallback(() => {
    const nextId = getNextUnlockedTopic();
    if (nextId) {
      selectTopic(nextId);
    } else {
      // All topics completed or none available — go to Story Library
      setStep(1);
    }
  }, [getNextUnlockedTopic, selectTopic, setStep]);

  const submitReflection = (text: string, scores: AIScores, feedback: string) => {
    setUserReflection(text);
    setAiScores(scores);
    setAiFeedback(feedback);
    unlockBadge('Reflection Master');
  };

  const unlockBadge = (badge: string) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badge)) return prev;
      return [...prev, badge];
    });
  };

  const updateVault = (key: string, value: any, action: 'add' | 'update' | 'delete') => {
    setVaultState(prev => {
      const next = { ...prev };
      if (action === 'delete') {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const resetVault = () => {
    setVaultState(initialVault);
  };

  const completeChallenge = (index: number) => {
    setChallengesCompleted(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const collectRandomCard = (topicId: TopicId): CharacterCard | null => {
    const card = getRandomCard(topicId, collectedCards.map(c => c.id));
    if (card) {
      setCollectedCards(prev => [...prev, card]);
    }
    return card;
  };

  const collectArtifact = (tradition: string): StoryArtifact | null => {
    const artifact = getArtifactForTradition(tradition);
    if (artifact && !collectedArtifacts.some(a => a.id === artifact.id)) {
      setCollectedArtifacts(prev => [...prev, artifact]);
      return artifact;
    }
    return null;
  };

  const collectGadget = (topicId: TopicId): StoryGadget | null => {
    const gadget = getGadgetForTopic(topicId);
    if (gadget && !collectedGadgets.some(g => g.id === gadget.id)) {
      setCollectedGadgets(prev => [...prev, gadget]);
      return gadget;
    }
    return null;
  };

  const markPedagogy = (step: number) => {
    setPedagogyProgress(prev => ({ ...prev, [step]: true }));
  };

  const resetAll = () => {
    setCurrentStep(0);
    setCompletedSteps(new Array(15).fill(false));
    setUserReflection('');
    setAiScores(null);
    setAiFeedback('');
    setUnlockedBadges([]);
    setVaultState(initialVault);
    setChallengesCompleted(new Array(4).fill(false));
    setActiveTopicId('dictionaries');
    setCompletedTopics([]);
    setCollectedCards([]);
    setCollectedArtifacts([]);
    setCollectedGadgets([]);
    setPedagogyProgress({});
  };

  return (
    <ProgressContext.Provider value={{
      currentStep,
      completedSteps,
      completedTopics,
      userReflection,
      aiScores,
      aiFeedback,
      unlockedBadges,
      theme,
      vaultState,
      challengesCompleted,
      activeTopicId,
      collectedCards,
      collectedArtifacts,
      collectedGadgets,
      pedagogyProgress,
      currentLevel,
      setStep,
      nextStep,
      prevStep,
      submitReflection,
      unlockBadge,
      toggleTheme,
      updateVault,
      resetVault,
      completeChallenge,
      selectTopic,
      resetAll,
      collectRandomCard,
      collectArtifact,
      collectGadget,
      markPedagogy,
      getNextUnlockedTopic,
      continueToNextTopic,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
