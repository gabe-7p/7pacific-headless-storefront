import { useEffect } from 'react';

import { CartMain } from '~/components/cart/CartMain';
import { Heading } from '~/components/common/Heading';
import { TextLink } from '~/components/common/TextLink';
import { STORE_LINKS } from '~/content/links';
import { publishCartViewed } from '~/lib/analytics/shopify';
import { useCart } from '~/lib/cart';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/cart';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: 'Cart' });
};

/**
 * The full cart page. It has no loader or action: cart data comes from the
 * client store (`useCart`) and mutations post to `/api/cart`.
 */
const Cart = () => {
  const cart = useCart((state) => state.data);
  const hasItems = cart.totalQuantity > 0;

  useEffect(() => {
    publishCartViewed(cart);
    // Once per visit to the page, not per cart change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 md:px-8">
      <div className="mb-8 text-center">
        <Heading as="h1" variant="quiet" className="font-semibold">
          Cart
        </Heading>
        {hasItems && (
          <TextLink to={STORE_LINKS.shopAll} prefetch="intent" className="mt-2 inline-block">
            Continue shopping
          </TextLink>
        )}
      </div>
      <CartMain layout="page" />
    </div>
  );
};

export default Cart;
