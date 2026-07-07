import { Heading } from '~/components/common/Heading';
import { cn } from '~/lib/cn';

type SectionHeaderProps = {
  heading: string;
  subtitle?: string;
  align?: 'left' | 'center';
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
  className,
}: SectionHeaderProps) => (
  <div className={cn('mb-8', align === 'center' && 'text-center', className)}>
    <Heading as="h2" size="display">
      {heading}
    </Heading>
    {subtitle ? <p className="mt-2 text-sm text-neutral-600">{subtitle}</p> : null}
  </div>
);
