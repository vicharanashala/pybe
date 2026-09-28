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

  const prompt = `Translate the provided Python code into highly readable, plain English pseudocode. Follow these rules exactly:
- 1-to-1 correspondence: Every Python line must produce exactly one English line.
- Do not explain the code, just translate the syntax.
- Do not output markdown blocks or backticks.

Examples:
Python: names = ['alice', 'bob']
English: Set variable names to a list containing the items 'alice', 'bob'

Python: return result
English: Return the value result

Code to translate:
${code}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a code translator.' },
        { role: 'user', content: prompt }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 1000,
    });
    console.log("RAW CONTENT STRING:", JSON.stringify(completion.choices[0]?.message?.content));
  } catch (err) {
    console.error("ERROR CAUGHT:", err);
  }
}
testTranslation();
