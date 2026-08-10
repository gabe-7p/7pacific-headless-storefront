import { useId } from 'react';
import { useFetcher } from 'react-router';

import { Container } from '~/components/common/Container';
import { Countdown } from '~/components/common/Countdown';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { MediaSlot } from '~/components/common/MediaSlot';
import { FIRST_LIGHT } from '~/content/first-light';
import type { WaitlistResponse } from '~/routes/api.waitlist';

/** Boxed mono field — the mock's bordered NAME/EMAIL inputs (caps live in
    the placeholder pseudo-element, so typed values stay as entered). */
const fieldClass =
  'w-full rounded-none border border-ink bg-transparent px-4 py-3 font-mono text-xs tracking-spec text-ink placeholder:text-ink placeholder:uppercase focus:ring-1 focus:ring-ink focus:outline-none';

/**
 * The Early Access signup (name + email). Posts to the same /api/waitlist
 * endpoint as the homepage waitlist dialog — one list, two doors. On success
 * the form is replaced by the confirmation line.
 */
const EarlyAccessForm = () => {
  const fetcher = useFetcher<WaitlistResponse>();
  const nameId = useId();
  const emailId = useId();
  const submitting = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const errors = fetcher.data?.ok === false ? fetcher.data.errors : undefined;
  const { namePlaceholder, emailPlaceholder, submitLabel, successMessage } =
    FIRST_LIGHT.earlyAccess;

  if (succeeded) {
    return <p className="mt-6 text-sm font-medium text-ink">{successMessage}</p>;
  }

  return (
    <fetcher.Form
      method="post"
      action="/api/waitlist"
      noValidate
      // max-w-none opts out of the base layer's form { max-width: 400px } cap.
      className="mt-6 grid max-w-none grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
    >
      <div>
        <label htmlFor={nameId} className="sr-only">
          {namePlaceholder}
        </label>
        <input
          id={nameId}
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder={namePlaceholder}
          className={fieldClass}
        />
        {errors?.name && <p className="mt-1 text-xs text-support">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={emailId} className="sr-only">
          {emailPlaceholder}
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={emailPlaceholder}
          className={fieldClass}
        />
        {errors?.email && <p className="mt-1 text-xs text-support">{errors.email}</p>}
      </div>
      <Cta type="submit" variant="brand" disabled={submitting}>
        {submitLabel}
      </Cta>
    </fetcher.Form>
  );
};

/** Ember eyebrow dot + edition line, then the page headline and intro. */
const Intro = () => (
  <Container className="pt-10 pb-8 md:pt-14 md:pb-10">
    <p className="flex items-center gap-3 font-mono text-sm tracking-spec text-ink uppercase">
      {/* bg-brand dot — the mock pairs the Ember accent with the SIGN UP CTA
          below. The radar ping says "signal live" while the countdown runs;
          the dot itself never moves, and the ring sits out under
          motion-reduce. */}
      <span aria-hidden className="relative size-2.5 shrink-0">
        <span className="animate-radar-ping border-brand absolute inset-0 rounded-full border motion-reduce:hidden" />
        <span className="bg-brand absolute inset-0 rounded-full" />
      </span>
      {FIRST_LIGHT.eyebrow}
    </p>
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
