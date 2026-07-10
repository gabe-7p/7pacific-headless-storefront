import { Heading } from '~/components/common/Heading';
import { cn } from '~/lib/cn';

/**
 * Live uses distinct scales for its section headings — pick the one matching
 * the surface instead of overriding sizes at the call site. `leading-` repeats
 * with each size because Tailwind's `text-*` utilities also set line-height.
 */
const SCALES = {
  /** Homepage sections — 40px, 64px on desktop. Live's tracking is a flat 1px. */
  section: 'text-[2.5rem] leading-[1.1] tracking-[1px] xl:text-[4rem]',
  /** Default display scale (PDP sections). */
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
    {subtitle ? <p className="mt-2 text-xs text-neutral-600 xl:text-[1.1rem]">{subtitle}</p> : null}
  </div>
);
