import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { SectionHeader } from '~/components/common/SectionHeader';
import { type CoreValue, HOME_CORE_VALUES } from '~/content/home';
import { cn } from '~/lib/cn';

const ValueCard = ({ value, className }: { value: CoreValue; className?: string }) => (
  <div
    className={cn(
      'bg-announcement text-announcement-text flex flex-col justify-between p-8',
      className
    )}
  >
    <div>
      <Heading as="h3" size="md">
        {value.title}
      </Heading>
      <p className="mt-3 text-sm text-white/80">{value.body}</p>
    </div>
    <Link
      to={value.cta.href}
      prefetch="intent"
      className="mt-6 inline-block text-xs font-semibold tracking-wide uppercase underline-offset-4 hover:underline"
    >
      {value.cta.label} →
    </Link>
  </div>
);

const Media = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('overflow-hidden bg-neutral-100', className)}>{children}</div>
);

/**
 * "What We Stand For" — a bento mosaic mixing a looping video, three photos, and
 * the four core-value cards. Mirrors the live `core-values-homepage-v2` section.
 */
export const CoreValues = () => {
  const { heading, subtitle, video, images, values } = HOME_CORE_VALUES;
  return (
    <Container className="py-14 md:py-20">
      <SectionHeader heading={heading} subtitle={subtitle} className="max-w-2xl" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:auto-rows-[260px]">
        <Media className="md:row-span-2">
          <video src={video} autoPlay loop muted playsInline className="size-full object-cover" />
        </Media>
        <ValueCard value={values[0]!} />
        <Media>
          <img
            src={images.socialSharing}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        </Media>
        <ValueCard value={values[1]!} />
        <ValueCard value={values[2]!} />
        <Media>
          <img
            src={images.paulScreaming}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        </Media>
        <ValueCard value={values[3]!} />
        <Media>
          <img src={images.digitalMap} alt="" loading="lazy" className="size-full object-cover" />
        </Media>
      </div>
    </Container>
  );
};
