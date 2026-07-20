import { Image } from '@shopify/hydrogen';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { HOME_HERO } from '~/content/home';

/**
 * Full-bleed homepage hero per the locked website spec (7PA-232): one
 * background image, a ≤8-word ALL-CAPS headline in the hero display tier,
 * a spec-led subline, and a single mono-caps CTA — the page's one Ember
 * moment. Sits under the transparent overlay header. The photograph itself
 * is replaced by the photography program (7PA-236/237).
 */
export const Hero = () => (
  // -mt pulls the hero up beneath the sticky header (transparent overlay);
  // the announcement bar above it stays opaque.
  <section className="bg-carbon relative -mt-(--header-h) flex min-h-[34rem] items-center overflow-hidden text-white md:min-h-[44rem]">
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
    {/* Live's contrast overlay: a flat 10% black wash (.custom-hero-overlay),
        not a gradient. Anything heavier muddies the photograph. */}
    <div className="absolute inset-0 bg-black/10" />
    {/* Legibility scrim, live's --colorImageOverlayTextShadow technique: a
        local fade behind the type instead of darkening the whole frame. Live
        centers its radial; our copy is left-aligned, so it runs left-to-right
        and clears the right half of the image entirely. */}
    <div className="absolute inset-0 bg-linear-to-r from-black/45 via-black/15 to-transparent to-65%" />
    <Container className="relative z-10 flex flex-col items-start gap-5 py-16 pt-[calc(var(--header-h)+4rem)]">
      {/* Hero display tier: 48px mobile → 72/96px desktop, -0.005em, lh 0.95
          (leading repeats per size — text-* utilities reset line-height). */}
      <Heading
        as="h1"
        size="none"
        className="max-w-[16ch] text-5xl leading-[0.95] tracking-hero md:text-7xl md:leading-[0.95] xl:text-8xl xl:leading-[0.95]"
      >
        {HOME_HERO.headline}
      </Heading>
      <p className="max-w-md text-base md:text-lg">{HOME_HERO.subline}</p>
      <Cta to={HOME_HERO.cta.href} variant="brand" size="lg" className="mt-1">
        {HOME_HERO.cta.label}
      </Cta>
    </Container>
  </section>
);
