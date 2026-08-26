import { Container } from '~/components/common/Container';
import { Countdown } from '~/components/common/Countdown';
import { Heading } from '~/components/common/Heading';
import { LiveDot } from '~/components/common/LiveDot';
import { MediaSlot } from '~/components/common/MediaSlot';
import { SpecLine } from '~/components/common/SpecLine';
import { WaitlistForm } from '~/components/common/WaitlistForm';
import { FIRST_LIGHT } from '~/content/first-light';

/** Boxed mono field — the mock's bordered NAME/EMAIL inputs (caps live in
    the placeholder pseudo-element, so typed values stay as entered). h-9
    matches the Button default height exactly and m-0 clears the base
    layer's stray input margins (see common-pitfalls.md), so the boxes and
    the SIGN UP CTA read as one row. */
const fieldClass =
  'm-0 block h-9 w-full rounded-none border border-ink bg-transparent px-4 font-mono text-xs tracking-spec text-ink placeholder:text-ink placeholder:uppercase focus:ring-1 focus:ring-ink focus:outline-none';

/**
 * The Early Access signup — the shared drop-waitlist form (one list, two
 * doors with the homepage dialog) in the mock's boxed-mono, single-row
 * treatment. max-w-none opts the row out of the base layer's
 * form { max-width: 400px } cap.
 */
const EarlyAccessForm = () => (
  <WaitlistForm
    copy={FIRST_LIGHT.earlyAccess}
    className="mt-6 grid max-w-none grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
    fieldClassName={fieldClass}
    successClassName="mt-6 text-sm font-medium text-ink"
    ctaVariant="brand"
  />
);

/** Ember eyebrow dot + edition line, then the page headline and intro. */
const Intro = () => (
  <Container className="pt-10 pb-8 md:pt-14 md:pb-10">
    <SpecLine className="flex items-center gap-3 text-sm text-ink">
      {/* The mock pairs the Ember live signal with the SIGN UP CTA below. */}
      <LiveDot />
      {FIRST_LIGHT.eyebrow}
    </SpecLine>
    <Heading as="h1" size="none" className="mt-4 text-5xl md:text-6xl">
      {FIRST_LIGHT.headline}
    </Heading>
    <p className="mt-5 max-w-[70ch] text-sm leading-relaxed text-support">{FIRST_LIGHT.intro}</p>
  </Container>
);

/** Heading + signup on the left, tall portrait panel on the right. */
const EarlyAccess = () => (
  <Container className="py-10 md:py-14">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] md:gap-12">
      <div>
        <Heading as="h2" size="none" className="text-4xl md:text-6xl">
          {FIRST_LIGHT.earlyAccess.heading}
        </Heading>
        <p className="mt-3 text-sm text-support">{FIRST_LIGHT.earlyAccess.body}</p>
        <EarlyAccessForm />
      </div>
      <MediaSlot media={FIRST_LIGHT.earlyAccess.media} ratio="portrait" />
    </div>
  </Container>
);

/**
 * Full-bleed 4-up strip. gap-px over a bg-ink wrapper draws the mock's
 * hairlines between cells in one device that survives the 2-col mobile wrap
 * (a divide-x would put a stray border at the row edge).
 */
const Lookbook = () => {
  // The strip is locked at four cells in the mock — explicit siblings, so the
  // identical placeholder objects don't need manufactured list keys.
  const [first, second, third, fourth] = FIRST_LIGHT.lookbook;
  return (
    <div className="grid grid-cols-2 gap-px border-y border-ink bg-ink md:grid-cols-4">
      <MediaSlot media={first} ratio="portrait" />
      <MediaSlot media={second} ratio="portrait" />
      <MediaSlot media={third} ratio="portrait" />
      <MediaSlot media={fourth} ratio="portrait" />
    </div>
  );
};

const Proving = () => (
  <Container className="py-10 md:py-16">
    <Heading as="h2" size="none" className="text-4xl md:text-6xl">
      {FIRST_LIGHT.proving.heading}
    </Heading>
    <p className="mt-3 max-w-[80ch] text-sm text-support">{FIRST_LIGHT.proving.body}</p>
  </Container>
);

/** Full-bleed backdrop with the countdown overlaid on its upper third. */
const CountdownSection = () => (
  <section className="relative">
    <MediaSlot media={FIRST_LIGHT.countdown.media} ratio="backdrop" />
    <div className="absolute inset-0 flex justify-center pt-16 md:pt-32">
      <Countdown
        dropIso={FIRST_LIGHT.countdown.dropIso}
        labels={FIRST_LIGHT.countdown.labels}
        size="xl"
      />
    </div>
  </section>
);

/**
 * The Drop 02 "FIRST LIGHT" teaser page (/drops/first-light), mock order:
 * intro → full-bleed hero → Early Access signup → lookbook strip → Proving
 * the Performance → countdown backdrop.
 */
export const FirstLightTeaser = () => (
  <div>
    <Intro />
    <MediaSlot media={FIRST_LIGHT.heroMedia} ratio="hero" loading="eager" />
    <EarlyAccess />
    <Lookbook />
    <Proving />
    <CountdownSection />
  </div>
);
