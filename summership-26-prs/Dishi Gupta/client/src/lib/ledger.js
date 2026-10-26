// Learner Ledger derivation engine.
// Derives the ledger entries on demand from completed case file IDs and case data.
// Pure functions only — never drifts out of sync with progress.

export const CANONICAL_CONCEPTS = {
  'rosewood-part-0': {
    title: 'The Case Opens',
    conceptName: 'Lists & logic tracking',
    explanation: 'Lists store clues and suspect names in order as facts are gathered.'
  },
  'rosewood-part-1': {
    title: 'The Messy Notes',
    conceptName: 'String parsing',
    explanation: 'Split messy text notes at key marks to separate speaker names from facts.'
  },
  'rosewood-part-2': {
    title: 'What Happened When',
    conceptName: 'Datetimes & sorting',
    explanation: 'Convert mixed time formats into standard stamps so events can be sorted accurately.'
  },
  'rosewood-part-3': {
    title: "Stories That Don't Match",
    conceptName: 'Sets & set difference',
    explanation: 'Use sets to find differences between suspect claims and confirmed witness spottings.'
  },
  'rosewood-part-4': {
    title: 'Narrowing It Down',
    conceptName: 'Recursion & backtracking',
    explanation: 'Try one suspect arrangement step by step and undo steps that break clues.'
  },
  'rosewood-part-5': {
    title: 'The Reveal',
    conceptName: 'Constraint satisfaction & proof',
    explanation: 'Combine all verified constraints together to single out the only possible culprit.'
  }
};

export function formatLoggedTime(isoString) {
  if (!isoString) return 'Logged';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Logged';
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch (e) {
    return 'Logged';
  }
}

/**
 * Pure function: computeLedger
 * Given completed file IDs and case data, returns an ordered array of ledger entries.
 *
 * @param {Array<string>} completedFileIds - Array of completed case file IDs
 * @param {Array<Object>} caseData - Array of scenario/case file objects
 * @param {Object} [options] - Optional options such as timestamps map { [fileId]: isoString }
 * @returns {Array<Object>} Ordered array of ledger entries
 */
export function computeLedger(completedFileIds, caseData, options = {}) {
  if (!Array.isArray(completedFileIds) || completedFileIds.length === 0) {
    return [];
  }
  if (!Array.isArray(caseData) || caseData.length === 0) {
    return [];
  }

  const timestamps = (options && typeof options.timestamps === 'object' && options.timestamps) || {};

  // Deduplicate completed IDs defensively
  const completedSet = new Set(
    completedFileIds.filter((id) => typeof id === 'string' && id.trim().length > 0)
  );

  // Preserve story order according to caseData
  const entries = [];
  for (const scenario of caseData) {
    if (!scenario || typeof scenario !== 'object') continue;
    const partId = scenario._id;
    if (!partId || !completedSet.has(partId)) continue;

    const canonical = CANONICAL_CONCEPTS[partId] || {};
    const title = scenario.partLabel || canonical.title || scenario.title?.replace(/^Rosewood Manor:\s*/, '') || partId;
    const conceptName = scenario.conceptName || canonical.conceptName || (Array.isArray(scenario.concepts) && scenario.concepts[0]) || 'Python deduction';
    const explanation = scenario.conceptExplanation || canonical.explanation || scenario.conceptSummary || 'Apply coding logic step by step to uncover case facts cleanly.';

    const rawTime = timestamps[partId] || scenario.completedAt || options.defaultTime || null;
    const loggedAt = rawTime ? String(rawTime) : new Date().toISOString();
    const formattedTime = formatLoggedTime(loggedAt);

    entries.push({
      id: partId,
      fileId: partId,
      title,
      conceptName,
      concepts: [conceptName],
      explanation,
      loggedAt,
      formattedTime,
      order: typeof scenario.order === 'number' ? scenario.order : entries.length
    });
  }

  return entries;
}
