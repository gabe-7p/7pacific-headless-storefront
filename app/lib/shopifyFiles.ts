/**
 * The one way to reference media on Shopify Files — every asset URL is built
 * here from the filename or media id Files shows, never pasted, so the CDN
 * roots live in one place (the two constants below).
 *
 * Videos: Files assigns a 32-char media id and transcodes the upload into
 * renditions (`HD-720p-4.5Mbps-…` — copy the string between the id and
 * `.mp4` from the rendition URL). 720p is the default for background loops,
 * 1080p for full-bleed slots. Files also renders a first-frame thumbnail for
 * every video under the same id.
 */

/** The store's Files bucket on Shopify's CDN. */
const FILES_CDN = 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files';
const VIDEO_CDN = 'https://cdn.shopify.com/videos/c';

/** Shopify's image CDN: the host `common/Image` may resize through URL params. */
const CDN_HOST = new URL(FILES_CDN).hostname;

/** Whether a URL is served by Shopify's image CDN (false for anything unparseable). */
export const isShopifyCdnUrl = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    return hostname === CDN_HOST || hostname.endsWith(`.${CDN_HOST}`);
  } catch {
    return false;
  }
};

type ImageParams = {
  /** The `v=` cache-buster Files appends to the asset's URL. */
  v?: number;
  /** Ask the CDN for a copy resized to this width. */
  width?: number;
};

const query = (params?: ImageParams) => {
  const parts = [params?.v && `v=${params.v}`, params?.width && `width=${params.width}`].filter(
    Boolean
  );
  return parts.length ? `?${parts.join('&')}` : '';
};

/** An image uploaded to Shopify Files, by the filename Files shows. */
export const shopifyImage = (filename: string, params?: ImageParams) =>
  `${FILES_CDN}/${filename}${query(params)}`;

/** A transcoded rendition of a Files video. */
export const shopifyVideo = (id: string, rendition: string) =>
  `${VIDEO_CDN}/vp/${id}/${id}.${rendition}.mp4`;

/** The first-frame thumbnail Files renders for a video. */
export const shopifyVideoThumbnail = (id: string, params?: ImageParams) =>
  `${FILES_CDN}/preview_images/${id}.thumbnail.0000000000.jpg${query(params)}`;

/** A custom poster uploaded for a video. */
export const shopifyVideoPoster = (filename: string, params?: ImageParams) =>
  `${FILES_CDN}/preview_images/${filename}${query(params)}`;

/**
 * The shapes content files hold for Files media, so every surface that
 * renders one (`common/Image`, `common/ContentMedia`) takes the same thing.
 * `width`/`height` are the asset's intrinsic size (what `Image` crops and
 * reserves space from).
 */
export type FilesImage = { src: string; width: number; height: number; alt: string };

export type FilesVideo = { src: string; poster?: string; label?: string };

/** A slot that holds either: discriminated by `kind`. */
export type ContentMedia = ({ kind: 'image' } & FilesImage) | ({ kind: 'video' } & FilesVideo);

/**
 * A `FilesImage` from the filename Files shows. `width`/`height` are the
 * intrinsic size; `resize` asks the CDN for a smaller copy of an oversized
 * source (the `?width=` param) when the intrinsic size is the served size.
 */
export const filesImage = (
  filename: string,
  {
    v,
    resize,
    width,
    height,
    alt,
  }: { v?: number; resize?: number; width: number; height: number; alt: string }
): FilesImage => ({ src: shopifyImage(filename, { v, width: resize }), width, height, alt });
