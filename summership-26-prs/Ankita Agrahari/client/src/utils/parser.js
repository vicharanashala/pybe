/**
 * Lightweight client-side Python Lexical Parser
 * Translates programming instructions into structured control flow nodes.
 */

export function parsePythonLogic(code) {
  if (!code) return [];
  const lines = code.split('\n');
  const parsedNodes = [];
  
  // Start node
  parsedNodes.push({
    id: 'flow-start',
    type: 'start',
    label: '🟢 Start',
    indent: 0
  });

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue; // Skip comments and empty lines

    const indentMatch = rawLine.match(/^(\s*)/);
    const indent = indentMatch ? Math.floor(indentMatch[1].length / 4) : 0;

    // 1. Function declarations
    if (trimmed.startsWith('def ')) {
      const match = trimmed.match(/def\s+(\w+)\((.*?)\):?/);
      parsedNodes.push({
        id: `node-${i}`,
        type: 'process',
        label: `🛠️ Function: ${match ? match[1] : trimmed}`,
        indent,
        lineNo: i + 1
      });
    }
    // 2. Conditionals (if, elif, else)
    else if (trimmed.startsWith('if ')) {
      const match = trimmed.match(/if\s+(.*):/);
      parsedNodes.push({
        id: `node-${i}`,
        type: 'branch',
        label: `❓ If: ${match ? match[1] : trimmed}`,
        indent,
        lineNo: i + 1
      });
    } else if (trimmed.startsWith('elif ')) {
      const match = trimmed.match(/elif\s+(.*):/);
      parsedNodes.push({
        id: `node-${i}`,
        type: 'branch',
        label: `❓ Elif: ${match ? match[1] : trimmed}`,
        indent,
        lineNo: i + 1
      });
    } else if (trimmed.startsWith('else:')) {
      parsedNodes.push({
        id: `node-${i}`,
        type: 'branch',
        label: `❓ Else`,
        indent,
        lineNo: i + 1
      });
    }
    // 3. Loops (for, while)
    else if (trimmed.startsWith('for ')) {
      const match = trimmed.match(/for\s+(.*?)\s+in\s+(.*):/);
      parsedNodes.push({
        id: `node-${i}`,
        type: 'loop',
        label: `🔁 For each: ${match ? match[1] : 'item'} in ${match ? match[2] : 'list'}`,
        indent,
        lineNo: i + 1
      });
    } else if (trimmed.startsWith('while ')) {
      const match = trimmed.match(/while\s+(.*):/);
      parsedNodes.push({
        id: `node-${i}`,
        type: 'loop',
        label: `🔁 While: ${match ? match[1] : trimmed}`,
        indent,
        lineNo: i + 1
      });
    }
    // 4. Output (print)
    else if (trimmed.startsWith('print(')) {
      const match = trimmed.match(/print\((.*)\)/);
      parsedNodes.push({
        id: `node-${i}`,
        type: 'output',
        label: `🖨️ Print: ${match ? match[1].replace(/['"]/g, '') : ''}`,
        indent,
        lineNo: i + 1
      });
    }
    // 5. Variable Assignment
    else if (trimmed.includes('=')) {
      if (!trimmed.includes('==') && !trimmed.includes('!=') && !trimmed.includes('<=') && !trimmed.includes('>=')) {
        const parts = trimmed.split('=');
        const varName = parts[0].trim();
        const varVal = parts.slice(1).join('=').trim();
        parsedNodes.push({
          id: `node-${i}`,
          type: 'process',
          label: `📝 ${varName} = ${varVal}`,
          indent,
          lineNo: i + 1
        });
      }
    }
  }

  // End node
  parsedNodes.push({
    id: 'flow-end',
    type: 'end',
    label: '🛑 End',
    indent: 0
  });

  return parsedNodes;
}

export function buildASTFlow(flatNodes) {
  let index = 0;

  function parseBlock(parentIndent) {
    const block = [];
    while (index < flatNodes.length) {
      const node = flatNodes[index];

      // Exit block if indentation decreases
      if (node.indent < parentIndent) {
        break;
      }

      // Skip start and end nodes from nesting checks, just push them
      if (node.type === 'start' || node.type === 'end') {
        block.push(node);
        index++;
        continue;
      }

      // If it is a conditional branch
      if (node.type === 'branch' && (node.label.startsWith('❓ If:') || node.label.startsWith('❓ If '))) {
        const conditionNode = node;
        index++;

        // Parse children belonging to the 'then' block
        const thenBranch = parseBlock(conditionNode.indent + 1);

        // Check for 'else' or 'elif' blocks
        let elseBranch = [];
        if (index < flatNodes.length) {
          const nextNode = flatNodes[index];
          if (
            nextNode.type === 'branch' &&
            (nextNode.label.startsWith('❓ Else') || nextNode.label.startsWith('❓ Elif:') || nextNode.label.startsWith('❓ Elif '))
          ) {
            index++;
            elseBranch = parseBlock(nextNode.indent + 1);
          }
        }

        block.push({
          id: conditionNode.id,
          type: 'conditional_group',
          condition: conditionNode.label.replace('❓ If:', '').replace('❓ If', '').trim(),
          lineNo: conditionNode.lineNo,
          thenBranch,
          elseBranch
        });
      } else {
        block.push(node);
        index++;
      }
    }
    return block;
  }

  return parseBlock(0);
}
