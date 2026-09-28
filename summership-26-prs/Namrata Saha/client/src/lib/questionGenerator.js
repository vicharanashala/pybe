function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function pyBool(v) { return v ? 'True' : 'False'; }

function genThirstyCrowChallenge() {
  const n = randInt(3, 6);
  return {
    instruction: `The crow drops ${n} pebbles into the pot. Use variables to (1) store the crow's name as text, (2) start the water level at zero, (3) drop ${n} pebbles one at a time, and (4) print how high the water has risen.`,
    starterCode: `crow_name = "Kaali"\nwater_level = 0\n\n${Array(n).fill('water_level = water_level + 1').join('\n')}\n\nprint(water_level)`,
    expected: String(n),
    hint: 'Each drop is one line: water_level = water_level + 1'
  };
}

function genThirstyCrowProject() {
  const start = pick([8, 10, 12]);
  const adds = randInt(2, 4);
  const litres = pick([2, 3, 4]);
  const expected = start + adds * litres;
  return {
    instruction: `Build a small program for the village. A water tank starts with ${start} litres. ${adds} of the crow's friends each add ${litres} litres. Create the variable tank_water, start it at ${start}, add ${litres} ${adds} times, then print the total.`,
    starterCode: `tank_water = ${start}\n\n${Array(adds).fill(`tank_water = tank_water + ${litres}`).join('\n')}\n\nprint(tank_water)`,
    expected: String(expected),
    hint: `Expected output: ${expected}`
  };
}

function genMilkmaidChallenge() {
  const start = pick([2, 3]);
  const hatches = randInt(2, 5);
  const expected = start + hatches;
  return {
    instruction: `Meera starts with ${start} chicks. ${hatches} of her hens each hatch one more chick. Update the chicks variable ${hatches} times, then print the final count.`,
    starterCode: `chicks = ${start}\n\n${Array(hatches).fill('chicks = chicks + 1').join('\n')}\n\nprint(chicks)`,
    expected: String(expected),
    hint: 'Each hatch is one line: chicks = chicks + 1'
  };
}

function genMilkmaidProject() {
  const pots = randInt(3, 6);
  const coinsPerPot = pick([4, 5, 6]);
  const expected = pots * coinsPerPot;
  return {
    instruction: `Meera sells milk from ${pots} pots, and each pot earns ${coinsPerPot} coins. Track her earnings: start coins at 0, add ${coinsPerPot} ${pots} times, and print the total.`,
    starterCode: `coins = 0\n\n${Array(pots).fill(`coins = coins + ${coinsPerPot}`).join('\n')}\n\nprint(coins)`,
    expected: String(expected),
    hint: `Expected output: ${expected}`
  };
}

function genDogReflectionChallenge() {
  const first = pick([1, 2]);
  const found = pick([2, 3]);
  return {
    instruction: `The dog finds ${first} bone${first > 1 ? 's' : ''}, then loses ${first > 1 ? 'them' : 'it'} in the river. Assign bones = ${first}, overwrite it to 0 and print. Later the dog finds ${found} fresh bone${found > 1 ? 's' : ''}, so update bones to ${found} and print.`,
    starterCode: `bones = ${first}\n\nbones = 0\nprint(bones)\n\nbones = bones + ${found}\nprint(bones)`,
    expected: `0\n${found}`,
    hint: 'Assignment replaces the old value: bones = 0 overwrites the previous value.'
  };
}

function genDogReflectionProject() {
  const in2 = pick([2, 3]);
  const away1 = 1;
  const in3 = pick([3, 4]);
  const expected = in2 - away1 + in3;
  return {
    instruction: `Help the pond keeper count the fish in the river. Start count at 0, ${in2} fish swim in (add ${in2}), one swims away (subtract ${away1}), then ${in3} more arrive (add ${in3}). Print the final count.`,
    starterCode: `count = 0\n\ncount = count + ${in2}\ncount = count - ${away1}\ncount = count + ${in3}\n\nprint(count)`,
    expected: String(expected),
    hint: `Expected output: ${expected}`
  };
}

function genElephantDogChallenge() {
  const h1 = pick([1, 2]);
  const h2 = pick([7, 8, 9]);
  const h3 = pick([10, 12]);
  return {
    instruction: `The elephant starts alone and unhappy (happiness ${h1}). The dog arrives and they become friends (happiness ${h2}). Then the dog is lost (happiness 0). Print the final happiness and friendship status.`,
    starterCode: `is_friends = False\nhappiness = ${h1}\n\nis_friends = True\nhappiness = ${h2}\n\nis_friends = False\nhappiness = 0\nprint(happiness)\nprint(is_friends)`,
    expected: '0\nFalse',
    hint: 'Assigning again overwrites the old value in the same variable.'
  };
}

function genElephantDogProject() {
  const name = pick(['Bhola', 'Gajraj', 'Hasti']);
  const d1 = pick([3, 4]);
  const d2 = pick([2, 3]);
  const expected = d1 + d2;
  return {
    instruction: `Track the memories: start days_together at 0, add ${d1} joyful days, then add ${d2} more joyful days. Print days_together and the elephant's name "${name}".`,
    starterCode: `name = "${name}"\ndays_together = 0\n\ndays_together = days_together + ${d1}\ndays_together = days_together + ${d2}\n\nprint(days_together)\nprint(name)`,
    expected: `${expected}\n${name}`,
    hint: `Expected output: ${expected}, then ${name}`
  };
}

