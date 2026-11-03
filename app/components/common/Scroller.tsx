import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

/**
 * Items visible per view at each tier. `gap-4` (1rem) between items, so the
 * desktop basis subtracts (perView - 1) gaps before dividing. (A denser 4-up
 * tier served the PDP recommendations until they became a grid, Nov 2026 —
 * add it back here if a 4-up row returns.)
 */
const PER_VIEW = {
  /** Default: 3 across on desktop (PDP detail cards). */
  3: '[&>*]:basis-[78%] sm:[&>*]:basis-[45%] lg:[&>*]:basis-[calc((100%-2rem)/3)]',
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
