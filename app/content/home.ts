/**
 * Homepage marketing copy + section asset URLs (typed constants, not JSX).
 * Every section talks to one athlete ("you") with "we" in the frame. Asset
 * alt text describes the intended Shoot #2 replacement.
 */

import { BASELINE_DROP } from '~/content/baseline-drop';
import { BRAND } from '~/content/brand';
import { DROP_TWO_LAUNCH } from '~/content/drop-two';
import { PRODUCT_PRICES, STORE_LINKS } from '~/content/links';
import { BAKERY_RUN_RECAP_POST_ID, BEHIND_THE_BUILD_VIDEO_ID } from '~/content/media';
import { MEMBERSHIP_PITCH } from '~/content/membership';
import {
  type ContentMedia,
  filesImage,
  shopifyVideo,
  shopifyVideoThumbnail,
} from '~/lib/shopifyFiles';
import { instagramPostUrl, youtubeWatchUrl } from '~/lib/urls';

/** The homepage's `<title>` (used verbatim) and its 1200×630 share card. */
export const HOME_META = {
  title: '7Pacific · Lightweight and Breathable Training Gear',
  // The hero shot with the black wordmark overlaid (public/og-home.jpg).
  ogImage: `${BRAND.siteUrl}/og-home.jpg`,
} as const;

export const HOME_HERO = {
  /** Mono spec-strip label above the headline (caps via CSS). */
  eyebrow: BRAND.provenance,
  /**
   * The headline is a fact the athlete already knows, never a motivational
   * line: ALL CAPS via CSS, two forced lines, eight words max.
   */
  headlineLines: ['the athlete', 'never left.'],
  /** Inter, sentence case. */
  subhead: 'Performance apparel engineered for athletes who never stop competing.',
  /** Primary CTA, mono caps (the page's single Ember moment). */
  cta: { label: 'Shop the kit', href: STORE_LINKS.shopAll },
  /**
   * Text-treatment secondary CTA (renders in chalk, so the one-Ember-moment
   * rule still holds). TODO: point at the Shoot #2 founder video once it is
   * live — until then it links to Our Story.
   */
  secondaryCta: { label: 'Read the Story', href: STORE_LINKS.ourStory },
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
 * The Name/Spec marquee banner directly below the hero: the three live product families as name-over-spec cells plus the
 * Shop All CTA cell, auto-scrolling. Content is locked — exactly these cells.
 * Names use the product cards' short-title device (family + noun, no "//"
 * descriptor), so the banner and grid read as one system.
 */
