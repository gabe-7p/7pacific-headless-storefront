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

  describe('knows the custom tokens', () => {
    it('reads font-campaign as a weight, not a family', () => {
      expect(cn('font-display-narrow font-campaign')).toBe('font-display-narrow font-campaign');
      expect(cn('font-campaign font-display-narrow')).toBe('font-campaign font-display-narrow');
    });

    it('keeps every font family beside font-campaign', () => {
      expect(cn('font-mono font-campaign')).toBe('font-mono font-campaign');
      expect(cn('font-archivo font-campaign')).toBe('font-archivo font-campaign');
    });

    it('resolves font-campaign against another weight in either order', () => {
      expect(cn('font-medium font-campaign')).toBe('font-campaign');
      expect(cn('font-campaign font-medium')).toBe('font-medium');
      expect(cn('font-[450] font-campaign')).toBe('font-campaign');
    });

    it('resolves rounded-brand against another radius in either order', () => {
      expect(cn('rounded-lg rounded-brand')).toBe('rounded-brand');
      expect(cn('rounded-brand rounded-lg')).toBe('rounded-lg');
      expect(cn('rounded-brand rounded-none')).toBe('rounded-none');
      expect(cn('rounded-[2px] rounded-brand')).toBe('rounded-brand');
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
