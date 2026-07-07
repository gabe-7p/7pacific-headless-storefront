import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Button } from '~/components/ui/button';
import { OUR_STORY } from '~/content/our-story';

/**
 * Our Story page — hero, mission, and founder story. Presentational: renders the
 * typed copy/assets from content/our-story.ts (mirrors the live Liquid section).
 */
export const OurStory = () => {
  const { hero, mission, fitness, story } = OUR_STORY;
  return (
    <>
      <section className="relative flex min-h-[70vh] flex-col justify-end overflow-hidden bg-neutral-900 text-white">
        <img
          src={hero.backgroundImage}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="relative z-10 w-full">
          {/* Display heading anchored bottom-left, flush with the page gutter. */}
          <Container className="pb-5">
            <Heading as="h1" size="display" className="text-6xl leading-none md:text-8xl">
              {hero.title}
            </Heading>
          </Container>
          {/* CTA band: left-anchored pills on desktop; full-width stacked bars
              spanning the viewport on tablet/mobile. */}
          <div className="border-t border-white/25">
            <div className="mx-auto flex w-full max-w-(--page-max) flex-col gap-px lg:flex-row lg:gap-3 lg:px-8 lg:py-4">
              {hero.ctas.map((cta) => (
                <Button
                  key={cta.label}
                  asChild
                  variant={cta.variant}
                  className="w-full justify-between px-5 py-4 lg:w-auto lg:justify-center lg:px-6 lg:py-2"
                >
                  <Link to={cta.href}>{cta.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION — full-width section: two-line display heading, full-bleed
          orange rule, larger statement copy. */}
      <section className="py-16 md:py-24">
        <Container>
          <Heading as="h2" size="display" className="text-4xl leading-[0.95] md:text-6xl">
            {mission.heading.split(' ').map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </Heading>
        </Container>
        <div className="border-brand mt-6 border-t-2" />
        <Container>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-700 md:text-xl">
            {mission.statement}
          </p>
        </Container>
      </section>

      {/* FITNESS — heading, then body + small square image. Desktop: body left,
          image right. Tablet/mobile: heading, image, body (image between). */}
      <Container className="pb-16 md:pb-24">
        <Heading as="h2" size="display" className="max-w-2xl">
          {fitness.heading}
        </Heading>
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <img
            src={fitness.image}
            alt=""
            loading="lazy"
            className="order-1 mx-auto aspect-square w-full max-w-sm object-cover lg:order-2 lg:mx-0 lg:w-[300px] lg:max-w-none lg:flex-none"
          />
          <div className="order-2 space-y-4 text-sm leading-relaxed text-neutral-600 lg:order-1 lg:flex-1">
            {fitness.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Container>

      <div className="bg-neutral-50">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <img
            src={story.image}
            alt={story.founder.name}
            loading="lazy"
            className="order-1 aspect-[4/5] w-full rounded object-cover md:order-none"
          />
          <div className="order-2">
            <p className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">
              {story.eyebrow}
            </p>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-600">
              {story.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold tracking-wide uppercase">{story.founder.name}</p>
              <p className="text-xs tracking-wide text-neutral-500 uppercase">
                {story.founder.role}
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
