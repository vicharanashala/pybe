const AGE_GROUPS = Object.freeze(['8-11', '12-15', '16+']);
const DEFAULT_AGE_GROUP = '12-15';

const AUDIENCE_GUIDANCE = Object.freeze({
  '8-11': 'For ages 8-11, use short concrete sentences and a warm, playful original magical-school setting with original characters such as young apprentices and friendly mentors. Do not use or reference existing books, franchises, characters, houses, spells, or distinctive settings. Keep the Python challenge tangible and explainable using only the current lesson concept.',
  '12-15': 'For ages 12-15, use a respectful teen voice and relatable school, hobby, or community settings. Frame an authentic problem with at least two reasonable choices, age-appropriate trade-offs, and a prompt to justify and reflect. Give characters agency without talking down to the learner. Keep Python ideas within the current lesson concept.',
  '16+': 'For ages 16+, use authentic, ill-structured problems informed by constructivist problem-based learning: multiple defensible solutions, real stakeholder needs, trade-offs, assumptions, consequences, and reflection. Use an adult voice and avoid prescribing one perfect answer. Do not require Python concepts beyond the current lesson.',
});

function normalizeAgeGroup(value) {
  return AGE_GROUPS.includes(value) ? value : null;
}

function getAudienceGuidance(value) {
  const ageGroup = normalizeAgeGroup(value) || DEFAULT_AGE_GROUP;
  return AUDIENCE_GUIDANCE[ageGroup];
}

module.exports = { AGE_GROUPS, AUDIENCE_GUIDANCE, DEFAULT_AGE_GROUP, getAudienceGuidance, normalizeAgeGroup };