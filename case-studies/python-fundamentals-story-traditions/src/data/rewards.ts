import type { TopicId } from './curriculum';

export interface StoryArtifact {
  id: string;
  tradition: string;
  name: string;
  illustrationPrompt: string;
  description: string;
  historicalSignificance: string;
  pythonConcept: string;
  rarity: 'common' | 'rare' | 'legendary';
  category: string;
}

export interface StoryGadget {
  id: string;
  topicId: TopicId;
  name: string;
  illustrationPrompt: string;
  description: string;
  pythonMeaning: string;
  quote: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export const traditionArtifacts: StoryArtifact[] = [
  {
    id: 'panchatantra-feather',
    tradition: 'Panchatantra',
    name: 'Wise Crow Feather',
    illustrationPrompt: 'A luminous golden crow feather with ancient wisdom inscriptions, glowing softly, studio ghibli style',
    description: 'A golden feather shed by Chakra the Wise Crow, said to grant clarity of thought to whoever holds it.',
    historicalSignificance: 'In the Panchatantra, animals teach moral lessons through clever storytelling. The crow represents wisdom passed between generations.',
    pythonConcept: 'Variables — naming things clearly so they can be found and reused.',
    rarity: 'common',
    category: 'Feathers',
  },
  {
    id: 'akbar-seal',
    tradition: 'Royal Court (Akbar-Birbal)',
    name: 'Royal Court Seal',
    illustrationPrompt: 'An ornate Mughal royal seal in gold and crimson, intricate calligraphy, jeweled edges, anime fantasy style',
    description: 'The Emperor\'s personal seal, used to authenticate decrees. Birbal once used it to solve a dispute in seconds.',
    historicalSignificance: 'Akbar\'s court was famous for its intellectual debates. Birbal\'s wisdom made the court seal a symbol of truth and justice.',
    pythonConcept: 'Comparison operators — testing truth with precision.',
    rarity: 'rare',
    category: 'Seals',
  },
  {
    id: 'temple-bell',
    tradition: 'Temple Traditions',
    name: 'Sacred Temple Bell',
    illustrationPrompt: 'A ornate brass temple bell with sacred engravings, warm golden glow, temple interior background, anime devotional style',
    description: 'A bell that rings once for every truth spoken. Its sound purifies the mind for learning.',
    historicalSignificance: 'Temple bells in Indian tradition mark the beginning of prayer and learning. Their sound is believed to clear the mind of distractions.',
    pythonConcept: 'Loops — repeating a sacred action with purpose.',
    rarity: 'common',
    category: 'Bells',
  },
  {
    id: 'merchant-chest',
    tradition: 'Merchant Caravan',
    name: 'Golden Coin Chest',
    illustrationPrompt: 'A beautiful wooden chest overflowing with golden coins and silk, desert caravan background, anime adventure style',
    description: 'A merchant\'s traveling chest, said to contain the wealth of a hundred trade routes.',
    historicalSignificance: 'Silk Road merchants carried their fortunes in locked chests. Each chest had a unique key known only to its owner.',
    pythonConcept: 'Lists — ordered collections that grow with trade.',
    rarity: 'common',
    category: 'Containers',
  },
  {
    id: 'jataka-lotus',
    tradition: 'Jataka Tales',
    name: 'Lotus Medal',
    illustrationPrompt: 'A luminous pink and gold lotus flower medal, glowing with inner light, serene water background, anime zen style',
    description: 'A medal shaped like a lotus, awarded to those who find truth through many lives of learning.',
    historicalSignificance: 'Jataka tales tell of the Buddha\'s past lives, each teaching a lesson. The lotus symbolizes purity emerging from mud.',
    pythonConcept: 'Indexing — finding the right position in a sequence.',
    rarity: 'rare',
    category: 'Medals',
  },
  {
    id: 'gurukul-scroll',
    tradition: 'Gurukul',
    name: 'Palm Leaf Manuscript',
    illustrationPrompt: 'An ancient palm leaf manuscript with elegant Sanskrit inscriptions, warm candlelight, anime scholarly style',
    description: 'A manuscript written by the guru, containing timeless knowledge inscribed on dried palm leaves.',
    historicalSignificance: 'Ancient Indian gurukuls used palm leaves for writing. Students would copy and memorize these manuscripts as part of their education.',
    pythonConcept: 'Functions — reusable knowledge packaged for sharing.',
    rarity: 'rare',
    category: 'Manuscripts',
  },
  {
    id: 'vikram-lantern',
    tradition: 'Vikram-Betal',
    name: 'Spectral Lantern',
    illustrationPrompt: 'A ghostly blue-green lantern floating in moonlight, eerie glow, twisted trees background, anime supernatural style',
    description: 'A lantern that reveals hidden truths. It burns with an unearthly flame that never dies.',
    historicalSignificance: 'In the Vikram-Betal stories, the ghost challenges King Vikram with riddles. The lantern represents the light of truth in darkness.',
    pythonConcept: 'Conditionals — choosing between light and shadow.',
    rarity: 'legendary',
    category: 'Lanterns',
  },
  {
    id: 'tenali-trickbox',
    tradition: 'Tenali Rama',
    name: 'Royal Court Scroll',
    illustrationPrompt: 'A colorful rolled scroll with golden seals, Vijayanagara court background, anime comedic style',
    description: 'A scroll containing Tenali Raman\'s cleverest solutions, each one a reusable trick.',
    historicalSignificance: 'Tenali Raman was the court jester-sage of Vijayanagara. His clever solutions saved the kingdom many times.',
    pythonConcept: 'Modules — importing wisdom from those who came before.',
    rarity: 'rare',
    category: 'Scrolls',
  },
  {
    id: 'village-pot',
    tradition: 'Ancient Indian Village',
    name: 'Clay Water Pot',
    illustrationPrompt: 'A beautifully painted terracotta water pot with village patterns, warm sunlight, anime rural style',
    description: 'A pot carried by village women to the well. Each pot is unique, shaped by the hands that made it.',
    historicalSignificance: 'In Indian villages, water pots are essential daily objects. Each pot is decorated uniquely by its maker.',
    pythonConcept: 'Strings — text that carries meaning through concatenation.',
    rarity: 'common',
    category: 'Pots',
  },
];

export function getArtifactForTradition(tradition: string): StoryArtifact | undefined {
  return traditionArtifacts.find(a => a.tradition === tradition);
}

export function getArtifactById(id: string): StoryArtifact | undefined {
  return traditionArtifacts.find(a => a.id === id);
}

export const topicGadgets: StoryGadget[] = [
  { id: 'gadget-variables', topicId: 'variables', name: 'Magic Name Scroll', illustrationPrompt: 'A glowing scroll that reveals names of hidden things, golden light, anime fantasy style', description: 'A scroll that gives names to unnamed things, making them findable.', pythonMeaning: 'Variables give names to values so Python can find them.', quote: '"A name gives power to what has none."', rarity: 'common' },
  { id: 'gadget-arithmetic', topicId: 'arithmetic', name: 'Counting Stones', illustrationPrompt: 'Smooth river stones with numbers carved, glowing amber, anime style', description: 'Stones used by ancient traders to count goods and calculate totals.', pythonMeaning: 'Arithmetic operators combine numbers to calculate results.', quote: '"Every trade begins with a simple sum."', rarity: 'common' },
  { id: 'gadget-comparison', topicId: 'comparison', name: 'Royal Balance Scales', illustrationPrompt: 'Ornate golden scales with jeweled pans, Mughal court background, anime style', description: 'Scales that weigh truth against falsehood, always finding the exact answer.', pythonMeaning: 'Comparison operators test relationships and produce True or False.', quote: '"Truth is found by weighing both sides."', rarity: 'common' },
  { id: 'gadget-strings', topicId: 'strings', name: 'Sacred Inscription Stylus', illustrationPrompt: 'A brass stylus for writing sacred texts on palm leaves, warm golden glow, anime style', description: 'A stylus that writes words that cannot be changed once inscribed.', pythonMeaning: 'Strings represent text — sequences of characters with meaning.', quote: '"Words weave worlds."', rarity: 'common' },
  { id: 'gadget-lists', topicId: 'lists', name: 'Traveler Backpack', illustrationPrompt: 'A leather backpack with organized compartments, silk road background, anime adventure style', description: 'A backpack that keeps items in the order they were packed.', pythonMeaning: 'Lists store ordered collections where position matters.', quote: '"Order makes wisdom accessible."', rarity: 'common' },
  { id: 'gadget-tuples', topicId: 'tuples', name: 'Mountain Coordinates Stone', illustrationPrompt: 'A carved stone tablet with fixed coordinates, mountain monastery background, anime zen style', description: 'A stone carved with coordinates that must never change.', pythonMeaning: 'Tuples are immutable — once set, they cannot be altered.', quote: '"What is set in stone cannot be changed."', rarity: 'rare' },
  { id: 'gadget-sets', topicId: 'sets', name: 'Sacred Lotus Basket', illustrationPrompt: 'A woven basket containing unique lotus flowers, temple pond background, anime devotional style', description: 'A basket where duplicate flowers automatically disappear.', pythonMeaning: 'Sets keep only unique values — duplicates are removed.', quote: '"No two leaves are truly alike."', rarity: 'common' },
  { id: 'gadget-dictionaries', topicId: 'dictionaries', name: 'Golden Treasure Key', illustrationPrompt: 'An ornate golden key with gem-encrusted handle, vault background, anime fantasy style', description: 'A key that opens any chest instantly — no searching required.', pythonMeaning: 'Dictionaries map keys to values for instant lookup.', quote: '"Ask the right question, find the answer instantly."', rarity: 'legendary' },
  { id: 'gadget-conditionals', topicId: 'conditionals', name: 'Temple Gate Token', illustrationPrompt: 'A glowing temple gate token with sacred markings, moonlit gate background, anime supernatural style', description: 'A token that decides who enters and who waits.', pythonMeaning: 'Conditionals choose actions based on whether conditions are True or False.', quote: '"Choose wisely, for every path has a consequence."', rarity: 'common' },
  { id: 'gadget-loops', topicId: 'loops', name: 'Temple Bell Rope', illustrationPrompt: 'A sacred bell rope with golden tassels, temple courtyard background, anime devotional style', description: 'A rope that rings the bell once for each pull — no more, no less.', pythonMeaning: 'For loops repeat an action for each item in a sequence.', quote: '"Leap again until the mountain is found."', rarity: 'common' },
  { id: 'gadget-while-loops', topicId: 'while-loops', name: 'Water Clock Pebble', illustrationPrompt: 'A smooth pebble dropped into a water clock, dawn light, anime wise elder style', description: 'A pebble that raises the water level until it reaches the top.', pythonMeaning: 'While loops repeat until a condition becomes False.', quote: '"Wait until the rain comes, then plant."', rarity: 'common' },
  { id: 'gadget-functions', topicId: 'functions', name: 'Royal Messenger Scroll', illustrationPrompt: 'A sealed scroll with royal insignia, messenger background, anime comedic style', description: 'A scroll that delivers the same message to any village.', pythonMeaning: 'Functions package reusable actions with parameters.', quote: '"Teach once, use forever."', rarity: 'rare' },
  { id: 'gadget-indexing', topicId: 'indexing', name: 'Library Shelf Marker', illustrationPrompt: 'A brass shelf marker with zero-based numbering, candlelit library, anime scholarly style', description: 'A marker that finds the exact scroll by its position number.', pythonMeaning: 'Indexing accesses elements by zero-based position.', quote: '"The first item is at zero, not one."', rarity: 'common' },
  { id: 'gadget-searching', topicId: 'searching', name: 'Magnifying Lens', illustrationPrompt: 'An ornate magnifying lens with golden frame, warehouse background, anime detective style', description: 'A lens that reveals whether a target exists in any collection.', pythonMeaning: 'Searching checks whether a value exists in a collection.', quote: '"What is hidden can always be found."', rarity: 'common' },
  { id: 'gadget-filtering', topicId: 'filtering', name: 'Golden Sieve', illustrationPrompt: 'A golden sieve with intricate patterns, temple garden background, anime zen style', description: 'A sieve that keeps only what meets the standard.', pythonMeaning: 'Filtering creates a collection of items meeting a condition.', quote: '"Keep the truth, remove the noise."', rarity: 'rare' },
  { id: 'gadget-counting', topicId: 'counting', name: 'Harvest Counting Beads', illustrationPrompt: 'Wooden counting beads on a string, grain market background, anime style', description: 'Beads that tally every grain entering the storehouse.', pythonMeaning: 'Counting measures how many times something occurs.', quote: '"Every grain deserves its count."', rarity: 'common' },
  { id: 'gadget-formatting', topicId: 'formatting', name: 'Royal Invitation Template', illustrationPrompt: 'A beautiful invitation with gold calligraphy, royal hall background, anime elegant style', description: 'A template that places names and dates perfectly every time.', pythonMeaning: 'Formatting combines text and values into readable strings.', quote: '"Presentation is the first taste of wisdom."', rarity: 'common' },
  { id: 'gadget-mutation', topicId: 'mutation', name: 'Shapeshifting Tile', illustrationPrompt: 'A mosaic tile that changes color, crystal cave background, anime supernatural style', description: 'A tile that changes in place without disturbing its neighbors.', pythonMeaning: 'Mutation updates an existing item in a mutable collection.', quote: '"Adapt or fall."', rarity: 'rare' },
  { id: 'gadget-validation', topicId: 'validation', name: 'Palace Gate Pass', illustrationPrompt: 'An ornate gate pass with verification seal, palace gate background, anime guardian style', description: 'A pass that proves the bearer meets every requirement.', pythonMeaning: 'Validation checks data meets rules before acceptance.', quote: '"Only valid entries pass the gate."', rarity: 'common' },
  { id: 'gadget-modules', topicId: 'modules', name: 'Scholar Library Chest', illustrationPrompt: 'A wooden chest filled with organized scrolls, gurukul library, anime scholarly style', description: 'A chest containing tools from many specialists, ready to borrow.', pythonMeaning: 'Modules organize reusable code into importable files.', quote: '"A well-organised mind is a powerful mind."', rarity: 'rare' },
  { id: 'gadget-sorting', topicId: 'sorting', name: 'Royal Ranking Trophy', illustrationPrompt: 'A golden trophy with laurel wreath, forest arena background, anime anthropomorphic style', description: 'A trophy awarded to the fastest, arranged by fair comparison.', pythonMeaning: 'Sorting arranges values into deliberate order.', quote: '"Order reveals pattern, pattern reveals truth."', rarity: 'common' },
];

export function getGadgetForTopic(topicId: TopicId): StoryGadget | undefined {
  return topicGadgets.find(g => g.topicId === topicId);
}

export function getGadgetById(id: string): StoryGadget | undefined {
  return topicGadgets.find(g => g.id === id);
}