function genBlueJackalChallenge() {
  const c1 = pick(['brown', 'grey', 'tan']);
  const c2 = pick(['blue', 'purple', 'green']);
  return {
    instruction: `Track the jackal's appearance. Start with colour = "${c1}", then overwrite it with "${c2}" and print. He loses the dye and returns to "${c1}", so overwrite again and print.`,
    starterCode: `colour = "${c1}"\n\ncolour = "${c2}"\nprint(colour)\n\ncolour = "${c1}"\nprint(colour)`,
    expected: `${c2}\n${c1}`,
    hint: 'Assigning a new value to colour replaces the old one.'
  };
}

function genBlueJackalProject() {
  const c1 = pick(['green', 'teal', 'olive']);
  const c2 = pick(['red', 'crimson', 'scarlet']);
  const c3 = pick(['gold', 'bronze', 'silver']);
  return {
    instruction: `A chameleon changes colour three times: start at "${c1}", overwrite to "${c2}", then to "${c3}". Print the colour after each change.`,
    starterCode: `shade = "${c1}"\nprint(shade)\n\nshade = "${c2}"\nprint(shade)\n\nshade = "${c3}"\nprint(shade)`,
    expected: `${c1}\n${c2}\n${c3}`,
    hint: `Expected output: ${c1}, ${c2}, ${c3} (each on its own line)`
  };
}

function genMonkeyCrocodileChallenge() {
  const raining = pick([true, false]);
  return {
    instruction: `The monkey checks the river before crossing. If it is raining, print "Stay in the tree". Otherwise print "Climb on the crocodile". The variable is_raining is ${pyBool(raining)}.`,
    starterCode: `is_raining = ${pyBool(raining)}\n\nif is_raining:\n    print("Stay in the tree")\nelse:\n    print("Climb on the crocodile")`,
    expected: raining ? 'Stay in the tree' : 'Climb on the crocodile',
    hint: raining ? 'is_raining is True, so the if block runs.' : 'is_raining is False, so the else block runs.'
  };
}

function genMonkeyCrocodileProject() {
  const ripeness = randInt(5, 12);
  const ripe = ripeness >= 8;
  return {
    instruction: `Help the monkey pick ripe mangoes. If a mango's ripeness is 8 or more, print "Ripe mango". Otherwise print "Not ripe yet". Try changing ripeness to test both paths.`,
    starterCode: `ripeness = ${ripeness}\n\nif ripeness >= 8:\n    print("Ripe mango")\nelse:\n    print("Not ripe yet")`,
    expected: ripe ? 'Ripe mango' : 'Not ripe yet',
    hint: `Expected output: ${ripe ? 'Ripe mango' : 'Not ripe yet'}`
  };
}

function genHeronCrabChallenge() {
  const bones = pick([true, false]);
  return {
    instruction: `The crab sees fish bones near the heron's tree. If bones_visible is ${pyBool(bones)}, print "Snap the neck!". Otherwise print "Trust the heron". Write the if/else block.`,
    starterCode: `bones_visible = ${pyBool(bones)}\n\nif bones_visible:\n    print("Snap the neck!")\nelse:\n    print("Trust the heron")`,
    expected: bones ? 'Snap the neck!' : 'Trust the heron',
    hint: bones ? 'bones_visible is True, so the if block runs.' : 'bones_visible is False, so the else block runs.'
  };
}

function genHeronCrabProject() {
  const start = pick([4, 5, 6]);
  const leave = pick([1, 2]);
  const after = start - leave;
  const escape = after <= 2;
  return {
    instruction: `Help the crab count the fish. Start fish_count at ${start}. After ${leave} fish leave with the heron, subtract ${leave}. If fish_count drops to 2 or below, print "Time to escape!". Otherwise print "Still safe".`,
    starterCode: `fish_count = ${start}\n\nfish_count = fish_count - ${leave}\n\nif fish_count <= 2:\n    print("Time to escape!")\nelse:\n    print("Still safe")`,
    expected: escape ? 'Time to escape!' : 'Still safe',
    hint: `Expected output: ${escape ? 'Time to escape!' : 'Still safe'}`
  };
}

function genBrahminGoatChallenge() {
  const animal = pick(['dog', 'pig', 'donkey', 'goat']);
  const expected = animal === 'goat' ? 'It is a goat.' : animal === 'dog' ? 'Inauspicious!' : animal === 'pig' ? 'Dirty!' : 'Foolish!';
  return {
    instruction: `The Brahmin carries "${animal}". Use an if/elif/else chain: if animal is "dog", print "Inauspicious!"; elif "pig", print "Dirty!"; elif "donkey", print "Foolish!"; else print "It is a goat."`,
    starterCode: `animal = "${animal}"\n\nif animal == "dog":\n    print("Inauspicious!")\nelif animal == "pig":\n    print("Dirty!")\nelif animal == "donkey":\n    print("Foolish!")\nelse:\n    print("It is a goat.")`,
    expected,
    hint: animal === 'goat' ? 'animal is "goat", which does not match any of the first three conditions, so the else block runs.' : `animal is "${animal}", which matches one of the earlier conditions.`
  };
}

