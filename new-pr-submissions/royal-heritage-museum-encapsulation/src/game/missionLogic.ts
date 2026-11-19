export type GameScreen = 'title' | 'intro' | 'briefing' | 'stage' | 'victory';

export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type SecurityStatus =
  | 'MONITORING'
  | 'BREACH ALERT'
  | 'VULNERABLE'
  | 'HARDENING'
  | 'PROTECTED'
  | 'SECURE';

export interface ArtifactMetadata {
  artifact: string;
  value: string;
  condition: string;
  location: string;
  curatorId: string;
}

export interface StageDescriptor {
  id: StageId;
  shortTitle: string;
  title: string;
  concept: string;
  objective: string;
  storyText: string;
  securityStatus: SecurityStatus;
}

export interface MissionProgress {
  currentScreen: GameScreen;
  activeStage: StageId;
  highestUnlockedStage: StageId;
  completedStages: StageId[];
  // Stage 1
  inspectedHotspots: string[];
  // Stage 2
  assignedRecords: Record<string, 'vase' | 'astrolabe'>;
  // Stage 3
  breachConceptsMatched: Record<string, string>;
  breachAttributesRestored: string[];
  // Stage 4
  testedPublicTamper: boolean;
  activatedPrivateLock: boolean;
  testedPrivateTamper: boolean;
  // Stage 5
  getterReadCount: number;
  validTempsTested: number[];
  invalidTempsTested: number[];
  // Stage 6
  selectedBlanks: Record<string, string>;
  simulationVectorsPassed: string[];
}

export const STORAGE_KEY = 'rhm_encapsulation_mission_v1';

export const ARTIFACT_METADATA: ArtifactMetadata = {
  artifact: 'Blue Heron Vase',
  value: '₹45,00,000',
  condition: 'Good',
  location: 'Gallery 4, Case B',
  curatorId: 'CUR-7',
};

export const STAGES: StageDescriptor[] = [
  {
    id: 1,
    shortTitle: 'Arrival',
    title: 'Museum Arrival',
    concept: 'Variables & Artifact Data',
    objective: 'Click all 4 points on the Blue Heron Vase display case to see what information the museum saves.',
    storyText:
      'Gallery 4 is quiet after closing hours. Before checking the security logs, look closely at the Blue Heron Vase in Case B to see every piece of information stored about it.',
    securityStatus: 'MONITORING',
  },
  {
    id: 2,
    shortTitle: 'Discovery',
    title: 'The First Security Discovery',
    concept: 'Organizing Related Information',
    objective: 'Sort all 6 loose museum notes into the right artifact folder so related facts stay together.',
    storyText:
      'On the curator desk, museum notes were left as loose, separate variables. When notes are not grouped together, it is easy to mix up one artifact’s value or location with another.',
    securityStatus: 'MONITORING',
  },
  {
    id: 3,
    shortTitle: 'Breach',
    title: 'The Security Breach',
    concept: 'Classes, Objects & Attributes',
    objective: 'Match Class, Object, and Attributes, then restore the real Blue Heron Vase information.',
    storyText:
      'ALERT! An unauthorized person has attempted to change the Blue Heron Vase’s value and condition. Check the display case blueprint and fix the vase’s real information.',
    securityStatus: 'BREACH ALERT',
  },
  {
    id: 4,
    shortTitle: 'Control Room',
    title: 'Enter the Security Control Room',
    concept: 'Public vs. Private Attributes',
    objective: 'See why public temperature is unsafe, then switch to private __temperature and test that direct changes fail.',
    storyText:
      'The investigation shows that anyone can directly change important artifact information. Step into the Security Control Room to lock the temperature system.',
    securityStatus: 'VULNERABLE',
  },
  {
    id: 5,
    shortTitle: 'Protection',
    title: 'Build the Protection System',
    concept: 'Getters, Setters & Validation',
    objective: 'Read the temperature with a getter, then test at least 2 valid (18°C–22°C) and 2 invalid temperatures using the setter.',
    storyText:
      'You found the security weakness. Now add a safe way to read and update the private temperature using a getter, a setter, and a 18°C–22°C safety rule.',
    securityStatus: 'HARDENING',
  },
  {
    id: 6,
    shortTitle: 'Final Test',
    title: 'The Final Security Test',
    concept: 'Putting Encapsulation Together',
    objective: 'Fill in the missing parts of the DisplayCase class and pass all 3 security checks before reopening.',
    storyText:
      'The museum’s protection system is almost ready. Before the Royal Heritage Museum opens tomorrow, finish the DisplayCase code and run the final safety test.',
    securityStatus: 'PROTECTED',
  },
  {
    id: 7,
    shortTitle: 'Victory',
    title: 'Mission Completed',
    concept: 'Master of Encapsulation',
    objective: 'View your completed mission stages and Master of Encapsulation badge.',
    storyText:
      'SECURITY SYSTEM RESTORED! The Blue Heron Vase is now protected inside its locked display case.',
    securityStatus: 'SECURE',
  },
];

