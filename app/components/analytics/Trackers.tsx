import { useCartAnalytics } from '@shopify/hydrogen/react';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

import { connectMetaPixelToShopify } from '~/lib/analytics/meta-pixel.client';
import { connectPostHogToShopify } from '~/lib/analytics/posthog.client';
import { AnalyticsEvent, getAnalytics, publishCartViewed } from '~/lib/analytics/shopify';
import { useCart } from '~/lib/cart';
import { useNonce } from '~/lib/nonce';

/**
 * Route-driven events for the Shopify analytics bus. Nothing publishes
 * itself: each surface mounts the tracker it owns, and cart deltas come from
 * `useCartAnalytics` (once, inside `CartProvider`). Destinations (Shopify
 * analytics, PostHog, the Meta Pixel) receive them once Customer Privacy allows.
 */
export const PageViewedTracker = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    getAnalytics()?.publish(AnalyticsEvent.PAGE_VIEWED);
  }, [pathname, search]);
  return null;
};

export const CartAnalyticsTracker = () => {
  useCartAnalytics();
  return null;
};

/**
 * Publishes `cart_viewed` once each time `active` turns true: an open of the
 * drawer, a visit to /cart. A cart change while active doesn't republish, and
 * the ref (it survives Strict Mode's effect replay) keeps a visit to one event.
 */
export const useCartViewed = (active: boolean) => {
  const cart = useCart((state) => state.data);
  const cartRef = useRef(cart);
  cartRef.current = cart;
  const wasActive = useRef(false);

  useEffect(() => {
    if (active && !wasActive.current) publishCartViewed(cartRef.current);
    wasActive.current = active;
  }, [active]);
};

export const ProductViewedTracker = ({
  product,
  variant,
}: {
  product: { id: string; title: string; vendor: string };
  variant: {
    id: string;
    title: string;
    sku?: string | null;
    price: MoneyV2;
  } | null;
}) => {
  // Primitive deps: re-fire for a new product or variant, not every re-render.
  const variantId = variant?.id;
  useEffect(() => {
    if (!variant) return;
    getAnalytics()?.publish(AnalyticsEvent.PRODUCT_VIEWED, {
      products: [
        {
          id: product.id,
          title: product.title,
          price: variant.price,
          vendor: product.vendor,
          variantId: variant.id,
          variantTitle: variant.title,
          quantity: 1,
          sku: variant.sku,
        },
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on ids; the objects are fresh each render
  }, [product.id, variantId]);
  return null;
};

export const CollectionViewedTracker = ({ id, handle }: { id: string; handle: string }) => {
  useEffect(() => {
    getAnalytics()?.publish(AnalyticsEvent.COLLECTION_VIEWED, { collection: { id, handle } });
  }, [id, handle]);
  return null;
};

/** Registers PostHog as a bus destination and syncs its consent (client only). */
export const PostHogBridge = () => {
  useEffect(() => connectPostHogToShopify(), []);
  return null;
};

/**
 * Registers the Meta Pixel as a bus destination (client only); a null
 * `pixelId` means the pixel is off. The nonce lets the lazily injected fbevents.js pass the CSP.
 */
export const MetaPixelBridge = ({ pixelId }: { pixelId: string | null }) => {
  const nonce = useNonce();
  useEffect(() => {
    if (!pixelId) return;
    return connectMetaPixelToShopify({ pixelId, nonce });
  }, [pixelId, nonce]);
  return null;
};
