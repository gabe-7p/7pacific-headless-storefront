import { redirect } from 'react-router';

import type { Route } from './+types/discount.$code';

/**
 * Applies the discount code in the URL to the cart (creating one if needed),
 * then redirects: `/discount/FREESHIPPING?redirect=/products` (default `/`).
 */
export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { cart } = context;
  const { code } = params;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let redirectParam = searchParams.get('redirect') || searchParams.get('return_to') || '/';

  if (redirectParam.includes('//')) {
    // Avoid redirecting to external URLs to prevent phishing attacks
    redirectParam = '/';
  }

  searchParams.delete('redirect');
  searchParams.delete('return_to');

  const redirectUrl = `${redirectParam}?${searchParams}`;

  if (!code) {
    return redirect(redirectUrl);
  }

  const result = await cart.updateDiscountCodes([code]);
  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(cartId) : new Headers();

  // Known quirk: Set-Cookie on a 303 redirect is dropped when the origin has a
  // port (localhost:3000), so a newly-created cart id won't persist in dev.
  return redirect(redirectUrl, {
    status: 303,
    headers,
  });
}
