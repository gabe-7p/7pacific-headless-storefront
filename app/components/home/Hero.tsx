import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Button } from '~/components/ui/button';
import { HOME_HERO } from '~/content/home';

/**
 * Full-bleed homepage hero — the image renders in flow at its natural aspect
 * ratio (compact on mobile, tall on desktop, like the live theme) with the
 * wordmark, subtitle, and primary CTA overlaid. Sits under the transparent
 * overlay header. Mirrors the live `custom-hero-image` section.
 */
export const Hero = () => (
  <section className="relative overflow-hidden bg-neutral-900 text-white">
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
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
    <div className="absolute inset-0 z-10 flex items-end">
      <Container className="pb-6 md:pb-14 lg:pb-24">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase">{HOME_HERO.eyebrow}</p>
        <h1 className="text-7xl font-extrabold tracking-tight uppercase md:text-[9rem] md:leading-[0.82]">
          {HOME_HERO.wordmark}
        </h1>
        <p className="mt-4 text-lg font-medium tracking-wide uppercase md:text-2xl">
          {HOME_HERO.subtitle}
        </p>
        <Button asChild variant="brand" className="mt-6">
          <Link to={HOME_HERO.cta.href}>{HOME_HERO.cta.label}</Link>
        </Button>
      </Container>
    </div>
  </section>
);
