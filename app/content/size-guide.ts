/**
 * The PDP size guide — the measurement table and "how to measure" explainer
 * behind the SIZE GUIDE link on the buy card's SIZE row (rendered by
 * `components/product/SizeGuide`).
 *
 * Sizing is identical across the apparel range, so it lives here as a typed
 * constant rather than a per-product metafield. The numbers are body
 * measurements (measure yourself), not garment measurements — Gabe supplied
 * both unit tables, 2026-09-18; they are locked, edit them here only.
 */

import { BRAND } from '~/lib/brand';

type SizeRow = {
  /** Short size label, matching the PDP selector's cells (S/M/L/XL). */
  size: string;
  /** Chest range, already formatted with the spaced en-dash-style separator. */
  chest: string;
  waist: string;
  hip: string;
};

type MeasurePoint = {
  /** Body point, rendered as a caps label (ALL CAPS via CSS). */
  label: string;
  body: string;
};

export const SIZE_GUIDE = {
  /** Drawer heading. Deliberately ungendered — the range is one line. */
  title: 'Size Guide',
  /** Table column heads, in render order; the first is the row label column. */
  columns: ['Size', 'Chest', 'Waist', 'Hip'],
  units: {
    in: {
      label: 'In',
      rows: [
        { size: 'S', chest: '34 - 36', waist: '29 - 31', hip: '33.5 - 35.5' },
        { size: 'M', chest: '36.5 - 38.5', waist: '31.5 - 33.5', hip: '36.5 - 38.5' },
        { size: 'L', chest: '39 - 41', waist: '34 - 36', hip: '39.5 - 41.5' },
        { size: 'XL', chest: '41.5 - 43.5', waist: '36.5 - 38.5', hip: '42.5 - 44.5' },
      ] satisfies ReadonlyArray<SizeRow>,
    },
    cm: {
      label: 'Cm',
      rows: [
        { size: 'S', chest: '86 - 91', waist: '74 - 79', hip: '85 - 90' },
        { size: 'M', chest: '93 - 98', waist: '80 - 85', hip: '93 - 98' },
        { size: 'L', chest: '99 - 104', waist: '86 - 91', hip: '100 - 105' },
        { size: 'XL', chest: '105 - 110', waist: '93 - 98', hip: '108 - 113' },
      ] satisfies ReadonlyArray<SizeRow>,
    },
  },
  howToMeasure: {
    heading: 'How to measure',
    body: 'Use a tape measure and these guidelines to determine your size. A friend might come in handy to help you with measuring. If you don’t have a tape measure, you can use a piece of string or ribbon and then measure it with a ruler. Please note: garments may vary due to design and manufacturing differences.',
    /** Intrinsic dimensions of the Files asset — set so the box reserves space. */
    image: {
      url: `${BRAND.filesCdn}/white_shirt_side_walking.jpg`,
      width: 1325,
      height: 1656,
      alt: 'Side view of a runner walking in the white tee',
    },
    points: [
      {
        label: 'Chest',
        body: 'Measure around the fullest part of your chest, making sure the tape measure is parallel to the ground.',
      },
      {
        label: 'Waist',
        body: 'Measure around the narrowest part of your waist, where your body bends side to side.',
      },
      {
        label: 'Hip',
        body: 'Measure around the fullest part of your hips. Make sure the tape measure is parallel to the ground and fits comfortably, not too tight or too loose.',
      },
    ] satisfies ReadonlyArray<MeasurePoint>,
  },
} as const;
