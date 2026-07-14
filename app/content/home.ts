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
  subline: 'Laser-cut vents. Bonded seams. Gear for the 6 AM session — fog included.',
  /** One CTA, mono caps (the page's single Ember moment). */
  cta: { label: 'Shop the Drop', href: STORE_LINKS.shopAll },
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

export const HOME_CORE_VALUES = {
  heading: 'What We Stand For',
  subtitle:
    "Our core tenets that guide our mission. It's what we strive to do as a company, and what we hope to inspire in our community.",
  video: 'https://cdn.shopify.com/videos/c/o/v/a156e4e88aec47fa96892073a276450f.mp4',
  images: {
    socialSharing: `${CDN}/social_sharing.jpg`,
    paulScreaming: `${CDN}/paul_screaming.jpg`,
    digitalMap: `${CDN}/digital_map.png`,
  },
  values: [
    {
      title: 'Love The Journey',
      tone: 'dark',
      body: 'The peak is a moment. The climb is the life. We think everyone builds a stronger version of themselves when you sweat together.',
      cta: { label: 'Read Our Story', href: '/pages/our-story' },
    },
    {
      title: 'No Losses, Only Lessons',
      tone: 'light',
      body: "When something doesn't work out, we figure out why and come back more experienced.",
      cta: { label: 'Join The Membership', href: '#newsletter' },
    },
    {
      title: 'Play The Long Game',
      tone: 'dark',
      body: "We don't chase quick wins. We build things that outlast the season. Patience is the loudest statement.",
      cta: { label: 'Shop Shirts', href: STORE_LINKS.shopShirts },
    },
    {
      title: 'Track The Truth',
      tone: 'light',
      body: 'The space between the start and end point is yours to shape. Measure the work to watch the evolution.',
      cta: { label: 'Shop Shorts', href: STORE_LINKS.shopShorts },
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
