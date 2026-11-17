const prisma = require('../prisma');

// Helper
function mapSession(row) {
  if (!row) return row;
  try { row.abstractionMap = JSON.parse(row.abstractionMap); } catch (e) { row.abstractionMap = {}; }
  try { row.promptFeedback = JSON.parse(row.promptFeedback); } catch (e) { row.promptFeedback = []; }
  try { row.misconceptions = JSON.parse(row.misconceptions); } catch (e) { row.misconceptions = []; }
  try { row.masterySignals = JSON.parse(row.masterySignals); } catch (e) { row.masterySignals = []; }
  
  if (row.scenario) {
    try { row.scenario.concepts = JSON.parse(row.scenario.concepts); } catch (e) {}
    try { row.scenario.objectives = JSON.parse(row.scenario.objectives); } catch (e) {}
  }
  return row;
}

/**
 * Retrieve active sessions using cursor-based pagination for scalability, 
 * optionally including their parent scenario.
 */
async function findAll(includeScenario = false, pagination = {}) {
  const limit = Math.min(100, Math.max(1, parseInt(pagination.limit, 10) || 50));
  
  const query = {
    where: { deletedAt: null },
    take: limit,
    orderBy: { id: 'desc' }, // Cursor pagination requires deterministic ordering
    include: includeScenario ? { scenario: true } : undefined,
  };

  if (pagination.cursor) {
    query.cursor = { id: pagination.cursor };
    query.skip = 1; // Skip the cursor itself
  }

  const [rows, total] = await Promise.all([
    prisma.session.findMany(query),
    prisma.session.count({ where: { deletedAt: null } }),
  ]);

  const nextCursor = rows.length === limit ? rows[limit - 1].id : null;

  return { data: rows.map(mapSession), total, nextCursor, limit };
}

/**
 * Create a new session.
 */
async function create(data) {
  const row = await prisma.session.create({
    data: {
      ...data,
      abstractionMap: JSON.stringify(data.abstractionMap || {}),
      promptFeedback: JSON.stringify(data.promptFeedback || []),
      misconceptions: JSON.stringify(data.misconceptions || []),
      masterySignals: JSON.stringify(data.masterySignals || []),
    },
    include: { scenario: true },
  });
  return mapSession(row);
}

module.exports = { findAll, create };
