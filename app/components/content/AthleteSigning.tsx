import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Logo } from '~/components/common/Logo';
import type { AthleteSigningContent, ScaleMarkerPercent } from '~/content/athlete-signing';
import { BRAND } from '~/lib/brand';
import { cn } from '~/lib/cn';

/** The page's recurring readout-label treatment (JetBrains Mono spec strip). */
const MONO_LABEL = 'font-mono text-xs tracking-spec uppercase';

/**
 * Static map for the readout-scale marker — `markerPercent` is a 5%-step
 * union so every class exists literally for Tailwind to generate.
 */
const MARKER_LEFT: Record<ScaleMarkerPercent, string> = {
  0: 'left-[0%]',
  5: 'left-[5%]',
  10: 'left-[10%]',
  15: 'left-[15%]',
  20: 'left-[20%]',
  25: 'left-[25%]',
  30: 'left-[30%]',
  35: 'left-[35%]',
  40: 'left-[40%]',
  45: 'left-[45%]',
  50: 'left-[50%]',
  55: 'left-[55%]',
  60: 'left-[60%]',
  65: 'left-[65%]',
  70: 'left-[70%]',
  75: 'left-[75%]',
  80: 'left-[80%]',
  85: 'left-[85%]',
  90: 'left-[90%]',
  95: 'left-[95%]',
  100: 'left-[100%]',
};

const SigningTopBar = ({ chrome }: { chrome: AthleteSigningContent['chrome'] }) => (
  <header className="border-b border-border-subtle-night">
    <Container className="flex h-(--header-h) items-center justify-between gap-4">
      <Link prefetch="intent" to="/" aria-label={BRAND.name}>
        <Logo tone="light" className="h-5 md:h-6" />
      </Link>
      <span className={cn(MONO_LABEL, 'text-support-night max-md:hidden')}>{chrome.badge}</span>
      <span className={cn(MONO_LABEL, 'flex items-center gap-2 text-ink-night')}>
        <span
          aria-hidden
          className="bg-brand size-1.5 animate-pulse rounded-full motion-reduce:animate-none"
        />
        {chrome.privacy} · {chrome.edition}
      </span>
    </Container>
    <Container className="border-t border-border-subtle-night py-3 md:hidden">
      <span className={cn(MONO_LABEL, 'text-support-night flex items-center gap-2.5')}>
        <span aria-hidden className="border-border-subtle/60 size-2.5 border" />
        {chrome.urlLine}
      </span>
    </Container>
  </header>
);

const HeroPanel = ({ hero }: { hero: AthleteSigningContent['hero'] }) => (
  <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/[0.04] md:aspect-auto md:h-full md:min-h-[560px]">
    {hero.image.src && (
      <img
        src={hero.image.src}
        alt={hero.image.alt}
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
    )}
    <span className={cn(MONO_LABEL, 'text-support-night absolute top-4 left-4')}>
      {hero.modeLabel}
    </span>
    <span className={cn(MONO_LABEL, 'text-support-night absolute bottom-4 left-4 max-md:hidden')}>
      {hero.locationLine}
    </span>
    <span className={cn(MONO_LABEL, 'text-support-night absolute right-4 bottom-4 max-md:hidden')}>
      {hero.camLine}
    </span>
    <span className={cn(MONO_LABEL, 'text-support-night absolute right-4 bottom-4 md:hidden')}>
      {hero.locationLine}
    </span>
  </div>
);

const SigningHero = ({ content }: { content: AthleteSigningContent }) => (
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
        <div
          className={cn(
            MONO_LABEL,
            'text-support-night mt-3 flex items-center justify-between md:hidden'
          )}
        >
          <span>{content.hero.shotLine}</span>
          <span>{content.hero.camLine}</span>
        </div>
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

const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-3">
    <span className="font-display text-support-night text-2xl font-medium">{number}</span>
    <span className={cn(MONO_LABEL, 'text-ink-night')}>{title}</span>
    <span aria-hidden className="ml-2 h-px w-16 bg-border-subtle-night md:w-24" />
  </div>
);

