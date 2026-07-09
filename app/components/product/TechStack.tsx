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

/**
 * Live grid: title | description | icon at 1fr 1.3fr 1fr (desktop ≥1024px),
 * 1fr 2fr 1fr below; the icon fills its column width like live's
 * `.tech-stack__col-icon img { width: 100% }`.
 */
const ROW_GRID =
  'grid grid-cols-[1fr_2fr_1fr] gap-[30px] py-[25px] lg:grid-cols-[1fr_1.3fr_1fr] lg:gap-5 lg:py-[30px]';

const ROW_TITLE = 'text-base font-bold tracking-[1px] uppercase lg:text-[1.1rem]';

const Feature = ({ feature }: { feature: TechFeature }) => (
  <div className={`${ROW_GRID} items-center`}>
    <h3 className={ROW_TITLE}>{feature.heading}</h3>
    <p className="max-w-[400px] text-base leading-normal">{feature.description}</p>
    <div className="mx-5 flex justify-center">
      <img src={ICONS[feature.icon]} alt="" className="w-full max-w-none" />
    </div>
  </div>
);

const Column = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-start gap-2.5">
    <h4 className={ROW_TITLE}>{label}</h4>
    {children}
  </div>
);

/**
 * "TECH STACK" — dark section matching the live layout: left-aligned heading,
 * bright full-width dividers above and between rows, feature rows as
 * title | description | column-filling icon, and a final MATERIALS / DETAILS /
 * CARE row on the same grid (CARE = two columns of orange-icon instructions).
 * Content from the tech_stack metafield.
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
      <div className="divide-y divide-[#cccccc] border-t border-[#cccccc]">
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
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-[30px]">
              {careColumns.map((column) => (
                <div key={column[0]} className="flex flex-col items-start gap-2">
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
