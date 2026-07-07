import { Link } from 'react-router';

import { Heading } from '~/components/common/Heading';
import { Button } from '~/components/ui/button';
import { HOME_TESTED } from '~/content/home';

/**
 * "Tested in training. Refined by community." — split section: dark textured
 * (looping video) panel with the copy + membership CTA on the left, lifestyle
 * photo filling the right. Mirrors the live `black-text-image-split` section.
 */
export const TestedInTraining = () => (
  <section className="grid overflow-hidden bg-neutral-900 text-white md:grid-cols-[13fr_10fr]">
    <div className="relative">
      <video
        src={HOME_TESTED.video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 px-6 py-16 md:px-12 lg:px-16 lg:py-24">
        <Heading
          as="h2"
          size="display"
          className="text-4xl leading-tight font-light tracking-wide md:text-5xl lg:text-[3.5rem]"
        >
          {HOME_TESTED.headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Heading>
        <p className="mt-6 max-w-md text-sm text-white/85">{HOME_TESTED.body}</p>
        <Button asChild variant="brand" className="mt-8">
          <Link to={HOME_TESTED.cta.href}>{HOME_TESTED.cta.label}</Link>
        </Button>
      </div>
    </div>
    <img
      src={HOME_TESTED.image}
      alt=""
      loading="lazy"
      className="h-72 w-full object-cover md:h-full"
    />
  </section>
);
