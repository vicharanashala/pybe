export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface SceneIllustration {
  characterPortraits: Record<string, string>;
  backgroundPrompt: string;
  emotion: string;
}

export interface StoryScene {
  id: number;
  title: string;
  narrative: string;
  dialogue: DialogueLine[];
  imageAlt: string;
  illustration?: SceneIllustration;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const storyScenes: StoryScene[] = [
  {
    id: 1,
    title: "Scene I: The Story of the Royal Vault",
    narrative: "Emperor Akbar kept his treasury in a vast hall filled with hundreds of wooden chests. Each chest contained a different treasure. Gold coins from Persia, spices from Calicut, silks from China. But the chests were all identical, and finding one specific treasure meant opening every chest in the hall. It took hours.\n\nOne day, Akbar told his advisor Birbal that he wanted instant retrieval. He wanted to point at a chest and know its contents without opening it. Birbal smiled and said he had a plan. He went to the treasury with a box of copper seals. Each seal was carved with the name of a kingdom. He pressed the seal for Persia onto one chest, the seal for Calicut onto another, and the seal for China onto a third.\n\nThen Birbal created a ledger. Next to each seal name, he wrote what was inside the chest. When Akbar asked for the Persian gold, Birbal looked at the ledger, found \"Persia,\" and read the entry. He walked straight to the chest with the Persia seal and opened it. The gold was inside.\n\nAkbar was amazed. He asked Birbal how he found it so fast. Birbal explained that every chest now had a unique name, and every name pointed to one chest. No searching was needed. The name was the address.",
    dialogue: [],
    imageAlt: "Emperor Akbar before the royal treasury",
    illustration: {
      characterPortraits: { akbar: 'regal Mughal emperor on throne, stern expression', birbal: 'wise advisor with knowing smile' },
      backgroundPrompt: 'grand Mughal treasury hall with rows of identical wooden chests',
      emotion: 'revelation and wonder',
    },
    question: "What is the main problem Birbal faces in this story?",
    options: ["Akbar demands instant retrieval and Birbal designs a seal system.", "Without mapping, finding requires checking every alcove.", "Birbal already knows the answer from the start.", "The problem resolves itself without any effort from Birbal."],
    correctIndex: 0,
    explanation: "Correct! Akbar demands instant treasure retrieval, and Birbal must find a way to deliver it.",
  },
  {
    id: 2,
    title: "Scene II: What Did Birbal Actually Do?",
    narrative: "Let us think about what Birbal really did. He noticed that every chest was identical and finding one required checking them all. He gave each chest a unique name and wrote what was inside in a ledger.",
    dialogue: [
      { speaker: 'birbal', text: "Before we write any code, let us predict. If a second chest uses the Persia seal, what happens to the first?" },
    ],
    imageAlt: "Birbal explaining his plan",
    illustration: {
      characterPortraits: { birbal: 'advisor holding gleaming copper seal', akbar: 'emperor examining seal with interest' },
      backgroundPrompt: 'Mughal vault with golden alcoves and copper seals',
      emotion: 'critical thinking',
    },
    question: "If a second chest uses the Persia seal, what happens?",
    options: ["The new chest overwrites the old entry.", "Both chests merge into one.", "The ledger explodes.", "Nothing changes."],
    correctIndex: 0,
    explanation: "Correct! Duplicate keys overwrite — keys must be unique.",
  },
  {
    id: 3,
    title: "Scene IV: Discovering Dictionaries",
    narrative: "Birbal names the pattern: Dictionaries map unique keys to values for direct retrieval.",
    dialogue: [
      { speaker: 'birbal', text: "Write the rule clearly: vault = {\"Persia\": \"Gold Coins\", \"Calicut\": \"Black Pepper\"}" },
    ],
    imageAlt: "Birbal showing the ledger",
    illustration: {
      characterPortraits: { birbal: 'advisor pointing at ledger', devika: 'keeper writing in ledger with focus' },
      backgroundPrompt: 'vault workspace with copper seals and ledger books',
      emotion: 'productive collaboration',
    },
    question: "Why does a dictionary help Birbal?",
    options: ["It maps each name to one chest instantly.", "It hides the result.", "It removes all data.", "It only changes the font."],
    correctIndex: 0,
    explanation: "Correct. Python dictionaries make a real-world process explicit, repeatable, and testable.",
  },
  {
    id: 4,
    title: "Scene V: Practice and Prediction",
    narrative: "Devika asks the apprentice to try it themselves and predict the result.",
    dialogue: [
      { speaker: 'devika', text: "Try it yourself. Predict first, then run." },
      { speaker: 'birbal', text: "Good reasoning comes from evidence, not guessing." },
    ],
    imageAlt: "Devika practicing",
    illustration: {
      characterPortraits: { devika: 'confident keeper holding up golden crown', birbal: 'advisor nodding' },
      backgroundPrompt: 'organized Mughal vault with labeled alcoves glowing gold',
      emotion: 'triumph and mastery',
    },
    question: "What should you do before running code?",
    options: ["Predict the result", "Run it immediately", "Skip the test", "Ask someone else"],
    correctIndex: 0,
    explanation: "Correct. Prediction before execution builds understanding.",
  },
  {
    id: 5,
    title: "Scene VI: The Lesson Learned",
    narrative: "The story concludes. Birbal reflects on the moral.",
    dialogue: [
      { speaker: 'birbal', text: "Dictionaries map unique keys to values for direct retrieval." },
      { speaker: 'devika', text: "Now I understand — the pattern solves the real problem." },
    ],
    imageAlt: "The vault is organized",
    illustration: {
      characterPortraits: { devika: 'confident keeper holding up golden crown', akbar: 'pleased emperor nodding' },
      backgroundPrompt: 'organized Mughal vault with labeled alcoves glowing gold',
      emotion: 'triumph and mastery',
    },
    question: "What is the key takeaway?",
    options: ["Unique keys give direct access to values", "Search is always slow", "Vaults need more workers", "Copper is better than iron"],
    correctIndex: 0,
    explanation: "Correct! Dictionaries use unique keys for O(1) direct retrieval.",
  },
];

export interface LessonSlide {
  title: string;
  concept: string;
  syntax: string;
  explanation: string;
  exampleCode: string;
}

export const lessonSlides: LessonSlide[] = [
  {
    title: "1. The Anatomy of a Dictionary",
    concept: "A dictionary maps unique keys to values — like seals pointing to treasure alcoves.",
    syntax: "vault = {\n  \"Persia\": \"Gold Coins\",\n  \"Calicut\": \"Black Pepper\"\n}",
    explanation: "Curled braces `{}` define the dictionary. Colons `:` separate keys from values, commas separate pairs.",
    exampleCode: "vault = {\n    \"Persia\": \"Gold Coins\",\n    \"Calicut\": \"Black Pepper\",\n    \"Golconda\": \"Star Emerald\"\n}\nprint(vault)"
  },
  {
    title: "2. Accessing Treasures (O(1) Lookup)",
    concept: "Retrieve a value instantly using its key with `[key]` or `.get()`.",
    syntax: "item = vault[\"Persia\"]\nitem = vault.get(\"Kashmir\", \"Empty\")",
    explanation: "`vault[key]` is instant but errors if missing. `.get(key, default)` returns a default instead of crashing.",
    exampleCode: "vault = {\"Persia\": \"Gold Coins\", \"Golconda\": \"Star Emerald\"}\nprint(vault[\"Persia\"])\nprint(vault.get(\"Kashmir\", \"Not Found\"))"
  },
  {
    title: "3. Adding & Updating Secrets",
    concept: "Assign to a key with `=` to add new pairs or update existing ones.",
    syntax: "vault[\"Kashmir\"] = \"Saffron\"\nvault[\"Golconda\"] = \"Blue Diamond\"",
    explanation: "New key → creates entry. Existing key → overwrites old value.",
    exampleCode: "vault = {\"Persia\": \"Gold Coins\"}\nvault[\"Kashmir\"] = \"Saffron\"\nvault[\"Persia\"] = \"Imperial Rubies\"\nprint(vault)"
  },
  {
    title: "4. Banishing Merchants (Deleting)",
    concept: "Remove entries with `del` or `.pop()` which also returns the removed value.",
    syntax: "del vault[\"Calicut\"]\nremoved = vault.pop(\"Calicut\")",
    explanation: "`del` removes directly. `.pop()` removes and hands you the value for logging.",
    exampleCode: "vault = {\"Persia\": \"Gold Coins\", \"Calicut\": \"Black Pepper\"}\ndel vault[\"Calicut\"]\npersian = vault.pop(\"Persia\")\nprint(\"Removed:\", persian)\nprint(vault)"
  },
  {
    title: "5. Examining the Ledger (Iteration)",
    concept: "Loop through `.keys()`, `.values()`, or `.items()` to inspect all records.",
    syntax: "for key in vault.keys():\nfor key, value in vault.items():",
    explanation: "`.keys()` gives all keys, `.values()` all values, `.items()` gives (key, value) pairs.",
    exampleCode: "vault = {\"Persia\": \"Gold Coins\", \"Golconda\": \"Emeralds\"}\nfor merchant, tribute in vault.items():\n    print(f\"{merchant} sent {tribute}\")"
  },
];


// Data structures for the Constellation Scenario Builder
export interface ScenarioChallenge {
  scenarioName: string;
  storyText: string;
  keysQuestion: string;
  keysOptions: string[];
  keysCorrectIndex: number;
  keysExpl: string;
  valuesQuestion: string;
  valuesOptions: string[];
  valuesCorrectIndex: number;
  valuesExpl: string;
  overrideQuestion: string;
  overrideOptions: string[];
  overrideCorrectIndex: number;
  overrideExpl: string;
}

export const astronomyScenario: ScenarioChallenge = {
  scenarioName: "The Royal Astronomer's Star Registry",
  storyText: "The royal astronomer lists the constellations in the sky and records the brightest star in each one. He writes that the constellation 'Orion' holds the star 'Rigel', 'Ursa Major' holds 'Dubhe', and 'Canis Major' holds 'Sirius'.",
  keysQuestion: "What must act as the UNIQUE KEY in our Python dictionary for the Star Registry?",
  keysOptions: [
    "The Constellation name (Orion, Ursa Major), because each region of the sky is unique.",
    "The Star name (Rigel, Sirius), because stars glow brightly.",
    "Both merged together as a single list.",
    "A numeric sequence index (0, 1, 2)."
  ],
  keysCorrectIndex: 0,
  keysExpl: "Yes! The Constellation name serves as the unique identifier (the Key) that maps directly to the brightest star.",
  valuesQuestion: "What should serve as the VALUE inside our dictionary?",
  valuesOptions: [
    "The Constellation name.",
    "The Brightest Star name (Rigel, Dubhe), because it represents the content stored under that constellation.",
    "The telescope lens settings.",
    "True or False depending on whether it is night."
  ],
  valuesCorrectIndex: 1,
  valuesExpl: "Correct! The brightest star represents the chest contents (Value) associated with that key constellation.",
  overrideQuestion: "If the astronomer observes that 'Orion' has a brighter star called 'Betelgeuse' and assigns astronomy['Orion'] = 'Betelgeuse', what happens?",
overrideOptions: [
  "Python creates a new constellation called Orion2.",
  "It raises a KeyError because Orion already exists.",
  "It replaces 'Rigel' with 'Betelgeuse' under the 'Orion' key.",
  "Both stars are added as a nested list automatically."
],
overrideCorrectIndex: 2,
overrideExpl: "Correct! Keys are unique, so assigning a new value to an existing key replaces the old value ('Rigel') with the new value ('Betelgeuse')."
};
