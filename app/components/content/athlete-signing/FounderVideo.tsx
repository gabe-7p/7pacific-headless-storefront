import { useEffect, useRef, useState } from 'react';

import { SectionLabel } from '~/components/common/Readout';
import { SPEC_LINE_CLASS } from '~/components/common/SpecLine';
import type { AthleteSigningContent } from '~/content/athlete-signing';
import { cn } from '~/lib/cn';

/** mm:ss for the video time readout. */
const formatTime = (seconds: number) => {
  const whole = Math.floor(seconds);
  const mm = String(Math.floor(whole / 60)).padStart(2, '0');
  const ss = String(whole % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

export const FounderVideo = ({ video }: { video: AthleteSigningContent['founderVideo'] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // The panel is portrait-native (phone-recorded founder messages). Portrait
  // sources fill it; a landscape source letterboxes instead of cropping.
  const [isPortraitSource, setIsPortraitSource] = useState(true);
  const hasVideo = video.src !== '';

  const readMetadata = (el: HTMLVideoElement) => {
    if (Number.isFinite(el.duration)) setDuration(el.duration);
    setIsPortraitSource(el.videoHeight >= el.videoWidth);
  };

  // The SSR'd <video> starts loading before React hydrates, so loadedmetadata
  // can fire before the onLoadedMetadata handler is attached — read it back.
  useEffect(() => {
    const el = videoRef.current;
    if (el && el.readyState >= 1) {
      readMetadata(el);
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
      <div className="relative mt-6 aspect-9/16 overflow-hidden bg-ink-night/4">
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
            onLoadedMetadata={(event) => readMetadata(event.currentTarget)}
            className={cn(
              'absolute inset-0 size-full',
              isPortraitSource ? 'object-cover' : 'object-contain'
            )}
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
        {/* Legibility scrim behind the controls — video runs under them. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-linear-to-t from-scrim/60 to-transparent p-4 pt-10">
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
              className="pointer-events-auto h-3 w-full cursor-pointer appearance-none bg-transparent bg-[image:linear-gradient(color-mix(in_srgb,var(--color-ink-night)_25%,transparent),color-mix(in_srgb,var(--color-ink-night)_25%,transparent))] bg-[position:0_center] bg-[size:100%_1px] bg-no-repeat [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-0.5 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-ink-night [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-0.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-ink-night"
            />
          )}
          <div className="flex items-center justify-between">
            <span className={cn(SPEC_LINE_CLASS, 'text-support-night')}>{video.attribution}</span>
            <span className={cn(SPEC_LINE_CLASS, 'text-ink-night')}>
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
