/**
 * /drops/baseline — the ED. 01 "BASELINE" drop page (route drops.baseline.tsx
 * → components/content/BaselineDrop). Copy is transcribed verbatim from Gabe's
 * approved Claude Design mock (`BASELINE Drop Page.dc.html`, turn 4a — content
 * sections left-aligned, closer centered; 2026-08-24). All display strings are
 * sentence case here and uppercased by CSS, per the display-face rule.
 *
 * Every media field is a `MediaSlotSource`: when a real asset lands, swap the
 * `PLACEHOLDER_*` reference for an `{ kind: 'image' | 'video', … }` object — a
 * one-line change here, no component edits. The mock's per-slot art direction
 * is kept as a comment beside each slot.
 */

import type { MediaSlotSource } from '~/components/common/MediaSlot';
import { STORE_LINKS } from '~/content/links';

const PLACEHOLDER_IMAGE = { kind: 'placeholder', type: 'image' } satisfies MediaSlotSource;

export const BASELINE_DROP = {
  /** Mono eyebrow above the headline; its leading dot is the mock's live signal. */
  eyebrow: 'ED. 01 · H2-26',
  headline: 'Baseline',
  /** Mobile stacks the date under the headline; desktop joins them inline. */
  date: 'LIVE NOW',
  // "Lghtweight" is verbatim from Gabe's copy (2026-08-25) — flagged as a
  // likely typo ("Lightweight"); fix here once confirmed.
  intro:
    'Our first collection. The kit you start with plus a few innovations for athletes. \
Lghtweight, breathable, durable, and stands out just enough. Tested for months by real \
athletes before it earned a spot with us.',

  /** The recorded drop film — 16:9, full-bleed, autoplay/muted/loop (Shopify
      file 52942265516349, HD-1080p rendition + its CDN poster frame). The
      mock's "SOUND OFF · TAP FOR AUDIO" badge ships once there is an audio
      toggle. */
  film: {
    kind: 'video',
    src: 'https://cdn.shopify.com/videos/c/vp/002c07ce613b4b15893c9fdf493295c9/002c07ce613b4b15893c9fdf493295c9.HD-1080p-7.2Mbps-92527050.mp4',
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
    /** Dark 3:4 stat cards; `accent` is the mock's Ember-set trailing glyph. */
    stats: [
      {
        label: 'Wash cycles',
        value: '50',
        accent: '+',
        media: PLACEHOLDER_IMAGE, // tee mid-wash / crumpled fabric, dark, desaturated
      },
      {
        label: 'Months trained in',
        value: '15',
        accent: '',
        media: PLACEHOLDER_IMAGE, // empty gym at dawn / athlete resting on rack
      },
      {
        label: 'Prototypes',
        value: '09',
        accent: '',
        media: PLACEHOLDER_IMAGE, // flat-lay of rejected prototypes / pins, chalk marks
      },
      {
        label: 'Hottest session',
        value: '103',
        accent: '°',
        media: PLACEHOLDER_IMAGE, // sweat detail / heat haze on turf, harsh sun
      },
    ],
  },

  standard: {
    heading: 'Built for how athletes actually train.',
    subtitle:
      'Not one sport. Not one speed. Gear that keeps up whether the session is intervals, iron, or open runs.',
    /** Extra-wide band under the header. */
    banner: PLACEHOLDER_IMAGE, // wide: sled push or turf sprint, full body, full bleed
    bannerBadge: '05:47 AM — Nobody’s watching. The gear still has to work.',
    days: [
      {
        index: '01',
        title: 'Explosive days',
        body: 'Vertical work, plyos, olympic lifts, sprinting, the list goes on. Every piece has breathability built in.',
        media: PLACEHOLDER_IMAGE, // max-effort jump or plyo, peak of the rep
      },
      {
        index: '02',
        title: 'Race simulations',
        body: 'Hyrox sims, circuits, comp prep. A stay-put fit and sweat-wicking fabric from station one to the finishline.',
        media: PLACEHOLDER_IMAGE, // race-sim floor: erg, wall balls or carries
      },
      {
        index: '03',
        title: 'Long days',
        body: 'Tempo runs, long intervals, 103° afternoons. Feather-light and breathable enough to disappear by mile six.',
        media: PLACEHOLDER_IMAGE, // long run, heat haze or early light
      },
    ],
  },

  pieces: {
    heading: 'Three pieces. On purpose.',
    subtitle:
      'The TRACEFIBER™ tee. The AIRRAIL™ short. The MOTIONFRAME™ hat. No filler, no colorway spam.',
    /** `price` stays the mock's placeholder until Gabe locks drop pricing —
        swap for the real figure (or a fetched Money) here. */
    products: [
      {
        name: 'Air Rail Short',
        price: '$ —',
        href: STORE_LINKS.shopShorts,
        media: PLACEHOLDER_IMAGE, // on-body, mid-movement
      },
      {
        name: 'Training Tee',
        price: '$ —',
        href: STORE_LINKS.shopShirts,
        media: PLACEHOLDER_IMAGE, // on-body, sweat-through OK
      },
      {
        name: 'The Hat',
        price: '$ —',
        href: STORE_LINKS.shopHat,
        media: PLACEHOLDER_IMAGE, // worn + flat-lay detail
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
