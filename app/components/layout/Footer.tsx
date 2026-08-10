import { ChevronDown } from 'lucide-react';
import { type ReactNode, Suspense, useEffect, useState } from 'react';
import { Await, NavLink } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { InstagramIcon } from '~/components/common/icons';
import { Logo } from '~/components/common/Logo';
import { NewsletterForm } from '~/components/common/NewsletterForm';
import { BRAND } from '~/lib/brand';
import { cn } from '~/lib/cn';
import { toInternalPath } from '~/lib/urls';

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
          <footer className="bg-footer text-footer-text relative isolate overflow-hidden">
            {/* SF topography plate. `isolate` scopes the -z-10 so the layer
                sits behind the footer's own content but never behind the page.
                mix-blend-screen, not plain opacity: the source is a near-black
                frame with faint light contours, so screen drops the black and
                adds only the lines — opacity alone dimmed lines and blacks
                together. brightness/opacity then tune contour strength without
                darkening Carbon. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[url(/topography.jpg)] bg-cover bg-center opacity-60 brightness-200 mix-blend-screen"
            />
            <Container className="grid gap-0 py-14 min-[769px]:grid-cols-3 min-[769px]:gap-10">
              {/* Live puts the Instagram glyph under the newsletter input in the
                  centre column, not under the wordmark. */}
              <div className="flex flex-col gap-6 pb-8 min-[769px]:pb-0">
                <NavLink to="/" prefetch="intent" aria-label={header.shop.name}>
                  <Logo tone="light" className="h-8 min-[769px]:h-[47px]" />
                </NavLink>
                <div className="min-[769px]:hidden">
                  <SocialIcons />
                </div>
              </div>
              <FooterCollapsible title={BRAND.newsletter.heading}>
                <Newsletter />
                <div className="mt-6 hidden min-[769px]:block">
                  <SocialIcons />
                </div>
              </FooterCollapsible>
              <FooterCollapsible title="Support">
                <FooterSupport
                  menu={footer?.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </FooterCollapsible>
            </Container>

            {/* Live has no divider above this row. */}
            <Container className="py-6 text-center">
              <a
                href="https://www.shopify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wide text-support-night transition-opacity hover:opacity-80"
              >
                Powered by Shopify
              </a>
            </Container>
          </footer>
        )}
      </Await>
    </Suspense>
  );
};

/**
 * Footer section that collapses into a tap-to-expand accordion row on mobile
 * AND tablet (matching live, which switches to columns at 769px — one past
 * Tailwind's `md`, hence the `min-[769px]:` variants) but renders as a plain,
 * always-open column above that. The heading lives here so the same title
 * doubles as the accordion trigger. Opens by default so SSR/desktop show
 * content; collapses only once mounted on a narrow viewport.
 */
const FooterCollapsible = ({ title, children }: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(true);
  const [collapsible, setCollapsible] = useState(false);

  useEffect(() => {
    // Must mirror the `min-[769px]:` CSS breakpoint above.
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => {
      setCollapsible(mq.matches);
      setOpen(!mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <div className="border-t border-border-subtle-night min-[769px]:border-t-0">
      <button
        type="button"
        onClick={() => collapsible && setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 min-[769px]:pointer-events-none min-[769px]:py-0"
      >
        {/* 14px / 0.3em — weight comes from the Heading brand variant. */}
        <Heading as="h3" size="none" className="text-sm tracking-[0.3em]">
          {title}
        </Heading>
        <ChevronDown
          className={cn('size-5 transition-transform min-[769px]:hidden', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      <div className={cn('pb-5 min-[769px]:block min-[769px]:pb-0', open ? 'block' : 'hidden')}>
        {children}
      </div>
    </div>
  );
};

const Newsletter = () => (
  <div className="min-[769px]:max-w-md">
    {/* Live footer copy and links are 10.2px. */}
    <p className="text-[10.2px] text-support-night">{BRAND.newsletter.body}</p>
    <NewsletterForm />
  </div>
);

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
          {social.platform === 'Instagram' && <InstagramIcon className="size-[22px]" />}
          <span className="sr-only">{social.platform}</span>
        </a>
      </li>
    ))}
  </ul>
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

  return (
    <nav className="flex flex-col gap-2 text-[10.2px]" role="navigation">
      {items.map((item) => {
        if (!item.url) return null;
        const url = toInternalPath(item.url, { publicStoreDomain, primaryDomainUrl });
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            key={item.id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-support-night transition-colors hover:text-ink-night"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            key={item.id}
            to={url}
            prefetch="intent"
            className="text-support-night transition-colors hover:text-ink-night"
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
};
