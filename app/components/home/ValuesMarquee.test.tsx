// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { ValuesMarquee } from '~/components/home/ValuesMarquee';
import { HOME_MARQUEE } from '~/content/home';

beforeAll(() => {
  // jsdom has no matchMedia; report reduced-motion so the component's scroll
  // listener (irrelevant to these assertions) is never attached.
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
});

afterEach(cleanup);

describe('ValuesMarquee', () => {
  it('renders every line three times inside an aria-hidden track', () => {
    const { container } = render(<ValuesMarquee />);
    const track = container.querySelector('[aria-hidden="true"]');
    expect(track).not.toBeNull();
    for (const item of HOME_MARQUEE.items) {
      const hits = [...(track?.querySelectorAll('span') ?? [])].filter(
        (span) => span.textContent === item
      );
      expect(hits).toHaveLength(3);
    }
  });

  it('exposes one static readable copy to screen readers', () => {
    const { container } = render(<ValuesMarquee />);
    expect(container.querySelector('.sr-only')?.textContent).toBe(HOME_MARQUEE.items.join(' · '));
  });

  it('disables the drift under prefers-reduced-motion', () => {
    const { container } = render(<ValuesMarquee />);
    expect(container.querySelector('.animate-marquee-slow')?.className).toContain(
      'motion-reduce:animate-none'
    );
  });
});
