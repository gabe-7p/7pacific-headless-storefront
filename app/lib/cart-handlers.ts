import { createCartServerHandlers } from '@shopify/hydrogen';

/**
 * The `/api/cart` handlers (registered in the root middleware) that the cart
 * store talks to. Hydrogen's default cart query already carries everything the
 * cart UI renders — line image, product handle/title, selected options, costs,
 * discount codes — so no custom fragment. Guest checkout only: no
 * `customerSession`, so the handlers never read the session.
 */
export const cartHandlers = createCartServerHandlers();
