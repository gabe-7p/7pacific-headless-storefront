import { Link } from 'react-router';

import { Heading } from '~/components/common/Heading';
import { Button } from '~/components/ui/button';
import { PRODUCT_BRAND_BANNER } from '~/content/product-page';

/**
 * "For Intensity. Not Errands." brand section shown on every PDP — a hero
 * lifestyle image with the headline, community copy, and membership CTA
 * overlaid top-right, followed by a two-image row. Mirrors the live section.
 */
export const BrandBanner = () => {
  const { headingLines, body, cta, images } = PRODUCT_BRAND_BANNER;
  return (
    <section className="bg-white text-neutral-900">
      <div className="relative">
        <img
          src={images.hero}
          alt=""
          loading="lazy"
          className="h-[26rem] w-full object-cover md:h-auto"
        />
        <div className="absolute inset-0 flex justify-center px-6 pt-10 text-center md:justify-end md:pt-16 lg:pt-24 lg:pr-[8%]">
          <div className="max-w-md">
            <Heading as="h2" size="display">
              {headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </Heading>
            <p className="mx-auto mt-4 max-w-sm text-sm text-neutral-600">{body}</p>
            <Button asChild variant="brand" className="mt-6">
              <Link to={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <img
          src={images.bottomLeft}
          alt=""
          loading="lazy"
          className="aspect-square w-full object-cover md:aspect-[4/5]"
        />
        <img
          src={images.bottomRight}
          alt=""
          loading="lazy"
          className="aspect-square w-full object-cover md:aspect-[4/5]"
        />
      </div>
    </section>
  );
};
