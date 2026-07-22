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
}: SectionHeaderProps) => (
  <div className={cn('mb-8', align === 'center' && 'text-center', className)}>
    <Heading as="h2" size={scale === 'display' ? 'display' : 'none'} className={SCALES[scale]}>
      {heading}
    </Heading>
    {/* Live subtitle: 12px, 17.6px on desktop. */}
    {subtitle ? <p className="mt-2 text-xs text-support xl:text-[1.1rem]">{subtitle}</p> : null}
  </div>
);
