import { type CartViewPayload, useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import { Menu, ShoppingBag, User } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { Await, NavLink, useAsyncValue, useLocation } from 'react-router';
import type { CartApiQueryFragment, HeaderQuery } from 'storefrontapi.generated';

import { Container } from '~/components/common/Container';
import { Logo } from '~/components/common/Logo';
import { useAside } from '~/components/layout/Aside';
import { BRAND } from '~/lib/brand';
import { cn } from '~/lib/cn';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
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

export const Header = ({ header, isLoggedIn, cart, publicStoreDomain }: HeaderProps) => {
  const { shop, menu } = header;
  const { pathname } = useLocation();
  const scrolled = useScrolledPast(STICKY_THRESHOLD);

  // Transparent over the hero on the homepage until scrolled; solid elsewhere.
  const isHome = pathname === '/';
  const overlay = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-colors duration-300 ease-(--ease-brand)',
          overlay
            ? 'bg-linear-to-b from-black/30 to-transparent text-white'
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
            <Logo tone={overlay ? 'light' : 'dark'} />
          </NavLink>

          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </Container>
      </header>
      {/* Spacer so content isn't hidden under the fixed header (skipped on the
          homepage, where the hero sits beneath the transparent overlay). */}
      {!isHome && <div aria-hidden className="h-(--header-h)" />}
    </>
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
  const isMobile = viewport === 'mobile';

  const toInternalPath = (itemUrl: string) =>
    itemUrl.includes('myshopify.com') ||
    itemUrl.includes(publicStoreDomain) ||
    itemUrl.includes(primaryDomainUrl)
      ? new URL(itemUrl).pathname
      : itemUrl;

  return (
    <nav
      className={cn(isMobile ? 'flex flex-col gap-1 p-5' : 'hidden items-center gap-7 md:flex')}
      role="navigation"
    >
      {isMobile && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className="py-3 text-lg font-medium tracking-wide uppercase"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        return (
          <NavLink
            key={item.id}
            end
            onClick={close}
            prefetch="intent"
            to={toInternalPath(item.url)}
            className={({ isActive }) =>
              cn(
                'tracking-wide uppercase transition-opacity hover:opacity-70',
                isMobile ? 'py-3 text-lg font-medium' : 'text-xs font-medium',
                isActive && 'underline underline-offset-4'
              )
            }
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
};

const HeaderCtas = ({ isLoggedIn, cart }: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) => {
  return (
    <nav className="flex items-center justify-end gap-4" role="navigation">
      <NavLink prefetch="intent" to="/account" className="transition-opacity hover:opacity-70">
        <Suspense fallback={<AccountIcon label="Sign in" />}>
          <Await resolve={isLoggedIn} errorElement={<AccountIcon label="Sign in" />}>
            {(loggedIn) => <AccountIcon label={loggedIn ? 'Account' : 'Sign in'} />}
          </Await>
        </Suspense>
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
};

const HeaderMenuMobileToggle = () => {
  const { open } = useAside();
  return (
    <button
      type="button"
      className="transition-opacity hover:opacity-70 md:hidden"
      aria-label="Open menu"
      onClick={() => open('mobile')}
    >
      <Menu className="size-6" />
    </button>
  );
};

const AccountIcon = ({ label }: { label: string }) => (
  <span className="inline-flex items-center" title={label}>
    <User className="size-[22px]" strokeWidth={1.6} />
    <span className="sr-only">{label}</span>
  </span>
);

const CartBadge = ({ count }: { count: number | null }) => {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative inline-flex transition-opacity hover:opacity-70"
      aria-label={`Cart${count ? `, ${count} items` : ''}`}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <ShoppingBag className="size-6" strokeWidth={1.6} />
      {count !== null && count > 0 && (
        <span className="bg-cart-dot absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </a>
  );
};

const CartToggle = ({ cart }: Pick<HeaderProps, 'cart'>) => {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
};

const CartBanner = () => {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
};

// Used only if the Storefront `main-menu` is empty; links come from BRAND.
const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/7pacific-fallback',
  items: BRAND.headerLinks.map((link) => ({
    id: link.url,
    resourceId: null,
    tags: [],
    title: link.title,
    type: 'HTTP',
    url: link.url,
    items: [],
  })),
};
