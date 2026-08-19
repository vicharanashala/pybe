import React from 'react';

export function StepCartoonBadge({ storyId, stepNumber }) {
  // Return styled cartoon illustration badge depending on story and step number
  const renderVisual = () => {
    switch (storyId) {
      case 'red_hood':
        if (stepNumber === 1) return <span className="scb-emoji bounce-anim">🌲</span>;
        if (stepNumber === 2) return <span className="scb-emoji float-anim">👵</span>;
        if (stepNumber === 3) return <span className="scb-emoji wiggle-anim">🐺</span>;
        if (stepNumber === 4) return <span className="scb-emoji pulse-anim">🚨</span>;
        return <span className="scb-emoji bounce-anim">🪓</span>;

      case 'tortoise_hare':
        if (stepNumber === 1) return <span className="scb-emoji float-anim">🏁</span>;
        if (stepNumber === 2) return <span className="scb-emoji wiggle-anim">💤</span>;
        if (stepNumber === 3) return <span className="scb-emoji pulse-anim">⚠️</span>;
        if (stepNumber === 4) return <span className="scb-emoji bounce-anim">⚡</span>;
        return <span className="scb-emoji float-anim">🏆</span>;

      case 'goldilocks':
        if (stepNumber === 1) return <span className="scb-emoji bounce-anim">🐻</span>;
        if (stepNumber === 2) return <span className="scb-emoji float-anim">🥣</span>;
        if (stepNumber === 3) return <span className="scb-emoji pulse-anim">🚫</span>;
        if (stepNumber === 4) return <span className="scb-emoji wiggle-anim">🚪</span>;
        return <span className="scb-emoji float-anim">🔑</span>;

      case 'cried_wolf':
        if (stepNumber === 1) return <span className="scb-emoji float-anim">🐏</span>;
        if (stepNumber === 2) return <span className="scb-emoji bounce-anim">📯</span>;
        if (stepNumber === 3) return <span className="scb-emoji wiggle-anim">🐺</span>;
        if (stepNumber === 4) return <span className="scb-emoji pulse-anim">🛡️</span>;
        return <span className="scb-emoji float-anim">🏰</span>;

      case 'three_pigs':
        if (stepNumber === 1) return <span className="scb-emoji wiggle-anim">💨</span>;
        if (stepNumber === 2) return <span className="scb-emoji float-anim">🪵</span>;
        if (stepNumber === 3) return <span className="scb-emoji bounce-anim">🧱</span>;
        if (stepNumber === 4) return <span className="scb-emoji pulse-anim">🛠️</span>;
        return <span className="scb-emoji float-anim">🔒</span>;

      case 'hansel_gretel':
        if (stepNumber === 1) return <span className="scb-emoji bounce-anim">🍞</span>;
        if (stepNumber === 2) return <span className="scb-emoji float-anim">🐦</span>;
        if (stepNumber === 3) return <span className="scb-emoji pulse-anim">📂</span>;
        if (stepNumber === 4) return <span className="scb-emoji wiggle-anim">🧭</span>;
        return <span className="scb-emoji float-anim">🏡</span>;

      case 'jack_beanstalk':
        if (stepNumber === 1) return <span className="scb-emoji float-anim">🫘</span>;
        if (stepNumber === 2) return <span className="scb-emoji bounce-anim">🌿</span>;
        if (stepNumber === 3) return <span className="scb-emoji pulse-anim">⚠️</span>;
        if (stepNumber === 4) return <span className="scb-emoji wiggle-anim">🔄</span>;
        return <span className="scb-emoji float-anim">🍲</span>;

      case 'aladdin_genie':
        if (stepNumber === 1) return <span className="scb-emoji bounce-anim">🪔</span>;
        if (stepNumber === 2) return <span className="scb-emoji float-anim">🧞</span>;
        if (stepNumber === 3) return <span className="scb-emoji pulse-anim">🚫</span>;
        if (stepNumber === 4) return <span className="scb-emoji wiggle-anim">🛡️</span>;
        return <span className="scb-emoji float-anim">✨</span>;

      case 'cinderella':
        if (stepNumber === 1) return <span className="scb-emoji float-anim">💃</span>;
        if (stepNumber === 2) return <span className="scb-emoji bounce-anim">🕛</span>;
        if (stepNumber === 3) return <span className="scb-emoji wiggle-anim">🎃</span>;
        if (stepNumber === 4) return <span className="scb-emoji pulse-anim">👠</span>;
        return <span className="scb-emoji float-anim">🏰</span>;

      case 'pied_piper':
        if (stepNumber === 1) return <span className="scb-emoji bounce-anim">🎶</span>;
        if (stepNumber === 2) return <span className="scb-emoji float-anim">🐀</span>;
        if (stepNumber === 3) return <span className="scb-emoji pulse-anim">🌊</span>;
        if (stepNumber === 4) return <span className="scb-emoji wiggle-anim">📦</span>;
        return <span className="scb-emoji float-anim">🏞️</span>;

      default:
        return <span className="scb-emoji">💡</span>;
    }
  };

  return (
    <div className={`step-cartoon-badge-box story-theme-${storyId}`}>
      <div className="scb-glow-background" />
      {renderVisual()}
    </div>
  );
}
