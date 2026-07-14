import React from "react";

// Renders a small, safe subset of markdown used in our problem descriptions:
// **bold**, `inline code`, blank-line paragraphs, and lines starting with
// "1. " / "- " as list items. No HTML injection — everything goes through
// React's normal text nodes.
function renderInline(text, keyPrefix) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={`${keyPrefix}-b-${i++}`}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(
        <code className="inline-code" key={`${keyPrefix}-c-${i++}`}>
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function MarkdownLite({ text }) {
  const lines = (text || "").split("\n");
  const blocks = [];
  let listBuffer = [];

  function flushList() {
    if (listBuffer.length) {
      blocks.push(
        <ol key={`list-${blocks.length}`} className="md-list">
          {listBuffer.map((item, i) => (
            <li key={i}>{renderInline(item, `li-${blocks.length}-${i}`)}</li>
          ))}
        </ol>
      );
      listBuffer = [];
    }
  }

  lines.forEach((line, idx) => {
    const numbered = line.match(/^\d+\.\s+(.*)/);
    const bulleted = line.match(/^-\s+(.*)/);
    if (numbered) {
      listBuffer.push(numbered[1]);
    } else if (bulleted) {
      listBuffer.push(bulleted[1]);
    } else {
      flushList();
      if (line.trim() === "") {
        blocks.push(<div key={`sp-${idx}`} className="md-spacer" />);
      } else {
        blocks.push(<p key={`p-${idx}`}>{renderInline(line, `p-${idx}`)}</p>);
      }
    }
  });
  flushList();

  return <div className="md-lite">{blocks}</div>;
}
