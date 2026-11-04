import { ArrowUpRight } from 'lucide-react';

import { InstagramIcon } from '~/components/common/icons';
import { SectionLabel } from '~/components/common/Readout';
import { SPEC_LINE_CLASS } from '~/components/common/SpecLine';
import type { AthleteSigningContent } from '~/content/athlete-signing';
import { cn } from '~/lib/cn';
import { instagramProfileUrl } from '~/lib/urls';

/**
 * "The Creator" module — typed copy only: handle, tagline, and the athlete's
 * recurring series. No embeds, no CDN assets, no live API data (deliberate:
 * IG profile iframes are login-walled/fragile and off-brand).
 */
export const CreatorPanel = ({ instagram }: { instagram: AthleteSigningContent['instagram'] }) => (
  <section>
    <SectionLabel number={instagram.number} title={instagram.title} />
    <div className="border-border-subtle-night mt-6 border p-6 md:p-8">
      <div className="flex items-center gap-3">
        <InstagramIcon className="text-support-night size-5" />
        <span className="text-ink-night font-mono text-xl tracking-tight md:text-2xl">
          @{instagram.handle}
        </span>
      </div>
      <p className="text-support-night mt-3 max-w-[40ch] text-base leading-relaxed">
        {instagram.tagline}
      </p>

      <dl className="mt-6 flex flex-col">
        {instagram.series.map((name, index) => (
          <div
            key={name}
            className="border-border-subtle-night flex items-baseline justify-between gap-4 border-t py-3"
          >
            <dt className={cn(SPEC_LINE_CLASS, 'text-support-night shrink-0 text-[0.65rem]')}>
              Series {String(index + 1).padStart(2, '0')}
            </dt>
            <dd className="text-ink-night text-right font-mono text-sm tracking-caps uppercase">
              {name}
            </dd>
          </div>
        ))}
      </dl>

      <a
        href={instagramProfileUrl(instagram.handle)}
        target="_blank"
        rel="noreferrer"
        className={cn(
          SPEC_LINE_CLASS,
          'text-ink-night mt-6 inline-flex items-center gap-1.5 transition-opacity duration-300 ease-(--ease-brand) hover:opacity-70'
        )}
      >
        {instagram.linkLabel}
        <ArrowUpRight aria-hidden className="size-3.5" />
      </a>
    </div>
  </section>
);
