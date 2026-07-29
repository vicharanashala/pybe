import { useState } from 'react';
import { Search } from 'lucide-react';

interface DemoEntry {
  key: string;
  value: string;
}

interface Props {
  entries?: DemoEntry[];
}

/**
 * Visual demo for Python dictionaries.
 *
 * Inspired by W3Schools' Python Dictionaries page: each entry is shown
 * as a labelled box; the learner can type a key to look up the value.
 * INV-P2 (First Principles): shows that a dictionary pairs each key
 * with one value, and that you fetch by name (not by position).
 */
export function DictionaryVisual({ entries }: Props) {
  const data: DemoEntry[] = entries ?? [
    { key: 'name', value: 'Ansh' },
    { key: 'height_cm', value: '172' },
    { key: 'weight_kg', value: '70' },
    { key: 'hobby', value: 'volleyball' },
    { key: 'city', value: 'Roorkee' },
  ];

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const found = data.find((e) => e.key === query.trim());
  const notFound = query.trim().length > 0 && !found;

  return (
    <section
      data-testid="pybe-visual-dictionary"
      className="pybe-card"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Dictionary visual
        </span>
        <code className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {'{ "name": "Ansh", ... }'}
        </code>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data.map((entry) => {
          const isHovered = hoveredKey === entry.key;
          const isQueried = found && found.key === entry.key;
          return (
            <div
              key={entry.key}
              onMouseEnter={() => setHoveredKey(entry.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-sm transition-colors ${
                isHovered || isQueried
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-stone-200 bg-stone-50'
              }`}
            >
              <span className="font-bold text-amber-700">{entry.key}</span>
              <span className="text-stone-400">:</span>
              <span className="text-stone-800">{entry.value}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            data-testid="pybe-dict-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try typing: name, hobby, or "missing"'
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </label>
        <p className="mt-2 text-xs text-stone-500">
          {found && (
            <>
              <strong>dictionary["{found.key}"]</strong> ={' '}
              <span className="font-mono text-emerald-700">"{found.value}"</span>
            </>
          )}
          {notFound && (
            <>
              <span className="font-mono text-rose-700">KeyError:</span> "{query.trim()}"
              is not in the dictionary. That is what <code>d[k]</code> does when{' '}
              <code>k</code> is missing — that's why <code>d.get(k)</code> exists.
            </>
          )}
        </p>
      </div>
    </section>
  );
}