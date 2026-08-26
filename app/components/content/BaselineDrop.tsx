import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { LiveDot } from '~/components/common/LiveDot';
import {
  MediaSlot,
  type MediaSlotRatio,
  type MediaSlotSource,
} from '~/components/common/MediaSlot';
import { SpecLine } from '~/components/common/SpecLine';
import { BASELINE_DROP } from '~/content/baseline-drop';
import { cn } from '~/lib/cn';

/**
 * NOTE on Ember: the approved mock deliberately repeats the Ember accent down
 * this page (live dot, stat glyphs, per-piece Shop links) — a sanctioned
 * exception to the one-moment-per-page ration (7PA-230). The one `brand`
 * BUTTON is still the closer's SHOP THE DROP.
 */

/** Campaign heading scale steps (the face/weight/tracking come from
    Heading's `campaign` variant; leading repeats next to each size step —
    see common-pitfalls.md). */
const CAMPAIGN_HEADING_SIZES = 'text-3xl leading-[1.15] md:text-[3.5rem] md:leading-[1.1]';

/** Left-aligned section header: display heading → muted subtitle. */
const DropSectionHeader = ({ heading, subtitle }: { heading: string; subtitle: string }) => (
  <div>
    <Heading as="h2" variant="campaign" size="none" className={CAMPAIGN_HEADING_SIZES}>
      {heading}
    </Heading>
    <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-support md:mt-3">{subtitle}</p>
  </div>
);

/** A training-section photo under the unifying grade: the images are shot in
    different light (fog, beach sun, trail green), so each gets a slight
    desaturation plus a cool Carbon multiply veil — enough to pull them onto
    one color profile without visibly costing detail (Gabe 2026-08-25). */
const GradedMedia = ({
  media,
  ratio,
  className,
}: {
  media: MediaSlotSource;
  ratio: MediaSlotRatio;
  className?: string;
}) => (
  <div className={cn('relative', className)}>
    <MediaSlot media={media} ratio={ratio} className="saturate-[0.85]" />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-field-night/15 mix-blend-multiply"
    />
  </div>
);

/** Live dot + edition line, the page headline (the status line stacks under
    it on mobile, joins it inline from md), and the intro paragraph. */
const Intro = () => (
  <Container className="pt-8 pb-6 md:pt-14 md:pb-10">
    <SpecLine className="flex items-center gap-3 text-sm text-ink">
      <LiveDot />
      {BASELINE_DROP.eyebrow}
    </SpecLine>
    <Heading
      as="h1"
      size="none"
      className="mt-3 text-[2.5rem] leading-none tracking-hero md:mt-4 md:text-6xl md:leading-none"
    >
      {BASELINE_DROP.headline}
      <span className="hidden md:inline">{`\u2002·\u2002${BASELINE_DROP.status}`}</span>
    </Heading>
    <SpecLine className="mt-2 text-base text-ink md:hidden">{BASELINE_DROP.status}</SpecLine>
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-support md:mt-5">
      {BASELINE_DROP.intro}
    </p>
  </Container>
);

/** The full-bleed 16:9 drop film, with the full-video pointer pinned to
    its lower-left corner over a soft scrim (the footage runs light, so the
    white label needs the ground). */
const Film = () => (
  <section className="relative">
    <MediaSlot media={BASELINE_DROP.film} ratio="video" />
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-field-night/60 to-transparent"
    />
    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-10">
      {/* White campaign Archivo, per Gabe (2026-08-25). */}
      <p className="font-archivo text-[11px] font-medium tracking-caps text-ink-night uppercase md:text-sm">
        {BASELINE_DROP.filmOverlay.label}
      </p>
      <Cta
        href={BASELINE_DROP.filmOverlay.cta.href}
        target="_blank"
        size="xs"
        className="mt-2 border-ink-night/60 text-ink-night md:mt-2.5"
      >
        {BASELINE_DROP.filmOverlay.cta.label}
      </Cta>
    </div>
  </section>
);

/** One dark stat tile — the figure and its label pinned to the bottom.
    No fixed aspect: the top padding is all the headroom the tile gets, so
    the row stays a compact stat band; the grid levels the four tiles and
    the bottom-pinned figures keep one shared baseline (Gabe 2026-08-25). */
const StatCard = ({ stat }: { stat: (typeof BASELINE_DROP.receipts.stats)[number] }) => (
  <div className="flex flex-col justify-end bg-field-night px-4 pt-8 pb-4 md:px-5 md:pt-10 md:pb-6">
    {/* Archivo Light figure with its label beside it, items-end (not
        baseline): a label that wraps grows upward from the shared bottom
        edge, so every card's figure sits at the same height; the label's pb
        optically re-seats its baseline on the figure's. */}
    <p className="font-archivo flex items-end gap-x-2 text-4xl leading-none font-light text-ink-night md:gap-x-2.5 md:text-6xl md:leading-none">
      <span className="shrink-0">
        {stat.value}
        {'accent' in stat ? <span className="text-brand">{stat.accent}</span> : null}
      </span>
      <span className="min-w-0 pb-1 text-xs leading-tight tracking-caps text-support-night uppercase md:pb-2 md:text-sm">
        {stat.label}
      </span>
    </p>
  </div>
);

