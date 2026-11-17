/**
 * seed.js – Populates the database with 8 scenarios and 4 roadmap phases.
 * Run with: npm run seed
 */

const prisma = require('../prisma');

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const scenarios = [
  {
    title: 'Coffee Shop Queue',
    difficulty: 'beginner',
    concepts: ['queue', 'loops', 'lists', 'conditionals'],
    context:
      'You are building a digital ordering system for a busy coffee shop. Customers join a queue, place orders, and are served in order. Some customers have priority (loyalty members).',
    prompt:
      'How would you design a system to manage a coffee shop queue? Think about how customers are added, served, and how you handle priority customers.',
    objectives: [
      'Understand FIFO (First In, First Out) data structures',
      'Implement a basic queue using Python lists or deque',
      'Use conditionals to handle priority customers',
      'Iterate through the queue to process orders',
    ],
  },
  {
    title: 'Library Book Sorter',
    difficulty: 'beginner',
    concepts: ['sorting', 'lists', 'functions', 'strings'],
    context:
      'A small library needs a program to sort returned books by title, author, or genre. The librarian wants to quickly find where each book belongs on the shelf.',
    prompt:
      'How would you sort a collection of books by different criteria? Think about what data you need for each book and how the sorting process works.',
    objectives: [
      'Create data structures to represent books',
      'Implement sorting with sorted() and custom keys',
      'Write reusable functions for different sort criteria',
      'Work with string comparison and manipulation',
    ],
  },
  {
    title: 'Weather Alert System',
    difficulty: 'intermediate',
    concepts: ['conditionals', 'dictionaries', 'functions', 'variables'],
    context:
      'Build a weather monitoring system that checks temperature, humidity, and wind speed readings. It should issue appropriate alerts (heat warning, frost alert, storm warning) based on configurable thresholds.',
    prompt:
      'How would you design a system that monitors weather data and triggers alerts? Consider the different types of weather conditions and how thresholds work.',
    objectives: [
      'Use dictionaries to store weather data and thresholds',
      'Implement multi-condition checking with if/elif/else',
      'Create functions for each alert type',
      'Handle edge cases and missing data',
    ],
  },
  {
    title: 'Student Grade Calculator',
    difficulty: 'beginner',
    concepts: ['variables', 'conditionals', 'lists', 'functions', 'aggregation'],
    context:
      'A teacher needs a program to calculate student grades. Each student has scores for assignments, quizzes, and exams with different weightings. The program should compute final grades and assign letter grades.',
    prompt:
      'How would you calculate a weighted average grade for students? Think about how different assignment types contribute to the final grade.',
    objectives: [
      'Store and manipulate grade data in lists',
      'Calculate weighted averages',
      'Use conditionals to assign letter grades',
      'Write reusable grading functions',
    ],
  },
  {
    title: 'Inventory Tracker',
    difficulty: 'intermediate',
    concepts: ['dictionaries', 'functions', 'conditionals', 'loops', 'error-handling'],
    context:
      'A small retail store needs an inventory management system. Products have names, quantities, prices, and categories. The system should support adding stock, removing stock, searching, and low-stock alerts.',
    prompt:
      'How would you build an inventory system that tracks products? Consider how to add, remove, search, and alert on low stock.',
    objectives: [
      'Use dictionaries for product storage',
      'Implement CRUD operations as functions',
      'Handle errors for invalid operations',
      'Create search and filtering capabilities',
    ],
  },
  {
    title: 'Playlist Shuffler',
    difficulty: 'beginner',
    concepts: ['lists', 'random', 'loops', 'functions'],
    context:
      'Build a music playlist manager that can shuffle songs, skip tracks, and maintain a play history. The shuffler should avoid repeating recently played songs.',
    prompt:
      'How would you build a playlist system that shuffles songs without repeating recent ones? Think about how to track what has been played.',
    objectives: [
      'Use lists to manage playlist and history',
      'Implement random selection with constraints',
      'Track play history to avoid repeats',
      'Create intuitive control functions (play, skip, shuffle)',
    ],
  },
  {
    title: 'Recipe Scaler',
    difficulty: 'intermediate',
    concepts: ['dictionaries', 'functions', 'variables', 'lists', 'strings'],
    context:
      'A cooking app needs a feature to scale recipes up or down. Given a recipe with ingredients and quantities for a certain number of servings, the system should recalculate all quantities for a different serving count.',
    prompt:
      'How would you scale a recipe from one serving size to another? Think about the data structures for ingredients and the maths involved.',
    objectives: [
      'Represent recipes with dictionaries',
      'Calculate proportional scaling',
      'Handle fractional quantities gracefully',
      'Format output for readable display',
    ],
  },
  {
    title: 'Chat Message Filter',
    difficulty: 'advanced',
    concepts: ['strings', 'lists', 'conditionals', 'functions', 'filtering', 'error-handling'],
    context:
      'Build a content moderation system for a chat application. The system should detect prohibited words, flag suspicious messages, allow custom filter rules, and provide moderation statistics.',
    prompt:
      'How would you design a chat filter that detects and handles inappropriate messages? Think about pattern matching, filter rules, and reporting.',
    objectives: [
      'Implement string pattern matching',
      'Create configurable filter rules',
      'Build a reporting/statistics system',
      'Handle edge cases (leetspeak, spacing tricks)',
    ],
  },
];

