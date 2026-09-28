// server/src/services/nlpToPython.js
const natural = require('natural');

class NLPToPythonConverter {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
  }

  parseReasoning(reasoning, context = '') {
    const detected = {
      concepts: [],
      code: '',
      explanation: '',
      variables: [],
      operations: []
    };

    // Detect concepts
    detected.concepts = this.detectConcepts(reasoning);
    
    // Generate code based on reasoning
    detected.code = this.generatePythonCode(reasoning, context, detected.concepts);
    detected.explanation = this.generateExplanation(reasoning, detected.concepts);
    
    return detected;
  }

  detectConcepts(reasoning) {
    const concepts = [];
    const lower = reasoning.toLowerCase();
    
    if (/store|remember|keep|save|assign|set|variable/.test(lower)) {
      concepts.push('variables');
    }
    if (/if|check|decide|when|whether|else|condition/.test(lower)) {
      concepts.push('conditionals');
    }
    if (/repeat|each|every|for|while|iterate|loop/.test(lower)) {
      concepts.push('loops');
    }
    if (/list|collection|group|array|multiple|items/.test(lower)) {
      concepts.push('lists');
    }
    if (/function|helper|reusable|def|return/.test(lower)) {
      concepts.push('functions');
    }
    if (/compare|greater|less|equal|than|comparison/.test(lower)) {
      concepts.push('comparisons');
    }
    
    return [...new Set(concepts)];
  }

  generatePythonCode(reasoning, context, concepts) {
    const lower = reasoning.toLowerCase();
    let code = [];
    
    // Add header with context
    if (context) {
      code.push(`# Context: ${context}`);
    }
    code.push(`# Reasoning: ${reasoning}`);
    code.push('');
    
    // Check for conditional reasoning
    if (lower.includes('if') || lower.includes('when') || lower.includes('check')) {
      code.push(this.generateConditionalCode(reasoning));
    }
    // Check for variable assignment
    else if (lower.includes('store') || lower.includes('remember') || lower.includes('save')) {
      code.push(this.generateVariableCode(reasoning));
    }
    // Check for loop
    else if (lower.includes('each') || lower.includes('every') || lower.includes('repeat')) {
      code.push(this.generateLoopCode(reasoning));
    }
    // Check for function
    else if (lower.includes('function') || lower.includes('helper') || lower.includes('reusable')) {
      code.push(this.generateFunctionCode(reasoning));
    }
    // Generic fallback with better intelligence
    else {
      code.push(this.generateSmartCode(reasoning));
    }
    
    // Add main execution block
    code.push('');
    code.push('# Main execution');
    code.push('if __name__ == "__main__":');
    
    // Add appropriate main block based on concepts
    if (concepts.includes('conditionals')) {
      code.push('    # Test the conditional logic');
      code.push('    print("Testing conditional logic...")');
      code.push('    test_condition = True');
      code.push('    result = solve(test_condition)');
      code.push('    print(f"Result: {result}")');
    } else if (concepts.includes('variables')) {
      code.push('    # Display stored variables');
      code.push('    print("Variables are ready to use!")');
    } else if (concepts.includes('loops')) {
      code.push('    # Run the loop');
      code.push('    print("Processing items...")');
    } else {
      code.push('    print("Ready to solve!")');
    }
    
    return code.join('\n');
  }

  generateConditionalCode(reasoning) {
    const lower = reasoning.toLowerCase();
    let code = [];
    
    // Extract condition and actions
    let condition = 'condition';
    let trueAction = 'do_something';
    let falseAction = 'do_something_else';
    
    // Try to extract condition
    const ifMatch = reasoning.match(/if\s+([^.,]+)/i);
    if (ifMatch) {
      condition = ifMatch[1].trim();
    }
    
    // Try to extract actions
    const actionMatch = reasoning.match(/should\s+([^.]+)/i);
    if (actionMatch) {
      trueAction = actionMatch[1].trim();
    }
    
    // Check for "otherwise" or "else"
    const elseMatch = reasoning.match(/otherwise\s+([^.]+)/i) || reasoning.match(/else\s+([^.]+)/i);
    if (elseMatch) {
      falseAction = elseMatch[1].trim();
    }
    
    // Clean up variable names for Python
    const cleanCondition = condition.toLowerCase().replace(/\s+/g, '_');
    const cleanTrueAction = trueAction.toLowerCase().replace(/\s+/g, '_');
    const cleanFalseAction = falseAction.toLowerCase().replace(/\s+/g, '_');
    
    code.push('def solve(condition):');
    code.push(`    """Check condition and return appropriate action"""`);
    code.push(`    if condition:`);
    code.push(`        # ${trueAction}`);
    code.push(`        return "${trueAction}"`);
    code.push(`    else:`);
    code.push(`        # ${falseAction}`);
    code.push(`        return "${falseAction}"`);
    
    return code.join('\n');
  }

  generateVariableCode(reasoning) {
    const code = [];
    
    // Extract variable name and value
    let varName = 'value';
    let varValue = '0';
    
    const storeMatch = reasoning.match(/store\s+(?:the\s+)?(\w+(?:\s+\w+)?)\s+(?:as|in|to)\s+(\w+)/i);
    if (storeMatch) {
      varName = storeMatch[2];
      varValue = `"${storeMatch[1]}"`;
    }
    
    // Try to infer sensible default
    const lower = reasoning.toLowerCase();
    if (lower.includes('weight')) varValue = '5';
    else if (lower.includes('score')) varValue = '85';
    else if (lower.includes('price')) varValue = '10.99';
    else if (lower.includes('name')) varValue = '"John"';
    else if (lower.includes('count')) varValue = '10';
    else if (lower.includes('temperature')) varValue = '25';
    
    code.push('def solve():');
    code.push(`    """Store and return the ${varName} value"""`);
    code.push(`    ${varName} = ${varValue}  # Store the value`);
    code.push(`    print(f"${varName}: {${varName}}")`);
    code.push(`    return ${varName}`);
    
    return code.join('\n');
  }

  generateLoopCode(reasoning) {
    const code = [];
    
    // Extract collection and item
    let collection = 'items';
    let item = 'item';
    
    const loopMatch = reasoning.match(/(?:for|each)\s+(?:each\s+)?(\w+)\s+in\s+(\w+)/i);
    if (loopMatch) {
      item = loopMatch[1];
      collection = loopMatch[2];
    }
    
    code.push('def solve():');
    code.push(`    """Process each ${item} in ${collection}"""`);
    code.push(`    ${collection} = ["item1", "item2", "item3"]  # Example data`);
    code.push(`    for ${item} in ${collection}:`);
    code.push(`        print(f"Processing: {${item}}")`);
    code.push(`    return "Done"`);
    
    return code.join('\n');
  }

  generateFunctionCode(reasoning) {
    const code = [];
    
    let funcName = 'my_function';
    let param = 'param';
    
    const funcMatch = reasoning.match(/(?:function|helper|def)\s+(\w+)/i);
    if (funcMatch) {
      funcName = funcMatch[1];
    }
    
    const paramMatch = reasoning.match(/takes\s+(\w+)/i);
    if (paramMatch) {
      param = paramMatch[1];
    }
    
    code.push(`def ${funcName}(${param}):`);
    code.push(`    """${funcName} function"""`);
    code.push(`    result = ${param}  # TODO: Add your logic`);
    code.push(`    return result`);
    
    return code.join('\n');
  }

  generateSmartCode(reasoning) {
    const code = [];
    const lower = reasoning.toLowerCase();
    
    // Try to detect what the reasoning wants
    if (lower.includes('decide') || lower.includes('choice') || lower.includes('rule')) {
      code.push('def solve(condition):');
      code.push('    """Make a decision based on the condition"""');
      code.push('    if condition:');
      code.push('        return "Choice A"');
      code.push('    else:');
      code.push('        return "Choice B"');
    } else if (lower.includes('calculate') || lower.includes('compute') || lower.includes('find')) {
      code.push('def solve(value):');
      code.push('    """Calculate based on the input"""');
      code.push('    result = value * 2  # Example calculation');
      code.push('    return result');
    } else {
      code.push('def solve():');
      code.push('    """Solve the problem based on reasoning"""');
      code.push(`    # Based on: "${reasoning}"`);
      code.push('    # TODO: Implement your solution');
      code.push('    return "Solution not implemented"');
    }
    
    return code.join('\n');
  }

  generateExplanation(reasoning, concepts) {
    if (concepts.length === 0) {
      return 'I analyzed your reasoning but couldn\'t identify specific programming concepts. Try using words like: if, store, for each, function, etc.';
    }
    
    const explanations = [];
    if (concepts.includes('conditionals')) {
      explanations.push('I detected a conditional decision (if/else) in your reasoning');
    }
    if (concepts.includes('variables')) {
      explanations.push('I detected variable storage in your reasoning');
    }
    if (concepts.includes('loops')) {
      explanations.push('I detected repetition (loops) in your reasoning');
    }
    if (concepts.includes('functions')) {
      explanations.push('I detected a reusable function in your reasoning');
    }
    if (concepts.includes('lists')) {
      explanations.push('I detected a collection/list in your reasoning');
    }
    if (concepts.includes('comparisons')) {
      explanations.push('I detected comparisons in your reasoning');
    }
    
    return `Based on your reasoning, I identified: ${concepts.join(', ')}. ${explanations.join(' ')}. The generated code provides a starting point for your solution.`;
  }

  extractConcepts(reasoning) {
    return this.detectConcepts(reasoning);
  }

  validateCode(code) {
    const errors = [];
    const warnings = [];

    try {
      // Check for basic Python syntax
      const lines = code.split('\n');
      let indentLevel = 0;
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        // Check for unbalanced parentheses
        const openParens = (trimmed.match(/\(/g) || []).length;
        const closeParens = (trimmed.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
          errors.push(`Line ${index + 1}: Unbalanced parentheses`);
        }
        
        // Check for colons after control statements
        if (/^(if|for|while|def|class|elif|else|except|finally|try|with)\b/.test(trimmed)) {
          if (!trimmed.endsWith(':')) {
            errors.push(`Line ${index + 1}: Missing colon (:) after '${trimmed.split(' ')[0]}'`);
          }
        }
      });

    } catch (error) {
      errors.push('Syntax validation error');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      warnings: warnings
    };
  }
}

module.exports = new NLPToPythonConverter();