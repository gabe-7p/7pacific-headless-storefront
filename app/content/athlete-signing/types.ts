/**
 * The typed shapes behind every athlete-signing page (see `index.ts`).
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
    /**
     * `fit: 'contain'` letterboxes the full image inside the panel instead of
     * cover-cropping it — for shots whose edges can't be lost (default cover).
     */
    image: { src: string; alt: string; width: number; height: number; fit?: 'cover' | 'contain' };
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
