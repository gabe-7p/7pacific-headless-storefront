// @vitest-environment jsdom
import { type CartState, createEmptyCartErrors, EMPTY_CART_STATE } from '@shopify/hydrogen';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartMain } from '~/components/cart/CartMain';
import { Aside } from '~/components/layout/Aside';
import { MICROCOPY } from '~/content/microcopy';
import type { CartData, CartLine } from '~/lib/cart';

// The cart store is mocked at the hook boundary: `useCart(selector)` reads a
// fixture state the test sets, `useCartForm` returns inert form bindings.
let state: CartState<CartData>;

vi.mock('~/lib/cart', () => ({
  useCart: (selector: (current: CartState<CartData>) => unknown) => selector(state),
  useCartForm: () => ({
    formProps: () => ({}),
    register: (field: string, options: { value?: string | number } = {}) => ({
      name: field,
      ...(options.value !== undefined ? { value: options.value, readOnly: true } : {}),
    }),
  }),
}));

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

const line = (id: string, title: string): CartLine =>
  ({
    id,
    quantity: 1,
    cost: { totalAmount: { amount: '79.0', currencyCode: 'USD' } },
    merchandise: {
      id: 'gid://shopify/ProductVariant/1',
      title: 'M',
      selectedOptions: [{ name: 'Size', value: 'M' }],
      product: { handle: 'airrail-6-performance-shorts-midnight', title },
    },
  }) as CartLine;

const cartState = (data: Partial<CartData>): CartState<CartData> => ({
  ...EMPTY_CART_STATE,
  data: {
    ...EMPTY_CART_STATE.data,
    checkoutUrl: 'https://checkout.example/c/abc',
    cost: { subtotalAmount: { amount: '79.0', currencyCode: 'USD' } },
    ...data,
  } as CartData,
  pending: { lines: new Set(), discountCodes: new Set(), note: false, attributes: false },
  errors: createEmptyCartErrors(),
  revalidating: false,
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
    state = cartState({ lines: { nodes: [] }, totalQuantity: 0 });
    renderCart('aside');
    expect(screen.getByText(MICROCOPY.emptyCart)).toBeTruthy();
    expect(screen.getByRole('link', { name: /shop the drop/i })).toBeTruthy();
    expect(screen.queryByText('Subtotal')).toBeNull();
  });

  it('renders the line list and the summary when the cart has lines', () => {
    state = cartState({
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
    state = cartState({
      lines: { nodes: [line('gid://shopify/CartLine/1', 'TRACEFIBER TEE')] },
      totalQuantity: 0,
    });
    renderCart('aside');
    expect(screen.getByText('TRACEFIBER TEE')).toBeTruthy();
    expect(screen.queryByText('Subtotal')).toBeNull();
  });
});
