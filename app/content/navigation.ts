import { HANDLES } from '~/content/links';
import type { FilesImage } from '~/lib/shopifyFiles';

/**
 * The Collections mega-menu (`layout/CollectionsMegaMenu`). The links come from
 * the Shopify menu: a nested item whose children are all collection links
 * renders this panel, and each child gives one row in both lists. A child's
 * "Explore" link is its drop page (`dropUrl(handle)`), so every collection put
 * under that item needs an `app/routes/drops.<handle>.tsx`. A child with no
 * `media` entry is listed but gets no photo card.
 */
export const COLLECTIONS_MENU = {
  exploreTitle: 'Explore The Collection',
  shopTitle: 'Shop The Collection',
  /**
   * TODO(before merge): upload both photos to Shopify Files and build them
   * with `filesImage()`. These are local, downsized preview copies in
   * public/nav-preview/ (originals on Gabe's desktop); they bypass the CDN
   * size ladder, which the media rule in CLAUDE.md doesn't allow on main.
   */
  media: {
    [HANDLES.shopAllCollection]: {
      src: '/nav-preview/baseline.jpg',
      width: 1120,
      height: 1400,
      alt: 'Athlete in Baseline gear leaning against a fence',
    },
    [HANDLES.firstLightCollection]: {
      src: '/nav-preview/first-light.jpg',
      width: 1120,
      height: 1400,
      alt: 'Athlete in a First Light quarter-zip at the gym',
    },
  } satisfies Record<string, FilesImage>,
} as const;
