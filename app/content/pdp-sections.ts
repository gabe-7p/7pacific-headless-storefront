/**
 * Shared (brand-level) PDP section copy + imagery, rendered on every product
 * page. Mirrors the live `bottom-product-photography` section. Same Shopify
 * Files imagery as the live theme.
 */
const CDN = 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files';

export const PDP_BOTTOM_PHOTOGRAPHY = {
  headingLines: ['For Intensity.', 'Not Errands.'],
  body: 'We think everyone builds a stronger version of themselves and of their community when you sweat together.',
  cta: { label: 'Join The Membership', href: '#newsletter' },
  images: [`${CDN}/running.png`, `${CDN}/single_running.png`, `${CDN}/core_values_picture.png`],
} as const;
