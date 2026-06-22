/**
 * PDP feature-carousel content, keyed by product type (mirrors the live
 * `product-photography-section`). Captions are type-specific marketing copy
 * paired with the same Shopify Files imagery the live theme uses.
 *
 * NOTE: shorts are fully populated from the live PDP. Tee/hat feature sets can
 * be filled in the same shape as their copy is confirmed.
 */
import { fileUrl } from '~/lib/shopify';
import type { ProductType } from '~/modules/product/lib/colorMap';

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
      image: fileUrl('mountain_mist_short_stretch.jpg'),
    },
    {
      title: '0% Friction',
      caption: 'Built to glide — held in place by grip-tape liners.',
      image: fileUrl('mountain_mist_short_grip_tape.jpg'),
    },
    {
      title: 'Training Effort',
      caption: 'Made to wear for training, not errands.',
      image: fileUrl('mountain_mist_short_phone_pocket.jpg'),
    },
  ],
};

export type TechRow = {
  label: string;
  /** One or more lines of detail rendered under the row. */
  lines: ReadonlyArray<string>;
};

/**
 * PDP tech-stack accordion rows, keyed by product type (live `tech-stack`
 * section, which is product-type conditional). Shorts populated from live;
 * DETAILS/CARE are shared, MATERIALS differs by type.
 */
const SHARED_TECH: ReadonlyArray<TechRow> = [
  { label: 'Details', lines: ['Designed in San Francisco. Made in China.'] },
  {
    label: 'Care',
    lines: [
      'Machine wash cold',
      'Wash with like colors',
      'Do not bleach',
      'Lay flat to dry',
      'Do not iron',
    ],
  },
];

export const PRODUCT_TECH_STACK: Partial<Record<ProductType, ReadonlyArray<TechRow>>> = {
  short: [
    {
      label: 'Materials',
      lines: [
        'Shell: 92% Polyester, 8% Elastane',
        'Inner Short: 82% Recycled Polyester, 18% Elastane',
      ],
    },
    ...SHARED_TECH,
  ],
};
