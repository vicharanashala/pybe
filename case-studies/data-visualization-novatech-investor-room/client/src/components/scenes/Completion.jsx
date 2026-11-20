const options = ['It made patterns easier to see', 'It helped compare values', 'It revealed trends', 'It helped communicate insights'];

export function Completion({ results, reflection, setReflection, onRestart }) {
  const toggle = (item) => setReflection(reflection.includes(item) ? reflection.filter((v) => v !== item) : [...reflection, item]);
  return (
    <section className="completion scene-in">
      <span className="eyebrow">NOVA-01 / OUTCOME</span>
      <h1>The deal is <em>closed.</em></h1>
      <p className="completion-lede">“Now the story is clear. Let's move forward.”</p>
      <div className="visual-toolkit"><span>YOUR VISUAL TOOLKIT</span><ul>{[...new Set(results.map(result=>result.topic))].map(topic=><li key={topic}>{topic}</li>)}</ul></div>
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






