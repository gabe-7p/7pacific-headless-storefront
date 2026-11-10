import { Image } from '~/components/common/Image';
import { LazyVideo } from '~/components/common/LazyVideo';
import { sourceLadder } from '~/lib/imageSizes';
import type { ContentMedia as ContentMediaSource } from '~/lib/shopifyFiles';

type ContentMediaProps = {
  media: ContentMediaSource;
  /** The image's `sizes` (a preset from `lib/imageSizes`); ignored for video. */
  sizes: string;
  /**
   * Above-the-fold media: a bare `<video autoPlay>` that starts before
   * hydration. Omitted, the video is a `LazyVideo`: nothing is fetched
   * until it first plays, and it plays only while on screen.
   */
  eager?: boolean;
  className?: string;
};

/**
 * Renders one Files image or video slot — the `kind` switch every content
 * section would otherwise write itself. Images are `common/Image` in fluid
 * mode (lazy unless `eager`); videos are `LazyVideo` unless `eager`.
 */
export const ContentMedia = ({ media, sizes, eager = false, className }: ContentMediaProps) => {
  if (media.kind === 'image') {
    return (
      // `data`, not `src` + numeric `width`: that pair selects fixed mode, which
      // offered the full-size file at 1x/2x/3x (a 3968px photo in a half-width
      // card). Fluid mode lets `sizes` pick from the ladder.
      <Image
        data={{ url: media.src, width: media.width, height: media.height }}
        srcSetWidths={sourceLadder(media.width)}
        alt={media.alt}
        loading={eager ? 'eager' : 'lazy'}
        sizes={sizes}
        className={className}
      />
    );
  }

  if (eager) {
    return (
      <video
        src={media.src}
        poster={media.poster}
        aria-label={media.label}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    );
  }

  return (
    <LazyVideo src={media.src} poster={media.poster} label={media.label} className={className} />
  );
};
