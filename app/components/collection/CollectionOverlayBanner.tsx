import { Heading } from '~/components/common/Heading';
import { MediaSlot, type MediaSlotSource } from '~/components/common/MediaSlot';
import { Scrim } from '~/components/common/Scrim';
import { SpecLine } from '~/components/common/SpecLine';
import { IMAGE_SIZES } from '~/lib/imageSizes';

/** The copy a collection's overlay banner carries (`SHOP_INTRO`). */
export type CollectionOverlayContent = {
  headline: string;
  footLeft: string;
  footRight: string;
  intro: string;
};

/**
 * A collection banner with its title over the photo: the headline centred in
 * the space below the header, a mono label in each bottom corner. A step
 * taller than the drop collections' banners (`bannerTall`), pulled up under the transparent header
 * (`layout/Header`), so the copy column clears `--header-h` itself.
 */
export const CollectionOverlayBanner = ({
  media,
  copy,
}: {
  media: MediaSlotSource;
  copy: CollectionOverlayContent;
}) => (
  <section className="relative -mt-(--header-h) text-ink-night">
    <MediaSlot media={media} ratio="bannerTall" sizes={IMAGE_SIZES.full} loading="eager" />
    <Scrim strength="25" />
    <div className="absolute inset-0 flex flex-col px-5 pt-(--header-h) pb-4 md:pb-5">
      <div className="flex flex-1 items-center">
        <Heading
          as="h1"
          size="none"
          className="max-w-4xl text-[1.75rem] leading-none tracking-hero md:text-5xl"
        >
          {copy.headline}
        </Heading>
      </div>
      <div className="flex items-end justify-between gap-6">
        <SpecLine size="strip">{copy.footLeft}</SpecLine>
        <SpecLine size="strip" className="text-right">
          {copy.footRight}
        </SpecLine>
      </div>
    </div>
  </section>
);
