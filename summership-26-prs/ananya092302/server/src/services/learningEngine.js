const conceptRules = [
  {
    primary: ['variable', 'assign'],
    secondary: ['store', 'value', 'remember', 'save', 'name', 'keep'],
    pattern: 'Data storage',
    pythonConcept: 'variables',
    explanation: 'You identified data that needs to be kept in memory, which maps to declaring variables.'
  },
  {
    primary: ['loop', 'iterate', 'for loop', 'while loop'],
    secondary: ['repeat', 'again', 'each', 'every', 'all'],
    pattern: 'Repetition',
    pythonConcept: 'loops',
    explanation: 'Your reasoning repeats an action, which maps naturally to loop constructs.'
  },
  {
    primary: ['if', 'elif', 'else', 'condition', 'conditional'],
    secondary: ['when', 'unless', 'decide', 'choose', 'check', 'otherwise', 'depends'],
    pattern: 'Decision making',
    pythonConcept: 'conditionals',
    explanation: 'You are branching based on a condition, which is exactly what conditional statements express.'
  },
  {
    primary: ['list', 'array', 'sequence'],
    secondary: ['items', 'collection', 'group', 'many', 'multiple'],
    pattern: 'Collection handling',
    pythonConcept: 'lists',
    explanation: 'You grouped multiple pieces of data, so Python lists help store and process them.'
  },
  {
    primary: ['dictionary', 'dict', 'key-value'],
    secondary: ['map', 'key', 'lookup', 'pair', 'associate'],
    pattern: 'Data mapping',
    pythonConcept: 'dictionaries',
    explanation: 'You are associating pieces of data together, which maps perfectly to a Python dictionary.'
  },
  {
    primary: ['arithmetic', 'math', 'calculate', 'multiply', 'divide'],
    secondary: ['total', 'average', 'sum', 'score', 'cost', 'add'],
    pattern: 'Computation',
    pythonConcept: 'arithmetic',
    explanation: 'You are transforming values into a result, so variables and expressions become useful.'
  },
  {
    primary: ['function', 'def', 'routine'],
    secondary: ['step', 'process', 'recipe', 'reuse', 'helper', 'task'],
    pattern: 'Reusable procedure',
    pythonConcept: 'functions',
    explanation: 'You described a repeatable process, which maps to a Python function.'
  },
  {
    primary: ['compare', 'filter', 'search'],
    secondary: ['match', 'find', 'only', 'specific'],
    pattern: 'Selection and filtering',
    pythonConcept: 'comparisons',
    explanation: 'You are narrowing options using rules, which Python can express with comparisons and filters.'
  },
  {
    primary: ['string', 'text format'],
    secondary: ['text', 'word', 'character', 'letter', 'sentence', 'format', 'message'],
    pattern: 'Text processing',
    pythonConcept: 'strings',
    explanation: 'You are dealing with text data, which requires string operations in Python.'
  },
  {
    primary: ['try', 'except', 'catch', 'error handling'],
    secondary: ['error', 'fail', 'invalid', 'wrong', 'safe'],
    pattern: 'Error handling',
    pythonConcept: 'try/except',
    explanation: 'You are anticipating things going wrong, which is handled gracefully with try/except.'
  }
].map(rule => ({
  ...rule,
  primaryRegex: new RegExp(`\\b(${rule.primary.join('|')})\\b`, 'i'),
  secondaryRegexes: rule.secondary.map(sec => new RegExp(`\\b${sec}\\b`, 'i'))
}));

const misconceptionsDictionary = {
  'loops': {
    regex: /\b(copy|paste|manually|repeat it|write it out)\b/i,
    feedback: 'Watch out for manual repetition. Let the loop do the heavy lifting rather than copying steps.'
  },
  'variables': {
    regex: /\b(write the number|type|hardcode)\b/i,
    feedback: 'Try to store values in names (variables) instead of hardcoding numbers directly.'
  }
};

function mapReasoning(scenario, reasoning = '') {
  const matches = [];
  const expectedConcepts = scenario.concepts || [];

  for (const rule of conceptRules) {
    const hasPrimary = rule.primaryRegex.test(reasoning);
    
    let secondaryCount = 0;
    for (const secRegex of rule.secondaryRegexes) {
      if (secRegex.test(reasoning)) {
        secondaryCount++;
      }
    }

    if (hasPrimary || secondaryCount >= 2) {
      let confidenceScore = hasPrimary ? 70 : 40;
      confidenceScore += secondaryCount * 10;
      
      if (expectedConcepts.includes(rule.pythonConcept)) {
        confidenceScore += 20;
      }
      
      confidenceScore = Math.min(100, confidenceScore);
      
      const expectedText = expectedConcepts.length > 0 ? expectedConcepts.join(" or ") : "simpler concepts";

      matches.push({
        pattern: rule.pattern,
        pythonConcept: rule.pythonConcept,
        explanation: expectedConcepts.includes(rule.pythonConcept) 
          ? rule.explanation 
          : `${rule.explanation} (Note: This might be over-engineering for this specific scenario. You can also try to use ${expectedText}.)`,
        confidence: `${confidenceScore}% confidence`
      });
    }
  }

  matches.sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence));

  return matches.length ? matches : [{
    pattern: 'Sequential thinking',
    pythonConcept: 'variables',
    explanation: 'You described a step-by-step solution. Python starts by representing those steps as statements.',
    confidence: 'Default'
  }];
}