export function createInitialProgress(): MissionProgress {
  return {
    currentScreen: 'title',
    activeStage: 1,
    highestUnlockedStage: 1,
    completedStages: [],
    inspectedHotspots: [],
    assignedRecords: {},
    breachConceptsMatched: {},
    breachAttributesRestored: [],
    testedPublicTamper: false,
    activatedPrivateLock: false,
    testedPrivateTamper: false,
    getterReadCount: 0,
    validTempsTested: [],
    invalidTempsTested: [],
    selectedBlanks: {},
    simulationVectorsPassed: [],
  };
}

export function getArtifactMetadata(): ArtifactMetadata {
  return { ...ARTIFACT_METADATA };
}

export function validateTemperature(temp: number): {
  accepted: boolean;
  status: 'ACCEPTED' | 'REJECTED';
  message: string;
  reason: string;
} {
  if (!Number.isFinite(temp)) {
    return {
      accepted: false,
      status: 'REJECTED',
      message: 'Rejected: Invalid numeric reading.',
      reason: 'Validation requires a valid number between 18°C and 22°C.',
    };
  }

  if (temp >= 18 && temp <= 22) {
    return {
      accepted: true,
      status: 'ACCEPTED',
      message: `${temp}°C → Accepted`,
      reason: `Temperature ${temp}°C is inside the safe museum porcelain preservation range (18°C–22°C).`,
    };
  }

  return {
    accepted: false,
    status: 'REJECTED',
    message: `${temp}°C → Rejected`,
    reason:
      temp < 18
        ? `${temp}°C is too cold for the antique porcelain vase. The setter blocked the change and kept the safe temperature.`
        : `${temp}°C is too hot and could damage the vase. The setter blocked the change and kept the safe temperature.`,
  };
}

export function simulateAttributeAccess(
  mode: 'public' | 'private',
  attemptedTemp: number,
  currentTemp = 20
): {
  changed: boolean;
  currentTemp: number;
  dangerLevel: 'safe' | 'warning' | 'blocked';
  explanation: string;
} {
  if (mode === 'public') {
    const outOfRange = attemptedTemp < 18 || attemptedTemp > 22;
    return {
      changed: true,
      currentTemp: attemptedTemp,
      dangerLevel: outOfRange ? 'warning' : 'safe',
      explanation: outOfRange
        ? `Public attribute overwritten directly! case.temperature jumped to ${attemptedTemp}°C with zero checks—endangering the Blue Heron Vase.`
        : `case.temperature changed directly to ${attemptedTemp}°C without any safety gate.`,
    };
  }

  return {
    changed: false,
    currentTemp,
    dangerLevel: 'blocked',
    explanation: `Protected! Because __temperature is private, Python hides the real self.__temperature inside the class. Trying to set case.__temperature = ${attemptedTemp} from outside never changes the real temperature—it stays safely at ${currentTemp}°C.`,
  };
}

