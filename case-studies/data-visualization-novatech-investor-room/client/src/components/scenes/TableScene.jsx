export function TableScene({ data, onNext }) {
  return (
    <section className="content-scene scene-in">
      <div className="scene-heading">
        <h1>The numbers are true.<br /><em>The story is hidden.</em></h1>
        <p>Investors can read the table, but they cannot feel the momentum.</p>
      </div>
      <div className="data-layout">
        <div className="data-table">
          <div className="table-head"><span>MONTH</span><span>REVENUE <small>$K</small></span><span>USERS</span><span>MoM GROWTH</span></div>
          {data.map((row) => (
            <div className="table-row" key={row.month}>
              <span>{row.month}</span>
              <span>${row.revenue}K</span>
              <span>{row.users == null ? '–' : row.users.toLocaleString()}</span>
              <span className={row.growth == null ? '' : 'positive'}>{row.growth == null ? '–' : `+${row.growth}%`}</span>
            </div>
          ))}
        </div>
        <div className="investor-note">
          <span className="quote-mark">“</span>
          <p>I can see the numbers, but I don't clearly see the growth story.</p>
          <small>— Maya Chen, investor</small>
          <button className="secondary" onClick={onNext}>Make the story visible →</button>
        </div>
      </div>
    </section>
  );
}
