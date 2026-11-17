// Shared types for the Recursive Explorer content layer.
// All static content lives in src/data and is loaded directly by the app —
// there is no external database. Learner progress persists in localStorage.

export type ScenePhase = 'introduction' | 'action' | 'observation' | 'quiz' | 'reveal';

/** Where a chamber sits relative to the main shaft. */
export type ChamberSide = 'left' | 'right';

/** A concrete barrier that stops excavation (the recursion base case). */
export type ObstacleType = 'rock' | 'clay' | 'root';

/** Persistent colony layers an activity can reveal once completed. */
export type SceneLayer =
  | 'shaft'
  | 'chamber'
  | 'eggs'
  | 'food'
  | 'larvae'
  | 'ventilation'
  | 'obstacle';

export interface ChamberSpec {
  id: string;
  name: string;
  purpose: string;
  /** Visual depth (0 = just below the surface, higher = deeper). */
  depth: number;
  /** Which side of the main shaft the chamber sits on. */
  side: ChamberSide;
  /** Optional horizontal offset as a fraction (0–1) to spread galleries sideways. */
  x?: number;
}

export interface SceneAction {
  id: string;
  label: string;
  description: string;
  /** Colony layer(s) this action permanently reveals once the learner clicks it. */
  reveals?: SceneLayer | SceneLayer[];
  /** When `reveals === 'chamber'`, the chamber id that appears. */
  chamberId?: string;
}

/** A real photograph shown by the reality-bridge scenes (10–12). */
export interface SceneImage {
  id: string;
  /** Resolved asset path (see src/data/images.ts). */
  src: string;
  /** Short caption displayed under the photo. */
  caption?: string;
}

/**
 * Animated post-quiz display shown after a scene's question is answered
 * correctly. `lines` reveal in sequence; `glow` renders them as a single
 * centered, softly glowing sentence; `buttonLabel` adds a manual continue
 * button (otherwise the card auto-advances after a beat).
 */
export interface SceneConclusion {
  lines: string[];
  glow?: boolean;
  buttonLabel?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  xp: number;
}

export interface ObstacleSpec {
  type: ObstacleType;
  /** Visual depth where the barrier sits. */
  depth: number;
}

export interface ColonyState {
  ants: number;
  tunnels: number;
  chambers: ChamberSpec[];
  eggs: number;
  larvae: number;
  ventilation: boolean;
  obstacle: ObstacleSpec | null;
}

export interface Scene {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  phase: ScenePhase;
  narration: string[];
  colonyState: ColonyState;
  /** Recursive-pattern affordance: the repeated excavation step this scene shows. */
  recursionStep?: {
    label: string;
    description: string;
    /** Which previously-seen step this one repeats, establishing the pattern. */
    repeats?: string;
  };
  /** Visible activity in the colony viewer for this scene. */
  activity: SceneAction[];
  /** Real photographs shown cinematically while the scene plays. */
  images?: SceneImage[];
  /** Animated post-quiz display (reality-bridge scenes). */
  conclusion?: SceneConclusion;
  /** Word-by-word full-screen transition played after the conclusion and
   *  before the next scene (Scene 12 → Python). */
  bridge?: string[];
  /** Marks the scene where the learner finally names the pattern (recursion). */
  discoversRecursion?: boolean;
  quiz: QuizQuestion | null;
  xp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: { type: 'completeScene' | 'earnXp' | 'discoverRecursion' | 'allQuizzesCorrect'; value?: number };
  xp: number;
}

export interface Settings {
  muted: boolean;
}

export interface ProgressState {
  xp: number;
  completedScenes: number[];
  correctQuizScenes: number[];
  unlockedAchievements: string[];
  recursionDiscovered: boolean;
  lastSceneId: number;
  settings: Settings;
}
