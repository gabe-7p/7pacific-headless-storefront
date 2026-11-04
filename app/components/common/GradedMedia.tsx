import {
  MediaSlot,
  type MediaSlotRatio,
  type MediaSlotSource,
} from '~/components/common/MediaSlot';
import { cn } from '~/lib/cn';

/** Film grain over photography — see `--grain` in tailwind.css. */
export const GrainVeil = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 bg-[image:var(--grain)] opacity-[0.07] mix-blend-overlay"
  />
);

/**
 * A photo under the unifying grade: the images are shot in different light
 * (fog, beach sun, trail green), so each gets a slight desaturation plus a cool
 * Carbon multiply veil, enough to pull them onto one color profile without
 * visibly costing detail. `grain` adds the film grain of the night-surface
 * editorial pages (Our Story), so the fog stand-ins and the eventual night
 * shoot share one profile.
 */
export const GradedMedia = ({
  media,
  ratio,
  grain = false,
  className,
}: {
  media: MediaSlotSource;
  ratio: MediaSlotRatio;
  grain?: boolean;
  className?: string;
}) => (
  <div className={cn('relative', grain && 'overflow-hidden', className)}>
    <MediaSlot media={media} ratio={ratio} className="saturate-[0.85]" />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-field-night/15 mix-blend-multiply"
    />
    {grain && <GrainVeil />}
  </div>
);