function genBrahminGoatProject() {
  const claim = pick(['dog', 'pig', 'donkey', 'cow']);
  const expected = claim === 'cow' ? 'Yes, it is a goat!' : 'No!';
  return {
    instruction: `Help the Brahmin check each claim. Write an if/elif/else chain: if claim is "dog" print "No!", elif "pig" print "No!", elif "donkey" print "No!", else print "Yes, it is a goat!". Set claim to "${claim}".`,
    starterCode: `claim = "${claim}"\n\nif claim == "dog":\n    print("No!")\nelif claim == "pig":\n    print("No!")\nelif claim == "donkey":\n    print("No!")\nelse:\n    print("Yes, it is a goat!")`,
    expected,
    hint: `Expected output: ${expected}`
  };
}

function genMonkeyKingChallenge() {
  const season = pick(['summer', 'winter', 'monsoon']);
  const waterRising = pick([true, false]);
  let expected;
  if (season === 'summer') expected = 'Stay by the lake';
  else if (waterRising) expected = 'Move to higher ground!';
  else expected = 'Keep watching';
  return {
    instruction: `The monkey king checks two signs. If season is "summer", print "Stay by the lake". Elif water_rising is ${pyBool(waterRising)}, print "Move to higher ground!". Otherwise print "Keep watching". Season is "${season}".`,
    starterCode: `season = "${season}"\nwater_rising = ${pyBool(waterRising)}\n\nif season == "summer":\n    print("Stay by the lake")\nelif water_rising:\n    print("Move to higher ground!")\nelse:\n    print("Keep watching")`,
    expected,
    hint: season === 'summer' ? 'season is "summer", so the first condition is True.' : waterRising ? 'season is not "summer", so the first condition is False. Then water_rising is checked.' : 'Neither condition is True, so the else block runs.'
  };
}

function genMonkeyKingProject() {
  const start = pick([1, 2, 3]);
  const add1 = pick([1, 2]);
  const add2 = pick([1, 2]);
  const l1 = start;
  const l2 = start + add1;
  const l3 = start + add1 + add2;
  function lvlMsg(l) { return l >= 5 ? 'Danger!' : l === 3 ? 'Watch closely' : 'All calm'; }
  const expected = `${lvlMsg(l1)}\n${lvlMsg(l2)}\n${lvlMsg(l3)}`;
  return {
    instruction: `Track the lake's water level through three time periods. Start at ${l1}. Add ${add1}, then add ${add2}. At each step, check: if level is 5 or more, print "Danger!"; elif level is 3, print "Watch closely"; else print "All calm".`,
    starterCode: `level = ${l1}\nprint("${lvlMsg(l1)}")\n\nlevel = level + ${add1}\nif level >= 5:\n    print("Danger!")\nelif level == 3:\n    print("Watch closely")\nelse:\n    print("All calm")\n\nlevel = level + ${add2}\nif level >= 5:\n    print("Danger!")\nelif level == 3:\n    print("Watch closely")\nelse:\n    print("All calm")`,
    expected,
    hint: `Expected output: ${lvlMsg(l1)}, ${lvlMsg(l2)}, ${lvlMsg(l3)}`
  };
}

function genCrowSnakeChallenge() {
  const loc = pick(['tree', 'hole', 'garden']);
  let expected;
  if (loc === 'tree') expected = 'Flap and peck!';
  else if (loc === 'hole') expected = 'Drop the necklace in!';
  else expected = 'Rest easy';
  return {
    instruction: `The mother crow watches where the snake is. If snake_location is "tree", print "Flap and peck!". Elif it is "hole", print "Drop the necklace in!". Otherwise print "Rest easy". snake_location is "${loc}".`,
    starterCode: `snake_location = "${loc}"\n\nif snake_location == "tree":\n    print("Flap and peck!")\nelif snake_location == "hole":\n    print("Drop the necklace in!")\nelse:\n    print("Rest easy")`,
    expected,
    hint: loc === 'tree' ? 'snake_location is "tree", which matches the first check.' : loc === 'hole' ? 'snake_location is "hole", which matches the elif.' : `snake_location is "${loc}", which does not match either check, so the else block runs.`
  };
}

function genCrowSnakeProject() {
  const scenarios = [
    { near: pick([true, false]), eggs: pick([true, false]) },
    { near: pick([true, false]), eggs: pick([true, false]) },
    { near: pick([true, false]), eggs: pick([true, false]) }
  ];
  const lines = scenarios.map(s => {
    if (s.near) return 'Lure the humans!';
    if (s.eggs) return 'Sit on the eggs';
    return 'Collect twigs';
  });
  return {
    instruction: `Help the crow plan three days. Each day has two facts: snake_nearby and eggs_ready. Write an if/elif/else for each day: if snake_nearby is True print "Lure the humans!"; elif eggs_ready print "Sit on the eggs"; else print "Collect twigs".`,
    starterCode: scenarios.map((s, i) => (
      `# Day ${i + 1}\nsnake_nearby = ${pyBool(s.near)}\neggs_ready = ${pyBool(s.eggs)}\n\nif snake_nearby:\n    print("Lure the humans!")\nelif eggs_ready:\n    print("Sit on the eggs")\nelse:\n    print("Collect twigs")`
    )).join('\n\n'),
    expected: lines.join('\n'),
    hint: `Expected output: ${lines.join(', ')} (each on its own line)`
  };
}

