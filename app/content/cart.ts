/**
 * Cart copy — the drawer, the full-page cart and its line items read every
 * visible string from here.
 */
export const CART_COPY = {
  /** The drawer heading and the page `<h1>`. */
  title: 'Cart',
  /** The empty cart's CTA (also the Baseline drop closer's). */
  shopCta: 'Shop the drop',
  continueShopping: 'Continue shopping',
  disclaimer: 'Shipping, taxes, and discount codes calculated at checkout.',
  /** The applied-codes row label. */
  discountLabel: 'Discount(s)',
  /** The code input's label and placeholder. */
  discountPlaceholder: 'Discount code',
  /** A line whose product title is missing. */
  productFallback: 'Product',
} as const;
