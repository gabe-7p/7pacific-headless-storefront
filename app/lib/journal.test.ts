import { describe, expect, it } from 'vitest';

import { formatJournalDate, readingTimeMinutes } from '~/lib/journal';

describe('formatJournalDate', () => {
  it('formats the mono strip date as uppercase, comma-free', () => {
    expect(formatJournalDate('2026-07-14T06:00:00Z')).toBe('14 JUL 2026');
  });

  it('returns an empty string for missing or unparseable dates (strip just omits it)', () => {
    expect(formatJournalDate(null)).toBe('');
    expect(formatJournalDate('not a date')).toBe('');
  });
});

describe('readingTimeMinutes', () => {
  it('counts words from the HTML body, not the markup', () => {
    const html = `<p>${'word '.repeat(460)}</p>`;
    expect(readingTimeMinutes(html)).toBe(2); // 460 words at ~230 wpm
  });

  it('never reports under a minute for a real piece', () => {
    expect(readingTimeMinutes('<p>Short one.</p>')).toBe(1);
  });

  it('returns null when there is nothing to read', () => {
    expect(readingTimeMinutes('')).toBeNull();
    expect(readingTimeMinutes('<p></p>')).toBeNull();
  });
});
