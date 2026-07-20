import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { OUR_STORY } from '~/content/our-story';
import { cn } from '~/lib/cn';

/**
 * Live: 28.8px → 30.72px (tablet) → 40px (desktop), 0.03em tracking, 1.1 leading.
 * `leading-` is repeated on every heading because Tailwind's `text-*` utilities
 * also set line-height, overriding the one on the Heading brand variant.
 */
const SECTION_HEADING = 'text-[1.8rem] leading-[1.1] md:text-[1.92rem] xl:text-[2.5rem]';
/** Live body copy: 16px, 1.4 line-height. */
const BODY_COPY = 'text-base leading-[1.4] text-neutral-700';

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
          {/* Display heading anchored bottom-left, flush with the page gutter.
              Live: 48px (mobile/tablet) → 57.6px (desktop), 0.05em tracking. */}
          <Container className="pb-5">
            <Heading
              as="h1"
              size="none"
              className="text-5xl leading-[1.1] tracking-[0.05em] xl:text-[3.6rem]"
            >
              {hero.title}
            </Heading>
          </Container>
          {/* CTA band: full-width bars on mobile, content-sized on desktop.
              Renders through Cta so the chevron device and hover animation
              match every other CTA on the site. */}
          <div className="border-t border-white/25">
            <Container className="flex flex-col gap-5 py-5 lg:flex-row lg:py-4">
              {hero.ctas.map((cta) => (
                <Cta
                  key={cta.label}
                  to={cta.href}
                  variant={cta.variant}
                  size="sm"
                  className="w-full lg:w-auto"
                >
                  {cta.label}
                </Cta>
              ))}
            </Container>
          </div>
        </div>
      </section>

      {/* MISSION — full-width section: two-line display heading, full-bleed
          orange rule, larger statement copy. */}
      <section className="py-16 md:py-24">
        <Container>
          <Heading as="h2" size="none" className={SECTION_HEADING}>
            {mission.heading.split(' ').map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </Heading>
        </Container>
        <div className="border-brand mt-6 border-t-2" />
        <Container>
          <p className={cn(BODY_COPY, 'mt-6 max-w-xl')}>{mission.statement}</p>
        </Container>
      </section>

      {/* FITNESS — heading, then body + small square image. Desktop: body left,
          image right. Tablet/mobile: heading, image, body (image between). */}
      <Container className="pb-16 md:pb-24">
        <Heading as="h2" size="none" className={cn(SECTION_HEADING, 'max-w-2xl')}>
          {fitness.heading}
        </Heading>
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Live: 6:5 crop up to tablet, 8:7 (400x350) on desktop. */}
          <img
            src={fitness.image}
            alt=""
            loading="lazy"
            className="order-1 mx-auto aspect-[6/5] w-full max-w-[400px] object-cover lg:order-2 lg:mx-0 lg:aspect-[8/7] lg:w-[400px] lg:max-w-none lg:flex-none"
          />
          <div className={cn(BODY_COPY, 'order-2 space-y-4 lg:order-1 lg:flex-1')}>
            {fitness.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Container>

      {/* Full-width black rule separating Fitness from Our Story (matches live). */}
      <hr className="border-t border-black" />

      {/* STORY — display heading above the grid (left on desktop, centered on
          tablet/mobile); small square image + four-paragraph founder story. */}
      <div>
        <Container className="py-16 md:py-24">
          {/* Live: 32px → 48px (desktop), 0.03em tracking. */}
          <Heading
            as="h2"
            size="none"
            className="text-center text-[2rem] leading-[1.1] lg:text-left xl:text-5xl"
          >
            {story.heading}
          </Heading>
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Live: 3:2 at every breakpoint, 375x250 on desktop. */}
            <img
              src={story.image}
              alt={story.founder.name}
              loading="lazy"
              className="mx-auto aspect-[3/2] w-full max-w-[400px] object-cover lg:mx-0 lg:w-[375px] lg:max-w-none lg:flex-none"
            />
            <div className="lg:flex-1">
              <div className={cn(BODY_COPY, 'space-y-4')}>
                {story.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {/* Live signature: 22px brand-orange name over a 14px grey role. */}
              <div className="mt-6">
                {/* Concrete, not Ember — the accent is rationed (7PA-230). */}
                <p className="text-concrete text-[1.375rem] leading-[1.2] font-medium">
                  {story.founder.name}
                </p>
                <p className="mt-0.5 text-sm font-medium text-neutral-500">{story.founder.role}</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
