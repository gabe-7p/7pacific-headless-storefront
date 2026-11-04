import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getActiveCurrency,
  getAnalyticsBus,
  getCustomerPrivacy,
  getOpenCartAction,
  getUpdateCartAction,
  whenShopifyReady,
} from '~/lib/shopifyRuntime';

// Tests run in node; the helper only needs `window`'s timers, which this stub
// routes through the (fake-timer-patched) globals at call time.
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('window', {
    setInterval: (handler: () => void, ms: number) => setInterval(handler, ms),
    clearInterval: (id: ReturnType<typeof setInterval>) => clearInterval(id),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('whenShopifyReady', () => {
  it('calls back at once when the runtime piece already exists', () => {
    const callback = vi.fn();
    whenShopifyReady(() => 'bus', callback);
    expect(callback).toHaveBeenCalledWith('bus');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('polls until the piece appears, then stops', () => {
    let value: string | null = null;
    const select = vi.fn(() => value);
    const callback = vi.fn();
    whenShopifyReady(select, callback, { intervalMs: 250 });

    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    value = 'bus';
    vi.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('bus');

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('gives up after the configured attempts and says so once', () => {
    const select = vi.fn(() => null);
    const callback = vi.fn();
    const onGiveUp = vi.fn();
    whenShopifyReady(select, callback, { attempts: 3, intervalMs: 100, onGiveUp });

    vi.advanceTimersByTime(10_000);
    expect(select).toHaveBeenCalledTimes(1 + 3);
    expect(callback).not.toHaveBeenCalled();
    expect(onGiveUp).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not report giving up when the piece arrives in time', () => {
    let value: string | null = null;
    const onGiveUp = vi.fn();
    whenShopifyReady(() => value, vi.fn(), { attempts: 3, intervalMs: 100, onGiveUp });
    value = 'bus';
    vi.advanceTimersByTime(10_000);
    expect(onGiveUp).not.toHaveBeenCalled();
  });

  it('cancels a pending poll', () => {
    let value: string | null = null;
    const callback = vi.fn();
    const cancel = whenShopifyReady(() => value, callback);

    cancel();
    value = 'bus';
    vi.advanceTimersByTime(5_000);
    expect(callback).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does nothing on the server', () => {
    vi.stubGlobal('window', undefined);
    const select = vi.fn(() => 'bus');
    const callback = vi.fn();
    expect(whenShopifyReady(select, callback)).toBeTypeOf('function');
    expect(select).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('selectors', () => {
  it('read nothing until the runtime piece exists', () => {
    vi.stubGlobal('window', {});
    expect(getAnalyticsBus()).toBeNull();
    expect(getOpenCartAction()).toBeUndefined();
    expect(getCustomerPrivacy()).toBeNull();
    expect(getUpdateCartAction()).toBeNull();
    expect(getActiveCurrency()).toBeUndefined();
  });

  it('reads the active currency', () => {
    vi.stubGlobal('window', { Shopify: { currency: { active: 'USD' } } });
    expect(getActiveCurrency()).toBe('USD');
  });

  it('holds updateCart back until a cart store has configured it', () => {
    const updateCart = Object.assign(vi.fn(), { isDefault: (): boolean => true });
    vi.stubGlobal('window', { Shopify: { actions: { updateCart } } });
    expect(getUpdateCartAction()).toBeNull();
    updateCart.isDefault = () => false;
    expect(getUpdateCartAction()).toBe(updateCart);
  });

  it('read the pieces off window.Shopify', () => {
    const analytics = { publish: vi.fn() };
    const openCart = { configure: vi.fn() };
    const customerPrivacy = { analyticsProcessingAllowed: () => true };
    vi.stubGlobal('window', { Shopify: { analytics, actions: { openCart }, customerPrivacy } });
    expect(getAnalyticsBus()).toBe(analytics);
    expect(getOpenCartAction()).toBe(openCart);
    expect(getCustomerPrivacy()).toBe(customerPrivacy);
  });

  it('treats a Customer Privacy stub without its API as not arrived', () => {
    vi.stubGlobal('window', { Shopify: { customerPrivacy: {} } });
    expect(getCustomerPrivacy()).toBeNull();
  });
});
