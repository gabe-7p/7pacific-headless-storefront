import { whenShopifyReady } from '~/lib/shopifyRuntime';

/**
 * The cart drawer is a Radix Sheet owned by `layout/Aside`; its open function
 * lives in React state. This tiny registry lets the one non-React caller reach
 * it: Shopify's `openCart` standard action (cart/buy permalinks, agents, apps),
 * which is wired once the runtime loads. React callers (the header bag,
 * `product/AddToCartBar`) call `useAside().open('cart')` directly.
 */
let opener: (() => void) | null = null;
let configuring = false;

export const registerCartDrawerOpener = (open: () => void) => {
  opener = open;
  if (configuring) return;
  configuring = true;
  // The Standard Actions script loads asynchronously; the handler reads
  // `opener` at call time, so a later re-registration still wins.
  whenShopifyReady(
    () => window.Shopify?.actions?.openCart,
    (openCart) => openCart.configure({ handler: async () => opener?.() })
  );
};
