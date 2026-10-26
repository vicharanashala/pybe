// Rosewood Manor - a chained murder-mystery case study.
//
// Schema (additive, backward-compatible):
//   Every field below except the two new ones is unchanged from the original
//   chain: `_id`, `storyId`, `order`, `nextScenarioId`, `title`, `difficulty`,
//   `concepts`, `context`, `prompt`, `objectives`, `sampleReasoning`,
//   `effectivenessScore`, `idealSolution`, optional `starterCode`, `caseData`,
//   `reveal`. The schema-agnostic store passes unknown fields straight
//   through, so nothing server-side had to change.
//
// NEW (additive) fields:
//   `partLabel`  — short sidebar label, e.g. "Part 0 · The Case Opens".
//   `subSteps`   — optional ordered array breaking one part into smaller beats:
//     { id, kind, title, body, snippet? }
//       kind: 'story'     narrative beat that advances the investigation
//             'primer'    concept primer written *in story voice* (never a
//                         lecture; may carry an optional tiny code `snippet`)
//             'reasoning' guided reasoning input (uses the part's `prompt`;
//                         this is where the existing session POST fires)
//             'code'      generated code + model-answer reveal (existing)
//             'connect'   ties the just-built skill back to the case progress
//   Parts without `subSteps` keep working: the client falls back to the old
//   single-page flow. To extend to future advanced topics (trees, pruning),
//   add a new chained scenario object with the same sub-step shape.
function commentCode(code) {
  return String(code || '').split('\n').map((line) => {
    if (!line.trim() || line.includes('#')) return line;
    const text = line.trim();
    let explanation = 'This line continues the case solution.';
    if (text.startsWith('def ')) explanation = 'This line defines a reusable Python function.';
    else if (text.startsWith('return ')) explanation = 'This line sends the calculated result back.';
    else if (text.startsWith('for ')) explanation = 'This line repeats the work for each item.';
    else if (text.startsWith('if ')) explanation = 'This line checks a condition before continuing.';
    else if (text.startsWith('else:')) explanation = 'This line starts the other path when the condition is false.';
    else if (text.startsWith('from ') || text.startsWith('import ')) explanation = 'This line imports a Python tool.';
    else if (text.includes(' = ')) explanation = 'This line stores a value in a named variable.';
    else if (text.startsWith('print(')) explanation = 'This line displays the result for the detective.';
    return `${line}  # ${explanation}`;
  }).join('\n');
}

const caseBible = require('./src/data/caseBible.json');

function choice(id, text, correct, feedback) {
  return { id, text, correct, feedback };
}

function stableHash(text) {
  return [...String(text)].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7);
}

function shuffleChoices(choices, slideId, questionIndex) {
  const targetLetters = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'];
  const targetIndex = Math.min(choices.length - 1, targetLetters[questionIndex % targetLetters.length].charCodeAt(0) - 65);
  const ordered = [...choices].sort((left, right) => stableHash(`${slideId}:${left.id}`) - stableHash(`${slideId}:${right.id}`));
  const correctIndex = ordered.findIndex((item) => item.correct);
  const shift = (targetIndex - correctIndex + ordered.length) % ordered.length;
  return ordered.map((_, index) => ordered[(index - shift + ordered.length) % ordered.length]);
}

