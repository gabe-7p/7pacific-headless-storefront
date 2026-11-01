import type { StorefrontAnalytics } from '@shopify/hydrogen';

import {
  addToCartParams,
  META_PIXEL_DESTINATION,
  META_PIXEL_SCRIPT_URL,
  type MetaEventParams,
  type MetaStandardEvent,
  searchParams,
  viewContentParams,
} from '~/lib/analytics/meta-pixel';
import { getAnalytics } from '~/lib/analytics/shopify';
import { whenShopifyReady } from '~/lib/shopifyRuntime';

/**
 * The Meta Pixel as a destination on the Shopify analytics bus (browser only).
 *
 * Why a destination and not the usual `<script>` snippet in the head: the bus
 * only delivers to destinations once Customer Privacy allows analytics, so
 * fbevents.js (which sets the `_fbp` cookie) is loaded lazily from the first
 * subscriber callback — never from `setup()`, which runs before consent. Until
 * the script arrives, calls sit in the official stub's queue and fbevents.js
 * flushes them in order on load, `init` first.
 *
 * Registered once per page lifetime: the bus replays its buffer to every new
 * destination, so a remove + re-add (a Strict Mode remount, an HMR reload)
 * would double-deliver. The flag is set inside the ready callback, exactly
 * like the PostHog bridge; the bus itself also ignores a second active
 * destination with the same name.
 */
type Fbq = {
  (...args: Array<unknown>): void;
  callMethod?: (...args: Array<unknown>) => void;
  queue: Array<IArguments | Array<unknown>>;
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- global augmentation must be an interface
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

type MetaPixelOptions = { pixelId: string; nonce?: string };

let registered = false;
let fbq: Fbq | null = null;

/** The official snippet's stub: queues calls until fbevents.js replaces `callMethod`. */
const createFbqStub = (): Fbq => {
  const stub = function (this: unknown, ...args: Array<unknown>) {
    if (stub.callMethod) stub.callMethod(...args);
    else stub.queue.push(args);
  } as Fbq;
  stub.queue = [];
  stub.push = stub;
  stub.loaded = true;
  stub.version = '2.0';
  return stub;
};

/** Creates `window.fbq`, injects fbevents.js (nonced) and queues `init` — once. */
const ensureFbq = ({ pixelId, nonce }: MetaPixelOptions): Fbq => {
  if (fbq) return fbq;
  fbq = window.fbq ?? createFbqStub();
  if (!window.fbq) {
    window.fbq = fbq;
    window._fbq = fbq;
    const script = document.createElement('script');
    script.async = true;
    script.src = META_PIXEL_SCRIPT_URL;
    if (nonce) script.nonce = nonce;
    document.head.appendChild(script);
  }
  fbq('init', pixelId);
  return fbq;
};

const register = (analytics: StorefrontAnalytics, options: MetaPixelOptions) => {
  if (registered) return;
  registered = true;

  const track = (event: MetaStandardEvent, params?: MetaEventParams | null) => {
    if (params === null) return;
    const pixel = ensureFbq(options);
    if (params) pixel('track', event, params);
    else pixel('track', event);
  };

  analytics.addDestination({
    name: META_PIXEL_DESTINATION,
    setup({ subscribe }) {
      const unsubscribe = [
        subscribe('page_viewed', () => track('PageView')),
        subscribe('product_viewed', (payload) => track('ViewContent', viewContentParams(payload))),
        subscribe('product_added_to_cart', (payload) =>
          track('AddToCart', addToCartParams(payload, window.Shopify?.currency?.active))
        ),
        subscribe('search_viewed', (payload) => track('Search', searchParams(payload))),
      ];
      return () => unsubscribe.forEach((off) => off());
    },
  });
};

/**
 * Registers the Meta Pixel destination once the bus exists (client only).
 * Returns a cancel for the readiness poll; it never removes the destination.
 */
export const connectMetaPixelToShopify = (options: MetaPixelOptions): (() => void) =>
  whenShopifyReady(getAnalytics, (analytics) => register(analytics, options), { attempts: 20 });
