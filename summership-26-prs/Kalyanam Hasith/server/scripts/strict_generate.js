process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Groq = require('groq-sdk');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const targetTopics = [
  'lists', 'loops', 'strings', 'variables', 'slicing',
  'arithmetic', 'comparisons', 'conditionals', 'control flow',
  'dictionaries', 'functions'
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function verifyBug(buggyCode, setupCode, expectedOutput) {
  const tempFile = path.join(__dirname, 'temp_verify.py');
  const fullCode = `${setupCode || ''}\n${buggyCode}`;
  fs.writeFileSync(tempFile, fullCode, 'utf8');

  try {
    if (!buggyCode || buggyCode.trim() === '') {
      return { valid: false, reason: "Empty buggyCode" };
    }
    const stdout = execSync(`python "${tempFile}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 3000 });
    const actualOutput = stdout.trim();
    // If actual output matches expected, there is NO BUG! Reject.
    if (actualOutput === expectedOutput.trim()) {
      return { valid: false, reason: "Code produced expected output (No bug present)" };
    }
    return { valid: true };
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString() : '';
    // If it's a SyntaxError or IndentationError, we reject it because PyBe requires logical bugs.
    if (stderr.includes('SyntaxError:') || stderr.includes('IndentationError:') || stderr.includes('TabError:')) {
      return { valid: false, reason: "Syntax/Indentation Error" };
    }
    // Other runtime errors (KeyError, TypeError) are valid bugs
    return { valid: true };
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }
}

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
1. The buggyCode must run without throwing a SyntaxError. The bug must be a LOGICAL error or runtime error (e.g. TypeError, KeyError).
2. The buggyCode MUST ACTUALLY FAIL the test cases. DO NOT write correct code in buggyCode.
3. DO NOT use semicolons in your Python code. Write clean, readable, Pythonic code.
4. You MUST escape all double quotes (\\") and newlines (\\n) inside your python code strings.
5. ALL test cases inside buggyCode and solutionCode MUST be completely self-contained. Add any necessary stub data so they run.
6. DO NOT include any inline comments or hints in the code (e.g. no "# incorrect division" or "# Expected output"). The ONLY comments allowed are "# Goal:" and "# Test cases:".
7. The output MUST be a valid JSON object containing the "challenges" array with exactly ${count} objects. Output raw JSON only.
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 3500,
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
  console.log('Starting strict generation and validation...');
  const seedPath = path.join(__dirname, '../src/seed.js');
  let seedContent = fs.readFileSync(seedPath, 'utf8');
  
  const startStr = 'const debugChallenges = [';
  const endMatch = seedContent.match(/\n];\n\nasync function run\(\)/);
  const startIndex = seedContent.indexOf(startStr);
  
  if (startIndex === -1 || !endMatch) {
    console.error("Could not find boundaries in seed.js.");
    return;
  }
  
  const endIndex = endMatch.index;
  const arrStr = seedContent.substring(startIndex + startStr.length - 1, endIndex + 2);
  let existingChallenges = eval(arrStr);
  
  // Filter out any challenges that have empty buggyCode
  existingChallenges = existingChallenges.filter(c => c.buggyCode && c.buggyCode.trim() !== '');

  let finalChallenges = [];
  
  for (const topic of targetTopics) {
    // Get existing challenges for this topic
    let topicChallenges = existingChallenges.filter(c => c.concepts[0] === topic);
    
    console.log(`\n=== Generating for ${topic} ===`);
    
    while (topicChallenges.length < 5) {
      const needed = 5 - topicChallenges.length;
      console.log(`Need ${needed} more valid challenges for ${topic}. Calling Groq...`);
      
      const generated = await generateQuestions(topic, Math.max(needed, 2));
      
      for (const c of generated) {
        if (topicChallenges.length >= 5) break;
        
        if (c.buggyCode) c.buggyCode = c.buggyCode.replace(/;/g, '');
        if (c.solutionCode) c.solutionCode = c.solutionCode.replace(/;/g, '');
        
        c.concepts = c.concepts.map(con => con.toLowerCase().replace(/_/g, ' '));
        c.concepts = [topic, ...c.concepts.filter(con => con !== topic)];
        
        if (c.testCases && c.testCases.length > 0) {
          const testCase = c.testCases[0];
          const verification = verifyBug(c.buggyCode, testCase.setupCode, testCase.expectedOutput);
          
          if (verification.valid) {
            console.log(`✅ Accepted: "${c.title}"`);
            topicChallenges.push(c);
          } else {
            console.log(`❌ Rejected: "${c.title}" (Reason: ${verification.reason})`);
          }
        } else {
           console.log(`❌ Rejected: "${c.title}" (Reason: No test cases)`);
        }
      }
      
      if (topicChallenges.length < 5) {
        console.log('Sleeping for 20s to respect limits before retrying...');
        await sleep(20000);
      }
    }
    
    finalChallenges = finalChallenges.concat(topicChallenges);
  }

  const newObjectsStr = JSON.stringify(finalChallenges, null, 2);
  
  seedContent = seedContent.substring(0, startIndex) + 
                'const debugChallenges = ' + newObjectsStr +
                seedContent.substring(endIndex);
                
  fs.writeFileSync(seedPath, seedContent, 'utf8');
  console.log(`\\nSuccess! Completely replaced database with ${finalChallenges.length} STRICTLY VALIDATED challenges.`);
}

main();
