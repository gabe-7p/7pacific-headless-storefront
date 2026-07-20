/**
 * Athlete-signing page content — one-off commemorative pages (/amir-smith).
 * A second signing is a new `AthleteSigningContent` object rendered by the
 * same app/components/content/AthleteSigning.tsx; no new components.
 *
 * Asset fields (`hero.image.src`, `founderVideo.src`/`poster`) are Shopify
 * CDN URLs, same as content/home.ts. Empty string = not uploaded yet; the
 * page renders styled placeholder panels until they're set.
 */

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
    urlLine: '7pacificapparel.com/amir-smith',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /amir-smith',
  },
  transmissionLine: 'Los Angeles → San Francisco · 07.20.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.20.2026',
  headline: { lead: 'Welcome to the team,', name: 'Amir Smith.' },
  body: "This page was built once, for one person. No store, no links, nothing to buy. Just us, saying we're glad to have you on the team. \
  Scroll down below to hear a personal message from us about why we're excited to have you on the team.",
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Los Angeles · 34.05N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: { src: '', alt: 'Amir Smith mid-dunk, first session' },
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
