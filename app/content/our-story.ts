/**
 * Our Story page copy + asset URLs (typed constants, ported from the live
 * `our-story-page` Liquid section — copy was hardcoded there). Same Shopify
 * Files/CDN imagery as live. Rendered by app/components/content/OurStory.tsx.
 */

import { STORE_LINKS } from '~/content/links';
import { BRAND } from '~/lib/brand';

const CDN = BRAND.filesCdn;

/**
 * A body paragraph: plain text, or segments when part of it is bold
 * (`{ strong }` renders as `<strong>`).
 */
export type Paragraph = string | ReadonlyArray<string | { strong: string }>;

/**
 * Copy from the Oct 2026 Notion revamp ("Revamp of Our Story page", under
 * Website). That page is the source of truth; edit it there first, then here.
 */
export const OUR_STORY = {
  hero: {
    title: 'The athlete never left',
    backgroundImage: { url: `${CDN}/our_story_hero_image.jpg`, width: 4000, height: 2667 },
    // One secondary CTA — the story page carries no Ember moment (7PA-230).
    // Targets the Mountain Mist shorts, not the collection.
    ctas: [{ label: 'Shop', href: STORE_LINKS.shopShorts, variant: 'brand-outline' as const }],
  },
  // Unheaded lead-in between the hero and Our Mission.
  intro: [
    'Somewhere along the way, the jerseys came off. Practices became meetings, teammates became coworkers, and competing for something bigger became something you used to do.',
    'But the athlete never left.',
    'You still know what it feels like to be the first one there, to chase a number nobody else cares about, to be exhausted but find it in you to go again.',
    "That part of you doesn't need to disappear when the season ends.",
    [{ strong: '7Pacific exists to bring it back.' }],
    "You don't need a contract, a coach, or a stadium full of fans to be an athlete.",
    'You just need to keep showing up.',
  ] satisfies ReadonlyArray<Paragraph>,
  // Mission and the making section are two distinct sections: Mission is a
  // full-width statement (no image); the second pairs its heading + body with
  // a small square image.
  mission: {
    heading: 'Our Mission',
    statement: 'Keep the athlete in you alive.',
    body: [
      'We believe being an athlete is something you carry with you long after the final whistle.',
      "It's how you approach a challenge. How you respond when someone raises the standard. How you hold yourself accountable, chase improvement, and push the people around you to do the same.",
      'We build performance training apparel for people who take that seriously. For the ones who remember that the best part was never just the result, but that it was everything that happened on the way there.',
    ],
  },
  fitness: {
    heading: 'Built for the session. Not the sidelines.',
    image: { url: `${CDN}/our_mission2.jpg`, width: 1639, height: 1365 },
    body: [
      "There's no shortage of athletic clothing designed to look like you might work out. That's not what we're here for.",
      "7Pacific is a performance athletic apparel brand built for the next generation of athletes that makes apparel for actual training. Running shorts, performance shirts, and athletic essentials designed to move with you through hard sessions, changing conditions, and whatever the day's program demands.",
      'Our pieces are thoughtfully constructed to serve a purpose beyond being technical: lightweight fabrics, breathability where you need it, freedom to move without distraction.',
      'We design in San Francisco, where hills, unpredictable weather, and early mornings give us plenty of opportunities to put our gear to work.',
    ] satisfies ReadonlyArray<Paragraph>,
  },
  story: {
    heading: 'Our Story',
    image: { url: `${CDN}/our_founder.jpg`, width: 2724, height: 1816 },
    founder: { name: 'Gabriel Dalessandro', role: 'Founder and CEO' },
    body: [
      'I came to California to play football.',
      'At the time, sport was the center of everything. The schedule, the people, the goals, the way I measured progress. I knew what it meant to belong to a team and to work toward something with people who wanted it just as badly as I did.',
      "What I didn't realize was how much of that would stay with me.",
      "Training introduced me to my wife on a volleyball court. It's taken me down ski lines that probably deserved a second thought. It's given me friends, routines, and some of my favorite memories.",
      "And as life evolved, I kept finding the same thing: I didn't need to be playing organized sports to feel like an athlete. I just needed a reason to compete.",
      "These days, the goals look a little different. Maybe it's adding another plate to the bar, getting a few inches back on my vertical, or signing up for something that gives me a reason to train harder. Sometimes it's as simple as having someone next to me who refuses to let me take it easy. There's no season schedule anymore, no coach telling me where to be. But there's always something to work toward, and I still get that same feeling chasing it.",
      [
        "I don't believe the best version of an athlete is the one they used to be. ",
        { strong: "It's the one they're becoming." },
      ],
      'See you out there.',
    ] satisfies ReadonlyArray<Paragraph>,
  },
} as const;
