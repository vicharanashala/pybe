import React from 'react';

export default function Page12_MemoryCard() {
  return (
    <div className="slide-body" style={{ gap: '14px' }}>
      <h2 className="story-title">Iterator vs Generator Syntax Comparison</h2>
      <p className="story-text" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
        Side-by-side Python code syntax for Iterators (`iter()`, `next()`) and Generators (`yield`):
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          width: '100%',
          maxWidth: '880px',
          textAlign: 'left'
        }}
      >
        {/* Left Card: Iterator Syntax */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--duo-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              1. Iterator Syntax 🚶
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '4px' }}>
              Convert an existing Iterable (list) into an Iterator using <code>iter()</code>, then step 1-by-1 via <code>next()</code>.
            </p>
          </div>

          <div className="code-window" style={{ borderColor: 'var(--border-iterator)' }}>
            <div className="code-window-header">
              <div className="window-dots">
                <span className="dot-red" />
                <span className="dot-yellow" />
                <span className="dot-green" />
              </div>
              <span className="code-window-title">iterator.py</span>
            </div>
            <div className="code-window-body">
              <span style={{ color: '#6272a4' }}># 1. Iterable collection in RAM</span>{'\n'}
              vault = [<span style={{ color: '#f1fa8c' }}>"Gold 🪙"</span>, <span style={{ color: '#f1fa8c' }}>"Gem 💎"</span>]{'\n\n'}
              <span style={{ color: '#6272a4' }}># 2. Create Iterator pointer</span>{'\n'}
              explorer = <span style={{ color: '#8be9fd' }}>iter</span>(vault){'\n\n'}
              <span style={{ color: '#6272a4' }}># 3. Fetch items 1-by-1 on demand</span>{'\n'}
              <span style={{ color: '#8be9fd' }}>print</span>(<span style={{ color: '#8be9fd' }}>next</span>(explorer)){'  '}<span style={{ color: '#6272a4' }}># Gold 🪙</span>{'\n'}
              <span style={{ color: '#8be9fd' }}>print</span>(<span style={{ color: '#8be9fd' }}>next</span>(explorer)){'  '}<span style={{ color: '#6272a4' }}># Gem 💎</span>{'\n'}
              <span style={{ color: '#6272a4' }}># next(explorer)   # StopIteration!</span>
            </div>
          </div>
        </div>

        {/* Right Card: Generator Syntax */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--duo-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              2. Generator Syntax 🚰
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '4px' }}>
              Define a function with <code>yield</code> to produce items dynamically on-the-fly without holding lists in RAM.
            </p>
          </div>

          <div className="code-window" style={{ borderColor: 'var(--border-generator)' }}>
            <div className="code-window-header">
              <div className="window-dots">
                <span className="dot-red" />
                <span className="dot-yellow" />
                <span className="dot-green" />
              </div>
              <span className="code-window-title">generator.py</span>
            </div>
            <div className="code-window-body">
              <span style={{ color: '#6272a4' }}># 1. Generator function with yield</span>{'\n'}
              <span style={{ color: '#ff79c6', fontWeight: 800 }}>def </span>
              <span style={{ color: '#50fa7b', fontWeight: 800 }}>magic_tap</span>():{'\n'}
              {'  '}<span style={{ color: '#ff79c6', fontWeight: 800 }}>yield </span><span style={{ color: '#f1fa8c' }}>"Water 💧"</span>{'\n'}
              {'  '}<span style={{ color: '#ff79c6', fontWeight: 800 }}>yield </span><span style={{ color: '#f1fa8c' }}>"Juice 🧃"</span>{'\n\n'}
              <span style={{ color: '#6272a4' }}># 2. Create Generator object</span>{'\n'}
              tap = magic_tap(){'\n\n'}
              <span style={{ color: '#6272a4' }}># 3. Yield items 1-by-1 lazily</span>{'\n'}
              <span style={{ color: '#8be9fd' }}>print</span>(<span style={{ color: '#8be9fd' }}>next</span>(tap)){'        '}<span style={{ color: '#6272a4' }}># Water 💧</span>{'\n'}
              <span style={{ color: '#8be9fd' }}>print</span>(<span style={{ color: '#8be9fd' }}>next</span>(tap)){'        '}<span style={{ color: '#6272a4' }}># Juice 🧃</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
