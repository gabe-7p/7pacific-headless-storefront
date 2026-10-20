import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { LiveDot } from '~/components/common/LiveDot';
import { SpecLine } from '~/components/common/SpecLine';
import { BASELINE_DROP } from '~/content/baseline-drop';

/**
 * The BASELINE masthead: live dot + edition line, the headline (the status
 * line stacks under it on mobile, joins it inline from md), and the intro
 * paragraph.
 *
 * Shared by the /drops/baseline editorial page (where it sits above the drop
 * film) and the /collections/baseline shop-all page, so the two entry points
 * to the drop open on the same block — one owner for the copy and its scale.
 *
 * `withDropLink` adds the CTA out to /drops/baseline — set on the collection
 * page, where the build story is a click away, and left off on the drop page,
 * which would only be linking to itself.
 */
export const BaselineMasthead = ({ withDropLink = false }: { withDropLink?: boolean }) => (
  <Container className="pt-8 pb-6 md:pt-14 md:pb-10">
    <SpecLine className="flex items-center gap-3 text-sm text-ink">
      <LiveDot />
      {BASELINE_DROP.eyebrow}
    </SpecLine>
    <Heading
      as="h1"
      size="none"
      className="mt-3 text-[2.5rem] leading-none tracking-hero md:mt-4 md:text-6xl md:leading-none"
    >
      {BASELINE_DROP.headline}
      <span className="hidden md:inline">{`\u2002·\u2002${BASELINE_DROP.status}`}</span>
    </Heading>
    <SpecLine className="mt-2 text-base text-ink md:hidden">{BASELINE_DROP.status}</SpecLine>
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-support md:mt-5">
      {BASELINE_DROP.intro}
    </p>
    {withDropLink && (
      // Outline tier, not `brand`: buying is the collection page's primary
      // action, so the editorial detour stays the quieter of the two.
      <Cta to={BASELINE_DROP.dropLink.href} prefetch="intent" size="xs" className="mt-6 md:mt-7">
        {BASELINE_DROP.dropLink.label}
      </Cta>
    )}
  </Container>
);
