import { cn } from '~/lib/cn';
import { formatEditionLabel } from '~/lib/product/display';

/**
 * The edition-number device: `ED. 01 · LIVE`. Renders nothing without a number.
 */
export const EditionTag = ({
  number,
  status,
  className,
}: {
  number?: string | null;
  status?: string | null;
  className?: string;
}) => {
  const label = formatEditionLabel(number, status);
  if (!label) return null;
  return (
    <span
      className={cn(
        'font-mono text-xs font-medium tracking-caps uppercase text-support',
        className
      )}
    >
      {label}
    </span>
  );
};
