import type {
  CartLineUpdatePayload,
  ProductViewPayload,
  SearchViewPayload,
} from '@shopify/hydrogen';

import { gidNumericId } from '~/lib/gid';
import { MARKET } from '~/lib/i18n';

/**
 * Meta Pixel event mapping — pure functions from Shopify analytics bus
 * payloads to Meta standard-event parameters. The browser side (loading
 * fbevents.js, registering the destination) lives in meta-pixel.client.ts.
 *
 * Covered: PageView, ViewContent, AddToCart, Search. Deliberately NOT
 * covered: InitiateCheckout and Purchase — Shopify's Facebook & Instagram
 * app fires those from the hosted checkout under the same pixel ID, so firing
 * them here would double-count.
 */

export const META_PIXEL_SCRIPT_URL = 'https://connect.facebook.net/en_US/fbevents.js';
export const META_PIXEL_DESTINATION = 'meta-pixel';

export type MetaStandardEvent = 'PageView' | 'ViewContent' | 'AddToCart' | 'Search';
export type MetaEventParams = Record<string, string | number | Array<string>>;

/**
 * THE one place the Meta catalog id format lives. Shopify's Facebook &
 * Instagram app syncs the catalog as `shopify_<country>_<productId>_<variantId>`,
 * and its checkout Purchase events use the same ids, so storefront events
 * match them. To switch to bare variant ids instead, make this
 * `return gidNumericId(variantId);` — nothing else changes.
 */
export const toMetaContentId = (productId: string, variantId: string): string =>
  `shopify_${MARKET.country}_${gidNumericId(productId)}_${gidNumericId(variantId)}`;

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const toAmount = (amount: string | undefined): number | null => {
  if (!amount) return null;
  const value = Number(amount);
  return Number.isFinite(value) ? value : null;
};

export const viewContentParams = (payload: ProductViewPayload): MetaEventParams | null => {
  const product = payload.products[0];
  if (!product) return null;
  const value = toAmount(product.price.amount);
  if (value === null) return null;
  return {
    content_ids: [toMetaContentId(product.id, product.variantId)],
    content_type: 'product',
    content_name: product.title,
    value,
    currency: product.price.currencyCode,
  };
};

/**
 * `product_added_to_cart` fires for new lines and for quantity changes in
 * either direction; only a positive delta is an AddToCart. `value` is the
 * unit price times the units added, not the line or cart total.
 */
export const addToCartParams = (
  payload: CartLineUpdatePayload,
  fallbackCurrency?: string
): MetaEventParams | null => {
  const line = payload.currentLine;
  if (!line) return null;
  const added = line.quantity - (payload.prevLine?.quantity ?? 0);
  if (added <= 0) return null;
  const unitPrice = toAmount(line.merchandise.price.amount);
  const currency = line.merchandise.price.currencyCode ?? fallbackCurrency;
  if (unitPrice === null || !currency) return null;
  return {
    content_ids: [toMetaContentId(line.merchandise.product.id, line.merchandise.id)],
    content_type: 'product',
    content_name: line.merchandise.product.title,
    value: roundToCents(unitPrice * added),
    currency,
    num_items: added,
  };
};

export const searchParams = (payload: SearchViewPayload): MetaEventParams | null => {
  const term = payload.searchTerm.trim();
  if (!term) return null;
  return { search_string: term };
};
