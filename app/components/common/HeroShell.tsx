import type { ReactNode } from 'react';

import { Container } from '~/components/common/Container';
import { cn } from '~/lib/cn';

/** How far the copy clears the header it sits under. */
const CLEARANCE = {
  sm: 'pt-[calc(var(--header-h)+1.5rem)]',
  lg: 'pt-[calc(var(--header-h)+4rem)]',
} as const;

/**
 * A full-bleed hero that starts under the header: the negative margin pulls it
 * up beneath the sticky bar, and `--hero-min-h` sets its floor. The announcement
 * bar above stays opaque.
 */
export const HeroShell = ({ className, children }: { className?: string; children: ReactNode }) => (
  <section
    className={cn(
      'relative -mt-(--header-h) flex min-h-(--hero-min-h) overflow-hidden md:min-h-(--hero-min-h-md)',
      className
    )}
  >
    {children}
  </section>
);

/** The copy column over a `HeroShell`'s media. */
export const HeroContent = ({
  clearance,
  className,
  children,
}: {
  clearance: keyof typeof CLEARANCE;
  className?: string;
  children: ReactNode;
}) => (
  // The clearance goes last: it must outrank a `py-*` passed through className.
  <Container className={cn('relative z-10 flex flex-col', className, CLEARANCE[clearance])}>
    {children}
  </Container>
);
