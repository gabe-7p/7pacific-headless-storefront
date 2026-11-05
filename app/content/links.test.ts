import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

import { HANDLES } from '~/content/links';

const APP_DIR = new URL('..', import.meta.url).pathname;

const sourceFiles = (dir: string): Array<string> =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    const isSource = /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts');
    const isTest = /\.test\.(ts|tsx)$/.test(entry.name);
    const isLinks = relative(APP_DIR, full) === join('content', 'links.ts');
    return isSource && !isTest && !isLinks ? [full] : [];
  });

// Comments may name a handle in prose (`main-menu`); only code counts.
const stripComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

const FILES = sourceFiles(APP_DIR).map((file) => ({
  name: relative(APP_DIR, file),
  text: stripComments(readFileSync(file, 'utf8')),
}));

/** Files where the string is a different thing that happens to share the spelling. */
const NOT_THE_HANDLE: Partial<Record<keyof typeof HANDLES, Array<string>>> = {
  // lib/sitemap.ts: 'journal' is a sitemap *type* in the /sitemap/<type> URL, not the blog handle.
  // routes/sitemap.$type.$page[.xml].tsx: the same sitemap type, read from the URL param.
  // routes/journal.$handle.tsx: <Prose variant="journal"> is a style variant.
  journalBlog: [
    'lib/sitemap.ts',
    'routes/sitemap.$type.$page[.xml].tsx',
    'routes/journal.$handle.tsx',
  ],
};

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('HANDLES single source', () => {
  for (const [key, value] of Object.entries(HANDLES)) {
    it(`${key} ("${value}") appears as a literal only in content/links.ts`, () => {
      const quoted = new RegExp(`(['"\`])${escape(value)}\\1`);
      // Reaches inside gql() template strings, which AST selectors cannot see.
      const inQuery = new RegExp(`handle:\\s*"${escape(value)}"`);
      const hits = FILES.filter(({ text }) => quoted.test(text) || inQuery.test(text))
        .map(({ name }) => name)
        .filter((name) => !NOT_THE_HANDLE[key as keyof typeof HANDLES]?.includes(name));
      expect(hits, `use HANDLES.${key}`).toEqual([]);
    });
  }
});
