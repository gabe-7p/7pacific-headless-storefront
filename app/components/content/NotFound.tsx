import { Image } from '@shopify/hydrogen';

import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { FadeIn, MotionProvider, SettleIn } from '~/components/common/Motion';
import { SpecLine } from '~/components/common/SpecLine';
import { MICROCOPY } from '~/content/microcopy';
import { NOT_FOUND_PAGE } from '~/content/not-found';

/**
 * The 404 view, rendered by the root ErrorBoundary. Split editorial: the
 * coordinates spec line and the locked sentence on the left, the Lands End
 * trail photograph on the right (stacked copy-then-photo on mobile). Must stay
 * free of layout-context dependencies — when the root loader itself fails it
 * renders bare, outside PageLayout (MotionProvider is self-contained here for
 * that reason).
 *
 * Entrance choreography: the coordinates type on like a GPS acquiring a fix
 * (an Ember caret flicks twice, then rests — the page's one Ember moment),
 * the sentence and CTA rise in behind it, and the photograph settles from
 * 1.04 to rest. Everything ends still; nothing loops.
 */
export const NotFound = () => (
  <MotionProvider>
    {/* Live doesn't centre the 404 vertically — it sits a fixed distance below
        the header, flush with the page gutter.
        Past --page-max the centring margin is the gutter, so the padding drops
        to zero — that's what puts live's text 20px from the viewport edge.
        Both gutters use arbitrary min-widths so Tailwind orders them by width
        (a named `md:` would sort after `min-[1440px]:` and win at 1440). */}
    <div className="mx-auto min-h-[60vh] max-w-(--page-max) px-3 pt-[120px] pb-20 min-[768px]:px-5 min-[768px]:pt-[155px] min-[1440px]:px-0">
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <SpecLine className="text-support">
            {/* steps(30) in --animate-type-on ≈ this string's length — keep
                them roughly in sync if the readout changes. */}
            <span className="animate-type-on inline-block motion-reduce:animate-none">
              {NOT_FOUND_PAGE.coordinates} · {NOT_FOUND_PAGE.location}
            </span>
            {/* Insertion caret lands after the type-on (delay = its duration),
                flicks twice, rests hidden. `!` so delay/count survive the
                animate-caret-blink shorthand (see ColorSwatches). */}
            <span
              aria-hidden
              className="bg-brand animate-caret-blink ml-1 inline-block h-[0.85em] w-0.5 align-middle opacity-0 [animation-delay:0.6s]! [animation-iteration-count:2]! motion-reduce:hidden"
            />
          </SpecLine>
          <FadeIn delay={0.15}>
            {/* 404 copy is locked microcopy (7PA-243) — verbatim. */}
            <Heading
              as="h1"
              size="none"
              variant="quiet"
              className="mt-4 max-w-md text-[22px] leading-snug text-balance md:text-[26px] md:leading-snug"
            >
              {MICROCOPY.notFound}
            </Heading>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Cta to="/" size="sm" className="mt-6">
              Homepage
            </Cta>
          </FadeIn>
        </div>
        {/* overflow-hidden clips SettleIn's 1.04 overshoot at the cell edge. */}
        <div className="overflow-hidden">
          <SettleIn delay={0.1}>
            <Image
              src={NOT_FOUND_PAGE.image.url}
              width={NOT_FOUND_PAGE.image.width}
              height={NOT_FOUND_PAGE.image.height}
              alt={NOT_FOUND_PAGE.image.altText}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="w-full"
            />
          </SettleIn>
        </div>
      </div>
    </div>
  </MotionProvider>
);
