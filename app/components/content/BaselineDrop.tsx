import { Cta } from '~/components/common/Cta';
import { MediaSlot } from '~/components/common/MediaSlot';
import { DropMasthead } from '~/components/content/DropMasthead';
import {
  DropCloser,
  DropPieces,
  DropReceipts,
  DropStandard,
} from '~/components/content/DropSections';
import { BASELINE_DROP } from '~/content/baseline-drop';
import { IMAGE_SIZES } from '~/lib/imageSizes';

/**
 * Ember repeats here by sanctioned exception (ui-components.md). The sections
 * after the film are shared with /drops/first-light (DropSections).
 */

/** The full-bleed 16:9 drop film; the scrim keeps the white full-video label legible.
    Eager: it sits in the first viewport at every width, so it starts before hydration. */
const Film = () => (
  <section className="relative">
    <MediaSlot media={BASELINE_DROP.film} ratio="video" sizes={IMAGE_SIZES.full} loading="eager" />
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-field-night/60 to-transparent"
    />
    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-10">
      {/* White campaign Archivo, per Gabe (2026-08-25). */}
      <p className="font-archivo text-2xs font-medium tracking-caps text-ink-night uppercase md:text-sm">
        {BASELINE_DROP.filmOverlay.label}
      </p>
      <Cta
        href={BASELINE_DROP.filmOverlay.cta.href}
        target="_blank"
        size="xs"
        className="mt-2 border-ink-night/60 text-ink-night md:mt-2.5"
      >
        {BASELINE_DROP.filmOverlay.cta.label}
      </Cta>
    </div>
  </section>
);

/**
 * The ED. 01 "BASELINE" drop page (/drops/baseline): intro → drop film →
 * receipts → built for how athletes train → the pieces → closer.
 */
export const BaselineDrop = () => (
  <div>
    <DropMasthead drop={BASELINE_DROP} />
    <Film />
    <DropReceipts content={BASELINE_DROP.receipts} />
    <DropStandard content={BASELINE_DROP.standard} />
    <DropPieces content={BASELINE_DROP.pieces} />
    <DropCloser content={BASELINE_DROP.closer} />
  </div>
);
