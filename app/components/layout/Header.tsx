import { type CartViewPayload, useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import { Suspense, useEffect, useState } from 'react';
import { Await, NavLink, useAsyncValue, useLocation } from 'react-router';
import type { CartApiQueryFragment, HeaderQuery } from 'storefrontapi.generated';

import { Container } from '~/components/common/Container';
import { BagIcon, HamburgerIcon, InstagramIcon, UserIcon } from '~/components/common/icons';
import { Logo } from '~/components/common/Logo';
import { useAside } from '~/components/layout/Aside';
import { BRAND } from '~/lib/brand';
import { cn } from '~/lib/cn';
import { toInternalPath } from '~/lib/urls';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
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

export const Header = ({ header, cart, publicStoreDomain }: HeaderProps) => {
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
          ? 'bg-linear-to-b from-black/30 to-transparent text-ink-night'
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

        <HeaderCtas cart={cart} publicStoreDomain={publicStoreDomain} />
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
  const isMobile = viewport === 'mobile';

  return (
    <nav
      // Live's mobile drawer clears the close button before the first link and
      // rules a hairline above it.
      className={cn(
        isMobile
          ? 'border-border-subtle mt-[68px] flex flex-col border-t'
          : // Collapses at live's Impulse breakpoint (769px), not Tailwind's
            // lg — the 12px nav fits well before 1024.
            'hidden items-center gap-5 impulse:flex'
      )}
      role="navigation"
    >
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        return (
          <NavLink
            key={item.id}
            end
            onClick={close}
            prefetch="intent"
            to={toInternalPath(item.url, { publicStoreDomain, primaryDomainUrl })}
            // Live never marks the current page in the nav, so no active state.
            // Caps-UI tier: Archivo Condensed Medium (Gabe's override of the
            // Inter caps-UI rule), ALL CAPS, +0.08em tracking.
            className={cn(
              'font-display font-medium tracking-caps uppercase',
              isMobile
                ? 'border-border-subtle border-b px-5 py-4 text-sm transition-opacity hover:opacity-70'
                : // Live's underline wipe (.site-nav__link--underline:after):
                  // a 2px rule that grows left-to-right over 500ms on hover.
                  'relative py-1 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:content-[""] hover:after:scale-x-100 motion-reduce:after:transition-none'
            )}
          >
            {item.title}
          </NavLink>
        );
      })}
      {/* Account is a first-class menu item now (7PA-235 locked nav), so the
          drawer no longer needs its own Log in link. */}
      {isMobile &&
        BRAND.social
          .filter((social) => social.platform === 'Instagram')
          .map((social) => (
            <a
              key={social.platform}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
              className="border-border-subtle mx-5 mt-4 inline-flex size-11 items-center justify-center border transition-opacity hover:opacity-70"
            >
              <InstagramIcon className="size-5" />
            </a>
          ))}
    </nav>
  );
};

const HeaderCtas = ({
  cart,
  publicStoreDomain,
}: Pick<HeaderProps, 'cart' | 'publicStoreDomain'>) => {
  return (
    <nav className="flex items-center justify-end gap-4" role="navigation">
      {/* Customer login lives on Shopify's hosted account portal, not this headless
          storefront (we don't use the Customer Account API). `{store-domain}/account`
          302-redirects to it; the myshopify domain is always Shopify-served, so this
          link survives the custom-domain cutover. Desktop-only (the cart shows at
          every width). */}
      <a
        href={`https://${publicStoreDomain}/account`}
        className="hidden items-center transition-opacity hover:opacity-70 impulse:inline-flex"
        title="Log in"
      >
        <UserIcon className="size-7" />
        <span className="sr-only">Log in</span>
      </a>
      <CartToggle cart={cart} />
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
      <BagIcon className="size-7" />
      {count !== null && count > 0 && (
        <span className="bg-cart-dot absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-ink-night">
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
