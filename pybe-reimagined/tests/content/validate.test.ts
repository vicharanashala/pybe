import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { describe, it, expect } from 'vitest';

const ROOT = join(__dirname, '..', '..');
const SCHEMA_PATH = join(ROOT, 'schemas', 'case_study.schema.json');
const CASE_DIR = join(ROOT, 'content', 'case_studies');

function listJsonFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...listJsonFiles(full));
    } else if (entry.endsWith('.json')) {
      out.push(full);
    }
  }
  return out;
}

describe('content schema', () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf-8')) as object;
  const validate = ajv.compile(schema);

  it('has case_study.schema.json', () => {
    expect(schema).toBeDefined();
    expect((schema as { title?: string }).title).toBe('CaseStudy');
  });

  it('validates every case-study file under content/case_studies', () => {
    const files = listJsonFiles(CASE_DIR);
    expect(files.length).toBeGreaterThanOrEqual(5);

    for (const file of files) {
      const data = JSON.parse(readFileSync(file, 'utf-8')) as unknown;
      const ok = validate(data);
      if (!ok) {
        const summary = (validate.errors ?? [])
          .map((e) => `${e.instancePath || '<root>'} ${e.message}`)
          .join('; ');
        throw new Error(`${file}: ${summary}`);
      }
      expect(ok).toBe(true);
    }
  });

  it('has at least 5 case-study seeds (Phase 7 ships 25+)', () => {
    const files = listJsonFiles(CASE_DIR);
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  it('still ships the original 5 seed case studies', () => {
    const files = listJsonFiles(CASE_DIR);
    const basenames = files.map((f) => f.replace(/^.*[\\/]/, ''));
    expect(basenames).toContain('cs_001_scores.json');
    expect(basenames).toContain('cs_002_bmi.json');
    expect(basenames).toContain('cs_003_grade_classifier.json');
    expect(basenames).toContain('cs_004_average_marks.json');
    expect(basenames).toContain('cs_005_unique_emails.json');
  });
});