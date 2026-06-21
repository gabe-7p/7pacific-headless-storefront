import { cn } from '~/lib/cn';

/** The PACIFIC wordmark. Single source for the brand logotype. */
export const Logo = ({ className }: { className?: string }) => (
  <span className={cn('font-bold tracking-[0.25em] uppercase select-none', className)}>
    Pacific
  </span>
);
