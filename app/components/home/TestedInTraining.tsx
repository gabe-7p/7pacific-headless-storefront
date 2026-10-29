import { Image } from '@shopify/hydrogen';

import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { HOME_ROSTER } from '~/content/home';

/**
 * "The Roster" — relaid Gabe 2026-10-28. Three full-bleed media bands stacked
 * edge to edge with no gap (the gym loop and the Kezar photo, each shown at
 * 80% / 70% of their native height, then the bakery run as two bottom-anchored
 * crops side by side in a slightly shorter band), with the pitch overlaid on top: title at the
 * section-header scale, the ask, and the xs outline CTA the Baseline V01
 * cards use, over a feathered radial shadow that travels with the block. The copy
 * starts near the top of the first band and is sticky at 40vh, so it pins
 * early and travels down across the bands until the section leaves. Copy is homepage v2
 * (content/home.ts).
 */
export const TestedInTraining = () => (
  // overflow-x-clip (not -hidden): the shadow halo overshoots the viewport on
  // phones and would add sideways scroll; `clip` cuts it without turning the
  // section into a scroll container, which would break the sticky copy.
  <section className="relative overflow-x-clip bg-field-night text-ink-night">
    {/* Band 1: the 16:9 loop in a 3840:1728 box (= 16:9 at 80% height).
        object-position 85% down splits the 20% trim ~17% off the top, ~3% off
        the floor — the foreground is the point of this shot, nudged up a
        touch (Gabe, 2026-10-28). `block` kills the inline-media descender
        gap so the two bands touch. */}
    <video
      src={HOME_ROSTER.video.src}
      aria-label={HOME_ROSTER.video.label}
      autoPlay
      loop
      muted
      playsInline
      className="block aspect-[3840/1728] w-full object-cover object-[50%_85%]"
    />
    {/* Band 2: the photo is pre-cropped to 70% of its 3:2 height, so its
        own width/height set the box — nothing to trim. */}
    <Image
      src={HOME_ROSTER.image.url}
      width={HOME_ROSTER.image.width}
      height={HOME_ROSTER.image.height}
      alt={HOME_ROSTER.image.alt}
      loading="lazy"
      sizes="100vw"
      className="block w-full object-cover"
    />
    {/* Band 3: the bakery run — two 1.36:1 crops side by side in a 2.72:1
        box, a step shorter than the Kezar band above it. The crops match the
        cells, so nothing to trim. */}
    <div className="grid aspect-[272/100] w-full grid-cols-2">
      {/* Each half is a relative cell with the image filling it absolutely —
          Hydrogen's <Image> sets an inline aspect-ratio from its width/height,
          which would otherwise size the grid row from the image instead of
          the band's box (the same fix TeaserSection's cards use). */}
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
    {/* Legibility wash — the same 15% device the Baseline V01 cards use.
        30% read as a grade on the footage (Gabe, 2026-10-28), so the copy
        carries itself in full white instead of leaning on the tint. */}
    <div className="pointer-events-none absolute inset-0 bg-black/15" />
    {/* Overlay: an absolute layer the height of both bands. The copy block
        inside it is sticky at 40vh, so it rests a step below the top of the
        first band on arrival, locks at 40% of the viewport as soon as it
        scrolls up to that line (well before the section reaches the header —
        Gabe wanted the ride to start sooner), and travels down over the
        second band until the section's end pushes it out. pointer-events-none
        on the layer so the media never loses a click; re-enabled on the copy
        for the CTA. */}
    <div className="pointer-events-none absolute inset-0 px-4 pt-6 md:pt-16">
      {/* The block casts a feathered shadow onto the footage: a radial
          gradient on ::before, oversized past the copy on every side and
          fading to nothing by 70% of its radius, so there is no edge to read
          as a panel. position:sticky makes its own stacking context, so the
          -z-10 pseudo stays behind the copy but above the media. */}
      <div className="pointer-events-auto sticky top-[40vh] mx-auto flex w-fit flex-col items-center text-center before:pointer-events-none before:absolute before:-inset-x-24 before:-inset-y-16 before:-z-10 before:bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.6),transparent_70%)] md:before:-inset-x-40 md:before:-inset-y-24">
        {/* A step under the section-header scale (24/36/48 vs 48/60) — Gabe
            found the full tier too big over the footage (2026-10-28). Weight
            stays the display 500 from the brand variant, like every other
            title. leading repeats per size because text-* resets line-height. */}
        <Heading
          as="h2"
          size="none"
          lines={HOME_ROSTER.headingLines}
          className="text-2xl leading-[1.05] md:text-4xl md:leading-[1.05] xl:text-5xl xl:leading-[1.05]"
        />
        {/* Body at regular weight, full ink-night (white), 16px from md. Phone
            sizes stay a step smaller: the two bands total ~350px there and
            the block has to fit inside them with room to ride. */}
        <p className="mt-3 max-w-lg text-sm leading-[1.5] md:mt-4 md:text-base md:leading-[1.5]">
          {HOME_ROSTER.body}
        </p>
        {/* Both secondary — the home page's one Ember moment is the hero CTA
            (7PA-230). Side by side, wrapping on narrow phones. */}
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
