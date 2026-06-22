/**
 * Our Story page copy + asset URLs (typed constants, ported from the live
 * `our-story-page` Liquid section — copy was hardcoded there). Same Shopify
 * Files/CDN imagery as live. Rendered by app/components/content/OurStory.tsx.
 */

import { fileUrl } from '~/lib/shopify';

export const OUR_STORY = {
  hero: {
    title: 'About Us',
    backgroundImage: fileUrl('our_story_hero_image.jpg'),
    ctas: [
      { label: 'Join The Movement', href: '#newsletter', variant: 'brand' as const },
      {
        label: 'Train With Us',
        href: '/products/airrail-6-performance-shorts-mountain-mist',
        variant: 'outline' as const,
      },
    ],
  },
  mission: {
    eyebrow: 'Our Mission',
    statement:
      'Create the most lightweight and breathable training gear, while building a community that pushes you further.',
    heading: "Fitness is more than movement, it's momentum",
    image: fileUrl('our_mission2.jpg'),
    body: [
      'The most growth happens when you sweat together. We exist to inspire each other through training, mindset, and the power of community. Every product, every session, and every rep is designed to fuel progress together.',
      "We found a lot of brands out there try to be many things to many people. Clothes that are designed to do everything okay, but nothing great. We're not that brand.",
      'We’re creating gear that was designed for one purpose: Be as light and breathable as possible so you only ever have to focus on the workout at hand.',
    ],
  },
  story: {
    eyebrow: 'Our Story',
    image: fileUrl('our_founder.jpg'),
    founder: { name: 'Gabriel Dalessandro', role: 'Founder & CEO' },
    body: [
      'Fitness opens doors. Fitness shows us that there’s more out there, more to see, more to chase, more to become.',
      'For me, it changed everything. It brought me to California to play football, introduced me to my fiancée on a volleyball court, and took me skiing across some of the most awe-inspiring places in the world. Wherever life led, fitness brought connection through groups big and small that trained hard, showed up, and pushed one another further.',
      'Through it all, one truth stuck: the discipline we build in training makes every other part of life that much better. That’s why 7Pacific exists. To create the kind of gear that keeps up with your pursuit, and a community that reminds us we’re never in it alone.',
    ],
  },
} as const;
