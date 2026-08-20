export const SKILL_FEEDBACK = {
  q1: {
    skill: 'Predicting loop output',
    why: 'It’s easy to lose track of which value i holds on the very last pass through the loop.',
    improve: 'Write out every value the loop variable takes, one per line, before predicting the final print.',
    practice: 'Replay the Iteration Theater and narrate each day out loud as it plays.'
  },
  q2: {
    skill: 'Spotting off-by-one mistakes in range()',
    why: 'range(start, stop) never includes stop — it’s one of the most common surprises in Python.',
    improve: 'When a loop is missing its last expected value, check whether stop needs to be one higher.',
    practice: 'Open the Interactive Loop Visualizer and slide stop up and down while watching which values disappear.'
  },
  q3: {
    skill: 'Using a negative step to count backward',
    why: 'A negative step is the one part of range() that doesn’t look like normal counting.',
    improve: 'Remember: step controls direction too — negative means "count down," and stop still marks where to halt just short of.',
    practice: 'Try the "Countdown" template in the Coding Playground and change the step value.'
  },
  q4: {
    skill: 'Understanding loop structure and order',
    why: 'A while loop only works if the condition check, the loop body, and the update to the loop variable are all in the right relative order.',
    improve: 'Before writing a while loop, say the four parts out loud in order: start value, condition, body, update.',
    practice: 'Revisit Stage 4 of the Garden Rescue mission (the bloom countdown) and read the working version line by line.'
  },
  q5: {
    skill: 'Counting how many times a loop with a step actually runs',
    why: 'With a step other than 1, the iteration count isn’t simply stop − start — you have to account for the step size.',
    improve: 'List out the actual values range() will produce first; the count is just how many values are in that list.',
    practice: 'Use the Interactive Loop Visualizer with a non-1 step and watch the live iteration counter.'
  },
  q6: {
    skill: 'Tracking an accumulating total across iterations',
    why: 'A running total depends on every prior iteration — losing track of even one pass throws off the final answer.',
    improve: 'Track the total after every single iteration on paper: 0, then +4, then +4, then +4.',
    practice: 'Re-run Stage 1 of the mission (Watering Can Count) through the Coding Playground’s step-through view.'
  },
  q7: {
    skill: 'Spotting an infinite loop',
    why: 'The loop condition looked fine at a glance — the real problem was that the loop variable never actually changed.',
    improve: 'For every while loop, check specifically: is there a line that changes the variable the condition depends on?',
    practice: 'Try the "Fix Wrong Loop" idea yourself: write a while loop, then deliberately break it by removing the update line and watch it hang (safely capped) in the Playground.'
  },
  q8: {
    skill: 'Correcting a shifted range()',
    why: 'When a loop’s output is shifted by exactly one in every value, the fix is almost always in start or stop, not the loop body.',
    improve: 'If every printed number is one higher than expected, lower start by one; if the last value is missing, raise stop by one.',
    practice: 'Open the Interactive Loop Visualizer and deliberately shift start to see the effect.'
  },
  q9: {
    skill: 'Writing a complete loop program from scratch',
    why: 'Combining a loop, a calculation, and output into one working program is the biggest jump in this module — it’s where everything comes together.',
    improve: 'Break it into two moves: figure out the calculation for one value first, then wrap it in a loop.',
    practice: 'Redo the Coding Playground with the Blank template and build a similar program unaided.'
  },
  q10: {
    skill: 'Choosing between for and while',
    why: 'It’s easy to reach for whichever loop you used most recently instead of the one that fits the problem.',
    improve: 'Ask: "do I know exactly how many times before I start?" If yes, for. If it depends on a condition, while.',
    practice: 'No replay needed — this one is quick to fix by habit alone.'
  }
};
