const prisma = require('../prisma');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parsePhase(row) {
  if (!row) return null;
  return {
    ...row,
    items: JSON.parse(row.items),
  };
}

function serializePhase(data) {
  const out = { ...data };
  if (Array.isArray(out.items)) {
    out.items = JSON.stringify(out.items);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Repository methods
// ---------------------------------------------------------------------------

/**
 * Retrieve all roadmap phases ordered by sortOrder.
 */
async function findAll() {
  const rows = await prisma.roadmapPhase.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map(parsePhase);
}

/**
 * Bulk-create roadmap phases.
 * Prisma's createMany on SQLite doesn't return records, so we insert one-by-one.
 * @param {Array} phases
 */
async function createMany(phases) {
  const results = [];
  for (const phase of phases) {
    const row = await prisma.roadmapPhase.create({
      data: serializePhase(phase),
    });
    results.push(parsePhase(row));
  }
  return results;
}

module.exports = { findAll, createMany };
