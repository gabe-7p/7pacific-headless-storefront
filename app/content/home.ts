/**
 * Homepage marketing copy + section asset URLs (typed constants, not JSX).
 * Mirrors the live Impulse homepage sections: custom-hero-image, main-collection,
 * core-values-homepage-v2, black-text-image-split. Asset URLs are the same Shopify
 * Files / CDN assets the live theme uses (hero image, the two looping videos, and
 * the core-values photography) — change a value here, the homepage follows.
 */

const CDN = 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files';

export const HOME_HERO = {
  eyebrow: 'Introducing',
  /** Screen-reader text for the hero's h1 — visually it's the wordmark SVG. */
  wordmark: 'PACIFIC',
  subtitle: 'Discipline Looks Good Now',
  cta: { label: 'Own The Start', href: '/collections/summer-25' },
  /** Intrinsic dimensions drive the hero's natural aspect ratio (3:2). */
  backgroundImage: {
    url: `${CDN}/24_121_7pacific_03806.jpg`,
    width: 1656,
    height: 1104,
  },
} as const;

export const HOME_FIRST_DROP = {
  heading: 'Our First Drop',
  subtitle: 'Ultra-Light. Breathable. Ready To Train. Click in to see why.',
  /**
   * Display order for the grid, matching the live homepage (shorts, tees, hat —
   * same order as the color_siblings metafields). Products missing from this list render
   * after the ordered ones, so a new product appears rather than disappearing.
   */
  productOrder: [
    'airrail-6-performance-shorts-mountain-mist',
    'airrail-6-performance-shorts-mint',
    'airrail-6-performance-shorts-midnight',
    'tracefiber-performance-tech-tee-white',
    'tracefiber-performance-tech-tee-mint',
    'tracefiber-performance-tech-tee-midnight',
    'tracefiber-performance-tech-tee-tangerine',
    'tracefiber-performance-tech-tee-mountain-mist',
    'motionframe-running-hat-white',
  ],
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
      cta: {
        label: 'Shop Shirts',
        href: '/products/tracefiber-performance-tech-tee-mountain-mist',
      },
    },
    {
      title: 'Track The Truth',
      tone: 'light',
      body: 'The space between the start and end point is yours to shape. Measure the work to watch the evolution.',
      cta: { label: 'Shop Shorts', href: '/products/airrail-6-performance-shorts-mountain-mist' },
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
