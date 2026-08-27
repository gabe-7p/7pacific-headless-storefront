/**
 * Homepage marketing copy + section asset URLs (typed constants, not JSX).
 * The Impulse-parity sections (hero, first drop, core values, brand banner)
 * mirror the live theme; the Name/Spec marquee, Drop 02 teaser, and Baseline
 * intro teaser are post-migration additions. Asset URLs are the same Shopify Files / CDN assets
 * the live theme uses — change a value here, the homepage follows.
 */

import { DROP_TWO_LAUNCH } from '~/content/drop-two';
import { STORE_LINKS } from '~/content/links';
import { MEMBERSHIP_PITCH } from '~/content/membership';
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

type NameSpecCell = {
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
 * Jul 2026): the three live product families as name-over-spec cells plus the
 * Shop All CTA cell, auto-scrolling. Content is locked — exactly these cells.
 * Names use the product cards' short-title device (family + noun, no "//"
 * descriptor) per Gabe (2026-07-24), so the banner and grid read as one system.
 */
export const HOME_NAME_SPEC_BANNER = {
  cells: [
    {
      name: 'AIRRAIL™ 6" Short',
      spec: ['Laser-cut vents', 'Thigh, waistband, core'],
      price: '$79',
      href: STORE_LINKS.shopShortsMidnight,
    },
    {
      name: 'TRACEFIBER™ Tee',
      spec: ['Integrated mesh', 'Shoulder darts'],
      price: '$72',
      href: STORE_LINKS.shopShirtsMidnight,
    },
    {
      name: 'MOTIONFRAME™ Hat',
      spec: ['Structured, weightless', 'Rear adjuster'],
      price: '$42',
      href: STORE_LINKS.shopHat,
    },
  ] satisfies ReadonlyArray<NameSpecCell>,
  cta: { label: 'Shop All //', href: STORE_LINKS.shopAll },
} as const;

/**
 * "Drop 02: FW26" teaser — the First Light collection (DAYBREAK™ quarterzips +
 * FRONTRUNNER™ joggers), directly below the Name/Spec banner. A live countdown
 * to the drop plus two teaser cards: Fall Gear (links to the collection) and
 * Coming Soon (opens the waitlist dialog). Photos are Shopify Files uploads
 * picked by Gabe (2026-08-03).
 */
export const HOME_DROP_TWO = {
  heading: 'Drop 02: FW26',
  dropIso: DROP_TWO_LAUNCH.dropIso,
  countdownLabels: DROP_TWO_LAUNCH.countdownLabels,
  cards: {
    fallGear: {
      // Same date as the timer (aligned from the mock's 09.10.26 per Gabe).
      eyebrow: 'Drops 09.13.26',
      title: 'Fall Gear',
      cta: { label: 'Discover', href: STORE_LINKS.firstLight },
      image: {
        url: `${CDN}/face-on-shot-zach.jpg?v=1785783370`,
        width: 2048,
        height: 1638,
      },
    },
    comingSoon: {
      eyebrow: 'DAYBREAK™ & FRONTRUNNER™',
      title: 'Coming Soon',
      /** No href — the card CTA opens the waitlist dialog instead. */
      cta: { label: 'Get on the List' },
      image: {
        url: `${CDN}/chirstian-on-stairs.jpg?v=1785783387`,
        width: 1638,
        height: 2048,
      },
    },
  },
  /** Copy for the waitlist dialog the Coming Soon card opens. */
  waitlist: {
    heading: 'Get on the List',
    body: 'DAYBREAK™ and FRONTRUNNER™ land 09.13.26. Leave your name and we’ll tell you the moment they do.',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email address',
    submitLabel: 'Get on the List',
    successMessage: 'You’re on it. See you at first light.',
  },
} as const;

/**
 * BASELINE intro teaser — the second TeaserSection instance, below the Name/Spec
 * banner: two cards pointing deeper into the live ED. 01 story (the /drops/baseline
 * editorial page and the collection film on YouTube — the same film the drop
 * page's overlay links). No countdown: the collection is live. Card photos are
 * placeholders (the Drop 02 shots, swapped left/right) pending final selects.
 */
export const HOME_BASELINE_INTRO = {
  heading: 'Baseline: ED. 01',
  // The opening of BASELINE_DROP.intro (content/baseline-drop.ts), warmed up
  // with the trailing hook per Gabe.
  subtitle:
    'Our first collection. The kit you start with, plus a few innovations for athletes you’re gonna love.',
  cards: {
    collection: {
      // Same "ED. 01 · <status>" device as the drop page's closer eyebrow.
      eyebrow: 'ED. 01 · Available now',
      title: 'Where It Starts',
      cta: { label: 'See the Collection', href: STORE_LINKS.baselineDrop },
      image: {
        url: `${CDN}/chirstian-on-stairs.jpg?v=1785783387`,
        width: 1638,
        height: 2048,
      },
    },
    film: {
      eyebrow: '5 min · Gabe Dalessandro, Founder',
      title: 'Why We Built It',
      /** External — opens the founder deep-dive on YouTube in a new tab. */
      cta: {
        label: 'Watch the Deep Dive',
        href: 'https://www.youtube.com/watch?v=jf_E0NEgeCE&t=4s',
      },
      image: {
        url: `${CDN}/face-on-shot-zach.jpg?v=1785783370`,
        width: 2048,
        height: 1638,
      },
    },
  },
} as const;

export const HOME_FIRST_DROP = {
  heading: 'Baseline: The Starting Nine',
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
  /** The media panel paired with the card in its row. */
  media:
    | { kind: 'video'; src: string }
    | { kind: 'image'; url: string; width: number; height: number };
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
  values: [
    {
      title: 'No Losses, Only Lessons',
      tone: 'dark',
      body: "When something doesn't work out, we figure out why and come back more experienced.",
      cta: { label: 'Read the story', href: '/pages/our-story' },
      media: {
        kind: 'video',
        src: 'https://cdn.shopify.com/videos/c/o/v/a156e4e88aec47fa96892073a276450f.mp4',
      },
    },
    {
      title: 'Love The Journey',
      tone: 'light',
      body: 'The peak is a moment. The climb is the life. Most of the fun and memories are in the journey.',
      cta: { label: 'Sign up', href: '#newsletter' },
      media: { kind: 'image', url: `${CDN}/social_sharing.jpg`, width: 1656, height: 1104 },
    },
    {
      title: 'Not Too Serious',
      tone: 'dark',
      body: "The training is serious. We're not. We hit our numbers, laugh between sets, and leave the tough-guy act to everyone else.",
      cta: { label: 'Shop tees', href: STORE_LINKS.shopShirts },
      media: { kind: 'image', url: `${CDN}/paul_screaming.jpg`, width: 1656, height: 1104 },
    },
    {
      title: 'Play The Long Game',
      tone: 'light',
      body: "We don't chase quick wins. We build things that outlast the season. Patience is the loudest statement.",
      cta: { label: 'Shop shorts', href: STORE_LINKS.shopShorts },
      media: { kind: 'image', url: `${CDN}/digital_map.png`, width: 1536, height: 1024 },
    },
  ] satisfies ReadonlyArray<CoreValue>,
} as const;

export const HOME_TESTED = {
  headingLines: ['Tested In Training.', 'Refined By Community.'],
  body: MEMBERSHIP_PITCH.body,
  cta: MEMBERSHIP_PITCH.cta,
  video: 'https://cdn.shopify.com/videos/c/o/v/10bb3b154ea542699c4f83e68a45a05f.mp4',
  image: { url: `${CDN}/two_walking_to_workout_cropped.png`, width: 696, height: 728 },
} as const;
