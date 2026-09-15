const REQUIRED_SECTIONS = [
  'UNDERSTOOD:',
  'GAP:',
  'PYTHON CONNECTION:',
  'HISTORY CONNECTION:',
  'LEARNER PROFILE INSIGHT:',
  'NEXT QUESTION:'
];

function validateMentorResponse(response) {
  if (
    typeof response !== 'string' ||
    !response.trim()
  ) {
    return false;
  }

  return REQUIRED_SECTIONS.every(
    (section) =>
      response.includes(section)
  );
}

module.exports = {
  validateMentorResponse
};