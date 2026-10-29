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
import { BRAND } from '~/lib/brand';

const CDN = BRAND.filesCdn;

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
  /** Mono spec lines under the CTAs: where and when the hero shot was made.
      Not rendered for now (Gabe, 2026-10-28) — Hero keeps the block parked
      until there is a shot to caption. */
  coordinates: '37.78°N · 122.51°W',
  tagline: 'Lands End · 5:47 AM',
  backgroundImage: {
    url: `${CDN}/24_121_7pacific_03806.jpg`,
    width: 1656,
    height: 1104,
    // Describes the intended Shoot #2 replacement (see
    // content/homepage-image-swaps.md); the file swaps in without a code edit.
    alt: 'Four athletes sprinting on an empty stadium track at dusk',
  },
  /**
   * Local media test (Oct 2026): a hero cut served from `public/media/`,
   * which is a gitignored SYMLINK to ~/Desktop/hero_video_edit on Gabe's
   * machine (the clips are far over GitHub's 100MB file limit, so nothing
   * under /media is in the repo — preview deploys won't have it). `_web`
   * files beside the originals are the crops made for these slots. The
   * backgroundImage above stays as the poster (first paint + no-video
   * fallback). Swap to CDN URLs before this ships beyond a test.
   */
  backgroundVideo: { src: '/media/sled_push_1.mp4' },
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
      media: {
        kind: 'image',
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
      // Local media test (Gabe, 2026-10-28): served from public/media. Cropped
      // from the 4954×6193 original (sips -c 5325 4260 --cropOffset 700 595)
      // so the athlete fills the card. Previous slot: Shopify file 53003545477437
      // (`${CDN}/cole-running-from-behind-test.png?v=1787810904`, 2616×3276).
      // Upload to Shopify Files and point back at the CDN before this ships.
      media: {
        kind: 'image',
        url: '/media/taking_off_shirt_web.jpg',
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
    | { kind: 'video'; src: string; label?: string }
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
        src: 'https://cdn.shopify.com/videos/c/o/v/a156e4e88aec47fa96892073a276450f.mp4',
        label: 'Hand writing a split time into a training notebook',
      },
    },
    {
      title: 'RAISE THE STANDARD',
      tone: 'light',
      body: `There's something about training alongside people who expect more of themselves. The competition gets better, the effort goes up, and everyone leaves a little further ahead.`,
      cta: { label: 'Read the story', href: '/pages/our-story' },
      // Local media test (Gabe, 2026-10-28): served from public/media. A 2:1
      // band cropped from the 3811×4764 portrait original (sips -c 1786 3572
      // --cropOffset 715 120) — head, upper back and the loaded bar — so the
      // wide slot's object-cover trims little at any breakpoint. Previous
      // slot: `${CDN}/social_sharing.jpg` (1656×1104). Upload to Shopify
      // Files and point back at the CDN before this ships.
      media: {
        kind: 'image',
        url: '/media/squatting_from_behind_web.jpg',
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
      // Local media test (Gabe, 2026-10-28): served from public/media. Previous
      // slot: `${CDN}/paul_screaming.jpg` (1656×1104). Upload to Shopify Files
      // and point back at the CDN before this ships.
      media: {
        kind: 'video',
        src: '/media/dapping_up_at_track_edited.mp4',
        label: 'Athletes dapping each other up on the track between reps',
      },
    },
    {
      title: 'YOUR BEST SEASON IS NEXT',
      tone: 'light',
      body: `The athlete you used to be got you here. The one you're becoming is what keeps you going.`,
      // Local media test (Gabe, 2026-10-28): served from public/media. A 2:1
      // band cropped from the 4902×6128 portrait original (sips -c 2100 4200
      // --cropOffset 651 429) — both athletes from the head to the shorts.
      // Upload to Shopify Files and point at the CDN before this ships.
      media: {
        kind: 'image',
        url: '/media/leaning_against_fence_web.jpg',
        width: 4200,
        height: 2100,
        alt: 'Two athletes in sunglasses leaning against a chain-link fence in full sun',
      },
    },
  ] satisfies ReadonlyArray<CoreValue>,
} as const;

/**
 * "The Roster" — the section at the foot of the page (homepage v2, Oct 2026;
 * relaid Gabe 2026-10-28): a centered pitch + ask, then full-bleed media
 * bands stacked with no gap, the video at 80% and the Kezar photo at 70% of
 * their native height (both 75%, then 65%, then 70% earlier on 2026-10-28). Body +
 * CTA are MEMBERSHIP_PITCH (content/membership.ts), shared with the PDP brand
 * banner.
 *
 * Local media test (2026-10-28): both bands are served from public/media.
 * Previous slots: video
 * https://cdn.shopify.com/videos/c/o/v/10bb3b154ea542699c4f83e68a45a05f.mp4,
 * image `${CDN}/two_walking_to_workout_cropped.png` (696×728). Upload to
 * Shopify Files and point back at the CDN before this ships.
 */
export const HOME_ROSTER = {
  headingLines: ['The Roster'],
  body: MEMBERSHIP_PITCH.body,
  /** Opens the signup dialog. */
  cta: MEMBERSHIP_PITCH.cta,
  /** Native 3840×2160; the band shows 80% of its height, anchored 85% down
      (TestedInTraining's aspect-[3840/1728] box + object-cover
      object-[50%_85%] — most of the trim comes off the top, a sliver off the
      floor). */
  video: {
    src: '/media/wide_gym_video.mp4',
    label: 'Athletes training across a wide gym floor',
  },
  /** Pre-cropped to 70% of the 7254×4838 original's height
      (sips -c 3387 7254 --cropOffset 927 0), centered on the group. */
  image: {
    url: '/media/roster_at_kezar_web.jpg',
    width: 7254,
    height: 3387,
    alt: 'Six athletes stretching along the track and bench at Kezar Stadium',
  },
  /**
   * Third band: the SF bakery run, two 1.36:1 halves side by side in a
   * 2.72:1 box — a step shorter than the Kezar band (Gabe, 2026-10-28). Both
   * cropped from 3:2 originals ~15% wider than the earlier square and
   * anchored to the bottom edge, so the trees go and the crowd stays —
   * squad: 6542×4361 (sips -c 3688 5015 --cropOffset 673 1201, centred on the
   * banner); announcement: 6607×4405 (sips -c 3725 5066 --cropOffset 680 775,
   * centred on the speaker).
   */
  bakeryRun: {
    squad: {
      url: '/media/sf_bakery_run_full_squad_web.jpg',
      width: 5015,
      height: 3688,
      alt: 'The full bakery-run squad gathered on the road behind a 7Pacific banner',
    },
    announcement: {
      url: '/media/sf_bakery_run_announcement_web.jpg',
      width: 5066,
      height: 3725,
      alt: 'Runners gathered under the trees listening to the pre-run announcement',
    },
    /** External — the recap post on Instagram, new tab. */
    cta: {
      label: 'Watch bakery run recap',
      href: 'https://www.instagram.com/p/DdpdpIIhBYg/',
    },
  },
} as const;
