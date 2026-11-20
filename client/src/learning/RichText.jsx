import React from "react";
export function InlineText({ text = "" }) {
  const pieces = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return pieces.map((piece, i) =>
    piece.startsWith("**") ? (
      <strong key={i}>{piece.slice(2, -2)}</strong>
    ) : piece.startsWith("`") ? (
      <code key={i}>{piece.slice(1, -1)}</code>
    ) : piece.startsWith("*") ? (
      <em key={i}>{piece.slice(1, -1)}</em>
    ) : (
      piece
    ),
  );
}
export function LessonText({ text = "" }) {
  return String(text)
    .split(/(```[\s\S]*?```)/g)
    .map((part, i) =>
      part.startsWith("```") ? (
        <pre key={i}>
          {part
            .replace(/^```\w*\n?/, "")
            .replace(/```$/, "")
            .trimEnd()}
        </pre>
      ) : (
        <div key={i}>
          {part
            .split("\n")
            .filter((line) => line.trim())
            .map((line, j) =>
              line.startsWith("- ") ? (
                <p key={j}>
                  • <InlineText text={line.slice(2)} />
                </p>
              ) : (
                <p key={j}>
                  <InlineText text={line} />
                </p>
              ),
            )}
        </div>
      ),
    );
}
