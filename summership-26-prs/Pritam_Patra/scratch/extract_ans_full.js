const fs = require('fs');
const path = require('path');

const dir = 'd:\\pybe\\pybe\\summership-26-prs\\Pritam_Patra\\server\\src\\data\\sagas';
const files = fs.readdirSync(dir);

let output = '# PyBe Sagas - Comprehensive Answer Guide\\n\\n';
output += 'Here are all the answers for observation prompts, multiple-choice questions (MCQs), code blanks, and coding tasks across all acts in the sagas.\\n\\n';

for (const file of files) {
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    output += `## Saga: ${data.title}\\n\\n`;
    
    for (const arc of data.arcs || []) {
      for (const act of arc.acts || []) {
        output += `### Act ${act.act}: ${act.name}\\n`;
        output += `**Concept:** ${act.concept}\\n\\n`;
        
        // Observation Prompt
        if (act.questions && act.questions.length > 0) {
          output += `#### Observation\\n`;
          act.questions.forEach((q, i) => {
            output += `- **Question ${i + 1}:** ${q}\\n`;
          });
          if (act.expectedInsight) {
            output += `- **Expected Insight:** ${act.expectedInsight}\\n`;
          }
          output += '\\n';
        }

        // MCQ
        if (act.mcq) {
          output += `#### MCQ\\n`;
          output += `- **Question:** ${act.mcq.question}\\n`;
          const ans = act.mcq.options[act.mcq.answerIndex];
          output += `- **Correct Answer:** ${ans}\\n\\n`;
        }
        
        // Code Reveal Blanks
        if (act.codeReveal && act.codeReveal.blanks && act.codeReveal.blanks.length > 0) {
          output += `#### Code Blank\\n`;
          for (const blank of act.codeReveal.blanks) {
            output += `- **Expected Code:** \`${blank.answer}\`\\n`;
          }
          output += '\\n';
        }
        
        // Transfer Scenario
        if (act.transferScenario) {
          output += `#### Transfer Scenario: ${act.transferScenario.title}\\n`;
          output += `- **Context:** ${act.transferScenario.text}\\n`;
          output += `- **Question:** ${act.transferScenario.question}\\n\\n`;
        }

        // Code Task
        if (act.codeTask) {
          output += `#### Code Task\\n`;
          output += `- **Instructions:** ${act.codeTask.instructions}\\n`;
          output += `- **Model Answer:**\\n\`\`\`python\\n${act.codeTask.modelAnswer}\\n\`\`\`\\n\\n`;
        }
        
        output += `---\\n\\n`;
      }
    }
  }
}

fs.writeFileSync('C:\\Users\\PRITAM\\.gemini\\antigravity-ide\\brain\\ac52205d-d3e4-4f90-b5b0-a18892fac1f2\\saga_comprehensive_answers.md', output, 'utf8');
console.log('Successfully wrote comprehensive answers to saga_comprehensive_answers.md');
