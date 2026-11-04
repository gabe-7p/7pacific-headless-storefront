// @vitest-environment jsdom
import { type CartState, createEmptyCartErrors, createEmptyErrorGroup } from '@shopify/hydrogen';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartLineItem } from '~/components/cart/CartLineItem';
import { Aside } from '~/components/layout/Aside';
import type { CartData, CartLine } from '~/lib/cart';
import { buildCartLine, buildCartState, buildPending } from '~/lib/cart.fixtures';

let state: CartState<CartData>;

vi.mock('~/lib/cart', async () =>
  (await import('~/lib/cart.fixtures')).createCartStoreMock(() => state)
);

const LINE_ID = 'gid://shopify/CartLine/1';

const line = (overrides: Parameters<typeof buildCartLine>[0] = {}) =>
  buildCartLine({
    quantity: 2,
    cost: { ...buildCartLine().cost, totalAmount: { amount: '158.0', currencyCode: 'USD' } },
    ...overrides,
  });

const renderLine = (item: CartLine, layout: 'page' | 'aside' = 'aside') =>
  render(
    <MemoryRouter>
      <Aside.Provider>
        <ul>
          <CartLineItem line={item} layout={layout} />
        </ul>
      </Aside.Provider>
    </MemoryRouter>
  );

afterEach(cleanup);

describe('CartLineItem', () => {
  it('renders the title, selected options, cart-format price and quantity', () => {
    state = buildCartState();
    renderLine(line());
    // Both the image and the title link to the variant on the PDP.
    const links = screen.getAllByRole('link', { name: 'AIRRAIL 6" PERFORMANCE SHORTS - MIDNIGHT' });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link.getAttribute('href')).toBe(
        '/products/airrail-6-performance-shorts-midnight?Size=M'
      );
    }
    expect(screen.getByText('Size:').parentElement?.textContent).toBe('Size: M');
    // Cart format: cents, no currency code (the PDP's "$158 USD" is the brand format).
    expect(screen.getByText('$158.00')).toBeTruthy();
    expect(screen.getByLabelText<HTMLInputElement>('Quantity').value).toBe('2');
  });

  it('enables the stepper and remove control for a confirmed line', () => {
    state = buildCartState();
    renderLine(line());
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Decrease quantity' }).disabled
    ).toBe(false);
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Increase quantity' }).disabled
    ).toBe(false);
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Remove' }).disabled).toBe(false);
  });

  it('labels the decrease step as a removal at quantity 1', () => {
    state = buildCartState();
    renderLine(line({ quantity: 1 }));
    expect(screen.getByRole('button', { name: 'Remove item' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Decrease quantity' })).toBeNull();
  });

  it('disables every control on a line the server has not confirmed (optimistic: id)', () => {
    state = buildCartState();
    renderLine(line({ id: 'optimistic:abc' }));
    for (const name of ['Decrease quantity', 'Increase quantity', 'Remove']) {
      expect(screen.getByRole<HTMLButtonElement>('button', { name }).disabled).toBe(true);
    }
    expect(screen.getByLabelText<HTMLInputElement>('Quantity').disabled).toBe(true);
  });

  it('marks the line busy while its change is in flight', () => {
    state = buildCartState({}, { pending: buildPending({ lines: new Set([LINE_ID]) }) });
    const { container } = renderLine(line());
    // The outer <li> is the line; the selected options render their own list inside it.
    expect(container.querySelector('li')?.getAttribute('aria-busy')).toBe('true');
  });

  it('surfaces the line error the store recorded', () => {
    const errors = createEmptyCartErrors();
    errors.lines.set(LINE_ID, {
      ...createEmptyErrorGroup(),
      userErrors: [{ code: null, message: 'Only 1 left in stock.' }],
    });
    state = buildCartState({}, { errors });
    renderLine(line());
    expect(screen.getByRole('alert').textContent).toBe('Only 1 left in stock.');
    expect(screen.getByLabelText('Quantity').getAttribute('aria-invalid')).toBe('true');
  });
});
