import { describe, expect, it } from 'vitest';

import { cn } from '~/lib/cn';

describe('cn', () => {
  it('keeps a leading that precedes a font size', () => {
    expect(cn('leading-[1.1] text-4xl')).toBe('leading-[1.1] text-4xl');
  });

  it('keeps a leading through arbitrary and responsive font sizes', () => {
    expect(cn('leading-[1.1] text-[2.25rem] md:text-6xl')).toBe(
      'leading-[1.1] text-[2.25rem] md:text-6xl'
    );
  });

  it('still resolves real conflicts inside each group', () => {
    expect(cn('leading-[1.1] leading-none')).toBe('leading-none');
    expect(cn('text-2xl text-4xl')).toBe('text-4xl');
  });
});
