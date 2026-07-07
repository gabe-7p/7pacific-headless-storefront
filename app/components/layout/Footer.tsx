import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { Await, NavLink, useFetcher } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Logo } from '~/components/common/Logo';
import { BRAND } from '~/lib/brand';
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
            <Container className="grid gap-10 py-14 md:grid-cols-3">
              <div className="flex flex-col gap-6">
                <NavLink to="/" prefetch="intent" aria-label={header.shop.name}>
                  <Logo tone="light" className="h-8" />
                </NavLink>
                <SocialIcons />
              </div>
              <Newsletter />
              <FooterSupport
                menu={footer?.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </Container>

            <div className="border-t border-white/15">
              <Container className="py-6 text-center text-xs tracking-wide text-white/60 uppercase">
                © {new Date().getFullYear()} {header.shop.name}
              </Container>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
};

const Newsletter = () => {
  const fetcher = useFetcher<NewsletterResponse>();
  const submitting = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const { heading, body, placeholder, submitLabel, successMessage } = BRAND.newsletter;

  return (
    <div className="md:max-w-md">
      <Heading as="h3" size="sm">
        {heading}
      </Heading>
      <p className="mt-3 text-sm text-white/80">{body}</p>

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
              className="w-full border-b-2 border-white bg-transparent py-2 pr-10 text-white placeholder:text-white/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-label={submitLabel}
              className="absolute top-1/2 right-0 -translate-y-1/2 transition-opacity hover:opacity-70 disabled:opacity-40"
            >
              <ArrowRight className="size-5" />
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
    <div>
      <Heading as="h3" size="sm">
        Support
      </Heading>
      <nav className="mt-4 flex flex-col gap-2 text-sm" role="navigation">
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
    </div>
  );
};
