import { useEffect, useState } from 'react';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { WaitlistDialog } from '~/components/home/WaitlistDialog';
import { HOME_DROP_TWO } from '~/content/home';
import { getTimeLeft, pad2, type TimeLeft } from '~/lib/countdown';

const DROP_TARGET_MS = Date.parse(HOME_DROP_TWO.dropIso);

/** Display order of the countdown units, leftmost first. */
const UNIT_KEYS = ['days', 'hours', 'minutes', 'seconds'] as const;

/**
 * Live countdown to the drop. State starts null so the server render and the
 * first client render agree (the `useScrolledPast` SSR pattern); real values
 * land on mount and tick every second. The row is always fully laid out —
 * two-character placeholders + tabular-nums mean no shift when values arrive.
 *
 * Each tick also records which unit changed furthest to the left, and ONE
 * macOS-style Ember insertion caret renders to that number's left: seconds
 * most ticks, but a minute rollover moves the caret to MIN, and so on.
 */
const Countdown = () => {
  const [state, setState] = useState<{ timeLeft: TimeLeft | null; caretIndex: number }>({
    timeLeft: null,
    caretIndex: 0,
  });

  useEffect(() => {
    const tick = () =>
      setState((prev) => {
        const timeLeft = getTimeLeft(DROP_TARGET_MS, Date.now());
        const prevTimeLeft = prev.timeLeft;
        const changed = prevTimeLeft
          ? UNIT_KEYS.findIndex((unit) => timeLeft[unit] !== prevTimeLeft[unit])
          : 0;
        // Nothing changed (the countdown is holding at zero): keep the old
        // index — the caret's key stays the same, so it doesn't replay.
        return { timeLeft, caretIndex: changed === -1 ? prev.caretIndex : changed };
      });
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const { timeLeft, caretIndex } = state;
  const values = timeLeft
    ? UNIT_KEYS.map((unit) => pad2(timeLeft[unit]))
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
            <span className="relative font-mono text-2xl leading-none text-ink tabular-nums md:text-3xl md:leading-none">
              {/* The single insertion caret, keyed on position + value so a
                  change re-mounts it and replays one flick, then it rests
                  hidden. Absolutely positioned so it never shifts the digits.
                  Ember on the countdown is deliberate, per Gabe (2026-08-03). */}
              {index === caretIndex && timeLeft && (
                <span
                  key={`${caretIndex}-${values[caretIndex]}`}
                  aria-hidden
                  className="bg-brand animate-caret-blink absolute top-1/2 -left-1.5 h-[0.85em] w-0.5 -translate-y-1/2 opacity-0 motion-reduce:animate-none"
                />
              )}
              {values[index]}
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
 * title, and the same xs outline Cta the tenet cards use. The shared aspect
 * ratio (not natural image height) is what keeps the two opposite-orientation
 * photos rendering as equal cards.
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
