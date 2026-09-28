process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: 'c:/PYBE/pybe/summership-26-prs/Kalyanam Hasith\server/.env' });
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const { translateCodeToEnglish } = require('c:/PYBE/pybe/summership-26-prs/Kalyanam Hasith/server/src/services/debugEngine');

async function testTranslation() {
  const code = "print('hello')";
  // Let's just bypass debugEngine and call the exact prompt ourselves
  const prompt = `You are a strict, literal code translator. Your ONLY job is to translate the provided Python code into highly readable, plain English pseudocode.

CRITICAL DIRECTIVES:
1. LITERAL SYNTAX ONLY: You are a mindless syntax translator. Do NOT explain what the code "means". Do NOT fix logic bugs. Translate the EXACT physical syntax of the code.

Code to translate:
\`\`\`python
${code}
\`\`\`

Translation (strictly no markdown blocks, do not hallucinate extra lines):`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      temperature: 0.2,
      max_tokens: 500,
    });
    console.log("RAW CONTENT STRING:", JSON.stringify(completion.choices[0]?.message?.content));
    console.log("FULL CHOICES:", JSON.stringify(completion.choices, null, 2));
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
  }
}
testTranslation();
