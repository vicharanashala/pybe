process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listModels() {
  try {
    const models = await groq.models.list();
    console.log("AVAILABLE MODELS:");
    models.data.forEach(m => console.log(m.id));
  } catch (err) {
    console.error("ERROR CAUGHT:", err);
  }
}
listModels();
