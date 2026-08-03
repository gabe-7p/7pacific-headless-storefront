import { describe, expect, it } from 'vitest';

import { getTimeLeft, pad2 } from '~/lib/countdown';

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const SECOND = 1000;

describe('getTimeLeft', () => {
  it('decomposes a diff into whole days, hours, minutes, and seconds', () => {
    const now = 1_700_000_000_000;
    const target = now + 41 * DAY + 9 * HOUR + 51 * MINUTE + 22 * SECOND;
    expect(getTimeLeft(target, now)).toEqual({ days: 41, hours: 9, minutes: 51, seconds: 22 });
  });

  it('rolls exactly 24 hours into one day with zero remainder', () => {
    expect(getTimeLeft(DAY, 0)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
  });

  it('keeps 59 seconds under the minute boundary', () => {
    expect(getTimeLeft(59 * SECOND, 0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 59 });
    expect(getTimeLeft(60 * SECOND, 0)).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 0 });
  });

  it('drops sub-second remainders rather than rounding up', () => {
    expect(getTimeLeft(1999, 0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
  });

  it('is all zeros exactly at the target', () => {
    expect(getTimeLeft(0, 0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('clamps to zeros past the target instead of going negative', () => {
    expect(getTimeLeft(0, 5 * DAY)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe('pad2', () => {
  it('left-pads single digits', () => {
    expect(pad2(5)).toBe('05');
    expect(pad2(0)).toBe('00');
  });

  it('leaves two or more digits unchanged', () => {
    expect(pad2(41)).toBe('41');
    expect(pad2(120)).toBe('120');
  });
});
