import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

function getApiKey() {
  return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
}

app.post("/api/ask", async (req, res) => {
  const apiKey = getApiKey();
  const { question, lessonTitle, storyTitle, conceptExplainer } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing 'question' in request body" });
  }

  if (!apiKey) {
    return res.status(400).json({
      error: "GEMINI_API_KEY is missing. Please add GEMINI_API_KEY=your_key to server-example/.env or .env file."
    });
  }

  const systemPrompt = `You are Krishna, acting as a patient guide inside a Python learning app called CodeGita.
You are currently helping a student with the lesson "${lessonTitle || 'Python Exceptions'}", whose story is "${storyTitle || 'Dharma and Python'}".
Here is the lesson's explanation of the concept, for your reference:
"${conceptExplainer || 'Exception handling in Python'}"

Rules:
- Answer only questions related to this specific exception/concept, the story it's mapped to, or how it applies to real-world code.
- If the student asks something unrelated to this lesson, gently redirect them back to the topic.
- Keep answers short: 2-4 sentences, simple language, no long lectures.
- Stay in a warm, calm, guiding tone — never robotic or overly formal.
- If a code example would help, keep it under 5 lines.`;

  const modelsToTry = [
    process.env.GEMINI_MODEL || "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-2.5-flash"
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: question }] }],
          generationConfig: { maxOutputTokens: 350, temperature: 0.7 },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Gemini API error with model ${model}:`, errText);
        lastError = errText;
        continue;
      }

      const data = await response.json();
      const answer =
        data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't form an answer.";

      return res.json({ answer });
    } catch (err) {
      console.error(`Request to Gemini failed with model ${model}:`, err);
      lastError = err?.message || String(err);
    }
  }

  return res.status(502).json({
    error: `Failed to reach Gemini API. Details: ${lastError || 'Service unavailable'}`
  });
});

app.listen(PORT, () => {
  console.log(`Doubt-clearing backend running on http://localhost:${PORT}`);
});