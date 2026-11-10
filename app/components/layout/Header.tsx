import { useEffect, useId, useState } from 'react';
import { NavLink, useLocation } from 'react-router';

import { useCartDrawer } from '~/components/cart/useCartDrawer';
import { Container } from '~/components/common/Container';
import { BagIcon, HamburgerIcon, InstagramIcon, UserIcon } from '~/components/common/icons';
import { Logo } from '~/components/common/Logo';
import { TextLink } from '~/components/common/TextLink';
import { useAside } from '~/components/layout/Aside';
import {
  HeaderDropdown,
  type HeaderMenuItem,
  NAV_DESKTOP_CLASS,
  NAV_LABEL_CLASS,
} from '~/components/layout/HeaderDropdown';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '~/components/ui/navigation-menu';
import { BRAND } from '~/content/brand';
import { useCart } from '~/lib/cart';
import { cn } from '~/lib/cn';
import { isPlainActivation } from '~/lib/events';
import type { HeaderData } from '~/lib/fragments';
import { accountUrl, cartUrl, toInternalPath } from '~/lib/urls';

type HeaderProps = {
  header: HeaderData;
  publicStoreDomain: string;
};

type Viewport = 'desktop' | 'mobile';

// Scroll distance (px) after which the overlay header solidifies — mirrors the
// live theme's 250px threshold.
const STICKY_THRESHOLD = 250;

/** Tracks whether the window has scrolled past `threshold`. SSR-safe. */
const useScrolledPast = (threshold: number) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
};

export const Header = ({ header, publicStoreDomain }: HeaderProps) => {
  const { shop, menu } = header;
  const { pathname } = useLocation();
  const scrolled = useScrolledPast(STICKY_THRESHOLD);

  // Transparent over the hero on the homepage until scrolled; solid elsewhere.
  const isHome = pathname === '/';
  const overlay = isHome && !scrolled;

  return (
    <header
      className={cn(
        'transition-colors duration-300 ease-(--ease-brand)',
        overlay
          ? 'bg-linear-to-b from-scrim/30 to-transparent text-ink-night'
          : 'bg-nav text-nav-text shadow-sm'
      )}
    >
      <Container className="grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-6">
          <HeaderMenuMobileToggle />
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>

        <NavLink
          prefetch="intent"
          to="/"
          end
          className="justify-self-center"
          aria-label={shop.name}
        >
          <Logo
            tone={overlay ? 'light' : 'dark'}
            className={cn('h-4.5 lg:h-7', overlay && 'opacity-70')}
          />
        </NavLink>

        <HeaderCtas publicStoreDomain={publicStoreDomain} />
      </Container>
    </header>
  );
};

