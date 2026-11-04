import { describe, expect, it } from 'vitest';

import { routeTemplates } from '~/lib/storefront';
import {
  cartUrl,
  collectionUrl,
  journalUrl,
  pageUrl,
  productUrl,
  toInternalPath,
  youtubeWatchUrl,
} from '~/lib/urls';

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

describe('resource URL builders', () => {
  it('builds collection, page and cart paths', () => {
    expect(collectionUrl('baseline')).toBe('/collections/baseline');
    expect(pageUrl('contact-us')).toBe('/pages/contact-us');
    expect(cartUrl()).toBe('/cart');
  });

  it('builds the journal index without a handle and an article with one', () => {
    expect(journalUrl()).toBe('/journal');
    expect(journalUrl('founder-letter-ed-01')).toBe('/journal/founder-letter-ed-01');
  });
});

describe('youtubeWatchUrl', () => {
  it('builds a watch URL from the video id', () => {
    expect(youtubeWatchUrl('jf_E0NEgeCE')).toBe('https://www.youtube.com/watch?v=jf_E0NEgeCE');
  });

  it('appends a start offset only when one is given', () => {
    expect(youtubeWatchUrl('jf_E0NEgeCE', 4)).toBe(
      'https://www.youtube.com/watch?v=jf_E0NEgeCE&t=4s'
    );
    expect(youtubeWatchUrl('jf_E0NEgeCE', 0)).toBe('https://www.youtube.com/watch?v=jf_E0NEgeCE');
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

describe('routeTemplates', () => {
  it('spells the product path exactly as productUrl does', () => {
    expect(routeTemplates.productInCollection.replace(':productHandle', 'tee-white')).toBe(
      productUrl('tee-white')
    );
  });
});
