import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

/**
 * Items visible per view at each tier. `gap-4` (1rem) between items, so the
 * desktop basis subtracts (perView - 1) gaps before dividing.
 */
const PER_VIEW = {
  /** Default: 3 across on desktop (PDP detail cards). */
  3: '[&>*]:basis-[78%] sm:[&>*]:basis-[45%] lg:[&>*]:basis-[calc((100%-2rem)/3)]',
  /** Denser: 4 across, for smaller cards (recommendations). */
  4: '[&>*]:basis-[62%] sm:[&>*]:basis-[38%] lg:[&>*]:basis-[calc((100%-3rem)/4)]',
} as const;

/**
 * Horizontal snap-scroller. Children size themselves; the scroller just lays
 * them out, showing `perView` items per view on desktop and a peeking partial
 * item on mobile so the row reads as scrollable.
 */
export const Scroller = ({
  children,
  className,
  perView = 3,
}: {
  children: ReactNode;
  className?: string;
  perView?: keyof typeof PER_VIEW;
}) => (
  <div
    className={cn(
      'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2',
      '[&>*]:shrink-0 [&>*]:snap-start',
      PER_VIEW[perView],
      className
    )}
  >
    {children}
  </div>
);
