import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Logo } from '~/components/common/Logo';
import { Button } from '~/components/ui/button';
import { HOME_HERO } from '~/content/home';

/**
 * Full-bleed homepage hero — the image renders in flow at its natural aspect
 * ratio (compact on mobile, tall on desktop, like the live theme) with the
 * wordmark, subtitle, and primary CTA overlaid. Sits under the transparent
 * overlay header. Mirrors the live `custom-hero-image` section.
 */
export const Hero = () => (
  // -mt pulls the hero up beneath the sticky header (transparent overlay);
  // the announcement bar above it stays opaque, matching live.
  <section className="relative -mt-(--header-h) overflow-hidden bg-neutral-900 text-white">
    <Image
      src={HOME_HERO.backgroundImage.url}
      width={HOME_HERO.backgroundImage.width}
      height={HOME_HERO.backgroundImage.height}
      alt=""
      sizes="100vw"
      loading="eager"
      fetchPriority="high"
      className="block h-auto w-full"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />
    <div className="absolute inset-0 z-10 flex">
      <Container className="flex flex-col items-start justify-center pt-(--header-h) text-left md:pt-0">
        {/* The eyebrow and subtitle share the wordmark's box so they left-align
            to it — the wordmark is inset on mobile and near-flush from md up,
            mirroring live. The CTA is centered at every breakpoint. */}
        <div className="flex w-[64vw] max-w-[1200px] flex-col items-start self-center md:w-[83vw] md:self-start">
          <p className="bg-carbon/40 mb-1 inline-block rounded-[4px] px-3 py-1 text-xs tracking-[0.04em] uppercase italic backdrop-blur-[2px] md:mb-3 md:px-4 md:py-1.5 md:text-base">
            {HOME_HERO.eyebrow}
          </p>
          <h1 className="w-full">
            <Logo tone="light" className="h-auto w-full" />
            <span className="sr-only">{HOME_HERO.wordmark}</span>
          </h1>
          {/* Hero display tier: Archivo Condensed Bold caps, -0.005em, lh ~0.95
              (leading repeats per size — text-* utilities reset line-height). */}
          <p className="font-display mt-1 text-sm leading-[0.95] font-bold tracking-hero uppercase md:mt-4 md:text-2xl md:leading-[0.95] xl:text-[3.75rem] xl:leading-[0.95]">
            {HOME_HERO.subtitle}
          </p>
        </div>
        <Button
          asChild
          variant="brand"
          size="sm"
          className="mt-2 self-center text-sm md:mt-10 md:h-10 md:px-6 md:text-[1.2rem]"
        >
          <Link to={HOME_HERO.cta.href}>{HOME_HERO.cta.label}</Link>
        </Button>
      </Container>
    </div>
  </section>
);
