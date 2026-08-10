export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Decomposes the time remaining until `targetMs` into whole days/hours/
 * minutes/seconds. Clamps to all zeros at and past the target so a finished
 * countdown holds at 00 rather than going negative.
 */
export const getTimeLeft = (targetMs: number, nowMs: number): TimeLeft => {
  const diff = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / HOUR_MS),
    minutes: Math.floor((diff % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((diff % MINUTE_MS) / SECOND_MS),
  };
};

/** Two-digit display value — the countdown always shows `09`, never `9`. */
export const pad2 = (value: number): string => String(value).padStart(2, '0');
