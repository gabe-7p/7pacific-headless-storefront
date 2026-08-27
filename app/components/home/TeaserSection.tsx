import { Image } from '@shopify/hydrogen';
import type { ReactNode } from 'react';

import { Container } from '~/components/common/Container';
import { Countdown } from '~/components/common/Countdown';
import { Heading } from '~/components/common/Heading';
import { SectionHeader } from '~/components/common/SectionHeader';
import { SpecLine } from '~/components/common/SpecLine';

/** Card background — same union shape as CoreValue's media panel. */
export type TeaserCardMedia =
  | { kind: 'image'; url: string; width: number; height: number }
  | { kind: 'video'; src: string; poster?: string };

/** The media + overlay copy for one teaser card; the CTA is passed separately
    (as a render slot) because CTA behavior is per-instance, not content. */
export type TeaserCardContent = {
  eyebrow: string;
  title: string;
  media: TeaserCardMedia;
};

type TeaserSectionCard = {
  content: TeaserCardContent;
  /** The card's Cta element — a Link, external <a>, or dialog-opening button.
      The wrapper owning the behavior supplies it (see DropTwo/BaselineIntro). */
  cta: ReactNode;
};

type TeaserSectionProps = {
  heading: string;
  subtitle?: string;
  /** Omit to render the section without a countdown (e.g. the BASELINE intro —
      the collection is live, there's nothing to count down to). */
  countdown?: { dropIso: string; labels: ReadonlyArray<string> };
  /** Exactly two cards, rendered left/right in the md two-column grid. */
  cards: readonly [TeaserSectionCard, TeaserSectionCard];
};

/**
 * One teaser card: photo or looping video with a centered overlay — mono
 * eyebrow, display title, and the same xs outline Cta the tenet cards use.
 * The shared aspect ratio (not natural media height) is what keeps
 * opposite-orientation media rendering as equal cards. It lives on the
 * WRAPPER, with the media absolutely filling it (object-cover) — Hydrogen's
 * <Image> sets an inline aspect-ratio from its width/height props, which
 * beats any aspect-* class on the img itself.
 */
const Card = ({ content, children }: { content: TeaserCardContent; children: ReactNode }) => (
  <div className="relative aspect-[4/5] overflow-hidden md:aspect-[10/13]">
    {content.media.kind === 'video' ? (
      <video
        src={content.media.src}
        poster={content.media.poster}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    ) : (
      <Image
        src={content.media.url}
        width={content.media.width}
        height={content.media.height}
        alt=""
        loading="lazy"
        sizes="(min-width: 768px) 50vw, 100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
    )}
    {/* Legibility wash over the media — same device as the Hero's, a touch
        stronger (15% vs 10%) for the busier archive shots. */}
    <div className="pointer-events-none absolute inset-0 bg-black/15" />
    {/* text-ink-night on the wrapper so the outline CTA inherits it, the same
        way the tenet cards color their Cta through the card surface. */}
    <div className="text-ink-night absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <SpecLine>{content.eyebrow}</SpecLine>
      <Heading as="h3" size="none" className="mt-2 text-4xl md:text-5xl">
        {content.title}
      </Heading>
      {children}
    </div>
  </div>
);

/**
 * The shared two-card teaser section: section title (+ optional subtitle and
 * countdown) over two photo-overlay cards. Purely presentational — each
 * instance (DropTwo, BaselineIntro) supplies content from `content/home.ts`
 * and its own Cta elements, so per-card behavior stays at the callsite.
 */
export const TeaserSection = ({ heading, subtitle, countdown, cards }: TeaserSectionProps) => (
  <Container className="py-9 md:py-12">
    <SectionHeader heading={heading} subtitle={subtitle} scale="section" className="mb-0" />
    {countdown ? (
      <Countdown dropIso={countdown.dropIso} labels={countdown.labels} className="mt-3" />
    ) : null}
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      {cards.map(({ content, cta }) => (
        <Card key={content.title} content={content}>
          {cta}
        </Card>
      ))}
    </div>
  </Container>
);
