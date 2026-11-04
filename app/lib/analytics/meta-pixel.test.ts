import type {
  AnalyticsCartLine,
  CartLineUpdatePayload,
  ProductViewPayload,
} from '@shopify/hydrogen';
import { describe, expect, it } from 'vitest';

import {
  addToCartParams,
  searchParams,
  toMetaContentId,
  viewContentParams,
} from '~/lib/analytics/meta-pixel';

const line = (overrides: Partial<AnalyticsCartLine> = {}): AnalyticsCartLine => ({
  id: 'gid://shopify/CartLine/1',
  quantity: 2,
  merchandise: {
    id: 'gid://shopify/ProductVariant/11',
    title: 'M',
    sku: 'AR6-MID-M',
    price: { amount: '74.0', currencyCode: 'USD' },
    product: {
      id: 'gid://shopify/Product/1',
      title: 'AirRail 6 Performance Shorts',
      vendor: '7Pacific',
      handle: 'airrail-6-performance-shorts-midnight',
    },
  },
  ...overrides,
});

const lineChange = (overrides: Partial<CartLineUpdatePayload> = {}): CartLineUpdatePayload => ({
  cart: null,
  prevCart: null,
  ...overrides,
});

const productViewed = (): ProductViewPayload => ({
  products: [
    {
      id: 'gid://shopify/Product/1',
      title: 'AirRail 6 Performance Shorts',
      price: { amount: '74.0', currencyCode: 'USD' },
      vendor: '7Pacific',
      variantId: 'gid://shopify/ProductVariant/11',
      variantTitle: 'M',
      quantity: 1,
    },
  ],
});

describe('toMetaContentId', () => {
  it('builds the Shopify catalog format from GIDs', () => {
    expect(toMetaContentId('gid://shopify/Product/1', 'gid://shopify/ProductVariant/11')).toBe(
      'shopify_US_1_11'
    );
  });
});

describe('viewContentParams', () => {
  it('maps the first product to ViewContent', () => {
    expect(viewContentParams(productViewed())).toEqual({
      content_ids: ['shopify_US_1_11'],
      content_type: 'product',
      content_name: 'AirRail 6 Performance Shorts',
      value: 74,
      currency: 'USD',
    });
  });

  it('returns null with no products', () => {
    expect(viewContentParams({ products: [] })).toBeNull();
  });
});

describe('addToCartParams', () => {
  it('uses the added quantity for a new line', () => {
    expect(addToCartParams(lineChange({ currentLine: line({ quantity: 2 }) }))).toEqual({
      content_ids: ['shopify_US_1_11'],
      content_type: 'product',
      content_name: 'AirRail 6 Performance Shorts',
      value: 148,
      currency: 'USD',
      num_items: 2,
    });
  });

  it('uses the delta for a quantity increase', () => {
    const payload = lineChange({
      prevLine: line({ quantity: 1 }),
      currentLine: line({ quantity: 2 }),
    });
    expect(addToCartParams(payload)).toMatchObject({ num_items: 1, value: 74 });
  });

  it('returns null for a decrease, no change, or no current line', () => {
    expect(
      addToCartParams(
        lineChange({ prevLine: line({ quantity: 2 }), currentLine: line({ quantity: 1 }) })
      )
    ).toBeNull();
    expect(
      addToCartParams(
        lineChange({ prevLine: line({ quantity: 2 }), currentLine: line({ quantity: 2 }) })
      )
    ).toBeNull();
    expect(addToCartParams(lineChange({ prevLine: line() }))).toBeNull();
  });

  it('returns null when the unit price is unusable', () => {
    const noPrice = line({ merchandise: { ...line().merchandise, price: { amount: '' } } });
    expect(addToCartParams(lineChange({ currentLine: noPrice }))).toBeNull();
  });

  it('falls back to the given currency, else null', () => {
    const noCurrency = line({
      merchandise: { ...line().merchandise, price: { amount: '74.0' } },
    });
    expect(addToCartParams(lineChange({ currentLine: noCurrency }), 'USD')).toMatchObject({
      currency: 'USD',
    });
    expect(addToCartParams(lineChange({ currentLine: noCurrency }))).toBeNull();
  });

  it('rounds value to cents', () => {
    const cents = line({
      quantity: 3,
      merchandise: { ...line().merchandise, price: { amount: '19.99', currencyCode: 'USD' } },
    });
    expect(addToCartParams(lineChange({ currentLine: cents }))).toMatchObject({ value: 59.97 });
  });
});

describe('searchParams', () => {
  it('maps a trimmed term', () => {
    expect(searchParams({ searchTerm: ' shorts ' })).toEqual({ search_string: 'shorts' });
  });

  it('skips empty terms', () => {
    expect(searchParams({ searchTerm: '  ' })).toBeNull();
  });
});
