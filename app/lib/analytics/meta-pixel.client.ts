import {
  addToCartParams,
  META_PIXEL_DESTINATION,
  META_PIXEL_SCRIPT_URL,
  type MetaEventParams,
  type MetaStandardEvent,
  searchParams,
  viewContentParams,
} from '~/lib/analytics/meta-pixel';
import { AnalyticsEvent, connectDestination } from '~/lib/analytics/shopify';
import { getActiveCurrency } from '~/lib/shopifyRuntime';

/**
 * The Meta Pixel as a destination on the Shopify analytics bus (browser only).
 *
 * Why a destination and not the usual `<script>` snippet in the head: the bus
 * only delivers to destinations once Customer Privacy allows analytics, so
 * fbevents.js (which sets the `_fbp` cookie) is loaded lazily from the first
 * subscriber callback — never from `setup()`, which runs before consent. Until
 * the script arrives, calls sit in the official stub's queue and fbevents.js
 * flushes them in order on load, `init` first.
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

/**
 * Creates `window.fbq`, injects fbevents.js (nonced) and queues `init` — once.
 *
 * Automatic Configuration is switched off first (`set autoConfig false` must
 * precede `init`). With it on, fbevents.js scrapes every page (meta
 * description, stock/price selectors from the pixel's old "automatic events"
 * rules) and appends ~8 KB to each event; anything over 2048 URL characters
 * is then sent as a `navigator.sendBeacon` POST instead of a GET image, and
 * those beacons were the events Events Manager never showed (every
 * `AddToCart`, and `ViewContent` on every product whose description is
 * longer than a tweet). Off, every event is a ~1.3 KB GET, and Meta's
 * automatic `SubscribedButtonClick` events and its "Invalid parameter format
 * for currency" warning stop too. We publish every standard event ourselves,
 * so nothing is lost.
 */
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
  fbq('set', 'autoConfig', false, pixelId);
  fbq('init', pixelId);
  return fbq;
};

/**
 * Registers the Meta Pixel destination once the bus exists (client only).
 * Returns a cancel for the readiness poll; it never removes the destination.
 */
export const connectMetaPixelToShopify = (options: MetaPixelOptions): (() => void) => {
  const track = (event: MetaStandardEvent, params?: MetaEventParams | null) => {
    if (params === null) return;
    const pixel = ensureFbq(options);
    if (params) pixel('track', event, params);
    else pixel('track', event);
  };

  return connectDestination(META_PIXEL_DESTINATION, {
    [AnalyticsEvent.PAGE_VIEWED]: () => track('PageView'),
    [AnalyticsEvent.PRODUCT_VIEWED]: (payload) => track('ViewContent', viewContentParams(payload)),
    [AnalyticsEvent.PRODUCT_ADD_TO_CART]: (payload) =>
      track('AddToCart', addToCartParams(payload, getActiveCurrency())),
    [AnalyticsEvent.SEARCH_VIEWED]: (payload) => track('Search', searchParams(payload)),
  });
};
