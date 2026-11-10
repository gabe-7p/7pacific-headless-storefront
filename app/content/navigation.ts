import { HANDLES } from '~/content/links';
import { type FilesImage, filesImage } from '~/lib/shopifyFiles';

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
  /** Shopify Files uploads (2026-11-09), keyed by collection handle. */
  media: {
    [HANDLES.shopAllCollection]: filesImage('leaning_against_fence.jpg', {
      v: 1794287949,
      width: 3967,
      height: 4960,
      alt: 'Two athletes in Baseline gear leaning against a chain-link fence',
    }),
    [HANDLES.firstLightCollection]: filesImage('chris_gym_dusty_rose_qz_waist_up.jpg', {
      v: 1794288061,
      width: 4259,
      height: 5511,
      alt: 'Athlete in a dusty rose First Light quarter-zip, hands on hips, in a dark gym',
    }),
  } satisfies Record<string, FilesImage>,
} as const;
