import { cn } from '~/lib/cn';

const STRENGTHS = {
  /** Live's hero overlay, verbatim. */
  '10': 'bg-scrim/10',
  /** The busier shots: teaser cards, the Roster bands, the PDP banner. */
  '15': 'bg-scrim/15',
  /** Our Story's hero, under the transparent header. */
  '25': 'bg-scrim/25',
} as const;

/**
 * The flat legibility wash between full-bleed media and the copy over it. Fills
 * its `relative` parent and never eats a click meant for what's beneath.
 */
export const Scrim = ({ strength }: { strength: keyof typeof STRENGTHS }) => (
  <div aria-hidden className={cn('pointer-events-none absolute inset-0', STRENGTHS[strength])} />
);