export const STAGE1_HOTSPOTS = [
  {
    id: 'porcelain',
    label: 'Porcelain Body',
    fieldName: 'artifact_name',
    fieldValue: '"Blue Heron Vase"',
    dataType: 'str (Text)',
    detail: 'Saves the artifact’s official name so the museum knows which item is inside this case.',
  },
  {
    id: 'valuation',
    label: 'Valuation Plaque',
    fieldName: 'value',
    fieldValue: '4500000',
    dataType: 'int (Number)',
    detail: 'Saves the artifact’s price (₹45,00,000) as a number.',
  },
  {
    id: 'conservation',
    label: 'Conservation Tag',
    fieldName: 'condition',
    fieldValue: '"Good"',
    dataType: 'str (Text)',
    detail: 'Shows the physical state of the vase. If someone changes this, it warns us about tampering.',
  },
  {
    id: 'registry',
    label: 'Curator Registry',
    fieldName: 'location & curator_id',
    fieldValue: '"Gallery 4, Case B" · "CUR-7"',
    dataType: 'str (Text)',
    detail: 'Shows where the vase sits in the museum and which curator (CUR-7) takes care of it.',
  },
] as const;

export const STAGE2_SLIPS = [
  { id: 'slip-name-vase', text: 'Blue Heron Vase', target: 'vase' as const, field: 'Artifact' },
  { id: 'slip-val-vase', text: '₹45,00,000', target: 'vase' as const, field: 'Value' },
  { id: 'slip-loc-vase', text: 'Gallery 4, Case B', target: 'vase' as const, field: 'Location' },
  { id: 'slip-name-astro', text: 'Ivory Astrolabe', target: 'astrolabe' as const, field: 'Artifact' },
  { id: 'slip-val-astro', text: '₹18,50,000', target: 'astrolabe' as const, field: 'Value' },
  { id: 'slip-loc-astro', text: 'Gallery 2, Case A', target: 'astrolabe' as const, field: 'Location' },
] as const;

export const STAGE3_CONCEPT_PAIRS = [
  {
    id: 'concept-class',
    prompt: 'The reusable museum blueprint used to build display units',
    expected: 'Class (DisplayCase)',
  },
  {
    id: 'concept-object',
    prompt: 'The real item created from that blueprint holding Gallery 4 Case B',
    expected: 'Object (blue_heron_case)',
  },
  {
    id: 'concept-attributes',
    prompt: 'The specific stored values like value, condition, and location',
    expected: 'Attributes',
  },
] as const;

export const STAGE3_RESTORE_OPTIONS = [
  { id: 'val-good', label: 'value = 4500000', isGenuine: true, reason: 'Matches verified museum ledger valuation (₹45,00,000).' },
  { id: 'val-fake', label: 'value = 100', isGenuine: false, reason: 'Suspicious unauthorized reduction planted during the breach.' },
  { id: 'cond-good', label: 'condition = "Good"', isGenuine: true, reason: 'Matches latest Curator CUR-7 inspection.' },
  { id: 'cond-fake', label: 'condition = "Broken"', isGenuine: false, reason: 'False tamper entry meant to trigger an emergency relocation.' },
  { id: 'loc-good', label: 'location = "Gallery 4, Case B"', isGenuine: true, reason: 'Verified permanent pedestal inside Gallery 4.' },
] as const;

export const STAGE6_BLANKS = [
  {
    id: 'blank-class',
    prompt: 'Define the blueprint for all museum vitrines:',
    options: ['class DisplayCase:', 'def DisplayCase:', 'object DisplayCase:'],
    correct: 'class DisplayCase:',
    explanation: 'In Python, the keyword `class` defines a blueprint for creating objects.',
  },
  {
    id: 'blank-private',
    prompt: 'Store the temperature as a private attribute inside __init__:',
    options: ['self.__temperature = 20', 'self.temperature = 20', 'private.temperature = 20'],
    correct: 'self.__temperature = 20',
    explanation: 'A double underscore prefix (`__temperature`) marks the attribute private inside the class.',
  },
  {
    id: 'blank-getter',
    prompt: 'Return the private temperature safely inside get_temperature(self):',
    options: ['return self.__temperature', 'print(temperature)', 'return temperature'],
    correct: 'return self.__temperature',
    explanation: 'A getter method returns the private value without letting callers directly overwrite it.',
  },
  {
    id: 'blank-validation',
    prompt: 'Check the safe preservation range inside set_temperature(self, new_temp):',
    options: ['if 18 <= new_temp <= 22:', 'if new_temp > 0:', 'if new_temp == 25:'],
    correct: 'if 18 <= new_temp <= 22:',
    explanation: 'Validation ensures only temperatures between 18°C and 22°C can update `self.__temperature`.',
  },
] as const;

