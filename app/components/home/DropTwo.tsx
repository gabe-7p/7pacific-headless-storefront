import { useEffect, useState } from 'react';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { WaitlistDialog } from '~/components/home/WaitlistDialog';
import { HOME_DROP_TWO } from '~/content/home';
import { getTimeLeft, pad2, type TimeLeft } from '~/lib/countdown';

const DROP_TARGET_MS = Date.parse(HOME_DROP_TWO.dropIso);

/**
 * Live countdown to the drop. State starts null so the server render and the
 * first client render agree (the `useScrolledPast` SSR pattern); real values
 * land on mount and tick every second. The row is always fully laid out —
 * two-character placeholders + tabular-nums mean no shift when values arrive.
 */
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(DROP_TARGET_MS, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const values = timeLeft
    ? [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map(pad2)
    : HOME_DROP_TWO.countdownLabels.map(() => '--');

  return (
    <div className="mt-3 flex items-start gap-4 md:gap-6" aria-label="Countdown to the drop">
      {HOME_DROP_TWO.countdownLabels.map((label, index) => (
        <div key={label} className="flex items-start gap-4 md:gap-6">
          {index > 0 && (
            <span aria-hidden className="font-mono text-2xl text-ink md:text-3xl">
              ·
            </span>
          )}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-2xl leading-none text-ink tabular-nums md:text-3xl md:leading-none">
              {values[index]}
              {/* macOS-style insertion caret: keyed on the value so a change
                  re-mounts it and replays the blink, then it rests hidden.
                  Always rendered (fixed 2px) so nothing shifts. Ember accent
                  on the countdown is deliberate, per Gabe (2026-08-03). */}
              <span
                key={values[index]}
                aria-hidden
                className="bg-brand animate-caret-blink ml-1 inline-block h-[0.85em] w-0.5 opacity-0 motion-reduce:animate-none"
              />
            </span>
            <span className="font-mono text-[10px] tracking-spec text-ink uppercase">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

type TeaserCard = (typeof HOME_DROP_TWO.cards)[keyof typeof HOME_DROP_TWO.cards];

/**
 * One teaser card: photo with a centered overlay — mono eyebrow, display
 * title, and a solid `brand-inverse` CTA (a transparent outline was too easy
 * to lose against the photo). The shared aspect ratio (not natural image
 * height) is what keeps the two opposite-orientation photos rendering as
 * equal cards.
 */
const Card = ({ card, children }: { card: TeaserCard; children: React.ReactNode }) => (
  <div className="relative overflow-hidden">
    <img
      src={card.image.url}
      alt=""
      loading="lazy"
      width={card.image.width}
      height={card.image.height}
      className="aspect-[4/5] w-full object-cover md:aspect-[10/13]"
    />
    {/* Legibility wash over the photo (Hero uses the same device). */}
    <div className="pointer-events-none absolute inset-0 bg-black/15" />
    {/* text-ink-night on the wrapper so the outline CTA inherits it, the same
        way the tenet cards color their Cta through the card surface. */}
    <div className="text-ink-night absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs tracking-spec uppercase">{card.eyebrow}</p>
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
      <Heading
        as="h2"
        size="none"
        className="text-5xl leading-[1.05] xl:text-6xl xl:leading-[1.05]"
      >
        {HOME_DROP_TWO.heading}
      </Heading>
      <Countdown />
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
