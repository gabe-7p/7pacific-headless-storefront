import { Link } from 'react-router';

import { HOME_NAME_SPEC_BANNER } from '~/content/home';
import { cn } from '~/lib/cn';

/**
 * One full set of the four cells. The track renders it 2×SETS_PER_HALF times
 * so each -50% half is wider than any viewport (one set alone is ~1000px, so
 * a bare pair left a visible gap on wide screens at the animation's start
 * offset); all copies after the first are aria-hidden and untabbable so
 * assistive tech and keyboard users see each link once. Every cell carries a
 * border-r, so the wrap point gets the same 1px Zinc divider as the interior
 * joins — no visible seam.
 */
const CellSet = ({
  ariaHidden = false,
  className,
}: {
  ariaHidden?: boolean;
  className?: string;
}) => {
  const tabIndex = ariaHidden ? -1 : undefined;
  return (
    <div aria-hidden={ariaHidden || undefined} className={cn('flex', className)}>
      {HOME_NAME_SPEC_BANNER.cells.map((cell) => (
        <Link
          key={cell.href}
          to={cell.href}
          tabIndex={tabIndex}
          className="border-border-subtle flex flex-col gap-1 border-r px-6 py-2"
        >
          {/* Product-name tier at the card-title scale (18px, 20px from 860 —
              one step under the prototype's 24px per Gabe 2026-07-24): Archivo
              Condensed BOLD (700) per the approved prototype — the banner's
              one deliberate deviation from the site's 500-only display weight.
              Not a Heading: these are marquee cells (duplicated, aria-hidden
              copy included), not document headings. */}
          <span className="font-display text-ink tracking-product text-lg leading-[1.15] font-bold whitespace-nowrap uppercase min-[860px]:text-xl min-[860px]:leading-[1.15]">
            {cell.name}
          </span>
          <span className="font-mono text-support tracking-spec text-[10px] whitespace-nowrap uppercase">
            {cell.spec.join(' · ')}
            {' · '}
            <span className="text-ink font-medium">{cell.price}</span>
          </span>
        </Link>
      ))}
      {/* Deliberately not `Cta`: the approved banner CTA is the bare mono
          "Shop All //" device with no chevron. text-brand (Ember) is allowed
          here and ONLY here on the banner — hard brand rule. */}
      <Link
        to={HOME_NAME_SPEC_BANNER.cta.href}
        tabIndex={tabIndex}
        className="border-border-subtle text-brand tracking-caps flex items-center border-r px-6 font-mono text-[11px] font-medium uppercase"
      >
        {HOME_NAME_SPEC_BANNER.cta.label}
      </Link>
    </div>
  );
};

/** Sets per -50% half — 4 sets ≈ 4000px, covering up to 4K viewports. */
const SETS_PER_HALF = 4;

/**
 * The Name/Spec product banner (approved prototype, Jul 2026): a full-bleed,
 * one-row marquee directly below the homepage hero — three product-family
 * cells (display name over a mono spec line) plus a Shop All cell, scrolling
 * rightward on a 50s loop that keeps rolling under the cursor (no hover-pause,
 * per Gabe 2026-07-24); reduced-motion users get a static, horizontally
 * scrollable strip instead (the duplicate sets are dropped so nothing repeats).
 */
export const NameSpecBanner = () => (
  <section
    aria-label="Featured products"
    className="bg-field border-border-subtle overflow-hidden border-y motion-reduce:overflow-x-auto"
  >
    <div className="animate-marquee-right flex w-max will-change-transform motion-reduce:animate-none">
      <CellSet />
      {/* 2×SETS_PER_HALF sets total: the content repeats identically every
          set, so the keyframes' -50% shift (= SETS_PER_HALF sets) lands on
          the same pixels. Hidden under reduced motion, leaving the single
          accessible set as the static scrollable strip. */}
      {Array.from({ length: SETS_PER_HALF * 2 - 1 }, (_, i) => (
        <CellSet key={i} ariaHidden className="motion-reduce:hidden" />
      ))}
    </div>
  </section>
);
