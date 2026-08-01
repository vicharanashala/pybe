const express = require('express');
const store = require('../data/store');

const router = express.Router();

const conceptGraph = {
  'variables and arithmetic expressions': { prerequisites: [], category: 'basics' },
  'for / while loops': { prerequisites: ['variables and arithmetic expressions'], category: 'control flow' },
  'if / elif / else': { prerequisites: ['variables and arithmetic expressions'], category: 'control flow' },
  'lists and dictionaries': { prerequisites: ['variables and arithmetic expressions'], category: 'data structures' },
  'functions': { prerequisites: ['variables and arithmetic expressions', 'if / elif / else'], category: 'organization' },
  'comparisons and list comprehensions': { prerequisites: ['for / while loops', 'lists and dictionaries'], category: 'advanced' },
  'try / except': { prerequisites: ['functions'], category: 'error handling' },
  'map and comprehensions': { prerequisites: ['for / while loops', 'lists and dictionaries'], category: 'advanced' },
  'accumulator pattern': { prerequisites: ['for / while loops', 'variables and arithmetic expressions'], category: 'patterns' },
  'break / continue': { prerequisites: ['for / while loops'], category: 'control flow' },
  'enumerate / range': { prerequisites: ['for / while loops'], category: 'iteration' },
};

const categoryColors = {
  'basics': '#4ade80',
  'control flow': '#facc15',
  'data structures': '#60a5fa',
  'organization': '#c084fc',
  'advanced': '#f87171',
  'error handling': '#fb923c',
  'patterns': '#34d399',
  'iteration': '#a78bfa',
};

router.get('/', async (_req, res, next) => {
  try {
    const sessions = await store.listSessions();
    const db = await store.readDb();

    const perConceptStats = {};
    sessions.forEach(session => {
      (session.abstractionMap || []).forEach(m => {
        if (!perConceptStats[m.pythonConcept]) perConceptStats[m.pythonConcept] = { sessions: 0, totalScore: 0 };
        perConceptStats[m.pythonConcept].sessions += 1;
        perConceptStats[m.pythonConcept].totalScore += session.promptScore || 0;
      });
    });
    const conceptMastery = {};
    Object.entries(perConceptStats).forEach(([concept, stats]) => {
      const avg = stats.sessions > 0 ? Math.round(stats.totalScore / stats.sessions) : 0;
      conceptMastery[concept] = { sessions: stats.sessions, avgPromptScore: avg, level: avg >= 75 ? 'mastered' : avg >= 50 ? 'developing' : 'needs_work' };
    });

    const nodes = Object.entries(conceptGraph).map(([name, meta]) => ({
      id: name,
      label: name,
      category: meta.category,
      color: categoryColors[meta.category] || '#999',
      mastery: conceptMastery[name] || { sessions: 0, avgPromptScore: 0, level: 'not_started' },
      prerequisites: meta.prerequisites,
      dependents: Object.entries(conceptGraph)
        .filter(([, m]) => m.prerequisites.includes(name))
        .map(([n]) => n),
      locked: meta.prerequisites.some(p => {
        const pm = conceptMastery[p];
        return !pm || pm.level === 'needs_work';
      }),
      recommended: !conceptMastery[name] &&
        meta.prerequisites.every(p => {
          const pm = conceptMastery[p];
          return pm && pm.level !== 'needs_work';
        })
    }));

    const edges = [];
    Object.entries(conceptGraph).forEach(([name, meta]) => {
      meta.prerequisites.forEach(prereq => {
        edges.push({ from: prereq, to: name });
      });
    });

    const nextSteps = nodes
      .filter(n => n.recommended || (!n.locked && n.mastery.level !== 'mastered'))
      .slice(0, 3)
      .map(n => n.label);

    res.json({ nodes, edges, nextSteps, categories: categoryColors });
  } catch (error) {
    next(error);
  }
});

module.exports = router;