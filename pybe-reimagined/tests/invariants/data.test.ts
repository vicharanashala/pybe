/**
 * Data invariant tests + meta-tests (registry integrity).
 *
 * The meta-tests in this file are the structural enforcement that an
 * invariant test cannot be silently removed: the registry in _map.ts
 * lists every invariant's test ID; this file reads the registry, walks
 * every invariant, and grep-finds the named test in the corresponding
 * test file. Deleting a test → test ID is no longer present → CI fails.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { isFullyReachable } from '../../src/engine/RhizomeTraverser.ts';
import { GRAPH } from '../../src/lib/graphTypes.ts';
import {
  INVARIANTS,
  findTestInFile,
  listInvariantFiles,
} from './_map.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INV_DIR = __dirname;
// __dirname = pybe-app/tests/invariants; we need pybe-app/content
// up 2 levels (out of tests/, out of invariants/) then +content.
const CONTENT_DIR = join(__dirname, '..', '..', 'content');

function listJson(dir: string): string[] {
  const out: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (entry.endsWith('.json')) out.push(full);
    }
  } catch {
    /* directory not present */
  }
  return out;
}

describe('data.test.ts', () => {
  // INV-D1
  it('json-schema-compliance: every case study validates against the Ajv schema', () => {
    const schemaPath = join(__dirname, '..', '..', 'schemas', 'case_study.schema.json');
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8')) as object;
    const caseDir = join(CONTENT_DIR, 'case_studies');
    const files = listJson(caseDir).filter((f) => /cs_\d+\.json$/.test(f));
    expect(files.length).toBeGreaterThanOrEqual(5);
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    for (const file of files) {
      const data = JSON.parse(readFileSync(file, 'utf-8')) as unknown;
      const ok = validate(data);
      if (!ok) {
        const summary = (validate.errors ?? [])
          .map((e: { instancePath?: string; message?: string }) => `${e.instancePath || '<root>'} ${e.message}`)
          .join('; ');
        throw new Error(`${file}: ${summary}`);
      }
    }
  });

  // INV-D2
  it('graph-integrity: every graph node is reachable from every other', () => {
    expect(isFullyReachable(GRAPH)).toBe(true);
  });

  // INV-D3
  it('progress-lossless: learner state persists to localStorage under the canonical key', () => {
    const src = readFileSync(
      join(__dirname, '..', '..', 'src', 'state', 'LearnerContext.tsx'),
      'utf-8',
    );
    expect(src).toMatch(/STORAGE_KEY\s*=\s*['"]pybe:state:v1['"]/);
    expect(src).toMatch(/localStorage\.setItem/);
    expect(src).toMatch(/localStorage\.getItem/);
    expect(src).toMatch(/hasOnboarded/);
    expect(src).toMatch(/score/);
    expect(src).toMatch(/level/);
  });
});

describe('invariant registry meta-tests', () => {
  it('every invariant in the registry has at least one test', () => {
    for (const inv of INVARIANTS) {
      expect(inv.tests.length, `${inv.code} has no tests`).toBeGreaterThan(0);
    }
  });

  it('every invariant code is unique', () => {
    const seen = new Set<string>();
    for (const inv of INVARIANTS) {
      expect(seen.has(inv.code), `${inv.code} duplicated`).toBe(false);
      seen.add(inv.code);
    }
    expect(seen.size).toBe(INVARIANTS.length);
  });

  it('every invariant has a valid category', () => {
    const allowed = new Set(['pedagogical', 'architectural', 'interface', 'data']);
    for (const inv of INVARIANTS) {
      expect(allowed.has(inv.category), `${inv.code} bad category`).toBe(true);
    }
  });

  it('every invariant test ID points to an existing test in an existing file', () => {
    const files = new Set(listInvariantFiles().map((f) => f));
    for (const inv of INVARIANTS) {
      for (const id of inv.tests) {
        const [file, name] = id.split('#');
        if (!file || !name) throw new Error(`Bad id "${id}"`);
        expect(files.has(file), `Test file missing for ${inv.code}: ${file}`).toBe(true);
        const path = findTestInFile(file, name);
        expect(path, `${inv.code} test "${name}" not found in ${file}`).toBeTruthy();
      }
    }
  });

  it('counts at least 20 invariants across the registry (Phase 8 acceptance)', () => {
    expect(INVARIANTS.length).toBeGreaterThanOrEqual(20);
  });

  it('every test name listed in the registry literally appears in the test file (anti-removal)', () => {
    for (const inv of INVARIANTS) {
      for (const id of inv.tests) {
        const [file, name] = id.split('#');
        if (!file || !name) continue;
        const fullPath = join(INV_DIR, file);
        const src = readFileSync(fullPath, 'utf-8');
        const quotes = ["'", '"', '`'] as const;
        let found = false;
        for (const q of quotes) {
          if (src.includes(`it(${q}${name}`) || src.includes(`test(${q}${name}`)) {
            found = true;
            break;
          }
        }
        expect(
          found,
          `Test ${inv.code} -> ${file}#${name} no longer exists in the file. ` +
            'CI rule: removing an invariant test breaks the build.',
        ).toBe(true);
      }
    }
  });
});