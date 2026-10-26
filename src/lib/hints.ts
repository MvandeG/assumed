import { useEffect, useState } from 'react';
import { t } from '../copy/en';
import { Mode } from '../data/types';

// English and Dutch word lists from the spec.
const FUTURE = /(^|[^\p{L}])(will|going to|someday|hope|want|wish|zal|ga|ooit|hoop|wil|wens)(?=$|[^\p{L}])/iu;
const NEGATION = /(^|[^\p{L}])(not|no|never|don['’]t|stop|niet|geen|nooit)(?=$|[^\p{L}])/iu;

const LIMIT: Record<Mode, number> = { scene: 240, phrase: 80 };

export interface HintOptions {
  mode: Mode;
  /** Whether to check length (off for partial scene steps). */
  length?: boolean;
}

export function hintFor(text: string, { mode, length = true }: HintOptions): string | null {
  if (!text.trim()) return null;
  if (FUTURE.test(text)) return t.hints.future;
  if (mode === 'phrase' && NEGATION.test(text)) return t.hints.negation;
  if (length && text.trim().length > LIMIT[mode]) return t.hints.length;
  return null;
}

/** One gentle hint at a time, checked 400 ms after typing stops. */
export function useHint(text: string, opts: HintOptions): string | null {
  const [hint, setHint] = useState<string | null>(() => hintFor(text, opts));
  const { mode, length } = opts;
  useEffect(() => {
    const id = window.setTimeout(() => setHint(hintFor(text, { mode, length })), 400);
    return () => window.clearTimeout(id);
  }, [text, mode, length]);
  return hint;
}
