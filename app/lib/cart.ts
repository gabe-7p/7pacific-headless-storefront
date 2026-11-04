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
 * The cart provider + hooks for every cart surface. `CartProvider` takes the
 * root loader's cart as `initialData`; `useCart(selector)` is the one way to
 * read cart state (never a deferred loader promise); `useCartForm` builds the
 * line / discount forms that post to `/api/cart` through the store.
 */
export const { CartProvider, useCart, useCartForm } = createCartComponents<typeof cartHandlers>();
