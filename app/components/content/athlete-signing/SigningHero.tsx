import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Image } from '~/components/common/Image';
import type { AthleteSigningContent } from '~/content/athlete-signing';
import { cn } from '~/lib/cn';
import { IMAGE_SIZES } from '~/lib/imageSizes';

import { MONO_LABEL } from './monoLabel';

const HeroPanel = ({ hero }: { hero: AthleteSigningContent['hero'] }) => (
  <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/4 md:aspect-auto md:h-full md:min-h-[560px]">
    {hero.image.src && (
      <Image
        src={hero.image.src}
        width={hero.image.width}
        height={hero.image.height}
        alt={hero.image.alt}
        loading="lazy"
        sizes={IMAGE_SIZES.half}
        className={cn(
          'absolute inset-0 size-full',
          hero.image.fit === 'contain' ? 'object-contain' : 'object-cover'
        )}
      />
    )}
    <span className={cn(MONO_LABEL, 'text-support-night absolute top-4 left-4')}>
      {hero.modeLabel}
    </span>
    <span className={cn(MONO_LABEL, 'text-support-night absolute bottom-4 left-4 max-md:hidden')}>
      {hero.locationLine}
    </span>
    {hero.camLine && (
      <span
        className={cn(MONO_LABEL, 'text-support-night absolute right-4 bottom-4 max-md:hidden')}
      >
        {hero.camLine}
      </span>
    )}
    <span className={cn(MONO_LABEL, 'text-support-night absolute right-4 bottom-4 md:hidden')}>
      {hero.locationLine}
    </span>
  </div>
);

export const SigningHero = ({ content }: { content: AthleteSigningContent }) => (
  <Container className="py-10 md:py-16 lg:py-20">
    <div className="grid gap-8 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-12 md:gap-y-10 lg:gap-x-16">
      <div className="md:col-start-1 md:row-start-1">
        <p className={cn(MONO_LABEL, 'text-support-night max-md:hidden')}>
          {content.transmissionLine}
        </p>
        <p className={cn(MONO_LABEL, 'text-support-night md:hidden')}>{content.eyebrowLine}</p>
        <Heading
          as="h1"
          size="none"
          className="mt-5 text-[2.9rem] leading-[1.02] tracking-hero text-ink-night md:mt-8 md:text-6xl lg:text-7xl"
        >
          {content.headline.lead}{' '}
          <span className="text-support-night block">{content.headline.name}</span>
        </Heading>
      </div>

      <div className="md:col-start-2 md:row-span-2 md:row-start-1">
        <HeroPanel hero={content.hero} />
        {(content.hero.shotLine || content.hero.camLine) && (
          <div
            className={cn(
              MONO_LABEL,
              'text-support-night mt-3 flex items-center justify-between md:hidden'
            )}
          >
            {content.hero.shotLine && <span>{content.hero.shotLine}</span>}
            {content.hero.camLine && <span>{content.hero.camLine}</span>}
          </div>
        )}
      </div>

      <div className="md:col-start-1 md:row-start-2 md:self-start">
        <p className="text-ink-night max-w-[44ch] text-lg leading-relaxed md:text-xl">
          {content.body}
        </p>
        <p className={cn(MONO_LABEL, 'text-support-night mt-8 max-md:hidden')}>
          {content.signedLine}
        </p>
      </div>
    </div>
  </Container>
);
