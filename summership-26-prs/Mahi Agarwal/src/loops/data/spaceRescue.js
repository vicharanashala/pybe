// One continuously-growing program across 8 stages — nothing resets, each stage adds
// to the same garden-rescue simulation. This mission runs AFTER the concept scene has
// already taught for loops and while loops with syntax and visualization — the point
// here is applying that knowledge to a real, evolving problem, not inventing it from
// scratch. The story still drives every stage; the difference is the learner now has
// the vocabulary to reach for on purpose instead of stumbling into it.
//
// validate(globals, output, code) checks the REAL executed program's memory/output —
// never string-matching source — except where a stage specifically needs to confirm
// the learner actually used a particular construct (Stage 1's whole point is refusing
// to accept "it already works, I didn't change anything").

export const MISSION = {
  title: 'The Great Garden Rescue',
  intro: "Three days of dry, hot sun have left Robo's whole garden wilting. You now know what a for loop and a while loop are — but knowing the words isn't the same as knowing when to reach for them. You're Robo's garden helper. Every corner of the garden needs the same thing: something that happens more than once. Time to actually use what you just learned.",
  stages: [
    {
      id: 'water',
      title: 'Stage 1 — Watering Can Count',
      concept: 'The problem with repeating yourself',
      story: "Five watering cans line the garden path: 20, 35, 15, 40, and 25 cups of water. The code below already works — it adds up all five and gets the right total. Run it. Watch it work.",
      task: "Now look closely at what you just ran: five nearly-identical lines, one per can. What if the path had 50 cans instead of 5? Or 500? Rewrite this so ONE block of code handles every can, no matter how many there are — using a for loop over water_cans.",
      hint: 'for can in water_cans: then, inside it, total_water = total_water + can. One block, any number of cans.',
      placeholder: 'water_cans = [20, 35, 15, 40, 25]\ntotal_water = 0\ntotal_water = total_water + water_cans[0]\ntotal_water = total_water + water_cans[1]\ntotal_water = total_water + water_cans[2]\ntotal_water = total_water + water_cans[3]\ntotal_water = total_water + water_cans[4]\n',
      requireLoop: true,
      validate: (globals, output, code) => {
        const correctTotal = globals.total_water === '135';
        const usesLoop = /for\s+\w+\s+in\s+water_cans/.test(code) || /while\s+/.test(code);
        if (correctTotal && !usesLoop) {
          return { passed: false, message: "The total is right, but you haven't changed anything yet — this is still five separate lines. Replace them with one for loop over water_cans." };
        }
        const ok = correctTotal && usesLoop;
        return { passed: ok, message: ok ? "One loop, any number of cans — total_water is 135, and it would work just as well with 500 cans." : 'total_water should be 135 (20+35+15+40+25), computed with a for loop over water_cans instead of five separate lines.' };
      }
    },
    {
      id: 'scan',
      title: 'Stage 2 — Flower Bed Check',
      concept: 'Automating the journey',
      story: 'Four flower beds sit along the garden path: Roses, Tulips, Daisies, and Lilies. Before watering any bed, Robo checks it for wilting — walking to each one and looking in.',
      task: "Loop through flower_beds = ['Roses', 'Tulips', 'Daisies', 'Lilies'] and print a check line for each one, mentioning the bed's name — the same one-block idea from the watering cans, applied to a new problem.",
      hint: 'for bed in flower_beds: print("Checking", bed, "...")',
      placeholder: "flower_beds = ['Roses', 'Tulips', 'Daisies', 'Lilies']\n# your loop here\n",
      validate: (globals, output) => {
        const ok = ['Roses', 'Tulips', 'Daisies', 'Lilies'].every((p) => output.includes(p));
        return { passed: ok, message: ok ? 'All four beds checked — no wilting flower missed.' : 'Your check should mention all four beds by name: Roses, Tulips, Daisies, Lilies.' };
      }
    },
    {
      id: 'resources',
      title: 'Stage 3 — Seed Basket Count',
      concept: 'Scaling up',
      story: 'Robo gathers seed baskets from three of the four beds with raw counts: 40 from Roses, 55 from Daisies, 30 from Lilies. Same shape as the watering cans — but now you’re building it yourself, from scratch.',
      task: 'Loop through seed_baskets = [40, 55, 30] and add every value into a running total called total_seeds.',
      hint: 'total_seeds = 0, then for s in seed_baskets: total_seeds = total_seeds + s',
      placeholder: 'seed_baskets = [40, 55, 30]\ntotal_seeds = 0\n# your loop here\n',
      validate: (globals) => {
        const ok = globals.total_seeds === '125';
        return { passed: ok, message: ok ? 'total_seeds is 125 — every bed’s haul accounted for.' : 'total_seeds should be 125 (40+55+30).' };
      }
    },
    {
      id: 'countdown',
      title: 'Stage 4 — Bloom Countdown',
      concept: 'range(): counting without listing every number',
      story: 'The magic spell is ready. The garden needs a countdown before every flower blooms at once — and typing print(10), print(9), print(8)... by hand is exactly the same problem you already solved once. Python has a shortcut for counting: range().',
      task: 'Use a for loop over range(10, 0, -1) to print the countdown from 10 down to 1, then print "BLOOM!" once it finishes.',
      hint: 'for count in range(10, 0, -1): print(count) — then, after the loop (not inside it), print("BLOOM!")',
      placeholder: '# your countdown here\n',
      validate: (globals, output) => {
        const lines = output.trim().split('\n').map((l) => l.trim());
        const ok = lines.includes('10') && lines.includes('1') && /bloom/i.test(output);
        return { passed: ok, message: ok ? 'Countdown complete — BLOOM!' : 'Print 10 down to 1 using range(10, 0, -1), then print BLOOM! after the loop ends.' };
      }
    },
    {
      id: 'pest',
      title: 'Stage 5 — Pest Patrol',
      concept: 'break: stopping a loop early',
      story: 'Robo checks six garden rows for pests: rows 1 through 6. Row 4 turns up a cluster of aphids — a pest problem. There is no reason to keep checking rows 5 and 6 once you know you need to react right now.',
      task: 'Loop through rows 1 to 6, printing a check message for each. The moment you reach row 4, print a warning and stop the loop immediately — rows 5 and 6 should never be checked.',
      hint: 'for row in range(1, 7): if row == 4: print a warning, then break — otherwise print the check message.',
      placeholder: '# your loop with a break here\n',
      validate: (globals, output) => {
        const scannedEarly = ['1', '2', '3'].every((n) => output.includes(n));
        const neverReachedLate = !output.includes('row 5') && !output.includes('row 6');
        const warned = /pest|warning|aphid/i.test(output) && output.includes('4');
        const ok = scannedEarly && neverReachedLate && warned;
        return { passed: ok, message: ok ? 'Patrol halted the instant the pests were confirmed — no wasted time on clean rows.' : 'Rows 1-3 should check normally, row 4 should trigger a warning and stop the loop — rows 5 and 6 should never be mentioned.' };
      }
    },
    {
      id: 'damaged',
      title: 'Stage 6 — Broken Sprinklers',
      concept: 'continue: skipping without stopping',
      story: "Six sprinklers dot the garden with water-flow readings: 10, 0, 25, 0, 30, 15. A reading of 0 means the sprinkler is broken and can't water anything — but that's not a reason to skip the whole garden, just that one sprinkler.",
      task: 'Loop through sprinklers = [10, 0, 25, 0, 30, 15], adding every value that is NOT 0 into total_flow, using continue to skip broken sprinklers without stopping the loop.',
      hint: 'for flow in sprinklers: if flow == 0: continue — otherwise add it to total_flow.',
      placeholder: 'sprinklers = [10, 0, 25, 0, 30, 15]\ntotal_flow = 0\n# your loop with continue here\n',
      validate: (globals) => {
        const ok = globals.total_flow === '80';
        return { passed: ok, message: ok ? 'total_flow is 80 — every working sprinkler counted, broken ones safely skipped.' : 'total_flow should be 80 (10+25+30+15) — make sure 0 values are skipped with continue, not added.' };
      }
    },
    {
      id: 'emergency',
      title: 'Stage 7 — Refilling the Watering Can',
      concept: "while: repeating until you don't know exactly how many times",
      story: "The watering can is low, and it's refilling from a slow garden tap — sometimes 7 units land, sometimes only a trickle. You don't know in advance how many refills it'll take to reach 50. A for loop needs a fixed count up front. This needs something that just keeps going until the job is actually done.",
      task: 'Starting from can_water = 0, use a while loop that keeps adding 7 each pass until can_water is at least 50.',
      hint: 'while can_water < 50: can_water = can_water + 7',
      placeholder: 'can_water = 0\n# your while loop here\n',
      requireLoop: true,
      validate: (globals, output, code) => {
        const usesWhile = /while\s+/.test(code);
        const enough = Number(globals.can_water) >= 50;
        const ok = usesWhile && enough;
        return { passed: ok, message: ok ? `can_water reached ${globals.can_water} — enough to finish the round, using a while loop that didn't need to know the count in advance.` : 'Use a while loop that keeps adding 7 to can_water until it reaches at least 50 — a for loop won’t work here since you don’t know the count ahead of time.' };
      }
    },
    {
      id: 'final',
      title: 'Final Stage — Garden Report',
      concept: 'Everything, together',
      story: "Every bed is checked, every can is full, every sprinkler is working. One last step before the garden blooms: confirm every part, then report. This is the part where everything you've built gets used at once.",
      task: 'Print a full garden report using total_water, total_seeds, total_flow, and can_water — every value your loops have built up across the whole garden.',
      hint: 'A few print() lines work fine: print("Water:", total_water), and one for each of the others.',
      placeholder: '# print your final garden report\n',
      validate: (globals, output) => {
        const ok = ['135', '125', '80'].every((n) => output.includes(n)) && Number(globals.can_water) >= 50 && /5\d|6\d|7\d/.test(output);
        return { passed: ok, message: ok ? 'Garden report complete. Every part you built ran on the same idea: do this, repeatedly, until the job is done.' : 'Your report should include total_water (135), total_seeds (125), total_flow (80), and can_water.' };
      }
    }
  ],
  closing: "The last flower opens. Seven different corners of the garden, seven moments where you had to decide: for loop or while loop, break or continue — and every single time, the same idea underneath: do this again, and again, until something changes."
};
