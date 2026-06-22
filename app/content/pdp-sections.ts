/**
 * Shared (brand-level) PDP section copy + imagery, rendered on every product
 * page. Mirrors the live `bottom-product-photography` section. Same Shopify
 * Files imagery as the live theme.
 */

import { BRAND } from '~/lib/brand';
import { fileUrl } from '~/lib/shopify';

export const PDP_BOTTOM_PHOTOGRAPHY = {
  headingLines: ['For Intensity.', 'Not Errands.'],
  body: 'We think everyone builds a stronger version of themselves and of their community when you sweat together.',
  cta: BRAND.membershipCta,
  images: [
    fileUrl('running.png'),
    fileUrl('single_running.png'),
    fileUrl('core_values_picture.png'),
  ],
} as const;
