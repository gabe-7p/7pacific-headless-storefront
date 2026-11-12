import { BRAND } from '~/content/brand';

/**
 * SEO defaults — the single source for the page-title format and fallback
 * meta. Routes build `meta` through `buildMeta()` below.
 */
export const DEFAULT_DESCRIPTION = BRAND.seo.defaultDescription;

/** `pageTitle('Cart')` → "7Pacific | Cart"; `pageTitle()` → "7Pacific". */
export const pageTitle = (title?: string | null) =>
  title ? `${BRAND.name} | ${title}` : BRAND.name;

type BuildMetaArgs = {
  /** Formatted via `pageTitle` ("7Pacific | X"). */
  title?: string | null;
  /** Used verbatim instead of `title` (e.g. the homepage's hand-tuned title). */
  absoluteTitle?: string;
  description?: string | null;
  /** og:image URL, when the page has a natural share image. */
  image?: string | null;
  /**
   * og:video, a direct mp4 link. iMessage plays it inline in the link
   * preview; scrapers that ignore og:video (most SMS/RCS apps) fall back to
   * `image`, so pass both.
   */
  video?: { url: string; width: number; height: number } | null;
  /** The page's own path (e.g. `productUrl(handle)`); emitted as an absolute canonical link. */
  canonical?: string;
};

/**
 * The one way routes build their `meta` array: brand-formatted title,
 * description (brand default when the page has none), and og: tags.
 * `canonical` is resolved against `BRAND.siteUrl`, never the request origin.
 */
export const buildMeta = ({
  title,
  absoluteTitle,
  description,
  image,
  video,
  canonical,
}: BuildMetaArgs) => {
  const resolvedTitle = absoluteTitle ?? pageTitle(title);
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  return [
    { title: resolvedTitle },
    { name: 'description', content: resolvedDescription },
    { property: 'og:title', content: resolvedTitle },
    { property: 'og:description', content: resolvedDescription },
    ...(image ? [{ property: 'og:image', content: image }] : []),
    ...(video
      ? [
          { property: 'og:video', content: video.url },
          { property: 'og:video:secure_url', content: video.url },
          { property: 'og:video:type', content: 'video/mp4' },
          { property: 'og:video:width', content: String(video.width) },
          { property: 'og:video:height', content: String(video.height) },
        ]
      : []),
    ...(canonical
      ? [{ tagName: 'link', rel: 'canonical', href: `${BRAND.siteUrl}${canonical}` }]
      : []),
  ];
};
