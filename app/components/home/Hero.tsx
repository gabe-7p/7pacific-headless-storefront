import { Image } from '@shopify/hydrogen';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Button } from '~/components/ui/button';
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
  <section className="bg-carbon text-chalk relative -mt-(--header-h) flex min-h-[34rem] items-center overflow-hidden md:min-h-[44rem]">
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
    {/* Carbon scrim so Chalk type holds contrast on the photograph. */}
    <div className="from-carbon/60 via-carbon/15 to-carbon/30 absolute inset-0 bg-linear-to-t" />
    <Container className="relative z-10 flex flex-col items-start gap-5 py-16 pt-[calc(var(--header-h)+4rem)]">
      {/* Hero display tier: 48px mobile → 72/96px desktop, -0.005em, lh 0.95
          (leading repeats per size — text-* utilities reset line-height). */}
      <h1 className="font-display max-w-[16ch] text-5xl leading-[0.95] font-medium tracking-hero uppercase md:text-7xl md:leading-[0.95] xl:text-8xl xl:leading-[0.95]">
        {HOME_HERO.headline}
      </h1>
      <p className="max-w-md text-base md:text-lg">{HOME_HERO.subline}</p>
      <Button asChild variant="brand" size="lg" className="mt-1">
        <Link to={HOME_HERO.cta.href}>
          {HOME_HERO.cta.label}
          <ChevronRight />
        </Link>
      </Button>
    </Container>
  </section>
);
