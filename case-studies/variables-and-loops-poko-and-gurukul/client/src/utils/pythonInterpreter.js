/**
 * Helper utility to parse Python variable assignments and statements
 * for PyBe's Live Python Memory View.
 */

export function parsePythonLine(line, existingVariables = {}) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  // 1. Check for comparison operator mistake: e.g. fruit == "Apple"
  if (trimmed.includes('==')) {
    const parts = trimmed.split('==').map((s) => s.trim());
    const varNameCandidate = parts[0];
    return {
      type: 'ERROR_COMPARISON',
      varName: varNameCandidate,
      rawCode: trimmed,
      message: 'You used a comparison operator (==) instead of an assignment operator (=).',
      errorTitle: '❌ Nothing was stored.',
    };
  }

  // 2. Check for assignment operator: e.g. var_name = value
  if (trimmed.includes('=')) {
    const equalIdx = trimmed.indexOf('=');
    const varNameRaw = trimmed.slice(0, equalIdx).trim();
    const valRaw = trimmed.slice(equalIdx + 1).trim();

    // Check invalid variable name starting with digit: e.g. 2apple
    if (/^\d/.test(varNameRaw)) {
      return {
        type: 'ERROR_INVALID_NAME',
        varName: varNameRaw,
        rawCode: trimmed,
        message: 'Poko cannot write this label because variable names cannot start with a number.',
        errorTitle: '🚫 Broken Wooden Box',
      };
    }

    // Check invalid variable name with invalid characters
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varNameRaw)) {
      return {
        type: 'ERROR_INVALID_NAME',
        varName: varNameRaw,
        rawCode: trimmed,
        message: 'Poko cannot write this label because it contains invalid characters. Use letters, numbers, and underscores.',
        errorTitle: '🚫 Broken Wooden Box',
      };
    }

    // Determine type and parsed value
    let parsedValue = valRaw;
    let dataType = 'string';
    let displayCategory = 'scroll'; // 'scroll' | 'number_block' | 'water_bottle' | 'forest_gate'

    // String check
    if ((valRaw.startsWith('"') && valRaw.endsWith('"')) || (valRaw.startsWith("'") && valRaw.endsWith("'"))) {
      parsedValue = valRaw.slice(1, -1);
      dataType = 'string';
      displayCategory = 'scroll';
    } 
    // Boolean check
    else if (valRaw === 'True' || valRaw === 'False') {
      parsedValue = valRaw === 'True';
      dataType = 'boolean';
      displayCategory = 'forest_gate';
    }
    // Float check
    else if (!isNaN(Number(valRaw)) && valRaw.includes('.')) {
      parsedValue = Number(valRaw);
      dataType = 'float';
      displayCategory = 'water_bottle';
    }
    // Integer check
    else if (!isNaN(Number(valRaw))) {
      parsedValue = Number(valRaw);
      dataType = 'integer';
      displayCategory = 'number_block';
    }
    // Variable reference or arithmetic expression check
    else if (existingVariables[valRaw]) {
      parsedValue = existingVariables[valRaw].value;
      dataType = existingVariables[valRaw].dataType;
      displayCategory = existingVariables[valRaw].displayCategory;
    }

    // Detect food item emoji if string matches known food names
    let foodEmoji = null;
    const lowerVal = String(parsedValue).toLowerCase();
    if (lowerVal.includes('apple')) foodEmoji = '🍎';
    else if (lowerVal.includes('honey')) foodEmoji = '🍯';
    else if (lowerVal.includes('corn')) foodEmoji = '🌽';
    else if (lowerVal.includes('carrot')) foodEmoji = '🥕';
    else if (lowerVal.includes('berr')) foodEmoji = '🍓';
    else if (lowerVal.includes('nut')) foodEmoji = '🥜';

    return {
      type: 'ASSIGNMENT',
      varName: varNameRaw,
      value: parsedValue,
      rawVal: valRaw,
      dataType,
      displayCategory,
      foodEmoji,
      rawCode: trimmed,
    };
  }

  // 3. Print statement or execution
  if (trimmed.startsWith('print(')) {
    return {
      type: 'PRINT',
      rawCode: trimmed,
    };
  }

  return null;
}

export function parsePythonCodeToMemory(codeStr, initialVars = {}) {
  const lines = codeStr.split('\n');
  const memoryMap = { ...initialVars };
  const logs = [];
  const errors = [];

  for (let line of lines) {
    const res = parsePythonLine(line, memoryMap);
    if (!res) continue;

    if (res.type === 'ERROR_COMPARISON' || res.type === 'ERROR_INVALID_NAME') {
      errors.push(res);
    } else if (res.type === 'ASSIGNMENT') {
      const isExisting = Boolean(memoryMap[res.varName]);
      const oldValue = isExisting ? memoryMap[res.varName].value : undefined;

      memoryMap[res.varName] = {
        name: res.varName,
        value: res.value,
        rawVal: res.rawVal,
        dataType: res.dataType,
        displayCategory: res.displayCategory,
        foodEmoji: res.foodEmoji,
        isNew: !isExisting,
        isUpdated: isExisting && oldValue !== res.value,
        oldValue: oldValue,
        updatedAt: Date.now(),
      };

      logs.push({
        action: isExisting ? 'UPDATE' : 'CREATE',
        varName: res.varName,
        value: res.value,
        oldValue: oldValue,
      });
    }
  }

  return { memoryMap, logs, errors };
}
