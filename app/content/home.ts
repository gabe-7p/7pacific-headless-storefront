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
  /** Mono spec-strip label above the headline: drop number + city. */
  eyebrow: 'Drop 01 · San Francisco',
  /**
   * Locked hero spec (7PA-232): ≤8 words, one sentence, ALL CAPS via CSS.
   * The headline is verbatim from the approved Tone Chart product-line board.
   */
  headline: 'Built for the part of training nobody posts.',
  /** Primary CTA, mono caps (the page's single Ember moment). Label + target per
      Gabe (2026-07-19): the live hero's line, pointed at the Mint shorts. */
  cta: { label: 'Own the Start', href: STORE_LINKS.shopShortsMint },
  /** Text-treatment secondary CTA per Gabe (2026-07-21) — a deliberate
      deviation from 7PA-232's single-CTA hero. Renders in chalk, so the
      one-Ember-moment rule still holds. */
  secondaryCta: { label: 'Read the Story', href: '/pages/our-story' },
  /** Mono spec lines under the CTAs: where and when the hero shot was made. */
  coordinates: '37.78°N · 122.51°W',
  tagline: 'Lands End · 5:47 AM',
  backgroundImage: {
    url: `${CDN}/24_121_7pacific_03806.jpg`,
    width: 1656,
    height: 1104,
  },
} as const;

export type NameSpecCell = {
  /** Product-family name, display face (ALL CAPS via CSS). */
  name: string;
  /** Mono spec segments — rendered joined with ' · ' (the locked separator). */
  spec: ReadonlyArray<string>;
  /** Price, appended as the spec line's final segment in its own style. */
  price: string;
  href: string;
};

/**
 * The Name/Spec marquee banner directly below the hero (approved prototype,
 * Jul 2026): the three live product families as name-over-spec cells plus one
 * Shop All cell, auto-scrolling. Content is locked — exactly these four cells.
 */
export const HOME_NAME_SPEC_BANNER = {
  cells: [
    {
      name: 'AIRRAIL™ 6" // Core Motion Training Short',
      spec: ['Laser-cut vents', 'Thigh, waistband, core', 'Midnight', 'Mint', 'Mountain Mist'],
      price: '$79',
      href: STORE_LINKS.shopShortsMidnight,
    },
    {
      name: 'TRACEFIBER™ // Performance Tech Tee',
      spec: ['Integrated mesh', 'Shoulder darts', '5 colorways'],
      price: '$74',
      href: STORE_LINKS.shopShirtsMidnight,
    },
    {
      name: 'MOTIONFRAME™ // Running Hat',
      spec: ['Structured, weightless', 'Rear adjuster'],
      price: '$42',
      href: STORE_LINKS.shopHat,
    },
  ] satisfies ReadonlyArray<NameSpecCell>,
  cta: { label: 'Shop All //', href: STORE_LINKS.shopAll },
} as const;

export const HOME_FIRST_DROP = {
  heading: 'Our First Drop',
  // Voice Gate: a number, no web-speak ("Click in to see why" failed Q5).
  subtitle: 'Three products in nine colors tested on the hills we run.',
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
  subtitle: 'The reminders we train by. No matter the season.',
  video: 'https://cdn.shopify.com/videos/c/o/v/a156e4e88aec47fa96892073a276450f.mp4',
  images: {
    socialSharing: `${CDN}/social_sharing.jpg`,
    paulScreaming: `${CDN}/paul_screaming.jpg`,
    digitalMap: `${CDN}/digital_map.png`,
  },
  values: [
    {
      title: 'No Losses, Only Lessons',
      tone: 'dark',
      body: "When something doesn't work out, we figure out why and come back more experienced.",
      cta: { label: 'Read the story', href: '/pages/our-story' },
    },
    {
      title: 'Love The Journey',
      tone: 'light',
      body: 'The peak is a moment. The climb is the life. Most of the fun and memories are in the journey.',
      cta: { label: 'Sign up', href: '#newsletter' },
    },
    {
      title: 'Not Too Serious',
      tone: 'dark',
      body: "The training is serious. We're not. We hit our numbers, laugh between sets, and leave the tough-guy act to everyone else.",
      cta: { label: 'Shop tees', href: STORE_LINKS.shopShirts },
    },
    {
      title: 'Play The Long Game',
      tone: 'light',
      body: "We don't chase quick wins. We build things that outlast the season. Patience is the loudest statement.",
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