export const STAGE6_VECTORS = [
  {
    id: 'vec-direct',
    attackCode: 'blue_heron_case.__temperature = 45',
    attackSummary: 'Someone tries to change __temperature directly from outside the class to 45°C.',
    choices: [
      { id: 'block', label: 'Protected: Real private __temperature stays unchanged (outside code cannot alter it)' },
      { id: 'allow', label: 'Accepted: Real private __temperature changes to 45°C' },
    ],
    correctChoice: 'block',
    explanation: 'Python hides private attributes prefixed with __, so outside code cannot directly change the real self.__temperature inside the object.',
  },
  {
    id: 'vec-cold',
    attackCode: 'blue_heron_case.set_temperature(15)',
    attackSummary: 'Someone calls the setter with an unsafe cold temperature (15°C).',
    choices: [
      { id: 'reject', label: 'Rejected by validation: 15°C is outside 18°C–22°C' },
      { id: 'accept', label: 'Accepted: Case cools down to 15°C' },
    ],
    correctChoice: 'reject',
    explanation: 'The setter checks `if 18 <= new_temp <= 22:` and rejects 15°C before changing `__temperature`.',
  },
  {
    id: 'vec-safe',
    attackCode: 'blue_heron_case.set_temperature(21)',
    attackSummary: 'Curator CUR-7 updates temperature using the setter to 21°C.',
    choices: [
      { id: 'accept', label: 'Accepted: Safe check passes and __temperature updates to 21°C' },
      { id: 'reject', label: 'Rejected: Setter blocks every change' },
    ],
    correctChoice: 'accept',
    explanation: '21°C is inside 18°C–22°C, so the setter safely updates `self.__temperature`.',
  },
] as const;

export function isStageComplete(progress: MissionProgress, stageId: StageId): boolean {
  switch (stageId) {
    case 1:
      return STAGE1_HOTSPOTS.every((h) => progress.inspectedHotspots.includes(h.id));
    case 2:
      return STAGE2_SLIPS.every((s) => progress.assignedRecords[s.id] === s.target);
    case 3:
      return (
        STAGE3_CONCEPT_PAIRS.every((p) => progress.breachConceptsMatched[p.id] === p.expected) &&
        STAGE3_RESTORE_OPTIONS.filter((o) => o.isGenuine).every((o) =>
          progress.breachAttributesRestored.includes(o.id)
        )
      );
    case 4:
      return (
        progress.testedPublicTamper &&
        progress.activatedPrivateLock &&
        progress.testedPrivateTamper
      );
    case 5:
      return (
        progress.getterReadCount >= 1 &&
        progress.validTempsTested.length >= 2 &&
        progress.invalidTempsTested.length >= 2
      );
    case 6:
      return (
        STAGE6_BLANKS.every((b) => progress.selectedBlanks[b.id] === b.correct) &&
        STAGE6_VECTORS.every((v) => progress.simulationVectorsPassed.includes(v.id))
      );
    case 7:
      return true;
  }
}

export function canUnlockVictory(progress: MissionProgress): boolean {
  const requiredStages: StageId[] = [1, 2, 3, 4, 5, 6];
  return requiredStages.every((id) => isStageComplete(progress, id));
}

