import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange, onMount }) {
  const editorRef = useRef(null);

  function handleMount(editor, monaco) {
    editorRef.current = editor;

    // Light, VS-Code-like theme tuned to sit on our light UI palette.
    monaco.editor.defineTheme("leetpy-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "keyword", foreground: "AF3A6D" },
        { token: "string", foreground: "0B7285" },
        { token: "number", foreground: "9C6B00" },
      ],
      colors: {
        "editor.background": "#FCFCFB",
        "editor.lineHighlightBackground": "#F2F2EF",
        "editorLineNumber.foreground": "#B8B5AC",
        "editorLineNumber.activeForeground": "#57534E",
        "editorGutter.background": "#FCFCFB",
        "editorIndentGuide.background": "#E7E5E1",
      },
    });
    monaco.editor.setTheme("leetpy-light");

    if (onMount) onMount(editor, monaco);
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      value={value}
      theme="leetpy-light"
      onChange={(v) => onChange(v ?? "")}
      onMount={handleMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontLigatures: false,
        minimap: { enabled: false },
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        autoIndent: "full",
        formatOnType: true,
        matchBrackets: "always",
        autoClosingBrackets: "languageDefined",
        autoClosingQuotes: "languageDefined",
        autoSurround: "languageDefined",
        scrollBeyondLastLine: false,
        renderLineHighlight: "all",
        wordWrap: "on",
        cursorBlinking: "smooth",
        padding: { top: 12, bottom: 12 },
      }}
    />
  );
}
