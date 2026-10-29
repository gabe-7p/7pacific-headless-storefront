import { Image } from '@shopify/hydrogen';

import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { LazyVideo } from '~/components/common/LazyVideo';
import { HOME_ROSTER } from '~/content/home';

/**
 * "The Roster" — three full-bleed media bands stacked with no gap, with the
 * pitch overlaid on a sticky block that rides down the bands as the section
 * scrolls. Copy is content/home.ts.
 */
export const Roster = () => (
  // overflow-x-clip, not -hidden: hidden would make the section a scroll
  // container and break the sticky copy. The halo overshoots on phones.
  <section className="relative overflow-x-clip bg-field-night text-ink-night">
    {/* Band 1: 16:9 loop shown at 80% height, anchored near the floor.
        `block` kills the inline descender gap so the bands touch. */}
    <LazyVideo
      src={HOME_ROSTER.video.src}
      poster={HOME_ROSTER.video.poster}
      label={HOME_ROSTER.video.label}
      className="block aspect-[3840/1728] w-full object-cover object-[50%_85%]"
    />
    {/* Band 2: pre-cropped, so its own width/height set the box. */}
    <Image
      src={HOME_ROSTER.image.url}
      width={HOME_ROSTER.image.width}
      height={HOME_ROSTER.image.height}
      alt={HOME_ROSTER.image.alt}
      loading="lazy"
      sizes="100vw"
      className="block w-full object-cover"
    />
    {/* Band 3: two crops side by side; the box ratio matches the crops. */}
    <div className="grid aspect-[272/100] w-full grid-cols-2">
      {/* Images fill their cells absolutely — <Image>'s inline aspect-ratio
          would otherwise size the row (same fix as TeaserSection). */}
      <div className="relative overflow-hidden">
        <Image
          src={HOME_ROSTER.bakeryRun.squad.url}
          width={HOME_ROSTER.bakeryRun.squad.width}
          height={HOME_ROSTER.bakeryRun.squad.height}
          alt={HOME_ROSTER.bakeryRun.squad.alt}
          loading="lazy"
          sizes="50vw"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="relative overflow-hidden">
        <Image
          src={HOME_ROSTER.bakeryRun.announcement.url}
          width={HOME_ROSTER.bakeryRun.announcement.width}
          height={HOME_ROSTER.bakeryRun.announcement.height}
          alt={HOME_ROSTER.bakeryRun.announcement.alt}
          loading="lazy"
          sizes="50vw"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
    {/* Legibility wash — the same 15% the Baseline V01 cards use. */}
    <div className="pointer-events-none absolute inset-0 bg-black/15" />
    {/* Overlay layer spanning all bands. The copy block is sticky at 40vh;
        the layer's padding sets where the ride starts (pt) and stops (pb —
        sticky travel is bounded by the containing block's content box).
        pointer-events pass through to the media except on the copy. */}
    <div className="pointer-events-none absolute inset-0 px-4 pt-6 pb-24 md:pt-16 md:pb-48">
      {/* ::before is a feathered radial shadow behind the copy (no edge, so
          it doesn't read as a panel); sticky's stacking context keeps the
          -z-10 pseudo above the media. */}
      <div className="pointer-events-auto sticky top-[40vh] mx-auto flex w-fit flex-col items-center text-center before:pointer-events-none before:absolute before:-inset-x-24 before:-inset-y-16 before:-z-10 before:bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.6),transparent_70%)] md:before:-inset-x-40 md:before:-inset-y-24">
        {/* A step under the section-header scale; leading repeats per size
            because text-* resets line-height. */}
        <Heading
          as="h2"
          size="none"
          lines={HOME_ROSTER.headingLines}
          className="text-2xl leading-[1.05] md:text-4xl md:leading-[1.05] xl:text-5xl xl:leading-[1.05]"
        />
        {/* Phone sizes stay a step smaller so the block fits inside the
            ~350px the bands total there. */}
        <p className="mt-3 max-w-lg text-sm leading-[1.5] md:mt-4 md:text-base md:leading-[1.5]">
          {HOME_ROSTER.body}
        </p>
        {/* Both secondary — the page's one Ember moment is the hero CTA (7PA-230). */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Cta to={HOME_ROSTER.cta.href} size="xs">
            {HOME_ROSTER.cta.label}
          </Cta>
          <Cta href={HOME_ROSTER.bakeryRun.cta.href} target="_blank" size="xs">
            {HOME_ROSTER.bakeryRun.cta.label}
          </Cta>
        </div>
      </div>
    </div>
  </section>
);
