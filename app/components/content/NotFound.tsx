import { Image } from '@shopify/hydrogen';

import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { SpecLine } from '~/components/common/SpecLine';
import { MICROCOPY } from '~/content/microcopy';
import { NOT_FOUND_PAGE } from '~/content/not-found';

/**
 * The 404 view, rendered by the root ErrorBoundary. Split editorial: the
 * coordinates spec line and the locked sentence on the left, the Lands End
 * trail photograph on the right (stacked copy-then-photo on mobile). Must stay
 * free of layout-context dependencies — when the root loader itself fails it
 * renders bare, outside PageLayout.
 */
export const NotFound = () => (
  // Live doesn't centre the 404 vertically — it sits a fixed distance below
  // the header, flush with the page gutter.
  // Past --page-max the centring margin is the gutter, so the padding drops
  // to zero — that's what puts live's text 20px from the viewport edge.
  // Both gutters use arbitrary min-widths so Tailwind orders them by width
  // (a named `md:` would sort after `min-[1440px]:` and win at 1440).
  <div className="mx-auto min-h-[60vh] max-w-(--page-max) px-3 pt-[120px] pb-20 min-[768px]:px-5 min-[768px]:pt-[155px] min-[1440px]:px-0">
    <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
      <div>
        <SpecLine className="text-support">
          {NOT_FOUND_PAGE.coordinates} · {NOT_FOUND_PAGE.location}
        </SpecLine>
        {/* 404 copy is locked microcopy (7PA-243) — verbatim. */}
        <Heading
          as="h1"
          size="none"
          variant="quiet"
          className="mt-4 max-w-md text-[22px] leading-snug text-balance md:text-[26px] md:leading-snug"
        >
          {MICROCOPY.notFound}
        </Heading>
        <Cta to="/" size="sm" className="mt-6">
          Homepage
        </Cta>
      </div>
      <Image
        src={NOT_FOUND_PAGE.image.url}
        width={NOT_FOUND_PAGE.image.width}
        height={NOT_FOUND_PAGE.image.height}
        alt={NOT_FOUND_PAGE.image.altText}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="w-full"
      />
    </div>
  </div>
);
