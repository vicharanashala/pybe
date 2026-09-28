import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { usePythonRunner } from "./usePythonRunner";

interface CodeEditorProps {
  initialCode: string;
  label?: string;
}

function formatError(raw: string): string {
  // Pyodide's error message includes a full CPython-style traceback.
  // The last non-empty line is the actual "ExceptionType: message" — the
  // part students actually need to read first.
  const lines = raw.trim().split("\n").filter(Boolean);
  return lines[lines.length - 1] ?? raw;
}

export default function CodeEditor({ initialCode, label = "Try it yourself" }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<{ output: string; error: string | null } | null>(null);
  const [running, setRunning] = useState(false);
  const [showFullTraceback, setShowFullTraceback] = useState(false);
  const { run, isLoading } = usePythonRunner();

  async function handleRun() {
    setRunning(true);
    setShowFullTraceback(false);
    try {
      const res = await run(code);
      setResult(res);
    } finally {
      setRunning(false);
    }
  }

  const busy = running || isLoading;

  return (
    <div className="rounded-2xl border border-line bg-panel/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-line">
        <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
        <button
          onClick={handleRun}
          disabled={busy}
          className="flex items-center gap-1.5 bg-gold text-bg text-xs font-semibold px-3 py-1.5 rounded-full disabled:opacity-60 transition-opacity"
        >
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
          {isLoading ? "Loading Python…" : running ? "Running…" : "Run"}
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="w-full bg-transparent text-ink font-mono text-sm p-4 outline-none resize-y min-h-[140px] leading-relaxed"
      />

      {result && (
        <div
          className={`px-4 py-3 text-sm font-mono border-t ${
            result.error ? "border-[#3B2A44] bg-[#171029]/60" : "border-[#274A3C] bg-[#0E1F1A]/60"
          }`}
        >
          <p
            className={`text-xs uppercase tracking-wider mb-2 ${
              result.error ? "text-vermilion" : "text-[#7FBF9E]"
            }`}
          >
            {result.error ? "Error" : "Output"}
          </p>
          <pre className="whitespace-pre-wrap text-ink">
            {result.error
              ? showFullTraceback
                ? result.error
                : formatError(result.error)
              : result.output || "(no output)"}
          </pre>
          {result.error && (
            <button
              onClick={() => setShowFullTraceback((v) => !v)}
              className="text-muted hover:text-ink text-xs underline mt-2"
            >
              {showFullTraceback ? "Show short version" : "Show full traceback"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}