/** "THE RECEIPTS" — the four earned-number cards. */
const Receipts = () => (
  <Container className="pt-12 pb-11 md:pt-18 md:pb-16">
    <DropSectionHeader
      heading={BASELINE_DROP.receipts.heading}
      subtitle={BASELINE_DROP.receipts.subtitle}
    />
    <div className="mt-7 grid grid-cols-2 gap-1 md:mt-12 md:grid-cols-4 md:gap-1.5">
      {BASELINE_DROP.receipts.stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  </Container>
);

/** BUILT FOR HOW ATHLETES TRAIN — header, wide training band, and the
    three day cards. */
const Standard = () => (
  <section>
    <Container className="pt-12 pb-6 md:pt-18 md:pb-11">
      <DropSectionHeader
        heading={BASELINE_DROP.standard.heading}
        subtitle={BASELINE_DROP.standard.subtitle}
      />
    </Container>
    <GradedMedia
      media={BASELINE_DROP.standard.banner}
      ratio="wide"
      className="border-t border-border-subtle"
    />
    {/* The three day photos run edge-to-edge under the wide band, split by
        1px slivers — the same 1px above them. The caption frames below butt
        together with single shared hairlines (only the photos keep the gap),
        so the row reads as one continuous strip (Gabe 2026-08-25). Seam
        geometry rides first/last variants, not column counting. */}
    <div className="mt-px grid gap-y-5 md:grid-cols-3">
      {BASELINE_DROP.standard.days.map((day) => (
        <div key={day.index} className="group flex flex-col">
          <GradedMedia
            media={day.media}
            ratio="landscape"
            className="md:pr-px md:group-last:pr-0"
          />
          {/* Hairline frame closes around the caption — the photo caps the
              top, and from md only the first frame keeps its left border so
              adjacent frames share one hairline. flex-1 levels the three
              frames to the tallest (Gabe 2026-08-25). */}
          <div className="flex-1 border-x border-b border-border-subtle px-4 pt-3.5 pb-5 md:border-l-0 md:group-first:border-l md:px-5 md:pt-4 md:pb-6">
            <p className="text-[10px] font-bold tracking-caps text-ink uppercase md:text-[11px]">
              {`${day.index}:\u2002${day.title}`}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-support md:mt-2 md:text-[0.8rem]">
              {day.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/** One product tile: 4:5 photo, mono name + price, Ember Shop link. */
const PieceCell = ({
  piece,
  className,
}: {
  piece: (typeof BASELINE_DROP.pieces.products)[number];
  className?: string;
}) => (
  <div className={className}>
    <MediaSlot media={piece.media} ratio="product" />
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 pt-2.5 pb-4 md:px-4.5 md:pt-3.5 md:pb-5">
      {/* Product names ride the campaign Archivo, not the mono spec strip
          (Gabe 2026-08-25). */}
      <span className="font-archivo text-[11px] tracking-caps text-ink uppercase md:text-xs">
        {piece.name} <span className="text-support">{piece.price}</span>
      </span>
      <Cta to={piece.href} variant="brand-text" size="xs" className="px-0 text-brand">
        Shop
      </Cta>
    </div>
  </div>
);

/** "THE PIECES" — the three-product grid (short full-width on mobile, then
    the tee and hat 2-up; a single row of three from md). */
const Pieces = () => (
  <section>
    <Container className="pt-12 pb-6 md:pt-16 md:pb-10">
      <DropSectionHeader
        heading={BASELINE_DROP.pieces.heading}
        subtitle={BASELINE_DROP.pieces.subtitle}
      />
    </Container>
    {/* Separate tiles split by the same hairline-thin gaps as the day
        photos; the lead piece goes full-width on mobile (Gabe 2026-08-25). */}
    <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-1.5">
      {BASELINE_DROP.pieces.products.map((piece) => (
        <PieceCell
          key={piece.name}
          piece={piece}
          className="first:col-span-2 md:first:col-span-1"
        />
      ))}
    </div>
  </section>
);

/** The dark centered closer — the mock keeps this one centered while the
    content sections above are left-aligned. Its CTA is the page's one Ember
    `brand` button. */
const Closer = () => (
  <section className="bg-field-night py-13 text-center text-ink-night md:py-20">
    <Container>
      {/* Campaign Archivo, matching the stat labels (Gabe 2026-08-25). */}
      <p className="font-archivo text-[9px] tracking-[0.34em] text-support-night uppercase md:text-[11px]">
        {BASELINE_DROP.closer.eyebrow}
      </p>
      <Heading
        as="h2"
        variant="campaign"
        size="none"
        lines={BASELINE_DROP.closer.headingLines}
        className="mx-auto mt-4 max-w-4xl text-[1.625rem] leading-[1.3] md:mt-5 md:text-5xl md:leading-tight"
      />
      <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-support-night md:mt-4 md:text-sm">
        {BASELINE_DROP.closer.body}
      </p>
      <Cta to={BASELINE_DROP.closer.cta.href} variant="brand" size="lg" className="mt-6 md:mt-8">
        {BASELINE_DROP.closer.cta.label}
      </Cta>
    </Container>
  </section>
);

/**
 * The ED. 01 "BASELINE" drop page (/drops/baseline): intro → drop film →
 * receipts → built for how athletes train → the pieces → closer.
 */
export const BaselineDrop = () => (
  <div>
    <Intro />
    <Film />
    <Receipts />
    <Standard />
    <Pieces />
    <Closer />
  </div>
);
