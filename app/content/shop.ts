/**
 * /collections/shop — every live product in one grid, the header's Shop. The
 * banner photo is `COLLECTION_BANNERS[HANDLES.shopAllCollection]`; the product
 * order is the Shopify collection's manual order. Display strings are
 * sentence case here and uppercased by CSS.
 */

import type { CollectionOverlayContent } from '~/components/collection/CollectionOverlayBanner';

export const SHOP_INTRO = {
  headline: 'Everything you need to train.',
  /** Bottom-left of the banner: the categories in the grid, in grid order. */
  footLeft: 'Shorts | Shirts | Quarterzips | Joggers | Hats',
  /** Bottom-right. Not `BRAND.provenance`: this one carries the 7x7. */
  footRight: 'Designed in 7x7 San Francisco',
  /** The line between the banner and the grid. */
  intro:
    'Our mission is to outfit every athlete who competes either in competitions or against \
themselves. Every kit we issue is innovative, lightweight, and breathable so you can thrive in \
every scenario the competition throws at you.',
} satisfies CollectionOverlayContent;
