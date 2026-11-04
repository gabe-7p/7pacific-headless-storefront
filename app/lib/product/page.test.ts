import { describe, expect, it } from 'vitest';

import { getHeroImages, parseProductContent, selectRecommendedProducts } from '~/lib/product/page';
import type { ProductData, RecommendationsData } from '~/lib/product/queries';

const image = (id: string) => ({
  id,
  url: `https://cdn.shopify.com/${id}.jpg`,
  altText: null,
  width: 800,
  height: 1000,
});

const heroMetafield = (id: string) => ({
  reference: { __typename: 'MediaImage' as const, image: image(id) },
});

// Only the card fields the selector reads; the rest of the fragment is irrelevant here.
const recommendations = (handles: Array<string>, nonProducts = 0) =>
  ({
    product: {
      recommended: {
        references: {
          nodes: [
            ...Array.from({ length: nonProducts }, () => ({ __typename: 'Metaobject' })),
            ...handles.map((handle) => ({ __typename: 'Product', handle })),
          ],
        },
      },
    },
  }) as unknown as RecommendationsData;

describe('selectRecommendedProducts', () => {
  it('caps the row at three, in metafield order', () => {
    const selected = selectRecommendedProducts(recommendations(['a', 'b', 'c', 'd']), 'self');
    expect(selected.map((node) => node.handle)).toEqual(['a', 'b', 'c']);
  });

  it('excludes the product being viewed before capping', () => {
    const selected = selectRecommendedProducts(recommendations(['self', 'a', 'b', 'c']), 'self');
    expect(selected.map((node) => node.handle)).toEqual(['a', 'b', 'c']);
  });

  it('skips referenced nodes that are not products', () => {
    const selected = selectRecommendedProducts(recommendations(['a'], 2), 'self');
    expect(selected.map((node) => node.handle)).toEqual(['a']);
  });

  it('is empty without the metafield or the query result', () => {
    expect(selectRecommendedProducts(null, 'self')).toEqual([]);
    expect(
      selectRecommendedProducts({ product: { recommended: null } } as RecommendationsData, 'self')
    ).toEqual([]);
  });
});

describe('parseProductContent', () => {
  const product = {
    handle: 'shorts-midnight',
    productDetails: { value: '[{"imageUrl":"a.jpg","caption":"c","subcaption":"s"}]' },
    techStack: { value: '{"details":"d"}' },
    specCard: { value: '{"fabric":"Nylon"}' },
  } as unknown as ProductData;

  it('returns the parsed content', () => {
    const content = parseProductContent(product);
    expect(content.productDetails).toEqual([{ imageUrl: 'a.jpg', caption: 'c', subcaption: 's' }]);
    expect(content.techStack).toEqual({ details: 'd' });
    expect(content.specCard).toEqual({ fabric: 'Nylon' });
  });

  it('takes the raw metafields off the product so they serialize once', () => {
    const { product: rest } = parseProductContent(product);
    expect(rest).toEqual({ handle: 'shorts-midnight' });
  });

  it('parses a missing or malformed metafield to null', () => {
    const content = parseProductContent({
      ...product,
      productDetails: null,
      specCard: { value: '{not json' },
    });
    expect(content.productDetails).toBeNull();
    expect(content.specCard).toBeNull();
  });
});

describe('getHeroImages', () => {
  const variant = { image: image('variant') };

  it('prefers the dedicated hero images', () => {
    const hero = getHeroImages(
      { heroImage: heroMetafield('desktop'), heroImageMobile: heroMetafield('mobile') },
      variant
    );
    expect(hero.desktop?.id).toBe('desktop');
    expect(hero.mobile?.id).toBe('mobile');
  });

  it('falls back to the variant image per slot', () => {
    const hero = getHeroImages(
      { heroImage: heroMetafield('desktop'), heroImageMobile: null },
      variant
    );
    expect(hero.desktop?.id).toBe('desktop');
    expect(hero.mobile?.id).toBe('variant');
  });

  it('has nothing to show without a hero or a variant', () => {
    const hero = getHeroImages({ heroImage: null, heroImageMobile: null }, null);
    expect(hero.desktop).toBeUndefined();
    expect(hero.mobile).toBeUndefined();
  });
});
