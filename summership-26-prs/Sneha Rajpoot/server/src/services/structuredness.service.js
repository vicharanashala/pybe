const { structurednessEngine } = require('./structurednessEngine');

function analyzeStructuredness(input) {
  const result = structurednessEngine.analyze(input);
  const dimensions = {
    goalClarity: result.dimensions.goalClarity,
    ambiguity: result.dimensions.ambiguity,
    solutionSpace: result.dimensions.solutionSpace,
    competingConstraints: result.dimensions.competingConstraints,
  };
  return { ...result, dimensions, structuredness: result.baselineScore };
}

module.exports = { analyzeStructuredness };