function genTortoiseHareChallenge() {
  const n = randInt(4, 8);
  return {
    instruction: `Use a for loop with range(1, ${n + 1}) to print each lap number, one per line. The tortoise takes exactly ${n} laps.`,
    starterCode: `for lap in range(1, ${n + 1}):\n    print(lap)`,
    expected: Array.from({ length: n }, (_, i) => String(i + 1)).join('\n'),
    hint: `range(1, ${n + 1}) starts at 1 and stops before ${n + 1}.`
  };
}

function genTortoiseHareProject() {
  const laps = randInt(4, 8);
  const lines = Array.from({ length: laps }, (_, i) => String(i + 1));
  lines.push('Finished!');
  return {
    instruction: `The tortoise walks ${laps} laps. Use a while loop: start laps_done at 0, add 1 on each round, and print the lap number until laps_done reaches ${laps}. Then print "Finished!".`,
    starterCode: `laps_done = 0\n\nwhile laps_done < ${laps}:\n    laps_done = laps_done + 1\n    print(laps_done)\n\nprint("Finished!")`,
    expected: lines.join('\n'),
    hint: `Expected output: ${lines.join(', ')} (each on its own line)`
  };
}

function genBanyanDeerChallenge() {
  const days = randInt(4, 8);
  const lines = Array.from({ length: days }, (_, i) => `Day ${i + 1} - lots drawn`);
  lines.push('The hunter lowers his knife');
  return {
    instruction: `The pact ran for ${days} days before the king heard of it. Use a for loop with range(1, ${days + 1}) to print "Day X - lots drawn" for each of the ${days} days. After the loop, print "The hunter lowers his knife".`,
    starterCode: `for day in range(1, ${days + 1}):\n    print("Day", day, "- lots drawn")\n\nprint("The hunter lowers his knife")`,
    expected: lines.join('\n'),
    hint: 'Inside the loop, print combines text, the day number, and more text - commas keep them on one line.'
  };
}

function genBanyanDeerProject() {
  const stop = randInt(5, 9);
  const lines = Array.from({ length: stop - 1 }, (_, i) => `Day ${i + 1} : one deer walks to the block`);
  lines.push('The king spares both herds');
  return {
    instruction: `Retell the ending with a sentinel loop. Start rule_stands as True and day at 1. While rule_stands is True, print "Day X : one deer walks to the block", add 1 to day, and when day reaches ${stop}, set rule_stands to False. After the loop, print "The king spares both herds".`,
    starterCode: `rule_stands = True\nday = 1\n\nwhile rule_stands:\n    print("Day", day, ": one deer walks to the block")\n    day = day + 1\n    if day == ${stop}:\n        rule_stands = False\n\nprint("The king spares both herds")`,
    expected: lines.join('\n'),
    hint: `Expected output: ${stop - 1} 'Day X' lines, then 'The king spares both herds'`
  };
}

function genAntDoveChallenge() {
  const steps = randInt(3, 6);
  const lines = Array.from({ length: steps }, (_, i) => `Step ${i + 1} across the leaf`);
  lines.push('Safe on the riverbank!');
  return {
    instruction: `The stranded ant crosses the floating leaf in exactly ${steps} steps. Use a for loop with range(1, ${steps + 1}) to print "Step X across the leaf" for each step. After the loop, print "Safe on the riverbank!".`,
    starterCode: `for step in range(1, ${steps + 1}):\n    print("Step", step, "across the leaf")\n\nprint("Safe on the riverbank!")`,
    expected: lines.join('\n'),
    hint: `range(1, ${steps + 1}) gives ${Array.from({ length: steps }, (_, i) => i + 1).join(', ')} - one number for each step.`
  };
}

function genAntDoveProject() {
  const climbs = randInt(5, 8);
  const lines = Array.from({ length: climbs }, (_, i) => `Climb ${i + 1}`);
  lines.push('Nibble! The hunter cries out and the dove flies free.');
  return {
    instruction: `Rescue the dove! Start steps_taken at 0. While steps_taken is less than ${climbs}, increase it by 1 and print "Climb N" (with N the current count). When the loop ends, print the rescue message.`,
    starterCode: `steps_taken = 0\n\nwhile steps_taken < ${climbs}:\n    steps_taken = steps_taken + 1\n    print("Climb", steps_taken)\n\nprint("Nibble! The hunter cries out and the dove flies free.")`,
    expected: lines.join('\n'),
    hint: `Expected output: Climb 1 through Climb ${climbs}, then the rescue message`
  };
}

function genGoldenGooseChallenge() {
  const visits = randInt(3, 6);
  const lines = Array.from({ length: visits }, (_, i) => `Visit ${i + 1} - one golden feather`);
  return {
    instruction: `The golden goose returns for ${visits} visits before the mother's greed begins. Use a for loop with range(1, ${visits + 1}) to print "Visit X - one golden feather" for each visit.`,
    starterCode: `for week in range(1, ${visits + 1}):\n    print("Visit", week, "- one golden feather")`,
    expected: lines.join('\n'),
    hint: `range(1, ${visits + 1}) counts ${Array.from({ length: visits }, (_, i) => i + 1).join(', ')} - ${visits} visits, ${visits} feathers.`
  };
}

