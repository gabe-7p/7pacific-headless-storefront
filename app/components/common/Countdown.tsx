import { useEffect, useState } from 'react';

import { cn } from '~/lib/cn';
import { getTimeLeft, pad2, type TimeLeft } from '~/lib/countdown';

const UNIT_KEYS = ['days', 'hours', 'minutes', 'seconds'] as const;

/**
 * Size tiers — full class strings per tier because `text-*` also re-sets
 * line-height, so `leading-none` must repeat next to every size step (see
 * common-pitfalls.md).
 */
const SIZES = {
  /** Homepage teaser tier. */
  md: {
    root: 'gap-4 md:gap-6',
    group: 'gap-4 md:gap-6',
    separator: 'text-2xl md:text-3xl',
    digits: 'text-2xl leading-none md:text-3xl md:leading-none',
    label: 'text-[10px]',
  },
  /** Drop-page hero tier. */
  xl: {
    root: 'gap-5 md:gap-8',
    group: 'gap-5 md:gap-8',
    separator: 'text-3xl md:text-5xl',
    digits: 'text-4xl leading-none md:text-6xl md:leading-none',
    label: 'text-[10px] md:text-xs',
  },
} as const;

type CountdownProps = {
  /** ISO datetime with an explicit offset, so Date.parse is deterministic
      on server and client (e.g. HOME_DROP_TWO.dropIso). */
  dropIso: string;
  /** Unit labels in display order: days, hours, minutes, seconds. */
  labels: ReadonlyArray<string>;
  size?: keyof typeof SIZES;
  className?: string;
};

/**
 * Live countdown to a drop. State starts null so the server render and the
 * first client render agree (the `useScrolledPast` SSR pattern); real values
 * land on mount and tick every second. The row is always fully laid out —
 * two-character placeholders + tabular-nums mean no shift when values arrive.
 * `getTimeLeft` clamps at zero, so past the target the timer holds at
 * 00 · 00 · 00 · 00.
 *
 * Each tick also records which unit changed furthest to the left, and ONE
 * macOS-style Ember insertion caret renders to that number's left: seconds
 * most ticks, but a minute rollover moves the caret to MIN, and so on.
 */
export const Countdown = ({ dropIso, labels, size = 'md', className }: CountdownProps) => {
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
          ? UNIT_KEYS.findIndex((unit) => timeLeft[unit] !== prevTimeLeft[unit])
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
  const values = timeLeft ? UNIT_KEYS.map((unit) => pad2(timeLeft[unit])) : labels.map(() => '--');
  const tier = SIZES[size];

  return (
    <div
      className={cn('flex items-start', tier.root, className)}
      aria-label="Countdown to the drop"
    >
      {labels.map((label, index) => (
        <div key={label} className={cn('flex items-start', tier.group)}>
          {index > 0 && (
            <span aria-hidden className={cn('font-mono text-ink', tier.separator)}>
              ·
            </span>
          )}
          <div className="flex flex-col gap-1">
            <span className={cn('relative font-mono text-ink tabular-nums', tier.digits)}>
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
            <span className={cn('font-mono tracking-spec text-ink uppercase', tier.label)}>
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
