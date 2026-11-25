import type {
  GummyAssertResult,
  GummyAssertSpec,
} from '../utils/pyodide';

export type ScreenId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14;

export type KidId = 'ravi' | 'divya' | 'arjun' | 'meena' | 'kavin';

export type HandChoice = 'clean' | 'dirty';

export type HandAppearance = 'muddy' | 'smudged' | 'spotless';

export interface KidProfile {
  id: KidId;
  name: string;
  appearance: HandAppearance;
  skinColor: string;
  skinShadow: string;
  hairColor: string;
  shirtColor: string;
  accentColor: string;
  hairStyle: 'tousled' | 'pigtails' | 'neat' | 'bob' | 'curly';
  shortNote: string;
}

export const KIDS: KidProfile[] = [
  {
    id: 'ravi',
    name: 'Ravi',
    appearance: 'muddy',
    skinColor: '#D69A6B',
    skinShadow: '#BD7E4F',
    hairColor: '#24303C',
    shirtColor: '#E8A33D',
    accentColor: '#D9544D',
    hairStyle: 'tousled',
    shortNote: 'Just came in from digging near the garden!',
  },
  {
    id: 'divya',
    name: 'Divya',
    appearance: 'smudged',
    skinColor: '#C98A5B',
    skinShadow: '#AD6F43',
    hairColor: '#1E2730',
    shirtColor: '#D9544D',
    accentColor: '#F5EFE0',
    hairStyle: 'pigtails',
    shortNote: 'Was drawing hopscotch with chalk outside.',
  },
  {
    id: 'arjun',
    name: 'Arjun',
    appearance: 'spotless',
    skinColor: '#E3AD82',
    skinShadow: '#CA9064',
    hairColor: '#2B3540',
    shirtColor: '#3E9A4D',
    accentColor: '#F5EFE0',
    hairStyle: 'neat',
    shortNote: 'Was playing tag on the swings.',
  },
  {
    id: 'meena',
    name: 'Meena',
    appearance: 'spotless',
    skinColor: '#C48356',
    skinShadow: '#A9693E',
    hairColor: '#24303C',
    shirtColor: '#7FC4D6',
    accentColor: '#E8A33D',
    hairStyle: 'bob',
    shortNote: 'Was climbing the wooden slide.',
  },
  {
    id: 'kavin',
    name: 'Kavin',
    appearance: 'spotless',
    skinColor: '#DCA174',
    skinShadow: '#C28558',
    hairColor: '#2B2D42',
    shirtColor: '#E8A33D',
    accentColor: '#3E9A4D',
    hairStyle: 'curly',
    shortNote: 'Was chasing bubbles in the yard.',
  },
];

export const SCREEN_TITLES: Record<ScreenId, string> = {
  1: 'Entrance',
  2: 'Clinic Hall',
  3: 'Hands Close-Up',
  4: 'First Guess',
  5: 'Looking Closer',
  6: 'Cleaning Station',
  7: 'At the Sink',
  8: 'Sick Notes',
  9: 'Fix the Code',
  10: 'Testing',
  11: 'Boundary & Edge',
  12: 'Assertions & Unit Tests',
  13: 'Gummy Dispenser',
  14: 'Conclusion',
};

export interface PickResult8 {
  seconds: number;
  shouldSay: string;
  checkerSays: string;
  isMismatch: boolean;
}

export interface TryEntry14 {
  age: number;
  shouldGive: string;
  dispenserGives: string;
  isMismatch: boolean;
}

export interface FlipPairState {
  cardAFlipped: boolean;
  cardBFlipped: boolean;
  cardAFlippedOnce: boolean;
  cardBFlippedOnce: boolean;
}

export interface PersistedStoryState {
  s1Opened: boolean;
  s2HandsRaised: boolean;
  s3KidIndex: number;
  s3RetryPrompted: Partial<Record<KidId, boolean>>;
  s4Phase: 'praise' | 'hold';
  s5Rewound: boolean;
  s5GermsRevealed: boolean;
  s6ShowCode: boolean;
  s7StepIndex: number;
  s7CompletedOutputs: Record<number, string>;
  s7AskingWorking: boolean;
  s7ReplyChoice: 'yes' | 'no' | null;
  s8Picks: PickResult8[];
  s9EditStep: 'rule' | 'operator' | 'guard' | 'done';
  s9VerifiedRows: Array<{ seconds: number; output: string }>;
  s11Flip: FlipPairState;
  s12Flip: FlipPairState;
  s14Stage: 'trial' | 'summary' | 'write-tests' | 'fix-and-test';
  s14Tries: TryEntry14[];
  s14Test1Age: string;
  s14Test1Out: string;
  s14Test2Age: string;
  s14Test2Out: string;
  s14WrittenSpecs: GummyAssertSpec[];
  s14SelectedBoundary: string;
  s14SelectedEdge: string;
  s14TestRunResults: GummyAssertResult[];
}
