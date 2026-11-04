// @vitest-environment jsdom
import type { CartState } from '@shopify/hydrogen';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartSummary } from '~/components/cart/CartSummary';
import type { CartData } from '~/lib/cart';
import { buildCartCost, buildCartState, buildPending } from '~/lib/cart.fixtures';

let state: CartState<CartData>;

vi.mock('~/lib/cart', async () =>
  (await import('~/lib/cart.fixtures')).createCartStoreMock(() => state)
);

vi.mock('@posthog/react', () => ({ usePostHog: () => ({ capture: vi.fn() }) }));

const CHECKOUT_URL = 'https://checkout.example/c/abc?key=123';

const cartState = (
  data: Partial<CartData> = {},
  overrides: Partial<CartState<CartData>> = {}
): CartState<CartData> =>
  buildCartState(
    {
      checkoutUrl: CHECKOUT_URL,
      totalQuantity: 2,
      cost: buildCartCost('158.0'),
      ...data,
    },
    overrides
  );

const renderSummary = (layout: 'page' | 'aside') =>
  render(
    <MemoryRouter>
      <CartSummary layout={layout} />
    </MemoryRouter>
  );

afterEach(cleanup);

describe('CartSummary', () => {
  it('renders the subtotal in cart format and the Checkout CTA at the checkout URL', () => {
    state = cartState();
    renderSummary('aside');
    expect(screen.getByText('Subtotal')).toBeTruthy();
    expect(screen.getByText('$158.00')).toBeTruthy();
    expect(screen.getByRole('link', { name: /checkout/i }).getAttribute('href')).toBe(CHECKOUT_URL);
  });

  it('renders no Checkout CTA without a checkout URL', () => {
    state = cartState({ checkoutUrl: '' });
    renderSummary('aside');
    expect(screen.queryByRole('link', { name: /checkout/i })).toBeNull();
  });

  it('shows the discount form on the cart page only', () => {
    state = cartState();
    renderSummary('page');
    expect(screen.getByRole('textbox', { name: 'Discount code' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeTruthy();
    cleanup();
    renderSummary('aside');
    expect(screen.queryByRole('textbox', { name: 'Discount code' })).toBeNull();
  });

  it('lists each applicable discount code with its remove control', () => {
    state = cartState({
      discountCodes: [
        { code: 'TEAM10', applicable: true },
        { code: 'EXPIRED', applicable: false },
      ],
    });
    renderSummary('page');
    expect(screen.getByText('TEAM10')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Remove discount TEAM10' })).toBeTruthy();
    expect(screen.queryByText('EXPIRED')).toBeNull();
  });

  it('reads the subtotal as pending while a line change is in flight', () => {
    state = cartState(
      {},
      {
        pending: buildPending({ lines: new Set(['gid://shopify/CartLine/1']) }),
      }
    );
    renderSummary('aside');
    const subtotal = screen.getByText('$158.00').parentElement;
    expect(subtotal?.className).toContain('opacity-50');
    expect(subtotal?.parentElement?.getAttribute('aria-busy')).toBe('true');
  });

  it('shows the subtotal at full strength when nothing is in flight', () => {
    state = cartState();
    renderSummary('aside');
    const subtotal = screen.getByText('$158.00').parentElement;
    expect(subtotal?.className).not.toContain('opacity-50');
    expect(subtotal?.parentElement?.getAttribute('aria-busy')).toBe('false');
  });
});
