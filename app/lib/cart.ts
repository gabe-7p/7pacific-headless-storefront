import type { CartDataFromHandlers } from '@shopify/hydrogen';
import { createCartComponents } from '@shopify/hydrogen/react';

import type { cartHandlers } from '~/lib/cart.server';

/** The cart as the store holds it, typed from the server handlers' query. */
export type CartData = CartDataFromHandlers<typeof cartHandlers>;
export type CartLine = CartData['lines']['nodes'][number];

/** Hydrogen's id prefix for a line the server hasn't confirmed yet (not exported). */
const OPTIMISTIC_LINE_ID_PREFIX = 'optimistic:';

/** Whether a line is still optimistic, so its controls can't act on it yet. */
export const isOptimisticLine = (line: Pick<CartLine, 'id'>): boolean =>
  line.id.startsWith(OPTIMISTIC_LINE_ID_PREFIX);

/**
 * The code list to send for a discount change: the codes that apply, plus or
 * minus the one the shopper submitted. A rejected code stays on the cart as
 * non-applicable and Shopify warns about it on every response, so leaving it
 * out is what drops it and keeps that warning off a later, unrelated change.
 */
export const nextDiscountCodes = (
  discounts: CartData['discountCodes'],
  change: { apply: string } | { remove: string }
): Array<string> => {
  const applied = discounts.filter(({ applicable }) => applicable).map(({ code }) => code);
  return 'apply' in change
    ? [...new Set([...applied, change.apply])]
    : applied.filter((code) => code !== change.remove);
};

/**
 * The cart provider + hooks for every cart surface. `CartProvider` takes the
 * root loader's cart as `initialData`; `useCart(selector)` is the one way to
 * read cart state (never a deferred loader promise); `useCartForm` builds the
 * line / discount forms that post to `/api/cart` through the store.
 */
export const { CartProvider, useCart, useCartForm } = createCartComponents<typeof cartHandlers>();
