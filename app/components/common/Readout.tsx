import { SPEC_LINE_CLASS } from '~/components/common/SpecLine';
import { cn } from '~/lib/cn';

/**
 * The file/HUD readout devices shared by the night-surface editorial pages
 * (athlete signings, Our Story). Promoted out of AthleteSigning verbatim once
 * Our Story became the second consumer. Both assume a `field-night` ground.
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
