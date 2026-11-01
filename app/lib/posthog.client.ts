import { posthog } from 'posthog-js';

import {
  ANALYTICS_EVENT,
  cartLineChangeProperties,
  cartUpdatedProperties,
  cartViewedProperties,
  collectionViewedProperties,
  productViewedProperties,
} from '~/lib/analytics';
import type { PostHogConfig } from '~/lib/posthog';

/**
 * PostHog in the browser (Option C, Oct 2026):
 *
 * 1. The SDK boots opted OUT, with session replay off, so nothing is captured
 *    until Shopify's Customer Privacy API says analytics are allowed for this
 *    visitor. US visitors (consent not required) are allowed immediately, so
 *    today's behaviour holds there; EU/UK visitors wait for the banner.
 * 2. The commerce funnel comes from the Shopify analytics bus: PostHog is a
 *    *destination*, so product/collection/cart views and the cart deltas
 *    (`product_added_to_cart`, …) arrive consent-gated and already normalised.
 *    Page views stay with the SDK's own history-change capture.
 */
export const initPostHog = ({ key, host }: PostHogConfig) => {
  posthog.init(key, {
    api_host: host,
    // Pinned defaults: pageviews on every history change (client-side
    // navigations included), plus pageleave.
    defaults: '2026-05-30',
    capture_exceptions: true,
    // Tag the app's own fetches (loader/action requests) with the visitor's
    // ids, so lib/posthog.server.ts can attribute server-side events.
    tracing_headers: [window.location.hostname],
    session_recording: { maskAllInputs: true },
    logs: { serviceName: 'storefront-web', environment: import.meta.env.MODE },
    // Consent-gated: lib/posthog.client.ts opts in once Customer Privacy allows.
    opt_out_capturing_by_default: true,
    disable_session_recording: true,
  });
};

let bridged = false;

/** Mirrors Shopify's consent decision onto the PostHog SDK. */
const applyConsent = (customerPrivacy: NonNullable<Window['Shopify']>['customerPrivacy']) => {
  if (customerPrivacy.analyticsProcessingAllowed()) {
    if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing({ captureEventName: null });
    posthog.startSessionRecording();
  } else if (!posthog.has_opted_out_capturing()) {
    posthog.opt_out_capturing();
  }
};

/**
 * Connects PostHog to the Shopify runtime. Idempotent; returns false until
 * `window.Shopify.analytics` exists (the inline bootstrap `<ShopifyScripts>`
 * renders creates it before hydration, so the first call normally succeeds).
 */
export const bridgePostHogToShopify = (): boolean => {
  if (bridged) return true;
  if (typeof window === 'undefined' || !posthog.__loaded) return false;
  const shopify = window.Shopify;
  if (!shopify?.analytics) return false;
  bridged = true;

  shopify.analytics.addDestination({
    name: 'posthog',
    setup({ subscribe }) {
      const unsubscribe = [
        subscribe('product_viewed', (payload) =>
          posthog.capture(ANALYTICS_EVENT.productViewed, productViewedProperties(payload))
        ),
        subscribe('collection_viewed', (payload) =>
          posthog.capture(ANALYTICS_EVENT.collectionViewed, collectionViewedProperties(payload))
        ),
        subscribe('cart_viewed', (payload) =>
          posthog.capture(ANALYTICS_EVENT.cartViewed, cartViewedProperties(payload))
        ),
        subscribe('product_added_to_cart', (payload) =>
          posthog.capture(ANALYTICS_EVENT.productAddedToCart, cartLineChangeProperties(payload))
        ),
        subscribe('product_removed_from_cart', (payload) =>
          posthog.capture(ANALYTICS_EVENT.productRemovedFromCart, cartLineChangeProperties(payload))
        ),
        subscribe('cart_updated', (payload) =>
          posthog.capture(ANALYTICS_EVENT.cartUpdated, cartUpdatedProperties(payload))
        ),
      ];
      return () => unsubscribe.forEach((off) => off());
    },
  });

  // The Customer Privacy API loads asynchronously; poll briefly for it, then
  // follow every later consent change through its DOM event.
  const syncConsent = () => {
    const customerPrivacy = window.Shopify?.customerPrivacy;
    if (!customerPrivacy?.analyticsProcessingAllowed) return false;
    applyConsent(customerPrivacy);
    return true;
  };
  document.addEventListener('visitorConsentCollected', syncConsent);
  if (!syncConsent()) {
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (syncConsent() || ++attempts >= 40) window.clearInterval(timer);
    }, 250);
  }

  return true;
};
