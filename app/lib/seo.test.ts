import { describe, expect, it } from 'vitest';

import { buildMeta, DEFAULT_DESCRIPTION, pageTitle } from '~/lib/seo';

describe('pageTitle', () => {
  it('formats "7Pacific | X"', () => {
    expect(pageTitle('Cart')).toBe('7Pacific | Cart');
  });

  it('falls back to the brand name alone', () => {
    expect(pageTitle()).toBe('7Pacific');
    expect(pageTitle(null)).toBe('7Pacific');
    expect(pageTitle('')).toBe('7Pacific');
  });
});

describe('buildMeta', () => {
  it('builds title/description/og tags from a page title', () => {
    const meta = buildMeta({ title: 'Cart', description: 'Your cart.' });
    expect(meta).toContainEqual({ title: '7Pacific | Cart' });
    expect(meta).toContainEqual({ name: 'description', content: 'Your cart.' });
    expect(meta).toContainEqual({ property: 'og:title', content: '7Pacific | Cart' });
    expect(meta).toContainEqual({ property: 'og:description', content: 'Your cart.' });
  });

  it('uses an absoluteTitle verbatim', () => {
    const meta = buildMeta({ absoluteTitle: '7Pacific — Training Gear' });
    expect(meta).toContainEqual({ title: '7Pacific — Training Gear' });
  });

  it('falls back to the brand default description (incl. empty string)', () => {
    const meta = buildMeta({ title: 'X', description: '' });
    expect(meta).toContainEqual({ name: 'description', content: DEFAULT_DESCRIPTION });
  });

  it('emits og:image only when an image is given', () => {
    expect(
      buildMeta({ title: 'X' }).some((tag) => 'property' in tag && tag.property === 'og:image')
    ).toBe(false);
    expect(buildMeta({ title: 'X', image: 'https://cdn/x.jpg' })).toContainEqual({
      property: 'og:image',
      content: 'https://cdn/x.jpg',
    });
  });
});
