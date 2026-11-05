import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { BANNED, bannedWordPattern } from '~/content/vocabulary';

/**
 * The brand vocabulary gate over every typed content module and the GEO summary — not only the
 * homepage (home.test.ts keeps its own copy checks). Binary: a banned word in shipped copy fails.
 */

/** Collect every string leaf. */
const collectStrings = (value: unknown, out: Array<string> = []): Array<string> => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object')
    Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
};

const isUrl = (text: string) => /^https?:\/\//.test(text) || text.startsWith('/');

/**
 * Per-file allowlist for words that are quoted third-party text or still awaiting a copy
 * decision. Keyed by the path relative to app/content (or public/).
 * (josh-wyche.ts "intentionally" is not matched by the word pattern, so it needs no entry.)
 * TODO: the entries below await the owner's decision (reword the copy, or keep as a quote and
 * say so here). They are known hits, not approvals.
 */
const ALLOWED: Record<string, Array<string>> = {
  'our-story.ts': ['intentional'],
  'athlete-signing/owen-platt.ts': ['elevate'],
  'athlete-signing/aaron-lee.ts': ['wellness'], // the athlete's own bio
  'athlete-signing/index.ts': ['wellness', 'elevate'], // re-exports aaron-lee and owen-platt
  'llms.txt': ['premium'],
};

const modules = import.meta.glob<Record<string, unknown>>(
  ['./**/*.ts', '!./**/*.test.ts', '!./vocabulary.ts'],
  { eager: true }
);

const sources: Array<{ file: string; strings: Array<string> }> = [
  ...Object.entries(modules).map(([path, mod]) => ({
    file: path.replace('./', ''),
    strings: collectStrings(Object.values(mod)).filter((text) => !isUrl(text)),
  })),
  {
    file: 'llms.txt',
    strings: readFileSync(new URL('../../public/llms.txt', import.meta.url), 'utf8').split('\n'),
  },
];

describe('brand vocabulary gate', () => {
  it('walks the content modules', () => {
    expect(sources.length).toBeGreaterThan(10);
  });

  for (const { file, strings } of sources) {
    it(`${file} contains no banned words`, () => {
      const allowed = ALLOWED[file] ?? [];
      for (const word of BANNED.filter((candidate) => !allowed.includes(candidate))) {
        const hits = strings.filter((text) => bannedWordPattern(word).test(text));
        expect(hits, `banned word "${word}"`).toEqual([]);
      }
    });
  }
});
