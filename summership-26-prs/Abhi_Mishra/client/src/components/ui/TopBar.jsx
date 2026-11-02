const labels = {
  welcome: 'Briefing', meeting: 'Investor room', table: 'The table', plots: 'Visualization lab',
  close: 'The handshake', rejected: 'Deal declined', quiz: 'Mastery check', done: 'Deal closed'
};

export function TopBar({ confidence, stage, total }) {
  return (
    <header className="topbar">
      <div className="brand"><span className="brand-mark">P</span><span>PyBe <small>Interactive way of Learning Python</small></span></div>
      <div className="status"><span>{labels[stage]}</span><b>{confidence}%</b><i className="status-track"><i style={{ width: `${confidence}%` }} /></i></div>
      <span className="step">{stage === 'plots' ? `${total} visual questions` : ''}</span>
    </header>
  );
}
