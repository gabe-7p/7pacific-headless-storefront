/**
 * /drops/first-light — the Drop 02 "FIRST LIGHT" drop page (route
 * drops.first-light.tsx → components/content/FirstLightTeaser). The intro,
 * hero and early-access copy are from Gabe's approved mock (2026-08-10); the
 * receipts, standard, pieces and closer (the BASELINE page's sections,
 * components/content/DropSections) were added at launch (2026-11-12).
 */

import type { MediaSlotSource } from '~/components/common/MediaSlot';
import type { DropMastheadContent } from '~/components/content/DropMasthead';
import { DROP_TWO_LAUNCH } from '~/content/drop-two';
import { WAITLIST_SUCCESS_MESSAGE } from '~/content/join';
import { PRODUCT_PRICES, STORE_LINKS } from '~/content/links';
import {
  filesImage,
  shopifyImageCard,
  shopifyVideo,
  shopifyVideoThumbnail,
} from '~/lib/shopifyFiles';

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
    'A quarter-zip and jogger for athletes who train before sunrise. Warm at the start, cool when the pace picks up. Out now.',
  /** The share image (og:image): the hero photo, cut to a 1200×630 card head to hips (the 4:5 source would
      lose his head to a scraper's centre crop). */
  ogImage: shopifyImageCard('chris_in_qz_at_gym.jpg', {
    v: 1794266813,
    region: { left: 0, top: 750, width: 3968, height: 2083 },
    width: 1200,
    height: 630,
  }),
  intro:
    'Every team has the athletes who are there before the lights come on. First Light is their kit. Warm when you step out of the car, lightweight and breathable by the second rep.',
  /** Full-bleed hero band directly under the intro — the same gym photo as
      the og:image (and the countdown backdrop). 4:5 on mobile shows the whole
      frame; the 8:3 desktop band holds the window high (`focus: 'nearTop'`)
      so his head stays in. */
  heroMedia: {
    kind: 'image',
    ...filesImage('chris_in_qz_at_gym.jpg', {
      v: 1794266813,
      width: 3968,
      height: 4960,
      alt: 'Athlete in a quarter-zip standing hands on hips in a dark gym',
    }),
    focus: 'nearTop',
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
  /** The launch line on the homepage First Light teaser, where the countdown
      sat before launch. ALL CAPS via CSS. */
  tagline: 'Start your mornings earlier with First Light',
  receipts: {
    heading: 'Proving the performance',
    subtitle:
      'Every piece went through months of dark, cold sessions before we put it on sale. \
Here’s what that looked like in numbers. Want the full log? Message us and we’ll send it.',
    stats: [
      { label: 'Coldest session', value: '46', accent: '°' },
      { label: 'AM, earliest session', value: '5:11' },
      { label: 'Athletes in the test crew', value: '07' },
      // Placeholder figure — confirm against the test log.
      { label: 'Sessions before sunrise', value: '62' },
    ],
  },
  standard: {
    heading: 'Built for the athletes who are up before the sun.',
    subtitle:
      'The alarm goes off in the dark. You’re out the door before you’re fully awake. \
First Light was built for that window: warm in the cold car park, breathable by the \
second rep, and still dry when the sun finally shows up.',
    /** Wide band under the header: two athletes lacing up at an open trunk
        before a session (15s cut from 0:02 of the 4K original, uploaded
        2026-11-12), shown at 70% of its 16:9 height (the `loop` ratio). The
        day photos below are First Light shots; the 4:5 portraits sit in 4:3
        boxes, so `focus` picks the window. */
    banner: {
      kind: 'video',
      src: shopifyVideo('1a7c4dd44acb40aebc950c815a966e46', 'HD-1080p-7.2Mbps-101168666'),
      poster: shopifyVideoThumbnail('1a7c4dd44acb40aebc950c815a966e46', { v: 1794548649 }),
      label:
        'Two athletes in First Light gear lacing up their shoes on an open car trunk in a dark parking lot',
    } satisfies MediaSlotSource,
    days: [
      {
        index: '01',
        title: 'Cold starts',
        body: 'Stepping out into 40-something degrees. The quarter-zip holds heat through the warm-up so you don’t spend it shivering.',
        media: {
          kind: 'image',
          ...filesImage('chris-stretching-at-kezar-arch.jpg', {
            v: 1794549547,
            width: 3999,
            height: 4998,
            alt: 'Athlete in a black quarter-zip and jogger pulling a knee to his chest under the Kezar Stadium arch at dawn',
          }),
          focus: 'upper',
        },
      },
      {
        index: '02',
        title: 'Pre-dawn miles',
        body: 'Dark streets, wet air, long efforts. The jogger moves four ways, and nothing rides up or holds water.',
        media: {
          kind: 'image',
          ...filesImage('3-athletes-stretching-at-kezar.jpg', {
            v: 1794549549,
            width: 3998,
            height: 4998,
            alt: 'Three athletes in First Light gear stretching their legs on the trackside rail at Kezar Stadium',
          }),
          focus: 'upper',
        },
      },
      {
        index: '03',
        title: 'Last rep at sunrise',
        body: 'By the final set the sun’s up and you’re running hot. Unzip, let it vent, and finish the session dry.',
        media: {
          kind: 'image',
          ...filesImage('running_up_california_street.jpg', {
            v: 1794266813,
            width: 3968,
            height: 4960,
            alt: 'Two runners in quarter-zips running up California Street, San Francisco',
          }),
          focus: 'lower',
        },
      },
    ],
  },
  pieces: {
    heading: 'The pieces you need to get you up early',
    subtitle:
      'The DAYBREAK™ quarter-zip in Dusty Rose and Battleship Gray. The FRONTRUNNER™ \
jogger in Midnight. Everything you need for the first hour of the day.',
    shopLabel: 'Shop',
    /** Names mirror the live Shopify products (2026-11-12); prices come from
        `PRODUCT_PRICES` (content/links.ts). Gym shots from the First Light
        shoot; the jogger's is 2:3, cropped by the 4:5 tile. */
    products: [
      {
        name: 'Daybreak™ quarter-zip · Dusty Rose',
        price: PRODUCT_PRICES.shopQuarterzipDustyRose,
        href: STORE_LINKS.shopQuarterzipDustyRose,
        media: {
          kind: 'image',
          ...filesImage('first-light-gym-shot-chris-dusty-rose-qz-back-full-body-2.jpg', {
            v: 1794549525,
            width: 3998,
            height: 4998,
            alt: 'Athlete in the Dusty Rose DAYBREAK quarter-zip from behind, hands on hips, facing a squat rack',
          }),
        },
      },
      {
        name: 'Frontrunner™ jogger · Midnight',
        price: PRODUCT_PRICES.shopJoggerMidnight,
        href: STORE_LINKS.shopJoggerMidnight,
        media: {
          kind: 'image',
          ...filesImage('first-light-gym-shot-zak-black-jogger-back-knee-down.jpg', {
            v: 1794549544,
            width: 3651,
            height: 5474,
            alt: 'The Midnight FRONTRUNNER jogger from behind, knee to shoes, in a dark gym',
          }),
        },
      },
      {
        name: 'Daybreak™ quarter-zip · Battleship Gray',
        price: PRODUCT_PRICES.shopQuarterzipBattleshipGray,
        href: STORE_LINKS.shopQuarterzipBattleshipGray,
        media: {
          kind: 'image',
          ...filesImage('first-light-gym-shot-zak-grey-qz-front-chest-up-2.jpg', {
            v: 1794549546,
            width: 3998,
            height: 4998,
            alt: 'Athlete in the Battleship Gray DAYBREAK quarter-zip stretching an arm across his chest in a dark gym',
          }),
        },
      },
    ],
  },
  closer: {
    eyebrow: 'ED. 02 · Live now',
    headingLines: ['Beat the sun.', 'Then beat your time.'],
    body: 'Early starts are where the work gets done. Get there first, in gear tested on the same cold mornings.',
    cta: { label: 'Shop First Light', href: STORE_LINKS.firstLightCollection },
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
