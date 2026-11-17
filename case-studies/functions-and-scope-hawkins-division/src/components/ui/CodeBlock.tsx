interface CodeBlockProps {
  code: string
  label?: string
  highlight?: boolean
}

const KEYWORDS = ['def', 'return', 'if', 'else', 'for', 'in', 'global', 'not', 'import', 'print']

function highlightLine(line: string) {
  const tokens = line.split(/(\s+|\(|\)|:|,)/)
  return tokens.map((tok, i) => {
    if (KEYWORDS.includes(tok)) {
      return (
        <span key={i} className="text-rift font-semibold">
          {tok}
        </span>
      )
    }
    if (/^".*"$/.test(tok)) {
      return (
        <span key={i} className="text-volt">
          {tok}
        </span>
      )
    }
    if (/^#/.test(tok)) {
      return (
        <span key={i} className="text-white/35 italic">
          {tok}
        </span>
      )
    }
    return <span key={i}>{tok}</span>
  })
}

export default function CodeBlock({ code, label }: CodeBlockProps) {
  const lines = code.split('\n')
  return (
    <div className="rounded-md border border-volt/25 bg-[#050505] overflow-hidden shadow-volt/20">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-blood/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
        <span className="w-2.5 h-2.5 rounded-full bg-volt/60" />
        <span className="ml-2 text-[11px] font-mono-tight text-white/40">{label ?? 'terminal.py'}</span>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-[13px] sm:text-sm leading-relaxed font-mono-tight">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            <span className="select-none text-white/20 inline-block w-6 text-right mr-3">{i + 1}</span>
            {highlightLine(line) as any}
          </div>
        ))}
      </pre>
    </div>
  )
}