/** mm:ss for the video time readout. */
const formatTime = (seconds: number) => {
  const whole = Math.floor(seconds);
  const mm = String(Math.floor(whole / 60)).padStart(2, '0');
  const ss = String(whole % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const FounderVideo = ({ video }: { video: AthleteSigningContent['founderVideo'] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const hasVideo = video.src !== '';

  // The SSR'd <video> starts loading before React hydrates, so loadedmetadata
  // can fire before the onLoadedMetadata handler is attached — read it back.
  useEffect(() => {
    const el = videoRef.current;
    if (el && el.readyState >= 1 && Number.isFinite(el.duration)) {
      setDuration(el.duration);
    }
  }, []);

  const togglePlayback = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };

  const seekTo = (seconds: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const glyph = (
    <span
      className={cn(
        'bg-brand grid size-16 place-items-center rounded-full transition-all duration-300 ease-(--ease-brand)',
        isPlaying && 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
      )}
    >
      {isPlaying ? (
        // Stop glyph — filled square, mirrors the mockup's marker.
        <span aria-hidden className="size-4 bg-ink-night" />
      ) : (
        // Play glyph — border-drawn triangle, nudged right to sit optically centered.
        <span
          aria-hidden
          className="ml-1 border-y-[9px] border-l-[14px] border-y-transparent border-l-ink-night"
        />
      )}
    </span>
  );

  return (
    <section>
      <SectionLabel number={video.number} title={video.title} />
      <div className="relative mt-6 aspect-video overflow-hidden bg-white/[0.04]">
        {hasVideo && (
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster || undefined}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            className="absolute inset-0 size-full object-cover"
          >
            <track kind="captions" srcLang="en" label="English" src={video.captions || undefined} />
          </video>
        )}
        {hasVideo ? (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Stop video' : `Play video — ${video.title}`}
            className="group absolute inset-0 grid cursor-pointer place-items-center hover:[&>span]:scale-105"
          >
            {glyph}
          </button>
        ) : (
          // No asset uploaded yet — the play control is decorative.
          <span aria-hidden className="absolute inset-0 grid place-items-center">
            {glyph}
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4">
          {hasVideo && (
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(event) => seekTo(Number(event.target.value))}
              aria-label="Video progress"
              // Thumb is the same thin vertical marker as the readout scale.
              // m-0/border-0/p-0/rounded-none undo the base-layer `input` styles.
              className="pointer-events-auto m-0 h-3 w-full cursor-pointer appearance-none rounded-none border-0 bg-transparent p-0 bg-[image:linear-gradient(rgb(255_255_255/0.25),rgb(255_255_255/0.25))] bg-[position:0_center] bg-[size:100%_1px] bg-no-repeat [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-0.5 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-0.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white"
            />
          )}
          <div className="flex items-center justify-between">
            <span className={cn(MONO_LABEL, 'text-support-night')}>{video.attribution}</span>
            <span className={cn(MONO_LABEL, 'text-ink-night')}>
              {hasVideo && duration > 0
                ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                : video.duration}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const CornerBrackets = () => (
  <span aria-hidden>
    <span className="border-border-subtle/50 absolute top-0 left-0 size-3 border-t border-l" />
    <span className="border-border-subtle/50 absolute top-0 right-0 size-3 border-t border-r" />
    <span className="border-border-subtle/50 absolute bottom-0 left-0 size-3 border-b border-l" />
    <span className="border-border-subtle/50 absolute right-0 bottom-0 size-3 border-r border-b" />
  </span>
);

const PerformanceReadout = ({ readout }: { readout: AthleteSigningContent['readout'] }) => (
  <section>
    <SectionLabel number={readout.number} title={readout.title} />
    <div className="relative mt-6 p-6 md:p-8">
      <CornerBrackets />

      <div className="flex items-baseline justify-between">
        <span className={cn(MONO_LABEL, 'text-support-night')}>{readout.stat.label}</span>
        {readout.stat.verified && (
          <span className={cn(MONO_LABEL, 'text-ink-night')}>Verified</span>
        )}
      </div>
      <p className="text-brand mt-4 font-mono text-6xl tracking-tight md:text-7xl">
        {readout.stat.value}
      </p>

      <div className="relative mt-10 pb-7">
        <div className="flex h-2.5 items-end justify-between border-b border-white/25">
          {Array.from({ length: 11 }, (_, index) => (
            <span key={index} className="h-1.5 w-px bg-white/25" />
          ))}
        </div>
        <span
          className={cn(
            'absolute top-0 h-4 w-0.5 -translate-x-1/2 bg-ink-night',
            MARKER_LEFT[readout.scale.markerPercent]
          )}
        />
        <span
          className={cn(
            MONO_LABEL,
            'text-support-night absolute top-5 -translate-x-1/2 text-[0.6rem] whitespace-nowrap',
            MARKER_LEFT[readout.scale.markerPercent]
          )}
        >
          {readout.scale.markerLabel}
        </span>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-x-4 gap-y-6 md:grid-cols-2">
        {readout.fields.map((field) => (
          <div key={field.label}>
            <dt className={cn(MONO_LABEL, 'text-support-night text-[0.65rem]')}>{field.label}</dt>
            <dd className="mt-1.5 font-mono text-sm tracking-caps text-ink-night uppercase">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

const SigningBottomBar = ({ chrome }: { chrome: AthleteSigningContent['chrome'] }) => (
  <footer className="border-t border-border-subtle-night">
    <Container className="flex flex-col items-center gap-2.5 py-8 text-center md:flex-row md:justify-between md:gap-4 md:py-6 md:text-left">
      <Logo tone="light" className="h-5" />
      <span className={cn(MONO_LABEL, 'text-support-night')}>{chrome.designedLine}</span>
      <span className={cn(MONO_LABEL, 'text-support-night')}>{chrome.existsLine}</span>
    </Container>
  </footer>
);

/**
 * One-off athlete-signing page (mockup: sealed dark page, no store chrome).
 * Purely presentational — all copy/assets come from an `AthleteSigningContent`
 * object, so a second signing is a new content object, not new components.
 * The route opts out of PageLayout (`handle: { chrome: false }`), so this
 * renders its own top/bottom bars and `main` landmark.
 */
export const AthleteSigning = ({ content }: { content: AthleteSigningContent }) => (
  <div className="bg-field-night text-ink-night flex min-h-svh flex-col bg-[image:repeating-linear-gradient(to_right,rgb(255_255_255/0.025)_0px,rgb(255_255_255/0.025)_1px,transparent_1px,transparent_72px),repeating-linear-gradient(to_bottom,rgb(255_255_255/0.025)_0px,rgb(255_255_255/0.025)_1px,transparent_1px,transparent_72px)]">
    <SigningTopBar chrome={content.chrome} />
    <main className="flex-1">
      <SigningHero content={content} />
      <Container>
        <div className="border-t border-border-subtle-night" />
      </Container>
      <Container className="py-10 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          <FounderVideo video={content.founderVideo} />
          <PerformanceReadout readout={content.readout} />
        </div>
      </Container>
    </main>
    <SigningBottomBar chrome={content.chrome} />
  </div>
);