export const HOME_NAME_SPEC_BANNER = {
  cells: [
    {
      name: 'AIRRAIL™ 6" Short',
      spec: ['Laser-cut vents', 'Thigh, waistband, core'],
      price: PRODUCT_PRICES.shopShortsMidnight,
      href: STORE_LINKS.shopShortsMidnight,
    },
    {
      name: 'TRACEFIBER™ Tee',
      spec: ['Integrated mesh', 'Shoulder darts'],
      price: PRODUCT_PRICES.shopShirtsMidnight,
      href: STORE_LINKS.shopShirtsMidnight,
    },
    {
      name: 'MOTIONFRAME™ Hat',
      spec: ['Structured, weightless', 'Rear adjuster'],
      price: PRODUCT_PRICES.shopHat,
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
  heading: 'First Light: FW26/27',
  dropIso: DROP_TWO_LAUNCH.dropIso,
  countdownLabels: DROP_TWO_LAUNCH.countdownLabels,
  cards: {
    fallGear: {
      // Same date as the timer (aligned from the mock's 09.10.26 per Gabe).
      eyebrow: 'Drops before sunrise on 11.13.26',
      title: 'Gear Built for Cold Starts',
      cta: { label: 'Browse Collection', href: STORE_LINKS.firstLight },
      media: {
        kind: 'image',
        ...filesImage('zak_against_wall_in_dusty_rose_qz.jpg', {
          v: 1794266813,
          width: 3968,
          height: 4960,
          alt: '',
        }),
      },
    },
    comingSoon: {
      eyebrow: 'DAYBREAK™ Quarter-Zip · FRONTRUNNER™ Jogger',
      title: 'Coming Soon',
      /** No href — the card CTA opens the waitlist dialog instead. */
      cta: { label: 'Join the First Light List' },
      /** Portrait clip: the 1080p rendition (606px wide) — 720p is only 404px. */
      media: {
        kind: 'video',
        src: shopifyVideo('dbcd7431ea074fc69bdb8a744744000c', 'HD-1080p-7.2Mbps-100622493'),
        poster: shopifyVideoThumbnail('dbcd7431ea074fc69bdb8a744744000c', { v: 1794266842 }),
        label: 'Athlete getting ready in a car before a session',
      },
    },
  },
  // The waitlist dialog the Coming Soon card opens reads JOIN_COPY.waitlist
  // (content/join.ts) — it's the list's copy, not the homepage's.
} as const;

/**
 * BASELINE V01 — the second TeaserSection instance, below the Name/Spec
 * banner: two cards pointing deeper into the first kit (the shop-all
 * collection and the founder film on YouTube). No countdown: the kit is live.
 * The right card loops the drop page's film (BASELINE_DROP.film — one source
 * for the recap video).
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
        ...filesImage('zach_taking_off_shirt_kezar.jpg', {
          v: 1793245651,
          width: 4260,
          height: 5325,
          alt: 'Athlete pulling off a grey training tee at the rail of a stadium track at dusk',
        }),
      },
    },
    film: {
      eyebrow: 'Gabe Dalessandro, Founder',
      title: 'Behind the Build',
      /** External — opens the founder deep-dive on YouTube in a new tab. */
      cta: {
        label: 'Watch the build',
        href: youtubeWatchUrl(BEHIND_THE_BUILD_VIDEO_ID, 4),
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
  subtitle: 'Purpose-built essentials engineered for the way athletes move.',
} as const;

export type CoreValue = {
  title: string;
  body: string;
  /** Optional — a row can be title + body only (the fourth row). */
  cta?: { label: string; href: string };
  /** Card background tone — rows alternate dark charcoal and light gray. */
  tone: 'dark' | 'light';
  /** The media panel paired with the card in its row. */
  media: ContentMedia;
};

/**
 * "How We Train" — four rules, not feelings. Each
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
        // 720p rendition — the slot never renders wider than ~800px.
        src: shopifyVideo('a156e4e88aec47fa96892073a276450f', 'HD-720p-3.0Mbps-58365129'),
        label: 'Hand writing a split time into a training notebook',
      },
    },
    {
      title: 'RAISE THE STANDARD',
      tone: 'light',
      body: `There's something about training alongside people who expect more of themselves. The competition gets better, the effort goes up, and everyone leaves a little further ahead.`,
      cta: { label: 'Read the story', href: STORE_LINKS.ourStory },
      // Pre-cropped to 2:1 so the wide slot trims little at any breakpoint.
      media: {
        kind: 'image',
        ...filesImage('squatting_from_behind_cropped.jpg', {
          v: 1793245647,
          width: 3572,
          height: 1786,
          alt: 'Athlete from behind under a loaded barbell in a dark squat rack',
        }),
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
        src: shopifyVideo('2b9c960bb36242588e82355739c40cd2', 'HD-720p-4.5Mbps-99846692'),
        poster: shopifyVideoThumbnail('2b9c960bb36242588e82355739c40cd2', { v: 1793699864 }),
        label: 'Athletes dapping each other up on the bleachers at the track',
      },
    },
    {
      title: 'YOUR BEST SEASON IS NEXT',
      tone: 'light',
      body: `The athlete you used to be got you here. The one you're becoming is what keeps you going.`,
      // Pre-cropped to 2:1, like the squat photo above.
      media: {
        kind: 'image',
        ...filesImage('leaning_against_fence_cropped.jpg', {
          v: 1793245650,
          width: 4200,
          height: 2100,
          alt: 'Two athletes in sunglasses leaning against a chain-link fence in full sun',
        }),
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
  image: filesImage('roster_at_kezar_cropped.jpg', {
    v: 1793245653,
    width: 7254,
    height: 3387,
    alt: 'Six athletes stretching along the track and bench at Kezar Stadium',
  }),
  /** Third band: two 1.36:1 crops side by side (the band is 2.72:1). */
  bakeryRun: {
    squad: filesImage('sf_bakery_run_full_squad.jpg', {
      v: 1793245652,
      width: 5015,
      height: 3688,
      alt: 'The full bakery-run squad gathered on the road behind a 7Pacific banner',
    }),
    announcement: filesImage('sf_bakery_run_announcement.jpg', {
      v: 1793245652,
      width: 5066,
      height: 3725,
      alt: 'Runners gathered under the trees listening to the pre-run announcement',
    }),
    /** External — opens in a new tab. */
    cta: {
      label: 'Watch bakery run recap',
      href: instagramPostUrl(BAKERY_RUN_RECAP_POST_ID),
    },
  },
} as const;
