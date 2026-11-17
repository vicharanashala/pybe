// Core data model for the Hawkins Division mission engine.
// Every mission is pure data — the UI (MissionScreen) interprets it generically,
// keeping "educational logic" separate from "presentation".

export type Speaker = 'dustin' | 'steve' | 'robin' | 'elle' | 'hopper' | 'system'

export interface DialogueLine {
  speaker: Speaker
  text: string
}

export interface Choice {
  id: string
  label: string
  /** Is this the "efficient / correct" path that leads directly to the concept? */
  best: boolean
  /** Narrative consequence shown immediately after picking this choice. */
  consequence: string
  /** Follow-up dialogue reacting to the consequence. */
  reaction: DialogueLine
}

export interface ConceptReveal {
  heading: string
  insight: string // the "Oh... THIS is why functions exist" moment, in this concept's terms
  explanation: string
  code: string
  codeLabel?: string
}

export type ChallengeType = 'mcq' | 'fill' | 'order'

export interface MCQChallenge {
  type: 'mcq'
  prompt: string
  options: { id: string; label: string; correct: boolean; hint: string }[]
}

export interface FillChallenge {
  type: 'fill'
  prompt: string
  codeTemplate: string // use ___ as the blank marker
  acceptedAnswers: string[]
  hint: string
}

export interface OrderChallenge {
  type: 'order'
  prompt: string
  blocks: { id: string; code: string }[]
  correctOrder: string[] // array of block ids in correct order
  hint: string
}

export type Challenge = MCQChallenge | FillChallenge | OrderChallenge

export interface CassetteTape {
  title: string
  tip: string
}

export interface Mission {
  id: string
  number: number // 1-10, 11 = final boss
  isFinalBoss?: boolean
  codename: string
  title: string
  location: string
  briefing: string
  riftLevel: number // 1-5, cosmetic threat meter
  story: DialogueLine[]
  decisionPrompt: string
  choices: Choice[]
  concept: ConceptReveal
  challenge: Challenge
  challengeSuccess: DialogueLine
  reward: {
    xp: number
    badge: string
    badgeIcon: string
  }
  cassette: CassetteTape
}
