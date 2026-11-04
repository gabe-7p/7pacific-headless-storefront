// @vitest-environment jsdom
import type { CartState } from '@shopify/hydrogen';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartMain } from '~/components/cart/CartMain';
import { Aside } from '~/components/layout/Aside';
import { MICROCOPY } from '~/content/microcopy';
import type { CartData } from '~/lib/cart';
import { buildCartLine, buildCartState } from '~/lib/cart.fixtures';

// The cart store is mocked at the hook boundary: `useCart(selector)` reads a
// fixture state the test sets, `useCartForm` returns inert form bindings.
let state: CartState<CartData>;

vi.mock('~/lib/cart', async () =>
  (await import('~/lib/cart.fixtures')).createCartStoreMock(() => state)
);

vi.mock('@posthog/react', () => ({ usePostHog: () => ({ capture: vi.fn() }) }));

// The empty state's CTA prefetches on viewport entry; jsdom has no observer.
vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);

const line = (id: string, title: string) =>
  buildCartLine({
    id,
    merchandise: {
      product: { ...buildCartLine().merchandise.product, title },
    },
  });

const renderCart = (layout: 'page' | 'aside') =>
  render(
    <MemoryRouter>
      <Aside.Provider>
        <CartMain layout={layout} />
      </Aside.Provider>
    </MemoryRouter>
  );

afterEach(cleanup);

describe('CartMain', () => {
  it('renders the locked empty-cart microcopy and a shop link when there are no lines', () => {
    state = buildCartState({ lines: { nodes: [] }, totalQuantity: 0 });
    renderCart('aside');
    expect(screen.getByText(MICROCOPY.emptyCart)).toBeTruthy();
    expect(screen.getByRole('link', { name: /shop the drop/i })).toBeTruthy();
    expect(screen.queryByText('Subtotal')).toBeNull();
  });

  it('renders the line list and the summary when the cart has lines', () => {
    state = buildCartState({
      lines: { nodes: [line('gid://shopify/CartLine/1', 'AIRRAIL 6" PERFORMANCE SHORTS')] },
      totalQuantity: 1,
    });
    renderCart('page');
    expect(screen.getByRole('list', { name: 'Line items' })).toBeTruthy();
    expect(screen.getByText('AIRRAIL 6" PERFORMANCE SHORTS')).toBeTruthy();
    expect(screen.getByText('Subtotal')).toBeTruthy();
    expect(screen.queryByText(MICROCOPY.emptyCart)).toBeNull();
  });

  it('hides the summary while an optimistic removal still renders the line at quantity 0', () => {
    state = buildCartState({
      lines: { nodes: [line('gid://shopify/CartLine/1', 'TRACEFIBER TEE')] },
      totalQuantity: 0,
    });
    renderCart('aside');
    expect(screen.getByText('TRACEFIBER TEE')).toBeTruthy();
    expect(screen.queryByText('Subtotal')).toBeNull();
  });
});
