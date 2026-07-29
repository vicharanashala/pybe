import { describe, it, expect } from 'vitest';
import {
  MockCaseStudyGenerator,
  CompositeCaseStudyGenerator,
  LLMCaseStudyGenerator,
  createGeneratorFromEnv,
} from '../../src/agent/CaseStudyGenerator.ts';
import { StaticTextbookRetriever } from '../../src/agent/TextbookRetriever.ts';

describe('MockCaseStudyGenerator (INV-PB-6: generative)', () => {
  it('produces a case study with sequential ids starting at cs_006', async () => {
    const gen = new MockCaseStudyGenerator();
    const a = await gen.generate({
      hookWords: ['scores', 'average'],
      piagetStage: 'concrete',
      jonassenType: 'structured',
      level: 1,
      topic: 'loops',
    });
    expect(a.id).toBe('cs_006');
    const b = await gen.generate({
      hookWords: ['grades', 'classifier'],
      piagetStage: 'concrete',
      jonassenType: 'structured',
      level: 1,
      topic: 'if',
    });
    expect(b.id).toBe('cs_007');
  });

  it('always populates hookWords, scenario, and constructHint', async () => {
    const gen = new MockCaseStudyGenerator();
    const a = await gen.generate({
      hookWords: ['shopping', 'cart'],
      piagetStage: 'concrete',
      jonassenType: 'design',
      level: 1,
      topic: 'lists',
    });
    expect(a.hookWords).toEqual(['shopping', 'cart']);
    expect(a.scenario.length).toBeGreaterThan(20);
    expect(a.constructHint.length).toBeGreaterThan(0);
  });

  it('uses construct hints tuned to the topic', async () => {
    const gen = new MockCaseStudyGenerator();
    const loops = await gen.generate({
      hookWords: ['x'],
      piagetStage: 'concrete',
      jonassenType: 'structured',
      level: 1,
      topic: 'loops',
    });
    expect(loops.constructHint).toContain('for');

    const dicts = await gen.generate({
      hookWords: ['x'],
      piagetStage: 'concrete',
      jonassenType: 'structured',
      level: 1,
      topic: 'dicts',
    });
    expect(dicts.constructHint).toContain('dict');
  });
});

describe('LLMCaseStudyGenerator (interface)', () => {
  it('requires an env-keyed construction (or throws in non-fetch environments)', async () => {
    const gen = new LLMCaseStudyGenerator({
      endpoint: 'http://localhost:9',
      apiKey: 'fake',
      model: 'fake',
      retriever: new StaticTextbookRetriever(),
      // fetchImpl deliberately missing — should blow up at fetch time.
    });
    await expect(
      gen.generate({
        hookWords: ['x'],
        piagetStage: 'concrete',
        jonassenType: 'structured',
        level: 1,
        topic: 'lists',
      }),
    ).rejects.toThrow();
  });

  it('sends a JSON-formatted request and parses the content', async () => {
    interface Captured {
      url: string;
      body: string;
      auth: string | null;
    }
    const captured: Captured = {
      url: '',
      body: '',
      auth: null,
    };
    const fakeFetch: typeof fetch = async (input, init) => {
      const body = (init?.body as string) ?? '';
      const headers = init?.headers as Record<string, string> | undefined;
      captured.url = String(input);
      captured.body = body;
      captured.auth =
        headers?.['Authorization'] ?? headers?.['authorization'] ?? null;
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  id: 'cs_999',
                  title: 'Mock-from-fetch',
                  scenario: 'A scenario.',
                  hookWords: ['x'],
                  piagetStage: 'concrete',
                  topicTags: ['t'],
                  constructHint: ['list'],
                  jonassenType: 'structured',
                  level: 1,
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    };
    const gen = new LLMCaseStudyGenerator({
      endpoint: 'http://example.test/v1/chat/completions',
      apiKey: 'sk-test',
      model: 'fake-1',
      retriever: new StaticTextbookRetriever(),
      fetchImpl: fakeFetch,
    });
    const out = await gen.generate({
      hookWords: ['x'],
      piagetStage: 'concrete',
      jonassenType: 'structured',
      level: 1,
      topic: 'lists',
    });
    expect(out.id).toBe('cs_999');
    expect(captured.url).toBe('http://example.test/v1/chat/completions');
    expect(captured.auth).toBe('Bearer sk-test');
    const body = JSON.parse(captured.body) as {
      messages: { role: string; content: string }[];
    };
    expect(body.messages.some((m) => m.role === 'system')).toBe(true);
    expect(body.messages.some((m) => m.role === 'user')).toBe(true);
  });
});

describe('CompositeCaseStudyGenerator (fallback)', () => {
  it('falls back when primary throws', async () => {
    const failingPrimary = new LLMCaseStudyGenerator({
      endpoint: 'http://localhost:9',
      apiKey: 'fake',
      model: 'fake',
      fetchImpl: (async () => {
        throw new Error('network down');
      }) as typeof fetch,
    });
    const composite = new CompositeCaseStudyGenerator(
      failingPrimary,
      new MockCaseStudyGenerator(),
    );
    const out = await composite.generate({
      hookWords: ['x'],
      piagetStage: 'concrete',
      jonassenType: 'structured',
      level: 1,
      topic: 'loops',
    });
    expect(out.id).toMatch(/^cs_\d{3}$/);
  });
});

describe('createGeneratorFromEnv (env-var driven)', () => {
  it('returns Mock when no env vars are set', () => {
    const gen = createGeneratorFromEnv({});
    expect(gen.label).toContain('Mock');
  });

  it('returns Composite (LLM+Mock) when all 3 env vars are set', () => {
    const gen = createGeneratorFromEnv({
      PYBE_LLM_KEY: 'sk-test',
      PYBE_LLM_ENDPOINT: 'http://example.test/v1',
      PYBE_LLM_MODEL: 'fake-1',
    });
    expect(gen.label).toContain('Composite');
  });
});