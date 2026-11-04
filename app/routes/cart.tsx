import { useCartViewed } from '~/components/analytics/Trackers';
import { CartMain } from '~/components/cart/CartMain';
import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { TextLink } from '~/components/common/TextLink';
import { CART_COPY } from '~/content/cart';
import { STORE_LINKS } from '~/content/links';
import { useCart } from '~/lib/cart';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/cart';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: CART_COPY.title });
};

/**
 * The full cart page. It has no loader or action: cart data comes from the
 * client store (`useCart`) and mutations post to `/api/cart`.
 */
const Cart = () => {
  const hasItems = useCart((state) => state.data.totalQuantity > 0);
  useCartViewed(true);

  return (
    <Container className="max-w-(--page-cart) py-10">
      <div className="mb-8 text-center">
        <Heading as="h1" variant="quiet" className="font-semibold">
          {CART_COPY.title}
        </Heading>
        {hasItems && (
          <TextLink to={STORE_LINKS.shopAll} prefetch="intent" className="mt-2 inline-block">
            {CART_COPY.continueShopping}
          </TextLink>
        )}
      </div>
      <CartMain layout="page" />
    </Container>
  );
};

export default Cart;
