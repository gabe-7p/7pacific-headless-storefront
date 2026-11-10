import { useEffect, useState } from 'react';

import { Caret } from '~/components/common/Readout';
import { SpecLine } from '~/components/common/SpecLine';
import { cn } from '~/lib/cn';
import { getTimeLeft, pad2, TIME_LEFT_UNITS, type TimeLeft } from '~/lib/countdown';

/**
 * Size tiers — full class strings per tier.
 */
const SIZES = {
  /** Homepage teaser tier. */
  md: {
    root: 'gap-4 md:gap-6',
    group: 'gap-4 md:gap-6',
    separator: 'text-2xl md:text-3xl',
    digits: 'text-2xl leading-none md:text-3xl',
    label: 'text-3xs',
  },
  /** Drop-page hero tier. */
  xl: {
    root: 'gap-5 md:gap-8',
    group: 'gap-5 md:gap-8',
    separator: 'text-3xl md:text-5xl',
    digits: 'text-4xl leading-none md:text-6xl',
    label: 'text-3xs md:text-xs',
  },
} as const;

/** Type colour — `night` sits over dark photography (the FIRST LIGHT backdrop). */
const TONES = {
  day: 'text-ink',
  night: 'text-ink-night',
} as const;

type CountdownProps = {
  /** ISO datetime with an explicit offset, so Date.parse is deterministic
      on server and client (e.g. HOME_DROP_TWO.dropIso). */
  dropIso: string;
  /** Unit labels in display order: days, hours, minutes, seconds. */
  labels: ReadonlyArray<string>;
  size?: keyof typeof SIZES;
  tone?: keyof typeof TONES;
  className?: string;
};

/**
 * Live countdown to a drop. State starts null so the server render and the
 * first client render agree (the `useScrolledPast` SSR pattern); real values
 * land on mount and tick every second. `getTimeLeft` clamps at zero, so past
 * the target the timer holds at 00 · 00 · 00 · 00.
 */
export const Countdown = ({
  dropIso,
  labels,
  size = 'md',
  tone = 'day',
  className,
}: CountdownProps) => {
  const [state, setState] = useState<{ timeLeft: TimeLeft | null; caretIndex: number }>({
    timeLeft: null,
    caretIndex: 0,
  });

  useEffect(() => {
    const targetMs = Date.parse(dropIso);
    const tick = () =>
      setState((prev) => {
        const timeLeft = getTimeLeft(targetMs, Date.now());
        const prevTimeLeft = prev.timeLeft;
        const changed = prevTimeLeft
          ? TIME_LEFT_UNITS.findIndex((unit) => timeLeft[unit] !== prevTimeLeft[unit])
          : 0;
        // Nothing changed (the countdown is holding at zero): keep the old
        // index — the caret's key stays the same, so it doesn't replay.
        return { timeLeft, caretIndex: changed === -1 ? prev.caretIndex : changed };
      });
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dropIso]);

  const { timeLeft, caretIndex } = state;
  const values = timeLeft
    ? TIME_LEFT_UNITS.map((unit) => pad2(timeLeft[unit]))
    : labels.map(() => '--');
  const tier = SIZES[size];
  const color = TONES[tone];

  return (
    <div
      className={cn('flex items-start', tier.root, className)}
      aria-label="Countdown to the drop"
    >
      {labels.map((label, index) => (
        <div key={label} className={cn('flex items-start', tier.group)}>
          {index > 0 && (
            <span aria-hidden className={cn('font-mono', color, tier.separator)}>
              ·
            </span>
          )}
          <div className="flex flex-col gap-1">
            <span className={cn('relative font-mono tabular-nums', color, tier.digits)}>
              {/* The single insertion caret, keyed on position + value so a
                  change re-mounts it and replays one flick, then it rests
                  hidden. Absolutely positioned so it never shifts the digits.
                  Ember on the countdown is deliberate, per Gabe (2026-08-03). */}
              {index === caretIndex && timeLeft && (
                <Caret
                  key={`${caretIndex}-${values[caretIndex]}`}
                  className="absolute top-1/2 -left-1.5 -translate-y-1/2 motion-reduce:animate-none"
                />
              )}
              {values[index]}
            </span>
            <SpecLine as="span" className={cn(color, tier.label)}>
              {label}
            </SpecLine>
          </div>
        </div>
      ))}
    </div>
  );
};
