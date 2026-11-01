/**
 * The cart drawer is a Radix Sheet owned by `layout/Aside`; its open function
 * lives in React state. This tiny registry lets non-React callers reach it:
 * the product form's `afterSubmit`, and Shopify's `openCart` standard action
 * (cart/buy permalinks, agents, apps), which is wired once the runtime loads.
 */
let opener: (() => void) | null = null;
let configured = false;
let retries = 0;

const configureOpenCartAction = () => {
  if (configured || typeof window === 'undefined') return;
  const openCart = window.Shopify?.actions?.openCart;
  if (!openCart) {
    // The Standard Actions script loads asynchronously; try again briefly.
    if (retries++ < 40) window.setTimeout(configureOpenCartAction, 250);
    return;
  }
  openCart.configure({ handler: async () => opener?.() });
  configured = true;
};

export const registerCartDrawerOpener = (open: () => void) => {
  opener = open;
  configureOpenCartAction();
};

export const openCartDrawer = () => opener?.();
