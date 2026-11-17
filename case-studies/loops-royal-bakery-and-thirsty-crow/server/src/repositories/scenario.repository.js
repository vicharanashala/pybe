const prisma = require('../prisma');

// ---------------------------------------------------------------------------
// Helper: Parse JSON fields for a scenario
// ---------------------------------------------------------------------------
function mapScenario(row) {
  if (!row) return row;
  try {
    row.concepts = JSON.parse(row.concepts);
  } catch (e) {
    row.concepts = [];
  }
  try {
    row.objectives = JSON.parse(row.objectives);
  } catch (e) {
    row.objectives = [];
  }
  if (row.sessions) {
    row.sessions = row.sessions.map(s => {
      try { s.abstractionMap = JSON.parse(s.abstractionMap); } catch (e) { s.abstractionMap = {}; }
      try { s.promptFeedback = JSON.parse(s.promptFeedback); } catch (e) { s.promptFeedback = []; }
      try { s.misconceptions = JSON.parse(s.misconceptions); } catch (e) { s.misconceptions = []; }
      try { s.masterySignals = JSON.parse(s.masterySignals); } catch (e) { s.masterySignals = []; }
      return s;
    });
  }
  return row;
}

/**
 * Retrieve all active scenarios, optionally filtered and paginated.
 * @param {{ q?: string, difficulty?: string, concept?: string, page?: number, limit?: number }} filters
 */
async function findAll(filters = {}) {
  const where = { deletedAt: null };

  if (filters.difficulty) {
    where.difficulty = filters.difficulty;
  }

  // SQLite doesn't support mode: 'insensitive' or array_contains.
  // We use standard string contains.
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { context: { contains: filters.q } },
      { prompt: { contains: filters.q } },
    ];
  }
  if (filters.concept) {
    where.concepts = { contains: filters.concept };
  }

  // Pagination
  const page = Math.max(1, parseInt(filters.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(filters.limit, 10) || 50));
  const offset = (page - 1) * limit;

  const [scenarios, total] = await Promise.all([
    prisma.scenario.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.scenario.count({ where }),
  ]);

  return { data: scenarios.map(mapScenario), total, page, limit };
}

/**
 * Find a single active scenario by ID (includes its active sessions).
 */
async function findById(id) {
  const scenario = await prisma.scenario.findFirst({
    where: { id, deletedAt: null },
    include: { 
      sessions: { 
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' } 
      } 
    },
  });
  
  return mapScenario(scenario);
}

/**
 * Create a new scenario.
 */
async function create(data) {
  const row = await prisma.scenario.create({
    data: {
      ...data,
      concepts: JSON.stringify(data.concepts || []),
      objectives: JSON.stringify(data.objectives || []),
    },
  });
  return mapScenario(row);
}

/**
 * Update an existing active scenario by ID.
 */
async function update(id, data) {
  const updateData = { ...data };
  if (updateData.concepts) updateData.concepts = JSON.stringify(updateData.concepts);
  if (updateData.objectives) updateData.objectives = JSON.stringify(updateData.objectives);

  const row = await prisma.scenario.update({
    where: { id },
    data: updateData,
  });
  return mapScenario(row);
}

/**
 * Soft-delete a scenario by ID.
 */
async function remove(id) {
  await prisma.scenario.update({ 
    where: { id },
    data: { deletedAt: new Date() }
  });
}

module.exports = { findAll, findById, create, update, remove };
