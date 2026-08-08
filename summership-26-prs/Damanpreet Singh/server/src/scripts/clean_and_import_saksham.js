const prisma = require('../prisma');

async function main() {
  console.log('[Cleanup] Removing all old duplicates and split versions of Saksham stories...');
  
  // 1. Completely delete any existing Saksham or draft stories to prevent duplicates like "DT7_C2 (Saksham Original)" vs "Teach-Back Nested Structures"
  const deleteRes = await prisma.scenario.deleteMany({
    where: {
      OR: [
        { title: { contains: 'Saksham' } },
        { title: { contains: '[AS IS]' } },
        { title: { contains: '(PR Original)' } },
        { title: { contains: '(Summership PR)' } },
        { title: { contains: 'File L' } },
        { title: { contains: 'Functions L' } },
        { title: { contains: 'String L' } },
        { title: { contains: 'Error L' } },
        { title: { contains: 'Lists L' } },
        { title: { contains: 'Dictionaries L' } }
      ]
    }
  });

  console.log(`[Cleanup] ✅ Purged ${deleteRes.count} old duplicate/split scenario records!`);

  // 2. Fetch Saksham's genuine dataset from GitHub
  console.log('[Import] Fetching Saksham\'s authentic real-world stories and inserting as UNIFIED scenarios...');
  const url = 'https://raw.githubusercontent.com/vicharanashala/pybe/main/summership-26-prs/Saksham%20Sharma/server/src/data/content.json';
  const res = await fetch(url);
  const data = await res.json();

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

  let sakshamCount = 0;

  for (const topic of data) {
    // ONLY process Saksham Sharma's authentic core topics!
    if (!['loops', 'conditionals', 'datatypes', 'data-types'].includes(topic.topicId)) {
      continue;
    }

    const cleanTopic = topic.topicId.replace('-', ' ');
    const topicPrefix = topic.topicName.split(' ')[0];

    for (const lvl of topic.levels) {
      for (const cs of lvl.caseStudies) {
        const shortName = iconicNames[cs.id.toLowerCase()] || cs.id.toUpperCase();
        
        // UNIFIED single authoritative title per story! Zero duplicates!
        const unifiedTitle = `${topicPrefix} L${lvl.levelId}: ${shortName} (by Saksham)`;
        
        const page1 = `### Page 1: 📖 Real-World Story Setup\n\n**The Scenario:**\n${cs.scenario}`;

        let page2 = `### Page 2: 🔍 The Logical Dilemma & Reasoning Options\n\nBefore jumping into Python code, evaluate these plain-English logic strategies. Which logical approach makes the most sense here?\n\n`;
        if (cs.stage1?.attempt1) {
          cs.stage1.attempt1.forEach((att, i) => {
            page2 += `**Option ${i + 1} (${att.status.toUpperCase()}):** ${att.text}\n\n`;
          });
        }

        const page3 = `### Page 3: 🧩 Python Concept Reveal & Blueprint\n\n${cs.stage2?.conceptReveal || "In Python, using clean constructs allows us to solve this problem efficiently."}`;

        let page4 = `### Page 4: ⚡ Guided Code Build & Syntax Challenge\n\n**Target Code Blueprint:**\n\`\`\`python\n${cs.stage3?.codeTemplate || "# Write your clean Python code here"}\n\`\`\`\n\n**Key Syntax Tokens & Misconceptions:**\n`;
        if (cs.stage3?.tokens) {
          cs.stage3.tokens.forEach((tk) => {
            page4 += `• \`${tk.value}\` → ${tk.correct ? "✅ **Correct construct** for this solution!" : "❌ *Misconception hint:* " + (tk.hint || "Not quite right for this specific task.")}\n`;
          });
        }

        const page5 = `### Page 5: 🏆 Mastery Challenge & Interactive Mentorship\n\n🎉 You have finished reading Saksham's complete interactive case study! Now it is time to prove your mastery.\n\n**Your Action Plan:**\n1. Review the target learning objectives below.\n2. Type your analytical reasoning in the box explaining how your logic solves **"${cs.scenario}"**.\n3. Submit to generate AI feedback and evaluate your conceptual mapping!`;

        const rawJsonEmbed = `\n\n<!-- SAKSHAM_JSON_START -->\n${JSON.stringify(cs)}\n<!-- SAKSHAM_JSON_END -->`;
        const fullContext = [page1, page2, page3, page4, page5].join("\n\n---PAGE---\n\n") + rawJsonEmbed;
        const objectives = [`Master ${cleanTopic} syntax in realistic scenario`, `Evaluate Saksham's Stage 1 reasoning strategies`, `Implement bug-free Python code build`];

        await prisma.scenario.create({
          data: {
            title: unifiedTitle,
            difficulty: lvl.levelId <= 2 ? 'beginner' : lvl.levelId <= 4 ? 'intermediate' : 'advanced',
            concepts: JSON.stringify([topic.topicId, 'saksham']),
            context: fullContext,
            prompt: cs.scenario,
            objectives: JSON.stringify(objectives)
          }
        });

        sakshamCount++;
      }
    }
  }

  console.log(`\n[Cleanup & Import] ✅ Completed cleanly! Inserted exactly ${sakshamCount} unified Saksham stories with embedded interactive engine data! No duplicates remain!`);
}

main()
  .catch((e) => {
    console.error('[Cleanup] ❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