const roadmapPhases = [
  {
    phase: 'V0',
    title: 'Foundation – Local Heuristic Engine',
    summary:
      'Core MERN stack with local keyword-matching engine. Learners reason through scenarios, and the system generates Python abstractions, code scaffolds, and prompt feedback using deterministic heuristics.',
    items: [
      'Express + Prisma (SQLite) backend with CSR pattern',
      'React + vanilla CSS frontend',
      'Scenario-based reasoning workflow',
      'Local abstraction mapping (20+ keyword patterns)',
      'Dynamic Python code generation',
      'Prompt scoring and feedback engine',
      'Misconception detection (10+ Python anti-patterns)',
      'Mastery signal derivation',
      'Analytics dashboard',
    ],
    sortOrder: 0,
  },
  {
    phase: 'V1',
    title: 'Intelligence – Gemini Live Integration',
    summary:
      'Replace local heuristics with Google Gemini API for AI-powered analysis. Deeper abstraction mapping, more nuanced code generation, and personalised feedback.',
    items: [
      'Gemini API integration for abstraction mapping',
      'AI-powered code generation with explanations',
      'Natural language prompt analysis',
      'Personalised misconception feedback',
      'Adaptive difficulty suggestions',
      'Session-aware context (conversation memory)',
    ],
    sortOrder: 1,
  },
  {
    phase: 'V2',
    title: 'Personalisation – Adaptive Learning Paths',
    summary:
      'Introduce learner profiles, progress tracking over time, and adaptive scenario recommendations based on mastery history.',
    items: [
      'User authentication (JWT / OAuth)',
      'Learner profiles and dashboards',
      'Progress tracking across sessions',
      'Adaptive scenario recommendations',
      'Spaced repetition for weak concepts',
      'Learning path visualisation',
      'Peer comparison (anonymised)',
    ],
    sortOrder: 2,
  },
  {
    phase: 'V3',
    title: 'Scale – Collaboration & Deployment',
    summary:
      'Production hardening, collaborative features, and deployment to cloud infrastructure.',
    items: [
      'PostgreSQL migration for production',
      'Docker containerisation',
      'CI/CD pipeline (GitHub Actions)',
      'Real-time collaboration (WebSockets)',
      'Scenario creation by educators',
      'Export/import learning portfolios',
      'API rate limiting and security hardening',
      'Performance monitoring and logging',
    ],
    sortOrder: 3,
  },
];

// ---------------------------------------------------------------------------
// Seed execution
// ---------------------------------------------------------------------------

async function main() {
  console.log('[Seed] Clearing existing data...');

  // Delete in dependency order
  await prisma.session.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.roadmapPhase.deleteMany();

  console.log('[Seed] Inserting 8 scenarios...');
  for (const s of scenarios) {
    await prisma.scenario.create({
      data: {
        title: s.title,
        difficulty: s.difficulty,
        concepts: JSON.stringify(s.concepts),
        context: s.context,
        prompt: s.prompt,
        objectives: JSON.stringify(s.objectives),
      },
    });
  }

  console.log('[Seed] Inserting 4 roadmap phases...');
  for (const p of roadmapPhases) {
    await prisma.roadmapPhase.create({
      data: {
        phase: p.phase,
        title: p.title,
        summary: p.summary,
        items: JSON.stringify(p.items),
        sortOrder: p.sortOrder,
      },
    });
  }

  console.log('[Seed] Initializing AnalyticsTotal...');
  await prisma.analyticsTotal.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      scenarioCount: scenarios.length,
      sessionCount: 0,
      averagePromptScore: 0,
      conceptCounts: "{}",
    },
  });

  console.log('[Seed] ✅ Database seeded successfully!');
  console.log(`       → ${scenarios.length} scenarios`);
  console.log(`       → ${roadmapPhases.length} roadmap phases`);
}

main()
  .catch((e) => {
    console.error('[Seed] ❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
