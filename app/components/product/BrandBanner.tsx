import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { LazyVideo } from '~/components/common/LazyVideo';
import { Scrim } from '~/components/common/Scrim';
import { PRODUCT_BRAND_BANNER } from '~/content/product-page';

/**
 * "For Intensity. Not Errands." brand section shown on every PDP — a wide
 * training loop with the headline, community copy, and membership CTA
 * overlaid top-right.
 */
export const BrandBanner = () => {
  const { headingLines, body, cta, video } = PRODUCT_BRAND_BANNER;
  return (
    // Live's `.bottom-product-photography`: inside page-width (not full-bleed)
    // with 20px / 60px vertical padding, so the band breathes against the dark
    // Tech Stack above and the recommendations below.
    <section className="bg-field py-5 md:py-15">
      <Container>
        {/* Bounded rather than natural height: the 16:9 source would run
            ~765px tall at page width and dominate the page. The loop fills
            the box absolutely so its own ratio never sizes it. */}
        <div className="relative h-[22rem] overflow-hidden bg-field-night text-ink-night md:h-[30rem] lg:h-[34rem]">
          <LazyVideo
            src={video.src}
            poster={video.poster}
            label={video.label}
            className="absolute inset-0 size-full object-cover"
          />
          {/* The footage is dark already, so the copy renders in the night tokens. */}
          <Scrim strength="15" />
          <div className="absolute inset-0 flex justify-center px-6 pt-10 text-center md:justify-end md:pt-14 lg:pr-[6%]">
            <div className="max-w-md">
              {/* Live: 60px / 500 / -0.02em (tight negative tracking). */}
              <Heading
                as="h2"
                size="none"
                lines={headingLines}
                className="text-[2.25rem] leading-[1.1] tracking-[-0.02em] md:text-[3.4rem]"
              />
              <p className="mx-auto mt-4 max-w-sm text-sm text-support-night">{body}</p>
              {/* Secondary — the PDP's one Ember moment is Add to Cart. */}
              <Cta to={cta.href} className="mt-6">
                {cta.label}
              </Cta>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
