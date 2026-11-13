import { Cta } from '~/components/common/Cta';
import { TeaserSection } from '~/components/home/TeaserSection';
import { HOME_DROP_TWO } from '~/content/home';

/**
 * The First Light section directly below the Name/Spec banner: section title,
 * the launch tagline (in the slot the pre-launch countdown used), and the two
 * cards, both into the collection grid.
 */
export const DropTwo = () => {
  const { fallGear, liveNow } = HOME_DROP_TWO.cards;

  return (
    <TeaserSection
      heading={HOME_DROP_TWO.heading}
      tagline={HOME_DROP_TWO.tagline}
      cards={[
        {
          content: fallGear,
          cta: (
            <Cta to={fallGear.cta.href} prefetch="intent" size="xs" className="mt-4">
              {fallGear.cta.label}
            </Cta>
          ),
        },
        {
          content: liveNow,
          cta: (
            <Cta to={liveNow.cta.href} prefetch="intent" size="xs" className="mt-4">
              {liveNow.cta.label}
            </Cta>
          ),
        },
      ]}
    />
  );
};