const questionSets = [
  [
    { type: 'reasoning', prompt: 'What should the assistant gather first?', choices: [choice('facts', 'List suspects, rooms, and clues.', true, 'Facts give the investigation a stable starting point.'), choice('accuse', 'Accuse the quietest suspect.', false, 'A hunch is not evidence yet.'), choice('code', 'Write the solver immediately.', false, 'Code should follow a clear model of the facts.'), choice('rumor', 'Collect the household gossip.', false, 'Rumor is less reliable than recorded evidence.')] },
    { type: 'mapping', prompt: 'Each suspect list becomes a ...', choices: [choice('list', 'list', true, 'A list keeps ordered names together.'), choice('loop', 'loop', false, 'A loop processes values; it does not store them.'), choice('record', 'single record', false, 'One record cannot hold every suspect.')] },
    { type: 'prompt', prompt: 'Which detective request is strongest?', choices: [choice('specific', 'Compare suspects; explain steps; show Python.', true, 'It names the context, task, reasoning, and output.'), choice('vague', 'Help me with this.', false, 'The detective has no useful context.'), choice('code', 'Give me code now.', false, 'It asks for code without the problem or reasoning.'), choice('magic', 'Solve everything perfectly.', false, 'It gives no testable details.')] },
    { type: 'reflection', prompt: 'What did this step teach?', choices: [choice('facts', 'Good solutions begin by organizing facts.', true, 'A clear representation prevents premature guesses.'), choice('guess', 'The first suspect is usually guilty.', false, 'Mystery logic still needs evidence.'), choice('skip', 'Planning is unnecessary.', false, 'Planning makes later code easier to trust.')] }
  ],
  [
    { type: 'reasoning', prompt: 'How should messy witness notes be cleaned?', choices: [choice('records', 'Split each note into a structured record.', true, 'A record keeps each clue comparable.'), choice('sort', 'Sort the raw sentences alphabetically.', false, 'Order does not clean the fields.'), choice('guess', 'Choose the most believable sentence.', false, 'Cleaning comes before judging.'), choice('delete', 'Remove the unusual punctuation.', false, 'Punctuation may mark the field boundary.')] },
    { type: 'mapping', prompt: 'Each witness statement becomes a ...', choices: [choice('record', 'record', true, 'A record pairs a speaker with a cleaned clue.'), choice('loop', 'loop', false, 'A loop repeats work over records.'), choice('list', 'bare list', false, 'A bare list loses field names.')] },
    { type: 'prompt', prompt: 'Which detective request is strongest?', choices: [choice('specific', 'Parse lines; trim fields; show records.', true, 'It identifies the messy input and the exact transformation.'), choice('vague', 'Explain parsing.', false, 'It lacks the actual input and desired result.'), choice('code', 'Write a parser.', false, 'It does not say how success should look.'), choice('short', 'Fix this text.', false, 'It gives no parsing rule.')] },
    { type: 'reflection', prompt: 'What did this step teach?', choices: [choice('seam', 'Find the seam; split; trim.', true, 'Parsing is a small, repeatable cleaning process.'), choice('ignore', 'Messy text can be compared as-is.', false, 'Different shapes can hide the same meaning.'), choice('guess', 'Punctuation decides guilt.', false, 'Punctuation only helps locate fields.')] }
  ],
  [
    { type: 'reasoning', prompt: 'How should the mixed times be ordered?', choices: [choice('normalize', 'Normalize every time, then sort the events.', true, 'Comparable values make ordering reliable.'), choice('text', 'Sort the time strings as written.', false, 'Different formats can sort incorrectly.'), choice('guess', 'Trust the earliest-looking string.', false, 'Appearance is not a consistent rule.'), choice('delete', 'Discard the unusual time.', false, 'Every clue may matter.')] },
    { type: 'mapping', prompt: 'A normalized event list becomes a ...', choices: [choice('key', 'sorted list with a key', true, 'A key tells sort how to compare events.'), choice('set', 'set', false, 'Sets do not preserve event order.'), choice('record', 'single record', false, 'Many events need a collection.')] },
    { type: 'prompt', prompt: 'Which detective request is strongest?', choices: [choice('specific', 'Normalize three times; sort; explain.', true, 'It gives exact inputs, operation, and expected explanation.'), choice('vague', 'Sort these times.', false, 'It does not address mixed formats.'), choice('code', 'Use datetime.', false, 'It names a tool without a task.'), choice('guess', 'Which happened first?', false, 'It asks for an answer, not a method.')] },
    { type: 'reflection', prompt: 'What did this step teach?', choices: [choice('order', 'Normalize first; sorting is easy after values agree.', true, 'The hard part was making times comparable.'), choice('text', 'Text order always equals time order.', false, 'Formats can make text order misleading.'), choice('skip', 'The five-minute gap is irrelevant.', false, 'The gap is a key story clue.')] }
  ],
  [
    { type: 'reasoning', prompt: 'How can the alibi gaps be found?', choices: [choice('difference', 'Subtract witnessed rooms from claimed rooms.', true, 'The difference exposes claims no witness confirms.'), choice('count', 'Count every room equally.', false, 'Counts do not compare evidence.'), choice('vote', 'Choose the most confident suspect.', false, 'Confidence is not corroboration.'), choice('merge', 'Merge all rooms into one list.', false, 'Merging hides the important difference.')] },
    { type: 'mapping', prompt: 'Witnessed and claimed rooms become ...', choices: [choice('sets', 'sets', true, 'Set operations reveal overlap and difference.'), choice('strings', 'strings', false, 'Strings hold text, not membership relationships.'), choice('loop', 'one loop', false, 'A loop can inspect sets but is not the model.')] },
    { type: 'prompt', prompt: 'Which detective request is strongest?', choices: [choice('specific', 'Compare room sets; show the difference.', true, 'It supplies both collections and the decision to make.'), choice('vague', 'Check the alibis.', false, 'It leaves the comparison undefined.'), choice('code', 'Use sets.', false, 'It names a concept without evidence.'), choice('guess', 'Who is lying?', false, 'It jumps to a verdict without a rule.')] },
    { type: 'reflection', prompt: 'What did this step teach?', choices: [choice('difference', 'A set difference can expose an unverified claim.', true, 'The missing overlap is useful evidence.'), choice('certainty', 'A confident claim is confirmed.', false, 'Confirmation requires another source.'), choice('all', 'Every claimed room is equally trustworthy.', false, 'Witnessed and unwitnessed claims differ.')] }
  ],
  [
    { type: 'reasoning', prompt: 'What should the solver do after a clue fails?', choices: [choice('backtrack', 'Undo that assignment and try the next choice.', true, 'Backtracking preserves only paths that still fit.'), choice('keep', 'Keep it and ignore the clue.', false, 'A broken clue invalidates the branch.'), choice('restart', 'Restart the whole case randomly.', false, 'The solver can rewind only the failed choice.'), choice('guess', 'Choose the most dramatic theory.', false, 'Drama is not a constraint.')] },
    { type: 'mapping', prompt: 'A solver that delegates smaller cases uses ...', choices: [choice('recursion', 'recursion and backtracking', true, 'Recursion handles the next decision; backtracking undoes failures.'), choice('format', 'string formatting', false, 'Formatting does not search arrangements.'), choice('sort', 'sorting only', false, 'Sorting cannot test every constraint.')] },
    { type: 'prompt', prompt: 'Which detective request is strongest?', choices: [choice('specific', 'Try choices; prune failures; explain recursion.', true, 'It defines choices, pruning, and the expected explanation.'), choice('vague', 'Make a mystery solver.', false, 'The search rules are missing.'), choice('code', 'Use recursion.', false, 'It gives a tool without constraints.'), choice('guess', 'Find the culprit fast.', false, 'Speed is not a correctness rule.')] },
    { type: 'reflection', prompt: 'What did this step teach?', choices: [choice('prune', 'Fail fast, undo the branch, and keep searching.', true, 'That is the heart of pruning and backtracking.'), choice('keep', 'A wrong branch may become right later.', false, 'A broken clue cannot be repaired by later choices.'), choice('random', 'Random guesses beat constraints.', false, 'Constraints make the search trustworthy.')] }
  ],
  [
    { type: 'reasoning', prompt: 'What proves the final solution?', choices: [choice('all', 'The one assignment that survives every clue.', true, 'The survivor is stronger than a single hunch.'), choice('quiet', 'The quietest suspect looked nervous.', false, 'Nerves are not a constraint.'), choice('coat', 'The blue coat alone proves everything.', false, 'It matters with the full timeline.'), choice('room', 'Any unverified room proves guilt.', false, 'Unverified claims narrow the case but do not finish it.')] },
    { type: 'mapping', prompt: 'The final explanation should combine ...', choices: [choice('logic', 'evidence, constraints, and a surviving result', true, 'A conclusion connects the clue trail to the solution.'), choice('guess', 'a hunch and a dramatic line', false, 'Tone cannot replace evidence.'), choice('list', 'unrelated Python lists', false, 'The code must match the reasoning.')] },
    { type: 'prompt', prompt: 'Which detective request is strongest?', choices: [choice('specific', 'Explain Iris, the study, and 8:05 pm.', true, 'It asks for a precise, evidence-based explanation.'), choice('vague', 'Reveal the murderer.', false, 'It asks for a result without proof.'), choice('code', 'Print the answer.', false, 'Printing does not explain the constraints.'), choice('short', 'Was it Iris?', false, 'It invites a yes-or-no guess.')] },
    { type: 'reflection', prompt: 'What did this step teach?', choices: [choice('proof', 'Search keeps conclusions fitting every clue.', true, 'The method makes the reveal auditable.'), choice('hunch', 'The best mystery answer is the first hunch.', false, 'The case required several connected clues.'), choice('magic', 'Recursion guesses the truth.', false, 'It systematically searches and rejects.')] }
  ]
];

const slideCopy = [
  ['The storm brings a locked room.', 'Alden Rosewood lies dead in the study.', 'Five suspects had motive. Facts come first.'],
  ['Three witness notes disagree in shape.', 'The clues may still agree in meaning.', 'Clean the seams before judging the words.'],
  ['The notes now share one problem: time.', '8:05. 8.10. 8:12.', 'Make every clock note agree.'],
  ['Five alibis enter the ledger.', 'Witnesses confirm only three rooms.', 'The gaps may speak louder than confidence.'],
  ['The grid holds too many theories.', 'Try one assignment at a time.', 'Reject a branch the moment a clue breaks.'],
  ['The household gathers after the storm.', 'Glass. Study. Blue coat. Five past eight.', 'Only one arrangement survives every clue.']
];

