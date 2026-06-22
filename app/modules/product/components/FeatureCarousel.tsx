import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { PRODUCT_FEATURES } from '~/modules/product/content/product-features';
import { getProductType } from '~/modules/product/lib/colorMap';

/**
 * PDP feature carousel (live `product-photography-section`) — a horizontal,
 * scroll-snapping row of feature photos with title + caption overlays, driven
 * by the product's type. Renders nothing when the type has no feature set.
 */
export const FeatureCarousel = ({ handle }: { handle: string }) => {
  const type = getProductType(handle);
  const features = type ? PRODUCT_FEATURES[type] : undefined;
  if (!features || features.length === 0) return null;

  return (
    <Container className="py-14 md:py-20">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
        {features.map((feature) => (
          <figure
            key={feature.title}
            className="relative aspect-[3/4] w-[80%] flex-none snap-start overflow-hidden md:w-auto"
          >
            <img
              src={feature.image}
              alt={feature.title}
              loading="lazy"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
              <Heading as="h3" size="sm">
                {feature.title}
              </Heading>
              <p className="mt-1 text-sm text-white/85">{feature.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
};
