/**
 * Drop 02 (FW26) launch facts, shared by the flagged-off homepage teaser
 * (HOME_DROP_TWO) and the live FIRST LIGHT teaser page — hoisted here so the
 * live page never depends on content a feature flag has turned dark.
 */
export const DROP_TWO_LAUNCH = {
  /**
   * Countdown target: Sept 13 2026, midnight America/Los_Angeles (PDT ⇒ -07:00;
   * the explicit offset keeps Date.parse deterministic on server and client).
   */
  dropIso: '2026-09-13T00:00:00-07:00',
  countdownLabels: ['Days', 'Hrs', 'Min', 'Sec'],
} as const;
