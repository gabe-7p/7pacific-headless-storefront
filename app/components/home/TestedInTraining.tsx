import { Image } from '@shopify/hydrogen';

import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { HOME_ROSTER } from '~/content/home';

/**
 * "The Roster" — split section: dark textured (looping video) panel with the
 * ask + JOIN THE ROSTER CTA on the left, lifestyle photo filling the right.
 * Layout mirrors the live `black-text-image-split` section; copy is homepage
 * v2 (content/home.ts).
 */
export const TestedInTraining = () => (
  // Splits 5:4 (text left) from 640px up rather than live's 1024: the photo is
  // only 696px wide natively, so a full-bleed stacked layout upscales it into
  // visible blur. Holding the split keeps its cell at or under native width.
  <section className="grid overflow-hidden bg-field-night text-ink-night sm:grid-cols-[5fr_4fr]">
    <div className="relative order-2 sm:order-1">
      {/* No scrim over the video — live has none, and the footage is dark enough
          to carry white text. `bg-field-night` on the section covers the gap
          until the first frame decodes. */}
      <video
        src={HOME_ROSTER.video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 size-full object-cover"
      />
      <div className="relative z-10 px-6 py-11 md:px-10 lg:px-16 lg:py-16">
        {/* 24px, 40px tablet, 64.8px desktop — face/weight/tracking from the
            Heading brand variant (500, the only display weight in the system). */}
        <Heading
          as="h2"
          size="none"
          lines={HOME_ROSTER.headingLines}
          className="text-2xl leading-[1.2] md:text-[2.5rem] xl:text-[4.05rem]"
        />
        <p className="mt-6 max-w-md text-sm text-support-night">{HOME_ROSTER.body}</p>
        {/* Secondary — the home page's one Ember moment is the hero CTA (7PA-230). */}
        <Cta to={HOME_ROSTER.cta.href} className="mt-8">
          {HOME_ROSTER.cta.label}
        </Cta>
      </div>
    </div>
    <Image
      src={HOME_ROSTER.image.url}
      width={HOME_ROSTER.image.width}
      height={HOME_ROSTER.image.height}
      alt={HOME_ROSTER.image.alt}
      loading="lazy"
      sizes="(min-width: 640px) 45vw, 100vw"
      className="order-1 aspect-[351/367] w-full object-cover sm:order-2 sm:aspect-auto sm:h-full"
    />
  </section>
);
