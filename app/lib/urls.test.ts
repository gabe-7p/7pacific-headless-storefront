import { describe, expect, it } from 'vitest';

import { productUrl, toInternalPath } from '~/lib/urls';

describe('productUrl', () => {
  it('returns the bare product path when no options are given', () => {
    expect(productUrl('tee-white')).toBe('/products/tee-white');
    expect(productUrl('tee-white', [])).toBe('/products/tee-white');
  });

  it('serializes selected options as search params', () => {
    expect(productUrl('tee-mint', [{ name: 'Size', value: 'Medium' }])).toBe(
      '/products/tee-mint?Size=Medium'
    );
  });

  it('encodes option values that need escaping', () => {
    expect(productUrl('tee-mint', [{ name: 'Size', value: 'Extra Large' }])).toBe(
      '/products/tee-mint?Size=Extra+Large'
    );
  });
});

describe('toInternalPath', () => {
  const domains = {
    publicStoreDomain: '7pacific-7311.myshopify.com',
    primaryDomainUrl: 'https://7pacificapparel.com',
  };

  it('strips the store domains down to a path', () => {
    expect(toInternalPath('https://7pacificapparel.com/collections/baseline', domains)).toBe(
      '/collections/baseline'
    );
    expect(toInternalPath('https://7pacific-7311.myshopify.com/pages/returns', domains)).toBe(
      '/pages/returns'
    );
  });

  it('leaves external URLs alone', () => {
    expect(toInternalPath('https://www.instagram.com/7_pacific/', domains)).toBe(
      'https://www.instagram.com/7_pacific/'
    );
  });
});
