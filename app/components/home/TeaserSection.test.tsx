// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { Cta } from '~/components/common/Cta';
import { TeaserSection } from '~/components/home/TeaserSection';

const CARDS = [
  {
    content: {
      eyebrow: 'Left eyebrow',
      title: 'Left Title',
      image: { url: 'https://cdn.shopify.com/files/left.jpg', width: 2048, height: 1638 },
    },
    cta: (
      <Cta to="/drops/example" size="xs" className="mt-4">
        Go inside
      </Cta>
    ),
  },
  {
    content: {
      eyebrow: 'Right eyebrow',
      title: 'Right Title',
      image: { url: 'https://cdn.shopify.com/files/right.jpg', width: 1638, height: 2048 },
    },
    cta: (
      <Cta href="https://example.com/film" target="_blank" size="xs" className="mt-4">
        Go outside
      </Cta>
    ),
  },
] as const;

const renderSection = (props?: {
  subtitle?: string;
  countdown?: { dropIso: string; labels: ReadonlyArray<string> };
}) =>
  render(
    <MemoryRouter>
      <TeaserSection heading="Section Heading" cards={CARDS} {...props} />
    </MemoryRouter>
  );

afterEach(cleanup);

describe('TeaserSection', () => {
  it('renders the heading, eyebrows, and card titles', () => {
    const { container } = renderSection();
    expect(container.querySelector('h2')?.textContent).toBe('Section Heading');
    expect(container.textContent).toContain('Left eyebrow');
    expect(container.textContent).toContain('Right eyebrow');
    const cardTitles = [...container.querySelectorAll('h3')].map((h) => h.textContent);
    expect(cardTitles).toEqual(['Left Title', 'Right Title']);
  });

  it('renders the subtitle only when provided', () => {
    const bare = renderSection();
    expect(bare.container.textContent).not.toContain('A subtitle');
    cleanup();
    const withSubtitle = renderSection({ subtitle: 'A subtitle' });
    expect(withSubtitle.container.textContent).toContain('A subtitle');
  });

  it('renders each CTA slot as its own device — Link left, external <a> right', () => {
    const { container } = renderSection();
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/drops/example', 'https://example.com/film']);
    const external = container.querySelector('a[href="https://example.com/film"]');
    expect(external?.getAttribute('target')).toBe('_blank');
    expect(external?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('omits the countdown by default and renders it when provided', () => {
    const bare = renderSection();
    expect(bare.container.querySelector('[aria-label="Countdown to the drop"]')).toBeNull();
    cleanup();
    const withCountdown = renderSection({
      countdown: { dropIso: '2026-09-13T09:00:00-07:00', labels: ['DAYS', 'HRS', 'MIN', 'SEC'] },
    });
    expect(
      withCountdown.container.querySelector('[aria-label="Countdown to the drop"]')
    ).not.toBeNull();
  });
});
