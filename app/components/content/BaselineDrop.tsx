import type { ReactNode } from 'react';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { MediaSlot } from '~/components/common/MediaSlot';
import { SpecLine } from '~/components/common/SpecLine';
import { BASELINE_DROP } from '~/content/baseline-drop';

/**
 * NOTE on Ember: the approved mock deliberately repeats the Ember accent down
 * this page (live dot, stat glyphs, day indices, per-piece Shop links) — a
 * sanctioned exception to the one-moment-per-page ration (7PA-230). The one
 * `brand` BUTTON is still the closer's SHOP THE DROP.
 */

/** Campaign display face + scale — Archivo Narrow at weight 450 (a shade
    lighter than Medium, per Gabe 2026-08-25), caps-tier tracking (leading
    repeats next to each size step — see common-pitfalls.md). */
const CAMPAIGN_HEADING_CLASS =
  'font-display-narrow font-[450] text-3xl leading-[1.15] tracking-caps md:text-[3.5rem] md:leading-[1.1]';

/** Left-aligned section header: display heading → muted subtitle. */
const DropSectionHeader = ({ heading, subtitle }: { heading: string; subtitle: string }) => (
  <div>
    <Heading as="h2" size="none" className={CAMPAIGN_HEADING_CLASS}>
      {heading}
    </Heading>
    <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-support md:mt-3">{subtitle}</p>
  </div>
);

/** Mono caption badge pinned over full-bleed media (film credit, band caption). */
const MediaBadge = ({ className, children }: { className?: string; children: ReactNode }) => (
  <SpecLine
    as="span"
    className={`absolute flex items-center gap-2 bg-field/85 px-2.5 py-1.5 text-[9px] text-ink md:gap-3 md:px-3.5 md:py-2 md:text-[11px] ${className ?? ''}`}
  >
    {children}
  </SpecLine>
);

/** Ember live-signal dot with the radar ping ("drop is live"). */
const LiveDot = () => (
  <span aria-hidden className="relative size-2.5 shrink-0">
    <span className="animate-radar-ping border-brand absolute inset-0 rounded-full border motion-reduce:hidden" />
    <span className="bg-brand absolute inset-0 rounded-full" />
  </span>
);

/** Live dot + edition line, the page headline (date stacks under it on
    mobile, joins it inline from md), and the intro paragraph. */
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
      <span className="hidden md:inline">{`\u2002·\u2002${BASELINE_DROP.date}`}</span>
    </Heading>
    <SpecLine className="mt-2 text-base text-ink md:hidden">{BASELINE_DROP.date}</SpecLine>
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-support md:mt-5">
      {BASELINE_DROP.intro}
    </p>
  </Container>
);

/** The full-bleed 16:9 drop film. */
const Film = () => <MediaSlot media={BASELINE_DROP.film} ratio="video" loading="eager" />;

/** One dark 3:4 stat card — BG photo (fill slot) under a scrim, with the
    figure and its label pinned to the bottom. The fixed aspect ratio keeps
    every card the same height. */
