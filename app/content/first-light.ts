/**
 * /drops/first-light — the Drop 02 "FIRST LIGHT" teaser page (route
 * drops.first-light.tsx → components/content/FirstLightTeaser). Copy is
 * transcribed verbatim from Gabe's approved mock (2026-08-10).
 *
 * Every media field is a `MediaSlotSource`: when a real asset is uploaded,
 * swap the `PLACEHOLDER_IMAGE` reference for an `{ kind: 'image', … }` /
 * `{ kind: 'video', … }` object — a one-line change here, no component
 * edits. Aspect ratios are locked in `MediaSlot`, so the swap can't shift
 * the layout.
 */

import type { MediaSlotSource } from '~/components/common/MediaSlot';
import { DROP_TWO_LAUNCH } from '~/content/drop-two';

const PLACEHOLDER_IMAGE = { kind: 'placeholder', type: 'image' } satisfies MediaSlotSource;

export const FIRST_LIGHT = {
  /** Mono eyebrow above the headline; its leading dot is the mock's Ember accent. */
  eyebrow: 'ED. 02 · FW 26',
  /** ALL CAPS via CSS (Heading brand variant), per the display-face rule. */
  headline: 'First Light · 09.13.26',
  intro:
    'Our first fall and winter clothing selection in our history and we’re excited to share it. \
We kept our vision clear of always putting the athletes first and creating products that you will \
use in any training session you have coming up during the fall and winter. It follows our principle \
of being lightweight and breathable and ready to keep you warm at the start, and cool when the \
intensity picks up.',
  /** Full-bleed hero band directly under the intro. */
  heroMedia: PLACEHOLDER_IMAGE,
  earlyAccess: {
    // "the the" is verbatim from the mock — flagged to Gabe (2026-08-10) as a
    // likely typo; fix here once confirmed.
    heading: 'For the the Early Ones',
    body: 'We know you’re the kind of person who’s always on top of things, so sign up now for Early Access',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    submitLabel: 'Sign Up',
    /** Not in the mock — same voice as the homepage waitlist confirmation. */
    successMessage: 'You’re on it. See you at first light.',
    /** Tall portrait panel beside the signup form. */
    media: PLACEHOLDER_IMAGE,
  },
  /** The full-bleed 4-up lookbook strip, left to right. */
  lookbook: [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE],
  proving: {
    heading: 'Proving the Performance',
    body: 'We’ll walk you through all the numbers, tests, mistakes, and time it took to create these \
products once it’s live so it’s fresh in your mind when you come back.',
  },
  countdown: {
    /** The shared Drop 02 target and unit labels (content/drop-two.ts) — one source. */
    dropIso: DROP_TWO_LAUNCH.dropIso,
    labels: DROP_TWO_LAUNCH.countdownLabels,
    /** Full-bleed backdrop the countdown overlays. */
    media: PLACEHOLDER_IMAGE,
  },
} as const;
