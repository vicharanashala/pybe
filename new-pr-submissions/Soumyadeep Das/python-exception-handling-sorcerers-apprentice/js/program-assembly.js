function normalizeLines(code) {
    return String(code ?? "")
        .replace(/\r\n?/g, "\n")
        .replace(/\n+$/, "")
        .split("\n");
}

export function indentProgramPiece(code, setting) {
    const lines = normalizeLines(code);
    if (setting === undefined || setting === "auto") return lines.join("\n");

    const nonEmptyLines = lines.filter(line => line.trim());
    const baseIndent = nonEmptyLines.length
        ? Math.min(...nonEmptyLines.map(line => line.length - line.trimStart().length))
        : 0;
    const targetIndent = Number(setting) * 4;

    return lines.map(line => {
        if (!line.trim()) return "";
        const lineIndent = line.length - line.trimStart().length;
        const relativeIndent = Math.max(0, lineIndent - baseIndent);
        return `${" ".repeat(targetIndent + relativeIndent)}${line.trimStart()}`;
    }).join("\n");
}

export function assembleProgram(puzzle, slotIds, availablePieces, indents = {}) {
    const sections = [];
    if (puzzle?.prefixCode) sections.push(puzzle.prefixCode.replace(/\n+$/, ""));

    for (const id of slotIds) {
        const piece = availablePieces.find(item => item.id === id);
        if (!piece) continue;
        const code = indentProgramPiece(piece.code, indents[id]);
        if (!code.trim()) continue;
        sections.push({
            code,
            joinBefore: piece.joinBefore ?? "\n"
        });
    }

    return sections.reduce((source, section) => {
        if (typeof section === "string") {
            return source ? `${source}\n${section}` : section;
        }
        return source
            ? `${source}${section.joinBefore}${section.code}`
            : section.code;
    }, "");
}