function buildSlides(part, index) {
  const slides = slideCopy[index].map((text, slideIndex) => ({ id: `${part._id}-n${slideIndex + 1}`, kind: 'narrative', title: slideIndex === 0 ? part.partLabel : 'Next clue', text }));
  if (index === 0) slides.push({ id: `${part._id}-characters`, kind: 'characters', title: 'The household', introduces: caseBible.suspects.map((suspect) => suspect.id), characters: caseBible.suspects.map((suspect) => ({ name: suspect.name, role: suspect.role, motive: suspect.motive })) });
  else if (part.caseData) slides.push({ id: `${part._id}-artifact`, kind: 'artifact', title: 'Notes on the desk', caseData: part.caseData });
  slides.push({ id: `${part._id}-concept`, kind: 'concept', title: ['The names on the board', 'Open each note', 'Put the night in order', 'Compare the stories', 'Try a what-if', 'Say what proved it'][index], text: ['Keep the facts where you can see them.', 'Open each note at its speaker mark.', 'Make every clock note easy to compare.', 'Put claims beside what witnesses saw.', 'Try one choice. Undo it when it breaks.', 'Say which clue held up.'][index] });
  const learnerQuestions = [
    [['What should you collect first?', ['Names, rooms, and clues.', 'Accuse someone now.', 'Write the answer now.', 'Ask for gossip.']], ['How should names stay together?', ['Keep one name group.', 'Keep one room only.', 'Use a guess.', 'Throw them away.']], ['Which question helps most?', ['Give facts and ask for steps.', 'Just say help.', 'Give the answer.', 'Ask for magic.']], ['What is the best first move?', ['Lay out the facts.', 'Pick the quiet one.', 'Skip the clues.', 'Trust a hunch.']]],
    [['How do we clean each note?', ['Cut at the speaker mark.', 'Pick the nicest note.', 'Erase odd marks.', 'Read them as-is.']], ['What should each note become?', ['A clear note with fields.', 'A pile of words.', 'A guess.', 'A room.']], ['Which question helps most?', ['Show the cut and the result.', 'Explain the idea.', 'Fix it now.', 'Write anything.']], ['What makes notes easier?', ['Cut, then tidy.', 'Leave them messy.', 'Guess the meaning.', 'Trust punctuation.']]],
    [['How should we place the times?', ['Use one clock style.', 'Use the first shape.', 'Drop the odd one.', 'Read by length.']], ['What comes after one clock style?', ['Put them in order.', 'Make a room.', 'Pick a name.', 'Join the notes.']], ['Which question helps most?', ['Make three times agree.', 'Put these first.', 'Use a clock.', 'Which came first?']], ['What makes the order fair?', ['Same style, then order.', 'Trust the writing.', 'Skip five minutes.', 'Guess the first.']]],
    [['How can we check their stories?', ['Compare rooms side by side.', 'Count the rooms.', 'Pick the surest voice.', 'Join all rooms.']], ['What should the room marks show?', ['Seen, claimed, or both.', 'Only names.', 'One long row.', 'A time.']], ['Which question helps most?', ['Show what matches and does not.', 'Check the stories.', 'Use room marks.', 'Name the liar.']], ['What does a missing match tell us?', ['Someone lacks proof.', 'Confidence proves it.', 'All rooms match.', 'Nothing matters.']]],
    [['What should you do when one choice breaks?', ['Undo it and try again.', 'Keep it anyway.', 'Start at random.', 'Pick the drama.']], ['How should you test a guess?', ['Try one choice at a time.', 'Use a fast guess.', 'Skip the clues.', 'Pick the biggest room.']], ['Which question helps most?', ['Try, check, and undo.', 'Solve it for me.', 'Use a hard word.', 'Go faster.']], ['What keeps a guess honest?', ['Check every clue.', 'Keep the first guess.', 'Trust luck.', 'Ignore a break.']]],
    [['What proves the answer?', ['One choice fits every clue.', 'Someone looked nervous.', 'The coat alone.', 'Any odd room.']], ['What should the ending show?', ['Clues and the answer.', 'A hunch.', 'A dramatic line.', 'Unrelated notes.']], ['Which question helps most?', ['Which clues point to Iris?', 'Tell me who did it.', 'Print the answer.', 'Was it Iris?']], ['What did careful checking do?', ['Kept only a fit.', 'Picked the first guess.', 'Guessed the truth.', 'Made it dramatic.']]]
  ];
  const clearQuestionCopy = [
    [
      { soFar: 'The manor, its rooms, and five names are on the table.', prompt: 'What should you gather before judging anyone?', connectsTo: 'Build a reliable case file', options: ['Gather suspects, rooms, and recorded clues.', 'Accuse the quietest person in the house.', 'Write the final answer before checking clues.', 'Repeat gossip as if it were proof.'] },
      { soFar: 'The five names need one shared place on the board.', prompt: 'How should the five names stay together?', connectsTo: 'Build a reliable case file', options: ['Keep the five names in one ordered group.', 'Keep only the room beside each name.', 'Choose one name and discard the others.', 'Scatter each name across a different note.'] },
      { soFar: 'The facts are ready, but the detective needs a useful request.', prompt: 'Which request gives the detective enough to help?', connectsTo: 'Build a reliable case file', options: ['Compare facts, show steps, and explain the result.', 'Say only that the case feels difficult.', 'Ask for code without sharing the case.', 'Ask the detective to solve everything without details.'] },
      { soFar: 'A clear case file is ready for the first witness notes.', prompt: 'What is the best first move?', connectsTo: 'Build a reliable case file', options: ['Lay out the facts before making a guess.', 'Choose the suspect who looks most nervous.', 'Skip planning and trust the first hunch.', 'Ignore the rooms because names matter more.'] }
    ],
    [
      { soFar: 'Three witness notes describe the same night in different shapes.', prompt: 'How should you clean each witness note?', connectsTo: 'Place witness statements side by side', options: ['Split each note into speaker and clue fields.', 'Keep the raw sentences in alphabetical order.', 'Delete every unusual mark before reading it.', 'Compare the messy notes as written.'] },
      { soFar: 'Each note has a speaker, a time, and a claim.', prompt: 'What should each cleaned note become?', connectsTo: 'Place witness statements side by side', options: ['A clear note with named details for comparison.', 'A loose pile of words with no labels.', 'A guess about which witness is lying.', 'A room name with the other details removed.'] },
      { soFar: 'The seams are visible, so the notes can be compared fairly.', prompt: 'Which request would help clean these notes?', connectsTo: 'Place witness statements side by side', options: ['Show each split and the cleaned result.', 'Explain cleaning without using these witness notes.', 'Write a solution before showing the input.', 'Change every sentence until it sounds convincing.'] },
      { soFar: 'Clean notes now show three times and three places.', prompt: 'What makes these witness notes easier to compare?', connectsTo: 'Place witness statements side by side', options: ['Cut at the seam, then tidy each piece.', 'Leave every note in its original shape.', 'Choose the nicest sounding witness story.', 'Treat punctuation as proof of guilt.'] }
    ],
    [
      { soFar: 'The notes agree on meaning but write the times differently.', prompt: 'How should you put the times in order?', connectsTo: 'Find who was near the study at 8:05', options: ['Use one time format, then order events.', 'Order time words exactly as written.', 'Trust the time that looks earliest.', 'Discard the time with a different mark.'] },
      { soFar: 'The clock notes now speak in one shared format.', prompt: 'What should happen after the times match?', connectsTo: 'Find who was near the study at 8:05', options: ['Place the events from earliest to latest.', 'Turn the events into one room name.', 'Pick the suspect with the longest statement.', 'Join every event into one sentence.'] },
      { soFar: 'A five-minute window may connect the broken glass to the blue coat.', prompt: 'Which request would explain the timeline best?', connectsTo: 'Find who was near the study at 8:05', options: ['Make three times agree, then explain their order.', 'Put times first without changing their formats.', 'Name a clock tool without describing the task.', 'Ask which event feels most suspicious.'] },
      { soFar: 'The ordered times leave a clear gap near the west wing.', prompt: 'What makes the timeline fair to every witness?', connectsTo: 'Find who was near the study at 8:05', options: ['Use one format first, then compare the order.', 'Trust whichever witness sounds most certain.', 'Skip the five-minute gap because it is brief.', 'Guess the first event from the story mood.'] }
    ],
    [
      { soFar: 'The timeline places the study, rose arch, and hall in sequence.', prompt: 'How can you check the five alibi stories?', connectsTo: 'Test which alibi survives the witness accounts', options: ['Compare claimed rooms with rooms witnesses confirmed.', 'Count every room and give claims equal weight.', 'Choose whoever speaks with the most confidence.', 'Merge rooms so no claim can fail.'] },
      { soFar: 'Some rooms were claimed, and some rooms were actually seen.', prompt: 'What should the room comparison show?', connectsTo: 'Test which alibi survives the witness accounts', options: ['Which rooms were claimed, witnessed, or both.', 'Only the suspect names without their rooms.', 'One long row that hides the separate claims.', 'The time of each statement without locations.'] },
      { soFar: 'The gaps between claims and sightings are now visible.', prompt: 'Which request would reveal the mismatch?', connectsTo: 'Test which alibi survives the witness accounts', options: ['Show which room claims match or fail.', 'Ask whether the stories sound believable.', 'Write a room tool without showing accounts.', 'Name the liar before comparing rooms.'] },
      { soFar: 'Several claimed rooms have no witness to confirm them.', prompt: 'What does a missing witness match tell you?', connectsTo: 'Test which alibi survives the witness accounts', options: ['That the claim still lacks independent support.', 'That confidence does not prove a claim.', 'That every room in the story is confirmed.', 'That the missing match has no value.'] }
    ],
    [
      { soFar: 'The alibi gaps leave fewer stories worth testing.', prompt: 'What happens when a choice breaks a clue?', connectsTo: 'Find the only arrangement that fits every clue', options: ['Undo that choice and test the next possibility.', 'Keep the choice and ignore the broken clue.', 'Restart the case with a random choice.', 'Choose the most dramatic theory and continue.'] },
      { soFar: 'One possible arrangement can be tested at a time.', prompt: 'How should you test a new theory?', connectsTo: 'Find the only arrangement that fits every clue', options: ['Try one choice, check clues, and undo failures.', 'Make one fast guess and stop checking.', 'Skip clues until the theory is complete.', 'Choose the largest room and build around it.'] },
      { soFar: 'Testing and undoing keeps a wrong branch from spreading.', prompt: 'Which request would explain this search clearly?', connectsTo: 'Find the only arrangement that fits every clue', options: ['Try choices, reject failures, and explain each return.', 'Ask for a solver without naming its rules.', 'Name a tool without describing the case.', 'Find the culprit without showing any checks.'] },
      { soFar: 'Every failed branch has been removed from the grid.', prompt: 'What keeps the final theory honest?', connectsTo: 'Find the only arrangement that fits every clue', options: ['Check every clue before accepting the surviving theory.', 'Keep the first theory because it was convenient.', 'Trust luck when two stories sound similar.', 'Ignore a broken clue when endings feel right.'] }
    ],
    [
      { soFar: 'The timeline and alibi checks leave one arrangement standing.', prompt: 'What proves the final solution?', connectsTo: 'Show why Iris was in the study at 8:05', options: ['One arrangement fits every clue without a contradiction.', 'The quietest suspect looked nervous at dinner.', 'The blue coat alone proves the whole case.', 'Any room without a witness proves guilt.'] },
      { soFar: 'The last arrangement links Iris, the study, and 8:05.', prompt: 'What should the final explanation bring together?', connectsTo: 'Show why Iris was in the study at 8:05', options: ['The clues, checks, and surviving result.', 'A hunch followed by a dramatic final line.', 'Unrelated code with no case connection.', 'The loudest accusation and the first guess.'] },
      { soFar: 'The detective needs a precise account, not a dramatic accusation.', prompt: 'Which request would explain the verdict clearly?', connectsTo: 'Show why Iris was in the study at 8:05', options: ['Explain Iris, the study, and 8:05 using clues.', 'Reveal the culprit without explaining the proof.', 'Print the answer without naming conditions.', 'Ask whether Iris seems suspicious.'] },
      { soFar: 'The case has been checked from the first note to the last.', prompt: 'What did careful checking accomplish?', connectsTo: 'Show why Iris was in the study at 8:05', options: ['It kept only the arrangement fitting every clue.', 'It picked the story\'s first suspect.', 'It guessed from a nervous expression.', 'It made the ending dramatic without testing it.'] }
    ]
  ];
  questionSets[index].forEach((question, questionIndex) => {
    const copy = clearQuestionCopy[index][questionIndex];
    const slideId = `${part._id}-q${questionIndex}`;
    const sourceChoices = question.choices.length === copy.options.length
      ? question.choices
      : [...question.choices, choice('detail', copy.options[3], false, 'The case still needs a more useful check.')];
    const choices = sourceChoices.map((item, choiceIndex) => {
      const optionLead = copy.options[choiceIndex].split(/\s+/).slice(0, 3).join(' ');
      return { ...item, text: copy.options[choiceIndex], feedback: item.correct ? `Because "${optionLead}" fits here.` : `Because "${optionLead}" needs another check.` };
    });
    slides.push({ id: slideId, kind: 'question', questionType: question.type, title: 'Your next move', soFar: copy.soFar, connectsTo: copy.connectsTo, prompt: copy.prompt, choices: shuffleChoices(choices, slideId, index * 4 + questionIndex) });
  });
  if (index >= 1 && index <= 4) {
    slides.push({
      id: `${part._id}-closed`,
      kind: 'code-reveal',
      isCodeReveal: true,
      title: 'Case file closed',
      storyRecap: [
        'You opened each messy note at the seam to separate speaker and clue.',
        'You normalized mixed clock formats and lined up the night in order.',
        'You compared claimed rooms with witnessed rooms to expose the alibi gaps.',
        'You tested each room arrangement and backtracked the moment a clue broke.'
      ][index - 1],
      conceptName: [
        'String parsing',
        'Datetimes & sorting',
        'Sets & set difference',
        'Recursion & backtracking'
      ][index - 1],
      analogy: [
        'Like finding the seam on an envelope to open it cleanly.',
        'Like synchronizing watches before setting off on a schedule.',
        'Like checking two guest books to see who never arrived.',
        'Like trying keys in a lock and putting back the ones that stick.'
      ][index - 1],
      code: part.idealSolution
    });
  }
  if (index === 5) slides.push({ id: `${part._id}-reveal`, kind: 'reveal', title: 'The reveal', text: 'Iris used the slow clock and thread; blue coat marks her exit.' });
  if (index === 5) slides.push({
    id: `${part._id}-debrief`,
    kind: 'debrief',
    title: 'How you cracked it',
    recapRows: [
      { partId: 'rosewood-part-1', title: 'The Messy Notes', conceptName: 'String parsing' },
      { partId: 'rosewood-part-2', title: 'What Happened When', conceptName: 'Datetimes & sorting' },
      { partId: 'rosewood-part-3', title: 'Stories That Don\'t Match', conceptName: 'Sets & set difference' },
      { partId: 'rosewood-part-4', title: 'Narrowing It Down', conceptName: 'Recursion & backtracking' }
    ]
  });
  return slides;
}

