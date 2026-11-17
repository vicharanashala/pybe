import { describe, it, expect } from 'vitest';
import {
  assembleBlanks,
  filledCount,
  isComplete,
  slotIdsInTemplate,
  templateLines,
} from '../blanks';
import { getMission } from '../missions';

const ch1 = getMission('ch1-seeds');
const ch2 = getMission('ch2-weather');

describe('template parsing', () => {
  it('finds slot ids in the order they appear', () => {
    expect(slotIdsInTemplate('if {{cond}}:\n    {{body}}')).toEqual(['cond', 'body']);
  });

  it('does not repeat a slot used twice', () => {
    expect(slotIdsInTemplate('{{a}} and {{a}}')).toEqual(['a']);
  });

  it('splits a line into text and slot segments', () => {
    expect(templateLines('if {{cond}}:')).toEqual([
      [
        { type: 'text', value: 'if ' },
        { type: 'slot', id: 'cond' },
        { type: 'text', value: ':' },
      ],
    ]);
  });

  it('keeps a line with no slot as one text segment', () => {
    expect(templateLines('seeds = 20')).toEqual([[{ type: 'text', value: 'seeds = 20' }]]);
  });

  it('keeps blank lines as empty segment lists so line count survives', () => {
    const lines = templateLines('a\n\nb');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toEqual([]);
  });

  it('preserves the indentation carried by the template', () => {
    const [, line] = templateLines('if x:\n    {{body}}');
    expect(line[0]).toEqual({ type: 'text', value: '    ' });
  });
});

describe('assembling', () => {
  it('substitutes the chosen snippets', () => {
    const out = assembleBlanks('if {{cond}}:\n    {{body}}', { cond: 'x == 1', body: 'go()' });
    expect(out).toBe('if x == 1:\n    go()');
  });

  it('leaves an unchosen slot empty', () => {
    expect(assembleBlanks('seeds = {{v}}', {})).toBe('seeds = ');
  });

  it('reports completeness and progress', () => {
    const t = 'if {{cond}}:\n    {{body}}';
    expect(isComplete(t, {})).toBe(false);
    expect(isComplete(t, { cond: 'x' })).toBe(false);
    expect(isComplete(t, { cond: 'x', body: 'y' })).toBe(true);
    expect(filledCount(t, { cond: 'x' })).toBe(1);
  });

  it('treats an empty string as unchosen', () => {
    expect(isComplete('seeds = {{v}}', { v: '' })).toBe(false);
  });

  it('ignores selections for slots the template does not use', () => {
    expect(isComplete('seeds = {{v}}', { v: '1', leftover: 'x' })).toBe(true);
  });
});

// The scaffold must not be a separate, easier grader. These check that what the
// pickers can assemble lands on the same verdicts as hand-typed code.
describe('mission blanks stay consistent with the missions', () => {
  it('both missions offer blanks whose slots match their template', () => {
    for (const mission of [ch1, ch2]) {
      const ids = slotIdsInTemplate(mission.blanks.template);
      expect(ids).toEqual(mission.blanks.slots.map((s) => s.id));
    }
  });

  it('every slot has at least two options, so there is a real choice', () => {
    for (const mission of [ch1, ch2]) {
      for (const slot of mission.blanks.slots) {
        expect(slot.options.length).toBeGreaterThanOrEqual(2);
        expect(new Set(slot.options).size).toBe(slot.options.length);
      }
    }
  });

  it('Chapter 1 has exactly one option that reaches 30 from the old value', () => {
    const { template, slots } = ch1.blanks;
    const correct = slots[0].options.filter((option) => {
      const code = assembleBlanks(template, { value: option });
      return /seeds\s*=\s*seeds\s*\+\s*10/.test(code);
    });
    expect(correct).toEqual(['seeds + 10']);
  });

  it("Chapter 1's starter and blanks template agree on the starting count", () => {
    expect(ch1.blanks.template).toContain('seeds = 20');
    expect(ch1.starterCode).toContain('seeds = 20');
  });

  it('Chapter 2 can assemble the canonical solution, and it passes validation', () => {
    const code = assembleBlanks(ch2.blanks.template, {
      condition: 'weather == "rain"',
      ifBody: 'print("No need to water")',
      elseBody: 'water_crops()',
    });
    expect(code).toBe(
      'weather = "sunny"\n\nif weather == "rain":\n    print("No need to water")\nelse:\n    water_crops()\n'
    );

    const runs = [
      { scenarioId: 'sunny', globals: { water: '50' }, output: '', error: null, calls: { water_crops: 1 } },
      { scenarioId: 'rain', globals: { water: '50' }, output: '', error: null, calls: { water_crops: 0 } },
    ];
    expect(ch2.validate(runs, code).passed).toBe(true);
  });

  it('Chapter 2 can assemble the inverted answer, and it fails', () => {
    const code = assembleBlanks(ch2.blanks.template, {
      condition: 'weather == "rain"',
      ifBody: 'water_crops()',
      elseBody: 'print("No need to water")',
    });
    const runs = [
      { scenarioId: 'sunny', globals: { water: '50' }, output: '', error: null, calls: { water_crops: 0 } },
      { scenarioId: 'rain', globals: { water: '50' }, output: '', error: null, calls: { water_crops: 1 } },
    ];
    const verdict = ch2.validate(runs, code);
    expect(verdict.passed).toBe(false);
    expect(verdict.message).toContain('wrong way round');
  });

  it('Chapter 2 keeps the branch bodies indented under their branch', () => {
    const code = assembleBlanks(ch2.blanks.template, {
      condition: 'weather == "rain"',
      ifBody: 'print("x")',
      elseBody: 'water_crops()',
    });
    const lines = code.split('\n');
    expect(lines[3].startsWith('    ')).toBe(true);
    expect(lines[5].startsWith('    ')).toBe(true);
  });
});
