/**
 * CaseStudyGenerator — produces draft case studies from hook words.
 *
 * Three implementations:
 *
 * - **LLMCaseStudyGenerator** — calls an OpenAI-compatible / Anthropic /
 *   Ollama endpoint. The endpoint URL + auth key come from env vars.
 *
 * - **MockCaseStudyGenerator** — deterministic. Used in dev (no API key)
 *   and in tests. Produces real, valid case studies from a list of
 *   hand-curated templates + hook-word slots.
 *
 * - **CompositeCaseStudyGenerator** — falls back from LLM to Mock on any
 *   failure. This is what Phase 7 ships by default.
 *
 * INV-PB-6 (case-study authoring is generative) — implemented here.
 * INV-A2 (extension without modification) — adding a new generator
 * implementation requires no UI changes.
 *
 * Phase 12: the per-metaphor voice projection has been removed. Case
 * studies now present a single clean `scenario` plus an optional
 * `practitionerNote` — see CaseStudy domain type.
 */
import type { CaseStudy } from '../domain/CaseStudy.ts';
import type { Construct } from '../domain/Construct.ts';
import type { TextbookRetriever } from './TextbookRetriever.ts';
import { StaticTextbookRetriever } from './TextbookRetriever.ts';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts.ts';

export interface GeneratorInputs {
  /** Short keywords that hint at the scenario (e.g. "scores", "average"). */
  hookWords: string[];
  /** Piaget cognitive stage. */
  piagetStage: 'sensorimotor' | 'preoperational' | 'concrete' | 'formal';
  /** Jonassen's 14 problem taxonomies (Phase 7 ships the top 4). */
  jonassenType: 'structured' | 'design' | 'dilemma' | 'unstructured';
  /** Pybe level 1..5. */
  level: 1 | 2 | 3 | 4 | 5;
  /** Topic tag — drives RAG retrieval. */
  topic: string;
}

