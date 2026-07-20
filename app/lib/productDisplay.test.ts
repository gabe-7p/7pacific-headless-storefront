import { describe, expect, it } from 'vitest';

import { getShortTitle } from '~/lib/productDisplay';

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
