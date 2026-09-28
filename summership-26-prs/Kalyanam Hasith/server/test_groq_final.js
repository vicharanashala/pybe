process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testTranslation() {
  const prompt = "Translate this python to English:\nprint('hello')";
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      temperature: 0.2,
      max_tokens: 500,
    });
    console.log("RESPONSE:", completion.choices[0]?.message?.content);
  } catch (err) {
    console.log("ERROR NAME:", err.name);
    console.log("ERROR MESSAGE:", err.message);
    if(err.error) console.log("GROQ API ERROR:", err.error);
    console.log("STATUS:", err.status);
  }
}
testTranslation();
