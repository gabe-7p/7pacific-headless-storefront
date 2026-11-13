/**
 * Drop 02 (FW26) launch facts, shared by the homepage First Light section
 * (HOME_DROP_TWO) and the FIRST LIGHT drop page. Nothing renders a countdown
 * since launch; the components (common/Countdown, FirstLightTeaser's
 * CountdownSection) are kept for the next drop.
 */
export const DROP_TWO_LAUNCH = {
  /**
   * Countdown target: Nov 13 2026, 6:00 AM America/Los_Angeles (PST ⇒ -08:00;
   * the explicit offset keeps Date.parse deterministic on server and client).
   */
  dropIso: '2026-11-13T06:00:00-08:00',
  countdownLabels: ['Days', 'Hrs', 'Min', 'Sec'],
} as const;
