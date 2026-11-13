import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Eyebrow } from '~/components/common/Eyebrow';
import { GradedMedia } from '~/components/common/GradedMedia';
import { Heading } from '~/components/common/Heading';
import { MediaSlot, type MediaSlotSource } from '~/components/common/MediaSlot';
import { SectionHeader } from '~/components/common/SectionHeader';
import { IMAGE_SIZES } from '~/lib/imageSizes';

/**
 * The editorial sections the drop pages share (/drops/baseline,
 * /drops/first-light): the stat receipts, the training standard, the pieces
 * grid and the dark closer. Each renders the content object it is handed
 * (`BASELINE_DROP.*`, `FIRST_LIGHT.*`). Ember repeats on these pages by
 * sanctioned exception (ui-components.md).
 */

type DropStat = { label: string; value: string; accent?: string };

export type DropReceiptsContent = {
  heading: string;
  subtitle: string;
  stats: ReadonlyArray<DropStat>;
};

export type DropStandardContent = {
  heading: string;
  subtitle: string;
  banner: MediaSlotSource;
  days: ReadonlyArray<{ index: string; title: string; body: string; media: MediaSlotSource }>;
};

type DropPiece = { name: string; price: string; href: string; media: MediaSlotSource };

export type DropPiecesContent = {
  heading: string;
  subtitle: string;
  shopLabel: string;
  products: ReadonlyArray<DropPiece>;
};

export type DropCloserContent = {
  eyebrow: string;
  headingLines: ReadonlyArray<string>;
  body: string;
  cta: { label: string; href: string };
};

/** One dark stat tile — the figure and its label pinned to the bottom.
    No fixed aspect: the top padding is all the headroom the tile gets, so
    the row stays a compact stat band; the grid levels the four tiles and
    the bottom-pinned figures keep one shared baseline. */
const StatCard = ({ stat }: { stat: DropStat }) => (
  <div className="flex flex-col justify-end bg-field-night px-4 pt-8 pb-4 md:px-5 md:pt-10 md:pb-6">
    {/* Archivo Light figure with its label beside it, items-end (not
        baseline): a label that wraps grows upward from the shared bottom
        edge, so every card's figure sits at the same height; the label's pb
        optically re-seats its baseline on the figure's. */}
    <p className="font-archivo flex items-end gap-x-2 text-4xl leading-none font-light text-ink-night md:gap-x-2.5 md:text-6xl">
      <span className="shrink-0">
        {stat.value}
        {stat.accent ? <span className="text-brand">{stat.accent}</span> : null}
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

/** "PROVING THE PERFORMANCE" — the four earned-number cards. */
export const DropReceipts = ({ content }: { content: DropReceiptsContent }) => (
  <Container className="pt-12 pb-11 md:pt-18 md:pb-16">
    <SectionHeader heading={content.heading} subtitle={content.subtitle} scale="campaign" />
    <div className="mt-7 grid grid-cols-2 gap-1 md:mt-12 md:grid-cols-4 md:gap-1.5">
      {content.stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  </Container>
);

/** The training standard — header, wide training band, and the three day cards. */
export const DropStandard = ({ content }: { content: DropStandardContent }) => (
  <section>
    <Container className="pt-12 pb-6 md:pt-18 md:pb-11">
      <SectionHeader heading={content.heading} subtitle={content.subtitle} scale="campaign" />
    </Container>
    {/* The band is the loop at 70% of its height. */}
    <GradedMedia
      media={content.banner}
      ratio="loop"
      sizes={IMAGE_SIZES.full}
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
      {content.days.map((day) => (
        <div key={day.index} className="group flex flex-col">
          <GradedMedia media={day.media} ratio="landscape" sizes={IMAGE_SIZES.third} />
          {/* Hairline frame closes around the caption — the photo caps the
              top, and from md only the first frame keeps its left border so
              adjacent frames share one hairline. flex-1 levels the three
              frames to the tallest. */}
          <div className="flex-1 border-x border-b border-border-subtle px-4 pt-3.5 pb-5 md:-mr-px md:border-l-0 md:px-5 md:pt-4 md:pb-6 md:group-first:border-l md:group-last:mr-0">
            <p className="text-3xs font-bold tracking-caps text-ink uppercase md:text-2xs">
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

/** One product tile: 4:5 photo, campaign name + price, Ember Shop link. */
const PieceCell = ({
  piece,
  shopLabel,
  sizes,
  className,
}: {
  piece: DropPiece;
  shopLabel: string;
  sizes: string;
  className?: string;
}) => (
  <div className={className}>
    <MediaSlot media={piece.media} ratio="product" sizes={sizes} />
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 pt-2.5 pb-4 md:px-4.5 md:pt-3.5 md:pb-5">
      {/* Product names ride the campaign Archivo, not the mono spec strip. */}
      <span className="font-archivo text-2xs tracking-caps text-ink uppercase md:text-xs">
        {piece.name} <span className="text-support">{piece.price}</span>
      </span>
      <Cta to={piece.href} variant="brand-text" size="xs" className="px-0 text-brand">
        {shopLabel}
      </Cta>
    </div>
  </div>
);

/** The three-product grid (the lead piece full-width on mobile, the other
    two 2-up; a single row of three from md). */
export const DropPieces = ({ content }: { content: DropPiecesContent }) => (
  <section>
    <Container className="pt-12 pb-6 md:pt-16 md:pb-10">
      <SectionHeader heading={content.heading} subtitle={content.subtitle} scale="campaign" />
    </Container>
    {/* Separate tiles split by the same hairline-thin gaps as the day
        photos; the lead piece goes full-width on mobile. */}
    <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-1.5">
      {content.products.map((piece, index) => (
        <PieceCell
          key={piece.name}
          piece={piece}
          shopLabel={content.shopLabel}
          sizes={index === 0 ? IMAGE_SIZES.third : IMAGE_SIZES.card}
          className="first:col-span-2 md:first:col-span-1"
        />
      ))}
    </div>
  </section>
);

/** The dark centered closer — centered while the content sections above are
    left-aligned. Its CTA is the page's one Ember `brand` button. */
export const DropCloser = ({ content }: { content: DropCloserContent }) => (
  <section className="bg-field-night py-13 text-center text-ink-night md:py-20">
    <Container>
      {/* Campaign Archivo, matching the stat labels. The 9px phone size is a
          one-off, below the type scale. */}
      <p className="font-archivo text-[9px] tracking-[0.34em] text-support-night uppercase md:text-2xs">
        {content.eyebrow}
      </p>
      <Heading
        as="h2"
        variant="campaign"
        size="none"
        lines={content.headingLines}
        className="mx-auto mt-4 max-w-4xl text-[1.625rem] leading-[1.3] md:mt-5 md:text-5xl md:leading-tight"
      />
      <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-support-night md:mt-4 md:text-sm">
        {content.body}
      </p>
      <Cta to={content.cta.href} variant="brand" size="lg" className="mt-6 md:mt-8">
        {content.cta.label}
      </Cta>
    </Container>
  </section>
);
