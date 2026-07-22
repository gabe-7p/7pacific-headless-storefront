import { Image } from '@shopify/hydrogen';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { HOME_HERO } from '~/content/home';

/**
 * Full-bleed homepage hero. Structure per the drop-01 mockup (Gabe,
 * 2026-07-21): mono spec-strip eyebrow, the locked ≤8-word ALL-CAPS headline
 * (7PA-232, unchanged), a filled + text CTA pair, and two mono spec lines
 * (coordinates, location/time). Deliberate deviations from 7PA-232: two CTAs
 * instead of one and no subline — the secondary renders in chalk, so the
 * page's one Ember moment is still the primary CTA alone. Sits under the
 * transparent overlay header. The photograph itself is replaced by the
 * photography program (7PA-236/237).
 */
export const Hero = () => (
  // -mt pulls the hero up beneath the sticky header (transparent overlay);
  // the announcement bar above it stays opaque.
  <section className="bg-carbon relative -mt-(--header-h) flex min-h-[34rem] items-center overflow-hidden text-court md:min-h-[44rem]">
    <Image
      src={HOME_HERO.backgroundImage.url}
      width={HOME_HERO.backgroundImage.width}
      height={HOME_HERO.backgroundImage.height}
      alt=""
      sizes="100vw"
      loading="eager"
      fetchPriority="high"
      className="absolute inset-0 size-full object-cover"
    />
    {/* Live's .custom-hero-overlay verbatim: a flat rgba(0,0,0,0.10) wash over
        the whole frame, nothing graded. pointer-events-none so it never eats a
        click meant for the CTA beneath it. */}
    <div className="pointer-events-none absolute inset-0 bg-black/10" />
    <Container className="relative z-10 flex flex-col items-start gap-5 py-16 pt-[calc(var(--header-h)+4rem)]">
      {/* Spec-strip tier (7PA-242): JetBrains Mono caps at +0.1em. */}
      <p className="text-court/80 font-mono text-xs tracking-spec uppercase">{HOME_HERO.eyebrow}</p>
      {/* Hero display tier: 48px mobile → 72/96px desktop, -0.005em, lh 0.95
          (leading repeats per size — text-* utilities reset line-height). */}
      <Heading
        as="h1"
        size="none"
        className="max-w-[16ch] text-5xl leading-[0.95] tracking-hero md:text-7xl md:leading-[0.95] xl:text-8xl xl:leading-[0.95]"
      >
        {HOME_HERO.headline}
      </Heading>
      <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Cta to={HOME_HERO.cta.href} variant="brand" size="lg">
          {HOME_HERO.cta.label}
        </Cta>
        <Cta to={HOME_HERO.secondaryCta.href} variant="brand-text" size="lg" className="px-0">
          {HOME_HERO.secondaryCta.label}
        </Cta>
      </div>
      <div className="text-court/80 mt-2 flex flex-col gap-1 font-mono text-xs tracking-spec uppercase">
        <span>{HOME_HERO.coordinates}</span>
        <span>{HOME_HERO.tagline}</span>
      </div>
    </Container>
  </section>
);
