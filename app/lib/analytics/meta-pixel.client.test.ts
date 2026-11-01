// @vitest-environment jsdom
import type {
  AnalyticsCartLine,
  CartLineUpdatePayload,
  ProductViewPayload,
  StorefrontAnalyticsDestination,
  StorefrontAnalyticsDestinationSetupContext,
} from '@shopify/hydrogen';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { connectMetaPixelToShopify as ConnectMetaPixelToShopify } from '~/lib/analytics/meta-pixel.client';

type Callback = (payload: unknown) => void;

const line = (overrides: Partial<AnalyticsCartLine> = {}): AnalyticsCartLine => ({
  id: 'gid://shopify/CartLine/1',
  quantity: 1,
  merchandise: {
    id: 'gid://shopify/ProductVariant/11',
    title: 'M',
    price: { amount: '74.0', currencyCode: 'USD' },
    product: { id: 'gid://shopify/Product/1', title: 'AirRail 6', vendor: '7Pacific' },
  },
  ...overrides,
});

const lineChange = (overrides: Partial<CartLineUpdatePayload> = {}): CartLineUpdatePayload => ({
  cart: null,
  prevCart: null,
  ...overrides,
});

const productViewed = (): ProductViewPayload => ({
  products: [
    {
      id: 'gid://shopify/Product/1',
      title: 'AirRail 6',
      price: { amount: '74.0', currencyCode: 'USD' },
      vendor: '7Pacific',
      variantId: 'gid://shopify/ProductVariant/11',
      variantTitle: 'M',
      quantity: 1,
    },
  ],
});

/** Everything the official fbq stub exposes that the tests read. */
type FbqStub = { (...args: Array<unknown>): void; queue: Array<IArguments | Array<unknown>> };

describe('connectMetaPixelToShopify', () => {
  let addDestination: ReturnType<typeof vi.fn>;
  let destination: StorefrontAnalyticsDestination | undefined;
  let callbacks: Record<string, Callback>;
  let unsubscribes: Array<ReturnType<typeof vi.fn>>;
  let connect: typeof ConnectMetaPixelToShopify;

  const setupContext = (): StorefrontAnalyticsDestinationSetupContext => ({
    subscribe: vi.fn((event: string, callback: Callback) => {
      callbacks[event] = callback;
      const unsubscribe = vi.fn();
      unsubscribes.push(unsubscribe);
      return unsubscribe;
    }) as never,
    getConfig: vi.fn() as never,
  });

  /** Runs the destination's setup with a fresh context; returns its sync cleanup, if any. */
  const runSetup = (): (() => void) | undefined => {
    const result = destination?.setup(setupContext());
    return typeof result === 'function' ? result : undefined;
  };

  const queued = () =>
    ((window.fbq as FbqStub | undefined)?.queue ?? []).map((args) => Array.from(args));

  beforeEach(async () => {
    vi.resetModules();
    callbacks = {};
    unsubscribes = [];
    destination = undefined;
    addDestination = vi.fn((candidate: StorefrontAnalyticsDestination) => {
      destination = candidate;
      return () => {};
    });
    window.Shopify = {
      analytics: { addDestination, publish: vi.fn(), getConfig: vi.fn() },
    } as never;
    delete window.fbq;
    delete window._fbq;
    document.head.innerHTML = '';
    ({ connectMetaPixelToShopify: connect } = await import('~/lib/analytics/meta-pixel.client'));
    connect({ pixelId: '123', nonce: 'abc' });
  });

  afterEach(() => {
    delete (window as { Shopify?: unknown }).Shopify;
  });

  it('registers one destination named meta-pixel and subscribes to the four events', () => {
    expect(addDestination).toHaveBeenCalledTimes(1);
    expect(destination?.name).toBe('meta-pixel');
    runSetup();
    expect(Object.keys(callbacks)).toEqual([
      'page_viewed',
      'product_viewed',
      'product_added_to_cart',
      'search_viewed',
    ]);
  });

  it('registers once even when connected twice (Strict Mode)', () => {
    connect({ pixelId: '123', nonce: 'abc' });
    connect({ pixelId: '123', nonce: 'abc' });
    expect(addDestination).toHaveBeenCalledTimes(1);
  });

  it('injects nothing until the first event', () => {
    runSetup();
    expect(document.querySelector('script[src*="fbevents"]')).toBeNull();
    expect(window.fbq).toBeUndefined();
  });

  it('loads fbevents.js with the nonce and queues init before the first track', () => {
    runSetup();
    callbacks.page_viewed?.({});
    const script = document.querySelector<HTMLScriptElement>(
      'script[src="https://connect.facebook.net/en_US/fbevents.js"]'
    );
    expect(script?.nonce).toBe('abc');
    expect(script?.async).toBe(true);
    expect(queued()).toEqual([
      ['init', '123'],
      ['track', 'PageView'],
    ]);
  });

  it('does not inject a second script on later events', () => {
    runSetup();
    callbacks.page_viewed?.({});
    callbacks.page_viewed?.({});
    expect(document.querySelectorAll('script[src*="fbevents"]').length).toBe(1);
    expect(queued().filter((call) => call[0] === 'init').length).toBe(1);
  });

  it('maps ViewContent, AddToCart and Search and skips null params', () => {
    runSetup();
    // Fresh registration, no page_viewed yet: the first call must still be init.
    callbacks.product_viewed?.(productViewed());
    callbacks.product_added_to_cart?.(lineChange({ currentLine: line({ quantity: 1 }) }));
    // A decrease and an empty search term map to nothing.
    callbacks.product_added_to_cart?.(
      lineChange({ prevLine: line({ quantity: 2 }), currentLine: line({ quantity: 1 }) })
    );
    callbacks.search_viewed?.({ searchTerm: '' });
    callbacks.search_viewed?.({ searchTerm: 'shorts' });
    expect(queued().map((call) => (call[0] === 'init' ? 'init' : call[1]))).toEqual([
      'init',
      'ViewContent',
      'AddToCart',
      'Search',
    ]);
    expect(queued()[2]?.[2]).toMatchObject({ num_items: 1, value: 74, currency: 'USD' });
    expect(queued()[3]?.[2]).toEqual({ search_string: 'shorts' });
  });

  it('setup cleanup unsubscribes everything', () => {
    const cleanup = runSetup();
    expect(typeof cleanup).toBe('function');
    cleanup?.();
    expect(unsubscribes).toHaveLength(4);
    expect(unsubscribes.every((unsubscribe) => unsubscribe.mock.calls.length === 1)).toBe(true);
  });
});
