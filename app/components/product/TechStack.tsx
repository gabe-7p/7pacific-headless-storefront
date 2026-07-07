import effortIcon from '~/assets/effort-percents.svg';
import gripTapeIcon from '~/assets/grip-tape-icon.svg';
import perforationsIcon from '~/assets/perforations-icon.svg';
import { SectionHeader } from '~/components/common/SectionHeader';
import { PdpSection } from '~/components/product/PdpSection';
import type {
  TechFeature,
  TechIcon,
  TechStack as TechStackData,
} from '~/modules/product/lib/content';

const ICONS: Record<TechIcon, string> = {
  perforations: perforationsIcon,
  'grip-tape': gripTapeIcon,
  effort: effortIcon,
};

const Feature = ({ feature }: { feature: TechFeature }) => (
  <div className="grid items-center gap-4 border-t border-white/15 py-8 md:grid-cols-[1fr_auto]">
    <div>
      <h3 className="text-lg font-bold tracking-wide uppercase">{feature.heading}</h3>
      <p className="mt-1 text-sm text-white/70">{feature.description}</p>
    </div>
    <img
      src={ICONS[feature.icon]}
      alt=""
      className="h-8 w-auto justify-self-start md:justify-self-end"
    />
  </div>
);

const Column = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase">{label}</h4>
    <div className="mt-3 space-y-1 text-sm text-white/80">{children}</div>
  </div>
);

/**
 * "TECH STACK" — dark section with per-product feature rows (heading +
 * description + decorative icon) and a MATERIALS / DETAILS / CARE column block.
 * 3-column on desktop/tablet, stacked on mobile. Content from the tech_stack
 * metafield.
 */
export const TechStack = ({ data }: { data: TechStackData }) => (
  <PdpSection>
    <SectionHeader heading="Tech Stack" />
    <div>
      {data.features.map((feature) => (
        <Feature key={feature.heading} feature={feature} />
      ))}
    </div>
    <div className="mt-12 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-3">
      <Column label="Materials">
        {data.materials.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </Column>
      <Column label="Details">
        <p>{data.details}</p>
      </Column>
      <Column label="Care">
        {data.care.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </Column>
    </div>
  </PdpSection>
);
