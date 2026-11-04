import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { EASE_BRAND } from '~/components/common/Motion';

describe('EASE_BRAND', () => {
  it('matches the --ease-brand token in tailwind.css', () => {
    const css = readFileSync(new URL('../../styles/tailwind.css', import.meta.url), 'utf8');
    const match = /--ease-brand:\s*cubic-bezier\(([^)]+)\)/.exec(css);
    expect(match).not.toBeNull();
    const token = (match?.[1] ?? '').split(',').map((part) => Number(part.trim()));
    expect(token).toEqual([...EASE_BRAND]);
  });
});
