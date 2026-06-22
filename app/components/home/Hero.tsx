import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Button } from '~/components/ui/button';
import { HOME_HERO } from '~/content/home';

/**
 * Full-bleed homepage hero — background image with the oversized wordmark,
 * subtitle, and primary CTA, sitting under the transparent overlay header.
 * Mirrors the live `custom-hero-image` section.
 */
export const Hero = () => (
  <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-neutral-900 text-white">
    <img
      src={HOME_HERO.backgroundImage}
      alt=""
      className="absolute inset-0 size-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
    <Container className="relative z-10 pb-14 md:pb-24">
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
  </section>
);
