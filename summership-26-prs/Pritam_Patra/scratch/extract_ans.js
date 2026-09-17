const fs = require('fs');
const path = require('path');

const dir = 'd:\\pybe\\pybe\\summership-26-prs\\Pritam_Patra\\server\\src\\data\\sagas';
const files = fs.readdirSync(dir);

let output = '';

for (const file of files) {
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    output += `\\n=== Saga: ${data.title} ===\\n`;
    
    for (const arc of data.arcs || []) {
      for (const act of arc.acts || []) {
        output += `Act ${act.act} (${act.name}):\\n`;
        if (act.mcq) {
          const ans = act.mcq.options[act.mcq.answerIndex];
          output += `  MCQ Question: ${act.mcq.question}\\n`;
          output += `  MCQ Answer: ${ans}\\n`;
        } else {
          output += `  No MCQ for this act.\\n`;
        }
        if (act.codeReveal && act.codeReveal.blanks) {
          for (const blank of act.codeReveal.blanks) {
            output += `  Code Blank Answer: ${blank.answer}\\n`;
          }
        }
      }
    }
  }
}

console.log(output);
