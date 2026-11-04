import { describe, expect, it } from 'vitest';

import { getColorSwatches, isLightSwatch } from '~/lib/product/colors';

// Fixtures are typed against the fragment-derived shape: a sibling is a
// `Product` node whose color metafields are `{ value }` or `null` when unset.
const node = (handle: string, name: string | null, hex: string | null) => ({
  __typename: 'Product' as const,
  handle,
  colorName: name === null ? null : { value: name },
  colorHex: hex === null ? null : { value: hex },
});

describe('getColorSwatches', () => {
  it('maps sibling references to swatches in order', () => {
    const metafield = {
      references: {
        nodes: [node('tee-mist', 'Mountain Mist', '#6A7E8D'), node('tee-mint', 'Mint', '#B4C8C2')],
      },
    };
    expect(getColorSwatches(metafield)).toEqual([
      { handle: 'tee-mist', name: 'Mountain Mist', hex: '#6A7E8D' },
      { handle: 'tee-mint', name: 'Mint', hex: '#B4C8C2' },
    ]);
  });

  it('returns [] when the metafield is missing (product without color data)', () => {
    expect(getColorSwatches(null)).toEqual([]);
    expect(getColorSwatches(undefined)).toEqual([]);
    expect(getColorSwatches({ references: null })).toEqual([]);
  });

  it('drops nodes missing a handle, name, or hex instead of rendering broken swatches', () => {
    const metafield = {
      references: {
        nodes: [
          // A non-Product reference carries only its `__typename`.
          { __typename: 'ProductVariant' as const },
          node('ok', 'White', '#ffffff'),
          node('no-color-data', null, null),
          node('no-hex', 'Slate', null),
        ],
      },
    };
    expect(getColorSwatches(metafield)).toEqual([{ handle: 'ok', name: 'White', hex: '#ffffff' }]);
  });
});

describe('isLightSwatch', () => {
  it('counts white and off-whites as light', () => {
    expect(isLightSwatch('#ffffff')).toBe(true);
    expect(isLightSwatch('#FFF')).toBe(true);
    expect(isLightSwatch('#F5F5F0')).toBe(true);
  });

  it('leaves real colors dark enough to show on a white card', () => {
    expect(isLightSwatch('#6A7E8D')).toBe(false);
    expect(isLightSwatch('#FF8A00')).toBe(false);
    expect(isLightSwatch('#000000')).toBe(false);
  });

  it('reads a malformed hex as not light', () => {
    expect(isLightSwatch('white')).toBe(false);
    expect(isLightSwatch('')).toBe(false);
  });
});
