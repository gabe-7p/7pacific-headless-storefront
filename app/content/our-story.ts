/**
 * Our Story page copy + asset URLs (typed constants, ported from the live
 * `our-story-page` Liquid section — copy was hardcoded there). Same Shopify
 * Files/CDN imagery as live. Rendered by app/components/content/OurStory.tsx.
 */

import { STORE_LINKS } from '~/content/links';
import { BRAND } from '~/lib/brand';

const CDN = BRAND.filesCdn;

/**
 * Rewritten per 7PA-239: the locked mission verbatim, the dry working
 * register (Plain 3 / Direct 3 on the Tone Chart), and a founder letter that
 * reads as plain text. No "movement," no "momentum," no motivational close.
 */
export const OUR_STORY = {
  hero: {
    title: 'About',
    backgroundImage: `${CDN}/our_story_hero_image.jpg`,
    // One secondary CTA — the story page carries no Ember moment (7PA-230).
    ctas: [{ label: 'Shop', href: STORE_LINKS.shopAll, variant: 'brand-outline' as const }],
  },
  // Mission and the making section are two distinct sections: Mission is a
  // full-width statement (no image); the second pairs its heading + body with
  // a small square image.
  mission: {
    heading: 'Our Mission',
    // The locked mission from the Strategy Canvas — verbatim, never restated.
    statement:
      '7Pacific builds gear for athletes who came for the hard part and reminds them the journey is the most fun part.',
  },
  fitness: {
    heading: 'For training, not errands',
    image: `${CDN}/our_mission2.jpg`,
    body: [
      'We make shorts, tees, and hats that remove specific frictions: heat, weight, chafe. Designed in San Francisco, tested on the hills we actually run, before sunrise more often than not.',
      "A lot of brands try to be many things to many people: clothes built to do everything okay and nothing great. We're not that brand. Every piece here earns its place in a session first.",
      'No wellness. No hustle-worship. Training is the best part of the day; the gear should act like it.',
    ],
  },
  story: {
    heading: 'Our Story',
    image: `${CDN}/our_founder.jpg`,
    founder: { name: 'Gabriel Dalessandro', role: 'Founder' },
    body: [
      "Training brought me to California to play football. It introduced me to my fiancée on a volleyball court. It's taken me up ski lines I had no business looking at, and it built most of the friendships I count on: groups big and small that showed up, trained hard, and pushed each other further.",
      "Somewhere in there the point changed. Results come and go in an afternoon; the early sessions before them are where the actual living happens. 7Pacific exists to build gear for that part, and to remind you, mid-effort, that it's the part you came for.",
      "The gear itself stays simple: light, breathable, built to disappear so the work can't hide behind it. If it doesn't earn its place in a session, we don't ship it.",
      'See you out there.',
    ],
  },
} as const;
