import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateLLMContent } from '../src/server/llmClient.js';

dotenv.config();

async function testErrorFailover() {
  console.log('--- TESTING GROQ MULTI-KEY FAILOVER ON NON-429 ERRORS ---');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  try {
    const res = await generateLLMContent(ai, {
      systemInstruction: 'You are an educational assistant.',
      userPrompt: 'Return a JSON object with key "status": "groq_success".',
      maxTokens: 300
    });
    console.log('Final Result:', res);
  } catch (err) {
    console.error('Error:', (err as Error).message);
  }
}

testErrorFailover();