function genGoldenGooseProject() {
  const weeks = randInt(5, 8);
  const lines = Array.from({ length: weeks }, (_, i) => `Week ${i + 1} : one golden feather sold`);
  lines.push(`${weeks} silver coins in the jar`);
  return {
    instruction: `Track the family's fortune over ${weeks} weeks. Start coins and week both at 0. While week is less than ${weeks}, increase week by 1, add 1 to coins, and print "Week X : one golden feather sold". After the loop, print "${weeks} silver coins in the jar".`,
    starterCode: `coins = 0\nweek = 0\n\nwhile week < ${weeks}:\n    week = week + 1\n    coins = coins + 1\n    print("Week", week, ": one golden feather sold")\n\nprint(coins, "silver coins in the jar")`,
    expected: lines.join('\n'),
    hint: `Expected output: ${weeks} 'Week X' lines, then '${weeks} silver coins in the jar'`
  };
}

function genMonkeyWedgeChallenge() {
  const target = randInt(3, 6);
  const lines = Array.from({ length: target }, (_, i) => `Tug ${i + 1}`);
  lines.push('The wedge pops out!');
  return {
    instruction: `Simulate the monkey's pulls. Start wedge_holds as True and tugs at 0. While wedge_holds is True, add 1 to tugs, print "Tug X", and when tugs reaches ${target}, set wedge_holds to False. After the loop, print "The wedge pops out!".`,
    starterCode: `wedge_holds = True\ntugs = 0\n\nwhile wedge_holds:\n    tugs = tugs + 1\n    print("Tug", tugs)\n    if tugs == ${target}:\n        wedge_holds = False\n\nprint("The wedge pops out!")`,
    expected: lines.join('\n'),
    hint: 'The flag flip happens inside the loop - that is what lets while wedge_holds ever end.'
  };
}

function genMonkeyWedgeProject() {
  const pulls = randInt(5, 8);
  const lines = Array.from({ length: pulls }, (_, i) => `Pull ${i + 1} - the wedge shifts`);
  lines.push('SNAP! The log springs shut.');
  return {
    instruction: `Flip the logic: repeat while the wedge is NOT yet loose. Start wedge_loose as False and pulls at 0. While not wedge_loose, add 1 to pulls, print "Pull X - the wedge shifts", and when pulls reaches ${pulls}, set wedge_loose to True. Then print "SNAP! The log springs shut.".`,
    starterCode: `wedge_loose = False\npulls = 0\n\nwhile not wedge_loose:\n    pulls = pulls + 1\n    print("Pull", pulls, "- the wedge shifts")\n    if pulls == ${pulls}:\n        wedge_loose = True\n\nprint("SNAP! The log springs shut.")`,
    expected: lines.join('\n'),
    hint: `Expected output: ${pulls} 'Pull X' lines, then the snap message`
  };
}

function genElephantBlindMenChallenge() {
  const parts = pick([
    ['wall', 'spear', 'fan', 'tree', 'rope', 'snake'],
    ['pillar', 'fan', 'wall', 'tree', 'rope', 'snake'],
    ['wall', 'spear', 'fan', 'pillar', 'rope', 'snake']
  ]);
  return {
    instruction: `Store these six descriptions in a list: ${JSON.stringify(parts)}. Then print the first (index 0) and the last (index -1), one per line.`,
    starterCode: `parts = ${JSON.stringify(parts)}\n\nprint(parts[0])\nprint(parts[-1])`,
    expected: `${parts[0]}\n${parts[parts.length - 1]}`,
    hint: 'The first item is at index 0, the last at index -1.'
  };
}

function genElephantBlindMenProject() {
  const items = pick([
    ['trunk', 'tail', 'tusk'],
    ['ears', 'legs', 'trunk'],
    ['feet', 'trunk', 'tail']
  ]);
  return {
    instruction: `Create a list called notes with three strings: ${JSON.stringify(items)}. Then print how many notes there are using len(), and print the last note.`,
    starterCode: `notes = ${JSON.stringify(items)}\n\nprint(len(notes))\nprint(notes[-1])`,
    expected: `3\n${items[items.length - 1]}`,
    hint: `Expected output: 3, then ${items[items.length - 1]}`
  };
}

function genCrowsOwlsChallenge() {
  const plans = pick([
    ['flee', 'make peace', 'the stratagem'],
    ['hide', 'surrender', 'the stratagem'],
    ['run away', 'negotiate', 'the stratagem']
  ]);
  return {
    instruction: `The crow council starts with three plans: ${JSON.stringify(plans)}. Use remove() to strike off "${plans[0]}", print the list, then strike off "${plans[1]}", and print again.`,
    starterCode: `council = ${JSON.stringify(plans)}\n\ncouncil.remove("${plans[0]}")\nprint(council)\n\ncouncil.remove("${plans[1]}")\nprint(council)`,
    expected: `['${plans[1]}', '${plans[2]}']\n['${plans[2]}']`,
    hint: 'remove() deletes the first item equal to the value you pass in.'
  };
}

