/**
 * The one "wait for the Shopify runtime" helper. `<ShopifyScripts>` creates
 * `window.Shopify` pieces at different times — the analytics bus from its
 * inline bootstrap (before hydration), the Standard Actions and Customer
 * Privacy API from async scripts — so a caller that needs one of them polls
 * briefly rather than assuming it exists on mount.
 */
type WhenShopifyReadyOptions = {
  /** Polls before giving up (the immediate check doesn't count). */
  attempts?: number;
  intervalMs?: number;
};

/**
 * Calls `callback` with the first non-null value `select` returns: at once
 * if the runtime piece already exists, otherwise on a short poll. Returns a
 * cancel function; on the server (no `window`) nothing runs.
 */
export const whenShopifyReady = <T>(
  select: () => T | null | undefined,
  callback: (value: T) => void,
  { attempts = 40, intervalMs = 250 }: WhenShopifyReadyOptions = {}
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
    }
  }, intervalMs);
  return () => window.clearInterval(timer);
};