const caseParts = [
  {
    _id: 'rosewood-part-0',
    storyId: 'rosewood-manor',
    order: 0,
    nextScenarioId: 'rosewood-part-1',
    title: 'Rosewood Manor: The Case Opens',
    partLabel: 'The Case Opens',
    difficulty: 'Advanced',
    concepts: ['reading', 'logic'],
    context: `Rosewood Manor stood dark against the storm on the night Alden Rosewood died. Alden, sixty-eight, was the manor's owner — a self-made and famously ruthless collector of art, debts, and secrets, who had called the household to dinner to announce changes to his will. At five past eight a sound of breaking glass came from the study; when the door was forced, Alden lay dead beside his overturned desk, and the room had been locked from the inside. Before weighing a single clue, the detective asks you, the assistant, to meet the people beneath this roof. Mina Rosewood, his niece and ward, whose allowance Alden had threatened to cut off only that week. Dev Ashcombe, his business partner, ruined by a deal Alden blamed on him. Iris Vale, his quiet private secretary, who kept the house's every secret — including one Alden held over her. Ronan Rosewood, his estranged son, struck from the will years ago and returned uninvited. And Pia Rosewood, his much-younger wife, whom he had lately spoken of divorcing. Below stairs wait the witnesses: Mrs. Vale, the longtime housekeeper and Iris's mother; Tom, the gardener; and Adeline, the live-in nurse. Five suspects, one locked room, and a single night to set in order. Begin, as any careful mind must, by gathering the facts.`,
    prompt: 'Before any code is written, what should the assistant collect first so the investigation can proceed in proper order?',
    objectives: ['Notice the suspects and setting', 'Treat the case as a sequence of clues', 'Prepare to work step by logical step'],
    sampleReasoning: 'I would start by listing the suspects, the rooms, and the important clues so the detective can examine the facts in order.',
    effectivenessScore: 99,
    idealSolution: `# Gather the known people and places\ndef gather_facts():  # Collect suspects and rooms\n    suspects = [  # List of five suspects\n        "Mina", "Dev", "Iris", "Ronan", "Pia"  # Names\n    ]  # Close suspect list\n    rooms = ["study", "library", "hall"]  # Key rooms\n    return {"suspects": suspects, "rooms": rooms}  # Facts\n\n# Inspect the initial case details\ncase_board = gather_facts()  # Build starting facts\ncount = len(case_board["suspects"])  # Count suspects\nprint("Suspect count:", count)  # Output total`,
    subSteps: [
      {
        id: 'p0-s1',
        kind: 'story',
        title: 'Meet the household',
        body: [
          'The detective sets five photographs on the hall table, face up. "Mina. Dev. Iris. Ronan. Pia," she says, tapping each one. "Everyone in this house wanted something from Alden Rosewood. Before tonight ends, one of them will have taken everything."'
        ]
      },
      {
        id: 'p0-s2',
        kind: 'primer',
        title: 'Order before deduction',
        body: [
          '"A careless mind leaps at the answer," the detective says. "A careful one lays out what it knows." In your notebook, that means keeping facts in named collections rather than loose thoughts — a list you can point at, count, and cross off.',
          'Nothing here is judged yet. Tonight we only gather.'
        ],
        snippet: `suspects = ["Mina", "Dev", "Iris", "Ronan", "Pia"]\nrooms = ["study", "library", "conservatory", "music room", "gallery"]`
      },
      {
        id: 'p0-s3',
        kind: 'reasoning',
        title: 'What must be gathered first?'
      },
      {
        id: 'p0-s4',
        kind: 'code',
        title: 'Your case ledger takes shape'
      },
      {
        id: 'p0-s5',
        kind: 'connect',
        title: 'The board is set',
        body: [
          'Five names now hang on the evidence board, and beneath them, the shape of the night: a locked study, broken glass, a dinner called to rewrite a will.',
          'You have not accused anyone yet — and that is precisely the point. A case solved in proper order begins with facts laid end to end. The witnesses are waiting to be heard.'
        ]
      }
    ]
  },
  {
    _id: 'rosewood-part-1',
    storyId: 'rosewood-manor',
    order: 1,
    nextScenarioId: 'rosewood-part-2',
    title: 'Rosewood Manor: The First Statements',
    partLabel: 'The Messy Notes',
    difficulty: 'Advanced',
    concepts: ['strings', 'parsing'],
    context: `With the household known to you, the detective lays three witness notes on the table — a word from Mrs. Vale the housekeeper, another from Tom the gardener, and a third from Adeline, the nurse who sat with Alden each evening. None can be trusted until it is set in order, for the notes are messy: full of nicknames, stray punctuation, and uneven spacing. Nothing is judged, the detective reminds you, until it is placed in proper form.`,
    prompt: 'How would you turn the messy witness strings into clean records before you compare the clues?',
    objectives: ['Split one statement into fields', 'Trim extra punctuation and spaces', 'Store each clue in a structured record'],
    sampleReasoning: 'I would split each line into speaker, time, and clue so the statements are easy to compare later.',
    effectivenessScore: 98,
    idealSolution: `# Cut each note at the speaker mark\ndef parse_statement(note):  # Clean one statement line\n    clean = note.replace(" - ", ": ", 1)  # Fix dash mark\n    speaker, _, quote = clean.partition(":")  # Split at colon\n    clue = quote.strip().strip("'\\"")  # Strip outer quotes\n    res = {"speaker": speaker.strip()}  # Speaker record\n    res["clue"] = clue  # Add clue field\n    return res  # Return clean record\n\n# Test the cleaner on witness notes\nwitness_notes = [  # List of raw witness statements\n    "Mrs. Vale: 'Glass broke at 8:05 pm.'",  # Note 1\n    "Tom - 'Blue coat at rose arch at 8:10.'",  # Note 2\n]  # Close statement list\nfor note in witness_notes:  # Step through every note\n    print(parse_statement(note))  # Print structured record`,
    caseData: {
      witnessStatements: [
        "Mrs. Vale: 'Glass broke by the study at 8:05 pm.'",
        "Tom: 'A blue coat passed the rose arch at 8:10 pm.'",
        "Nurse Adeline says:   'The hall clock read 8:12 when the lights flickered.'",
        "Mrs. Vale admits: 'I saw Iris enter at 8:02, but hid it.'"
      ]
    },
    subSteps: [
      {
        id: 'p1-s1',
        kind: 'story',
        title: 'Three notes, three hands',
        body: [
          'Mrs. Vale writes in a housekeeper\'s neat hand but signs herself formally. Tom spells phonetically and separates his words with dashes. Nurse Adeline pads her lines with nervous spaces. Three accounts — and not one writes like the others.',
          'Spread side by side, the notes refuse to line up. The detective slides them toward you. "Clean these. I don\'t care how they arrived. I care what they say."'
        ]
      },
      {
        id: 'p1-s2',
        kind: 'primer',
        title: 'Every statement has a seam',
        body: [
          'Look closely at any note: there is always a natural seam where the speaker ends and the clue begins — usually a colon, sometimes a dash. Find the seam once, and every note can be opened the same way.',
          'In Python, partition() cuts a string at its first seam and hands back the pieces; strip() trims the ragged edges left over. That is all "parsing" means here: find the seam, split, tidy. No magic — just careful scissors work.'
        ],
        snippet: `line = "Mrs. Vale: 'At 8:05 pm I heard glass break.'"\nspeaker, _, quote = line.partition(":")\nprint(speaker.strip())   # Mrs. Vale`
      },
      {
        id: 'p1-s3',
        kind: 'reasoning',
        title: 'Turn mess into records'
      },
      {
        id: 'p1-s4',
        kind: 'code',
        title: 'Statements in proper form'
      },
      {
        id: 'p1-s5',
        kind: 'connect',
        title: 'The notes agree at last',
        body: [
          'Cleaned and aligned, the three statements finally sit level on the desk: glass at five past eight, a blue coat by the rose arch at ten past, lights faltering at twelve past.',
          'One suspect has moved into view already — someone was near the rose arch between those sounds. But times written by three different hands cannot yet be trusted to order. The clock itself must be interrogated next.'
        ]
      }
    ]
  },
  {
    _id: 'rosewood-part-2',
    storyId: 'rosewood-manor',
    order: 2,
    nextScenarioId: 'rosewood-part-3',
    title: 'Rosewood Manor: Sorting the Timeline',
    partLabel: 'What Happened When',
    difficulty: 'Advanced',
    concepts: ['datetime', 'sorting'],
    context: `The three statements now read plainly, yet each carries a time in its own careless format — one written with a colon, one with a full stop, one bare of any mark at all. The detective taps the hall clock and observes that time itself does not lie; only the records of it do. Until every moment is written the same way and set in sequence, the true order of that evening — Mrs. Vale's breaking glass, the blue coat by the rose arch, Adeline's flickering lights — stays hidden.`,
    prompt: 'How would you normalize those times and sort the events from earliest to latest?',
    objectives: ['Normalize time text', 'Convert each value to the same comparable format', 'Sort the timeline in order'],
    sampleReasoning: 'I would turn every time into one standard datetime value first, then sort the events by time.',
    effectivenessScore: 97,
    idealSolution: `# Import the clock parser tool\nfrom datetime import datetime  # Tool to parse time text\n\n# Normalize and sort the times\ndef sort_timeline(times):  # Order events chronologically\n    def to_clock(text):  # Standardize single time string\n        clean = text.replace(".", ":")  # Change dot to colon\n        clean = clean.upper().replace(" ", "")  # Strip space\n        return datetime.strptime(clean, "%I:%M%p")  # Datetime\n    return sorted(times, key=to_clock)  # Sort by clock order\n\n# Replay the evening in sequence\nstudy_clock = ["8:12 pm", "8:05 pm", "8.10 PM"]  # Statements\nprint(sort_timeline(study_clock))  # Display sorted times`,
    subSteps: [
      {
        id: 'p2-s1',
        kind: 'story',
        title: 'The clock is questioned',
        body: [
          'The detective carries the cleaned statements to the grandfather clock in the hall and reads each time aloud: "eight oh-five p m... eight point one zero capital P M... eight colon twelve pm." She lets the inconsistency hang in the air.',
          '"Time did not write these," she says. "People did. And people are careless. We will teach their words to agree — then, and only then, may the evening be replayed in order."'
        ]
      },
      {
        id: 'p2-s2',
        kind: 'primer',
        title: 'Comparable before sortable',
        body: [
          'Here is the trap: "8:05 pm" and "8.10 PM" are both perfectly readable to a person, but to a machine they are just different shapes of ink. You cannot sort what you cannot compare.',
          'So the work happens in two moves. First, normalize — scrub every variation into one agreed form (a real datetime value). Second, sort — which becomes trivial once every item speaks the same language. Notice how sorting was never the hard part; agreement was.'
        ],
        snippet: `"8.10 PM".replace(".", ":").upper().replace(" ", "")\n# -> "8:10PM"   ...one agreed shape, ready for strptime()`
      },
      {
        id: 'p2-s3',
        kind: 'story',
        title: 'Replay the seven minutes',
        body: [
          'Set in sequence, the night compresses into seven telling minutes: the glass breaks at 8:05, the blue coat crosses the rose arch at 8:10, the hall lights shudder at 8:12.',
          'Whoever broke the glass had five minutes alone near that wing before anyone stirred. The detective circles the interval twice. "This gap is where our answer lives."'
        ]
      },
      {
        id: 'p2-s4',
        kind: 'reasoning',
        title: 'Make the times tell the truth'
      },
      {
        id: 'p2-s5',
        kind: 'code',
        title: 'The evening, in order'
      },
      {
        id: 'p2-s6',
        kind: 'connect',
        title: 'Five minutes of shadow',
        body: [
          'The timeline now stands in the detective\'s hand like a confession waiting for a name. Glass at 8:05. Blue coat at 8:10. Flickering lights at 8:12.',
          'You have converted chaos into sequence — and sequence has already bought you something: a five-minute window in the west wing that no innocent explanation has yet claimed. Next, the alibis. Gaps in them will do what none of the confident voices will: speak.'
        ]
      }
    ]
  },
  {
    _id: 'rosewood-part-3',
    storyId: 'rosewood-manor',
    order: 3,
    nextScenarioId: 'rosewood-part-4',
    title: 'Rosewood Manor: Alibi Gaps',
    partLabel: "Stories That Don't Match",
    difficulty: 'Advanced',
    concepts: ['sets', 'comparison'],
    context: `One by one the detective questions the five who had reason to wish Alden gone. Mina speaks of the conservatory and the kitchen; Dev swears he never left the library; Iris allows that she crossed the front hall and looked into the study; Ronan insists he stayed among the instruments in the music room; and Pia says she lingered in the gallery until the alarm. Set against the rooms a witness could actually vouch for, it is the gaps — the rooms no one saw them in — that speak louder than any suspect's confident tone.`,
    prompt: 'How can you compare the suspect claims against the witnessed rooms to find contradictions?',
    objectives: ['Build two sets of evidence', 'Find overlap and difference', 'Spot which claim cannot be true'],
    sampleReasoning: 'I would compare the claimed rooms with the witnessed rooms and flag any room that appears in one set but not the other.',
    effectivenessScore: 96,
    idealSolution: `# Find claims without witness support\ndef unverified_rooms(seen, claimed):  # Locate alibi gaps\n    unseen = set(claimed) - set(seen)  # Subtract seen rooms\n    return sorted(unseen)  # Return missing rooms in order\n\n# Compare the manor room lists\nwitnessed = ["study", "front hall", "library"]  # Seen rooms\nclaimed = [  # All rooms claimed by suspects\n    "conservatory", "kitchen", "library",  # First set\n    "front hall", "study", "gallery"  # Second set\n]  # Close claimed list\nprint(unverified_rooms(witnessed, claimed))  # Print gaps`,
    caseData: {
      suspectClaims: [
        { suspect: 'Mina', claim: 'I was in the conservatory and kitchen after 8:00.' },
        { suspect: 'Dev', claim: 'I stayed in the library the whole time.' },
        { suspect: 'Iris', claim: 'I checked the front hall, then the study.' },
        { suspect: 'Ronan', claim: 'I never left the music room.' },
        { suspect: 'Pia', claim: 'I was in the gallery until the alarm rang.' }
      ],
      comparisonSets: {
        witnessedRooms: ['study', 'front hall', 'library'],
        claimedRooms: ['conservatory', 'kitchen', 'library', 'front hall', 'study', 'music room', 'gallery']
      }
    },
    subSteps: [
      {
        id: 'p3-s1',
        kind: 'story',
        title: 'Five voices, five certainties',
        body: [
          'One at a time they give their accounts, and not one of them hesitates. Mina among her plants. Dev behind library doors. Iris brisk in the front hall. Ronan with the instruments. Pia drifting through the gallery.',
          'The detective writes nothing down while they speak. Afterwards she says: "Notice how certain they all were. Certainty is cheap. What matters is which of those rooms anyone else could swear to."'
        ]
      },
      {
        id: 'p3-s2',
        kind: 'primer',
        title: 'What overlaps tells the truth',
        body: [
          'Claims come in lists; truth lives in the comparison. Put every claimed room in one pile and every witnessed room in another — then stop reading the piles and start reading the space between them.',
          'A set difference answers one question cleanly: which claimed rooms appear in no witness account at all? Those rooms are where alibis go to die. Two piles, one subtraction, and the confident tones stop mattering.'
        ],
        snippet: `witnessed = {"study", "front hall", "library"}\nclaimed = {"music room", "gallery", "kitchen", ...}\nunverified = claimed - witnessed   # rooms no one saw anyone in`
      },
      {
        id: 'p3-s3',
        kind: 'reasoning',
        title: 'Let the gaps testify'
      },
      {
        id: 'p3-s4',
        kind: 'code',
        title: 'Where the alibis thin out'
      },
      {
        id: 'p3-s5',
        kind: 'connect',
        title: 'Two theories eliminated',
        body: [
          'The subtraction is merciless. The conservatory, kitchen, music room, and gallery — every one of them claimed, none of them witnessed. Four alibis now rest on rooms where no witness can place a soul.',
          'But look at the other edge of the blade: only Iris willingly places herself near the study — the room where Alden died. Two comfortable theories have just been eliminated, and three suspects remain standing. The manor is getting smaller.'
        ]
      }
    ]
  },
  {
    _id: 'rosewood-part-4',
    storyId: 'rosewood-manor',
    order: 4,
    nextScenarioId: 'rosewood-part-5',
    title: 'Rosewood Manor: The Constraint Solver',
    partLabel: 'Narrowing It Down',
    difficulty: 'Advanced',
    concepts: ['recursion', 'backtracking'],
    context: `Now the detective spreads the whole affair out as a grid: the five suspects — Mina, Dev, Iris, Ronan, and Pia — set against five rooms, five possible weapons, and five recorded times, with a short list of clues that any true answer must satisfy. There is nothing for it but patience: try one arrangement, test it against every clue, and the instant a single fact refuses to fit, set that theory aside without drama and try the next.`,
    prompt: 'How would you write a recursive solve() function that tries one assignment at a time and backtracks when a clue fails?',
    objectives: ['Model the constraints', 'Try one option at a time', 'Undo bad choices when a path fails'],
    sampleReasoning: 'I would choose one suspect-room-weapon-time combination, check every clue, and backtrack as soon as a choice breaks a rule.',
    effectivenessScore: 95,
    idealSolution: `# Check if room fits the clues\ndef fits_clues(suspect, room):  # Check known clue rules\n    if room == "study" and suspect == "Ronan":  # Rule check\n        return False  # Ronan was seen outside study\n    return True  # Room is consistent with clues\n\n# Try rooms and backtrack on breaks\ndef solve(suspects, rooms, plan):  # Recursive assignment\n    if not suspects:  # When every suspect has a room\n        return plan  # Return consistent assignment\n    suspect = suspects[0]  # Take the next suspect\n    for room in rooms:  # Test each remaining room\n        if fits_clues(suspect, room):  # If clues allow\n            plan[suspect] = room  # Tentatively place suspect\n            rem = rooms - {room}  # Remaining room options\n            res = solve(suspects[1:], rem, plan)  # Recurse\n            if res:  # If valid path found\n                return res  # Return solved arrangement\n            plan.pop(suspect)  # Backtrack failed placement\n    return None  # No valid combination found\n\n# Run the solver for the suspects\nsuspect_list = ["Mina", "Dev", "Iris"]  # Suspect list\nroom_pool = {"study", "library", "hall"}  # Open rooms\nprint(solve(suspect_list, room_pool, {}))  # Output match`,
    starterCode: "def solve(assignments, remaining_suspects, remaining_rooms, remaining_weapons, remaining_times):\n    if len(assignments) == 5:\n        return assignments\n\n    for suspect in list(remaining_suspects):\n        for room in list(remaining_rooms):\n            for weapon in list(remaining_weapons):\n                for time in list(remaining_times):\n                    candidate = {\n                        'suspect': suspect,\n                        'room': room,\n                        'weapon': weapon,\n                        'time': time,\n                    }\n\n                    if not respects_clues(candidate, assignments):\n                        continue\n\n                    assignments.append(candidate)\n                    result = solve(\n                        assignments,\n                        remaining_suspects - {suspect},\n                        remaining_rooms - {room},\n                        remaining_weapons - {weapon},\n                        remaining_times - {time},\n                    )\n                    if result:\n                        return result\n                    assignments.pop()\n\n    return None",
    caseData: {
      grid: {
        suspects: ['Mina', 'Dev', 'Iris', 'Ronan', 'Pia'],
        rooms: ['study', 'library', 'conservatory', 'music room', 'gallery'],
        weapons: ['letter opener', 'candlestick', 'rope', 'statue fragment', 'silver knife'],
        times: ['8:02 pm', '8:05 pm', '8:07 pm', '8:10 pm', '8:12 pm']
      },
      clues: [
        'The blow happened in the study after the first glass break.',
        'The blue coat was seen near the rose arch at 8:10 pm.',
        'The study clock runs ten minutes slow.',
        'The service thread could lock the study after an exit.',
        'The suspect in the library did not wear the blue coat.',
        'The corrected will would remove Iris\'s protection.'
      ]
    },
    subSteps: [
      {
        id: 'p4-s1',
        kind: 'story',
        title: 'Too many theories for one mind',
        body: [
          'The detective rules a grid across half the desk: five suspects down the side, and across the top — five rooms, five weapons, five recorded times. Five names crossed with fifteen possibilities. She does not bother counting the arrangements aloud; the number is absurd, and it is meant to be.',
          '"No one solves a mansion in one leap," she says. "We solve it the way it was made: one decision at a time. Start with a single suspect. Give them a room. See if the night survives that much."'
        ]
      },
      {
        id: 'p4-s2',
        kind: 'primer',
        title: 'One choice at a time',
        body: [
          'Here is the whole trick, and it fits in a sentence: solve the case for one suspect, then hand the smaller case — same rules, one fewer suspect, one fewer room — to another detective exactly like yourself.',
          'That hand-off is what a recursive call is. Each call makes one placement and delegates the rest; when the final call receives an empty list of suspects, there is nothing left to decide, and it reports success. You never wrote a plan for five suspects. You wrote a plan for one, plus the courage to delegate.'
        ],
        snippet: `def solve(assignments, suspects, rooms):\n    if not suspects:              # nobody left to place: done\n        return assignments\n    suspect = suspects[0]\n    for room in rooms:            # try ONE placement...\n        result = solve(assignments + [{"suspect": suspect, "room": room}],\n                       suspects[1:], rooms - {room})   # ...then delegate\n        if result:\n            return result\n    return None`
      },
      {
        id: 'p4-s3',
        kind: 'primer',
        title: 'When to abandon a theory',
        body: [
          'Now suppose the very first placement — Mina in the study — already puts the rope in the study. Clue three says the rope never entered that room. Does it matter that four more placements might have worked out beautifully? No. The theory is dead at its first fact.',
          'Abandoning a branch the instant it contradicts a clue is called pruning, and it is the entire reason this method finishes before dawn. Check early, fail fast, erase quietly — assignments.pop() is the sound of a theory being withdrawn without drama. What remains after every dead branch is pruned can only be the truth.'
        ],
        snippet: `if not respects_clues(candidate, assignments):\n    continue          # prune: this theory died at its first broken clue\nassignments.append(candidate)\nresult = solve(...)\nif result: return result\nassignments.pop()     # unwind the failed theory, try the next room`
      },
      {
        id: 'p4-s4',
        kind: 'reasoning',
        title: 'Write the solver\'s method'
      },
      {
        id: 'p4-s5',
        kind: 'code',
        title: 'The grid, exhausted honestly'
      },
      {
        id: 'p4-s6',
        kind: 'connect',
        title: 'One arrangement still stands',
        body: [
          'Branch by branch, the grid collapsed: every arrangement that put the rope in the study withered at clue three; every theory that left the library figure in a blue coat died at clue four. Hundreds of theories were born and buried in the time it took to pour the tea.',
          'Exactly one arrangement survived every clue at once — and it points, unfashionably, at the quietest person in the house. The detective reaches for the drawing-room bell. It is time to gather everyone and say it aloud.'
        ]
      }
    ]
  },
  {
    _id: 'rosewood-part-5',
    storyId: 'rosewood-manor',
    order: 5,
    nextScenarioId: null,
    title: 'Rosewood Manor: Case Solved',
    partLabel: 'The Reveal',
    difficulty: 'Advanced',
    concepts: ['reflection', 'recursion'],
    context: `The storm has passed, and the household is gathered once more in the drawing room — Mina and Ronan, Dev and Pia, and Iris quietest of all. Calmly, and in order, the detective retraces the single thread that held: the breaking glass at five past eight, the study locked from within, the figure in the blue coat by the rose arch, and the one alibi that could not survive them all. Every wrong turn had been discarded along the way, and what remained could only be the truth.`,
    prompt: 'In one or two sentences, what clue proved the case and how did the step-by-step search keep the answer honest?',
    objectives: ['Restate the decisive clue', 'Connect the clue to the final solution', 'Reflect on the value of orderly reasoning'],
    sampleReasoning: 'The case turned on the blue coat witness and the study timing. The recursive search worked because it rejected any assignment that broke a clue and kept only the path that fit all of them.',
    effectivenessScore: 94,
    idealSolution: `# Format the decisive case finding\ndef summarize_case(clue, guilty):  # Case conclusion summary\n    return f"Guilty: {guilty}. Key clue: {clue}"  # Summary\n\n# Output the final case deduction\nproof = "blue coat at 8:10 pm"  # Decisive clue sighting\nprint(summarize_case(proof, "Iris Vale"))  # Final reveal`,
    reveal: `The corrected clock puts Iris Vale in the study at 8:05. She used the service door and a hidden curtain thread to pull the locked door shut after leaving. Tom's blue coat sighting at 8:10, Mrs. Vale's protective lie, the missing corrected will, and Alden's threat all point to Iris. The room looked impossible only because its clock and exit were misread.`,
    subSteps: [
      {
        id: 'p5-s1',
        kind: 'story',
        title: 'The drawing room gathers',
        body: [
          'Rain still ticks against the windows as the household assembles — Mina pale, Dev composed, Ronan insolent, Pia restless, and Iris with her hands folded, watching the carpet.',
          'The detective stands with her back to the cold fireplace and begins, unhurried, at five past eight.'
        ]
      },
      {
        id: 'p5-s2',
        kind: 'reasoning',
        title: 'Name what proved the case'
      },
      {
        id: 'p5-s3',
        kind: 'code',
        title: 'The verdict, stated plainly'
      },
      {
        id: 'p5-s4',
        kind: 'connect',
        title: 'The reveal',
        body: [],
        revealOnly: true
      },
      {
        id: 'p5-s5',
        kind: 'recap',
        title: 'Skills you used to crack this case',
        body: [
          'Only now, with the case closed, does it deserve saying: you did not merely follow a story — you worked like a programmer.',
          'Parsing turned messy testimony into clean records. Normalizing and sorting datetimes rebuilt the true order of the night. Set differences exposed the alibi gaps. Recursion with pruning searched an impossible grid and kept only what survived every clue. Each one was discovered in service of the case — which is exactly how the best knowledge is kept.'
        ]
      }
    ]
  }
];