function genCrowsOwlsProject() {
  const initial = pick([
    ['owl king', 'owl guards'],
    ['owl chief', 'owl sentries'],
    ['owl elder', 'owl scouts']
  ]);
  const newMember = pick(['Meghavarna', 'Vikram', 'Arjun']);
  const replaced = pick(['trapped owls', 'bound owls', 'captured owls']);
  return {
    instruction: `Track how the owls' band changes. Start with cave = ${JSON.stringify(initial)}. Append "${newMember}" and print. Then update the second element to "${replaced}" and print. Finally remove "${replaced}" and print.`,
    starterCode: `cave = ${JSON.stringify(initial)}\n\ncave.append("${newMember}")\nprint(cave)\n\ncave[1] = "${replaced}"\nprint(cave)\n\ncave.remove("${replaced}")\nprint(cave)`,
    expected: `['${initial[0]}', '${initial[1]}', '${newMember}']\n['${initial[0]}', '${replaced}', '${newMember}']\n['${initial[0]}', '${newMember}']`,
    hint: 'Expected output: the list after appending, after updating, and after removing'
  };
}

function genFiveFriendsChallenge() {
  const friends = pick([
    ['dove', 'crow', 'mouse', 'tortoise', 'deer'],
    ['eagle', 'fox', 'rabbit', 'bear', 'wolf'],
    ['sparrow', 'monkey', 'fish', 'rabbit', 'deer']
  ]);
  const lines = friends.map((f, i) => `${i} - ${f}`);
  return {
    instruction: `The friends stand in order: ${JSON.stringify(friends)}. Store them in a list called friends. Then use range(len(friends)) to print each friend with its position.`,
    starterCode: `friends = ${JSON.stringify(friends)}\n\nfor i in range(len(friends)):\n    print(i, "-", friends[i])`,
    expected: lines.join('\n'),
    hint: 'range(len(friends)) produces 0, 1, 2, 3, 4 - one position per friend; use friends[i] inside the loop'
  };
}

function genFiveFriendsProject() {
  const names = pick([
    ['dove', 'crow', 'mouse', 'tortoise', 'deer'],
    ['eagle', 'fox', 'rabbit', 'bear', 'wolf'],
    ['sparrow', 'monkey', 'fish', 'rabbit', 'deer']
  ]);
  const roles = pick([
    ['spots danger', 'scouts the sky', 'gnaws the ropes', 'waits in water', 'lures the hunters'],
    ['watches from above', 'finds the path', 'chews the net', 'swims to safety', 'leads the way'],
    ['calls the warning', 'clears the trail', 'loosens the knots', 'guards the river', 'draws attention']
  ]);
  const lines = names.map((n, i) => `${n} ${roles[i]}`);
  return {
    instruction: `Create two parallel lists: friends = ${JSON.stringify(names)} and roles = ${JSON.stringify(roles)}. Loop over both lists and print each friend paired with its role.`,
    starterCode: `friends = ${JSON.stringify(names)}\nroles = ${JSON.stringify(roles)}\n\nfor i in range(len(friends)):\n    print(friends[i], roles[i])`,
    expected: lines.join('\n'),
    hint: `Expected output: five lines, each pairing a friend with its role`
  };
}

function genElephantCaravanChallenge() {
  const items = pick([
    ['lead bull', 'young bulls', 'rear guard'],
    ['scout', 'main herd', 'rear guard'],
    ['elder', 'calves', 'guardian']
  ]);
  const insert = pick(['mothers and calves', 'the young ones', 'the elders']);
  return {
    instruction: `The herd lines up: ${JSON.stringify(items)}. Insert "${insert}" at position 1 so they sit between the first and second elements. Print the list.`,
    starterCode: `caravan = ${JSON.stringify(items)}\n\ncaravan.insert(1, "${insert}")\nprint(caravan)`,
    expected: `['${items[0]}', '${insert}', '${items[1]}', '${items[2]}']`,
    hint: 'insert(1, ...) slides everyone from index 1 onward one place back to make room.'
  };
}

function genElephantCaravanProject() {
  const route = pick([
    ['test the water hole', 'drink quickly', 'cross the plain at night', 'rest through the heat'],
    ['scout the path', 'gather the herd', 'march at dawn', 'rest at the oasis'],
    ['check for danger', 'cross the river', 'climb the hill', 'sleep in the shade']
  ]);
  const lines = route.map((r, i) => `Stage ${i + 1} - ${r}`);
  lines.push(`First: ${route[0]}`);
  lines.push(`Last: ${route[route.length - 1]}`);
  return {
    instruction: `Store the journey in order: route = ${JSON.stringify(route)}. Loop over the list and print "Stage N - action" for each step. After the loop, print the first and last items.`,
    starterCode: `route = ${JSON.stringify(route)}\n\nfor i in range(len(route)):\n    print("Stage", i + 1, "-", route[i])\n\nprint("First:", route[0])\nprint("Last:", route[-1])`,
    expected: lines.join('\n'),
    hint: `Expected output: four numbered stages, then the First and Last lines`
  };
}

function genWiseQuailChallenge() {
  const n = randInt(5, 9);
  const birds = Array.from({ length: n }, (_, i) => `quail${i + 1}`);
  return {
    instruction: `${n} quails gather to feed: store them in a list called birds using the names "quail1" through "quail${n}". Print how many birds are in the flock using len().`,
    starterCode: `birds = ${JSON.stringify(birds)}\n\nprint(len(birds))`,
    expected: String(n),
    hint: 'len() takes the list inside its parentheses and returns the number of items.'
  };
}

