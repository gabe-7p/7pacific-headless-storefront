import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Button } from '~/components/ui/button';
import { HOME_TESTED } from '~/content/home';

/**
 * "Tested in training. Refined by community." — full-bleed looping video with
 * centered copy + membership CTA. Mirrors the live `black-text-image-split` section.
 */
export const TestedInTraining = () => (
  <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-neutral-900 text-white">
    <video
      src={HOME_TESTED.video}
      autoPlay
      loop
      muted
      playsInline
      poster={HOME_TESTED.image}
      className="absolute inset-0 size-full object-cover"
    />
    <div className="absolute inset-0 bg-black/55" />
    <Container className="relative z-10 max-w-3xl text-center">
      <Heading as="h2" size="lg">
        {HOME_TESTED.headingLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </Heading>
      <p className="mx-auto mt-4 max-w-xl text-sm text-white/85">{HOME_TESTED.body}</p>
      <Button asChild variant="brand" className="mt-6">
        <Link to={HOME_TESTED.cta.href}>{HOME_TESTED.cta.label}</Link>
      </Button>
    </Container>
  </section>
);
