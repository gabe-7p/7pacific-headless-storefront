import { cn } from '~/lib/cn';

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
  /** Landscape grid cell — 16:10 stacked on mobile, 4:3 from sm. */
  landscape: 'aspect-[16/10] sm:aspect-[4/3]',
  /** Drop-page product tile (the PLP card itself crops square). */
  product: 'aspect-[4/5]',
} as const;

export type MediaSlotRatio = keyof typeof RATIOS;

/**
 * Named crop anchors for an image slot whose source doesn't match the box
 * ratio — the focal point is a fact about the photo, so it rides the source
 * (same union → static-class device as RATIOS). Extend as art direction
 * needs.
 */
const FOCUS = {
  /** Keep the top of the frame (faces in a portrait source, landscape box). */
  top: 'object-top',
  /** Bias the window toward the upper third (heads in a wide cinematic crop). */
  upper: 'object-[50%_30%]',
} as const;

/**
 * What fills a slot. Content files hold one of these per slot; upgrading a
 * placeholder to the real asset is a one-line change there — swap the
 * `placeholder` object for an `image`/`video` one — with no component edits.
 * A placeholder's `type` records which kind of asset the slot is waiting for.
 */
export type MediaSlotSource =
  | { kind: 'placeholder'; type: 'image' | 'video' }
  | { kind: 'image'; src: string; alt: string; focus?: keyof typeof FOCUS }
  | { kind: 'video'; src: string; poster?: string };

type MediaSlotProps = {
  media: MediaSlotSource;
  ratio: MediaSlotRatio;
  /** Above-the-fold slots pass 'eager'. */
  loading?: 'eager' | 'lazy';
  className?: string;
};

/**
 * A fixed-aspect media box: a quiet panel until the real asset is supplied,
 * then the image (object-cover) or an autoplaying muted loop — the same
 * treatment the homepage marketing videos use.
 */
export const MediaSlot = ({ media, ratio, loading = 'lazy', className }: MediaSlotProps) => {
  const box = cn('w-full', RATIOS[ratio], className);

  if (media.kind === 'image') {
    return (
      <img
        src={media.src}
        alt={media.alt}
        loading={loading}
        className={cn(box, 'object-cover', media.focus && FOCUS[media.focus])}
      />
    );
  }

  if (media.kind === 'video') {
    return (
      <video
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        className={cn(box, 'object-cover')}
      />
    );
  }

  // Placeholder tint first so a caller's className can override it.
  return <div aria-hidden data-media={media.type} className={cn('bg-media-placeholder', box)} />;
};
