import React from 'react';

/* Shared floating UI that sits over the 3D stage. */

export function ActTitle({ eyebrow, title, sub, enter = 1 }) {
  return (
    <div
      className="jr-act-title"
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 26}px) translateZ(${(1 - enter) * -160}px)`,
      }}
    >
      <div className="jr-act-eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export function Caption({ chapter, text, tone = 'neutral', enter = 1 }) {
  return (
    <div
      className={`jr-caption jr-cap-${tone}`}
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 30}px) rotateX(${(1 - enter) * 10}deg)`,
      }}
    >
      {chapter && <div className="jr-cap-chapter">{chapter}</div>}
      <p className="jr-cap-text" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

export function Banner({ show, tone = 'gold', children }) {
  return <div className={`jr-banner jr-banner-${tone} ${show ? 'is-on' : ''}`}>{children}</div>;
}

/** The little "which branch ran" scoreboard shown once a raid resolves. */
export function BranchScore({ show, branches }) {
  return (
    <div className={`jr-branchscore ${show ? 'is-on' : ''}`}>
      {branches.map((b) => (
        <div key={b.label} className={`jr-branch ${b.taken ? 'is-taken' : 'is-dead'}`}>
          <span className="jr-branch-key">{b.label}</span>
          <span className="jr-branch-body">{b.text}</span>
          <span className="jr-branch-state">{b.taken ? 'ran' : b.reason || 'never ran'}</span>
        </div>
      ))}
    </div>
  );
}
