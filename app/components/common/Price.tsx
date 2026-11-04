import { cn } from '~/lib/cn';
import { formatPrice, type MoneyLike, type PriceFormat } from '~/lib/money';

type PriceVariant = PriceFormat;

/**
 * The one price element — every money value renders through it, in mono.
 * Formats live in lib/money.ts (`brand` / `compact` / `cart`). `compareAt` sets
 * the struck-through original beside the price.
 */
export const Price = ({
  data,
  compareAt,
  variant = 'brand',
  className,
}: {
  data: MoneyLike | null | undefined;
  compareAt?: MoneyLike | null;
  variant?: PriceVariant;
  className?: string;
}) => {
  const formatted = formatPrice(data, variant);
  if (formatted === null) return null;
  // `compact` inherits the mono face from the spec strip it sits in.
  const price = (
    <span className={cn(variant !== 'compact' && 'font-mono', className)}>{formatted}</span>
  );
  if (!compareAt) return price;
  return (
    <span className="flex gap-2">
      {price}
      <s className="text-support opacity-50">
        <Price data={compareAt} variant={variant} className={className} />
      </s>
    </span>
  );
};