export const HeaderMenu = ({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) => {
  const { close } = useAside();
  const items = (menu || FALLBACK_HEADER_MENU).items;
  const resolveUrl = (url: string) => toInternalPath(url, { publicStoreDomain, primaryDomainUrl });

  // Live never marks the current page in the nav, so no active state.
  if (viewport === 'desktop') {
    return (
      // Radix renders the <nav>. Collapses at live's Impulse breakpoint
      // (769px), not Tailwind's lg — the 12px nav fits well before 1024.
      <NavigationMenu viewport={false} className="hidden flex-none impulse:flex">
        <NavigationMenuList className="gap-5">
          {items.map((item) =>
            item.items.length > 0 ? (
              <HeaderDropdown key={item.id} item={item} resolveUrl={resolveUrl} />
            ) : (
              item.url && (
                <NavigationMenuItem key={item.id}>
                  <NavLink
                    end
                    prefetch="intent"
                    to={resolveUrl(item.url)}
                    className={NAV_DESKTOP_CLASS}
                  >
                    {item.title}
                  </NavLink>
                </NavigationMenuItem>
              )
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <nav
      // Live's mobile drawer clears the close button before the first link and
      // rules a hairline above it.
      className="border-border-subtle mt-[68px] flex flex-col border-t"
      role="navigation"
    >
      {items.map((item) =>
        item.items.length > 0 ? (
          <MobileMenuGroup key={item.id} item={item} resolveUrl={resolveUrl} onNavigate={close} />
        ) : (
          item.url && (
            <NavLink
              key={item.id}
              end
              onClick={close}
              prefetch="intent"
              to={resolveUrl(item.url)}
              className={MOBILE_ROW_CLASS}
            >
              {item.title}
            </NavLink>
          )
        )
      )}
      {BRAND.social
        .filter((social) => social.platform === 'Instagram')
        .map((social) => (
          <TextLink
            key={social.platform}
            href={social.href}
            aria-label={social.platform}
            variant="bare"
            className="border-border-subtle mx-5 mt-4 inline-flex size-11 items-center justify-center border transition-opacity hover:opacity-70"
          >
            <InstagramIcon className="size-5" />
          </TextLink>
        ))}
    </nav>
  );
};

const MOBILE_ROW_CLASS = cn(
  NAV_LABEL_CLASS,
  'border-border-subtle border-b px-5 py-4 text-sm transition-opacity hover:opacity-70'
);

/**
 * A nested item in the drawer: its title as a plain label row, then its
 * children indented beneath. Always expanded — with a handful of children a
 * disclosure would only hide them.
 */
const MobileMenuGroup = ({
  item,
  resolveUrl,
  onNavigate,
}: {
  item: HeaderMenuItem;
  resolveUrl: (url: string) => string;
  onNavigate: () => void;
}) => {
  const labelId = useId();
  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col">
      <span
        id={labelId}
        className={cn(
          NAV_LABEL_CLASS,
          'border-border-subtle text-support border-b px-5 py-4 text-sm'
        )}
      >
        {item.title}
      </span>
      {item.items.map(
        (child) =>
          child.url && (
            <NavLink
              key={child.id}
              end
              onClick={onNavigate}
              prefetch="intent"
              to={resolveUrl(child.url)}
              className={cn(MOBILE_ROW_CLASS, 'pl-8')}
            >
              {child.title}
            </NavLink>
          )
      )}
    </div>
  );
};

const HeaderCtas = ({ publicStoreDomain }: Pick<HeaderProps, 'publicStoreDomain'>) => {
  return (
    <nav className="flex items-center justify-end gap-4" role="navigation">
      {/* Desktop-only; the portal itself is documented on accountUrl. */}
      <a
        href={accountUrl(publicStoreDomain)}
        className="hidden items-center transition-opacity hover:opacity-70 impulse:inline-flex"
        title="Log in"
      >
        <UserIcon className="size-7" />
        <span className="sr-only">Log in</span>
      </a>
      <CartBadge />
    </nav>
  );
};

const HeaderMenuMobileToggle = () => {
  const { open } = useAside();
  return (
    <button
      type="button"
      // Must flip at the same width the desktop nav appears (769px).
      className="transition-opacity hover:opacity-70 impulse:hidden"
      aria-label="Open menu"
      onClick={() => open('mobile')}
    >
      <HamburgerIcon className="size-7" />
    </button>
  );
};

/**
 * The bag: a real /cart link that opens the drawer instead on a plain click
 * (the drawer publishes `cart_viewed`). The count comes from the client cart
 * store, so an optimistic add shows at once.
 */
const CartBadge = () => {
  const { open: openCart } = useCartDrawer();
  const count = useCart((state) => state.data.totalQuantity);

  return (
    <a
      href={cartUrl()}
      className="relative inline-flex transition-opacity hover:opacity-70"
      aria-label={`Cart${count ? `, ${count} items` : ''}`}
      aria-haspopup="dialog"
      onClick={(e) => {
        if (!isPlainActivation(e)) return;
        e.preventDefault();
        openCart();
      }}
    >
      <BagIcon className="size-7" />
      {count > 0 && (
        <span className="bg-cart-dot absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-3xs font-bold text-ink-night">
          {count}
        </span>
      )}
    </a>
  );
};

// Used only if the Storefront `main-menu` is empty; links come from BRAND.
const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/7pacific-fallback',
  items: BRAND.headerLinks.map((link) => ({
    id: link.url,
    resourceId: null,
    tags: [],
    title: link.title,
    type: 'HTTP' as const,
    url: link.url,
    items: [],
  })),
};