const StatCard = ({ stat }: { stat: (typeof BASELINE_DROP.receipts.stats)[number] }) => (
  <div className="relative flex aspect-3/4 flex-col justify-end overflow-hidden bg-field-night p-4 md:p-5 md:pb-6">
    <MediaSlot media={stat.media} ratio="fill" className="bg-transparent" />
    {/* Scrim keeps the type legible once the real BG photo lands. */}
    <div
      aria-hidden
      className="absolute inset-0 bg-linear-to-b from-field-night/30 from-25% to-field-night/90"
    />
    <div className="relative">
      {/* Archivo Light figures (Gabe 2026-08-25) — full-width cut, sized to
          headline the card without swallowing it; the label sits beside the
          figure in the same face, a size down. */}
      {/* items-end (not baseline): a label that wraps grows upward from the
          shared bottom edge, so every card's figure sits at the same height.
          The label's pb optically re-seats its baseline on the figure's. */}
      <p className="font-archivo flex items-end gap-x-2 text-4xl leading-none font-light text-ink-night md:gap-x-2.5 md:text-6xl md:leading-none">
        <span className="shrink-0">
          {stat.value}
          {stat.accent ? <span className="text-brand">{stat.accent}</span> : null}
        </span>
        <span className="min-w-0 pb-1 text-xs leading-tight tracking-caps text-support-night uppercase md:pb-2 md:text-sm">
          {stat.label}
        </span>
      </p>
    </div>
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
    <div className="relative border-t border-border-subtle">
      <MediaSlot media={BASELINE_DROP.standard.banner} ratio="wide" />
      <MediaBadge className="bottom-3 left-3.5 md:bottom-6 md:left-10">
        {BASELINE_DROP.standard.bannerBadge}
      </MediaBadge>
    </div>
    {/* The three day photos run edge-to-edge under the wide band, split by
        1px slivers — the same 1px above them. The caption frames below butt
        together with single shared hairlines (only the photos keep the gap),
        so the row reads as one continuous strip (Gabe 2026-08-25). */}
    <div className="mt-px grid gap-y-5 md:grid-cols-3">
      {BASELINE_DROP.standard.days.map((day, column) => (
        <div key={day.index} className="flex flex-col">
          <div className={column < 2 ? 'md:pr-px' : undefined}>
            <MediaSlot media={day.media} ratio="landscape" />
          </div>
          {/* Hairline frame closes around the caption — the photo caps the
              top, and from md the left border is dropped on the inner columns
              so adjacent frames share one hairline. flex-1 levels the three
              frames to the tallest (Gabe 2026-08-25). */}
          <div
            className={`flex-1 border-x border-b border-border-subtle px-4 pt-3.5 pb-5 md:px-5 md:pt-4 md:pb-6 ${column > 0 ? 'md:border-l-0' : ''}`}
          >
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
const Pieces = () => {
  const [short, tee, hat] = BASELINE_DROP.pieces.products;
  return (
    <section>
      <Container className="pt-12 pb-6 md:pt-16 md:pb-10">
        <DropSectionHeader
          heading={BASELINE_DROP.pieces.heading}
          subtitle={BASELINE_DROP.pieces.subtitle}
        />
      </Container>
      {/* Three separate tiles split by the same hairline-thin gaps as the
          day photos (Gabe 2026-08-25). */}
      <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-1.5">
        <PieceCell piece={short} className="col-span-2 md:col-span-1" />
        <PieceCell piece={tee} />
        <PieceCell piece={hat} />
      </div>
    </section>
  );
};

/** The dark centered closer — the mock keeps this one centered while the
    content sections above are left-aligned. Its CTA is the page's one Ember
    `brand` button. */
const Closer = () => (
  <section className="bg-field-night px-4 py-13 text-center text-ink-night md:px-8 md:py-20">
    <div className="flex items-center justify-center gap-3 md:gap-4">
      <span aria-hidden className="h-px w-9 bg-border-subtle-night md:w-16" />
      <SpecLine
        as="span"
        className="text-[9px] tracking-[0.34em] text-support-night md:text-[11px]"
      >
        {BASELINE_DROP.closer.eyebrow}
      </SpecLine>
      <span aria-hidden className="h-px w-9 bg-border-subtle-night md:w-16" />
    </div>
    <Heading
      as="h2"
      size="none"
      lines={BASELINE_DROP.closer.headingLines}
      className="font-display-narrow mx-auto mt-4 max-w-4xl text-[1.625rem] leading-[1.3] font-[450] tracking-caps md:mt-5 md:text-5xl md:leading-tight"
    />
    <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-support-night md:mt-4 md:text-sm">
      {BASELINE_DROP.closer.body}
    </p>
    <Cta to={BASELINE_DROP.closer.cta.href} variant="brand" size="lg" className="mt-6 md:mt-8">
      {BASELINE_DROP.closer.cta.label}
    </Cta>
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
