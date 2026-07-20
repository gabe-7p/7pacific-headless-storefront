import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { HOME_TESTED } from '~/content/home';

/**
 * "Tested in training. Refined by community." — split section: dark textured
 * (looping video) panel with the copy + membership CTA on the left, lifestyle
 * photo filling the right. Mirrors the live `black-text-image-split` section.
 */
export const TestedInTraining = () => (
  // Live stacks photo-above-text up to tablet and splits 5:4 on desktop, with
  // the text panel on the left.
  <section className="grid overflow-hidden bg-neutral-900 text-white lg:grid-cols-[5fr_4fr]">
    <div className="relative order-2 lg:order-1">
      {/* No scrim over the video — live has none, and the footage is dark enough
          to carry white text. `bg-neutral-900` on the section covers the gap
          until the first frame decodes. */}
      <video
        src={HOME_TESTED.video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 size-full object-cover"
      />
      <div className="relative z-10 px-6 py-16 md:px-12 lg:px-16 lg:py-24">
        {/* 24px, 40px tablet, 64.8px desktop — face/weight/tracking from the
            Heading brand variant (display is always Bold in the type system). */}
        <Heading
          as="h2"
          size="none"
          className="text-2xl leading-[1.2] md:text-[2.5rem] xl:text-[4.05rem]"
        >
          {HOME_TESTED.headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Heading>
        <p className="mt-6 max-w-md text-sm text-white/85">{HOME_TESTED.body}</p>
        {/* Secondary — the home page's one Ember moment is the hero CTA (7PA-230). */}
        <Cta to={HOME_TESTED.cta.href} className="mt-8">
          {HOME_TESTED.cta.label}
        </Cta>
      </div>
    </div>
    <img
      src={HOME_TESTED.image}
      alt=""
      loading="lazy"
      className="order-1 aspect-[351/367] w-full object-cover lg:order-2 lg:aspect-auto lg:h-full"
    />
  </section>
);
