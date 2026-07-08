import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

/**
 * Brand price format — whole-dollar amount plus the currency code, e.g.
 * "$74 USD" (live's format). Single-sources the formatting so the PDP and
 * product cards stay consistent.
 *
 * Scope note: the CART deliberately does NOT use this — live's cart shows
 * plain "$74.00" (cents, no suffix), so CartSummary renders raw <Money>.
 */
export const Price = ({ data, className }: { data: MoneyV2; className?: string }) => (
  <span className={className}>
    <Money data={data} withoutTrailingZeros as="span" /> {data.currencyCode}
  </span>
);
