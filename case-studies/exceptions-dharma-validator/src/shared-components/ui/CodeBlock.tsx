
interface CodeBlockProps {
  label?: string;
  code: string;
  tone?: "neutral" | "danger" | "success";
}

const TONE_STYLES: Record<string, string> = {
  neutral: "border-line",
  danger: "border-[#3B2A44]",
  success: "border-[#274A3C]",
};

const TONE_LABEL_STYLES: Record<string, string> = {
  neutral: "text-muted",
  danger: "text-vermilion",
  success: "text-[#7FBF9E]",
};

export default function CodeBlock({ label, code, tone = "neutral" }: CodeBlockProps) {
  return (
    <div className={`rounded-2xl border ${TONE_STYLES[tone]} bg-panel/60 overflow-hidden`}>
      {label && (
        <div className={`px-4 py-2 text-xs tracking-wider uppercase border-b border-line ${TONE_LABEL_STYLES[tone]}`}>
          {label}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}