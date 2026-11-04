// @vitest-environment jsdom
import type {
  StorefrontAnalyticsDestination,
  StorefrontAnalyticsDestinationSetupContext,
} from '@shopify/hydrogen';
import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import type { PostHogBridge as PostHogBridgeComponent } from '~/components/analytics/Trackers';
import type { connectPostHogToShopify as ConnectPostHogToShopify } from '~/lib/analytics/posthog.client';

type Callback = (payload: unknown) => void;

const sdk = vi.hoisted(() => ({
  __loaded: true,
  capture: vi.fn(),
  has_opted_out_capturing: vi.fn(() => true),
  opt_in_capturing: vi.fn(),
  opt_out_capturing: vi.fn(),
  startSessionRecording: vi.fn(),
}));

vi.mock('posthog-js', () => ({ posthog: sdk }));

// The poll's budget: whenShopifyReady's default 40 attempts at 250ms.
const CONSENT_POLL_MS = 40 * 250;

/**
 * The regression this file pins (ba76a8a): the bus replays its buffer the
 * moment `setup` resolves, so `setup` must not resolve before the SDK has been
 * opted in, or the hydration `product_viewed` lands in an opted-out SDK and is
 * dropped without a trace.
 */
describe('connectPostHogToShopify', () => {
  let addDestination: ReturnType<typeof vi.fn>;
  let destination: StorefrontAnalyticsDestination | undefined;
  let callbacks: Record<string, Callback>;
  let connect: typeof ConnectPostHogToShopify;
  let PostHogBridge: typeof PostHogBridgeComponent;
  let consentListeners: MockInstance<typeof document.addEventListener>;

  const setupContext = (): StorefrontAnalyticsDestinationSetupContext => ({
    subscribe: vi.fn((event: string, callback: Callback) => {
      callbacks[event] = callback;
      return vi.fn();
    }) as never,
    getConfig: vi.fn() as never,
  });

  /** Runs setup and tracks when its promise settles. */
  const runSetup = () => {
    const state = { resolved: false };
    void Promise.resolve(destination?.setup(setupContext())).then(() => {
      state.resolved = true;
    });
    return state;
  };

  const allowAnalytics = (allowed = true) => {
    Object.assign(window.Shopify ?? {}, {
      customerPrivacy: { analyticsProcessingAllowed: () => allowed },
    });
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    vi.clearAllMocks();
    consentListeners = vi.spyOn(document, 'addEventListener');
    sdk.has_opted_out_capturing.mockReturnValue(true);
    callbacks = {};
    destination = undefined;
    addDestination = vi.fn((candidate: StorefrontAnalyticsDestination) => {
      destination = candidate;
      return () => {};
    });
    window.Shopify = {
      analytics: { addDestination, publish: vi.fn(), getConfig: vi.fn() },
    } as never;
    ({ connectPostHogToShopify: connect } = await import('~/lib/analytics/posthog.client'));
    ({ PostHogBridge } = await import('~/components/analytics/Trackers'));
  });

  afterEach(() => {
    // jsdom's document outlives the reset modules, so each test's listener would too.
    for (const [type, listener] of consentListeners.mock.calls)
      document.removeEventListener(type, listener as EventListener);
    consentListeners.mockRestore();
    vi.useRealTimers();
    delete (window as { Shopify?: unknown }).Shopify;
  });

  it('keeps setup pending while Customer Privacy has not arrived', async () => {
    connect();
    const setup = runSetup();
    await vi.advanceTimersByTimeAsync(1000);
    expect(setup.resolved).toBe(false);
    expect(sdk.opt_in_capturing).not.toHaveBeenCalled();
  });

  it('subscribes before consent, so the replay finds its handlers', () => {
    connect();
    runSetup();
    expect(Object.keys(callbacks)).toEqual([
      'product_viewed',
      'collection_viewed',
      'cart_viewed',
      'product_added_to_cart',
      'product_removed_from_cart',
      'cart_updated',
    ]);
  });

  it('opts the SDK in before setup resolves', async () => {
    let optedInAtResolve = false;
    connect();
    void Promise.resolve(destination?.setup(setupContext())).then(() => {
      optedInAtResolve = sdk.opt_in_capturing.mock.calls.length === 1;
    });
    await vi.advanceTimersByTimeAsync(500);
    expect(optedInAtResolve).toBe(false);

    allowAnalytics();
    await vi.advanceTimersByTimeAsync(250);
    expect(optedInAtResolve).toBe(true);
    expect(sdk.startSessionRecording).toHaveBeenCalledTimes(1);
  });

  it('resolves at once when Customer Privacy is already there', async () => {
    allowAnalytics();
    connect();
    const setup = runSetup();
    await vi.advanceTimersByTimeAsync(0);
    expect(setup.resolved).toBe(true);
    expect(sdk.opt_in_capturing).toHaveBeenCalledTimes(1);
  });

  it('resolves on give-up with the SDK still opted out', async () => {
    connect();
    const setup = runSetup();
    await vi.advanceTimersByTimeAsync(CONSENT_POLL_MS);
    expect(setup.resolved).toBe(true);
    expect(sdk.opt_in_capturing).not.toHaveBeenCalled();
  });

  it('stays opted out when analytics are refused, then follows a later grant', async () => {
    allowAnalytics(false);
    connect();
    const setup = runSetup();
    await vi.advanceTimersByTimeAsync(0);
    expect(setup.resolved).toBe(true);
    expect(sdk.opt_in_capturing).not.toHaveBeenCalled();

    allowAnalytics(true);
    document.dispatchEvent(new Event('visitorConsentCollected'));
    expect(sdk.opt_in_capturing).toHaveBeenCalledTimes(1);
  });

  it('maps a bus event onto the SDK', () => {
    connect();
    runSetup();
    callbacks.collection_viewed?.({ collection: { id: 'gid://c/1', handle: 'baseline' } });
    expect(sdk.capture).toHaveBeenCalledWith('collection_viewed', {
      collection_id: 'gid://c/1',
      collection_handle: 'baseline',
    });
  });

  it('registers once under Strict Mode', () => {
    render(
      <StrictMode>
        <PostHogBridge />
      </StrictMode>
    );
    expect(addDestination).toHaveBeenCalledTimes(1);
    expect(addDestination.mock.calls[0]?.[0]).toMatchObject({ name: 'posthog' });
  });

  it('registers nothing when PostHog is off', () => {
    sdk.__loaded = false;
    connect();
    sdk.__loaded = true;
    expect(addDestination).not.toHaveBeenCalled();
  });
});
