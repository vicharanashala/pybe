const express = require('express');
const router = express.Router();

const CASE_STUDIES = [
  // ── DEFAULT THEME CASE STUDIES ─────────────────────────────────────────────
  {
    id: 'cs-chai-stall',
    title: 'The Underground Chai Stall',
    emoji: '🍵',
    character: 'Ramu',
    tagline: 'From one cup of chai to an empire — rediscover Lists, Dicts, and Functions.',
    description: 'Ramu runs a chai stall outside IIT Ropar\'s gate. Follow his journey from tracking a single variable to managing a full menu dictionary. Every growing pain he feels is a Python construct waiting to be discovered.',
    arc: 'Variables → Lists → Dicts → Functions',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'functions'],
    difficulty: 'Beginner → Builder',
    totalSteps: 4,
    theme: 'default',
    color: '#F59E0B'
  },
  {
    id: 'cs-isro',
    title: 'ISRO Mission Control',
    emoji: '🚀',
    character: 'Intern at ISRO',
    tagline: 'Chandrayaan-3 is live. A FAIL at 2 AM shows why names matter more than positions.',
    description: 'You are an intern at ISRO during Chandrayaan-3. From three telemetry variables to managing 12 subsystems, a critical FAIL message at 2 AM teaches you why dictionaries exist — because lives depend on looking up by name, not position.',
    arc: 'Variables → Lists → Dicts → Sets → Modules',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'sets', 'modules'],
    difficulty: 'Beginner → Builder',
    totalSteps: 4,
    theme: 'default',
    color: '#3B82F6'
  },
  {
    id: 'cs-instagram',
    title: 'The Viral Instagram Filter Creator',
    emoji: '📸',
    character: 'Filter Developer',
    tagline: 'Twenty filters, parallel lists out of sync, and users complaining. Sound familiar?',
    description: 'Build a photo filter app from one variable to a complete class. When your 20 parallel lists fall out of sync and users see broken filters, you discover why bundling related data together isn\'t just elegant — it\'s necessary.',
    arc: 'Variables → Lists → Dicts → Functions → Classes',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'functions', 'classes'],
    difficulty: 'Explorer → Builder',
    totalSteps: 4,
    theme: 'default',
    color: '#EC4899'
  },
  {
    id: 'cs-food-delivery',
    title: 'Midnight Food Delivery Startup',
    emoji: '🍕',
    character: 'Arjun, Meera & Dev',
    tagline: 'Three friends, a hostel room at 2 AM, and a -₹36 bill that crashed the whole app.',
    description: 'Three hostel friends launch "HungerFix" at 2 AM. From Maggi and two variables to a full ordering system — the duplicate biryani crisis and a negative-quantity crash teach you why sets and try/except exist: real data is messy.',
    arc: 'Variables → Lists → Dicts → Sets → try/except',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'sets', 'error handling'],
    difficulty: 'Beginner → Builder',
    totalSteps: 4,
    theme: 'default',
    color: '#F97316'
  },
  {
    id: 'cs-ai-playlist',
    title: 'The AI Playlist That Knows You',
    emoji: '🎵',
    character: 'Playlist Builder',
    tagline: '"Shape of You" for the 23rd time. Your app needs sets — badly.',
    description: 'Build a music recommendation app from scratch. One mood variable becomes a list of 12 genres, which becomes a set-deduplicated session, which becomes a dictionary of play counts and ratings. Each pain point is a concept waiting to be born.',
    arc: 'Variables → Lists → Sets → Dicts → Functions',
    pythonJourney: ['variables', 'lists', 'sets', 'dictionaries', 'functions'],
    difficulty: 'Beginner → Explorer',
    totalSteps: 4,
    theme: 'default',
    color: '#8B5CF6'
  },
  {
    id: 'cs-kota',
    title: 'The Kota Coaching Factory',
    emoji: '📚',
    character: 'JEE Aspirant',
    tagline: 'Thirty batchmates. A parent calls. Find Priya\'s rank — the director is watching.',
    description: 'You are a JEE aspirant at a Kota coaching center tracking 30 batchmates\' ranks. From a single rank variable to a sorted merit list algorithm, every inefficiency you feel maps to a Python construct invented for exactly that pain.',
    arc: 'Variables → Lists → Dicts → Sorting → Algorithms',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'sorting', 'algorithms'],
    difficulty: 'Beginner → Builder',
    totalSteps: 4,
    theme: 'default',
    color: '#10B981'
  },

  // ── POTTERHEADS THEME CASE STUDIES ─────────────────────────────────────────
  {
    id: 'cs-potter-potions',
    title: 'Hogwarts Potion Brewing & Marauder\'s Map',
    emoji: '🧙‍♂️',
    character: 'Potions Apprentice at Hogwarts',
    tagline: 'Brewing Felix Felicis: Track ingredients, spellbooks, and map locations by magic.',
    description: 'Master magical data structures at Hogwarts! From storing a single potion ingredient variable to managing a house inventory dictionary and automating brewing functions, experience Python through wizardry.',
    arc: 'Variables → Lists → Dicts → Functions',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'functions'],
    difficulty: 'Beginner → Builder',
    totalSteps: 4,
    theme: 'potterheads',
    color: '#F59E0B'
  },
  {
    id: 'cs-potter-spells',
    title: 'The Triwizard Spell Vault & House Points',
    emoji: '🪄',
    character: 'Triwizard Champion',
    tagline: 'Decipher dark spells, deduplicate potion runes, and calculate House Points in real-time.',
    description: 'Face the Triwizard challenges! Manage spell rosters with lists, prevent duplicate curse registrations using sets, and sort House Points dynamically before Dumbledore awards the Cup.',
    arc: 'Variables → Lists → Dicts → Sets → Sorting',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'sets', 'sorting'],
    difficulty: 'Explorer → Builder',
    totalSteps: 4,
    theme: 'potterheads',
    color: '#D97706'
  },

  // ── MARVEL THEME CASE STUDIES ───────────────────────────────────────────────
  {
    id: 'cs-marvel-jarvis',
    title: 'J.A.R.V.I.S. Mark 85 Suit AI',
    emoji: '🦾',
    character: 'Tony Stark\'s AI Engineer',
    tagline: 'Suit power low! From tracking arc reactor voltage to managing 100 Iron Man armor modules.',
    description: 'Build J.A.R.V.I.S. from scratch! Track arc reactor output, group armor thruster subsystems, look up weapon status by keyword, and package repulsor beam calculations into reusable functions.',
    arc: 'Variables → Lists → Dicts → Functions',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'functions'],
    difficulty: 'Beginner → Builder',
    totalSteps: 4,
    theme: 'marvel',
    color: '#EF4444'
  },
  {
    id: 'cs-marvel-infinity',
    title: 'The Infinity Stones Containment Grid',
    emoji: '💎',
    character: 'Avenger Tech Lead',
    tagline: 'Prevent cosmic resonance! Filter duplicate energy signatures and compute gauntlet stability.',
    description: 'Secure the Infinity Stones! Store energy frequencies in lists, guarantee stone uniqueness using sets, map stone attributes with dictionaries, and handle cosmic surge exceptions gracefully.',
    arc: 'Variables → Lists → Dicts → Sets → try/except',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'sets', 'error handling'],
    difficulty: 'Explorer → Builder',
    totalSteps: 4,
    theme: 'marvel',
    color: '#38BDF8'
  },

  // ── ANIME THEME CASE STUDIES ────────────────────────────────────────────────
  {
    id: 'cs-anime-ninja',
    title: 'Hidden Leaf Jutsu & Chakra Engine',
    emoji: '⚔️',
    character: 'Shinobi Academy Trainee',
    tagline: 'Unlock your Nindo! From tracking chakra reserves to organizing secret forbidden scrolls.',
    description: 'Train to become Hokage! Store chakra levels, manage squad lists, look up jutsu hand signs by name, and package secret shadow clone calculations into reusable jutsu functions.',
    arc: 'Variables → Lists → Dicts → Functions',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'functions'],
    difficulty: 'Beginner → Builder',
    totalSteps: 4,
    theme: 'anime',
    color: '#FF2A85'
  },
  {
    id: 'cs-anime-pokedex',
    title: 'Legendary Creature Hunter & Mecha Sync',
    emoji: '🐉',
    character: 'S-Rank Hunter',
    tagline: 'Dungeon rift open! Deduplicate spotted monsters and compute mecha synchronization rates.',
    description: 'Enter the hunter dungeon! Track squad power levels, deduplicate wild monster encounters with sets, organize creature stats in dictionaries, and sort hunter guild rankings live.',
    arc: 'Variables → Lists → Dicts → Sets → Sorting',
    pythonJourney: ['variables', 'lists', 'dictionaries', 'sets', 'sorting'],
    difficulty: 'Explorer → Builder',
    totalSteps: 4,
    theme: 'anime',
    color: '#00F5D4'
  }
];

router.get('/', (req, res) => {
  const { theme } = req.query;
  if (theme && theme !== 'all') {
    const filtered = CASE_STUDIES.filter(c => {
      if (theme === 'default') return c.theme === 'default' || !c.theme;
      return c.theme === theme;
    });
    return res.json(filtered);
  }
  res.json(CASE_STUDIES);
});

router.get('/:id', (req, res) => {
  const cs = CASE_STUDIES.find(c => c.id === req.params.id);
  if (!cs) return res.status(404).json({ message: 'Case study not found' });
  res.json(cs);
});

module.exports = router;
