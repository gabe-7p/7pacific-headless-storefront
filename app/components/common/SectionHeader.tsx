import { Heading } from '~/components/common/Heading';

/** Live subtitle: 12px, 17.6px on desktop. */
const SUBTITLE = 'mt-2 text-xs text-support xl:text-[1.1rem]';

/**
 * Section-header scales from the brand type table (the +0.01em tracking comes
 * from Heading's brand variant). Pick the one matching the surface instead of
 * overriding sizes at the call site.
 */
const SCALES = {
  /** Homepage sections — 48px, 60px on desktop. */
  section: { variant: 'brand', heading: 'text-5xl leading-[1.05] xl:text-6xl', subtitle: SUBTITLE },
  /** Every PDP section heading — Product Details, Tech Stack, and
      Recommendations all share this flat 30px so the page reads as one scale. */
  panel: { variant: 'brand', heading: 'text-3xl leading-[1.2]', subtitle: SUBTITLE },
  /** Drop pages — Heading's campaign face, 30px, 56px from md. */
  campaign: {
    variant: 'campaign',
    heading: 'text-3xl leading-[1.15] md:text-[3.5rem] md:leading-[1.1]',
    subtitle: 'mt-2.5 max-w-xl text-sm leading-relaxed text-support md:mt-3',
  },
} as const;

type SectionHeaderProps = {
  heading: string;
  subtitle?: string;
  scale: keyof typeof SCALES;
  className?: string;
};

/**
 * Section header: display-scale heading plus optional muted subtitle. It carries
 * no outer margin; the caller owns the spacing below it through `className`.
 */
export const SectionHeader = ({ heading, subtitle, scale, className }: SectionHeaderProps) => {
  const { variant, heading: headingClass, subtitle: subtitleClass } = SCALES[scale];
  return (
    <div className={className}>
      <Heading as="h2" size="none" variant={variant} className={headingClass}>
        {heading}
      </Heading>
      {subtitle ? <p className={subtitleClass}>{subtitle}</p> : null}
    </div>
  );
};
