// server/src/routes/nlp.js
const express = require('express');
const store = require('../data/store');
const nlpToPython = require('../services/nlpToPython');

const router = express.Router();

// POST /api/nlp/convert-reasoning - Convert natural language to Python
router.post('/convert-reasoning', async (req, res, next) => {
  try {
    const { reasoning, scenarioId } = req.body;
    
    if (!reasoning) {
      return res.status(400).json({ error: 'Reasoning text is required' });
    }

    const result = nlpToPython.parseReasoning(reasoning);
    
    let scenario = null;
    if (scenarioId) {
      scenario = await store.getScenario(scenarioId);
    }

    if (scenario) {
      result.scenario = {
        title: scenario.title,
        difficulty: scenario.difficulty,
        concepts: scenario.concepts
      };
    }

    res.json({
      success: true,
      reasoning: reasoning,
      concepts: result.concepts || [],
      variables: result.variables || [],
      operations: result.operations || [],
      pythonCode: result.code || '# No code generated',
      explanation: result.explanation || 'Generated code based on your reasoning',
      scenarioId: scenarioId
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/nlp/validate-code - Validate Python code syntax
router.post('/validate-code', async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const validation = nlpToPython.validateCode(code);
    
    res.json({
      success: validation.isValid,
      errors: validation.errors || [],
      warnings: validation.warnings || []
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/nlp/extract-concepts - Extract concepts from reasoning
router.post('/extract-concepts', async (req, res, next) => {
  try {
    const { reasoning } = req.body;
    
    if (!reasoning) {
      return res.status(400).json({ error: 'Reasoning text is required' });
    }

    // Make sure extractConcepts exists
    const concepts = nlpToPython.extractConcepts ? 
      nlpToPython.extractConcepts(reasoning) : 
      nlpToPython.parseReasoning(reasoning).concepts || [];
    
    res.json({
      success: true,
      reasoning: reasoning,
      concepts: concepts
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/nlp/generate-code - Generate Python code with context
router.post('/generate-code', async (req, res, next) => {
  try {
    const { reasoning, scenarioId, context } = req.body;
    
    if (!reasoning) {
      return res.status(400).json({ error: 'Reasoning text is required' });
    }

    const result = nlpToPython.parseReasoning(reasoning);
    
    let scenario = null;
    if (scenarioId) {
      scenario = await store.getScenario(scenarioId);
    }

    let code = result.code || '# No code generated';
    
    if (scenario) {
      code = `# ${scenario.title}\n# Concepts: ${scenario.concepts.join(', ')}\n\n${code}`;
    }

    if (context) {
      code = `# Context: ${context}\n${code}`;
    }

    res.json({
      success: true,
      pythonCode: code,
      explanation: result.explanation || 'Generated code with context',
      concepts: result.concepts || [],
      scenario: scenario ? {
        title: scenario.title,
        difficulty: scenario.difficulty,
        concepts: scenario.concepts
      } : null
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;