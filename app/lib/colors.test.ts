import { describe, expect, it } from 'vitest';

import { getColorSwatches } from '~/lib/colors';

const node = (handle: string, name: string, hex: string) => ({
  handle,
  colorName: { value: name },
  colorHex: { value: hex },
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
          {}, // non-Product reference resolves to an empty object
          node('ok', 'White', '#ffffff'),
          { handle: 'no-color-data' },
          { handle: 'no-hex', colorName: { value: 'Slate' }, colorHex: { value: null } },
        ],
      },
    };
    expect(getColorSwatches(metafield)).toEqual([{ handle: 'ok', name: 'White', hex: '#ffffff' }]);
  });
});
