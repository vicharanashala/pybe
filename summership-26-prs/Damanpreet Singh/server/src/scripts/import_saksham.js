const prisma = require('../prisma');

async function main() {
  console.log('[Import] Fetching Saksham Sharma\'s content.json directly from GitHub...');
  const url = 'https://raw.githubusercontent.com/vicharanashala/pybe/main/summership-26-prs/Saksham%20Sharma/server/src/data/content.json';
  const res = await fetch(url);
  const data = await res.json();

  console.log('[Import] Successfully fetched dataset. Processing case studies...');

  let insertedCount = 0;

  // Custom short name mapping for Saksham's top iconic stories
  const iconicNames = {
    'l1_c1': 'Birthday 100x Print',
    'l2_c1': 'Rocket Countdown',
    'l2_c2': 'Door Guest Greeter',
    'l2_c3': 'Coin Collector ₹20',
    'l3_c1': 'ATM PIN 3x Lockout',
    'l4_c1': 'Wedding Seating 5x4',
    'l5_c1': 'Teach-Back Break/Continue',
    'c1_c1': 'Movie Night 18+ Check',
    'c2_c1': 'Self-Driving Traffic Light',
    'c2_c2': 'Letter Grade Assigner',
    'c2_c3': 'Smart Thermostat AC/Heater',
    'c3_c1': 'Shopping Tiered Discount',
    'c4_c1': 'Password Rule Validator',
    'c5_c1': 'Student Pass/Fail Report',
    'dt1_c1': 'Score Average (int/float)',
    'dt2_c1': 'Name & Favorite Quote',
    'dt2_c2': 'Homework Bool Status',
    'dt2_c3': 'New Student None Subject',
    'dt3_c1': 'Dynamic Shopping Cart List',
    'dt3_c2': 'Immutable DOB Tuple',
    'dt4_c1': 'Student Profile Dict',
    'dt4_c2': 'Unique Subjects Set',
    'dt5_c1': 'Anti-Duplicate Contact Book',
    'dt5_c2': 'Single Student Named Lookup',
    'dt6_c1': 'Age Input Type Casting',
    'dt7_c1': 'Library Catalog Waitlists',
    'dt7_c2': 'Teach-Back Nested Structures'
  };

  for (const topic of data) {
    const isSakshamCore = ['loops', 'conditionals', 'datatypes', 'data-types'].includes(topic.topicId);
    const authorTag = isSakshamCore ? '(by Saksham)' : '(Summership PR)';
    
    for (const lvl of topic.levels) {
      for (const cs of lvl.caseStudies) {
        // Build readable short title
        const shortName = iconicNames[cs.id.toLowerCase()] || (cs.scenario.slice(0, 25).trim() + '...');
        const topicPrefix = topic.topicName.split(' ')[0];
        const shortTitle = `${topicPrefix} L${lvl.levelId}: ${shortName} ${authorTag}`;
        const cleanTopic = topic.topicId.replace('-', ' ');

        // Format into 5-page interactive textbook using ---PAGE--- delimiter
        const page1 = `### Page 1: 📖 Real-World Story Setup\n\n**The Scenario:**\n${cs.scenario}\n\nIn our daily lives, simple tasks become overwhelming when scaled up without logical rules. When designing software for this scenario, think about how you would explain the core problem to a beginner: instead of manually repeating actions or guessing answers by hand, we need our computer to follow a reliable, structured pattern!`;

        let page2 = `### Page 2: 🔍 The Logical Dilemma & Reasoning Options\n\nBefore jumping into Python code, evaluate these plain-English logic strategies. Which logical approach makes the most sense here?\n\n`;
        if (cs.stage1?.attempt1) {
          cs.stage1.attempt1.forEach((att, i) => {
            page2 += `**Option ${i + 1} (${att.status.toUpperCase()}):** ${att.text}\n\n`;
          });
        } else {
          page2 += `Think carefully about what data structure or logic condition matches the requirements without causing memory leaks or infinite loop crashes!`;
        }

        const page3 = `### Page 3: 🧩 Python Concept Reveal & Blueprint\n\n${cs.stage2?.conceptReveal || "In Python, using clean constructs allows us to solve this problem efficiently with clear variable naming and structured flow control."}\n\nBy using appropriate Python syntax, we ensure our codebase remains human-readable, bug-free, and mathematically reliable.`;

        let page4 = `### Page 4: ⚡ Guided Code Build & Syntax Challenge\n\n**Target Code Blueprint:**\n\`\`\`python\n${cs.stage3?.codeTemplate || "# Write your clean Python code to solve the scenario here"}\n\`\`\`\n\n**Key Syntax Tokens & Misconceptions:**\n`;
        if (cs.stage3?.tokens) {
          cs.stage3.tokens.forEach((tk) => {
            page4 += `• \`${tk.value}\` → ${tk.correct ? "✅ **Correct construct** for this solution!" : "❌ *Misconception hint:* " + (tk.hint || "Not quite right for this specific task.")}\n`;
          });
        } else {
          page4 += `• Focus on proper indentation, accurate variable naming, and exact syntax punctuation.`;
        }

        const page5 = `### Page 5: 🏆 Mastery Challenge & Interactive Mentorship\n\n🎉 You have finished reading this complete interactive case study! Now it is time to prove your mastery.\n\n**Your Action Plan:**\n1. Review the target learning objectives below.\n2. Type your analytical reasoning in the box explaining how your logic solves **"${cs.scenario}"**.\n3. Submit to generate AI feedback and evaluate your conceptual mapping!`;

        const fullContext = [page1, page2, page3, page4, page5].join("\n\n---PAGE---\n\n");

        const objectives = [
          `Master ${cleanTopic} syntax in realistic scenario`,
          `Evaluate plain-English reasoning strategies`,
          `Implement bug-free Python code build`
        ];

        // Check if scenario already exists by prompt or previous ID naming
        const existing = await prisma.scenario.findFirst({
          where: {
            OR: [
              { title: { contains: cs.id.toUpperCase() } },
              { prompt: { contains: cs.scenario.slice(0, 35) } }
            ]
          }
        });

        if (!existing) {
          await prisma.scenario.create({
            data: {
              title: shortTitle,
              difficulty: lvl.levelId <= 2 ? 'beginner' : lvl.levelId <= 4 ? 'intermediate' : 'advanced',
              concepts: JSON.stringify([topic.topicId, 'logic', isSakshamCore ? 'saksham-story' : 'summership']),
              context: fullContext,
              prompt: `How would you write clear Python code to solve: "${cs.scenario}"?`,
              objectives: JSON.stringify(objectives)
            }
          });
          insertedCount++;
          console.log(`  ➕ Created: ${shortTitle}`);
        } else {
          // Update existing with clean, iconically formatted title & multi-page content
          await prisma.scenario.update({
            where: { id: existing.id },
            data: {
              title: shortTitle,
              concepts: JSON.stringify([topic.topicId, 'logic', isSakshamCore ? 'saksham-story' : 'summership']),
              context: fullContext,
              objectives: JSON.stringify(objectives)
            }
          });
          console.log(`  🔄 Updated: ${shortTitle}`);
        }
      }
    }
  }

  console.log(`\n[Import] ✅ Finished successfully! Beautifully titled all of Saksham's stories in local DB.`);
}

main()
  .catch((e) => {
    console.error('[Import] ❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