// Additive leaderboard data. Scores are authored from existing clues, never
// inferred by the client; store.js passes this unknown field unchanged.
const evidenceEvents = [
  { partIndex: 0, slideIndex: 3, slideSuffix: 'characters', trigger: 'reach', label: 'The household', clueId: 'clue-household', clueText: 'Five motives establish the opening board.', connectsTo: ['dev', 'mina', 'iris', 'ronan', 'pia'], effects: [{ suspectId: 'dev', delta: 0, reason: 'Five motives establish the opening board.' }] },
  { partIndex: 1, slideIndex: 3, slideSuffix: 'artifact', trigger: 'reach', label: 'The witness notes', clueId: 'clue-torn-will', clueText: 'Ronan tore a page, but stayed from the study.', connectsTo: ['ronan', 'dev'], effects: [{ suspectId: 'dev', delta: 10, reason: 'The overheard argument makes Dev lead early.' }, { suspectId: 'iris', delta: 16, reason: 'Iris is placed near the study.' }, { suspectId: 'mina', delta: -8, reason: 'No witness backs Mina\'s note.' }] },
  { partIndex: 2, slideIndex: 4, slideSuffix: 'concept', trigger: 'reach', label: 'The clock correction', clueId: 'clue-clock', clueText: 'The study clock runs ten minutes slow.', connectsTo: ['iris', 'dev'], effects: [{ suspectId: 'iris', delta: 12, reason: 'The corrected clock places Iris in the study window.' }, { suspectId: 'dev', delta: -20, reason: 'The corrected timeline weakens Dev\'s argument.' }] },
  { partIndex: 3, slideIndex: 3, slideSuffix: 'artifact', trigger: 'reach', label: 'The protective lie', clueId: 'clue-protective-lie', clueText: 'Mrs. Vale hid Iris\'s study visit.', connectsTo: ['mina', 'ronan', 'pia', 'iris'], effects: [{ suspectId: 'mina', delta: -35, cleared: true, reason: 'Witnesses cannot confirm Mina\'s rooms.' }, { suspectId: 'ronan', delta: -34, cleared: true, reason: 'The torn will page does not place Ronan in the study.' }, { suspectId: 'pia', delta: -32, cleared: true, reason: 'The gallery claim is unverified.' }, { suspectId: 'dev', delta: -10, reason: 'The room comparison breaks Dev\'s timing.' }, { suspectId: 'iris', delta: 5, reason: 'Mrs. Vale\'s protective lie puts Iris back in play.' }] },
  { partIndex: 4, slideIndex: 4, slideSuffix: 'concept', trigger: 'reach', label: 'The service thread', clueId: 'clue-service-thread', clueText: 'A hidden thread could lock the study after an exit.', connectsTo: ['dev', 'iris'], effects: [{ suspectId: 'dev', delta: -52, cleared: true, reason: 'The service-door clue clears Dev.' }, { suspectId: 'iris', delta: 15, reason: 'The hidden thread fits Iris\'s exit.' }] },
  { partIndex: 5, slideIndex: 8, slideSuffix: 'reveal', trigger: 'reach', label: 'The final proof', clueId: 'clue-hidden-motive', clueText: 'The hidden motive and corrected will leave Iris at 100.', connectsTo: ['iris'], effects: [{ suspectId: 'iris', delta: 9, reason: 'The motive, clock, coat, and thread prove Iris.' }] }
];

module.exports = caseParts.map((part, index) => ({
  ...part,
  idealSolution: commentCode(part.idealSolution),
  slides: buildSlides(part, index),
  evidenceEvents: evidenceEvents.filter((event) => event.partIndex === index).map((event) => ({
    id: `rosewood-evidence-${index}`,
    label: event.label,
    clueId: event.clueId,
    slideId: `${part._id}-${event.slideSuffix}`,
    slideIndex: index * 20 + event.slideIndex,
    trigger: event.trigger,
    clueText: event.clueText,
    connectsTo: event.connectsTo,
    effects: event.effects
  }))
}));
