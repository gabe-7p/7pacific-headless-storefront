import { describe, expect, it } from 'vitest';

import { toAnalyticsCart } from '~/lib/analytics/shopify';
import type { CartData, CartLine } from '~/lib/cart';

/**
 * `CartData` is Hydrogen's full default cart query; `toAnalyticsCart` reads a
 * handful of its fields, so the fixtures carry only those and are cast.
 */
const line = (overrides: Record<string, unknown> = {}): CartLine =>
  ({
    id: 'gid://shopify/CartLine/1',
    quantity: 2,
    cost: { amountPerQuantity: { amount: '74.0', currencyCode: 'USD' } },
    merchandise: {
      id: 'gid://shopify/ProductVariant/11',
      title: 'M',
      sku: 'AR6-MID-M',
      product: {
        id: 'gid://shopify/Product/1',
        title: 'AirRail 6 Performance Shorts',
        vendor: '7Pacific',
        productType: 'Shorts',
        handle: 'airrail-6-performance-shorts-midnight',
      },
    },
    ...overrides,
  }) as unknown as CartLine;

const cart = (overrides: Record<string, unknown> = {}): CartData =>
  ({
    id: 'gid://shopify/Cart/abc',
    updatedAt: '2026-10-31T00:00:00Z',
    lines: { nodes: [line()] },
    ...overrides,
  }) as unknown as CartData;

describe('toAnalyticsCart', () => {
  it('maps the store cart to the bus shape', () => {
    expect(toAnalyticsCart(cart())).toEqual({
      id: 'gid://shopify/Cart/abc',
      updatedAt: '2026-10-31T00:00:00Z',
      lines: {
        nodes: [
          {
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
                productType: 'Shorts',
                handle: 'airrail-6-performance-shorts-midnight',
              },
            },
          },
        ],
      },
    });
  });

  it('returns null for a cart without an id or updatedAt (nothing created yet)', () => {
    expect(toAnalyticsCart(cart({ id: '' }))).toBeNull();
    expect(toAnalyticsCart(cart({ updatedAt: undefined }))).toBeNull();
  });

  it('drops optimistic lines that have no product or vendor yet', () => {
    const bare = line({
      id: 'gid://shopify/CartLine/2',
      merchandise: { id: 'gid://x', title: 'M' },
    });
    const noVendor = line({
      id: 'gid://shopify/CartLine/3',
      merchandise: { id: 'gid://y', title: 'M', product: { id: 'gid://p', title: 'T' } },
    });
    const result = toAnalyticsCart(cart({ lines: { nodes: [line(), bare, noVendor] } }));
    expect(result?.lines.nodes?.map((node) => node.id)).toEqual(['gid://shopify/CartLine/1']);
  });

  it('falls back to the product title when the variant has none', () => {
    const untitled = line({
      merchandise: {
        id: 'gid://shopify/ProductVariant/11',
        product: { id: 'gid://shopify/Product/1', title: 'AirRail 6', vendor: '7Pacific' },
      },
    });
    const result = toAnalyticsCart(cart({ lines: { nodes: [untitled] } }));
    expect(result?.lines.nodes?.[0]?.merchandise.title).toBe('AirRail 6');
  });
});
