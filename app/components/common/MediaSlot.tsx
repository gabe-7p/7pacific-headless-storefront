import { ContentMedia } from '~/components/common/ContentMedia';
import { Image } from '~/components/common/Image';
import { cn } from '~/lib/cn';
import { sourceLadder } from '~/lib/imageSizes';
import type { FilesImage, FilesVideo } from '~/lib/shopifyFiles';

/**
 * Aspect ratio per slot, locked here as a union → static Tailwind classes
 * (inline styles are banned and Tailwind can't generate classes at runtime —
 * the `ScaleMarkerPercent` device). The box keeps its exact footprint whether
 * it holds the placeholder panel or the real asset, so upgrading media in a
 * content file never shifts the layout around it.
 */
const RATIOS = {
  /** Full-bleed hero band — wide on desktop, squarer on mobile. */
  hero: 'aspect-[4/5] md:aspect-[8/3]',
  /** Tall portrait panel (side shots, lookbook grid cells). */
  portrait: 'aspect-[3/4]',
  /** Full-bleed backdrop a section overlays content on. */
  backdrop: 'aspect-[4/5] md:aspect-video',
  /** 16:9 film band at every width (the BASELINE drop film). */
  video: 'aspect-video',
  /** Extra-wide cinematic band — 16:9 on mobile, 21:8 from sm. */
  wide: 'aspect-video sm:aspect-[21/8]',
  /** A 16:9 loop shown at 70% of its height from sm (160:63 — a touch
      shallower than the Roster band's 80% crop), full 16:9 on mobile: near
      the `wide` band's proportions without losing a third of the frame. */
  loop: 'aspect-video sm:aspect-[160/63]',
  /** Landscape grid cell — 16:10 stacked on mobile, 4:3 from sm. */
  landscape: 'aspect-[16/10] sm:aspect-[4/3]',
  /** Drop-page product tile (the PLP card itself crops square). */
  product: 'aspect-[4/5]',
  /** Full-bleed strip with a fixed height, 256px / 352px from md (the drop
      collection banners): a height, not a ratio, so it never grows past it. */
  banner: 'h-64 md:h-88',
} as const;

export type MediaSlotRatio = keyof typeof RATIOS;

/**
 * Named crop anchors for a slot whose source doesn't match the box ratio —
 * the focal point is a fact about the photo, so it rides the source.
 */
const FOCUS = {
  /** Keep the top of the frame (faces in a portrait source, landscape box). */
  top: 'object-top',
  /** Bias the window toward the upper third (heads in a wide cinematic crop). */
  upper: 'object-[50%_30%]',
  /** Bias the window just below centre (full-length runners in a portrait
      source, wide box: heads to knees in the FIRST LIGHT 8:3 hero). */
  lower: 'object-[50%_58%]',
  /** Near the top, stepping down as the box widens: just enough headroom for
      an overlay above the subject (the FIRST LIGHT countdown over a standing
      portrait in a 16:9 box — head to hips). The countdown is a fixed height,
      so narrower boxes need a higher window; re-check 768–1920 if it moves. */
  nearTop: 'object-[50%_16%] lg:object-[50%_20%] 2xl:object-[50%_22%]',
  /** Keep the right half (a subject framed right in a landscape source, portrait box). */
  right: 'object-right',
} as const;

/**
 * What fills a slot. Content files hold one of these per slot; upgrading a
 * placeholder to the real asset is a one-line change there — swap the
 * `placeholder` object for an `image`/`video` one — with no component edits.
 * A placeholder's `type` records which kind of asset the slot is waiting for.
 */
export type MediaSlotSource =
  | { kind: 'placeholder'; type: 'image' | 'video' }
  | ({ kind: 'image'; focus?: keyof typeof FOCUS } & FilesImage)
  | ({ kind: 'video' } & FilesVideo);

type MediaSlotProps = {
  media: MediaSlotSource;
  ratio: MediaSlotRatio;
  /** The slot's rendered width (a preset from `lib/imageSizes`); ignored for video. */
  sizes: string;
  /** Above-the-fold slots pass 'eager'. */
  loading?: 'eager' | 'lazy';
  className?: string;
};

/**
 * A fixed-aspect media box: a quiet panel until the asset is supplied, then
 * the image (object-cover) or a muted loop (`LazyVideo` unless eager).
 *
 * The image's box stays on a wrapper. `Image` writes an inline aspect-ratio
 * that beats an `aspect-*` class, so it can't carry the responsive flips in
 * `RATIOS`; filling the wrapper leaves that inline ratio inert. The candidates
 * are deliberately not CDN-cropped: one crop can't serve a box that changes
 * ratio, and `crop` has no equivalent of `FOCUS.upper`. `object-cover` picks
 * the window from the whole frame, so `FOCUS` still decides what shows.
 */
export const MediaSlot = ({ media, ratio, sizes, loading = 'lazy', className }: MediaSlotProps) => {
  const box = cn('w-full', RATIOS[ratio], className);

  if (media.kind === 'image') {
    return (
      <div className={cn('relative', box)}>
        {/* `data`, not `src` + numeric `width`: that pair selects fixed mode. */}
        <Image
          data={{ url: media.src, width: media.width, height: media.height }}
          alt={media.alt}
          sizes={sizes}
          srcSetWidths={sourceLadder(media.width)}
          loading={loading}
          className={cn(
            'absolute inset-0 size-full object-cover',
            media.focus && FOCUS[media.focus]
          )}
        />
      </div>
    );
  }

  if (media.kind === 'video') {
    return (
      <ContentMedia
        media={media}
        sizes={sizes}
        eager={loading === 'eager'}
        className={cn(box, 'object-cover')}
      />
    );
  }

  // Placeholder tint first so a caller's className can override it.
  return <div aria-hidden data-media={media.type} className={cn('bg-media-placeholder', box)} />;
};
