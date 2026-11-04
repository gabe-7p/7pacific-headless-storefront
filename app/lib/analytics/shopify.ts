import {
  type AnalyticsCart,
  AnalyticsEvent,
  type AnalyticsEventName,
  type PayloadFor,
  type StorefrontAnalyticsDestinationSetupContext,
} from '@shopify/hydrogen';

import type { CartData } from '~/lib/cart';
import { getAnalyticsBus, whenShopifyReady } from '~/lib/shopifyRuntime';

export { AnalyticsEvent };

/**
 * The Shopify analytics bus that `<ShopifyScripts>` creates at
 * `window.Shopify.analytics` (browser only; `getAnalyticsBus`). Route and cart
 * surfaces publish to it; Shopify's own analytics, the PostHog destination and
 * the Meta Pixel destination consume from it, gated by Customer Privacy consent.
 */

/** The bus comes from an inline bootstrap, so the first check normally succeeds. */
const BUS_POLL_ATTEMPTS = 20;

/** A destination's handlers: the events it wants and what to do with each. */
type DestinationHandlers = { [E in AnalyticsEventName]?: (payload: PayloadFor<E>) => void };

const subscribeHandler = <E extends AnalyticsEventName>(
  subscribe: StorefrontAnalyticsDestinationSetupContext['subscribe'],
  event: E,
  handlers: DestinationHandlers
) => {
  const handler = handlers[event];
  return handler ? [subscribe(event, handler)] : [];
};

const registered = new Set<string>();

/**
 * Registers a bus destination once the bus exists (client only), subscribed to
 * `handlers`. Returns a cancel for the readiness poll; it never removes the
 * destination, because the bus replays its buffer to every new destination and
 * a remove + re-add would double-deliver.
 *
 * Runs once per name per page lifetime. The bus would itself warn and ignore a
 * second destination with the same name; the set exists only to keep that
 * warning quiet under Strict Mode's double effects.
 *
 * `ready` holds the bus's replay back: setup resolves when the promise does.
 * A destination that must finish something first (PostHog's consent mirror)
 * passes it; see common-pitfalls.md ("The bus buffers and replays").
 */
export const connectDestination = (
  name: string,
  handlers: DestinationHandlers,
  { ready }: { ready?: () => Promise<void> } = {}
): (() => void) =>
  whenShopifyReady(
    getAnalyticsBus,
    (analytics) => {
      if (registered.has(name)) return;
      registered.add(name);
      analytics.addDestination({
        name,
        setup({ subscribe }) {
          const events = Object.keys(handlers) as Array<AnalyticsEventName>;
          const unsubscribe = events.flatMap((event) =>
            subscribeHandler(subscribe, event, handlers)
          );
          const teardown = () => unsubscribe.forEach((off) => off());
          return ready ? ready().then(() => teardown) : teardown;
        },
      });
    },
    { attempts: BUS_POLL_ATTEMPTS }
  );

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
  getAnalyticsBus()?.publish(AnalyticsEvent.CART_VIEWED, { cart: toAnalyticsCart(cart) });
