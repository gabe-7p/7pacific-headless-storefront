import { useState } from 'react';

import { Eyebrow } from '~/components/common/Eyebrow';
import { Heading } from '~/components/common/Heading';
import { SPEC_LINE_CLASS } from '~/components/common/SpecLine';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { SIZE_GUIDE } from '~/content/size-guide';
import { cn } from '~/lib/cn';

/** Imperial first — the storefront is US-only for v1. */
const UNITS = ['in', 'cm'] as const;
type Unit = (typeof UNITS)[number];

/**
 * The underlined caps link device shared by the trigger and the drawer's CLOSE
 * — the same type tier as the SIZE label the trigger sits beside. Tailwind v4's
 * preflight no longer gives a `<button>` a pointer cursor, so it's declared here.
 */
const LINK_CLASS =
  'cursor-pointer text-support underline underline-offset-4 transition-colors hover:text-ink';

/** Live's segmented cell, borrowed from the size selector one scroll above. */
const UNIT_CELL =
  'cursor-pointer border px-6 py-2 text-[9.6px] font-semibold tracking-[0.3em] uppercase transition-colors';

/**
 * Mono measurement cell — numbers read as spec data, not prose. It steps down
 * on mobile: at 13px the widest range (36.5 - 38.5) fills a full-bleed column
 * edge to edge, so neighbouring cells visually run together.
 */
const DATA_CELL = 'py-3 text-center font-mono text-[11px] text-ink sm:text-[13px]';

/**
 * The PDP size guide: an underlined SIZE GUIDE link on the SIZE label's row
 * (rendered by `ProductForm`) that opens a right-side drawer holding the
 * measurement table (imperial/metric) and the how-to-measure explainer.
 *
 * It composes the `Sheet` primitive directly rather than going through
 * `layout/Aside` — Aside's recipe is fixed (350/450px, opaque field, left-aligned
 * h-16 header with the floating close icon), and this panel needs its own width,
 * a translucent ground, and a centred title with a text CLOSE. Open state stays
 * local: the trigger lives inside the buy card, so the cart drawer (behind this
 * one's scrim and focus trap) can't be opened alongside it.
 */
export const SizeGuide = () => {
  const [unit, setUnit] = useState<Unit>('in');
  const { columns, howToMeasure, title, units } = SIZE_GUIDE;
  const { image } = howToMeasure;

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer">
        <Eyebrow as="span" className={LINK_CLASS}>
          {title}
        </Eyebrow>
      </SheetTrigger>
      {/* The one translucent surface in the storefront: the product reads
          through the panel at 80% with only a whisper of blur, so the guide
          stays an overlay on the shot rather than a wall over it. */}
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 border-l-border-subtle bg-field/80 p-0 text-ink backdrop-blur-xs sm:w-[560px] sm:max-w-none"
        aria-describedby={undefined}
      >
        <SheetHeader className="relative shrink-0 items-center border-b border-border-subtle p-0 px-5 py-4">
          <SheetTitle asChild>
            <Heading as="h2" size="none" variant="caps" className="text-sm tracking-caps">
              {title}
            </Heading>
          </SheetTitle>
          <SheetClose className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer">
            <Eyebrow as="span" className={LINK_CLASS}>
              Close
            </Eyebrow>
          </SheetClose>
        </SheetHeader>
        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-5 py-6">
          <div className="flex justify-center">
            {UNITS.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={unit === key}
                onClick={() => setUnit(key)}
                className={cn(
                  UNIT_CELL,
                  '-ml-px first:ml-0',
                  unit === key
                    ? 'z-10 border-ink bg-field-night text-ink-night'
                    : 'border-border-subtle text-ink hover:border-ink'
                )}
              >
                {units[key].label}
              </button>
            ))}
          </div>
          {/* Fixed layout so the three measurement columns stay equal instead of
              sizing to their widest value — auto layout makes the grid ragged
              as the numbers change between units. The outline is Carbon so the
              grid holds its edge against the product showing through; the
              interior hairlines stay subtle so it reads as one device. */}
          <table className="w-full table-fixed border border-ink">
            <caption className="sr-only">
              Body measurements in {unit === 'in' ? 'inches' : 'centimetres'}
            </caption>
            <thead>
              <tr className="border-b border-border-subtle">
                {columns.map((column, index) => (
                  <th
                    key={column}
                    scope="col"
                    className={cn(
                      SPEC_LINE_CLASS,
                      'py-3 font-normal text-support',
                      // The label column carries only S/M/L/XL — give the width
                      // to the measurements, which hold ranges like 36.5 - 38.5.
                      index === 0 && 'w-[19%]'
                    )}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {units[unit].rows.map((row) => (
                <tr key={row.size}>
                  <th scope="row" className={cn(SPEC_LINE_CLASS, 'py-3 font-normal text-ink')}>
                    {row.size}
                  </th>
                  <td className={DATA_CELL}>{row.chest}</td>
                  <td className={DATA_CELL}>{row.waist}</td>
                  <td className={DATA_CELL}>{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Heading as="h3" size="none" variant="caps" className="text-sm tracking-caps">
              {howToMeasure.heading}
            </Heading>
            <p className="mt-3 text-sm leading-relaxed text-support">{howToMeasure.body}</p>
          </div>
          <img
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            className="w-full"
          />
          <dl className="space-y-4">
            {howToMeasure.points.map((point) => (
              <div key={point.label}>
                <Eyebrow as="dt" className="text-ink">
                  {point.label}
                </Eyebrow>
                <dd className="mt-1 text-sm leading-relaxed text-support">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </SheetContent>
    </Sheet>
  );
};
