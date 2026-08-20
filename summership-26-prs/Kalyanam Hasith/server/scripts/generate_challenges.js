process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const coreTopics = ['variables', 'strings', 'arithmetic', 'modulo', 'conditionals', 'comparisons', 'lists', 'loops', 'dictionaries', 'functions', 'slicing'];

async function generateQuestions(topic, count) {
  const prompt = `You are an expert computer science curriculum designer. Generate ${count} Python debugging challenges focused on the concept: "${topic}".

For each challenge, provide a JSON object with the following schema:
{
  "challenges": [
    {
      "title": "A catchy title",
      "difficulty": "Beginner" | "Explorer" | "Builder",
      "concepts": ["${topic}", "another_related_concept"],
      "context": "A short, engaging real-world scenario.",
      "buggyCode": "# Goal: description\\npython code with a LOGICAL bug or typo (not a syntax error that crashes compilation).",
      "solutionCode": "# Goal: description\\nfixed python code.",
      "expectedLogic": "A conceptual, step-by-step numbered list of how the logic SHOULD work (no syntax).",
      "stripVariables": ["list", "of", "variable", "names", "used", "in", "code"],
      "hints": ["Hint 1 focusing on symptom", "Hint 2 focusing on the conceptual flaw"],
      "bugExplanation": "A clear explanation of why the original code failed conceptually.",
      "testCases": [
        {
          "setupCode": "Any setup code if needed, or empty string",
          "expectedOutput": "The exact string output expected from print statements"
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. The buggyCode must run without throwing a SyntaxError. The bug must be a LOGICAL error (e.g. wrong variable used, incorrect indentation of return, off-by-one error, list copy vs reference, using append on wrong list).
2. You MUST escape all double quotes (\\") and newlines (\\n) inside your python code strings.
3. The output MUST be a valid JSON object containing the "challenges" array with exactly ${count} objects. Output raw JSON only.
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });
    
    let content = completion.choices[0].message.content.trim();
    
    return JSON.parse(content).challenges || [];
  } catch (err) {
    console.error(`Error generating for ${topic}:`, err.message);
    return [];
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('Starting generation...');
  const seedPath = path.join(__dirname, '../src/seed.js');
  let seedContent = fs.readFileSync(seedPath, 'utf8');
  
  // Extract existing challenges to count
  const debugMatch = seedContent.match(/const debugChallenges = \[([\s\S]*?)\];\n\nasync function/);
  if (!debugMatch) {
    console.error("Could not find debugChallenges in seed.js");
    return;
  }
  
  // Using a simple regex to count occurrences of concepts
  let newChallenges = [];
  
  for (const topic of coreTopics) {
    // Count how many times this topic appears in concepts: [...]
    const topicRegex = new RegExp(`concepts:[^\\]]*'${topic}'`, 'g');
    const existingCount = (seedContent.match(topicRegex) || []).length;
    
    if (existingCount < 7) {
      const needed = 7 - existingCount;
      console.log(`Topic '${topic}' has ${existingCount} challenges. Generating ${needed} more...`);
      
      const generated = await generateQuestions(topic, needed);
      console.log(`Generated ${generated.length} for ${topic}.`);
      newChallenges = newChallenges.concat(generated);
      
      console.log('Sleeping for 60 seconds to respect Groq rate limits...');
      await sleep(60000);
    } else {
      console.log(`Topic '${topic}' already has ${existingCount} challenges. Skipping.`);
    }
  }
  
  if (newChallenges.length > 0) {
    // Convert new challenges to JS objects string
    let newObjectsStr = newChallenges.map(c => JSON.stringify(c, null, 2)).join(',\n  ');
    
    // Inject into seedContent just before the closing bracket of debugChallenges
    // We replace '];\n\nasync function seedDB()' with '  , ' + newObjectsStr + '\n];\n\nasync function seedDB()'
    
    const insertionPoint = '];\n\nasync function run()';
    if (seedContent.includes(insertionPoint)) {
      seedContent = seedContent.replace(
        insertionPoint, 
        `,\n  // AUTO-GENERATED CHALLENGES\n  ${newObjectsStr}\n];\n\nasync function run()`
      );
      
      // Clean up the JSON stringify formatting to match JS (keys without quotes) if needed, 
      // but JSON.stringify is valid JS anyway. We will just write it.
      fs.writeFileSync(seedPath, seedContent, 'utf8');
      console.log(`Successfully appended ${newChallenges.length} new challenges to seed.js!`);
    } else {
      console.error("Could not find insertion point in seed.js");
    }
  } else {
    console.log("No new challenges needed.");
  }
}

main();
