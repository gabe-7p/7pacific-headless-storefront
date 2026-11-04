import type { ReactNode } from 'react';

import { Heading } from '~/components/common/Heading';
import { DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog';
import { cn } from '~/lib/cn';

/**
 * The night-tier dialog shell shared by the `JoinDialog`'s two panels:
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
      'bg-field-night text-ink-night rounded-brand border-border-subtle-night',
      className
    )}
  >
    {children}
  </DialogContent>
);

/**
 * Dialog title rendered through `Heading`, keeping Radix's aria wiring. `asChild`
 * hands `DialogTitle`'s `leading-none` to `Heading` as a className, where it would
 * outrank the variant's leading, so the brand value is restated here.
 */
export const BrandDialogTitle = ({ children }: { children: ReactNode }) => (
  <DialogTitle asChild>
    <Heading as="h2" size="none" className="text-2xl leading-[1.1]">
      {children}
    </Heading>
  </DialogTitle>
);

/** The line under a night dialog's title, keeping Radix's aria wiring. */
export const BrandDialogDescription = ({ children }: { children: ReactNode }) => (
  <DialogDescription className="mt-3 text-sm text-support-night">{children}</DialogDescription>
);
