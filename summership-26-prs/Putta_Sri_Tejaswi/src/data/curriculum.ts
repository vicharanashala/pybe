import { lessonSlides, storyScenes, type LessonSlide, type StoryScene } from './learningData';
import { topicActivities } from './activities';

/** Parse a Python assignment like `tribute = "Saffron"` into { name, value }. Returns null if not an assignment. */
export function parseAssignment(syntax: string): { name: string; value: string } | null {
  const eqIdx = syntax.indexOf('=');
  if (eqIdx === -1) return null;
  const name = syntax.slice(0, eqIdx).trim();
  if (!name || name.includes(' ')) return null;
  return { name, value: syntax.slice(eqIdx + 1).trim() };
}

export type TopicId =
  | 'variables' | 'arithmetic' | 'comparison' | 'strings' | 'lists' | 'tuples'
  | 'sets' | 'dictionaries' | 'conditionals' | 'loops' | 'while-loops' | 'functions'
  | 'indexing' | 'searching' | 'filtering' | 'counting' | 'formatting' | 'mutation'
  | 'validation' | 'modules' | 'sorting';

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  desc: string;
  avatar: string;
  appearance: string;
  personality: string;
  voiceStyle: string;
  illustrationPrompt: string;
  imagePrompt: string;
  portraitSeed?: number;
}

// Stable numeric seed from a string ID (deterministic, no randomness)
export function portraitSeedFrom(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) + 1; // always positive, never 0
}

export interface RewardCard {
  quote: string;
  lesson: string;
  rarity: 'common' | 'rare' | 'legendary';
  collectibleArtPrompt: string;
}

export interface BridgeStage { storyLabel: string; storyDesc: string; codeLabel: string; codeDesc: string; codeSyntax: string; icon: 'key' | 'box' | 'library' | 'search' }
export interface PlaygroundPreset { label: string; cmd: string; output: string }
export interface PracticeTask { id: number; instruction: string; description: string; blocks: string[]; correctBlock: string; successMessage: string }

export interface ActivityDragItem { id: string; label: string; isAllowed?: boolean }
export interface ActivityTarget { id: string; label: string; correctItemId: string }
export interface ActivityGateItem { id: string; label: string; isAllowed: boolean }
export interface ActivityMatchPair { left: string; right: string }

export interface ActivityConfig {
  title: string;
  goal: string;
  instructions: string;
  hint: string;
  completionMessage: string;
  pythonConnection: string;
  type: 'drag-labels' | 'click-order' | 'gate-check' | 'repeat-click' | 'arrange-order' | 'match-pairs';
  items: ActivityDragItem[];
  targets: ActivityTarget[];
  gateItems?: ActivityGateItem[];
  matchPairs?: ActivityMatchPair[];
  repeatTarget?: number;
  repeatAction?: string;
}

export interface ConceptGuide {
  whatIsIt: string;
  whyUseIt: string;
  realLifeExamples: string[];
  pythonExamples: string[];
  howItWorks: { activity: string; idea: string; python: string; example: string };
}

export interface StoryWorld {
  storyTradition: string;
  setting: string;
  narrator: string;
  mentor: CharacterProfile;
  mainCharacters: CharacterProfile[];
  emotionalTone: string;
  storyTheme: string;
  rewardCharacter: CharacterProfile;
  visualStyle: string;
  backgroundMusic: string;
  backgroundPrompt: string;
  sceneImagePrompt: string;
  season: string;
  timeOfDay: string;
  weather: string;
  musicStyle: string;
  soundEffects: string[];
}

export interface TopicDefinition {
  id: TopicId;
  title: string;
  storyTitle: string;
  narrativeTitle: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate';
  duration: string;
  storyIntro: string;
  narratorName: string;
  mentorCharacter: CharacterProfile;
  characters: CharacterProfile[];
  storyScenes: StoryScene[];
  mentorPrompt: string;
  predictionPrompt: string;
  learningSummary: string;
  tradition: string;
  storyWorld: StoryWorld;
  learningReflection: { useful: string; commonMistake: string; memoryTrick: string; keyTakeaway: string };
  mentorKeywords: string[];
  bridge: BridgeStage[];
  lessons: LessonSlide[];
  playground: { variableName: string | null; intro: string; presets: PlaygroundPreset[] };
  challenges: PracticeTask[];
  applications: string[];
  badgeName: string;
  rewardCard: RewardCard;
  activity: ActivityConfig;
  conceptGuide: ConceptGuide;
}

interface Enrichment { keeper: string; role: string; avatar: string; premise: string; consequence: string; prediction: string; summary: string; application: string; fullStory: string }

const reflectionFor = (id: TopicId, title: string, item: Enrichment) => ({
  useful: `It helps when ${item.application} must be expressed as a clear, testable rule.`,
  commonMistake: id === 'indexing' ? 'Forgetting that Python starts indexing at 0.' : id === 'while-loops' ? 'Using a condition that never changes, causing an infinite loop.' : id === 'comparison' ? 'Using = for comparison instead of ==.' : `Using ${title.toLowerCase()} without first predicting the result.`,
  memoryTrick: `${item.keeper}'s story: remember the story object before you remember the syntax.`,
  keyTakeaway: item.summary,
});

const makeLessons = (title: string, _concept: string, syntax: string, item: Enrichment): LessonSlide[] => [
  { title: `1. What is ${title}?`, concept: item.summary, syntax, explanation: `First identify the story data and predict the outcome. ${item.prediction}`, exampleCode: `${syntax}\n# Predict the result before running it` },
  { title: `2. How ${title} Works`, concept: `In ${item.keeper}'s story, the rule must match the real-world need: ${item.premise}`, syntax, explanation: `Test one small example, inspect the result, and explain why it solves the problem.`, exampleCode: `${syntax}\nprint(${syntax.split('=')[0].trim() || syntax})` },
  { title: `3. Watch it Work`, concept: `Running the code produces evidence. Compare the output with your prediction.`, syntax, explanation: `Watch the code execute and verify the output matches what you expected.`, exampleCode: `# Run and observe\nresult = ${syntax}\nprint(result)` },
  { title: `4. Try it Yourself`, concept: `Modify the values and see how the result changes. Predict before running.`, syntax, explanation: `Hands-on practice builds intuition. Change one value at a time and observe.`, exampleCode: `${syntax}\n# Try changing the values above` },
  { title: `5. Real-World Connection`, concept: `The same idea appears beyond the story when ${item.application}.`, syntax, explanation: `Mastery means choosing this concept for the right problem, predicting its behaviour, and checking the evidence.`, exampleCode: `# Real-world thinking\n${syntax}` },
];

const makeScenes = (topic: string, item: Enrichment, concept: string, syntax: string, world: StoryWorld): StoryScene[] => {
  const mentorName = world.mentor.name;
  const guideName = world.mainCharacters[0]?.name ?? 'Guide';
  const secondName = world.mainCharacters[1]?.name ?? guideName;
  const speakerA = guideName.toLowerCase().split(' ')[0];
  const speakerM = mentorName.toLowerCase().split(' ')[0];
  const speakerS = secondName.toLowerCase().split(' ')[0];
  const keeper = item.keeper;

  // Split full story into paragraphs for multi-speaker narration
  const storyParagraphs = item.fullStory.split('\n\n').filter(p => p.trim());
  const lastPara = storyParagraphs[storyParagraphs.length - 1] || item.fullStory;

  return [
    // ── SCENE 1: The Full Story (narrator + characters speak) ──
    {
      id: 1,
      title: `Scene I: ${keeper}'s Story`,
      narrative: item.fullStory,
      dialogue: [
        { speaker: 'narrator', text: storyParagraphs[0] || item.fullStory },
        ...(storyParagraphs[1] ? [{ speaker: 'narrator', text: storyParagraphs[1] }] : []),
        { speaker: speakerA, text: `${keeper} looked around and thought carefully. There had to be a better way.` },
        ...(storyParagraphs[2] ? [{ speaker: 'narrator', text: storyParagraphs[2] }] : []),
        { speaker: speakerM, text: `${mentorName} watched quietly. The answer was already there, waiting to be seen.` },
        { speaker: 'narrator', text: lastPara },
        { speaker: speakerA, text: `And that is how ${keeper} learned the lesson. The pattern was simple, but powerful.` },
      ],
      imageAlt: `${topic} ${world.setting}`,
      question: `What is the main problem ${keeper} faces in this story?`,
      options: [
        item.premise,
        item.consequence,
        `${keeper} already knows the answer from the start.`,
        `The problem resolves itself without any effort from ${keeper}.`
      ],
      correctIndex: 0,
      explanation: `Correct. ${item.summary}`,
    },

    // ── SCENE 2: What did the character actually do? ──
    {
      id: 2,
      title: 'Scene II: What Did the Character Actually Do?',
      narrative: `Let us think about what ${keeper} really did. ${item.premise} ${item.consequence}`,
      dialogue: [
        { speaker: 'narrator', text: `Now, let us think carefully about what ${keeper} actually did in the story.` },
        { speaker: speakerM, text: `${mentorName} turned to the group and asked a question.` },
        { speaker: speakerM, text: `What do you think will happen next? Before we write any code, let us predict.` },
        { speaker: speakerA, text: `I think the result will follow the same rule every time.` },
        { speaker: speakerM, text: `${item.prediction} Think about it carefully.` },
        { speaker: speakerS, text: `That makes sense. The same action should give the same result.` },
      ],
      imageAlt: `${topic} problem`,
      question: item.prediction,
      options: [
        `The ${concept} rule produces a consistent, predictable result.`,
        `Python chooses a random answer each time.`,
        `The result changes depending on who runs the code.`,
        `${concept} has no effect on the output.`
      ],
      correctIndex: 0,
      explanation: 'Correct. A prediction is based on the exact values and operation in the statement.',
    },

    // ── SCENE 3: The Wrong Approach ──
    {
      id: 3,
      title: `Scene III: The Wrong Approach`,
      narrative: `Without the right tool, the characters struggle. ${mentorName} watches patiently.`,
      dialogue: [
        { speaker: 'narrator', text: `The characters tried to solve the problem without the right approach.` },
        { speaker: speakerA, text: `This is harder than I thought! I keep getting confused.` },
        { speaker: speakerS, text: `Maybe we are missing something important.` },
        { speaker: speakerM, text: `Patience. Let me show you a better way. Every problem has a pattern.` },
        { speaker: speakerA, text: `A pattern? What do you mean?` },
        { speaker: speakerM, text: `Look at what ${keeper} did. The same step, repeated with care. That is the key.` },
      ],
      imageAlt: `${topic} struggle`,
      question: `What happens when ${keeper} tries to solve the problem without using ${concept}?`,
      options: [
        item.consequence,
        `${keeper} solves it faster without ${concept}.`,
        `The problem disappears on its own.`,
        `Using ${concept} makes the problem worse.`
      ],
      correctIndex: 0,
      explanation: 'Correct. Without the right structure, solutions become fragile and error-prone.',
    },

    // ── SCENE 4: Discovering the Concept ──
    {
      id: 4,
      title: `Scene IV: Discovering ${concept}`,
      narrative: `${mentorName} names the pattern: ${item.summary}`,
      dialogue: [
        { speaker: 'narrator', text: `${mentorName} smiled and pointed to the pattern in the story.` },
        { speaker: speakerM, text: `Do you see it? The pattern has a name. In Python, we write it like this:` },
        { speaker: speakerM, text: `${syntax}` },
        { speaker: speakerA, text: `Oh! So that is how you write it in Python!` },
        { speaker: speakerM, text: `Yes. ${item.summary}` },
        { speaker: speakerS, text: `That is clever. The story and the code follow the same rule.` },
      ],
      imageAlt: `${topic} concept discovery`,
      question: `Why does ${concept} help ${keeper}?`,
      options: [
        `It expresses the ${topic.toLowerCase()} operation precisely in Python.`,
        `It hides the result from the programmer.`,
        `It removes all the data from the program.`,
        `It only changes the font and formatting of the output.`
      ],
      correctIndex: 0,
      explanation: 'Correct. Python constructs make a real-world process explicit, repeatable, and testable.',
    },

    // ── SCENE 5: Practice and Prediction ──
    {
      id: 5,
      title: 'Scene V: Practice and Prediction',
      narrative: `${guideName} asks the apprentice to try it themselves and predict the result.`,
      dialogue: [
        { speaker: 'narrator', text: `Now it was time for the characters to try it themselves.` },
        { speaker: speakerA, text: `Try it yourself. Predict what will happen first, then run the code.` },
        { speaker: speakerS, text: `I predict the result will be... let me think...` },
        { speaker: speakerM, text: `Good reasoning comes from evidence, not guessing. Take your time.` },
        { speaker: speakerA, text: `I wrote the code and ran it. My prediction was correct!` },
        { speaker: speakerM, text: `Well done. When you predict before running, you truly understand.` },
      ],
      imageAlt: `${topic} practice`,
      question: 'What should you do before running code?',
      options: ['Predict the result', 'Run it immediately', 'Skip the test', 'Ask someone else'],
      correctIndex: 0,
      explanation: 'Correct. Prediction before execution builds understanding.',
    },

    // ── SCENE 6: The Lesson Learned ──
    {
      id: 6,
      title: 'Scene VI: The Lesson Learned',
      narrative: `The story concludes. ${mentorName} reflects on the moral.`,
      dialogue: [
        { speaker: 'narrator', text: `The story was coming to an end. The characters gathered around ${mentorName}.` },
        { speaker: speakerM, text: `Remember this lesson well. ${item.summary}` },
        { speaker: speakerA, text: `Now I understand. The pattern solves the real problem.` },
        { speaker: speakerS, text: `And it connects the story to something we can use in Python.` },
        { speaker: speakerM, text: `Exactly. The story teaches us to think. Python lets us act on that thinking.` },
        { speaker: 'narrator', text: `And so the characters carried this wisdom with them, ready for the next adventure.` },
      ],
      imageAlt: `${topic} conclusion`,
      question: 'What is the key takeaway?',
      options: [
        item.summary,
        `${topic.toLowerCase()} is not useful in real-world programming.`,
        `Knowing the syntax is enough without understanding the concept.`,
        `The story and Python have nothing in common.`
      ],
      correctIndex: 0,
      explanation: `Correct. ${item.summary}`,
    },
  ];
};

