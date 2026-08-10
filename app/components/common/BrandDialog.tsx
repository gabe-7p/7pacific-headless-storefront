import type { ReactNode } from 'react';

import { Heading } from '~/components/common/Heading';
import { DialogContent, DialogTitle } from '~/components/ui/dialog';
import { cn } from '~/lib/cn';

/**
 * The night-tier dialog shell shared by the newsletter and waitlist modals:
 * Carbon panel, night hairline border, and live's 2px brand radius.
 *
 * Width must be overridden on the `sm:` variant — the primitive ships
 * `sm:max-w-lg`, which a bare `max-w-*` can't beat (different variant, so
 * tailwind-merge keeps both and the sm one wins).
 */
export const BrandDialogContent = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <DialogContent
    className={cn(
      'bg-field-night text-ink-night rounded-[2px] border-border-subtle-night',
      className
    )}
  >
    {children}
  </DialogContent>
);

/** Dialog title rendered through `Heading`, keeping Radix's aria wiring. */
export const BrandDialogTitle = ({ children }: { children: ReactNode }) => (
  <DialogTitle asChild>
    <Heading as="h2" size="none" className="tracking-header text-2xl">
      {children}
    </Heading>
  </DialogTitle>
);
