/**
 * Validates every JSON file under content/ against the appropriate schema.
 *
 * Usage: npm run validate-content
 *
 * Returns exit code 0 on success, 1 on any validation error.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content');
const SCHEMA_DIR = join(ROOT, 'schemas');

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

function loadSchema(name: string): object {
  const path = join(SCHEMA_DIR, name);
  return JSON.parse(readFileSync(path, 'utf-8')) as object;
}

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...listFiles(full));
    } else if (entry.endsWith('.json')) {
      out.push(full);
    }
  }
  return out;
}

function classify(file: string): 'case_study' | 'metaphor' | 'graph' | null {
  if (file.endsWith('graph.json')) return 'graph';
  if (file.includes(`${'\\'}case_studies${'\\'}`) || file.includes('/case_studies/')) {
    return 'case_study';
  }
  if (file.includes(`${'\\'}metaphors${'\\'}`) || file.includes('/metaphors/')) {
    return 'metaphor';
  }
  return null;
}

function main(): void {
  const caseStudySchema = loadSchema('case_study.schema.json');
  const validateCaseStudy = ajv.compile(caseStudySchema);

  const files = listFiles(CONTENT_DIR);

  let caseStudyCount = 0;
  let metaphorCount = 0;
  let errors = 0;

  for (const file of files) {
    const kind = classify(file);
    if (kind === null) continue;
    if (kind === 'graph') continue; // graph is open-ended array

    const data = JSON.parse(readFileSync(file, 'utf-8')) as unknown;

    if (kind === 'case_study') {
      const ok = validateCaseStudy(data);
      if (!ok) {
        console.error(`[FAIL] ${file}`);
        for (const err of validateCaseStudy.errors ?? []) {
          console.error(`  - ${err.instancePath || '<root>'} ${err.message}`);
        }
        errors += 1;
      } else {
        caseStudyCount += 1;
        console.log(`[ok]   ${file}`);
      }
    } else if (kind === 'metaphor') {
      // Lightweight metaphor validation — full schema lives in TS.
      const m = data as { id?: unknown; name?: unknown; voice?: unknown };
      if (
        typeof m.id !== 'string' ||
        typeof m.name !== 'string' ||
        typeof m.voice !== 'string'
      ) {
        console.error(`[FAIL] ${file}: missing id/name/voice`);
        errors += 1;
      } else {
        metaphorCount += 1;
        console.log(`[ok]   ${file}`);
      }
    }
  }

  console.log('');
  console.log(`Case studies valid: ${caseStudyCount}`);
  console.log(`Metaphor files:     ${metaphorCount}`);
  console.log(`Errors:             ${errors}`);

  if (errors > 0) {
    process.exit(1);
  }

  if (caseStudyCount < 5) {
    console.error('Expected at least 5 case studies; got ' + caseStudyCount);
    process.exit(1);
  }

  // The metaphor system was removed in Phase 12. We no longer require
  // any metaphor files on disk — case studies present a single plain
  // scenario, optionally with a `practitionerNote` footnote.
  if (metaphorCount > 0) {
    console.warn(`Note: ${metaphorCount} metaphor file(s) found on disk but the system is disabled.`);
  }

  console.log('All content valid.');
}

main();