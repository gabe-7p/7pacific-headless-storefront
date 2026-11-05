import { ChevronDown } from 'lucide-react';
import { type ReactNode, Suspense, useEffect, useState } from 'react';
import { Await, NavLink } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { InstagramIcon } from '~/components/common/icons';
import { JoinForm } from '~/components/common/JoinForm';
import { Logo } from '~/components/common/Logo';
import { TextLink } from '~/components/common/TextLink';
import { BRAND } from '~/content/brand';
import { JOIN_COPY } from '~/content/join';
import { cn } from '~/lib/cn';
import type { FooterData, HeaderData } from '~/lib/fragments';
import { toInternalPath } from '~/lib/urls';

type FooterProps = {
  footer: Promise<FooterData | null>;
  header: HeaderData;
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
            <Container className="grid gap-0 py-14 impulse:grid-cols-3 impulse:gap-10">
              {/* Live puts the Instagram glyph under the newsletter input in the
                  centre column, not under the wordmark. */}
              <div className="flex flex-col gap-6 pb-8 impulse:pb-0">
                <NavLink to="/" prefetch="intent" aria-label={header.shop.name}>
                  <Logo tone="light" className="h-8 impulse:h-[47px]" />
                </NavLink>
                <div className="impulse:hidden">
                  <SocialIcons />
                </div>
              </div>
              <FooterCollapsible title={JOIN_COPY.newsletter.heading}>
                <Newsletter />
                <div className="mt-6 hidden impulse:block">
                  <SocialIcons />
                </div>
              </FooterCollapsible>
              <FooterCollapsible title={BRAND.footer.supportTitle}>
                <FooterSupport
                  menu={footer?.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </FooterCollapsible>
            </Container>

            {/* Live has no divider above this row. */}
            <Container className="py-6 text-center">
              <TextLink
                href="https://www.shopify.com"
                variant="bare"
                className="text-xs tracking-wide text-support-night transition-opacity hover:opacity-80"
              >
                {BRAND.footer.poweredBy}
              </TextLink>
            </Container>
          </footer>
        )}
      </Await>
    </Suspense>
  );
};

/**
 * Footer section that collapses into a tap-to-expand accordion row below the
 * `impulse:` breakpoint (769px; see common-pitfalls.md) and is a plain,
 * always-open column above it. Opens by default so SSR/desktop show content;
 * collapses only once mounted on a narrow viewport.
 */
const FooterCollapsible = ({ title, children }: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(true);
  const [collapsible, setCollapsible] = useState(false);

  useEffect(() => {
    // The `impulse:` breakpoint, read from the theme token so the CSS and
    // this query can't drift (`@theme` variables are emitted on :root).
    const impulse = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-impulse'),
      10
    );
    const mq = window.matchMedia(`(max-width: ${(Number.isNaN(impulse) ? 769 : impulse) - 1}px)`);
    const apply = () => {
      setCollapsible(mq.matches);
      setOpen(!mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <div className="border-t border-border-subtle-night impulse:border-t-0">
      <button
        type="button"
        onClick={() => collapsible && setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 impulse:pointer-events-none impulse:py-0"
      >
        {/* 14px, weight from the Heading brand variant. The 0.3em is dead: it emits
            before the variant's tracking-header, so this renders at 0.01em.
            tracking-segment would emit after it and visibly widen the title. */}
        <Heading as="h3" size="none" className="text-sm tracking-[0.3em]">
          {title}
        </Heading>
        <ChevronDown
          className={cn('size-5 transition-transform impulse:hidden', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      <div className={cn('pb-5 impulse:block impulse:pb-0', open ? 'block' : 'hidden')}>
        {children}
      </div>
    </div>
  );
};

const Newsletter = () => (
  <div className="impulse:max-w-md">
    {/* Live footer copy and links are 10.2px. */}
    <p className="text-[10.2px] text-support-night">{JOIN_COPY.newsletter.body}</p>
    <JoinForm list="newsletter" copy={JOIN_COPY.newsletter} submit="mail" className="mt-5" />
  </div>
);

const SocialIcons = () => (
  <ul className="flex gap-4">
    {BRAND.social.map((social) => (
      <li key={social.platform} className="mb-2">
        <TextLink
          href={social.href}
          title={social.platform}
          variant="bare"
          className="inline-flex transition-opacity hover:opacity-70"
        >
          {social.platform === 'Instagram' && <InstagramIcon className="size-[22px]" />}
          <span className="sr-only">{social.platform}</span>
        </TextLink>
      </li>
    ))}
  </ul>
);

const FooterSupport = ({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterData['menu'] | undefined;
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
        const target = url.startsWith('/')
          ? ({ to: url, prefetch: 'intent' } as const)
          : { href: url };
        return (
          <TextLink key={item.id} variant="night" {...target}>
            {item.title}
          </TextLink>
        );
      })}
    </nav>
  );
};
