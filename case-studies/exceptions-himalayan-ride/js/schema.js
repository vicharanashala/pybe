/* ==========================================================================
   SCHEMA VALIDATOR — The High Pass v3
   In-browser and Node.js validation of SCENES_DATA
   ========================================================================== */

function validateScenesData(data) {
  const errors = [];
  if (!Array.isArray(data) || data.length !== 12) {
    errors.push(`Expected exactly 12 scenes, got ${data ? data.length : 0}`);
    return { valid: false, errors };
  }

  let prevVerb = null;
  data.forEach((scene, idx) => {
    const num = idx + 1;
    if (scene.id !== num) errors.push(`Scene ${num}: id must be ${num}`);
    if (!scene.place) errors.push(`Scene ${num}: place is missing`);
    if (typeof scene.altFt !== 'number') errors.push(`Scene ${num}: altFt must be a number`);
    if (!scene.photo) errors.push(`Scene ${num}: photo is missing`);
    if (!scene.verb) errors.push(`Scene ${num}: verb is missing`);
    
    // Check consecutive verbs
    if (scene.verb === prevVerb) {
      errors.push(`Scene ${num}: consecutive duplicate verb '${scene.verb}' with scene ${num - 1}`);
    }
    prevVerb = scene.verb;

    // Word counts
    if (scene.narration) {
      const words = scene.narration.trim().split(/\s+/).length;
      if (words > 12) {
        errors.push(`Scene ${num}: narration has ${words} words (max allowed: 12)`);
      }
    } else {
      errors.push(`Scene ${num}: narration is missing`);
    }

    if (scene.radio) {
      const radioWords = scene.radio.text.trim().split(/\s+/).length;
      if (radioWords > 10) {
        errors.push(`Scene ${num}: radio text has ${radioWords} words (max allowed: 10)`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

if (typeof window !== 'undefined') {
  window.validateScenesData = validateScenesData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateScenesData };
}
