/**
 * /drops/baseline — the ED. 01 "BASELINE" drop page (route drops.baseline.tsx
 * → components/content/BaselineDrop). Display strings are sentence case here
 * and uppercased by CSS. Every media field is a `MediaSlotSource` — per-photo
 * crop anchoring rides each source as `focus`.
 */

import type { MediaSlotSource } from '~/components/common/MediaSlot';
import { STORE_LINKS } from '~/content/links';
import { BEHIND_THE_BUILD_VIDEO_ID } from '~/content/media';
import { shopifyImage, shopifyVideo, shopifyVideoThumbnail } from '~/lib/shopifyFiles';
import { youtubeWatchUrl } from '~/lib/urls';

export const BASELINE_DROP = {
  /** Mono eyebrow above the headline; its leading dot is the mock's live signal. */
  eyebrow: 'ED. 01 · H2-26',
  headline: 'Baseline',
  /** Status line paired with the headline (was the drop date pre-launch). */
  status: 'LIVE NOW',
  /** Browser-tab / og title (buildMeta adds the brand suffix). */
  seoTitle: 'Baseline · ED. 01',
  intro:
    'Our first collection. The kit you start with, plus a few innovations for athletes. \
It’s lightweight, breathable, durable, and stands out just enough. We tested it for \
months with real athletes before it earned a spot with us.',

  /** Masthead CTA shown only where the masthead is NOT the drop page itself
      — on /collections/baseline it sends shoppers to the editorial page (film,
      receipts, the training standard) for the build story behind the kit. */
  dropLink: { label: 'How We Built It', href: STORE_LINKS.baselineDrop },

  /** The recorded drop film — 16:9, full-bleed, autoplay/muted/loop. 720p: the
      1080p cut is 43 MB. */
  film: {
    kind: 'video',
    src: shopifyVideo('002c07ce613b4b15893c9fdf493295c9', 'HD-720p-4.5Mbps-92527050'),
    poster: shopifyVideoThumbnail('002c07ce613b4b15893c9fdf493295c9', { v: 1787638763 }),
  } satisfies MediaSlotSource,
  /** Lower-left overlay on the film — points at the full drop film on
      YouTube (opens in a new tab). */
  filmOverlay: {
    label: 'The why behind our first collection',
    cta: { label: 'Watch full video', href: youtubeWatchUrl(BEHIND_THE_BUILD_VIDEO_ID) },
  },

  receipts: {
    heading: 'Proving the performance',
    subtitle:
      'We logged months of testing before we let you buy anything. Here’s what the \
process looked like in numbers. Don’t believe us? Send us a message and we’ll send \
you the receipts.',
    /** Dark stat tiles; `accent` is the mock's Ember-set trailing glyph. */
    stats: [
      {
        label: 'Wash cycles',
        value: '50',
        accent: '+',
      },
      {
        label: 'Months trained in',
        value: '15',
      },
      {
        label: 'Prototypes',
        value: '09',
      },
      {
        label: 'Hottest session',
        value: '103',
        accent: '°',
      },
    ],
  },

  standard: {
    heading: 'Built for how athletes actually train.',
    subtitle:
      'You take training seriously. So do we, just with fabric. This was built for \
athletes who train with intent: speed work, intervals, iron, even the run you swore \
would be easy on Saturday. We got you.',
    /** Wide band under the header — the sled-push loop, shown at 70% of
        its 16:9 height (the `loop` ratio). 1080p: full-bleed, and the clip
        is under nine seconds. */
    banner: {
      kind: 'video',
      src: shopifyVideo('9600b71822db44d9a13c4ae7a79befa0', 'HD-1080p-7.2Mbps-99807243'),
      poster: shopifyVideoThumbnail('9600b71822db44d9a13c4ae7a79befa0', { v: 1793672192 }),
    } satisfies MediaSlotSource,
    /** All three day photos are 4:5 portraits in the 4:3 box, so each
        shows ~60% of its height — the subjects fill their frames, so the
        centered default crop holds. */
    days: [
      {
        index: '01',
        title: 'Explosive days',
        body: 'Vertical work, plyos, olympic lifts, sprinting, the list goes on. Every piece has breathability built in.',
        media: {
          kind: 'image',
          src: shopifyImage('zach_squatting.jpg', { v: 1793673080, width: 1200 }),
          alt: 'Athlete at the bottom of a back squat under a loaded barbell',
        },
      },
      {
        index: '02',
        title: 'Race simulations',
        body: 'Hyrox sims, circuits, comp prep. A stay-put fit and sweat-wicking fabric from station one to the finishline.',
        media: {
          kind: 'image',
          src: shopifyImage('sandbag_lunges.jpg', { v: 1793673081, width: 1200 }),
          alt: 'Athlete lunging with a sandbag across the shoulders while a partner pushes a sled behind',
        },
      },
      {
        index: '03',
        title: 'Long days',
        body: 'Tempo runs, long intervals, 103° afternoons. Feather-light and breathable enough to disappear by mile six.',
        media: {
          kind: 'image',
          src: shopifyImage('stretching_on_ground.jpg', { v: 1793672327, width: 1200 }),
          alt: 'Athlete in sunglasses stretching on the ground against a concrete block',
        },
      },
    ],
  },

  pieces: {
    heading: 'Three pieces. On purpose.',
    subtitle:
      'The TRACEFIBER™ tee. The AIRRAIL™ short. The MOTIONFRAME™ hat. These are the \
only three pieces you need to get to work.',
    /** Names and prices mirror the live Shopify products (2026-08-25) —
        update here if pricing changes. */
    products: [
      {
        name: 'AirRail™ short',
        price: '$79',
        href: STORE_LINKS.shopShorts,
        media: {
          kind: 'image',
          src: shopifyImage(
            'mountain_mist_short_stretch_143cc154-8c83-4fe0-a05c-5eb44a21cf8f.jpg',
            { v: 1758601081, width: 900 }
          ),
          alt: 'Athlete stretching with a raised knee in the Mountain Mist AirRail short',
        },
      },
      {
        name: 'TraceFiber™ tee',
        price: '$72',
        href: STORE_LINKS.shopShirts,
        media: {
          kind: 'image',
          src: shopifyImage('white_shirt_top_left_back.jpg', { v: 1758599851, width: 900 }),
          alt: 'Back shoulder detail of the white TraceFiber tee',
        },
      },
      {
        name: 'MotionFrame™ hat',
        price: '$42',
        href: STORE_LINKS.shopHat,
        // Same worn shot the MOTIONFRAME hat PDP leads with.
        media: {
          kind: 'image',
          src: shopifyImage('hat_side_profile.jpg', { v: 1758436928, width: 900 }),
          alt: 'Athlete wearing the white MOTIONFRAME running hat',
        },
      },
    ],
  },

  closer: {
    eyebrow: 'ED. 01 · Live now',
    headingLines: ['Set your baseline.', 'Then beat it.'],
    body: 'Height, pace, load, rounds. Whatever number you’re chasing, chase it in gear that was tested chasing the same thing.',
    cta: { label: 'Shop the drop', href: STORE_LINKS.shopAll },
  },
} as const;
