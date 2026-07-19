import type { SpecCardData } from '~/lib/productContent';

/** The locked field order from the guidelines — never re-sort. */
const SPEC_ROWS = [
  ['Fabric', 'fabric'],
  ['Weight', 'weight'],
  ['Use', 'use'],
  ['Seams', 'seams'],
  ['Pockets', 'pockets'],
  ['Fit', 'fit'],
  ['Origin', 'origin'],
] as const satisfies ReadonlyArray<readonly [string, keyof SpecCardData]>;

/**
 * The Spec Card — the brand's signature PDP device (7PA-231): seven fields in
 * JetBrains Mono, caps labels at the spec-strip tracking. Data comes from the
 * `custom.spec_card` JSON metafield; rows with no value are omitted rather
 * than invented (e.g. WEIGHT waits for real measured grams).
 */
export const SpecCard = ({ data }: { data: SpecCardData }) => {
  const rows = SPEC_ROWS.filter(([, key]) => data[key]);
  if (rows.length === 0) return null;
  return (
    <dl className="border-border-subtle divide-border-subtle divide-y border-y font-mono text-xs">
      {rows.map(([label, key]) => (
        <div key={key} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-x-4 py-2">
          <dt className="tracking-spec text-neutral-500 uppercase">{label}</dt>
          <dd className="leading-relaxed text-neutral-900">{data[key]}</dd>
        </div>
      ))}
    </dl>
  );
};
