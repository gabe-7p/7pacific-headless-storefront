import { Image } from '@shopify/hydrogen';

import { Container } from '~/components/common/Container';
import { SpecLine } from '~/components/common/SpecLine';
import type { MetafieldImage } from '~/lib/metafields';

/**
 * The PDP's below-the-fold environmental hero (7PA-231): one full-bleed shot
 * of the piece in use, one caption, per the locked PDP order. Renders only
 * when the `custom.environmental_hero` metafield is set — the imagery itself
 * arrives with the photography program (7PA-236).
 */
export const EnvironmentalHero = ({
  image,
  caption,
}: {
  image: MetafieldImage;
  caption?: string | null;
}) => (
  <section className="bg-field">
    <Image data={image} sizes="100vw" className="h-auto w-full object-cover" />
    {caption && (
      <Container>
        <SpecLine className="py-3 text-support">{caption}</SpecLine>
      </Container>
    )}
  </section>
);