export function unlockNextStage(
  progress: MissionProgress,
  completedStage: StageId
): MissionProgress {
  if (completedStage === 7 && !canUnlockVictory(progress)) {
    return progress;
  }

  const completedSet = new Set<StageId>(progress.completedStages);
  completedSet.add(completedStage);

  const rawNext = Math.min(7, completedStage + 1) as StageId;
  const cappedNext = rawNext === 7 && !canUnlockVictory(progress) ? (6 as StageId) : rawNext;
  const highestUnlockedStage = Math.max(
    progress.highestUnlockedStage,
    cappedNext
  ) as StageId;

  return {
    ...progress,
    completedStages: Array.from(completedSet).sort((a, b) => a - b),
    highestUnlockedStage,
  };
}

export function loadProgressFromStorage(
  storage: Pick<Storage, 'getItem'> | null
): MissionProgress {
  const base = createInitialProgress();
  if (!storage) return base;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<MissionProgress>;
    if (!parsed || typeof parsed !== 'object') return base;

    const validScreens: GameScreen[] = ['title', 'intro', 'briefing', 'stage', 'victory'];
    let currentScreen = validScreens.includes(parsed.currentScreen as GameScreen)
      ? (parsed.currentScreen as GameScreen)
      : 'title';

    const clampStage = (n: unknown): StageId => {
      if (typeof n === 'number' && n >= 1 && n <= 7) return Math.round(n) as StageId;
      return 1;
    };

    const hydrated: MissionProgress = {
      ...base,
      currentScreen,
      activeStage: clampStage(parsed.activeStage),
      highestUnlockedStage: clampStage(parsed.highestUnlockedStage),
      completedStages: Array.isArray(parsed.completedStages)
        ? parsed.completedStages.filter((s): s is StageId => typeof s === 'number' && s >= 1 && s <= 7)
        : [],
      inspectedHotspots: Array.isArray(parsed.inspectedHotspots) ? parsed.inspectedHotspots : [],
      assignedRecords:
        parsed.assignedRecords && typeof parsed.assignedRecords === 'object'
          ? parsed.assignedRecords
          : {},
      breachConceptsMatched:
        parsed.breachConceptsMatched && typeof parsed.breachConceptsMatched === 'object'
          ? parsed.breachConceptsMatched
          : {},
      breachAttributesRestored: Array.isArray(parsed.breachAttributesRestored)
        ? parsed.breachAttributesRestored
        : [],
      testedPublicTamper: Boolean(parsed.testedPublicTamper),
      activatedPrivateLock: Boolean(parsed.activatedPrivateLock),
      testedPrivateTamper: Boolean(parsed.testedPrivateTamper),
      getterReadCount: typeof parsed.getterReadCount === 'number' ? parsed.getterReadCount : 0,
      validTempsTested: Array.isArray(parsed.validTempsTested) ? parsed.validTempsTested : [],
      invalidTempsTested: Array.isArray(parsed.invalidTempsTested) ? parsed.invalidTempsTested : [],
      selectedBlanks:
        parsed.selectedBlanks && typeof parsed.selectedBlanks === 'object'
          ? parsed.selectedBlanks
          : {},
      simulationVectorsPassed: Array.isArray(parsed.simulationVectorsPassed)
        ? parsed.simulationVectorsPassed
        : [],
    };

    const victoryAllowed = canUnlockVictory(hydrated);
    const highestUnlockedStage = victoryAllowed
      ? hydrated.highestUnlockedStage
      : (Math.min(hydrated.highestUnlockedStage, 6) as StageId);
    const activeStage = Math.min(hydrated.activeStage, highestUnlockedStage) as StageId;
    if (currentScreen === 'victory' && !victoryAllowed) {
      currentScreen = 'briefing';
    }

    return {
      ...hydrated,
      currentScreen,
      activeStage,
      highestUnlockedStage,
      completedStages: victoryAllowed
        ? hydrated.completedStages
        : hydrated.completedStages.filter((s) => s !== 7),
    };
  } catch {
    return base;
  }
}

export function saveProgressToStorage(
  storage: Pick<Storage, 'setItem'> | null,
  progress: MissionProgress
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota or storage restriction errors cleanly
  }
}
