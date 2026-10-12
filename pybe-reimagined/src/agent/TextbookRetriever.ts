/**
 * TextbookRetriever — RAG-style retrieval over open-source Python textbooks.
 *
 * Phase 7 ships with a deterministic mock corpus (keyed by topic) so the
 * generator has something to anchor on without an external embedding
 * service in dev. Phase 9 will swap in a real vector store via OpenAI,
 * Ollama, or local embeddings.
 *
 * The interface is intentionally minimal — only one method: `retrieve()`.
 * Embeddings are an implementation detail.
 */

export type TextbookKey =
  | 'lists'
  | 'dicts'
  | 'loops'
  | 'slicing'
  | 'sets'
  | 'strings'
  | 'functions'
  | 'modules'
  | 'errors'
  | 'comprehensions'
  | 'oop'
  | 'files'
  | 'regex'
  | 'async'
  | 'data'
  | 'web'
  | 'firmware'
  | 'general';

export interface TextbookChunk {
  topic: TextbookKey;
  text: string;
}

export interface TextbookRetriever {
  retrieve(topic: string, k?: number): Promise<TextbookChunk[]>;
}

/**
 * Inline corpus: short, hand-written excerpts modeled on the open-source
 * Python textbooks Sir named in the vision session (Automate the Boring
 * Stuff, Think Python, Dive into Python 3, etc.). Short on purpose — they
 * prime the LLM, they don't replace it.
 */
const CORPUS: TextbookChunk[] = [
  {
    topic: 'lists',
    text: 'A list in Python is an ordered, mutable collection written as [a, b, c]. Use list.append to grow, list.sort to order, len(list) for length. Loops over a list via `for x in lst`.',
  },
  {
    topic: 'dicts',
    text: 'A dict maps keys to values: {"key": value}. Access via d[key] (raises KeyError if missing) or d.get(key, default). Iteration over a dict yields its keys.',
  },
  {
    topic: 'loops',
    text: '`for` iterates over a sequence. `while` runs as long as a condition holds. Use `break` to exit early, `continue` to skip an iteration. `range(n)` produces 0..n-1.',
  },
  {
    topic: 'slicing',
    text: 'A slice s[start:stop:step] takes elements start..stop exclusive. Negative indices count from the end. step defaults to 1; -1 reverses.',
  },
  {
    topic: 'sets',
    text: 'A set is unordered and deduplicated: {1, 2, 3}. Adding an existing element is a no-op. Useful for membership tests and removing duplicates.',
  },
  {
    topic: 'strings',
    text: 'Strings are immutable sequences. f-strings embed expressions: f"Hello {name}". Methods: .split, .join, .strip, .upper.',
  },
  {
    topic: 'functions',
    text: '`def fn(args):` defines a function. `return` exits with a value. *args collects positionals, **kwargs collects keyword args.',
  },
  {
    topic: 'modules',
    text: '`import math` brings a module into scope. `from math import sqrt` brings a single name. `__name__ == "__main__"` guards script entry points.',
  },
  {
    topic: 'errors',
    text: 'try/except catches exceptions. raise X() signals them. Custom exception classes subclass Exception.',
  },
  {
    topic: 'comprehensions',
    text: '[expr for x in iter if cond] builds a list. dict/set comprehensions use braces. Generator expressions use parentheses.',
  },
  {
    topic: 'oop',
    text: 'class Point: def __init__(self, x, y): self.x = x defines an object. Methods receive self. Inheritance: class Sub(Base):.',
  },
  {
    topic: 'files',
    text: 'open(path) returns a file. The `with` statement closes it on exit. Read with .read() / .readlines(); write with .write().',
  },
  {
    topic: 'regex',
    text: 're.search(pattern, text) returns the first match. re.findall returns all. r"\\d+" matches one or more digits.',
  },
  {
    topic: 'async',
    text: 'async def defines a coroutine. await yields control. asyncio.gather runs many coroutines concurrently.',
  },
  {
    topic: 'data',
    text: 'pandas DataFrames are 2-D labeled arrays. df[col] selects a column; df.iloc[i, j] indexes by position.',
  },
  {
    topic: 'web',
    text: 'requests.get(url).text fetches HTML. BeautifulSoup(html, "html.parser") parses tags; soup.select(".class") queries by CSS.',
  },
  {
    topic: 'firmware',
    text: 'MicroPython runs Python on microcontrollers. Pins are addressed by number; GPIO toggles via Pin.value(1).',
  },
  {
    topic: 'general',
    text: 'Python is dynamically typed. Indentation defines blocks. Everything is an object. The Zen of Python: import this.',
  },
];

export class StaticTextbookRetriever implements TextbookRetriever {
  async retrieve(topic: string, k = 3): Promise<TextbookChunk[]> {
    const lc = topic.toLowerCase().trim();
    // Direct hit
    const direct = CORPUS.filter((c) => c.topic === lc);
    // Partial hits
    const partial = CORPUS.filter(
      (c) => c.topic !== lc && (lc.includes(c.topic) || c.topic.includes(lc)),
    );
    // Fallback to general
    const general = CORPUS.filter((c) => c.topic === 'general');
    return [...direct, ...partial, ...general].slice(0, k);
  }
}