// ─── 21 UNIQUE STORY WORLDS ─────────────────────────────────────────────────

const storyWorlds: Record<TopicId, StoryWorld> = {
  variables: {
    storyTradition: 'Panchatantra',
    setting: 'A sun-dappled forest clearing where the wise crow Chakra has gathered the animals for a lesson about naming things.',
    narrator: 'An elderly storyteller sitting beneath a banyan tree, weaving tales for village children.',
    mentor: { id: 'chakra', name: 'Chakra the Crow', role: 'The Wise Crow of Panchatantra', desc: 'A clever crow who teaches the forest creatures that every important thing deserves a name.', avatar: '🐦', appearance: 'Majestic crow with amber eyes, iridescent feathers, leaf crown', personality: 'Wise, patient, observant', voiceStyle: 'Calm and measured with occasional caws', illustrationPrompt: 'A majestic crow with gleaming amber eyes perched on a banyan branch, wearing a tiny golden crown of woven leaves', imagePrompt: 'wise anthropomorphic crow with golden amber eyes, sleek iridescent black feathers, tiny woven leaf crown, anime fantasy style' },
    mainCharacters: [
      { id: 'mira', name: 'Mira the Squirrel', role: 'Keeper of Acorn Stashes', desc: 'A forgetful squirrel who labels her buried acorns.', avatar: '🐿️', appearance: 'Fluffy reddish-brown squirrel, bright curious eyes, bushy tail', personality: 'Curious, forgetful, eager to learn', voiceStyle: 'Quick and chattery', illustrationPrompt: 'A fluffy reddish-brown squirrel holding an acorn', imagePrompt: 'cute anime squirrel creature with fluffy fur, bright eyes, bushy tail, Studio Ghibli style' },
      { id: 'tama', name: 'Tama the Monkey', role: 'Forest Fruit Taster', desc: 'A playful monkey who organizes fruit by taste.', avatar: '🐒', appearance: 'Spry monkey with bright eyes', personality: 'Playful, helpful', voiceStyle: 'Cheerful', illustrationPrompt: 'A playful monkey sorting fruits', imagePrompt: 'cute anime monkey character sorting colorful fruits, tropical forest, Studio Ghibli style', portraitSeed: portraitSeedFrom('tama') },
    ],
    emotionalTone: 'Warm and curious',
    storyTheme: 'Names give power to things — without a name, a thing cannot be found.',
    rewardCharacter: { id: 'chakra-r', name: 'Chakra the Crow', role: 'Story Guardian', desc: 'Rewards the learner with a golden feather.', avatar: '🪶', appearance: 'Wise crow with golden aura', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A wise crow with a luminous golden feather', imagePrompt: 'wise crow with golden magical aura, anime fantasy' },
    visualStyle: 'Lush forest greens, warm amber sunlight',
    backgroundMusic: 'Soft bamboo flute with forest ambiance',
    backgroundPrompt: 'Sun-dappled forest clearing with ancient banyan tree',
    sceneImagePrompt: 'sun-dappled forest clearing, ancient banyan tree, golden light, anime background art',
    season: 'Spring',
    timeOfDay: 'Morning',
    weather: 'Warm and sunny with dappled light',
    musicStyle: 'Gentle bansuri flute with nature sounds',
    soundEffects: ['Birdsong', 'Rustling leaves', 'Distant stream'],
  },
  arithmetic: {
    storyTradition: 'Ancient Indian Village',
    setting: 'A bustling village market square at dawn, where traders lay out their wares.',
    narrator: 'A traveling merchant recounting tales of clever arithmetic.',
    mentor: { id: 'ganesh', name: 'Ganesh the Accountant', role: 'Village Number Keeper', desc: 'The village accountant who sums any amount in his head.', avatar: '🧮', appearance: 'Elderly man with round spectacles, white dhoti', personality: 'Patient, methodical, kind', voiceStyle: 'Warm and deliberate', illustrationPrompt: 'An elderly man with brass spectacles holding a wooden abacus', imagePrompt: 'elderly Indian accountant with spectacles, wooden abacus, anime style' },
    mainCharacters: [
      { id: 'priya', name: 'Priya the Trader', role: 'Spice Merchant', desc: 'A young trader learning to total her earnings.', avatar: '🌶️', appearance: 'Young woman with colorful bindi, saffron sari', personality: 'Eager, determined', voiceStyle: 'Bright and energetic', illustrationPrompt: 'A young spice trader with brass scales', imagePrompt: 'young Indian spice trader girl, saffron sari, anime style' },
      { id: 'suresh', name: 'Suresh the Farmer', role: 'Village Grain Counter', desc: 'A patient farmer who counts harvests.', avatar: '🌾', appearance: 'Weathered farmer with kind eyes', personality: 'Patient, methodical', voiceStyle: 'Warm and steady', illustrationPrompt: 'A kind farmer counting grain sacks', imagePrompt: 'anime farmer character counting grain sacks in a sunlit field, warm earth tones, Studio Ghibli style', portraitSeed: portraitSeedFrom('suresh') },
    ],
    emotionalTone: 'Energetic and practical',
    storyTheme: 'Numbers are the language of trade — master them and you master the marketplace.',
    rewardCharacter: { id: 'ganesh-r', name: 'Ganesh the Accountant', role: 'Story Guardian', desc: 'Bestows a golden abacus bead.', avatar: '📿', appearance: 'Wise man with golden bead', personality: 'Generous', voiceStyle: 'Warm', illustrationPrompt: 'A wise man holding a glowing golden abacus bead', imagePrompt: 'wise man with golden glowing bead, anime fantasy' },
    visualStyle: 'Warm terracotta tones, colorful market stalls',
    backgroundMusic: 'Upbeat tabla with sitar accents',
    backgroundPrompt: 'Bustling ancient Indian village market at dawn',
    sceneImagePrompt: 'bustling Indian village market, spice stalls, warm terracotta, anime background art',
    season: 'Summer',
    timeOfDay: 'Dawn',
    weather: 'Warm and clear',
    musicStyle: 'Upbeat tabla rhythm',
    soundEffects: ['Market chatter', 'Clinking coins', 'Vendor calls'],
  },
  comparison: {
    storyTradition: 'Royal Court (Akbar-Birbal)',
    setting: 'The grand Diwan-i-Khas hall where Emperor Akbar holds court.',
    narrator: 'A court chronicler recording wise judgments.',
    mentor: { id: 'birbal', name: 'Birbal', role: 'The Court Logician', desc: 'Akbar\'s wisest advisor who solves problems through comparison.', avatar: '🧠', appearance: 'Sharp-featured with pointed beard, jeweled turban', personality: 'Witty, sharp, insightful', voiceStyle: 'Confident and articulate', illustrationPrompt: 'A sharp-featured courtier with jeweled turban', imagePrompt: 'Mughal courtier with knowing eyes, jeweled turban, anime style' },
    mainCharacters: [
      { id: 'akbar', name: 'Emperor Akbar', role: 'The Imperial Sovereign', desc: 'Presents problems demanding clear answers.', avatar: '👑', appearance: 'Regal with jeweled crown, crimson robes', personality: 'Fair, demanding, curious', voiceStyle: 'Authoritative and warm', illustrationPrompt: 'A regal Mughal emperor on a marble throne', imagePrompt: 'regal Mughal emperor, jeweled crown, anime royalty style' },
      { id: 'zafar', name: 'Zafar the Archer', role: 'Royal Target Judge', desc: 'An archer who judges which arrow flies truest.', avatar: '🏹', appearance: 'Focused archer with sharp eyes', personality: 'Precise, fair', voiceStyle: 'Confident', illustrationPrompt: 'An archer examining two arrows', imagePrompt: 'anime archer character comparing two arrows, royal archery range, golden light, Studio Ghibli style', portraitSeed: portraitSeedFrom('zafar') },
    ],
    emotionalTone: 'Regal and contemplative',
    storyTheme: 'Truth is found by comparing one thing to another — never by assumption.',
    rewardCharacter: { id: 'birbal-r', name: 'Birbal', role: 'Story Guardian', desc: 'Grants a jeweled comparison ring.', avatar: '💍', appearance: 'Courtier with luminous ring', personality: 'Generous', voiceStyle: 'Warm', illustrationPrompt: 'A courtier holding a luminous jeweled ring', imagePrompt: 'courtier with luminous jeweled ring, anime fantasy' },
    visualStyle: 'Rich Mughal architecture, gold and crimson',
    backgroundMusic: 'Elegant sitar and tabla',
    backgroundPrompt: 'Grand Mughal Diwan-i-Khas hall with marble pillars',
    sceneImagePrompt: 'grand Mughal hall, marble pillars, golden screens, anime background art',
    season: 'Autumn',
    timeOfDay: 'Afternoon',
    weather: 'Clear and golden',
    musicStyle: 'Elegant court music',
    soundEffects: ['Echoing footsteps', 'Soft whispers', 'Curtain rustling'],
  },
  strings: {
    storyTradition: 'Temple Traditions',
    setting: 'An ancient stone temple where inscriptions on palm leaves preserve sacred mantras.',
    narrator: 'A temple priest recounting the sacred art of preserving words.',
    mentor: { id: 'kavi', name: 'Kavi the Scribe', role: 'Temple Inscription Keeper', desc: 'The scribe who knows every character matters.', avatar: '🪶', appearance: 'Elderly with ink-stained fingers, cotton robes', personality: 'Precise, reverent, patient', voiceStyle: 'Soft and measured', illustrationPrompt: 'An elderly scribe with ink-stained fingers and palm-leaf manuscript', imagePrompt: 'elderly temple scribe, ink-stained fingers, palm-leaf, anime style' },
    mainCharacters: [
      { id: 'anand', name: 'Anand the Student', role: 'Temple Apprentice', desc: 'Learning to write sacred mantras without errors.', avatar: '📿', appearance: 'Young boy with sacred thread, eager eyes', personality: 'Eager, careful', voiceStyle: 'Young and curious', illustrationPrompt: 'A young student with palm leaf and stylus', imagePrompt: 'young temple student, palm leaf, brass bells, anime style' },
      { id: 'devi', name: 'Devi the Weaver', role: 'Temple Cloth Maker', desc: 'A weaver who stitches words into fabric.', avatar: '🧵', appearance: 'Graceful woman with nimble fingers', personality: 'Creative, meticulous', voiceStyle: 'Soft and rhythmic', illustrationPrompt: 'A weaver stitching golden thread', imagePrompt: 'anime weaver character stitching golden thread on a loom, temple workshop, warm candlelight, Studio Ghibli style', portraitSeed: portraitSeedFrom('devi') },
    ],
    emotionalTone: 'Serene and reverent',
    storyTheme: 'Words are sacred vessels — a single missing character changes everything.',
    rewardCharacter: { id: 'kavi-r', name: 'Kavi the Scribe', role: 'Story Guardian', desc: 'Presents a golden palm-leaf scroll.', avatar: '📜', appearance: 'Scribe with golden scroll', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A scribe unfurling a luminous golden scroll', imagePrompt: 'scribe with luminous golden scroll, anime fantasy' },
    visualStyle: 'Cool stone temple, golden lamp light',
    backgroundMusic: 'Gentle temple bells with chanting drone',
    backgroundPrompt: 'Ancient stone temple interior with oil lamps and palm leaves',
    sceneImagePrompt: 'stone temple interior, oil lamps, palm-leaf manuscripts, anime background art',
    season: 'Winter',
    timeOfDay: 'Evening',
    weather: 'Cool and still',
    musicStyle: 'Temple bells and tanpura drone',
    soundEffects: ['Bells chiming', 'Fire crackling', 'Pages turning'],
  },
  lists: {
    storyTradition: 'Merchant Caravan',
    setting: 'A vast desert caravan route on the Silk Road.',
    narrator: 'A caravan leader narrating tales of organized trade.',
    mentor: { id: 'roshan', name: 'Roshan the Caravan Leader', role: 'Master of the Merchant Train', desc: 'Keeps the march in perfect order.', avatar: '🐪', appearance: 'Weathered with indigo turban, leather vest', personality: 'Steady, experienced, fair', voiceStyle: 'Deep and rhythmic', illustrationPrompt: 'A weathered caravan leader with indigo turban', imagePrompt: 'weathered desert caravan leader, indigo turban, anime adventure style' },
    mainCharacters: [
      { id: 'zara', name: 'Zara the Merchant', role: 'Silk Road Trader', desc: 'Recording each cargo item as it arrives.', avatar: '🧵', appearance: 'Young with practical clothes, leather journal', personality: 'Sharp, organized', voiceStyle: 'Clear and efficient', illustrationPrompt: 'A young merchant with leather journal', imagePrompt: 'young Silk Road merchant girl, leather journal, anime adventure style' },
      { id: 'fatima', name: 'Fatima the Spice Trader', role: 'Market Basket Keeper', desc: 'A merchant who arranges spices in order.', avatar: '🧺', appearance: 'Cheerful trader with colorful shawl', personality: 'Organized, friendly', voiceStyle: 'Lively', illustrationPrompt: 'A merchant arranging spice baskets', imagePrompt: 'anime spice trader character arranging colorful baskets, bustling market, vibrant colors, Studio Ghibli style', portraitSeed: portraitSeedFrom('fatima') },
    ],
    emotionalTone: 'Adventurous and rhythmic',
    storyTheme: 'Order is the backbone of trade — what comes first, stays first.',
    rewardCharacter: { id: 'roshan-r', name: 'Roshan the Caravan Leader', role: 'Story Guardian', desc: 'Offers a golden compass.', avatar: '🧭', appearance: 'Leader with golden compass', personality: 'Generous', voiceStyle: 'Warm', illustrationPrompt: 'A leader holding a luminous golden compass', imagePrompt: 'leader with golden compass, desert sunset, anime fantasy' },
    visualStyle: 'Golden desert dunes, colorful banners',
    backgroundMusic: 'Rhythmic folk drums with distant flute',
    backgroundPrompt: 'Vast golden desert dunes with merchant caravan',
    sceneImagePrompt: 'golden desert dunes, merchant caravan, silk banners, anime background art',
    season: 'Summer',
    timeOfDay: 'Sunset',
    weather: 'Hot and clear',
    musicStyle: 'Rhythmic folk drums',
    soundEffects: ['Camel footsteps', 'Wind across sand', 'Distant flute'],
  },
  tuples: {
    storyTradition: 'Jataka Tales',
    setting: 'A mountain monastery where a Buddhist monk teaches through tales.',
    narrator: 'A Buddhist monk telling tales of wisdom.',
    mentor: { id: 'sumedha', name: 'Brother Sumedha', role: 'The Mountain Monk', desc: 'Teaches that some things must never change once set.', avatar: '🏔️', appearance: 'Serene monk in saffron robes, prayer beads', personality: 'Peaceful, steadfast, wise', voiceStyle: 'Calm and meditative', illustrationPrompt: 'A serene monk in saffron robes before misty monastery', imagePrompt: 'serene Buddhist monk, saffron robes, prayer flags, anime zen style' },
    mainCharacters: [
      { id: 'kiran', name: 'Kiran the Pilgrim', role: 'Mountain Wayfinder', desc: 'Learning to navigate using fixed coordinates.', avatar: '🧭', appearance: 'Young traveler with staff, mountain clothes', personality: 'Determined, curious', voiceStyle: 'Earnest', illustrationPrompt: 'A young pilgrim with walking staff and map', imagePrompt: 'young mountain pilgrim, walking staff, anime adventure style' },
      { id: 'nanda', name: 'Nanda the Shepherd', role: 'Mountain Flock Guide', desc: 'A shepherd who marks each sheep with its mountain home.', avatar: '🐑', appearance: 'Weathered shepherd with walking stick', personality: 'Calm, observant', voiceStyle: 'Gentle', illustrationPrompt: 'A shepherd marking sheep with stone tags', imagePrompt: 'anime shepherd character with flock on a mountain path, misty dawn, earth tones, Studio Ghibli style', portraitSeed: portraitSeedFrom('nanda') },
    ],
    emotionalTone: 'Peaceful and steadfast',
    storyTheme: 'Some truths are fixed — once set, they guide us without change.',
    rewardCharacter: { id: 'sumedha-r', name: 'Brother Sumedha', role: 'Story Guardian', desc: 'Bestows an immutable stone prayer bead.', avatar: '📿', appearance: 'Monk with luminous bead', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A monk pressing a luminous prayer bead', imagePrompt: 'monk with luminous prayer bead, anime fantasy' },
    visualStyle: 'Misty mountain peaks, prayer flags',
    backgroundMusic: 'Tibetan singing bowls with mountain wind',
    backgroundPrompt: 'Misty mountain monastery at dawn',
    sceneImagePrompt: 'misty mountain monastery, prayer flags, cool blue, anime background art',
    season: 'Winter',
    timeOfDay: 'Dawn',
    weather: 'Misty and cool',
    musicStyle: 'Meditative singing bowls',
    soundEffects: ['Mountain wind', 'Prayer flags fluttering', 'Distant chanting'],
  },
  sets: {
    storyTradition: 'Gurukul',
    setting: 'An ancient gurukul under a great fig tree.',
    narrator: 'A former student recalling gurukul lessons.',
    mentor: { id: 'dharmananda', name: 'Guru Dharmananda', role: 'The Forest Teacher', desc: 'Teaches that wisdom comes from recognizing uniqueness.', avatar: '🌳', appearance: 'Ancient sage with white beard, ochre robes', personality: 'Wise, contemplative, kind', voiceStyle: 'Deep and resonant', illustrationPrompt: 'An ancient sage with flowing white beard under a banyan tree', imagePrompt: 'ancient sage with white beard, banyan tree, anime wise master style' },
    mainCharacters: [
      { id: 'arjun', name: 'Arjun the Student', role: 'Gurukul Apprentice', desc: 'Learning that no two wisdom-seeds are the same.', avatar: '🌱', appearance: 'Bright student with curious eyes, notebook', personality: 'Curious, eager', voiceStyle: 'Young and questioning', illustrationPrompt: 'A bright student sitting cross-legged with notebook', imagePrompt: 'young gurukul student, notebook, forest light, anime style' },
      { id: 'kala', name: 'Kala the Potter', role: 'Village Clay Shaper', desc: 'A potter who ensures no two pots share the same shape.', avatar: '🏺', appearance: 'Dusty hands, warm smile', personality: 'Patient, artistic', voiceStyle: 'Warm and earthy', illustrationPrompt: 'A potter examining unique clay pots', imagePrompt: 'anime potter character examining unique clay pots, dusty workshop, golden light, Studio Ghibli style', portraitSeed: portraitSeedFrom('kala') },
    ],
    emotionalTone: 'Contemplative and wise',
    storyTheme: 'Uniqueness is the foundation of clarity.',
    rewardCharacter: { id: 'dharmananda-r', name: 'Guru Dharmananda', role: 'Story Guardian', desc: 'Grants a unique jade stone.', avatar: '💎', appearance: 'Sage with luminous jade', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A sage holding a luminous jade stone', imagePrompt: 'sage with luminous jade, anime fantasy' },
    visualStyle: 'Lush forest gurukul, dappled sunlight',
    backgroundMusic: 'Vedic chanting with bamboo flute',
    backgroundPrompt: 'Ancient forest gurukul under massive banyan tree',
    sceneImagePrompt: 'forest gurukul, banyan tree, dappled sunlight, anime background art',
    season: 'Spring',
    timeOfDay: 'Morning',
    weather: 'Warm with dappled light',
    musicStyle: 'Vedic chanting drone',
    soundEffects: ['Bird calls', 'Rustling leaves', 'Chanting'],
  },
  dictionaries: {
    storyTradition: 'Royal Court (Akbar-Birbal)',
    setting: 'The Grand Vault of Delhi where Birbal designs a seal-based cabinet.',
    narrator: 'A court chronicler documenting Birbal\'s solution.',
    mentor: { id: 'birbal-d', name: 'Birbal', role: 'The Court Logician', desc: 'Turns vault chaos into a perfect map.', avatar: '🧠', appearance: 'Sharp-featured with copper seal', personality: 'Brilliant, patient', voiceStyle: 'Confident and clear', illustrationPrompt: 'A court advisor holding a gleaming copper seal', imagePrompt: 'Mughal court advisor with copper seal, anime style' },
    mainCharacters: [
      { id: 'akbar-d', name: 'Emperor Akbar', role: 'The Imperial Sovereign', desc: 'Demands instant treasure retrieval.', avatar: '👑', appearance: 'Regal before vault door', personality: 'Demanding but fair', voiceStyle: 'Authoritative', illustrationPrompt: 'A regal emperor before a massive vault door', imagePrompt: 'Mughal emperor before vault door, anime royalty style' },
      { id: 'das', name: 'Dharam Das', role: 'The Royal Steward', desc: 'Reveals the pain of linear search.', avatar: '📜', appearance: 'Nervous with keys at belt', personality: 'Anxious, hardworking', voiceStyle: 'Worried and flustered', illustrationPrompt: 'A nervous vault keeper with brass keys', imagePrompt: 'nervous vault keeper with keys, anime comedy style' },
      { id: 'birbal-d2', name: 'Birbal', role: 'The Court Logician', desc: 'Designs the copper-seal cabinet.', avatar: '🧠', appearance: 'Presenting copper seals', personality: 'Brilliant', voiceStyle: 'Clear', illustrationPrompt: 'An advisor presenting copper seals on velvet', imagePrompt: 'advisor with copper seals, anime intellectual style' },
    ],
    emotionalTone: 'Dramatic and revelatory',
    storyTheme: 'A unique key gives a value an address — direct access without searching.',
    rewardCharacter: { id: 'birbal-dr', name: 'Birbal', role: 'Story Guardian', desc: 'Awards a golden copper seal.', avatar: '🔑', appearance: 'Advisor with luminous seal', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'An advisor holding aloft a luminous golden seal', imagePrompt: 'advisor with luminous golden seal, anime fantasy' },
    visualStyle: 'Rich Mughal vault, golden alcoves',
    backgroundMusic: 'Grand court orchestra with tabla',
    backgroundPrompt: 'Grand Mughal vault with golden alcoves and copper seals',
    sceneImagePrompt: 'Mughal vault, golden alcoves, copper seals, anime background art',
    season: 'Autumn',
    timeOfDay: 'Afternoon',
    weather: 'Clear and golden',
    musicStyle: 'Grand court orchestra',
    soundEffects: ['Echoing footsteps', 'Metal clinking', 'Court murmurs'],
  },
  conditionals: {
    storyTradition: 'Vikram-Betal',
    setting: 'A moonlit cremation ground where King Vikram carries the Betaal.',
    narrator: 'The Betaal narrating riddles of choice.',
    mentor: { id: 'betaal', name: 'The Betaal', role: 'The Speaking Ghost', desc: 'Poses riddles of decision.', avatar: '👻', appearance: 'Translucent with eerie blue glow, wild hair', personality: 'Mischievous, testing, cryptic', voiceStyle: 'Eerie and playful', illustrationPrompt: 'A ghostly translucent figure with blue-green glow', imagePrompt: 'ethereal ghost with wild hair, eerie blue glow, anime supernatural style' },
    mainCharacters: [
      { id: 'vikram', name: 'King Vikram', role: 'The Fearless King', desc: 'Must answer each riddle correctly.', avatar: '⚔️', appearance: 'Warrior in armor, determined', personality: 'Brave, determined', voiceStyle: 'Strong and resolute', illustrationPrompt: 'A warrior king in ornate armor', imagePrompt: 'warrior king in armor, moonlit ruins, anime dark fantasy' },
      { id: 'rani', name: 'Rani the Queen', role: 'Vikram Court Judge', desc: 'A queen who decides paths at every crossroad.', avatar: '👑', appearance: 'Regal woman with sharp gaze', personality: 'Decisive, wise', voiceStyle: 'Authoritative yet kind', illustrationPrompt: 'A queen pointing at two diverging paths', imagePrompt: 'anime queen character at a crossroads pointing two directions, moonlit forest, mystical blue, Studio Ghibli style', portraitSeed: portraitSeedFrom('rani') },
    ],
    emotionalTone: 'Mysterious and suspenseful',
    storyTheme: 'Every choice has two faces — the wise choose based on truth.',
    rewardCharacter: { id: 'betaal-r', name: 'The Betaal', role: 'Story Guardian', desc: 'Reveals a ghostly lantern.', avatar: '🏮', appearance: 'Ghost with spectral lantern', personality: 'Reluctant', voiceStyle: 'Eerie', illustrationPrompt: 'A ghost extending a glowing spectral lantern', imagePrompt: 'ghost with spectral lantern, moonlit, anime fantasy' },
    visualStyle: 'Dark moonlit nights, eerie blue glow',
    backgroundMusic: 'Eerie tanpura drone with thunder',
    backgroundPrompt: 'Moonlit cremation ground with twisted banyan trees',
    sceneImagePrompt: 'moonlit ground, twisted trees, eerie blue light, anime background art',
    season: 'Winter',
    timeOfDay: 'Night',
    weather: 'Moonlit and eerie',
    musicStyle: 'Eerie drone',
    soundEffects: ['Ghostly whispers', 'Distant thunder', 'Creaking branches'],
  },
  loops: {
    storyTradition: 'Panchatantra',
    setting: 'A sacred temple courtyard for the evening lamp-lighting ceremony.',
    narrator: 'A temple priest describing the sacred ritual.',
    mentor: { id: 'ananda', name: 'Ananda the Priest', role: 'Temple Lamp Keeper', desc: 'Sacred repetition requires structure.', avatar: '🔥', appearance: 'Middle-aged priest, white veshti, brass lamp', personality: 'Serene, focused, reverent', voiceStyle: 'Calm and rhythmic', illustrationPrompt: 'A priest holding a brass oil lamp', imagePrompt: 'temple priest with brass lamp, warm golden light, anime devotional style' },
    mainCharacters: [
      { id: 'deepa', name: 'Deepa the Acolyte', role: 'Lamp Lighting Student', desc: 'Learning to light each lamp without missing one.', avatar: '🪔', appearance: 'Young girl with braids, white clothes, small lamp', personality: 'Eager, careful', voiceStyle: 'Young and hopeful', illustrationPrompt: 'A young acolyte holding a small brass lamp', imagePrompt: 'young temple acolyte, brass lamp, clay lamps, anime devotional style' },
      { id: 'kiran', name: 'Kiran the Lamp Maker', role: 'Temple Light Keeper', desc: 'A maker who lights lamps in a repeating pattern.', avatar: '🪔', appearance: 'Young artisan with glowing hands', personality: 'Energetic, focused', voiceStyle: 'Bright', illustrationPrompt: 'A lamp maker lighting rows of oil lamps', imagePrompt: 'anime lamp maker character lighting rows of oil lamps, temple corridor, warm golden glow, Studio Ghibli style', portraitSeed: portraitSeedFrom('kiran') },
    ],
    emotionalTone: 'Rhythmic and devotional',
    storyTheme: 'Sacred repetition with purpose — one action for each item.',
    rewardCharacter: { id: 'ananda-r', name: 'Ananda the Priest', role: 'Story Guardian', desc: 'Offers an eternal golden lamp.', avatar: '🪔', appearance: 'Priest with luminous lamp', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A priest presenting a luminous golden lamp', imagePrompt: 'priest with luminous golden lamp, anime fantasy' },
    visualStyle: 'Warm golden lamplight, temple stone',
    backgroundMusic: 'Temple bells with devotional chanting',
    backgroundPrompt: 'Sacred temple courtyard at dusk with oil lamps',
    sceneImagePrompt: 'temple courtyard, oil lamps, golden flames, anime background art',
    season: 'Autumn',
    timeOfDay: 'Dusk',
    weather: 'Warm and still',
    musicStyle: 'Devotional chanting',
    soundEffects: ['Temple bells', 'Fire crackling', 'Chanting'],
  },
  'while-loops': {
    storyTradition: 'Ancient Indian Village',
    setting: 'A remote village where the water clock keeper works until dawn.',
    narrator: 'A village elder telling tales of patience.',
    mentor: { id: 'ishan', name: 'Ishan the Well Keeper', role: 'Water Clock Guardian', desc: 'Some tasks repeat until a condition is met.', avatar: '💧', appearance: 'Elderly with weathered face, wooden staff', personality: 'Patient, wise, kind', voiceStyle: 'Slow and gentle', illustrationPrompt: 'An elderly man beside a stone well at dawn', imagePrompt: 'elderly well keeper, stone well, dawn mist, anime wise elder style' },
    mainCharacters: [
      { id: 'meera', name: 'Meera the Helper', role: 'Well Apprentice', desc: 'Refilling the water clock until dawn.', avatar: '🌅', appearance: 'Young with rolled sleeves, water pots', personality: 'Determined, hardworking', voiceStyle: 'Energetic', illustrationPrompt: 'A young woman carrying water pots at dawn', imagePrompt: 'young village girl, water pots, sunrise, anime style' },
      { id: 'arjun-w', name: 'Arjun the Water Bearer', role: 'Well Flow Keeper', desc: 'A bearer who keeps drawing water until the bucket is full.', avatar: '🪣', appearance: 'Strong youth with rope burns', personality: 'Persistent, determined', voiceStyle: 'Steady', illustrationPrompt: 'A water bearer pulling rope from a well', imagePrompt: 'anime water bearer character pulling rope from a stone well, morning mist, blue tones, Studio Ghibli style', portraitSeed: portraitSeedFrom('arjun-w') },
    ],
    emotionalTone: 'Patient and meditative',
    storyTheme: 'Persistence has a purpose — repeat only while the need remains.',
    rewardCharacter: { id: 'ishan-r', name: 'Ishan the Well Keeper', role: 'Story Guardian', desc: 'Gives a crystal water droplet.', avatar: '💎', appearance: 'Elder with crystal droplet', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'An elder holding a luminous crystal water droplet', imagePrompt: 'elder with crystal droplet, dawn light, anime fantasy' },
    visualStyle: 'Cool dawn mists, stone well',
    backgroundMusic: 'Gentle water sounds with santoor',
    backgroundPrompt: 'Ancient stone village well at dawn',
    sceneImagePrompt: 'village well, dawn mist, water flowing, anime background art',
    season: 'Spring',
    timeOfDay: 'Dawn',
    weather: 'Cool and misty',
    musicStyle: 'Gentle santoor melody',
    soundEffects: ['Water flowing', 'Crickets', 'Distant rooster'],
  },
  functions: {
    storyTradition: 'Tenali Rama',
    setting: 'The court of King Krishnadevaraya where Tenali Raman turns problems into reusable tricks.',
    narrator: 'A court jester recounting cleverest solutions.',
    mentor: { id: 'tenali', name: 'Tenali Raman', role: 'The Court Jester-Sage', desc: 'Packages clever solutions into reusable formulas.', avatar: '🎭', appearance: 'Witty man with trick-box, colorful robes', personality: 'Witty, clever, playful', voiceStyle: 'Quick and humorous', illustrationPrompt: 'A witty sage with a wooden trick-box', imagePrompt: 'witty court jester-sage, colorful robes, trick-box, anime comedic style' },
    mainCharacters: [
      { id: 'krishna', name: 'King Krishnadevaraya', role: 'The Patron King', desc: 'Values clever, reusable solutions.', avatar: '👑', appearance: 'Majestic with ornate crown, gold robes', personality: 'Wise, appreciative', voiceStyle: 'Regal and warm', illustrationPrompt: 'A majestic king with ornate jeweled crown', imagePrompt: 'Vijayanagara king, jeweled crown, anime royalty style' },
      { id: 'maya', name: 'Maya the Dancer', role: 'Court Movement Teacher', desc: 'A dancer whose moves can be repeated by name.', avatar: '💃', appearance: 'Graceful dancer with flowing silk', personality: 'Expressive, patient', voiceStyle: 'Melodic', illustrationPrompt: 'A dancer demonstrating a named move', imagePrompt: 'anime dancer character demonstrating a graceful move, palace courtyard, silk flowing, Studio Ghibli style', portraitSeed: portraitSeedFrom('maya') },
    ],
    emotionalTone: 'Witty and clever',
    storyTheme: 'A wise solution, named and packaged, can serve a thousand needs.',
    rewardCharacter: { id: 'tenali-r', name: 'Tenali Raman', role: 'Story Guardian', desc: 'Presents a golden trick-box.', avatar: '📦', appearance: 'Sage with golden trick-box', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A sage offering a glowing golden trick-box', imagePrompt: 'sage with golden trick-box, anime fantasy' },
    visualStyle: 'Vibrant Vijayanagara court, colorful silks',
    backgroundMusic: 'Lively Carnatic music with mridangam',
    backgroundPrompt: 'Vibrant Vijayanagara royal court with colorful silks',
    sceneImagePrompt: 'Vijayanagara court, colorful silks, gold accents, anime background art',
    season: 'Summer',
    timeOfDay: 'Afternoon',
    weather: 'Bright and festive',
    musicStyle: 'Lively Carnatic music',
    soundEffects: ['Court laughter', 'Mridangam beats', 'Silk rustling'],
  },
  indexing: {
    storyTradition: 'Jataka Tales',
    setting: 'An ancient monastery library with numbered bamboo scrolls.',
    narrator: 'A Buddhist librarian recounting the tale of the lost scroll.',
    mentor: { id: 'prakash', name: 'Brother Prakash', role: 'The Monastery Librarian', desc: 'Shelves begin counting from zero.', avatar: '📚', appearance: 'Gentle monk with spectacles, bamboo scrolls', personality: 'Patient, gentle, precise', voiceStyle: 'Soft and scholarly', illustrationPrompt: 'A librarian monk with brass spectacles and scrolls', imagePrompt: 'librarian monk, spectacles, bamboo scrolls, candlelight, anime scholarly style' },
    mainCharacters: [
      { id: 'suki', name: 'Suki the Novice', role: 'Library Apprentice', desc: 'Grabs the wrong scroll assuming shelf one.', avatar: '📖', appearance: 'Young novice, shaved head, surprised', personality: 'Curious, sometimes careless', voiceStyle: 'Young and surprised', illustrationPrompt: 'A novice monk with wide surprised eyes', imagePrompt: 'novice monk, surprised, wrong scroll, anime comedy style' },
      { id: 'sona', name: 'Sona the Librarian', role: 'Scroll Row Keeper', desc: 'A librarian who knows every scroll by its row number.', avatar: '📚', appearance: 'Spectacled woman with stacked scrolls', personality: 'Meticulous, quiet', voiceStyle: 'Soft and precise', illustrationPrompt: 'A librarian pointing at numbered scroll shelves', imagePrompt: 'anime librarian character pointing at numbered scroll shelves, candlelit monastery, warm amber, Studio Ghibli style', portraitSeed: portraitSeedFrom('sona') },
    ],
    emotionalTone: 'Gentle and instructive',
    storyTheme: 'The first position is zero — assumptions lead to wrong answers.',
    rewardCharacter: { id: 'prakash-r', name: 'Brother Prakash', role: 'Story Guardian', desc: 'Bestows a golden bookmark.', avatar: '🔖', appearance: 'Monk with golden bookmark', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A monk presenting a luminous golden bookmark', imagePrompt: 'monk with golden bookmark, library, anime fantasy' },
    visualStyle: 'Ancient library shelves, candlelight',
    backgroundMusic: 'Quiet monastery ambiance',
    backgroundPrompt: 'Ancient monastery library with numbered bamboo scrolls',
    sceneImagePrompt: 'monastery library, bamboo scrolls, candlelight, anime background art',
    season: 'Winter',
    timeOfDay: 'Evening',
    weather: 'Quiet and still',
    musicStyle: 'Quiet monastery ambiance',
    soundEffects: ['Pages turning', 'Distant chanting', 'Candle flickering'],
  },
  searching: {
    storyTradition: 'Merchant Caravan',
    setting: 'A vast warehouse at the end of the Silk Road.',
    narrator: 'A warehouse foreman describing the art of finding.',
    mentor: { id: 'kadir', name: 'Kadir the Warehouse Master', role: 'Keeper of Lost Things', desc: 'Knows every crate by its mark.', avatar: '🔍', appearance: 'Broad-shouldered with lantern, leather apron', personality: 'Keen, methodical, experienced', voiceStyle: 'Deep and observant', illustrationPrompt: 'A warehouse master with lantern examining crates', imagePrompt: 'warehouse master with lantern, crates, anime detective style' },
    mainCharacters: [
      { id: 'nadia', name: 'Nadia the Inspector', role: 'Cargo Scout', desc: 'Searching for a missing elephant bell.', avatar: '🔔', appearance: 'Young with clipboard, brass bell', personality: 'Sharp, focused', voiceStyle: 'Clear and determined', illustrationPrompt: 'A young inspector with clipboard and bell', imagePrompt: 'young inspector, clipboard, dim warehouse, anime mystery style' },
      { id: 'ravi', name: 'Ravi the Scout', role: 'Warehouse Pathfinder', desc: 'A scout who finds crates by scanning each one.', avatar: '🔍', appearance: 'Alert youth with lantern', personality: 'Keen-eyed, methodical', voiceStyle: 'Focused', illustrationPrompt: 'A scout scanning crates with a lantern', imagePrompt: 'anime scout character scanning crates with a lantern, dim warehouse, detective atmosphere, Studio Ghibli style', portraitSeed: portraitSeedFrom('ravi') },
    ],
    emotionalTone: 'Determined and methodical',
    storyTheme: 'To find, you must first ask: does it exist here?',
    rewardCharacter: { id: 'kadir-r', name: 'Kadir the Warehouse Master', role: 'Story Guardian', desc: 'Reveals a golden compass.', avatar: '🧭', appearance: 'Master with golden compass', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A master revealing a luminous golden compass', imagePrompt: 'master with golden compass, anime fantasy' },
    visualStyle: 'Dim warehouse, torchlight',
    backgroundMusic: 'Low drum rhythm with creaking wood',
    backgroundPrompt: 'Vast dimly lit warehouse with tall crate stacks',
    sceneImagePrompt: 'dim warehouse, crate stacks, lantern light, anime background art',
    season: 'Autumn',
    timeOfDay: 'Night',
    weather: 'Dust and shadows',
    musicStyle: 'Low drum rhythm',
    soundEffects: ['Creaking wood', 'Distant echoes', 'Footsteps'],
  },
  filtering: {
    storyTradition: 'Temple Traditions',
    setting: 'A sacred lotus pond at a temple.',
    narrator: 'A temple gardener describing the sacred art of selecting.',
    mentor: { id: 'padma', name: 'Padma the Gardener', role: 'Sacred Lotus Keeper', desc: 'Only worthy offerings pass the gate.', avatar: '🪷', appearance: 'Serene woman among lotus flowers, cotton sari', personality: 'Devoted, selective, peaceful', voiceStyle: 'Soft and reverent', illustrationPrompt: 'A serene woman among blooming lotus flowers', imagePrompt: 'temple gardener among lotus, morning mist, anime zen style' },
    mainCharacters: [
      { id: 'lata', name: 'Lata the Offerer', role: 'Temple Offering Student', desc: 'Selecting only the purest lotus blooms.', avatar: '🌸', appearance: 'Young devotee with brass plate', personality: 'Reverent, careful', voiceStyle: 'Gentle and respectful', illustrationPrompt: 'A young devotee examining lotus blossoms', imagePrompt: 'young devotee, lotus blossoms, temple, anime devotional style' },
      { id: 'gita', name: 'Gita the Flower Sorter', role: 'Temple Garland Maker', desc: 'A sorter who picks only the fresh flowers.', avatar: '🌺', appearance: 'Young woman with flower garlands', personality: 'Gentle, selective', voiceStyle: 'Soft', illustrationPrompt: 'A flower sorter picking blooms from a basket', imagePrompt: 'anime flower sorter character picking fresh blooms, temple garden, morning dew, Studio Ghibli style', portraitSeed: portraitSeedFrom('gita') },
    ],
    emotionalTone: 'Devoted and selective',
    storyTheme: 'Purity is selection — only what meets the standard passes through.',
    rewardCharacter: { id: 'padma-r', name: 'Padma the Gardener', role: 'Story Guardian', desc: 'Offers a perfect golden lotus.', avatar: '🪷', appearance: 'Gardener with golden lotus', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A gardener presenting a luminous golden lotus', imagePrompt: 'gardener with golden lotus, anime fantasy' },
    visualStyle: 'Serene temple pond, lotus blooms',
    backgroundMusic: 'Gentle water lapping with veena',
    backgroundPrompt: 'Serene temple lotus pond at dawn',
    sceneImagePrompt: 'lotus pond, pink blossoms, still water, anime background art',
    season: 'Spring',
    timeOfDay: 'Morning',
    weather: 'Calm and misty',
    musicStyle: 'Gentle veena melody',
    soundEffects: ['Water lapping', 'Temple bells', 'Birdsong'],
  },
  counting: {
    storyTradition: 'Gurukul',
    setting: 'A forest gurukul where students count grain offerings.',
    narrator: 'A former student recalling the guru\'s counting lesson.',
    mentor: { id: 'ankana', name: 'Guru Ankana', role: 'The Counting Sage', desc: 'Without tallying, planning is impossible.', avatar: '🔢', appearance: 'Ancient female sage, silver hair, counting board', personality: 'Precise, wise, patient', voiceStyle: 'Clear and methodical', illustrationPrompt: 'An ancient female sage with counting board', imagePrompt: 'ancient female sage, counting board, beads, anime wise master style' },
    mainCharacters: [
      { id: 'vikram-c', name: 'Vikram the Student', role: 'Gurukul Apprentice', desc: 'Counting every grain shipment.', avatar: '🌾', appearance: 'Focused young man, tally marks', personality: 'Determined, focused', voiceStyle: 'Earnest', illustrationPrompt: 'A student counting grain sacks', imagePrompt: 'student counting grains, determination, anime style' },
      { id: 'lakshmi-c', name: 'Lakshmi the Counter', role: 'Market Ledger Keeper', desc: 'A counter who tallies every item sold.', avatar: '📒', appearance: 'Neat woman with abacus', personality: 'Precise, cheerful', voiceStyle: 'Clear', illustrationPrompt: 'A counter tallying items on an abacus', imagePrompt: 'anime counter character tallying items on an abacus, busy market stall, warm colors, Studio Ghibli style', portraitSeed: portraitSeedFrom('lakshmi-c') },
    ],
    emotionalTone: 'Focused and precise',
    storyTheme: 'To know the whole, you must first count the parts.',
    rewardCharacter: { id: 'ankana-r', name: 'Guru Ankana', role: 'Story Guardian', desc: 'Grants golden counting beads.', avatar: '📿', appearance: 'Sage with golden beads', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A sage presenting luminous golden counting beads', imagePrompt: 'sage with golden beads, anime fantasy' },
    visualStyle: 'Forest gurukul, counting boards',
    backgroundMusic: 'Steady tabla with chanting',
    backgroundPrompt: 'Forest gurukul with counting boards and grain sacks',
    sceneImagePrompt: 'forest gurukul, counting boards, grains, anime background art',
    season: 'Summer',
    timeOfDay: 'Morning',
    weather: 'Warm and focused',
    musicStyle: 'Steady tabla beat',
    soundEffects: ['Beads clicking', 'Grain rustling', 'Chanting'],
  },
  formatting: {
    storyTradition: 'Royal Court (Akbar-Birbal)',
    setting: 'The royal invitation hall where letters must be perfectly composed.',
    narrator: 'A royal secretary describing the art of invitations.',
    mentor: { id: 'farah', name: 'Farah the Scribe', role: 'Royal Invitation Master', desc: 'Formatting is the art of clear communication.', avatar: '💌', appearance: 'Elegant with gold quill, court robes', personality: 'Precise, elegant, patient', voiceStyle: 'Graceful and clear', illustrationPrompt: 'An elegant scribe with gold-tipped quill', imagePrompt: 'elegant royal scribe, gold quill, anime elegant style' },
    mainCharacters: [
      { id: 'akbar-f', name: 'Emperor Akbar', role: 'The Imperial Sovereign', desc: 'Every invitation must be flawless.', avatar: '👑', appearance: 'Examining invitation critically', personality: 'Demanding of quality', voiceStyle: 'Authoritative', illustrationPrompt: 'An emperor examining an invitation', imagePrompt: 'emperor examining invitation, anime royalty style' },
      { id: 'rajkumar', name: 'Rajkumar the Painter', role: 'Royal Invitation Artist', desc: 'A painter who arranges text into beautiful layouts.', avatar: '🎨', appearance: 'Elegant artist with paintbrush', personality: 'Creative, detail-oriented', voiceStyle: 'Artistic', illustrationPrompt: 'A painter arranging calligraphy on parchment', imagePrompt: 'anime painter character arranging calligraphy on parchment, royal studio, golden ink, Studio Ghibli style', portraitSeed: portraitSeedFrom('rajkumar') },
    ],
    emotionalTone: 'Elegant and precise',
    storyTheme: 'Clarity comes from structure — text and values woven together.',
    rewardCharacter: { id: 'farah-r', name: 'Farah the Scribe', role: 'Story Guardian', desc: 'Presents a golden quill.', avatar: '✒️', appearance: 'Scribe with golden quill', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A scribe presenting a luminous golden quill', imagePrompt: 'scribe with golden quill, anime fantasy' },
    visualStyle: 'Ornate invitation hall, gold calligraphy',
    backgroundMusic: 'Elegant court music with quill scratching',
    backgroundPrompt: 'Ornate royal invitation hall with calligraphy desk',
    sceneImagePrompt: 'royal invitation hall, calligraphy, wax seals, anime background art',
    season: 'Spring',
    timeOfDay: 'Afternoon',
    weather: 'Warm and golden',
    musicStyle: 'Elegant court music',
    soundEffects: ['Quill scratching', 'Paper rustling', 'Soft sitar'],
  },
  mutation: {
    storyTradition: 'Vikram-Betal',
    setting: 'A shape-shifting cave where the Betaal demonstrates change.',
    narrator: 'The Betaal describing the power and danger of mutation.',
    mentor: { id: 'betaal-m', name: 'The Betaal', role: 'The Shape-Shifting Ghost', desc: 'Changing one tile changes the whole pattern.', avatar: '👻', appearance: 'Translucent with mosaic glow', personality: 'Cryptic, teaching', voiceStyle: 'Eerie and instructive', illustrationPrompt: 'A ghost gesturing at a glowing mosaic wall', imagePrompt: 'ghost at glowing mosaic wall, anime supernatural style' },
    mainCharacters: [
      { id: 'vikram-m', name: 'King Vikram', role: 'The Fearless King', desc: 'Must learn which changes are safe.', avatar: '⚔️', appearance: 'Examining mosaic cautiously', personality: 'Cautious, learning', voiceStyle: 'Resolute', illustrationPrompt: 'A king examining a mosaic wall', imagePrompt: 'king at mosaic wall, ghost nearby, anime dark fantasy' },
      { id: 'tara', name: 'Tara the Weaver', role: 'Mosaic Pattern Shifter', desc: 'A weaver who changes tile patterns without breaking the wall.', avatar: '🔮', appearance: 'Mystical woman with shifting robes', personality: 'Adaptable, creative', voiceStyle: 'Mysterious', illustrationPrompt: 'A weaver shifting mosaic tile patterns', imagePrompt: 'anime weaver character shifting mosaic tile patterns, glowing blue light, mystical atmosphere, Studio Ghibli style', portraitSeed: portraitSeedFrom('tara') },
    ],
    emotionalTone: 'Cautious and transformative',
    storyTheme: 'Change is powerful — but changing the wrong thing destroys the whole.',
    rewardCharacter: { id: 'betaal-mr', name: 'The Betaal', role: 'Story Guardian', desc: 'Reveals a shape-shifting gem.', avatar: '💎', appearance: 'Ghost with color-changing gem', personality: 'Gracious', voiceStyle: 'Eerie', illustrationPrompt: 'A ghost revealing a luminous shape-shifting gem', imagePrompt: 'ghost with shifting gem, crystal cave, anime fantasy' },
    visualStyle: 'Dark cave with glowing crystals',
    backgroundMusic: 'Eerie drone with crystalline chimes',
    backgroundPrompt: 'Dark cave with glowing crystal mosaic tiles',
    sceneImagePrompt: 'crystal cave, glowing tiles, eerie light, anime background art',
    season: 'Winter',
    timeOfDay: 'Night',
    weather: 'Dark and eerie',
    musicStyle: 'Eerie ambient drone',
    soundEffects: ['Crystalline chimes', 'Ghostly echo', 'Shifting stones'],
  },
  validation: {
    storyTradition: 'Ancient Indian Village',
    setting: 'A village gateway where the gatekeeper inspects every traveler.',
    narrator: 'A village elder recounting the gatekeeper\'s standards.',
    mentor: { id: 'suraj', name: 'Suraj the Gatekeeper', role: 'Village Entry Guard', desc: 'Invalid data must never be accepted.', avatar: '🛡️', appearance: 'Tall guard with armor, shield', personality: 'Vigilant, fair, strict', voiceStyle: 'Firm and clear', illustrationPrompt: 'A tall guard with leather and brass armor', imagePrompt: 'village gatekeeper, armor, shield, anime guardian style' },
    mainCharacters: [
      { id: 'kavya', name: 'Kavya the Traveler', role: 'Village Visitor', desc: 'Must present a valid name pass.', avatar: '🚶', appearance: 'Travel-worn cloak, name pass', personality: 'Hopeful, cooperative', voiceStyle: 'Polite', illustrationPrompt: 'A traveler presenting a name pass', imagePrompt: 'traveler with name pass, village gate, anime adventure style' },
      { id: 'hari', name: 'Hari the Gate Guard', role: 'Village Entry Checker', desc: 'A guard who checks every pass before allowing entry.', avatar: '🛡️', appearance: 'Stalwart guard with shield', personality: 'Vigilant, fair', voiceStyle: 'Firm', illustrationPrompt: 'A guard examining a travel pass', imagePrompt: 'anime guard character examining a travel pass, torchlit gate, medieval village, Studio Ghibli style', portraitSeed: portraitSeedFrom('hari') },
    ],
    emotionalTone: 'Vigilant and protective',
    storyTheme: 'Trust is earned through verification.',
    rewardCharacter: { id: 'suraj-r', name: 'Suraj the Gatekeeper', role: 'Story Guardian', desc: 'Bestows a golden shield.', avatar: '🛡️', appearance: 'Guard with golden shield', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A guard presenting a luminous golden shield', imagePrompt: 'guard with golden shield, anime fantasy' },
    visualStyle: 'Village gateway, torchlight',
    backgroundMusic: 'Steady drum with village ambiance',
    backgroundPrompt: 'Ancient village stone gateway with torchlit guard posts',
    sceneImagePrompt: 'village gateway, torchlight, stone arch, anime background art',
    season: 'Autumn',
    timeOfDay: 'Evening',
    weather: 'Cool and clear',
    musicStyle: 'Steady drum rhythm',
    soundEffects: ['Gate creaking', 'Torch crackling', 'Village sounds'],
  },
  modules: {
    storyTradition: 'Tenali Rama',
    setting: 'The royal workshop where Tenali Raman organizes tools.',
    narrator: 'A workshop apprentice describing the tool chest.',
    mentor: { id: 'tenali-m', name: 'Tenali Raman', role: 'The Tool Chest Sage', desc: 'Specialists\' tools should be shared.', avatar: '🧰', appearance: 'Sage with wooden tool chest', personality: 'Clever, resourceful', voiceStyle: 'Quick and witty', illustrationPrompt: 'A sage presenting a wooden tool chest', imagePrompt: 'sage with tool chest, colorful workshop, anime clever style' },
    mainCharacters: [
      { id: 'krishna-m', name: 'King Krishnadevaraya', role: 'The Patron King', desc: 'Orders tools be organized for all.', avatar: '👑', appearance: 'Examining tool chest', personality: 'Appreciative', voiceStyle: 'Regal', illustrationPrompt: 'A king examining a tool chest', imagePrompt: 'king with tool chest, workshop, anime royalty style' },
      { id: 'priya-m', name: 'Priya the Tool Maker', role: 'Workshop Organizer', desc: 'A tool maker who packs each tool in its own box.', avatar: '🧰', appearance: 'Busy artisan with tool boxes', personality: 'Organized, clever', voiceStyle: 'Practical', illustrationPrompt: 'A tool maker packing tools into labeled boxes', imagePrompt: 'anime tool maker character packing labeled tool boxes, colorful workshop, warm light, Studio Ghibli style', portraitSeed: portraitSeedFrom('priya-m') },
    ],
    emotionalTone: 'Clever and resourceful',
    storyTheme: 'Don\'t reinvent — borrow from those who\'ve perfected the tool.',
    rewardCharacter: { id: 'tenali-mr', name: 'Tenali Raman', role: 'Story Guardian', desc: 'Offers a golden tool chest.', avatar: '🧰', appearance: 'Sage with golden chest', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A sage presenting a glowing golden tool chest', imagePrompt: 'sage with golden chest, anime fantasy' },
    visualStyle: 'Colorful workshop, hanging tools',
    backgroundMusic: 'Upbeat Carnatic with workshop sounds',
    backgroundPrompt: 'Colorful royal workshop with hanging tools and workbenches',
    sceneImagePrompt: 'royal workshop, hanging tools, workbenches, anime background art',
    season: 'Summer',
    timeOfDay: 'Morning',
    weather: 'Bright and busy',
    musicStyle: 'Upbeat Carnatic music',
    soundEffects: ['Hammering', 'Sawing', 'Chiseling'],
  },
  sorting: {
    storyTradition: 'Panchatantra',
    setting: 'A forest clearing where animals hold a great race.',
    narrator: 'A forest storyteller describing the competition.',
    mentor: { id: 'lion', name: 'Lion the Umpire', role: 'Fair-Play Guardian', desc: 'Fair ranking requires correct ordering.', avatar: '🦁', appearance: 'Majestic lion with crown, upright', personality: 'Just, fair, authoritative', voiceStyle: 'Deep and commanding', illustrationPrompt: 'A majestic lion sitting upright with golden crown', imagePrompt: 'majestic lion judge with crown, forest arena, anime anthropomorphic style' },
    mainCharacters: [
      { id: 'hare', name: 'Hare the Sprinter', role: 'Race Competitor', desc: 'Speed without order gives wrong results.', avatar: '🐇', appearance: 'Swift hare with bandana, mid-stride', personality: 'Competitive, fast', voiceStyle: 'Quick and breathless', illustrationPrompt: 'A swift hare with racing bandana mid-stride', imagePrompt: 'swift hare racing, bandana, forest track, anime anthropomorphic style' },
      { id: 'meena', name: 'Meena the Cloth Folder', role: 'Market Display Arranger', desc: 'A folder who arranges silks from shortest to longest.', avatar: '🧵', appearance: 'Neat woman with folded fabrics', personality: 'Orderly, patient', voiceStyle: 'Calm', illustrationPrompt: 'A cloth folder arranging silk fabrics by size', imagePrompt: 'anime cloth folder character arranging silk fabrics by size, market stall, colorful display, Studio Ghibli style', portraitSeed: portraitSeedFrom('meena') },
    ],
    emotionalTone: 'Competitive and fair',
    storyTheme: 'Fairness requires order — the fastest must be recognized.',
    rewardCharacter: { id: 'lion-r', name: 'Lion the Umpire', role: 'Story Guardian', desc: 'Presents a golden crown.', avatar: '👑', appearance: 'Lion with luminous crown', personality: 'Gracious', voiceStyle: 'Warm', illustrationPrompt: 'A lion presenting a luminous golden crown', imagePrompt: 'lion with golden crown, anime fantasy' },
    visualStyle: 'Vibrant forest arena, festive banners',
    backgroundMusic: 'Upbeat folk drums with cheering',
    backgroundPrompt: 'Vibrant forest clearing arena with race track',
    sceneImagePrompt: 'forest arena, race track, festive banners, anime background art',
    season: 'Spring',
    timeOfDay: 'Afternoon',
    weather: 'Bright and festive',
    musicStyle: 'Upbeat folk drums',
    soundEffects: ['Cheering crowd', 'Animal calls', 'Drum beats'],
  },
};

// ─── ENRICHMENT DATA ─────────────────────────────────────────────────────────

const enrichment: Record<TopicId, Enrichment> = {
  variables: {
    keeper: 'Mira', role: 'Keeper of Name Scrolls', avatar: '🐿️',
    premise: 'Mira labels each acorn stash so she can find it again.',
    consequence: 'Unlabelled stashes are confused.',
    prediction: 'If "winter" is changed, what will print(winter) show?',
    summary: 'Variables give values meaningful names. Assignment stores or updates the value.',
    application: 'storing a learner name or score',
    fullStory: `In a sun-dappled forest at the edge of a great mountain, a young squirrel named Mira spent the autumn gathering acorns. She carried them by the pawful to hidden spots beneath the roots of old trees. But when winter came and the snow covered everything, Mira could not remember which stash held the fat acorns and which held the dry leaves she had mistaken for food. She searched for hours and found nothing.

A wise crow perched on a branch above and watched her struggle. When Mira finally sat down, tired and hungry, the crow spoke gently. He told her that every important stash deserved a name. Mira liked the idea. She wrote "Oak Hill" on a smooth stone and placed it beside one stash. She wrote "River Bank" beside another. The next morning, she knew exactly where to go. She never mixed up her acorns again.

The crow nodded and said that a name is like a label you stick on a thing. Once you give something a name, you can find it, change it, and talk about it. Without a name, a thing is lost even when it sits right in front of you.`,
  },
  arithmetic: {
    keeper: 'Priya', role: 'Spice Merchant', avatar: '🌶️',
    premise: 'Priya must total daily spice sales before market closes.',
    consequence: 'Mental calculations create errors.',
    prediction: 'If 12 coins are added to 8 coins, what total should the ledger record?',
    summary: 'Arithmetic operators combine numbers for totals, differences, products.',
    application: 'calculating a market bill',
    fullStory: `Every morning at dawn, the village market filled with the scent of cumin, turmeric, and cardamom. Priya, a young spice trader, laid out her wares on a bright red cloth. By afternoon, she had sold small bags to farmers, weavers, and temple cooks. But when the sun began to set, she needed to count her earnings. She had sold twelve bags to the farmer, eight to the weaver, and five to the cook. Adding them in her head, she kept losing track. She wrote numbers on the ground with a stick, erased them, and started again. Twice she got different answers.

An old accountant sitting nearby watched her struggle. He walked over and showed her a simple trick. He told her to write each sale on a separate line, then draw a line beneath them and add the numbers one column at a time. Priya tried it. Twelve plus eight made twenty. Twenty plus five made twenty-five. The answer was clear and she smiled.

The accountant told her that numbers are the language of trade. When you add, subtract, multiply, or divide, you are speaking that language. Without arithmetic, every交易 becomes a guess.`,
  },
  comparison: {
    keeper: 'Akbar', role: 'The Emperor', avatar: '👑',
    premise: 'Akbar asks whether each petition meets the royal standard.',
    consequence: 'A decision cannot be defended without comparison.',
    prediction: 'Will 7 >= 10 be True or False?',
    summary: 'Comparison operators test relationships and produce Boolean True or False.',
    application: 'checking an eligibility threshold',
    fullStory: `Emperor Akbar held court every Thursday in the great hall of marble pillars. Petitioners came from distant villages to ask for land, tax relief, and justice. One Thursday, two farmers arrived at the same time. The first farmer said his harvest was seven bags of rice. The second said his was ten bags. Akbar wanted to know who had harvested more, so he asked Birbal to settle the matter.

Birbal stood between them and asked a simple question. He asked the first farmer whether seven was greater than ten. The farmer thought for a moment and shook his head. Birbal then asked the second whether ten was greater than seven. The farmer nodded. Birbal turned to the emperor and said that the second farmer had more, and the comparison proved it.

Akbar smiled and said that every decision in his court required comparison. Without comparing one thing to another, no judgment could be made. A number is just a number until you ask whether it is greater, smaller, or equal to something else. That question is the heart of all decisions.`,
  },
  strings: {
    keeper: 'Kavi', role: 'Temple Scribe', avatar: '🪶',
    premise: 'Kavi inscribes mantras whose syllables must be preserved exactly.',
    consequence: 'A missing character changes meaning.',
    prediction: 'What text is stored between the quotation marks?',
    summary: 'Strings represent text — store, join, inspect, and transform messages.',
    application: 'displaying a welcome message',
    fullStory: `In an ancient stone temple at the foot of a green hill, a young scribe named Kavi spent his days copying sacred mantras onto palm leaves. Each mantra was a string of carefully chosen syllables. One morning, the head priest asked Kavi to prepare a blessing for the harvest festival. Kavi wrote the mantra on a fresh leaf, but his hand slipped and he left out one syllable. The blessing now read differently. When the priest read it aloud, the meaning had changed from a prayer for rain into a prayer for drought.

The priest did not punish Kavi. Instead, he sat beside him and showed him how every character in a string mattered. He pointed to each syllable and explained that a string is like a necklace of letters. Remove one bead and the pattern breaks. Add one in the wrong place and the pattern twists.

Kavi practiced again. This time he wrote each syllable with care, checking twice before moving to the next. The mantra was perfect. The priest smiled and said that words are sacred vessels. A single missing letter changes everything.`,
  },
  lists: {
    keeper: 'Zara', role: 'Silk Road Trader', avatar: '🧵',
    premise: 'Zara records cargo in the order it arrives.',
    consequence: 'Without order, items cannot be located.',
    prediction: 'Which item is at position 0 in ["silk", "spice", "tea"]?',
    summary: 'Lists are ordered, mutable collections.',
    application: 'managing a shopping basket',
    fullStory: `Along the great Silk Road, a young merchant named Zara traveled with a caravan of camels loaded with cargo. Each day, new goods arrived at her tent. Silk from China, spices from Calicut, tea from the mountains. Zara wrote every item in a leather journal, but she wrote them in the order they arrived, without any plan. When a customer asked for the third item she had received, Zara flipped through pages for an hour. She had written so many entries that finding one specific item was nearly impossible.

An old caravan leader named Roshan visited her tent one evening. He saw her journal and shook his head. He told her that a list is like a line of camels. The first camel is always first. The second is always second. If you know the position, you can find any item instantly.

Zara tried his method. She wrote her cargo in a list and counted from the front. The first item was at position zero. The second was at position one. When a customer asked for the third item, she looked at position two and found it immediately. Order was the backbone of her trade.`,
  },
  tuples: {
    keeper: 'Kiran', role: 'Mountain Pilgrim', avatar: '🧭',
    premise: 'Kiran seals coordinates so they cannot be altered.',
    consequence: 'Changing a fixed landmark sends pilgrims wrong.',
    prediction: 'Why should fixed coordinates remain unchanged?',
    summary: 'Tuples group related values intended to stay fixed.',
    application: 'storing a map location',
    fullStory: `High in the Himalayas, a young pilgrim named Kiran carried a worn leather map that showed the path to a sacred temple. The map had two numbers on it, the latitude and longitude of the temple entrance. Kiran had copied these numbers from an old stone marker at the base of the mountain. He trusted them completely.

One day, a fellow traveler jokingly changed one of the numbers on Kiran's map, swapping the longitude for a different value. Kiran did not notice. He followed the new coordinates deep into a forest of thick bamboo. After hours of walking, he found himself at a cliff overlooking a river. The temple was nowhere in sight.

A passing monk found Kiran sitting on a rock, confused and tired. The monk asked to see the map. When he saw the altered numbers, he shook his head. He told Kiran that some things must never change. Coordinates are like promises. Once you write them down, they must stay exactly as they are. If you change even one digit, the pilgrim goes to the wrong mountain.

Kiran understood. He rewrote the original numbers and sealed them in a small cloth pouch.`,
  },
  sets: {
    keeper: 'Arjun', role: 'Gurukul Student', avatar: '🌱',
    premise: 'Arjun records names but duplicates would count twice.',
    consequence: 'Duplicate entries count one person many times.',
    prediction: 'How many copies of "Asha" remain in a set that receives it twice?',
    summary: 'Sets keep unique values for removing duplicates.',
    application: 'removing duplicate registrations',
    fullStory: `In a gurukul nestled among mango trees, a young student named Arjun was asked to prepare the guest list for the annual harvest celebration. He walked through the village and wrote down every name he heard. But the village was small and people talked to each other. By the end of the day, Arjun had written the name Asha three times, Ravi twice, and several other names multiple times.

When the head teacher reviewed the list, he counted forty-two names. But Arjun had only visited twenty-eight households. The teacher showed Arjun the problem. Asha appeared on three different lines, so the count was wrong. The teacher explained that a set is like a bag that refuses to accept the same thing twice. You can put Asha in once, but if you try to put her in again, the bag simply ignores it.

Arjun erased the duplicates and created a new list. This time, each name appeared only once. The count was accurate. The teacher nodded and said that sets protect us from counting the same thing twice. They keep only what is unique.`,
  },
  conditionals: {
    keeper: 'Vikram', role: 'The King', avatar: '⚔️',
    premise: 'Vikram must choose whether to open the haunted gate.',
    consequence: 'Opening at the wrong time releases spirits.',
    prediction: 'If ghost_signal is False, which branch runs?',
    summary: 'Conditionals choose actions based on Boolean conditions.',
    application: 'approving or declining a request',
    fullStory: `In a kingdom of misty forests and ancient forts, King Vikram stood before a iron gate that led to the treasury. The gate was old and rumored to be haunted. A inscription above it read that the gate should only be opened when the moon is full and the guard signal is green. Any other time, spirits would escape and haunt the village.

One night, Vikram needed gold to pay his soldiers. He walked to the gate with his torch. The guard held up a red lantern, meaning the signal was not green. Vikram paused. He could force the gate open, but the inscription warned against it. He could wait for the right signal, but his soldiers needed gold by morning.

Vikram chose to wait. He sent a messenger to check the sky. The messenger returned and said the moon was not full. Vikram closed his eyes and made his decision. He told his soldiers that the gate would stay closed until both conditions were true. Only when the moon was full AND the signal was green would he open it.

The next night, both conditions were met. The gate opened safely.`,
  },
  loops: {
    keeper: 'Deepa', role: 'Lamp Lighting Acolyte', avatar: '🪔',
    premise: 'Deepa must light one lamp for every alcove.',
    consequence: 'Manual repetition is error-prone.',
    prediction: 'How many times does a for loop act with three alcoves?',
    summary: 'For loops repeat an action for each item in a sequence.',
    application: 'processing every order',
    fullStory: `In a great temple at the edge of a river, a young acolyte named Deepa was given an important task. The temple had twelve alcoves along its walls, and each alcove held an oil lamp. Deepa was told to light every lamp before the evening prayer. She took a taper and walked to the first alcove. She lit the lamp. Then she walked to the second alcove and lit that lamp. Then the third. By the fifth alcove, she was tired. She skipped one and moved to the sixth. The head priest noticed the dark alcove and called her back.

He told her that the temple had a rule. For every alcove, light one lamp. He said it slowly, pointing at each alcove as he spoke. For the first alcove, light a lamp. For the second, light a lamp. For the third, light a lamp. He continued until he reached the twelfth.

Deepa understood. She did not need to think about each alcove separately. She needed one instruction that repeated for every alcove. The priest told her that this is the oldest pattern in the world. Do the same thing, for each thing in a list.`,
  },
  'while-loops': {
    keeper: 'Meera', role: 'Well Apprentice', avatar: '🌅',
    premise: 'Meera refills the water clock until dawn.',
    consequence: 'Stopping too early misreads time.',
    prediction: 'When does a while loop stop?',
    summary: 'While loops repeat while a condition is true.',
    application: 'retrying until a valid response',
    fullStory: `On the banks of a slow river, a young apprentice named Meera tended the village water clock. The clock was a large clay pot with a small hole near the bottom. Water dripped from the pot into a bowl below. When the bowl was full, one hour had passed. Meera's job was to keep the pot filled so the clock would run through the night.

She carried water from the river in a leather bucket. She poured it into the pot and watched the level rise. But the hole was always open, so the water level kept dropping. Meera checked the pot. If the water was still above the mark, she rested. If it had fallen below, she carried another bucket. She repeated this through the long night.

The village elder watched from his window and smiled. He told Meera that she had discovered a great secret. She did not act on a schedule. She acted on a condition. As long as the water was low, she worked. When the water was high, she stopped. The moment the first light of dawn appeared, she stopped for good. The elder said this is how the wisest people work. They repeat an action not because they are told to, but because a condition tells them to continue.`,
  },
  functions: {
    keeper: 'Tenali', role: 'The Jester-Sage', avatar: '🎭',
    premise: 'Tenali delivers the same greeting changing only the name.',
    consequence: 'Copying causes inconsistency.',
    prediction: 'What part changes when a new argument is supplied?',
    summary: 'Functions package reusable actions with parameters.',
    application: 'reusing a report action',
    fullStory: `In the court of the great emperor, the jester Tenali Rama was known for his clever tongue. Every morning, the emperor asked Tenali to greet the visiting ambassadors. There were many ambassadors, and each one came from a different kingdom. Tenali greeted the ambassador from Persia with a bow and the words "Welcome, honored guest from Persia." Then he greeted the ambassador from China with the same bow and the words "Welcome, honored guest from China." Then came the ambassador from Rome, and Tenali said "Welcome, honored guest from Rome."

By the tenth ambassador, Tenali was tired of repeating himself. He noticed that the only thing that changed was the name of the kingdom. The bow stayed the same. The words "Welcome, honored guest from" stayed the same. Only the last word changed.

Tenali went to his workshop and carved a wooden stamp. He wrote "Welcome, honored guest from" on the stamp and left a blank space at the end. Every morning, he pressed the stamp onto a scroll and filled in the kingdom name. The greeting was always perfect, and it took him half the time.

The emperor saw this and laughed. He told Tenali that he had invented something powerful. He had taken a repeated action, fixed the part that never changed, and left only the part that did.`,
  },
  indexing: {
    keeper: 'Suki', role: 'Library Apprentice', avatar: '📖',
    premise: 'Suki locates a manuscript using shelf number starting at zero.',
    consequence: 'Assuming shelf one retrieves wrong manuscript.',
    prediction: 'What does shelf[0] select?',
    summary: 'Indexing selects by zero-based position.',
    application: 'reading the first queued task',
    fullStory: `In a monastery library that stretched across three echoing halls, a young apprentice named Suki was asked to retrieve a manuscript for the head teacher. The manuscripts were arranged on long wooden shelves, each shelf holding exactly ten scrolls. The teacher told Suki that the manuscript she needed was on shelf zero, position three.

Suki frowned. She had always counted from one. She walked to what she thought was shelf one, picked up the scroll at position three, and brought it back. The teacher opened it and shook his head. It was the wrong manuscript.

The teacher walked Suki back to the shelves and pointed to the very first shelf. He told her that this shelf was numbered zero. The second shelf was numbered one. The third was numbered two. He explained that the library used a different counting system. The first item was always at position zero.

Suki looked at the shelf again. She picked up the scroll at position three on shelf zero. It was the correct manuscript. She learned that day that the first position is not one. It is zero. And every position after it follows the same pattern.`,
  },
  searching: {
    keeper: 'Nadia', role: 'Cargo Inspector', avatar: '🔔',
    premise: 'Nadia must determine if the bell is in the warehouse.',
    consequence: 'Cannot announce success without evidence.',
    prediction: 'What Boolean should "bell" in cargo produce?',
    summary: 'Searching asks whether a target exists.',
    application: 'finding an item in inventory',
    fullStory: `At the great warehouse near the harbor, a young inspector named Nadia was given a sealed manifest and a key. The manifest listed every item stored in the warehouse, and the key opened the main door. Her task was simple: find the ceremonial bell that the merchant had shipped from overseas.

Nadia opened the door and saw rows upon rows of wooden crates. Some were stacked three high. Others were buried behind barrels of oil and sacks of grain. She had no idea where the bell might be. She could open every crate, but that would take all day.

Instead, Nadia took out the manifest and read through it. She looked for the word "bell" among the entries. The first page had no mention of it. The second page listed ropes, nets, and fishing hooks. On the third page, she found it. The bell was in crate forty-seven, row six.

Nadia walked to crate forty-seven and opened it. The bell was inside, wrapped in cloth. She carried it back to the merchant and told him that the search was complete. The merchant asked how she found it so quickly. She held up the manifest and said she simply asked whether the bell was listed. The answer was yes.`,
  },
  filtering: {
    keeper: 'Lata', role: 'Offering Student', avatar: '🌸',
    premise: 'Lata permits only pure blossoms through the gate.',
    consequence: 'Mixing wilted blooms dishonors the deity.',
    prediction: 'Which items remain after filtering for fresh?',
    summary: 'Filtering creates a collection of items meeting a condition.',
    application: 'showing only approved requests',
    fullStory: `At a temple near a quiet lake, a young student named Lata was asked to prepare flower offerings for the evening prayer. She walked through the temple garden and gathered every bloom she could find. Roses, lotuses, marigolds, and jasmine. She filled her basket to the brim and carried it back.

When the head priest saw the basket, he stopped her. Among the fresh flowers were several wilted ones, their petals brown at the edges and heavy with moisture. The priest told Lata that the deity deserved only the purest blossoms. A wilted flower in the offering would dishonor the prayer.

Lata looked at her basket and felt embarrassed. She sat on the stone steps and began sorting. She picked up each flower and asked a simple question: is this fresh or wilted? If it was fresh, she placed it in a new basket. If it was wilted, she set it aside. After an hour, she had a basket full of bright, healthy flowers.

The priest nodded and said that Lata had done something important. She had taken a mixed collection and kept only the items that met a rule. That is the essence of filtering.`,
  },
  counting: {
    keeper: 'Vikram', role: 'Gurukul Student', avatar: '🌾',
    premise: 'Vikram counts each grain shipment and supplier frequency.',
    consequence: 'Without a tally, stores cannot be planned.',
    prediction: 'What does a count of repeated suppliers measure?',
    summary: 'Counting measures totals or frequency.',
    application: 'counting votes or occurrences',
    fullStory: `In a gurukul surrounded by golden wheat fields, a young student named Vikram was given an unusual task. The head teacher handed him a long list of grain deliveries and asked him to prepare a report. The list showed which farmer had delivered grain on which day. There were twenty farmers and thirty deliveries.

Vikram read through the list and tried to remember the numbers in his head. Farmer Ram had delivered three times. Farmer Shyam had delivered twice. Farmer Gopal had delivered five times. But by the time Vikram reached the twentieth name, he had forgotten the earlier counts. He started over, but the numbers blurred together.

The teacher saw Vikram struggling and walked over. He told Vikram to make a tally. Next to each farmer's name, Vikram was to draw a mark for every delivery. One mark for the first delivery, two marks for the second, three for the third. When he was done, he could count the marks.

Vikram tried the method. It was slow, but it was exact. Farmer Ram had three marks. Farmer Shyam had two. Farmer Gopal had five. The teacher told Vikram that counting is the oldest form of measurement. Without it, you cannot plan, you cannot trade, and you cannot know what you have.`,
  },
  formatting: {
    keeper: 'Farah', role: 'Royal Invitation Scribe', avatar: '💌',
    premise: 'Farah prepares invitations placing name and date correctly.',
    consequence: 'Poor format dishonors the guest.',
    prediction: 'What value replaces {guest} in an f-string?',
    summary: 'Formatting combines text and values into readable output.',
    application: 'creating a customer receipt',
    fullStory: `In a palace of golden domes and silk curtains, a young scribe named Farah was tasked with preparing invitations for the emperor's birthday celebration. There were one hundred guests, and each invitation had to include the guest's name, the date of the celebration, and the location of the feast.

Farah wrote the first invitation by hand. She wrote "Dear [name], you are invited to the feast on [date] at the [location]." But when she tried to fill in the blanks, she realized the spacing was wrong. The name was too long and pushed the date to the next line. She started over, but this time the date was too short and left a gap.

An old calligrapher named Rahim visited her workshop. He saw her struggle and showed her a trick. He told her to write the message once, with symbols where the details should go. Then he showed her how to place each detail exactly where it belonged, without changing the rest of the message.

Farah tried his method. She wrote the invitation with symbols, then replaced each symbol with the correct detail. The name went where the name symbol was. The date went where the date symbol was. Every invitation was perfect.`,
  },
  mutation: {
    keeper: 'Vikram', role: 'The King', avatar: '⚔️',
    premise: 'Vikram replaces a cracked tile without rebuilding.',
    consequence: 'Changing wrong tile damages the design.',
    prediction: 'What changes after prices[0] = 12?',
    summary: 'Mutation updates an existing mutable object.',
    application: 'updating a shopping basket',
    fullStory: `In a palace courtyard paved with colorful tiles, King Vikram noticed a cracked tile near the fountain. The tile was part of a pattern that told the story of his kingdom's founding. If the cracked tile was removed, the story would be broken. But if it was replaced with a new one, the story would continue.

Vikram called his best craftsman and showed him the damage. The craftsman carefully lifted the cracked tile and set it aside. He brought a new tile of the same size and color and pressed it into the empty space. The pattern was whole again. But the craftsman warned Vikram that this was delicate work. If he removed the wrong tile, the story would twist into something untrue.

Vikram understood. He told the craftsman that the courtyard was like a list of tiles. Each tile had a position. The cracked tile was at position zero. When the craftsman replaced it, he did not rebuild the entire courtyard. He changed only the tile at position zero. The rest stayed exactly as it was.

The craftsman nodded and said that this is how wise people make changes. They do not destroy what works. They change only what needs to change.`,
  },
  validation: {
    keeper: 'Kavya', role: 'Village Traveler', avatar: '🚶',
    premise: 'Kavya must present a valid name pass.',
    consequence: 'Invalid records must not enter the register.',
    prediction: 'Does an empty stripped name pass validation?',
    summary: 'Validation checks data meets rules before acceptance.',
    application: 'checking a required form field',
    fullStory: `At the edge of a great kingdom, a village gatekeeper named Kavya checked the travel passes of every person who entered. The rules were simple. Every traveler had to show a pass with their name written clearly. No empty passes. No scribbles. No symbols instead of letters.

One morning, a traveler walked up to the gate and handed Kavya a piece of paper. It was blank. Kavya looked at it, then at the traveler, and shook his head. He told the traveler that a blank pass was not a pass. The name had to be written in ink, with at least three letters.

The traveler tried again. This time, he had written his name, but the ink had smudged and the letters were unreadable. Kavya examined the paper under the morning light. He could make out a few strokes, but not enough to read the name. He told the traveler that smudged ink was the same as no ink.

A third traveler approached. Her pass was clean, the name was written in bold letters, and the ink was dry. Kavya checked it twice, then nodded. She could enter.

Kavya told the travelers that the gate was not meant to keep people out. It was meant to keep the kingdom's records accurate. Every name that entered the register had to be valid. A blank or smudged name would cause confusion later. Validation was the first line of defense.`,
  },
  modules: {
    keeper: 'Tenali', role: 'The Tool Chest Sage', avatar: '🧰',
    premise: 'Tenali calls specialists when the court needs expertise.',
    consequence: 'Rewriting tools wastes time.',
    prediction: 'What becomes available after import math?',
    summary: 'Modules organize reusable capabilities to import.',
    application: 'using trusted library functions',
    fullStory: `In the court of the great emperor, Tenali Rama was known for solving every problem. But one day, a merchant brought a chest sealed with a complicated lock. The lock had numbers carved into it, and the merchant said the numbers had to be added, multiplied, and square-rooted in a specific order. Tenali could do basic arithmetic, but square roots were beyond his skill.

Instead of guessing, Tenali went to the royal library. He found a scroll written by an ancient mathematician. The scroll contained formulas for square roots, cube roots, and other calculations. Tenali copied the formulas and brought them back to the court. He used the formulas to solve the lock's puzzle in minutes.

The emperor was impressed. He asked Tenali where he had learned such advanced mathematics. Tenali held up the scroll and said he had not learned it. He had borrowed it. The mathematician had spent years developing those formulas. Tenali did not need to reinvent them. He only needed to know where to find them and how to use them.

The emperor told his court that this was the wisdom of modules. When you need a tool you do not have, do not build it from scratch. Find a trusted source and borrow it.`,
  },
  sorting: {
    keeper: 'Hare', role: 'Race Competitor', avatar: '🐇',
    premise: 'Hare must arrange scores from slowest to fastest.',
    consequence: 'Unordered ranking gives wrong honour.',
    prediction: 'What order does sorted([3, 1, 2]) produce?',
    summary: 'Sorting arranges values into deliberate order.',
    application: 'ranking scores or dates',
    fullStory: `Every year, the animals of the forest held a great race. Rabbit, deer, elephant, tortoise, and fox all ran the same path through the woods. When the race was over, the organizer had to announce the results. But the organizer had written the finish times in the order the animals crossed the line, not from fastest to slowest.

The tortoise finished last, but its name appeared first on the list because the organizer had started recording from the back of the crowd. The deer had finished second, but its name was buried in the middle. The animals were confused. The fastest runner was not given the highest honor.

An old owl perched on a branch and watched the confusion. She flew down and told the organizer that the list needed sorting. She explained that sorting means arranging items from one end to the other based on a rule. In this case, the rule was time. The smallest time was the fastest runner. The largest time was the slowest.

The organizer rewrote the list. He placed the smallest time at the top and the largest at the bottom. Now the fastest animal was first and the slowest was last. The owl nodded and said that sorting turns chaos into order. Without it, you cannot know who is first and who is last.`,
  },
  dictionaries: {
    keeper: 'Birbal', role: 'The Court Logician', avatar: '🧠',
    premise: 'Akbar demands instant retrieval and Birbal designs a seal system.',
    consequence: 'Without mapping, finding requires checking every alcove.',
    prediction: 'If a second chest uses the Persia seal, what happens?',
    summary: 'Dictionaries map unique keys to values for direct retrieval.',
    application: 'storing and retrieving a learner profile',
    fullStory: `Emperor Akbar kept his treasury in a vast hall filled with hundreds of wooden chests. Each chest contained a different treasure. Gold coins from Persia, spices from Calicut, silks from China. But the chests were all identical, and finding one specific treasure meant opening every chest in the hall. It took hours.

One day, Akbar told his advisor Birbal that he wanted instant retrieval. He wanted to point at a chest and know its contents without opening it. Birbal smiled and said he had a plan. He went to the treasury with a box of copper seals. Each seal was carved with the name of a kingdom. He pressed the seal for Persia onto one chest, the seal for Calicut onto another, and the seal for China onto a third.

Then Birbal created a ledger. Next to each seal name, he wrote what was inside the chest. When Akbar asked for the Persian gold, Birbal looked at the ledger, found "Persia," and read the entry. He walked straight to the chest with the Persia seal and opened it. The gold was inside.

Akbar was amazed. He asked Birbal how he found it so fast. Birbal explained that every chest now had a unique name, and every name pointed to one chest. No searching was needed. The name was the address.`,
  },
};

// ─── TOPIC SEEDS ──────────────────────────────────────────────────────────────

const topicSeeds: Array<[TopicId, string, string, string, string, string, string]> = [
  ['variables', 'Variables', 'The Crow\'s Named Stashes', 'a named record', 'tribute = "Saffron"', 'A variable gives a meaningful name to a value.', 'tracking a learner\'s score'],
  ['arithmetic', 'Arithmetic', 'The Market Trader\'s Counting Stones', 'calculation', 'total = coins + jewels', 'Arithmetic combines numbers for calculations.', 'calculating a market total'],
  ['comparison', 'Comparison', 'The Emperor\'s Royal Scale', 'comparison', 'is_enough = grain >= required', 'Comparisons produce True or False.', 'checking a delivery threshold'],
  ['strings', 'Strings', 'The Temple Bell Inscription', 'text value', 'message = "Welcome, apprentice"', 'Strings represent text for storing and transforming.', 'creating a notification'],
  ['lists', 'Lists', 'The Silk Road Caravan', 'ordered collection', 'caravan = ["silk", "spice", "tea"]', 'Lists keep ordered mutable sequences.', 'tracking tasks in order'],
  ['tuples', 'Tuples', 'The Monk\'s Fixed Coordinates', 'fixed record', 'coordinates = (28.6, 77.2)', 'Tuples group values meant to stay fixed.', 'storing a map location'],
  ['sets', 'Sets', 'The Guru\'s Unique Students', 'unique collection', 'guests = {"Asha", "Ravi", "Asha"}', 'Sets keep unique values.', 'removing duplicate registrations'],
  ['conditionals', 'Conditionals', 'The Haunted Gate Riddle', 'decision branch', 'if rain:\n    close_gate()', 'Conditionals choose actions by condition.', 'routing an approval decision'],
  ['loops', 'Loops', 'The Temple Lamp Procession', 'repetition', 'for lamp in lamps:\n    light(lamp)', 'For loops repeat for each item.', 'processing every order'],
  ['while-loops', 'While Loops', 'The Well of a Thousand Pots', 'condition repetition', 'while water < target:\n    fill_pot()', 'While loops repeat while true.', 'retrying until a target is met'],
  ['functions', 'Functions', 'The Jester\'s Reusable Trick', 'reusable command', 'def prepare_tribute(item):\n    return item.title()', 'Functions package reusable actions.', 'standardising a report step'],
  ['indexing', 'Indexing', 'The Bamboo Scroll Shelf', 'position lookup', 'jewel = shelf[0]', 'Indexing selects by position.', 'reading the first queued task'],
  ['searching', 'Searching', 'The Lost Elephant Bell', 'search operation', 'found = bell in storehouse', 'Searching checks existence.', 'finding an item in inventory'],
  ['filtering', 'Filtering', 'The Sacred Lotus Pond', 'selection rule', 'safe = [p for p in pots if p.clean]', 'Filtering keeps items meeting a condition.', 'showing only approved requests'],
  ['counting', 'Counting', 'The Guru\'s Counting Beads', 'frequency tally', 'count = songs.count("raga")', 'Counting measures frequency.', 'tracking votes'],
  ['formatting', 'Formatting', 'The Imperial Invitation', 'formatted message', 'letter = f"Welcome, {guest}"', 'Formatting combines text and values.', 'creating a customer receipt'],
  ['mutation', 'Mutation', 'The Shape-Shifting Stone', 'intentional update', 'prices[0] = 12', 'Mutation changes mutable objects.', 'updating a shopping basket'],
  ['validation', 'Validation', 'The Village Gatekeeper', 'input check', 'is_valid = name.strip() != ""', 'Validation checks data before use.', 'rejecting an empty form'],
  ['modules', 'Modules', 'The Tool Chest of Wisdom', 'imported tool', 'import math\nmath.sqrt(81)', 'Modules organize reusable capabilities.', 'using trusted library functions'],
  ['sorting', 'Sorting', 'The Forest Animal Race', 'ordering operation', 'ranking = sorted([3, 1, 2])', 'Sorting arranges values into order.', 'ranking competition scores'],
];

// ─── TOPIC BUILDER ────────────────────────────────────────────────────────────

const makeTopic = (id: TopicId, title: string, story: string, concept: string, syntax: string, explanation: string, _application: string): TopicDefinition => {
  const item = enrichment[id];
  const world = storyWorlds[id];
  const mentorName = world.mentor.name;
  const guideName = world.mainCharacters[0]?.name ?? 'Guide';

  return {
    id,
    title: `Python ${title}`,
    storyTitle: story,
    narrativeTitle: story,
    description: `Learn ${title.toLowerCase()} through a ${world.storyTradition.toLowerCase()} story.`,
    difficulty: id === 'dictionaries' ? 'Intermediate' : 'Beginner',
    duration: '20 Mins',
    storyIntro: item.fullStory.split('\n\n')[0],
    narratorName: world.narrator,
    mentorCharacter: world.mentor,
    characters: [world.mainCharacters[0], world.mentor, world.mainCharacters[1]],
    storyScenes: makeScenes(title, item, concept, syntax, world),
    mentorPrompt: `In your own words, explain ${item.premise.toLowerCase()} What Python ${concept} rule would ${mentorName} use, what do you predict it will do, and why is this useful for ${item.application}?`,
    predictionPrompt: item.prediction,
    learningSummary: item.summary,
    tradition: `${world.storyTradition}-inspired ${world.storyTheme.split('—')[0].trim().toLowerCase()}`,
    storyWorld: world,
    learningReflection: reflectionFor(id, title, item),
    mentorKeywords: [concept.toLowerCase(), title.toLowerCase().split(' ')[0], 'predict', 'result'],
    bridge: [
      { storyLabel: `${guideName}'s information`, storyDesc: 'The real item or decision in the story.', codeLabel: 'Python data', codeDesc: 'A value stored for the program to use.', codeSyntax: syntax, icon: 'box' },
      { storyLabel: `${mentorName}'s repeatable rule`, storyDesc: `The story agrees on how to handle ${concept}.`, codeLabel: `Python ${title}`, codeDesc: explanation, codeSyntax: syntax, icon: 'key' },
      { storyLabel: 'Verification', storyDesc: 'The story compares its prediction with the evidence.', codeLabel: 'Program output', codeDesc: 'Running and inspecting code tests the rule.', codeSyntax: `print(${syntax.split('=')[0].trim() || syntax})`, icon: 'search' },
    ],
    lessons: makeLessons(title, concept, syntax, item),
    playground: (() => {
      const eqIdx = syntax.indexOf('=');
      const hasAssignment = eqIdx !== -1;
      const varName = hasAssignment ? syntax.slice(0, eqIdx).trim() : null;
      const varValue = hasAssignment ? syntax.slice(eqIdx + 1).trim() : null;
      const presets: PlaygroundPreset[] = [
        { label: `Try ${item.keeper}'s rule`, cmd: syntax, output: `The rule confirms for ${item.application}.` },
      ];
      if (varName) {
        presets.push({ label: 'Test the prediction', cmd: `print(${varName})`, output: varValue ?? item.prediction });
      }
      return { variableName: varName, intro: `Practice ${title.toLowerCase()} through ${story}.`, presets };
    })(),
    challenges: (() => {
      const assignment = parseAssignment(syntax);
      const printCmd = assignment ? `print(${assignment.name})` : syntax;
      return [
        { id: 0, instruction: `${item.keeper}'s first decision`, description: `Choose the Python statement that solves the problem.`, blocks: [syntax, 'repeat without a rule', 'discard the result', 'guess the answer'], correctBlock: syntax, successMessage: `Evidence, not guessing: ${item.summary}` },
        { id: 1, instruction: 'Predict before running', description: 'Choose the action that helps test a small example.', blocks: [printCmd, 'ignore the output', 'change the story', 'memorise without testing'], correctBlock: printCmd, successMessage: 'Good reasoning. Printing lets you compare evidence with prediction.' },
        { id: 2, instruction: 'Explain the moral', description: `Choose the statement that best captures the lesson.`, blocks: [item.summary, 'Code should never be checked.', 'Every problem needs the same structure.', 'The longest solution is best.'], correctBlock: item.summary, successMessage: `Exactly. ${item.summary}` },
      ];
    })(),
    applications: [item.application, `A real-world use of ${title.toLowerCase()}`, 'Explaining and verifying an automated result'],
    badgeName: `${title} ${world.storyTradition} Scholar`,
    rewardCard: {
      quote: `"${item.summary}"`,
      lesson: item.summary,
      rarity: id === 'dictionaries' ? 'legendary' : id === 'functions' || id === 'sorting' ? 'rare' : 'common',
      collectibleArtPrompt: `${world.mentor.imagePrompt}, holding a glowing golden token of ${title.toLowerCase()} mastery, ${world.sceneImagePrompt || world.backgroundPrompt}`,
    },
    activity: topicActivities[id].activity,
    conceptGuide: topicActivities[id].conceptGuide,
  };
};

// ─── DICTIONARY TOPIC (Reference Implementation) ──────────────────────────────

const dictionaryEnrichment = enrichment.dictionaries;
const dictionaryWorld = storyWorlds.dictionaries;

export const dictionaryTopic: TopicDefinition = {
  id: 'dictionaries',
  title: 'Python Dictionaries',
  storyTitle: 'The Royal Spice Ledger',
  narrativeTitle: 'The Royal Spice Ledger',
  description: 'Map unique identifiers to values for direct lookup.',
  difficulty: 'Intermediate',
  duration: '20 Mins',
  storyIntro: dictionaryEnrichment.fullStory.split('\n\n')[0],
  narratorName: dictionaryWorld.narrator,
  mentorCharacter: dictionaryWorld.mentor,
  characters: [dictionaryWorld.mentor, { name: 'Emperor Akbar', role: 'The Imperial Sovereign', desc: 'Demands instant treasure retrieval.', avatar: '👑', id: 'akbar-d', appearance: 'Regal with jeweled crown', personality: 'Demanding but fair', voiceStyle: 'Authoritative', illustrationPrompt: 'A regal emperor before a vault', imagePrompt: 'regal Mughal emperor, jeweled crown, anime royalty style' }, { name: 'Dharam Das', role: 'The Royal Steward', desc: 'Reveals linear search pain.', avatar: '📜', id: 'das', appearance: 'Nervous with keys', personality: 'Anxious', voiceStyle: 'Flustered', illustrationPrompt: 'A nervous vault keeper', imagePrompt: 'nervous vault keeper, anime comedy style' }],
  storyScenes,
  mentorPrompt: 'Why does a unique copper seal make it faster than checking every chest one by one?',
  predictionPrompt: 'If a second chest uses the Persia seal, what happens to the first?',
  learningSummary: 'Dictionaries map unique keys to values for direct retrieval.',
  tradition: `${dictionaryWorld.storyTradition}-inspired royal vault tale`,
  storyWorld: dictionaryWorld,
  learningReflection: { useful: 'Fast retrieval in inventories, profiles, settings.', commonMistake: 'Using missing key with [] instead of .get().', memoryTrick: 'Seal → key; chest → value; vault → dictionary.', keyTakeaway: 'A unique key gives a value an address.' },
  mentorKeywords: ['key', 'value', 'unique', 'lookup', 'search', 'overwrite'],
  bridge: [
    { storyLabel: "Merchant's Unique Seal", storyDesc: 'A distinct stamp points to one alcove.', codeLabel: 'Dictionary Key', codeDesc: 'A unique identifier for lookup.', codeSyntax: '"Golconda"', icon: 'key' },
    { storyLabel: 'Treasure Chest Contents', storyDesc: 'The tribute in the matched alcove.', codeLabel: 'Dictionary Value', codeDesc: 'Data stored under a key.', codeSyntax: '"Star Emerald"', icon: 'box' },
    { storyLabel: 'Royal Cabinet of Alcoves', storyDesc: 'The treasury maps seals to chests.', codeLabel: 'Python Dictionary', codeDesc: 'All key-value pairs.', codeSyntax: 'vault = {\n  "Golconda": "Star Emerald"\n}', icon: 'library' },
    { storyLabel: 'Match Seal to Retrieve', storyDesc: 'The seal identifies without scanning.', codeLabel: 'Key Lookup', codeDesc: 'Square brackets retrieve a value.', codeSyntax: 'item = vault["Golconda"]', icon: 'search' },
  ],
  lessons: lessonSlides,
  playground: { variableName: 'vault', intro: 'Test dictionary operations.', presets: [
    { label: 'Print Vault', cmd: 'print(vault)', output: '' }, { label: 'Get Golconda', cmd: "vault['Golconda']", output: '' }, { label: 'Add Kashmir', cmd: "vault['Kashmir'] = 'Saffron'", output: '' }, { label: 'Delete Calicut', cmd: "del vault['Calicut']", output: '' }, { label: 'Safe Get', cmd: "vault.get('Kabul', 'No Tribute')", output: '' }, { label: 'Check Existence', cmd: "'Persia' in vault", output: '' },
  ] },
  challenges: [
    { id: 0, instruction: 'Delete Calicut', description: 'Remove Calicut from the ledger.', blocks: ["del vault['Calicut']", "vault.delete('Calicut')", "delete(vault, 'Calicut')", "vault['Calicut'] = None"], correctBlock: "del vault['Calicut']", successMessage: "Correct! 'del' removes the merchant completely." },
    { id: 1, instruction: 'Add Kashmir', description: 'Store Kashmir\'s Saffron.', blocks: ["vault['Kashmir'] = 'Saffron'", "vault.append('Kashmir', 'Saffron')", "vault + {'Kashmir': 'Saffron'}", "vault.add('Kashmir', 'Saffron')"], correctBlock: "vault['Kashmir'] = 'Saffron'", successMessage: 'Splendid! Assignment adds a new pair.' },
    { id: 2, instruction: 'Update Golconda', description: 'Replace emeralds with diamonds.', blocks: ["vault['Golconda'] = 'Diamonds'", "vault['Golconda'].update('Diamonds')", "vault.set('Golconda', 'Diamonds')", "vault.Golconda = 'Diamonds'"], correctBlock: "vault['Golconda'] = 'Diamonds'", successMessage: 'Magnificent! Existing key replaces value.' },
    { id: 3, instruction: 'Check Kabul', description: 'Check if Kabul exists.', blocks: ["'Kabul' in vault", "vault.has_key('Kabul')", "vault.contains('Kabul')", "vault.check('Kabul')"], correctBlock: "'Kabul' in vault", successMessage: "Brilliant! 'in' checks key existence." },
  ],
  applications: ['Inventories and catalogues', 'User profiles and settings', 'Fast lookups in data apps'],
  badgeName: `${dictionaryWorld.storyTradition} Vault Master`,
  rewardCard: {
    quote: '"A unique key gives a value an address in the vault."',
    lesson: 'Dictionaries map unique keys to values for direct retrieval.',
    rarity: 'legendary',
    collectibleArtPrompt: 'Mughal court advisor holding a glowing golden copper seal of dictionary mastery, royal vault with golden alcoves behind',
  },
  activity: topicActivities.dictionaries.activity,
  conceptGuide: topicActivities.dictionaries.conceptGuide,
};

// ─── CURRICULUM EXPORTS ───────────────────────────────────────────────────────

const nonDictSeeds = topicSeeds.filter(([id]) => id !== 'dictionaries');
export const curriculumTopics: TopicDefinition[] = nonDictSeeds.map(([id, title, story, concept, syntax, explanation, application]) => makeTopic(id, title, story, concept, syntax, explanation, application));
export const allTopics: TopicDefinition[] = [...curriculumTopics.slice(0, 7), dictionaryTopic, ...curriculumTopics.slice(7)];
export const getTopic = (id: TopicId) => allTopics.find(topic => topic.id === id) ?? dictionaryTopic;
