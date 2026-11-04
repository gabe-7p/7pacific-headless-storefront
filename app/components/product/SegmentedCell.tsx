/**
 * Live's segmented control, shared by the PDP size bar and the size guide's
 * unit toggle: 9.6px caps at 0.3em, cells butted on one hairline. Each surface
 * adds its own sizing and cursor. `SEGMENT_LABEL` is the type tier alone, for a
 * label that sits beside a cell rather than in one (the cart drawer's subtotal).
 */
export const SEGMENT_LABEL = 'text-[9.6px] tracking-[0.3em] uppercase';
export const SEGMENT_CELL = `border font-semibold ${SEGMENT_LABEL}`;
export const SEGMENT_SELECTED = 'z-10 border-ink bg-field-night text-ink-night';
export const SEGMENT_IDLE = 'border-border-subtle text-ink hover:border-ink';
/** Overlaps a cell onto its neighbour so the pair shares one hairline. */
export const SEGMENT_JOIN = '-ml-px transition-colors first:ml-0';
