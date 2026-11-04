import type { ReactNode } from 'react';

import { SPEC_LINE_CLASS, SpecLine } from '~/components/common/SpecLine';
import { cn } from '~/lib/cn';

/**
 * The file/HUD readout devices. `SectionLabel` and `CornerBrackets` belong to the
 * night-surface editorial pages (athlete signings, Our Story) and assume a
 * `field-night` ground; `Caret` and `TypeOnReadout` work on either ground.
 */

/** Chapter label: display number, mono title, trailing hairline. */
export const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-3">
    <span className="font-display text-support-night text-2xl font-medium">{number}</span>
    <span className={cn(SPEC_LINE_CLASS, 'text-ink-night')}>{title}</span>
    <span aria-hidden className="ml-2 h-px w-16 bg-border-subtle-night md:w-24" />
  </div>
);

/** Four hairline corner marks; the parent must be `relative`. */
export const CornerBrackets = () => (
  <span aria-hidden>
    <span className="border-border-subtle/50 absolute top-0 left-0 size-3 border-t border-l" />
    <span className="border-border-subtle/50 absolute top-0 right-0 size-3 border-t border-r" />
    <span className="border-border-subtle/50 absolute bottom-0 left-0 size-3 border-b border-l" />
    <span className="border-border-subtle/50 absolute right-0 bottom-0 size-3 border-r border-b" />
  </span>
);

/**
 * The Ember insertion caret. Rests hidden: `animate-caret-blink` flicks it, and
 * `className` places it and sets what it does under reduced motion.
 */
export const Caret = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn('bg-brand animate-caret-blink h-[0.85em] w-0.5 opacity-0', className)}
  />
);

/**
 * A mono readout that types on like a GPS acquiring a fix. The caret lands after
 * the type-on (delay = its duration), flicks twice and rests hidden; `!` so
 * delay and count survive the animate-caret-blink shorthand (see ColorSwatches).
 * steps(30) in --animate-type-on ≈ the string's length, so keep them roughly in
 * sync if the copy changes.
 */
export const TypeOnReadout = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <SpecLine className={className}>
    <span className="animate-type-on inline-block motion-reduce:animate-none">{children}</span>
    <Caret className="ml-1 inline-block align-middle [animation-delay:0.6s]! [animation-iteration-count:2]! motion-reduce:hidden" />
  </SpecLine>
);
