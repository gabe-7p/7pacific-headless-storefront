import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Eyebrow } from '~/components/common/Eyebrow';
import { GradedMedia } from '~/components/common/GradedMedia';
import { Heading } from '~/components/common/Heading';
import { MediaSlot } from '~/components/common/MediaSlot';
import { SectionHeader } from '~/components/common/SectionHeader';
import { BaselineMasthead } from '~/components/content/BaselineMasthead';
import { BASELINE_DROP } from '~/content/baseline-drop';

/**
 * Ember repeats here by sanctioned exception (ui-components.md).
 */

/** The full-bleed 16:9 drop film; the scrim keeps the white full-video label legible. */
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
    the bottom-pinned figures keep one shared baseline. */
const StatCard = ({ stat }: { stat: (typeof BASELINE_DROP.receipts.stats)[number] }) => (
  <div className="flex flex-col justify-end bg-field-night px-4 pt-8 pb-4 md:px-5 md:pt-10 md:pb-6">
    {/* Archivo Light figure with its label beside it, items-end (not
        baseline): a label that wraps grows upward from the shared bottom
        edge, so every card's figure sits at the same height; the label's pb
        optically re-seats its baseline on the figure's. */}
    <p className="font-archivo flex items-end gap-x-2 text-4xl leading-none font-light text-ink-night md:gap-x-2.5 md:text-6xl">
      <span className="shrink-0">
        {stat.value}
        {'accent' in stat ? <span className="text-brand">{stat.accent}</span> : null}
      </span>
      <Eyebrow
        as="span"
        className="min-w-0 pb-1 leading-tight font-light text-support-night md:pb-2 md:text-sm"
      >
        {stat.label}
      </Eyebrow>
    </p>
  </div>
);

/** "THE RECEIPTS" — the four earned-number cards. */
const Receipts = () => (
  <Container className="pt-12 pb-11 md:pt-18 md:pb-16">
    <SectionHeader
      heading={BASELINE_DROP.receipts.heading}
      subtitle={BASELINE_DROP.receipts.subtitle}
      scale="campaign"
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
      <SectionHeader
        heading={BASELINE_DROP.standard.heading}
        subtitle={BASELINE_DROP.standard.subtitle}
        scale="campaign"
      />
    </Container>
    {/* The band is the sled-push loop at 70% of its height. */}
    <GradedMedia
      media={BASELINE_DROP.standard.banner}
      ratio="loop"
      className="border-t border-border-subtle"
    />
    {/* The three day photos run edge-to-edge under the band, split by 1px
        slivers — the same 1px above them. The caption frames below butt
        together with single shared hairlines (only the photos keep the gap),
        so the row reads as one continuous strip. The
        sliver is the grid's own column gap, not padding on the photo: a
        padded photo is 1px narrower than its neighbour and, through the
        aspect ratio, a fraction shorter — the third caption sat ~1px lower
        than the other two. Each frame reaches 1px into the gap (-mr-px) to
        keep the strip continuous; the last has no gap to bridge. */}
    <div className="mt-px grid gap-y-5 md:grid-cols-3 md:gap-x-px">
      {BASELINE_DROP.standard.days.map((day) => (
        <div key={day.index} className="group flex flex-col">
          <GradedMedia media={day.media} ratio="landscape" />
          {/* Hairline frame closes around the caption — the photo caps the
              top, and from md only the first frame keeps its left border so
              adjacent frames share one hairline. flex-1 levels the three
              frames to the tallest. */}
          <div className="flex-1 border-x border-b border-border-subtle px-4 pt-3.5 pb-5 md:-mr-px md:border-l-0 md:px-5 md:pt-4 md:pb-6 md:group-first:border-l md:group-last:mr-0">
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
      {/* Product names ride the campaign Archivo, not the mono spec strip. */}
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
      <SectionHeader
        heading={BASELINE_DROP.pieces.heading}
        subtitle={BASELINE_DROP.pieces.subtitle}
        scale="campaign"
      />
    </Container>
    {/* Separate tiles split by the same hairline-thin gaps as the day
        photos; the lead piece goes full-width on mobile. */}
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
      {/* Campaign Archivo, matching the stat labels. */}
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
    <BaselineMasthead />
    <Film />
    <Receipts />
    <Standard />
    <Pieces />
    <Closer />
  </div>
);
