import { describe, expect, it } from 'vitest';

import { formatEditionLabel, getShortTitle, shortSizeLabel } from '~/lib/product/display';

describe('getShortTitle', () => {
  it('derives the short name from a real shorts title (spaced color dash)', () => {
    expect(getShortTitle('AIRRAIL™  6" //  CORE MOTION TRAINING SHORT - MINT', 'Mint')).toBe(
      'AIRRAIL™ 6" SHORT'
    );
  });

  it('handles the tee title, whose color dash is glued to the noun ("TEE- WHITE")', () => {
    expect(getShortTitle('TRACEFIBER™ // PERFORMANCE TECH TEE- WHITE', 'White')).toBe(
      'TRACEFIBER™ TEE'
    );
  });

  it('handles multi-word colors', () => {
    expect(
      getShortTitle('TRACEFIBER™ // PERFORMANCE TECH TEE- MOUNTAIN MIST', 'Mountain Mist')
    ).toBe('TRACEFIBER™ TEE');
  });

  it('leaves titles without a color suffix intact (the hat)', () => {
    expect(getShortTitle('MOTIONFRAME™ // RUNNING HAT', 'White')).toBe('MOTIONFRAME™ HAT');
  });

  it('strips an unknown color suffix without a colorName hint', () => {
    expect(getShortTitle('TRACEFIBER TEE - WHITE')).toBe('TRACEFIBER TEE');
  });
});

describe('shortSizeLabel', () => {
  it('maps the verbose Shopify size values to the live PDP labels', () => {
    expect(shortSizeLabel('Extra Small')).toBe('XS');
    expect(shortSizeLabel('Small')).toBe('S');
    expect(shortSizeLabel('Medium')).toBe('M');
    expect(shortSizeLabel('Large')).toBe('L');
    expect(shortSizeLabel('Extra Large')).toBe('XL');
    expect(shortSizeLabel('X-Large')).toBe('XL');
    expect(shortSizeLabel('XX-Large')).toBe('XXL');
    expect(shortSizeLabel('One Size')).toBe('OS');
  });

  it('ignores case and surrounding whitespace', () => {
    expect(shortSizeLabel('  MEDIUM ')).toBe('M');
  });

  it('passes unknown values through untouched', () => {
    expect(shortSizeLabel('32')).toBe('32');
    expect(shortSizeLabel('Tall')).toBe('Tall');
  });
});

describe('formatEditionLabel', () => {
  it('pads the number and appends a known status', () => {
    expect(formatEditionLabel('1', 'live')).toBe('ED. 01 · live');
    expect(formatEditionLabel('12', 'archived')).toBe('ED. 12 · archived');
  });

  it('drops an unknown or missing status', () => {
    expect(formatEditionLabel('3', 'sold-out')).toBe('ED. 03');
    expect(formatEditionLabel('3', null)).toBe('ED. 03');
  });

  it('is null without a parseable number', () => {
    expect(formatEditionLabel('n/a', 'live')).toBeNull();
    expect(formatEditionLabel('', 'live')).toBeNull();
    expect(formatEditionLabel(null, 'live')).toBeNull();
  });
});
