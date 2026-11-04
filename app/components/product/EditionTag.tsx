import { cn } from '~/lib/cn';
import { formatEditionLabel } from '~/lib/product/display';

/** `strip` drops into a card's mono spec strip, at that strip's size and tracking. */
const VARIANTS = {
  default: 'text-xs tracking-caps',
  strip: 'text-2xs tracking-spec',
} as const;

/**
 * The edition-number device: `ED. 01 · LIVE`. Renders nothing without a number.
 */
export const EditionTag = ({
  number,
  status,
  variant = 'default',
  className,
}: {
  number?: string | null;
  status?: string | null;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) => {
  const label = formatEditionLabel(number, status);
  if (!label) return null;
  return (
    <span
      className={cn('font-mono font-medium uppercase text-support', VARIANTS[variant], className)}
    >
      {label}
    </span>
  );
};
