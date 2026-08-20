import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';

/**
 * fragments.ide.graphql is a byte-for-byte mirror of PRODUCT_CARD_FRAGMENT
 * (which interpolates ColorSiblings), kept solely so the editor's GraphQL LSP
 * can index the shared fragments — its plucker cannot read `#graphql … as
 * const` template strings, so without the mirror every cross-file
 * `...ProductCard` spread shows `Unknown fragment` in the IDE.
 *
 * If this test fails, regenerate the mirror by writing the current constant
 * back to the file — see .claude/rules/graphql-fragments.md.
 */
describe('fragments.ide.graphql', () => {
  it('mirrors PRODUCT_CARD_FRAGMENT byte-for-byte', () => {
    const mirror = readFileSync(join(__dirname, 'fragments.ide.graphql'), 'utf8');
    expect(mirror).toBe(PRODUCT_CARD_FRAGMENT);
  });
});
