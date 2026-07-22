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
    // Compact by design: seven rows sit inside the 500px buy card, so the
    // device stays a reference strip rather than dominating the card.
    <dl className="border-border-subtle divide-border-subtle divide-y border-y font-mono text-[10px]">
      {rows.map(([label, key]) => (
        <div key={key} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-3 py-1">
          <dt className="tracking-spec text-graphite uppercase">{label}</dt>
          <dd className="leading-snug text-carbon">{data[key]}</dd>
        </div>
      ))}
    </dl>
  );
};
