const KEYWORDS = ["def", "if", "else", "return"];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderLine(line, highlight) {
  const parts = [];
  const patterns = [...KEYWORDS, '"[^"]*"'];
  if (highlight) patterns.unshift(escapeRegex(highlight));
  const regex = new RegExp(`(${patterns.join("|")})`, "g");

  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{line.slice(lastIndex, match.index)}</span>);
    }
    const token = match[0];
    let className = "";
    if (highlight && token === highlight) className = "tok-highlight";
    else if (KEYWORDS.includes(token)) className = "tok-keyword";
    else if (token.startsWith('"')) className = "tok-string";
    parts.push(
      <span key={key++} className={className}>
        {token}
      </span>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) {
    parts.push(<span key={key++}>{line.slice(lastIndex)}</span>);
  }
  return parts;
}

/**
 * A short Python snippet presented as a story object (a little note Mia
 * wrote down), not an IDE. `highlight` marks the exact word the current
 * beat is teaching; `caption` explains it in one line underneath.
 */
export default function CodeCard({ lines, highlight, caption }) {
  return (
    <div className="code-card">
      <pre>
        {lines.map((line, i) => (
          <div key={i}>{line === "" ? "\u00A0" : renderLine(line, highlight)}</div>
        ))}
      </pre>
      {caption && (
        <div className="code-card-caption">
          <span aria-hidden="true">↳</span>
          <span>{caption}</span>
        </div>
      )}
    </div>
  );
}
