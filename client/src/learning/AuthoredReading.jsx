import React from "react";

function inline(text) {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, index) =>
      part.startsWith("`") ? (
        <code key={index}>{part.slice(1, -1)}</code>
      ) : part.startsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : part.startsWith("*") ? (
        <em key={index}>{part.slice(1, -1)}</em>
      ) : (
        part
      ),
    );
}
// A reading surface for authored written submissions. Their section order is
// retained; this does not add the guided player's teaching sequence.
export default function AuthoredReading({ markdown, onComplete }) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n"),
    blocks = [];
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const language = line.slice(3).trim(),
        code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```"))
        code.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={i}>
          <code data-language={language}>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)/);
    if (heading) {
      const Tag = "h" + heading[1].length;
      blocks.push(<Tag key={i}>{inline(heading[2])}</Tag>);
      i++;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={i} />);
      i++;
      continue;
    }
    if (line.startsWith("|") && /^\|[\s:|\-]+\|$/.test(lines[i + 1] || "")) {
      const cells = (row) =>
          row
            .slice(1, -1)
            .split("|")
            .map((cell) => cell.trim()),
        header = cells(line),
        rows = [];
      i += 2;
      while (i < lines.length && lines[i].startsWith("|"))
        rows.push(cells(lines[i++]));
      blocks.push(
        <div className="reading-table" key={i}>
          <table>
            <thead>
              <tr>
                {header.map((cell, j) => (
                  <th key={j}>{inline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j}>
                  {row.map((cell, k) => (
                    <td key={k}>{inline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        let item = lines[i++].replace(/^\d+\.\s/, "");
        while (i < lines.length && /^\s+\S/.test(lines[i]))
          item += " " + lines[i++].trim();
        items.push(item);
      }
      blocks.push(
        <ol key={i}>
          {items.map((item, j) => (
            <li key={j}>{inline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const paragraph = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(?:#|```|\||---|\d+\.\s)/.test(lines[i])
    )
      paragraph.push(lines[i++]);
    blocks.push(<p key={i}>{inline(paragraph.join(" "))}</p>);
  }
  return (
    <article className="authored-reading">
      {blocks}
      <button className="button primary" onClick={onComplete}>
        Mark this story as explored
      </button>
    </article>
  );
}
