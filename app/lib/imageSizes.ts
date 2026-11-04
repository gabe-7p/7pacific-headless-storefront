/**
 * `sizes` presets for `common/Image` — the slot widths the layouts actually
 * use. A slot that matches one of these takes the preset; a one-off slot
 * (the PDP's 75vw mobile hero, CartLineItem's `80px`) keeps its own string at the call site. Named by the slot's share of the viewport, not by
 * the component, so a new surface can pick by shape.
 */
export const IMAGE_SIZES = {
  /** 2-up mobile / 3-up desktop product grid. */
  card: '(min-width: 768px) 33vw, 50vw',
  /** A half-width panel from `md` up, full-bleed below. */
  half: '(min-width: 768px) 50vw, 100vw',
  /** A half-width cell at every viewport (Roster's side-by-side bakery-run crops). */
  halfAlways: '50vw',
  /** A two-thirds panel from `lg` up. */
  twoThirds: '(min-width: 1024px) 66vw, 100vw',
  /** Full-bleed bands and heroes. */
  full: '100vw',
  /** A `common/Scroller` item: mirrors its basis (78%, 45% from `sm`, three up from
      `lg`, capped by --page-max). Change the two together. */
  scroller3:
    '(min-width: 1024px) min(calc((100vw - 6rem) / 3), 435px), (min-width: 640px) 45vw, 78vw',
  /** The 384px dialog side panel, hidden below `sm`. */
  dialogPanel: '(min-width: 640px) 384px, 0px',
} as const;

/** An explicit srcset ladder: `imageWidths(400, 100, 16)` → 400, 500, … 1900. */
export const imageWidths = (start: number, step: number, count: number): Array<number> =>
  Array.from({ length: count }, (_, index) => start + index * step);
