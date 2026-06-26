/**
 * Brand content & config — the single source of truth for site-wide text and
 * links (ported from the live store, verified against the live DOM). Change it
 * here and it applies everywhere it's consumed (header logo, announcement,
 * footer, newsletter, social). English-only per our scope.
 *
 * Visual design tokens (colors, fonts, layout sizes) live in
 * app/styles/tailwind.css; this file is for content/data.
 */

type SocialPlatform = 'Instagram';
export type SocialLink = { platform: SocialPlatform; href: string };
export type NavLink = { title: string; url: string };

export const BRAND = {
  /** Legal/display name (also the Storefront shop.name). */
  name: '7Pacific',
  /** Logotype shown in the header/footer. */
  wordmark: 'Pacific',

  announcement: {
    message: 'Free Shipping on orders over $200',
    href: '',
  },

  social: [
    { platform: 'Instagram', href: 'https://www.instagram.com/7_pacific/' },
  ] satisfies SocialLink[],

  newsletter: {
    heading: 'Join The Membership',
    body: 'Join the membership to get access to upcoming events, special apps, motivating content, and exclusive discounts.',
    placeholder: 'Enter your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing.',
  },

  /** Fallback footer links, used only if the Storefront `footer` menu is empty. */
  footerLinks: [
    { title: 'Terms of Service', url: '/pages/terms-of-service' },
    { title: 'Contact Us', url: '/pages/contact-us' },
    { title: 'Returns', url: '/pages/returns' },
  ] satisfies NavLink[],

  /** Fallback header nav, used only if the Storefront `main-menu` is empty. */
  headerLinks: [
    { title: 'Shop', url: '/collections' },
    { title: 'Our Story', url: '/pages/our-story' },
    { title: 'Contact Us', url: '/pages/contact-us' },
  ] satisfies NavLink[],
} as const;
