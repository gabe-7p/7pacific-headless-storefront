import { useCartAnalytics } from '@shopify/hydrogen/react';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { connectMetaPixelToShopify } from '~/lib/analytics/meta-pixel.client';
import { connectPostHogToShopify } from '~/lib/analytics/posthog.client';
import { AnalyticsEvent, getAnalytics } from '~/lib/analytics/shopify';
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
 * Registers the Meta Pixel as a bus destination (client only). `pixelId` is
 * the root loader's `PUBLIC_META_PIXEL_ID`; null = pixel off, nothing loads.
 * The nonce lets the lazily injected fbevents.js pass the CSP.
 */
export const MetaPixelBridge = ({ pixelId }: { pixelId: string | null }) => {
  const nonce = useNonce();
  useEffect(() => {
    if (!pixelId) return;
    return connectMetaPixelToShopify({ pixelId, nonce });
  }, [pixelId, nonce]);
  return null;
};
