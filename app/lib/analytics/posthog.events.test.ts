import type { AnalyticsCart, AnalyticsCartLine, AnalyticsEventMap } from '@shopify/hydrogen';
import { describe, expect, it } from 'vitest';

import {
  ANALYTICS_EVENT,
  cartLineChangeProperties,
  cartUpdatedProperties,
  cartViewedProperties,
  checkoutStartedProperties,
  collectionViewedProperties,
  productViewedProperties,
} from '~/lib/analytics/posthog.events';

const shop = { shopId: 'gid://shopify/Shop/1', channel: 'hydrogen', storefrontId: 'sf' } as const;

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

const cart = (lines: Array<AnalyticsCartLine>): AnalyticsCart => ({
  id: 'gid://shopify/Cart/abc',
  updatedAt: '2026-10-31T00:00:00Z',
  lines: { nodes: lines },
});

describe('ANALYTICS_EVENT', () => {
  it('names every PostHog event, browser and server, in one map', () => {
    expect(ANALYTICS_EVENT).toEqual({
      productViewed: 'product_viewed',
      collectionViewed: 'collection_viewed',
      cartViewed: 'cart_viewed',
      productAddedToCart: 'product_added_to_cart',
      productRemovedFromCart: 'product_removed_from_cart',
      cartUpdated: 'cart_updated',
      checkoutStarted: 'checkout_started',
      newsletterSubscribed: 'newsletter_subscribed',
      waitlistJoined: 'waitlist_joined',
    });
  });
});

describe('productViewedProperties', () => {
  it('flattens the first product of a product_viewed payload', () => {
    const payload: AnalyticsEventMap['product_viewed'] = {
      shop,
      url: 'https://7pacificapparel.com/products/airrail-6-performance-shorts-midnight',
      products: [
        {
          id: 'gid://shopify/Product/1',
          title: 'AirRail 6 Performance Shorts',
          price: { amount: '74.0', currencyCode: 'USD' },
          vendor: '7Pacific',
          variantId: 'gid://shopify/ProductVariant/11',
          variantTitle: 'M',
          quantity: 1,
          sku: 'AR6-MID-M',
        },
      ],
    };
    expect(productViewedProperties(payload)).toEqual({
      product_id: 'gid://shopify/Product/1',
      product_title: 'AirRail 6 Performance Shorts',
      variant_id: 'gid://shopify/ProductVariant/11',
      variant_title: 'M',
      price: '74.0',
      currency: 'USD',
    });
  });

  it('sends undefined fields rather than throwing when the products list is empty', () => {
    expect(productViewedProperties({ shop, products: [] })).toEqual({
      product_id: undefined,
      product_title: undefined,
      variant_id: undefined,
      variant_title: undefined,
      price: undefined,
      currency: undefined,
    });
  });
});

describe('collectionViewedProperties', () => {
  it('carries the collection id and handle', () => {
    expect(
      collectionViewedProperties({
        shop,
        collection: { id: 'gid://shopify/Collection/9', handle: 'baseline' },
      })
    ).toEqual({ collection_id: 'gid://shopify/Collection/9', collection_handle: 'baseline' });
  });
});

describe('cartViewedProperties / cartUpdatedProperties', () => {
  it('summarise the cart: id, line count and total units', () => {
    const summary = {
      cart_id: 'gid://shopify/Cart/abc',
      line_count: 2,
      total_quantity: 3,
    };
    const lines = [line(), line({ id: 'gid://shopify/CartLine/2', quantity: 1 })];
    expect(cartViewedProperties({ shop, cart: cart(lines) })).toEqual(summary);
    expect(cartUpdatedProperties({ shop, cart: cart(lines), prevCart: null })).toEqual(summary);
  });

  it('report an empty summary for a null cart (nothing in the store yet)', () => {
    expect(cartViewedProperties({ shop, cart: null })).toEqual({
      cart_id: undefined,
      line_count: 0,
      total_quantity: 0,
    });
  });
});

describe('cartLineChangeProperties', () => {
  it('describes a new line from currentLine, with the cart summary', () => {
    const current = line();
    expect(
      cartLineChangeProperties({
        shop,
        cart: cart([current]),
        prevCart: null,
        currentLine: current,
      })
    ).toEqual({
      product_id: 'gid://shopify/Product/1',
      product_handle: 'airrail-6-performance-shorts-midnight',
      product_title: 'AirRail 6 Performance Shorts',
      variant_id: 'gid://shopify/ProductVariant/11',
      variant_title: 'M',
      quantity: 2,
      previous_quantity: 0,
      price: '74.0',
      currency: 'USD',
      cart_id: 'gid://shopify/Cart/abc',
      line_count: 1,
      total_quantity: 2,
    });
  });

  it('describes a removed line from prevLine, with quantity 0', () => {
    const prev = line();
    const result = cartLineChangeProperties({
      shop,
      cart: cart([]),
      prevCart: cart([prev]),
      prevLine: prev,
    });
    expect(result).toMatchObject({
      variant_id: 'gid://shopify/ProductVariant/11',
      quantity: 0,
      previous_quantity: 2,
      line_count: 0,
      total_quantity: 0,
    });
  });

  it('prefers currentLine for a quantity change', () => {
    const prev = line({ quantity: 1 });
    const current = line({ quantity: 3 });
    expect(
      cartLineChangeProperties({
        shop,
        cart: cart([current]),
        prevCart: cart([prev]),
        prevLine: prev,
        currentLine: current,
      })
    ).toMatchObject({ quantity: 3, previous_quantity: 1, total_quantity: 3 });
  });
});

describe('checkoutStartedProperties', () => {
  it('reads the subtotal and quantity off the store cart', () => {
    expect(
      checkoutStartedProperties(
        { totalQuantity: 3, cost: { subtotalAmount: { amount: '222.0', currencyCode: 'USD' } } },
        'aside'
      )
    ).toEqual({ cart_layout: 'aside', total_quantity: 3, subtotal: '222.0', currency: 'USD' });
  });

  it('tolerates an optimistic cart with no cost yet', () => {
    expect(checkoutStartedProperties({ totalQuantity: 1 }, 'page')).toEqual({
      cart_layout: 'page',
      total_quantity: 1,
      subtotal: undefined,
      currency: undefined,
    });
  });
});
