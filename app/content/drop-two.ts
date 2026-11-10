/**
 * Drop 02 (FW26) launch facts, shared by the flag-gated homepage teaser
 * (HOME_DROP_TWO, FEATURE_FLAGS.dropTwoTeaser) and the FIRST LIGHT teaser
 * page — hoisted here so the page never depends on content a feature flag
 * can turn dark.
 */
export const DROP_TWO_LAUNCH = {
  /**
   * Countdown target: Nov 13 2026, 6:00 AM America/Los_Angeles (PST ⇒ -08:00;
   * the explicit offset keeps Date.parse deterministic on server and client).
   */
  dropIso: '2026-11-13T06:00:00-08:00',
  countdownLabels: ['Days', 'Hrs', 'Min', 'Sec'],
} as const;
