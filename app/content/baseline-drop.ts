/**
 * /drops/baseline — the ED. 01 "BASELINE" drop page (route drops.baseline.tsx
 * → components/content/BaselineDrop). Copy is transcribed verbatim from Gabe's
 * approved Claude Design mock (`BASELINE Drop Page.dc.html`, turn 4a — content
 * sections left-aligned, closer centered; 2026-08-24) plus Gabe's live
 * design-review revisions. All display strings are sentence case here and
 * uppercased by CSS, per the display-face rule. Every media field is a
 * `MediaSlotSource` — per-photo crop anchoring rides each source as `focus`.
 */

import type { MediaSlotSource } from '~/components/common/MediaSlot';
import { STORE_LINKS } from '~/content/links';

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

  /** The recorded drop film — 16:9, full-bleed, autoplay/muted/loop (Shopify
      file 52942265516349 + its CDN poster frame). 720p rendition, the repo's
      standard for background loops (the 1080p cut is 43 MB). The mock's
      "SOUND OFF · TAP FOR AUDIO" badge ships once there is an audio toggle. */
  film: {
    kind: 'video',
    src: 'https://cdn.shopify.com/videos/c/vp/002c07ce613b4b15893c9fdf493295c9/002c07ce613b4b15893c9fdf493295c9.HD-720p-4.5Mbps-92527050.mp4',
    poster:
      'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/preview_images/002c07ce613b4b15893c9fdf493295c9.thumbnail.0000000000.jpg?v=1787638763',
  } satisfies MediaSlotSource,
  /** Lower-left overlay on the film — points at the full drop film on
      YouTube (opens in a new tab). */
  filmOverlay: {
    label: 'The why behind our first collection',
    cta: { label: 'Watch full video', href: 'https://www.youtube.com/watch?v=jf_E0NEgeCE' },
  },

  receipts: {
    heading: 'Proving the performance',
    subtitle: 'These are the numbers our gear went through before we let you buy them.',
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
      'Not one sport. Not one speed. Gear that keeps up whether the session is intervals, iron, or open runs.',
    /** Extra-wide band under the header. */
    banner: {
      kind: 'image',
      src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/24_121_7pacific_03806.jpg?v=1759043281&width=1200',
      alt: 'Athlete driving battle ropes on a foggy clifftop',
      focus: 'upper', // 3:2 source in the 21:8 band — keep the athlete's head
    } satisfies MediaSlotSource,
    days: [
      {
        index: '01',
        title: 'Explosive days',
        body: 'Vertical work, plyos, olympic lifts, sprinting, the list goes on. Every piece has breathability built in.',
        media: {
          kind: 'image',
          src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/24_121_7pacific_07344.jpg?v=1759115958&width=1200',
          alt: 'Three athletes working battle ropes and med balls on the beach',
        },
      },
      {
        index: '02',
        title: 'Race simulations',
        body: 'Hyrox sims, circuits, comp prep. A stay-put fit and sweat-wicking fabric from station one to the finishline.',
        media: {
          kind: 'image',
          src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/running.png?v=1756374530&width=1200',
          alt: 'Pack of runners mid-stride in training gear',
        },
      },
      {
        index: '03',
        title: 'Long days',
        body: 'Tempo runs, long intervals, 103° afternoons. Feather-light and breathable enough to disappear by mile six.',
        media: {
          kind: 'image',
          src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/two_walking_to_workout_cropped.png?v=1758602930',
          alt: 'Two athletes carrying kettlebells and a slam ball to a workout',
          focus: 'top', // near-square source in the landscape box — keep the faces
        },
      },
    ],
  },

  pieces: {
    heading: 'Three pieces. On purpose.',
    subtitle:
      'The TRACEFIBER™ tee. The AIRRAIL™ short. The MOTIONFRAME™ hat. No filler, no colorway spam.',
    /** Names and prices mirror the live Shopify products (2026-08-25) —
        update here if pricing changes. */
    products: [
      {
        name: 'AirRail™ short',
        price: '$79',
        href: STORE_LINKS.shopShorts,
        media: {
          kind: 'image',
          src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/mountain_mist_short_stretch_143cc154-8c83-4fe0-a05c-5eb44a21cf8f.jpg?v=1758601081&width=900',
          alt: 'Athlete stretching with a raised knee in the Mountain Mist AirRail short',
        },
      },
      {
        name: 'TraceFiber™ tee',
        price: '$72',
        href: STORE_LINKS.shopShirts,
        media: {
          kind: 'image',
          src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/white_shirt_top_left_back.jpg?v=1758599851&width=900',
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
          src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/hat_side_profile.jpg?v=1758436928&width=900',
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
