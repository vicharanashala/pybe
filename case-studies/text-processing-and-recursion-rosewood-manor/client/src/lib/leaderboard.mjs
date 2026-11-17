export const SUSPECTS = [
  { id: 'mina', name: 'Mina Rosewood', role: 'niece and ward', motiveStrength: 4, motive: 'A threatened allowance.' },
  { id: 'dev', name: 'Dev Ashcombe', role: 'business partner', motiveStrength: 5, motive: 'A ruined deal.' },
  { id: 'iris', name: 'Iris Vale', role: 'private secretary', motiveStrength: 3, motive: 'A secret Alden held.' },
  { id: 'ronan', name: 'Ronan Rosewood', role: 'estranged son', motiveStrength: 4, motive: 'A lost inheritance.' },
  { id: 'pia', name: 'Pia Rosewood', role: 'wife', motiveStrength: 5, motive: 'A threatened divorce.' }
];

export const DEFAULT_SCORES = { mina: 58, dev: 72, iris: 43, ronan: 64, pia: 68 };

export function isSuspectRevealed(id, progress = {}) {
  return (progress.revealedSuspectIds || []).includes(id);
}

export function computeBoard(events = [], completedSlideIds = [], currentSlideIndex = Number.POSITIVE_INFINITY, revealedSuspectIds) {
  const completed = new Set(completedSlideIds);
  const scores = { ...DEFAULT_SCORES };
  const reasons = {};
  const trends = {};
  const cleared = new Set();
  const clueIds = {};
  const clueLabels = {};

  // "As of this slide" includes events on the visible slide and earlier
  // completed slides, while excluding future events when the learner goes back.
  const visibleEvents = [...events]
    .filter((event) => event.slideIndex <= currentSlideIndex && completed.has(event.slideId))
    .sort((a, b) => a.slideIndex - b.slideIndex)
  visibleEvents.forEach((event) => {
      (event.effects || []).forEach((effect) => {
        if (!(effect.suspectId in scores)) return;
        scores[effect.suspectId] += effect.delta || 0;
        trends[effect.suspectId] = effect.delta > 0 ? 'up' : effect.delta < 0 ? 'down' : 'steady';
        reasons[effect.suspectId] = effect.reason;
        clueIds[effect.suspectId] = [...new Set([...(clueIds[effect.suspectId] || []), event.id])];
        clueLabels[event.id] = { id: event.id, label: event.label, text: event.clueText || event.label, connectsTo: event.connectsTo || [] };
        if (effect.cleared) cleared.add(effect.suspectId);
      });
    });

  const revealed = new Set(revealedSuspectIds === undefined ? SUSPECTS.map((suspect) => suspect.id) : revealedSuspectIds);
  if (!visibleEvents.length) return { started: false, revealed: SUSPECTS.filter((suspect) => revealed.has(suspect.id)), suspects: SUSPECTS.filter((suspect) => revealed.has(suspect.id)), active: [], cleared: [], scores: {}, winner: null };

  const active = SUSPECTS
    .filter((suspect) => revealed.has(suspect.id) && !cleared.has(suspect.id))
    .map((suspect) => ({ ...suspect, score: Math.max(0, Math.min(100, scores[suspect.id])), trend: trends[suspect.id] || 'steady', reason: reasons[suspect.id] || 'Motive is still being tested.' }))
    .sort((a, b) => b.score - a.score || b.motiveStrength - a.motiveStrength || a.name.localeCompare(b.name))
    .map((suspect, index) => ({ ...suspect, rank: index + 1, clueIds: clueIds[suspect.id] || [] }));

  return {
    started: true,
    revealed: SUSPECTS.filter((suspect) => revealed.has(suspect.id)),
    suspects: SUSPECTS.filter((suspect) => revealed.has(suspect.id)),
    active,
    cleared: SUSPECTS.filter((suspect) => revealed.has(suspect.id) && cleared.has(suspect.id)).map((suspect) => ({ ...suspect, reason: reasons[suspect.id] || 'The clues cleared this suspect.', clueIds: clueIds[suspect.id] || [] })),
    scores,
    clues: Object.values(clueLabels),
    winner: active.length === 1 ? active[0].name : null
  };
}

export function scoreHistory(events) {
  const completed = [];
  return events.map((event) => {
    completed.push(event.slideId);
    return { eventId: event.id, label: event.label, board: computeBoard(events, completed, event.slideIndex) };
  });
}
