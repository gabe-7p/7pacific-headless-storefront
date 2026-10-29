/**
 * Homepage marketing copy + section asset URLs (typed constants, not JSX).
 * Homepage v2 (Oct 2026): every section talks to one athlete ("you") with
 * "we" in the frame. Asset URLs are the Shopify Files / CDN assets already in
 * the slots; their alt text describes the intended Shoot #2 replacement (see
 * homepage-image-swaps.md).
 */

import { BASELINE_DROP } from '~/content/baseline-drop';
import { DROP_TWO_LAUNCH } from '~/content/drop-two';
import { STORE_LINKS } from '~/content/links';
import { MEMBERSHIP_PITCH } from '~/content/membership';
import {
  shopifyImage,
  shopifyVideo,
  shopifyVideoOriginal,
  shopifyVideoThumbnail,
} from '~/lib/shopifyFiles';

export const HOME_HERO = {
  /** Mono spec-strip label above the headline (caps via CSS). */
  eyebrow: 'Designed in San Francisco',
  /**
   * Homepage v2 hero (Oct 2026). The headline is a fact the athlete already
   * knows, never a motivational line: ALL CAPS via CSS, two forced lines,
   * eight words max. Option A per the brief; Option B is
   * ['The stands are empty.', 'We train anyway.'].
   */
  headlineLines: ['the athlete', 'never left.'],
  /** Inter, sentence case. */
  subhead: 'Performance apparel engineered for athletes who never stop competing.',
  /** Primary CTA, mono caps (the page's single Ember moment). Target is the
      BASELINE shop-all collection (Gabe 2026-09-10). */
  cta: { label: 'Shop the kit', href: STORE_LINKS.shopAll },
  /**
   * Text-treatment secondary CTA (renders in chalk, so the one-Ember-moment
   * rule still holds). TODO: point at the Shoot #2 founder video once it is
   * live — until then it anchors to the Starting Lineup grid (FirstDrop's id).
   */
  secondaryCta: { label: 'Read the Story', href: '/pages/our-story' },
  /** Mono spec lines under the CTAs — parked in Hero, not rendered. */
  coordinates: '37.78°N · 122.51°W',
  tagline: 'Lands End · 5:47 AM',
  /** 1080p rendition (full-bleed, above the fold); the poster is the clip's
      first frame, so nothing jumps when playback starts. */
  backgroundVideo: {
    src: shopifyVideo('d70c852042fb4fba9960d717c2bd7f3b', 'HD-1080p-7.2Mbps-99273374'),
    poster: shopifyVideoThumbnail('d70c852042fb4fba9960d717c2bd7f3b', { v: 1793246466 }),
    alt: 'Athlete driving a weighted sled across the gym floor',
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
      media: {
        kind: 'image',
        url: shopifyImage('face-on-shot-zach.jpg', { v: 1785783370 }),
        width: 2048,
        height: 1638,
      },
    },
    comingSoon: {
      eyebrow: 'DAYBREAK™ & FRONTRUNNER™',
      title: 'Coming Soon',
      /** No href — the card CTA opens the waitlist dialog instead. */
      cta: { label: 'Get on the List' },
      media: {
        kind: 'image',
        url: shopifyImage('chirstian-on-stairs.jpg', { v: 1785783387 }),
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
 * BASELINE V01 — the second TeaserSection instance, below the Name/Spec
 * banner: two cards pointing deeper into the first kit (the shop-all
 * collection and the founder film on YouTube). No countdown: the kit is live.
 * The right card loops the drop page's film in the card (BASELINE_DROP.film —
 * one source for the recap video). "Edition" language is gone: the brand
 * versions product like software (V01).
 */
export const HOME_BASELINE_INTRO = {
  heading: 'Baseline V01',
  subtitle:
    'Our first collection of technical training essentials built for the starting line, the weight room, and everything in between. Lightweight fabrics, functional details, and unrestricted movement for whatever the session demands.',
  cards: {
    collection: {
      eyebrow: 'Baseline V01 · Available now',
      title: 'The First Kit',
      cta: { label: 'Shop Baseline V01', href: STORE_LINKS.shopAll },
      media: {
        kind: 'image',
        url: shopifyImage('zach_taking_off_shirt_kezar.jpg', { v: 1793245651 }),
        width: 4260,
        height: 5325,
        alt: 'Athlete pulling off a grey training tee at the rail of a stadium track at dusk',
      },
    },
    film: {
      eyebrow: 'Gabe Dalessandro, Founder',
      title: 'Behind the Build',
      /** External — opens the founder deep-dive on YouTube in a new tab. */
      cta: {
        label: 'Watch the build',
        href: 'https://www.youtube.com/watch?v=jf_E0NEgeCE&t=4s',
      },
      /** The drop page's film, looping muted in the card (object-cover). */
      media: {
        ...BASELINE_DROP.film,
        label: 'Founder logging session times in a notebook at the track',
      },
    },
  },
} as const;

export const HOME_FIRST_DROP = {
  heading: 'The Starting Lineup',
  /** The count is the real number of products in the lineup (the loader's
      grid), never a hardcoded word. */
  subtitle: 'Purpose-built essentials engineered for the way athletes move.',
  // Grid order is merchant-controlled: the manual `homepage-first-drop`
  // collection in Shopify (see HOMEPAGE_COLLECTION_HANDLE in content/links.ts).
} as const;

export type CoreValue = {
  title: string;
  body: string;
  /** Optional — a row can be title + body only (the fourth row). */
  cta?: { label: string; href: string };
  /** Card background tone — rows alternate dark charcoal and light gray. */
  tone: 'dark' | 'light';
  /** The media panel paired with the card in its row. */
  media:
    | { kind: 'video'; src: string; poster?: string; label?: string }
    | { kind: 'image'; url: string; width: number; height: number; alt: string };
};

/**
 * "How We Train" — four rules, not feelings (homepage v2, Oct 2026). Each
 * card is a rule the athlete already follows, in the working voice. The CTAs
 * are not in the brief; they stay outline (never Ember) and point at existing
 * surfaces.
 */
export const HOME_CORE_VALUES = {
  heading: 'How We Train',
  subtitle: `Being an athlete isn't about what you've done. It's about what you're willing to keep working for.`,
  values: [
    {
      title: 'Chase the Numbers',
      tone: 'dark',
      body: "Another plate on the bar, a faster split, a few more inches on your vertical. There's always something worth working toward.",
      cta: { label: 'Shop the kit', href: STORE_LINKS.shopAll },
      media: {
        kind: 'video',
        src: shopifyVideoOriginal('a156e4e88aec47fa96892073a276450f'),
        label: 'Hand writing a split time into a training notebook',
      },
    },
    {
      title: 'RAISE THE STANDARD',
      tone: 'light',
      body: `There's something about training alongside people who expect more of themselves. The competition gets better, the effort goes up, and everyone leaves a little further ahead.`,
      cta: { label: 'Read the story', href: '/pages/our-story' },
      // Pre-cropped to 2:1 so the wide slot trims little at any breakpoint.
      media: {
        kind: 'image',
        url: shopifyImage('squatting_from_behind_cropped.jpg', { v: 1793245647 }),
        width: 3572,
        height: 1786,
        alt: 'Athlete from behind under a loaded barbell in a dark squat rack',
      },
    },
    {
      title: 'LOVE THE JOURNEY',
      tone: 'dark',
      body: `We take training seriously because we love it, and some of our best memories happen between the warm-up and the finish line.`,
      cta: { label: 'Shop shorts', href: STORE_LINKS.shopShorts },
      // 720p rendition — the slot never renders wider than ~800px.
      media: {
        kind: 'video',
        src: shopifyVideo('a95812eca828487099cdec6e8c2ac7ff', 'HD-720p-4.5Mbps-99273348'),
        poster: shopifyVideoThumbnail('a95812eca828487099cdec6e8c2ac7ff', { v: 1793246440 }),
        label: 'Athletes dapping each other up on the track between reps',
      },
    },
    {
      title: 'YOUR BEST SEASON IS NEXT',
      tone: 'light',
      body: `The athlete you used to be got you here. The one you're becoming is what keeps you going.`,
      // Pre-cropped to 2:1, like the squat photo above.
      media: {
        kind: 'image',
        url: shopifyImage('leaning_against_fence_cropped.jpg', { v: 1793245650 }),
        width: 4200,
        height: 2100,
        alt: 'Two athletes in sunglasses leaning against a chain-link fence in full sun',
      },
    },
  ] satisfies ReadonlyArray<CoreValue>,
} as const;

/**
 * "The Roster" — the section at the foot of the page: the pitch and the ask
 * (MEMBERSHIP_PITCH, shared with the PDP brand banner) overlaid on three
 * full-bleed media bands.
 */
export const HOME_ROSTER = {
  headingLines: ['The Roster'],
  body: MEMBERSHIP_PITCH.body,
  /** Opens the signup dialog. */
  cta: MEMBERSHIP_PITCH.cta,
  /** 1080p rendition (full-bleed band); Roster crops it to 80% of its height. */
  video: {
    src: shopifyVideo('89a1da4f4226411083045aab2bd84143', 'HD-1080p-7.2Mbps-99273376'),
    poster: shopifyVideoThumbnail('89a1da4f4226411083045aab2bd84143', { v: 1793246493 }),
    label: 'Athletes training across a wide gym floor',
  },
  /** Pre-cropped to 70% of its 3:2 height; its own ratio sets the band. */
  image: {
    url: shopifyImage('roster_at_kezar_cropped.jpg', { v: 1793245653 }),
    width: 7254,
    height: 3387,
    alt: 'Six athletes stretching along the track and bench at Kezar Stadium',
  },
  /** Third band: two 1.36:1 crops side by side (the band is 2.72:1). */
  bakeryRun: {
    squad: {
      url: shopifyImage('sf_bakery_run_full_squad.jpg', { v: 1793245652 }),
      width: 5015,
      height: 3688,
      alt: 'The full bakery-run squad gathered on the road behind a 7Pacific banner',
    },
    announcement: {
      url: shopifyImage('sf_bakery_run_announcement.jpg', { v: 1793245652 }),
      width: 5066,
      height: 3725,
      alt: 'Runners gathered under the trees listening to the pre-run announcement',
    },
    /** External — opens in a new tab. */
    cta: {
      label: 'Watch bakery run recap',
      href: 'https://www.instagram.com/p/DdpdpIIhBYg/',
    },
  },
} as const;
