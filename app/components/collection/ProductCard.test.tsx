// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { ProductCardFragment } from 'storefrontapi.generated';
import { afterEach, describe, expect, it } from 'vitest';

import { ProductCard } from '~/components/collection/ProductCard';

const image = (name: string) => ({
  id: `gid://shopify/MediaImage/${name}`,
  url: `https://cdn.shopify.com/files/${name}.jpg`,
  altText: null,
  width: 800,
  height: 800,
});

const sibling = (handle: string, name: string, hex: string) => ({
  handle,
  colorName: { value: name },
  colorHex: { value: hex },
});

/** Minimal fragment fixture — same shape codegen produces for ProductCard. */
const TEE: ProductCardFragment = {
  id: 'gid://shopify/Product/1',
  handle: 'tee-white',
  title: 'TRACEFIBER TEE - WHITE',
  vendor: '7Pacific',
  featuredImage: image('front'),
  images: { nodes: [image('front'), image('back')] },
  priceRange: { minVariantPrice: { amount: '74.0', currencyCode: 'USD' } },
  colorSiblings: {
    references: {
      nodes: [
        sibling('tee-mountain-mist', 'Mountain Mist', '#6A7E8D'),
        sibling('tee-white', 'White', '#ffffff'),
        sibling('tee-tangerine', 'Tangerine', '#FF8A00'),
      ],
    },
  },
} as ProductCardFragment;

const HAT: ProductCardFragment = {
  ...TEE,
  handle: 'hat-white',
  title: 'MOTIONFRAME HAT - WHITE',
  images: { nodes: [image('hat-front')] }, // single image — no crossfade
  colorSiblings: { references: { nodes: [sibling('hat-white', 'White', '#ffffff')] } },
} as ProductCardFragment;

const renderCard = (product: ProductCardFragment) =>
  render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );

afterEach(cleanup);

describe('ProductCard hover ensemble', () => {
  it('stacks the second Shopify image as the hover crossfade layer', () => {
    const { container } = renderCard(TEE);
    const images = [...container.querySelectorAll('img')];
    expect(images).toHaveLength(2);
    expect(images[0]?.src).toContain('front');
    expect(images[1]?.src).toContain('back');
    expect(images[1]?.className).toContain('opacity-0');
    expect(images[1]?.className).toContain('group-hover:opacity-100');
    // Eager: a lazy hover image can still be mid-decode on first hover (flicker).
    expect(images[1]?.getAttribute('loading')).toBe('eager');
  });

  it('degrades to a single image when the product has no second image', () => {
    const { container } = renderCard(HAT);
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  it('lazy-loads the featured image by default and eager-loads it when priority', () => {
    const lazy = renderCard(TEE);
    expect(lazy.container.querySelector('img')?.getAttribute('loading')).toBe('lazy');
    cleanup();
    const eager = render(
      <MemoryRouter>
        <ProductCard product={TEE} priority />
      </MemoryRouter>
    );
    expect(eager.container.querySelector('img')?.getAttribute('loading')).toBe('eager');
  });

  it('never nests the swatch links inside the image link (valid HTML)', () => {
    const { container } = renderCard(TEE);
    expect(container.querySelector('a a')).toBeNull();
    // …but the swatch links still exist, targeting sibling color products.
    const swatchHrefs = [...container.querySelectorAll('ul li a')].map((a) =>
      a.getAttribute('href')
    );
    expect(swatchHrefs).toEqual([
      '/products/tee-mountain-mist',
      '/products/tee-white',
      '/products/tee-tangerine',
    ]);
  });

  it('overlays the swatch container at the image bottom, hidden until card hover', () => {
    const { container } = renderCard(TEE);
    const overlay = container.querySelector('ul')?.parentElement;
    expect(overlay?.className).toContain('absolute');
    expect(overlay?.className).toContain('bottom-0');
    expect(overlay?.className).toContain('translate-y-[110%]');
    expect(overlay?.className).toContain('group-hover:-translate-y-[10%]');
    // The overlay lives inside the clipped image box, not the card body.
    expect(overlay?.parentElement?.className).toContain('overflow-hidden');
  });

  it('shows a single swatch for one-color products (alwaysRender, like live)', () => {
    const { container } = renderCard(HAT);
    expect(container.querySelectorAll('ul li')).toHaveLength(1);
  });

  it('lifts the card on hover instead of scaling the image', () => {
    const { container } = renderCard(TEE);
    const root = container.firstElementChild;
    expect(root?.className).toContain('hover:-translate-y-1');
    expect(root?.className).toContain('hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]');
    expect(container.innerHTML).not.toContain('group-hover:scale-105');
  });

  it('transitions the translate property so the lift animates instead of snapping', () => {
    const { container } = renderCard(TEE);
    const root = container.firstElementChild;
    // -translate-y-* sets the native `translate` property in Tailwind v4; a
    // `transform`-only transition list would make the 4px lift jump.
    expect(root?.className).toContain('transition-[translate,box-shadow]');
  });
});
