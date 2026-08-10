import { Image } from '@shopify/hydrogen';

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

const Media = ({ media }: { media: CoreValue['media'] }) =>
  media.kind === 'video' ? (
    <video src={media.src} autoPlay loop muted playsInline className="size-full object-cover" />
  ) : (
    <Image
      src={media.url}
      width={media.width}
      height={media.height}
      alt=""
      loading="lazy"
      sizes="(min-width: 1024px) 66vw, 100vw"
      className="size-full object-cover"
    />
  );

/**
 * "What We Stand For" — four alternating rows pairing each tenet card with its
 * media (wide media ~2/3, narrow card ~1/3, sides alternating per row; single
 * column below lg). Mirrors the live `core-values-homepage-v2` section.
 */
export const CoreValues = () => {
  const { heading, subtitle, values } = HOME_CORE_VALUES;

  return (
    <Container className="py-9 md:py-12">
      <SectionHeader heading={heading} subtitle={subtitle} scale="section" />

      <div className="flex flex-col gap-3">
        {/* Sides alternate starting media-left. */}
        {values.map((value, index) => (
          <div key={value.title} className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="h-64 overflow-hidden bg-field md:h-80 lg:col-span-2 lg:h-[420px]">
              <Media media={value.media} />
            </div>
            <ValueCard value={value} className={index % 2 === 0 ? undefined : 'lg:order-first'} />
          </div>
        ))}
      </div>
    </Container>
  );
};
