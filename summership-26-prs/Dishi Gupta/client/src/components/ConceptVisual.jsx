import React from 'react';
import { Avatar, ClueCard, CompareDiagram, DecisionBoard, FloorPlan, Scene, Timeline } from './IllustrationKit';

export default function ConceptVisual({ scenario, slide, partIndex = 0 }) {
  const concept = (scenario.concepts || [])[0];
  if (slide.kind === 'characters') return <div className="visual-stage"><Scene partIndex={partIndex} /><div className="avatar-row">{slide.characters.map((character) => <Avatar key={character.name} name={character.name} role={character.role} />)}</div></div>;
  if (concept === 'strings' || concept === 'parsing') return <div className="visual-stage"><Scene partIndex={partIndex} /><div className="clue-row"><ClueCard type="note" label="Who">Mrs. Vale</ClueCard><ClueCard type="photo" label="Where">the study</ClueCard><ClueCard type="watch" label="When">8:05 pm</ClueCard></div></div>;
  if (concept === 'datetime' || concept === 'sorting') return <div className="visual-stage"><Scene partIndex={partIndex} /><Timeline /><FloorPlan tokens={[{ name: 'Iris' }, { name: 'Dev' }]} /></div>;
  if (concept === 'sets' || concept === 'comparison') return <div className="visual-stage"><Scene partIndex={partIndex} /><CompareDiagram /><FloorPlan tokens={[{ name: 'Iris' }, { name: 'Pia' }]} /></div>;
  if (concept === 'recursion' || concept === 'backtracking') return <div className="visual-stage"><Scene partIndex={partIndex} /><DecisionBoard /></div>;
  return <div className="visual-stage"><Scene partIndex={partIndex} /><FloorPlan tokens={[]} /></div>;
}
