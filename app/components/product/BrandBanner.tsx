import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { PRODUCT_BRAND_BANNER } from '~/content/product-page';

/**
 * "For Intensity. Not Errands." brand section shown on every PDP — a hero
 * lifestyle image with the headline, community copy, and membership CTA
 * overlaid top-right, followed by a two-image row. Mirrors the live section.
 */
export const BrandBanner = () => {
  const { headingLines, body, cta, images } = PRODUCT_BRAND_BANNER;
  return (
    // Live's `.bottom-product-photography`: inside page-width (not full-bleed)
    // with 20px / 60px vertical padding, so the row breathes against the dark
    // Tech Stack above and the recommendations below.
    <section className="bg-field py-5 text-ink md:py-15">
      <Container>
        {/* Bounded rather than natural height: contained, the source images are
            tall enough that `h-auto` let this one dominate the page. */}
        <div className="relative mb-4 md:mb-5">
          <img
            src={images.hero}
            alt=""
            loading="lazy"
            className="h-[22rem] w-full object-cover md:h-[30rem] lg:h-[34rem]"
          />
          <div className="absolute inset-0 flex justify-center px-6 pt-10 text-center md:justify-end md:pt-14 lg:pr-[6%]">
            <div className="max-w-md">
              {/* Live: 60px / 500 / -0.02em (tight negative tracking). */}
              <Heading
                as="h2"
                size="none"
                className="text-[2.25rem] leading-[1.1] tracking-[-0.02em] md:text-[3.4rem]"
              >
                {headingLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </Heading>
              <p className="mx-auto mt-4 max-w-sm text-sm text-support">{body}</p>
              {/* Secondary — the PDP's one Ember moment is Add to Cart (7PA-230). */}
              <Cta to={cta.href} className="mt-6">
                {cta.label}
              </Cta>
            </div>
          </div>
        </div>
        {/* Live's 20px gutter (15px on mobile). The desktop crop is 4:3 rather
            than the old 4:5 so the pair reads as a band, not two tall panels. */}
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <img
            src={images.bottomLeft}
            alt=""
            loading="lazy"
            className="aspect-square w-full object-cover md:aspect-[4/3]"
          />
          <img
            src={images.bottomRight}
            alt=""
            loading="lazy"
            className="aspect-square w-full object-cover md:aspect-[4/3]"
          />
        </div>
      </Container>
    </section>
  );
};
