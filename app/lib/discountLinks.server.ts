import { cartQueries, createCartCookie, getCart, getCartId } from '@shopify/hydrogen';

import type { StorefrontClient } from '~/lib/storefront';

/**
 * Puts a creator link's code on the visitor's cart, so the drawer shows it
 * and checkout carries it. A visitor without a cart gets
 * a new, empty one holding just the code (the `/api/cart` handlers can't do
 * that: a discount change without a cart is a `missing_cart` error), and the
 * returned headers set its cookie. The code shows as not applicable (and the
 * drawer hides it) until the cart has a line it applies to. Never throws: a
 * failed apply still lands the visitor, who can enter the code by hand.
 */
export const applyDiscountCode = async (
  storefront: StorefrontClient,
  request: Request,
  code: string
): Promise<Headers> => {
  const headers = new Headers();
  try {
    const { cart } = await getCart(getCartId(request), storefront);
    if (cart) {
      // eslint-disable-next-line no-restricted-syntax -- a mutation: no cache option, never cached
      const { data, errors } = await storefront.graphql(cartQueries.cartDiscountCodesUpdate, {
        variables: {
          cartId: cart.id,
          // Every code stays, not just the applicable ones: on a cart with no
          // lines a valid code is not applicable yet (Shopify re-checks it as
          // lines are added), so dropping those would undo an earlier link.
          discountCodes: [...new Set([...cart.discountCodes.map((d) => d.code), code])],
        },
      });
      const userErrors = data?.cartDiscountCodesUpdate?.userErrors;
      if (errors || userErrors?.length) console.error(errors ?? userErrors);
      return headers;
    }

    // eslint-disable-next-line no-restricted-syntax -- a mutation: no cache option, never cached
    const { data, errors } = await storefront.graphql(cartQueries.cartCreate, {
      variables: { input: { discountCodes: [code] } },
    });
    const created = data?.cartCreate?.cart;
    if (created) headers.append('Set-Cookie', createCartCookie(created.id));
    else console.error(errors ?? data?.cartCreate?.userErrors);
  } catch (error) {
    console.error(error);
  }
  return headers;
};
