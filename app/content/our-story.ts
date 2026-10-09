/**
 * Our Story page — "The File". Copy from the Oct 2026 Notion revamp ("Revamp
 * of Our Story page", under Website); that page is the source of truth, so
 * edit it there first, then here. The page tells the story as an athlete's
 * issued file: four numbered chapters (status, mission, kit, roster), ending
 * on the founder's sign-off. Rendered by app/components/content/OurStory.tsx.
 *
 * Photography is STAND-IN: the brand world calls for direct-flash, night-
 * session shots and the library only holds the fog/daylight shoot. Every
 * photo is a `MediaSlotSource`, so swapping in the new shoot is a one-line
 * change per slot, no component edits. The mono labels (chapter titles,
 * readout, roster fields, strip captions) are art direction, not body copy.
 */

import type { MediaSlotSource } from '~/components/common/MediaSlot';
import { STORE_LINKS } from '~/content/links';
import { BRAND } from '~/lib/brand';

const CDN = BRAND.filesCdn;

const image = (src: string, alt: string, focus?: 'top' | 'upper' | 'right'): MediaSlotSource =>
  focus ? { kind: 'image', src, alt, focus } : { kind: 'image', src, alt };

export const OUR_STORY = {
  hero: {
    title: ['The athlete', 'never left'],
    /** Mono readout that types on under the header — steps(30) in
        --animate-type-on is tuned to roughly this length. */
    readout: 'File 01 · Our Story · San Francisco',
    image: { url: `${CDN}/face-on-shot-zach.jpg?v=1785783370`, width: 2048, height: 1638 },
    // The page's only CTA — the story page carries no Ember moment (7PA-230).
    cta: { label: 'Shop', href: STORE_LINKS.shopShorts },
  },
  status: {
    number: '01',
    title: 'About',
    open: 'Somewhere along the way, the jerseys came off. Practices became meetings, teammates became coworkers, and competing for something bigger became something you used to do.',
    media: image(
      `${CDN}/chirstian-on-stairs.jpg?v=1785783387&width=900`,
      'Athlete on a stone stairway, hands on hips'
    ),
    statement: 'But the athlete never left.',
    after: [
      'You still know what it feels like to be the first one there, to chase a number nobody else cares about, to be exhausted but find it in you to go again.',
      "That part of you doesn't need to disappear when the season ends.",
    ],
    callout: '7Pacific exists to bring it back.',
    close: [
      "You don't need a contract, a coach, or a stadium full of fans to be an athlete.",
      "You need to keep showing up, keep pushing your limits, and have gear that's built to keep up.",
    ],
  },
  mission: {
    number: '02',
    title: 'Our Mission',
    statement: 'Keep the athlete in you alive.',
    body: [
      'We believe being an athlete is something you carry with you long after the final whistle.',
      "It's how you approach a challenge. How you respond when someone raises the standard. How you hold yourself accountable, chase improvement, and push the people around you to do the same.",
      "We build high-performance training apparel for athletes who approach every session with intention. Technical fabrics, considered construction, and functional details designed to support the way you move, whether you're lifting heavier, running faster, or training for your next competition.",
    ],
    close: 'Because the work deserves gear that takes it just as seriously.',
  },
  kit: {
    number: '03',
    title: 'Built for the session',
    headingLines: ['Built for the session.', 'Not the sidelines.'],
    banner: image(
      `${CDN}/potential_hero_image.jpg?width=1600`,
      'Two athletes walking out to train, fog behind them',
      'upper'
    ),
    // Captions are the chapter's own words: running, weight training,
    // strength training.
    strip: [
      {
        caption: 'Running',
        media: image(
          `${CDN}/our_story_hero_image.jpg?width=900`,
          'Athletes climbing a coastal stair'
        ),
      },
      {
        caption: 'Weight training',
        media: image(`${CDN}/our_mission2.jpg?width=900`, 'Group carrying weights through fog'),
      },
      {
        caption: 'Strength training',
        media: image(
          `${CDN}/two_walking_to_workout_cropped.png?width=900`,
          'Two athletes walking to a workout',
          'top'
        ),
      },
    ],
    body: [
      '7Pacific creates technical performance apparel for weight training, strength training, HYROX, running, and everything in between. Gear built for athletes who demand more from their clothing because they demand more from themselves.',
      'We obsess over the details that make a difference during training. Four-way stretch that moves through every squat, sprint, and lift. Lightweight fabrics and strategically placed ventilation to manage heat. Bonded construction that reduces unnecessary bulk, with functional details designed to keep distractions to a minimum.',
      'Every feature has a purpose, and every piece has to earn its place in your rotation.',
      'Designed in San Francisco and developed for the demands of real training, our gear is built to perform when the work gets serious.',
    ],
  },
  roster: {
    number: '04',
    title: 'Our Story',
    card: {
      // Landscape source, framed right so the whole face stays in the crop.
      media: image(`${CDN}/our_founder.jpg?width=1200`, 'Gabriel Dalessandro', 'right'),
      fields: [
        { label: 'Name', value: 'Dalessandro, Gabriel' },
        { label: 'Role', value: 'Founder and CEO' },
        { label: 'Base', value: 'San Francisco' },
        { label: 'Status', value: 'Active', live: true },
      ],
    },
    lede: 'I came to California to play football.',
    body: [
      'At the time, sport was the center of everything. The schedule, the people, the goals, the way I measured progress. I knew what it meant to belong to a team and to work toward something with people who wanted it just as badly as I did.',
      "What I didn't realize was how much of that would stay with me.",
      "Training introduced me to my wife on a volleyball court. It's taken me down ski lines that probably deserved a second thought. It's given me friends, routines, and some of my favorite memories.",
      "And as life evolved, I kept finding the same thing: I didn't need to be playing organized sports to feel like an athlete. I just needed a reason to compete.",
      "These days, the goals look a little different. Maybe it's adding another plate to the bar, getting a few inches back on my vertical, or signing up for something that gives me a reason to train harder. Sometimes it's as simple as having someone next to me who refuses to let me take it easy.",
      'When performing at my best, I notice how much the right gear matters. So I built apparel that was as intentional as the training itself, where the fit, fabric, and construction all had a reason for being there. That became the foundation for 7Pacific.',
      "There's no season schedule anymore, no coach telling me where to be. But there's always something to work toward, and I still get that same feeling chasing it.",
      "I don't believe the best version of an athlete is the one they used to be.",
    ],
    pull: "It's the one they're becoming",
    close: 'See you out there.',
    founder: { name: 'Gabriel Dalessandro', role: 'Founder and CEO' },
  },
} as const;
