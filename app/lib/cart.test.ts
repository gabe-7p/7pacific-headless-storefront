import { describe, expect, it } from 'vitest';

import { isOptimisticLine, nextDiscountCodes } from '~/lib/cart';

const discounts = [
  { code: 'NOPE', applicable: false },
  { code: 'TEAM10', applicable: true },
];

describe('nextDiscountCodes', () => {
  it('adds the submitted code to the applied ones and drops a rejected code', () => {
    expect(nextDiscountCodes(discounts, { apply: 'SUMMER' })).toEqual(['TEAM10', 'SUMMER']);
  });

  it('removes a code and drops a rejected code', () => {
    expect(nextDiscountCodes(discounts, { remove: 'TEAM10' })).toEqual([]);
  });

  it('does not send an applied code twice', () => {
    expect(nextDiscountCodes(discounts, { apply: 'TEAM10' })).toEqual(['TEAM10']);
  });

  it('lets a shopper retry a rejected code', () => {
    expect(nextDiscountCodes(discounts, { apply: 'NOPE' })).toEqual(['TEAM10', 'NOPE']);
  });
});

describe('isOptimisticLine', () => {
  it("reads Hydrogen's id prefix", () => {
    expect(isOptimisticLine({ id: 'optimistic:abc' })).toBe(true);
    expect(isOptimisticLine({ id: 'gid://shopify/CartLine/1' })).toBe(false);
  });
});
