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
  body: "This page was built once, for one person. No store, no links, nothing to buy. Just us, saying we're glad to have you on the team. \
  You have a contagious energy and passion for everything you do. And you already train the way we build. Scroll down below to hear a personal message from us about why we're excited to have you on the team.",
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
    // PLACEHOLDER — the Golden Gate homepage video until the real founder
    // message is shot; swap src (and add captions) when it's uploaded.
    src: 'https://cdn.shopify.com/videos/c/o/v/a156e4e88aec47fa96892073a276450f.mp4',
    poster: '',
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:30',
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
  body: "This page was built once, for one person. No store, no links, nothing to buy. Just us, saying we're glad to have you on the team. \
  Between Do Hard Things Friday and Recovery Sunday, you already train the way we build. Scroll down to hear a personal message about why we're excited it's you.",
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
    // PLACEHOLDER — the Golden Gate homepage video until the real founder
    // message is shot; swap src (and add captions) when it's uploaded.
    src: 'https://cdn.shopify.com/videos/c/o/v/a156e4e88aec47fa96892073a276450f.mp4',
    poster: '',
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:30',
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
} satisfies AthleteSigningContent;

/** URL handle → signing page content. Adding an athlete = one line here. */
export const ATHLETE_SIGNINGS: Record<string, AthleteSigningContent> = {
  'amir-smith': AMIR_SMITH,
  'josh-wyche': JOSH_WYCHE,
};

/** Returns null for unknown handles — the route turns that into a 404. */
export const getAthleteSigning = (handle: string | undefined) =>
  (handle && ATHLETE_SIGNINGS[handle]) || null;
