import { describe, expect, it } from 'vitest';

import { getCardSpec, getShortTitle } from '~/lib/productDisplay';

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

describe('getCardSpec', () => {
  it('maps each live family noun to its headline spec', () => {
    expect(getCardSpec('AIRRAIL™ 6" SHORT')).toBe('92/8 shell · bonded seams');
    expect(getCardSpec('TRACEFIBER™ TEE')).toBe('84/16 mesh');
    expect(getCardSpec('MOTIONFRAME™ HAT')).toBe('laser-cut perf');
  });

  it('returns null for unmapped families instead of inventing a spec', () => {
    expect(getCardSpec('FUTURE™ JACKET')).toBeNull();
  });
});
