import { useCallback } from 'react';

import { useAside } from '~/components/layout/Aside';

/**
 * The one way to reach the cart drawer from React: the header bag, the PDP
 * add-to-cart (`afterSubmit`), the cart lines and the drawer's own `openCart`
 * handler all go through this hook, so the drawer's `Aside` type is spelled in
 * one file. It lives apart from `CartDrawer` because that file imports
 * `CartMain`, which needs `close` from here.
 */
export const useCartDrawer = () => {
  const { type, open, close } = useAside();
  return {
    isOpen: type === 'cart',
    open: useCallback(() => open('cart'), [open]),
    close,
  };
};
