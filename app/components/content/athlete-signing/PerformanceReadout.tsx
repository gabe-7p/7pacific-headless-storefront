import { CornerBrackets, SectionLabel } from '~/components/common/Readout';
import { SPEC_LINE_CLASS } from '~/components/common/SpecLine';
import type { AthleteSigningContent, ScaleMarkerPercent } from '~/content/athlete-signing';
import { cn } from '~/lib/cn';

/**
 * Static map for the readout-scale marker — see `ScaleMarkerPercent`.
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

export const PerformanceReadout = ({ readout }: { readout: AthleteSigningContent['readout'] }) => (
  <section>
    <SectionLabel number={readout.number} title={readout.title} />
    <div className="relative mt-6 p-6 md:p-8">
      <CornerBrackets />

      <div className="flex items-baseline justify-between">
        <span className={cn(SPEC_LINE_CLASS, 'text-support-night')}>{readout.stat.label}</span>
        {readout.stat.verified && (
          <span className={cn(SPEC_LINE_CLASS, 'text-ink-night')}>Verified</span>
        )}
      </div>
      <p className="text-brand mt-4 font-mono text-6xl tracking-tight md:text-7xl">
        {readout.stat.value}
      </p>

      <div className="relative mt-10 pb-7">
        <div className="flex h-2.5 items-end justify-between border-b border-ink-night/25">
          {Array.from({ length: 11 }, (_, index) => (
            <span key={index} className="h-1.5 w-px bg-ink-night/25" />
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
            SPEC_LINE_CLASS,
            'text-support-night absolute top-5 -translate-x-1/2 text-[0.6rem] whitespace-nowrap',
            MARKER_LEFT[readout.scale.markerPercent]
          )}
        >
          {readout.scale.markerLabel}
        </span>
      </div>

      <dl className="mt-8 mb-2 grid grid-cols-3 gap-x-4 gap-y-6 md:grid-cols-2">
        {readout.fields.map((field) => (
          <div key={field.label}>
            <dt className={cn(SPEC_LINE_CLASS, 'text-support-night text-[0.65rem]')}>
              {field.label}
            </dt>
            <dd className="mt-1.5 font-mono text-sm tracking-caps text-ink-night uppercase">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
