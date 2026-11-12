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

describe('DEFAULT_DESCRIPTION', () => {
  it('quotes the free-shipping threshold from the brand', () => {
    expect(DEFAULT_DESCRIPTION).toBe(
      'Lightweight, breathable training gear built for performance. Free shipping on orders over $150.'
    );
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

  it('emits og:video tags only when a video is given', () => {
    expect(
      buildMeta({ title: 'X' }).some((tag) => 'property' in tag && tag.property === 'og:video')
    ).toBe(false);
    const meta = buildMeta({
      title: 'X',
      video: { url: 'https://cdn/x.mp4', width: 1280, height: 720 },
    });
    expect(meta).toContainEqual({ property: 'og:video', content: 'https://cdn/x.mp4' });
    expect(meta).toContainEqual({ property: 'og:video:secure_url', content: 'https://cdn/x.mp4' });
    expect(meta).toContainEqual({ property: 'og:video:type', content: 'video/mp4' });
    expect(meta).toContainEqual({ property: 'og:video:width', content: '1280' });
    expect(meta).toContainEqual({ property: 'og:video:height', content: '720' });
  });

  it('emits an absolute <link rel=canonical> on the brand origin only when given a path', () => {
    expect(buildMeta({ title: 'X' }).some((tag) => 'rel' in tag)).toBe(false);
    expect(buildMeta({ title: 'X', canonical: '/products/slate' })).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://7pacificapparel.com/products/slate',
    });
  });
});
