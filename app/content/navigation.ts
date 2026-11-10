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
    // A 4:5 top crop of chris_gym_dusty_rose_qz_waist_up.jpg, so both cards share
    // a shape (Files appended the id to the name).
    [HANDLES.firstLightCollection]: filesImage(
      'chris_gym_dusty_rose_qz_waist_up_4x5_350d1703-343e-44e6-94b4-44665d12405b.jpg',
      {
        v: 1794288243,
        width: 3968,
        height: 4960,
        alt: 'Athlete in a dusty rose First Light quarter-zip, hands on hips, in a dark gym',
      }
    ),
  } satisfies Record<string, FilesImage>,
} as const;
