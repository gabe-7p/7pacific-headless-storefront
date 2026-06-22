import { BRAND } from '~/lib/brand';

/**
 * SEO defaults — single source for the page-title format and fallback meta.
 * Use `pageTitle()` in every route's `meta` so the title format changes in one
 * place.
 */
export const DEFAULT_DESCRIPTION =
  'Lightweight, breathable training gear built for performance. Free shipping on orders over $200.';

/** `pageTitle('Cart')` → "7Pacific | Cart"; `pageTitle()` → "7Pacific". */
export const pageTitle = (title?: string | null) =>
  title ? `${BRAND.name} | ${title}` : BRAND.name;

type SocialMetaInput = {
  title: string;
  description?: string | null;
  image?: string | null;
  url?: string | null;
  type?: 'website' | 'product' | 'article';
};

/**
 * Open Graph + Twitter meta descriptors for a route `meta` export. Spread into
 * the returned array alongside `{ title }`. Mirrors the live `social-meta-tags`.
 */
export const socialMeta = ({
  title,
  description,
  image,
  url,
  type = 'website',
}: SocialMetaInput) => {
  const desc = description || DEFAULT_DESCRIPTION;
  return [
    { name: 'description', content: desc },
    { property: 'og:title', content: title },
    { property: 'og:description', content: desc },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: BRAND.name },
    ...(image ? [{ property: 'og:image', content: image }] : []),
    ...(url ? [{ property: 'og:url', content: url }] : []),
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: desc },
    ...(image ? [{ name: 'twitter:image', content: image }] : []),
  ];
};

type ProductJsonLdInput = {
  title: string;
  description?: string | null;
  image?: string | null;
  url: string;
  price?: string | null;
  currency?: string | null;
  available?: boolean;
};

/**
 * Product JSON-LD descriptor (schema.org/Product) for a route `meta` export.
 * React Router renders `script:ld+json` descriptors as a `<script>` tag.
 */
export const productJsonLd = ({
  title,
  description,
  image,
  url,
  price,
  currency,
  available,
}: ProductJsonLdInput) => ({
  'script:ld+json': {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description || DEFAULT_DESCRIPTION,
    ...(image ? { image } : {}),
    brand: { '@type': 'Brand', name: BRAND.name },
    offers: {
      '@type': 'Offer',
      url,
      ...(price ? { price } : {}),
      ...(currency ? { priceCurrency: currency } : {}),
      availability: `https://schema.org/${available ? 'InStock' : 'OutOfStock'}`,
    },
  },
});
