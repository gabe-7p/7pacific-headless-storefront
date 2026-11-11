import { Container } from '~/components/common/Container';
import { Countdown } from '~/components/common/Countdown';
import { Heading } from '~/components/common/Heading';
import { JoinForm } from '~/components/common/JoinForm';
import { LiveEyebrow } from '~/components/common/LiveDot';
import { MediaSlot } from '~/components/common/MediaSlot';
import { FIRST_LIGHT } from '~/content/first-light';
import { FEATURE_FLAGS } from '~/content/flags';
import { IMAGE_SIZES } from '~/lib/imageSizes';

/** Boxed mono field — the mock's bordered NAME/EMAIL inputs (caps live in
    the placeholder pseudo-element, so typed values stay as entered). h-9
    matches the Button default height exactly, so the boxes and the SIGN UP
    CTA read as one row. */
const fieldClass =
  'block h-9 w-full border border-ink bg-transparent px-4 font-mono text-xs tracking-spec text-ink placeholder:text-ink placeholder:uppercase focus:ring-1 focus:ring-ink focus:outline-none';

/**
 * The Early Access signup — the shared `JoinForm` on the waitlist, inline row.
 */
const EarlyAccessForm = () => (
  <JoinForm
    list="waitlist"
    copy={FIRST_LIGHT.earlyAccess}
    noValidate
    className="mt-6 grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
    tone="day"
    fieldClassName={fieldClass}
    ctaVariant="brand"
  />
);

/** Ember eyebrow dot + edition line, then the page headline and intro. */
const Intro = () => (
  <Container className="pt-10 pb-8 md:pt-14 md:pb-10">
    {/* The mock pairs the Ember live signal with the SIGN UP CTA below. */}
    <LiveEyebrow>{FIRST_LIGHT.eyebrow}</LiveEyebrow>
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
      <MediaSlot media={FIRST_LIGHT.earlyAccess.media} ratio="portrait" sizes={IMAGE_SIZES.third} />
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
      <MediaSlot media={first} ratio="portrait" sizes={IMAGE_SIZES.quarter} />
      <MediaSlot media={second} ratio="portrait" sizes={IMAGE_SIZES.quarter} />
      <MediaSlot media={third} ratio="portrait" sizes={IMAGE_SIZES.quarter} />
      <MediaSlot media={fourth} ratio="portrait" sizes={IMAGE_SIZES.quarter} />
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

/** Full-bleed backdrop with the countdown overlaid near its top, in night
    type over the (dark) photo. From md the top pad is a share of the width
    (so it scales with the 16:9 box), keeping the athlete's head clear. */
const CountdownSection = () => (
  <section className="relative">
    <MediaSlot media={FIRST_LIGHT.countdown.media} ratio="backdrop" sizes={IMAGE_SIZES.full} />
    <div className="absolute inset-0 flex justify-center pt-16 md:pt-[4%]">
      <Countdown
        dropIso={FIRST_LIGHT.countdown.dropIso}
        labels={FIRST_LIGHT.countdown.labels}
        size="xl"
        tone="night"
      />
    </div>
  </section>
);

/**
 * The Drop 02 "FIRST LIGHT" teaser page (/drops/first-light), mock order:
 * intro → full-bleed hero → Early Access signup → lookbook strip → Proving
 * the Performance → countdown backdrop. The lookbook is toggled by
 * FEATURE_FLAGS.firstLightLookbook.
 */
export const FirstLightTeaser = () => (
  <div>
    <Intro />
    <MediaSlot
      media={FIRST_LIGHT.heroMedia}
      ratio="hero"
      sizes={IMAGE_SIZES.full}
      loading="eager"
    />
    <EarlyAccess />
    {FEATURE_FLAGS.firstLightLookbook && <Lookbook />}
    <Proving />
    <CountdownSection />
  </div>
);
