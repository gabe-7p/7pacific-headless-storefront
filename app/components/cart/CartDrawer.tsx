import { useEffect } from 'react';

import { useCartViewed } from '~/components/analytics/Trackers';
import { CartMain } from '~/components/cart/CartMain';
import { useCartDrawer } from '~/components/cart/useCartDrawer';
import { Aside } from '~/components/layout/Aside';
import { CART_COPY } from '~/content/cart';
import { getOpenCartAction, whenShopifyReady } from '~/lib/shopifyRuntime';

/**
 * The drawer's open function lives in React state; this module-level slot
 * lets the one non-React caller reach it: Shopify's `openCart` standard
 * action (cart/buy permalinks, agents, apps), wired once the Standard Actions
 * script loads. The handler reads the slot at call time, so a later
 * re-registration (a remount) still wins.
 */
let opener: (() => void) | null = null;
let configuring = false;

const registerOpener = (open: () => void) => {
  opener = open;
  if (configuring) return;
  configuring = true;
  whenShopifyReady(getOpenCartAction, (openCart) =>
    openCart.configure({ handler: async () => opener?.() })
  );
};

/**
 * The cart drawer. Registers itself as the `openCart` target and publishes
 * `cart_viewed` once per open (not per cart change).
 */
export const CartDrawer = () => {
  const { isOpen, open } = useCartDrawer();
  useCartViewed(isOpen);

  useEffect(() => {
    registerOpener(open);
  }, [open]);

  return (
    <Aside type="cart" heading={CART_COPY.title}>
      <CartMain layout="aside" />
    </Aside>
  );
};
