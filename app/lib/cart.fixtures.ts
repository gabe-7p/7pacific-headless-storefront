import { type CartState, createEmptyCartErrors, EMPTY_CART_STATE } from '@shopify/hydrogen';
import { vi } from 'vitest';

import type * as CartModule from '~/lib/cart';

type CartData = CartModule.CartData;
type CartLine = CartModule.CartLine;

/**
 * Test-only builders for the cart store: one complete, type-checked cart so a
 * change to Hydrogen's cart query fails here rather than hiding behind a cast
 * in each test file. Nothing outside `*.test.*` imports this.
 */

const usd = (amount: string) => ({ amount, currencyCode: 'USD' as const });

type CartLineOverrides = Partial<Pick<CartLine, 'id' | 'quantity' | 'cost'>> & {
  merchandise?: Partial<CartLine['merchandise']>;
};

export const buildCartLine = ({ merchandise, ...overrides }: CartLineOverrides = {}): CartLine => ({
  id: 'gid://shopify/CartLine/1',
  quantity: 1,
  attributes: [],
  sellingPlanAllocation: null,
  cost: {
    totalAmount: usd('79.0'),
    subtotalAmount: usd('79.0'),
    amountPerQuantity: usd('79.0'),
    compareAtAmountPerQuantity: null,
  },
  merchandise: {
    id: 'gid://shopify/ProductVariant/1',
    title: 'M',
    sku: 'AR6-MID-M',
    image: {
      id: 'gid://shopify/ProductImage/1',
      url: 'https://cdn.shopify.com/files/shorts-midnight.jpg',
      altText: null,
      width: 800,
      height: 800,
    },
    product: {
      id: 'gid://shopify/Product/1',
      title: 'AIRRAIL 6" PERFORMANCE SHORTS - MIDNIGHT',
      handle: 'airrail-6-performance-shorts-midnight',
      vendor: '7Pacific',
      productType: 'Shorts',
    },
    selectedOptions: [{ name: 'Size', value: 'M' }],
    ...merchandise,
  },
  ...overrides,
});

/** The cart-level totals, all at one amount. */
export const buildCartCost = (amount: string): CartData['cost'] => ({
  subtotalAmount: usd(amount),
  totalAmount: usd(amount),
  checkoutChargeAmount: usd(amount),
});

export const buildCartData = (overrides: Partial<CartData> = {}): CartData => ({
  ...EMPTY_CART_STATE.data,
  id: 'gid://shopify/Cart/abc',
  updatedAt: '2026-10-31T00:00:00Z',
  checkoutUrl: 'https://checkout.example/c/abc?key=123',
  totalQuantity: 1,
  note: null,
  attributes: [],
  cost: buildCartCost('79.0'),
  lines: { nodes: [] },
  discountCodes: [],
  ...overrides,
});

/** A nothing-in-flight `pending`, with fresh Sets so a test can't leak into the next. */
export const buildPending = (
  overrides: Partial<CartState<CartData>['pending']> = {}
): CartState<CartData>['pending'] => ({
  lines: new Set(),
  discountCodes: new Set(),
  note: false,
  attributes: false,
  ...overrides,
});

export const buildCartState = (
  data: Partial<CartData> = {},
  overrides: Partial<CartState<CartData>> = {}
): CartState<CartData> => ({
  ...EMPTY_CART_STATE,
  data: buildCartData(data),
  pending: buildPending(),
  errors: createEmptyCartErrors(),
  revalidating: false,
  ...overrides,
});

type RegisterOptions = { value?: string | number; defaultValue?: string };

/**
 * `vi.mock('~/lib/cart', …)`'s factory: the store mocked at the hook boundary.
 * `useCart(selector)` reads the state the test sets, `useCartForm` returns
 * inert form bindings, and the module's pure helpers stay real.
 */
export const createCartStoreMock = async (getState: () => CartState<CartData>) => ({
  ...(await vi.importActual<typeof CartModule>('~/lib/cart')),
  useCart: (selector: (state: CartState<CartData>) => unknown) => selector(getState()),
  useCartForm: () => ({
    formProps: () => ({}),
    register: (field: string, { value, defaultValue }: RegisterOptions = {}) => ({
      name: field,
      ...(value !== undefined ? { value, readOnly: true } : {}),
      ...(defaultValue !== undefined ? { defaultValue } : {}),
    }),
  }),
});
