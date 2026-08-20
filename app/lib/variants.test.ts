import { describe, expect, it } from 'vitest';

import { getVariantUrl } from '~/lib/variants';

describe('getVariantUrl', () => {
  it('returns the bare product path when no options are given', () => {
    expect(getVariantUrl({ handle: 'tee-white' })).toBe('/products/tee-white');
    expect(getVariantUrl({ handle: 'tee-white', selectedOptions: [] })).toBe('/products/tee-white');
  });

  it('serializes selected options as search params', () => {
    expect(
      getVariantUrl({
        handle: 'tee-mint',
        selectedOptions: [{ name: 'Size', value: 'Medium' }],
      })
    ).toBe('/products/tee-mint?Size=Medium');
  });

  it('encodes option values that need escaping', () => {
    expect(
      getVariantUrl({
        handle: 'tee-mint',
        selectedOptions: [{ name: 'Size', value: 'Extra Large' }],
      })
    ).toBe('/products/tee-mint?Size=Extra+Large');
  });
});
