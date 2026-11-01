import { type AnalyticsCart, AnalyticsEvent, type StorefrontAnalytics } from '@shopify/hydrogen';

import type { CartData } from '~/lib/cart';

export { AnalyticsEvent };

/**
 * The Shopify analytics bus that `<ShopifyScripts>` creates at
 * `window.Shopify.analytics` (browser only). Route and cart surfaces publish
 * to it; Shopify's own analytics and the PostHog destination consume from it,
 * gated by Customer Privacy consent.
 */
export const getAnalytics = (): StorefrontAnalytics | null =>
  typeof window === 'undefined' ? null : (window.Shopify?.analytics ?? null);

/** The cart in the shape analytics expects; optimistic lines without product details are dropped. */
export const toAnalyticsCart = (cart: CartData): AnalyticsCart | null => {
  if (!cart.id || !cart.updatedAt) return null;
  return {
    id: cart.id,
    updatedAt: cart.updatedAt,
    lines: {
      nodes: cart.lines.nodes.flatMap((line) => {
        const merchandise = line.merchandise;
        const product = merchandise?.product;
        if (!merchandise?.id || !product?.id || !product.title || !product.vendor) return [];
        return [
          {
            id: line.id,
            quantity: line.quantity,
            merchandise: {
              id: merchandise.id,
              title: merchandise.title ?? product.title,
              sku: merchandise.sku,
              price: line.cost.amountPerQuantity,
              product: {
                id: product.id,
                title: product.title,
                vendor: product.vendor,
                productType: product.productType,
                handle: product.handle,
              },
            },
          },
        ];
      }),
    },
  };
};

export const publishCartViewed = (cart: CartData) =>
  getAnalytics()?.publish(AnalyticsEvent.CART_VIEWED, { cart: toAnalyticsCart(cart) });
