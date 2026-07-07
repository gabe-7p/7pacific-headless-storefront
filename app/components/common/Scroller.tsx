import type { ReactNode } from 'react';

import { cn } from '~/lib/cn';

/**
 * Horizontal snap-scroller that shows three items per view on desktop and
 * ~1.2 on mobile (next item peeks), scrolling for any overflow. Children size
 * themselves; the scroller just lays them out.
 */
export const Scroller = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={cn(
      'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2',
      '[&>*]:shrink-0 [&>*]:snap-start [&>*]:basis-[78%] sm:[&>*]:basis-[45%] lg:[&>*]:basis-[calc((100%-2rem)/3)]',
      className
    )}
  >
    {children}
  </div>
);