function generateCode(scenario, maps) {
  const concepts = maps.map((item) => item.pythonConcept);
  const cleanTitle = scenario.title ? scenario.title.replace(/"/g, '\\"') : 'Scenario task';
  let code = `# Scenario: ${cleanTitle}\n\n`;

  if (concepts.includes('variables') || concepts.includes('strings') || concepts.includes('arithmetic')) {
      code += `target_value = "sample_data"\n`;
  }
  
  if (concepts.includes('lists')) {
      code += `items = [target_value, "other_data", "more_data"]\n`;
  }
  
  if (concepts.includes('dictionaries')) {
      code += `data_map = {"key1": target_value, "key2": "other_data"}\n`;
  }

  if (concepts.includes('loops')) {
      code += `for item in items:\n    # Process item\n`;
      if (concepts.includes('conditionals')) {
          code += `    if item == target_value:\n        print(f"Found {item}")\n    else:\n        print("Not found")\n`;
      } else {
          code += `    print(item)\n`;
      }
  } else if (concepts.includes('conditionals')) {
      code += `if target_value == "sample_data":\n    print("Condition met")\nelse:\n    print("Condition failed")\n`;
  } else if (!concepts.includes('lists') && !concepts.includes('dictionaries')) {
      code += `print(f"Processed {target_value}")\n`;
  }

  if (concepts.includes('functions')) {
      let lines = code.split('\n');
      lines.pop(); 
      code = `def handle_task():\n    ${lines.join('\n    ')}\n\nhandle_task()\n`;
  }
  
  if (concepts.includes('try/except')) {
      let lines = code.split('\n');
      lines.pop();
      code = `try:\n    ${lines.join('\n    ')}\nexcept Exception as e:\n    print(f"Error occurred: {e}")\n`;
  }

  return code;
}

function explainCode(maps) {
  return `The code starts from your natural reasoning and turns it into Python structure: ${maps.map((map) => `${map.pattern} becomes ${map.pythonConcept}`).join('; ')}.`;
}

function evaluatePrompt(scenario, promptText = '') {
  const feedback = [];
  let score = 20; 
  
  const lengthScore = Math.min(25, Math.floor(promptText.length / 4));
  score += lengthScore;
  if (promptText.length < 40) {
    feedback.push('Add more context about the situation and expected output.');
  }

  if (/\b(step|explain|why|reason|how|approach)\b/i.test(promptText)) {
    score += 20;
  } else {
    feedback.push('Ask the AI to explain its reasoning, not just produce code.');
  }

  const expectedConcepts = scenario.concepts || [];
  let mentionedExpected = false;
  
  for (const concept of expectedConcepts) {
     let searchTerms = [];
     if (concept === 'conditionals') searchTerms = ['if', 'condition'];
     if (concept === 'loops') searchTerms = ['loop', 'for', 'while'];
     if (concept === 'variables') searchTerms = ['variable', 'store'];
     if (concept === 'lists') searchTerms = ['list', 'array'];
     if (concept === 'functions') searchTerms = ['function', 'def'];
     
     if (searchTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(promptText))) {
         mentionedExpected = true;
         break;
     }
  }

  if (mentionedExpected) {
    score += 35;
  } else if (expectedConcepts.length > 0) {
    feedback.push(`Try to name the specific Python concept this scenario needs (e.g. something related to ${expectedConcepts[0]}).`);
  }

  return {
    score: Math.min(score, 100),
    feedback: feedback.length ? feedback : ['Strong prompt: it includes context, reasoning, examples, and the right Python direction.']
  };
}

function detectMisconceptions(scenario, reasoning = '') {
  const misses = [];
  if (/\b(always|never)\b/i.test(reasoning)) misses.push('Watch for absolute rules. Programming logic often needs explicit edge cases.');
  if (reasoning.length < 60) misses.push('Reasoning is brief. Try naming the inputs, decision rule, and expected result.');

  const expectedConcepts = scenario.concepts || [];
  for (const concept of expectedConcepts) {
      const rule = misconceptionsDictionary[concept];
      if (rule && rule.regex.test(reasoning)) {
          misses.push(rule.feedback);
      }
  }

  return misses;
}

function masterySignals(maps, promptScore) {
  const signals = maps.map((map) => `Recognized ${map.pattern.toLowerCase()}`);
  if (promptScore >= 70) signals.push('Prompt maturity is developing');
  return signals;
}

module.exports = { mapReasoning, generateCode, explainCode, evaluatePrompt, detectMisconceptions, masterySignals };
