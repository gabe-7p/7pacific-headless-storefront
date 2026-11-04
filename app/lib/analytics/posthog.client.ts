import type { ShopifyGlobal } from '@shopify/hydrogen';
import { posthog } from 'posthog-js';

import type { PostHogConfig } from '~/lib/analytics/posthog';
import {
  ANALYTICS_EVENT,
  cartLineChangeProperties,
  cartUpdatedProperties,
  cartViewedProperties,
  collectionViewedProperties,
  productViewedProperties,
} from '~/lib/analytics/posthog.events';
import { AnalyticsEvent, connectDestination } from '~/lib/analytics/shopify';
import { getCustomerPrivacy, whenShopifyReady } from '~/lib/shopifyRuntime';

/**
 * PostHog in the browser:
 *
 * 1. The SDK boots opted OUT, with session replay off, so nothing is captured
 *    until Shopify's Customer Privacy API says analytics are allowed for this
 *    visitor. US visitors (consent not required) are allowed immediately;
 *    EU/UK visitors wait for the banner.
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
    // ids, so lib/analytics/posthog.server.ts can attribute server-side events.
    tracing_headers: [window.location.hostname],
    session_recording: { maskAllInputs: true },
    logs: { serviceName: 'storefront-web', environment: import.meta.env.MODE },
    // Consent-gated: connectPostHogToShopify opts in once Customer Privacy allows.
    opt_out_capturing_by_default: true,
    disable_session_recording: true,
  });
};

/** Mirrors Shopify's consent decision onto the PostHog SDK. */
const applyConsent = (customerPrivacy: ShopifyGlobal['customerPrivacy']) => {
  if (customerPrivacy.analyticsProcessingAllowed()) {
    if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing({ captureEventName: null });
    posthog.startSessionRecording();
  } else if (!posthog.has_opted_out_capturing()) {
    posthog.opt_out_capturing();
  }
};

/**
 * Resolves only after PostHog mirrors Shopify's consent decision, and follows
 * every later change. The bus buffers everything published before a
 * destination is ready — the PDP's `product_viewed` fires on hydration, before
 * the bridge runs — and replays the buffer the moment setup resolves; replayed
 * into a still-opted-out SDK those events are silently dropped (the hydration
 * product view went missing on most page loads). If the Customer Privacy API
 * never arrives, this resolves anyway: PostHog stays opted out, which is the
 * right outcome, and the bus stops holding events for it.
 */
const followConsent = () =>
  new Promise<void>((resolve) => {
    // Every later consent change (the banner, the preferences dialog) arrives
    // through this DOM event.
    document.addEventListener('visitorConsentCollected', () => {
      const customerPrivacy = getCustomerPrivacy();
      if (customerPrivacy) applyConsent(customerPrivacy);
    });
    whenShopifyReady(
      getCustomerPrivacy,
      (customerPrivacy) => {
        applyConsent(customerPrivacy);
        resolve();
      },
      { onGiveUp: resolve }
    );
  });

/**
 * Registers PostHog as a destination on the bus and follows consent (client
 * only). A no-op when PostHog is off (never initialised). Returns a cancel
 * function for the bus poll.
 */
export const connectPostHogToShopify = (): (() => void) => {
  if (!posthog.__loaded) return () => {};
  return connectDestination(
    'posthog',
    {
      [AnalyticsEvent.PRODUCT_VIEWED]: (payload) =>
        posthog.capture(ANALYTICS_EVENT.productViewed, productViewedProperties(payload)),
      [AnalyticsEvent.COLLECTION_VIEWED]: (payload) =>
        posthog.capture(ANALYTICS_EVENT.collectionViewed, collectionViewedProperties(payload)),
      [AnalyticsEvent.CART_VIEWED]: (payload) =>
        posthog.capture(ANALYTICS_EVENT.cartViewed, cartViewedProperties(payload)),
      [AnalyticsEvent.PRODUCT_ADD_TO_CART]: (payload) =>
        posthog.capture(ANALYTICS_EVENT.productAddedToCart, cartLineChangeProperties(payload)),
      [AnalyticsEvent.PRODUCT_REMOVED_FROM_CART]: (payload) =>
        posthog.capture(ANALYTICS_EVENT.productRemovedFromCart, cartLineChangeProperties(payload)),
      [AnalyticsEvent.CART_UPDATED]: (payload) =>
        posthog.capture(ANALYTICS_EVENT.cartUpdated, cartUpdatedProperties(payload)),
    },
    { ready: followConsent }
  );
};
