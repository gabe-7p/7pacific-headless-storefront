import { Heading } from '~/components/common/Heading';
import { cn } from '~/lib/cn';

/**
 * Section-header scales from the brand type table (36–48px, +0.01em, lh 1.1 —
 * the tracking comes from Heading's brand variant). Pick the one matching the
 * surface instead of overriding sizes at the call site. `leading-` repeats
 * with each size because Tailwind's `text-*` utilities also set line-height.
 */
const SCALES = {
  /** Homepage sections — 48px, 60px on desktop. */
  section: 'text-5xl leading-[1.05] xl:text-6xl xl:leading-[1.05]',
  /** Every PDP section heading — Product Details, Tech Stack, and
      Recommendations all share this flat 30px so the page reads as one scale. */
  panel: 'text-3xl leading-[1.2]',
  /** Default display scale. */
  display: undefined,
} as const;

type SectionHeaderProps = {
  heading: string;
  subtitle?: string;
  align?: 'left' | 'center';
  scale?: keyof typeof SCALES;
  className?: string;
  /** Opt-in ember-wipe reveal: a brand block sweeps over the text width, then
      retreats to unveil it. Load-triggered — for above-the-fold titles only. */
  reveal?: boolean;
};

/**
 * Homepage-style section header — display-scale heading plus optional muted
 * subtitle. Single-sources the markup FirstDrop/CoreValues used to repeat.
 */
export const SectionHeader = ({
  heading,
  subtitle,
  align = 'left',
  scale = 'display',
  className,
  reveal = false,
}: SectionHeaderProps) => (
  <div className={cn('mb-8', align === 'center' && 'text-center', className)}>
    <Heading as="h2" size={scale === 'display' ? 'display' : 'none'} className={SCALES[scale]}>
      {reveal ? (
        // The outer span is inline-block so the inset-0 cover spans exactly
        // the text width; the text fades on an inner span because opacity on
        // the cover's own element would hide the ::after cover with it. Base
        // state (text visible, cover scale-x-0) is what motion-reduce users
        // get — the animations override it while running.
        <span className="relative inline-block after:absolute after:inset-0 after:origin-left after:scale-x-0 after:animate-title-wipe-cover after:bg-brand motion-reduce:after:animate-none">
          <span className="animate-title-wipe-text motion-reduce:animate-none">{heading}</span>
        </span>
      ) : (
        heading
      )}
    </Heading>
    {/* Live subtitle: 12px, 17.6px on desktop. */}
    {subtitle ? <p className="mt-2 text-xs text-support xl:text-[1.1rem]">{subtitle}</p> : null}
  </div>
);
