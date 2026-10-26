const path = require('path');
const bible = require('../src/data/caseBible.json');
const caseParts = require(path.join(__dirname, '..', '..', 'server', 'rosewoodManorCase'));

const errors = [];
const suspectIds = new Set(bible.suspects.map((suspect) => suspect.id));
const clueIds = new Set(bible.clues.map((clue) => clue.id));
const knownNames = new Set([bible.victim.name, ...bible.suspects.map((suspect) => suspect.name), ...bible.witnesses.map((witness) => witness.name)]);
const introSlide = new Map(bible.suspects.map((suspect) => [suspect.id, suspect.introducedAt]));
const slides = new Map(caseParts.flatMap((part) => (part.slides || []).map((slide, index) => [slide.id, { ...slide, _globalSlideIndex: (part.order || 0) * 20 + index }])));

bible.suspects.forEach((suspect) => {
  const seenAt = new Map();
  (suspect.movements || []).forEach((movement) => {
    if (seenAt.has(movement.time)) errors.push(`${suspect.id}: two rooms at ${movement.time}: ${seenAt.get(movement.time)} and ${movement.room}`);
    seenAt.set(movement.time, movement.room);
    if (!bible.house.rooms.includes(movement.room)) errors.push(`${suspect.id}: movement uses unknown room ${movement.room}`);
  });
});

caseParts.forEach((part) => {
  (part.slides || []).forEach((slide) => {
    (slide.introduces || []).forEach((id) => {
      if (!suspectIds.has(id)) errors.push(`${slide.id}: introduces unknown suspect ${id}`);
    });
    if (slide.kind === 'characters') {
      slide.characters.forEach((character) => {
        const suspect = bible.suspects.find((item) => item.name === character.name);
        if (!suspect) errors.push(`${slide.id}: character ${character.name} is not in the bible`);
        else if (suspect.role !== character.role) errors.push(`${slide.id}: ${character.name} role differs from bible`);
      });
    }
    if (slide.kind === 'artifact' && slide.caseData) {
      (slide.caseData.suspectClaims || []).forEach((claim) => {
        if (!bible.suspects.some((suspect) => suspect.name.startsWith(claim.suspect))) errors.push(`${slide.id}: claim names unknown suspect ${claim.suspect}`);
      });
    }
  });
  (part.evidenceEvents || []).forEach((event) => {
    if (event.clueId && !clueIds.has(event.clueId)) errors.push(`${event.id}: references unknown clue ${event.clueId}`);
    const clue = bible.clues.find((item) => item.id === event.clueId);
    if (clue && slides.has(clue.introducedAt) && event.slideIndex < slides.get(clue.introducedAt)._globalSlideIndex) errors.push(`${event.id}: references ${clue.id} before its introduction`);
    (event.connectsTo || []).forEach((id) => {
      if (!suspectIds.has(id)) errors.push(`${event.id}: connects unknown suspect ${id}`);
      const introduced = introSlide.get(id);
      if (introduced && slides.has(introduced) && event.slideIndex < slides.get(introduced)._globalSlideIndex) errors.push(`${event.id}: reveals ${id} before introduction`);
    });
    (event.effects || []).forEach((effect) => {
      if (!suspectIds.has(effect.suspectId)) errors.push(`${event.id}: scores unknown suspect ${effect.suspectId}`);
    });
  });
});

const allText = JSON.stringify(caseParts);
if (!allText.includes(bible.victim.name)) errors.push('victim is missing from the case source');
knownNames.forEach((name) => { if (name !== bible.victim.name && !allText.includes(name)) errors.push(`bible person is missing from case source: ${name}`); });
if (bible.solution.culprit !== 'iris') errors.push('solution culprit is not Iris');
if (!bible.solution.proof.every((id) => clueIds.has(id))) errors.push('solution contains a clue outside the bible');
console.log(`Audited ${caseParts.length} parts, ${caseParts.reduce((sum, part) => sum + part.slides.length, 0)} slides, ${bible.clues.length} bible clues.`);
if (errors.length) {
  console.error('Story audit failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Story audit passed: names, roles, clue references, introductions, and solution agree with the bible.');