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
      <Container className="flex flex-col items-center justify-center pt-(--header-h) text-center md:items-start md:pt-0 md:text-left">
        <p className="mb-1 inline-block rounded-md bg-neutral-500/50 px-3 py-1 text-[8px] font-semibold tracking-[0.2em] uppercase italic backdrop-blur-[2px] md:mb-3 md:px-4 md:py-1.5 md:text-xs">
          {HOME_HERO.eyebrow}
        </p>
        <h1 className="w-full">
          <Logo
            tone="light"
            className="mx-auto h-auto w-[64vw] max-w-[1200px] md:mx-0 md:w-[83vw]"
          />
          <span className="sr-only">{HOME_HERO.wordmark}</span>
        </h1>
        <p className="mt-1 text-[11px] font-light tracking-[0.2em] uppercase md:mt-4 md:text-3xl lg:text-5xl">
          {HOME_HERO.subtitle}
        </p>
        <Button
          asChild
          variant="brand"
          size="sm"
          className="mt-2 self-center md:mt-10 md:h-10 md:px-6"
        >
          <Link to={HOME_HERO.cta.href}>{HOME_HERO.cta.label}</Link>
        </Button>
      </Container>
    </div>
  </section>
);
