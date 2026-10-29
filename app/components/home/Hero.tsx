import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { SpecLine } from '~/components/common/SpecLine';
import { HOME_HERO } from '~/content/home';

/**
 * Full-bleed homepage hero. Structure per the drop-01 mockup (Gabe,
 * 2026-07-21): mono spec-strip eyebrow, the ALL-CAPS headline (homepage v2:
 * two forced lines, ≤8 words), an Inter subhead, and a filled + text CTA
 * pair. The two mono spec lines under the CTAs are parked below, not
 * rendered, until there is a shot to caption. Deliberate deviations
 * from 7PA-232: two CTAs instead of one — the secondary renders in chalk, so
 * the page's one Ember moment is still the primary CTA alone. Sits under the
 * transparent overlay header. The photograph itself is replaced by the
 * photography program (7PA-236/237).
 */
export const Hero = () => (
  // -mt pulls the hero up beneath the sticky header (transparent overlay);
  // the announcement bar above it stays opaque.
  <section className="bg-field-night relative -mt-(--header-h) flex min-h-[34rem] items-center overflow-hidden text-ink-night md:min-h-[44rem]">
    {/* Local media test: the hero video plays over the still, which stays as
        the poster so first paint is unchanged and the frame never goes empty
        before the first video frame decodes. Same autoplay recipe as the
        other homepage background videos (muted/loop/playsInline). */}
    <video
      src={HOME_HERO.backgroundVideo.src}
      poster={HOME_HERO.backgroundImage.url}
      aria-label={HOME_HERO.backgroundImage.alt}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 size-full object-cover"
    />
    {/* Live's .custom-hero-overlay verbatim: a flat rgba(0,0,0,0.10) wash over
        the whole frame, nothing graded. pointer-events-none so it never eats a
        click meant for the CTA beneath it. */}
    <div className="pointer-events-none absolute inset-0 bg-black/10" />
    <Container className="relative z-10 flex flex-col items-start gap-5 py-16 pt-[calc(var(--header-h)+4rem)]">
      {/* Spec-strip tier (7PA-242): JetBrains Mono caps at +0.1em. */}
      <SpecLine className="text-support-night">{HOME_HERO.eyebrow}</SpecLine>
      {/* Hero display tier, -0.005em, lh 0.95 (leading repeats per size —
          text-* utilities reset line-height). Each line is a nowrap block so
          the break lands at the period on every viewport. The longer line
          ("GOING TO BE AN ATHLETE.") measures ≈10px per font-px, so each step
          is the largest size whose line fits the content box at that width:
          32px at 375, 48px from 560, 60px from md, 72px from lg, 96px from xl.
          The 560 step is an arbitrary breakpoint like the base; the named
          md/lg/xl steps above it stay in ascending order, so emit order is
          safe. Re-measure if the headline copy changes. */}
      <Heading
        as="h1"
        size="none"
        lines={HOME_HERO.headlineLines}
        className="text-[2rem] leading-[0.95] tracking-hero [&>span]:whitespace-nowrap min-[560px]:text-5xl min-[560px]:leading-[0.95] md:text-6xl md:leading-[0.95] lg:text-7xl lg:leading-[0.95] xl:text-8xl xl:leading-[0.95]"
      />
      {/* Body tier: Inter, sentence case — 14px, 16px from md (one step under
          the 16/18 it launched at; Gabe, 2026-10-28). */}
      <p className="max-w-[42ch] text-sm leading-[1.55] md:text-base md:leading-[1.55]">
        {HOME_HERO.subhead}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Cta to={HOME_HERO.cta.href} variant="brand" size="lg">
          {HOME_HERO.cta.label}
        </Cta>
        <Cta to={HOME_HERO.secondaryCta.href} variant="brand-text" size="lg" className="px-0">
          {HOME_HERO.secondaryCta.label}
        </Cta>
      </div>
      {/* Spec lines (coordinates, location/time) parked for now — re-enable
          by uncommenting; HOME_HERO.coordinates/tagline still hold the copy.
      <div className={cn(SPEC_LINE_CLASS, 'text-support-night mt-2 flex flex-col gap-1')}>
        <span>{HOME_HERO.coordinates}</span>
        <span>{HOME_HERO.tagline}</span>
      </div>
      */}
    </Container>
  </section>
);
