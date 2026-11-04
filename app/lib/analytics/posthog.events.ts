import type { AnalyticsEventMap } from '@shopify/hydrogen';

import type { CartData } from '~/lib/cart';

/**
 * PostHog event names and payload builders in one place, so every capture
 * site sends the same fields. The commerce funnel reaches PostHog as a
 * *destination* on the Shopify analytics bus
 * (lib/analytics/posthog.client.ts): these builders map the bus payloads to
 * PostHog properties. `checkout_started` is the one browser event still
 * captured directly (a click, not a cart change); the two signup events are
 * captured server-side by routes/api.subscribe, keyed by its `list` field.
 */
export const ANALYTICS_EVENT = {
  productViewed: 'product_viewed',
  collectionViewed: 'collection_viewed',
  cartViewed: 'cart_viewed',
  productAddedToCart: 'product_added_to_cart',
  productRemovedFromCart: 'product_removed_from_cart',
  cartUpdated: 'cart_updated',
  checkoutStarted: 'checkout_started',
  newsletterSubscribed: 'newsletter_subscribed',
  waitlistJoined: 'waitlist_joined',
} as const;

export const productViewedProperties = (payload: AnalyticsEventMap['product_viewed']) => {
  const product = payload.products[0];
  return {
    product_id: product?.id,
    product_title: product?.title,
    variant_id: product?.variantId,
    variant_title: product?.variantTitle,
    price: product?.price?.amount,
    currency: product?.price?.currencyCode,
  };
};

export const collectionViewedProperties = (payload: AnalyticsEventMap['collection_viewed']) => ({
  collection_id: payload.collection.id,
  collection_handle: payload.collection.handle,
});

const cartProperties = (cart: AnalyticsEventMap['cart_viewed']['cart']) => ({
  cart_id: cart?.id,
  line_count: cart?.lines?.nodes?.length ?? 0,
  total_quantity: cart?.lines?.nodes?.reduce((sum, line) => sum + line.quantity, 0) ?? 0,
});

export const cartViewedProperties = (payload: AnalyticsEventMap['cart_viewed']) =>
  cartProperties(payload.cart);

export const cartUpdatedProperties = (payload: AnalyticsEventMap['cart_updated']) =>
  cartProperties(payload.cart);

/** `product_added_to_cart` / `product_removed_from_cart`: the line that changed. */
export const cartLineChangeProperties = (payload: AnalyticsEventMap['product_added_to_cart']) => {
  const line = payload.currentLine ?? payload.prevLine;
  const merchandise = line?.merchandise;
  return {
    product_id: merchandise?.product.id,
    product_handle: merchandise?.product.handle,
    product_title: merchandise?.product.title,
    variant_id: merchandise?.id,
    variant_title: merchandise?.title,
    quantity: payload.currentLine?.quantity ?? 0,
    previous_quantity: payload.prevLine?.quantity ?? 0,
    price: merchandise?.price?.amount,
    currency: merchandise?.price?.currencyCode,
    ...cartProperties(payload.cart),
  };
};

export const checkoutStartedProperties = (
  cart: Pick<CartData, 'totalQuantity' | 'cost'>,
  layout: string
) => ({
  cart_layout: layout,
  total_quantity: cart.totalQuantity,
  subtotal: cart.cost.subtotalAmount.amount,
  currency: cart.cost.subtotalAmount.currencyCode,
});