function genWiseQuailProject() {
  const n = randInt(4, 7);
  const birds = Array.from({ length: n }, (_, i) => `quail${i + 1}`);
  const lines = birds.map(b => `${b} lifts the net`);
  lines.push(`${n} birds fly as one`);
  return {
    instruction: `${n} quails face the falling net: start from birds = ${JSON.stringify(birds)}. Loop over the flock and print each bird followed by "lifts the net". Then print how many birds fly as one.`,
    starterCode: `birds = ${JSON.stringify(birds)}\n\nfor bird in birds:\n    print(bird, "lifts the net")\n\nprint(len(birds), "birds fly as one")`,
    expected: lines.join('\n'),
    hint: `Expected output: ${n} 'lifts the net' lines, then '${n} birds fly as one'`
  };
}

function genLionMouseChallenge() {
  const ropes = randInt(2, 6);
  return {
    instruction: `The mouse chews through the ropes. Call gnaw(${ropes}) and print the result. The function should return the number of ropes plus one.`,
    starterCode: `def gnaw(ropes):\n    return ropes + 1\n\nfreed_ropes = gnaw(${ropes})\nprint(freed_ropes)`,
    expected: String(ropes + 1),
    hint: 'The function should return ropes + 1.'
  };
}

function genLionMouseProject() {
  const ropes = pick([3, 4, 5, 6]);
  return {
    instruction: `Write a function rescue(ropes) that returns the message "Freed from N ropes!" using an f-string, where N is the number passed in. Then call rescue(${ropes}) and print the result.`,
    starterCode: `def rescue(ropes):\n    return f"Freed from ${ropes} ropes!"\n\nprint(rescue(${ropes}))`,
    expected: `Freed from ${ropes} ropes!`,
    hint: `Expected output: Freed from ${ropes} ropes!`
  };
}

function genTortoiseGeeseChallenge() {
  const name = pick(['Kambugriva', 'Chitra', 'Vihara', 'Sundari']);
  return {
    instruction: `Write a function carry(name) that prints "<name> bites the stick". Then call it with "${name}".`,
    starterCode: `def carry(name):\n    print(name, "bites the stick")\n\ncarry("${name}")`,
    expected: `${name} bites the stick`,
    hint: 'Inside the function, use the parameter name as if it were an ordinary variable; commas in print join with a space.'
  };
}

function genTortoiseGeeseProject() {
  const passengers = pick([
    ['the tortoise', 'the hare', 'the jackal'],
    ['the rabbit', 'the deer', 'the monkey'],
    ['the frog', 'the mouse', 'the crab']
  ]);
  const lines = passengers.map(p => `The geese lift ${p}`);
  lines.push('One action, many travellers');
  return {
    instruction: `Write a function fly_with(passenger) that prints "The geese lift <passenger>". Call it three times with ${JSON.stringify(passengers)}. Then print "One action, many travellers".`,
    starterCode: `def fly_with(passenger):\n    print("The geese lift", passenger)\n\n${passengers.map(p => `fly_with("${p}")`).join('\n')}\n\nprint("One action, many travellers")`,
    expected: lines.join('\n'),
    hint: `Expected output: three lift lines, then the closing line`
  };
}

function genRuruDeerChallenge() {
  const swimmer = pick(['the drowning man', 'the lost child', 'the wounded hunter']);
  return {
    instruction: `Write a function rescue(swimmer) that returns "<swimmer> reaches the shore". Call it with "${swimmer}" and print the result.`,
    starterCode: `def rescue(swimmer):\n    return swimmer + " reaches the shore"\n\nmessage = rescue("${swimmer}")\nprint(message)`,
    expected: `${swimmer} reaches the shore`,
    hint: 'Build the sentence with the parameter plus a string literal joined by +, then return it.'
  };
}

function genRuruDeerProject() {
  const q1 = pick(['name', 'identity']);
  const q2 = pick(['wish', 'desire']);
  const a1 = pick(['Ruru', 'Chandra', 'Soma']);
  const a2 = pick(['Spare all deer', 'Protect the forest', 'Free the prisoners']);
  return {
    instruction: `Write a function answer(question) that returns "${a1}" when asked "${q1}", returns "${a2}" when asked "${q2}", and returns "Ask me another" for anything else. Call it with "${q1}" and "${q2}".`,
    starterCode: `def answer(question):\n    if question == "${q1}":\n        return "${a1}"\n    if question == "${q2}":\n        return "${a2}"\n    return "Ask me another"\n\nprint(answer("${q1}"))\nprint(answer("${q2}"))`,
    expected: `${a1}\n${a2}`,
    hint: `Expected output: ${a1}, then ${a2}`
  };
}

function genJackalDrumChallenge() {
  const mystery = pick(['the great drum', 'the old war horn', 'the hollow log']);
  return {
    instruction: `Write a function investigate(mystery) that prints "Creep toward <mystery>" and then returns "<mystery> is only wood and skin". Call it with "${mystery}".`,
    starterCode: `def investigate(mystery):\n    print("Creep toward", mystery)\n    return mystery + " is only wood and skin"\n\nverdict = investigate("${mystery}")\nprint(verdict)`,
    expected: `Creep toward ${mystery}\n${mystery} is only wood and skin`,
    hint: 'Do both jobs in order: print the creeping line first, then return the verdict built from the parameter.'
  };
}

