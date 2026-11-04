import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

/**
 * Horizontal snap-scroller. Children size themselves; the scroller just lays
 * them out, showing 3 items per view on desktop (`gap-4` between them, so
 * the basis subtracts two gaps before dividing) and a peeking partial item on
 * mobile so the row reads as scrollable.
 */
export const Scroller = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={cn(
      'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2',
      '[&>*]:shrink-0 [&>*]:snap-start',
      '[&>*]:basis-[78%] sm:[&>*]:basis-[45%] lg:[&>*]:basis-[calc((100%-2rem)/3)]',
      className
    )}
  >
    {children}
  </div>
);
