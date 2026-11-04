import { describe, expect, it } from 'vitest';

import { toAnalyticsCart } from '~/lib/analytics/shopify';
import type { CartData } from '~/lib/cart';
import { buildCartData, buildCartLine } from '~/lib/cart.fixtures';

const line = (overrides: Parameters<typeof buildCartLine>[0] = {}) =>
  buildCartLine({
    quantity: 2,
    cost: {
      ...buildCartLine().cost,
      amountPerQuantity: { amount: '74.0', currencyCode: 'USD' },
    },
    merchandise: {
      id: 'gid://shopify/ProductVariant/11',
      product: {
        id: 'gid://shopify/Product/1',
        title: 'AirRail 6 Performance Shorts',
        vendor: '7Pacific',
        productType: 'Shorts',
        handle: 'airrail-6-performance-shorts-midnight',
      },
    },
    ...overrides,
  });

const cart = (overrides: Partial<CartData> = {}) =>
  buildCartData({ lines: { nodes: [line()] }, ...overrides });

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
    expect(toAnalyticsCart(cart({ updatedAt: '' }))).toBeNull();
  });

  it('drops optimistic lines that have no product or vendor yet', () => {
    const { product } = line().merchandise;
    const bare = line({
      id: 'gid://shopify/CartLine/2',
      merchandise: { id: 'gid://x', product: undefined },
    });
    const noVendor = line({
      id: 'gid://shopify/CartLine/3',
      merchandise: { id: 'gid://y', product: { ...product, vendor: '' } },
    });
    const result = toAnalyticsCart(cart({ lines: { nodes: [line(), bare, noVendor] } }));
    expect(result?.lines.nodes?.map((node) => node.id)).toEqual(['gid://shopify/CartLine/1']);
  });

  it('falls back to the product title when the variant has none', () => {
    const untitled = line({ merchandise: { title: undefined } });
    const result = toAnalyticsCart(cart({ lines: { nodes: [untitled] } }));
    expect(result?.lines.nodes?.[0]?.merchandise.title).toBe(untitled.merchandise.product.title);
  });
});
