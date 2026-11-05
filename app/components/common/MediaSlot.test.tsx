// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { MediaSlot, type MediaSlotSource } from '~/components/common/MediaSlot';

const PHOTO = {
  kind: 'image',
  src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/photo.jpg?v=1',
  width: 2048,
  height: 1365,
  alt: 'Two athletes',
} satisfies MediaSlotSource;

const FILM = {
  kind: 'video',
  src: 'https://cdn.shopify.com/videos/c/vp/id/id.HD-720p.mp4',
  poster: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/poster.jpg',
} satisfies MediaSlotSource;

beforeAll(() => {
  // jsdom has no IntersectionObserver; LazyVideo needs one.
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = () => undefined;
      disconnect = () => undefined;
    }
  );
});

afterEach(cleanup);

describe('MediaSlot', () => {
  it('renders an image as a fluid ladder capped at the intrinsic width', () => {
    const { container } = render(<MediaSlot media={PHOTO} ratio="wide" sizes="100vw" />);
    const img = container.querySelector('img');

    expect(img?.getAttribute('sizes')).toBe('100vw');
    expect(img?.getAttribute('alt')).toBe(PHOTO.alt);
    const descriptors = (img?.getAttribute('srcset') ?? '')
      .split(',')
      .map((candidate) => candidate.trim().split(/\s+/)[1] ?? '');
    expect(descriptors.length).toBeGreaterThan(3);
    expect(descriptors.every((descriptor) => descriptor.endsWith('w'))).toBe(true);
    expect(Math.max(...descriptors.map((d) => Number.parseInt(d)))).toBeLessThanOrEqual(
      PHOTO.width
    );
  });

  it('tops the ladder with the source width when it falls between two steps', () => {
    const { container } = render(
      <MediaSlot media={{ ...PHOTO, width: 696, height: 728 }} ratio="landscape" sizes="100vw" />
    );
    const srcset = container.querySelector('img')?.getAttribute('srcset') ?? '';

    expect(srcset.trim().endsWith('696w')).toBe(true);
    expect(srcset).toContain('600w');
  });

  it('keeps the responsive ratio on the wrapper, with the image filling it', () => {
    const { container } = render(<MediaSlot media={PHOTO} ratio="wide" sizes="100vw" />);
    const img = container.querySelector('img');

    // Image's inline aspect-ratio would beat these on the img itself.
    expect(img?.parentElement?.className).toContain('aspect-video');
    expect(img?.parentElement?.className).toContain('sm:aspect-[21/8]');
    expect(img?.className).toContain('size-full');
    expect(img?.className).not.toContain('aspect-');
  });

  it('applies the focus as an object-position', () => {
    const { container } = render(
      <MediaSlot media={{ ...PHOTO, focus: 'upper' }} ratio="wide" sizes="100vw" />
    );
    const img = container.querySelector('img');

    expect(img?.className).toContain('object-[50%_30%]');
  });

  it('passes loading through to the image', () => {
    const { container } = render(
      <MediaSlot media={PHOTO} ratio="wide" sizes="100vw" loading="eager" />
    );

    expect(container.querySelector('img')?.getAttribute('loading')).toBe('eager');
  });

  it('holds a video back until it nears the viewport', () => {
    const { container } = render(<MediaSlot media={FILM} ratio="video" sizes="100vw" />);
    const video = container.querySelector('video');

    expect(video?.getAttribute('src')).toBeNull();
    expect(video?.getAttribute('preload')).toBe('none');
    expect(video?.getAttribute('poster')).toBe(FILM.poster);
  });

  it('starts an eager video straight away', () => {
    const { container } = render(
      <MediaSlot media={FILM} ratio="video" sizes="100vw" loading="eager" />
    );
    const video = container.querySelector('video');

    expect(video?.getAttribute('src')).toBe(FILM.src);
    expect(video?.autoplay).toBe(true);
  });

  it('keeps the placeholder as a sized panel', () => {
    const { container } = render(
      <MediaSlot media={{ kind: 'placeholder', type: 'image' }} ratio="portrait" sizes="100vw" />
    );

    expect(container.querySelector('[data-media="image"]')?.className).toContain('aspect-[3/4]');
  });
});
