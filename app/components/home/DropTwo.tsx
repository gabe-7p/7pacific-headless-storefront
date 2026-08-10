import { Image } from '@shopify/hydrogen';
import { useState } from 'react';

import { Container } from '~/components/common/Container';
import { Countdown } from '~/components/common/Countdown';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { SectionHeader } from '~/components/common/SectionHeader';
import { SpecLine } from '~/components/common/SpecLine';
import { WaitlistDialog } from '~/components/home/WaitlistDialog';
import { HOME_DROP_TWO } from '~/content/home';

type TeaserCard = (typeof HOME_DROP_TWO.cards)[keyof typeof HOME_DROP_TWO.cards];

/**
 * One teaser card: photo with a centered overlay — mono eyebrow, display
 * title, and the same xs outline Cta the tenet cards use. The shared aspect
 * ratio (not natural image height) is what keeps the two opposite-orientation
 * photos rendering as equal cards.
 */
const Card = ({ card, children }: { card: TeaserCard; children: React.ReactNode }) => (
  <div className="relative overflow-hidden">
    <Image
      src={card.image.url}
      width={card.image.width}
      height={card.image.height}
      alt=""
      loading="lazy"
      sizes="(min-width: 768px) 50vw, 100vw"
      className="aspect-[4/5] w-full object-cover md:aspect-[10/13]"
    />
    {/* Legibility wash over the photo — same device as the Hero's, a touch
        stronger (15% vs 10%) for the busier archive shots. */}
    <div className="pointer-events-none absolute inset-0 bg-black/15" />
    {/* text-ink-night on the wrapper so the outline CTA inherits it, the same
        way the tenet cards color their Cta through the card surface. */}
    <div className="text-ink-night absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <SpecLine>{card.eyebrow}</SpecLine>
      <Heading as="h3" size="none" className="mt-2 text-4xl md:text-5xl">
        {card.title}
      </Heading>
      {children}
    </div>
  </div>
);

/**
 * "Drop 02: FW26" — the First Light teaser directly below the Name/Spec
 * banner: section title, live countdown to the drop, and the two teaser
 * cards (Fall Gear → collection page, Coming Soon → waitlist dialog).
 */
export const DropTwo = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { fallGear, comingSoon } = HOME_DROP_TWO.cards;

  return (
    <Container className="py-9 md:py-12">
      <SectionHeader heading={HOME_DROP_TWO.heading} scale="section" className="mb-0" />
      <Countdown
        dropIso={HOME_DROP_TWO.dropIso}
        labels={HOME_DROP_TWO.countdownLabels}
        className="mt-3"
      />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <Card card={fallGear}>
          <Cta to={fallGear.cta.href} prefetch="intent" size="xs" className="mt-4">
            {fallGear.cta.label}
          </Cta>
        </Card>
        <Card card={comingSoon}>
          <Cta onClick={() => setWaitlistOpen(true)} size="xs" className="mt-4">
            {comingSoon.cta.label}
          </Cta>
        </Card>
      </div>
      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </Container>
  );
};
