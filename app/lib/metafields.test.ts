import { describe, expect, it } from 'vitest';

import { parseJsonMetafield, parseMarketingSections } from '~/lib/metafields';

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
