import React from 'react';
import { manorAsset, suspectIdFromName, suspectImages } from '../lib/assets';

export function Avatar({ name, role }) {
  return <div className="illustration-avatar" role="img" aria-label={`${name}, ${role}`}>
    <img src={suspectImages[suspectIdFromName(name)]} alt={name} width="112" height="112" loading="lazy" />
    <strong>{name}</strong><small>{role}</small>
  </div>;
}

export function Scene({ partIndex = 0 }) {
  const scenes = [
    { sky: 'storm', title: 'Rosewood Manor', detail: 'a locked gate' },
    { sky: 'study', title: 'The Study', detail: 'a broken window' },
    { sky: 'hall', title: 'The Hall Clock', detail: 'three times' },
    { sky: 'gallery', title: 'The West Wing', detail: 'five alibis' },
    { sky: 'grid', title: 'The Evidence Wall', detail: 'one choice at a time' },
    { sky: 'dawn', title: 'The Drawing Room', detail: 'the last answer' }
  ];
  const scene = scenes[partIndex] || scenes[0];
  return <figure className={`scene scene-${scene.sky}`}>
    <img src={manorAsset} alt="Rosewood Manor" width="448" height="252" loading={partIndex === 0 ? 'eager' : 'lazy'} />
    <figcaption className="scene-caption">
      <div className="scene-scrim">
        <strong className="scene-title">{scene.title}</strong>
        <span className="scene-detail">{scene.detail}</span>
      </div>
    </figcaption>
  </figure>;
}

export function ClueCard({ type = 'note', label, children }) {
  return <article className={`clue-card clue-${type}`}><span className="clue-pin" /><div className="clue-object" aria-hidden="true"><svg viewBox="0 0 52 52">{type === 'watch' ? <><circle cx="25" cy="25" r="19" /><path d="M25 25l8-7m-8 7v-10" /></> : type === 'key' ? <><circle cx="18" cy="25" r="8" /><path d="M25 25h25m-6 0v8m-7-8v5" /></> : type === 'photo' ? <><rect x="5" y="7" width="40" height="36" rx="2" /><circle cx="25" cy="22" r="7" /><path d="M12 40l9-10 7 6 5-5 9 9" /></> : <><path d="M5 8h40v34H5z" /><path d="M11 18h28M11 25h22M11 32h27" /></>}</svg></div><div><strong>{label}</strong><p>{children}</p></div></article>;
}

export function FloorPlan({ tokens = [] }) {
  return <div className="floor-plan"><svg viewBox="0 0 900 380" role="img" aria-label="Top-down manor room plan"><path className="floor-paper" d="M20 20h860v340H20z" /><g className="floor-walls"><path d="M35 35h250v145h-90v165H35zM285 35h270v145h-95v165H285zM555 35h330v145H555zM555 180h160v165H555zM715 180h170v165H715z" /><path d="M285 180h40m70 0h50m100 0h40m50 0h40M555 260h40m70 0h40" /></g><g className="floor-furniture"><rect x="80" y="70" width="100" height="45" /><circle cx="420" cy="100" r="28" /><rect x="650" y="65" width="150" height="35" /><rect x="600" y="220" width="90" height="55" /><rect x="760" y="225" width="70" height="65" /></g><text x="70" y="155">STUDY</text><text x="350" y="155">HALL</text><text x="635" y="155">LIBRARY</text><text x="580" y="325">GALLERY</text><text x="750" y="325">MUSIC</text>{tokens.map((token, index) => <image className="floor-token-photo" key={token.name} href={suspectImages[suspectIdFromName(token.name)]} x={80 + index * 125} y={index % 2 ? 72 : 227} width="38" height="38" preserveAspectRatio="xMidYMid slice" />)}</svg></div>;
}

export function Timeline() {
  return <div className="timeline-art"><div className="timeline-track" />{['8:05', '8:10', '8:12'].map((time, index) => <div className="timeline-stop" style={{ '--stop': `${12 + index * 38}%` }} key={time}><span>{time}</span><small>{['glass', 'coat', 'lights'][index]}</small></div>)}<div className="time-note"><b>Same moment, two notes</b><span>9:45pm · 21:50</span></div></div>;
}

export function CompareDiagram() {
  return <div className="compare-art"><div className="compare-circle compare-said">what they said</div><div className="compare-circle compare-seen">what we saw</div><span className="compare-gap">only one side</span></div>;
}

export function DecisionBoard() {
  return <div className="decision-art"><div className="decision-root">try a guess</div><div className="decision-branches"><span className="decision-bad">breaks a clue<br /><b>undo</b></span><span className="decision-good">still fits<br /><b>keep going</b></span></div></div>;
}
