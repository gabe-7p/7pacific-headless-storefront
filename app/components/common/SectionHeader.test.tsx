// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SectionHeader } from '~/components/common/SectionHeader';

afterEach(cleanup);

describe('SectionHeader reveal (ember title wipe)', () => {
  it('wraps the heading in the wipe spans with cover + text animations and motion-reduce escapes', () => {
    render(<SectionHeader heading="Our First Drop" reveal />);
    const heading = screen.getByRole('heading', { name: 'Our First Drop' });
    const cover = heading.querySelector('span');
    expect(cover?.className).toContain('after:animate-title-wipe-cover');
    // Base state stays correct when the animations are disabled: cover hidden…
    expect(cover?.className).toContain('after:scale-x-0');
    expect(cover?.className).toContain('motion-reduce:after:animate-none');
    // The text fades on an INNER span — opacity on the cover's own element
    // would hide the ::after cover along with the text.
    const text = cover?.querySelector('span');
    expect(text?.textContent).toBe('Our First Drop');
    expect(text?.className).toContain('animate-title-wipe-text');
    expect(text?.className).toContain('motion-reduce:animate-none');
    expect(cover?.className).not.toContain('animate-title-wipe-text');
  });

  it('renders the plain heading text without a wrapper span by default', () => {
    render(<SectionHeader heading="Product Details" subtitle="A subtitle" />);
    const heading = screen.getByRole('heading', { name: 'Product Details' });
    expect(heading.querySelector('span')).toBeNull();
    expect(heading.innerHTML).not.toContain('animate-title-wipe');
  });
});
