import type { ReactNode } from 'react';

import { Container } from '~/components/common/Container';
import { ContentMedia } from '~/components/common/ContentMedia';
import { Countdown } from '~/components/common/Countdown';
import { Heading } from '~/components/common/Heading';
import { Scrim } from '~/components/common/Scrim';
import { SectionHeader } from '~/components/common/SectionHeader';
import { SpecLine } from '~/components/common/SpecLine';
import { IMAGE_SIZES } from '~/lib/imageSizes';
import type { ContentMedia as ContentMediaSource } from '~/lib/shopifyFiles';

/** The media + overlay copy for one teaser card; the CTA is passed separately
    (as a render slot) because CTA behavior is per-instance, not content. */
type TeaserCardContent = {
  eyebrow: string;
  title: string;
  media: ContentMediaSource;
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
 * One teaser card: photo or looping video with a centered overlay. The shared aspect ratio (not natural media height) is what keeps
 * opposite-orientation media rendering as equal cards. It lives on the
 * WRAPPER, with the media absolutely filling it (object-cover) — the app's
 * `common/Image` sets an inline aspect-ratio from its width/height props,
 * which beats any aspect-* class on the img itself.
 */
const Card = ({ content, children }: { content: TeaserCardContent; children: ReactNode }) => (
  <div className="relative aspect-[4/5] overflow-hidden md:aspect-[10/13]">
    <ContentMedia
      media={content.media}
      sizes={IMAGE_SIZES.half}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <Scrim strength="15" />
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
 * The shared two-card teaser section (DropTwo, BaselineIntro): section title
 * (+ optional subtitle and countdown) over two photo-overlay cards.
 */
export const TeaserSection = ({ heading, subtitle, countdown, cards }: TeaserSectionProps) => (
  <Container className="py-9 md:py-12">
    <SectionHeader heading={heading} subtitle={subtitle} scale="section" />
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
