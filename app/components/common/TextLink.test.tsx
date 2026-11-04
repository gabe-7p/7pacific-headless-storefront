// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { TextLink } from '~/components/common/TextLink';

afterEach(cleanup);

describe('TextLink', () => {
  it('opens an absolute URL in a new tab', () => {
    render(<TextLink href="https://www.shopify.com">Shopify</TextLink>);

    const link = screen.getByRole('link', { name: 'Shopify' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('routes an in-app path, marking the current page', () => {
    render(
      <MemoryRouter initialEntries={['/pages/returns']}>
        <TextLink to="/pages/returns">Returns</TextLink>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Returns' });
    expect(link.getAttribute('target')).toBeNull();
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('adds no device of its own on the bare variant', () => {
    render(
      <TextLink href="https://www.shopify.com" variant="bare" className="inline-flex">
        Shopify
      </TextLink>
    );

    expect(screen.getByRole('link', { name: 'Shopify' }).className).toBe('inline-flex');
  });
});
