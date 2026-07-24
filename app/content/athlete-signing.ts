/**
 * Athlete-signing page content — one-off commemorative pages served by the
 * dynamic route /athletes/<handle> (routes/athletes.$handle.tsx). A new
 * signing is a new `AthleteSigningContent` object plus one line in the
 * `ATHLETE_SIGNINGS` registry at the bottom — no new routes or components.
 *
 * Asset fields (`hero.image.src`, `founderVideo.src`/`poster`) are Shopify
 * CDN URLs, same as content/home.ts. Empty string = not uploaded yet; the
 * page renders styled placeholder panels until they're set.
 */

import { BRAND } from '~/lib/brand';

const CDN = BRAND.filesCdn;

/**
 * Marker position along the performance-readout scale, in 5% steps. A union
 * (not a free number) so the component can map it to static Tailwind classes —
 * inline styles are banned and Tailwind can't generate classes at runtime.
 */
export type ScaleMarkerPercent =
  | 0
  | 5
  | 10
  | 15
  | 20
  | 25
  | 30
  | 35
  | 40
  | 45
  | 50
  | 55
  | 60
  | 65
  | 70
  | 75
  | 80
  | 85
  | 90
  | 95
  | 100;

export type AthleteSigningContent = {
  /** The page-specific top/bottom bars (this page opts out of site chrome). */
  chrome: {
    badge: string;
    privacy: string;
    edition: string;
    /** Mobile-only line under the top bar. */
    urlLine: string;
    designedLine: string;
    existsLine: string;
  };
  /** Desktop eyebrow above the headline. */
  transmissionLine: string;
  /** Mobile eyebrow above the headline. */
  eyebrowLine: string;
  /** `lead` renders in white, `name` in gray on its own line. */
  headline: { lead: string; name: string };
  body: string;
  signedLine: string;
  hero: {
    modeLabel: string;
    locationLine: string;
    camLine: string;
    /** Mobile-only caption row under the panel. */
    shotLine: string;
    image: { src: string; alt: string };
  };
  founderVideo: {
    number: string;
    title: string;
    src: string;
    poster: string;
    /** WebVTT captions URL — the founder message has speech. */
    captions: string;
    attribution: string;
    duration: string;
  };
  readout: {
    number: string;
    title: string;
    stat: { label: string; value: string; verified: boolean };
    scale: { markerPercent: ScaleMarkerPercent; markerLabel: string };
    fields: Array<{ label: string; value: string }>;
  };
  /**
   * The creator module — typed copy only (no CDN assets, no live API data).
   * `handle` is the bare IG username; the component builds the profile URL.
   */
  instagram: {
    number: string;
    title: string;
    handle: string;
    tagline: string;
    /** Recurring content series, rendered as SERIES 01/02/… rows. */
    series: Array<string>;
    linkLabel: string;
  };
};

export const AMIR_SMITH = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    urlLine: '7pacificapparel.com/athletes/amir-smith',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /athletes/amir-smith',
  },
  transmissionLine: 'Los Angeles → San Francisco · 07.20.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.20.2026',
  headline: { lead: 'Welcome to the team,', name: 'Amir Smith.' },
  body: 'It’s official. We created this page to welcome you to the 7Pacific Athlete Creator team. You bring a rare mix of passion, \
  personality, and relentless energy. That’s exactly what we want this team to represent. You already train the way we build: with purpose, \
  intensity, and zero shortcuts. Scroll down to watch a personal message from us about why we’re fired up to have you on the team.',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Los Angeles · 34.05N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: { src: `${CDN}/amir-smith-athlete.png`, alt: 'Amir Smith mid-dunk, first session' },
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    // IMG-0004 in Shopify Files (portrait, 39s) — Shopify's 720p transcode;
    // poster is the custom preview thumbnail set in Shopify admin.
    src: 'https://cdn.shopify.com/videos/c/vp/4e4b180b71854aeb9ddb8aed88129177/4e4b180b71854aeb9ddb8aed88129177.HD-720p-4.5Mbps-89659002.mp4',
    poster: `${CDN}/preview_images/Screenshot_2026-07-22_at_11.02.10_PM.png`,
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:39',
  },
  readout: {
    number: '02',
    title: 'Performance Readout',
    stat: { label: 'Max Vertical', value: '44.0"', verified: true },
    scale: { markerPercent: 90, markerLabel: 'Rim +8"' },
    fields: [
      { label: 'League', value: 'Hoopbus' },
      { label: 'Base', value: 'Los Angeles' },
      { label: 'Reach', value: '375K' },
      { label: 'Series Tagline', value: 'How To Be a Professional Athlete' },
    ],
  },
  instagram: {
    number: '03',
    title: 'The Creator',
    handle: 'the.amirsmith',
    tagline: 'Documenting the making of a professional athlete.',
    series: ['How To Be a Professional Athlete'],
    linkLabel: 'Open Instagram',
  },
} satisfies AthleteSigningContent;

/**
 * Josh Wyche — D1 guard at VCU (Atlantic 10), previously Lafayette; documents
 * life as a D1 athlete on IG (@joshwyche1): "Do Hard Things Friday" and
 * "Recovery Sunday" training series. Base: Richmond, VA.
 */
