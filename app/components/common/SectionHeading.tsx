import { Heading } from '~/components/common/Heading';
import { cn } from '~/lib/cn';

type SectionHeadingProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** 'center' (default) or 'left' (constrains width like the core-values block). */
  align?: 'center' | 'left';
  className?: string;
};

/**
 * Section title + optional subtitle — the repeated "heading over a section" block
 * (First Drop, Core Values, Related Products, …). Keeps the type scale and
 * spacing consistent in one place.
 */
export const SectionHeading = ({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) => (
  <div className={cn('mb-8', align === 'center' ? 'text-center' : 'max-w-2xl', className)}>
    <Heading as="h2" size="lg">
      {title}
    </Heading>
    {subtitle ? <p className="mt-2 text-sm text-neutral-600">{subtitle}</p> : null}
  </div>
);
