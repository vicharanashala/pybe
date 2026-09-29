/**
 * A brief "here's what you just figured out" recap — a couple of small
 * cards, not a big dashboard. Used right after a Think It Through moment.
 */
export default function DiscoverySummary({ title = "Nice work.", items }) {
  return (
    <div className="think-wrap" style={{ alignItems: "center" }}>
      <p className="story-title" style={{ fontSize: 24 }}>{title}</p>
      <div className="discovery-grid">
        {items.map((item) => (
          <div className="discovery-card" key={item.label}>
            <span className="discovery-check" aria-hidden="true">✓</span>
            <div className="discovery-icon" aria-hidden="true">{item.icon}</div>
            <p className="discovery-label">{item.label}</p>
            <p className="discovery-value">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
