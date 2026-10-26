import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Minus, ShieldCheck, Sparkles } from 'lucide-react';
import { suspectImages } from '../lib/assets';

const UNKNOWN_SUSPECTS = ['Suspect 1', 'Suspect 2', 'Suspect 3', 'Suspect 4', 'Suspect 5'];

export default function SuspectBoard({ board = {} }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const activeSuspects = board?.active || [];
  const clearedSuspects = board?.cleared || [];
  const revealedSuspects = board?.revealed || [];
  const clues = board?.clues || [];

  return <aside className={`suspect-board ${expanded ? 'expanded' : ''}`} aria-label="Suspect leaderboard">
    <button type="button" className="board-mobile-toggle" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}><span>Suspect board</span><strong>{revealedSuspects.length ? `${activeSuspects.length} active` : 'Five suspects'}</strong></button>
    <div className="board-announcer" aria-live="polite">{board?.started ? (clearedSuspects.length ? `${clearedSuspects[clearedSuspects.length - 1].name} cleared.` : `${activeSuspects[0]?.name || 'No suspect'} leads the board.`) : 'No clues yet.'}</div>
    {board?.started && clues.length > 0 && <div className="board-clues" aria-label="Unlocked clues">{clues.map((clue) => <article className="board-clue" key={clue.id}><span>Clue</span><strong>{clue.label}</strong><small>{clue.text}</small><em>{(clue.connectsTo || []).join(' · ')}</em></article>)}</div>}
    <div className="board-heading"><div><span className="board-kicker">Live deduction</span><h2>{revealedSuspects.length ? 'Suspect board' : 'Five suspects'}</h2></div><span className="board-count">{revealedSuspects.length ? `${activeSuspects.length} active` : 'Sealed'}</span></div>
    <div className="suspect-list">
      {revealedSuspects.length ? activeSuspects.map((suspect) => <SuspectCard key={`${suspect.id}-${suspect.score}`} suspect={suspect} clues={clues} onOpen={setSelected} />) : UNKNOWN_SUSPECTS.map((label) => <UnknownCard key={label} label={label} />)}
    </div>
    {clearedSuspects.length > 0 && <details className="cleared-tray"><summary><ShieldCheck size={16} /> Cleared ({clearedSuspects.length})</summary><div>{clearedSuspects.map((suspect) => <button type="button" className="cleared-item" key={suspect.id} title={suspect.reason}><SuspectPhoto suspect={suspect} muted /><span><strong>{suspect.name}</strong><small><b>Cleared</b> {suspect.reason}</small></span></button>)}</div></details>}
    {selected && <div className="dossier-flyout"><button type="button" className="bar-btn" onClick={() => setSelected(null)}>Close</button><strong>{selected.name}</strong><small>{selected.role}</small><div>{(selected.clueIds || []).map((id) => { const clue = clues.find((item) => item.id === id); return <span className="dossier-clue" key={id}><Sparkles size={13} />{clue?.text || 'Clue recorded'}</span>; })}</div></div>}
    <p className="board-rule">{board?.started ? 'Score, motive strength, then name.' : 'Waiting for the first clue.'}</p>
  </aside>;
}

function UnknownCard({ label }) {
  return <article className="suspect-card suspect-unknown"><div className="rank">?</div><div className="unknown-photo" aria-hidden="true">?</div><div className="suspect-main"><div className="suspect-line"><strong>{label}</strong></div><span className="suspect-role">Sealed file</span><div className="meter empty" /><small className="suspect-reason">Awaiting introduction</small></div></article>;
}

function SuspectCard({ suspect, clues, onOpen }) {
  const Trend = suspect.trend === 'up' ? ArrowUp : suspect.trend === 'down' ? ArrowDown : Minus;
  return <article className={`suspect-card ${suspect.rank === 1 ? 'prime-suspect' : ''}`} tabIndex="0" onClick={() => onOpen(suspect)}>
    <div className="rank" aria-label={`Rank ${suspect.rank}`}>{suspect.rank}</div><SuspectPhoto suspect={suspect} />
    <div className="suspect-main"><div className="suspect-line"><strong>{suspect.name}</strong><span className={`trend ${suspect.trend}`} aria-label={`Trend ${suspect.trend}`}><Trend size={14} /></span></div><span className="suspect-role">{suspect.role}</span><div className="meter gauge" aria-label={`${suspect.score} suspicion out of 100`}><span style={{ '--score': `${suspect.score}%` }} /></div><div className="suspect-meta"><span>{suspect.score} / 100</span><span className={`status ${suspect.rank === 1 ? 'status-prime' : 'status-watch'}`}>{suspect.rank === 1 ? (suspect.score === 100 ? 'The culprit' : 'Prime suspect') : 'Under suspicion'}</span></div><small className="suspect-reason">{suspect.reason}</small><div className="clue-links" aria-label="Clues affecting this suspect">{(suspect.clueIds || []).map((id) => <i key={id} title={(clues || []).find((clue) => clue.id === id)?.label || 'Clue'} />)}</div></div>
  </article>;
}

function SuspectPhoto({ suspect, muted = false }) {
  return <span className={`suspect-photo ${muted ? 'muted' : ''} ${suspect.score === 100 ? 'culprit-photo' : ''}`}><img src={suspectImages[suspect.id]} alt={suspect.name} width="48" height="48" loading="lazy" /></span>;
}
