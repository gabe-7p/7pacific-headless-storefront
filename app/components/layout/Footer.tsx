import { ChevronDown, Mail } from 'lucide-react';
import { type ReactNode, Suspense, useEffect, useState } from 'react';
import { Await, NavLink, useFetcher } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Logo } from '~/components/common/Logo';
import { BRAND } from '~/lib/brand';
import { cn } from '~/lib/cn';
import type { NewsletterResponse } from '~/routes/api.newsletter';

type FooterProps = {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
};

export const Footer = ({ footer: footerPromise, header, publicStoreDomain }: FooterProps) => {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-footer text-footer-text">
            <Container className="grid gap-0 py-14 md:grid-cols-3 md:gap-10">
              <div className="flex flex-col gap-6 pb-8 md:pb-0">
                <NavLink to="/" prefetch="intent" aria-label={header.shop.name}>
                  <Logo tone="light" className="h-8" />
                </NavLink>
                <SocialIcons />
              </div>
              <FooterCollapsible title={BRAND.newsletter.heading}>
                <Newsletter />
              </FooterCollapsible>
              <FooterCollapsible title="Support">
                <FooterSupport
                  menu={footer?.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </FooterCollapsible>
            </Container>

            <div className="border-t border-white/15">
              <Container className="py-6 text-center">
                <a
                  href="https://www.shopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-wide text-white/60 transition-opacity hover:opacity-80"
                >
                  Powered by Shopify
                </a>
              </Container>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
};

/**
 * Footer section that collapses into a tap-to-expand accordion row on mobile
 * (matching live) but renders as a plain, always-open column on desktop. The
 * heading lives here so the same title doubles as the accordion trigger. Opens
 * by default so SSR/desktop show content; collapses only once mounted on a
 * narrow viewport.
 */
const FooterCollapsible = ({ title, children }: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(true);
  const [collapsible, setCollapsible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => {
      setCollapsible(mq.matches);
      setOpen(!mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <div className="border-t border-white/15 md:border-t-0">
      <button
        type="button"
        onClick={() => collapsible && setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 md:pointer-events-none md:py-0"
      >
        <Heading as="h3" size="sm">
          {title}
        </Heading>
        <ChevronDown
          className={cn('size-5 transition-transform md:hidden', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      <div className={cn('pb-5 md:block md:pb-0', open ? 'block' : 'hidden')}>{children}</div>
    </div>
  );
};

const Newsletter = () => {
  const fetcher = useFetcher<NewsletterResponse>();
  const submitting = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const { body, placeholder, submitLabel, successMessage } = BRAND.newsletter;

  return (
    <div className="md:max-w-md">
      <p className="text-sm text-white/80">{body}</p>

      {succeeded ? (
        <p className="mt-5 text-sm font-medium">{successMessage}</p>
      ) : (
        <fetcher.Form method="post" action="/api/newsletter" className="mt-5">
          <div className="relative max-w-sm">
            <label htmlFor="newsletter-email" className="sr-only">
              {placeholder}
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              autoCorrect="off"
              autoCapitalize="off"
              placeholder={placeholder}
              className="w-full rounded-none border-0 border-b border-white/60 bg-transparent px-0 py-2 pr-10 text-white placeholder:text-white/60 focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-label={submitLabel}
              className="absolute top-1/2 right-0 -translate-y-1/2 transition-opacity hover:opacity-70 disabled:opacity-40"
            >
              <Mail className="size-5" />
            </button>
          </div>
          {fetcher.data?.error && (
            <p className="mt-2 text-sm text-white/80">{fetcher.data.error}</p>
          )}
        </fetcher.Form>
      )}
    </div>
  );
};

const SocialIcons = () => (
  <ul className="flex gap-4">
    {BRAND.social.map((social) => (
      <li key={social.platform}>
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          title={social.platform}
          className="inline-flex transition-opacity hover:opacity-70"
        >
          {social.platform === 'Instagram' && <InstagramIcon />}
          <span className="sr-only">{social.platform}</span>
        </a>
      </li>
    ))}
  </ul>
);

// lucide-react v1 dropped brand/logo icons, so the one social glyph is inline.
const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
  </svg>
);

const FooterSupport = ({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'] | undefined;
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) => {
  const items =
    menu?.items?.map((item) => ({ id: item.id, title: item.title, url: item.url ?? '' })) ??
    BRAND.footerLinks.map((link) => ({ id: link.url, title: link.title, url: link.url }));

  const toInternalPath = (itemUrl: string) =>
    itemUrl.includes('myshopify.com') ||
    itemUrl.includes(publicStoreDomain) ||
    itemUrl.includes(primaryDomainUrl)
      ? new URL(itemUrl).pathname
      : itemUrl;

  return (
    <nav className="flex flex-col gap-2 text-sm" role="navigation">
      {items.map((item) => {
        if (!item.url) return null;
        const url = toInternalPath(item.url);
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            key={item.id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 transition-colors hover:text-white"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            key={item.id}
            to={url}
            prefetch="intent"
            className="text-white/70 transition-colors hover:text-white"
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
};
