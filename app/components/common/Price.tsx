import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

import { cn } from '~/lib/cn';

/**
 * Brand price format — whole-dollar amount plus the currency code, e.g.
 * "$74 USD" (live's format), set in JetBrains Mono per the brand type rule
 * that numbers, prices, and specs always live in mono. Single-sources the
 * formatting so the PDP and product cards stay consistent.
 *
 * Scope note: the CART deliberately does NOT use this — live's cart shows
 * plain "$74.00" (cents, no suffix), so CartSummary renders raw <Money>
 * (with the mono face applied at the call site).
 */
export const Price = ({ data, className }: { data: MoneyV2; className?: string }) => (
  <span className={cn('font-mono', className)}>
    <Money data={data} withoutTrailingZeros as="span" /> {data.currencyCode}
  </span>
);
