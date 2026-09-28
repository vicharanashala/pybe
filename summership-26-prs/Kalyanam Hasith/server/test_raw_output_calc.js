process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: 'c:/PYBE/pybe/summership-26-prs/Kalyanam Hasith/server/.env' });
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testTranslation() {
  const code = `def calculate(num1, num2, operator):
  if operator == '+':
    return num1 + num2
  elif operator == '-':
    return num1 - num2
  elif operator == '*':
    return num1 * num2
  elif operator == '/':
    return num1 / num2
  else:
    return None

print(calculate(10, 2, '+'))
print(calculate(10, 2, '-'))
print(calculate(10, 2, '*'))
print(calculate(10, 2, '/'))
print(calculate(10, 2, '^'))`;

  const prompt = `You are a strict, literal code translator. Your ONLY job is to translate the provided Python code into highly readable, plain English pseudocode.

CRITICAL DIRECTIVES:
1. LITERAL SYNTAX ONLY: You are a mindless syntax translator. Do NOT explain what the code "means". Do NOT fix logic bugs. Translate the EXACT physical syntax of the code.
2. 1-TO-1 LINE CORRESPONDENCE: Every single line of Python MUST produce exactly ONE corresponding line of English. NEVER break a single Python line into multiple English lines. NEVER hallucinate or invent extra lines that are not in the Python code.

TRANSLATION FORMATTING RULES:
- BLOCKS: Use standard closers ("End if", "End for") aligned with the block start on a new line.
- SLICING: Explicitly state slice bounds. For slices without a step (e.g. [a:b]), you MUST append exactly "(do not specify the step size)". For slices with a step (e.g. [a:b:c]), explicitly state the step.
- ASSIGNMENT & UNPACKING: Explicitly state assignments (e.g., "Set variable x to...") and explicitly state tuple unpacking.
- KEYWORD ARGS & METHODS: Explicitly state argument names and method names. NEVER summarize method intents.
- FOR LOOPS: Must be a single sentence (e.g., "Loop variable j through the Python range up to 5 (exclusive):").

<examples>
Python: names = ['alice', 'bob']
English: Set variable names to a list containing the items 'alice', 'bob'

Python: items.append(items[1])
English: Call the append method on items with the argument items[1]

Python: data.remove(data[1][2])
English: Call the remove method on data with the argument data[1][2]

Python: words[1:5]
English: a slice of list words from index 1 to 5 (do not specify the step size)

Python: for item in data[2:]:
English: Loop variable item through a slice of list data from index 2 to the end (do not specify the step size):

Python: return result
English: Return the value result
</examples>

Code to translate:
\`\`\`python
${code}
\`\`\`

Provide the raw English translation for the code above according to the exact rules. Do not output markdown blocks, backticks, or any introductory text.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'qwen/qwen3.6-27b',
      temperature: 0.2,
      max_tokens: 500,
    });
    console.log("RAW CONTENT STRING:", JSON.stringify(completion.choices[0]?.message?.content));
  } catch (err) {
    console.error("ERROR CAUGHT:", err);
  }
}
testTranslation();
