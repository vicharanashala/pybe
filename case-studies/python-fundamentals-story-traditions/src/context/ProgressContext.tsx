import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { allTopics, type TopicId } from "../data/curriculum";
import {
  getCurrentLevel,
  getLevelForTopic,
  learningLevels,
  getLevelProgress,
} from "../data/levels";
import { stepPedagogyMap } from "../data/pedagogy";
import {
  readStoryState,
  saveStoryState,
} from "../../../../shared/story-state.mjs";
const initialVault = {
  Persia: "Gold Coins",
  Calicut: "Black Pepper",
  Golconda: "Star Emerald",
};
function useLearningState() {
  const saved = React.useMemo(
    () => readStoryState(localStorage, "story-traditions", "state", {}),
    [],
  );
  const [currentStep, setCurrentStep] = useState(0),
    [completedSteps, setCompletedSteps] = useState<boolean[]>(
      new Array(15).fill(false),
    );
  const [activeTopicId, setActiveTopicId] = useState<TopicId>("dictionaries"),
    [completedTopics, setCompletedTopics] = useState<TopicId[]>(
      saved.completedTopics || [],
    );
  const [userReflection, setUserReflection] = useState(""),
    [aiFeedback, setAiFeedback] = useState("");
  const [vaultState, setVaultState] = useState<Record<string, any>>({
      ...initialVault,
    }),
    [challengesCompleted, setChallengesCompleted] = useState<boolean[]>([]),
    [pedagogyProgress, setPedagogyProgress] = useState<Record<number, boolean>>(
      {},
    );
  useEffect(() => {
    saveStoryState(localStorage, "story-traditions", "state", {
      completedTopics,
    });
  }, [completedTopics]);
  const currentLevel = getCurrentLevel(completedTopics);
  const setStep = (step: number) => {
    if (step < 0 || step > 14) return;
    setCurrentStep(step);
    setCompletedSteps((prev) => prev.map((v, i) => v || i === step));
    if (step === 13)
      setCompletedTopics((prev) =>
        prev.includes(activeTopicId) ? prev : [...prev, activeTopicId],
      );
    setPedagogyProgress((prev) => ({ ...prev, [step]: true }));
  };
  const nextStep = () => setStep(currentStep + 1),
    prevStep = () => setStep(currentStep - 1);
  const selectTopic = (topicId: TopicId) => {
    const targetLevel = getLevelForTopic(topicId);

    if (!targetLevel) {
      return;
    }

    // Allow only if level 1 (Foundation) or previous level is unlocked
    if (targetLevel.id > 1) {
      const prevLevel = learningLevels.find((l) => l.id === targetLevel.id - 1);
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
    const currentIdx = allTopics.findIndex((t) => t.id === activeTopicId);
    if (currentIdx === -1) return null;

    // Search forward from current topic
    for (let i = currentIdx + 1; i < allTopics.length; i++) {
      const candidate = allTopics[i];
      if (completedTopics.includes(candidate.id)) continue;
      const targetLevel = getLevelForTopic(candidate.id);
      if (!targetLevel) continue;
      if (targetLevel.id === 1) return candidate.id;
      const prevLevel = learningLevels.find((l) => l.id === targetLevel.id - 1);
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
      const prevLevel = learningLevels.find((l) => l.id === targetLevel.id - 1);
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

  const submitReflection = (
    text: string,
    _retiredGrade: null,
    feedback: string,
  ) => {
    setUserReflection(text);
    setAiFeedback(feedback);
  };
  const updateVault = (
    key: string,
    value: any,
    action: "add" | "update" | "delete",
  ) =>
    setVaultState((prev) => {
      const next = { ...prev };
      if (action === "delete") delete next[key];
      else next[key] = value;
      return next;
    });
  const replaceVault = (next: Record<string, any>) => setVaultState(next);
  const resetVault = () => setVaultState({ ...initialVault });
  const completeChallenge = (index: number) =>
    setChallengesCompleted((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  const markPedagogy = (step: number) =>
    setPedagogyProgress((prev) => ({ ...prev, [step]: true }));
  const resetAll = () => {
    setCurrentStep(0);
    setCompletedSteps(new Array(15).fill(false));
    setCompletedTopics([]);
    setUserReflection("");
    setAiFeedback("");
    resetVault();
    setChallengesCompleted([]);
    setActiveTopicId("dictionaries");
    setPedagogyProgress({});
  };
  return {
    currentStep,
    completedSteps,
    activeTopicId,
    completedTopics,
    userReflection,
    aiFeedback,
    vaultState,
    challengesCompleted,
    pedagogyProgress,
    currentLevel,
    setStep,
    nextStep,
    prevStep,
    selectTopic,
    getNextUnlockedTopic,
    continueToNextTopic,
    submitReflection,
    updateVault,
    replaceVault,
    resetVault,
    completeChallenge,
    markPedagogy,
    resetAll,
  };
}
const ProgressContext = createContext<
  ReturnType<typeof useLearningState> | undefined
>(undefined);
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const value = useLearningState();
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw Error("ProgressProvider is required");
  return value;
}
