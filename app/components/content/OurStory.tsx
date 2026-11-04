import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { GradedMedia, GrainVeil } from '~/components/common/GradedMedia';
import { Heading } from '~/components/common/Heading';
import { HeroContent, HeroShell } from '~/components/common/HeroShell';
import { Image } from '~/components/common/Image';
import { LiveDot } from '~/components/common/LiveDot';
import type { MediaSlotRatio, MediaSlotSource } from '~/components/common/MediaSlot';
import { FadeIn, MotionProvider, SettleIn } from '~/components/common/Motion';
import { CornerBrackets, SectionLabel, TypeOnReadout } from '~/components/common/Readout';
import { Scrim } from '~/components/common/Scrim';
import { SPEC_LINE_CLASS, SpecLine } from '~/components/common/SpecLine';
import { OUR_STORY } from '~/content/our-story';
import { cn } from '~/lib/cn';
import { IMAGE_SIZES } from '~/lib/imageSizes';

/** Body copy: 14px Inter at 1.6 (the guideline floor). */
const BODY = 'text-sm leading-[1.6] text-ink-night';
/** Body copy held to a readable line, where it isn't already in a narrow column. */
const BODY_MEASURE = `${BODY} max-w-[60ch]`;
/** Chapter statements — one step under the hero. */
const STATEMENT = 'text-4xl leading-[0.98] md:text-6xl xl:text-7xl';
const SUBSTATEMENT = 'text-3xl leading-[1.05] md:text-5xl';
const HAIRLINE = 'border-t border-border-subtle-night';

/** A photo inside corner brackets — the file's photo mount. */
const FramedMedia = ({ media, ratio }: { media: MediaSlotSource; ratio: MediaSlotRatio }) => (
  <div className="relative p-3">
    <CornerBrackets />
    <GradedMedia media={media} ratio={ratio} grain />
  </div>
);

/**
 * Hero — the file opens. The readout types on under the transparent header
 * (NotFound's recipe: mono type-on, Ember caret flicks twice and rests), the
 * headline and CTA rise in behind it, and the photograph settles from 1.04.
 * This is the page's one choreographed moment; nothing below animates.
 */
const FileHero = () => {
  const { hero } = OUR_STORY;
  return (
    <HeroShell className="flex-col">
      <SettleIn className="absolute inset-0">
        <Image
          src={hero.image.src}
          width={hero.image.width}
          height={hero.image.height}
          alt={hero.image.alt}
          sizes={IMAGE_SIZES.full}
          loading="eager"
          fetchPriority="high"
          className="size-full object-cover object-[50%_30%] saturate-[0.85]"
        />
      </SettleIn>
      <Scrim strength="25" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-field-night/80 to-transparent"
      />
      <GrainVeil />
      <HeroContent clearance="sm" className="flex-1 justify-between pb-8 md:pb-12">
        <TypeOnReadout className="text-support-night">{hero.readout}</TypeOnReadout>
        <FadeIn
          delay={0.3}
          className="mt-24 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between"
        >
          <Heading
            as="h1"
            size="none"
            lines={hero.title}
            className="text-5xl leading-[0.95] tracking-hero md:text-7xl xl:text-8xl"
          />
          <Cta to={hero.cta.href} variant="brand-outline" size="sm">
            {hero.cta.label}
          </Cta>
        </FadeIn>
      </HeroContent>
    </HeroShell>
  );
};

/** 01 STATUS — the lead-in. Opening paragraph at full measure, then the
    photo mount beside the statement, the callout, and the two closing lines. */
