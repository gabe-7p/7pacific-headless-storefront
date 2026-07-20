import effortIcon from '~/assets/effort-percents.svg';
import gripTapeIcon from '~/assets/grip-tape-icon.svg';
import perforationsIcon from '~/assets/perforations-icon.svg';
import { CareIcon } from '~/components/product/CareIcon';
import { PdpSection } from '~/components/product/PdpSection';
import type { TechFeature, TechIcon, TechStack as TechStackData } from '~/lib/productContent';

const ICONS: Record<TechIcon, string> = {
  perforations: perforationsIcon,
  'grip-tape': gripTapeIcon,
  effort: effortIcon,
};

// Live's three tiers (its media queries use max-width, so the boundary px
// belong to the *smaller* tier — iPad portrait at 768 stacks — hence the exact
// min-[769px]/min-[1025px] variants rather than Tailwind's md/lg at 768/1024):
//   ≤768   stacked single column, centered
//   769-1024  grid 1fr / 2fr / 1fr, left-aligned, gap 30
//   ≥1025  grid 1fr / 1.3fr / 1fr, gap 20
const ROW_GRID =
  'grid grid-cols-1 gap-5 py-5 text-center min-[769px]:grid-cols-[1fr_2fr_1fr] min-[769px]:gap-[30px] min-[769px]:py-[25px] min-[769px]:text-left min-[1025px]:grid-cols-[1fr_1.3fr_1fr] min-[1025px]:gap-5 min-[1025px]:py-[30px]';

const ROW_TITLE = 'text-base font-medium tracking-[1px] uppercase min-[1025px]:text-[1.1rem]';

// A column centers its content when the row is stacked (≤768), left-aligns once
// the row becomes a grid.
const COL = 'flex justify-center min-[769px]:justify-start';

const Feature = ({ feature }: { feature: TechFeature }) => (
  <div className={`${ROW_GRID} items-center`}>
    <div className={COL}>
      <h3 className={ROW_TITLE}>{feature.heading}</h3>
    </div>
    <div className={COL}>
      <p className="max-w-[400px] text-base leading-normal">{feature.description}</p>
    </div>
    {/* Icon fills its column (live's `width: 100%`), centered, with 20px gutters. */}
    <div className="mx-5 flex justify-center">
      <img src={ICONS[feature.icon]} alt="" className="w-full max-w-none" />
    </div>
  </div>
);

const Column = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-2.5 min-[769px]:items-start">
    <h4 className={ROW_TITLE}>{label}</h4>
    {children}
  </div>
);

/**
 * "TECH STACK" — dark section matching the live layout at every breakpoint:
 * feature rows as title | description | column-filling icon, then a
 * MATERIALS / DETAILS / CARE row on the same grid. Below 769px every row
 * collapses to a single centered column (like live); CARE is a two-column
 * icon list that stacks to one column on mobile. Content from the tech_stack
 * metafield.
 */
export const TechStack = ({ data }: { data: TechStackData }) => {
  // Live splits the care list into two columns, first column taking the ceil.
  const careSplit = Math.ceil(data.care.length / 2);
  const careColumns = [data.care.slice(0, careSplit), data.care.slice(careSplit)].filter(
    (column) => column.length > 0
  );

  return (
    <PdpSection>
      <h2 className="mb-5 text-2xl font-medium">TECH STACK</h2>
      <div className="divide-border-subtle border-border-subtle divide-y border-t">
        {data.features.map((feature) => (
          <Feature key={feature.heading} feature={feature} />
        ))}
        <div className={`${ROW_GRID} items-start`}>
          <Column label="Materials">
            {data.materials.map((line) => (
              <p key={line} className="text-[0.8rem] leading-normal">
                {line}
              </p>
            ))}
          </Column>
          <Column label="Details">
            <p className="text-[0.8rem] leading-normal">{data.details}</p>
          </Column>
          <Column label="Care">
            <div className="flex flex-col gap-2 min-[769px]:flex-row min-[769px]:gap-[30px]">
              {careColumns.map((column) => (
                <div key={column[0]} className="flex flex-col gap-2">
                  {column.map((line) => (
                    <div key={line} className="flex items-center gap-2">
                      <CareIcon label={line} />
                      <span className="text-[0.8rem]">{line}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Column>
        </div>
      </div>
    </PdpSection>
  );
};
