const options = ['It made patterns easier to see', 'It helped compare values', 'It revealed trends', 'It helped communicate insights'];

// Skill bars come from the learner's real quiz answers, grouped by topic.
function topicScores(results) {
  const byTopic = new Map();
  results.forEach(({ topic, correct }) => {
    const entry = byTopic.get(topic) ?? { right: 0, total: 0 };
    byTopic.set(topic, { right: entry.right + (correct ? 1 : 0), total: entry.total + 1 });
  });
  return [...byTopic].map(([topic, { right, total }]) => ({ topic, pct: Math.round((right / total) * 100) }));
}

export function Completion({ results, confidence, reflection, setReflection, onRestart }) {
  const right = results.filter((r) => r.correct).length;
  const toggle = (item) => setReflection(reflection.includes(item) ? reflection.filter((v) => v !== item) : [...reflection, item]);
  return (
    <section className="completion scene-in">
      <div className="confetti">✦　✧　✦</div>
      <span className="eyebrow">NOVA-01 / OUTCOME</span>
      <h1>The deal is <em>closed.</em></h1>
      <p className="completion-lede">“Now the story is clear. Let's move forward.”</p>
      <div className="mastery-grid">
        <div className="mastery-score">
          <span>MATPLOTLIB CONFIDENCE</span>
          <strong>{confidence}%</strong>
          <small>{right} / {results.length} quiz answers landed</small>
        </div>
        <div className="skills">
          <span>YOUR VISUAL TOOLKIT</span>
          {topicScores(results).map(({ topic, pct }) => (
            <div key={topic}><b>{topic}</b><i><i style={{ width: `${pct}%` }} /></i><small>{pct}%</small></div>
          ))}
        </div>
      </div>
      <div className="reflection">
        <span className="eyebrow">REFLECTION</span>
        <h2>What did visualization change?</h2>
        <div>
          {options.map((item) => (
            <button className={reflection.includes(item) ? 'reflection-option selected' : 'reflection-option'} key={item} onClick={() => toggle(item)}>
              <span>{reflection.includes(item) ? '✓' : '+'}</span>{item}
            </button>
          ))}
        </div>
      </div>
      <button className="secondary" onClick={onRestart}>Replay the pitch ↗</button>
    </section>
  );
}






