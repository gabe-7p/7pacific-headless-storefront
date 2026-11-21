import { describe, expect, it } from 'vitest';

import {
  discountLandingUrl,
  discountLinkFromQuery,
  normalizeDiscountCode,
} from '~/lib/discountLinks';

const ORIGIN = 'https://7pacificapparel.com';
const link = (path: string) => new URL(path, ORIGIN);

describe('normalizeDiscountCode', () => {
  it('trims, and rejects empty or over-long codes', () => {
    expect(normalizeDiscountCode(' DAKOTAH15 ')).toBe('DAKOTAH15');
    expect(normalizeDiscountCode('  ')).toBeNull();
    expect(normalizeDiscountCode(undefined)).toBeNull();
    expect(normalizeDiscountCode('x'.repeat(256))).toBeNull();
  });
});

describe('discountLandingUrl', () => {
  it("keeps Shopify's shareable-link UTMs and marks the creator code", () => {
    const url = link(
      '/discount/DAKOTAH15?utm_campaign=69a17d&utm_source=discount_shareable_link&utm_content=dakotah-riemer'
    );
    expect(discountLandingUrl(url, 'DAKOTAH15')).toBe(
      '/?utm_campaign=69a17d&utm_source=discount_shareable_link&utm_content=dakotah-riemer&creator_code=DAKOTAH15'
    );
  });

  it('adds default creator UTMs to a bare link', () => {
    expect(discountLandingUrl(link('/discount/DAKOTAH15'), 'DAKOTAH15')).toBe(
      '/?utm_source=creator&utm_medium=discount_link&utm_campaign=dakotah15&creator_code=DAKOTAH15'
    );
  });

  it('lands on the redirect path, keeping its own query', () => {
    const url = link(
      `/discount/X?redirect=${encodeURIComponent('/products/tee?Size=M')}&utm_source=ig`
    );
    expect(discountLandingUrl(url, 'X')).toBe('/products/tee?Size=M&utm_source=ig&creator_code=X');
  });

  it.each(['https://evil.example/', '//evil.example/', '/\\evil.example/', 'products'])(
    'never leaves the site (redirect=%s)',
    (target) => {
      const url = link(`/discount/X?redirect=${encodeURIComponent(target)}&utm_source=ig`);
      expect(discountLandingUrl(url, 'X')).toBe('/?utm_source=ig&creator_code=X');
    }
  );

  it('drops a stale discount or creator_code param', () => {
    const url = link('/discount/NEW?discount=OLD&creator_code=OLD&utm_source=ig');
    expect(discountLandingUrl(url, 'NEW')).toBe('/?utm_source=ig&creator_code=NEW');
  });
});

describe('discountLinkFromQuery', () => {
  it("routes the redirect theme's hand-off through /discount, keeping the page and params", () => {
    const url = link('/products/tee?Size=M&utm_source=discount_shareable_link&discount=DAKOTAH15');
    const discountLink = discountLinkFromQuery(url);
    expect(discountLink).toBe(
      '/discount/DAKOTAH15?Size=M&utm_source=discount_shareable_link&redirect=%2Fproducts%2Ftee'
    );
    // …and the round trip lands on the same page.
    expect(discountLandingUrl(link(discountLink ?? ''), 'DAKOTAH15')).toBe(
      '/products/tee?Size=M&utm_source=discount_shareable_link&creator_code=DAKOTAH15'
    );
  });

  it('ignores pages without a code, and the /discount route itself', () => {
    expect(discountLinkFromQuery(link('/products/tee?utm_source=ig'))).toBeNull();
    expect(discountLinkFromQuery(link('/?discount=%20'))).toBeNull();
    expect(discountLinkFromQuery(link('/discount/X?discount=Y'))).toBeNull();
  });

  it('encodes codes that need it', () => {
    expect(discountLinkFromQuery(link('/?discount=10%25+OFF'))).toBe(
      '/discount/10%25%20OFF?redirect=%2F'
    );
  });
});
