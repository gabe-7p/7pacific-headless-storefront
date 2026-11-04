import { describe, expect, it } from 'vitest';

import { cn } from '~/lib/cn';

describe('cn', () => {
  describe('keeps a leading through a later font size', () => {
    it('with a named size', () => {
      expect(cn('leading-[1.1] text-4xl')).toBe('leading-[1.1] text-4xl');
    });

    it('with an arbitrary size', () => {
      expect(cn('leading-[1.1] text-[2.25rem]')).toBe('leading-[1.1] text-[2.25rem]');
    });

    it('inside one responsive variant', () => {
      expect(cn('md:leading-[1.1] md:text-4xl')).toBe('md:leading-[1.1] md:text-4xl');
    });
  });

  describe('still resolves real conflicts', () => {
    it('between two leadings', () => {
      expect(cn('leading-[1.1] leading-none')).toBe('leading-none');
    });

    it('between two font sizes', () => {
      expect(cn('text-2xl text-4xl')).toBe('text-4xl');
    });

    it('between named and arbitrary font sizes in one variant', () => {
      expect(cn('md:text-2xl md:text-[2rem]')).toBe('md:text-[2rem]');
    });

    it('when a font size carries its own line-height postfix', () => {
      expect(cn('leading-6 text-lg/7')).toBe('text-lg/7');
    });
  });
});
