// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ContentMedia } from '~/components/common/ContentMedia';
import type { ContentMedia as ContentMediaSource } from '~/lib/shopifyFiles';

const PHOTO = {
  kind: 'image',
  src: 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/photo.jpg?v=1',
  width: 3968,
  height: 4960,
  alt: '',
} satisfies ContentMediaSource;

afterEach(cleanup);

describe('ContentMedia', () => {
  it('serves an image from a width ladder picked by sizes, not the full file at 1x/2x/3x', () => {
    const { container } = render(<ContentMedia media={PHOTO} sizes="50vw" />);
    const img = container.querySelector('img');
    const descriptors = (img?.getAttribute('srcset') ?? '')
      .split(',')
      .map((candidate) => candidate.trim().split(/\s+/)[1] ?? '');

    expect(img?.getAttribute('sizes')).toBe('50vw');
    expect(descriptors.every((descriptor) => descriptor.endsWith('w'))).toBe(true);
    expect(descriptors).toContain('800w');
    expect(Math.max(...descriptors.map((d) => Number.parseInt(d)))).toBe(PHOTO.width);
  });
});
