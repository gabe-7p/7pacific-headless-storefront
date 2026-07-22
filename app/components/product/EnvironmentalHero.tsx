import { Image } from '@shopify/hydrogen';

import { Container } from '~/components/common/Container';
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
        <p className="tracking-spec py-3 font-mono text-xs text-support uppercase">{caption}</p>
      </Container>
    )}
  </section>
);
