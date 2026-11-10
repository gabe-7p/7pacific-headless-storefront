// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Aside } from '~/components/layout/Aside';
import { HeaderMenu } from '~/components/layout/Header';
import type { HeaderMenuItem } from '~/components/layout/HeaderDropdown';
import type * as FlagsModule from '~/content/flags';
import type { HeaderData } from '~/lib/fragments';

// The real flags, with First Light launched unless a test turns it off. The
// mock hands out this one object, so tests flip it in place.
const flags = vi.hoisted(() => ({ firstLightCollection: true }));
vi.mock('~/content/flags', async (importOriginal) => {
  const actual = await importOriginal<typeof FlagsModule>();
  return {
    FEATURE_FLAGS: Object.assign(flags, actual.FEATURE_FLAGS, { firstLightCollection: true }),
  };
});

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

afterEach(() => {
  cleanup();
  flags.firstLightCollection = true;
});

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

const COLLECTIONS_MENU_DATA = {
  ...MENU,
  items: [
    parent('Collections', '/drops/first-light', [
      leaf('Baseline', `${DOMAIN}/collections/baseline`),
      leaf('First Light', '/collections/first-light'),
    ]),
  ],
};

describe('HeaderMenu (desktop) — collections mega-menu', () => {
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

describe('HeaderMenu (mobile) — collections disclosure', () => {
  it('starts closed and opens the explore, shop and photo sections from a chevron row', () => {
    renderMenu('mobile', COLLECTIONS_MENU_DATA);
    const toggle = screen.getByRole('button', { name: 'Collections' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    const region = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(region?.hasAttribute('inert')).toBe(true);

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(region?.hasAttribute('inert')).toBe(false);
    expect(screen.getByText('Explore The Collection')).toBeTruthy();
    expect(screen.getByText('Shop The Collection')).toBeTruthy();
    expect(
      screen.getAllByRole('link', { name: 'Baseline' }).map((link) => link.getAttribute('href'))
    ).toEqual(['/drops/baseline', '/collections/baseline', '/collections/baseline']);
  });
});

describe('HeaderMenu — First Light before launch', () => {
  const setUnlaunched = () => {
    flags.firstLightCollection = false;
  };

  it('keeps First Light out of the desktop panel, and Baseline in it', () => {
    setUnlaunched();
    renderMenu('desktop', COLLECTIONS_MENU_DATA);
    fireEvent.click(screen.getByRole('button', { name: /collections/i }));
    expect(screen.getByText('Explore The Collection')).toBeTruthy();
    expect(screen.queryAllByRole('link', { name: 'First Light' })).toEqual([]);
    expect(document.querySelector('a[href*="first-light"]')).toBeNull();
    expect(screen.getAllByRole('link', { name: 'Baseline' })).toHaveLength(3);
  });

  it('keeps First Light out of the drawer', () => {
    setUnlaunched();
    renderMenu('mobile', COLLECTIONS_MENU_DATA);
    fireEvent.click(screen.getByRole('button', { name: 'Collections' }));
    expect(document.querySelector('a[href*="first-light"]')).toBeNull();
    expect(screen.getAllByRole('link', { name: 'Baseline' })).toHaveLength(3);
  });

  it('renders nothing for a Collections item that holds only unlaunched collections', () => {
    setUnlaunched();
    const menu = {
      ...MENU,
      items: [
        parent('Collections', '/drops/first-light', [
          leaf('First Light', '/collections/first-light'),
        ]),
      ],
    };
    renderMenu('desktop', menu);
    expect(screen.queryByRole('button', { name: /collections/i })).toBeNull();
    expect(document.querySelector('a[href*="first-light"]')).toBeNull();
  });
});
