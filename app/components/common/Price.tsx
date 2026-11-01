import { Money } from '@shopify/hydrogen';
import type { ComponentProps } from 'react';

import { cn } from '~/lib/cn';

/** What Hydrogen's Money accepts: a (possibly partial) MoneyV2 — cart data is optimistic/partial. */
type PriceData = ComponentProps<typeof Money>['data'];

export type PriceVariant = 'brand' | 'compact' | 'cart';

/**
 * The one price element — every money value on the site renders through it,
 * in JetBrains Mono per the brand type rule that numbers, prices and specs
 * live in mono. Three formats, each matching the live surface it replaced:
 *
 * - `brand`   — "$74 USD": whole dollars + currency code (PDP price).
 * - `compact` — "$74": whole dollars, no code (the product card's mono strip).
 * - `cart`    — "$74.00": cents, no code (cart lines and subtotal).
 */
export const Price = ({
  data,
  variant = 'brand',
  className,
}: {
  data: PriceData;
  variant?: PriceVariant;
  className?: string;
}) => {
  if (variant === 'cart') return <Money data={data} as="span" className={className} />;
  if (variant === 'compact') {
    // Inherits the mono face from the spec strip it sits in — no wrapper.
    return <Money data={data} withoutTrailingZeros as="span" className={className} />;
  }
  return (
    <span className={cn('font-mono', className)}>
      <Money data={data} withoutTrailingZeros as="span" /> {data.currencyCode}
    </span>
  );
};
