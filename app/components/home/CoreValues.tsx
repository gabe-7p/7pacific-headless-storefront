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
 * "What We Stand For" — four alternating rows pairing each tenet card with its
 * media (wide media ~2/3, narrow card ~1/3, sides alternating per row; single
 * column below lg). Mirrors the live `core-values-homepage-v2` section.
 */
export const CoreValues = () => {
  const { heading, subtitle, video, images, values } = HOME_CORE_VALUES;

  // Pair each tenet with its media; sides alternate starting media-left.
  const rows = [
    {
      value: values[0]!,
      media: (
        <video src={video} autoPlay loop muted playsInline className="size-full object-cover" />
      ),
    },
    {
      value: values[1]!,
      media: (
        <img src={images.socialSharing} alt="" loading="lazy" className="size-full object-cover" />
      ),
    },
    {
      value: values[2]!,
      media: (
        <img src={images.paulScreaming} alt="" loading="lazy" className="size-full object-cover" />
      ),
    },
    {
      value: values[3]!,
      media: (
        <img src={images.digitalMap} alt="" loading="lazy" className="size-full object-cover" />
      ),
    },
  ];

  return (
    <Container className="py-14 md:py-20">
      <SectionHeader heading={heading} subtitle={subtitle} className="max-w-2xl" />

      <div className="flex flex-col gap-3">
        {rows.map(({ value, media }, index) => {
          const mediaLeft = index % 2 === 0;
          return (
            <div key={value.title} className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <Media className="h-64 md:h-80 lg:col-span-2 lg:h-[420px]">{media}</Media>
              <ValueCard value={value} className={mediaLeft ? undefined : 'lg:order-first'} />
            </div>
          );
        })}
      </div>
    </Container>
  );
};
