/**
 * Shared PDP marketing content (identical on every product, so it lives here as
 * a typed constant rather than a per-product metafield). Mirrors the live
 * "For Intensity. Not Errands." brand section.
 */

import { BRAND } from '~/lib/brand';

const CDN = BRAND.filesCdn;

export const PRODUCT_BRAND_BANNER = {
  headingLines: ['For Intensity.', 'Not Errands.'],
  body: 'We think everyone builds a stronger version of themselves and of their community when you sweat together.',
  cta: { label: 'Join The Membership', href: '#newsletter' },
  images: {
    hero: `${CDN}/running.png`,
    bottomLeft: `${CDN}/core_values_picture.png`,
    bottomRight: `${CDN}/single_running.png`,
  },
} as const;
