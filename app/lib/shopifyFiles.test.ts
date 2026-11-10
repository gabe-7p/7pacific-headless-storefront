import { describe, expect, it } from 'vitest';

import { isShopifyCdnUrl, shopifyImage, shopifyImageCard } from '~/lib/shopifyFiles';

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

describe('shopifyImageCard', () => {
  it('cuts the region and scales it to the card on the CDN', () => {
    const url = new URL(
      shopifyImageCard('gym.jpg', {
        v: 7,
        region: { left: 0, top: 750, width: 3968, height: 2083 },
        width: 1200,
        height: 630,
      })
    );
    expect(isShopifyCdnUrl(url.href)).toBe(true);
    expect(url.pathname.endsWith('/files/gym.jpg')).toBe(true);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      v: '7',
      crop: 'region',
      crop_left: '0',
      crop_top: '750',
      crop_width: '3968',
      crop_height: '2083',
      width: '1200',
      height: '630',
    });
  });
});