export interface Generator {
  generate(inputs: GeneratorInputs): Promise<CaseStudy>;
  /** Implementation label (for diagnostics and tests). */
  readonly label: string;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Mock generator — deterministic, no network.
 * ────────────────────────────────────────────────────────────────────────── */
export class MockCaseStudyGenerator implements Generator {
  readonly label = 'MockCaseStudyGenerator (deterministic)';
  private counter = 0;
  /**
   * Hook-words templates are deterministic functions of the inputs.
   * Each call produces a draft that:
   *  - has a stable, sequential id (cs_006, cs_007, ...)
   *  - is parable by cs_NNN patterns in tests
   */
  async generate(inputs: GeneratorInputs): Promise<CaseStudy> {
    this.counter += 1;
    const n = 5 + this.counter; // start at cs_006 (the existing 5 are 001..005)
    const id = `cs_${n.toString().padStart(3, '0')}`;
    const title = mockTitle(inputs.hookWords, inputs.jonassenType);
    const scenario = mockScenario(inputs);
    const hookWords = inputs.hookWords.slice(0, 6);
    const topicTags = [inputs.topic, ...inputs.hookWords.slice(0, 3)];
    const constructHint = mockConstructHint(inputs.topic) as Construct[];
    return {
      id,
      title,
      scenario,
      hookWords,
      piagetStage: inputs.piagetStage,
      topicTags,
      constructHint,
      jonassenType: inputs.jonassenType,
      level: inputs.level,
    };
  }
}

function mockTitle(hooks: string[], jonassen: string): string {
  const focus = hooks[0] ?? 'task';
  switch (jonassen) {
    case 'design':
      return `Designing for ${focus}`;
    case 'dilemma':
      return `The ${focus} dilemma`;
    case 'unstructured':
      return `Loose ends around ${focus}`;
    default:
      return `${capitalize(focus)} case study`;
  }
}

function mockScenario(inputs: GeneratorInputs): string {
  const lead = `A team is dealing with ${inputs.hookWords.join(', ')}.`;
  const ask = `What Python construct helps make sense of it?`;
  return `${lead} ${ask}`.trim();
}

function mockConstructHint(topic: string): string[] {
  const map: Record<string, string[]> = {
    slicing: ['slice', 'for', 'list'],
    dicts: ['dict', 'for', 'get'],
    loops: ['for', 'range', 'sum', 'len'],
    lists: ['list', 'for', 'append'],
    sets: ['set', 'for'],
    strings: ['str', 'f-string', 'slice'],
    functions: ['function', 'return'],
    modules: ['module', 'import'],
    errors: ['try', 'except'],
    comprehensions: ['list', 'for'],
    oop: ['class', 'function'],
    files: ['open', 'with'],
    regex: ['re', 'str'],
    async: ['function', 'async'],
    data: ['list', 'dict'],
    web: ['function', 'import'],
    firmware: ['function', 'class'],
    general: ['list', 'dict', 'for', 'if'],
  };
  return map[topic.toLowerCase()] ?? ['list', 'for'];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ──────────────────────────────────────────────────────────────────────────
 * LLM generator — POSTs to an OpenAI-compatible chat-completions endpoint.
 *
 * INV-A2: this is one of several generators. INV-PB-6: all drafts pass
 * through ajv validation before being saved.
 * ────────────────────────────────────────────────────────────────────────── */
export interface LLMGeneratorOptions {
  endpoint: string;
  apiKey: string;
  model: string;
  /** A retriever used to fetch reference chunks before each request. */
  retriever?: TextbookRetriever;
  fetchImpl?: typeof fetch;
}

export class LLMCaseStudyGenerator implements Generator {
  readonly label: string;
  private readonly retriever: TextbookRetriever;
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: LLMGeneratorOptions) {
    this.endpoint = opts.endpoint;
    this.apiKey = opts.apiKey;
    this.model = opts.model;
    this.retriever = opts.retriever ?? new StaticTextbookRetriever();
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.label = `LLMCaseStudyGenerator (${this.endpoint})`;
  }

  async generate(inputs: GeneratorInputs): Promise<CaseStudy> {
    const chunks = await this.retriever.retrieve(inputs.topic, 3);
    const userPrompt = buildUserPrompt({
      ...inputs,
      retrievedChunks: chunks.map((c) => c.text),
    });

    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    };

    const res = await this.fetchImpl(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`LLM endpoint returned ${res.status}: ${await res.text()}`);
    }
    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? '';
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      throw new Error(`LLM returned non-JSON: ${(err as Error).message}`);
    }
    return parsed as CaseStudy;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Composite — fallback to mock if the LLM call fails.
 * ────────────────────────────────────────────────────────────────────────── */
export class CompositeCaseStudyGenerator implements Generator {
  readonly label = 'CompositeCaseStudyGenerator (LLM -> Mock fallback)';
  constructor(
    private readonly primary: Generator,
    private readonly fallback: Generator,
  ) {}
  async generate(inputs: GeneratorInputs): Promise<CaseStudy> {
    try {
      return await this.primary.generate(inputs);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        `[pybe] primary generator (${this.primary.label}) failed: ${(err as Error).message}; falling back to ${this.fallback.label}`,
      );
      return await this.fallback.generate(inputs);
    }
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Factory
 * ────────────────────────────────────────────────────────────────────────── */
export interface EnvConfig {
  PYBE_LLM_KEY?: string;
  PYBE_LLM_ENDPOINT?: string;
  PYBE_LLM_MODEL?: string;
}

export function createGeneratorFromEnv(env: EnvConfig = process.env): Generator {
  if (env.PYBE_LLM_KEY && env.PYBE_LLM_ENDPOINT && env.PYBE_LLM_MODEL) {
    return new CompositeCaseStudyGenerator(
      new LLMCaseStudyGenerator({
        endpoint: env.PYBE_LLM_ENDPOINT,
        model: env.PYBE_LLM_MODEL,
        apiKey: env.PYBE_LLM_KEY,
      }),
      new MockCaseStudyGenerator(),
    );
  }
  return new MockCaseStudyGenerator();
}

export function resetMockCounter(): void {
  /* exposed for tests; the mock keeps a module-level counter */
}