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
      // Padding eases at md, where the card is a ~230px column beside the media.
      'flex flex-col items-start justify-center p-8 md:p-6 lg:p-12',
      value.tone === 'dark'
        ? 'bg-tenet-dark text-tenet-dark-text'
        : 'bg-tenet-light text-tenet-light-text',
      className
    )}
  >
    {/* Tenet heading: 18px, 20px tablet, 24px desktop (two steps under the
        live 24/28.8/32 — Gabe, 2026-10-28); tracking comes from the Heading
        brand variant (section-header tier). */}
    <Heading
      as="h3"
      size="none"
      className="text-lg leading-[1.1] md:text-xl md:leading-[1.1] xl:text-2xl xl:leading-[1.1]"
    >
      {value.title}
    </Heading>
    {/* Body: 13px, 14px from md (two steps under the live 15.2/16). */}
    <p className="mt-4 max-w-[38ch] text-[0.8125rem] leading-[1.25] md:text-sm md:leading-[1.25]">
      {value.body}
    </p>
    {value.cta && (
      <Cta to={value.cta.href} prefetch="intent" size="xs" className="mt-6">
        {value.cta.label}
      </Cta>
    )}
  </div>
);

const Media = ({ media }: { media: CoreValue['media'] }) =>
  media.kind === 'video' ? (
    <video
      src={media.src}
      aria-label={media.label}
      autoPlay
      loop
      muted
      playsInline
      className="size-full object-cover"
    />
  ) : (
    <Image
      src={media.url}
      width={media.width}
      height={media.height}
      alt={media.alt}
      loading="lazy"
      sizes="(min-width: 1024px) 66vw, 100vw"
      className="size-full object-cover"
    />
  );

/**
 * "How We Train" — four alternating rows pairing each rule card with its
 * media (wide media ~2/3, narrow card ~1/3, sides alternating per row; single
 * column below md — it was lg, but that stacked the cards on tablets, which
 * read as separate boxes too early; Gabe, 2026-10-28). Layout mirrors the live `core-values-homepage-v2` section;
 * the copy is homepage v2 (content/home.ts).
 */
export const CoreValues = () => {
  const { heading, subtitle, values } = HOME_CORE_VALUES;

  return (
    <Container className="py-9 md:py-12">
      <SectionHeader heading={heading} subtitle={subtitle} scale="section" />

      <div className="flex flex-col gap-3">
        {/* Sides alternate starting media-left. */}
        {values.map((value, index) => (
          <div key={value.title} className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="h-64 overflow-hidden bg-field md:col-span-2 md:h-80 lg:h-[420px]">
              <Media media={value.media} />
            </div>
            <ValueCard value={value} className={index % 2 === 0 ? undefined : 'md:order-first'} />
          </div>
        ))}
      </div>
    </Container>
  );
};
