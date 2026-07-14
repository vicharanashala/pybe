/**
 * Architectural / SOLID invariant tests.
 *
 * Phase 12: INV-A3 (MetaphorDecorated is a LessonRenderer) was retired
 * along with the metaphor system. INV-A2's "no hardcoded metaphor
 * ids" check was generalised to "no hardcoded id lists in the
 * dynamic loaders" — see the test body.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC = join(__dirname, '..', '..', 'src');

describe('architectural.test.ts', () => {
  // INV-A1
  it('domain-files-own-one-type: each src/domain/*.ts file has at most one main interface, with helpers', () => {
    const dir = join(SRC, 'domain');
    const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
    for (const f of files) {
      const src = readFileSync(join(dir, f), 'utf-8');
      const interfaces = src.match(/^\s*export\s+interface\s+\w+/gm) ?? [];
      expect(interfaces.length, `${f} has too many interfaces`).toBeLessThanOrEqual(3);
      const totalExports = src.match(/^\s*export\s+/gm) ?? [];
      expect(totalExports.length, `${f} should have at least one export`).toBeGreaterThan(0);
    }
  });

  // INV-A2 (re-cast): the case-study loader is the remaining dynamic
  // loader in the codebase. It must use import.meta.glob so adding a
  // new cs_NNN.json is a zero-code change.
  it('no-hardcoded-ids: case-study loader uses import.meta.glob', () => {
    const casesPath = join(SRC, 'lib', 'cases.ts');
    expect(existsSync(casesPath)).toBe(true);
    const src = readFileSync(casesPath, 'utf-8');
    expect(src).toMatch(/import\.meta\.glob/);
  });

  // INV-A4
  it('adapter-interfaces-are-narrow: each adapter declares only what the UI consumes', () => {
    const pythonRunner = readFileSync(join(SRC, 'adapter', 'PythonRunner.ts'), 'utf-8');
    const voiceInput = readFileSync(join(SRC, 'adapter', 'VoiceInput.ts'), 'utf-8');
    const pyMethods = (pythonRunner.match(/^\s+(load|run|cancel|isSupported|start|stop)\s*\(/gm) ?? []).length;
    const voiceMethods = (voiceInput.match(/^\s+(load|run|cancel|isSupported|start|stop)\s*\(/gm) ?? []).length;
    expect(pyMethods).toBeLessThanOrEqual(4);
    expect(voiceMethods).toBeLessThanOrEqual(4);
  });

  // INV-A5
  it('ui-depends-on-interfaces: no UI file imports a concrete adapter class', () => {
    const uiDir = join(SRC, 'ui');
    const files = readdirSync(uiDir, { withFileTypes: true }).flatMap((d) =>
      d.isFile() && d.name.endsWith('.tsx') && !d.name.endsWith('.test.tsx')
        ? [join(uiDir, d.name)]
        : [],
    );
    for (const f of files) {
      const src = readFileSync(f, 'utf-8');
      expect(src).not.toMatch(/from\s+['"][^'"]*adapter\/(PyodideRunner|SpeechRecognitionAdapter)/);
    }
  });
});