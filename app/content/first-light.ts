/**
 * /drops/first-light — the Drop 02 "FIRST LIGHT" teaser page (route
 * drops.first-light.tsx → components/content/FirstLightTeaser). Copy is
 * transcribed verbatim from Gabe's approved mock (2026-08-10).
 */

import type { MediaSlotSource } from '~/components/common/MediaSlot';
import type { DropMastheadContent } from '~/components/content/DropMasthead';
import { DROP_TWO_LAUNCH } from '~/content/drop-two';
import { WAITLIST_SUCCESS_MESSAGE } from '~/content/join';
import { STORE_LINKS } from '~/content/links';
import { filesImage, shopifyImageCard } from '~/lib/shopifyFiles';

const PLACEHOLDER_IMAGE = { kind: 'placeholder', type: 'image' } satisfies MediaSlotSource;

export const FIRST_LIGHT = {
  /** Mono eyebrow above the headline; its leading dot is the mock's Ember accent. */
  eyebrow: 'ED. 02 · FW26/27 · Before Sunrise',
  /** ALL CAPS via CSS (Heading brand variant), per the display-face rule. */
  headline: 'First Light · 11.13.26',
  /** The `<title>` — `buildMeta` adds the brand prefix. */
  seoTitle: 'First Light · 11.13.26',
  /** The meta description (search + share previews). */
  seoDescription:
    'A quarter-zip and jogger for athletes who train before sunrise. Warm at the start, cool when the pace picks up. Releases 11.13.26. Early access open.',
  /** The share image (og:image): the countdown backdrop below Proving the
      Performance, cut to a 1200×630 card head to hips (the 4:5 source would
      lose his head to a scraper's centre crop). */
  ogImage: shopifyImageCard('chris_in_qz_at_gym.jpg', {
    v: 1794266813,
    region: { left: 0, top: 750, width: 3968, height: 2083 },
    width: 1200,
    height: 630,
  }),
  intro:
    'Every team has the athletes who are there before the lights come on. First Light is their kit. Warm when you step out of the car, lightweight and breathable by the second rep.',
  /** Full-bleed hero band directly under the intro. 4:5 on mobile shows the
      whole frame; the 8:3 desktop band crops heads to knees (`focus: 'lower'`). */
  heroMedia: {
    kind: 'image',
    ...filesImage('running_up_california_street.jpg', {
      v: 1794266813,
      width: 3968,
      height: 4960,
      alt: 'Two runners in quarter-zips running up California Street, San Francisco',
    }),
    focus: 'lower',
  } satisfies MediaSlotSource,
  earlyAccess: {
    heading: 'For the Early Ones',
    body: 'You’re at the track before the sun. You should get First Light before everyone else. Sign up for early access',
    namePlaceholder: 'Athlete Name',
    emailPlaceholder: 'Email',
    submitLabel: 'Sign Up',
    /** Not in the mock — the homepage waitlist confirmation, same list. */
    successMessage: WAITLIST_SUCCESS_MESSAGE,
    /** Tall portrait panel beside the signup form. */
    media: {
      kind: 'image',
      ...filesImage('3_people_stretching.jpg', {
        v: 1794266814,
        width: 3968,
        height: 4960,
        alt: 'Three athletes stretching against a trackside rail at dusk',
      }),
    } satisfies MediaSlotSource,
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
    /** Full-bleed backdrop the countdown overlays. 4:5 on mobile shows the
        whole frame; the 16:9 desktop box keeps head to hips, with the
        countdown over the dark ceiling (`focus: 'nearTop'`). */
    media: {
      kind: 'image',
      ...filesImage('chris_in_qz_at_gym.jpg', {
        v: 1794266813,
        width: 3968,
        height: 4960,
        alt: 'Athlete in a quarter-zip standing hands on hips in a dark gym',
      }),
      focus: 'nearTop',
    } satisfies MediaSlotSource,
  },
} as const;

/**
 * /collections/first-light's masthead — the same block as BASELINE's
 * (components/content/DropMasthead): edition eyebrow, headline, the
 * approved intro and the outline CTA out to the drop page.
 */
export const FIRST_LIGHT_MASTHEAD = {
  eyebrow: 'ED. 02 · FW26/27',
  headline: 'First Light',
  intro: FIRST_LIGHT.intro,
  dropLink: { label: 'How We Built It', href: STORE_LINKS.firstLight },
} satisfies DropMastheadContent;
