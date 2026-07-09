import { describe, expect, it } from 'vitest';

import { getMetafieldImage, parseJsonMetafield, parseMarketingSections } from '~/lib/metafields';

describe('parseJsonMetafield', () => {
  it('parses a valid JSON metafield value', () => {
    expect(parseJsonMetafield<{ a: number }>({ value: '{"a":1}' })).toEqual({ a: 1 });
  });

  it('parses JSON arrays (product_details shape)', () => {
    const value = '[{"imageUrl":"x","caption":"c","subcaption":"s"}]';
    expect(parseJsonMetafield<Array<{ caption: string }>>({ value })).toHaveLength(1);
  });

  it('returns null for a missing metafield', () => {
    expect(parseJsonMetafield(null)).toBeNull();
    expect(parseJsonMetafield(undefined)).toBeNull();
  });

  it('returns null for an empty value', () => {
    expect(parseJsonMetafield({ value: '' })).toBeNull();
    expect(parseJsonMetafield({ value: null })).toBeNull();
  });

  it('returns null for malformed JSON instead of throwing', () => {
    expect(parseJsonMetafield({ value: '{oops' })).toBeNull();
    expect(parseJsonMetafield({ value: 'not json at all' })).toBeNull();
  });
});

describe('parseMarketingSections', () => {
  const section = { imageUrl: 'https://cdn/x.jpg', heading: 'H', body: 'B', align: 'left' };

  it('parses a valid sections array', () => {
    expect(parseMarketingSections(JSON.stringify([section]))).toEqual([section]);
  });

  it('returns [] for missing or empty values', () => {
    expect(parseMarketingSections(null)).toEqual([]);
    expect(parseMarketingSections(undefined)).toEqual([]);
    expect(parseMarketingSections('')).toEqual([]);
  });

  it('returns [] for malformed JSON instead of throwing', () => {
    expect(parseMarketingSections('[{broken')).toEqual([]);
  });
});

describe('getMetafieldImage', () => {
  const image = { url: 'https://cdn/hero.jpg', width: 4000, height: 2299, altText: '' };

  it('returns the referenced image object', () => {
    expect(getMetafieldImage({ reference: { image } })).toBe(image);
  });

  it('returns null when the metafield is unset (fall back to variant image)', () => {
    expect(getMetafieldImage(null)).toBeNull();
    expect(getMetafieldImage(undefined)).toBeNull();
  });

  it('returns null when the reference or its image is missing', () => {
    expect(getMetafieldImage({ reference: null })).toBeNull();
    expect(getMetafieldImage({ reference: { image: null } })).toBeNull();
  });
});
