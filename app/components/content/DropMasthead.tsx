import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { LiveEyebrow } from '~/components/common/LiveDot';
import { SpecLine } from '~/components/common/SpecLine';
import { cn } from '~/lib/cn';

/** The copy a drop's masthead renders (`BASELINE_DROP`, `FIRST_LIGHT_MASTHEAD`). */
export type DropMastheadContent = {
  eyebrow: string;
  headline: string;
  status: string;
  intro: string;
  dropLink: { label: string; href: string };
};

/**
 * A drop's masthead: the live edition eyebrow, the headline with its status,
 * the intro and an outline CTA out to the drop's editorial page. Shared by the
 * /drops/baseline page and the drop collection pages (/collections/baseline,
 * /collections/first-light) so every entry point opens on the same block.
 * `withDropLink` adds the CTA — set on the collection pages, left off on a
 * drop page (it would link to itself). `className` merges over the padding
 * (a collection banner above it takes a tighter top).
 */
export const DropMasthead = ({
  drop,
  withDropLink = false,
  withStatus = true,
  className,
}: {
  drop: DropMastheadContent;
  withDropLink?: boolean;
  /** The LIVE NOW status after the headline (under it on mobile); the collection pages drop it. */
  withStatus?: boolean;
  className?: string;
}) => (
  <Container className={cn('pt-8 pb-6 md:pt-14 md:pb-10', className)}>
    {/* Tighter than the spec strip's 0.1em. `!` because `cn` doesn't merge the
        brand tracking tokens and `tracking-spec` emits last, so a plain
        `tracking-product` would lose (common-pitfalls.md, Tailwind traps). */}
    <LiveEyebrow className="tracking-product!">{drop.eyebrow}</LiveEyebrow>
    <Heading
      as="h1"
      size="none"
      className="mt-3 text-[2.5rem] leading-none tracking-hero md:mt-4 md:text-5xl"
    >
      {drop.headline}
      {withStatus && <span className="hidden md:inline">{`\u2002·\u2002${drop.status}`}</span>}
    </Heading>
    {withStatus && <SpecLine className="mt-2 text-base text-ink md:hidden">{drop.status}</SpecLine>}
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-support md:mt-5">{drop.intro}</p>
    {withDropLink && (
      // Outline tier, not `brand`: buying is the collection page's primary
      // action, so the editorial detour stays the quieter of the two.
      <Cta to={drop.dropLink.href} prefetch="intent" size="xs" className="mt-6 md:mt-7">
        {drop.dropLink.label}
      </Cta>
    )}
  </Container>
);