export const JOSH_WYCHE = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    urlLine: '7pacificapparel.com/athletes/josh-wyche',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /athletes/josh-wyche',
  },
  transmissionLine: 'Richmond → San Francisco · 07.20.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.20.2026',
  headline: { lead: 'Welcome to the team,', name: 'Josh Wyche.' },
  body: 'It’s official. We made this page to welcome you to the 7Pacific Athlete Creator team. You bring the kind \
   of energy people notice. There’s real passion behind everything you do, and that’s exactly what we want this team to represent. \
    Between Do Hard Things Friday and Recovery Sunday, you already train the way we build. Consistently, intentionally, and always willing \
    to put in the work. Scroll down for a personal message from us about why we’re so excited to have you on the team.',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Richmond · 37.54N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: { src: `${CDN}/josh-wyche-athlete.png`, alt: 'Josh Wyche on the court' },
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    // IMG-0006 in Shopify Files (portrait, 40s) — Shopify's 720p transcode;
    // poster is the custom preview thumbnail set in Shopify admin.
    src: 'https://cdn.shopify.com/videos/c/vp/b01389f236234449b4e379bb39620772/b01389f236234449b4e379bb39620772.HD-720p-4.5Mbps-89659216.mp4',
    poster: `${CDN}/preview_images/Screenshot_2026-07-22_at_11.02.10_PM_0f4117ad-5577-48b3-8fee-1c8c77662097.png`,
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:40',
  },
  readout: {
    number: '02',
    title: 'Performance Readout',
    stat: { label: 'Division', value: 'D1', verified: true },
    scale: { markerPercent: 85, markerLabel: 'A-10' },
    fields: [
      { label: 'Program', value: 'VCU Hoops' },
      { label: 'Base', value: 'Richmond' },
      { label: 'Reach', value: '4.1K' },
      { label: 'Series Tagline', value: 'Recovery Sundays + Do Hard Things Fridays' },
    ],
  },
  instagram: {
    number: '03',
    title: 'The Creator',
    handle: 'joshwyche1',
    tagline: 'Documenting life as a D1 athlete.',
    series: ['Do Hard Things Friday', 'Recovery Sunday', 'A Day in the Life at VCU'],
    linkLabel: 'Open Instagram',
  },
} satisfies AthleteSigningContent;

/**
 * Kenneth Pierce — hybrid athlete (strength x endurance) in Austin, TX;
 * three marathons with a 3:37 PR, Hyrox Dallas next. Creator/model on IG
 * (@kennethpiercejr, "Runner Knowledge" series), ~25.6K followers.
 */
export const KENNETH_PIERCE = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    urlLine: '7pacificapparel.com/athletes/kenneth-pierce',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /athletes/kenneth-pierce',
  },
  transmissionLine: 'Austin → San Francisco · 07.24.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.24.2026',
  headline: { lead: 'Welcome to the team,', name: 'Kenneth Pierce.' },
  body: 'It’s official. We created this page to welcome you to the 7Pacific Athlete Creator team. Strength and endurance, \
  three marathons deep, and the next start line already circled — you turn hard seasons into PRs and make the work itself \
  the story. That’s exactly how we build. Scroll down to watch a personal message from us about why we’re fired up to have \
  you on the team.',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Austin · 30.27N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: { src: '', alt: 'Kenneth Pierce mid-run' },
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    // PLACEHOLDER — the Golden Gate homepage video until Kenneth's founder
    // message is recorded; swap src/poster (and captions) when uploaded.
    src: 'https://cdn.shopify.com/videos/c/o/v/a156e4e88aec47fa96892073a276450f.mp4',
    poster: '',
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:30',
  },
  readout: {
    number: '02',
    title: 'Performance Readout',
    stat: { label: 'Marathon PR', value: '3:37', verified: true },
    scale: { markerPercent: 85, markerLabel: '26.2 ×3' },
    fields: [
      { label: 'Discipline', value: 'Strength x Endurance' },
      { label: 'Base', value: 'Austin' },
      { label: 'Reach', value: '25.6K' },
      { label: 'Next', value: 'Hyrox Dallas' },
    ],
  },
  instagram: {
    number: '03',
    title: 'The Creator',
    handle: 'kennethpiercejr',
    tagline: 'Strength x Endurance · Creator · Model · Faith.',
    series: ['Runner Knowledge', 'Road to Hyrox Dallas'],
    linkLabel: 'Open Instagram',
  },
} satisfies AthleteSigningContent;

/** URL handle → signing page content. Adding an athlete = one line here. */
export const ATHLETE_SIGNINGS: Record<string, AthleteSigningContent> = {
  'amir-smith': AMIR_SMITH,
  'josh-wyche': JOSH_WYCHE,
  'kenneth-pierce': KENNETH_PIERCE,
};

/** Returns null for unknown handles — the route turns that into a 404. */
export const getAthleteSigning = (handle: string | undefined) =>
  (handle && ATHLETE_SIGNINGS[handle]) || null;
