/**
 * Homepage marketing copy + section asset URLs (typed constants, not JSX).
 * Mirrors the live Impulse homepage sections: custom-hero-image, main-collection,
 * core-values-homepage-v2, black-text-image-split. Asset URLs are the same Shopify
 * Files / CDN assets the live theme uses (hero image, the two looping videos, and
 * the core-values photography) — change a value here, the homepage follows.
 */

import { STORE_LINKS } from '~/content/links';
import { BRAND } from '~/lib/brand';

const CDN = BRAND.filesCdn;

export const HOME_HERO = {
  /**
   * Locked hero spec (7PA-232): ≤8 words, one sentence, ALL CAPS via CSS.
   * The headline is verbatim from the approved Tone Chart product-line board.
   */
  headline: 'Built for the part of training nobody posts.',
  subline: 'Laser-cut vents. Bonded seams. Gear for the 6 AM session, fog included.',
  /** One CTA, mono caps (the page's single Ember moment). Label + target per
      Gabe (2026-07-19): the live hero's line, pointed at the Mint shorts. */
  cta: { label: 'Own the Start', href: STORE_LINKS.shopShortsMint },
  backgroundImage: {
    url: `${CDN}/24_121_7pacific_03806.jpg`,
    width: 1656,
    height: 1104,
  },
} as const;

export const HOME_FIRST_DROP = {
  heading: 'Our First Drop',
  // Voice Gate: a number, no web-speak ("Click in to see why" failed Q5).
  subtitle: 'Three silhouettes, nine colorways. Tested on the hills we run.',
  // Grid order is merchant-controlled: the manual `homepage-first-drop`
  // collection in Shopify (see HOMEPAGE_COLLECTION_HANDLE in content/links.ts).
} as const;

export type CoreValue = {
  title: string;
  body: string;
  cta: { label: string; href: string };
  /** Card background tone — live alternates dark charcoal and light gray. */
  tone: 'dark' | 'light';
};

/**
 * The four homepage cards (7PA-238). Not the internal values list — the
 * Strategy Canvas calls publishing values verbatim "wall art." These are
 * customer-facing reminders in the working voice; cards 1, 3, and 4 quote
 * the approved Tone Chart caption/product-line boards verbatim.
 */
export const HOME_CORE_VALUES = {
  heading: 'What We Stand For',
  subtitle: 'The reminders we train by. Same ones, every season.',
  video: 'https://cdn.shopify.com/videos/c/o/v/a156e4e88aec47fa96892073a276450f.mp4',
  images: {
    socialSharing: `${CDN}/social_sharing.jpg`,
    paulScreaming: `${CDN}/paul_screaming.jpg`,
    digitalMap: `${CDN}/digital_map.png`,
  },
  values: [
    {
      title: 'The Early One',
      tone: 'dark',
      body: "Nobody claps at 5:45 AM. That's sort of the point.",
      cta: { label: 'Read the story', href: '/pages/our-story' },
    },
    {
      title: 'Earned, Not Given',
      tone: 'light',
      body: 'The work is the reward. The gear just has to keep up.',
      cta: { label: 'Sign up', href: '#newsletter' },
    },
    {
      title: 'Set 4 of 5',
      tone: 'dark',
      body: 'Built for the part of training nobody posts.',
      cta: { label: 'Shop tees', href: STORE_LINKS.shopShirts },
    },
    {
      title: 'See You Out There',
      tone: 'light',
      body: 'Fog until noon. Perfect conditions, depending who you ask.',
      cta: { label: 'Shop shorts', href: STORE_LINKS.shopShorts },
    },
  ] satisfies ReadonlyArray<CoreValue>,
} as const;

export const HOME_TESTED = {
  headingLines: ['Tested In Training.', 'Refined By Community.'],
  body: 'We think everyone builds a stronger version of themselves and of their community when you sweat together.',
  cta: { label: 'Join The Membership', href: '#newsletter' },
  video: 'https://cdn.shopify.com/videos/c/o/v/10bb3b154ea542699c4f83e68a45a05f.mp4',
  image: `${CDN}/two_walking_to_workout_cropped.png`,
} as const;
