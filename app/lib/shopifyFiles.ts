import { BRAND } from '~/lib/brand';

/**
 * The one way to reference media on Shopify Files — every asset URL is built
 * here from the filename or media id Files shows, never pasted, so the CDN
 * roots live in one place.
 *
 * Videos: Files assigns a 32-char media id and transcodes the upload into
 * renditions (`HD-720p-4.5Mbps-…` — copy the string between the id and
 * `.mp4` from the rendition URL). 720p is the default for background loops,
 * 1080p for full-bleed slots. Files also renders a first-frame thumbnail for
 * every video under the same id.
 */

const FILES_CDN = BRAND.filesCdn;
const VIDEO_CDN = 'https://cdn.shopify.com/videos/c';

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

/** The untranscoded upload — legacy, prefer a rendition. */
export const shopifyVideoOriginal = (id: string) => `${VIDEO_CDN}/o/v/${id}.mp4`;

/** The first-frame thumbnail Files renders for a video. */
export const shopifyVideoThumbnail = (id: string, params?: ImageParams) =>
  `${FILES_CDN}/preview_images/${id}.thumbnail.0000000000.jpg${query(params)}`;

/** A custom poster uploaded for a video. */
export const shopifyVideoPoster = (filename: string, params?: ImageParams) =>
  `${FILES_CDN}/preview_images/${filename}${query(params)}`;
