/**
 * Full-bleed photo strips that open the drop collection pages, above the
 * masthead. A collection listed here also gets the transparent header over
 * its banner (`layout/Header`), the way the homepage hero does.
 */

import type { MediaSlotSource } from '~/components/common/MediaSlot';
import { HANDLES } from '~/content/links';
import { filesImage } from '~/lib/shopifyFiles';
import { collectionUrl } from '~/lib/urls';

export const COLLECTION_BANNERS: Partial<Record<string, MediaSlotSource>> = {
  [HANDLES.shopAllCollection]: {
    kind: 'image',
    ...filesImage('roster_at_kezar_cropped.jpg', {
      v: 1793245653,
      width: 7254,
      height: 3387,
      alt: 'Athletes warming up on the track at Kezar Stadium in front of empty red seats',
    }),
  },
  [HANDLES.firstLightCollection]: {
    kind: 'image',
    ...filesImage('chris_gym_dusty_rose_qz_waist_up.jpg', {
      v: 1794288061,
      width: 4259,
      height: 5511,
      alt: 'An athlete in the First Light quarter-zip, hands on hips, in a dark gym',
    }),
    // A portrait in a ~3.6:1 strip: hold the window on his face and chest.
    focus: 'upper',
  },
};

/** The collection paths that open on a banner (the header goes transparent over it). */
export const BANNER_PATHS: ReadonlySet<string> = new Set(
  Object.keys(COLLECTION_BANNERS).map((handle) => collectionUrl(handle))
);
