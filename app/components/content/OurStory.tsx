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
  const { hero, mission, story } = OUR_STORY;
  return (
    <>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-neutral-900 text-center text-white">
        <img
          src={hero.backgroundImage}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <Container className="relative z-10">
          <Heading as="h1" size="lg" className="text-5xl md:text-7xl">
            {hero.title}
          </Heading>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {hero.ctas.map((cta) => (
              <Button key={cta.label} asChild variant={cta.variant}>
                <Link to={cta.href}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        </Container>
      </section>

      <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">
            {mission.eyebrow}
          </p>
          <p className="mt-3 text-lg font-medium text-neutral-700">{mission.statement}</p>
          <Heading as="h2" size="lg" className="mt-6">
            {mission.heading}
          </Heading>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-600">
            {mission.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <img
          src={mission.image}
          alt=""
          loading="lazy"
          className="aspect-[4/5] w-full rounded object-cover"
        />
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
