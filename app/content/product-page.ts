/**
 * Shared PDP marketing content (identical on every product, so it lives here as
 * a typed constant rather than a per-product metafield). Mirrors the live
 * "For Intensity. Not Errands." brand section and the recommendations row.
 */

import { MEMBERSHIP_PITCH } from '~/content/membership';
import { shopifyVideo, shopifyVideoThumbnail } from '~/lib/shopifyFiles';

export const PRODUCT_BRAND_BANNER = {
  headingLines: ['For Intensity.', 'Not Errands.'],
  body: MEMBERSHIP_PITCH.body,
  cta: MEMBERSHIP_PITCH.cta,
  /** 1080p rendition — the band runs the full page width. Dark footage: the
      overlay copy renders in the night text tokens. */
  video: {
    src: shopifyVideo('345d9061d3b54441b67c044e27efe5b2', 'HD-1080p-7.2Mbps-99803592'),
    poster: shopifyVideoThumbnail('345d9061d3b54441b67c044e27efe5b2', { v: 1793669873 }),
    label: 'Athletes rowing under a shaft of light in a dark gym',
  },
} as const;

export const PRODUCT_RECOMMENDATIONS = {
  heading: 'Planning To Sweat More?',
  subtitle: 'Shop more of what you need to get you through those sessions.',
  /** Portrait (9:16) clip beside the card grid. 1080p rendition on purpose:
      portrait renditions are keyed by height, so 720p is only 404px wide and
      1080p (606px) is the one that matches the ~480px desktop panel. */
  video: {
    src: shopifyVideo('2e427df3959c4762ae6c8e7e501802f1', 'HD-1080p-7.2Mbps-99803591'),
    poster: shopifyVideoThumbnail('2e427df3959c4762ae6c8e7e501802f1', { v: 1793669839 }),
    label: 'Athlete squatting under a loaded barbell in a dark rack',
  },
} as const;
