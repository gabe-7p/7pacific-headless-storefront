import { useCallback, useEffect, useRef } from 'react';

import { CartMain } from '~/components/cart/CartMain';
import { Aside, useAside } from '~/components/layout/Aside';
import { publishCartViewed } from '~/lib/analytics/shopify';
import { useCart } from '~/lib/cart';
import { whenShopifyReady } from '~/lib/shopifyRuntime';

/**
 * The one way to open the cart drawer from React: the header bag, the PDP
 * add-to-cart (`afterSubmit`) and the drawer's own `openCart` handler all go
 * through this hook, so the drawer's `Aside` type is spelled in one file.
 */
export const useCartDrawer = () => {
  const { type, open, close } = useAside();
  return {
    isOpen: type === 'cart',
    open: useCallback(() => open('cart'), [open]),
    close,
  };
};

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
  whenShopifyReady(
    () => window.Shopify?.actions?.openCart,
    (openCart) => openCart.configure({ handler: async () => opener?.() })
  );
};

/**
 * The cart drawer: `layout/Aside` (the shared Radix Sheet) around the cart
 * contents. Registers itself as the `openCart` target and publishes
 * `cart_viewed` each time it opens — the same event the /cart page publishes
 * on mount, so a cart view is counted once per open, not per cart change.
 */
export const CartDrawer = () => {
  const { isOpen, open } = useCartDrawer();
  const cart = useCart((state) => state.data);
  const cartRef = useRef(cart);
  cartRef.current = cart;

  useEffect(() => {
    registerOpener(open);
  }, [open]);

  useEffect(() => {
    if (isOpen) publishCartViewed(cartRef.current);
  }, [isOpen]);

  return (
    <Aside type="cart" heading="Cart">
      <CartMain layout="aside" />
    </Aside>
  );
};
