import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Button } from '~/components/ui/button';
import { PDP_BOTTOM_PHOTOGRAPHY } from '~/content/pdp-sections';

/**
 * Brand photography + membership CTA shown near the bottom of every PDP
 * (live `bottom-product-photography` section): a three-image strip plus the
 * "For Intensity. Not Errands." message.
 */
export const BottomPhotography = () => {
  const { headingLines, body, cta, images } = PDP_BOTTOM_PHOTOGRAPHY;
  return (
    <section className="bg-neutral-50 py-14 md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {images.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <Heading as="h2" size="lg">
            {headingLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Heading>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-600">{body}</p>
          <Button asChild variant="brand" className="mt-6">
            <Link to={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};
