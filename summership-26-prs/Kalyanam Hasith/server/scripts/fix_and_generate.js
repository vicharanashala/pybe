process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const coreTopics = ['variables', 'lists', 'loops', 'conditionals', 'functions', 'dictionaries'];
const otherTopics = ['strings', 'arithmetic', 'modulo', 'comparisons', 'slicing'];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

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
2. DO NOT use semicolons in your Python code. Write clean, readable, Pythonic code.
3. You MUST escape all double quotes (\\") and newlines (\\n) inside your python code strings.
4. The output MUST be a valid JSON object containing the "challenges" array with exactly ${count} objects. Output raw JSON only.
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

async function main() {
  console.log('Starting fix and generation...');
  const seedPath = path.join(__dirname, '../src/seed.js');
  let seedContent = fs.readFileSync(seedPath, 'utf8');
  
  const startStr = 'const debugChallenges = [';
  const endMatch = seedContent.match(/\n];\n\nasync function run\(\)/);
  
  const startIndex = seedContent.indexOf(startStr);
  
  if (startIndex === -1 || !endMatch) {
    console.error("Could not find boundaries.");
    return;
  }
  
  const endIndex = endMatch.index;
  const arrStr = seedContent.substring(startIndex + startStr.length - 1, endIndex + 2);
  let challenges = eval(arrStr);
  
  // Clean up existing challenges
  challenges.forEach(c => {
    if (c.concepts.includes('list')) {
      c.concepts = c.concepts.map(con => con === 'list' ? 'lists' : con);
    }
    // Remove trailing semicolons in code
    if (c.buggyCode) c.buggyCode = c.buggyCode.replace(/;/g, '');
    if (c.solutionCode) c.solutionCode = c.solutionCode.replace(/;/g, '');
  });
  
  // Trim others to exactly 3, and count cores
  let finalChallenges = [];
  let counts = {};
  
  for (const t of [...coreTopics, ...otherTopics]) counts[t] = 0;
  
  for (const c of challenges) {
    let keep = true;
    for (const concept of c.concepts) {
      if (otherTopics.includes(concept)) {
        if (counts[concept] >= 3) {
          // If this challenge belongs primarily to an 'other' topic that is already full, we might skip it
          if (c.concepts[0] === concept) keep = false;
        }
      }
    }
    if (keep) {
      finalChallenges.push(c);
      c.concepts.forEach(con => {
        if (counts[con] !== undefined) counts[con]++;
      });
    }
  }
  
  // Now ensure exactly 3 for others (if they are still above 3)
  for (const topic of otherTopics) {
    while (counts[topic] > 3) {
      const idx = finalChallenges.findIndex(c => c.concepts.includes(topic));
      if (idx > -1) {
        finalChallenges[idx].concepts.forEach(con => { if(counts[con] !== undefined) counts[con]-- });
        finalChallenges.splice(idx, 1);
      } else {
        break;
      }
    }
  }

  // Generate missing for cores
  for (const topic of coreTopics) {
    if (counts[topic] < 7) {
      const needed = 7 - counts[topic];
      console.log(`Topic '${topic}' has ${counts[topic]} challenges. Generating ${needed} more...`);
      const generated = await generateQuestions(topic, needed);
      
      // Clean generated code too
      generated.forEach(c => {
        if (c.buggyCode) c.buggyCode = c.buggyCode.replace(/;/g, '');
        if (c.solutionCode) c.solutionCode = c.solutionCode.replace(/;/g, '');
      });
      
      finalChallenges = finalChallenges.concat(generated);
      console.log(`Sleeping for 30s to respect limits...`);
      await sleep(30000);
    }
  }
  
  // Generate missing for others (if any dropped below 3)
  for (const topic of otherTopics) {
    if (counts[topic] < 3) {
      const needed = 3 - counts[topic];
      console.log(`Topic '${topic}' has ${counts[topic]} challenges. Generating ${needed} more...`);
      const generated = await generateQuestions(topic, needed);
      
      generated.forEach(c => {
        if (c.buggyCode) c.buggyCode = c.buggyCode.replace(/;/g, '');
        if (c.solutionCode) c.solutionCode = c.solutionCode.replace(/;/g, '');
      });
      
      finalChallenges = finalChallenges.concat(generated);
      console.log(`Sleeping for 30s to respect limits...`);
      await sleep(30000);
    }
  }

  const newObjectsStr = JSON.stringify(finalChallenges, null, 2);
  
  seedContent = seedContent.substring(0, startIndex) + 
                'const debugChallenges = ' + newObjectsStr +
                seedContent.substring(endIndex);
                
  fs.writeFileSync(seedPath, seedContent, 'utf8');
  console.log(`Success! Final count: ${finalChallenges.length} challenges.`);
}

main();
