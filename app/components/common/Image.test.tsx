// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Image } from '~/components/common/Image';
import { imageWidths } from '~/lib/imageSizes';

/** A Shopify Files image as the Storefront API returns it (and as content/*.ts stores it). */
const KNIT = {
  url: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/knit-closeup.jpg?v=1',
  altText: 'Quarter-zip knit, close up',
  width: 2400,
  height: 3000,
};

const parseSrcSet = (srcset: string) =>
  srcset.split(',').map((candidate) => {
    const [url, descriptor] = candidate.trim().split(/\s+/);
    return { url: new URL(url ?? ''), descriptor: descriptor ?? '' };
  });

const renderImg = (ui: React.ReactElement) => {
  const { container } = render(ui);
  const img = container.querySelector('img');
  if (!img) throw new Error('no <img> rendered');
  return img;
};

afterEach(cleanup);

/**
 * The contract behind the seam. The knit-aliasing pitfall depends on every
 * candidate being a CDN-resized URL with a width descriptor that matches the
 * pixels it carries, so the browser never scales a full-size photo itself.
 */
describe('Image', () => {
  it('renders a width-descriptor srcset of CDN-resized URLs plus the sizes hint', () => {
    const img = renderImg(<Image data={KNIT} sizes="(min-width: 768px) 33vw, 50vw" />);

    expect(img.getAttribute('sizes')).toBe('(min-width: 768px) 33vw, 50vw');
    expect(img.getAttribute('alt')).toBe(KNIT.altText);

    const candidates = parseSrcSet(img.getAttribute('srcset') ?? '');
    expect(candidates.length).toBeGreaterThanOrEqual(3);
    for (const { url, descriptor } of candidates) {
      expect(url.hostname).toBe('cdn.shopify.com');
      // The existing `?v=1` query survives: params are appended, never concatenated.
      expect(url.searchParams.get('v')).toBe('1');
      expect(descriptor).toBe(`${url.searchParams.get('width')}w`);
    }
  });

  it('never asks the CDN for more pixels than the source has', () => {
    const img = renderImg(<Image data={KNIT} sizes="100vw" />);
    const widths = parseSrcSet(img.getAttribute('srcset') ?? '').map((c) =>
      Number(c.url.searchParams.get('width'))
    );
    expect(Math.max(...widths)).toBeLessThanOrEqual(KNIT.width);
  });

  it('crops through the CDN when aspectRatio and crop are set', () => {
    const img = renderImg(<Image data={KNIT} aspectRatio="5/6" crop="center" sizes="33vw" />);
    for (const { url } of parseSrcSet(img.getAttribute('srcset') ?? '')) {
      const width = Number(url.searchParams.get('width'));
      const height = Number(url.searchParams.get('height'));
      expect(url.searchParams.get('crop')).toBe('center');
      expect(Math.abs(height - width * (6 / 5))).toBeLessThanOrEqual(1);
    }
  });

  it('uses an explicit srcset ladder when a slot asks for one', () => {
    const img = renderImg(
      <Image data={KNIT} sizes="33vw" srcSetWidths={imageWidths(400, 100, 16)} />
    );
    const widths = parseSrcSet(img.getAttribute('srcset') ?? '').map((c) =>
      Number(c.url.searchParams.get('width'))
    );
    expect(widths.slice(0, 3)).toEqual([400, 500, 600]);
    expect(widths).toHaveLength(16);
  });

  it('passes loading, alt overrides and a plain src through', () => {
    const img = renderImg(
      <Image
        src={KNIT.url}
        width={KNIT.width}
        height={KNIT.height}
        alt=""
        loading="lazy"
        sizes="100vw"
      />
    );
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('srcset')).toContain('width=');
  });
});