const Status = () => {
  const { status } = OUR_STORY;
  return (
    <Container className="py-12 md:py-18">
      <SectionLabel number={status.number} title={status.title} />
      <p className={cn(BODY_MEASURE, 'mt-8')}>{status.open}</p>
      <div className="mt-12 grid gap-10 lg:grid-cols-[4fr_8fr] lg:gap-16">
        <FramedMedia media={status.media} ratio="portrait" />
        <div className="lg:pt-3">
          <Heading as="h2" size="none" className={SUBSTATEMENT}>
            {status.statement}
          </Heading>
          <div className={cn(BODY_MEASURE, 'mt-8 space-y-5')}>
            {status.after.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      <Heading as="h2" size="none" className={cn(STATEMENT, 'mt-12 max-w-[18ch] md:mt-18')}>
        {status.callout}
      </Heading>
      <div className={cn(BODY_MEASURE, 'mt-8 space-y-5')}>
        {status.close.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Container>
  );
};

/** 02 MISSION — the statement, then the three passages side by side. */
const Mission = () => {
  const { mission } = OUR_STORY;
  return (
    <section className={HAIRLINE}>
      <Container className="py-12 md:py-18">
        <SectionLabel number={mission.number} title={mission.title} />
        <Heading as="h2" size="none" className={cn(STATEMENT, 'mt-8 max-w-[14ch]')}>
          {mission.statement}
        </Heading>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {mission.body.map((p) => (
            <p key={p} className={BODY}>
              {p}
            </p>
          ))}
        </div>
        <p className={cn(BODY_MEASURE, 'mt-8')}>{mission.close}</p>
      </Container>
    </section>
  );
};

/** 03 KIT — heading with the four passages in one readable column beside it
    (the 2×2 grid was hard to scan), then the wide band and
    the captioned strip. Strip seams are 1px of the night hairline. */
const Kit = () => {
  const { kit } = OUR_STORY;
  return (
    <section className={HAIRLINE}>
      <Container className="pt-12 pb-10 md:pt-18 md:pb-12">
        <SectionLabel number={kit.number} title={kit.title} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Heading
            as="h2"
            size="none"
            lines={kit.headingLines}
            className={cn(SUBSTATEMENT, 'xl:text-6xl xl:leading-[1.02]')}
          />
          <div className={cn(BODY_MEASURE, 'space-y-5 lg:pt-2')}>
            {kit.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Container>
      <GradedMedia media={kit.banner} ratio="wide" grain />
      <div className="mt-px grid gap-px bg-border-subtle-night md:grid-cols-3">
        {kit.strip.map((cell) => (
          <figure key={cell.caption} className="bg-field-night">
            <GradedMedia media={cell.media} ratio="landscape" grain />
            <figcaption className={cn(SPEC_LINE_CLASS, 'px-4 py-3 text-support-night md:px-5')}>
              {cell.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

/** 04 ROSTER — the founder's card (sticky from lg) beside the letter, ending
    in the sign-off. The card is the page's one bold move: portrait in the
    mount, four mono fields. */
const Roster = () => {
  const { roster } = OUR_STORY;
  return (
    <section className={HAIRLINE}>
      <Container className="py-12 md:py-18">
        <SectionLabel number={roster.number} title={roster.title} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <FramedMedia media={roster.card.media} ratio="landscape" />
            <dl className="mt-2 border-t border-border-subtle-night">
              {roster.card.fields.map((field) => (
                <div
                  key={field.label}
                  className="grid grid-cols-[6rem_1fr] gap-4 border-b border-border-subtle-night py-3"
                >
                  <dt className={cn(SPEC_LINE_CLASS, 'text-support-night')}>{field.label}</dt>
                  <dd className={cn(SPEC_LINE_CLASS, 'flex items-center gap-2 text-ink-night')}>
                    {'live' in field && field.live ? <LiveDot /> : null}
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="max-w-[65ch]">
            {/* Sub-headline tier: Inter, 20–24px, tight tracking, sentence case. */}
            <p className="text-2xl leading-snug font-medium tracking-tight text-ink-night md:text-3xl">
              {roster.lede}
            </p>
            <div className={cn(BODY, 'mt-8 space-y-6')}>
              {roster.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Heading as="h3" size="none" className={cn(SUBSTATEMENT, 'mt-12')}>
              {roster.pull}
            </Heading>
            <p className={cn(BODY, 'mt-8')}>{roster.close}</p>
            <div className="mt-6">
              <p className="text-lg leading-[1.2] font-medium text-ink-night">
                {roster.founder.name}
              </p>
              <SpecLine className="mt-1 text-support-night">{roster.founder.role}</SpecLine>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

/**
 * Our Story — "The File". A Night Session page that tells the story as an
 * athlete's issued file: hero → 01 status → 02 mission → 03 kit → 04 roster
 * (letter + sign-off). The file ends on the sign-off — there is no closing
 * band. Owns its MotionProvider (NotFound precedent).
 */
export const OurStory = () => (
  <MotionProvider>
    <div className="bg-field-night text-ink-night bg-[image:var(--file-grid)]">
      <FileHero />
      <Status />
      <Mission />
      <Kit />
      <Roster />
    </div>
  </MotionProvider>
);
