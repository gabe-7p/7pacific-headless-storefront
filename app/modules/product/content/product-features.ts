/**
 * PDP feature-carousel content, keyed by product type (mirrors the live
 * `product-photography-section`). Captions are type-specific marketing copy
 * paired with the same Shopify Files imagery the live theme uses.
 *
 * NOTE: shorts are fully populated from the live PDP. Tee/hat feature sets can
 * be filled in the same shape as their copy is confirmed.
 */
import type { ProductType } from '~/modules/product/lib/colorMap';

const CDN = 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files';

export type ProductFeature = {
  title: string;
  caption: string;
  image: string;
};

export const PRODUCT_FEATURES: Partial<Record<ProductType, ReadonlyArray<ProductFeature>>> = {
  short: [
    {
      title: 'Laser-Cut Perforations',
      caption: 'Precision venting where you need it most.',
      image: `${CDN}/mountain_mist_short_stretch.jpg`,
    },
    {
      title: '0% Friction',
      caption: 'Built to glide — held in place by grip-tape liners.',
      image: `${CDN}/mountain_mist_short_grip_tape.jpg`,
    },
    {
      title: 'Training Effort',
      caption: 'Made to wear for training, not errands.',
      image: `${CDN}/mountain_mist_short_phone_pocket.jpg`,
    },
  ],
};
