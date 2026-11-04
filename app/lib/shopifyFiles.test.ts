import { describe, expect, it } from 'vitest';

import { isShopifyCdnUrl, shopifyImage } from '~/lib/shopifyFiles';

describe('isShopifyCdnUrl', () => {
  it('accepts the CDN host, its subdomains and the URLs the Files helpers build', () => {
    expect(isShopifyCdnUrl('https://cdn.shopify.com/files/shorts.jpg')).toBe(true);
    expect(isShopifyCdnUrl('https://eu.cdn.shopify.com/files/shorts.jpg')).toBe(true);
    expect(isShopifyCdnUrl(shopifyImage('shorts.jpg'))).toBe(true);
  });

  it('rejects other hosts, lookalikes and anything unparseable', () => {
    expect(isShopifyCdnUrl('https://mock.shop/files/shorts.jpg')).toBe(false);
    expect(isShopifyCdnUrl('https://notcdn.shopify.com.evil.test/a.jpg')).toBe(false);
    expect(isShopifyCdnUrl('/relative/a.jpg')).toBe(false);
  });
});
