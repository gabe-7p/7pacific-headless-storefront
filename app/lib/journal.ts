/**
 * Journal helpers (7PA-248). The article's mono metadata strip renders the
 * publish date; keep the formatting here so the index and the article page
 * can't drift.
 */

/** "14 JUL 2026" — mono-strip date, uppercase, no comma. */
export const formatJournalDate = (publishedAt?: string | null): string => {
  if (!publishedAt) return '';
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return '';
  // en-GB for the day-first order the strip wants ("14 JUL 2026"); en-US
  // would render "JUL 14 2026".
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace(',', '')
    .toUpperCase();
};

/** Reading time at ~230 wpm — a fact for the strip, never a guess. */
export const readingTimeMinutes = (contentHtml?: string | null): number | null => {
  if (!contentHtml) return null;
  const words = contentHtml
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words === 0) return null;
  return Math.max(1, Math.round(words / 230));
};
