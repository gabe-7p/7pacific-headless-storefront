import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { SectionHeader } from '~/components/common/SectionHeader';
import { type CoreValue, HOME_CORE_VALUES } from '~/content/home';
import { cn } from '~/lib/cn';

const ValueCard = ({ value, className }: { value: CoreValue; className?: string }) => (
  <div
    className={cn(
      'flex flex-col items-start justify-center p-8 md:p-10 lg:p-12',
      value.tone === 'dark'
        ? 'bg-tenet-dark text-tenet-dark-text'
        : 'bg-tenet-light text-tenet-light-text',
      className
    )}
  >
    {/* Tenet heading: 24px, 28.8px tablet, 32px desktop; tracking comes from
        the Heading brand variant (section-header tier). */}
    <Heading as="h3" size="none" className="text-2xl leading-[1.1] md:text-[1.8rem] xl:text-[2rem]">
      {value.title}
    </Heading>
    <p className="mt-4 max-w-[38ch] text-[0.95rem] leading-[1.2] md:text-base">{value.body}</p>
    <Cta to={value.cta.href} prefetch="intent" size="xs" className="mt-6">
      {value.cta.label}
    </Cta>
  </div>
);

const Media = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('overflow-hidden bg-court', className)}>{children}</div>
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
    <Container className="py-9 md:py-12">
      <SectionHeader heading={heading} subtitle={subtitle} scale="section" />

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
