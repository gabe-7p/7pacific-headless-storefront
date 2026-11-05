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

  it('stops a fixed-mode ladder at data.width, which is how a slot caps its largest candidate', () => {
    const img = renderImg(
      <Image data={{ url: KNIT.url, width: 1200 }} width={560} height={700} alt="" />
    );
    const candidates = parseSrcSet(img.getAttribute('srcset') ?? '');

    expect(candidates.map((c) => c.url.searchParams.get('width'))).toEqual(['560', '1120']);
    expect(candidates.map((c) => c.descriptor)).toEqual(['1x', '2x']);
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

  it('sizes the box inline: width 100% + the source aspect ratio (beats an aspect-* utility)', () => {
    const img = renderImg(<Image data={KNIT} sizes="33vw" className="aspect-square" />);
    expect(img.style.width).toBe('100%');
    expect(img.style.aspectRatio).toBe(`${KNIT.width}/${KNIT.height}`);
    expect(img.getAttribute('loading')).toBe('lazy');
  });

  it('keeps a percentage width (the PDP mobile hero is 75% wide)', () => {
    const img = renderImg(<Image data={KNIT} width="75%" sizes="75vw" />);
    expect(img.style.width).toBe('75%');
  });

  it('fixed mode: a plain src with intrinsic dimensions ships a 1x/2x/3x density srcset at that size', () => {
    const img = renderImg(<Image src={KNIT.url} width={2130} height={2662} alt="" />);
    const candidates = parseSrcSet(img.getAttribute('srcset') ?? '');
    expect(candidates.map((c) => c.descriptor)).toEqual(['1x', '2x', '3x']);
    expect(candidates[0]?.url.searchParams.get('width')).toBe('2130');
    expect(candidates[0]?.url.searchParams.get('height')).toBe('2662');
    expect(candidates[0]?.url.searchParams.get('crop')).toBe('center');
    expect(candidates[1]?.url.searchParams.get('width')).toBe('4260');
    expect(img.getAttribute('width')).toBe('2130');
    expect(img.getAttribute('height')).toBe('2662');
    expect(img.style.aspectRatio).toBe('2130/2662');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('sizes')).toBeNull();
  });
});
