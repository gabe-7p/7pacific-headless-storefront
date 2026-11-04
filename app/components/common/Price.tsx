import { cn } from '~/lib/cn';
import { formatPrice, type MoneyLike, type PriceFormat } from '~/lib/money';

type PriceVariant = PriceFormat;

/**
 * The one price element — every money value renders through it, in mono.
 * Formats live in lib/money.ts (`brand` / `compact` / `cart`).
 */
export const Price = ({
  data,
  variant = 'brand',
  className,
}: {
  data: MoneyLike | null | undefined;
  variant?: PriceVariant;
  className?: string;
}) => {
  const formatted = formatPrice(data, variant);
  if (formatted === null) return null;
  // `compact` inherits the mono face from the spec strip it sits in.
  return <span className={cn(variant !== 'compact' && 'font-mono', className)}>{formatted}</span>;
};
