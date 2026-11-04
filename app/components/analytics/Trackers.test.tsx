// @vitest-environment jsdom
import type { CartState } from '@shopify/hydrogen';
import { render, renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  MetaPixelBridge as MetaPixelBridgeComponent,
  useCartViewed as UseCartViewed,
} from '~/components/analytics/Trackers';
import type { CartData } from '~/lib/cart';
import { buildCartState } from '~/lib/cart.fixtures';
import { NonceProvider } from '~/lib/nonce';

let state: CartState<CartData>;

vi.mock('~/lib/cart', async () =>
  (await import('~/lib/cart.fixtures')).createCartStoreMock(() => state)
);

describe('MetaPixelBridge', () => {
  let addDestination: ReturnType<typeof vi.fn>;
  let MetaPixelBridge: typeof MetaPixelBridgeComponent;

  beforeEach(async () => {
    vi.resetModules();
    addDestination = vi.fn(() => () => {});
    window.Shopify = {
      analytics: { addDestination, publish: vi.fn(), getConfig: vi.fn() },
    } as never;
    ({ MetaPixelBridge } = await import('~/components/analytics/Trackers'));
  });

  afterEach(() => {
    delete (window as { Shopify?: unknown }).Shopify;
  });

  it('adds no destination when the pixel is off', () => {
    render(
      <NonceProvider value="abc">
        <MetaPixelBridge pixelId={null} />
      </NonceProvider>
    );
    expect(addDestination).not.toHaveBeenCalled();
  });

  it('adds the destination once, even under Strict Mode', () => {
    render(
      <StrictMode>
        <NonceProvider value="abc">
          <MetaPixelBridge pixelId="123" />
        </NonceProvider>
      </StrictMode>
    );
    expect(addDestination).toHaveBeenCalledTimes(1);
    expect(addDestination.mock.calls[0]?.[0]).toMatchObject({ name: 'meta-pixel' });
  });
});

describe('useCartViewed', () => {
  let publish: ReturnType<typeof vi.fn>;
  let useCartViewed: typeof UseCartViewed;

  const renderViewed = (active: boolean, options: { strict?: boolean } = {}) =>
    renderHook((props: { active: boolean }) => useCartViewed(props.active), {
      initialProps: { active },
      wrapper: options.strict ? StrictMode : undefined,
    });

  beforeEach(async () => {
    vi.resetModules();
    publish = vi.fn();
    state = buildCartState({ id: 'gid://shopify/Cart/first' });
    window.Shopify = { analytics: { publish } } as never;
    ({ useCartViewed } = await import('~/components/analytics/Trackers'));
  });

  afterEach(() => {
    delete (window as { Shopify?: unknown }).Shopify;
  });

  it('publishes nothing while inactive', () => {
    renderViewed(false);
    expect(publish).not.toHaveBeenCalled();
  });

  it('publishes once when active from the first render (a /cart visit)', () => {
    renderViewed(true);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish.mock.calls[0]?.[0]).toBe('cart_viewed');
  });

  it('publishes once under Strict Mode', () => {
    renderViewed(true, { strict: true });
    expect(publish).toHaveBeenCalledTimes(1);
  });

  it('does not republish on a cart change while active', () => {
    const { rerender } = renderViewed(true);
    state = buildCartState({ totalQuantity: 5 });
    rerender({ active: true });
    expect(publish).toHaveBeenCalledTimes(1);
  });

  it('publishes again on each rising edge, with the latest cart', () => {
    const { rerender } = renderViewed(false);
    rerender({ active: true });
    rerender({ active: false });
    state = buildCartState({ id: 'gid://shopify/Cart/second' });
    rerender({ active: true });
    expect(publish).toHaveBeenCalledTimes(2);
    expect(publish.mock.calls[1]?.[1]).toMatchObject({ cart: { id: 'gid://shopify/Cart/second' } });
  });
});
