// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { Aside } from '~/components/layout/Aside';
import { HeaderMenu } from '~/components/layout/Header';
import type { HeaderMenuItem } from '~/components/layout/HeaderDropdown';
import type { HeaderData } from '~/lib/fragments';

const DOMAIN = 'https://7pacificapparel.com';

const leaf = (title: string, url: string | null) => ({
  id: `gid://shopify/MenuItem/${title}`,
  resourceId: null,
  tags: [],
  title,
  type: 'HTTP' as const,
  url,
});

const parent = (
  title: string,
  url: string | null,
  children: Array<ReturnType<typeof leaf>>
): HeaderMenuItem => ({ ...leaf(title, url), items: children });

const MENU: NonNullable<HeaderData['menu']> = {
  id: 'gid://shopify/Menu/main',
  items: [
    parent('Shop', '/collections/baseline', []),
    parent('Collections', '/drops/first-light', [
      // A full-domain URL, as Shopify returns for a collection or page link.
      leaf('Baseline', `${DOMAIN}/drops/baseline`),
      leaf('First Light', '/drops/first-light'),
      leaf('Broken', null),
    ]),
    parent('Our Story', '/pages/our-story', []),
    parent('No Link', null, []),
  ],
};

const renderMenu = (viewport: 'desktop' | 'mobile', menu = MENU) =>
  render(
    <MemoryRouter>
      <Aside.Provider>
        <HeaderMenu
          menu={menu}
          viewport={viewport}
          primaryDomainUrl={DOMAIN}
          publicStoreDomain="7pacific.myshopify.com"
        />
      </Aside.Provider>
    </MemoryRouter>
  );

afterEach(cleanup);

describe('HeaderMenu (desktop)', () => {
  it('renders an item with children as a trigger, not a link', () => {
    renderMenu('desktop');
    expect(screen.getByRole('button', { name: /collections/i })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /collections/i })).toBeNull();
  });

  it('keeps leaves as links and skips a leaf with no url', () => {
    renderMenu('desktop');
    expect(screen.getByRole('link', { name: 'Shop' }).getAttribute('href')).toBe(
      '/collections/baseline'
    );
    expect(screen.queryByText('No Link')).toBeNull();
  });

  it('opens the panel with the child links as internal paths', () => {
    renderMenu('desktop');
    const trigger = screen.getByRole('button', { name: /collections/i });
    expect(screen.queryByRole('link', { name: 'Baseline' })).toBeNull();

    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('link', { name: 'Baseline' }).getAttribute('href')).toBe(
      '/drops/baseline'
    );
    expect(screen.getByRole('link', { name: 'First Light' }).getAttribute('href')).toBe(
      '/drops/first-light'
    );
    expect(screen.queryByText('Broken')).toBeNull();
  });

  it('renders a parent whose own url is empty', () => {
    const menu = {
      ...MENU,
      items: [parent('Collections', null, [leaf('Baseline', '/drops/baseline')])],
    };
    renderMenu('desktop', menu);
    expect(screen.getByRole('button', { name: /collections/i })).toBeTruthy();
  });
});

describe('HeaderMenu (desktop) — collections mega-menu', () => {
  const COLLECTIONS_MENU_DATA = {
    ...MENU,
    items: [
      parent('Collections', '/drops/first-light', [
        leaf('Baseline', `${DOMAIN}/collections/baseline`),
        leaf('First Light', '/collections/first-light'),
      ]),
    ],
  };

  it('renders explore (drop page) and shop (collection) links, plus a Cta per photo', () => {
    renderMenu('desktop', COLLECTIONS_MENU_DATA);
    fireEvent.click(screen.getByRole('button', { name: /collections/i }));

    expect(screen.getByText('Explore The Collection')).toBeTruthy();
    expect(screen.getByText('Shop The Collection')).toBeTruthy();
    const hrefs = (name: string) =>
      screen.getAllByRole('link', { name }).map((link) => link.getAttribute('href'));
    // Explore → drop page; Shop list → collection; photo Cta → collection.
    expect(hrefs('Baseline')).toEqual([
      '/drops/baseline',
      '/collections/baseline',
      '/collections/baseline',
    ]);
    expect(hrefs('First Light')).toEqual([
      '/drops/first-light',
      '/collections/first-light',
      '/collections/first-light',
    ]);
  });

  it('keeps the plain dropdown when a child is not a collection link', () => {
    renderMenu('desktop');
    fireEvent.click(screen.getByRole('button', { name: /collections/i }));
    expect(screen.queryByText('Explore The Collection')).toBeNull();
  });
});

describe('HeaderMenu (mobile)', () => {
  it('renders a nested item as a labelled group of its child links', () => {
    renderMenu('mobile');
    const group = screen.getByRole('group', { name: 'Collections' });
    const links = within(group).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/drops/baseline',
      '/drops/first-light',
    ]);
    // The group title is a label, not a link to the parent's own url.
    expect(screen.queryByRole('link', { name: 'Collections' })).toBeNull();
  });
});