function genJackalDrumProject() {
  const items = pick([
    ['the booming drum', 'the fallen helmet'],
    ['the rattling shield', 'the dented armour'],
    ['the clanging pot', 'the rusty spear']
  ]);
  const lines = items.map(i => `${i}: observed, tested, explained`);
  lines.push('One method, every mystery');
  return {
    instruction: `Reuse the jackal's method across the battlefield. Write investigate(mystery) so it returns "<mystery>: observed, tested, explained". Call it for ${JSON.stringify(items)}. Then print "One method, every mystery".`,
    starterCode: `def investigate(mystery):\n    return mystery + ": observed, tested, explained"\n\n${items.map(i => `print(investigate("${i}"))`).join('\n')}\n\nprint("One method, every mystery")`,
    expected: lines.join('\n'),
    hint: `Expected output: two verdict lines, then the closing line`
  };
}

function genSparrowElephantChallenge() {
  const target = pick(["the giant's brow", "the wrinkled trunk", "the thick hide"]);
  return {
    instruction: `Write a function peck(target) that prints "The woodpecker strikes <target>". Call it with "${target}".`,
    starterCode: `def peck(target):\n    print("The woodpecker strikes", target)\n\npeck("${target}")`,
    expected: `The woodpecker strikes ${target}`,
    hint: 'The comma inside print adds one space between the words automatically.'
  };
}

function genSparrowElephantProject() {
  const actions = pick([
    { strike: 'The woodpecker blinds the giant', lure: 'The bee leads him to the lake', croak: 'The frog croaks from the pit' },
    { strike: 'The woodpecker pecks his eyes', lure: 'The bee hums him to the water', croak: 'The frog calls from the ditch' },
    { strike: 'The woodpecker strikes the brow', lure: 'The bee draws him forward', croak: 'The frog sounds from the ravine' }
  ]);
  return {
    instruction: `Build the rescue plan from small functions. Define strike() printing "${actions.strike}", lure() printing "${actions.lure}", and croak() printing "${actions.croak}". Call them in that order, then print "Together the small have won".`,
    starterCode: `def strike():\n    print("${actions.strike}")\n\ndef lure():\n    print("${actions.lure}")\n\ndef croak():\n    print("${actions.croak}")\n\nstrike()\nlure()\ncroak()\nprint("Together the small have won")`,
    expected: `${actions.strike}\n${actions.lure}\n${actions.croak}\nTogether the small have won`,
    hint: 'Expected output: three action lines in order, then the victory line'
  };
}

const generators = {
  'thirsty-crow':      { challenge: genThirstyCrowChallenge,      project: genThirstyCrowProject },
  'milkmaid-pail':     { challenge: genMilkmaidChallenge,         project: genMilkmaidProject },
  'dog-reflection':    { challenge: genDogReflectionChallenge,    project: genDogReflectionProject },
  'elephant-dog':      { challenge: genElephantDogChallenge,      project: genElephantDogProject },
  'blue-jackal':       { challenge: genBlueJackalChallenge,       project: genBlueJackalProject },
  'monkey-crocodile':  { challenge: genMonkeyCrocodileChallenge,  project: genMonkeyCrocodileProject },
  'heron-crab':        { challenge: genHeronCrabChallenge,        project: genHeronCrabProject },
  'brahmin-goat':      { challenge: genBrahminGoatChallenge,      project: genBrahminGoatProject },
  'monkey-king':       { challenge: genMonkeyKingChallenge,       project: genMonkeyKingProject },
  'crow-snake':        { challenge: genCrowSnakeChallenge,        project: genCrowSnakeProject },
  'tortoise-hare':     { challenge: genTortoiseHareChallenge,     project: genTortoiseHareProject },
  'banyan-deer':       { challenge: genBanyanDeerChallenge,       project: genBanyanDeerProject },
  'ant-dove':          { challenge: genAntDoveChallenge,          project: genAntDoveProject },
  'golden-goose':      { challenge: genGoldenGooseChallenge,      project: genGoldenGooseProject },
  'monkey-wedge':      { challenge: genMonkeyWedgeChallenge,      project: genMonkeyWedgeProject },
  'elephant-blind-men':{ challenge: genElephantBlindMenChallenge,  project: genElephantBlindMenProject },
  'crows-owls':        { challenge: genCrowsOwlsChallenge,        project: genCrowsOwlsProject },
  'five-friends':      { challenge: genFiveFriendsChallenge,      project: genFiveFriendsProject },
  'elephant-caravan':  { challenge: genElephantCaravanChallenge,  project: genElephantCaravanProject },
  'wise-quail':        { challenge: genWiseQuailChallenge,        project: genWiseQuailProject },
  'lion-mouse':        { challenge: genLionMouseChallenge,        project: genLionMouseProject },
  'tortoise-geese':    { challenge: genTortoiseGeeseChallenge,    project: genTortoiseGeeseProject },
  'ruru-deer':         { challenge: genRuruDeerChallenge,         project: genRuruDeerProject },
  'jackal-drum':       { challenge: genJackalDrumChallenge,       project: genJackalDrumProject },
  'sparrow-elephant':  { challenge: genSparrowElephantChallenge,  project: genSparrowElephantProject }
};

export function generateQuestion(storyId, stage) {
  const gen = generators[storyId];
  if (!gen || !gen[stage]) return null;
  const variant = gen[stage]();
  return {
    starterCode: variant.starterCode,
    instruction: variant.instruction,
    hint: variant.hint,
    check: { type: 'output-equals', expected: variant.expected, message: variant.message || undefined }
  };
}
