import { BRAND } from '~/lib/brand';
import { cn } from '~/lib/cn';

/** The brand wordmark. Text comes from BRAND.wordmark (single source). */
export const Logo = ({ className }: { className?: string }) => (
  <span className={cn('font-bold tracking-[0.25em] uppercase select-none', className)}>
    {BRAND.wordmark}
  </span>
);
