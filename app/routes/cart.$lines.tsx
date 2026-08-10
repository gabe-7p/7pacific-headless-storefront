import { redirect } from 'react-router';

import type { Route } from './+types/cart.$lines';

/**
 * Creates a cart from the URL and redirects straight to checkout.
 * URL grammar: `/cart/<variant_id>:<qty>[,<variant_id>:<qty>…][?discount=CODE]`
 * e.g. `/cart/41007289663544:1,41007289696312:2?discount=SUMMER`.
 */
export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { cart } = context;
  const { lines } = params;
  if (!lines) return redirect('/cart');
  const linesMap = lines.split(',').map((line) => {
    const lineDetails = line.split(':');
    const variantId = lineDetails[0];
    const quantity = parseInt(lineDetails[1] ?? '1', 10);

    return {
      merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
      quantity,
    };
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const discount = searchParams.get('discount');
  const discountArray = discount ? [discount] : [];

  const result = await cart.create({
    lines: linesMap,
    discountCodes: discountArray,
  });

  const cartResult = result.cart;

  if (result.errors?.length || !cartResult) {
    throw new Response('Link may be expired. Try checking the URL.', {
      status: 410,
    });
  }

  const headers = cart.setCartId(cartResult.id);

  if (cartResult.checkoutUrl) {
    return redirect(cartResult.checkoutUrl, { headers });
  } else {
    throw new Error('No checkout URL found');
  }
}

// Loader always redirects; nothing renders.
const CartLinesPage = () => null;

export default CartLinesPage;
