import { describe, expect, it } from 'vitest';

import { gidNumericId } from '~/lib/gid';

describe('gidNumericId', () => {
  it('takes the numeric tail of a GID', () => {
    expect(gidNumericId('gid://shopify/Shop/123')).toBe('123');
  });

  it('tolerates decorated and bare ids', () => {
    expect(gidNumericId('gid://shopify/ProductVariant/11?x=1')).toBe('11');
    expect(gidNumericId('1')).toBe('1');
  });
});
