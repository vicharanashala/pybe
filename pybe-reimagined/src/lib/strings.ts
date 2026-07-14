/**
 * String-slicing helpers used by the StringSlicingVisual demo.
 * Mirrors Python slice semantics: s[start:stop:step], stop exclusive.
 */
export interface SliceSpec {
  start: number;
  stop: number;
  step?: number;
}

export function sliceString(s: string, spec: SliceSpec): string {
  const step = spec.step ?? 1;
  if (step === 0) {
    throw new Error('step cannot be 0');
  }
  // Use Array.from so multi-byte characters don't get split mid-codepoint.
  const chars = Array.from(s);
  const len = chars.length;
  // Normalize negative indices like Python does.
  const norm = (i: number): number => {
    if (i < 0) return Math.max(len + i, 0);
    return Math.min(i, len);
  };
  const start = norm(spec.start);
  const stop = norm(spec.stop);

  if (step > 0) {
    return chars.slice(start, stop).filter((_, i) => i % step === 0).join('');
  }
  // Negative step is supported but not used in the visual for now.
  return '';
}

export function indexLabel(i: number, len: number): string {
  return i >= len ? String(i - len) : String(i);
}