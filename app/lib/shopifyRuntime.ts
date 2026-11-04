import type { ShopifyGlobal, StorefrontAnalytics } from '@shopify/hydrogen';

/**
 * The one "wait for the Shopify runtime" helper, and the selectors it polls.
 * `<ShopifyScripts>` creates `window.Shopify` pieces at different times — the
 * analytics bus from its inline bootstrap (before hydration), the Standard
 * Actions and Customer Privacy API from async scripts — so a caller that needs
 * one of them polls briefly rather than assuming it exists on mount. Read
 * `window.Shopify` through a selector here, not at the call site.
 */

/** The analytics bus (browser only); null until `<ShopifyScripts>` has created it. */
export const getAnalyticsBus = (): StorefrontAnalytics | null =>
  typeof window === 'undefined' ? null : (window.Shopify?.analytics ?? null);

/** The `openCart` standard action, once the Standard Actions script has loaded. */
export const getOpenCartAction = () => window.Shopify?.actions?.openCart;

/** The Customer Privacy API, once its (asynchronously loaded) script has arrived. */
export const getCustomerPrivacy = (): ShopifyGlobal['customerPrivacy'] | null => {
  const customerPrivacy = window.Shopify?.customerPrivacy;
  return customerPrivacy?.analyticsProcessingAllowed ? customerPrivacy : null;
};

type WhenShopifyReadyOptions = {
  /** Polls before giving up (the immediate check doesn't count). */
  attempts?: number;
  intervalMs?: number;
  /** Called once if the piece never appears within `attempts`. */
  onGiveUp?: () => void;
};

/**
 * Calls `callback` with the first non-null value `select` returns: at once
 * if the runtime piece already exists, otherwise on a short poll. Returns a
 * cancel function; on the server (no `window`) nothing runs.
 */
export const whenShopifyReady = <T>(
  select: () => T | null | undefined,
  callback: (value: T) => void,
  { attempts = 40, intervalMs = 250, onGiveUp }: WhenShopifyReadyOptions = {}
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const ready = select();
  if (ready != null) {
    callback(ready);
    return () => {};
  }

  let remaining = attempts;
  const timer = window.setInterval(() => {
    const value = select();
    if (value != null) {
      window.clearInterval(timer);
      callback(value);
    } else if (--remaining <= 0) {
      window.clearInterval(timer);
      onGiveUp?.();
    }
  }, intervalMs);
  return () => window.clearInterval(timer);
};
