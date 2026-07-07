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
      <div className="relative z-10 px-6 py-16 text-center md:px-12 md:text-left lg:px-16 lg:py-24">
        <Heading as="h2" size="lg">
          {HOME_TESTED.headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Heading>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 md:mx-0">{HOME_TESTED.body}</p>
        <Button asChild variant="brand" className="mt-6">
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
