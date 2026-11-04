import { describe, expect, it } from 'vitest';

import type { ProductVariantData } from '~/lib/product/queries';
import { resolveSelectedVariant, selectionTarget } from '~/lib/product/store';

// Only the fields the resolver reads; the rest of the variant is irrelevant here.
const variant = (id: string, handle: string) =>
  ({ id, product: { handle, title: handle } }) as unknown as ProductVariantData;

const midnightSmall = variant('gid://shopify/ProductVariant/1', 'shorts-midnight');
const midnightMedium = variant('gid://shopify/ProductVariant/2', 'shorts-midnight');
const mistSmall = variant('gid://shopify/ProductVariant/3', 'shorts-mist');

describe('resolveSelectedVariant', () => {
  it("uses the form store's variant once it belongs to the page's product (a size click)", () => {
    const product = { handle: 'shorts-midnight', selectedOrFirstAvailableVariant: midnightSmall };
    expect(resolveSelectedVariant(midnightMedium, product)).toBe(midnightMedium);
  });

  it("falls back to the loader's selection while the store still holds a sibling's variant", () => {
    // Client-side navigation to a color sibling: the loader has the new
    // product, the store re-hydrates one effect later.
    const product = { handle: 'shorts-mist', selectedOrFirstAvailableVariant: mistSmall };
    expect(resolveSelectedVariant(midnightSmall, product)).toBe(mistSmall);
  });

  it("falls back to the loader's selection before the store has hydrated at all", () => {
    const product = { handle: 'shorts-midnight', selectedOrFirstAvailableVariant: midnightSmall };
    expect(resolveSelectedVariant(undefined, product)).toBe(midnightSmall);
    expect(resolveSelectedVariant(null, product)).toBe(midnightSmall);
  });

  it('returns null for a product with no purchasable variant', () => {
    const product = { handle: 'shorts-midnight', selectedOrFirstAvailableVariant: null };
    expect(resolveSelectedVariant(undefined, product)).toBeNull();
  });
});

describe('selectionTarget', () => {
  const medium = [{ name: 'Size', value: 'Medium' }];

  it('skips revalidation for a selection the store resolved', () => {
    const result = {
      status: 'resolved' as const,
      selectedOptions: medium,
      selectedVariant: { product: { handle: 'shorts-midnight' } },
    };
    expect(selectionTarget(result, 'fallback', '')).toEqual({
      to: '/products/shorts-midnight?Size=Medium',
      skipRevalidate: true,
    });
  });

  it('revalidates an unresolved selection and falls back to the page handle', () => {
    expect(
      selectionTarget({ status: 'unresolved', selectedOptions: medium }, 'shorts-midnight', '')
    ).toEqual({ to: '/products/shorts-midnight?Size=Medium', skipRevalidate: false });
  });

  it('keeps unrelated params from the current search', () => {
    const { to } = selectionTarget(
      { status: 'unresolved', selectedOptions: medium },
      'shorts-midnight',
      '?utm_source=x&Size=Small'
    );
    expect(to).toBe('/products/shorts-midnight?utm_source=x&Size=Medium');
  });
});
