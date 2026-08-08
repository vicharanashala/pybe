const prisma = require('../prisma');

async function main() {
  console.log('[Import AS-IS] Fetching Saksham Sharma\'s content.json directly from GitHub...');
  const url = 'https://raw.githubusercontent.com/vicharanashala/pybe/main/summership-26-prs/Saksham%20Sharma/server/src/data/content.json';
  const res = await fetch(url);
  const data = await res.json();

  console.log('[Import AS-IS] Processing case studies exactly AS IS (no multi-page conversions)...');

  let insertedCount = 0;

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
    const authorTag = isSakshamCore ? '(Saksham Original)' : '(PR Original)';
    
    for (const lvl of topic.levels) {
      for (const cs of lvl.caseStudies) {
        const shortName = iconicNames[cs.id.toLowerCase()] || (cs.scenario.slice(0, 25).trim() + '...');
        const topicPrefix = topic.topicName.split(' ')[0];
        const shortTitle = `[AS IS] ${topicPrefix} L${lvl.levelId}: ${shortName} ${authorTag}`;

        // Build exact AS IS content word-for-word from Saksham's JSON without adding any of our custom text or ---PAGE--- delimiters
        let asIsContext = `### Scenario\n${cs.scenario}\n\n`;

        if (cs.stage1?.attempt1) {
          asIsContext += `### Stage 1: Logic Test Options\n`;
          cs.stage1.attempt1.forEach((att) => {
            asIsContext += `• [**${att.status.toUpperCase()}**] ${att.text}\n`;
          });
          asIsContext += `\n`;
        }

        if (cs.stage2?.conceptReveal) {
          asIsContext += `### Stage 2: Concept Reveal\n${cs.stage2.conceptReveal}\n\n`;
        }

        if (cs.stage3?.codeTemplate) {
          asIsContext += `### Stage 3: Guided Code Build\n\`\`\`python\n${cs.stage3.codeTemplate}\n\`\`\`\n\n`;
        }

        if (cs.stage3?.tokens) {
          asIsContext += `### Stage 3 Syntax Tokens\n`;
          cs.stage3.tokens.forEach((tk) => {
            asIsContext += `• \`${tk.value}\` (${tk.correct ? 'Correct' : 'Incorrect: ' + (tk.hint || '')})\n`;
          });
        }

        const objectives = [
          `Understand ${topic.topicName} scenario exactly as authored`,
          `Evaluate original Stage 1 logic options`,
          `Review original Stage 3 syntax tokens`
        ];

        // Check if scenario already exists by title or previous AS IS ID
        const existing = await prisma.scenario.findFirst({
          where: {
            OR: [
              { title: { startsWith: `[AS IS] ${topicPrefix} L${lvl.levelId}:` } },
              { prompt: cs.scenario, title: { startsWith: '[AS IS]' } }
            ]
          }
        });

        if (!existing) {
          await prisma.scenario.create({
            data: {
              title: shortTitle,
              difficulty: lvl.levelId <= 2 ? 'beginner' : lvl.levelId <= 4 ? 'intermediate' : 'advanced',
              concepts: JSON.stringify([topic.topicId, 'as-is-original', isSakshamCore ? 'saksham' : 'summership']),
              context: asIsContext,
              prompt: cs.scenario,
              objectives: JSON.stringify(objectives)
            }
          });
          insertedCount++;
          console.log(`  ➕ Inserted AS-IS: ${shortTitle}`);
        } else {
          await prisma.scenario.update({
            where: { id: existing.id },
            data: {
              title: shortTitle,
              context: asIsContext,
              prompt: cs.scenario,
              objectives: JSON.stringify(objectives)
            }
          });
          console.log(`  🔄 Updated AS-IS: ${shortTitle}`);
        }
      }
    }
  }

  console.log(`\n[Import AS-IS] ✅ Successfully named & saved ${insertedCount} original AS-IS stories in local DB!`);
}

main()
  .catch((e) => {
    console.error('[Import AS-IS] ❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
