// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { ColorSwatches } from '~/components/product/ColorSwatches';
import type { ColorSwatch } from '~/lib/colors';

const TEE_FAMILY: Array<ColorSwatch> = [
  { handle: 'tee-mountain-mist', name: 'Mountain Mist', hex: '#6A7E8D' },
  { handle: 'tee-mint', name: 'Mint', hex: '#B4C8C2' },
  { handle: 'tee-white', name: 'White', hex: '#ffffff' },
  { handle: 'tee-midnight', name: 'Midnight', hex: '#101820' },
  { handle: 'tee-tangerine', name: 'Tangerine', hex: '#FF8A00' },
];

const renderSwatches = (props: Partial<Parameters<typeof ColorSwatches>[0]> = {}) =>
  render(
    <MemoryRouter>
      <ColorSwatches swatches={TEE_FAMILY} currentHandle="tee-white" {...props} />
    </MemoryRouter>
  );

afterEach(cleanup);

describe('ColorSwatches (shared behavior)', () => {
  it('links every swatch to its sibling color product', () => {
    renderSwatches();
    for (const swatch of TEE_FAMILY) {
      expect(screen.getByRole('link', { name: swatch.name })).toHaveProperty(
        'pathname',
        `/products/${swatch.handle}`
      );
    }
  });

  it('marks only the current color as active', () => {
    renderSwatches();
    expect(screen.getByRole('link', { name: 'White' }).getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('link', { name: 'Mint' }).getAttribute('aria-current')).toBeNull();
  });

  it('renders nothing for a single-color family unless alwaysRender', () => {
    const single = TEE_FAMILY.slice(0, 1);
    const { container } = render(
      <MemoryRouter>
        <ColorSwatches swatches={single} currentHandle="tee-mountain-mist" />
      </MemoryRouter>
    );
    expect(container.querySelector('ul')).toBeNull();

    const { container: always } = render(
      <MemoryRouter>
        <ColorSwatches swatches={single} currentHandle="tee-mountain-mist" alwaysRender />
      </MemoryRouter>
    );
    expect(always.querySelectorAll('li')).toHaveLength(1);
  });
});

describe('ColorSwatches cascade mode (card hover)', () => {
  it('applies the staggered animation classes in left-to-right order', () => {
    const { container } = renderSwatches({ cascade: true });
    const items = [...container.querySelectorAll('li')];
    expect(items).toHaveLength(5);
    const expectedDelays = ['0s', '0.1s', '0.15s', '0.2s', '0.3s'];
    items.forEach((li, index) => {
      // Hidden at rest; animates only while the parent card group is hovered.
      expect(li.className).toContain('opacity-0');
      expect(li.className).toContain('group-hover:animate-cascade-in');
      // The delay must be the important arbitrary property — a plain
      // [animation-delay:…] gets zeroed by the animate-* shorthand.
      expect(li.className).toContain(`[animation-delay:${expectedDelays[index]}]!`);
    });
  });

  it('caps the stagger at the sixth delay for oversized families', () => {
    const seven = [
      ...TEE_FAMILY,
      { handle: 'tee-slate', name: 'Slate', hex: '#8A8F98' },
      { handle: 'tee-sand', name: 'Sand', hex: '#D8C7A5' },
    ];
    const { container } = render(
      <MemoryRouter>
        <ColorSwatches swatches={seven} currentHandle="tee-white" cascade />
      </MemoryRouter>
    );
    const items = [...container.querySelectorAll('li')];
    expect(items[5]?.className).toContain('[animation-delay:0.4s]!');
    expect(items[6]?.className).toContain('[animation-delay:0.4s]!'); // capped, not undefined
  });

  it('renders a color-name tooltip pill per swatch', () => {
    const { container } = renderSwatches({ cascade: true });
    const tooltips = [...container.querySelectorAll('li > span[aria-hidden]')];
    expect(tooltips.map((tooltip) => tooltip.textContent)).toEqual(
      TEE_FAMILY.map((swatch) => swatch.name)
    );
    // Hidden until the swatch itself (named group) is hovered.
    tooltips.forEach((tooltip) => {
      expect(tooltip.className).toContain('invisible');
      expect(tooltip.className).toContain('group-hover/swatch:visible');
    });
  });

  it('uses the card swatch styling (white border; neutral border keeps White visible)', () => {
    renderSwatches({ cascade: true });
    expect(screen.getByRole('link', { name: 'Mint' }).className).toContain('border-white');
    expect(screen.getByRole('link', { name: 'White' }).className).toContain('border-zinc');
  });
});

describe('ColorSwatches PDP mode (cascade off) — regression guard', () => {
  it('has no cascade animation, delays, or tooltips', () => {
    const { container } = renderSwatches({ size: 'lg', alwaysRender: true });
    expect(container.innerHTML).not.toContain('animate-cascade-in');
    expect(container.innerHTML).not.toContain('animation-delay');
    expect(container.querySelector('li > span[aria-hidden]')).toBeNull();
    // PDP keeps the ring-based styling.
    expect(screen.getByRole('link', { name: 'Mint' }).className).toContain('ring-1');
  });
});
